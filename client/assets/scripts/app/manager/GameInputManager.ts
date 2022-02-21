import { EventDef } from "../define/EventDef";
import { GameDef } from "../define/GameDef";
import { GameStruct } from "../define/GameStruct";
import { PlayerDef } from "../define/PlayerDef";
import GameDataModel from "../model/GameDataModel";
import GameInputModel from "../model/GameInputModel";
import GameLogicModel from "../model/GameLogicModel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameInputManager extends cc.Component {

    //方向键
    _keyDirection: {[no: number] : GameStruct.GameKeyInfo} = {};
    //A键
    _keyOK: {[no: number] : GameStruct.GameKeyInfo} = {};
    //B键
    _keyCancel: {[no: number] : GameStruct.GameKeyInfo} = {};
    //开始键
    _keyStart: GameStruct.GameKeyInfo = null;

    onLoad() {
        this.initListener();

        this.resetKeyInfo();
    }

    onDestroy() {
        this.removeListener();
    }

    initListener() {
        GameInputModel.addKeyDownOnceListener(this.onKeyDown, this.onKeyUp, this);

        GameLogicModel.addEventListener(EventDef.EV_GL_CAPTURE_OPERATION, this.evCaptureFrameOpe, this);
    }

    removeListener() {
        GameInputModel.removeInputListenerByContext(this);
        GameLogicModel.removeEventListenerByContext(this);
    }

    resetKeyInfo() {
        for (let i = 0; i < GameDef.GAME_TOTAL_PLAYER; i++) {
            this._keyDirection[i] = { status: 0, record: GameDef.NetKeyDirection.NULL };
            this._keyOK[i] = { status: 0, record: 0 };
            this._keyCancel[i] = { status: 0, record: 0 };
        }

        this._keyStart = { status: 0, record: 0 };
    }

    resetKeyInfoRecord() {
        for (let i = 0; i < GameDef.GAME_TOTAL_PLAYER; i++) {
            this._keyDirection[i].record = GameDef.NetKeyDirection.NULL;
            this._keyOK[i].record = 0;
            this._keyCancel[i].record = 0;
        }

        this._keyStart.record = 0;
    }

    onKeyDown(event) {
        if (event.keyCode === PlayerDef.KEYMAP_COMMON.START) {
            this._keyStart.status = 1;
            this._keyStart.record = 1;
            return;
        }

        if (!GameDataModel._enableOperate) {
            return;
        }
        switch (event.keyCode) {
            case PlayerDef.KEYMAP_PLAYER1.UP:
                this.onKeyDownInfo(0, this._keyDirection, GameDef.NetKeyDirection.UP);
                break;
            case PlayerDef.KEYMAP_PLAYER1.LEFT:
                this.onKeyDownInfo(0, this._keyDirection, GameDef.NetKeyDirection.LEFT);
                break;
            case PlayerDef.KEYMAP_PLAYER1.DOWN:
                this.onKeyDownInfo(0, this._keyDirection, GameDef.NetKeyDirection.DOWN);
                break;
            case PlayerDef.KEYMAP_PLAYER1.RIGHT:
                this.onKeyDownInfo(0, this._keyDirection, GameDef.NetKeyDirection.RIGHT);
                break;
            case PlayerDef.KEYMAP_PLAYER1.OK:
                this.onKeyDownInfo(0, this._keyOK, 1);
                break;
            case PlayerDef.KEYMAP_PLAYER1.CANCEL:
                this.onKeyDownInfo(0, this._keyCancel, 1);
                break;
            case PlayerDef.KEYMAP_PLAYER2.UP:
                this.onKeyDownInfo(1, this._keyDirection, GameDef.NetKeyDirection.UP);
                break;
            case PlayerDef.KEYMAP_PLAYER2.LEFT:
                this.onKeyDownInfo(1, this._keyDirection, GameDef.NetKeyDirection.LEFT);
                break;
            case PlayerDef.KEYMAP_PLAYER2.DOWN:
                this.onKeyDownInfo(1, this._keyDirection, GameDef.NetKeyDirection.DOWN);
                break;
            case PlayerDef.KEYMAP_PLAYER2.RIGHT:
                this.onKeyDownInfo(1, this._keyDirection, GameDef.NetKeyDirection.RIGHT);
                break;
            case PlayerDef.KEYMAP_PLAYER2.OK:
                this.onKeyDownInfo(1, this._keyOK, 1);
                break;
            case PlayerDef.KEYMAP_PLAYER2.CANCEL:
                this.onKeyDownInfo(1, this._keyCancel, 1);
                break;
            default:
                break;
        }
    }

    onKeyUp(event) {
        if (event.keyCode === PlayerDef.KEYMAP_COMMON.START) {
            this._keyStart.status = 0;
            return;
        }

        if (!GameDataModel._enableOperate) {
            return;
        }
        switch (event.keyCode) {
            case PlayerDef.KEYMAP_PLAYER1.UP:
                this.onKeyUpInfo(0, this._keyDirection, GameDef.NetKeyDirection.UP, GameDef.NetKeyDirection.NULL);
                break;
            case PlayerDef.KEYMAP_PLAYER1.LEFT:
                this.onKeyUpInfo(0, this._keyDirection, GameDef.NetKeyDirection.LEFT, GameDef.NetKeyDirection.NULL);
                break;
            case PlayerDef.KEYMAP_PLAYER1.DOWN:
                this.onKeyUpInfo(0, this._keyDirection, GameDef.NetKeyDirection.DOWN, GameDef.NetKeyDirection.NULL);
                break;
            case PlayerDef.KEYMAP_PLAYER1.RIGHT:
                this.onKeyUpInfo(0, this._keyDirection, GameDef.NetKeyDirection.RIGHT, GameDef.NetKeyDirection.NULL);
                break;
            case PlayerDef.KEYMAP_PLAYER2.UP:
                this.onKeyUpInfo(1, this._keyDirection, GameDef.NetKeyDirection.UP, GameDef.NetKeyDirection.NULL);
                break;
            case PlayerDef.KEYMAP_PLAYER2.LEFT:
                this.onKeyUpInfo(1, this._keyDirection, GameDef.NetKeyDirection.LEFT, GameDef.NetKeyDirection.NULL);
                break;
            case PlayerDef.KEYMAP_PLAYER2.DOWN:
                this.onKeyUpInfo(1, this._keyDirection, GameDef.NetKeyDirection.DOWN, GameDef.NetKeyDirection.NULL);
                break;
            case PlayerDef.KEYMAP_PLAYER2.RIGHT:
                this.onKeyUpInfo(1, this._keyDirection, GameDef.NetKeyDirection.RIGHT, GameDef.NetKeyDirection.NULL);
                break;
            case PlayerDef.KEYMAP_PLAYER1.OK:
                this.onKeyUpInfo(0, this._keyOK, 1);
                break;
            case PlayerDef.KEYMAP_PLAYER2.OK:
                this.onKeyUpInfo(1, this._keyOK, 1);
                break;
            case PlayerDef.KEYMAP_PLAYER1.CANCEL:
                this.onKeyUpInfo(0, this._keyCancel, 1);
                break;
            case PlayerDef.KEYMAP_PLAYER2.CANCEL:
                this.onKeyUpInfo(1, this._keyCancel, 1);
                break;
            default:
                break;
        }
    }

    onKeyDownInfo(playerNO: number, info: {[no: number] : GameStruct.GameKeyInfo}, value: number) {
        info[playerNO].status = value;
        info[playerNO].record = value;
    }

    onKeyUpInfo(playerNO: number, info: {[no: number] : GameStruct.GameKeyInfo}, value: number, valueNull: number = 0) {
        if (info[playerNO].status === value) {
            info[playerNO].status = valueNull;
        }
    }

    getPlayerOpeCode(playerNO: number): number {
        let opeCode = 0;

        //record使用高16位
        opeCode += this._keyDirection[playerNO].status & 0x7;//低3位
        opeCode += this._keyDirection[playerNO].record & 0x70000;

        opeCode += this._keyOK[playerNO].status << 3;//低到高第4位
        opeCode += this._keyOK[playerNO].record << 19;

        opeCode += this._keyCancel[playerNO].status << 4;//低到高第5位
        opeCode += this._keyCancel[playerNO].record << 20;

        if (playerNO === 0) {
            opeCode += this._keyStart.status << 5;//低到高第6位
            opeCode += this._keyStart.record << 21;
        }

        return opeCode;
    }

    evCaptureFrameOpe() {
        GameDataModel._localOpeCode[0] = this.getPlayerOpeCode(0);
        GameDataModel._localOpeCode[1] = this.getPlayerOpeCode(1);

        this.resetKeyInfoRecord();//清除这一帧单次操作记录
    }
}