import BattleTank from "./BattleTank";
import { GameDef } from "../../../define/GameDef";
import CommonFunc from "../../../common/CommonFunc";
import { gameController } from "../Game";
import { EventDef } from "../../../define/EventDef";
import GameDataModel from "../../../model/GameDataModel";
import Bullet from "../Bullet";
import GameLogicModel from "../../../model/GameLogicModel";
import { GameStruct } from "../../../define/GameStruct";
import Big, { BigSource } from "../../../../packages/bigjs/Big";

const { ccclass, property } = cc._decorator;

//遇到障碍后，继续尝试朝该方向移动的时间区间。
const TRY_MOVE_TIME_MIN = 200; //单位毫秒
const TRY_MOVE_TIME_MAX = 600; //单位毫秒     

@ccclass
export default class EnemyTank extends BattleTank {

    _bRed: boolean = false;

    _tryMoveTime: number = 0;
    _tryMoveStartTime: number = 0;
    _bTryMoving: boolean = false;
    _bTryShoot: boolean = false;
    _bChangeDir: boolean = false;

    _hitedPower: number = 0;
    _destroyedBy: number = -1;

    setRed(bRed: boolean) {
        this._bRed = bRed;
        this.updateTankImg();
    }

    reset() {
        super.reset();
        this._bRed = false;

        this._tryMoveStartTime = 0;
        this._tryMoveTime = 0;
        this._bTryMoving = false;
        this._bTryShoot = false;
        this._bChangeDir = false;
        this._destroyedBy = -1;
    }

    born(callback?: Function) {
        let cb = ()=> {
            if (typeof callback === "function") {
                callback();
            }

            this.moveOnBorn()
        };

        super.born(cb);
    }

    onHited(bulletNode: cc.Node, value: number) {
        super.onHited(bulletNode, value);

        let com = bulletNode.getComponent(Bullet);
        this._hitedPower = com._powerLevel;
        this._destroyedBy = com._shooterID;
    }

    destroyNode() {
        gameController.node.emit(EventDef.EV_ENEMY_DEAD, this.id);
    }

    getTankImgName(): string {
        if (this._imgName === "") {
            return;
        }

        if (!this.DirectionSuffix[this._moveDirection]) {
            return;
        }

        let levelName = `${this._tankLevel}`;
        if (this._bRed) {
            levelName = "red"
        }

        let frameName = `${this._imgName}_${levelName}${this.DirectionSuffix[this._moveDirection]}_${this._imgShowFrame}`;
        return frameName;
    }

    calcMoveDistance(dt: BigSource): Big {
        let moveDiff = Big(0);
        
        if (this._isMove) {
            let speed = this._moveSpeed;
            if (this.isTankOnIceScenery()) {
                speed += GameDef.TANK_ICE_ADD_SPEED; //冰加移速
            }

            moveDiff = Big(speed).mul(dt);
        }

        if (CommonFunc.isBitSet(GameDataModel._propBuff, GameDef.PROP_BUFF_STATIC)) {
            //定时道具时间
            moveDiff = Big(0);
        }

        return moveDiff;
    }

    getDestroyScore() {
        if (GameDef.EnemyTankScore[this._tankName]) {
            return GameDef.EnemyTankScore[this._tankName];
        }

        return 0;
    }

    shoot(): boolean {
        if (!CommonFunc.isBitSet(GameDataModel._propBuff, GameDef.PROP_BUFF_STATIC)) {
            return super.shoot();
        }
        return false;
    }

    //************************
    //行为控制相关

    setMove(bMove: boolean, nDirection: number) {
        if (CommonFunc.isBitSet(GameDataModel._propBuff, GameDef.PROP_BUFF_STATIC)) {
            return;
        }
        if (!bMove || nDirection !== this._moveDirection) {
            this._bTryMoving = false; //停止移动或换方向，重置尝试移动标志
            this._bTryShoot = false;
            this._bChangeDir = false;
        }

        super.setMove(bMove, nDirection);
    }

    //当前方向移动失败
    onMoveFailed() {
        super.onMoveFailed();

        if (GameDataModel._gameOver) {
            return;
        }

        let time = GameLogicModel.getLogicTime();
        //障碍物不是边界时，尝试突破障碍物
        if (!this._bTryMoving && !this.isOutBoundaryDirction(this._moveDirection)) {
            let tryProbability = 0.6;
            if (this.isDirectionForwardHomeBase(this._moveDirection)) {
                if (GameDataModel.isModeDoublePlayer()) {
                    tryProbability = 0.85;
                }
                else {
                    tryProbability = 0.7;
                }
            }
            if (GameLogicModel.isInProbability(tryProbability)) {
                this._bTryMoving = true;
                this._tryMoveStartTime = time;
                this._tryMoveTime = GameLogicModel.getRandomInteger(TRY_MOVE_TIME_MIN, TRY_MOVE_TIME_MAX);
                this._bTryShoot = true;
                return;
            }
        }

        if (!this._bTryMoving) {
            this._bChangeDir = true;
        }
    }

    onMoveSuccess() {
        this._bTryMoving = false;
        this._bTryShoot = false;
        this._bChangeDir = false;
    }

    //行为控制定时器
    onBehaviorTimer() {
        if (GameLogicModel.isInProbability(0.15)) {
            //给定概率下改变移动方向

            this.changeMoveDirectionEx(0.1);
        }

        if (GameLogicModel.isInProbability(0.3)) {
            this.shoot();
        }
    }

    moveOnBorn() {
        let twoDirs = this.getAllMoveDirectionsCanChoose();
        this.chooseOneDirctionMove(twoDirs);
    }

    //换方向移动，排除当前移动方向。
    changeMoveDirection() {
        let twoDirs = this.getAllMoveDirectionsCanChoose();
        if (this._isMove) {
            //筛选出原来的移动方向
            CommonFunc.filterArray(twoDirs.moveableDirs, [this._moveDirection]);
            CommonFunc.filterArray(twoDirs.tryDirs, [this._moveDirection]);
        }

        this.chooseOneDirctionMove(twoDirs);
    }

    //换方向移动，排除当前移动方向，一定概率排除相反的方向。
    changeMoveDirectionEx(oppositeProbability: number) {
        let twoDirs = this.getAllMoveDirectionsCanChoose();
        if (this._isMove) {
            //筛选出原来的移动方向
            CommonFunc.filterArray(twoDirs.moveableDirs, [this._moveDirection]);
            CommonFunc.filterArray(twoDirs.tryDirs, [this._moveDirection]);

            if (!GameLogicModel.isInProbability(oppositeProbability)) {
                //概率下，不向现在移动的反方向移动
                let opsiteDirection = GameDataModel.getOppositeDirection(this._moveDirection);
                CommonFunc.filterArray(twoDirs.moveableDirs, [opsiteDirection]);
                CommonFunc.filterArray(twoDirs.tryDirs, [opsiteDirection]);
            }
        }

        this.chooseOneDirctionMove(twoDirs);
    }

    chooseOneDirctionMove(twoDirs) {
        let movedirs = null;
        if (twoDirs.moveableDirs.length > 0) {
            if (twoDirs.tryDirs.length > 0) {
                //按照概率选择移动方向
                if (GameLogicModel.isInProbability(0.75)) {
                    movedirs = twoDirs.moveableDirs;
                }
                else {
                    movedirs = twoDirs.tryDirs;
                }
            }
            else {
                movedirs = twoDirs.moveableDirs;
            }
        }
        else {
            //没有可移动方向，尝试不可移动的方向
            movedirs = twoDirs.tryDirs;
        }

        if (movedirs && movedirs.length > 0) {
            let weights = this.calcMoveDirectionWeight(movedirs);

            let dir = GameLogicModel.getRandomArrayValueWithWeight(movedirs, weights);
            if (dir != null) {
                this.setMove(true, dir);
            }
        }
    }

    //获取所有可以选择移动的方向(不包括会造成触碰边界的方向)
    getAllMoveDirectionsCanChoose() {
        let tryDirections = [GameDef.DIRECTION_UP, GameDef.DIRECTION_LEFT, GameDef.DIRECTION_DOWN, GameDef.DIRECTION_RIGHT];
        let moveableDirections = this.getAvailableMoveDirections();

        CommonFunc.filterArray(tryDirections, moveableDirections); //筛选可移动的方向

        for (let i = tryDirections.length - 1; i >= 0; i--) {
            if (this.isOutBoundaryDirction(tryDirections[i])) { //排除会导致越界的方向
                tryDirections.splice(i, 1);
            }
        }

        return {moveableDirs: moveableDirections, tryDirs: tryDirections};//{可移动方向，可尝试的不可移动方向}
    }

    //该方向是否会导致越界
    isOutBoundaryDirction(dir: number) {
        let pos = this._logicPos;
        let distance = this.calcMoveDistance(Big(1).div(GameDef.GAME_FPS_PHYSICS));
        let moveAreaRect = this.getMoveRect(pos, dir, distance);

        if (moveAreaRect) {
            if (!GameDataModel.isValidRect(moveAreaRect)) {
                return true;
            }
        }

        return false;
    }

    //计算移动方向的选择权重
    calcMoveDirectionWeight(moveDirctions: number[]): number[] {
        let defaultValue = 10;
        let weights: number[] = [];
        for (let i = 0; i < moveDirctions.length; i++) {
            let value = defaultValue;//初始权重
            if (this.isDirectionForwardHomeBase(moveDirctions[i])) {
                if (GameDataModel.isModeDoublePlayer()) {
                    value += 15;
                }
                else {
                    value += 10;
                }
            }

            weights.push(value);
        }

        return weights;
    }

    isDirectionForwardHomeBase(dir: number): boolean {
        let tankPos = this._logicPos;
        let homeBasePos = GameDataModel.getHomeCenterScenePosition();

        let vertical = GameDef.DIRECTION_DOWN;
        if (tankPos.y.lt(homeBasePos.y)) {
            vertical = GameDef.DIRECTION_UP;
        }

        let horizontal = GameDef.DIRECTION_LEFT;
        if (tankPos.x.lt(homeBasePos.x)) {
            horizontal = GameDef.DIRECTION_RIGHT;
        }

        if (dir === vertical || dir === horizontal) {
            return true;
        }

        return false;
    }

    //行为控制相关
    //************************

    onLogicLastFrameEvent() {
        if (this._hited) {
            let bulletLevel = this._hitedPower;
            let hitCount = bulletLevel == GameDef.BULLET_POWER_LEVEL_STELL ? 2 : 1; //被能击毁钢的子弹打中时，扣两次等级
            if (this._bRed) {
                this.setRed(false);

                gameController.node.emit(EventDef.EV_PROP_CREATE); //产生道具

                hitCount--;

                if (hitCount === 0) {
                    this._hited = false;
                    return;
                }
            }

            if (this._tankLevel > hitCount) {
                this.setTankLevel(this._tankLevel - hitCount);
                this._hited = false;
                return;
            }

            this.syncLogicPos();
            this.dead();
        }

        if (!this._hited) {
            this._logicUpdate = true;   
        }

        if (!this._hited && this.isTankVisible()) {
            if (this._bTryShoot) {
                this._bTryShoot = !this.shoot();
            }
            else if (this._bTryMoving && GameLogicModel.getLogicTime() - this._tryMoveStartTime >= this._tryMoveTime) {
                //超过尝试时间, 换方向移动
                this.changeMoveDirectionEx(0.3);
            }
            else if (this._bChangeDir) {
                this.changeMoveDirectionEx(0.3);
            }
        }
    }

    isNeedUpdateMoveView():boolean {
        return this._isMove && !CommonFunc.isBitSet(GameDataModel._propBuff, GameDef.PROP_BUFF_STATIC);
    }
}