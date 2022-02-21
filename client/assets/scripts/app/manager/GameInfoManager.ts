import { gameController } from "../component/game/Game";
import { EventDef } from "../define/EventDef";
import { GameDef } from "../define/GameDef";
import GameConfigModel from "../model/GameConfigModel";
import GameDataModel from "../model/GameDataModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameInfoManager extends cc.Component {
    @property({ displayName: "游戏信息节点", type: cc.Node })
    panelInfo: cc.Node = null;

    @property({ displayName: "敌军剩余坦克图标", type: [cc.Node] })
    enemyLifes: cc.Node[] = [];

    @property({ displayName: "玩家信息节点", type : [cc.Node] })
    playerInfos: cc.Node[] = [];

    @property({ displayName: "玩家生命数量", type: [cc.Label] })
    textPlayerLife: cc.Label[] = [];

    @property({ displayName: "关卡数", type: cc.Label })
    textStage: cc.Label = null;

    onLoad() {
        this.initListener();

        if (!GameDataModel.isModeEditMap()) {
            this.updateView();
            this.panelInfo.active = true;
        }
        else {
            this.panelInfo.active = false;
        }
    }

    initListener() {
        if (!GameDataModel.isModeEditMap()) {
            gameController.node.on(EventDef.EV_GAME_PREPARE_GAME, this.evGamePrepare, this);

            gameController.node.on(EventDef.EV_DISPLAY_UPDATE_PLAYER_LIFE, this.evPlayerLifeUpdated, this);
            gameController.node.on(EventDef.EV_DISPLAY_UPDATE_ENEMY_LIFE, this.evEenmyLifeUpdated, this);
        }
    }
    
    onDestroy() {
        this.removeListener();
    }

    removeListener() {

    }

    evGamePrepare() {
        this.updateView();
    }

    evPlayerLifeUpdated() {
        this.updatePlayerLife();
    }
    
    evEenmyLifeUpdated() {
        this.updateEnemyLife();
    }

    updateView() {
        this.updateEnemyLife();
        this.updatePlayerLife();
        this.updateStage();
    }

    updateEnemyLife() {
        let leftNum = GameDataModel.getEnemyLeftNum();

        for (let i = 0; i < this.enemyLifes.length; i++) {
            if (i < leftNum) {
                this.enemyLifes[i].active = true;
            }
            else {
                this.enemyLifes[i].active = false;
            }
        }
    }

    updatePlayerLife() {
        if (GameDataModel.isModeDoublePlayer()) {
            this.playerInfos[1].active = true;
        }
        else {
            this.playerInfos[1].active = false;
        }

        for (let i = 0; i < this.textPlayerLife.length; i++) {
            let playerInfo = GameDataModel.getPlayerInfo(i);
            this.textPlayerLife[i].string = playerInfo.lifeNum.toString();
        }
    }

    updateStage() {
        let stage = GameDataModel._currStage;
        this.textStage.string = stage.toString();
    }
}