#pragma once

#include "base_library.h"
#include "common/define/socket_def.h"
#include "common/log/log.h"

#include "work_def.h"
#include "work_req.h"

#include "boost/asio/deadline_timer.hpp"

using namespace basereq;

class AsioSockServer;
class WorkServer : public boost::noncopyable, public ISocketHandler
{
public:
    struct ContextHead
    {
        SessionID session;//连接session
    };

    using SocketServerPtr = std::shared_ptr<AsioSockServer>;
    using WorkContent = std::function<void()>;
    using ContextHeadPtr = std::shared_ptr<ContextHead>;
    using RequestPtr = std::shared_ptr<Request>;
public:
    WorkServer(int port = SOCK_DEFAULT_PORT, int io_threads = SOCK_IO_THREAD_NUM, 
        int work_threads = SOCK_WORK_THREAD_NUM, std::string hello_data = SOCK_HELLO_DATA,
        SessionID min_session = 1, SessionID max_session = SESSION_MAX_ID);
    virtual ~WorkServer() {}

    virtual bool Initialize();
    virtual void ShutDown();

    void PostWork(WorkContent work);//将work添加到工作队列
    void DispatchWork(WorkContent work);//分发work，若当前线程为工作线程，直接执行work，否则将work添加到工作队列。
    void PutRequestToServer(const ContextHead& context_head, const Request& request);
    void PutRequestToServer(ContextHeadPtr context_head, RequestPtr request);

    void SendRequest(const ContextHead& context_head, const Request& request);
    void SendRequest(ContextHeadPtr context_head, RequestPtr request);

    template <typename T>
    void SendResponse(ContextHeadPtr context_head, RequestPtr request, const T& proto_data);

	void SendResponse(ContextHeadPtr context_head, RequestPtr request);

    template <typename T>
    void SendNotify(ContextHeadPtr context_head, google::protobuf::uint32 request_id, const T& proto_data);

	void SendNotify(ContextHeadPtr context_head, google::protobuf::uint32 request_id);

    void CloseConnection(const ContextHead& context_head, bool dispatch_event = true);
    void CloseConnection(SessionID id, bool dispatch_event = true);

protected:
    virtual void OnRequest(ContextHeadPtr context_head, RequestPtr request);//客户端请求
    virtual void OnSocketConnect(ContextHeadPtr context_head, RequestPtr request);//socket连接建立
    virtual void OnSocketValidated(ContextHeadPtr context_head, RequestPtr request);//socket连接验证成功
    virtual void OnSocketClose(ContextHeadPtr context_head, RequestPtr request);//socket连接断开

private:
    bool StartWorkService();
    bool StopWorkService();

    virtual void OnSocketStatus(SocketStatus status, SessionID id) override; //socket状态回调
    virtual void OnSocketMsg(SessionID id, DataPtr dataptr, std::size_t size) override;//socket消息回调

    //心跳处理
    void StartPluseDetection();
    void StopPluseDetection();
    void DetectPluse();
    void OnConnectPluse(ContextHeadPtr context_head, RequestPtr request);
    void UpdateSessionPluse(SessionID id, time_t tm);
    void RemoveSessionPluse(SessionID id);
private:
    SocketServerPtr socket_server_;//asio socket服务

    int work_thread_num_;//工作线程数
    std::vector<std::thread> work_threads_;//工作线程
    boost::asio::io_service work_service_;//工作服务（充当线程池）
    std::shared_ptr<boost::asio::io_service::work> work_;//控制工作线程不退出

    std::mutex pluse_mutex_;
    std::unordered_map<SessionID, time_t> pluse_map_;//<session,time>
    boost::asio::deadline_timer pluse_timer_;//心跳定时器
};

inline void WorkServer::PostWork(WorkContent work)
{
    work_service_.post(std::move(work));
}

inline void WorkServer::DispatchWork(WorkContent work)
{
    work_service_.dispatch(std::move(work));
}

inline void WorkServer::PutRequestToServer(ContextHeadPtr context_head, RequestPtr request)
{
    PostWork([this, context_head, request]()
        {
            OnRequest(context_head, request);
        });
}

inline void WorkServer::PutRequestToServer(const ContextHead& context_head, const Request& request)
{
    PutRequestToServer(std::make_shared<ContextHead>(context_head), std::make_shared<Request>(request));
}

inline void WorkServer::CloseConnection(const ContextHead& context_head, bool dispatch_event)
{
    CloseConnection(context_head.session, dispatch_event);
}

inline void WorkServer::UpdateSessionPluse(SessionID id, time_t tm)
{
    std::lock_guard<std::mutex> lock(pluse_mutex_);
    pluse_map_[id] = tm;
}

inline void WorkServer::RemoveSessionPluse(SessionID id)
{
    std::lock_guard<std::mutex> lock(pluse_mutex_);
    pluse_map_.erase(id);
}

template<typename T>
void WorkServer::SendResponse(ContextHeadPtr context_head, RequestPtr request, const T& proto_data)
{
    basereq::Request ret;
    ret.set_request(request->request());
    ret.set_need_echo(false);
    if (request->need_echo())
    {
        ret.set_sequence(request->sequence());
    }
    else
    {
        ret.set_sequence(-1);//服务发送的消息不需要客户端响应，序列号可以返回无效值
    }

    auto d = ret.mutable_data();
    d->PackFrom(proto_data);

    SendRequest(*context_head, ret);
}

template <typename T>
void WorkServer::SendNotify(ContextHeadPtr context_head, google::protobuf::uint32 request_id, const T& proto_data)
{
    basereq::Request ret;
    ret.set_request(request_id);
    ret.set_need_echo(false);

    ret.set_sequence(-1);//服务发送的消息不需要客户端响应，序列号可以返回无效值

    auto d = ret.mutable_data();
    d->PackFrom(proto_data);

    SendRequest(*context_head, ret);
}