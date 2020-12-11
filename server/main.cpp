#include "work_server.h"

int main(int argc, char* argv[])
{
    WorkServer server;

    server.Initialize(1, 2, 8888, "longfei\n");//服务器为单核

    while (getchar() != 'q')
    {
        
    }
    server.ShutDown();
    return 0;
}