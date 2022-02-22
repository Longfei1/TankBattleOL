import MenuChoose from "./MenuChoose";
import GameConnectModel from "../../model/GameConnectModel";
import { EventDef } from "../../define/EventDef";
import { gamereq } from "../../network/proto/gamereq";
import { GameProtocal } from "../../network/GameProtocal";
import CommonFunc from "../../common/CommonFunc";
import GameDataModel from "../../model/GameDataModel";

const {ccclass, property} = cc._decorator;
@ccclass
export default class MenuChooseNet extends MenuChoose {

    onEnable() {
        this.initListener();
    }

    onDisable() {
        this.removeListener();
    }

    onDestroy() {
        this.removeListener();
    }

    initListener() {
        GameConnectModel.addEventListener(EventDef.EV_NTF_MENU_SWITCH, this.onNtfMenuSwitch, this);
        GameConnectModel.addEventListener(EventDef.EV_NTF_MENU_CHOOSE, this.onNtfMenuChoose, this);
        GameConnectModel.addEventListener(EventDef.EV_NTF_LEAVE_ROOM, this.onNtfLeaveRoom, this);
    }

    removeListener() {
        GameConnectModel.removeEventListenerByContext(this);
    }

    onMoveUp() {
        if (GameDataModel._netPlayerNO !== 0) {
            return;
        }

        CommonFunc.playButtonSound();

        let index = (this._currChoose + this.nodeMenuItems.length - 1)%this.nodeMenuItems.length;
        this.sendMenuSwitch(index);
    }

    onMoveDown() {       
        if (GameDataModel._netPlayerNO !== 0) {
            return;
        }

        CommonFunc.playButtonSound();

        let index = (this._currChoose + this.nodeMenuItems.length + 1)%this.nodeMenuItems.length;
        this.sendMenuSwitch(index);
    }

    //发送菜单切换
    sendMenuSwitch(index: number) {
        GameConnectModel.sendMenuSwith(this.menuItemValue[index], (ret: number, data) => {
            if (ret === 0) {
                this.onMenuSwitch(data);
            }
        });
    }

    onMenuSwitch(info: gamereq.MenuSwitchInfo) {
        this._currChoose = this.getIndexByMenuItemValue(info.index);
        this.updateCursorPosition();
    }

    onNtfMenuSwitch(info: gamereq.MenuSwitchInfo) {
        CommonFunc.playButtonSound();
        this.onMenuSwitch(info);
    }

    onSelectItems() {
        if (GameDataModel._netPlayerNO !== 0) {
            return;
        }

        CommonFunc.playButtonSound();

        this.sendMenuChoose(this._currChoose);
    }

    //发送菜单选择
    sendMenuChoose(index: number) {
        GameConnectModel.sendMenuChoose(this.menuItemValue[index], (ret: number, data) => {
            if (ret === 0) {
                this.onMenuChoose(data);
            }
        });
    }

    onMenuChoose(info: gamereq.MenuChooseInfo) {
        this.dispatchChooseEvent();
    }

    onNtfMenuChoose(info: gamereq.MenuChooseInfo) {
        CommonFunc.playButtonSound();
        this.onMenuChoose(info);
    }

    onNtfLeaveRoom(info: gamereq.RoomPlayerInfo) {
        CommonFunc.showToast(`玩家${info.userid}离开房间`, 2);

        this.dispatchCustomEvent("LeaveRoom");
    }
}
