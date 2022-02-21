#pragma once

enum class KeyboardEvent
{
    KEY_UP,
    KEY_DOWN,
};

#define TOTAL_PLAYER                         2 //房间玩家数
#define GAME_FRAMES_NUM                      15 //帧数量（1s）

#define GAMEFRAME_THREAD_NUM                 1 //游戏帧线程数量

#define FRAME_TIMEOUT_TIME                   5 //帧同步超时时间(s)