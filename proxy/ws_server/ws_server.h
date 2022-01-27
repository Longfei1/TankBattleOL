#pragma once

#include "base_library.h"
#include "common/define/socket_def.h"

#include <atomic>

#include "common/utils/utils.h"

//asioʵ��websocket�����̰߳�ȫ��
class AsioWSServer : public boost::noncopyable
{
public:
    
    using SocketPtr = std::unique_ptr<boost::asio::ip::tcp::socket>;
    using AcceptorPtr = std::unique_ptr<boost::asio::ip::tcp::acceptor>;
    using ConSessionPtr = std::shared_ptr<WSConnectSession>;
    using SocketStatusCallback = std::function<void(SocketStatus, SessionID)>;
    using SocketMsgCallback = std::function<void(SessionID, DataPtr, std::size_t)>;
public:
    AsioWSServer(SocketStatusCallback status_callback, SocketMsgCallback msg_callback,
        int port = SOCK_DEFAULT_PORT, int io_threads = SOCK_IO_THREAD_NUM, 
        SessionID min_session = 1, SessionID max_session = SESSION_MAX_ID);
    ~AsioWSServer();
   
    bool Initialize();
    void ShutDown();
    
    //Ϊ����ʹ�û����������ص��������ص����������ڹ��캯���������ṩ���ûص��ӿڡ�
    //void SetSocketStatusCallback(SocketStatusCallback callback);//����״̬�ص�
    //void SetSocketMsgCallback(SocketMsgCallback callback);//������Ϣ�ص�

    void SendData(SessionID id, const Byte* senddata, std::size_t size);//�������ݰ������̰߳�ȫ
    void SendData(SessionID id, DataPtr dataptr, std::size_t size);//�������ݰ������̰߳�ȫ
    void CloseConnection(SessionID id);//�ر�����
private:
    bool InitSocket();
    bool UnInitSocket();
    bool StartIOService();
    bool StopIOService();

    void InitSocketOption(ConSessionPtr session);

    //Socket IO����
    void DoAccept();
    void OnAccept(const boost::system::error_code& error, boost::asio::ip::tcp::socket socket);
    void DoShakeHand(ConSessionPtr session);
    void OnShakeHand(ConSessionPtr session, const boost::system::error_code& error);
    void DoReadDataPackage(ConSessionPtr session);
    void OnReadDataPackage(ConSessionPtr session, const boost::system::error_code& error, const std::size_t& size);
    void TryWriteDataPackage(ConSessionPtr session);
    void DoWriteDataPackage(ConSessionPtr session);
    void OnWriteDataPackage(ConSessionPtr session, const boost::system::error_code& error, const std::size_t& size);
    bool CheckIOState(ConSessionPtr session, const boost::system::error_code& error);

    SessionID GenerateSessionID();
    void ReturnSessionID(SessionID id);
    bool IsSessionIDValid(SessionID id);
    ConSessionPtr GetConnectSession(SessionID id);
    void AddConnectSession(ConSessionPtr session);
    void RemoveConnectSession(ConSessionPtr session);
    void ClearConnectSessionMap();
    void CloseConnectSession(ConSessionPtr session, bool dispatch_event = true);

    void OnSocketConnect(SessionID id);//socket���ӽ���
    void OnSocketValidated(SessionID id);//socket������֤�ɹ�
    void OnSocketClose(SessionID id);//socket���ӶϿ�
    void OnSocketMsg(SessionID id, DataPtr dataptr, std::size_t size);//socket��Ϣ����
private:
    int port_;
    int io_thread_num_;//io�߳���

    std::string hello_data_;

    boost::asio::io_service io_service_;//asio
    SocketPtr socket_;//�����׽���
    AcceptorPtr acceptor_;
    std::vector<std::thread> io_threads_;//io�߳�

    std::mutex session_map_mtx_;
    std::unordered_map<SessionID, ConSessionPtr> session_map_;//���ӱ�

    std::mutex session_gernerator_mtx_;
    myutils::IDGenerator<SessionID> session_generator_;//sessionid������

    //�ص�����
    SocketStatusCallback status_callback_;
    SocketMsgCallback msg_callback_;

    std::atomic_bool running_;
};

inline SessionID AsioWSServer::GenerateSessionID()
{
    std::lock_guard<std::mutex> lock(session_gernerator_mtx_);
    return session_generator_.GenerateOneID();
}

inline void AsioWSServer::ReturnSessionID(SessionID id)
{
    std::lock_guard<std::mutex> lock(session_gernerator_mtx_);
    session_generator_.ReturnOneID(id);
}

inline bool AsioWSServer::IsSessionIDValid(SessionID id)
{
    //std::lock_guard<std::mutex> lock(session_gernerator_mtx_);
    return session_generator_.IsValidID(id);
}

inline AsioWSServer::ConSessionPtr AsioWSServer::GetConnectSession(SessionID id)
{
    std::lock_guard<std::mutex> lock(session_map_mtx_);
    if (session_map_.find(id) != session_map_.end())
    {
        return session_map_[id];
    }
    return nullptr;
}

inline void AsioWSServer::AddConnectSession(ConSessionPtr session)
{
    std::lock_guard<std::mutex> lock(session_map_mtx_);
    session_map_[*session->session_id_] = session;
}

inline void AsioWSServer::RemoveConnectSession(ConSessionPtr session)
{
    std::lock_guard<std::mutex> lock(session_map_mtx_);
    session_map_.erase(*session->session_id_);
}

inline void AsioWSServer::ClearConnectSessionMap()
{
    std::lock_guard<std::mutex> lock(session_map_mtx_);
    session_map_.clear();
}