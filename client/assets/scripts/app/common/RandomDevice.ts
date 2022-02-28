import Big, { BigSource } from "../../packages/bigjs/Big";
import CommonFunc from "./CommonFunc";

export default class RandomDevice {
    private _seed: Big = Big(CommonFunc.getTimeStamp());

    setSeed(seed: BigSource) {
        this._seed = Big(seed);
    }

    //随机数[0,1)
    randomNumber(): Big {
        this._seed = this._seed.mul(9301).add(49297).mod(233280)
        return this._seed.div(233280.0);//((seed * 9301 + 49297 ) % 233280)/233280.0
    }

    /**
     * 生成区间内的随机数，包含上下限
     * @param min 
     * @param max 
     */
    getRandomNumber(min: number, max: number): Big {
        return this.randomNumber().mul(Big(max).sub(min)).add(min);//random * (max - min) + min;
    }

    /**
     * 生成区间内的随机整数，包含上下限
     * @param min 
     * @param max 
     */
    getRandomInteger(min: number, max: number): number {
        return Math.floor(this.randomNumber().mul(Big(max).sub(min).plus(1)).add(min).toNumber());//floor(random * (max - min + 1) + min);
    }
}