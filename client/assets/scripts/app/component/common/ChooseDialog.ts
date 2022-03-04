import CommonFunc from "../../common/CommonFunc";
import { PlayerDef } from "../../define/PlayerDef";
import GameInputModel from "../../model/GameInputModel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChooseDialog extends cc.Component {

    @property({ displayName: "提示文本", type: cc.Label })
    txtTip: cc.Label = null;

    @property({ displayName: "确定按钮", type: cc.Node })
    nodeSure: cc.Node = null;

    @property({ displayName: "确定按钮文字", type: cc.Label })
    textSure: cc.Label = null;

    @property({ displayName: "取消按钮", type: cc.Node })
    nodeCancel: cc.Node = null;

    @property({ displayName: "取消按钮文字", type: cc.Label })
    textCancel: cc.Label = null;

    @property({ displayName: "箭头", type: cc.Node })
    nodeArrow: cc.Node = null;

    _sureCallback: Function = null;
    _cancelCallback: Function = null;

    _bSelectSure: boolean = true;

    onLoad() {
        this.initListener();
    }

    onDestroy() {
        this.removeListener();
    }

    initListener() {
        GameInputModel.addKeyDownOnceListener(() => {
            CommonFunc.playButtonSound();
            this.onChangeSelect();
        }, null, this, PlayerDef.KEYMAP_PLAYER1.LEFT);

        GameInputModel.addKeyDownOnceListener(() => {
            CommonFunc.playButtonSound();
            this.onChangeSelect();
        }, null, this, PlayerDef.KEYMAP_PLAYER1.RIGHT);

        GameInputModel.addKeyDownOnceListener(() => {
            CommonFunc.playButtonSound();
            if (this._bSelectSure) {
                if (this._sureCallback) {
                    this._sureCallback();
                }
            }
            else {
                if (this._cancelCallback) {
                    this._cancelCallback();
                }
            }
            this.node.destroy();
        }, null, this, PlayerDef.KEYMAP_COMMON.START);
        GameInputModel.addKeyDownOnceListener(() => {
            CommonFunc.playButtonSound();
            if (this._cancelCallback) {
                this._cancelCallback();
            }
            this.node.destroy();
        }, null, this, PlayerDef.KEYMAP_COMMON.BACK);

        GameInputModel.addInputHierarchy(true, this);
    }

    removeListener() {
        GameInputModel.removeInputListenerByContext(this);
    }

    showDialog(param) {
        if (!param) {
            return;
        }

        this._sureCallback = param.sureCallback
        this._cancelCallback = param.cancelCallback

        if (param.tipString) {
            this.txtTip.string = param.tipString;
        }

        if (param.sureString) {
            this.textSure.string = param.sureString;
        }

        if (param.cancelString) {
            this.textCancel.string = param.cancelString;
        }

        this.playSelectAni(this.nodeArrow);
    }

    playSelectAni(node: cc.Node) {
        node.scale = 1;
        node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.7, 1.2), cc.scaleTo(0.5, 1))));
    }

    stopSelectAni(node: cc.Node) {
        node.stopAllActions();
        node.scale = 1;
    }

    onChangeSelect() {
        this._bSelectSure = !this._bSelectSure;
        if (this._bSelectSure) {
            this.nodeArrow.x = this.nodeSure.x;
        }
        else {
            this.nodeArrow.x = this.nodeCancel.x;
        }
    }
}
