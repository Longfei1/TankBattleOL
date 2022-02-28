import Big from "../../../packages/bigjs/Big";
import { GameStruct } from "../../define/GameStruct";
import GameDataModel from "../../model/GameDataModel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameUnitComponent extends cc.Component {

    _logicPos: GameStruct.BigPos = new GameStruct.BigPos(0, 0);

    _logicUpdate: boolean = true;

    _hited: boolean = false; //击中目标
    _hitedGroup: string = "";
    _hitedValue: number = -1;

    reset() {
        this._logicPos = new GameStruct.BigPos(0, 0);
        this._logicUpdate = true;

        this._hited = false;
        this._hitedGroup = "";
        this._hitedValue = -1;
    }

    setLogicPosition(pos: GameStruct.BigPos, bUpdateView: boolean);
    setLogicPosition(rcInfo: GameStruct.RcInfo, bUpdateView: boolean);
    setLogicPosition(pos: any, bUpdateView: boolean) {
        if (pos) {
            if (pos.x != null && pos.y != null) {
                this._logicPos = pos;
            }
            else if (pos.col != null && pos.row != null) {
                this._logicPos = GameDataModel.matrixToScenePosition(pos);
            }

            if (bUpdateView) {
                this.node.setPosition(GameDataModel.bigPosToVec2(this._logicPos));
            }
        }
    }

    getLogicPosition(): GameStruct.BigPos {
        return this._logicPos.clone();
    }

    syncLogicPos() {
        this.node.setPosition(GameDataModel.bigPosToVec2(this._logicPos));
    }

    //逻辑更新
    onLogicUpdate(dt: Big) {

    }

    onLogicLateUpdate() {

    }

    onLogicLastFrameEvent() {

    }

    onClilision(self: GameStruct.colliderInfo, other: GameStruct.colliderInfo) {

    }
}
