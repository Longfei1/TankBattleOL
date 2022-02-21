const {ccclass, property} = cc._decorator;
@ccclass
export default class MenuRoom extends cc.Component {
    @property({ displayName: "玩家ID", type: cc.Label })
    textID: cc.Label = null;

    @property({ displayName: "未准备", type: cc.Node })
    nodeUnReady: cc.Node = null;

    @property({ displayName: "已准备", type: cc.Node })
    nodeReady: cc.Node = null;

    setPlayerID(id: number) {
        this.textID.string = `ID:${id}`;
    }

    setReady(bReady: boolean) {
        if (bReady) {
            this.nodeReady.active = true;
            this.nodeUnReady.active = false;
        }
        else {
            this.nodeReady.active = false;
            this.nodeUnReady.active = true;
        }
    }
}