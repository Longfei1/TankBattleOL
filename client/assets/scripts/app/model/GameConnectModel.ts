import BaseModel from "./BaseModel";
import CommonFunc from "../common/CommonFunc";
import { GameConnect } from "../network/NetWork";
import {gamereq} from "../network/proto/gamereq";
import { GameConfig } from "../GameConfig";
import { GameProtocal } from "../network/GameProtocal";
import { EventDef } from "../define/EventDef";
import { google } from "../network/proto/basereq";
import GameDataModel from "./GameDataModel";
import { GameDef } from "../define/GameDef";

class GameConnectModel extends BaseModel {
    private _gameConnect: GameConnect = null;

    initModel() {
        this._gameConnect = new GameConnect("MainGame");
        this._gameConnect.setSocketErrorHandler(this.onSocketError.bind(this));
        this._gameConnect.setTimeOutHandler(this.onRequestTimeOut.bind(this));

        this.initNotifyHandler();//绑定消息通知处理
    }

    //初始化通知回调
    initNotifyHandler() {
        this._gameConnect.addNotifyHandler(GameProtocal.GR_JOIN_ROOM, this.onNtfJoinRoom.bind(this));
        this._gameConnect.addNotifyHandler(GameProtocal.GR_LEAVE_ROOM, this.onNtfLeaveRoom.bind(this));
        this._gameConnect.addNotifyHandler(GameProtocal.GR_ROOM_HOST_CHANGE, this.onNtfRoomHostChanged.bind(this));
        this._gameConnect.addNotifyHandler(GameProtocal.GR_PLAYER_INFO, this.onNtfPlayerInfo.bind(this));
        this._gameConnect.addNotifyHandler(GameProtocal.GR_ROOM_READY, this.onNtfRoomReady.bind(this));
        this._gameConnect.addNotifyHandler(GameProtocal.GR_ROOM_UNREADY, this.onNtfRoomUnReady.bind(this));
        this._gameConnect.addNotifyHandler(GameProtocal.GR_ROOM_START, this.onNtfRoomStart.bind(this));
        this._gameConnect.addNotifyHandler(GameProtocal.GR_MENU_SWITCH, this.onNtfMenuSwitch.bind(this));
        this._gameConnect.addNotifyHandler(GameProtocal.GR_MENU_CHOOSE, this.onNtfMenuChoose.bind(this));
        this._gameConnect.addNotifyHandler(GameProtocal.GR_MENU_BACK, this.onNtfMenuBack.bind(this)); 
        this._gameConnect.addNotifyHandler(GameProtocal.GR_GAME_START, this.onNtfGameStart.bind(this)); 
        this._gameConnect.addNotifyHandler(GameProtocal.GR_GAME_FRAME, this.onNtfGameFrame.bind(this)); 
    }

    onSocketError() {
        console.log("GameConnectModel socket error!");
        this.emit(EventDef.EV_MAINGAME_SOCKET_ERROR);
    }

    onRequestTimeOut() {
        console.log("GameConnectModel request timeout!");
        this.emit(EventDef.EV_MAINGAME_REQUEST_TIMEOUT);
    }

    /**
     * 连接服务器
     * @param callback 返回值：0-成功 1-连接失败 -2-登录失败 
     */
    connectServer(callback: Function) {
       if (!this._gameConnect.isConnected()) {
           this._gameConnect.connect(GameConfig.serverIP, GameConfig.serverPort, (ret) => {
                if (ret) {
                    console.log("connect server ok!");

                    //连接成功后，自动登录
                    this.sendLoginIn((r:number , error?: any) => {
                        CommonFunc.excuteCallback(callback, r === 0 ? 0 : 2, error);
                    });
                }
                else {
                    console.log("connect server failed!");
                    CommonFunc.excuteCallback(callback, 1);
                }
           });
       }
    }

    //断开服务连接
    disconnectServer() {
        if (this._gameConnect.isConnected()) {
            this._gameConnect.disconnect();
        }
    }

    //服务是否连接
    isServerConnected(): boolean {
        return this._gameConnect.isConnected();
    }

    /***********************************消息请求start***********************************/
    //登录
    sendLoginIn(callback: Function) {
        let anyPackage: GameProtocal.PbAnyPackage = {
            typeUrl: "gamereq.LoginIn",
            pbHandler: gamereq.LoginIn,
            obj: GameDataModel.getLoginInData(),
        };

        this._gameConnect.sendRequest(GameProtocal.GR_USER_LOGIN_IN, anyPackage, true, (requestid: number, pbAnyData: google.protobuf.Any) => {
            if (requestid === GameProtocal.UR_OPERATE_SUCCESS) {
                let loginIn: gamereq.LoginIn = CommonFunc.pbAnyToObject(pbAnyData, gamereq.LoginIn);

                this.onLoginInSuccess(loginIn);

                CommonFunc.excuteCallback(callback, 0);
            }
            else if (requestid === GameProtocal.UR_OPERATE_FAILED) {
                this.onRespondFailed(pbAnyData, callback);
            }
            else {
                CommonFunc.excuteCallback(callback, requestid);
            }
        });
    }

    //创建房间
    sendCreateRoom(callback: Function) {
        let anyPackage: GameProtocal.PbAnyPackage = {
            typeUrl: "gamereq.UserInfo",
            pbHandler: gamereq.UserInfo,
            obj: {userid: GameDataModel._netUserID},
        };

        this._gameConnect.sendRequest(GameProtocal.GR_CREATE_ROOM, anyPackage, true, (requestid: number, pbAnyData: google.protobuf.Any) => {
            if (requestid === GameProtocal.UR_OPERATE_SUCCESS) {
                let info: gamereq.RoomPlayerInfo = CommonFunc.pbAnyToObject(pbAnyData, gamereq.RoomPlayerInfo);

                GameDataModel._netRoomID = info.roomid;
                GameDataModel._netPlayerNO = info.playerno;

                GameDataModel.resetAllPlayerHallInfo();
                this.onRoomPlayerUpdate(info);

                CommonFunc.excuteCallback(callback, 0, info);
            }
            else if (requestid === GameProtocal.UR_OPERATE_FAILED) {
                this.onRespondFailed(pbAnyData, callback);
            }
            else {
                CommonFunc.excuteCallback(callback, requestid);
            }
        });
    }

    //加入房间
    sendJoinRoom(roomid: number, callback: Function) {
        let roomPlayerInfo = GameDataModel.getRoomPlayerInfo();
        roomPlayerInfo.roomid = roomid;//加入的房间号

        let anyPackage: GameProtocal.PbAnyPackage = {
            typeUrl: "gamereq.RoomPlayerInfo",
            pbHandler: gamereq.RoomPlayerInfo,
            obj: roomPlayerInfo,
        };

        this._gameConnect.sendRequest(GameProtocal.GR_JOIN_ROOM, anyPackage, true, (requestid: number, pbAnyData: google.protobuf.Any) => {
            if (requestid === GameProtocal.UR_OPERATE_SUCCESS) {
                let info: gamereq.RoomPlayerInfo = CommonFunc.pbAnyToObject(pbAnyData, gamereq.RoomPlayerInfo);

                GameDataModel._netRoomID = info.roomid;
                GameDataModel._netPlayerNO = info.playerno;

                GameDataModel.resetAllPlayerHallInfo();
                this.onRoomPlayerUpdate(info);

                CommonFunc.excuteCallback(callback, 0, info);
            }
            else if (requestid === GameProtocal.UR_OPERATE_FAILED) {
                this.onRespondFailed(pbAnyData, callback);
            }
            else {
                CommonFunc.excuteCallback(callback, requestid);
            }
        });
    }

    //离开房间
    sendLeaveRoom(callback: Function) {
        let anyPackage: GameProtocal.PbAnyPackage = {
            typeUrl: "gamereq.RoomPlayerInfo",
            pbHandler: gamereq.RoomPlayerInfo,
            obj: GameDataModel.getRoomPlayerInfo(),
        };

        this._gameConnect.sendRequest(GameProtocal.GR_LEAVE_ROOM, anyPackage, true, (requestid: number, pbAnyData: google.protobuf.Any) => {
            if (requestid === GameProtocal.UR_OPERATE_SUCCESS) {
                let info: gamereq.RoomPlayerInfo = CommonFunc.pbAnyToObject(pbAnyData, gamereq.RoomPlayerInfo);

                GameDataModel._netRoomID = 0;

                this.onRoomPlayerLeave(info);

                CommonFunc.excuteCallback(callback, 0, info);
            }
            else if (requestid === GameProtocal.UR_OPERATE_FAILED) {
                this.onRespondFailed(pbAnyData, callback);
            }
            else {
                CommonFunc.excuteCallback(callback, requestid);
            }
        });
    }

    //房间准备
    sendRoomReady(callback: Function) {
        let anyPackage: GameProtocal.PbAnyPackage = {
            typeUrl: "gamereq.RoomPlayerInfo",
            pbHandler: gamereq.RoomPlayerInfo,
            obj: GameDataModel.getRoomPlayerInfo(),
        };

        this._gameConnect.sendRequest(GameProtocal.GR_ROOM_READY, anyPackage, true, (requestid: number, pbAnyData: google.protobuf.Any) => {
            if (requestid === GameProtocal.UR_OPERATE_SUCCESS) {
                let info: gamereq.RoomPlayerInfo = CommonFunc.pbAnyToObject(pbAnyData, gamereq.RoomPlayerInfo);

                this.onRoomReady(info);                

                CommonFunc.excuteCallback(callback, 0, info);
            }
            else if (requestid === GameProtocal.UR_OPERATE_FAILED) {
                this.onRespondFailed(pbAnyData, callback);
            }
            else {
                CommonFunc.excuteCallback(callback, requestid);
            }
        });
    }

    //房间取消准备
    sendRoomUnReady(callback: Function) {
        let anyPackage: GameProtocal.PbAnyPackage = {
            typeUrl: "gamereq.RoomPlayerInfo",
            pbHandler: gamereq.RoomPlayerInfo,
            obj: GameDataModel.getRoomPlayerInfo(),
        };

        this._gameConnect.sendRequest(GameProtocal.GR_ROOM_UNREADY, anyPackage, true, (requestid: number, pbAnyData: google.protobuf.Any) => {
            if (requestid === GameProtocal.UR_OPERATE_SUCCESS) {
                let info: gamereq.RoomPlayerInfo = CommonFunc.pbAnyToObject(pbAnyData, gamereq.RoomPlayerInfo);

                this.onRoomUnReady(info);                

                CommonFunc.excuteCallback(callback, 0, info);
            }
            else if (requestid === GameProtocal.UR_OPERATE_FAILED) {
                this.onRespondFailed(pbAnyData, callback);
            }
            else {
                CommonFunc.excuteCallback(callback, requestid);
            }
        });
    }

    //房间开始
    sendRoomStart(callback: Function) {
        let anyPackage: GameProtocal.PbAnyPackage = {
            typeUrl: "gamereq.RoomPlayerInfo",
            pbHandler: gamereq.RoomPlayerInfo,
            obj: GameDataModel.getRoomPlayerInfo(),
        };

        this._gameConnect.sendRequest(GameProtocal.GR_ROOM_START, anyPackage, true, (requestid: number, pbAnyData: google.protobuf.Any) => {
            if (requestid === GameProtocal.UR_OPERATE_SUCCESS) {
                let info: gamereq.RoomPlayerInfo = CommonFunc.pbAnyToObject(pbAnyData, gamereq.RoomPlayerInfo);

                this.onRoomReady(info);                

                CommonFunc.excuteCallback(callback, 0, info);
            }
            else if (requestid === GameProtocal.UR_OPERATE_FAILED) {
                this.onRespondFailed(pbAnyData, callback);
            }
            else {
                CommonFunc.excuteCallback(callback, requestid);
            }
        });
    }

    //菜单切换
    sendMenuSwith(menuIndex: number, callback: Function) {
        let anyPackage: GameProtocal.PbAnyPackage = {
            typeUrl: "gamereq.MenuSwitchInfo",
            pbHandler: gamereq.MenuSwitchInfo,
            obj: {
                where: GameDataModel.getRoomPlayerInfo(),
                index: menuIndex,
            },
        };

        this._gameConnect.sendRequest(GameProtocal.GR_MENU_SWITCH, anyPackage, true, (requestid: number, pbAnyData: google.protobuf.Any) => {
            if (requestid === GameProtocal.UR_OPERATE_SUCCESS) {
                let info: gamereq.MenuSwitchInfo = CommonFunc.pbAnyToObject(pbAnyData, gamereq.MenuSwitchInfo);     

                CommonFunc.excuteCallback(callback, 0, info);
            }
            else if (requestid === GameProtocal.UR_OPERATE_FAILED) {
                this.onRespondFailed(pbAnyData, callback);
            }
            else {
                CommonFunc.excuteCallback(callback, requestid);
            }
        });
    }

    //菜单选中
    sendMenuChoose(menuIndex: number, callback: Function) {
        let anyPackage: GameProtocal.PbAnyPackage = {
            typeUrl: "gamereq.MenuChooseInfo",
            pbHandler: gamereq.MenuChooseInfo,
            obj: {
                where: GameDataModel.getRoomPlayerInfo(),
                index: menuIndex,
            },
        };

        this._gameConnect.sendRequest(GameProtocal.GR_MENU_CHOOSE, anyPackage, true, (requestid: number, pbAnyData: google.protobuf.Any) => {
            if (requestid === GameProtocal.UR_OPERATE_SUCCESS) {
                let info: gamereq.MenuChooseInfo = CommonFunc.pbAnyToObject(pbAnyData, gamereq.MenuChooseInfo);     

                CommonFunc.excuteCallback(callback, 0, info);
            }
            else if (requestid === GameProtocal.UR_OPERATE_FAILED) {
                this.onRespondFailed(pbAnyData, callback);
            }
            else {
                CommonFunc.excuteCallback(callback, requestid);
            }
        });
    }

    //菜单返回
    sendMenuBack(callback: Function) {
        let anyPackage: GameProtocal.PbAnyPackage = {
            typeUrl: "gamereq.RoomPlayerInfo",
            pbHandler: gamereq.RoomPlayerInfo,
            obj: GameDataModel.getRoomPlayerInfo(),
        };

        this._gameConnect.sendRequest(GameProtocal.GR_MENU_BACK, anyPackage, true, (requestid: number, pbAnyData: google.protobuf.Any) => {
            if (requestid === GameProtocal.UR_OPERATE_SUCCESS) {
                let info: gamereq.RoomPlayerInfo = CommonFunc.pbAnyToObject(pbAnyData, gamereq.RoomPlayerInfo);     

                this.onMenuBack(info);

                CommonFunc.excuteCallback(callback, 0, info);
            }
            else if (requestid === GameProtocal.UR_OPERATE_FAILED) {
                this.onRespondFailed(pbAnyData, callback);
            }
            else {
                CommonFunc.excuteCallback(callback, requestid);
            }
        });
    }

    //游戏帧数据
    sendGameFrame(opeCode: number) {
        let anyPackage: GameProtocal.PbAnyPackage = {
            typeUrl: "gamereq.GameFrameReq",
            pbHandler: gamereq.GameFrameReq,
            obj: { 
                roomid: GameDataModel._netRoomID,
                userid: GameDataModel._netUserID,
                frame: GameDataModel._netFrameNO + 1,
                userope: {
                    playerno: GameDataModel._netPlayerNO,
                    opecode: opeCode,
                }
            },
        };

        this._gameConnect.sendRequest(GameProtocal.GR_GAME_FRAME, anyPackage, false);
    }

    /***********************************消息请求end***********************************/

    //普通错误处理
    onRespondFailed(pbAnyData: google.protobuf.Any, callback: Function) {
        let error: gamereq.ErrorInfo = CommonFunc.pbAnyToObject(pbAnyData, gamereq.ErrorInfo);

        CommonFunc.showToast(error.description, 2);
 
        CommonFunc.excuteCallback(callback, GameProtocal.UR_OPERATE_FAILED, error);
    }

    //登录成功
    onLoginInSuccess(loginInRsp: gamereq.LoginIn) {
        GameDataModel.setLoginInData(loginInRsp.userid, loginInRsp.timestamp);
    }

    //房间玩家更新
    onRoomPlayerUpdate(info: gamereq.RoomPlayerInfo) {
        let playerInfo = GameDataModel.getPlayerInfo(info.playerno);
        playerInfo.userID = info.userid;

        //更新自己的位置信息
        if (info.userid === GameDataModel._netUserID) {
            GameDataModel._netPlayerNO = info.playerno;
        }
    }

    //房间玩家离开
    onRoomPlayerLeave(info: gamereq.RoomPlayerInfo) {
        let playerInfo = GameDataModel.getPlayerInfo(info.playerno);
        playerInfo.userID = 0;
        playerInfo.ready = false;

        let host = GameDataModel.getPlayerInfo(0);
        host.ready = false;
    }

    //房间准备
    onRoomReady(info: gamereq.RoomPlayerInfo) {
        let playerInfo = GameDataModel.getPlayerInfo(info.playerno);
        playerInfo.ready = true;
    }

    //房间取消准备
    onRoomUnReady(info: gamereq.RoomPlayerInfo) {
        let playerInfo = GameDataModel.getPlayerInfo(info.playerno);
        playerInfo.ready = false;
    }

    //菜单返回
    onMenuBack(info: gamereq.RoomPlayerInfo) {
        for (let i = 0; i < GameDef.GAME_TOTAL_PLAYER; i++) {
            let playerInfo = GameDataModel.getPlayerInfo(i);
            playerInfo.ready = false;
        }
    }

    /***********************************消息通知start***********************************/
    //加入房间
    onNtfJoinRoom(pbAnyData: google.protobuf.Any) {
        let info: gamereq.RoomPlayerInfo = CommonFunc.pbAnyToObject(pbAnyData, gamereq.RoomPlayerInfo);

        this.onRoomPlayerUpdate(info);

        this.emit(EventDef.EV_NTF_JOIN_ROOM, info);
    }

    //离开房间
    onNtfLeaveRoom(pbAnyData: google.protobuf.Any) {
        let info: gamereq.RoomPlayerInfo = CommonFunc.pbAnyToObject(pbAnyData, gamereq.RoomPlayerInfo);

        this.onRoomPlayerLeave(info);

        this.emit(EventDef.EV_NTF_LEAVE_ROOM, info);
    }

    //房主变更
    onNtfRoomHostChanged(pbAnyData: google.protobuf.Any) {
        let info: gamereq.RoomPlayerInfo = CommonFunc.pbAnyToObject(pbAnyData, gamereq.RoomPlayerInfo);

        let tmpInfo = gamereq.RoomPlayerInfo.create();
        tmpInfo.roomid = info.roomid;

        tmpInfo.playerno = info.playerno;
        this.onRoomPlayerLeave(tmpInfo);//离开旧位置

        tmpInfo.playerno = 0;
        tmpInfo.userid = info.userid;
        this.onRoomPlayerUpdate(tmpInfo);//变更房主信息

        let playerInfo = GameDataModel.getPlayerInfo(0);
        playerInfo.ready = false;//新房主是设为未准备状态

        this.emit(EventDef.EV_NTF_ROOM_HOST_CHANGED, info);
    }

    //玩家信息
    onNtfPlayerInfo(pbAnyData: google.protobuf.Any) {
        let info: gamereq.RoomPlayerInfo = CommonFunc.pbAnyToObject(pbAnyData, gamereq.RoomPlayerInfo);

        this.onRoomPlayerUpdate(info);

        this.emit(EventDef.EV_NTF_PLAYER_INFO, info);
    }

    //房间准备
    onNtfRoomReady(pbAnyData: google.protobuf.Any) {
        let info: gamereq.RoomPlayerInfo = CommonFunc.pbAnyToObject(pbAnyData, gamereq.RoomPlayerInfo);

        this.onRoomReady(info);

        this.emit(EventDef.EV_NTF_ROOM_READY, info);
    }

    //房间取消准备
    onNtfRoomUnReady(pbAnyData: google.protobuf.Any) {
        let info: gamereq.RoomPlayerInfo = CommonFunc.pbAnyToObject(pbAnyData, gamereq.RoomPlayerInfo);

        this.onRoomUnReady(info);

        this.emit(EventDef.EV_NTF_ROOM_UNREADY, info);
    }
    
    //房间开始
    onNtfRoomStart(pbAnyData: google.protobuf.Any) {
        let info: gamereq.RoomPlayerInfo = CommonFunc.pbAnyToObject(pbAnyData, gamereq.RoomPlayerInfo);

        this.onRoomReady(info);

        this.emit(EventDef.EV_NTF_ROOM_START, info);
    }

    //菜单切换
    onNtfMenuSwitch(pbAnyData: google.protobuf.Any) {
        let info: gamereq.MenuSwitchInfo = CommonFunc.pbAnyToObject(pbAnyData, gamereq.MenuSwitchInfo);

        this.emit(EventDef.EV_NTF_MENU_SWITCH, info);
    }

    //菜单选中
    onNtfMenuChoose(pbAnyData: google.protobuf.Any) {
        let info: gamereq.MenuChooseInfo = CommonFunc.pbAnyToObject(pbAnyData, gamereq.MenuChooseInfo);

        this.emit(EventDef.EV_NTF_MENU_CHOOSE, info);
    }

    //菜单返回
    onNtfMenuBack(pbAnyData: google.protobuf.Any) {
        let info: gamereq.RoomPlayerInfo = CommonFunc.pbAnyToObject(pbAnyData, gamereq.RoomPlayerInfo);
        
        this.onMenuBack(info);

        this.emit(EventDef.EV_NTF_MENU_BACK, info);
    }

    //游戏开始
    onNtfGameStart(pbAnyData: google.protobuf.Any) {
        let info: gamereq.GameStartRsp = CommonFunc.pbAnyToObject(pbAnyData, gamereq.GameStartRsp);

        if (info.mode === GameProtocal.GameMode.GAME_MODE_COMMON) {
            GameDataModel._playMode = GameDef.GAMEMODE_ONLINE_PLAY;
        }
        else if (info.mode === GameProtocal.GameMode.GAME_MODE_MAP_EDIT) {
            GameDataModel._playMode = GameDef.GAMEMODE_MAP_EDIT_ONLINE;
        }

        this.emit(EventDef.EV_NTF_GAME_START, info);
    }

    //游戏帧数据
    onNtfGameFrame(pbAnyData: google.protobuf.Any) {
        let info: gamereq.GameFrameNtf = CommonFunc.pbAnyToObject(pbAnyData, gamereq.GameFrameNtf);

        this.emit(EventDef.EV_NTF_GAME_FRAME, info);
    }

    /***********************************消息通知end***********************************/
}

export default new GameConnectModel()