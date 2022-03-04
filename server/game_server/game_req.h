#pragma once

#define GR_USER_LOGIN_IN                         10000 //登录
#define GR_CREATE_ROOM                           10001 //创建房间
#define GR_JOIN_ROOM                             10002 //加入房间
#define GR_LEAVE_ROOM                            10003 //退出房间
#define GR_ROOM_HOST_CHANGE						 10004 //房间房主变化
#define GR_ROOM_READY						     10005 //房间准备
#define GR_ROOM_UNREADY						     10006 //房间取消准备
#define GR_ROOM_START						     10007 //房间开始
#define GR_MENU_SWITCH						     10008 //菜单切换
#define GR_MENU_CHOOSE						     10009 //菜单选中
#define GR_MENU_BACK							 10010 //菜单返回
#define	GR_GAME_START						     10011 //游戏开始
#define GR_GAME_MAP_EDIT_FINISHED				 10012 //地图编辑完成
#define GR_PLAYER_INFO						     10013 //玩家信息
#define GR_GAME_END							     10014 //游戏结束

//游戏帧相关
#define GR_GAME_FRAME                            11000 //下发游戏关键帧

#define GR_USER_LOGIN_OUT                        12000 //登出

//响应结果
#define UR_OPERATE_SUCCESS						 10 //操作成功
#define UR_OPERATE_FAILED						 11 //操作失败

enum RoomStatus
{
	ROOM_STATUS_NULL,    //空
	ROOM_STATUS_READY,   //准备状态
	ROOM_STATUS_START,   //开始状态
	ROOM_STATUS_GAME,    //游戏状态
};

enum MenuIndex
{
	MENU_INDEX_START_GAME = 9,  //开始游戏
	MENU_INDEX_MAP_EDIT,        //地图编辑
};

enum GameMode
{
	GAME_MODE_COMMON = 1,		//普通模式
	GAME_MODE_MAP_EDIT,			//地图编辑
};