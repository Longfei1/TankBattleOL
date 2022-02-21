import GameDataModel from "../model/GameDataModel";
import { GameDef } from "../define/GameDef";
import PlayerTank from "../component/game/tank/PlayerTank";
import { PlayerDef } from "../define/PlayerDef";
import GameInputModel from "../model/GameInputModel";
import MapEditTank from "../component/game/tank/MapEditTank";
import { gameController } from "../component/game/Game";
import { EventDef } from "../define/EventDef";
import { GameStruct } from "../define/GameStruct";
import CommonFunc from "../common/CommonFunc";
import GameConfigModel from "../model/GameConfigModel";
import NodePool from "../common/NodePool";
import GameLogicModel from "../model/GameLogicModel";
import GameOpeControl from "../define/GameOpeControl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerManager extends cc.Component {

    @property({ displayName: "游戏层", type: cc.Node })
    panelGame: cc.Node = null;

    @property({ displayName: "玩家预制体", type: cc.Prefab })
    pfbPlayer: cc.Prefab = null;

    @property({ displayName: "地图编辑玩家预制体", type: cc.Prefab })
    pfbMapEditer: cc.Prefab = null;

    _players: { [no: number]: PlayerTank } = {};
    _mapEditer: MapEditTank = null;

    _playerPool: NodePool = null;

    _opeDirection: { [no: number]: GameOpeControl } = {};
    _opeOk: { [no: number]: GameOpeControl } = {};
    _opeCancel: { [no: number]: GameOpeControl } = {};

    onLoad() {
        this.initListener();
        this._playerPool = new NodePool(this.pfbPlayer, PlayerTank);

        for (let i = 0; i < GameDef.GAME_TOTAL_PLAYER; i++) {
            this._opeDirection[i] = new GameOpeControl(300, 50);
            this._opeOk[i] = new GameOpeControl(300, 50);
            this._opeCancel[i] = new GameOpeControl(300, 50);
        }
    }

    onDestroy() {
        this.removeListener()

        this._playerPool.clearNode();
    }

    initListener() {
        GameLogicModel.addEventListener(EventDef.EV_GL_PLAYER_OPERATION, this.onPlayerOperation, this);

        gameController.node.on(EventDef.EV_GAME_INIT_FINISHED, this.evGameInitFinished, this);

        if (!GameDataModel.isModeEditMap()) {
            gameController.node.on(EventDef.EV_GAME_STARTED, this.evGameStarted, this);
            gameController.node.on(EventDef.EV_PLAYER_DEAD, this.evPlayerDead, this);
            gameController.node.on(EventDef.EV_GAME_PREPARE_GAME, this.evPrepareGame, this);
            gameController.node.on(EventDef.EV_GAME_REDUCE_BULLET, this.evReduceBullet, this);

            gameController.node.on(EventDef.EV_GAME_PAUSE, this.evGamePause, this);
            gameController.node.on(EventDef.EV_GAME_RESUME, this.evGameResume, this);

            gameController.node.on(EventDef.EV_GAME_ENDED, this.evGameEnd, this);
        }
    }

    removeListener() {
        GameLogicModel.removeEventListenerByContext(this);
    }

    initPlayers() {
        if (GameDataModel.isModeEditMap()) {
            let mapEditer = cc.instantiate(this.pfbMapEditer);
            if (mapEditer) {
                this.panelGame.addChild(mapEditer);
                mapEditer.zIndex = GameDef.ZINDEX_MAP_EDIT_TANK;
                let tankCom = mapEditer.getComponent(MapEditTank)
                tankCom.setEditPosition(CommonFunc.copyObject(GameDef.BORN_PLACE_PLAYER1));
                this._mapEditer = tankCom;
            }
        }
        else {
            if (GameDataModel.getPlayerInfo(0).liveStatus) {
                this.createPlayer(0, this.getTankAttributesById(0), GameDef.BORN_PLACE_PLAYER1);
            }

            if (GameDataModel.getPlayerInfo(1).liveStatus && GameDataModel.isModeDoublePlayer()) {
                this.createPlayer(1, this.getTankAttributesById(1), GameDef.BORN_PLACE_PLAYER2);
            }
        }
    }

    resetPlayer() {
        CommonFunc.travelMap(this._players, (no: number, player: PlayerTank) => {
            if (cc.isValid(player.node)) {
                this._playerPool.putNode(player.node);
            }
        });

        this._players = {};
        GameDataModel.clearPlayerTank();

        if (cc.isValid(this._mapEditer)) {
            this._mapEditer.node.destroy();
            this._mapEditer = null;
        }
    }

    createPlayer(id: number, attr: GameStruct.TankAttributes, bornPos: GameStruct.RcInfo) {
        let playerInfo = GameDataModel.getPlayerInfo(id);
        let player = this._playerPool.getNode();
        this.panelGame.addChild(player);
        let playerCom = player.getComponent(PlayerTank);
        playerCom.reset();
        playerCom.id = id;
        playerCom.setAttributes(attr);
        playerCom.setTankLevel(playerInfo.level);
        playerCom.setPosition(bornPos);
        playerCom.setMoveDirction(GameDef.DIRECTION_UP);

        this._players[id] = playerCom;
        GameDataModel.setPlayerTank(player);

        playerCom.born();
    }

    destroyPlayer(id: number) {
        if (this._players[id]) {
            this._playerPool.putNode(this._players[id].node);
            delete this._players[id];
            GameDataModel.removePlayerTank(id);
        }
    }

    onPlayerOperation(opes: GameStruct.PlayerOperation[]) {
        for (let i = 0; i < opes.length; i++) {
            let ope = opes[i];

            if (this._opeDirection[ope.playerNO].effectInput(ope.direction)) {
                let dir = GameDef.DIRECTION_UP;
                let code = GameOpeControl.getInputCode(ope.direction);
                if (code === GameDef.NetKeyDirection.LEFT) {
                    dir = GameDef.DIRECTION_LEFT;
                }
                else if (code === GameDef.NetKeyDirection.DOWN) {
                    dir = GameDef.DIRECTION_DOWN;
                }
                else if (code === GameDef.NetKeyDirection.RIGHT) {
                    dir = GameDef.DIRECTION_RIGHT;
                }
                this.onPlayerMove(ope.playerNO, dir);
            }

            if (this._opeOk[ope.playerNO].effectInput(ope.ok)) {
                this.onPlayerOkClickDown(ope.playerNO);
            }

            if (this._opeCancel[ope.playerNO].effectInput(ope.cancel)) {
                this.onPlayerCancelClickDown(ope.playerNO);
            }
        }
    }

    onKeyDown(event) {
        if (!GameDataModel._enableOperate) {
            return;
        }
        switch (event.keyCode) {
            case PlayerDef.KEYMAP_PLAYER1.UP:
                this.onPlayerMove(0, GameDef.DIRECTION_UP);
                break;
            case PlayerDef.KEYMAP_PLAYER1.LEFT:
                this.onPlayerMove(0, GameDef.DIRECTION_LEFT);
                break;
            case PlayerDef.KEYMAP_PLAYER1.DOWN:
                this.onPlayerMove(0, GameDef.DIRECTION_DOWN);
                break;
            case PlayerDef.KEYMAP_PLAYER1.RIGHT:
                this.onPlayerMove(0, GameDef.DIRECTION_RIGHT);
                break;
            case PlayerDef.KEYMAP_PLAYER1.OK:
                this.onPlayerOkClickDown(0);
                break;
            case PlayerDef.KEYMAP_PLAYER1.CANCEL:
                this.onPlayerCancelClickDown(0);
                break;
            case PlayerDef.KEYMAP_PLAYER2.UP:
                this.onPlayerMove(1, GameDef.DIRECTION_UP);
                break;
            case PlayerDef.KEYMAP_PLAYER2.LEFT:
                this.onPlayerMove(1, GameDef.DIRECTION_LEFT);
                break;
            case PlayerDef.KEYMAP_PLAYER2.DOWN:
                this.onPlayerMove(1, GameDef.DIRECTION_DOWN);
                break;
            case PlayerDef.KEYMAP_PLAYER2.RIGHT:
                this.onPlayerMove(1, GameDef.DIRECTION_RIGHT);
                break;
            case PlayerDef.KEYMAP_PLAYER2.OK:
                this.onPlayerOkClickDown(1);
                break;
            case PlayerDef.KEYMAP_PLAYER2.CANCEL:
                this.onPlayerCancelClickDown(1);
                break;
            default:
                break;
        }
    }

    onKeyUp(event) {
        if (!GameDataModel._enableOperate) {
            return;
        }
        switch (event.keyCode) {
            case PlayerDef.KEYMAP_PLAYER1.UP:
                this.onStopMove(0, GameDef.DIRECTION_UP);
                break;
            case PlayerDef.KEYMAP_PLAYER1.LEFT:
                this.onStopMove(0, GameDef.DIRECTION_LEFT);
                break;
            case PlayerDef.KEYMAP_PLAYER1.DOWN:
                this.onStopMove(0, GameDef.DIRECTION_DOWN);
                break;
            case PlayerDef.KEYMAP_PLAYER1.RIGHT:
                this.onStopMove(0, GameDef.DIRECTION_RIGHT);
                break;
            case PlayerDef.KEYMAP_PLAYER2.UP:
                this.onStopMove(1, GameDef.DIRECTION_UP);
                break;
            case PlayerDef.KEYMAP_PLAYER2.LEFT:
                this.onStopMove(1, GameDef.DIRECTION_LEFT);
                break;
            case PlayerDef.KEYMAP_PLAYER2.DOWN:
                this.onStopMove(1, GameDef.DIRECTION_DOWN);
                break;
            case PlayerDef.KEYMAP_PLAYER2.RIGHT:
                this.onStopMove(1, GameDef.DIRECTION_RIGHT);
                break;
            default:
                break;
        }
    }

    onPlayerMove(playerNo: number, nDirection: number) {
        if (GameDataModel.isModeEditMap()) {
            CommonFunc.playButtonSound();

            //地图编辑模式移动一格
            if (playerNo === 0) {
                let moveDiff;
                let moveLength = GameDef.SCENERY_CONTAINS_RC;
                if (nDirection === GameDef.DIRECTION_UP) {
                    moveDiff = new GameStruct.RcInfo(0, moveLength);
                }
                else if (nDirection === GameDef.DIRECTION_LEFT){
                    moveDiff = new GameStruct.RcInfo(-moveLength, 0);
                }
                else if (nDirection === GameDef.DIRECTION_DOWN){
                    moveDiff = new GameStruct.RcInfo(0, -moveLength);
                }
                else if (nDirection === GameDef.DIRECTION_RIGHT){
                    moveDiff = new GameStruct.RcInfo(moveLength, 0);
                }

                this._mapEditer.moveBy(moveDiff);
            }
        }
        else {
            if (this._players[playerNo]) {
                this._players[playerNo].setMove(true, nDirection);
            }
        }
    }

    onStopMove(playerNo: number, nDirection: number) {
        if (!GameDataModel.isModeEditMap()) {
            if (this._players[playerNo]) {
                this._players[playerNo].setMove(false, nDirection);
            }
        }
    }

    onPlayerOkClickDown(playerNo: number) {
        if (GameDataModel.isModeEditMap() && playerNo === 0) {
            this.onChangeScenery();
        }
        else {
            if (this._players[playerNo]) {
                this._players[playerNo].shoot();
            }
        }
    }

    onPlayerCancelClickDown(playerNo: number) {
        if (GameDataModel.isModeEditMap() && playerNo === 0) {
            this.onChangeEditMode();
        }
        else {
            if (this._players[playerNo]) {
                this._players[playerNo].shoot();
            }
        }
    }

    onChangeEditMode() {
        CommonFunc.playButtonSound();
        this._mapEditer.changeEditMode();
    }

    onChangeScenery() {
        CommonFunc.playButtonSound();
        this._mapEditer.updateSceneryMap();
    }

    evGameStarted() {
        // CommonFunc.travelMap(this._players, (no: number, player: PlayerTank) => {
        //     if (cc.isValid(player.node)) {
        //         //player.onGetShieldStatus(GameDef.BORN_INVINCIBLE_TIME);
        //     }
        // });
    }

    evPlayerDead(no: number) {
        let playerInfo = GameDataModel.getPlayerInfo(no);
        playerInfo.liveStatus = false;
        playerInfo.level = 1;
        this.destroyPlayer(no);

        if (playerInfo.lifeNum > 0) {
            playerInfo.lifeNum--;
            playerInfo.liveStatus = true;
            this.createPlayer(no, this.getTankAttributesById(no), this.getBornPlaceById(no));

            gameController.node.emit(EventDef.EV_DISPLAY_UPDATE_PLAYER_LIFE);
        }

        {
            let bGameOver = true;

            if (!this.isPlayerNoLife(0)) {
                bGameOver = false;
            }

            if (GameDataModel.isModeDoublePlayer() && !this.isPlayerNoLife(1)) {
                bGameOver = false;
            }

            if (bGameOver) {
                gameController.gameOver(); //玩家没有生命，游戏结束
            }
        }
    }

    evPrepareGame() {
        this.resetPlayer();
        this.initPlayers();
    }

    evReduceBullet(id: number) {
        if (this._players[id]) {
            this._players[id].onShootHited();
        }
    }

    getTankAttributesById(id : number): GameStruct.TankAttributes{
        let idToName = {[0]: "player1", [1]: "player2"};
        let tankData = GameConfigModel.tankData;
        return tankData[idToName[id]];
    }

    getBornPlaceById(id : number): GameStruct.RcInfo{
        let idToPos = {[0]: GameDef.BORN_PLACE_PLAYER1, [1]: GameDef.BORN_PLACE_PLAYER2};
        let tankData = GameConfigModel.tankData;
        return idToPos[id];
    }

    isPlayerNoLife(no: number) {
        //玩家状态为死亡且没有多余的剩余生命
        let playerInfo = GameDataModel.getPlayerInfo(no)
        if (!playerInfo.liveStatus && playerInfo.lifeNum <= 0) {
            return true;
        }
        return false;
    }

    evGamePause() {
       this.stopAllPlayerMove();
    }

    evGameResume() {

    }

    evGameEnd() {
        this.stopAllPlayerMove();
    }

    stopAllPlayerMove() {
        CommonFunc.travelMap(this._players, (no: number, player: PlayerTank) => {
            if (cc.isValid(player.node)) {
                player.setMove(false, player._moveDirection);
            }
        });
    }

    evGameInitFinished() {
        if (GameDataModel.isModeEditMap()) {
            this.initPlayers();
        }
    }
}