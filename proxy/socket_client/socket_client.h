#pragma once
#include "base_library.h"

#include <common/define/socket_def.h>

class AsioSockClient : public boost::noncopyable, public std::enable_shared_from_this<AsioSockClient>
{
public:
    using ConSessionPtr = std::shared_ptr<ConnectSession>;
    using SocketStatusCallback = std::function<void(SocketStatus, SessionID)>;
    using SocketMsgCallback = std::function<void(SessionID, DataPtr, std::size_t)>;
public:
    AsioSockClient(boost::asio::io_service& service, ConnectSession::SessionIDPtr client_session,
        SocketStatusCallback status_callback, SocketMsgCallback msg_callback);

    void ConnectServer(std::string ip, int port, std::string hello_data = SOCK_HELLO_DATA);
    void CloseConnection();

    void SendData(const Byte* senddata, std::size_t size);//发送数据包，多线程安全

    SessionID GetSessionID();
private:
    void DoConnect();
    void OnConnect(const boost::system::error_code& error);
    void DoValidateHello();
    void OnValidateHello(const boost::system::error_code& error, const std::size_t& size);
    void TryWriteDataPackage();
    void DoWriteDataPackage();
    void OnWriteDataPackage(const boost::system::error_code& error, const std::size_t& size);
    void DoReadDataPackage();
    void OnReadDataPackage(const boost::system::error_code& error, const std::size_t& size);
    bool CheckIOState(const boost::system::error_code& error);

    void CloseConnectSession(bool dispatch_event = true);

    void OnSocketConnect();//socket连接建立
    void OnSocketValidated();//socket连接验证成功
    void OnSocketClose();//socket连接断开
    void OnSocketMsg(DataPtr dataptr, std::size_t size);//socket消息接收

private:
    std::string ip_;
    int port_;
    std::string hello_data_;

    ConSessionPtr session_;//连接

    //回调函数
    SocketStatusCallback status_callback_;
    SocketMsgCallback msg_callback_;
};

inline SessionID AsioSockClient::GetSessionID()
{
    return *session_->session_id_;
}