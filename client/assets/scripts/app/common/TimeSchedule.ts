import Big from "../../packages/bigjs/Big";
import GameLogicModel from "../model/GameLogicModel";
import CommonFunc from "./CommonFunc";
import UniqueIdGenerator from "./UniqueIdGenerator";

export default class TimeSchedule {
    private _task: ScheduleTask[] = [];

    private _idGenerator: UniqueIdGenerator = new UniqueIdGenerator(999999);

    /**
     * 定时任务
     * @param callback 
     * @param context 
     * @param interval 时间间隔（毫秒）
     * @returns 
     */
    schedule(callback: Function, context: any, interval: number): number {
        let id = this._idGenerator.generateID();
        this._task.push({
            id: id,
            callback: callback,
            context: context,
            startTime: GameLogicModel.getLogicTime(),
            loop: true,
            interval: interval,
        })
        return id;
    }

    /**
     * 单次定时任务
     * @param callback 
     * @param context 
     * @param interval 时间间隔（毫秒）
     * @returns 
     */
    scheduleOnce(callback: Function, context: any, interval: number): number {
        let id = this._idGenerator.generateID();
        this._task.push({
            id: id,
            callback: callback,
            context: context,
            startTime: GameLogicModel.getLogicTime(),
            loop: false,
            interval: interval,
        })
        return id;
    }

    /**
     * 根据id取消定时任务
     * @param id 
     */
    unschedule(id: number) {
        for (let i = 0; i < this._task.length; i++) {
            if (this._task[i].id === id) {
                this._idGenerator.returnID(id);
                this._task.splice(i, 1);
                break;
            }
        }
    }

    /**
     * 取消一个上下文的所有定时任务
     * @param context
     */
    unscheduleAll(context: any) {
        for (let i = this._task.length - 1; i >= 0; i--) {
            if (this._task[i].context === context) {
                this._idGenerator.returnID(this._task[i].id);
                this._task.splice(i, 1);
            }
        }
    }

    /**
     * 定时调用，以触发定时处理
     */
    onTimer() {
        let t = GameLogicModel.getLogicTime();
        let temp: ScheduleTask[] = [];
        for (let i = this._task.length - 1; i >= 0; i--) {
            if (this._task[i].startTime + this._task[i].interval <= t) {
                temp.push(this._task[i]);
                this._task[i].startTime = t;

                if (!this._task[i].loop) {
                    this._idGenerator.returnID(this._task[i].id);
                    this._task.splice(i, 1);
                }
            }
        }

        //执行
        for (let i = 0; i < temp.length; i++) {
            temp[i].callback.call(temp[i].context);
        }
    }

    //清空定时任务
    clear() {
        this._task = [];
        this._idGenerator.reset();
    }
}

class ScheduleTask {
    id: number = null;
    callback: Function = null;//回调函数
    context: any = null;//上下文
    startTime: number = 0;//开始时间
    loop: boolean = false;//循环
    interval: number = 0;//时间间隔
}