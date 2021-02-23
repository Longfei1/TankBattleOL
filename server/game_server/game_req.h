#pragma once

#define GR_USER_LOGIN                            10000 //登录
#define GR_CREATE_ROOM                           10001 //创建房间
#define GR_JOIN_ROOM                             10002 //加入房间
#define GR_LEAVE_ROOM                            10003 //退出房间
#define GR_GAME_FRAME                            10004 //下发游戏关键帧
#define GR_USER_OPERATION                        10005 //玩家操作
#define GR_GAME_ABORT                            10006 //游戏终止（有玩家掉线，目前不支持断线重连）