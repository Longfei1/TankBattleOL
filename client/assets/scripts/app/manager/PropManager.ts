import { gameController } from "../component/game/Game";
import { EventDef } from "../define/EventDef";
import Prop from "../component/game/Prop";
import { GameStruct } from "../define/GameStruct";
import { GameDef } from "../define/GameDef";
import CommonFunc from "../common/CommonFunc";
import GameDataModel from "../model/GameDataModel";
import PlayerTank from "../component/game/tank/PlayerTank";
import AudioModel from "../model/AudioModel";
import GameLogicModel from "../model/GameLogicModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PropManager extends cc.Component {
    @property({ displayName: "道具层", type: cc.Node })
    panelProp: cc.Node = null;

    @property({ displayName: "道具预制体", type: cc.Prefab })
    pfbProp: cc.Node = null;

    _nodeProp: cc.Node = null;

    _staticTime: number = 0;
    _homeProtectTime: number = 0;

    onLoad() {
        this._nodeProp = cc.instantiate(this.pfbProp);
        this._nodeProp.getComponent(Prop).reset();

        this.initListener();
    }

    reset() {
        GameDataModel._propBuff = 0;
        if (GameDataModel._prop && cc.isValid(GameDataModel._prop.node)) {
            GameDataModel._prop.reset();
            GameDataModel._prop.node.removeFromParent();
        }
        
        GameDataModel._prop = null;
        this.removeTimers();
    }

    onDestroy() {
        this.removeListener();

        this.removeTimers();
    }

    initListener() {
        if (!GameDataModel.isModeEditMap()) {
            gameController.node.on(EventDef.EV_PROP_CREATE, this.evCreateProp, this);
            gameController.node.on(EventDef.EV_PROP_DESTROY, this.evDestroyProp, this);
            gameController.node.on(EventDef.EV_PROP_GAIN, this.evGainProp, this);

            gameController.node.on(EventDef.EV_GAME_PREPARE_GAME, this.evPrepareGame, this);
            gameController.node.on(EventDef.EV_GAME_STARTED, this.evGameStarted, this);
            gameController.node.on(EventDef.EV_GAME_ENDED, this.evGameEnd, this);

            GameLogicModel.addEventListener(EventDef.EV_GL_LAST_FRAME_EVENT, this.evLogicLastFrameEvent, this);
        }
    }

    removeListener() {
        GameLogicModel.removeEventListenerByContext(this);
    }

    evCreateProp() {
        if (GameDataModel._prop) {
            GameDataModel._prop.reset();
            GameDataModel._prop.node.removeFromParent();
        }

        GameDataModel._prop = null;

        let type = this.getRandomPropType();
        let pos = this.getRandomPropPosition()

        console.log("create prop, pos:", type, "pos:", pos);
        if (type != null && pos) {
            AudioModel.playSound("sound/prop_1");

            GameDataModel._prop = this._nodeProp.getComponent(Prop);
            this.panelProp.addChild(this._nodeProp);

            //随机产生一个道具

            GameDataModel._prop.setType(type);
            GameDataModel._prop.setLogicPosition(pos, true);
            GameDataModel._prop.setTime(GameDef.PROP_SHOW_TIME);
        }
    }

    evDestroyProp() {
        if (GameDataModel._prop) {
            GameDataModel._prop.reset();
            GameDataModel._prop.node.removeFromParent();
        }
        GameDataModel._prop = null;
    }

    evGainProp(playerNode: cc.Node) {
        if (GameDataModel._prop && playerNode) {
            let type = GameDataModel._prop._type;
            let playerTank = playerNode.getComponent(PlayerTank);
            let playerInfo = GameDataModel.getPlayerInfo(playerTank.id);

            switch(type) {
                case GameDef.PropType.BOMB:
                    //炸弹
                    AudioModel.playSound("sound/prop_1");
                    gameController.node.emit(EventDef.EV_PROP_BOMB, playerTank.id);
                    break;
                case GameDef.PropType.STAR:
                    //五角星
                    AudioModel.playSound("sound/prop_1");
                    playerTank.onLevelUp();
                    break;
                case GameDef.PropType.TANK:
                    //坦克
                    AudioModel.playSound("sound/prop_2");
                    playerInfo.lifeNum++;
                    gameController.node.emit(EventDef.EV_DISPLAY_UPDATE_PLAYER_LIFE);
                    break;
                case GameDef.PropType.HELMET:
                    //头盔
                    AudioModel.playSound("sound/prop_1");
                    playerTank.onGetShieldStatus(GameDef.PROP_SHIELD_INVINCIBLE_TIME);
                    break;
                case GameDef.PropType.CLOCK:
                    //定时
                    AudioModel.playSound("sound/prop_1");
                    this.onPropClockStart(GameDef.PROP_CLOCK_TIME);
                    break;
                case GameDef.PropType.SPADE:
                    //铲子
                    AudioModel.playSound("sound/prop_2");
                    this.onPropSpadeStart(GameDef.PROP_SPADE_TIME);
                    break;
                case GameDef.PropType.GUN:
                    //手枪
                    AudioModel.playSound("sound/prop_2");
                    if (playerTank._tankLevel < playerTank._tankMaxLevel) {
                        playerTank.onMaxLevel();
                    }
                    else {
                        //满级再吃手枪，加生命数量
                        playerInfo.lifeNum++;
                        gameController.node.emit(EventDef.EV_DISPLAY_UPDATE_PLAYER_LIFE);
                    }
                    break;
                default:
                    break;
            }

            playerInfo.propNum++;
            gameController.playGainScoreAni(GameDataModel._prop.node.getPosition(), GameDef.PROP_BONUS_SCORE);
        }
    }

    evPrepareGame() {
        this.reset();
    }

    evGameStarted() {
        this.startTimers();
    }

    evGameEnd() {
        this.removeTimers();
    }

    getRandomPropPosition(): GameStruct.RcInfo {
        let posAry = GameDataModel.getEmptyMatrixArray(4, 4, [GameDef.SceneryType.GRASS, GameDef.SceneryType.WALL, GameDef.SceneryType.ICE]);
        if (posAry.length > 0) {
            return GameLogicModel.getRandomArrayValue(posAry);
        }
        return null;
    }

    getRandomPropType(): number {
        let propAary = [
            GameDef.PropType.BOMB,
            GameDef.PropType.CLOCK,
            GameDef.PropType.HELMET,
            GameDef.PropType.SPADE,
            GameDef.PropType.STAR,
            GameDef.PropType.TANK,
            GameDef.PropType.GUN,
        ];

        let weights = [8, 8, 10, 10, 10, 8, 5]
        return GameLogicModel.getRandomArrayValueWithWeight(propAary, weights);
    }

    startPropStatusTimer() {
        GameLogicModel.schedule(()=>{
            let buff = GameDataModel._propBuff;
            if (CommonFunc.isBitSet(buff, GameDef.PROP_BUFF_STATIC)) {
                if (this._staticTime > 0) {
                    this._staticTime--;
                }
                else {
                    this.onPropClockStop();
                }
            }

            if (CommonFunc.isBitSet(buff, GameDef.PROP_BUFF_HOME_PROTECT)) {
                if (this._homeProtectTime > 0) {
                    if (this._homeProtectTime === GameDef.PROP_SPADE_EFFECT_DISAPPEAR_TIME) {
                        this.onPropSpadeCountDown();
                    }
                    this._homeProtectTime--;
                }
                else {
                    this.onPropSpadeStop();
                }
            }
        }, this, 1);
    }

    onPropClockStart(time: number) {
        GameDataModel._propBuff |= GameDef.PROP_BUFF_STATIC;
        this._staticTime = time;
    }
    
    onPropClockStop() {
        GameDataModel._propBuff &= ~GameDef.PROP_BUFF_STATIC;
    }

    onPropSpadeStart(time: number) {
        GameDataModel._propBuff |= GameDef.PROP_BUFF_HOME_PROTECT;
        this._homeProtectTime = time;

        gameController.node.emit(EventDef.EV_PROP_SPADE_START);
    }

    onPropSpadeCountDown() {
        gameController.node.emit(EventDef.EV_PROP_SPADE_COUNT_DOWN);
    }
    
    onPropSpadeStop() {
        GameDataModel._propBuff &= ~GameDef.PROP_BUFF_HOME_PROTECT;
        gameController.node.emit(EventDef.EV_PROP_SPADE_END);
    }

    startTimers() {
        this.startPropStatusTimer();
    }

    removeTimers() {
        GameLogicModel.unscheduleAll(this);
    }

    evLogicLastFrameEvent() {
        if (GameDataModel._prop) {
            GameDataModel._prop.onLogicLastFrameEvent();
        }
    }
 }