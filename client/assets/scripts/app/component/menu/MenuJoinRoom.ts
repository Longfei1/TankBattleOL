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
        this.showEditTip(true);
    }

    onEditRoomNoEnd() {
        this.showEditTip(false);
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

        if (!this._bSelect) {
            this._bSelect = true;

            this.handlerChoose.emit([this.menuItemValue[this._currChoose], this.editRoomNo.string]);
        }
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
        super.onMenuHide(bNext);

        //进入返回一级菜单时，重置当前菜单光标位置
        if (!bNext) {
            this.showEditTip(false);
            this.editRoomNo.string = "";
        }
    }
}