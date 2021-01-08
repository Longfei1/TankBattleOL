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

#define SOCK_BUFFER_LEN 4096 //socket缓冲区长度（必须大于协议头长度和hello data长度）
#define SOCK_IO_THREAD_NUM 2
#define SOCK_DEFAULT_IP "127.0.0.1"
#define SOCK_DEFAULT_PORT 8888
#define SOCK_HELLO_DATA "hello longfei!"

#define SESSION_MAX_ID 100000

//公共类型定义
using SessionID = uint;
using Byte = char;
using DataPtr = std::shared_ptr<Byte>;

enum class SocketStatus
{
    INIT,//初始化
    CONNECTED,//连接
    VALIDATED,//验证
    CLOSED,//断开
};

struct ProtocalHead//协议头部
{
    uint data_len;//数据长度
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
        BUFFER,//缓冲区
        DATA,//数据区
    };

    using SessionIDPtr = std::shared_ptr<SessionID>;
    using Socket = boost::asio::ip::tcp::socket;
public:
    explicit ConnectSession(boost::asio::ip::tcp::socket&& socket
        ) : session_id_(0), status_(SocketStatus::INIT), socket_(std::move(socket)), 
        read_location(BUFFER)
    {
        static_assert(sizeof(ProtocalHead) < sizeof(ConnectSession::read_buffer_));//协议头不能大于读缓冲区

        memset(&read_data_.head, 0, sizeof(read_data_.head));
        read_data_.dataptr = nullptr;
    }

    //strand确保只有一个线程访问成员变量
    SessionIDPtr session_id_;
    SocketStatus status_;

    Socket socket_;//套接字

    ReadLocation read_location;//读入位置
    Byte read_buffer_[SOCK_BUFFER_LEN];//读缓冲区
    std::size_t read_size_;
    DataPackage read_data_;//读数据存储区，用于粘包

    std::queue<DataPtr> write_queue_;//写入缓冲队列
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

    //strand确保只有一个线程访问成员变量
    SessionIDPtr session_id_;
    SocketStatus status_;

    WebSocket socket_;//套接字

    Buffer read_buffer_;

    std::queue<Message> write_queue_;//写入缓冲队列
};