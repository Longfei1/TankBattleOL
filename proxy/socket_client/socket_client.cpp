#include "socket_client.h"
#include "common/log/log.h"

using namespace boost::asio;

#define MEM_CALL1(self, func)                                                       \
[self](const boost::system::error_code& error)                                      \
{                                                                                   \
    ((*self).*(func))(error);                                                       \
}                                                                                   \

#define MEM_CALL2(self, func)                                                       \
[self](const boost::system::error_code& error, const std::size_t& size)             \
{                                                                                   \
    ((*self).*(func))(error, size);                                                 \
}                                                                                   \

AsioSockClient::AsioSockClient(boost::asio::io_service& service, ConnectSession::SessionIDPtr client_session,
    SocketStatusCallback status_callback, SocketMsgCallback msg_callback)
    : status_callback_(status_callback), msg_callback_(msg_callback)
{
    ip::tcp::socket sock(make_strand(service));
    session_ = std::make_shared<ConnectSession>(std::move(sock));
    session_->session_id_ = client_session;
}

void AsioSockClient::ConnectServer(std::string ip, int port, std::string hello_data)
{
    auto self = shared_from_this();
    boost::asio::post(session_->socket_.get_executor(), [self, ip, port, hello_data]()
        {
            self->ip_ = ip;
            self->port_ = port;
            self->hello_data_ = hello_data;

            if (self->session_->status_ != SocketStatus::INIT)
            {
                self->CloseConnectSession();
                self->session_->status_ = SocketStatus::INIT;
            }

            self->DoConnect();
        });
}

void AsioSockClient::CloseConnection()
{
    auto self = shared_from_this();
    boost::asio::post(session_->socket_.get_executor(), [self]()
        {
            self->CloseConnectSession(false); //外部接口关闭连接，不在分发socketclose消息事件
        });
}

void AsioSockClient::SendData(const Byte* senddata, std::size_t size)
{
    if (senddata && size > 0)
    {
        ProtocalHead head = { size };
        DataPtr data = DataPtr(new Byte[size + sizeof(ProtocalHead)], [](Byte* p)
            {
                delete[] p;
            });

        memcpy(data.get(), &head, sizeof(ProtocalHead));
        memcpy(data.get() + sizeof(ProtocalHead), senddata, size);

        boost::asio::post(session_->socket_.get_executor(), [this, data]()
            {
                session_->write_queue_.push(data);//加入发送队列

                if (session_->write_queue_.size() > 1)//有消息正在发送
                {
                    return;
                }

                TryWriteDataPackage();
            });
    }
}

void AsioSockClient::DoConnect()
{
    ip::tcp::endpoint ep(ip::address::from_string(ip_), port_);

    auto self = shared_from_this();
    session_->socket_.async_connect(ep, MEM_CALL1(self, &AsioSockClient::OnConnect));
}

void AsioSockClient::OnConnect(const boost::system::error_code& error)
{
    if (CheckIOState(error))
    {
        DoValidateHello();//验证连接

        session_->status_ = SocketStatus::CONNECTED;
        OnSocketConnect();
    }
}

void AsioSockClient::DoValidateHello()
{
    auto self = shared_from_this();
    async_write(session_->socket_, buffer(hello_data_), MEM_CALL2(self, &AsioSockClient::OnValidateHello));
}

void AsioSockClient::OnValidateHello(const boost::system::error_code& error, const std::size_t& size)
{
    if (CheckIOState(error))
    {
        if (size == hello_data_.size())
        {
            if (0 == strncmp(session_->read_buffer_, hello_data_.c_str(), hello_data_.size()))
            {
                //验证成功
                session_->status_ = SocketStatus::VALIDATED;
                OnSocketValidated();

                DoReadDataPackage();//开始接收数据包

                TryWriteDataPackage();//尝试是否有数据需要发送
            }
            else
            {
                LOG_WARN("OnValidateHello failed");
                CloseConnectSession();
            }
        }
        else
        {
            LOG_ERROR("OnValidateHello error, readsize(%d) bigger than expected!(%d)", session_->read_size_, hello_data_.size());
            CloseConnectSession();
        }
    }
}

void AsioSockClient::DoReadDataPackage()
{
    if (session_->read_location == ConnectSession::BUFFER)//
    {
        auto self = shared_from_this();
        session_->socket_.async_receive(
            buffer(session_->read_buffer_ + session_->read_size_, sizeof(session_->read_buffer_) - session_->read_size_),
            MEM_CALL2(self, &AsioSockClient::OnReadDataPackage));
    }
    else if (session_->read_location == ConnectSession::DATA)
    {
        auto self = shared_from_this();
        session_->socket_.async_receive(
            buffer(session_->read_data_.dataptr.get() + session_->read_size_, session_->read_data_.head.data_len - session_->read_size_),
            MEM_CALL2(self, &AsioSockClient::OnReadDataPackage));
    }
}

void AsioSockClient::OnReadDataPackage(const boost::system::error_code& error, const std::size_t& size)
{
    if (CheckIOState(error))
    {
        session_->read_size_ += size;
        if (session_->read_location == ConnectSession::BUFFER)//
        {
            Byte* start_pos = session_->read_buffer_;
            auto left_size = session_->read_size_;

            auto create_and_copy_data = [this, &start_pos, &left_size](std::size_t create_size, std::size_t copy_size)
            {
                session_->read_data_.dataptr.reset(new Byte[create_size], [](Byte* p)
                    {
                        delete[] p;
                    });

                memcpy(&session_->read_data_.head, start_pos, sizeof(ProtocalHead));//拷贝ProtocalHead
                memcpy(session_->read_data_.dataptr.get(), start_pos + sizeof(ProtocalHead), copy_size);//拷贝dataptr
                start_pos += sizeof(ProtocalHead) + copy_size;
                left_size -= sizeof(ProtocalHead) + copy_size;
            };

            while (left_size >= sizeof(ProtocalHead))
            {
                auto head = reinterpret_cast<ProtocalHead*>(start_pos);

                if (left_size >= sizeof(ProtocalHead) + head->data_len)//已读取完整个数据包
                {
                    create_and_copy_data(head->data_len, head->data_len);

                    OnSocketMsg(session_->read_data_.dataptr, head->data_len);//分发数据包
                }
                else
                {
                    if (sizeof(session_->read_buffer_) >= sizeof(ProtocalHead) + head->data_len)//缓冲区足够容纳数据包
                    {
                    }
                    else
                    {
                        //缓冲区不够容纳数据包，采用动态数据区读取，以达到粘包目的。

                        session_->read_location = ConnectSession::DATA; //下一次从数据区读取
                        session_->read_size_ = left_size - sizeof(ProtocalHead);//已读数据区长度

                        create_and_copy_data(head->data_len, left_size - sizeof(ProtocalHead));

#ifndef NO_CLEAR_BUFFER
                        memset(session_->read_buffer_, 0, session_->read_size_);
#endif
                    }
                    break;
                }
            }

            //整理缓冲区，继续读取数据包
            if (session_->read_location == ConnectSession::BUFFER && session_->read_buffer_ != start_pos)
            {
                memcpy(session_->read_buffer_, start_pos, left_size);
#ifndef NO_CLEAR_BUFFER
                memset(session_->read_buffer_ + left_size, 0, sizeof(session_->read_buffer_) - left_size);
#endif
                session_->read_size_ = left_size;
            }
        }
        else if (session_->read_location == ConnectSession::DATA)
        {
            if (session_->read_size_ == session_->read_data_.head.data_len)
            {
                OnSocketMsg(session_->read_data_.dataptr, session_->read_data_.head.data_len);//分发数据包

                session_->read_location = ConnectSession::BUFFER; //恢复为从缓冲区读取
                session_->read_size_ = 0;
            }
            else if (session_->read_size_ > session_->read_data_.head.data_len)
            {
                LOG_ERROR("OnReadDataPackage error, readsize(%d) bigger than expected(%d)!", session_->read_size_, session_->read_data_.head.data_len);
                CloseConnectSession();
                return;
            }
        }
        DoReadDataPackage();//继续读取数据包
    }
}

void AsioSockClient::TryWriteDataPackage()
{
    if (session_->status_ == SocketStatus::VALIDATED
        && session_->write_queue_.size() > 0)
    {
        DoWriteDataPackage();
    }
}

void AsioSockClient::DoWriteDataPackage()
{
    auto self = shared_from_this();
    auto& msg = session_->write_queue_.front();
    auto total_size = reinterpret_cast<ProtocalHead*>(msg.get())->data_len + sizeof(ProtocalHead);
    async_write(session_->socket_, buffer(msg.get(), total_size), MEM_CALL2(self, &AsioSockClient::OnWriteDataPackage));
}

void AsioSockClient::OnWriteDataPackage(const boost::system::error_code& error, const std::size_t& size)
{
    if (CheckIOState(error))
    {
        auto msg = session_->write_queue_.front();
        session_->write_queue_.pop();

        auto total_size = reinterpret_cast<ProtocalHead*>(msg.get())->data_len + sizeof(ProtocalHead);

        if (size == total_size)
        {
            TryWriteDataPackage();//尝试写下一个数据
        }
        else
        {
            LOG_ERROR("OnWriteDataPackage error, writesize(%d) not equal expected(%d)!", size, total_size);
            CloseConnectSession();
        }
    }
}

bool AsioSockClient::CheckIOState(const boost::system::error_code& error)
{
    if (error)
    {
        if (error == error::operation_aborted)
        {
            return false;
        }

        if (error == error::eof || error == error::connection_reset)
        {
            LOG_DEBUG("AsioSockClient::CheckIOState socket close by client, sessionid:%d", *session_->session_id_);
        }
        LOG_DEBUG("AsioSockClient::CheckIOState socket io error(%d)", error);
        CloseConnectSession();

        return false;
    }
    else
    {
        return true;
    }
}
void AsioSockClient::CloseConnectSession(bool dispatch_event)
{
    if (session_->status_ == SocketStatus::CLOSED)
    {
        return;
    }

    session_->status_ = SocketStatus::CLOSED;
    session_->socket_.close();

    if (dispatch_event)
    {
        OnSocketClose();
    }
}

void AsioSockClient::OnSocketConnect()
{
    if (status_callback_)
    {
        status_callback_(SocketStatus::CONNECTED, *session_->session_id_);
    }
}

void AsioSockClient::OnSocketValidated() 
{
    if (status_callback_)
    {
        status_callback_(SocketStatus::VALIDATED, *session_->session_id_);
    }
}
void AsioSockClient::OnSocketClose()
{
    LOG_TRACE("AsioSockClient::OnSocketClose sessionid(%d)", *session_->session_id_);
    if (status_callback_)
    {
        status_callback_(SocketStatus::CLOSED, *session_->session_id_);
    }
}

void AsioSockClient::OnSocketMsg(DataPtr dataptr, std::size_t size)
{
    if (msg_callback_)
    {
        msg_callback_(*session_->session_id_, dataptr, size);
    }
}