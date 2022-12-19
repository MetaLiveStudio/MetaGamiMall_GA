import { movePlayerTo } from "@decentraland/RestrictedActions";
import { Scene } from "./scene";
export class GameSceneManager {
  activeScene: string;
  rootScene: Scene;
  alternativeScene: Scene;
  constructor(rootScene: Scene, altScene: Scene) {
    this.rootScene = rootScene;
    this.activeScene = rootScene.sceneName;
    this.alternativeScene = altScene;
    this.activeScene = this.rootScene.sceneName;
  }

  start() {
    this.alternativeScene.hide();
    this.rootScene.show();
  }

  moveTo(scene: string,movePos?:Vector3,cameraDir?:Vector3) {
    if (this.rootScene.sceneName == scene) {
      this.alternativeScene.hide();
      this.rootScene?.show();
      this.activeScene = this.rootScene.sceneName;
    } else {
      this.alternativeScene.show();
      this.rootScene.hide();
      this.activeScene = this.alternativeScene.sceneName;
    }
    
    if(movePos !== undefined){
      log("GameSceneManager.moveTo moving player to",movePos,cameraDir)
      movePlayerTo( movePos,cameraDir )
    }
  }
}
