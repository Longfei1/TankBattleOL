import BaseReq = require("../network/proto/basereq");
import CommonFunc from "../common/CommonFunc";
import { GameDef } from "../define/GameDef";
import { GameProtocal } from "./GameProtocal";

export class WSConnect {
    private _tagName: string = "";
    private _bSsl: boolean = false;
    private _hostUrl: string = null;
    private _socket: WebSocket = null;

    private _connecting: boolean = false;
    private _connected: boolean = false;

    private _connectHandler: Function = null;
    private _connectErrorHandler: Function = null;
    private _msgHandler: Function = null;

    public constructor(tagName: string, bSsl: boolean) {
        this._tagName = tagName;
        this._bSsl = bSsl;
    }

    private initSocket() {
        if (!this._hostUrl) {
            return;
        }

        this._socket = new WebSocket(this._hostUrl);

        this._socket.binaryType = 'arraybuffer';
        this._connecting = true;

        this._socket.onopen = (event: Event) => { 
            this._connecting = false;
            this._connected = true;

            console.log(`${this.tagPrefix()} connect to server ok!`);

            this.onConnectSuccess();
        };

        this._socket.onmessage = (event: MessageEvent) => { 
            console.log(`${this.tagPrefix()} onmessage ${event}`);
            let recvData = event.data
            this.onMessage(recvData);
        };

        this._socket.onerror = (event: Event) => { 
            console.error(`${this.tagPrefix()} onError from[${this._hostUrl}] msg:${event}.`);

            if (this._connecting) {
                this.onConnectFailed();
            }
            else {
                this.onConnectError();
            }

            this.clearSocket();
        };

        this._socket.onclose = (event: CloseEvent) => {
            console.info(`${this.tagPrefix()} onClose from[${this._hostUrl}] msg:${event}.`);
            
            if (this._connecting) {
                this.onConnectFailed();
            }
            else {
                this.onConnectError();
            }

            this.clearSocket();
        };
    }

    public clearSocket() {
        if (this._socket) {
            this._socket.onmessage = () => { };
            this._socket.onerror = () => { };
            this._socket.onclose = () => { };

            if (this._connecting) {
                let temp = this._socket;
                temp.onopen = () => {
                    temp.close();
                }
            }
            else {
                this._socket.onopen = () => { };
                this._socket.close();
            }
        }

        this._hostUrl = null;
        this._socket = null;

        this._connecting = false;
        this._connected = false;

        this._connectHandler = null;
        this._connectErrorHandler = null;
    }

    public setSocketErrorHandler(handler: Function) {
        this._connectErrorHandler = handler;
    }

    public connect(ip: string, port: number, conHandler: Function) {
        if (ip && port != null) {
            let head = this._bSsl ? "wss" : "ws";
            this._hostUrl = `${head}://${ip}:${port}`;
        }

        this._connectHandler = conHandler;

        if (!this._socket) {
            this.initSocket();
        }
        else {
            console.error(this.tagPrefix() + "connect error, _socket aleady exist!");
            this.onConnectError();
        }
    }

    public disconnect() {
        this.clearSocket();
    }

    public sendData(data: ArrayBuffer) {
        if (this._socket) {
            this._socket.send(data);
        }
    }

    private onConnectSuccess() {
        if (this._connectHandler) {
            this._connectHandler(true);
        }
    }

    private onConnectFailed() {
        if (this._connectHandler) {
            this._connectHandler(false);
        }
    }

    private onConnectError() {
        if (this._connectErrorHandler) {
            this._connectErrorHandler();
        }
    }

    private tagPrefix(): string {
        let date = new Date()
        return `[Net${this._tagName}][${date.toLocaleTimeString()}]`;
    }

    private onMessage(data) {
        if (this._msgHandler) {
            this._msgHandler(data);
        }
    }

    public setMessageHandler(handler: Function) {
        this._msgHandler = handler;
    }

    public isConnected(): boolean {
        return this._connected;
    }
};

class RequestMsg {
    requestID: number = 0;
    needEcho: boolean = false;
    data: GameProtocal.PbAnyPackage = null;
    handler: Function = null;
}

const PLUSE_INTERVAL = 30;//心跳发送间隔时长

export class GameConnect {
    private _socket: WSConnect = null;

    private _sequence: number = 0;//消息序列号
    private _waitResponse: boolean = false;//是否在等待回应
    private _waitSequence: number = -1;//等待回应的序列号
    private _requestQueue: RequestMsg[] = [];//请求队列
    private _responseHandler: Function = null;//响应回调函数

    private _notifyHandler: { [requestid: number]: Function } = {};//通知处理函数

    private _pluseTimer = null;//心跳定时器

    constructor(name: string) {
        if (this.isNetSupported()) {
            this._socket = new WSConnect(name, false);

            this._socket.setMessageHandler((data) => {
                this.onMessage(data);
            });
        }
        else {
            console.log("not support websocket!")
        }
    }

    //清空数据
    clearData() {
        this._sequence = 0;
        this._waitResponse = false;
        this._waitSequence = -1;
        this._requestQueue = [];
        this._responseHandler = null;

        this.stopPluseTimer();
    }

    setSocketErrorHandler(handler: Function) {
        if (this._socket) {
            this._socket.setSocketErrorHandler(() => {
                if (handler) {
                    handler();
                }
                this.clearData();
            });
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
        if (this._socket) {
            return this._socket.isConnected();
        }
        return false;
    }

    addNotifyHandler(requestID: number, handler: Function) {
        this._notifyHandler[requestID] = handler;
    }

    connect(serverIP: string, serverPort: number, callback: Function) {
        if (!this.isConnected()) {
            if (this._socket) {
                this._socket.connect(serverIP, serverPort, (ret) => {
                    if (callback) {
                        callback(ret);
                    }
                    if (ret) {
                        this.sendRequestInQueue();
                        this.startPluseTimer();
                    }
                    else {
                        this.clearData();
                    }
                });
            }
        }
    }

    disconnect() {
        if (this._socket) {
            this._socket.disconnect();
        }
        this.clearData();
    }

    sendRequest(requestID:number, pbAnyPackage: GameProtocal.PbAnyPackage, needResponse: boolean = false, responseHandler: Function = null) {
        if (!this._socket) {
            return;
        }

        if (!this.isConnected() || this._waitResponse) {
            let request: RequestMsg = {
                requestID: requestID,
                needEcho: needResponse,
                data: pbAnyPackage,
                handler: responseHandler,
            };
            
            this.pushRequestToQueue(request);
            return;
        }

        let pbData = pbAnyPackage ? CommonFunc.pbObjectToAny(pbAnyPackage.obj, pbAnyPackage.pbHandler, pbAnyPackage.typeUrl) : null;
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

        let dataEncode = CommonFunc.pbEncode(msg, BaseReq.basereq.Request);
        this._socket.sendData(dataEncode);

        if (!needResponse) {
            this.sendRequestInQueue();
        }
    }

    private onMessage(data: ArrayBuffer) {
        let request: BaseReq.basereq.Request = CommonFunc.pbDecode(new Uint8Array(data), BaseReq.basereq.Request);

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
        this.sendRequest(GameProtocal.GR_CONNECT_PLUSE, null);
    }

    private startPluseTimer() {
        this.stopPluseTimer();
        this._pluseTimer = setInterval(() => {
            this.sendPluse();
        }, PLUSE_INTERVAL * 1000);
    }

    private stopPluseTimer() {
        if (this._pluseTimer) {
            clearInterval(this._pluseTimer);
            this._pluseTimer = null;
        }
    }
}