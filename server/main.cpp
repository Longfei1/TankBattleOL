#include "work_server/work_server.h"

int main(int argc, char* argv[])
{
    WorkServer server("127.0.0.1", 8888, 1, 2);//������Ϊ����

    server.Initialize();

    while (getchar() != 'q')
    {
        
    }
    server.ShutDown();
    return 0;
}