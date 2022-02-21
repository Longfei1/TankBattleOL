import BaseTank from "./BaseTank";
import { GameDef } from "../../../define/GameDef";
import Scenery from "../Scenery";
import GameDataModel from "../../../model/GameDataModel";
import { GameStruct } from "../../../define/GameStruct";
import { gameController } from "../Game";
import { EventDef } from "../../../define/EventDef";

enum MapEditMode {
    UNIT0,    //0个场景元素
    UNIT1,    //一个场景元素
    UNIT2,    //二个场景元素
    UNIT4,    //四个场景元素
    NUM,      //模式数量
}

let EditModeVisibleMap = {};
EditModeVisibleMap[MapEditMode.UNIT0] = [false, false, false, false];
EditModeVisibleMap[MapEditMode.UNIT1] = [true, false, false, false];
EditModeVisibleMap[MapEditMode.UNIT2] = [true, true, false, false];
EditModeVisibleMap[MapEditMode.UNIT4] = [true, true, true, true];

let SceneryRcInfoDiff = {
    0: new GameStruct.RcInfo(0, 1),
    1: new GameStruct.RcInfo(1, 1),
    2: new GameStruct.RcInfo(0, 0),
    3: new GameStruct.RcInfo(1, 0),
}

let SceneryTypeOrder = [
    GameDef.SceneryType.WALL,
    GameDef.SceneryType.GRASS,
    GameDef.SceneryType.ICE,
    GameDef.SceneryType.WATER,
    GameDef.SceneryType.STEEL,
]

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapEditTank extends BaseTank {
    @property({ displayName: "场景单元", type: [cc.Node]})
    sceneryUnit: cc.Node[] = [];

    _editPos: GameStruct.RcInfo = null;
    _editSceneryType: number = GameDef.SceneryType.WALL;
    _editMode: number = MapEditMode.UNIT0;

    onLoad() {
        super.onLoad();

        this.setSceneryView();
        this.showEditAni();
    }

    onDestroy() {
        super.onDestroy();
    }

    showEditAni() {
        this.node.getComponent(cc.Animation).play();
    }

    changeEditMode() {
        if (this._editSceneryType === GameDef.SceneryType.WALL) {
            if (this._editMode < MapEditMode.NUM - 1) {
                this._editMode = this._editMode + 1;
            }
            else {
                this.changeSceneryType();
            }
        }
        else {
            this.changeSceneryType();
        }

        this.setSceneryView();
        this.showEditAni();
    }

    changeSceneryType() {
        let nextOrder = (this.getSceneryTypeOrder(this._editSceneryType) + 1) % SceneryTypeOrder.length;
        this._editSceneryType = SceneryTypeOrder[nextOrder];

        if (this._editSceneryType === GameDef.SceneryType.WALL) {
            //重置回土墙后，重置模式
            this._editMode = MapEditMode.UNIT0;
        }
    }

    updateSceneryMap() {
        let createInfos = [];

        for (let i = 0; i < this.sceneryUnit.length; i++) {
            if (EditModeVisibleMap[this._editMode][i]) {
                let sceneryPos = GameDataModel.matrixToSceneryPosition(this._editPos);
                let pos = GameStruct.RcInfo.sum(sceneryPos, SceneryRcInfoDiff[i]);
                createInfos.push({ type: this._editSceneryType, sceneryPos: pos });
            }
        }

        if (createInfos.length === 0) {
            //沒有创建信息，清空当前所在位置的所有布景
            for (let i = 0; i < this.sceneryUnit.length; i++) {
                let sceneryPos = GameDataModel.matrixToSceneryPosition(this._editPos);
                let pos = GameStruct.RcInfo.sum(sceneryPos, SceneryRcInfoDiff[i]);
                createInfos.push({ type: GameDef.SceneryType.NULL, sceneryPos: pos });
            }
        }

        gameController.node.emit(EventDef.EV_MAP_CREATE_SCENERY, createInfos);
    }

    getSceneryTypeOrder(sceneryType: number) {
        for (let index = 0; index < SceneryTypeOrder.length; index++) {
            if (SceneryTypeOrder[index] == sceneryType) {
                return index;
            }
        }
        return -1;
    }

    setSceneryView() {
        for (let i = 0; i < this.sceneryUnit.length; i++) {
            this.sceneryUnit[i].getComponent(Scenery).setType(this._editSceneryType);
            this.sceneryUnit[i].active = EditModeVisibleMap[this._editMode][i];
        }
    }

    setEditPosition(pos: GameStruct.RcInfo) {
        if (pos && this.isValidPosition(pos)) {
            this._editPos = pos;
            this.setPosition(pos);
        }
    }

    moveBy(diff: GameStruct.RcInfo) {
        if (diff) {
            let pos = GameStruct.RcInfo.sum(this._editPos, diff);
            this.setEditPosition(pos);
        }
    }

    isValidPosition(pos: GameStruct.RcInfo) {
        if (pos) {
            //锚点为(0,0)
            //四个边界坐标都合法
            if (GameDataModel.isValidMatrixPos(pos)
                && GameDataModel.isValidMatrixPos(new GameStruct.RcInfo(pos.col + 4, pos.row))
                && GameDataModel.isValidMatrixPos(new GameStruct.RcInfo(pos.col, pos.row + 4))
                && GameDataModel.isValidMatrixPos(new GameStruct.RcInfo(pos.col + 4, pos.row + 4))) {
                return true;
            }
        }
        return false;
    }
}
