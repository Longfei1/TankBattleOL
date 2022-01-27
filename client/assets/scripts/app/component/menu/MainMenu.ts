import { PlayerDef } from "../../define/PlayerDef";
import GameDataModel from "../../model/GameDataModel";
import { GameDef } from "../../define/GameDef";
import AudioModel from "../../model/AudioModel";
import ModelManager from "../../manager/ModelManager";
import GameInputModel from "../../model/GameInputModel";
import CommonFunc from "../../common/CommonFunc";
import GameConnectModel from "../../model/GameConnectModel";
import MenuChoose from "./MenuChoose";
import { EventDef } from "../../define/EventDef";

const {ccclass, property} = cc._decorator;

enum MenuPage {
    MAIN,                   //主菜单
    OFFLINE,                //单机模式
    ONLINE,                 //联机模式
    JOIN_ROOM,              //加入房间
    ROOM,                   //房间界面
    START_CHOOSE,           //开始选择
}

enum MenuItemIdex {
    MODE_OFFLINE,           //单机模式
    MODE_ONLINE,            //联机模式
    SINGLE_PLAY,            //单人游戏
    DOUBLE_PLAY,            //双人游戏
    MAP_EDIT_OFFLINE,       //地图编辑（单机模式下）
    CREATE_ROOM,            //创建房间
    JOIN_ROOM,              //加入房间
    JOIN,                   //加入（输入房间号后）
    START_GAME,             //开始游戏/准备
    START_GAME_DIRECT,      //直接开始
    MAP_EDIT_ONLINE,        //地图编辑（联机模式下）
}

@ccclass
export default class MainMenu extends cc.Component {

    @property({ displayName: "操作层节点", type: cc.Node })
    panelOperate: cc.Node = null;

    @property({ displayName: "菜单节点", type: [cc.Node] })
    panelMenus: cc.Node[] = [];

    @property({ displayName: "光标移动间隔时间", type: cc.Float })
    moveInterval: number = 0.2;

    @property({ displayName: "最高分", type: cc.Label })
    textHighScore: cc.Label = null;

    @property({ displayName: "等待网络连接提示", type: cc.Node })
    nodeNetWait: cc.Node = null;

    onLoad() {
        cc.game.setFrameRate(GameDef.GAME_FPS);
        cc.audioEngine.stopAll();
        
        ModelManager.initModels();

        this.initListener();

        this.updateHighScore();

        //this.onTest();
    }

    onDestroy() {
        this.removeListener();
    }

    initListener() {
        GameInputModel.addKeyDownIntervalListener(() => {
            if (!this.isOperateEnabled()) {
                return;
            }
            CommonFunc.playButtonSound();
            this.onMoveUp();
        }, null, this, PlayerDef.KEYMAP_PLAYER1.UP, this.moveInterval);
        GameInputModel.addKeyDownIntervalListener(() => {
            if (!this.isOperateEnabled()) {
                return;
            }
            CommonFunc.playButtonSound();
            this.onMoveDown();
        }, null, this, PlayerDef.KEYMAP_PLAYER1.DOWN, this.moveInterval);
        GameInputModel.addKeyDownOnceListener(() => {
            if (!this.isOperateEnabled()) {
                return;
            }
            CommonFunc.playButtonSound();
            this.onSelectItems();
        }, null, this, PlayerDef.KEYMAP_PLAYER1.OK);
        GameInputModel.addKeyDownOnceListener(() => {
            if (!this.isOperateEnabled()) {
                return;
            }
            CommonFunc.playButtonSound();
            this.onSelectItems();
        }, null, this, PlayerDef.KEYMAP_COMMON.START);

        GameInputModel.addKeyDownOnceListener(() => {
            if (!this.isOperateEnabled()) {
                return;
            }
            CommonFunc.playButtonSound();
            this.onKeyBack();
        }, null, this, PlayerDef.KEYMAP_COMMON.BACK);

        GameConnectModel.addEventListener(EventDef.EV_MAINGAME_SOCKET_ERROR, () => {
            this.onSocketError();
        }, this);
    }

    removeListener() {
        GameInputModel.removeInputListenerByContext(this);
    }

    isOperateEnabled(): boolean {
        if (this.isNetWaitTipShowing()) {
            return false;
        }

        return true;
    }

    onMoveUp() {
        for (let item of this.panelMenus) {
            if (item.active) {
                let com = item.getComponent(MenuChoose);
                if (com) {
                    com.onMoveUp();
                    break;
                }
            }
        }
    }

    onMoveDown() {       
        for (let item of this.panelMenus) {
            if (item.active) {
                let com = item.getComponent(MenuChoose);
                if (com) {
                    com.onMoveDown();
                    break;
                }
            }
        }
    }

    onSelectItems() {
        for (let item of this.panelMenus) {
            if (item.active) {
                let com = item.getComponent(MenuChoose);
                if (com) {
                    com.onSelectItems();
                    break;
                }
            }
        }
    }

    onKeyBack() {
        let currPage = GameDataModel._menuPage
        switch(currPage) {
            case MenuPage.OFFLINE:
                this.switchMenuPage(currPage, MenuPage.MAIN);
                break;
            case MenuPage.ONLINE:
                this.switchMenuPage(currPage, MenuPage.MAIN);
                break;
            case MenuPage.JOIN_ROOM:
                this.switchMenuPage(currPage, MenuPage.ONLINE);
                break;
            case MenuPage.ROOM:
                this.switchMenuPage(currPage, MenuPage.ONLINE);
                break;
            case MenuPage.START_CHOOSE:
                this.switchMenuPage(currPage, MenuPage.ROOM);
                break;
        }
    }

    switchMenuPage(from: number, to: number) {
        let panelFrom = this.panelMenus[from];
        let panelTo = this.panelMenus[to];

        if (!panelFrom || !panelTo) {
            return;
        }

        let aniHide = cc.sequence(cc.fadeOut(0.2), cc.callFunc(() => { 
                panelFrom.active = false; 
                panelFrom.getComponent(MenuChoose).onMenuHide(from < to); 
            })
        );
        panelTo.opacity = 0;
        panelTo.active = true;
        if (from < to) {
            //下一级菜单
            panelTo.x = 120;
        }
        else {
            //上一级菜单
            panelTo.x = -100;
        }

        let aniShow = cc.sequence(cc.delayTime(0.15), cc.spawn(cc.fadeIn(0.2), cc.moveTo(0.2, cc.v2(0, 0))));

        panelFrom.runAction(aniHide);
        panelTo.runAction(aniShow);

        GameDataModel._menuPage = to;
    }

    menuSelectFailed() {
        for (let item of this.panelMenus) {
            if (item.active) {
                let com = item.getComponent(MenuChoose);
                if (com) {
                    com.onSelectFailed();
                    break;
                }
            }
        }
    }

    //开始游戏
    onStartGame() {
        cc.director.loadScene("Game");
    }

    updateHighScore() {
        let score = GameDataModel.getHighScore();
        this.textHighScore.string = score.toString();
    }

    onMenuSelectItem(index, data) {
        let currPage = GameDataModel._menuPage;
        switch (index) {
            case MenuItemIdex.MODE_OFFLINE:
                this.switchMenuPage(currPage, MenuPage.OFFLINE);
                console.log("单机模式");
                break;
            case MenuItemIdex.MODE_ONLINE:
                console.log("联机模式");
                this.connectServer((ret)=>{
                    if (ret) {
                        this.switchMenuPage(currPage, MenuPage.ONLINE);
                    }
                    else {
                        this.menuSelectFailed();
                    }
                });
                break;
            case MenuItemIdex.SINGLE_PLAY:
                GameDataModel._playMode = GameDef.GAMEMODE_SINGLE_PLAYER;
                this.onStartGame();
                console.log("开始单人游戏");
                break;
            case MenuItemIdex.DOUBLE_PLAY:
                GameDataModel._playMode = GameDef.GAMEMODE_DOUBLE_PLAYER;
                this.onStartGame();
                console.log("开始双人游戏");
                break;
            case MenuItemIdex.MAP_EDIT_OFFLINE:
                //地图编辑场景
                GameDataModel._playMode = GameDef.GAMEMODE_MAP_EDIT;
                GameDataModel._useCustomMap = false;
                this.onStartGame();
                console.log("开始地图编辑");
                break;
            case MenuItemIdex.CREATE_ROOM:
                break;
            case MenuItemIdex.JOIN_ROOM:
                this.switchMenuPage(currPage, MenuPage.JOIN_ROOM);
                console.log("加入房间");
                break;
            case MenuItemIdex.JOIN:
                console.log("加入指定房间");
                if (!data || data == "") {
                    CommonFunc.showToast("请输入需要加入的房间号！", 2);
                    this.menuSelectFailed();
                    break;
                }
                break;
            default:
                break;
        }
    }

    //显示等待网络连接提示
    showNetWaitTip(bShow: boolean) {
        this.nodeNetWait.active = bShow;
    }

    //等待网络连接提示是否正在显示中
    isNetWaitTipShowing(): boolean {
        return this.nodeNetWait.active;
    }

    connectServer(callback: Function) {
        if (GameConnectModel.isServerConnected()) {
            if (callback) {
                callback(true);
            }
        }
        else {
            this.showNetWaitTip(true);
            GameConnectModel.connectServer((ret, tip) => {
                this.showNetWaitTip(false);
                if (ret == 1) {
                    CommonFunc.showToast("连接服务器超时，请稍后再试！", 2)
                }
                else if (ret == 2) {
                    CommonFunc.showToast(tip, 2)
                }
                
                if (callback) {
                    callback(ret == 0);
                }
            })
        }
    }

    onSocketError () {
        if (this.isNetWaitTipShowing()) {
            this.showNetWaitTip(false);
            this.menuSelectFailed();

            CommonFunc.showToast("登录服务器出错，请稍后再试！", 2)
        }
    }

    onTest() {
        GameConnectModel.sendLoginIn(null);   
    }
}
