import { movePlayerTo } from "@decentraland/RestrictedActions";
import { Scene } from "./scene";
export class GameSceneManager {
  cName: string;
  activeScene: Scene
  activeSceneName: string
  rootScene: Scene;
  alternativeScene: Scene[];
  constructor(rootScene: Scene, altScene: Scene[]) {
    this.rootScene = rootScene;
    this.activeSceneName = this.rootScene.sceneName;
    this.activeScene = rootScene
    this.alternativeScene = altScene;
  }

  start() {
    this.alternativeScene.forEach(scene => scene.hide());
    this.rootScene.show();
  }

  hideAllScenes(){
    this.activeScene = undefined
    this.rootScene.hide();
    this.alternativeScene.forEach(scene => scene.hide());
  }
  
  moveTo(scene: string, movePos?:Vector3,cameraDir?:Vector3) {
    //debugger
    log("GameSceneManager moveTo",scene,movePos)
    if (this.rootScene.sceneName == scene) {
      log("GameSceneManager moveTo.moving to rootScene")
      this.alternativeScene.forEach(scene => scene.hide());
      this.rootScene?.show();
      this.activeScene = this.rootScene
      this.activeSceneName = this.rootScene.sceneName;
    } else {
      try{
        this.rootScene.hide();
      }catch(e){
        //debugger
        log("error hiding",e)
      }
      this.alternativeScene.forEach(altScene =>{
        //debugger
        if(altScene.sceneName === scene){
          this.activeSceneName = altScene.sceneName;
          this.activeScene = altScene
          altScene.show()

        }else{
          altScene.hide()
        }}
        )
    }
    
    if(movePos !== undefined){
      log("GameSceneManager.moveTo moving player to",movePos,cameraDir)
      movePlayerTo( movePos,cameraDir )
    }
  }
}
