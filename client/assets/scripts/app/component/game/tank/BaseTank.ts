import GameUnitComponent from "../GameUnitComponent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseTank extends GameUnitComponent {
    @property({ displayName: "坦克图片", type: cc.Sprite })
    imgTank: cc.Sprite = null;

    @property({ displayName: "坦克图片图集", type: cc.SpriteAtlas })
    atlasTank: cc.SpriteAtlas = null;

    @property({ displayName: "坦克主体节点", type: cc.Node })
    nodeMain: cc.Node = null;

    @property({ displayName: "坦克动画节点", type: cc.Node })
    nodeAni: cc.Node = null;

    onLoad() {

    }

    reset() {
        super.reset();
    }

    getNodeAni() {
        return this.nodeAni;
    }

    setTankVisible(bVisible: boolean) {
        let visible = bVisible ? true : false;

        if (this.nodeMain) {
            this.nodeMain.active = visible;
        }
    }

    isTankVisible(): boolean {
        return this.nodeMain.active;
    }

    setTankImg(name: string) {
        if (name) {
            let frame = this.atlasTank.getSpriteFrame(name);
            if (frame) {
                this.imgTank.spriteFrame = frame;
            }
        }
    }
}
