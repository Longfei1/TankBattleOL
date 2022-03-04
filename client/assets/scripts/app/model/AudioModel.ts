import { GameStruct } from "../define/GameStruct";
import BaseModel from "./BaseModel";

class AudioModel extends BaseModel{
    playMusic(srcPath: string, loop = true) {
        cc.loader.loadRes(srcPath, (error, clip) =>{
            if(!error) {
                cc.audioEngine.playMusic(clip, loop);
            }
        });
    }

    stopMusic() {
        cc.audioEngine.stopMusic();
    }

    playSound(srcPath: string, loop = false): GameStruct.AudioInfo {
        let info: GameStruct.AudioInfo = {audioID: null, stop: false};
        cc.loader.loadRes(srcPath, (error, clip) => {
            if (!error) {
                if (!info.stop) {
                    info.audioID = cc.audioEngine.playEffect(clip, loop);
                }
            }
        });
        return info;
    }

    stopSound(info: GameStruct.AudioInfo) {
        if (info) {
            if (info.audioID == null) {
                info.stop = true;
            }
            else {
                cc.audioEngine.stopEffect(info.audioID);
            }
        }
    }
}

export default new AudioModel();