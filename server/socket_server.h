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

#define SOCK_BUFFER_LEN 4096 //socket���������ȣ��������Э��ͷ���Ⱥ�hello data���ȣ�
#define SOCK_IO_THREAD_NUM 2
#define SOCK_DEFAULT_PORT 8888
#define SOCK_HELLO_DATA "hello longfei!"

#define SESSION_MAX_ID 100000

//�������Ͷ���
using SessionID = uint;
using Byte = char;
using DataPtr = std::shared_ptr<Byte>;

struct ProtocalHead//Э��ͷ��
{
    uint data_len;//���ݳ���
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
        BUFFER,//������
        DATA,//������
    };

    using Socket = boost::asio::ip::tcp::socket;
public:
    ConnectSession(boost::asio::io_service& service);

    SessionID session_id_;

    Socket socket_;//�׽���
    std::mutex sock_mtx_;//�׽��ַ��ʻ�����

    //ȷ��ֻ��һ���̷߳��ʶ�ȡ�������Բ��û�����
    ReadLocation read_location;//����λ��
    Byte read_buffer_[SOCK_BUFFER_LEN];//��������
    std::size_t read_size_;
    DataPackage read_data_;//�����ݴ洢��������ճ��

    //��Ҫ�����������is_writing_��write_queue_
    bool is_writing_;
    std::queue<DataPtr> write_queue_;//д�뻺�����
    std::mutex write_mtx_;

    //ȷ��ֻ��һ���̷߳���д���������Բ��û�����
    std::size_t write_size_;
    DataPtr write_data_;//д���ݴ洢����head + dataptr��
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

    virtual void OnSocketConnect(SessionID id);//socket���ӽ���
    virtual void OnSocketValidated(SessionID id);//socket������֤�ɹ�
    virtual void OnSocketClose(SessionID id);//socket���ӶϿ�
    virtual void OnSocketMsg(SessionID id, DataPtr dataptr, std::size_t size);//socket��Ϣ���գ�ͨ������DataPtr�ӳ����ݴ��ʱ�䡣

    //�������ݰ������̰߳�ȫ
    void SendData(SessionID id, const Byte* senddata, std::size_t size);
private:
    void InitSocket();
    void UnInitSocket();
    void StartIOService();
    void StopIOService();

    //Socket IO����
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
    int io_thread_num_;//io�߳���
    int port_;

    std::string hello_data_;
    SessionID min_session_;
    SessionID max_session_;

    boost::asio::io_service io_service_;//asio
    SocketPtr socket_;//�����׽���
    AcceptorPtr acceptor_;
    std::vector<std::thread> io_threads_;//io�߳�

    std::mutex session_map_mtx_;
    std::unordered_map<SessionID, ConSessionPtr> session_map_;//���ӱ�

    std::mutex session_gernerator_mtx_;
    myutils::IDGenerator<SessionID> session_generator_;//sessionid������
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
