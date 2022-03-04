import GameDataModel from "../model/GameDataModel";
import EnemyTank from "../component/game/tank/EnemyTank";
import NodePool from "../common/NodePool";
import UniqueIdGenerator from "../common/UniqueIdGenerator";
import { gameController } from "../component/game/Game";
import { EventDef } from "../define/EventDef";
import GameConfigModel from "../model/GameConfigModel";
import { GameStruct } from "../define/GameStruct";
import CommonFunc from "../common/CommonFunc";
import { GameDef } from "../define/GameDef";
import GameLogicModel from "../model/GameLogicModel";
import Big from "../../packages/bigjs/Big";

const ENEMY_ADD_INTERVAL = 1000; //毫秒
const ENEMY_BEHAVIOR_INTERVAL = 500; //毫秒

const { ccclass, property } = cc._decorator;

@ccclass
export default class EnemyManager extends cc.Component {
    @property({ displayName: "游戏层", type: cc.Node })
    panelGame: cc.Node = null;

    @property({ displayName: "坦克预制体", type: cc.Prefab })
    pfbEnemy: cc.Prefab = null;

    _idGenerator: UniqueIdGenerator = new UniqueIdGenerator(100, 11); //10以内的id预留给玩家使用

    _enemyPool: NodePool = null;

    _diffcultyData = null;

    _bornPlaceIndex: number = 0;

    _enemyAddTime: number = 0;
    _enemyBehaviorTime: number = 0;

    onLoad() {
        this.initListenner();

        this._enemyPool = new NodePool(this.pfbEnemy, EnemyTank);
    }

    onDestroy() {
        this.removeListener();

        this._enemyPool.clearNode();

        GameLogicModel.unscheduleAll(this);
    }

    initListenner() {
        if (!GameDataModel.isModeEditMap()) {
            gameController.node.on(EventDef.EV_GAME_PREPARE_GAME, this.evPrepareGame, this);
            gameController.node.on(EventDef.EV_GAME_STARTED, this.evGameStarted, this);
            gameController.node.on(EventDef.EV_GAME_ENDED, this.evGameEnded, this);
            gameController.node.on(EventDef.EV_ENEMY_DEAD, this.evEnemyDead, this);
            gameController.node.on(EventDef.EV_GAME_REDUCE_BULLET, this.evReduceBullet, this);

            //gameController.node.on(EventDef.EV_GAME_PAUSE, this.evGamePause, this);
            //gameController.node.on(EventDef.EV_GAME_RESUME, this.evGameResume, this);

            gameController.node.on(EventDef.EV_PROP_BOMB, this.evPropBomb, this);

            GameLogicModel.addEventListener(EventDef.EV_GL_AI_OPERATION, this.evAiOperation, this);

            GameLogicModel.addEventListener(EventDef.EV_GL_UPDATE, this.evLogicUpdate, this);
            GameLogicModel.addEventListener(EventDef.EV_GL_LATE_UPDATE, this.evLogicLateUpdate, this);
            GameLogicModel.addEventListener(EventDef.EV_GL_LAST_FRAME_EVENT, this.evLogicLastFrameEvent, this);
        }
    }

    removeListener() {
        GameLogicModel.removeEventListenerByContext(this);
    }

    reset() {
        this._idGenerator.reset();
        this._diffcultyData = null;
        this._bornPlaceIndex = 0;

        this.resetEnemy();
    }

    resetEnemy() {
        CommonFunc.travelMap(GameDataModel._enemyTanks, (id:number, enemy: EnemyTank) => {
            if (cc.isValid(enemy.node)) {
                this._enemyPool.putNode(enemy.node);
            }
        })

        GameDataModel._enemyTanks = {};
    }

    evPrepareGame() {
        this.reset();
    }

    evGameStarted() {
        let stage = GameDataModel._currStage;
        //读取本关卡难度数据
        this._diffcultyData = GameConfigModel.getDifficultyData(stage);

        this._enemyAddTime = GameLogicModel.getLogicTime();
        this._enemyBehaviorTime = GameLogicModel.getLogicTime();

        //游戏开始，生成敌方坦克
        let initNum = 3;
        for (let i = 0; i < initNum; i++) {
            this.addOneEnemy();
        }
    }

    evGameEnded() {
        
    }

    evEnemyDead(id : number) {
        if (GameDataModel._enemyTanks[id]) {
            if (GameDataModel._enemyTanks[id]._destroyedBy >= 0) {
                let playerInfo = GameDataModel.getPlayerInfo(GameDataModel._enemyTanks[id]._destroyedBy);
                playerInfo.shootNumInfo[GameDataModel._enemyTanks[id]._tankName]++;
            }
        }

        this.destroyEnemyTank(id);

        //生成新的敌人
        if (this.isNeedCreateEnemy()) {
            this.addOneEnemy();
        }

        if (this.isGameEnd()) {
            GameLogicModel.scheduleOnce(() => {
                gameController.gameEnd();
            }, this, 3);
        }
    }

    evReduceBullet(id: number) {
        if (GameDataModel._enemyTanks[id]) {
            GameDataModel._enemyTanks[id].onShootHited();
        }
    }

    evPropBomb(playerNO: number) {
        //销毁全部敌军
        CommonFunc.travelMap(GameDataModel._enemyTanks, (id:number, enemy: EnemyTank) => {
            enemy._destroyedBy = playerNO;
            enemy.dead(); 
        })
    }

    createEnemyTank(name: string, pos: GameStruct.RcInfo, bRed = false) {
        let tank = this._enemyPool.getNode();
        this.panelGame.addChild(tank);
        let com = tank.getComponent(EnemyTank);
        let tankData = GameConfigModel.tankData;
        com.reset();
        com.id = this._idGenerator.generateID();
        com.setAttributes(tankData[name]);
        com.setRed(bRed);
        com.setLogicPosition(pos, true);
        com.setMoveDirction(GameDef.DIRECTION_DOWN); 

        GameDataModel._enemyTanks[com.id] = com;

        com.born();
    }

    destroyEnemyTank(id: number) {
        if (GameDataModel._enemyTanks[id]) {
            this._enemyPool.putNode(GameDataModel._enemyTanks[id].node);
            delete GameDataModel._enemyTanks[id];
            this._idGenerator.returnID(id);
        }
    }

    //获取下次生成的坦克类型
    getNextTankName(): string {
        return GameLogicModel.getRandomArrayValueWithWeight(GameDef.EnemyTankNames, this._diffcultyData["EnemyNumWeight"]);
    }

    //获取下次生成的坦克位置
    getNextTankPositon(): GameStruct.RcInfo {
        const index2pos = [
            GameDef.BORN_PLACE_ENAMY1,
            GameDef.BORN_PLACE_ENAMY2,
            GameDef.BORN_PLACE_ENAMY3,
        ]

        //依次寻找可用的出生位置
        for (let i = 0; i < GameDef.ENEMY_BORN_PLACE_COUNT; i++) {
            let rc = index2pos[this._bornPlaceIndex];
            this.incBornPlaceIndex();

            let pos = GameDataModel.matrixToScenePosition(rc);
            let tankWidth = GameDataModel.getTankWidth();
            let bornArea: GameStruct.BigRect = new GameStruct.BigRect(pos.x, pos.y, tankWidth, tankWidth);
            if (!GameDataModel.hasTankInRect(bornArea)) {
                return rc;
            }
        }

        return null;
    }

    //获取下次生成的坦克是否为红色
    getNextTankRed(): boolean {
        //先简单处理，使用随机类型。后续可通过设置关卡难度，设置复杂情况。
        return GameLogicModel.isInProbability(0.3);
    }

    incBornPlaceIndex() {
        this._bornPlaceIndex++;
        if (this._bornPlaceIndex >= GameDef.ENEMY_BORN_PLACE_COUNT) {
            this._bornPlaceIndex = 0;
        }
    }

    //添加一名敌军坦克
    addOneEnemy() {
        let tankName = this.getNextTankName();
        let pos = this.getNextTankPositon();
        let bRed = this.getNextTankRed();

        if (tankName && pos) {
            this.createEnemyTank(tankName, pos, bRed);

            gameController.node.emit(EventDef.EV_DISPLAY_UPDATE_ENEMY_LIFE);
        }
    }

    isNeedCreateEnemy(): boolean {
        let aliveNum = GameDataModel.getEnemyAliveNum();
        if ((aliveNum < this._diffcultyData["EnemyMaxAliveNum"])
            && (GameDataModel.getEnemyDeadTotalNum() + aliveNum < this._diffcultyData["EnemyTotalNum"])) {
            return true;
        }
        return false;
    }

    isGameEnd() {
        if (GameDataModel.getEnemyDeadTotalNum() >= this._diffcultyData["EnemyTotalNum"]) {
            return true;
        }

        return false;
    }

    onEnemyAdd() {
        //尝试生成一名敌人
        if (this._diffcultyData && this.isNeedCreateEnemy()) {
            this.addOneEnemy();
        }
    }

    onEnemyBehavior() {
        CommonFunc.travelMap(GameDataModel._enemyTanks, (id: number, enemy: EnemyTank) => {
            enemy.onBehaviorTimer();
        })
    }

    evAiOperation() {
        let time = GameLogicModel.getLogicTime();

        //定时生成AI
        if (this._enemyAddTime + ENEMY_ADD_INTERVAL <= time) {
            this.onEnemyAdd();
            this._enemyAddTime = time;
        }

        //定时触发行为
        if (this._enemyBehaviorTime + ENEMY_BEHAVIOR_INTERVAL <= time) {
            this.onEnemyBehavior();
            this._enemyBehaviorTime = time;
        }
    }

    evLogicUpdate(dt: Big) {
        CommonFunc.travelMap(GameDataModel._enemyTanks, (id: number, enemy: EnemyTank) => {
            enemy.onLogicUpdate(dt);
        })
    }

    evLogicLateUpdate() {
        CommonFunc.travelMap(GameDataModel._enemyTanks, (id: number, enemy: EnemyTank) => {
            enemy.onLogicLateUpdate();
        })
    }

    evLogicLastFrameEvent() {
        CommonFunc.travelMap(GameDataModel._enemyTanks, (id: number, enemy: EnemyTank) => {
            enemy.onLogicLastFrameEvent();
        })
    }
}