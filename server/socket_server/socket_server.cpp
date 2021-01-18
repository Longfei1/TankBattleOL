#include "socket_server.h"
#include "common/log/log.h"

using namespace boost::asio;

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

AsioSockServer::AsioSockServer(SocketStatusCallback status_callback, SocketMsgCallback msg_callback,
    int port, int io_threads, std::string hello_data, SessionID min_session, SessionID max_session) 
    : port_(port), io_thread_num_(io_threads), hello_data_(std::move(hello_data)),
    socket_(nullptr), acceptor_(nullptr), session_generator_(min_session, max_session),
    status_callback_(status_callback), msg_callback_(msg_callback),
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

    //��ʼ���׽���
    if (!InitSocket())
    {
        return false;
    }

    //����io����
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

    ClearConnectSessionMap();
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

        boost::asio::post(session->socket_.get_executor(), [this, session, data]()
            {
                session->write_queue_.push(data);//���뷢�Ͷ���

                if (session->write_queue_.size() > 1)//����Ϣ���ڷ���
                {
                    return;
                }

                TryWriteDataPackage(session);
            });
    }
}

void AsioSockServer::CloseConnection(SessionID id)
{
    auto session = GetConnectSession(id);
    if (session)
    {
        boost::asio::post(session->socket_.get_executor(), [this, session]()
            {
                CloseConnectSession(session, false);//�ⲿ�ӿڹر����ӣ����ڷַ�socketclose��Ϣ�¼�
            });
    }
}

bool AsioSockServer::InitSocket()
{
    socket_.reset(new ip::tcp::socket(io_service_));

    ip::tcp::endpoint ep(ip::tcp::v4(), port_);
    acceptor_.reset(new ip::tcp::acceptor(io_service_, ep));
    acceptor_->set_option(socket_base::reuse_address(true));

    DoAccept();//��ʼ��������
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
        io_threads_.emplace_back([this]() //�豣֤this����������
            {
                io_service_.run();
            });
    }
    return true;
}

bool AsioSockServer::StopIOService()
{
    io_service_.stop();//ֹͣ����
    for (auto& th : io_threads_)
    {
        th.join();//�ȴ�IO�߳̽���
    }
    io_threads_.clear();
    return true;
}

void AsioSockServer::DoAccept()
{
    //ÿ��socketʹ���Լ���strand
    acceptor_->async_accept(make_strand(io_service_), MEM_CALL1(OnAccept));
}

void AsioSockServer::OnAccept(const boost::system::error_code& error, boost::asio::ip::tcp::socket socket)
{
    if (!error)
    {
        auto id = GenerateSessionID();
        if (IsSessionIDValid(id))//sessionid��Ч
        {
            auto session = std::make_shared<ConnectSession>(std::move(socket));
            session->session_id_.reset(new SessionID(id), [this](SessionID* pID)
                {
                    ReturnSessionID(*pID);
                    delete pID;
                });

            AddConnectSession(session);//��ӿͻ�������
            
            DoValidateHello(session);//�ȴ���֤�ͻ��˷���Hello��Ϣ

            session->status_ = SocketStatus::CONNECTED;
            OnSocketConnect(*session->session_id_);//���ӳɹ�

            //DoAccept();//������������
        }
        else
        {
            LOG_ERROR("OnAccept error, not have enough sessionid!");
        }
        DoAccept();//������������
    }
    else
    {
        LOG_ERROR("OnAccept error, error(%d)", error);
    }
}

void AsioSockServer::DoValidateHello(ConSessionPtr session)
{
    //hello data ���Ȳ��ܴ��ڻ�����
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
            DoValidateHello(session);//������ȡhello����
        }
        else if (session->read_size_ == hello_data_.size())
        {
            if (0 == strncmp(session->read_buffer_, hello_data_.c_str(), hello_data_.size()))
            {
                //��֤�ɹ�
                session->status_ = SocketStatus::VALIDATED;
                OnSocketValidated(*session->session_id_);

#ifndef NO_CLEAR_BUFFER
                memset(session->read_buffer_, 0, session->read_size_);
#endif
                session->read_size_ = 0;

                DoReadDataPackage(session);//������ȡ����

                TryWriteDataPackage(session);
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
        session->socket_.async_receive(
            buffer(session->read_buffer_ + session->read_size_, sizeof(session->read_buffer_) - session->read_size_),
            MEM_CALL2(session, OnReadDataPackage));
    }
    else if (session->read_location == ConnectSession::DATA)
    {
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

                memcpy(&session->read_data_.head, start_pos, sizeof(ProtocalHead));//����ProtocalHead
                memcpy(session->read_data_.dataptr.get(), start_pos + sizeof(ProtocalHead), copy_size);//����dataptr
                start_pos += sizeof(ProtocalHead) + copy_size;
                left_size -= sizeof(ProtocalHead) + copy_size;
            };

            while (left_size >= sizeof(ProtocalHead))
            {
                auto head = reinterpret_cast<ProtocalHead*>(start_pos);
                
                if (left_size >= sizeof(ProtocalHead) + head->data_len)//�Ѷ�ȡ���������ݰ�
                {
                    create_and_copy_data(head->data_len, head->data_len);

                    OnSocketMsg(*session->session_id_, session->read_data_.dataptr, head->data_len);//�ַ����ݰ�
                }
                else
                {
                    if (sizeof(session->read_buffer_) >= sizeof(ProtocalHead) + head->data_len)//�������㹻�������ݰ�
                    {
                    }
                    else
                    {
                        //�����������������ݰ������ö�̬��������ȡ���Դﵽճ��Ŀ�ġ�

                        session->read_location = ConnectSession::DATA; //��һ�δ���������ȡ
                        session->read_size_ = left_size - sizeof(ProtocalHead);//�Ѷ�����������

                        create_and_copy_data(head->data_len, left_size - sizeof(ProtocalHead));

#ifndef NO_CLEAR_BUFFER
                        memset(session->read_buffer_, 0, session->read_size_);
#endif
                    }
                    break;
                }
            }

            //����������������ȡ���ݰ�
            if (session->read_location == ConnectSession::BUFFER && session->read_buffer_ != start_pos)
            {
                memcpy(session->read_buffer_, start_pos, left_size);
#ifndef NO_CLEAR_BUFFER
                memset(session->read_buffer_ + left_size, 0, sizeof(session->read_buffer_) - left_size);
#endif
                session->read_size_ = left_size;
            }
        }
        else if (session->read_location == ConnectSession::DATA)
        {
            if (session->read_size_ == session->read_data_.head.data_len)
            {
                OnSocketMsg(*session->session_id_, session->read_data_.dataptr, session->read_data_.head.data_len);//�ַ����ݰ�

                session->read_location = ConnectSession::BUFFER; //�ָ�Ϊ�ӻ�������ȡ
                session->read_size_ = 0;
            }
            else if (session->read_size_ > session->read_data_.head.data_len)
            {
                LOG_ERROR("OnReadDataPackage error, readsize(%d) bigger than expected(%d)!", session->read_size_, session->read_data_.head.data_len);
                CloseConnectSession(session);
                return;
            }
        }
        DoReadDataPackage(session);//������ȡ���ݰ�
    }
}

void AsioSockServer::TryWriteDataPackage(ConSessionPtr session)
{
    if (session->status_ == SocketStatus::VALIDATED 
        && session->write_queue_.size() > 0)
    {
        DoWriteDataPackage(session);
    }
}

void AsioSockServer::DoWriteDataPackage(ConSessionPtr session)
{
    auto& msg = session->write_queue_.front();
    auto total_size = reinterpret_cast<ProtocalHead*>(msg.get())->data_len + sizeof(ProtocalHead);
    async_write(session->socket_, buffer(msg.get(), total_size), MEM_CALL2(session, OnWriteDataPackage));
}

void AsioSockServer::OnWriteDataPackage(ConSessionPtr session, const boost::system::error_code& error, const std::size_t& size)
{
    if (CheckIOState(session, error))
    {
        auto msg = session->write_queue_.front();
        session->write_queue_.pop();

        auto total_size = reinterpret_cast<ProtocalHead*>(msg.get())->data_len + sizeof(ProtocalHead);

        if (size == total_size)
        {
            TryWriteDataPackage(session);//����д��һ������
        }
        else
        {
            LOG_ERROR("OnWriteDataPackage error, writesize(%d) not equal expected(%d)!", size, total_size);
            CloseConnectSession(session);
        }
    }
}

bool AsioSockServer::CheckIOState(ConSessionPtr session, const boost::system::error_code& error)
{
    if (error)
    {
        if (error == error::operation_aborted)
        {
            return false;
        }

        if (error == error::eof || error == error::connection_reset)
        {
            LOG_DEBUG("AsioSockServer::CheckIOState socket close by client, sessionid:%d", *session->session_id_);
        }
        LOG_DEBUG("AsioSockServer::CheckIOState socket io error(%d)", error);
        CloseConnectSession(session);
	    
        return false;
    }
    else
    {
        return true;
    }
}

void AsioSockServer::CloseConnectSession(ConSessionPtr session, bool dispatch_event)
{
    if (session->status_ == SocketStatus::CLOSED)
    {
        return;
    }

    session->socket_.close();
    RemoveConnectSession(session);
    if (dispatch_event)
    {
        OnSocketClose(*session->session_id_);
    }
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
    LOG_TRACE("AsioSockServer::OnSocketClose sessionid(%d)", id);
    if (status_callback_)
    {
        status_callback_(SocketStatus::CLOSED, id);
    }
}

void AsioSockServer::OnSocketMsg(SessionID id, DataPtr dataptr, std::size_t size)
{
    if (msg_callback_)
    {
        msg_callback_(id, dataptr, size);
    }
}
