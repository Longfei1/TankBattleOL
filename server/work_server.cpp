#include "work_server.h"

WorkServer::WorkServer()
{

}

bool WorkServer::Initialize(int io_threads, int work_threads, int port, std::string hello_data, SessionID min_session, SessionID max_session)
{
    work_thread_num_ = work_threads;
    if (Super::Initialize(io_threads, port, hello_data, min_session, max_session))
    {
        //��ʼ�������߳�
    }
}

void WorkServer::OnSocketMsg(SessionID id, DataPtr dataptr, std::size_t size)
{
    //���ԣ���д�ַ���
    //SendData(id, dataptr, size);
    Super::OnSocketMsg(id, dataptr, size);
}
