import { GameDef } from "../define/GameDef";
import BaseModel from "./BaseModel";
import { GameStruct } from "../define/GameStruct";
import CommonFunc from "../common/CommonFunc";
import Scenery from "../component/game/Scenery";
import { GameConfig } from "../GameConfig";
import EnemyTank from "../component/game/tank/EnemyTank";
import PlayerTank from "../component/game/tank/PlayerTank";
import GameConfigModel from "./GameConfigModel";
import { gamereq } from "../network/proto/gamereq";
import Big from "../../packages/bigjs/Big";
import Bullet from "../component/game/Bullet";
import Prop from "../component/game/Prop";
import HomeBase from "../component/game/HomeBase";

class GameDataModel extends BaseModel {
    _playMode: number = -1;
    _menuPage: number = 0;
    _gameOver: boolean = false;
    _enableOperate: boolean = false;
    _gameMapData:  number[][] =  [];
    _mapUnit = {width: 0, height: 0};
    _useCustomMap: boolean = false;
    _currStage: number = 0;
    _localOpeCode: { [id: number] : number } = {};
    _lastGameFrame: gamereq.GameFrameNtf = null;

    _gotoMenuPage: number = -1;
    
    //关卡相关数据
    _scenerys: cc.Node[][] = [];
    _enemyTanks: { [id: number] : EnemyTank } = {};
    _playerTanks: { [id: number]: PlayerTank } = {};
    _bullets: { [id: number]: Bullet } = {};
    _prop: Prop = null;
    _homeBase: HomeBase = null;
    
    _propBuff: number = 0;
    _playerInfo: {[id: number] : GameStruct.PlayerInfo } = {};
    _gameRunning: boolean = false;
    _propDestroyEnemyNum: number = 0;

    //网络相关数据
    _netUserID: number = 0; //用户ID
    _netTimestamp: number = 0; //服务器时间戳
    _netRoomID: number = 0; //房间号
    _netPlayerNO: number = 0; //玩家编号
    _netRandomSeed: number = 0; //随机数种子
    _netFrameNO: number = -1; //帧编号

    initModel() {
        super.initModel();
        this.initGameMapData();
        this.initGameData();
    }

    initGameData() {
        this._enableOperate = false;

        this.initAllPlayerInfo()
        this.resetAllPlayerHallInfo();

        this.resetGameData();
    }

    initGameMapData() {
        this._gameMapData = this.createMapData();
    }

    resetGameData() {
        this._gameOver = false;
        //this._useCustomMap = false;
        this._currStage = 1;
        this._enableOperate = false;

        this._propBuff = 0;
        
        this.resetAllPlayerGameInfo();

        this._scenerys = [];
        this._enemyTanks = {};
        this._playerTanks = {};
        this._gameRunning = false;
        this._propDestroyEnemyNum = 0;
    }

    createMapData() {
        let mapData: number[][] = CommonFunc.createArray(GameDef.SCENERYS_NODE_COL_NUM);
        for (let x = 0; x < GameDef.SCENERYS_NODE_COL_NUM; x++) {
            for (let y = 0; y < GameDef.SCENERYS_NODE_ROW_NUM; y++) {
                mapData[x][y] = GameDef.SceneryType.NULL;
            }
        }
        return mapData;
    }

    clearGameMapData() {
        if (this._gameMapData) {
            for (let colArray of this._gameMapData) {
                if (colArray) {
                    for (let y = 0; y < colArray.length; y++) {
                        colArray[y] = GameDef.SceneryType.NULL;
                    }
                }
            }
        }
    }

    isModeEditMap() {
        if (this._playMode === GameDef.GAMEMODE_MAP_EDIT
            || this._playMode === GameDef.GAMEMODE_MAP_EDIT_ONLINE) {
            return true
        }
        return false
    }

    isModeDoublePlayer(): boolean {
        if (this._playMode === GameDef.GAMEMODE_DOUBLE_PLAYER) {
            return true;
        }
        return false;
    }

    isModeOnline(): boolean {
        if (this._playMode === GameDef.GAMEMODE_ONLINE_PLAY || this._playMode === GameDef.GAMEMODE_MAP_EDIT_ONLINE) {
            return true;
        }
        return false;
    }

    setMapUnit(width: number, height: number) {
        this._mapUnit.width = width;
        this._mapUnit.height = height;
    }

    getMapUnit() {
        return this._mapUnit;
    }

    set scenerys(scenerys: cc.Node[][]) {
        this._scenerys = scenerys;
    }

    get scenerys() {
        return this._scenerys;
    }

    //根据行列信息获取布景节点
    getSceneryNode(sceneryPos: GameStruct.RcInfo): cc.Node {
        if (sceneryPos && this.isValidSceneryPos(sceneryPos)) {
            if (this._scenerys[sceneryPos.col]) {
                return this._scenerys[sceneryPos.col][sceneryPos.row];
            }
        }
        return null;
    }

    getEnemyDeadTotalNum(): number {
        let total = 0;
        CommonFunc.travelMap(this._playerInfo[0].shootNumInfo, (name: string, num: number) => {
            total += num;
        })

        CommonFunc.travelMap(this._playerInfo[1].shootNumInfo, (name: string, num: number) => {
            total += num;
        })
        return total;
    }

    getEnemyAliveNum(): number {
        return CommonFunc.getMapSize(this._enemyTanks);
    }

    getEnemyLeftNum(): number {
        let diffcultyData = GameConfigModel.getDifficultyData(this._currStage);//本关卡难度数据
        let leftNum = diffcultyData["EnemyTotalNum"] - this.getEnemyDeadTotalNum() - this.getEnemyAliveNum();

        return leftNum;
    }

    initAllPlayerInfo() {
        this.initPlayerInfo(0);
        this.initPlayerInfo(1);
    }

    initPlayerInfo(no: number) {
        this._playerInfo[no] = {
            no: no,
            userID: 0,
            ready: false,
            
            //游戏信息
            liveStatus: false,
            lifeNum: 0,
            shootNumInfo: {
                LightTank: 0,
                RapidMoveTank: 0,
                RapidFireTank: 0,
                HeavyTank: 0,
            },
            propNum: 0,
            totalScore: 0,
            level: 0,
        }
    }

    //重置玩家大厅数据
    resetAllPlayerHallInfo() {
        this.resetPlayerHallInfo(0);
        this.resetPlayerHallInfo(1);
    }

    //重置玩家大厅数据
    resetPlayerHallInfo(no: number) {
        this._playerInfo[no].userID = 0;
        this._playerInfo[no].ready = false;
    }

    //重置玩家游戏数据
    resetAllPlayerGameInfo() {
        this.resetPlayerGameInfo(0);
        this.resetPlayerGameInfo(1);
    }

    //重置玩家游戏数据
    resetPlayerGameInfo(no: number) {
        this._playerInfo[no].liveStatus = true;
        this._playerInfo[no].lifeNum = GameDef.PLAYER_LIFE_NUM;
        this._playerInfo[no].totalScore = 0;
        this._playerInfo[no].level = 1;

        this.resetPlayerStageData(no);
    }

    //重置游戏关卡数据
    resetGameStageData() {
        this._propDestroyEnemyNum = 0;

        this.resetPlayerStageData(0);
        this.resetPlayerStageData(1);
    }

    //重置玩家关卡数据
    resetPlayerStageData(no: number) {
        this._playerInfo[no].propNum = 0;

        this._playerInfo[no].shootNumInfo.LightTank = 0;
        this._playerInfo[no].shootNumInfo.RapidMoveTank = 0;
        this._playerInfo[no].shootNumInfo.RapidFireTank = 0;
        this._playerInfo[no].shootNumInfo.HeavyTank = 0;
    }

    getPlayerInfo(no: number): GameStruct.PlayerInfo {
        return this._playerInfo[no];
    }

    /**
     * 将地图方格的行列转换为场景中的坐标值
     * @param RcInfo ,col为列，row为行
     */
    matrixToScenePosition(pos: GameStruct.RcInfo): GameStruct.BigPos {
        return new GameStruct.BigPos(pos.col * this._mapUnit.width, pos.row * this._mapUnit.height);
    }

    /**
     * 将场景坐标映射到包含该坐标的方格中，并返回该方格的行列坐标
     * @param pos 
     */
    sceneToMatrixPosition(pos: GameStruct.BigPos): GameStruct.RcInfo {
        let col = Math.floor(pos.x.div(this._mapUnit.width).toNumber());
        let row = Math.floor(pos.y.div(this._mapUnit.height).toNumber());
        return new GameStruct.RcInfo(col, row);
    }

    //矩阵行列坐标转为布景坐标
    matrixToSceneryPosition(pos: GameStruct.RcInfo): GameStruct.RcInfo {
        let col = Math.floor(Big(pos.col).div(GameDef.SCENERY_CONTAINS_RC).toNumber());
        let row = Math.floor(Big(pos.row).div(GameDef.SCENERY_CONTAINS_RC).toNumber());
        return new GameStruct.RcInfo(col, row);
    }

    //布景坐标转为矩阵行列坐标
    sceneryToMatrixPosition(pos: GameStruct.RcInfo): GameStruct.RcInfo {
        return new GameStruct.RcInfo(pos.col * GameDef.SCENERY_CONTAINS_RC, pos.row * GameDef.SCENERY_CONTAINS_RC);
    }

    //场景坐标转为布景坐标
    sceneToSceneryPosition(pos: GameStruct.BigPos): GameStruct.RcInfo {
        let ret = this.sceneToMatrixPosition(pos);
        return this.matrixToSceneryPosition(ret);
    }

    //坐标转换
    bigPosToVec2(pos: GameStruct.BigPos): cc.Vec2 {
        return cc.v2(pos.x.toNumber(), pos.y.toNumber());
    }

    isGamePause() {
        return cc.director.isPaused();
    }

    isValidMatrixPos(pos: GameStruct.RcInfo) {
        if (pos) {
            if (0 <= pos.col && pos.col <= GameDef.GAME_MAP_COL_NUM
                && 0 <= pos.row && pos.row <= GameDef.GAME_MAP_ROW_NUM) {
                    return true;
            }
        }
        return false;
    }

    isValidSceneryPos(pos: GameStruct.RcInfo) {
        if (pos) {
            if (0 <= pos.col && pos.col <= GameDef.SCENERYS_NODE_COL_NUM
                && 0 <= pos.row && pos.row <= GameDef.SCENERYS_NODE_ROW_NUM) {
                    return true;
            }
        }
        return false;
    }

    isValidDirection(direction: number):boolean {
        if (direction >= 0 && direction <= 3) {
            return true;
        }
        return false;
    }

    isValidRect(rect: GameStruct.BigRect) {
        if (rect) {
            let mapRect = new GameStruct.BigRect(0, 0, this._mapUnit.width * GameDef.GAME_MAP_COL_NUM, this._mapUnit.height * GameDef.GAME_MAP_ROW_NUM);
            
            if (mapRect.containsRect(rect)) {
                return true;
            }
        }
        return false;
    }

    getHomeBaseRect(): GameStruct.BigRect {
        let scenePos = this.matrixToScenePosition(GameDef.PLACE_HOMEBASE); 
        let rect = new GameStruct.BigRect(scenePos.x, scenePos.y, this.getHomeBaseWidth(), this.getHomeBaseWidth());
        return rect;
    }

    getHomeCenterScenePosition(): GameStruct.BigPos {
        let scenePos = this.matrixToScenePosition(new GameStruct.RcInfo(GameDef.PLACE_HOMEBASE.col + 2, GameDef.PLACE_HOMEBASE.row + 2)); 
        return scenePos;
    }

    getSceneryWidth(): number {
        return this._mapUnit.width * GameDef.SCENERY_CONTAINS_RC;
    }

    getHomeBaseWidth(): number {
        return this._mapUnit.width * GameDef.SCENERY_CONTAINS_RC * 2;
    }

    getTankWidth(): number {
        return this._mapUnit.width * GameDef.SCENERY_CONTAINS_RC * 2;
    }

    getPropWidth(): number {
        return this._mapUnit.width * GameDef.SCENERY_CONTAINS_RC * 2;
    }

    /**
     * 获取一个矩形所能包含的行列坐标数组
     * @param pos 矩形左下角行列坐标
     * @param rowNum 包含行数（矩形高度）
     * @param colNum 包含列数（矩形宽度）
     */
    getRectContainPosArray(pos: GameStruct.RcInfo, rowNum = 0, colNum: number = 0): GameStruct.RcInfo[]  {
        let array:GameStruct.RcInfo[] = [];

        if (pos) {
            for( let col = 0; col < colNum; col++) {
                for (let row = 0; row < rowNum; row ++) {
                    array.push(new GameStruct.RcInfo(pos.col + col, pos.row + row));
                }
            }
        }
        return array;
    }

    addScopeByDirection(scope: GameStruct.HitScope, direction: number, value: number) {
        if (scope && value) {
            if (direction === GameDef.DIRECTION_UP) {
                scope.up += value;
            }
            else if (direction === GameDef.DIRECTION_DOWN) {
                scope.down += value;
            }
            else if (direction === GameDef.DIRECTION_LEFT) {
                scope.left += value;
            }
            else if (direction === GameDef.DIRECTION_RIGHT) {
                scope.right += value;
            }
        }
    }

    getOppositeDirection(direction: number) {
        let opposites = {
            [GameDef.DIRECTION_UP]: GameDef.DIRECTION_DOWN,
            [GameDef.DIRECTION_DOWN]: GameDef.DIRECTION_UP,
            [GameDef.DIRECTION_LEFT]: GameDef.DIRECTION_RIGHT,
            [GameDef.DIRECTION_RIGHT]: GameDef.DIRECTION_LEFT,
        }

        if (opposites[direction] != null) {
            return opposites[direction];
        }

        return -1;
    }

    getSceneryNodesInRect(rect: GameStruct.BigRect): cc.Node[] {
        let ret: cc.Node[] = [];
        if (rect) {
            //布景坐标
            let leftBottom = this.sceneToSceneryPosition(new GameStruct.BigPos(rect.xMin, rect.yMin));
            let rightTop = this.sceneToSceneryPosition(new GameStruct.BigPos(rect.xMax, rect.yMax));

            for (let col = leftBottom.col; col <= rightTop.col; col++) {
                for (let row = leftBottom.row; row <= rightTop.row; row++) {
                    let node = this.getSceneryNode(new GameStruct.RcInfo(col, row));
                    if (node) {
                        if (node.getComponent(Scenery).isOverlapWithRect(rect)) {
                            ret.push(node);
                        }
                    }
                }
            }
        }
        return ret;
    }

    //坦克是否能在给定区域移动
    canTankMoveInRect(moveAreaRect: GameStruct.BigRect, excludeTankNode: cc.Node = null): boolean {
        //是否超出边界
        if (!this.isValidRect(moveAreaRect)) {
            return false;
        }

        //是否包含基地
        {
            let homeBaseRect = this.getHomeBaseRect();

            if (this.isRectOverlap(moveAreaRect, homeBaseRect)) {
                return false;
            }
        }

        //是否包含不可穿越的布景
        {
            let sceneryNodes = this.getSceneryNodesInRect(moveAreaRect);
            if (sceneryNodes) {
                for (let node of sceneryNodes) {
                    let sceneryType = node.getComponent(Scenery).getType();
                    if (sceneryType !== GameDef.SceneryType.GRASS && sceneryType !== GameDef.SceneryType.ICE) {
                        return false;
                    }
                }
            }
        }

        //是否包含其他坦克
        {
            if (this.hasTankInRect(moveAreaRect, excludeTankNode)) {
                return false;
            }
        }

        return true;
    }

    hasTankInRect(areaRect: GameStruct.BigRect, excludeTankNode: cc.Node = null): boolean {
        let bHave = false;
        //玩家
        CommonFunc.travelMap(this._playerTanks, (no: number, player: PlayerTank) => {
            if (player.node !== excludeTankNode) {
                let tankRect: GameStruct.BigRect = player.getTankRect();
                if (this.isRectOverlap(areaRect, tankRect)) {
                    bHave = true;
                    return true;
                }
            }
        });

        //敌军
        if (!bHave) {
            CommonFunc.travelMap(this._enemyTanks, (id: number, enemy: EnemyTank) => {
                if (enemy.node !== excludeTankNode) {
                    let tankRect: GameStruct.BigRect = enemy.getTankRect();
                    if (this.isRectOverlap(areaRect, tankRect)) {
                        bHave = true;
                        return true;
                    }
                }
            });
        }

        return bHave;
    }

    getNearGameRect(direction: number, rects: GameStruct.GameRectInfo[]): GameStruct.GameRectInfo[] {
        let retRects: GameStruct.GameRectInfo[] = [];

        if (rects.length > 0) {
            retRects.push(rects[0]);
        }
        for (let i = 1; i < rects.length; i++) {
            let it = rects[i];

            if (direction === GameDef.DIRECTION_UP) {
                if (it.rect.yMin.eq(retRects[0].rect.yMin)) {
                    retRects.push(it);
                }
                else if (it.rect.yMin.lt(retRects[0].rect.yMin)) {
                    retRects = [it];
                }
            }
            else if (direction === GameDef.DIRECTION_DOWN) {
                if (it.rect.yMax.eq(retRects[0].rect.yMax)) {
                    retRects.push(it);
                }
                else if (it.rect.yMax.gt(retRects[0].rect.yMax)) {
                    retRects = [it];
                }
            }
            else if (direction === GameDef.DIRECTION_LEFT) {
                if (it.rect.xMax.eq(retRects[0].rect.xMax)) {
                    retRects.push(it);
                }
                else if (it.rect.xMax.gt(retRects[0].rect.xMax)) {
                    retRects = [it];
                }
            }
            else if (direction === GameDef.DIRECTION_RIGHT) {
                if (it.rect.xMin.eq(retRects[0].rect.xMin)) {
                    retRects.push(it);
                }
                else if (it.rect.xMin.lt(retRects[0].rect.xMin)) {
                    retRects = [it];
                }
            }

        }
        return retRects;
    }

    //获取坦克在移动时碰撞的最近的区域
    getTankCollisionRectWhenMove(direction: number, moveAreaRect: GameStruct.BigRect, excludeTankNode: cc.Node = null): GameStruct.GameRectInfo[] {
        let hitRects: GameStruct.GameRectInfo[] = [];

        //边界
        {
            let rects = this.getBoundaryRects();
            for (let r of rects) {
                if (this.isRectOverlap(moveAreaRect, r)) {
                    hitRects.push({group: GameDef.GROUP_NAME_BOUNDARY, type: -1, rect: r});
                }
            }
        }

        //基地
        {
            let homeBaseRect = this.getHomeBaseRect();

            if (this.isRectOverlap(moveAreaRect, homeBaseRect)) {
                hitRects.push({group: GameDef.GROUP_HOME_BASE, type: -1, rect: homeBaseRect});
            }
        }

        //不可穿越的布景
        {
            let sceneryNodes = this.getSceneryNodesInRect(moveAreaRect);
            if (sceneryNodes) {
                for (let node of sceneryNodes) {
                    let com = node.getComponent(Scenery);
                    let sceneryType = com.getType();
                    if (sceneryType !== GameDef.SceneryType.GRASS && sceneryType !== GameDef.SceneryType.ICE) {
                        let subRects = com.getOverlapSceneryRects(moveAreaRect);
                        for (let it of subRects) {
                            hitRects.push(it);
                        }
                    }
                }
            }
        }

        //其他坦克
        {
             //玩家
            CommonFunc.travelMap(this._playerTanks, (no: number, player: PlayerTank) => {
                if (player.node !== excludeTankNode) {
                    let tankRect: GameStruct.BigRect = player.getTankRect();
                    if (this.isRectOverlap(moveAreaRect, tankRect)) {
                        hitRects.push({group: GameDef.GROUP_NAME_TANK, type: player.id, rect: tankRect});
                    }
                }
            });

            //敌军
            CommonFunc.travelMap(this._enemyTanks, (id: number, enemy: EnemyTank) => {
                if (enemy.node !== excludeTankNode) {
                    let tankRect: GameStruct.BigRect = enemy.getTankRect();
                    if (this.isRectOverlap(moveAreaRect, tankRect)) {
                        hitRects.push({group: GameDef.GROUP_NAME_TANK, type: enemy.id, rect: tankRect});
                    }
                }
            });
        }

        return this.getNearGameRect(direction, hitRects);
    }

    //获取子弹在移动时碰撞的最近的区域
    getBulletCollisionRectWhenMove(direction: number, moveAreaRect: GameStruct.BigRect, excludeTankNode: cc.Node = null): GameStruct.GameRectInfo[] {
        let hitRects: GameStruct.GameRectInfo[] = [];

        //预测移动时，只考虑边界和布景，其他的由移动后的碰撞检测来判断。

        //边界
        {
            let rects = this.getBoundaryRects();
            for (let r of rects) {
                if (this.isRectOverlap(moveAreaRect, r)) {
                    hitRects.push({group: GameDef.GROUP_NAME_BOUNDARY, type: -1, rect: r});
                }
            }
        }

        //获取区域中所有相交的区域
        let sceneryNodes = this.getSceneryNodesInRect(moveAreaRect);
        if (sceneryNodes) {
            for (let node of sceneryNodes) {
                let com = node.getComponent(Scenery);
                let sceneryType = com.getType();
                if (sceneryType !== GameDef.SceneryType.GRASS && sceneryType !== GameDef.SceneryType.WATER && sceneryType !== GameDef.SceneryType.ICE) {
                    let subRects = com.getOverlapSceneryRects(moveAreaRect);
                    for (let it of subRects) {
                        hitRects.push(it);
                    }
                }
            }
        }

        return this.getNearGameRect(direction, hitRects);
    }

    isGameDebugMode(): boolean {
        if (GameConfig.debugMode > 0) {
            return true;
        }
        return false;
    }

    isRectOverlap(rect1: GameStruct.BigRect, rect2: GameStruct.BigRect): boolean {
        let interRect = rect1.intersection(rect2);

        if (interRect.width.gt(0) && interRect.height.gt(0)) {
            return true;
        }

        return false;
    }

    /**
     * 获取满足条件的所有矩阵坐标数组
     * 条件：以矩形左下角为坐标，rowNum*colNum格子范围内无其他布景、坦克、基地
     * @param rowNum 
     * @param colNum 
     */
    getEmptyMatrixArray(rowNum, colNum, exceptSecenry: number[] = []): GameStruct.RcInfo[] {
        let checkAry: boolean[][] = CommonFunc.createArray(GameDef.GAME_MAP_COL_NUM);
        for (let col = 0; col < GameDef.SCENERYS_NODE_COL_NUM; col++) {
            for (let row = 0; row < GameDef.SCENERYS_NODE_ROW_NUM; row++) {
                checkAry[col][row] = false;
            }
        }

        //排除非空位
        {
            //排除基地
            {
                let homePosAry = this.getRectContainPosArray(GameDef.PLACE_HOMEBASE, 4, 4);
                for (let pos of homePosAry) {
                    checkAry[pos.col][pos.row] = true;
                }
            }

            //排除布景
            {
                for (let i = 0; i < GameDef.SCENERYS_NODE_COL_NUM; i++) {
                    for (let j = 0; j < GameDef.SCENERYS_NODE_ROW_NUM; j++) {
                        if (this._scenerys[i] && this._scenerys[i][j]) {
                            let com = this._scenerys[i][j].getComponent(Scenery);
                            if (exceptSecenry.indexOf(com.getType()) < 0) {
                                let posAry = com.getSceneryContainPosAry();
                                for (let pos of posAry) {
                                    checkAry[pos.col][pos.row] = true;
                                }
                            }
                        }
                    }
                }
            }

            //排除坦克
            {
                CommonFunc.travelMap(this._playerTanks, (no: number, player: PlayerTank) => {
                    let posAry = player.getTankContainRcInfoArray();
                    for (let pos of posAry) {
                        checkAry[pos.col][pos.row] = true;
                    }
                });
        

                CommonFunc.travelMap(this._enemyTanks, (id: number, enemy: EnemyTank) => {
                    let posAry = enemy.getTankContainRcInfoArray();
                    for (let pos of posAry) {
                        checkAry[pos.col][pos.row] = true;
                    }
                });
        
            }
        }

        let retAry:GameStruct.RcInfo[] = [];
        let propUnitNum = 4;

        let isEmptyPos = (col: number, row: number): boolean => {
            for (let i = 0; i < propUnitNum; i++) {
                for (let j = 0; j < propUnitNum; j++) {
                    if (checkAry[col + i][row + j]) {
                        return false;
                    }
                }
            }

            return true;
        };

        for (let col = 0; col <= GameDef.GAME_MAP_COL_NUM - propUnitNum; col++) {
            for (let row = 0; row <= GameDef.GAME_MAP_ROW_NUM - propUnitNum; row++) {
                if (isEmptyPos(col, row)) {
                    retAry.push(new GameStruct.RcInfo(col, row));
                }
            }
        }

        return retAry;
    }

    getHighScore(): number {
        let key = "GameHighScore";
        return this.getLocalStorageNumber("GameHighScore");
    }

    setHighScore(score: number) {
        this.setLocalStorageNumber("GameHighScore", score);
    }

    setLocalStorageNumber(key: string, value: number) {
        cc.sys.localStorage.setItem(key, value.toString());
    }

    getLocalStorageNumber(key: string): number {
        let value = cc.sys.localStorage.getItem(key);

        if (value) {
            return Number(value);
        }
        return 0;
    }

    getBoundaryRects(): GameStruct.BigRect[] {
        let width = this._mapUnit.width * GameDef.GAME_MAP_COL_NUM;
        let height = this._mapUnit.height * GameDef.GAME_MAP_ROW_NUM;

        return [
            new GameStruct.BigRect(-10, 0, 10, height), //左
            new GameStruct.BigRect(0, -10, width, 10), //下
            new GameStruct.BigRect(width, 0, 10, height), //右
            new GameStruct.BigRect(0, height, width, 10), //上
        ]
    }

    //设置登录数据
    setLoginInData(userID: number, timestamp: number) {
        this._netUserID = userID;
        this._netTimestamp = timestamp;

        //写入缓存，以便重启游戏后使用
        this.setLocalStorageNumber("NetUserID", userID);
        this.setLocalStorageNumber("NetTimeStamp", timestamp);
    }

    //获取登录数据
    getLoginInData() {
        let userid = this._netUserID;
        let timestamp = this._netTimestamp;
        if (userid == 0) {
            userid = this.getLocalStorageNumber("NetUserID");
            timestamp = this.getLocalStorageNumber("NetTimeStamp");
        }
        return {userid, timestamp};
    }

    //获取房间玩家信息
    getRoomPlayerInfo() {
        return {roomid: this._netRoomID, playerno: this._netPlayerNO, userid: this._netUserID};
    }
}
export default new GameDataModel();
