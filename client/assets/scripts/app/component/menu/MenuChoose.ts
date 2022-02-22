import CommonFunc from "../../common/CommonFunc";
import { PlayerDef } from "../../define/PlayerDef";

const {ccclass, property} = cc._decorator;
@ccclass
export default class MenuChoose extends cc.Component {

    @property({ displayName: "面板层节点", type: cc.Node })
    nodePanel: cc.Node = null;

    @property({ displayName: "菜单页值", type: cc.Integer })
    menuPage: number = 0;

    @property({ displayName: "菜单选项节点", type: [cc.Node] })
    nodeMenuItems: cc.Node[] = [];

    @property({ displayName: "菜单选项值", type: [cc.Integer] })
    menuItemValue: number[] = [];

    @property({ displayName: "选择光标预制体", type: cc.Prefab })
    pfbCursor: cc.Prefab = null;

    @property({ displayName: "光标与选项间隔像素", type: cc.Float })
    cursorShiftPos: number = -50;

    @property({ displayName: "菜单项选中回调", type: cc.Component.EventHandler})
    handlerChoose: cc.Component.EventHandler = null;

    @property({ displayName: "自定义回调", type: cc.Component.EventHandler})
    handlerCustom: cc.Component.EventHandler = null;

    _cursor: cc.Node = null;
    _currChoose: number = 0;

    onLoad() {
        this.initCursor();
    }

    onDestroy() {
        this._cursor = null;
    }

    initCursor() {
        this._cursor = cc.instantiate(this.pfbCursor);
        this.updateCursorPosition();
        this._cursor.setParent(this.nodePanel);
    }

    updateCursorPosition() {
        let itemPos = this.nodeMenuItems[this._currChoose].getPosition();
        let itemWidth = this.nodeMenuItems[this._currChoose].width;
        let cursorPos = cc.v2(itemPos.x + this.cursorShiftPos - itemWidth/2, itemPos.y);
        this._cursor.setPosition(cursorPos);
    }

    onMenuHide(bNext: boolean) {
        //进入返回一级菜单时，重置当前菜单光标位置
        if (!bNext) {
            this._currChoose = 0;
            this.updateCursorPosition();
        }
    }

    onMoveUp() {
        CommonFunc.playButtonSound();

        this._currChoose = (this._currChoose + this.nodeMenuItems.length - 1)%this.nodeMenuItems.length;
        this.updateCursorPosition();
    }

    onMoveDown() {       
        CommonFunc.playButtonSound();

        this._currChoose = (this._currChoose + this.nodeMenuItems.length + 1) % this.nodeMenuItems.length;
        this.updateCursorPosition();
    }

    onSelectItems() {
        CommonFunc.playButtonSound();
        
        this.dispatchChooseEvent();
    }

    getIndexByMenuItemValue(value: number): number {
        let index = 0;
        for (let i = 0; i < this.menuItemValue.length; i++) {
            if (value == this.menuItemValue[i]) {
                index = i;
                break;
            }
        }

        return index;
    }

    dispatchChooseEvent(data?) {
        this.handlerChoose.emit([this.menuItemValue[this._currChoose], data]);
    }

    dispatchCustomEvent(data?) {
        this.handlerCustom.emit([this.menuPage, data]);
    }
}