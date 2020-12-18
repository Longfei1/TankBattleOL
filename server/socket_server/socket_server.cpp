#include "socket_server.h"
#include "log/log.h"

using namespace boost::asio;

#define MEM_CALL1(session, func)                                                    \
[this, session](const boost::system::error_code& error)                             \
{                                                                                   \
    func(session, error);                                                           \
}                                                                                   \

#define MEM_CALL2(session, func)                                                    \
[this, session](const boost::system::error_code& error, const std::size_t& size)    \
{                                                                                   \
    func(session, error, size);                                                     \
}                                                                                   \


ConnectSession::ConnectSession(boost::asio::io_service& service
) : session_id_(0), socket_(service), read_location(BUFFER), is_writing_(false)
{
    static_assert(sizeof(ProtocalHead) < sizeof(ConnectSession::read_buffer_));//协议头不能大于读缓冲区

    memset(&read_data_.head, 0, sizeof(read_data_.head));
    read_data_.dataptr = nullptr;

    write_data_ = nullptr;
}

AsioSockServer::AsioSockServer(SocketStatusCallback status_callback, SocketMsgCallback msg_callback,
    std::string ip, int port, int io_threads, std::string hello_data, SessionID min_session, SessionID max_session) 
    : ip_(std::move(ip)), port_(port), io_thread_num_(0), hello_data_(std::move(hello_data_)), 
    min_session_(min_session), max_session_(max_session), socket_(nullptr), acceptor_(nullptr), 
    session_generator_(min_session, max_session), status_callback_(status_callback), msg_callback_(msg_callback),
    running_(false)
{
}

AsioSockServer::~AsioSockServer()
{
    if (running_)
    {
        ShutDown();
    }
}

bool AsioSockServer::Initialize()
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

void AsioSockServer::ShutDown()
{
    bool expect = true;
    if (!running_.compare_exchange_strong(expect, false))
    {
        return;
    }

    StopIOService();

    UnInitSocket();
}

//void AsioSockServer::SetSocketStatusCallback(SocketStatusCallback callback)
//{
//    status_callback_ = std::move(callback);
//}
//
//void AsioSockServer::SetSocketMsgCallback(SocketMsgCallback callback)
//{
//    msg_callback_ = std::move(callback);
//}

void AsioSockServer::SendData(SessionID id, const Byte* senddata, std::size_t size)
{
    ConSessionPtr session = GetConnectSession(id);
    if (session && senddata && size > 0)
    {
        ProtocalHead head = { size };
        DataPtr data = DataPtr(new Byte[size + sizeof(ProtocalHead)], [](Byte* p)
            {
                delete[] p;
            });

        memcpy(data.get(), &head, sizeof(ProtocalHead));
        memcpy(data.get() + sizeof(ProtocalHead), senddata, size);

        bool can_write = false;
        {
            std::lock_guard<std::mutex> lock(session->write_mtx_);
            if (!session->is_writing_ && session->write_queue_.size() == 0)//队列为空且无正在发送的数据，可以直接发送
            {
                can_write = true;
                session->is_writing_ = true;

                session->write_data_ = data;
            }
            else
            {
                session->write_queue_.push(data);
            }
        }

        if (can_write)
        {
            DoWriteDataPackage(session);
        }
    }
}

void AsioSockServer::CloseConnect(SessionID id)
{
    auto session = GetConnectSession(id);
    if (session)
    {
        CloseConnectSession(session);
    }
}

bool AsioSockServer::InitSocket()
{
    socket_.reset(new ip::tcp::socket(io_service_));

    ip::tcp::endpoint ep(ip::address::from_string(ip_), port_);
    acceptor_.reset(new ip::tcp::acceptor(io_service_, ep));

    DoAccept();//开始接收连接
    return true;
}

bool AsioSockServer::UnInitSocket()
{
    socket_->close();
    return true;
}

bool AsioSockServer::StartIOService()
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

bool AsioSockServer::StopIOService()
{
    io_service_.stop();//停止服务
    for (auto& th : io_threads_)
    {
        th.join();//等待IO线程结束
    }
    io_threads_.clear();
    return true;
}

void AsioSockServer::DoAccept()
{
    auto new_session = std::make_shared<ConnectSession>(io_service_);
    acceptor_->async_accept(new_session->socket_, MEM_CALL1(new_session, OnAccept));
}

void AsioSockServer::OnAccept(ConSessionPtr session, const boost::system::error_code& error)
{
    if (!error)
    {
        auto id = GernerateSessionID();
        if (IsSessionIDValid(id))//sessionid有效
        {
            session->session_id_ = id;
            AddConnectSession(session);//添加客户端连接
            
            OnSocketConnect(session->session_id_);//连接成功
            
            DoValidateHello(session);//等待验证客户端发送Hello信息

            //DoAccept();//继续监听连接
        }
        else
        {
            LOG_ERROR("OnAccept error, not have enough sessionid!");
        }
        DoAccept();//继续监听连接
    }
    else
    {
        LOG_ERROR("OnAccept error, error(%d)", error);
    }
}

void AsioSockServer::DoValidateHello(ConSessionPtr session)
{
    //hello data 长度不能大于缓冲区

    std::lock_guard<std::mutex> lock(session->sock_mtx_);
    session->socket_.async_receive(
        buffer(session->read_buffer_ + session->read_size_, hello_data_.size() - session->read_size_),
        MEM_CALL2(session, OnValidateHello));
}

void AsioSockServer::OnValidateHello(ConSessionPtr session, const boost::system::error_code& error, const std::size_t& size)
{
    if (CheckIOState(session, error))
    {
        session->read_size_ += size;
        if (session->read_size_ < hello_data_.size())
        {
            DoValidateHello(session);//继续读取hello数据
        }
        else if (session->read_size_ == hello_data_.size())
        {
            if (0 == strncmp(session->read_buffer_, hello_data_.c_str(), hello_data_.size()))
            {
                //验证成功
                OnSocketValidated(session->session_id_);

#ifndef NO_CLEAR_BUFFER
                memset(session->read_buffer_, 0, session->read_size_);
#endif
                session->read_size_ = 0;

                DoReadDataPackage(session);//继续读取数据
            }
            else
            {
                LOG_WARN("OnValidateHello failed");
                CloseConnectSession(session);
            }
        }
        else
        {
            LOG_ERROR("OnValidateHello error, readsize(%d) bigger than expected!(%d)", session->read_size_, hello_data_.size());
            CloseConnectSession(session);
        }
    }
}

void AsioSockServer::DoReadDataPackage(ConSessionPtr session)
{
    if (session->read_location == ConnectSession::BUFFER)//
    {
        std::lock_guard<std::mutex> lock(session->sock_mtx_);
        session->socket_.async_receive(
            buffer(session->read_buffer_ + session->read_size_, sizeof(session->read_buffer_) - session->read_size_),
            MEM_CALL2(session, OnReadDataPackage));
    }
    else if (session->read_location == ConnectSession::DATA)
    {
        std::lock_guard<std::mutex> lock(session->sock_mtx_);
        session->socket_.async_receive(
            buffer(session->read_data_.dataptr.get() + session->read_size_, session->read_data_.head.data_len - session->read_size_),
            MEM_CALL2(session, OnReadDataPackage));
    }
}

void AsioSockServer::OnReadDataPackage(ConSessionPtr session, const boost::system::error_code& error, const std::size_t& size)
{
    if (CheckIOState(session, error))
    {
        session->read_size_ += size;
        if (session->read_location == ConnectSession::BUFFER)//
        {
            Byte* start_pos = session->read_buffer_;
            auto left_size = session->read_size_;

            auto create_and_copy_data = [&session, &start_pos, &left_size](std::size_t create_size, std::size_t copy_size)
            {
                session->read_data_.dataptr.reset(new Byte[create_size], [](Byte* p)
                    {
                        delete[] p;
                    });

                memcpy(&session->read_data_.head, start_pos, sizeof(ProtocalHead));//拷贝ProtocalHead
                memcpy(session->read_data_.dataptr.get(), start_pos + sizeof(ProtocalHead), copy_size);//拷贝dataptr
                start_pos += sizeof(ProtocalHead) + copy_size;
                left_size -= sizeof(ProtocalHead) + copy_size;
            };

            while (left_size >= sizeof(ProtocalHead))
            {
                auto head = reinterpret_cast<ProtocalHead*>(start_pos);
                
                if (left_size >= sizeof(ProtocalHead) + head->data_len)//已读取完整个数据包
                {
                    create_and_copy_data(head->data_len, head->data_len);
                    session->read_size_ = left_size;

                    OnSocketMsg(session->session_id_, session->read_data_.dataptr, head->data_len);//分发数据包
                }
                else
                {
                    if (sizeof(session->read_buffer_) >= sizeof(ProtocalHead) + head->data_len)//缓冲区足够容纳数据包
                    {
                        //整理缓冲区，继续读取数据包
                        if (session->read_buffer_ != start_pos)
                        {
                            memcpy(session->read_buffer_, start_pos, left_size);
#ifndef NO_CLEAR_BUFFER
                            memset(session->read_buffer_ + left_size, 0, sizeof(session->read_buffer_) - left_size);
#endif
                        }
                    }
                    else
                    {
                        //缓冲区不够容纳数据包，采用动态数据区读取，以达到粘包目的。

                        session->read_location = ConnectSession::DATA; //下一次从数据区读取
                        session->read_size_ = left_size - sizeof(ProtocalHead);//已读数据区长度

                        create_and_copy_data(head->data_len, left_size - sizeof(ProtocalHead));

#ifndef NO_CLEAR_BUFFER
                        memset(session->read_buffer_, 0, session->read_size_);
#endif
                    }
                    break;
                }
            }
        }
        else if (session->read_location == ConnectSession::DATA)
        {
            if (session->read_size_ == session->read_data_.head.data_len)
            {
                OnSocketMsg(session->session_id_, session->read_data_.dataptr, session->read_data_.head.data_len);//分发数据包

                session->read_location = ConnectSession::BUFFER; //恢复为从缓冲区读取
                session->read_size_ = 0;
            }
            else if (session->read_size_ > session->read_data_.head.data_len)
            {
                LOG_ERROR("OnReadDataPackage error, readsize(%d) bigger than expected(%d)!", session->read_size_, session->read_data_.head.data_len);
                CloseConnectSession(session);
                return;
            }
        }
        DoReadDataPackage(session);//继续读取数据包
    }
}

void AsioSockServer::TryWriteDataPackage(ConSessionPtr session)
{
    bool can_write = false;
    {
        std::lock_guard<std::mutex> lock(session->write_mtx_);
        if (!session->is_writing_ && session->write_queue_.size() > 0)//没有正在写的内容时
        {
            can_write = true;
            session->is_writing_ = true;
            session->write_data_ = session->write_queue_.front();
            session->write_queue_.pop();
        }
    }

    if (can_write)
    {
        DoWriteDataPackage(session);
    }
}

void AsioSockServer::DoWriteDataPackage(ConSessionPtr session)
{
    //只有一个线程能进入写函数，这里不用给写缓冲加锁了
    std::lock_guard<std::mutex> lock(session->sock_mtx_);
    auto total_size = reinterpret_cast<ProtocalHead*>(session->write_data_.get())->data_len + sizeof(ProtocalHead);
    session->socket_.async_send(
        buffer(session->write_data_.get() + session->write_size_, total_size - session->write_size_),
        MEM_CALL2(session, OnWriteDataPackage));
}

void AsioSockServer::OnWriteDataPackage(ConSessionPtr session, const boost::system::error_code& error, const std::size_t& size)
{
    if (CheckIOState(session, error))
    {
        session->write_size_ += size;

        auto total_size = reinterpret_cast<ProtocalHead*>(session->write_data_.get())->data_len + sizeof(ProtocalHead);
        if (session->write_size_ < total_size)
        {
            DoWriteDataPackage(session);//继续写数据包
        }
        else if (session->write_size_ == total_size)
        {
            session->write_size_ = 0;

            {
                std::lock_guard<std::mutex> lock(session->write_mtx_);
                session->is_writing_ = false;
            }

            TryWriteDataPackage(session);//尝试写下一个数据
        }
        else
        {
            LOG_ERROR("OnWriteDataPackage error, writesize(%d) bigger than expected(%d)!", session->write_size_, total_size);
            CloseConnectSession(session);
        }
    }
}

bool AsioSockServer::CheckIOState(ConSessionPtr session, const boost::system::error_code& error)
{
    if (error)
    {
        if (error == error::eof || error == error::connection_reset)
        {
            LOG_DEBUG("socket close by client, sessionid:%d", session->session_id_);
        }
        LOG_DEBUG("socket io error(%d)", error);
        CloseConnectSession(session);
        return false;
    }
    else
    {
        return true;
    }
}

void AsioSockServer::CloseConnectSession(ConSessionPtr session)
{
    {
        std::lock_guard<std::mutex> lock(session->sock_mtx_);
        session->socket_.close();
    }
    RemoveConnectSession(session);
}

void AsioSockServer::OnSocketConnect(SessionID id)
{
    if (status_callback_)
    {
        status_callback_(SocketStatus::CONNECTED, id);
    }
}

void AsioSockServer::OnSocketValidated(SessionID id)
{
    if (status_callback_)
    {
        status_callback_(SocketStatus::VALIDATED, id);
    }
}

void AsioSockServer::OnSocketClose(SessionID id)
{
    if (status_callback_)
    {
        status_callback_(SocketStatus::CONNECTED, id);
    }
}

void AsioSockServer::OnSocketMsg(SessionID id, DataPtr dataptr, std::size_t size)
{
    if (msg_callback_)
    {
        msg_callback_(id, dataptr, size);
    }
}
