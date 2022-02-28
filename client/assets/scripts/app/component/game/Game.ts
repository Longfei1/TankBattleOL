import { EventDef } from "../../define/EventDef";
import GameDataModel from "../../model/GameDataModel";
import { GameDef } from "../../define/GameDef";
import GameInputModel from "../../model/GameInputModel";
import { PlayerDef } from "../../define/PlayerDef";
import CommonFunc from "../../common/CommonFunc";
import AudioModel from "../../model/AudioModel";
import { GameStruct } from "../../define/GameStruct";
import { AniDef } from "../../define/AniDef";
import GameConfigModel from "../../model/GameConfigModel";
import GameConnectModel from "../../model/GameConnectModel";
import GameLogicModel from "../../model/GameLogicModel";
import { gamereq } from "../../network/proto/gamereq";
import GameOpeControl from "../../common/GameOpeControl";

const {ccclass, property} = cc._decorator;

export let gameController: Game = null;

@ccclass
export default class Game extends cc.Component {

    @property({ displayName: "游戏层", type: cc.Node })
    panelGame: cc.Node = null;

    @property({ displayName: "道具层", type: cc.Node })
    panelProp: cc.Node = null;

    @property({ displayName: "动画层", type: cc.Node })
    panelAni: cc.Node = null;

    @property({ displayName: "游戏地图最小元素单元", type: cc.Node })
    nodeMapUnit: cc.Node = null;

    @property({ displayName: "调试信息标签", type: cc.Label })
    textDebug: cc.Label = null;

    @property({ displayName: "游戏场景中心", type: cc.Node })
    nodeGameCenter: cc.Node = null;

    @property({ displayName: "游戏盒子中心", type: cc.Node })
    nodeBoxCenter: cc.Node = null;

    @property({ displayName: "结算预制体", type: cc.Prefab })
    pfbResult: cc.Prefab = null;

    @property({ displayName: "暂停标记", type: cc.Node })
    nodePause: cc.Node = null;

    @property({ displayName: "暂停标记", type: cc.Prefab })
    pfbGameSuccess: cc.Prefab = null;

    _currLevel: number = 1;

    _resultPanel: cc.Node = null;
    _gameSuccessPanel: cc.Node = null;

    _opeStart: GameOpeControl = null;
    
    onLoad() {
        this.panelGame.active = false;
        gameController = this;
        this.initListener();

        GameDataModel._enableOperate = false;
        GameDataModel.resetGameData();
        GameDataModel.setMapUnit(this.nodeMapUnit.width, this.nodeMapUnit.height);

        this._opeStart = new GameOpeControl(0.3, 0.05);

        if (GameDataModel.isGameDebugMode()) {
            this.textDebug.node.active = true;
        }
        else {
            this.textDebug.node.active = false;
        }

        //单机模式下，断开网络连接。
        if (GameDataModel._playMode == GameDef.GAMEMODE_SINGLE_PLAYER || GameDataModel._playMode == GameDef.GAMEMODE_DOUBLE_PLAYER) {
            GameConnectModel.disconnectServer();
        }
    }

    onDestroy() {
        this.removeListener();
        //cc.director.getCollisionManager().enabled = false;

        gameController = null;
        GameLogicModel.exitGame();
    }

    start() {
        //所有脚本onload后即算初始化完成
        if (GameConfigModel.isAllDataLoaded()) {
            gameController.node.emit(EventDef.EV_GAME_INIT_FINISHED);
        }
        else {
            console.error("GameConfig Load Failed!");
        }
    }

    initListener() {
        GameInputModel.addKeyDownOnceListener(() => {
            //GameDataModel.resetGameData();
            CommonFunc.playButtonSound();
            if (GameDataModel.isModeOnline()) {
                CommonFunc.showChooseDialog("你当前正在游戏中，退出将自动离开房间并返回主菜单，是否继续退出操作？", null, () => {
                    GameConnectModel.sendLeaveRoom((ret: number, data) => {
                        if (ret === 0) {
                            this.goToMainMenu(); 
                        }
                    });
                }, null, null);
            }
            else {
                this.goToMainMenu();
            }
        }, null, this, PlayerDef.KEYMAP_COMMON.BACK);
        if (GameDataModel.isGameDebugMode()) {
            GameInputModel.addKeyDownOnceListener(() => {
                this.onTest();
            }, null, this, cc.macro.KEY.t);
        }
        GameInputModel.addInputHierarchy(false, this);

        this.node.on(EventDef.EV_GAME_INIT_FINISHED, this.evInitGameFinished, this)
        this.node.on(EventDef.EV_GAME_SHOW_DEBUG_TEXT, this.onDebugTextOut, this);

        GameConnectModel.addEventListener(EventDef.EV_NTF_LEAVE_ROOM, this.onNtfLeaveRoom, this);
    }

    removeListener() {
        GameInputModel.removeInputListenerByContext(this);
    }

    goToMainMenu() {
        cc.director.loadScene("Menu");
    }

    reloadGame() {
        cc.director.loadScene("Game");
    }

    evInitGameFinished() {
        GameLogicModel.startGame();
    }

    startGameStage(stage: number) {
        GameDataModel._currStage = stage;
        this.playStartGameAni(stage, () => {
            this.gameStart();
        });

        this.prepareGame();

        if (GameDataModel.isModeEditMap()) {
            if (GameDataModel.isModeOnline()) {
                CommonFunc.showToast("地图编辑完成后，房主按下Enter键便可开始游戏！", 3);
            }
            else {
                CommonFunc.showToast("地图编辑完成后，房主按下Enter后可返回菜单，继续选择单人或双人模式！", 3); 
            }
        }
    }

    prepareGame() {
        GameDataModel.resetGameStageData();

        gameController.node.emit(EventDef.EV_GAME_PREPARE_GAME);
    }

    playStartGameAni(stage: number, callback) {
        if (GameDataModel.isModeEditMap()) {
            this.panelGame.active = true;
            callback();
        }
        else {
            this.panelGame.active = false;
            AudioModel.playSound("sound/start");
            this.playSceneAni(
                AniDef.SceneAniType.GAME_START,
                AniDef.UnitAniMode.TIMELIMIT,
                2,
                {
                    scriptName: "GameStartAni",
                    params: { ["stage"]: stage},
                },
                null,
                () => {
                    this.panelGame.active = true;
                    callback();
                },
            );
        }
    }

    gameStart() {
        GameDataModel._gameRunning = true;
        this.node.emit(EventDef.EV_GAME_STARTED); //其他模块执行开始逻辑

        GameDataModel._enableOperate = true; //打开控制开关
        //cc.director.getCollisionManager().enabled = true; //打开碰撞检测
    }

    //游戏结束，进入结算
    gameEnd() {
        GameDataModel._gameRunning = false;
        GameDataModel._enableOperate = false; //关闭控制开关
        //cc.director.getCollisionManager().enabled = false; //关闭碰撞检测

        cc.audioEngine.stopAll();

        this.node.emit(EventDef.EV_GAME_ENDED);

        this.showGameResult();
    }

    //游戏结束，失败
    gameOver() {
        GameDataModel._gameOver = true;
        GameDataModel._enableOperate = false;

        this.playUnitAniInTime(AniDef.UnitAniType.GAME_OVER, this.nodeGameCenter, 2, null, null, () => {
            this.gameEnd();
        });
    }

    playUnitAni(aniInfo: GameStruct.AniInfo) {
        if (aniInfo) {
            this.node.emit(EventDef.EV_UNITANI_PLAY, aniInfo);
        }
    }

    //为确保动画渲染与逻辑帧一致，这个接口去掉
    // playUnitAniOnce(type, node: cc.Node, params = null, startCallback = null, endCallback = null): number {
    //     let aniInfo: GameStruct.AniInfo = {
    //         node: node,
    //         mode: AniDef.UnitAniMode.ONCE,
    //         type: type,
    //         time: 0,
    //         startCallback: startCallback,
    //         endCallback: endCallback,
    //         aniID: null,
    //         param: params,
    //     }
    //     this.playUnitAni(aniInfo);

    //     return aniInfo.aniID
    // }

    playUnitAniLoop(type, node: cc.Node, params = null, startCallback = null, endCallback = null): number {
        let aniInfo: GameStruct.AniInfo = {
            node: node,
            mode: AniDef.UnitAniMode.LOOP,
            type: type,
            time: 0,
            startCallback: startCallback,
            endCallback: endCallback,
            aniID: null,
            param: params,
        }
        this.playUnitAni(aniInfo);

        return aniInfo.aniID
    }

    playUnitAniInTime(type, node: cc.Node, time = 0, params = null, startCallback = null, endCallback = null): number {
        let aniInfo: GameStruct.AniInfo = {
            node: node,
            mode: AniDef.UnitAniMode.TIMELIMIT,
            type: type,
            time: time,
            startCallback: startCallback,
            endCallback: endCallback,
            aniID: null,
            param: params,
        }
        this.playUnitAni(aniInfo);

        return aniInfo.aniID
    }

    playSceneAni(type, mode, time = 0, params = null, startCallback = null, endCallback = null) {
        let aniInfo: GameStruct.AniInfo = {
            node: null,
            mode: mode,
            type: type,
            time: time,
            startCallback: startCallback,
            endCallback: endCallback,
            aniID: null,
            param: params,
        }

        this.node.emit(EventDef.EV_SCENEANI_PLAY, aniInfo);
        return aniInfo.aniID
    }

    //停止指定id的动画
    stopAni(aniID: number) {
        this.node.emit(EventDef.EV_ANI_STOP, aniID);
    }

    onTest() {
        //创建场景地图
        //this.node.emit(EventDef.EV_TEST_CREATE_GAMEMAP);

        //随机生成一个敌军坦克
    }

    getPanelGame() {
        return this.panelGame;
    }

    onDebugTextOut(text: string) {
        if (GameDataModel.isGameDebugMode()) {
            this.textDebug.string = text;
        }
    }

    showGameResult() {
        this.closeGameResult();

        this._resultPanel = cc.instantiate(this.pfbResult);
        this.nodeBoxCenter.addChild(this._resultPanel);
    }

    closeGameResult() {
        if (this._resultPanel) {
            this._resultPanel.destroy();
            this._resultPanel = null;
        }
    }

    onBtnStart(info: GameStruct.GameKeyInfo): boolean {
        if (!info || !this._opeStart.effectInput(info)) {
            return false;
        }

        CommonFunc.playButtonSound();
        if (GameDataModel.isModeEditMap()) {
            this.node.emit(EventDef.EV_MAP_EDIT_FINISHED);

            if (GameDataModel.isModeOnline()) {
                GameDataModel._useCustomMap = true;
                this.reloadGame();
            }
            else {
                //单机模式下，退回菜单，重新选择单双人游戏
                GameDataModel._playMode = -1;
                GameDataModel._useCustomMap = true;
                GameDataModel._gotoMenuPage = GameDef.MenuPage.OFFLINE;
                this.goToMainMenu();
            }
        }
        else {
            if (GameDataModel._gameRunning) {
                if (GameDataModel.isGamePause()) {
                    GameDataModel._enableOperate = true;
                    cc.director.resume();
                    cc.audioEngine.resumeAll();

                    this.node.emit(EventDef.EV_GAME_RESUME);
                    this.nodePause.active = false;
                }
                else {
                    GameDataModel._enableOperate = false;
                    cc.director.pause();
                    cc.audioEngine.pauseAll();

                    this.node.emit(EventDef.EV_GAME_PAUSE);
                    this.nodePause.active = true;
                }
            }
        }

        return true;
    }

    playGainScoreAni(pos: cc.Vec2, score: number) {
        if (pos && score != null && score > 0) {
            this.playUnitAniInTime(AniDef.UnitAniType.GAIN_SCORE, this.panelAni, 0.7, { scriptName: "GainScoreAni", pos: pos, params: {score: score}});
        }
    }

    playTankBlastAni(pos: cc.Vec2, startCallback, endCallback) {
        if (pos) {
            this.playUnitAniInTime(AniDef.UnitAniType.TANK_BLAST, this.panelAni, 5.2, { pos: pos }, startCallback, endCallback);
        }
    }

    playBulletBlastAni(pos: cc.Vec2) {
        if (pos) {
            this.playUnitAniInTime(AniDef.UnitAniType.BULLET_BLAST, this.panelAni, 0.22, { pos: pos });
        }
    }

    onGameResultShowFinished() {
        if (GameDataModel._gameOver) {
            gameController.goToMainMenu(); //回到主菜单
        }
        else {
            if (GameDataModel._currStage < GameDef.GAME_TOTAL_STAGE) {
                //进入下一关
                this.closeGameResult();

                this.startGameStage(GameDataModel._currStage + 1);
            }
            else {
                //显示通关页面
                this.showGameSuccessDlg();
            }
        }
    }

    showGameSuccessDlg() {
        this.closeGameSuccessDlg();

        this._gameSuccessPanel = cc.instantiate(this.pfbGameSuccess);
        this.nodeBoxCenter.addChild(this._gameSuccessPanel);
    }

    closeGameSuccessDlg() {
        if (this._gameSuccessPanel) {
            this._gameSuccessPanel.destroy();
            this._gameSuccessPanel = null;
        }
    }

    onNtfLeaveRoom(info: gamereq.RoomPlayerInfo) {
        CommonFunc.showSureDialog(`由于${info.playerno + 1}号玩家离开房间，本次游戏被迫结束。（确认后将自动返回菜单界面）`, () => {
            //返回房间界面
            GameDataModel._gotoMenuPage = GameDef.MenuPage.ROOM;
            this.goToMainMenu();
        });
    }
}
