import { GameStruct } from "../define/GameStruct";
import GameLogicModel from "../model/GameLogicModel";

export default class GameOpeControl {
    private keyInfo: GameStruct.GameKeyInfo;

    private firstEffectTime: number;//第一次生效时间(毫秒)
    private firstEffectInterval: number;//第一次生效间隔(毫秒)
    private lastEffectTime: number;//上一次生效时间(毫秒)
    private effectInterval: number;//生效间隔(毫秒)

    /**
     * 
     * @param firstInterval 单位（秒）
     * @param interval 单位（秒）
     */
    constructor(firstInterval: number, interval: number) {
        this.firstEffectTime = 0;
        this.firstEffectInterval = GameLogicModel.secondToMillisecond(firstInterval);
        this.lastEffectTime = 0;
        this.effectInterval = GameLogicModel.secondToMillisecond(interval);
    }

    static getInputCode(info: GameStruct.GameKeyInfo): number {
        if (info) {
            if (info.status > 0) {
                return info.status;
            }
            if (info.record > 0) {
                return info.record;
            }
        }
        return 0;
    }

    effectInput(info: GameStruct.GameKeyInfo): boolean {
        let lastCode = GameOpeControl.getInputCode(this.keyInfo);
        let curCode = GameOpeControl.getInputCode(info);

        if (curCode > 0) {
            let currTime = GameLogicModel.getLogicTime();
            let bEffect = currTime - this.lastEffectTime >= this.effectInterval;

            if ((lastCode === 0 || (lastCode > 0 && lastCode !== curCode))) {
                //新操作
                this.firstEffectTime = currTime;
            }
            else {
                //重复操作
                if (info.record > 0) {
                    this.firstEffectTime = currTime;
                }
                else {
                    if (currTime - this.firstEffectTime < this.firstEffectInterval) {
                        bEffect = false;
                    }
                }
            }
            
            if (bEffect) {
                this.lastEffectTime = currTime;
            }
            this.keyInfo = info;

            return bEffect;
        }
        else {
            this.firstEffectTime = 0;
            this.lastEffectTime = 0;
            this.keyInfo = null;
        }

        return false;
    }
}