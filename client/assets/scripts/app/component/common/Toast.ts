const {ccclass, property} = cc._decorator;

@ccclass
export default class Toast extends cc.Component {

    @property({ displayName: "背景", type: cc.Node })
    nodeBg: cc.Node = null;

    @property({ displayName: "提示文本", type: cc.Label })
    txtTip: cc.Label = null;

    _time: number = 1;

    start() {
        this.showTip();  
    }
    
    init(param) {
        if (param) {
            this.txtTip.string = param.tipString ? param.tipString : "";//先设置字符串，start后才能获取到变化后的宽度（当前引擎版本bug）
            this._time = param.time ? param.time : 1;
        }
    }

    showTip() {
        this.nodeBg.height = this.txtTip.node.height + 20;
        this.txtTip.node.y = this.txtTip.node.y - 2;

        this.node.opacity = 0;
        this.node.runAction(cc.sequence(cc.fadeIn(0.2), cc.delayTime(this._time >= 0.4 ? this._time - 0.4 : 0), cc.fadeOut(0.2), cc.callFunc(()=> {
                this.node.destroy();
            })
        ));
    }
}
