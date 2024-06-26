//import * as utils from '@dcl/ecs-scene-utils';
import { Entity, GltfContainer, Transform, engine, pointerEventsSystem,InputAction, MeshRenderer, VideoPlayer, Material, MaterialTransparencyMode, MeshCollider, PointerEvents, PointerEventType  } from '@dcl/sdk/ecs';
import { Color3, Color4, Quaternion, Vector3 } from '@dcl/sdk/math';
import { movePlayerTo,openExternalUrl } from '~system/RestrictedActions'
import { CONFIG, SCENE_TYPE_GAMIMALL, SCENE_TYPE_UNIFIED_SCENE } from '../config';
import { log } from '../back-ports/backPorts';
import { TransformSafeWrapper } from '../back-ports/workarounds';

const CLASSNAME = "sceneVideos.ts"

let alreadyInit = false
export function initSceneVideos(_scene:Entity){
    const METHOD_NAME = "initSceneVideos()"
    log(CLASSNAME,METHOD_NAME,"ENTRY");
    alreadyInit = true
 
    initFallbackVMLVideo(_scene)
}
function initFallbackVMLVideo(_scene: Entity) {
  const METHOD_NAME = "initFallbackVMLVideo()"

  //https://docs.decentraland.org/creator/development-guide/sdk7/video-playing/
    // #1
    const screen = engine.addEntity()
    MeshRenderer.setPlane(screen)
    TransformSafeWrapper.create(screen, 
      { 
        position: { x: 68.12 , y: 6.6, z: 65.38 } , 
        scale: { x: 12.06, y: 6.8, z: 1},
        rotation: Quaternion.fromEulerDegrees(0, 88.7, 0),
        parent: _scene
      })

    const startPlayingByDefault = false
    // #2
    VideoPlayer.create(screen, {
      src: 'https://video.dcl.guru/live/mrdhingia/index.m3u8', //video.dcl.guru/live/vtatvpublic/index.m3u8
      playing: startPlayingByDefault,
      volume: 1
    })

    // #3
    const videoTexture = Material.Texture.Video({ videoPlayerEntity: screen })
    

    // #4
    Material.setPbrMaterial(screen, {
      texture: videoTexture,
      //transparencyMode:MaterialTransparencyMode.MTM_ALPHA_TEST,
      //make it emit a little light
      emissiveTexture: videoTexture,
      emissiveIntensity: 2,
      emissiveColor: Color3.Gray(),
      roughness: 1.0,
      specularIntensity: 1,
      metallic: 0,
    })

    //make clickable
    MeshCollider.setPlane(screen)

    const playPauseFn = ()=>{
      log(CLASSNAME,METHOD_NAME,"playPauseFn", "ENTRY")
      
      const thisFN = playPauseFn

      const player = VideoPlayer.getMutableOrNull(screen)
      if(!player){
        log(CLASSNAME,METHOD_NAME,"No Video Player found!!!")
        return
      }
      log(CLASSNAME,METHOD_NAME,"Video Player playing: ",player.playing)
      if(player.playing){
        log(CLASSNAME,METHOD_NAME,"Pausing Video")
        player.playing = false
        
        PointerEvents.createOrReplace(screen, { pointerEvents: [
          {
            eventType: PointerEventType.PET_DOWN,
            eventInfo: {
              button: InputAction.IA_POINTER,
              showFeedback: true,
              hoverText:"Play Video"
            }
          }
        ]})
        /*pointerEventsSystem.removeOnPointerDown(screen)
        pointerEventsSystem.onPointerDown(
          {
            entity:screen
            ,opts:{
              hoverText:"Play Video"
            }
          }
          ,thisFN
        )*/
      }else{
        log(CLASSNAME,METHOD_NAME,"Playing Video")

        player.playing = true
        
        PointerEvents.createOrReplace(screen, { pointerEvents: [
          {
            eventType: PointerEventType.PET_DOWN,
            eventInfo: {
              button: InputAction.IA_POINTER,
              showFeedback: true,
              hoverText:"Pause Video"
            }
          }
        ]})
        /*pointerEventsSystem.removeOnPointerDown(screen)
        pointerEventsSystem.onPointerDown(
          {
            entity:screen
            ,opts:{
              hoverText:"Pause Video"
            }
          }
          ,thisFN
        )*/
      }
    }
    
    //setup initial pointer event
    pointerEventsSystem.onPointerDown(
      {
        entity:screen
        ,opts:{
          hoverText: startPlayingByDefault ? "Pause Video" : "Play Video" 
        }
      }
      ,playPauseFn
    )

}

