#include "socket_server.h"
#include "log.h"

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
) : session_id_(0), socket_(service), read_buffer_{}, is_writing_(false)
{
    ClearReadBuffer();
}

void ConnectSession::ClearReadBuffer()
{
    memset(read_buffer_, 0, sizeof(read_size_));
    read_size_ = 0;
    read_data_.size = 0;
    read_data_.dataptr = nullptr;
}

void ConnectSession::ClearWriteBuffer()
{
    write_size_ = 0;
    write_data_.size = 0;
    write_data_.dataptr = nullptr;
}

AsioSockServer::AsioSockServer()
{
    io_thread_num_ = 0;
    socket_ = nullptr;
    acceptor_ = nullptr;

   //session_generator_.Reset(1, SESSION_MAX_ID);
}

AsioSockServer::~AsioSockServer()
{

}

bool AsioSockServer::Initialize(int io_threads, int port, std::string hello_data, 
    SessionID min_session, SessionID max_session)
{
    io_thread_num_ = io_threads;
    port_ = port;

    hello_data_ = std::move(hello_data);

    min_session_ = min_session;
    max_session = max_session;
    session_generator_.Reset(min_session, max_session);

    //��ʼ���׽���
    InitSocket();

    //����io����
    StartIOService();

    return true;
}

void AsioSockServer::ShutDown()
{
    StopIOService();
}

void AsioSockServer::OnSocketConnect(SessionID id)
{
    LOG_INFO("session(%d) OnSocketConnect", id);
}

void AsioSockServer::OnSocketValidated(SessionID id)
{
    LOG_INFO("session(%d) OnSocketValidated", id);
}

void AsioSockServer::OnSocketClose(SessionID id)
{
    LOG_INFO("session(%d) OnSocketClose", id);
}

void AsioSockServer::OnSocketMsg(SessionID id, DataPtr dataptr, std::size_t size)
{
    SendData(id, dataptr, size);//��д����
}

void AsioSockServer::SendData(SessionID id, Byte* senddata, std::size_t size)
{
    ConSessionPtr session = GetConnectSession(id);
    if (session && senddata && size > 0)
    {
        ConnectSession::DataPackage package;
        package.size = size;
        package.dataptr.reset(new Byte[size], [](Byte* p)
            {
                delete[] p;
            });
        memcpy(package.dataptr.get(), senddata, size);

        bool can_write = false;
        {
            std::lock_guard<std::mutex> lock(session->write_mtx_);
            if (!session->is_writing_ && session->write_queue_.size() == 0)//����Ϊ���������ڷ��͵����ݣ�����ֱ�ӷ���
            {
                can_write = true;
                session->is_writing_ = true;

                session->write_data_ = package;
            }
            else
            {
                session->write_queue_.push(package);
            }
        }

        if (can_write)
        {
            DoWrite(session);
        }
    }
}

void AsioSockServer::SendData(SessionID id, DataPtr senddata_ptr, std::size_t size)
{
    ConSessionPtr session = GetConnectSession(id);
    if (session && senddata_ptr && size > 0)
    {
        ConnectSession::DataPackage package = { size, senddata_ptr };

        bool can_write = false;
        {
            std::lock_guard<std::mutex> lock(session->write_mtx_);
            if (!session->is_writing_ && session->write_queue_.size() == 0)//����Ϊ���������ڷ��͵����ݣ�����ֱ�ӷ���
            {
                can_write = true;
                session->is_writing_ = true;

                session->write_data_ = package;
            }
            else
            {
                session->write_queue_.push(package);
            }
        }

        if (can_write)
        {
            DoWrite(session);
        }
    }
}

void AsioSockServer::InitSocket()
{
    socket_.reset(new ip::tcp::socket(io_service_));

    ip::tcp::endpoint ep(ip::tcp::v4(), port_);//ʹ��Ĭ��IP
    acceptor_.reset(new ip::tcp::acceptor(io_service_, ep));

    DoAccept();//��ʼ��������
}

void AsioSockServer::UnInitSocket()
{
    socket_->close();
}

void AsioSockServer::StartIOService()
{
    for (int i = 0; i < io_thread_num_; i++)
    {
        io_threads_.emplace_back([this]() //�豣֤this����������
            {
                io_service_.run();
            });
    }
}

void AsioSockServer::StopIOService()
{
    io_service_.stop();//ֹͣ����
    for (auto& th : io_threads_)
    {
        th.join();//�ȴ�IO�߳̽���
    }
    io_threads_.clear();
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
        if (IsSessionIDValid(id))//sessionid��Ч
        {
            session->session_id_ = id;
            AddConnectSession(session);//��ӿͻ�������
            
            OnSocketConnect(session->session_id_);//���ӳɹ�
            
            DoValidateHello(session);//�ȴ���֤�ͻ��˷���Hello��Ϣ
        }
        else
        {
            LOG_ERROR("OnAccept error, not have enough sessionid!");
        }
    }
    else
    {
        LOG_ERROR("OnAccept error, error(%d)", error);
    }
}

void AsioSockServer::DoValidateHello(ConSessionPtr session)
{
    //hello data ���Ȳ��ܴ��ڻ�����

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
            DoValidateHello(session);//������ȡhello����
        }
        else if (session->read_size_ == hello_data_.size())
        {
            if (0 == strncmp(session->read_buffer_, hello_data_.c_str(), hello_data_.size()))
            {
                //��֤�ɹ�
                OnSocketValidated(session->session_id_);

                session->ClearReadBuffer();
                DoReadProtocalHead(session);//������ȡ����
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

void AsioSockServer::DoReadProtocalHead(ConSessionPtr session)
{
    static_assert(sizeof(ProtocalHead) < sizeof(ConnectSession::read_buffer_));//Э��ͷ���ܴ��ڶ�������

    std::lock_guard<std::mutex> lock(session->sock_mtx_);
    session->socket_.async_receive(
        buffer(session->read_buffer_ + session->read_size_, sizeof(ProtocalHead) - session->read_size_),
        MEM_CALL2(session, OnReadProtocalHead));
}

void AsioSockServer::OnReadProtocalHead(ConSessionPtr session, const boost::system::error_code& error, const std::size_t& size)
{
    if (CheckIOState(session, error))
    {
        session->read_size_ += size;
        if (session->read_size_ < sizeof(ProtocalHead))
        {
            DoReadProtocalHead(session);//������ȡЭ��ͷ
        }
        else if (session->read_size_ == sizeof(ProtocalHead))
        {
            auto head = reinterpret_cast<ProtocalHead*>(session->read_buffer_);
            session->read_data_.dataptr.reset(new Byte[head->data_len], [](Byte* p)
                {
                    delete[] p;
                });

            DoReadDataPackage(session);//��ʼ��ȡ���ݰ�
        }
        else
        {
            LOG_ERROR("OnReadProtocalHead error, readsize(%d) bigger than expected(%d)!", session->read_size_, sizeof(ProtocalHead));
            CloseConnectSession(session);
        }
    }
}

void AsioSockServer::DoReadDataPackage(ConSessionPtr session)
{
    auto head = reinterpret_cast<ProtocalHead*>(session->read_buffer_);

    std::lock_guard<std::mutex> lock(session->sock_mtx_);
    session->socket_.async_receive(
        buffer(session->read_data_.dataptr.get() + session->read_data_.size, head->data_len - session->read_data_.size),
        MEM_CALL2(session, OnReadDataPackage));
}

void AsioSockServer::OnReadDataPackage(ConSessionPtr session, const boost::system::error_code& error, const std::size_t& size)
{
    if (CheckIOState(session, error))
    {
        session->read_data_.size += size;

        auto head = reinterpret_cast<ProtocalHead*>(session->read_buffer_);
        if (session->read_data_.size < head->data_len)
        {
            DoReadDataPackage(session);//������ȡ���ݰ�
        }
        else if (session->read_data_.size == head->data_len)
        {
            //�ַ����ݰ�
            OnSocketMsg(session->session_id_, session->read_data_.dataptr, session->read_data_.size);

            session->ClearReadBuffer();
            DoReadProtocalHead(session);//��ȡ��һ������
        }
        else
        {
            LOG_ERROR("OnReadDataPackage error, readsize(%d) bigger than expected(%d)!", session->read_data_.size, head->data_len);
            CloseConnectSession(session);
        }
    }
}

void AsioSockServer::TryWrite(ConSessionPtr session)
{
    bool can_write = false;
    {
        std::lock_guard<std::mutex> lock(session->write_mtx_);
        if (!session->is_writing_)//û������д������ʱ
        {
            can_write = true;
            session->is_writing_ = true;
            session->write_data_ = session->write_queue_.front();
            session->write_queue_.pop();
        }
    }

    if (can_write)
    {
        DoWrite(session);
    }
}

void AsioSockServer::DoWrite(ConSessionPtr session)
{
    //ֻ��һ���߳��ܽ���д���������ﲻ�ø�д���������
    std::lock_guard<std::mutex> lock(session->sock_mtx_);
    session->socket_.async_send(
        buffer(session->write_data_.dataptr.get() + session->write_size_, session->write_data_.size - session->write_size_),
        MEM_CALL2(session, OnWrite));
}

void AsioSockServer::OnWrite(ConSessionPtr session, const boost::system::error_code& error, const std::size_t& size)
{
    if (CheckIOState(session, error))
    {
        session->write_size_ += size;

        if (session->write_size_ < session->write_data_.size)
        {
            DoWrite(session);//����д���ݰ�
        }
        else if (session->write_size_ < session->write_data_.size)
        {
            session->ClearWriteBuffer();

            {
                std::lock_guard<std::mutex> lock(session->write_mtx_);
                session->is_writing_ = false;
            }

            TryWrite(session);//����д��һ������
        }
        else
        {
            LOG_ERROR("OnWrite error, writesize(%d) bigger than expected(%d)!", session->write_size_, session->write_data_.size);
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
    }
    else
    {
        return true;
    }
}

void AsioSockServer::AsioSockServer::CloseConnectSession(ConSessionPtr session)
{
    session->socket_.close();
    RemoveConnectSession(session);
}
