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

    void SendData(const Byte* senddata, std::size_t size);//�������ݰ������̰߳�ȫ

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

    void OnSocketConnect();//socket���ӽ���
    void OnSocketValidated();//socket������֤�ɹ�
    void OnSocketClose();//socket���ӶϿ�
    void OnSocketMsg(DataPtr dataptr, std::size_t size);//socket��Ϣ����

private:
    std::string ip_;
    int port_;
    std::string hello_data_;

    ConSessionPtr session_;//����

    //�ص�����
    SocketStatusCallback status_callback_;
    SocketMsgCallback msg_callback_;
};

inline SessionID AsioSockClient::GetSessionID()
{
    return *session_->session_id_;
}