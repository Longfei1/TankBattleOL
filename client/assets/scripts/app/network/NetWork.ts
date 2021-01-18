export class WSConnect {
    private _tagName: string = "";
    private _bSsl: boolean = false;
    private _hostUrl: string = null;
    private _socket: WebSocket = null;

    private _connecting: boolean = false;
    private _connected: boolean = false;

    private _connectOkHandler: Function = null;
    private _connectErrorHandler: Function = null;
    private _msgHandler: Function = null;

    public constructor(_tagName: string, _bSsl: boolean) {
        this._tagName = _tagName;
        this._bSsl = _bSsl;
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

            this.onConnectOk();
        };

        this._socket.onmessage = (event: MessageEvent) => { 
            let recvData = event.data
            console.log(`${this.tagPrefix()} onmessage ${event}`);
            this.onMessage(recvData);
        };

        this._socket.onerror = (event: Event) => { 
            this.clearSocket();
            console.error(`${this.tagPrefix()} onError from[${this._hostUrl}] msg:${event}.`);
            this.onConnectError();
        };

        this._socket.onclose = (event: CloseEvent) => {
            this.clearSocket();
            console.info(`${this.tagPrefix()} onClose from[${this._hostUrl}] msg:${event}.`);
            this.onConnectError();
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

        this._connectOkHandler = null;
        this._connectErrorHandler = null;
    }

    public connect(ip: string, port: number, fnConOk: Function, fnConErr: Function) {
        if (ip && port != null) {
            let head = this._bSsl ? "wss" : "ws";
            this._hostUrl = `${head}://${ip}:${port}`;
        }

        this._connectOkHandler = fnConOk;
        this._connectErrorHandler = fnConErr;

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

    private onConnectOk() {
        if (this._connectOkHandler) {
            this._connectOkHandler();
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