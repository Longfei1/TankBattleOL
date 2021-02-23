import BaseModel from "./BaseModel";
import { WSConnect } from "../network/NetWork";
import BaseReq = require("../network/proto/basereq");
import CommonFunc from "../common/CommonFunc";
import { GameConfig } from "../GameConfig";
import { GameReq } from "../network/GameReq";

class RequestMsg {
    requestID: number = 0;
    needEcho: boolean = false;
    data: any = null;
    handler: Function = null;
}

const PLUSE_INTERVAL = 30;//心跳发送间隔时长

class GameConnectModel extends BaseModel {
    private _socket: WSConnect = null;

    private _sequence: number = 0;//消息序列号
    private _waitResponse: boolean = false;//是否在等待回应
    private _waitSequence: number = -1;//等待回应的序列号
    private _requestQueue: RequestMsg[] = [];//请求队列
    private _responseHandler: Function = null;//响应回调函数

    private _notifyHandler: { [requestid: number]: Function } = {};//通知处理函数

    private _pluseTimer = null;//心跳定时器

    EVENT_SOCKET_ERROR = "EVENT_SOCKET_ERROR";

    initModel() {
        if (this.isNetSupported()) {
            this._socket = new WSConnect("Game", false);

            this._socket.setMessageHandler((data) => {
                this.onMessage(data);
            });
        }
        else {
            console.log("not support websocket!")
        }
    }

    isNetSupported(): boolean {
        if ("WebSocket" in window) {
            return true;
        }
        else {
            return false;
        }
    }

    isConnected(): boolean {
        return this._socket.isConnected();
    }

    addNotifyHandler(requestID: number, handler: Function) {
        this._notifyHandler[requestID] = handler;
    }

    connect(callback: Function) {
        let fnRet = callback;
        if (!this.isConnected()) {
            this._socket.connect(GameConfig.serverIP, GameConfig.serverPort, () => {
                if (fnRet) {
                    fnRet(true);
                    fnRet = null;
                }
                this.startPluseTimer();
            }, () => {
                if (fnRet) {
                    fnRet(false);
                    fnRet = null;

                    this.emit(this.EVENT_SOCKET_ERROR);//分发error事件
                }
                this.stopPluseTimer();
            })
        }
    }

    disconnect() {
        this._socket.disconnect();
    }

    sendRequest(requestID:number, pbData: any, needResponse: boolean = false, responseHandler: Function = null) {
        if (!this.isConnected() || this._waitResponse) {
            let request: RequestMsg = {
                requestID: requestID,
                needEcho: needResponse,
                data: pbData,
                handler: responseHandler,
            };
            
            this.pushRequestToQueue(request);
            return;
        }

        let msg = {
            request: requestID,
            needEcho: needResponse,
            sequence: this._sequence,
            data: pbData,
        };

        if (needResponse) {
            this._waitResponse = true;
            this._waitSequence = msg.sequence;
            this._responseHandler = responseHandler;
        }

        this._sequence++;

        let dataEncode = CommonFunc.pbEncode(BaseReq.basereq.Request, msg);
        this._socket.sendData(dataEncode);

        if (!needResponse) {
            this.sendRequestInQueue();
        }
    }

    private onMessage(data: ArrayBuffer) {
        let request: BaseReq.basereq.Request = CommonFunc.pbDecode(BaseReq.basereq.Request, data);

        if (this._waitResponse && this._waitSequence == request.sequence) {
            if (this._responseHandler) {
                this._responseHandler(request.data);
            }

            this._waitResponse = false;
            this._waitSequence = -1;
            this._responseHandler = null;

            this.sendRequestInQueue();
            return;
        }

        if (this._notifyHandler[request.request]) {
            this._notifyHandler[request.request](request.data);
        }
    }

    private pushRequestToQueue(request: RequestMsg) {
        this._requestQueue.push(request);
    }

    private sendRequestInQueue() {
        if (this._requestQueue.length > 0) {
            let request = this._requestQueue[0];
            this._requestQueue.splice(0, 1);

            this.sendRequest(request.requestID, request.data, request.needEcho, request.handler);
        }
    }

    private sendPluse() {
        this.sendRequest(GameReq.GR_CONNECT_PLUSE, null);
    }

    private startPluseTimer() {
        this.stopPluseTimer();
        this._pluseTimer = setInterval(() => {
            this.sendPluse();
        }, PLUSE_INTERVAL);
    }

    private stopPluseTimer() {
        if (this._pluseTimer) {
            clearInterval(this._pluseTimer);
            this._pluseTimer = null;
        }
    }
}

export default new GameConnectModel()