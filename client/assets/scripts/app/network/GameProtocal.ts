export namespace GameProtocal {
    //通用协议
    export const GR_CONNECT_PLUSE               = 1000; //心跳

    //游戏协议start
    export const GR_USER_LOGIN_IN               = 10000; //登录
    export const GR_CREATE_ROOM                 = 10001; //创建房间
    export const GR_JOIN_ROOM                   = 10002; //加入房间
    export const GR_LEAVE_ROOM                  = 10003; //退出房间
    export const GR_ROOM_HOST_CHANGE			= 10004; //房间房主变化
    export const GR_ROOM_READY					= 10005; //房间准备
    export const GR_ROOM_UNREADY				= 10006; //房间取消准备
    export const GR_ROOM_START					= 10007; //房间开始
    export const GR_MENU_SWITCH					= 10008; //菜单切换
    export const GR_MENU_CHOOSE					= 10009; //菜单选中
    export const GR_MENU_BACK					= 10010; //菜单返回
    export const GR_GAME_START					= 10011; //游戏开始
    export const GR_GAME_MAP_EDIT_FINISHED      = 10012; //地图编辑完成
    export const GR_PLAYER_INFO					= 10013; //玩家信息
    export const GR_GAME_END                    = 10014; //游戏结束

    //游戏帧相关
    export const GR_GAME_FRAME                  = 11000; //下发游戏关键帧
    export const GR_USER_OPERATION              = 11001; //玩家操作

    export const GR_USER_LOGIN_OUT              = 12000; //登出

    //响应结果
    export const UR_OPERATE_SUCCESS				= 10; //操作成功
    export const UR_OPERATE_FAILED				= 11; //操作失败
    //游戏协议end

    export enum MenuItemIdex {
        MODE_OFFLINE,           //单机模式
        MODE_ONLINE,            //联机模式
        SINGLE_PLAY,            //单人游戏
        DOUBLE_PLAY,            //双人游戏
        MAP_EDIT_OFFLINE,       //地图编辑（单机模式下）
        CREATE_ROOM,            //创建房间
        JOIN_ROOM,              //加入房间
        JOIN,                   //加入（输入房间号后）
        START_GAME,             //开始游戏/准备
        START_GAME_DIRECT,      //直接开始
        MAP_EDIT_ONLINE,        //地图编辑（联机模式下）
    }

    export enum RoomStatus {
        ROOM_STATUS_NULL,       //空
		ROOM_STATUS_READY,      //准备状态
		ROOM_STATUS_START,      //开始状态
		ROOM_STATUS_GAME,       //游戏状态
    }

    export enum GameMode
    {
        GAME_MODE_COMMON = 1,   //普通模式
        GAME_MODE_MAP_EDIT,		//地图编辑
    }

    export interface PbAnyPackage {
        typeUrl: string,
        pbHandler: any,
        obj: any,
    }
}