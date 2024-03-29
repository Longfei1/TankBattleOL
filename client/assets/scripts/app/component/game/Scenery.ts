import { GameDef } from "../../define/GameDef";
import { gameController } from "./Game";
import { EventDef } from "../../define/EventDef";
import Bullet from "./Bullet";
import CommonFunc from "../../common/CommonFunc";
import GameDataModel from "../../model/GameDataModel";
import { GameStruct } from "../../define/GameStruct";
import GameUnitComponent from "./GameUnitComponent";

const { ccclass, property } = cc._decorator;

const SceneryZIndex = {
    [GameDef.SceneryType.WALL]: GameDef.ZINDEX_SCENERY_WALL,
    [GameDef.SceneryType.GRASS]: GameDef.ZINDEX_SCENERY_GRASS,
    [GameDef.SceneryType.ICE]: GameDef.ZINDEX_SCENERY_ICE,
    [GameDef.SceneryType.WATER]: GameDef.ZINDEX_SCENERY_WATER,
    [GameDef.SceneryType.STEEL]: GameDef.ZINDEX_SCENERY_STEEL,
}

@ccclass
export default class Scenery extends GameUnitComponent {

    @property({ displayName: "布景节点", type: cc.Node })
    nodeScenery: cc.Node = null;

    @property({ displayName: "布景图片", type: [cc.Sprite] })
    imgScenerys: cc.Sprite[] = [];

    @property({ displayName: "布景图片图集", type: cc.SpriteAtlas })
    atlasScenery: cc.SpriteAtlas = null;

    _type: number = GameDef.SceneryType.NULL;

    _hitedIndex: number[] = [];

    setType(type: number) {
        this._type = type;
        this.setSceneryImg();

        this.node.zIndex = SceneryZIndex[type];
    }

    getType(): number {
        return this._type
    }

    reset() {
        super.reset();

        this._hitedIndex = [];

        for (let it of this.imgScenerys) {
            it.node.active = true;
        }
    }

    //隐藏布景子元素
    destroyUnit(index: number) {
        if (this.imgScenerys[index]) {
            this.imgScenerys[index].node.active = false;
        }

        let haveVisible = false;
        for (let it of this.imgScenerys) {
            if (this.node.active === true) {
                haveVisible = true;
                break;
            }
        }

        //所有unit都销毁后，销毁整个节点
        if (!haveVisible) {
            gameController.node.emit(EventDef.EV_MAP_DESTROY_SCENERY, this.node);
        }
    }

    setSceneryImg() {
        for (let i = 0; i < this.imgScenerys.length; i++) {
            let frame = this.getImgFrame(this._type, i + 1);
            if (frame) {
                this.imgScenerys[i].spriteFrame = frame;
            }
        }
    }

    getImgFrame(type, index) {
        if (!type || !index) {
            return;
        }

        let name = "";
        switch (type) {
            case GameDef.SceneryType.WALL:
                name = "wall";
                break;
            case GameDef.SceneryType.WATER:
                name = "water";
                break;
            case GameDef.SceneryType.GRASS:
                name = "grass";
                break;
            case GameDef.SceneryType.STEEL:
                name = "steel";
                break;
            case GameDef.SceneryType.ICE:
                name = "ice";
                break;
            default:
                break;
        }

        name += `_${index}`;
        let frame = this.atlasScenery.getSpriteFrame(name);
        return frame;
    }

    //被子弹击中后处理函数，
    onHited(pos: GameStruct.RcInfo, power: number): boolean {
        if (!pos || !power) {
            return false;
        }

        if (this._hitedIndex.length === 4) {
            return false;
        }

        let sceneryType = this.getType();
        if (sceneryType === GameDef.SceneryType.GRASS || sceneryType === GameDef.SceneryType.WATER || sceneryType === GameDef.SceneryType.ICE) {//水和草暂时不能销毁
            return false;
        }
        else if (sceneryType === GameDef.SceneryType.STEEL) {
            if (power < GameDef.BULLET_POWER_LEVEL_STELL) {
                return true;
            }

            //目前只有土墙需要按细分后的unit去销毁，钢墙可直接销毁。
            this._hitedIndex = [0, 1, 2, 3];
            return true;
        }
        else if (sceneryType === GameDef.SceneryType.WALL) {
            let unitIndex = this.getUnitIndexByRcInfo(pos);

            if (unitIndex >= 0 && this._hitedIndex.indexOf(unitIndex) < 0) {
                this._hitedIndex.push(unitIndex);
                return true;
            }
        }
        return false;
    }

    isOverlapWithRect(rect: GameStruct.BigRect): boolean {
        if (rect) {
            for (let i = 0; i < this.imgScenerys.length; i++) {
                if (this.imgScenerys[i].node.active) {
                    let imgRect = this.getImgScenerysSceneRect(i);
                    
                    if (GameDataModel.isRectOverlap(rect, imgRect)) {//两个矩形有重合，相交不算
                        return true;
                    }
                }
            }
        }
        return false;
    }

    //获取布景图片的场景坐标
    getImgScenerysSceneRect(index: number): GameStruct.BigRect {
        let width = GameDataModel._mapUnit.width;
        let height = GameDataModel._mapUnit.height;
        if (index === 0) {
            return new GameStruct.BigRect(this._logicPos.x, this._logicPos.y.plus(width), width, height);
        }
        else if (index === 1) {
            return new GameStruct.BigRect(this._logicPos.x.plus(width), this._logicPos.y.plus(height), width, height);
        }
        else if (index === 2) {
            return new GameStruct.BigRect(this._logicPos.x, this._logicPos.y, width, height);
        }
        else if (index === 3) {
            return new GameStruct.BigRect(this._logicPos.x.plus(width), this._logicPos.y, width, height);
        }
    }

    //获取与指定区域重叠的所有子区域
    getOverlapSceneryRects(rect: GameStruct.BigRect): GameStruct.GameRectInfo[] {
        let ret: GameStruct.GameRectInfo[] = [];

        if (rect) {
            for (let i = 0; i < this.imgScenerys.length; i++) {
                if (this.imgScenerys[i].node.active) {
                    let imgRect = this.getImgScenerysSceneRect(i);

                    if (GameDataModel.isRectOverlap(rect, imgRect)) {//两个矩形有重合，相交不算
                        ret.push({group: GameDef.GROUP_NAME_SCENERY, type: this.getType(), rect: imgRect});
                    }
                }
            }
        }

        return ret;
    }

    getUnitIndexByRcInfo(pos: GameStruct.RcInfo) {
        let unitIndex = -1;
        let nodeRcInfo = GameDataModel.sceneToMatrixPosition(this._logicPos);
        if (pos.equal(nodeRcInfo)) {
            unitIndex = 2;
        }
        else if (pos.col === nodeRcInfo.col && pos.row === nodeRcInfo.row + 1) {
            unitIndex = 0;
        }
        else if (pos.row === nodeRcInfo.row && pos.col === nodeRcInfo.col + 1) {
            unitIndex = 3;
        }
        else if (pos.col === nodeRcInfo.col + 1 && pos.row === nodeRcInfo.row + 1) {
            unitIndex = 1;
        }

        return unitIndex;
    }

    getRcInfoByUnitIndex(index: number): GameStruct.RcInfo{
        let nodeRcInfo = GameDataModel.sceneToMatrixPosition(this._logicPos);
        let pos = null;
        if (index == 2) {
            pos = nodeRcInfo;
        }
        else if (index == 0) {
            pos = new GameStruct.RcInfo(nodeRcInfo.col, nodeRcInfo.row + 1)
        }
        else if (index == 3) {
            pos = new GameStruct.RcInfo(nodeRcInfo.col + 1, nodeRcInfo.row)
        }
        else if (index == 1) {
            pos = new GameStruct.RcInfo(nodeRcInfo.col + 1, nodeRcInfo.row + 1)
        }

        return pos;
    }

    getSceneryContainPosAry(): GameStruct.RcInfo[] {
        let ary: GameStruct.RcInfo[] = [];
        for (let i = 0; i < this.imgScenerys.length; i++) {
            if (this.imgScenerys[i] && this.imgScenerys[i].node.active) {
                let pos = this.getRcInfoByUnitIndex(i);
                if (pos) {
                    ary.push(pos);
                }
            }
        }

        return ary;
    }

    onLogicLastFrameEvent() {
        for (let i = 0; i < this._hitedIndex.length; i++) {
            this.destroyUnit(this._hitedIndex[i]);
        }
    }
}
