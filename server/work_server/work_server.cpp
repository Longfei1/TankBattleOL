#include "work_server.h"
#include "socket_server/socket_server.h"
#include "common/log/log.h"
#include "proto/test.pb.h"
#include "boost/date_time/posix_time/posix_time.hpp"
#include "boost/asio/deadline_timer.hpp"

using namespace boost::asio;

WorkServer::WorkServer(int port, int io_threads, int work_threads, std::string hello_data,
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
        port, io_threads, std::move(hello_data), min_session, max_session);
}

bool WorkServer::Initialize()
{
    if (!socket_server_ || !socket_server_->Initialize())
    {
        return false;
    }

    //初始化工作线程
    if (!StartWorkService())
    {
        return false;
    }

    StartPluseDetection();

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

void WorkServer::SendRequest(const ContextHead& context_head, const Request& request)
{
    if (socket_server_)
    {
        auto data = request.SerializeAsString();
        socket_server_->SendData(context_head.session, data.data(), data.size());
    }
}

void WorkServer::SendRequest(ContextHeadPtr context_head, RequestPtr request)
{
    if (socket_server_)
    {
        SendRequest(*context_head, *request);
    }
}

void WorkServer::CloseConnection(SessionID id)
{
    if (socket_server_)
    {
        socket_server_->CloseConnection(id);
    }

    RemoveSessionPluse(id);
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

    UpdateSessionPluse(context_head->session, time(nullptr));//连接成功能后，更新心跳时间
}

void WorkServer::OnSocketValidated(ContextHeadPtr context_head, RequestPtr request)
{
    LOG_TRACE("session(%d) OnSocketValidated", context_head->session);
}

void WorkServer::OnSocketClose(ContextHeadPtr context_head, RequestPtr request)
{
    LOG_TRACE("session(%d) OnSocketClose", context_head->session);

    RemoveSessionPluse(context_head->session);
}

bool WorkServer::StartWorkService()
{
    work_ = std::make_shared<io_service::work>(work_service_);//添加永久任务

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
    work_ = nullptr;
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
    request->ParseFromArray(dataptr.get(), size);

    PutRequestToServer(context, request);
}

void WorkServer::StartPluseDetection()
{
    auto timer = std::make_shared<deadline_timer>(work_service_, boost::posix_time::seconds(PLUSE_TIMER_INTERVAL));
    
    static std::function<void(boost::system::error_code)> timer_func = nullptr;

    timer_func = [this, timer](boost::system::error_code error)
    {
        if (!error)
        {
            DetectPluse();

            timer->expires_from_now(boost::posix_time::seconds(PLUSE_TIMER_INTERVAL));
            timer->async_wait(timer_func);//递归调用，继续计时
        }
    };

    timer->async_wait(timer_func);
}

void WorkServer::DetectPluse()
{
    std::vector<SessionID> invalid_sessions;
    {
        auto time_now = time(nullptr);
        std::lock_guard<std::mutex> lock(pluse_mutex_);
        for (auto& it : pluse_map_)
        {
            if (time_now - it.second > PLUSE_OVERDUE_TIME)
            {
                invalid_sessions.push_back(it.first);
            }
        }
    }

    for (auto s : invalid_sessions)
    {
        CloseConnection(s);//断开心跳超时的连接
        RemoveSessionPluse(s);
    }
}

void WorkServer::OnConnectPluse(ContextHeadPtr context_head, RequestPtr request)
{
    LOG_TRACE("session(%d) OnConnectPluse", context_head->session);
    UpdateSessionPluse(context_head->session, time(nullptr));
}