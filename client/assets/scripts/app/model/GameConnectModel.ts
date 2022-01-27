import BaseModel from "./BaseModel";
import CommonFunc from "../common/CommonFunc";
import { GameDef } from "../define/GameDef";
import { GameConnect } from "../network/NetWork";
import {gamereq} from "../network/proto/gamereq";
import { GameConfig } from "../GameConfig";
import { GameProtocal } from "../network/GameProtocal";
import { EventDef } from "../define/EventDef";
import { google } from "../network/proto/basereq";
import GameDataModel from "./GameDataModel";

class GameConnectModel extends BaseModel {
    private _gameConnect: GameConnect = null;

    initModel() {
        this._gameConnect = new GameConnect("MainGame");
        this._gameConnect.setSocketErrorHandler(() => {
            this.onSocketError();
        });
    }

    onSocketError() {
        console.log("GameConnectModel socket error!");
        this.emit(EventDef.EV_MAINGAME_SOCKET_ERROR);
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
                    this.sendLoginIn((ret, tip) => {
                        if (callback) {
                            callback(ret ? 0 : 2, tip);
                        }
                    });
                }
                else {
                    console.log("connect server failed!");
                    if (callback) {
                        callback(1);
                    }
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

    //登录
    sendLoginIn(callback: Function) {
        let anyPackage: GameProtocal.PbAnyPackage = {
            typeUrl: "gamereq.LoginInReq",
            pbHandler: gamereq.LoginInReq,
            obj: GameDataModel.getLoginInData(),
        } 

        this._gameConnect.sendRequest(GameProtocal.GR_USER_LOGIN_IN, anyPackage, true, (pbAnyData: google.protobuf.Any) => {
            let loginInRsp: gamereq.LoginInRsp = CommonFunc.pbAnyToObject(pbAnyData, gamereq.LoginInRsp);

            if (loginInRsp.success) {
                //登录结果
                this.onLoginInResult(loginInRsp);
            }

            if (callback) {
                callback(loginInRsp.success, loginInRsp.description);
            }
        });
    }

    //登录成功
    onLoginInResult(loginInRsp: gamereq.LoginInRsp) {
        if (loginInRsp.success) {
            GameDataModel.setLoginInData(loginInRsp.userid, loginInRsp.timestamp);
        }
    }
}

export default new GameConnectModel()