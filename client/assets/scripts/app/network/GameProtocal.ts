export namespace GameProtocal {
    //通用协议
    export const GR_CONNECT_PLUSE               = 1000; //心跳

    //游戏协议
    export const GR_USER_LOGIN_IN               = 10000 //登录
    export const GR_CREATE_ROOM                 = 10001 //创建房间
    export const GR_JOIN_ROOM                   = 10002 //加入房间
    export const GR_LEAVE_ROOM                  = 10003 //退出房间
    export const GR_GAME_FRAME                  = 10004 //下发游戏关键帧
    export const GR_USER_OPERATION              = 10005 //玩家操作
    export const GR_USER_LOGIN_OUT              = 10006 //登出

    export interface PbAnyPackage {
        typeUrl: string,
        pbHandler: any,
        obj: any,
    }
}