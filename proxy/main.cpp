#include "proxy_server/proxy_server.h"

int main(int argc, char* argv[])
{
    ProxyServer server("127.0.0.1", 8888, "127.0.0.1", 8889, 1);//服务器为单核，io线程一个就行

    server.Initialize();

    while (getchar() != 'q')
    {

    }
    server.ShutDown();
    return 0;
}