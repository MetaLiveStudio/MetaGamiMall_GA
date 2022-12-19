import { REGISTRY } from "src/registry";
import { CommonResources } from "src/resources/common";

export function initAltScene(){
    const _alternativeScene = new Entity("229");
    engine.addEntity(_alternativeScene);
    REGISTRY.entities.alternativeScene = _alternativeScene

    const myEntity = new Entity("228");
    myEntity.setParent(_alternativeScene);
    myEntity.addComponent(new GLTFShape("models/scene_box.glb"));
    myEntity.addComponent(new Transform({ position: new Vector3(28, 0, 35) }));
    engine.addEntity(myEntity);

    const OdailyText = new Entity("OdailyText");
    OdailyText.setParent(_alternativeScene);
    OdailyText.addComponent(new GLTFShape("models/Odailytext.glb"));
    OdailyText.addComponent(new Transform({ position: new Vector3(28, 0, 35) }));
    engine.addEntity(OdailyText);

    function moveToRootScene(){
        if (
        REGISTRY.sceneMgr.activeScene !== REGISTRY.sceneMgr.rootScene.sceneName
        ) { 
            //sub 1 from x and z to land next to it
            REGISTRY.sceneMgr.moveTo(REGISTRY.sceneMgr.rootScene.sceneName,new Vector3(11.5 - 1, 24, 48.25 - 1));
        } else {
            //REGISTRY.sceneMgr.moveTo(gameSceneManager.alternativeScene.sceneName, new Vector3( 15,2,63 ) );
        //log("already in ")
        
        }
    } 

    const gltfShapeCS22 = new GLTFShape("models/sceneswapbox.glb");

    const warpToMainSceneEnt = new Entity("warpToMainSceneEnt");
    warpToMainSceneEnt.setParent(_alternativeScene)  
    warpToMainSceneEnt.addComponentOrReplace(gltfShapeCS22);
    //warpToMainSceneEnt.addComponent(CommonResources.RESOURCES.materials.transparent)
    warpToMainSceneEnt.addComponent(new Transform({ 
        //position: REGISTRY.movePlayerTo.ALT_SCENE.position?.subtract( new Vector3(1,0,1) ), //24-.3
        position: new Vector3(28,2,35),//entity absolute position placed
        scale: new Vector3(1.2,1.2,1.2)
    })); 
    warpToMainSceneEnt.addComponent(
    new OnPointerDown(
        (e) => {
            moveToRootScene()
        },
        {
        hoverText: "Go to Main Dimension",
        }
    )
    );
    engine.addEntity(warpToMainSceneEnt);
}
