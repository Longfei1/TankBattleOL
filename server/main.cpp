#include "work_server/work_server.h"

int main(int argc, char* argv[])
{
    WorkServer server(8888, 1, 2);//服务器为单核

    server.Initialize();

    while (getchar() != 'q')
    {
        
    }
    server.ShutDown();
    return 0;
}