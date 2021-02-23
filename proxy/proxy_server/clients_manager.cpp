#include "clients_manager.h"
#include "socket_client/socket_client.h"
#include "common/log/log.h"

using namespace boost::asio;

ClientsManager::ClientsManager(SocketStatusCallback status_callback, SocketMsgCallback msg_callback, 
    int io_threads, SessionID min_session, SessionID max_session)
    : io_thread_num_(io_threads), session_generator_(min_session, max_session),
    status_callback_(status_callback), msg_callback_(msg_callback)
{
}

bool ClientsManager::Initialize()
{
    if (!StartIOService())
    {
        return false;
    }

    return true;
}

void ClientsManager::ShutDown()
{
    StopIOService();

    ClearClientsMap();
}

SessionID ClientsManager::CreateClient()
{
    auto id = GenerateSessionID();
    if (IsSessionIDValid(id))
    {
        ConnectSession::SessionIDPtr idptr(new SessionID(id), [this](SessionID* pID)
            {
                ReturnSessionID(*pID);
                delete pID;
            });
        auto client = std::make_shared<AsioSockClient>(io_service_, idptr, 
            [this](SocketStatus status, SessionID id)
            {
                OnSocketStatus(status, id);
            },
            [this](SessionID id, DataPtr dataptr, std::size_t size)
            {
                OnSocketMsg(id, dataptr, size);
            });

        AddClient(client);
    }
    else
    {
        LOG_ERROR("ClientsManager::CreateClient error, not have enough sessionid");
    }
    return id;
}

void ClientsManager::ConnectServer(SessionID session_id, std::string ip, int port, std::string hello_data)
{
    auto client = GetClient(session_id);
    if (client)
    {
        client->ConnectServer(std::move(ip), port, std::move(hello_data));
    }
}

void ClientsManager::CloseClient(SessionID session_id)
{
    auto client = GetClient(session_id);
    if (client)
    {
        CloseClient(client);
    }
}

void ClientsManager::SendData(SessionID session_id, const Byte* senddata, std::size_t size)
{
    auto client = GetClient(session_id);
    if (client)
    {
        client->SendData(senddata, size);
    }
}

bool ClientsManager::StartIOService()
{
    work_ = std::make_shared<io_service::work>(io_service_);//�����������

    for (int i = 0; i < io_thread_num_; i++)
    {
        io_threads_.emplace_back([this]()
            {
                io_service_.run();
            });
    }
    return true;
}

bool ClientsManager::StopIOService()
{
    work_ = nullptr;
    io_service_.stop();//ֹͣ����
    for (auto& th : io_threads_)
    {
        th.join();//�ȴ��߳̽���
    }
    io_threads_.clear();
    return true;
}

ClientsManager::SocketClientPtr ClientsManager::GetClient(SessionID id)
{
    std::lock_guard<std::mutex> lock(session_map_mtx_);
    if (clients_.find(id) != clients_.end())
    {
        return clients_[id];
    }
    return nullptr;
}

void ClientsManager::AddClient(SocketClientPtr client)
{
    std::lock_guard<std::mutex> lock(session_map_mtx_);
    clients_[client->GetSessionID()] = client;
}

void ClientsManager::RemoveClient(SocketClientPtr client)
{
    std::lock_guard<std::mutex> lock(session_map_mtx_);
    clients_.erase(client->GetSessionID());
}

void ClientsManager::CloseClient(SocketClientPtr client)
{
    client->CloseConnection();
    RemoveClient(client);
}

void ClientsManager::OnSocketStatus(SocketStatus status, SessionID id)
{
    if (status == SocketStatus::CLOSED)
    {
        CloseClient(id);
    }

    if (status_callback_)
    {
        status_callback_(status, id);
    }
}

void ClientsManager::OnSocketMsg(SessionID id, DataPtr dataptr, std::size_t size)
{
    if (msg_callback_)
    {
        msg_callback_(id, dataptr, size);
    }
}
