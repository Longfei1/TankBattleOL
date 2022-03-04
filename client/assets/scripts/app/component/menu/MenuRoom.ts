import CommonFunc from "../../common/CommonFunc";
import { EventDef } from "../../define/EventDef";
import GameConnectModel from "../../model/GameConnectModel";
import GameDataModel from "../../model/GameDataModel";
import { gamereq } from "../../network/proto/gamereq";
import MenuChoose from "./MenuChoose";
import MenuRoomPlayer from "./MenuRoomPlayer";

const {ccclass, property} = cc._decorator;
@ccclass
export default class MenuRoom extends MenuChoose {
    @property({ displayName: "玩家节点", type: [cc.Node] })
    nodePlayer: cc.Node[] = [];

    @property({ displayName: "房间号", type: cc.Label })
    textRoomID: cc.Label = null;

    @property({ displayName: "准备图片", type: cc.Sprite })
    imgReady: cc.Sprite = null;

    @property({ displayName: "准备图片合图", type: cc.SpriteAtlas })
    atlasReady: cc.SpriteAtlas = null;

    initListener() {
        GameConnectModel.addEventListener(EventDef.EV_NTF_JOIN_ROOM, this.onNtfJoinRoom, this);
        GameConnectModel.addEventListener(EventDef.EV_NTF_LEAVE_ROOM, this.onNtfLeaveRoom, this);
        GameConnectModel.addEventListener(EventDef.EV_NTF_ROOM_HOST_CHANGED, this.onNtfRoomHostChanged, this);
        GameConnectModel.addEventListener(EventDef.EV_NTF_PLAYER_INFO, this.onNtfPlayerInfo, this);
        GameConnectModel.addEventListener(EventDef.EV_NTF_ROOM_READY, this.onNtfRoomReady, this);
        GameConnectModel.addEventListener(EventDef.EV_NTF_ROOM_UNREADY, this.onNtfRoomUnReady, this);
        GameConnectModel.addEventListener(EventDef.EV_NTF_ROOM_START, this.onNtfRoomStart, this);
    }

    removeListener() {
        GameConnectModel.removeEventListenerByContext(this);
    }

    refreshView() {
        this.refreshRoomID();
        this.refreshPlayer();
        this.refreshMenu();
    }

    refreshRoomID() {
        this.textRoomID.string = `房间号：${GameDataModel._netRoomID}`;
    }

    refreshPlayer() {
        for (let i = 0; i < this.nodePlayer.length; i++) {
            let playerInfo = GameDataModel.getPlayerInfo(i);
            if (playerInfo.userID > 0) {
                this.nodePlayer[i].active = true;

                let com = this.nodePlayer[i].getComponent(MenuRoomPlayer);
                com.setPlayerID(playerInfo.userID);
                com.setReady(playerInfo.ready);
            }
            else {
                this.nodePlayer[i].active = false;
            }
        }
    }

    refreshMenu() {
        if (GameDataModel._netPlayerNO === 0) {
            //房主
            this.imgReady.spriteFrame = this.atlasReady.getSpriteFrame("pic_startgame");
        }
        else {
            let playerInfo = GameDataModel.getPlayerInfo(GameDataModel._netPlayerNO);
            if (playerInfo.ready) {
                this.imgReady.spriteFrame = this.atlasReady.getSpriteFrame("pic_cancelready");
            }
            else {
                this.imgReady.spriteFrame = this.atlasReady.getSpriteFrame("pic_ready");
            }
        }

        this.updateCursorPosition();
    }

    onEnable() {
        this.initListener();

        this.refreshView();
    }

    onDisable() {
        this.removeListener();
    }

    onDestroy() {
        this.removeListener();
    }

    //加入房间
    onNtfJoinRoom(info: gamereq.RoomPlayerInfo) {
        this.refreshPlayer();

        CommonFunc.showToast(`玩家${info.userid}加入房间`, 2);
    }

    //离开房间
    onNtfLeaveRoom(info: gamereq.RoomPlayerInfo) {
        this.refreshPlayer();

        CommonFunc.showToast(`玩家${info.userid}离开房间`, 2);
    }

    //房主变更
    onNtfRoomHostChanged(info: gamereq.RoomPlayerInfo) {
        this.refreshView();
    }

    //玩家信息
    onNtfPlayerInfo(info: gamereq.RoomPlayerInfo) {
        this.refreshPlayer();
    }

    //房间准备
    onNtfRoomReady(info: gamereq.RoomPlayerInfo) {
        this.refreshPlayer();
    }

    //房间取消准备
    onNtfRoomUnReady(info: gamereq.RoomPlayerInfo) {
        this.refreshPlayer();
    }

    //房间开始
    onNtfRoomStart(info: gamereq.RoomPlayerInfo) {
        CommonFunc.playButtonSound();
        this.dispatchCustomEvent("NtfRoomStart");
    }

    onSelectItems() {
        CommonFunc.playButtonSound();
        
        let value = "";
        if (GameDataModel._netPlayerNO === 0) {
            value = "StartGame";
        }
        else {
            let playerInfo = GameDataModel.getPlayerInfo(GameDataModel._netPlayerNO);
            if (playerInfo.ready) {
                value = "UnReady";
            }
            else {
                value = "Ready";
            }
        }

        this.dispatchChooseEvent(value);
    }
}