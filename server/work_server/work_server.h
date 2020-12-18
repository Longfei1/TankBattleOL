#pragma once

#include "base_library.h"

#include <boost/asio/io_service.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <boost/noncopyable.hpp>

#include "socket_server/socket_def.h"
#include "work_def.h"

#include "proto/basereq.pb.h"


using namespace basereq;

class AsioSockServer;
class WorkServer
{
public:
    struct ContextHead
    {
        SessionID session;//����session
    };

    using SocketServerPtr = std::shared_ptr<AsioSockServer>;
    using WorkContent = std::function<void()>;
    using ContextHeadPtr = std::shared_ptr<ContextHead>;
    using RequestPtr = std::shared_ptr<Request>;
public:
    WorkServer(std::string ip = SOCK_DEFAULT_IP, int port = SOCK_DEFAULT_PORT, int io_threads = SOCK_IO_THREAD_NUM, 
        int work_threads = SOCK_WORK_THREAD_NUM, std::string hello_data = SOCK_HELLO_DATA,
        SessionID min_session = 1, SessionID max_session = SESSION_MAX_ID);

    virtual bool Initialize();
    virtual void ShutDown();

    virtual void OnRequest(ContextHeadPtr context_head, RequestPtr request);//�ͻ�������
    virtual void OnSocketConnect(ContextHeadPtr context_head, RequestPtr request);//socket���ӽ���
    virtual void OnSocketValidated(ContextHeadPtr context_head, RequestPtr request);//socket������֤�ɹ�
    virtual void OnSocketClose(ContextHeadPtr context_head, RequestPtr request);//socket���ӶϿ�

    void PostWork(WorkContent work);//��work��ӵ���������
    void DispatchWork(WorkContent work);//�ַ�work������ǰ�߳�Ϊ�����̣߳�ֱ��ִ��work������work��ӵ��������С�
    void PutRequestToServer(const ContextHead& context_head, const Request& request);
    void PutRequestToServer(ContextHeadPtr context_head, RequestPtr request);
private:
    bool StartWorkService();
    bool StopWorkService();

    void OnSocketStatus(SocketStatus status, SessionID id);//socket״̬�ص�
    void OnSocketMsg(SessionID id, DataPtr dataptr, std::size_t size);//socket��Ϣ�ص�
private:
    SocketServerPtr socket_server_;//asio socket����

    int work_thread_num_;//�����߳���
    std::vector<std::thread> work_threads_;//�����߳�
    boost::asio::io_service work_service_;//�������񣨳䵱�̳߳أ�
};

inline void WorkServer::PostWork(WorkContent work)
{
    work_service_.post(std::move(work));
}

inline void WorkServer::DispatchWork(WorkContent work)
{
    work_service_.dispatch(std::move(work));
}

inline void WorkServer::PutRequestToServer(ContextHeadPtr context_head, RequestPtr request)
{
    PostWork([this, context_head, request]()
        {
            OnRequest(context_head, request);
        });
}

inline void WorkServer::PutRequestToServer(const ContextHead& context_head, const Request& request)
{
    PutRequestToServer(std::make_shared<ContextHead>(context_head), std::make_shared<Request>(request));
}