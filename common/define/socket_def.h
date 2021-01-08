#pragma once

#include <memory>
#include <mutex>
#include <queue>
#include <utility>

#include <boost/asio/io_service.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <boost/asio/strand.hpp>

#include <boost/beast/core.hpp>
#include <boost/beast/websocket.hpp>

#include <boost/noncopyable.hpp>

#define SOCK_BUFFER_LEN 4096 //socket���������ȣ��������Э��ͷ���Ⱥ�hello data���ȣ�
#define SOCK_IO_THREAD_NUM 2
#define SOCK_DEFAULT_IP "127.0.0.1"
#define SOCK_DEFAULT_PORT 8888
#define SOCK_HELLO_DATA "hello longfei!"

#define SESSION_MAX_ID 100000

//�������Ͷ���
using SessionID = uint;
using Byte = char;
using DataPtr = std::shared_ptr<Byte>;

enum class SocketStatus
{
    INIT,//��ʼ��
    CONNECTED,//����
    VALIDATED,//��֤
    CLOSED,//�Ͽ�
};

struct ProtocalHead//Э��ͷ��
{
    uint data_len;//���ݳ���
};

struct DataPackage
{
    ProtocalHead head;
    DataPtr dataptr;
};

class ConnectSession : public boost::noncopyable
{
public:
    enum ReadLocation
    {
        BUFFER,//������
        DATA,//������
    };

    using SessionIDPtr = std::shared_ptr<SessionID>;
    using Socket = boost::asio::ip::tcp::socket;
public:
    explicit ConnectSession(boost::asio::ip::tcp::socket&& socket
        ) : session_id_(0), status_(SocketStatus::INIT), socket_(std::move(socket)), 
        read_location(BUFFER)
    {
        static_assert(sizeof(ProtocalHead) < sizeof(ConnectSession::read_buffer_));//Э��ͷ���ܴ��ڶ�������

        memset(&read_data_.head, 0, sizeof(read_data_.head));
        read_data_.dataptr = nullptr;
    }

    //strandȷ��ֻ��һ���̷߳��ʳ�Ա����
    SessionIDPtr session_id_;
    SocketStatus status_;

    Socket socket_;//�׽���

    ReadLocation read_location;//����λ��
    Byte read_buffer_[SOCK_BUFFER_LEN];//��������
    std::size_t read_size_;
    DataPackage read_data_;//�����ݴ洢��������ճ��

    std::queue<DataPtr> write_queue_;//д�뻺�����
};

class WSConnectSession : public boost::noncopyable
{
public:
    using SessionIDPtr = std::shared_ptr<SessionID>;
    using WebSocket = boost::beast::websocket::stream<boost::beast::tcp_stream>;
    using Buffer = boost::beast::flat_buffer;
    using Message = std::pair<std::size_t, DataPtr>;//<size, data>
public:
    explicit WSConnectSession(boost::asio::ip::tcp::socket&& socket
        ) : session_id_(0), status_(SocketStatus::INIT), 
        socket_(std::move(socket))
    {
    }

    //strandȷ��ֻ��һ���̷߳��ʳ�Ա����
    SessionIDPtr session_id_;
    SocketStatus status_;

    WebSocket socket_;//�׽���

    Buffer read_buffer_;

    std::queue<Message> write_queue_;//д�뻺�����
};