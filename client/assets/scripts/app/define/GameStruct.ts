export namespace GameStruct {
    export class RcInfo {
        col: number;
        row: number;

        constructor(col: number, row: number) {
            this.col = col;
            this.row = row;
        }

        static sum(rcInfo1: RcInfo, rcInfo2: RcInfo): RcInfo {
            return new RcInfo(rcInfo1.col + rcInfo2.col, rcInfo1.row + rcInfo2.row);
        }

        /**
         * 乘以倍数
        */
        static multiply(rcInfo: RcInfo, multiple: number): RcInfo {
            let row = Math.floor(rcInfo.row * multiple);
            let col = Math.floor(rcInfo.col * multiple);
            return new GameStruct.RcInfo(col, row);
        }

        equal(rcInfo: RcInfo) {
            if (rcInfo) {
                if (this.col === rcInfo.col && this.row === rcInfo.row) {
                    return true;
                }
            }
            return false;
        }

        //将放大后的行列坐标映射到实际场景行列坐标
        multiplySelf(multiple: number) {
            if (typeof multiple === "number" ) {
                this.row = Math.floor(this.row * multiple);
                this.col = Math.floor(this.col * multiple);
            }
        }
    }

    //坦克属性，对应TankData.json配置
    export class TankAttributes {
        tankName: string;
        imgName: string; 
        team: number;
        maxLevel: number;
        moveSpeed: number;
        bulletSpeed: number;
        bulletType: number;
        bulletPower: number;
        maxBulletNum: number;
    }

    export class ShootInfo {
        type: number;         //子弹类型，对应不同的资源
        shooterID: number;    //射击者编号
        powerLevel: number;   //威力等级
        team: number;         //所属队伍
        pos: cc.Vec2;         //起始位置
        direction: number;    //方向
        speed: number;        //速度
    }

    export class AniParam {
        scriptName: string;
        params: any;
    }

    export class AniInfo {
        node: cc.Node;
        mode: number; //动画模式
        type: number;
        time: number; //动画为定时模式时需要持续的时间

        startCallback: Function;  //动画播放回调
        endCallback: Function;    //动画结束回调（正常结束才回调，调用Stop函数不触发）

        aniID: number;            //动画id

        param: AniParam;          //参数，用于初始动画预制体绑定脚本
    }

    export class AniCallback {
        stopFunction: Function;   //停止函数
        pauseFunction: Function;  //暂停函数
        resumeFunction: Function; //恢复函数
    }

    export class HitScope {
        up: number;
        down: number;
        left: number;
        right: number;
    }

    export class HitInfo {
        pos: RcInfo;          //命中位置
        scope: HitScope;      //范围
        power: number;        //威力
    }

    export class PlayerResultInfo {
        totolScore: number;
        bonusScore: number;
        totalTankNum: number;
        tankNum: number[];
        tankScore: number[];
    }

    export class GameResultInfo {
        stage: number;
        highScore: number;
        playerResult: PlayerResultInfo[];
    }

    export class AudioInfo {
        audioID: number;
    }

    export class GameRectInfo {
        group: string;
        type: number;
        rect: cc.Rect;
    }

    export class ShootNumInfo {
        LightTank: number;
        RapidMoveTank: number;
        RapidFireTank: number;
        HeavyTank: number;
    }

    export class PlayerInfo {
        no: number; //编号 
        userID: number; //用户ID
        ready: boolean; //准备状态
        
        //游戏信息
        liveStatus: boolean; //生存状态
        lifeNum: number; //生命数量
        shootNumInfo: ShootNumInfo; //击败信息
        propNum: number; //获得道具数量
        totalScore: number; //总分数
        level: number; //坦克等级
    }

    export class GameKeyInfo {
        status: number;
        record: number;
    }

    export class PlayerOperation {
        playerNO: number;

        direction: GameKeyInfo;
        ok: GameKeyInfo;
        cancel: GameKeyInfo;
    }
}