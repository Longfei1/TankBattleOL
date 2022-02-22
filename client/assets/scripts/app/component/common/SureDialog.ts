import CommonFunc from "../../common/CommonFunc";
import { PlayerDef } from "../../define/PlayerDef";
import GameInputModel from "../../model/GameInputModel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SureDialog extends cc.Component {

    @property({ displayName: "提示文本", type: cc.Label })
    txtTip: cc.Label = null;

    @property({ displayName: "确定按钮", type: cc.Node })
    nodeSure: cc.Node = null;

    _sureCallback: Function = null;

    onLoad() {
        this.initListener();
    }

    onDestroy() {
        this.removeListener();
    }

    initListener() {
        GameInputModel.addKeyDownOnceListener(() => {
            CommonFunc.playButtonSound();
            if (this._sureCallback) {
                this._sureCallback();
            }
            this.node.destroy();
        }, null, this, PlayerDef.KEYMAP_COMMON.START);
        GameInputModel.addKeyDownOnceListener(() => {
            CommonFunc.playButtonSound();
            if (this._sureCallback) {
                this._sureCallback();
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

        this._sureCallback = param.callback

        if (param.tipString) {
            this.txtTip.string = param.tipString;
        }

        this.playSelectAni(this.nodeSure);
    }

    playSelectAni(node: cc.Node) {
        node.scale = 1;
        node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.7, 1.15), cc.scaleTo(0.5, 1))));
    }
}
