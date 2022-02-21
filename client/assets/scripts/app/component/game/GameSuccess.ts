import { GameDef } from "../../define/GameDef";
import AudioModel from "../../model/AudioModel";
import GameDataModel from "../../model/GameDataModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameSuccess extends cc.Component {
    @property({ displayName: "最高分文本", type: cc.Label})
    textHigh: cc.Label = null;

    @property({ displayName: "本次得分文本", type: cc.Label})
    textScore: cc.Label = null;

    onLoad() {
        this.showHighScore();
        this.showScore();

        AudioModel.playMusic("sound/victory" ,true)
    }

    showHighScore() {
        let score = GameDataModel.getHighScore();
        let textScore = `最高分：${score}`;
        this.textHigh.string = textScore;
    }

    showScore() {
        let total = 0;
        for (let i = 0; i < GameDef.GAME_TOTAL_PLAYER; i++) {
            let playerInfo = GameDataModel.getPlayerInfo(i);
            total += playerInfo.totalScore;
        }

        let textScore = `本次得分：${total}`;
        this.textScore.string = textScore;
    }
}