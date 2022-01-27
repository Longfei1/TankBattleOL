#pragma once
#include "game_server.h"
#include "proto/gamereq.pb.h"
#include "room.h"

using namespace boost::asio;

const int GameServer::frame_interval_ = 1000 / (MAIN_FRAMES_NUM * FRAMES_OF_MAINFRAME_NUM);//向下取整
GameServer::GameServer(int port, int io_threads, int work_threads, std::string hello_data,
    SessionID min_session, SessionID max_session) : WorkServer(port, io_threads, work_threads,
    hello_data, min_session, max_session), startup_time_(0), userid_generator_(1, INT_MAX)
{
}

bool GameServer::Initialize()
{
    auto ret = WorkServer::Initialize();
    if (ret)
    {
        startup_time_ = time(nullptr);

        if (!StartGameFrameService())
        {
            return false;
        }
    }
    return ret;
}

void GameServer::ShutDown()
{
    WorkServer::ShutDown();

    StopGameFrameService();
}

void GameServer::OnRequest(ContextHeadPtr context_head, RequestPtr request)
{
    switch (request->request())
    {
    case GR_USER_LOGIN_IN:
        OnUserLogin(context_head, request);
        break;
    case GR_CREATE_ROOM:
        OnCreateRoom(context_head, request);
        break;
    case GR_JOIN_ROOM:
        OnJoinRoom(context_head, request);
        break;
    case GR_LEAVE_ROOM:
        OnLeaveRoom(context_head, request);
        break;
    case GR_USER_OPERATION:
        OnUserOperation(context_head, request);
        break;
    default:
        WorkServer::OnRequest(context_head, request);
        break;
    }
}

void GameServer::OnSocketConnect(ContextHeadPtr context_head, RequestPtr request)
{
    WorkServer::OnSocketConnect(context_head, request);
}

void GameServer::OnSocketValidated(ContextHeadPtr context_head, RequestPtr request)
{
    WorkServer::OnSocketValidated(context_head, request);
}

void GameServer::OnSocketClose(ContextHeadPtr context_head, RequestPtr request)
{
    WorkServer::OnSocketClose(context_head, request);

    RemoveUser(context_head->session);//移除用户关联
}

void GameServer::OnUserLogin(ContextHeadPtr context_head, RequestPtr request)
{
    gamereq::LoginInReq login;

    if (!request->data().Is<gamereq::LoginInReq>())
    {
        return;
    }

    request->data().UnpackTo(&login);

    gamereq::LoginInRsp ret;
    ret.set_success(true);
    ret.set_userid(login.userid());

    auto logonUid = GetUser(context_head->session);
    SessionID logonSession;
    if (logonUid > 0 && login.userid() != logonUid)//连接已有绑定id
    {
        ret.set_userid(logonUid);
    }
    else if (login.userid() > 0 && GetUserSession(login.userid(), logonSession))//id已被绑定
    {
        ret.set_success(false);
        ret.set_description("该账号已在游戏中，请勿重复登录！");
    }
    else if (login.userid() <= 0 || startup_time_ != login.timestamp())//id无效时，重新生成id下发
    {
        //生成临时用户id
        int id;
        if (GenerateUserID(id))
        {
            ret.set_userid(id);
        }
        else
        {
			ret.set_success(false);
			ret.set_description("用户ID生成失败，请稍后再试！");
            LOG_ERROR("OnUserLogin failed! userid generate failed");
        }
    }

    ret.set_timestamp(startup_time_);

    //更新关联
    if (ret.success())
    {
        AddUser(context_head->session, ret.userid());//session-userid关联
    }

    SendResponse(context_head, request, ret);
}

void GameServer::OnCreateRoom(ContextHeadPtr context_head, RequestPtr request)
{
    gamereq::UserInfo userinfo;

    if (!request->data().Is<gamereq::UserInfo>())
    {
        return;
    }

    request->data().UnpackTo(&userinfo);

    auto userid = userinfo.userid();
    if (GetUser(context_head->session) != userid)
    {
        return;
    }

    gamereq::RoomOperation ope;
    ope.set_success(false);
    auto where = ope.mutable_where();
    where->set_userid(userid);

    auto r = Room::CreateRoom(frame_service_);
    if (r)
    {
        std::lock_guard<std::mutex> lock(r->mtx_);

        auto roomid = r->GetRoomID();
        AddRoom(roomid, r);
        r->SetPlayer(0, userid);

        where->set_roomid(roomid);
        where->set_playerno(0);

        ope.set_success(true);
    }

    SendResponse(context_head, request, ope);
}

void GameServer::OnJoinRoom(ContextHeadPtr context_head, RequestPtr request)
{
    gamereq::RoomPlayerInfo info;

    if (!request->data().Is<gamereq::RoomPlayerInfo>())
    {
        return;
    }

    request->data().UnpackTo(&info);

    auto userid = info.userid();
    if (GetUser(context_head->session) != userid)
    {
        return;
    }

    gamereq::RoomOperation ope;
    ope.set_success(false);
    auto where = ope.mutable_where();
    where->set_userid(userid);

    auto room = GetRoom(info.roomid());
    if (room)
    {
        std::lock_guard<std::mutex> lock(room->mtx_);

        auto player1 = room->GetPlayer(0);
        auto player2 = room->GetPlayer(1);
        if (player1 > 0 && player2 == 0)//房间有房主且存在空位
        {
            room->SetPlayer(1, userid);

            ope.set_success(true);
            where->set_playerno(1);
            where->set_roomid(room->GetRoomID());

            SendResponse(context_head, request, ope);//响应结果

            NotifyPlayer(player1, GR_JOIN_ROOM, ope);//通知房主有玩家加入

            StartGameFrameTimer(room);//开启帧同步

            return;
        }
    }

    SendResponse(context_head, request, ope);
}

void GameServer::OnLeaveRoom(ContextHeadPtr context_head, RequestPtr request)
{
    gamereq::RoomPlayerInfo info;

    if (!request->data().Is<gamereq::RoomPlayerInfo>())
    {
        return;
    }

    request->data().UnpackTo(&info);

    auto userid = info.userid();
    if (GetUser(context_head->session) != userid)
    {
        return;
    }

    gamereq::RoomOperation ope;
    ope.set_success(false);
    auto where = ope.mutable_where();
    *where = info;

    auto room = GetRoom(info.roomid());
    if (room)
    {
        std::lock_guard<std::mutex> lock(room->mtx_);

        auto my_playerno = where->playerno();
        auto player_id = room->GetPlayer(my_playerno);
        if (player_id > 0 && player_id == userid)
        {
            if (my_playerno == 0)//自己是房主
            {
                ope.set_success(true);

                auto other_playerid = room->GetPlayer(1);
                if (other_playerid > 0)
                {
                    //更换房主
                    room->RemovePlayer(1);
                    room->SetPlayer(0, other_playerid);

                    NotifyPlayer(other_playerid, GR_LEAVE_ROOM, ope);//通知其他玩家，房主离开
                }
                else
                {
                    //删除桌子
                    room->ResetRoom();
                    RemoveRoom(room->GetRoomID());
                }

                StopGameFrameTimer(room);
            }
            else if (my_playerno == 1)
            {
                room->RemovePlayer(my_playerno);   
                ope.set_success(true);

                auto other_playerid = room->GetPlayer(0);
                NotifyPlayer(other_playerid, GR_LEAVE_ROOM, ope);//通知房主有人离开

                StopGameFrameTimer(room);
            }
        }
    }

    SendResponse(context_head, request, ope);
}

void GameServer::OnUserOperation(ContextHeadPtr context_head, RequestPtr request)
{
    gamereq::UserOperation ope;

    if (!request->data().Is<gamereq::UserOperation>())
    {
        return;
    }

    request->data().UnpackTo(&ope);

    auto roomid = ope.where();
    auto room = GetRoom(ope.where().roomid());
    if (room)
    {
        std::lock_guard<std::mutex> lock(room->mtx_);

        auto uid = room->GetPlayer(ope.where().playerno());
        if (uid > 0 && uid == ope.where().userid())
        {
            room->user_opes_.push_back(ope);
        }
    }

    //暂时设计为不回应结果
}

bool GameServer::GetUserSession(int user_id, SessionID& session)
{
    std::lock_guard<std::mutex> lock(users_mtx_);
    for (auto it : users_)
    {
        if (it.second == user_id)
        {
            session = it.first;
            return true;
        }
    }
    return false;
}

bool GameServer::StartGameFrameService()
{
    frame_work_ = std::make_shared<io_service::work>(frame_service_);//添加永久任务

    for (int i = 0; i < GAMEFRAME_THREAD_NUM; i++)
    {
        frame_threads_.emplace_back([this]()
            {
                frame_service_.run();
            });
    }

    return true;
}

bool GameServer::StopGameFrameService()
{
    frame_work_ = nullptr;
    frame_service_.stop();//停止服务
    for (auto& th : frame_threads_)
    {
        th.join();//等待线程结束
    }
    frame_threads_.clear();
    return true;
}

void GameServer::OnGameFrame(RoomPtr room)
{
    if (room)
    {
        std::lock_guard<std::mutex> lock(room->mtx_);

        gamereq::GameFrame current_frame;
        current_frame.set_frame(room->GetFrameNO());

        //存储当前帧所有玩家操作
        for (auto& o : room->user_opes_)
        {
            auto ope = current_frame.add_useropes();
            *ope = std::move(o);
        }
        room->user_opes_.clear();
        room->game_frames_.push_back(std::move(current_frame));

        //下发关键帧
        if (room->game_frames_.size() >= FRAMES_OF_MAINFRAME_NUM)
        {
            gamereq::MainGameFrame main_frame;
            for (int i = 0; i < FRAMES_OF_MAINFRAME_NUM; i++)
            {
                auto frame = main_frame.add_frames();
                *frame = std::move(room->game_frames_[i]);
            }

            room->game_frames_.clear();

            NotifyRoomPlayer(room, GR_GAME_FRAME, main_frame);
        }

        room->NextFrameNO();
        //开启下一帧定时器
        {
            auto room_weakptr = std::weak_ptr<Room>(room);

            room->frame_timer_.expires_from_now(boost::posix_time::millisec(frame_interval_));
            room->frame_timer_.async_wait([this, room_weakptr](boost::system::error_code error)
                {
                    auto r = room_weakptr.lock();
                    if (r)
                    {
                        if (!error)
                        {
                            OnGameFrame(r);
                        }
                        else
                        {
                            LOG_ERROR("OnGameFrame timer error, roomid(%d)", r->GetRoomID());
                        }
                    }
                });
        }
    }
}

void GameServer::StartGameFrameTimer(RoomPtr room)
{
    if (room)
    {
        std::lock_guard<std::mutex> lock(room->mtx_);

        auto room_weakptr = std::weak_ptr<Room>(room);

        room->frame_timer_.expires_from_now(boost::posix_time::millisec(frame_interval_));
        room->frame_timer_.async_wait([this, room_weakptr](boost::system::error_code error)
            {
                if (!error)
                {
                    auto r = room_weakptr.lock();
                    if (r)
                    {
                        if (!error)
                        {
                            OnGameFrame(r);
                        }
                        else
                        {
                            LOG_ERROR("StartGameFrameTimer error, roomid(%d)", r->GetRoomID());
                        }
                    }
                }
            });
    }
}

void GameServer::StopGameFrameTimer(RoomPtr room)
{
    if (room)
    {
        std::lock_guard<std::mutex> lock(room->mtx_);
        room->frame_timer_.cancel();

        room->ResetGameFrameInfo();
    } 
}