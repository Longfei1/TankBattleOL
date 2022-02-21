#pragma once

#include "base_library.h"
#include "common/define/socket_def.h"

#include <boost/asio/io_service.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <boost/noncopyable.hpp>
#include <atomic>

#include "common/utils/utils.h"

//asio实现socket服务，线程安全。
class AsioSockServer : public boost::noncopyable
{
public:
    
    using SocketPtr = std::unique_ptr<boost::asio::ip::tcp::socket>;
    using AcceptorPtr = std::unique_ptr<boost::asio::ip::tcp::acceptor>;
    using ConSessionPtr = std::shared_ptr<ConnectSession>;
public:
    AsioSockServer(ISocketHandler* socket_handler, int port = SOCK_DEFAULT_PORT, int io_threads = SOCK_IO_THREAD_NUM, 
        std::string hello_data = SOCK_HELLO_DATA, SessionID min_session = 1, 
        SessionID max_session = SESSION_MAX_ID);
    ~AsioSockServer();
   
    bool Initialize();
    void ShutDown();
    
    //为避免使用互斥量保护回调函数，回调函数设置在构造函数处，不提供设置回调接口。
    //void SetSocketStatusCallback(SocketStatusCallback callback);//设置状态回调
    //void SetSocketMsgCallback(SocketMsgCallback callback);//设置消息回调

    void SendData(SessionID id, const Byte* senddata, std::size_t size);//发送数据包，多线程安全
    void CloseConnection(SessionID id);//关闭连接
private:
    bool InitSocket();
    bool UnInitSocket();
    bool StartIOService();
    bool StopIOService();

    //Socket IO处理
    void DoAccept();
    void OnAccept(const boost::system::error_code& error, boost::asio::ip::tcp::socket socket);
    void DoValidateHello(ConSessionPtr session);
    void OnValidateHello(ConSessionPtr session, const boost::system::error_code& error, const std::size_t& size);
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

    void OnSocketConnect(SessionID id);//socket连接建立
    void OnSocketValidated(SessionID id);//socket连接验证成功
    void OnSocketClose(SessionID id);//socket连接断开
    void OnSocketMsg(SessionID id, DataPtr dataptr, std::size_t size);//socket消息接收
private:
    int port_;
    int io_thread_num_;//io线程数

    std::string hello_data_;

    boost::asio::io_service io_service_;//asio
    SocketPtr socket_;//服务套接字
    AcceptorPtr acceptor_;
    std::vector<std::thread> io_threads_;//io线程

    std::mutex session_map_mtx_;
    std::unordered_map<SessionID, ConSessionPtr> session_map_;//连接表

    std::mutex session_gernerator_mtx_;
    myutils::IDGenerator<SessionID> session_generator_;//sessionid生成器

    //回调
    ISocketHandler* socket_handler_;

    std::atomic_bool running_;
};

inline SessionID AsioSockServer::GenerateSessionID()
{
    std::lock_guard<std::mutex> lock(session_gernerator_mtx_);
    return session_generator_.GenerateOneID();
}

inline void AsioSockServer::ReturnSessionID(SessionID id)
{
    std::lock_guard<std::mutex> lock(session_gernerator_mtx_);
    session_generator_.ReturnOneID(id);
}

inline bool AsioSockServer::IsSessionIDValid(SessionID id)
{
    //std::lock_guard<std::mutex> lock(session_gernerator_mtx_);
    return session_generator_.IsValidID(id);
}

inline AsioSockServer::ConSessionPtr AsioSockServer::GetConnectSession(SessionID id)
{
    std::lock_guard<std::mutex> lock(session_map_mtx_);
    if (session_map_.find(id) != session_map_.end())
    {
        return session_map_[id];
    }
    return nullptr;
}

inline void AsioSockServer::AddConnectSession(ConSessionPtr session)
{
    std::lock_guard<std::mutex> lock(session_map_mtx_);
    session_map_[*session->session_id_] = session;
}

inline void AsioSockServer::RemoveConnectSession(ConSessionPtr session)
{
    std::lock_guard<std::mutex> lock(session_map_mtx_);
    session_map_.erase(*session->session_id_);
}

inline void AsioSockServer::ClearConnectSessionMap()
{
    std::lock_guard<std::mutex> lock(session_map_mtx_);
    session_map_.clear();
}