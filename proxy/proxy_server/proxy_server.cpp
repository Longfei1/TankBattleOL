#include "proxy_server.h"
#include "ws_server/ws_server.h"
#include "clients_manager.h"
#include "common/log/log.h"

ProxyServer::ProxyServer(std::string server_ip, int server_port, int proxy_port,
    int io_threads, std::string client_hello_data, SessionID min_session, SessionID max_session)
    : server_ip_(std::move(server_ip)), server_port_(server_port), proxy_port_(proxy_port), 
    io_thread_num_(io_threads), server_hello_data_(std::move(client_hello_data)),
    proxy_handler_(this), server_handler_(this)
{
    ws_server_ = std::make_shared<AsioWSServer>(&proxy_handler_, proxy_port_, io_thread_num_, min_session, max_session);

    clients_manager_ = std::make_shared<ClientsManager>(&server_handler_, io_thread_num_, min_session, max_session);
}

bool ProxyServer::Initialize()
{
    if (!ws_server_ || !ws_server_->Initialize())
    {
        return false;
    }

    if (!clients_manager_ || !clients_manager_->Initialize())
    {
        if (!clients_manager_->Initialize())
        {
            return false;
        }
    }

    return true;
}

void ProxyServer::ShutDown()
{
    if (ws_server_)
    {
        ws_server_->ShutDown();
    }

    if (clients_manager_)
    {
        clients_manager_->ShutDown();
    }
}

void ProxyServer::OnProxySocketStatus(SocketStatus status, SessionID id)
{
    LOG_TRACE("OnProxySocketStatus session(%d) status(%d)", id, status);
    switch (status)
    {
    case SocketStatus::CONNECTED:
        break;
    case SocketStatus::VALIDATED:
    {
        auto client_id = clients_manager_->CreateClient();
        if (clients_manager_->IsSessionIDValid(client_id))
        {
            AddSessionRelation(id, client_id);
            clients_manager_->ConnectServer(client_id, server_ip_, server_port_, server_hello_data_);
        }
        else
        {
            ws_server_->CloseConnection(id);
        }
        break;
    }
    case SocketStatus::CLOSED:
    {
        SessionID client_id;
        if (GetServerSessionID(id, client_id))
        {
            clients_manager_->CloseClient(client_id);
            RemoveSessionRelation(id);
        }
        break;
    }
    default:
        break;
    }
}

void ProxyServer::OnProxySocketMsg(SessionID id, DataPtr dataptr, std::size_t size)
{
    //转发消息给代理连接的服务器
    SessionID client_id;
    if (GetServerSessionID(id, client_id))
    {
        clients_manager_->SendData(client_id, dataptr.get(), size);
    }
}

void ProxyServer::OnServerSocketStatus(SocketStatus status, SessionID id)
{
    switch (status)
    {
    case SocketStatus::CONNECTED:
        break;
    case SocketStatus::VALIDATED:
        //验证成功后，会自动发送队列里的消息
        break;
    case SocketStatus::CLOSED:
        SessionID proxy_id;
        if (GetProxySessionID(id, proxy_id))
        {
            ws_server_->CloseConnection(proxy_id);
            RemoveSessionRelation(proxy_id);
        }
        break;
    default:
        break;
    }
}

void ProxyServer::OnServerSocketMsg(SessionID id, DataPtr dataptr, std::size_t size)
{
    //回应消息给连接webserver的客户端
    SessionID proxy_id;
    if (GetProxySessionID(id, proxy_id))
    {
        ws_server_->SendData(proxy_id, dataptr, size);
    }
}

bool ProxyServer::GetServerSessionID(SessionID proxy_id, SessionID& server_id)
{
    std::lock_guard<std::mutex> lock(session_relation_mtx_);
    if (session_relation_.find(proxy_id) != session_relation_.end())
    {
        server_id = session_relation_[proxy_id];
        return true;
    }
    return false;
}

bool ProxyServer::GetProxySessionID(SessionID server_id, SessionID& proxy_id)
{
    std::lock_guard<std::mutex> lock(session_relation_mtx_);
    for (const auto& it : session_relation_)
    {
        if (it.second == server_id)
        {
            proxy_id = it.first;
            return true;
        }
    }

    return false;
}

void ProxyServer::AddSessionRelation(SessionID proxy_id, SessionID server_id)
{
    std::lock_guard<std::mutex> lock(session_relation_mtx_);
    session_relation_[proxy_id] = server_id;
}

void ProxyServer::RemoveSessionRelation(SessionID proxy_id)
{
    std::lock_guard<std::mutex> lock(session_relation_mtx_);
    session_relation_.erase(proxy_id);
}