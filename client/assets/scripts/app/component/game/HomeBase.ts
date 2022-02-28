import { GameDef } from "../../define/GameDef";
import GameUnitComponent from "./GameUnitComponent";
import { gameController } from "./Game";
import { GameStruct } from "../../define/GameStruct";
import Bullet from "./Bullet";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HomeBase extends GameUnitComponent {
    @property({ displayName: "存活图片", type: cc.Sprite })
    imgAlive: cc.Sprite = null;

    @property({ displayName: "毁灭图片", type: cc.Sprite })
    imgDestroy: cc.Sprite = null;

    setAlive(bAlive: boolean) {
        let bAct = bAlive ? true : false;
        this.imgAlive.node.active = bAct;
        this.imgDestroy.node.active = !bAct;
    }

    isAlive(): boolean {
        return this.imgAlive.node.active;
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.node.group === GameDef.GROUP_NAME_BULLET) {
            if (this.isAlive()) {
                this.setAlive(false);

                //游戏失败
                gameController.gameOver();
            }
        }
    }

    getHomeRect(): GameStruct.BigRect {
        return new GameStruct.BigRect(this._logicPos.x, this._logicPos.y, this.imgAlive.node.width, this.imgAlive.node.height);
    }

    onClilision(self: GameStruct.colliderInfo, other: GameStruct.colliderInfo) {
        if (!this._hited) {
            if (other.node.group === GameDef.GROUP_NAME_BULLET) {
                let com = other.node.getComponent(Bullet);
                if (!com._hited || com._hitedGroup === GameDef.GROUP_HOME_BASE) {
                    this._hited = true;
                    this._hitedGroup = other.node.group;
                    this._hitedValue = com.id;
                }
            }
        }
    }

    onLogicLastFrameEvent() {
        if (this._hited) {
            if (this.isAlive()) {
                this.setAlive(false);

                //游戏失败
                gameController.gameOver();
            }
        }
    }
}