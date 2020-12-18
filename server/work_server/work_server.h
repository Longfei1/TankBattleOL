#pragma once

#include "base_library.h"

#include <boost/asio/io_service.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <boost/noncopyable.hpp>

#include "socket_server/socket_def.h"
#include "work_def.h"

#include "proto/basereq.pb.h"


using namespace basereq;

class AsioSockServer;
class WorkServer
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
    WorkServer(std::string ip = SOCK_DEFAULT_IP, int port = SOCK_DEFAULT_PORT, int io_threads = SOCK_IO_THREAD_NUM, 
        int work_threads = SOCK_WORK_THREAD_NUM, std::string hello_data = SOCK_HELLO_DATA,
        SessionID min_session = 1, SessionID max_session = SESSION_MAX_ID);

    virtual bool Initialize();
    virtual void ShutDown();

    virtual void OnRequest(ContextHeadPtr context_head, RequestPtr request);//客户端请求
    virtual void OnSocketConnect(ContextHeadPtr context_head, RequestPtr request);//socket连接建立
    virtual void OnSocketValidated(ContextHeadPtr context_head, RequestPtr request);//socket连接验证成功
    virtual void OnSocketClose(ContextHeadPtr context_head, RequestPtr request);//socket连接断开

    void PostWork(WorkContent work);//将work添加到工作队列
    void DispatchWork(WorkContent work);//分发work，若当前线程为工作线程，直接执行work，否则将work添加到工作队列。
    void PutRequestToServer(const ContextHead& context_head, const Request& request);
    void PutRequestToServer(ContextHeadPtr context_head, RequestPtr request);
private:
    bool StartWorkService();
    bool StopWorkService();

    void OnSocketStatus(SocketStatus status, SessionID id);//socket状态回调
    void OnSocketMsg(SessionID id, DataPtr dataptr, std::size_t size);//socket消息回调
private:
    SocketServerPtr socket_server_;//asio socket服务

    int work_thread_num_;//工作线程数
    std::vector<std::thread> work_threads_;//工作线程
    boost::asio::io_service work_service_;//工作服务（充当线程池）
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