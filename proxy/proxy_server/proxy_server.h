#pragma once
#include "base_library.h"
#include "common/define/socket_def.h"

class AsioWSServer;
class ClientsManager;
class ProxyServer : public boost::noncopyable
{
public:
    using WSServerPtr = std::shared_ptr<AsioWSServer>;
    using ClientsManagerPtr = std::shared_ptr<ClientsManager>;
public:
    ProxyServer(std::string server_ip, int server_port, int proxy_port = SOCK_DEFAULT_PORT + 1, 
        int io_threads = SOCK_IO_THREAD_NUM, std::string server_hello_data = SOCK_HELLO_DATA, 
        SessionID min_session = 1, SessionID max_session = SESSION_MAX_ID);
    ~ProxyServer() {}

    bool Initialize();
    void ShutDown();

private:
    void OnProxySocketStatus(SocketStatus status, SessionID id);//socket״̬�ص�
    void OnProxySocketMsg(SessionID id, DataPtr dataptr, std::size_t size);//socket��Ϣ�ص�
    void OnServerSocketStatus(SocketStatus status, SessionID id);//socket״̬�ص�
    void OnServerSocketMsg(SessionID id, DataPtr dataptr, std::size_t size);//socket��Ϣ�ص�

    bool GetServerSessionID(SessionID proxy_id, SessionID& server_id);
    bool GetProxySessionID(SessionID server_id, SessionID& proxy_id);
    void AddSessionRelation(SessionID proxy_id, SessionID server_id);
    void RemoveSessionRelation(SessionID proxy_id);
private:
    std::string server_ip_;//���ӷ���ip
    int server_port_;//���ӷ���˿�

    int proxy_port_;//�����������˿�

    int io_thread_num_;//io�߳���

    std::string server_hello_data_;

    WSServerPtr ws_server_;//websocket����
    ClientsManagerPtr clients_manager_;//clients������

    std::mutex session_relation_mtx_;
    std::unordered_map<SessionID, SessionID> session_relation_;//<proxy, server>
};