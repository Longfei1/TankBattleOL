#include "ws_server.h"
#include "common/log/log.h"

using namespace boost::asio;
using namespace boost::beast;

#define MEM_CALL1(func)                                                             \
[this](const boost::system::error_code& error, ip::tcp::socket socket)              \
{                                                                                   \
    func(error, std::move(socket));                                                 \
}                                                                                   \

#define MEM_CALL2(session, func)                                                    \
[this, session](const boost::system::error_code& error, const std::size_t& size)    \
{                                                                                   \
    func(session, error, size);                                                     \
}                                                                                   \

AsioWSServer::AsioWSServer(SocketStatusCallback status_callback, SocketMsgCallback msg_callback,
    int port, int io_threads, SessionID min_session, SessionID max_session) 
    :port_(port), io_thread_num_(io_threads), socket_(nullptr),
    acceptor_(nullptr), session_generator_(min_session, max_session), 
    status_callback_(status_callback), msg_callback_(msg_callback),
    running_(false)
{
}

AsioWSServer::~AsioWSServer()
{
    if (running_)
    {
        ShutDown();
    }
}

bool AsioWSServer::Initialize()
{
    bool expect = false;
    if (!running_.compare_exchange_strong(expect, true))
    {
        return false;
    }

    //初始化套接字
    if (!InitSocket())
    {
        return false;
    }

    //运行io服务
    if (!StartIOService())
    {
        return false;
    }

    return true;
}

void AsioWSServer::ShutDown()
{
    bool expect = true;
    if (!running_.compare_exchange_strong(expect, false))
    {
        return;
    }

    StopIOService();

    UnInitSocket();

    ClearConnectSessionMap();
}

//void AsioWSServer::SetSocketStatusCallback(SocketStatusCallback callback)
//{
//    status_callback_ = std::move(callback);
//}
//
//void AsioWSServer::SetSocketMsgCallback(SocketMsgCallback callback)
//{
//    msg_callback_ = std::move(callback);
//}

void AsioWSServer::SendData(SessionID id, const Byte* senddata, std::size_t size)
{
    ConSessionPtr session = GetConnectSession(id);
    if (session && senddata && size > 0)
    {
        DataPtr data = DataPtr(new Byte[size + sizeof(ProtocalHead)], [](Byte* p)
            {
                delete[] p;
            });

        memcpy(data.get(), senddata, size);

        SendData(id, data, size);
    }
}

void AsioWSServer::SendData(SessionID id, DataPtr dataptr, std::size_t size)
{
    ConSessionPtr session = GetConnectSession(id);
    if (session && dataptr && size > 0)
    {
        boost::asio::post(session->socket_.get_executor(), [this, session, dataptr, size]()
            {
                session->write_queue_.push(std::make_pair(size, dataptr));//加入发送队列

                if (session->write_queue_.size() > 1)//有消息正在发送
                {
                    return;
                }

                TryWriteDataPackage(session);
            });
    }
}

void AsioWSServer::CloseConnection(SessionID id)
{
    auto session = GetConnectSession(id);
    if (session)
    {
        boost::asio::post(session->socket_.get_executor(), [this, session]()
            {
                CloseConnectSession(session, false);
            });
    }
}

bool AsioWSServer::InitSocket()
{
    socket_.reset(new ip::tcp::socket(io_service_));

    ip::tcp::endpoint ep(ip::tcp::v4(), port_);
    acceptor_.reset(new ip::tcp::acceptor(io_service_, ep));

    DoAccept();//开始接收连接
    return true;
}

bool AsioWSServer::UnInitSocket()
{
    socket_->close();
    return true;
}

bool AsioWSServer::StartIOService()
{
    for (int i = 0; i < io_thread_num_; i++)
    {
        io_threads_.emplace_back([this]() //需保证this的生存周期
            {
                io_service_.run();
            });
    }
    return true;
}

bool AsioWSServer::StopIOService()
{
    io_service_.stop();//停止服务
    for (auto& th : io_threads_)
    {
        th.join();//等待IO线程结束
    }
    io_threads_.clear();
    return true;
}

void AsioWSServer::InitSocketOption(ConSessionPtr session)
{
    session->socket_.set_option(
		websocket::stream_base::timeout::suggested(
			role_type::server));

    session->socket_.binary(true);

	//设置握手装饰器
    session->socket_.set_option(websocket::stream_base::decorator(
		[](websocket::response_type& res)
		{
			res.set(http::field::server, "AsioWSServer");
		}));
}

void AsioWSServer::DoAccept()
{
    //每个socket使用自己的strand
    acceptor_->async_accept(make_strand(io_service_), MEM_CALL1(OnAccept));
}

void AsioWSServer::OnAccept(const boost::system::error_code& error, boost::asio::ip::tcp::socket socket)
{
    if (!error)
    {
        auto id = GenerateSessionID();
        if (IsSessionIDValid(id))//sessionid有效
        {
            auto session = std::make_shared<WSConnectSession>(std::move(socket));
            session->session_id_.reset(new SessionID(id), [this](SessionID* pID)
                {
                    ReturnSessionID(*pID);
                    delete pID;
                });

            AddConnectSession(session);//添加客户端连接
            
            InitSocketOption(session);
            DoShakeHand(session);//开始握手

            session->status_ = SocketStatus::CONNECTED;
            OnSocketConnect(*session->session_id_);//连接成功
        }
        else
        {
            LOG_ERROR("OnAccept error, not have enough sessionid!");
            socket.close();
        }
        DoAccept();//继续监听连接
    }
    else
    {
        LOG_ERROR("OnAccept error, error(%d)", error);
    }
}

void AsioWSServer::DoShakeHand(ConSessionPtr session)
{
    //开始握手
    session->socket_.async_accept([this, session](const boost::system::error_code& error)    
        {
            OnShakeHand(session, error);
        });
}

void AsioWSServer::OnShakeHand(ConSessionPtr session, const boost::system::error_code& error)
{
    if (CheckIOState(session, error))
    {
        session->status_ = SocketStatus::VALIDATED;
        OnSocketValidated(*session->session_id_);

        DoReadDataPackage(session);//开始读取数据

        TryWriteDataPackage(session);//尝试发送数据
    }
}

void AsioWSServer::DoReadDataPackage(ConSessionPtr session)
{
    session->socket_.async_read(session->read_buffer_, MEM_CALL2(session, OnReadDataPackage));
}

void AsioWSServer::OnReadDataPackage(ConSessionPtr session, const boost::system::error_code& error, const std::size_t& size)
{
    if (CheckIOState(session, error))
    {
        auto read_size = session->read_buffer_.size();
        if (read_size == size)
        {
            DataPtr dataptr(new Byte[size], [](Byte* p)
                {
                    delete[] p;
                });
            memcpy(dataptr.get(), session->read_buffer_.data().data(), size);

            session->read_buffer_.consume(read_size);

            OnSocketMsg(*session->session_id_, dataptr, size);//分发数据包
        }
        else
        {
            LOG_ERROR("OnReadDataPackage error, buffersize(%d) not equal expected(%d)!", read_size, size);
            CloseConnectSession(session);

        }
            
        DoReadDataPackage(session);//继续读取数据包
    }
}

void AsioWSServer::TryWriteDataPackage(ConSessionPtr session)
{
    if (session->status_ == SocketStatus::VALIDATED
        && session->write_queue_.size() > 0)
    {
        DoWriteDataPackage(session);
    }
}

void AsioWSServer::DoWriteDataPackage(ConSessionPtr session)
{
    auto& msg = session->write_queue_.front();
    session->socket_.async_write(buffer(msg.second.get(), msg.first), MEM_CALL2(session, OnWriteDataPackage));
}

void AsioWSServer::OnWriteDataPackage(ConSessionPtr session, const boost::system::error_code& error, const std::size_t& size)
{
    if (CheckIOState(session, error))
    {
        auto msg = session->write_queue_.front();
        session->write_queue_.pop();

        if (size == msg.first)
        {
            TryWriteDataPackage(session);//继续写数据包
        }
        else
        {
            LOG_ERROR("OnWriteDataPackage error, writesize(%d) not equal expected(%d)!", size, msg.first);
            CloseConnectSession(session);
        }
    }
}

bool AsioWSServer::CheckIOState(ConSessionPtr session, const boost::system::error_code& error)
{
    if (error)
    {
        if (error == boost::asio::error::operation_aborted)
        {
            return false;
        }

        if (error == websocket::error::closed 
            || error == boost::asio::error::eof 
            || error == boost::asio::error::connection_reset)
        {
            LOG_DEBUG("AsioWSServer::CheckIOState socket close by client, sessionid:%d", *session->session_id_);
        }
        LOG_DEBUG("AsioWSServer::CheckIOState socket io error(%d)", error);
        CloseConnectSession(session);

        return false;
    }
    else
    {
        return true;
    }
}

void AsioWSServer::CloseConnectSession(ConSessionPtr session, bool dispatch_event)
{
    if (session->status_ == SocketStatus::CLOSED)
    {
        return;
    }

    session->status_ = SocketStatus::CLOSED;
    if (session->socket_.is_open())
    {
        session->socket_.close(websocket::close_reason());
    }
    RemoveConnectSession(session);

    if (dispatch_event)
    {
        OnSocketClose(*session->session_id_);
    }
}

void AsioWSServer::OnSocketConnect(SessionID id)
{
    if (status_callback_)
    {
        status_callback_(SocketStatus::CONNECTED, id);
    }
}

void AsioWSServer::OnSocketValidated(SessionID id)
{
    if (status_callback_)
    {
        status_callback_(SocketStatus::VALIDATED, id);
    }
}

void AsioWSServer::OnSocketClose(SessionID id)
{
    LOG_TRACE("AsioWSServer::OnSocketClose sessionid(%d)", id);
    if (status_callback_)
    {
        status_callback_(SocketStatus::CLOSED, id);
    }
}

void AsioWSServer::OnSocketMsg(SessionID id, DataPtr dataptr, std::size_t size)
{
    if (msg_callback_)
    {
        msg_callback_(id, dataptr, size);
    }
}
