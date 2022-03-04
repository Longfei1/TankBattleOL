import CommonFunc from "../../common/CommonFunc";
import MenuChoose from "./MenuChoose";

const {ccclass, property} = cc._decorator;
@ccclass
export default class MenuJoinRoom extends MenuChoose {
    @property({ displayName: "房间号输入框", type: cc.EditBox })
    editRoomNo: cc.EditBox = null;

    @property({ displayName: "输入提示", type: cc.Label })
    editTip: cc.Label = null;

    onLoad() {
        super.onLoad();

        this.showEditTip(false);
    }

    onEditRoomNoBegin() {
        CommonFunc.playButtonSound();
        this.showEditTip(true);
    }

    onEditRoomNoEnd() {
        CommonFunc.playButtonSound();
        this.showEditTip(false);

        this._currChoose = this.nodeMenuItems.length - 1;
        this.updateCursorPosition();
    }

    showEditTip(bEdit) {
        if (this._currChoose == 0) {
            this.editTip.node.active = true;
            if (bEdit) {
                this.editTip.string = "（按回车键完成输入）";
            }
            else {
                this.editTip.string = "（按回车或J键开始输入）";
            }
        }
        else {
            this.editTip.node.active = false;
        }
    }

    onSelectItems() {
        if (this._currChoose == 0) {
            this.editRoomNo.setFocus();
            return;
        }
        
        CommonFunc.playButtonSound();
        this.dispatchChooseEvent(this.editRoomNo.string);
    }

    onMoveUp() {
        super.onMoveUp();
        this.showEditTip(false);
    }

    onMoveDown() {       
        super.onMoveDown();

        this.showEditTip(false);
    }

    onMenuHide(bNext: boolean) {
        this._currChoose = 0;
        this.updateCursorPosition();

        this.showEditTip(false);
        this.editRoomNo.string = "";
    }
}