#pragma once
#include "socket_server.h"

#define SOCK_WORK_THREAD_NUM 4

class WorkServer : public AsioSockServer
{
public:
    using Super = AsioSockServer;
public:
    WorkServer();

    bool Initialize(int io_threads = SOCK_IO_THREAD_NUM, int work_threads = SOCK_WORK_THREAD_NUM, int port = SOCK_DEFAULT_PORT, std::string hello_data = SOCK_HELLO_DATA,
        SessionID min_session = 1, SessionID max_session = SESSION_MAX_ID);

    virtual void OnSocketMsg(SessionID id, DataPtr dataptr, std::size_t size) override;
private:
    int work_thread_num_;//工作线程数
    std::vector<std::thread> work_threads_;//工作线程
};