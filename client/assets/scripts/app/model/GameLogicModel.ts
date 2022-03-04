import Big, { BigSource } from "../../packages/bigjs/Big";
import CommonFunc from "../common/CommonFunc";
import RandomDevice from "../common/RandomDevice";
import TimeSchedule from "../common/TimeSchedule";
import { gameController } from "../component/game/Game";
import GameUnitComponent from "../component/game/GameUnitComponent";
import EnemyTank from "../component/game/tank/EnemyTank";
import PlayerTank from "../component/game/tank/PlayerTank";
import { EventDef } from "../define/EventDef";
import { GameDef } from "../define/GameDef";
import { GameStruct } from "../define/GameStruct";
import { gamereq } from "../network/proto/gamereq";
import BaseModel from "./BaseModel";
import GameConnectModel from "./GameConnectModel";
import GameDataModel from "./GameDataModel";

class GameLogicModel extends BaseModel {
    _randomDevice: RandomDevice = new RandomDevice();
    _tiemSchedule: TimeSchedule = new TimeSchedule();

    _logicTime: number = 0;

    _localFrameTimer = null;
    _localFrameNo: number = 0;

    _frameHandleTimer = null;
    _frameQueue: any[] = [];//gamereq.GameFrameNtf[]

    _netGameDxxw: boolean = false;//游戏断线续玩

    initModel() {
        super.initModel();

        GameConnectModel.addEventListener(EventDef.EV_NTF_GAME_FRAME, this.onNtfGameFrame, this);
    }

    reset() {
        this.stopLocalFrameTimer();
        this.stopFrameHandleTimer();

        this._tiemSchedule.clear();

        this._logicTime = 0;

        if (!this._netGameDxxw) {
            this._frameQueue = [];
        }

        this._localFrameNo = 0;

        GameDataModel._netFrameNO = -1;
        for (let i = 0; i < GameDef.GAME_TOTAL_PLAYER; i++) {
            GameDataModel._localOpeCode[i] = 0;
        }
    }

    //开始游戏
    startGame() {
        if (!gameController) {
            return;
        }

        this.reset();
        
        if (GameDataModel.isModeOnline()) {
            if (!this._netGameDxxw) {
                //发送空的第0帧，代表准备完成
                GameConnectModel.sendGameFrame(0);
            }
        }
        else {
            //非联机模式
            this.setRandomSeed(CommonFunc.getTimeStamp());

            //开启本地帧定时器，承当帧服务器角色
            this.startLocalFrameTimer();
        }

        //开启帧处理
        this.startFrameHandleTimer();
    }

    //退出游戏
    exitGame() {
        this._netGameDxxw = false;
        this.reset();
    }

    setRandomSeed(seed: number) {
        GameDataModel._netRandomSeed = seed;
        this._randomDevice.setSeed(seed);
    }

    onNtfGameFrame(info: gamereq.GameFrameNtf) {
        if (GameDataModel._netLogined) {
            this._frameQueue.push(info);
        }
    }

    onGameFrame(info: gamereq.GameFrameNtf): number {
        if (!gameController) {
            return 1;
        }

        if (!GameDataModel._renderUpdated && !GameDataModel._pause) {
            if (GameDataModel.isGameDebugMode()) {
                //console.error(`render not updated! frame:${info.frame}`);
            }
            return 1;
        }

        if (info.frame !== GameDataModel._netFrameNO + 1) {
            if (GameDataModel.isGameDebugMode()) {
                console.error(`GameFrame Error Wait:${GameDataModel._netFrameNO + 1} Receive:${info.frame}`);
            }
            return 2;
        }

        GameDataModel._renderUpdated = false;
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
                if (!GameDataModel._pause) {
                    //处理上1个逻辑帧延后的事件
                    this.emit(EventDef.EV_GL_LAST_FRAME_EVENT);

                    //执行定时器
                    this._logicTime += this.getFrameInterval();
                    this._tiemSchedule.onTimer();

                    //处理玩家操作
                    this.emit(EventDef.EV_GL_PLAYER_OPERATION, opes);

                    //处理AI操作
                    this.emit(EventDef.EV_GL_AI_OPERATION);

                    //1个逻辑帧拆分多个物理帧，用于处理碰撞检测
                    let physicsFrames = GameDef.GAME_FPS_PHYSICS/this.getLogicFrameNum();
                    for (let i = 0; i < physicsFrames; i++) {
                        let dt = Big(this.getFrameInterval()).div(physicsFrames).div(1000);//单位（秒）

                        //更新1个物理帧
                        this.emit(EventDef.EV_GL_UPDATE, dt);
                        
                        //碰撞检测
                        this.onCollisionDetection();

                        this.emit(EventDef.EV_GL_LATE_UPDATE);
                    }
                }
            }
        }

        //采集操作数据，上传游戏帧
        this.emit(EventDef.EV_GL_CAPTURE_OPERATION);
        if (GameDataModel.isModeOnline() && !this._netGameDxxw) {
            GameConnectModel.sendGameFrame(GameDataModel._localOpeCode[0]);
        }
        return 0;
    }

    //启用本地帧定时器
    startLocalFrameTimer() {
        this.stopLocalFrameTimer();
        this._localFrameTimer = setInterval(this.onLocalGameFrameTimer.bind(this), this.getFrameInterval());
    }

    //停止本地帧定时器
    stopLocalFrameTimer() {
        if (this._localFrameTimer) {
            clearInterval(this._localFrameTimer);
            this._localFrameTimer = null;
        }
    }

    //本地游戏帧处理
    onLocalGameFrameTimer() {
        let opes = [];
        for (let i = 0; i < GameDef.GAME_TOTAL_PLAYER; i++) {
            opes.push({ playerno: i, opecode: GameDataModel._localOpeCode[i]});
        }

        //写入帧队列
        this._frameQueue.push(gamereq.GameFrameNtf.create({
            frame: this._localFrameNo,
            useropes: opes,
        }));

        this._localFrameNo++;
    }

     //启用帧处理定时器
    startFrameHandleTimer() {
        this.stopFrameHandleTimer();
        this._frameHandleTimer = setInterval(this.onGameFrameHandleTimer.bind(this));
    }

    //停止帧处理定时器
    stopFrameHandleTimer() {
        if (this._frameHandleTimer) {
            clearInterval(this._frameHandleTimer);
            this._frameHandleTimer = null;
        }
    }

    onGameFrameHandleTimer() {
        if (this._frameQueue.length > 0) {
            let ret = this.onGameFrame(this._frameQueue[0]);
            if (ret === 0) {
                this._frameQueue.splice(0, 1);
            }
            else if (ret === 2) {
                //帧号不一致
            }
        }
        else {
            //追帧完毕
            if (this._netGameDxxw) {
                this._netGameDxxw = false;
            }
        }
    }

    //获取逻辑帧数
    getLogicFrameNum(): number {
        let fps = GameDef.GAME_FPS_LOGIC_LOCAL;
        if (GameDataModel.isModeOnline()) {
            fps = GameDef.GAME_FPS_LOGIC_NET;
        }
        return fps;
    }

    //获取帧间隔时间（毫秒）
    getFrameInterval(): number {
        return Math.floor(Big(1000).div(this.getLogicFrameNum()).toNumber());
    }

    //获取逻辑时间戳（毫秒），根据帧数来
    getLogicTime(): number {
        return this._logicTime;
    }

    //随机数[0,1)
    randomNumber(): Big {
        return this._randomDevice.randomNumber();
    }

    getRandomNumber(min: number, max: number): Big {
        return this._randomDevice.getRandomNumber(min, max);
    }

    getRandomInteger(min: number, max: number): number {
        return this._randomDevice.getRandomInteger(min, max);
    }

    /**
     * 随机返回数组中的一个元素
     * @param ary 数组
     */
    getRandomArrayValue(ary: any[]): any {
        if (ary.length > 0) {
            let selectIndex = this.getRandomInteger(0, ary.length - 1);
            return ary[selectIndex];
        }
    }

    /**
     * 随机返回数组中的一个元素
     * @param ary 数组
     * @param weights 权值
     */
    getRandomArrayValueWithWeight(ary: any[], weights: BigSource[]): any {
        if (ary.length <= weights.length) {
            let total = this.sumNumberArrayToBig(weights);
            let value = total.mul(this.randomNumber());
            
            let currLine = Big(0);
            for (let i = 0; i < weights.length; i++) {
                currLine = currLine.plus(weights[i]);
                if (value.lt(currLine)) {
                    return ary[i];
                }
            }
        }
        return null;
    }

    sumNumberArrayToBig(ary: BigSource[]): Big {
        let total = Big(0);
        for (let it of ary) {
            total = total.plus(it);
        }
        return total;
    }

    /**
     * 是否触发给定概率
     * @param rate 0-1的概率
     */
    isInProbability(rate: BigSource): boolean {
        if (this.randomNumber().lt(rate)) {
            return true;
        }
        else {
            return false;
        }
    }

    secondToMillisecond(n: number): number {
        return Math.floor(Big(n).mul(1000).toNumber());
    }

    //定时任务（在每个逻辑帧最开始执行）单位（秒）
    schedule(callback: Function, context: any, interval: number): number {
        return this._tiemSchedule.schedule(callback, context, this.secondToMillisecond(interval));
    }

    //单次定时任务（在每个逻辑帧最开始执行）
    scheduleOnce(callback: Function, context: any, interval: number): number {
        return this._tiemSchedule.scheduleOnce(callback, context, this.secondToMillisecond(interval));
    }

    //取消指定定时任务
    unschedule(id: number) {
        this._tiemSchedule.unschedule(id);
    }

    //取消一个上下文上的所有定时任务
    unscheduleAll(context: any) {
        this._tiemSchedule.unscheduleAll(context);
    }

    //碰撞检测
    onCollisionDetection() {
        //坦克、子弹运动过程中，通过预测的方式，在logicUpdate中判断能否移动。

        //碰撞检测，以便判断物体是否被命中，以便销毁
        {
            //坦克-道具
            if (GameDataModel._prop) {
                let propRect = GameDataModel._prop.getPropRect();
                CommonFunc.travelMap(GameDataModel._playerTanks, (no: number, player: PlayerTank) => {
                    if (!player._borning) {
                        let playerRect = player.getTankRect();
                        if (GameDataModel.isRectOverlap(propRect, playerRect)) {
                            this.dispatchCollision(GameDataModel._prop, player);
                        }
                    }
                });
            }
            
            //子弹
            let bulletKeys = Object.getOwnPropertyNames(GameDataModel._bullets);
            for (let i = 0; i < bulletKeys.length; i++) {
                let rect1 = GameDataModel._bullets[bulletKeys[i]].getBulletRect();

                //子弹-子弹
                for (let j = i + 1; j < bulletKeys.length; j++) {
                    let rect2 = GameDataModel._bullets[bulletKeys[j]].getBulletRect();
                    if (GameDataModel.isRectOverlap(rect1, rect2)) {
                        this.dispatchCollision(GameDataModel._bullets[bulletKeys[i]], GameDataModel._bullets[bulletKeys[j]]);
                    }
                }

                //子弹-玩家
                CommonFunc.travelMap(GameDataModel._playerTanks, (no: number, player: PlayerTank) => {
                    if (!player._borning) {
                        let tankRect: GameStruct.BigRect = player.getTankRect();
                        if (GameDataModel.isRectOverlap(rect1, tankRect)) {
                            this.dispatchCollision(GameDataModel._bullets[bulletKeys[i]], player);
                        }
                    }
                });

                //子弹-敌军
                CommonFunc.travelMap(GameDataModel._enemyTanks, (id: number, enemy: EnemyTank) => {
                    if (!enemy._borning) {
                        let tankRect: GameStruct.BigRect = enemy.getTankRect();
                        if (GameDataModel.isRectOverlap(rect1, tankRect)) {
                            this.dispatchCollision(GameDataModel._bullets[bulletKeys[i]], enemy);
                        }
                    }
                });

                //子弹-基地
                if (GameDataModel._homeBase) {
                    let homeRect = GameDataModel._homeBase.getHomeRect();
                    if (GameDataModel.isRectOverlap(rect1, homeRect)) {
                        this.dispatchCollision(GameDataModel._bullets[bulletKeys[i]], GameDataModel._homeBase);
                    }
                }
            }
        }
    }

    dispatchCollision(left: GameUnitComponent, right: GameUnitComponent) {
        left.onClilision({tag: 0, node: left.node}, {tag: 0, node: right.node});
        right.onClilision({tag: 0, node: right.node}, {tag: 0, node: left.node});
    }
}

export default new GameLogicModel();