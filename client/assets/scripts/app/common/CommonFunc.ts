import AudioModel from "../model/AudioModel";
import protobuf = require("../../packages/protobufjs/pb_minimal");
import Toast from "../component/common/Toast";
import { google } from "../network/proto/basereq";
import SureDialog from "../component/common/SureDialog";
import ChooseDialog from "../component/common/ChooseDialog";

export default class CommonFunc {
    static copyObject(object): any {
        return JSON.parse(JSON.stringify(object));
    }

    static playButtonSound() {
        AudioModel.playSound("sound/btn_click");
    }

    static isBitSet(srcBit, dstBit): boolean {
        if ((srcBit & dstBit) === dstBit) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * 生成多维数组，没有参数时生层空一维数组，每多一个参数增加一个维度。
     * @param arg 
     */
    static createArray(...arg: number[]) {
        let ret: any = [];
        let arrays: any[][] = [];
        arrays.push(ret);
        for (let num of arg) {
            if (num > 0) {
                let temp = [];
                for (let array of arrays) {
                    for (let i = 0; i < num; i++) {
                        array.push([]);
                        temp.push(array[i]);
                    }
                }
                arrays = temp;
            }
            else {
                break;
            }
        }
        return ret;
    }

    /**
     * 生成区间内的随机整数，包含上下限
     * @param min 
     * @param max 
     */
    static getRandomInteger(min, max): number {
        return Math.floor(this.getRandomNumber(min, max));
    }

    /**
     * 生成区间内的随机数，包含上下限
     * @param min 
     * @param max 
     */
    static getRandomNumber(min, max): number {
        return Math.random() * (max - min + 1) + min;
    }

    /**
     * 随机返回数组中的一个元素
     * @param ary 数组
     */
    static getRandomArrayValue(ary: any[]): any {
        if (ary.length > 0) {
            let selectIndex = this.getRandomInteger(0, ary.length - 1);
            return ary[selectIndex];
        }
    }

    /**
     * 随机返回数组中的一个元素
     * @param ary 数组
     * @param weights 权值
     */
    static getRandomArrayValueWithWeight(ary: any[], weights: number[]): any {
        if (ary.length <= weights.length) {
            let total = this.SumArray(weights);
            let value = Math.random() * total;
            
            let currLine = 0;
            for (let i = 0; i < weights.length; i++) {
                currLine += weights[i];
                if (value < currLine) {
                    return ary[i];
                }
            }
        }
        return null;
    }

    /**
     * 是否触发给定概率
     * @param rate 0-1的概率
     */
    static isInProbability(rate: number): boolean {
        if (Math.random() < rate) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * 遍历map
     * @param map 
     * @param travelFunc 遍历方法，返回值为true退出循环
     */
    static travelMap(map, travelFunc) {
        if (map) {
            for (let key of Object.keys(map)) {
                if (travelFunc(key, map[key])) {
                    break;
                }
            }
        }
    }

    /**
     * 获取map的大小
     * @param map 
     */
    static getMapSize(map) {
        if (map) {
            return Object.keys(map).length;
        }
        
        return 0;
    }

    /**
     * 删除源数组中与给定的值相等的元素
     * @param srcAry 源数组
     * @param filterValues 包含删除值的数组
     */
    static filterArray(srcAry: any[], filterValues: any[]) {
        for(let i = srcAry.length - 1; i >= 0; i--) {
            for (let value of filterValues) {
                if (srcAry[i] === value) {
                    srcAry.splice(i, 1);
                }
            }
        }
    }

    static SumArray(ary: any[]) {
        let total = null;
        for (let it of ary) {
            if (total) {
                total += it;
            }
            else {
                total = it;
            }
        }

        return total;
    }

    static getTimeStamp(): number {
        return new Date().getTime();
    }

    static pbEncode(obj: any, pbHandler: any): ArrayBuffer {
        let msg = pbHandler.create(obj);
        let dataEncode = pbHandler.encode(msg).finish();
        return dataEncode;
    }

    static pbDecode(buf: ArrayBuffer, pbHandler: any): any {
        let dataDecode = pbHandler.decode(buf);
        return dataDecode;
    }

    static pbObjectToAny(obj:any, pbHandler: any, typeUrl: string) {
        let dataEncode = CommonFunc.pbEncode(obj, pbHandler);
        let dataAny = google.protobuf.Any.create({
            type_url: "type.googleapis.com/" + typeUrl,
            value: new Uint8Array(dataEncode),
        });
        return dataAny;
    }

    static pbAnyToObject(pbAnyData: google.protobuf.Any, pbHandler: any) {
        return CommonFunc.pbDecode(pbAnyData.value, pbHandler);
    }

    /**
     * Toast提示
     * @param tipString 提示字符
     * @param time 停留时间
     */
    static showToast(tipString:string, time: number) {
        cc.loader.loadRes("prefab/Toast", (error, pfb) => {
            if (!error) {
                let root = cc.director.getScene().getChildByName("Canvas");
                let node = cc.instantiate(pfb);
                if (root && node) {
                    node.getComponent(Toast).init({
                        tipString: tipString,
                        time: time,
                    })
                    root.addChild(node, 10000);
                    node.y = -10;
                }
            }
        });
    }

    /**
     * 确定框
     * @param tipString 提示文字
     * @param callback 确定回调
     */
    static showSureDialog(tipString:string, callback: Function) {
        cc.loader.loadRes("prefab/SureDialog", (error, pfb) => {
            if (!error) {
                let root = cc.director.getScene().getChildByName("Canvas");
                let node = cc.instantiate(pfb);
                if (root && node) {
                    root.addChild(node, 10000);
                    node.getComponent(SureDialog).showDialog({tipString: tipString, callback: callback});
                    node.y = -10;
                }
            }
        });
    }

    /**
     * 选择框
     * @param tipString 提示文字
     * @param sureString 确定按钮文字
     * @param sureCallback 确定回调
     * @param cancelString 取消按钮文字
     * @param cancelCallback 取消回调
     */
    static showChooseDialog(tipString:string, sureString:string, sureCallback: Function, cancelString:string, cancelCallback: Function) {
        cc.loader.loadRes("prefab/ChooseDialog", (error, pfb) => {
            if (!error) {
                let root = cc.director.getScene().getChildByName("Canvas");
                let node = cc.instantiate(pfb);
                if (root && node) {
                    root.addChild(node, 10000);
                    node.getComponent(ChooseDialog).showDialog({
                        tipString: tipString,
                        sureString: sureString,
                        sureCallback: sureCallback,
                        cancelString: cancelString,
                        cancelCallback: cancelCallback,
                    });
                    node.y = -10;
                }
            }
        });
    }

    static excuteCallback(callback: Function, ...params) {
        if (callback) {
            return callback(...params);
        }
    }
}