#include "work_server.h"
#include "socket_server/socket_server.h"
#include "log/log.h"
#include "proto/test.pb.h"

WorkServer::WorkServer(std::string ip, int port, int io_threads, int work_threads, std::string hello_data,
    SessionID min_session, SessionID max_session) : work_thread_num_(work_threads)
{
    socket_server_ = std::make_shared<AsioSockServer>(
        [this](SocketStatus status, SessionID id) 
        {
            OnSocketStatus(status, id);
        },
        [this](SessionID id, DataPtr dataptr, std::size_t size)
        {
            OnSocketMsg(id, dataptr, size);
        },
        std::move(ip), port, io_threads, std::move(hello_data), min_session, max_session);
}

bool WorkServer::Initialize()
{
    if (!socket_server_->Initialize())
    {
        return false;
    }

    //初始化工作线程
    if (!StartWorkService())
    {
        return false;
    }

    return true;
}

void WorkServer::ShutDown()
{
    if (socket_server_)
    {
        socket_server_->ShutDown();
    }

    StopWorkService();
}

void WorkServer::OnRequest(ContextHeadPtr context_head, RequestPtr request)
{
    switch (request->request())
    {
    case WR_SOCKET_CONNECT:
        OnSocketConnect(context_head, request);
        break;
    case WR_SOCKET_VALIDATE:
        OnSocketValidated(context_head, request);
        break;
    case WR_SOCKET_CLOSE:
        OnSocketClose(context_head, request);
        break;
    default:
        break;
    }
}

void WorkServer::OnSocketConnect(ContextHeadPtr context_head, RequestPtr request)
{
    LOG_TRACE("session(%d) OnSocketConnect", context_head->session);
}

void WorkServer::OnSocketValidated(ContextHeadPtr context_head, RequestPtr request)
{
    LOG_TRACE("session(%d) OnSocketValidated", context_head->session);
}

void WorkServer::OnSocketClose(ContextHeadPtr context_head, RequestPtr request)
{
    LOG_TRACE("session(%d) OnSocketClose", context_head->session);
}

bool WorkServer::StartWorkService()
{
    for (int i = 0; i < work_thread_num_; i++)
    {
        work_threads_.emplace_back([this]()
            {
                work_service_.run();
            });
    }
    return true;
}

bool WorkServer::StopWorkService()
{
    work_service_.stop();//停止服务
    for (auto& th : work_threads_)
    {
        th.join();//等待线程结束
    }
    work_threads_.clear();
    return true;
}

void WorkServer::OnSocketStatus(SocketStatus status, SessionID id)
{
    uint request_id = 0;
    switch (status)
    {
    case SocketStatus::CONNECTED:
        request_id = WR_SOCKET_CONNECT;
        break;
    case SocketStatus::VALIDATED:
        request_id = WR_SOCKET_VALIDATE;
        break;
    case SocketStatus::CLOSED:
        request_id = WR_SOCKET_CLOSE;
        break;
    default:
        break;
    }

    if (request_id > 0)
    {
        ContextHeadPtr context = std::make_shared<ContextHead>();
        context->session = id;

        RequestPtr request = std::make_shared<Request>();
        request->set_request(request_id);
        request->set_need_echo(false);

        PutRequestToServer(context, request);
    }
}

void WorkServer::OnSocketMsg(SessionID id, DataPtr dataptr, std::size_t size)
{
    ContextHeadPtr context = std::make_shared<ContextHead>();
    context->session = id;

    RequestPtr request = std::make_shared<Request>();
    request->ParseFromString(std::string(dataptr.get(), size));

    PutRequestToServer(context, request);
}
