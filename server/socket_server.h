#pragma once

#include <boost/asio/io_service.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <boost/noncopyable.hpp>

#include <memory>
#include <vector>
#include <thread>
#include <string>
#include <mutex>
#include <queue>
#include <unordered_map>

#include "utils.h"
#include "log/log.h"

#define SOCK_BUFFER_LEN 4096 //socket缓冲区长度（必须大于协议头长度和hello data长度）
#define SOCK_IO_THREAD_NUM 2
#define SOCK_DEFAULT_PORT 8888
#define SOCK_HELLO_DATA "hello longfei!"

#define SESSION_MAX_ID 100000

//公共类型定义
using SessionID = uint;
using Byte = char;
using DataPtr = std::shared_ptr<Byte>;

struct ProtocalHead//协议头部
{
    uint data_len;//数据长度
};

struct DataPackage
{
    ProtocalHead head;
    DataPtr dataptr;
};

class AsioSockServer;
class ConnectSession : boost::noncopyable
{
public:
    enum ReadLocation
    {
        BUFFER,//缓冲区
        DATA,//数据区
    };

    using Socket = boost::asio::ip::tcp::socket;
public:
    ConnectSession(boost::asio::io_service& service);

    SessionID session_id_;

    Socket socket_;//套接字
    std::mutex sock_mtx_;//套接字访问互斥量

    //确保只有一个线程访问读取区，所以不用互斥锁
    ReadLocation read_location;//读入位置
    Byte read_buffer_[SOCK_BUFFER_LEN];//读缓冲区
    std::size_t read_size_;
    DataPackage read_data_;//读数据存储区，用于粘包

    //需要互斥操作保护is_writing_和write_queue_
    bool is_writing_;
    std::queue<DataPtr> write_queue_;//写入缓冲队列
    std::mutex write_mtx_;

    //确保只有一个线程访问写入区，所以不用互斥锁
    std::size_t write_size_;
    DataPtr write_data_;//写数据存储区（head + dataptr）
};

class AsioSockServer : public boost::noncopyable
{
public:

    using SocketPtr = std::unique_ptr<boost::asio::ip::tcp::socket>;
    using AcceptorPtr = std::unique_ptr<boost::asio::ip::tcp::acceptor>;
    using ConSessionPtr = std::shared_ptr<ConnectSession>;

public:
    AsioSockServer();
    virtual ~AsioSockServer();
   
    bool Initialize(int io_threads = SOCK_IO_THREAD_NUM, int port = SOCK_DEFAULT_PORT, std::string hello_data = SOCK_HELLO_DATA,
        SessionID min_session = 1, SessionID max_session = SESSION_MAX_ID);

    virtual void ShutDown();

    virtual void OnSocketConnect(SessionID id);//socket连接建立
    virtual void OnSocketValidated(SessionID id);//socket连接验证成功
    virtual void OnSocketClose(SessionID id);//socket连接断开
    virtual void OnSocketMsg(SessionID id, DataPtr dataptr, std::size_t size);//socket消息接收，通过接收DataPtr延长数据存活时间。

    //发送数据包，多线程安全
    void SendData(SessionID id, const Byte* senddata, std::size_t size);
private:
    void InitSocket();
    void UnInitSocket();
    void StartIOService();
    void StopIOService();

    //Socket IO处理
    void DoAccept();
    void OnAccept(ConSessionPtr session, const boost::system::error_code& error);
    void DoValidateHello(ConSessionPtr session);
    void OnValidateHello(ConSessionPtr session, const boost::system::error_code& error, const std::size_t& size);
    void DoReadDataPackage(ConSessionPtr session);
    void OnReadDataPackage(ConSessionPtr session, const boost::system::error_code& error, const std::size_t& size);
    void TryWriteDataPackage(ConSessionPtr session);
    void DoWriteDataPackage(ConSessionPtr session);
    void OnWriteDataPackage(ConSessionPtr session, const boost::system::error_code& error, const std::size_t& size);
    bool CheckIOState(ConSessionPtr session, const boost::system::error_code& error);

    SessionID GernerateSessionID();
    void ReturnSessionID(SessionID id);
    bool IsSessionIDValid(SessionID id);
    ConSessionPtr GetConnectSession(SessionID id);
    void AddConnectSession(ConSessionPtr session);
    void RemoveConnectSession(ConSessionPtr session);
    void CloseConnectSession(ConSessionPtr session);
private:
    int io_thread_num_;//io线程数
    int port_;

    std::string hello_data_;
    SessionID min_session_;
    SessionID max_session_;

    boost::asio::io_service io_service_;//asio
    SocketPtr socket_;//服务套接字
    AcceptorPtr acceptor_;
    std::vector<std::thread> io_threads_;//io线程

    std::mutex session_map_mtx_;
    std::unordered_map<SessionID, ConSessionPtr> session_map_;//连接表

    std::mutex session_gernerator_mtx_;
    myutils::IDGenerator<SessionID> session_generator_;//sessionid生成器
};

inline SessionID AsioSockServer::GernerateSessionID()
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
    return id >= min_session_ && id < max_session_ ? true : false;
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
    session_map_[session->session_id_] = session;
}

inline void AsioSockServer::RemoveConnectSession(ConSessionPtr session)
{
    std::lock_guard<std::mutex> lock(session_map_mtx_);
    session_map_.erase(session->session_id_);
}
