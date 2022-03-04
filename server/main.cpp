#include "game_server/game_server.h"

int main(int argc, char* argv[])
{
	int server_port = 8888;

#if NDEBUG
	server_port = 9000;
#endif

    GameServer server(server_port, 1, 2);//服务器为单核

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