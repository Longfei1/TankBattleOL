#pragma once
#include "work_server/work_server.h"

#include "common/utils/utils.h"

#include "game_def.h"
#include "game_req.h"

class Room;
class GameServer : public WorkServer
{
public: 
    using RoomPtr = std::shared_ptr<Room>;

public:
    GameServer(int port = SOCK_DEFAULT_PORT, int io_threads = SOCK_IO_THREAD_NUM,
        int work_threads = SOCK_WORK_THREAD_NUM, std::string hello_data = SOCK_HELLO_DATA,
        SessionID min_session = 1, SessionID max_session = SESSION_MAX_ID);

    virtual bool Initialize() override;
    virtual void ShutDown() override;

    template <typename T>
    void NotifyPlayer(uint user_id, google::protobuf::uint32 request_id, const T& proto_data);

	void SendFailedResponse(ContextHeadPtr context_head, RequestPtr request, const std::string& msg);

protected:
    virtual void OnRequest(ContextHeadPtr context_head, RequestPtr request) override;
    virtual void OnSocketConnect(ContextHeadPtr context_head, RequestPtr request) override;
    virtual void OnSocketValidated(ContextHeadPtr context_head, RequestPtr request) override;
    virtual void OnSocketClose(ContextHeadPtr context_head, RequestPtr request) override;

    void OnUserLogin(ContextHeadPtr context_head, RequestPtr request);//登录连接
    void OnCreateRoom(ContextHeadPtr context_head, RequestPtr request);//创建房间
    void OnJoinRoom(ContextHeadPtr context_head, RequestPtr request);//加入房间
    void OnLeaveRoom(ContextHeadPtr context_head, RequestPtr request);//离开房间
    void OnRoomReady(ContextHeadPtr context_head, RequestPtr request);//房间准备
    void OnRoomUnReady(ContextHeadPtr context_head, RequestPtr request);//房间取消准备
    void OnRoomStart(ContextHeadPtr context_head, RequestPtr request);//房间开始
    void OnMenuSwitch(ContextHeadPtr context_head, RequestPtr request);//菜单切换
    void OnMenuChoose(ContextHeadPtr context_head, RequestPtr request);//菜单选择
    void OnMenuBack(ContextHeadPtr context_head, RequestPtr request);//菜单返回
    void OnGameMapEditFinished(ContextHeadPtr context_head, RequestPtr request);//地图编辑完成
    void OnGameFrame(ContextHeadPtr context_head, RequestPtr request);//游戏帧
    void OnGameEnd(ContextHeadPtr context_head, RequestPtr request);//游戏结束

    bool GenerateUserID(uint &user_id);

    //session-user
    void AddUser(SessionID session, uint user_id);
    uint GetUser(SessionID session);
    void RemoveUser(SessionID session);
    bool GetUserSession(uint user_id, SessionID& session);

    //room
    void AddRoom(uint room_id, RoomPtr roomptr);
    RoomPtr GetRoom(uint room_id);
    void RemoveRoom(uint room_id);
    RoomPtr GetUserRoom(uint user_id);

    bool StartGameFrameService();
    bool StopGameFrameService();

    void LeaveRoom(RoomPtr room, uint playerno, ContextHeadPtr context_head, RequestPtr request);
private:
    time_t startup_time_;//服务启动时间

    std::mutex userid_gernerator_mtx_;
    myutils::IDGenerator<uint> userid_generator_;//userid生成器

    std::mutex users_mtx_;
    std::unordered_map<SessionID, uint> users_;//<session, userid>

    std::mutex rooms_mtx_;
    std::unordered_map<uint, RoomPtr> rooms_;

    std::vector<std::thread> frame_threads_;//逻辑帧处理线程
    boost::asio::io_service frame_service_;//逻辑帧处理服务
    std::shared_ptr<boost::asio::io_service::work> frame_work_;//控制逻辑帧线程不退出
};

template <typename T>
void GameServer::NotifyPlayer(uint user_id, google::protobuf::uint32 request_id, const T& proto_data)
{
    SessionID session;
    if (GetUserSession(user_id, session))
    {
        ContextHeadPtr context = std::make_shared<ContextHead>();
        context->session = session;

        SendNotify(context, request_id, proto_data);
    }
}

inline bool GameServer::GenerateUserID(uint& user_id)
{
    std::lock_guard<std::mutex> lock(userid_gernerator_mtx_);
    auto id = userid_generator_.GenerateOneID();
    if (userid_generator_.IsValidID(id))
    {
        user_id = id;
        return true;
    }
    return false;
}


inline void GameServer::AddUser(SessionID session, uint user_id)
{
    std::lock_guard<std::mutex> lock(users_mtx_);
    users_[session] = user_id;
}

inline uint GameServer::GetUser(SessionID session)
{
    std::lock_guard<std::mutex> lock(users_mtx_);
    if (users_.find(session) != users_.end())
    {
        return users_[session];
    }
    return 0;
}

inline void GameServer::RemoveUser(SessionID session)
{
    std::lock_guard<std::mutex> lock(users_mtx_);
    users_.erase(session);
}

inline void GameServer::AddRoom(uint room_id, RoomPtr roomptr)
{
    std::lock_guard<std::mutex> lock(rooms_mtx_);
    rooms_[room_id] = roomptr;
}

inline GameServer::RoomPtr GameServer::GetRoom(uint room_id)
{
    std::lock_guard<std::mutex> lock(rooms_mtx_);
    if (rooms_.find(room_id) != rooms_.end())
    {
        return rooms_[room_id];
    }
    return nullptr;
}

inline void GameServer::RemoveRoom(uint room_id)
{
    std::lock_guard<std::mutex> lock(rooms_mtx_);
    rooms_.erase(room_id);
}
