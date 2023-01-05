#include "proxy_server/proxy_server.h"
#include "common/log/log.h"

int main(int argc, char* argv[])
{
    int server_port = 8888;
    int proxy_port = 8889;

#if NDEBUG
    server_port = 9000;
    proxy_port = 9001;
#endif

    ProxyServer server("47.109.56.202", server_port, proxy_port, 1);//服务器为单核，io线程一个就行

    if (server.Initialize())
    {
        LOG_INFO("Server Start!");
        while (getchar() != 'q')
        {

        }
        server.ShutDown();
    }
    return 0;
}