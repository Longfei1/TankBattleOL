#pragma once

#include <memory>

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