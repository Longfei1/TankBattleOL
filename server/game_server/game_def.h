#pragma once

enum class KeyboardEvent
{
    KEY_UP,
    KEY_DOWN,
};

#define TOTAL_PLAYER                         2 //房间玩家数
#define MAIN_FRAMES_NUM                      15 //主逻辑帧数量（1s）
#define FRAMES_OF_MAINFRAME_NUM              4 //主逻辑帧包含的帧数量

#define GAMEFRAME_THREAD_NUM                 1 //游戏帧线程数量