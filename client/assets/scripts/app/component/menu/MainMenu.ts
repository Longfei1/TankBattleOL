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
import { GameProtocal } from "../../network/GameProtocal";
import { gamereq } from "../../network/proto/gamereq";
import MenuRoom from "./MenuRoom";
import GameLogicModel from "../../model/GameLogicModel";
import RandomDevice from "../../common/RandomDevice";

const {ccclass, property} = cc._decorator;

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

        GameDataModel._menuPage = GameDef.MenuPage.MAIN;
        if (GameDataModel._gotoMenuPage > 0) {
            this.showMenuPage(GameDataModel._gotoMenuPage);
            GameDataModel._gotoMenuPage = -1;
        }

        if (GameDataModel.isGameDebugMode()) {
            this.onTest();
        }
    }

    onDestroy() {
        this.removeListener();
    }

    initListener() {
        GameInputModel.addKeyDownIntervalListener(() => {
            if (!this.isOperateEnabled()) {
                return;
            }
            this.onMoveUp();
        }, null, this, PlayerDef.KEYMAP_PLAYER1.UP, this.moveInterval);
        GameInputModel.addKeyDownIntervalListener(() => {
            if (!this.isOperateEnabled()) {
                return;
            }
            this.onMoveDown();
        }, null, this, PlayerDef.KEYMAP_PLAYER1.DOWN, this.moveInterval);
        GameInputModel.addKeyDownOnceListener(() => {
            if (!this.isOperateEnabled()) {
                return;
            }
            this.onSelectItems();
        }, null, this, PlayerDef.KEYMAP_PLAYER1.OK);
        GameInputModel.addKeyDownOnceListener(() => {
            if (!this.isOperateEnabled()) {
                return;
            }
            this.onSelectItems();
        }, null, this, PlayerDef.KEYMAP_COMMON.START);

        GameInputModel.addKeyDownOnceListener(() => {
            if (!this.isOperateEnabled()) {
                return;
            }
            CommonFunc.playButtonSound();
            this.onKeyBack();
        }, null, this, PlayerDef.KEYMAP_COMMON.BACK);

        GameInputModel.addInputHierarchy(false, this);

        GameConnectModel.addEventListener(EventDef.EV_MAINGAME_SOCKET_ERROR, this.onSocketError, this);
        GameConnectModel.addEventListener(EventDef.EV_NTF_MENU_BACK, this.onNtfMenuBack, this);
        GameConnectModel.addEventListener(EventDef.EV_NTF_GAME_START, this.onNtfGameStart, this);
    }

    removeListener() {
        GameInputModel.removeInputListenerByContext(this);
        GameConnectModel.removeEventListenerByContext(this);
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
            case GameDef.MenuPage.OFFLINE:
                this.switchMenuPage(currPage, GameDef.MenuPage.MAIN);
                break;
            case GameDef.MenuPage.ONLINE:
                this.switchMenuPage(currPage, GameDef.MenuPage.MAIN);
                break;
            case GameDef.MenuPage.JOIN_ROOM:
                this.switchMenuPage(currPage, GameDef.MenuPage.ONLINE);
                break;
            case GameDef.MenuPage.ROOM:
                GameConnectModel.sendLeaveRoom((ret: number, data) => {
                    if (ret === 0) {
                        this.switchMenuPage(currPage, GameDef.MenuPage.ONLINE);
                    }
                });
                break;
            case GameDef.MenuPage.START_CHOOSE:
                if (GameDataModel._netPlayerNO == 0) {
                    GameConnectModel.sendMenuBack((ret: number, data) => {
                        if (ret === 0) {
                            this.switchMenuPage(currPage, GameDef.MenuPage.ROOM);//返回房间准备界面
                        }
                    })
                }
                else {
                    CommonFunc.showChooseDialog("房主才能返回上一级菜单，返回将直接离开房间，你确定要离开房间吗？", null, () => {
                        GameConnectModel.sendLeaveRoom((ret: number, data) => {
                            if (ret === 0) {
                                this.switchMenuPage(GameDataModel._menuPage, GameDef.MenuPage.ONLINE);//回到联机模式菜单
                            }
                        });
                    }, null, null);
                }
                break;
            default:
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

    showMenuPage(page: number) {
        this.panelMenus[GameDataModel._menuPage].active = false;
        this.panelMenus[page].active = true;

        GameDataModel._menuPage = page;
    }
 
    //开始游戏
    onStartGame() {
        cc.director.loadScene("Game");
        GameDataModel._menuPage = -1;
    }

    updateHighScore() {
        let score = GameDataModel.getHighScore();
        this.textHighScore.string = score.toString();
    }

    onMenuSelectItem(index, data) {
        let currPage = GameDataModel._menuPage;
        switch (index) {
            case GameProtocal.MenuItemIdex.MODE_OFFLINE:
                this.switchMenuPage(currPage, GameDef.MenuPage.OFFLINE);
                console.log("单机模式");
                break;
            case GameProtocal.MenuItemIdex.MODE_ONLINE:
                console.log("联机模式");
                this.connectServer((ret: boolean)=>{
                    if (ret) {
                        this.switchMenuPage(currPage, GameDef.MenuPage.ONLINE);
                    }
                });
                break;
            case GameProtocal.MenuItemIdex.SINGLE_PLAY:
                GameDataModel._playMode = GameDef.GAMEMODE_SINGLE_PLAYER;
                this.onStartGame();
                console.log("开始单人游戏");
                break;
            case GameProtocal.MenuItemIdex.DOUBLE_PLAY:
                GameDataModel._playMode = GameDef.GAMEMODE_DOUBLE_PLAYER;
                this.onStartGame();
                console.log("开始双人游戏");
                break;
            case GameProtocal.MenuItemIdex.MAP_EDIT_OFFLINE:
                //地图编辑场景
                GameDataModel._playMode = GameDef.GAMEMODE_MAP_EDIT;
                GameDataModel._useCustomMap = false;
                this.onStartGame();
                console.log("开始地图编辑-单机");
                break;
            case GameProtocal.MenuItemIdex.CREATE_ROOM:
                console.log("创建房间");
                GameConnectModel.sendCreateRoom((ret: number, data) => {
                    if (ret === 0) {
                        //创建成功
                        this.switchMenuPage(currPage, GameDef.MenuPage.ROOM);
                    }
                });
                break;
            case GameProtocal.MenuItemIdex.JOIN_ROOM:
                this.switchMenuPage(currPage, GameDef.MenuPage.JOIN_ROOM);
                console.log("加入房间");
                break;
            case GameProtocal.MenuItemIdex.JOIN:
                console.log("加入指定房间");
                if (!data || data === "") {
                    CommonFunc.showToast("请输入需要加入的房间号！", 2);
                    break;
                }
                GameConnectModel.sendJoinRoom(parseInt(data), (ret: number, data) => {
                    if (ret === 0) {
                        //加入房间成功
                        this.switchMenuPage(currPage, GameDef.MenuPage.ROOM);
                    }
                });
                break;
            case GameProtocal.MenuItemIdex.START_GAME:
                if (data === "StartGame") {
                    console.log("房间开始游戏");
                    GameConnectModel.sendRoomStart((ret: number, data) => {
                        if (ret === 0) {
                            this.switchMenuPage(currPage, GameDef.MenuPage.START_CHOOSE);
                        }
                    });
                }
                else if (data === "UnReady") {
                    console.log("房间取消准备");
                    GameConnectModel.sendRoomUnReady((ret: number, data) => {
                        if (ret === 0) {
                            let menuRoom = this.panelMenus[currPage].getComponent(MenuRoom);
                            menuRoom.refreshView();
                        }
                    });
                }
                else if (data === "Ready") {
                    console.log("房间准备");
                    GameConnectModel.sendRoomReady((ret: number, data) => {
                        if (ret === 0) {
                            let menuRoom = this.panelMenus[currPage].getComponent(MenuRoom);
                            menuRoom.refreshView();
                        }
                    });
                }
                
                break;
            case GameProtocal.MenuItemIdex.START_GAME_DIRECT:
                console.log("直接开始游戏");
                break;
            case GameProtocal.MenuItemIdex.MAP_EDIT_ONLINE:
                console.log("开始地图编辑-联机");
                break;
            default:
                break;
        }
    }

    onMenuCustomEvent(page: number, data) {
        switch (page) {
            case GameDef.MenuPage.ROOM:
                if (data === "NtfRoomStart") {
                    this.switchMenuPage(GameDataModel._menuPage, GameDef.MenuPage.START_CHOOSE);
                }
            case GameDef.MenuPage.START_CHOOSE:
                if (data === "LeaveRoom") {
                    this.switchMenuPage(GameDataModel._menuPage, GameDef.MenuPage.ROOM);//返回房间界面
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
            CommonFunc.excuteCallback(callback, true);
        }
        else {
            this.showNetWaitTip(true);
            GameConnectModel.connectServer((ret, data) => {
                this.showNetWaitTip(false);
                if (ret === 1) {
                    CommonFunc.showToast("连接服务器超时，请稍后再试！", 2);
                }
                
                CommonFunc.excuteCallback(callback, ret === 0);
            })
        }
    }

    //网络错误
    onSocketError() {
        if (this.isNetWaitTipShowing()) {
            this.showNetWaitTip(false);
            CommonFunc.showToast("登录服务器连接失败，请稍后再试！", 2);
        }
    }

    //菜单返回
    onNtfMenuBack(info: gamereq.RoomPlayerInfo) {
        let currPage = GameDataModel._menuPage;
        if (currPage == GameDef.MenuPage.START_CHOOSE) {
            this.switchMenuPage(currPage, GameDef.MenuPage.ROOM);//返回房间准备界面
        }
    }

    //游戏开始
    onNtfGameStart(info: gamereq.GameStartRsp) {
        CommonFunc.playButtonSound();
        if (GameDataModel._playMode === GameDef.GAMEMODE_ONLINE_PLAY) {
            this.onStartGame();
        }
        else if (GameDataModel._playMode === GameDef.GAMEMODE_MAP_EDIT_ONLINE) {
            GameDataModel._useCustomMap = false;
            this.onStartGame();
        }
    }

    onTest() {
        // CommonFunc.showChooseDialog("测试", "确定", () => {
        //     console.log("确定");
        // }, "取消", () => {
        //     console.log("取消");
        // });
    }
}
