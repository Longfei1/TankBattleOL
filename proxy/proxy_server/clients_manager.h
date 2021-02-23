#pragma once
#include "base_library.h"
#include "common/define/socket_def.h"

#include "common/utils/utils.h"

class AsioSockClient;
class ClientsManager : public boost::noncopyable
{
public:
    using SocketClientPtr = std::shared_ptr<AsioSockClient>;
    using SocketStatusCallback = std::function<void(SocketStatus, SessionID)>;
    using SocketMsgCallback = std::function<void(SessionID, DataPtr, std::size_t)>;
public:
    ClientsManager(SocketStatusCallback status_callback, SocketMsgCallback msg_callback, 
        int io_threads = SOCK_IO_THREAD_NUM, SessionID min_session = 1, SessionID max_session = SESSION_MAX_ID);
    ~ClientsManager() {}

    bool Initialize();
    void ShutDown();

    SessionID CreateClient();
    void ConnectServer(SessionID session_id, std::string ip, int port, std::string hello_data = SOCK_HELLO_DATA);
    void CloseClient(SessionID session_id);
    void SendData(SessionID session_id, const Byte* senddata, std::size_t size);

    bool IsSessionIDValid(SessionID id);
private:
    bool StartIOService();
    bool StopIOService();

    SessionID GenerateSessionID();
    void ReturnSessionID(SessionID id);
    SocketClientPtr GetClient(SessionID id);
    void AddClient(SocketClientPtr client);
    void RemoveClient(SocketClientPtr client);
    void ClearClientsMap();
    void CloseClient(SocketClientPtr client);

    void OnSocketStatus(SocketStatus status, SessionID id);//socket״̬�ص�
    void OnSocketMsg(SessionID id, DataPtr dataptr, std::size_t size);//socket��Ϣ�ص�
private:
    int io_thread_num_;//socketclient io�߳���
    std::vector<std::thread> io_threads_;//socketclient io�߳�
    boost::asio::io_service io_service_;//socketclient ioservice
    std::shared_ptr<boost::asio::io_service::work> work_;//����io�̲߳��˳�

    std::mutex session_gernerator_mtx_;
    myutils::IDGenerator<SessionID> session_generator_;//sessionid������

    std::mutex session_map_mtx_;
    std::unordered_map<SessionID, SocketClientPtr> clients_;//���ӱ�

    //�ص�����
    SocketStatusCallback status_callback_;
    SocketMsgCallback msg_callback_;
};

inline SessionID ClientsManager::GenerateSessionID()
{
    std::lock_guard<std::mutex> lock(session_gernerator_mtx_);
    return session_generator_.GenerateOneID();
}

inline void ClientsManager::ReturnSessionID(SessionID id)
{
    std::lock_guard<std::mutex> lock(session_gernerator_mtx_);
    session_generator_.ReturnOneID(id);
}

inline bool ClientsManager::IsSessionIDValid(SessionID id)
{
    //std::lock_guard<std::mutex> lock(session_gernerator_mtx_);
    return session_generator_.IsValidID(id);
}

inline void ClientsManager::ClearClientsMap()
{
    std::lock_guard<std::mutex> lock(session_map_mtx_);
    clients_.clear();
}