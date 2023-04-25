import { REGISTRY } from "src/registry";
import { CommonResources } from "src/resources/common";
import * as utils from '@dcl/ecs-scene-utils'
import { isPreviewMode } from '@decentraland/EnvironmentAPI'
import { triggerEmote, PredefinedEmote } from '@decentraland/RestrictedActions'

export function initSecondAltScene(){
    const _secondAlternativeScene = new Entity("1229");
    engine.addEntity(_secondAlternativeScene);
    REGISTRY.entities.secondaryAlternativeScene = _secondAlternativeScene
    
// Add planet stage related entities 
    const planetstage = new Entity("planetstage");
    planetstage.setParent(_secondAlternativeScene);
    planetstage.addComponent(new GLTFShape("models/Stagescene/stage.glb"));
    planetstage.addComponent(new Transform({ position: new Vector3(28, 0, 35) }));
    engine.addEntity(planetstage);

    const Lighteffect1 = new Entity("Lighteffect1");
    Lighteffect1.setParent(_secondAlternativeScene);
    Lighteffect1.addComponent(new GLTFShape("models/Stagescene/Lighteffect1.glb"));
    Lighteffect1.addComponent(new Transform({ position: new Vector3(28, 0, 35) }));
    engine.addEntity(Lighteffect1); 

    const Lighteffect2 = new Entity("Lighteffect2");
    Lighteffect2.setParent(_secondAlternativeScene);
    Lighteffect2.addComponent(new GLTFShape("models/Stagescene/Lighteffect2.glb"));
    Lighteffect2.addComponent(new Transform({ position: new Vector3(28, 0, 35) }));
    engine.addEntity(Lighteffect2); 

    const beamL1 = new Entity("beamL1");
    beamL1.setParent(_secondAlternativeScene);
    beamL1.addComponent(new GLTFShape("models/Stagescene/beamL1.glb"));
    beamL1.addComponent(new Transform({ position: new Vector3(28, 0, 35) }));
    engine.addEntity(beamL1); 

    const beamL2 = new Entity("beamL2");
    beamL2.setParent(_secondAlternativeScene);
    beamL2.addComponent(new GLTFShape("models/Stagescene/beamL2.glb"));
    beamL2.addComponent(new Transform({ position: new Vector3(28, 0, 35) }));
    engine.addEntity(beamL2);

    const beamL3 = new Entity("beamL3");
    beamL3.setParent(_secondAlternativeScene);
    beamL3.addComponent(new GLTFShape("models/Stagescene/beamL3.glb"));
    beamL3.addComponent(new Transform({ position: new Vector3(28, 0, 35) }));
    engine.addEntity(beamL3);

    const beamR1 = new Entity("beamR1");
    beamR1.setParent(_secondAlternativeScene);
    beamR1.addComponent(new GLTFShape("models/Stagescene/beamR1.glb"));
    beamR1.addComponent(new Transform({ position: new Vector3(28, 0, 35) }));
    engine.addEntity(beamR1); 

    const beamR2 = new Entity("beamR2");
    beamR2.setParent(_secondAlternativeScene);
    beamR2.addComponent(new GLTFShape("models/Stagescene/beamR2.glb"));
    beamR2.addComponent(new Transform({ position: new Vector3(28, 0, 35) }));
    engine.addEntity(beamR2);

    const beamR3 = new Entity("beamR3");
    beamR3.setParent(_secondAlternativeScene);
    beamR3.addComponent(new GLTFShape("models/Stagescene/beamR3.glb"));
    beamR3.addComponent(new Transform({ position: new Vector3(28, 0, 35) }));
    engine.addEntity(beamR3);

    // Add auto dance

const danceAreas: any = [
    {
      transform: {
        position: new Vector3(39, 0, 36),
        scale: new Vector3(30, 4, 30)
      },
      type: PredefinedEmote.ROBOT
    }]

////// DEBUG FLAG - Set to true to view all dance areas
const DEBUG_FLAG = false
  

///// This system acts on the danceAreas defined above

class DanceSystem {
    length = 11
    timer = 2
    routine: any
    danceFunction: () => void = () => {
      //   log('pointer Up')
      this.dance()
    }
  
    routines: PredefinedEmote[] = [
      PredefinedEmote.ROBOT,
      PredefinedEmote.TIK,
      PredefinedEmote.TEKTONIK,
      PredefinedEmote.HAMMER,
      PredefinedEmote.HEAD_EXPLODDE,
      PredefinedEmote.HANDS_AIR,
      PredefinedEmote.DISCO,
      PredefinedEmote.DAB
    ]
  
    constructor(routine: PredefinedEmote) {
      this.routine = routine
    }
  
    update(dt: number) {
      if (this.timer > 0) {
        this.timer -= dt
      } else {
        this.dance()
      }
    }
    dance() {
      this.timer = this.length
      if (this.routine === 'all') {
        const rand = Math.floor(Math.random() * (this.routine.length - 0) + 0)
        void triggerEmote({ predefined: this.routines[rand] })
      } else {
        void triggerEmote({ predefined: this.routine })
      }
    }
    addEvents() {
      Input.instance.subscribe(
        'BUTTON_UP',
        ActionButton.FORWARD,
        false,
        this.danceFunction
      )
  
      Input.instance.subscribe(
        'BUTTON_UP',
        ActionButton.BACKWARD,
        false,
        this.danceFunction
      )
  
      Input.instance.subscribe(
        'BUTTON_UP',
        ActionButton.RIGHT,
        false,
        this.danceFunction
      )
  
      Input.instance.subscribe(
        'BUTTON_UP',
        ActionButton.LEFT,
        false,
        this.danceFunction
      )
    }
    removeEvents() {
      Input.instance.unsubscribe(
        'BUTTON_UP',
        ActionButton.FORWARD,
        this.danceFunction
      )
  
      Input.instance.unsubscribe(
        'BUTTON_UP',
        ActionButton.BACKWARD,
        this.danceFunction
      )
  
      Input.instance.unsubscribe(
        'BUTTON_UP',
        ActionButton.RIGHT,
        this.danceFunction
      )
  
      Input.instance.unsubscribe(
        'BUTTON_UP',
        ActionButton.LEFT,
        this.danceFunction
      )
    }
  }
  
  for (const i in danceAreas) {
    const area = new Entity('dance-' + i);
    area.setParent(_secondAlternativeScene);
    area.addComponent(new Transform(danceAreas[i].transform))
  
    void executeTask(async () => {
      if (DEBUG_FLAG && (await isPreviewMode())) {
        area.addComponent(new BoxShape())
        area.getComponent(BoxShape).withCollisions = false
      }
    })
  
    engine.addEntity(area)
    const dsystem = new DanceSystem(danceAreas[i].type)
  
    area.addComponent(
      new utils.TriggerComponent(
        new utils.TriggerBoxShape(
          new Vector3(
            area.getComponent(Transform).scale.x,
            area.getComponent(Transform).scale.y,
            area.getComponent(Transform).scale.z
          ),
          new Vector3(0, 2.5, 0)
        ),
        {
          enableDebug: false,
          onCameraEnter: () => {
            engine.addSystem(dsystem)
            dsystem.addEvents()
          },
          onCameraExit: () => {
            dsystem.removeEvents()
            engine.removeSystem(dsystem)
          }
        }
      )
    )
  }
  

// Add video
    const myVideoClip = new VideoClip(
    'https://player.vimeo.com/external/771675385.m3u8?s=3fb7bf04f5023c859368eee014a09a3a7f1a9b5c'
    )
    const myVideoTexture = new VideoTexture(myVideoClip)
  
    myVideoTexture.loop = true //?loop??
    
    const myMaterial = new Material()
    myMaterial.albedoTexture = myVideoTexture
    myMaterial.roughness = 1
    myMaterial.specularIntensity = 0
    myMaterial.metallic = 0
     
    const screen = new Entity()
    screen.addComponent(new PlaneShape())
    screen.setParent(_secondAlternativeScene);
    screen.addComponent(
      new Transform({
        position: new Vector3(39.5, 7.5, 18.5),
        scale:new Vector3(14, 12.5, 14)
      })
    )
    screen.addComponent(myMaterial)
    screen.addComponent(
      new OnPointerDown(() => {
        myVideoTexture.playing = !myVideoTexture.playing
      })
    )
    engine.addEntity(screen)
    
    //myVideoTexture.play()
    REGISTRY.videoTextures.secondaryAlternativeScene = myVideoTexture

// Add teleporter
    function moveToRootScene(){
        if (
        REGISTRY.sceneMgr.activeSceneName !== REGISTRY.sceneMgr.rootScene.sceneName
        ) { 
            //sub 1 from x and z to land next to it
            REGISTRY.sceneMgr.moveTo(REGISTRY.sceneMgr.rootScene.sceneName,new Vector3(20, 1.5, 6));
        } else {
            //REGISTRY.sceneMgr.moveTo(gameSceneManager.alternativeScene.sceneName, new Vector3( 15,2,63 ) );
        //log("already in ")
        
        }
    } 

    const gltfShapeCS22 = new GLTFShape("models/Stagescene/Teleporter.glb");

    const warpToMainSceneEnt = new Entity("warpToMainSceneEnt");
    warpToMainSceneEnt.setParent(_secondAlternativeScene)  
    warpToMainSceneEnt.addComponentOrReplace(gltfShapeCS22);
    //warpToMainSceneEnt.addComponent(CommonResources.RESOURCES.materials.transparent)
    warpToMainSceneEnt.addComponent(new Transform({ 
        //position: REGISTRY.movePlayerTo.ALT_SCENE.position?.subtract( new Vector3(1,0,1) ), //24-.3
        position: new Vector3(39.7,1,35.5),//entity absolute position placed
        scale: new Vector3(1.2,1.2,1.2)
    })); 
    warpToMainSceneEnt.addComponent(
    new OnPointerDown(
        (e) => {
            moveToRootScene()
        },
        {
        hoverText: "Go to Main Scene",
        }
    )
    );
    engine.addEntity(warpToMainSceneEnt);
}

