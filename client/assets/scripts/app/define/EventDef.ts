export namespace EventDef {
    export const EV_TEST_CREATE_GAMEMAP                = "evtestcreategamemap";

    export const EV_GAME_INIT_FINISHED                 = "evgameinitfinished";
    export const EV_GAME_STARTED                       = "evgamestarted";
    export const EV_GAME_ENDED                         = "evgameended";
    export const EV_GAME_HIT_SCENERY                   = "evgamehitscenery";
    export const EV_GAME_SHOW_DEBUG_TEXT               = "evgameshowdebugtext";
    export const EV_GAME_PREPARE_GAME                  = "evgamepreparegame";
    export const EV_GAME_REDUCE_BULLET                 = "evgamereducebullet";
    export const EV_GAME_STAGE_FINISHED                = "evgamestagefinished";

    export const EV_GAME_PAUSE                         = "evgamepause";
    export const EV_GAME_RESUME                        = "evgameresume";

    export const EV_PLAYER_INIT_FINISHED               = "evplayerinitfinished";
    export const EV_PLAYER_DEAD                        = "evplayerdead";

    export const EV_ENEMY_DEAD                         = "evenemydead";

    export const EV_MAP_CREATE_SCENERY                 = "evmapeditcreatescenery";
    export const EV_MAP_DESTROY_SCENERY                = "evmapdestroyscenery";
    export const EV_MAP_EDIT_FINISHED                  = "evmapeditfinished";

    export const EV_PROP_CREATE                        = "evpropcreate";
    export const EV_PROP_DESTROY                       = "evpropdestroy";
    export const EV_PROP_GAIN                          = "evpropgain";
    export const EV_PROP_BOMB                          = "evpropbomb";
    export const EV_PROP_SPADE_START                   = "evpropspadestart";
    export const EV_PROP_SPADE_COUNT_DOWN              = "evpropspadecountdown";
    export const EV_PROP_SPADE_END                     = "evpropspadeend";

    export const EV_UNITANI_PLAY                       = "evunitaniplay";
    export const EV_SCENEANI_PLAY                      = "evsceneaniplay";
    export const EV_ANI_STOP                           = "evunitanistop";
    export const EV_ANI_PAUSE                          = "evunitanipause";
    export const EV_ANI_RESUME                         = "evunitaniresume";

    export const EV_DISPLAY_UPDATE_ENEMY_LIFE          = "evdisplayrefreshenemylife";
    export const EV_DISPLAY_UPDATE_PLAYER_LIFE         = "evdisplayrefreshplayerlife";

    export const EV_MAINGAME_SOCKET_ERROR              = "evmaingamesocketerror";
}