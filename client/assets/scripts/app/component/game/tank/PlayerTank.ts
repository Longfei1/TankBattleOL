import BattleTank from "./BattleTank";
import AudioModel from "../../../model/AudioModel";
import Game, { gameController } from "../Game";
import { AniDef } from "../../../define/AniDef";
import { GameDef } from "../../../define/GameDef";
import { EventDef } from "../../../define/EventDef";
import GameDataModel from "../../../model/GameDataModel";
import CommonFunc from "../../../common/CommonFunc";
import GameConfigModel from "../../../model/GameConfigModel";
import { GameStruct } from "../../../define/GameStruct";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerTank extends BattleTank {

    _moveAudioInfo: GameStruct.AudioInfo = null;

    shoot() {
        if (super.shoot()) {
            AudioModel.playSound("sound/fire");
            return true;
        }
        return false;
    }

    born(callback?: Function) {
        //出生后，有几秒的护盾时间
        let afterBorn = () => {
            this.onGetShieldStatus(GameDef.BORN_INVINCIBLE_TIME);
            if (typeof callback === "function") {
                callback();
            }
        }
        
        //播放出生动画
        super.born(afterBorn);
    }

    destroyNode() {
        this.stopMoveSound();
        gameController.node.emit(EventDef.EV_PLAYER_DEAD, this.id);
    }

    getBulletPowerLevel(): number {
        //玩家子弹威力和等级绑定
        if (this._tankLevel === 4) {
            return GameDef.BULLET_POWER_LEVEL_STELL;
        }
        else {
            return GameDef.BULLET_POWER_LEVEL_COMMON;
        }
    }

    setMove(bMove: boolean, nDirection?: number) {
        super.setMove(bMove, nDirection);

        if (this._isMove) {
            this.playMoveSound();
        }
        else {
            this.stopMoveSound();
        }
    }

    playMoveSound() {
        if (!this._moveAudioInfo || !this._moveAudioInfo.audioID) {
            this._moveAudioInfo = AudioModel.playSound("sound/move", true);
        }
    }

    stopMoveSound() {
        if (this._moveAudioInfo != null && this._moveAudioInfo.audioID != null) {
            AudioModel.stopSound(this._moveAudioInfo);
            this._moveAudioInfo = null;
        }
    }

    haveBuff(value: number) {
        if (value != null) {
            if (CommonFunc.isBitSet(this._buffStatus, value)) {
                return true;
            }
        }
        return false;
    }

    onClilisionProp(propNode: cc.Node) {
        this._logicUpdate = false;
    }

    onLevelUp() {
        if (this._tankLevel < this._tankMaxLevel) {
            this.setTankLevel(this._tankLevel + 1);
            let playerInfo = GameDataModel.getPlayerInfo(this.id);
            playerInfo.level = this._tankLevel;
        }
    }

    onMaxLevel() {
        this.setTankLevel(this._tankMaxLevel);
        let playerInfo = GameDataModel.getPlayerInfo(this.id);
        playerInfo.level = this._tankLevel;
    }

    onLevelUpdated() {
        super.onLevelUpdated();

        //玩家坦克等级变化时，更新其他属性
        let atru = GameConfigModel.tankData[this._tankName];
        if (atru) {
            if (this._tankLevel >= 2) {
                this._bulletSpeed = atru.bulletSpeed + 100; //等级大于2后，提升子弹速度
            }
            else{
                this._bulletSpeed = atru.bulletSpeed;
            }
        }

        if (this._tankLevel >= 3) {
            this._maxBulletNum = 2; //等级大于3后，提升共存数量
        }
        else {
            this._maxBulletNum = 1;
        }

        if (this._tankLevel >= 4) {
            this._moveSpeed = atru.moveSpeed + 20;
        }
        else {
            this._moveSpeed = atru.moveSpeed;
        }
    }

    onLogicLastFrameEvent() {
        if (this._hited && this.isTankVisible()) {
            if (this.haveBuff(GameDef.TANK_BUFF_INVINCIBLE)) {
                this._hited = false;
                return;
            }

            if (this._tankLevel >= GameDef.PLAYER_LEVEL_PROTECT_ONCE_DEAD) {
                this.setTankLevel(this._tankLevel - 1);
                let playerInfo = GameDataModel.getPlayerInfo(this.id);
                playerInfo.level = this._tankLevel;
                this._hited = false;
                return;
            }

            this.syncLogicPos();
            this.dead();
        }

        if (!this._hited) {
            this._logicUpdate = true;   
        }
    }
}
 