import { GameDef } from "../../../define/GameDef";
import { GameStruct } from "../../../define/GameStruct";
import AudioModel from "../../../model/AudioModel";
import GameDataModel from "../../../model/GameDataModel";
import GameLogicModel from "../../../model/GameLogicModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerResult extends cc.Component {
    @property({ displayName: "总分", type: cc.Label })
    textTotalScore: cc.Label = null;

    @property({ displayName: "坦克数量", type: [cc.Label] })
    textTankNum: cc.Label[] = [];

    @property({ displayName: "坦克得分", type: [cc.Label] })
    textTankScore: cc.Label[] = [];

    @property({ displayName: "坦克总数量", type: cc.Label })
    textTankTotalNum: cc.Label = null;

    @property({ displayName: "奖励分", type: cc.Label })
    textBonusScore: cc.Label = null;

    _playerNO: number;
    _resultInfo: GameStruct.PlayerResultInfo = null;

    setData(no: number, playerResult: GameStruct.PlayerResultInfo) {
        this._playerNO = no;
        this._resultInfo = playerResult;

        this.showPlayerTotalScore();
        this.showBonusScore();
    }

    //得分动画
    showTankScoreAni(enemyTankNO, callback: Function) {
        let actions = [];

        //添加显示一行分数所需的动画
        let totoalNum = this._resultInfo.tankNum[enemyTankNO];
        let totoalScore = this._resultInfo.tankScore[enemyTankNO];

        let avgScore = totoalScore / totoalNum;

        let showNum = 0;
        let showScore = 0;

        let anis = [];
        let putAni = (aniFunc: Function, dealy: number = 0) => {
            anis.push({dealy: dealy, aniFunc: aniFunc});
        }

        //显示分数条
        putAni(() => {
            this.textTankNum[enemyTankNO].node.active = true;
            this.textTankScore[enemyTankNO].node.active = true;

            this.playScoreSound();
            this.textTankNum[enemyTankNO].string = showNum.toString();
            this.textTankScore[enemyTankNO].string = showScore.toString();
        }, 0.15);

        //分数增加
        let addScoreFunc = () => {
            showNum++;
            showScore += avgScore;

            this.playScoreSound();
            this.textTankNum[enemyTankNO].string = showNum.toString();
            this.textTankScore[enemyTankNO].string = showScore.toString();
        };
        for (let i = 0; i < totoalNum; i++) {
            putAni(addScoreFunc, 0.15);
        }
    
        //结束回调
        putAni(() => {
            if (typeof callback === "function") {
                callback(enemyTankNO);
            }
        }, 0.5);

        let playFunc;
        playFunc = () => {
            if (anis.length > 0) {
                let ani = anis[0];
                anis.splice(0, 1);

                if (ani.dealy > 0) {
                    GameLogicModel.scheduleOnce(() => {
                        if (ani.aniFunc) {
                            ani.aniFunc();
                        }
                        playFunc();
                    }, this, ani.dealy);
                }
                else {
                    if (ani.aniFunc) {
                        ani.aniFunc();
                    }
                    playFunc();
                }
            }
        };

        playFunc();//开始动画
    }

    showBonusScore() {
        let score = this._resultInfo.bonusScore;
        this.textBonusScore.string = score.toString();
    }

    showPlayerTotalScore() {
        let score = this._resultInfo.totolScore;
        this.textTotalScore.string = score.toString();
    }

    showTankTotalNum() {
        let num = this._resultInfo.totalTankNum;
        this.textTankTotalNum.string = num.toString();
    }

    playScoreSound() {
        AudioModel.playSound("sound/score");
    }

    onDestroy() {
        GameLogicModel.unscheduleAll(this);
    }
}