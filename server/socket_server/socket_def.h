#pragma once

#include <memory>

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