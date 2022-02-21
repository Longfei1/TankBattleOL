export namespace EventDef {
    export const EV_TEST_CREATE_GAMEMAP                = "evtestcreategamemap";             //测试，创建地图

    export const EV_GAME_INIT_FINISHED                 = "evgameinitfinished";              //游戏初始化完成
    export const EV_GAME_STARTED                       = "evgamestarted";                   //游戏开始
    export const EV_GAME_ENDED                         = "evgameended";                     //游戏结束
    export const EV_GAME_HIT_SCENERY                   = "evgamehitscenery";                //命中布景
    export const EV_GAME_SHOW_DEBUG_TEXT               = "evgameshowdebugtext";             //显示测试文本
    export const EV_GAME_PREPARE_GAME                  = "evgamepreparegame";               //游戏预处理
    export const EV_GAME_REDUCE_BULLET                 = "evgamereducebullet";              //子弹减少
    export const EV_GAME_STAGE_FINISHED                = "evgamestagefinished";             //关卡完成

    export const EV_GAME_PAUSE                         = "evgamepause";                     //游戏暂停
    export const EV_GAME_RESUME                        = "evgameresume";                    //游戏恢复

    export const EV_PLAYER_DEAD                        = "evplayerdead";                    //玩家死亡

    export const EV_ENEMY_DEAD                         = "evenemydead";                     //敌军死亡

    export const EV_MAP_CREATE_SCENERY                 = "evmapeditcreatescenery";          //地图：创建布景
    export const EV_MAP_DESTROY_SCENERY                = "evmapdestroyscenery";             //地图：销毁布景
    export const EV_MAP_EDIT_FINISHED                  = "evmapeditfinished";               //地图：编辑完成

    export const EV_PROP_CREATE                        = "evpropcreate";                    //创建道具
    export const EV_PROP_DESTROY                       = "evpropdestroy";                   //销毁道具
    export const EV_PROP_GAIN                          = "evpropgain";                      //获得道具
    export const EV_PROP_BOMB                          = "evpropbomb";                      //道具炸弹
    export const EV_PROP_SPADE_START                   = "evpropspadestart";                //道具铲子：开始
    export const EV_PROP_SPADE_COUNT_DOWN              = "evpropspadecountdown";            //道具铲子：倒计时
    export const EV_PROP_SPADE_END                     = "evpropspadeend";                  //道具铲子：结束

    export const EV_UNITANI_PLAY                       = "evunitaniplay";                   //单元动画
    export const EV_SCENEANI_PLAY                      = "evsceneaniplay";                  //场景动画
    export const EV_ANI_STOP                           = "evunitanistop";                   //动画停止
    export const EV_ANI_PAUSE                          = "evunitanipause";                  //动画暂停
    export const EV_ANI_RESUME                         = "evunitaniresume";                 //动画恢复

    export const EV_DISPLAY_UPDATE_ENEMY_LIFE          = "evdisplayrefreshenemylife";       //更新敌军生命显示
    export const EV_DISPLAY_UPDATE_PLAYER_LIFE         = "evdisplayrefreshplayerlife";      //更新玩家生命显示

    //网络通讯
    export const EV_MAINGAME_SOCKET_ERROR              = "evmaingamesocketerror";           //socket错误
    export const EV_MAINGAME_REQUEST_TIMEOUT           = "evmaingamerequesttimeout";        //请求超时

    export const EV_NTF_JOIN_ROOM                      = "evntfjoinroom";                   //房间进入通知
    export const EV_NTF_LEAVE_ROOM                     = "evntfleaveroom";                  //房间离开通知
    export const EV_NTF_ROOM_HOST_CHANGED              = "evntfroomhostchanged";            //房间房主变化通知
    export const EV_NTF_PLAYER_INFO                    = "evntfplayerinfo";                 //玩家信息通知
    export const EV_NTF_ROOM_READY                     = "evntfroomready";                  //房间玩家准备
    export const EV_NTF_ROOM_UNREADY                   = "evntfroomunready";                //房间玩家取消准备
    export const EV_NTF_ROOM_START                     = "evntfroomstart";                  //房间玩家开始
    export const EV_NTF_MENU_SWITCH                    = "evntfmenuswitch";                 //菜单切换
    export const EV_NTF_MENU_CHOOSE                    = "evntfmenuchoose";                 //菜单选择
    export const EV_NTF_MENU_BACK                      = "evntfmenuback";                   //菜单返回
    export const EV_NTF_GAME_START                     = "evntfgamestart";                  //游戏开始
    export const EV_NTF_GAME_FRAME                     = "evntfgameframe";                  //游戏帧数据

    //游戏逻辑驱动
    export const EV_GL_CAPTURE_OPERATION               = "evglcaptureoperation";            //采集操作
    export const EV_GL_PLAYER_OPERATION                = "evglplayeroperation";             //玩家操作
}