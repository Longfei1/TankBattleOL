import { GameStruct } from "../../define/GameStruct";
import GameDataModel from "../../model/GameDataModel";
import { GameDef } from "../../define/GameDef";
import { gameController } from "./Game";
import { EventDef } from "../../define/EventDef";
import BattleTank from "./tank/BattleTank";
import GameLogicModel from "../../model/GameLogicModel";
import GameUnitComponent from "./GameUnitComponent";

const { ccclass, property } = cc._decorator;

const PropImgName = {
    [GameDef.PropType.BOMB]: "bomb",
    [GameDef.PropType.CLOCK]: "clock",
    [GameDef.PropType.HELMET]: "helmet",
    [GameDef.PropType.SPADE]: "spade",
    [GameDef.PropType.STAR]: "star",
    [GameDef.PropType.TANK]: "tank",
    [GameDef.PropType.GUN]: "gun",
}

@ccclass
export default class Prop extends GameUnitComponent {
    @property({ displayName: "道具图片", type: cc.Sprite })
    imgProp: cc.Sprite = null;

    @property({ displayName: "道具图集", type: cc.SpriteAtlas })
    atlasProp: cc.SpriteAtlas = null;

    _type: number = -1;
    
    _keepTime: number = 0;

    _gained: boolean = false;
    _gainPlayer: BattleTank = null;

    setType(type: number) {
        this._type = type;
        this.updateImg();
    }

    updateImg() {
        let framename = PropImgName[this._type];
        if (framename) {
            let frame = this.atlasProp.getSpriteFrame(framename);
            if (frame) {
                this.imgProp.spriteFrame = frame;
            }
        }
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        this.onClilision(other, self);
    }

    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        this.onClilision(other, self);
    }

    onClilision(self: GameStruct.colliderInfo, other: GameStruct.colliderInfo) {
        if (!this._gained && other.node.group === GameDef.GROUP_NAME_TANK) {
            let com = other.node.getComponent(BattleTank);
            if (com && com._team === GameDef.TeamType.PLAYER) {
                this._gained = true;
                this._gainPlayer = com;
            }
        }
    }

    reset() {
        super.reset();

        this._type = -1;
        this._keepTime = 0;

        this._gained = false;
        this._gainPlayer = null;

        this.node.stopAllActions();
        GameLogicModel.unscheduleAll(this);
    }

    onEnable() {
        this.playTwinkleAni();
    }

    playTwinkleAni() {
        let ani = this.getComponent(cc.Animation);
        if (ani) {
            ani.play();
        }
    }

    setTime(keepTime: number) {
        this._keepTime = keepTime,

        this.startDisappearTimer(); //开启道具消失的定时器
    }

    startDisappearTimer() {
        GameLogicModel.scheduleOnce(()=>{
            gameController.node.emit(EventDef.EV_PROP_DESTROY);
        }, this, this._keepTime);
    }

    onLogicLastFrameEvent() {
        if (this._gained) {
            gameController.node.emit(EventDef.EV_PROP_GAIN, this._gainPlayer.node);
            gameController.node.emit(EventDef.EV_PROP_DESTROY);
        }
    }

    getPropRect(): GameStruct.BigRect {
        return new GameStruct.BigRect(this._logicPos.x, this._logicPos.y, this.imgProp.node.width, this.imgProp.node.height);
    }
}