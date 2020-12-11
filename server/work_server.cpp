#include "work_server.h"

WorkServer::WorkServer()
{

}

bool WorkServer::Initialize(int io_threads, int work_threads, int port, std::string hello_data, SessionID min_session, SessionID max_session)
{
    work_thread_num_ = work_threads;
    if (Super::Initialize(io_threads, port, hello_data, min_session, max_session))
    {
        //初始化工作线程
    }
}

void WorkServer::OnSocketMsg(SessionID id, DataPtr dataptr, std::size_t size)
{
    //测试，回写字符串
    //SendData(id, dataptr, size);
    Super::OnSocketMsg(id, dataptr, size);
}
