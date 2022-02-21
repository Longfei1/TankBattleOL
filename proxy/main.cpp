#include "proxy_server/proxy_server.h"
#include "common/log/log.h"

int main(int argc, char* argv[])
{
    ProxyServer server("127.0.0.1", 8888, 8889, 1);//服务器为单核，io线程一个就行

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