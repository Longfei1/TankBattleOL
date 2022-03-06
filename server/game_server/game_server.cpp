#pragma once
#include "game_server.h"
#include "proto/gamereq.pb.h"
#include "room.h"

using namespace boost::asio;

GameServer::GameServer(int port, int io_threads, int work_threads, std::string hello_data,
    SessionID min_session, SessionID max_session) : WorkServer(port, io_threads, work_threads,
    hello_data, min_session, max_session), startup_time_(0), userid_generator_(1, UINT_MAX)
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

	//清理room
	{
		std::lock_guard<std::mutex> lock(rooms_mtx_);
		for (auto& r : rooms_)
		{
			r.second->ResetRoom();
		}
		rooms_.clear();
	}

    StopGameFrameService();
}

void GameServer::SendFailedResponse(ContextHeadPtr context_head, RequestPtr request, const std::string& msg)
{
    gamereq::ErrorInfo error;
    request->set_request(UR_OPERATE_FAILED);
    error.set_description(msg);

    SendResponse(context_head, request, error);
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
    case GR_ROOM_READY:
		OnRoomReady(context_head, request);
        break;
    case GR_ROOM_UNREADY:
		OnRoomUnReady(context_head, request);
        break;
    case GR_ROOM_START:
		OnRoomStart(context_head, request);
        break;
	case GR_MENU_SWITCH:
		OnMenuSwitch(context_head, request);
		break;
    case GR_MENU_CHOOSE:
		OnMenuChoose(context_head, request);
        break;
    case GR_MENU_BACK:
		OnMenuBack(context_head, request);
        break;
	case GR_GAME_MAP_EDIT_FINISHED:
		OnGameMapEditFinished(context_head, request);
		break;
    case GR_GAME_FRAME:
        OnGameFrame(context_head, request);
        break;
	case GR_GAME_END:
		OnGameEnd(context_head, request);
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

	auto userid = GetUser(context_head->session);
	auto room = GetUserRoom(userid);
	if (room)
	{
		std::lock_guard<std::mutex> lock(room->mtx_);

		if (room->GetRoomStatus() == ROOM_STATUS_GAME && room->GetSupportDxxw())
		{
			//所有玩家都断线，暂停逻辑帧运算和发送
			bool online = false;
			for (int i = 0; i < TOTAL_PLAYER; i++)
			{
				auto player = room->GetPlayerInfoByNO(i);
				SessionID session;
				if (player && player->user_id != userid && GetUserSession(player->user_id, session))
				{
					online = true;
					break;
				}
			}

			if (!online)
			{
				room->SetGameFramePause(true);
			}
		}
		else
		{
			//不在游戏状态或不支持断线续玩的话，断开连接就离开房间
			auto my_player = room->GetPlayerInfoByID(userid);
			LeaveRoom(room, my_player->number, nullptr, nullptr);
		}
	}

    RemoveUser(context_head->session);//移除用户关联
}

GameServer::RoomPtr GameServer::GetUserRoom(uint user_id)
{
    std::lock_guard<std::mutex> lock(rooms_mtx_);
    for (auto it : rooms_)
    {
        auto r = it.second;
        std::lock_guard<std::mutex> tmp(r->mtx_);
        if (r->GetPlayerInfoByID(user_id))
        {
            return r;
        }
    }
    return nullptr;
}

void GameServer::OnUserLogin(ContextHeadPtr context_head, RequestPtr request)
{
    gamereq::LoginIn login;

    if (!request->data().Is<gamereq::LoginIn>())
    {
        return;
    }

    request->data().UnpackTo(&login);

    request->set_request(UR_OPERATE_SUCCESS);

	gamereq::LoginInRsp login_rsp;
	login_rsp.set_userid(login.userid());

    auto logonUid = GetUser(context_head->session);
    SessionID logonSession;
    if (logonUid > 0 && login.userid() != logonUid)//连接已有绑定id
    {
		login_rsp.set_userid(logonUid);
    }
    else if (login.userid() <= 0 || startup_time_ != login.timestamp())//id无效时，重新生成id下发
    {
        //生成临时用户id
        uint id;
        if (GenerateUserID(id))
        {
			login_rsp.set_userid(id);
        }
        else
        {
            LOG_ERROR("OnUserLogin failed! userid generate failed");
            SendFailedResponse(context_head, request, "用户ID生成失败，请稍后再试！");
            return;
        }
    }
	else if (login.userid() > 0 && GetUserSession(login.userid(), logonSession))//id已被绑定
	{
        SendFailedResponse(context_head, request, "该账号已在游戏中，请勿重复登录！");
        return;
	}

	login_rsp.set_timestamp(startup_time_);

	//更新关联
	AddUser(context_head->session, login_rsp.userid());//session-userid关联

	auto room = GetUserRoom(login_rsp.userid());
	if (room)
	{
		std::lock_guard<std::mutex> lock(room->mtx_);

		auto status = room->GetRoomStatus();
		login_rsp.set_roomid(room->GetRoomID());
		login_rsp.set_roomstatus(status);
		login_rsp.set_menuindex(room->GetMenuIndex());

		for (int i = 0; i < TOTAL_PLAYER; i++)
		{
			auto p = login_rsp.add_players();
			auto player = room->GetPlayerInfoByNO(i);
			p->set_playerno(i);
			if (player)
			{
				p->set_userid(player->user_id);
				p->set_ready(player->ready);
			}
		}

		if (status == ROOM_STATUS_GAME)
		{
			login_rsp.set_gamemode(room->GetGameMode());
			login_rsp.set_randomseed(room->GetRandomSeed());

			auto& ope_record = room->GetFrameOpeRecord();
			for (uint i = login.syncframe(); i < ope_record.size(); i++)
			{
				auto frame = login_rsp.add_framerecord();
				frame->set_frame(i);
				for (int j = 0; j < ope_record[i].size(); j++)
				{
					if (ope_record[i][j] != UINT_MAX)
					{
						auto userope = frame->add_useropes();
						userope->set_playerno(j);
						userope->set_opecode(ope_record[i][j]);
					}
				}
			}

			room->SetGameFramePause(false);
		}

		SendResponse(context_head, request, login_rsp);//在房间互斥量范围内发送响应，避免出去房间会在发响应前发送帧消息。
		return;
	}

    SendResponse(context_head, request, login_rsp);
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

    request->set_request(UR_OPERATE_SUCCESS);

	auto old_room = GetUserRoom(userid);
	if (old_room)
	{
		SendFailedResponse(context_head, request, "你当前已在一个房间内，不能再创建新的房间！");
		return;
	}

	auto r = Room::CreateRoom(frame_service_, this);
	if (!r)
	{
		SendFailedResponse(context_head, request, "创建新的房间失败！");
		return;
	}

	std::lock_guard<std::mutex> lock(r->mtx_);

	auto roomid = r->GetRoomID();
	AddRoom(roomid, r);
	r->SetRoomStatus(ROOM_STATUS_READY);

	PlayerInfo info{};
	info.number = 0;
	info.user_id = userid;
	r->SetPlayer(info);

    gamereq::RoomPlayerInfo ret;
    ret.set_roomid(roomid);
    ret.set_playerno(0);
    ret.set_userid(userid);

    SendResponse(context_head, request, ret);
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

	request->set_request(UR_OPERATE_SUCCESS);

	auto old_room = GetUserRoom(userid);
	if (old_room)
	{
		if (old_room->GetRoomID() != info.roomid())
		{
			SendFailedResponse(context_head, request, "你当前已在一个房间内，不能再加入新的房间！");
			return;
		}
		else
		{
			SendFailedResponse(context_head, request, "你当前已在该房间内！");
			return;
		}
	}

	auto room = GetRoom(info.roomid());
    if (!room)
    {
		SendFailedResponse(context_head, request, "该房间不存在！");
		return;
    }

	std::lock_guard<std::mutex> lock(room->mtx_);

	auto player1 = room->GetPlayerInfoByNO(0);
	if (!player1)
	{
		SendFailedResponse(context_head, request, "该房间内暂无玩家！");
		return;
	}
		
	{
		//查找空位置
		bool have_place = false;
		uint empty_no = UINT_MAX;
		for (uint i = 1; i < TOTAL_PLAYER; i++)
		{
			if (!room->GetPlayerInfoByNO(i))
			{
				empty_no = i;
				have_place = true;
				break;
			}
		}

		if (!have_place)
		{
			SendFailedResponse(context_head, request, "该房间内暂无空位！");
			return;
		}

		PlayerInfo player_info{};
		player_info.number = empty_no;
		player_info.user_id = userid;
		room->SetPlayer(player_info);

		info.set_playerno(empty_no);

		SendResponse(context_head, request, info);//响应结果

		room->NotifyRoomPlayer(GR_JOIN_ROOM, info, userid);//通知有玩家加入

		//通知该玩家其他玩家的信息
		for (uint i = 0; i < TOTAL_PLAYER; i++)
		{
			if (i == empty_no) {
				continue;
			}
			auto p = room->GetPlayerInfoByNO(i);
			if (p)
			{
				gamereq::RoomPlayerInfo otherPlayer;
				otherPlayer.set_roomid(room->GetRoomID());
				otherPlayer.set_userid(p->user_id);
				otherPlayer.set_playerno(p->number);

				NotifyPlayer(userid, GR_PLAYER_INFO, otherPlayer);
			}
		}
	}
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

	request->set_request(UR_OPERATE_SUCCESS);

    auto room = GetRoom(info.roomid());
    if (!room)
    {
		SendFailedResponse(context_head, request, "离开失败，房间不存在！");
		return;
    }

	{
		std::lock_guard<std::mutex> lock(room->mtx_);

		auto my_player = room->GetPlayerInfoByNO(info.playerno());
		if (!my_player || my_player->user_id != userid)
		{
			SendFailedResponse(context_head, request, "离开失败，房间位置信息不一致！");
			return;
		}

		LeaveRoom(room, info.playerno(), context_head, request);
	}
}

void GameServer::OnRoomReady(ContextHeadPtr context_head, RequestPtr request)
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

	request->set_request(UR_OPERATE_SUCCESS);

	auto room = GetRoom(info.roomid());
	if (!room)
	{
		SendFailedResponse(context_head, request, "准备失败，房间不存在！");
		return;
	}

	std::lock_guard<std::mutex> lock(room->mtx_);

	auto player = room->GetPlayerInfoByNO(info.playerno());
	if (!player || player->user_id != userid)
	{
		SendFailedResponse(context_head, request, "准备失败，房间位置信息不一致！");
		return;
	}

	if (room->GetRoomStatus() != ROOM_STATUS_READY)
	{
		SendFailedResponse(context_head, request, "准备失败，当前不是准备阶段！");
		return;
	}

	if (info.playerno() == 0)
	{
		SendFailedResponse(context_head, request, "准备失败，房主不需要准备！");
		return;
	}

	if (player->ready)
	{
		SendFailedResponse(context_head, request, "准备失败，你已是准备状态！");
		return;
	}

	player->ready = true;

    SendResponse(context_head, request, info);

	room->NotifyRoomPlayer(GR_ROOM_READY, info, userid);
}

void GameServer::OnRoomUnReady(ContextHeadPtr context_head, RequestPtr request)
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

    request->set_request(UR_OPERATE_SUCCESS);

	auto room = GetRoom(info.roomid());
	if (!room)
	{
		SendFailedResponse(context_head, request, "取消准备失败，房间不存在！");
		return;
	}

	std::lock_guard<std::mutex> lock(room->mtx_);

	auto player = room->GetPlayerInfoByNO(info.playerno());
	if (!player || player->user_id != userid)
	{
		SendFailedResponse(context_head, request, "取消准备失败，房间位置信息不一致！");
		return;
	}

	if (room->GetRoomStatus() != ROOM_STATUS_READY)
	{
		SendFailedResponse(context_head, request, "取消准备失败，当前不是准备阶段！");
		return;
	}

	if (info.playerno() == 0)
	{
		SendFailedResponse(context_head, request, "取消准备失败，房主不需要准备！");
		return;
	}

	if (!player->ready)
	{
		SendFailedResponse(context_head, request, "取消准备失败，你已是未准备状态！");
		return;
	}

	player->ready = false;

	SendResponse(context_head, request, info);

	room->NotifyRoomPlayer(GR_ROOM_UNREADY, info, userid);
}

void GameServer::OnRoomStart(ContextHeadPtr context_head, RequestPtr request)
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

    request->set_request(UR_OPERATE_SUCCESS);

	auto room = GetRoom(info.roomid());
	if (!room)
	{
		SendFailedResponse(context_head, request, "开始游戏失败，房间不存在！");
		return;
	}

	std::lock_guard<std::mutex> lock(room->mtx_);

	auto player = room->GetPlayerInfoByNO(info.playerno());
	if (!player || player->user_id != userid)
	{
		SendFailedResponse(context_head, request, "开始游戏失败，房间位置信息不一致！");
		return;
	}

	if (room->GetRoomStatus() != ROOM_STATUS_READY)
	{
		SendFailedResponse(context_head, request, "开始游戏失败，当前不是准备阶段！");
		return;
	}

    if (info.playerno() != 0)
    {
		SendFailedResponse(context_head, request, "开始游戏失败，你不是房主，不能开始游戏！");
		return;
    }

    uint ready_count = 0;
    uint player_count = 1;
    for (uint i = 1; i < TOTAL_PLAYER; i++)
    {
        auto p = room->GetPlayerInfoByNO(i);
        if (p)
        {
            player_count++;
            if (p->ready)
            {
                ready_count++;
            }
        }
    }

    if (player_count == 1)//只有房主一人，不能开始游戏
    {
		SendFailedResponse(context_head, request, "开始游戏失败，游戏人数不足！");
		return;
    }

	if (player_count - 1 != ready_count)
	{
		SendFailedResponse(context_head, request, "开始游戏失败，还有玩家未准备！");
		return;
	}

	player->ready = true;
    room->SetRoomStatus(ROOM_STATUS_START);
	room->SetMenuIndex(MENU_INDEX_START_GAME);

	SendResponse(context_head, request, info);

	room->NotifyRoomPlayer(GR_ROOM_START, info, userid);
}

void GameServer::OnMenuSwitch(ContextHeadPtr context_head, RequestPtr request)
{
	gamereq::MenuSwitchInfo info;

	if (!request->data().Is<gamereq::MenuSwitchInfo>())
	{
		return;
	}

	request->data().UnpackTo(&info);

	auto userid = info.where().userid();
	if (GetUser(context_head->session) != userid)
	{
		return;
	}

    request->set_request(UR_OPERATE_SUCCESS);

	auto room = GetRoom(info.where().roomid());
	if (!room)
	{
		SendFailedResponse(context_head, request, "菜单选项切换失败，房间不存在！");
		return;
	}

	std::lock_guard<std::mutex> lock(room->mtx_);

	auto player = room->GetPlayerInfoByNO(info.where().playerno());
	if (!player || player->user_id != userid)
	{
		SendFailedResponse(context_head, request, "菜单选项切换失败，房间位置信息不一致！");
		return;
	}

	if (room->GetRoomStatus() != ROOM_STATUS_START)
	{
		SendFailedResponse(context_head, request, "菜单选项切换失败，当前不是开始阶段！");
		return;
	}

	if (info.where().playerno() != 0)
	{
		SendFailedResponse(context_head, request, "菜单选项切换失败，你不是房主，不能选择菜单！");
		return;
	}

	if (info.index() != MENU_INDEX_START_GAME && info.index() != MENU_INDEX_MAP_EDIT)
	{
		SendFailedResponse(context_head, request, "菜单选项切换失败，菜单选项无效！");
		return;
	}

	room->SetMenuIndex(info.index());

	SendResponse(context_head, request, info);

	room->NotifyRoomPlayer(GR_MENU_SWITCH, info, userid);
}

void GameServer::OnMenuChoose(ContextHeadPtr context_head, RequestPtr request)
{
	gamereq::MenuChooseInfo info;

	if (!request->data().Is<gamereq::MenuChooseInfo>())
	{
		return;
	}

	request->data().UnpackTo(&info);

	auto userid = info.where().userid();
	if (GetUser(context_head->session) != userid)
	{
		return;
	}

	request->set_request(UR_OPERATE_SUCCESS);

	auto room = GetRoom(info.where().roomid());
	if (!room)
	{
		SendFailedResponse(context_head, request, "菜单选择失败，房间不存在！");
		return;
	}

	std::lock_guard<std::mutex> lock(room->mtx_);

	auto player = room->GetPlayerInfoByNO(info.where().playerno());
	if (!player || player->user_id != userid)
	{
		SendFailedResponse(context_head, request, "菜单选择失败，房间位置信息不一致！");
		return;
	}

	if (room->GetRoomStatus() != ROOM_STATUS_START)
	{
		SendFailedResponse(context_head, request, "菜单选择失败，当前不是开始阶段！");
		return;
	}

	if (info.where().playerno() != 0)
	{
		SendFailedResponse(context_head, request, "菜单选择失败，你不是房主，不能选择菜单！");
		return;
	}

	if (info.index() != MENU_INDEX_START_GAME && info.index() != MENU_INDEX_MAP_EDIT)
	{
		SendFailedResponse(context_head, request, "菜单选择失败，菜单选项无效！");
		return;
	}

	SendResponse(context_head, request, info);

	room->NotifyRoomPlayer(GR_MENU_CHOOSE, info, userid);

	switch (info.index())
	{
	case MENU_INDEX_START_GAME:
		{
			room->SetRoomStatus(ROOM_STATUS_GAME);
			room->SetGameMode(GAME_MODE_COMMON);
			gamereq::GameStartRsp ret;
			ret.set_mode(GAME_MODE_COMMON);
			auto where = ret.mutable_where();
			*where = info.where();

			auto t = time(nullptr);
			room->SetRandomSeed(t);
			ret.set_randomseed(t);

			room->SetSupportDxxw(true);

			room->StartGameFrameTimer(t);
			room->NotifyRoomPlayer(GR_GAME_START, ret);
		}
		break;
	case MENU_INDEX_MAP_EDIT:
		{
			room->SetRoomStatus(ROOM_STATUS_GAME);
			room->SetGameMode(GAME_MODE_MAP_EDIT);
			gamereq::GameStartRsp ret;
			ret.set_mode(GAME_MODE_MAP_EDIT);
			auto where = ret.mutable_where();
			*where = info.where();

			auto t = time(nullptr);
			room->SetRandomSeed(t);
			ret.set_randomseed(t);

			room->SetSupportDxxw(false);

			room->StartGameFrameTimer(t);
			room->NotifyRoomPlayer(GR_GAME_START, ret);
		}
		break;
	default:
		break;
	}
}

void GameServer::OnMenuBack(ContextHeadPtr context_head, RequestPtr request)
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

	request->set_request(UR_OPERATE_SUCCESS);

	auto room = GetRoom(info.roomid());
	if (!room)
	{
		SendFailedResponse(context_head, request, "菜单返回失败，房间不存在！");
		return;
	}

	std::lock_guard<std::mutex> lock(room->mtx_);

	auto player = room->GetPlayerInfoByNO(info.playerno());
	if (!player || player->user_id != userid)
	{
		SendFailedResponse(context_head, request, "菜单返回失败，房间位置信息不一致！");
		return;
	}

	if (room->GetRoomStatus() != ROOM_STATUS_START)
	{
		SendFailedResponse(context_head, request, "菜单返回失败，当前不是开始阶段！");
		return;
	}

	if (info.playerno() != 0)
	{
		SendFailedResponse(context_head, request, "菜单返回失败，你不是房主，不能选择菜单！");
		return;
	}

	auto status = room->GetRoomStatus();
	if (status != ROOM_STATUS_GAME && status != ROOM_STATUS_START)
	{
		SendFailedResponse(context_head, request, "菜单返回失败，没有上一级菜单！");
		return;
	}

	room->SetRoomStatus(ROOM_STATUS_READY);
	room->SetMenuIndex(0);
	for (uint i = 0; i < TOTAL_PLAYER; i++)
	{
		auto p = room->GetPlayerInfoByNO(i);
		if (p)
		{
			p->ready = false;
		}
	}

	SendResponse(context_head, request, info);

	room->NotifyRoomPlayer(GR_MENU_BACK, info, userid);
}

void GameServer::OnGameMapEditFinished(ContextHeadPtr context_head, RequestPtr request)
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

	request->set_request(UR_OPERATE_SUCCESS);

	auto room = GetRoom(info.roomid());
	if (!room)
	{
		SendFailedResponse(context_head, request, "开始游戏失败，房间不存在！");
		return;
	}

	std::lock_guard<std::mutex> lock(room->mtx_);

	auto player = room->GetPlayerInfoByNO(info.playerno());
	if (!player || player->user_id != userid)
	{
		SendFailedResponse(context_head, request, "开始游戏失败，房间位置信息不一致！");
		return;
	}

	if (info.playerno() != 0)
	{
		SendFailedResponse(context_head, request, "开始游戏失败，你不是房主！");
		return;
	}

	if (room->GetRoomStatus() != ROOM_STATUS_GAME || room->GetGameMode() != GAME_MODE_MAP_EDIT)
	{
		SendFailedResponse(context_head, request, "开始游戏失败，游戏状态不一致！");
		return;
	}

	//开始游戏
	room->StopGameFrameTimer();
	room->SetGameMode(GAME_MODE_COMMON);

	gamereq::GameStartRsp ret;
	ret.set_mode(GAME_MODE_COMMON);
	auto where = ret.mutable_where();
	*where = info;

	auto t = time(nullptr);
	room->SetRandomSeed(t);
	ret.set_randomseed(t);

	room->StartGameFrameTimer(t);
	room->NotifyRoomPlayer(GR_GAME_START, ret);
}

void GameServer::OnGameFrame(ContextHeadPtr context_head, RequestPtr request)
{
    gamereq::GameFrameReq req;

    if (!request->data().Is<gamereq::GameFrameReq>())
    {
        return;
    }

    request->data().UnpackTo(&req);

	auto userid = req.userid();
	if (GetUser(context_head->session) != userid)
	{
		return;
	}

	auto room = GetRoom(req.roomid());
	if (!room)
	{
		return;
	}

	std::lock_guard<std::mutex> lock(room->mtx_);

	auto player = room->GetPlayerInfoByNO(req.userope().playerno());
	if (!player || player->user_id != req.userid())
	{
		return;
	}

	if (room->GetRoomStatus() != ROOM_STATUS_GAME)
	{
		return;
	}

	if (room->GetFrameNO() >= req.frame())//上传操作的帧序号小于服务器的
	{
		room->SetPlayerOpeCode(req.userope().playerno(), req.userope().opecode());//更新操作码
	}
    //暂时设计为不回应结果
}

void GameServer::OnGameEnd(ContextHeadPtr context_head, RequestPtr request)
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

	request->set_request(UR_OPERATE_SUCCESS);

	auto room = GetRoom(info.roomid());
	if (!room)
	{
		SendFailedResponse(context_head, request, "结束游戏失败，房间不存在！");
		return;
	}

	std::lock_guard<std::mutex> lock(room->mtx_);

	auto player = room->GetPlayerInfoByNO(info.playerno());
	if (!player || player->user_id != userid)
	{
		SendFailedResponse(context_head, request, "结束游戏失败，房间位置信息不一致！");
		return;
	}

	if (room->GetRoomStatus() == ROOM_STATUS_GAME)
	{
		//重置准备状态
		for (int i = 0; i < TOTAL_PLAYER; i++)
		{
			auto p = room->GetPlayerInfoByNO(i);
			if (p)
			{
				p->ready = false;
			}
		}

		//回到房间准备阶段
		room->SetRoomStatus(ROOM_STATUS_READY);
		room->SetGameMode(0);
		room->SetMenuIndex(0);
		room->StopGameFrameTimer();

		room->NotifyRoomPlayer(GR_GAME_END, info);

		//处理离线
		for (int i = 0; i < TOTAL_PLAYER; i++)
		{
			auto p = room->GetPlayerInfoByNO(i);
			SessionID session;
			if (p && p->user_id != userid && !GetUserSession(p->user_id, session))//玩家离线
			{
				LeaveRoom(room, p->number, nullptr, nullptr);
			}
		}
	}
}

bool GameServer::GetUserSession(uint user_id, SessionID& session)
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
    //frame_service_.stop();//停止服务
    for (auto& th : frame_threads_)
    {
        th.join();//等待线程结束
    }
    frame_threads_.clear();
    return true;
}

//离开房间处理（不要加锁）
void GameServer::LeaveRoom(RoomPtr room, uint playerno, ContextHeadPtr context_head, RequestPtr request)
{
	bool remove_room = false;

	auto player = room->GetPlayerInfoByNO(playerno);
	gamereq::RoomPlayerInfo info;
	info.set_playerno(playerno);
	info.set_userid(player->user_id);
	info.set_roomid(room->GetRoomID());

	if (playerno == 0)//房主
	{
		//查找其他玩家位置
		bool have_other = false;
		uint other_no = UINT_MAX;
		for (uint i = 1; i < TOTAL_PLAYER; i++)
		{
			if (room->GetPlayerInfoByNO(i))
			{
				other_no = i;
				have_other = true;
				break;
			}
		}

		if (have_other)//存在其他玩家
		{
			auto other_player = room->GetPlayerInfoByNO(other_no);
			auto other_playerid = other_player->user_id;

			//更换房主（房主固定为0号位）
			other_player->number = 0;
			other_player->ready = false;
			room->SetPlayer(*other_player);
			room->RemovePlayer(other_no);

			if (context_head && request)
			{
				SendResponse(context_head, request, info);
			}
			room->NotifyRoomPlayer(GR_LEAVE_ROOM, info, info.userid());//通知其他玩家，房主离开

			//新房主信息
			gamereq::RoomPlayerInfo host_change_info;
			host_change_info.set_roomid(room->GetRoomID());
			host_change_info.set_playerno(other_no);
			host_change_info.set_userid(other_playerid);
			room->NotifyRoomPlayer(GR_ROOM_HOST_CHANGE, host_change_info, info.userid());
		}
		else
		{
			remove_room = true;

			//删除房间
			if (context_head && request)
			{
				SendResponse(context_head, request, info);
			}
		}
	}
	else
	{
		room->RemovePlayer(playerno);

		auto host = room->GetPlayerInfoByNO(0);
		if (host) {
			host->ready = false;
		}

		if (context_head && request)
		{
			SendResponse(context_head, request, info);
		}

		room->NotifyRoomPlayer(GR_LEAVE_ROOM, info, info.userid());//通知有人离开
	}

	//所有玩家都断线，解散房间
	bool online = false;
	for (int i = 0; i < TOTAL_PLAYER; i++)
	{
		auto p = room->GetPlayerInfoByNO(i);
		SessionID session;
		if (p && GetUserSession(p->user_id, session))
		{
			online = true;
			break;
		}
	}

	if (remove_room || !online)
	{
		RemoveRoom(room->GetRoomID());
		room->ResetRoom();
	}
	else
	{
		room->SetRoomStatus(ROOM_STATUS_READY);
		room->SetGameMode(0);
		room->SetMenuIndex(0);
		room->StopGameFrameTimer();
	}
}