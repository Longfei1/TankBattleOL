import { GameDef } from "../../../define/GameDef";
import { GameStruct } from "../../../define/GameStruct";
import GameDataModel from "../../../model/GameDataModel";
import { gameController } from "../Game";
import { EventDef } from "../../../define/EventDef";
import Scenery from "../Scenery";
import Bullet from "../Bullet";
import { AniDef } from "../../../define/AniDef";
import BaseTank from "./BaseTank";
import CommonFunc from "../../../common/CommonFunc";
import AudioModel from "../../../model/AudioModel";
import GameLogicModel from "../../../model/GameLogicModel";
import Big, { BigSource } from "../../../../packages/bigjs/Big";
import Prop from "../Prop";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BattleTank extends BaseTank {
    @property({ displayName: "子弹发射位置偏移，相对坦克锚点", type: [cc.Vec2], tooltip: "上左下右" })
    nodePosBullet: cc.Vec2[] = [];

    //属性
    _tankName:string = "";
    _imgName: string = "";
    _tankLevel: number = 1;
    _tankMaxLevel: number = 0;
    _team: number = -1;
    _moveSpeed: number = 0;
    _bulletSpeed: number = 0;
    _maxBulletNum: number = 1;
    _bulletType: number = -1;
    _bulletPower: number = 1;

    _shootCoolTime: number = GameDef.TANK_SHOOT_COOLTIME;

    //状态
    _isMove: boolean = false;
    _moveDirection: number = -1;
    _imgLoopFrame: number = 0;
    _imgShowFrame: number = 1;

    _buffStatus = 0;
    _bulletNum = 0;

    _lastShootTime: number = 0;

    private _tankID: number = -1;

    DirectionSuffix = {
        0: "U",
        1: "L",
        2: "D",
        3: "R"
    }

    //编号
    set id(id: number) {
       this._tankID = id; 
    }

    get id(): number {
        return this._tankID; 
    }


    onLoad() {
        super.onLoad();

        this.node.zIndex = GameDef.ZINDEX_BATTLE_TANK;
    }

    reset() {
        super.reset();

        this.setTankVisible(false); //初始时不可见

        this._tankID = -1;

        //属性
        this._imgName = "";
        this._tankLevel = 1;
        this._tankMaxLevel = 0;
        this._team = -1;
        this._moveSpeed = 0;
        this._bulletSpeed = 0;
        this._maxBulletNum = 1;
        this._bulletType = -1;
        this._bulletPower = 1;

        //状态
        this._isMove = false;
        //this._canMove = true;
        //this._lastPosition = null;
        this._imgLoopFrame = 0;
        this._imgShowFrame = 1;

        this._buffStatus = 0;
        this._bulletNum = 0;

        this._lastShootTime = 0;
    }

    setAttributes(attributes: GameStruct.TankAttributes) {
        this.setTankName(attributes.tankName);
        this.setImgName(attributes.imgName);
        this.setTankLevel(attributes.maxLevel);
        this.setTankTeam(attributes.team);
        this.setMoveSpeed(attributes.moveSpeed);
        this.setBulletSpeed(attributes.bulletSpeed);
        this.setBulletPower(attributes.bulletPower);

        this._tankMaxLevel = attributes.maxLevel;
        this._bulletType = attributes.bulletType;
        this._maxBulletNum = attributes.maxBulletNum;
    }

    setTankTeam(team: number) {
        this._team = team;
    }

    setTankName(name: string) {
        this._tankName = name;
    }

    setImgName(name: string) {
        this._imgName = name;
    }

    setTankLevel(level: number = 0) {
        this._tankLevel = level;
        
        this.onLevelUpdated();
    }

    setBulletPower(power: number) {
        this._bulletPower = power;
    }

    setMoveDirction(nDirection: number) {
        if (this._moveDirection !== nDirection) {
            this._moveDirection = nDirection;
            this.updateTankImg()
        }
    }

    getMoveDirection(): number {
        return this._moveDirection;
    }

    updateTankImg() {
        let frameName = this.getTankImgName();
        this.setTankImg(frameName);
    }

    getTankImgName(): string {
        if (this._imgName === "") {
            return;
        }

        if (!this.DirectionSuffix[this._moveDirection]) {
            return;
        }

        let frameName = `${this._imgName}_${this._tankLevel}${this.DirectionSuffix[this._moveDirection]}_${this._imgShowFrame}`;
        return frameName;
    }

    setMove(bMove: boolean, nDirection?: number) {
        if (bMove) {
            this.correctPosition(this._moveDirection, nDirection);

            this.setMoveDirction(nDirection);
            this._isMove = true;
        }
        else if (!bMove) {
            this._isMove = false;
        }
    }

    setMoveSpeed(nSpeed: number) {
        this._moveSpeed = nSpeed;
    }

    setBulletSpeed(nSpeed: number) {
        this._bulletSpeed = nSpeed;
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

        return moveDiff;
    }

    shoot(): boolean {
        if (!this.isTankVisible()) {
            return false;
        }

        let time = GameLogicModel.getLogicTime();
        if (time - this._lastShootTime < GameLogicModel.secondToMillisecond(this._shootCoolTime)) {
            return false;
        }

        if (this._bulletNum < this._maxBulletNum) {
            let shootInfo = this.getShootInfo();
            if (shootInfo) {
                this._bulletNum++;
                this._lastShootTime = time;
                gameController.node.emit(EventDef.EV_BULLET_CREATE, shootInfo);
                return true;
            }    
        }
        return false;
    }

    born(callback?: Function) {
        gameController.playUnitAniInTime(AniDef.UnitAniType.BORN, this.getNodeAni(), 0.8, null, () => {
            //this.setTankVisible(false);
        }, () => {
            this.setTankVisible(true);
            
            if (typeof callback === "function") {
                callback();
            }
        });
    }

    dead() {
        AudioModel.playSound("sound/blast");

        this._isMove = false;
        gameController.playTankBlastAni(this.getCenterPosition(), () => {
            this.setTankVisible(false);
        }, () => {
            this.destroyNode();
        });

        gameController.playGainScoreAni(this.node.getPosition(), this.getDestroyScore());
    }

    //被命中
    onHited(bulletNode: cc.Node, value: number) {
        this._hited = true;
        this._hitedGroup = bulletNode.group;
        this._hitedValue = value;
        this._logicUpdate = false;
    }

    destroyNode() {
        this.node.destroy();
    }

    addImgLoopFrame() {
        this._imgLoopFrame++;

        if (this._imgLoopFrame > GameDef.TANK_MOVE_INTERVAL_FRAMES) {
            //两帧移动帧
            this._imgShowFrame++;
            if (this._imgShowFrame > 2) {
                this._imgShowFrame = 1;
            }

            this._imgLoopFrame = 0;
        }
    }

    //矫正坐标，转向时设置坐标为最近的行列坐标值
    correctPosition(oldDirection: number, newDirection: number) {
        if (this.isNeedCorrectPosition(oldDirection, newDirection)) {
            this.setLogicPosition(this.getCorrectPosition(this._logicPos, oldDirection, newDirection), true);
        }
    }

    //改变成垂直与水平方向时才需要矫正
    isNeedCorrectPosition(oldDirection: number, newDirection: number): boolean {
        if (oldDirection === newDirection || newDirection === GameDataModel.getOppositeDirection(oldDirection)) {
            return false;
        }
        
        return true;
    }

    getCorrectPosition(pos: GameStruct.BigPos, oldDirection: number, newDirection: number): GameStruct.BigPos {
        let ret = pos.clone();

        if (this.isNeedCorrectPosition(oldDirection, newDirection)) {
            if (newDirection === GameDef.DIRECTION_UP || newDirection === GameDef.DIRECTION_DOWN) {
                let minValue = GameDataModel.getSceneryWidth(); //保持x坐标为布景节点宽度的倍数
                let col = Math.floor(pos.x.div(minValue).toNumber());
                let offset = pos.x.mod(minValue);
                if (offset.mul(2).gte(minValue)) {
                    if (oldDirection !== GameDef.DIRECTION_RIGHT || !offset.mul(2).eq(minValue)) { //原来方向向右时，如果与右边障碍相切时也可能出现等于minValue/2的情况，此时不能向右纠正
                        col++;
                    }
                }
                ret.x = Big(col).mul(minValue);
            }
            else if (newDirection === GameDef.DIRECTION_LEFT || newDirection === GameDef.DIRECTION_RIGHT) {
                let minValue = GameDataModel.getSceneryWidth(); //保持y坐标为布景节点宽度的倍数
                let row = Math.floor(pos.y.div(minValue).toNumber());
                let offset = pos.y.mod(minValue);
                if (offset.mul(2).gte(minValue)) {
                    if (oldDirection !== GameDef.DIRECTION_UP || !offset.mul(2).eq(minValue)) { //原来方向向上时，如果与上边障碍相切时也可能出现等于minValue/2的情况，此时不能向上纠正
                        row++;
                    }
                }
                ret.y = Big(row).mul(minValue);
            }
        }

        return ret;
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

    getMoveRect(src: GameStruct.BigPos, dir: number, distance: Big): GameStruct.BigRect {
        let moveAreaRect: GameStruct.BigRect;
        let width = GameDataModel.getTankWidth();
        if (dir === GameDef.DIRECTION_UP) {
            moveAreaRect = new GameStruct.BigRect(src.x, src.y.plus(width), width, distance);
        }
        else if (dir === GameDef.DIRECTION_DOWN) {
            moveAreaRect = new GameStruct.BigRect(src.x, src.y.minus(distance), width, distance);
        }
        else if (dir === GameDef.DIRECTION_LEFT) {
            moveAreaRect = new GameStruct.BigRect(src.x.minus(distance), src.y, distance, width);
        }
        else if (dir === GameDef.DIRECTION_RIGHT) {
            moveAreaRect = new GameStruct.BigRect(src.x.plus(width), src.y, distance, width);
        }
        return moveAreaRect;
    }

    //给定起点(锚点)、方向和距离，判断是否可以移动
    canMoveFromAToB(src: GameStruct.BigPos, dir: number, distance: Big): GameStruct.BigPos {
        let newPos: GameStruct.BigPos = null;
        let moveAreaRect = this.getMoveRect(src, dir, distance);

        if (moveAreaRect) {
            if (GameDataModel.canTankMoveInRect(moveAreaRect, this.node)) {
                newPos = this.getMovePosition(src, dir, distance);
            }
        }

        return newPos;
    }

    //给定起点(锚点)、方向和距离，判断是否可以移动(当与阻碍物有一定距离时，会贴近阻碍物，并算作可以移动)
    //返回值为新的坐标
    canMoveFromAToBEx(src: GameStruct.BigPos, dir: number, distance: Big): GameStruct.BigPos {
        let newPos: GameStruct.BigPos = null;
        let moveAreaRect = this.getMoveRect(src, dir, distance);
        if (moveAreaRect) {
            let collisionInfo = GameDataModel.getTankCollisionRectWhenMove(dir, moveAreaRect, this.node);
            if (collisionInfo.length > 0) {
                //返回一个和障碍物相交的坐标
                let collisionRect = collisionInfo[0].rect;
                let tankWidth = GameDataModel.getTankWidth();
                let myRect: GameStruct.BigRect = new GameStruct.BigRect(src.x, src.y, tankWidth, tankWidth);
                switch (dir) {
                    case GameDef.DIRECTION_UP:
                        if (myRect.yMax.lt(collisionRect.yMin)) {
                            newPos = new GameStruct.BigPos(myRect.x, collisionRect.yMin.minus(myRect.height));
                        }
                        break;
                    case GameDef.DIRECTION_LEFT:
                        if (myRect.xMin.gt(collisionRect.xMax)) {
                            newPos = new GameStruct.BigPos(collisionRect.xMax, myRect.y);
                        }
                        break;
                    case GameDef.DIRECTION_DOWN:
                        if (myRect.yMin.gt(collisionRect.yMax)) {
                            newPos = new GameStruct.BigPos(myRect.x, collisionRect.yMax);
                        }
                        break;
                    case GameDef.DIRECTION_RIGHT:
                        if (myRect.xMax.lt(collisionRect.xMin)) {
                            newPos = new GameStruct.BigPos(collisionRect.xMin.minus(myRect.width), myRect.y);
                        }
                        break;
                    default:
                        break;
                }
            }
            else {
                newPos = this.getMovePosition(src, dir, distance);
            }
        }

        return newPos;
    }

    //获取坦克当前可移动的方向
    getAvailableMoveDirections(): number[] {
        let moveDirections = [GameDef.DIRECTION_UP, GameDef.DIRECTION_LEFT, GameDef.DIRECTION_DOWN, GameDef.DIRECTION_RIGHT];
        let directions: number[] = []

        let nowPos = this._logicPos;
        let nowDirction = this._moveDirection;

        for (let dir of moveDirections) {
            let correctPos = this.getCorrectPosition(nowPos, nowDirction, dir);//向dirction方向移动时，矫正后的位置坐标

            let moveDistance = this.calcMoveDistance(Big(1).div(GameDef.GAME_FPS_PHYSICS));

            if (this.canMoveFromAToBEx(correctPos, dir, moveDistance)) {
                directions.push(dir);
            }
        }

        return directions;
    }

    getBulletPowerLevel(): number {
        return this._bulletPower;
    }

    getShootInfo(): GameStruct.ShootInfo {
        if (this._bulletSpeed > 0 && GameDataModel.isValidDirection(this._moveDirection)) {
            let bulletPos = new GameStruct.BigPos(this._logicPos.x.plus(this.nodePosBullet[this._moveDirection].x), this._logicPos.y.plus(this.nodePosBullet[this._moveDirection].y));
            let shootInfo: GameStruct.ShootInfo = {
                type: this._bulletType,
                shooterID: this._tankID,
                powerLevel: this.getBulletPowerLevel(),
                team: this._team,
                pos: bulletPos,
                direction: this._moveDirection,
                speed: this._bulletSpeed,
            }
            return shootInfo;
        }
        return null;
    }

    //移动更新失败时触发
    onMoveFailed() {
        //移动失败，当前逻辑帧停止移动判断
        this._logicUpdate = false;        
    }

    //移动更新成功时触发
    onMoveSuccess() {

    }

    onGetShieldStatus(time: number) {
        if (time != null) {
            gameController.playUnitAniInTime(AniDef.UnitAniType.SHIELD, this.getNodeAni(), time, null, () => {
                this._buffStatus |= GameDef.TANK_BUFF_INVINCIBLE;
            }, () => {
                this._buffStatus &= ~GameDef.TANK_BUFF_INVINCIBLE;
            });
        }
    }

    onShootHited() {
        if (this._bulletNum > 0) {
            this._bulletNum--;
        }
    }

    getTankContainRcInfoArray(): GameStruct.RcInfo[] {
        let scenePos = this._logicPos
        let pos = GameDataModel.sceneToMatrixPosition(scenePos);

        let rowNum = 4;
        let colNum = 4;
        let unitWidth = GameDataModel.getMapUnit().width;

        if (!scenePos.x.mod(unitWidth).eq(0)) {
            colNum++;
        }

        if (!scenePos.y.mod(unitWidth).eq(0)) {
            rowNum++;
        }

        let posAry = GameDataModel.getRectContainPosArray(pos, rowNum, colNum);
        return posAry;
    }

    onLevelUpdated() {
        this.updateTankImg();
    }

    getDestroyScore(): number {
        return 0;
    }

    getCenterPosition() {
        let pos = this.node.getPosition();
        let width = GameDataModel.getTankWidth();
        return cc.v2(pos.x + width / 2, pos.y + width / 2);
    }

    getTankRect(): GameStruct.BigRect {
        let tankWidth = GameDataModel.getTankWidth();
        let tankRect: GameStruct.BigRect = new GameStruct.BigRect(this._logicPos.x, this._logicPos.y, tankWidth, tankWidth);
        return tankRect;
    }

    isTankOnIceScenery(): boolean {
        let rect = this.getTankRect();
        let sceneryNodes = GameDataModel.getSceneryNodesInRect(rect);
        if (sceneryNodes) {
            for (let node of sceneryNodes) {
                let com = node.getComponent(Scenery);
                let sceneryType = com.getType();
                if (sceneryType === GameDef.SceneryType.ICE) {
                    return true;
                }
            }
        }

        return false;
    }

    onLogicUpdate(dt: Big) {
        if (!this._logicUpdate) {
            return;
        }

        if (!this.isTankVisible()) {
            return;
        }

        let moveDiff = this.calcMoveDistance(dt);
        if (moveDiff.gt(0)) {
            let newPos = this.canMoveFromAToBEx(this._logicPos, this._moveDirection, moveDiff);
            if (newPos) {
                this.setLogicPosition(newPos, false);
                this.onMoveSuccess();
            }
            else {
                this.onMoveFailed();
            }
        }
    }

    onLogicLastFrameEvent() {
        if (this._hited && this.isTankVisible()) {
            this.syncLogicPos();
            this.dead();
        }

        if (!this._hited) {
            this._logicUpdate = true;   
        }
    }

    update(dt) {
        let dstPos = this._logicPos;
        let move = true;
        if (this._moveDirection === GameDef.DIRECTION_UP || this._moveDirection === GameDef.DIRECTION_DOWN) {
            this.node.x = dstPos.x.toNumber();
            if (dstPos.y.eq(this.node.y)) {
                move = false;
            }
        }
        else {
            this.node.y = dstPos.y.toNumber();
            if (dstPos.x.eq(this.node.x)) {
                move = false;
            }
        }

        if (move) {
            //逻辑帧冰布景不会移动，这里直接用冰布景最后的逻辑位置（如果不是这样，需要记录状态以便渲染判断是否在冰布景上）
            let bHaveIce = false;
            let tankWidth = GameDataModel.getTankWidth();
            let tankRect: GameStruct.BigRect = new GameStruct.BigRect(this.node.x, this.node.y, tankWidth, tankWidth);
            let sceneryNodes = GameDataModel.getSceneryNodesInRect(tankRect);
            if (sceneryNodes) {
                for (let node of sceneryNodes) {
                    let com = node.getComponent(Scenery);
                    let sceneryType = com.getType();
                    if (sceneryType === GameDef.SceneryType.ICE) {
                        bHaveIce = true;
                        break;
                    }
                }
            }

            let speed = this._moveSpeed;
            if (bHaveIce) {
                speed += GameDef.TANK_ICE_ADD_SPEED; //冰加移速
            }
            let moveDiff = Big(speed).mul(dt);

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

        if (this._isMove) {
            this.addImgLoopFrame();
            this.updateTankImg();
        }
    }

    onClilision(self: GameStruct.colliderInfo, other: GameStruct.colliderInfo) {
        if (this._hited) {
            return;
        }

        if (other.node.group === GameDef.GROUP_NAME_BULLET) {
            let com = other.node.getComponent(Bullet);
            if (this._team !== com._team) {
                if (!com._hited || (com._hitedGroup === GameDef.GROUP_NAME_BULLET && com._hitedValue === this.id)) {
                    this.onHited(other.node, com.id);
                }
            }
            this._logicUpdate = false;
        }
        else if (other.node.group === GameDef.GROUP_NAME_PROP) {
            this.onClilisionProp(other.node);
        }
    }

    onClilisionProp(propNode: cc.Node) {
        
    }
}