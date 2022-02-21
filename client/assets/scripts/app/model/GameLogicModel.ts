import Big from "../../packages/bigjs/Big";
import Game, { gameController } from "../component/game/Game";
import { EventDef } from "../define/EventDef";
import { GameDef } from "../define/GameDef";
import { GameStruct } from "../define/GameStruct";
import { gamereq } from "../network/proto/gamereq";
import BaseModel from "./BaseModel";
import GameConnectModel from "./GameConnectModel";
import GameDataModel from "./GameDataModel";

class GameLogicModel extends BaseModel {

    _frameTimer = null;

    initModel() {
        super.initModel();

        GameConnectModel.addEventListener(EventDef.EV_NTF_GAME_FRAME, this.onGameFrame, this);
    }

    //开始游戏
    startGame() {
        if (!gameController) {
            return;
        }

        if (GameDataModel.isModeOnline()) {
            //发送空的第0帧，代表准备完成
            GameDataModel._netFrameNO = -1;
            GameConnectModel.sendGameFrame(0);
        }
        else {
            //非联机模式
            let opes = [];
            for (let i = 0; i < GameDef.GAME_TOTAL_PLAYER; i++) {
                opes.push({ playerno: i, opecode: 0});
            }

            this.onGameFrame(gamereq.GameFrameNtf.create({
                frame: 0,
                useropes: opes,
            }));

            //开启本地帧定时器，推动逻辑帧运行。
            this.startFrameTimer();
        }
    }

    //退出游戏
    exitGame() {
        this.stopFrameTimer();
    }

    onGameFrame(info: gamereq.GameFrameNtf) {
        if (!gameController) {
            return;
        }

        if (info.frame !== GameDataModel._netFrameNO + 1) {
            console.error(`GameFrame Error Wait:${GameDataModel._netFrameNO} Receive:${info.frame}`);
            return;
        }

        let lastFrame = GameDataModel._lastGameFrame;
        GameDataModel._lastGameFrame = info;
        GameDataModel._netFrameNO = info.frame;

        if (GameDataModel.isGameDebugMode()) {
            let frameStr = `frame:${info.frame}`;
            gameController.node.emit(EventDef.EV_GAME_SHOW_DEBUG_TEXT, frameStr);
        }

        if (info.frame === 0) {
            //第0帧初始帧
            gameController.startGameStage(1);
        }
        else {
            //游戏帧处理
            let opes: GameStruct.PlayerOperation[] = [];
            let start: GameStruct.GameKeyInfo = null; 
            for (let i = 0; i < info.useropes.length; i++) {
                let code = info.useropes[i].opecode;

                if (info.useropes[i].playerno === 0) {
                    start = {
                        status: code & 0x20,
                        record: code & 0x200000,
                    }
                }

                let ope: GameStruct.PlayerOperation = {
                    playerNO: info.useropes[i].playerno,
                    direction: {
                        status: code & 0x7,
                        record: code & 0x70000,
                    },
                    ok: {
                        status: code & 0x8,
                        record: code & 0x80000,
                    },
                    cancel: {
                        status: code & 0x10,
                        record: code & 0x100000,
                    },
                } 
                opes.push(ope);
            }

            if (!gameController.onBtnStart(start)) {
                this.emit(EventDef.EV_GL_PLAYER_OPERATION, opes);
            }
        }

        //采集操作数据，上传游戏帧
        this.emit(EventDef.EV_GL_CAPTURE_OPERATION);
        if (GameDataModel.isModeOnline()) {
            GameConnectModel.sendGameFrame(GameDataModel._localOpeCode[0]);
        }
    }

    //获取帧间隔时间（毫秒）
    getFrameInterval(): number {
        return Math.floor((1000/GameDef.GAME_FPS_LOGIC));
    }

    //获取逻辑时间戳（毫秒），根据帧数来
    getLogicTime(): number {
        return this.getFrameInterval() * (GameDataModel._netFrameNO + 1);
    }

    //启用帧定时器
    startFrameTimer() {
        this.stopFrameTimer();
        setInterval(this.onLocalGameFrame.bind(this), this.getFrameInterval());
    }

    //停止帧定时器
    stopFrameTimer() {
        if (this._frameTimer) {
            clearInterval(this._frameTimer);
            this._frameTimer = null;
        }
    }

    //本地游戏帧处理
    onLocalGameFrame() {
        let opes = [];
        for (let i = 0; i < GameDef.GAME_TOTAL_PLAYER; i++) {
            opes.push({ playerno: i, opecode: GameDataModel._localOpeCode[i]});
        }

        //统一调用网络帧处理函数
        this.onGameFrame(gamereq.GameFrameNtf.create({
            frame: GameDataModel._netFrameNO + 1,
            useropes: opes,
        }));
    }
}

export default new GameLogicModel();