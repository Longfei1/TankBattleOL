#pragma once
#include "base_library.h"
#include "common/define/socket_def.h"

class AsioWSServer;
class ClientsManager;
class ProxyServer;

class ProxySocketHandler : public ISocketHandler
{
public:
    ProxySocketHandler(ProxyServer* server) : server_(server) {}

	//socket状态
    virtual void OnSocketStatus(SocketStatus status, SessionID id) override;
	//socket消息
    virtual void OnSocketMsg(SessionID id, DataPtr dataptr, std::size_t size) override;

private:
    ProxyServer* server_;
};

class ServerSocketHandler : public ISocketHandler
{
public:
    ServerSocketHandler(ProxyServer* server) : server_(server) {}

	//socket状态
    virtual void OnSocketStatus(SocketStatus status, SessionID id) override;
	//socket消息
    virtual void OnSocketMsg(SessionID id, DataPtr dataptr, std::size_t size) override;

private:
	ProxyServer* server_;
};

class ProxyServer : public boost::noncopyable
{
    friend ProxySocketHandler;
    friend ServerSocketHandler;
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
    void OnProxySocketStatus(SocketStatus status, SessionID id);//socket状态回调
    void OnProxySocketMsg(SessionID id, DataPtr dataptr, std::size_t size);//socket消息回调
    void OnServerSocketStatus(SocketStatus status, SessionID id);//socket状态回调
    void OnServerSocketMsg(SessionID id, DataPtr dataptr, std::size_t size);//socket消息回调

    bool GetServerSessionID(SessionID proxy_id, SessionID& server_id);
    bool GetProxySessionID(SessionID server_id, SessionID& proxy_id);
    void AddSessionRelation(SessionID proxy_id, SessionID server_id);
    void RemoveSessionRelation(SessionID proxy_id);
private:
    std::string server_ip_;//连接服务ip
    int server_port_;//连接服务端口

    int proxy_port_;//代理服务监听端口

    int io_thread_num_;//io线程数

    std::string server_hello_data_;

    WSServerPtr ws_server_;//websocket服务
    ClientsManagerPtr clients_manager_;//clients管理器

    std::mutex session_relation_mtx_;
    std::unordered_map<SessionID, SessionID> session_relation_;//<proxy, server>

    ProxySocketHandler proxy_handler_;
    ServerSocketHandler server_handler_;
};

inline void ProxySocketHandler::OnSocketStatus(SocketStatus status, SessionID id)
{
	if (server_)
	{
		server_->OnProxySocketStatus(status, id);
	}
}

inline void ProxySocketHandler::OnSocketMsg(SessionID id, DataPtr dataptr, std::size_t size)
{
	if (server_)
	{
		server_->OnProxySocketMsg(id, dataptr, size);
	}
}

inline void ServerSocketHandler::OnSocketStatus(SocketStatus status, SessionID id)
{
	if (server_)
	{
		server_->OnServerSocketStatus(status, id);
	}
}

inline void ServerSocketHandler::OnSocketMsg(SessionID id, DataPtr dataptr, std::size_t size)
{
	if (server_)
	{
		server_->OnServerSocketMsg(id, dataptr, size);
	}
}