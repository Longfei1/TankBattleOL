import BaseModel from "./BaseModel";

class GameResModel extends BaseModel {

    initModel() {
        super.initModel();
        this.preLoadRes();
    }

    preLoadRes() {
        cc.loader.loadResDir("prefab", cc.Prefab, (error: Error, resource: any[], urls: string[]) => {
            if (error) {
                console.log("preLoadRes error:", error);
            }
            else {

                console.log("preLoadRes success", urls);
            }
        });
    }
}

export default new GameResModel();