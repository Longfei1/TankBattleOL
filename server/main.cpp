#include "game_server/game_server.h"

int main(int argc, char* argv[])
{
    GameServer server(8888, 1, 2);//������Ϊ����

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