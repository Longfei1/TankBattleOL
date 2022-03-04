import GameDataModel from "../../model/GameDataModel";
import { GameDef } from "../../define/GameDef";
import AudioModel from "../../model/AudioModel";
import { gameController } from "./Game";
import Scenery from "./Scenery";
import BattleTank from "./tank/BattleTank";
import { EventDef } from "../../define/EventDef";
import GameStartAni from "./animation/GameStartAni";
import { GameStruct } from "../../define/GameStruct";
import Big from "../../../packages/bigjs/Big";
import GameUnitComponent from "./GameUnitComponent";
import HomeBase from "./HomeBase";
import GameLogicModel from "../../model/GameLogicModel";

const { ccclass, property } = cc._decorator;

const DirectionSuffix = {
    0: "U",
    1: "L",
    2: "D",
    3: "R"
}

@ccclass
export default class Bullet extends GameUnitComponent {
    @property({ displayName: "子弹图片", type: cc.Sprite})
    imgBullet: cc.Sprite = null;

    @property({ displayName: "子弹图集", type: cc.SpriteAtlas })
    atlasBullet: cc.SpriteAtlas = null;

    _bulletID: number = -1;

    _speedMove: number = 0;
    _moveDirection: number = -1;
    _bulletType: number = -1;
    _shooterID: number = -1;
    _team: number = -1;
    _powerLevel: number = -1;

    onLoad() {
        this.node.zIndex = GameDef.ZINDEX_BULLET;
    }

    set id(id: number) {
        this._bulletID = id;
    }

    get id(): number {
        return this._bulletID;
    }

    reset() {
        super.reset();

        this.id = -1;
        this._speedMove = 0;
        this._moveDirection = -1;
        this._bulletType = -1;
        this._shooterID = -1;
        this._team = -1;
        this._powerLevel = -1;
    }

    setMove(speed?: number, direction?: number) {
        this._speedMove = speed == null ? this._speedMove : speed;
        this._moveDirection = direction == null ? this._moveDirection : direction;
        this.updateImg();
    }

    setType(type: number) {
        if (type != null) {
            this._bulletType = type;
        }
        this.updateImg();
    }

    updateImg() {
        let frameName = "";
        switch (this._bulletType) {
            case GameDef.BulletType.COMMON:
                frameName = "common";
                break;
            default:
                break;
        }

        frameName += `_${DirectionSuffix[this._moveDirection]}`;
        let frame = this.atlasBullet.getSpriteFrame(frameName);
        if (frame) {
            this.imgBullet.spriteFrame = frame;
        }
    }

    onHited(group: string, value: number = -1) {
        if (!this._hited) {
            this._hited = true;
            this._hitedGroup = group;
            this._hitedValue = value;
            this._logicUpdate = false;
        }
    }

    dealHitScenery(bulletPos: GameStruct.BigPos, dir: number, sceneryRect: GameStruct.BigRect): boolean {
        //计算碰撞点的中心点位置以及命中范围
        //目前设定下，射击坐标一定处于行列坐标中(子弹不会命中到土墙内部细分的子结构上)，若不满足这一假设，需调整计算方式。
        let hitInfos: GameStruct.HitInfo[] = [];
        if (dir === GameDef.DIRECTION_UP || dir === GameDef.DIRECTION_DOWN) {
            let collisionPos = new GameStruct.BigPos(bulletPos.x, sceneryRect.y);
            let hitRcInfo = GameDataModel.sceneToMatrixPosition(collisionPos);//命中位置

            let leftHitInfo: GameStruct.HitInfo = {
                pos: new GameStruct.RcInfo(hitRcInfo.col - 1, hitRcInfo.row),
                scope: {
                    up: 0,
                    down: 0,
                    left: 1,
                    right: 0,
                },
                power: this._powerLevel,
            };
            let rightHitInfo: GameStruct.HitInfo = {
                pos: hitRcInfo,
                scope: {
                    up: 0,
                    down: 0,
                    left: 0,
                    right: 1,
                },
                power: this._powerLevel,
            };

            hitInfos.push(leftHitInfo);
            hitInfos.push(rightHitInfo);
        }
        else if (dir === GameDef.DIRECTION_LEFT || dir === GameDef.DIRECTION_RIGHT) {
            let collisionPos = new GameStruct.BigPos(sceneryRect.x, bulletPos.y);
            let hitRcInfo = GameDataModel.sceneToMatrixPosition(collisionPos);//命中位置，

            let upHitInfo: GameStruct.HitInfo = {
                pos: hitRcInfo,
                scope: {
                    up: 1,
                    down: 0,
                    left: 0,
                    right: 0,
                },
                power: this._powerLevel,
            };
            let downHitInfo: GameStruct.HitInfo = {
                pos: new GameStruct.RcInfo(hitRcInfo.col, hitRcInfo.row - 1),
                scope: {
                    up: 0,
                    down: 1,
                    left: 0,
                    right: 0,
                },
                power: this._powerLevel,
            };

            hitInfos.push(upHitInfo);
            hitInfos.push(downHitInfo);
        }

        if (this._powerLevel === GameDef.BULLET_POWER_LEVEL_STELL) {//扩大命中范围
            for (let info of hitInfos) {
                GameDataModel.addScopeByDirection(info.scope, dir, 1);
            }
        }

        if (hitInfos.length > 0) {
            //判断并销毁布景
            return this.destroyHitedScenerys(hitInfos);//计算命中的布景节点
        }
        return false;
    }

    //子弹命中布景节点，根据范围处理相关布景的销毁
    destroyHitedScenerys(hitInfos: GameStruct.HitInfo[]): boolean {
        if (!hitInfos) {
            return false;
        }

        let hited = false;

        //递归函数，由某一节点向四周递归判断
        let hitFunc;
        hitFunc = (hitInfo: GameStruct.HitInfo, hitSceneryType: number = GameDef.SceneryType.NULL) => {
            let sceneryPos = GameDataModel.matrixToSceneryPosition(hitInfo.pos);
            let sceneryNode = GameDataModel.getSceneryNode(sceneryPos);
            if (!sceneryNode) {
                return;
            }
            let scenery = sceneryNode.getComponent(Scenery);
            if (scenery) {
                if (hitSceneryType !== GameDef.SceneryType.NULL && hitSceneryType !== scenery.getType()) {//只扩散处理相同的布景类型
                    return;
                }

                //处理销毁动作
                if (scenery.onHited(hitInfo.pos, hitInfo.power)) {
                    hited = true;
                }

                hitSceneryType = scenery.getType();
                //递归判断周围节点
                let scope = hitInfo.scope;
                if (scope.up > 0) {
                    scope.up--;
                    hitInfo.pos.row++;
                    hitFunc(hitInfo, hitSceneryType);
                    hitInfo.pos.row--;
                    scope.up++;
                }

                if (scope.down > 0) {
                    scope.down--;
                    hitInfo.pos.row--;
                    hitFunc(hitInfo, hitSceneryType);
                    hitInfo.pos.row++;
                    scope.down++;
                }

                if (scope.left > 0) {
                    scope.left--;
                    hitInfo.pos.col--;
                    hitFunc(hitInfo, hitSceneryType);
                    hitInfo.pos.col++;
                    scope.left++;
                }

                if (scope.right > 0) {
                    scope.right--;
                    hitInfo.pos.col++;
                    hitFunc(hitInfo, hitSceneryType);
                    hitInfo.pos.col--;
                    scope.right++;
                }
            }
        };

        for (let info of hitInfos) {
            hitFunc(info);
        }

        return hited;
    }

    getMoveRect(src: GameStruct.BigPos, dir: number, distance: Big): GameStruct.BigRect {
        let moveAreaRect: GameStruct.BigRect;
        let width = this.getBulletWidth();
        let halfWidth = Big(width).div(2);

        //子弹锚点(0.5,0.5)
        if (dir === GameDef.DIRECTION_UP) {
            moveAreaRect = new GameStruct.BigRect(src.x.minus(halfWidth), src.y.plus(halfWidth), width, distance);
        }
        else if (dir === GameDef.DIRECTION_DOWN) {
            moveAreaRect = new GameStruct.BigRect(src.x.minus(halfWidth), src.y.minus(halfWidth).minus(distance), width, distance);
        }
        else if (dir === GameDef.DIRECTION_LEFT) {
            moveAreaRect = new GameStruct.BigRect(src.x.minus(halfWidth).minus(distance), src.y.minus(halfWidth), distance, width);
        }
        else if (dir === GameDef.DIRECTION_RIGHT) {
            moveAreaRect = new GameStruct.BigRect(src.x.plus(halfWidth), src.y.minus(halfWidth), distance, width);
        }

        return moveAreaRect;
    }

    getBulletWidth() {
        return this.imgBullet.node.width;
    }

    getBulletRect(pos?: GameStruct.BigPos): GameStruct.BigRect {
        let width = this.getBulletWidth();
        let halfWidth = Big(width).div(2);

        if (!pos) {
            pos = this._logicPos;
        }

        return new GameStruct.BigRect(pos.x.minus(halfWidth), pos.y.minus(halfWidth), width, width);
    }

    getMovePosition(src: GameStruct.BigPos, dir: number, distance: Big) {
        let retPos: GameStruct.BigPos = null;

        switch (dir) {
            case GameDef.DIRECTION_UP:
                retPos = new GameStruct.BigPos(src.x, src.y.plus(distance));
                break;
            case GameDef.DIRECTION_LEFT:
                retPos = new GameStruct.BigPos(src.x.minus(distance), src.y);
                break;
            case GameDef.DIRECTION_DOWN:
                retPos = new GameStruct.BigPos(src.x, src.y.minus(distance));
                break;
            case GameDef.DIRECTION_RIGHT:
                retPos = new GameStruct.BigPos(src.x.plus(distance), src.y);
                break;
            default:
                break;
        }

        return retPos;
    }

    //给定起点(锚点)、方向和距离，尝试移动(当与阻碍物有一定距离时，会贴近阻碍物，并算作可以移动)
    tryMoveFromAToBEx(src: GameStruct.BigPos, dir: number, distance: Big) {
        let newPos: GameStruct.BigPos = null;
        let moveAreaRect = this.getMoveRect(src, dir, distance);
        if (moveAreaRect) {
            let collisionInfo = GameDataModel.getBulletCollisionRectWhenMove(dir, moveAreaRect, this.node);
            if (collisionInfo.length > 0) {
                let getSortValue =  function(group: string) {
                    if (group === GameDef.GROUP_NAME_SCENERY) {
                        return 100;
                    }
                    return 0
                };

                collisionInfo.sort(function (a: GameStruct.GameRectInfo, b: GameStruct.GameRectInfo): number {
                    return getSortValue(b.group) - getSortValue(a.group);
                });

                //返回一个和障碍物相交的坐标
                let collisionRect = collisionInfo[0].rect;
                let bulletHalfWidth = Big(this.getBulletWidth()).div(2); 
                let myRect = this.getBulletRect(src);
                switch (dir) {
                    case GameDef.DIRECTION_UP:
                        if (myRect.yMax.lt(collisionRect.yMin)) {
                            newPos = new GameStruct.BigPos(src.x, collisionRect.yMin.minus(bulletHalfWidth));
                        }
                        break;
                    case GameDef.DIRECTION_LEFT:
                        if (myRect.xMin.gt(collisionRect.xMax)) {
                            newPos = new GameStruct.BigPos(collisionRect.xMax.plus(bulletHalfWidth), src.y);
                        }
                        break;
                    case GameDef.DIRECTION_DOWN:
                        if (myRect.yMin.gt(collisionRect.yMax)) {
                            newPos = new GameStruct.BigPos(src.x, collisionRect.yMax.plus(bulletHalfWidth));
                        }
                        break;
                    case GameDef.DIRECTION_RIGHT:
                        if (myRect.xMax.lt(collisionRect.xMin)) {
                            newPos = new GameStruct.BigPos(collisionRect.xMin.minus(bulletHalfWidth), src.y);
                        }
                        break;
                    default:
                        break;
                }

                //使用移动区域判断命中
                //优点：1.只会判断移动区域内的布景，可降低碰撞检测负荷
                //      2.不会由于子弹速度快而导致碰撞检测穿透现象

                if (collisionInfo[0].group === GameDef.GROUP_NAME_SCENERY) {
                    if (this.dealHitScenery(src, dir, collisionInfo[0].rect)) {
                        this.onHited(GameDef.GROUP_NAME_SCENERY, collisionInfo[0].type);
                    }
                }
                else if (collisionInfo[0].group === GameDef.GROUP_NAME_BOUNDARY) {
                    this.onHited(GameDef.GROUP_NAME_BOUNDARY, collisionInfo[0].type);
                }
                this._logicUpdate = false;
            }
            else {
                newPos = this.getMovePosition(src, dir, distance);
            }
        }

        if (newPos) {
            this.setLogicPosition(newPos, false);
        }
    }

    onLogicUpdate(dt: Big) {
        if (!this._logicUpdate) {
            return;
        }

        let moveDiff = Big(this._speedMove).mul(dt);

        this.tryMoveFromAToBEx(this._logicPos, this._moveDirection, moveDiff);
    }

    onLogicLastFrameEvent() {
        if (this._hited) {
            if (this._team === GameDef.TeamType.PLAYER) {
                if (this._hitedGroup === GameDef.GROUP_NAME_SCENERY) {
                    if (this._hitedValue === GameDef.SceneryType.WALL) {
                        AudioModel.playSound("sound/hit1");
                    }
                    else {
                        AudioModel.playSound("sound/hit2");
                    }
                }
                else {
                    AudioModel.playSound("sound/hit2");
                }
            }
            else {
                if (this._hitedGroup === GameDef.GROUP_NAME_TANK && this._hitedValue < 10) {
                    AudioModel.playSound("sound/hit2");
                }
            }

            this.syncLogicPos();
            gameController.playBulletBlastAni(this.node.getPosition());
            gameController.node.emit(EventDef.EV_BULLET_DESTROY, this.id, this._shooterID);
        }
        else {
            this._logicUpdate = true;
        }
    }

    update(dt) {
        if (GameLogicModel._netGameDxxw) {
            this.node.setPosition(GameDataModel.bigPosToVec2(this._logicPos));
            return;
        }
        
        let dstPos = this._logicPos;
        if (this._moveDirection === GameDef.DIRECTION_UP || this._moveDirection === GameDef.DIRECTION_DOWN) {
            this.node.x = dstPos.x.toNumber();
        }
        else {
            this.node.y = dstPos.y.toNumber();
        }

        let moveDiff = Big(this._speedMove).mul(dt);

        let p: Big = null;
        if (this._moveDirection === GameDef.DIRECTION_UP) {
            p = moveDiff.plus(this.node.y);
            if (p.lte(dstPos.y)) {
                this.node.y = p.toNumber();
            }
            else {
                this.node.y = dstPos.y.toNumber();
            }
        }
        else if (this._moveDirection === GameDef.DIRECTION_LEFT) {
            p = Big(this.node.x).minus(moveDiff);
            if (p.gte(dstPos.x)) {
                this.node.x = p.toNumber();
            }
            else {
                this.node.x = dstPos.x.toNumber();
            }
        }
        else if (this._moveDirection === GameDef.DIRECTION_DOWN) {
            p = Big(this.node.y).minus(moveDiff);
            if (p.gte(dstPos.y)) {
                this.node.y = p.toNumber();
            }
            else {
                this.node.y = dstPos.y.toNumber();
            }
        }
        else if (this._moveDirection === GameDef.DIRECTION_RIGHT) {
            p = moveDiff.plus(this.node.x);
            if (p.lte(dstPos.x)) {
                this.node.x = p.toNumber();
            }
            else {
                this.node.x = dstPos.x.toNumber();
            }
        }
    }

    onClilision(self: GameStruct.colliderInfo, other: GameStruct.colliderInfo) {
        if (this._hited) {
            return;
        }

        let canMove = false;
        if (other.node.group === GameDef.GROUP_NAME_TANK) {
            let com = other.node.getComponent(BattleTank);
            if (this._shooterID !== com.id) {
                if (!com._hited || (com._hitedGroup === GameDef.GROUP_NAME_BULLET && com._hitedValue === this.id)) {
                    this.onHited(other.node.group, com.id);
                }
            }
            else {
                canMove = true;
            }
        }
        else if (other.node.group === GameDef.GROUP_NAME_BULLET) {
            let com = other.node.getComponent(Bullet);
            if (!com._hited || (com._hitedGroup === GameDef.GROUP_NAME_BULLET && com._hitedValue === this.id)) {
                this.onHited(other.node.group, com.id);
            }
        }
        else if (other.node.group === GameDef.GROUP_HOME_BASE) {
            let com = other.node.getComponent(HomeBase);
            if (!com._hited || (com._hitedGroup === GameDef.GROUP_NAME_BULLET && com._hitedValue === this.id)) {
                this.onHited(other.node.group);
            }
        }

        if (!canMove) {
            this._logicUpdate = false;
        }
    }
}