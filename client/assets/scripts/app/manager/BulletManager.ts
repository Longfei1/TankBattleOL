import Big from "../../packages/bigjs/Big";
import CommonFunc from "../common/CommonFunc";
import NodePool from "../common/NodePool";
import UniqueIdGenerator from "../common/UniqueIdGenerator";
import Bullet from "../component/game/Bullet";
import { gameController } from "../component/game/Game";
import { EventDef } from "../define/EventDef";
import { GameStruct } from "../define/GameStruct";
import GameDataModel from "../model/GameDataModel";
import GameLogicModel from "../model/GameLogicModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BulletManager extends cc.Component {
    @property({ displayName: "游戏层", type: cc.Node })
    panelGame: cc.Node = null;

    @property({ displayName: "子弹预制体", type: cc.Prefab })
    pfbBullet: cc.Prefab = null;

    _idGenerator: UniqueIdGenerator = new UniqueIdGenerator(999999); //10以内的id预留给玩家使用

    _bulletPool: NodePool = null;

    onLoad() {
        this.initListenner();

        this._bulletPool = new NodePool(this.pfbBullet, Bullet);
    }

    onDestroy() {
        this.removeListener();
        this._bulletPool.clearNode();
    }

    initListenner() {
        if (!GameDataModel.isModeEditMap()) {
            gameController.node.on(EventDef.EV_GAME_PREPARE_GAME, this.evPrepareGame, this);
            gameController.node.on(EventDef.EV_GAME_ENDED, this.evGameEnded, this);
            gameController.node.on(EventDef.EV_BULLET_CREATE, this.evCreateBullet, this);
            gameController.node.on(EventDef.EV_BULLET_DESTROY, this.evDestroyBullet, this);

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

        this.resetBullet();
    }

    resetBullet() {
        CommonFunc.travelMap(GameDataModel._bullets, (id:number, enemy: Bullet) => {
            if (cc.isValid(enemy.node)) {
                this._bulletPool.putNode(enemy.node);
            }
        })

        GameDataModel._bullets = {};
    }

    evPrepareGame() {
        this.reset();
    }

    evGameEnded() {
        
    }

    evCreateBullet(shootInfo: GameStruct.ShootInfo) { 
        if (shootInfo) {
            let bullet = this._bulletPool.getNode();
            let com = bullet.getComponent(Bullet);
            com.reset();
            com.id = this._idGenerator.generateID()
            com.setType(shootInfo.type);
            com._shooterID = shootInfo.shooterID;
            com._team = shootInfo.team;
            com._powerLevel = shootInfo.powerLevel;
            com.setLogicPosition(shootInfo.pos, true);
            com.setMove(shootInfo.speed, shootInfo.direction);
            this.panelGame.addChild(bullet);

            GameDataModel._bullets[com.id] = com;
        }
    }

    evDestroyBullet(id: number, shootID: number) {
        if (GameDataModel._bullets[id]) {
            this._bulletPool.putNode(GameDataModel._bullets[id].node);
            delete GameDataModel._bullets[id];
            this._idGenerator.returnID(id);

            gameController.node.emit(EventDef.EV_GAME_REDUCE_BULLET, shootID);
        }
    }

    evLogicUpdate(dt: Big) {
        CommonFunc.travelMap(GameDataModel._bullets, (id: number, bullet: Bullet) => {
            bullet.onLogicUpdate(dt);
        })
    }

    evLogicLateUpdate() {
        CommonFunc.travelMap(GameDataModel._bullets, (id: number, bullet: Bullet) => {
            bullet.onLogicLateUpdate();
        })
    }

    evLogicLastFrameEvent() {
        CommonFunc.travelMap(GameDataModel._bullets, (id: number, bullet: Bullet) => {
            bullet.onLogicLastFrameEvent();
        })
    }
}