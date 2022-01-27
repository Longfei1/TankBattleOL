#include "game_server/game_server.h"

int main(int argc, char* argv[])
{
    GameServer server(8888, 1, 2);//服务器为单核

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