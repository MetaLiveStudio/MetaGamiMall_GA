//import * as utils from "@dcl/ecs-scene-utils";
import * as utils from '@dcl-sdk/utils'
//import * as ui from "@dcl/ui-scene-utils";
import PlayFab from "./playfab_sdk/PlayFabClientApi";
import * as PlayFabSDK from "./playfab_sdk/index";
import {
  EntityTokenResponse,
  GetLeaderboardResult,
  GetPlayerCombinedInfoResult,
  GetPlayerCombinedInfoResultPayload,
  LoginResult,
  TreatmentAssignment,
  UserSettings,
} from "./playfab_sdk/playfab.types";

//import * as EthereumController from "@decentraland/EthereumController";
//import { getProvider } from "@decentraland/web3-provider";
//import { GLOBAL_CANVAS } from "./resources";
import { GAME_STATE } from "../state";
import {
  getAndSetRealmDataIfNull,
  getAndSetUserData,
  getAndSetUserDataIfNull,
  getAndSetUserDataIfNullNoWait,
  getRealmDataFromLocal,
  getUserDataFromLocal,
} from "../userData";

import { isNull, notNull } from "../utils";
import { CONFIG, SCENE_TYPE_GAMIMALL, initConfig } from "../config";
import { initRegistry, REGISTRY } from "../registry";
//import { Constants as DecentRallyConstants } from "src/meta-decentrally/modules/resources/globals";
import { LoginFlowCallback, LoginFlowResult } from "../meta-decentrally/login/login-types";
import { preventConcurrentExecution } from "../meta-decentrally/modules/utilities";
//import { signedFetch } from '@decentraland/SignedFetch';
import { log } from "../back-ports/backPorts";
import { Animator, AvatarAnchorPointType, AvatarAttach, ColliderLayer, Entity, GltfContainer, InputAction, MeshRenderer, PBRaycastResult, Raycast, RaycastQueryType, RaycastResult, Transform, engine, executeTask, pointerEventsSystem, raycastSystem } from "@dcl/sdk/ecs";
import { signedFetch } from "~system/SignedFetch";
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math";
import * as ui from 'dcl-ui-toolkit'
import { IntervalUtil } from '../meta-decentrally/modules/interval-util';
import { movePlayerTo } from '~system/RestrictedActions';
import { onIdleStateChangedObservable } from '../back-ports/onIdleStateChangedObservable';

//initRegistry()
//initConfig()

// play ambient music
//playLoop(ambienceSound, 0.4);

//
// Request login with MetaMask
//
// const dclAuthURL = 'http://localhost:3000/api/dcl/auth'
 //'https://dev.metadoge.art/api/dcl/auth'

 
///src/gamimall/login-flow.ts
//TODO remake this!!!

const CLASSNAME = "padLogic"

export function initPad(_scene:Entity){
  const METHOD_NAME = "initPad"

  log(CLASSNAME,METHOD_NAME,"ENTRY");
  if(CONFIG.SCENE_TYPE !== SCENE_TYPE_GAMIMALL){
    log(CLASSNAME,METHOD_NAME,"DISABLED FOR SCENE TYPE",CONFIG.SCENE_TYPE)
    return
  }

  const pad = engine.addEntity()
  
  Transform.create(pad,{
    position: Vector3.create(
      25.78313446044922,
      0.8795676231384277,
      49.322696685791016
    ),
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1),
    parent: _scene
  });

  GltfContainer.create(pad,{
    src:"models/AutoPad.gltf"
  })
  const animClipName = "Pad.001Action.002"

  Animator.create(pad,{
    states:[
      {
        //name: animClipName,
        clip: animClipName,
        playing: false,
        loop: true,
        speed: 0.48
      }
    ]
  })
  //pad.addComponent(new Animator());
  //const padAnimatorStat = new AnimationState(animClipName, {});
  //pad.getComponent(Animator).addClip(padAnimatorStat);
  //padAnimatorStat.stop();

  REGISTRY.entities.pad = { entity: pad }//, moveAnimState: padAnimatorStat };
  //REGISTRY.entities.pad.moveAnimState.speed = .6


  let summonPadTimeoutId:number|undefined = undefined
  function summonPad(){
    resetPad();

    movePlayerTo({newRelativePosition:{ x:30.41, y: 8, z: 25.8 }, cameraTarget:{ x:30.41, y: 2, z: 15.44 }});
  }

  let resetPadTimeoutId:number|undefined = undefined
  function resetPad() {
    //workaround here
    //play the animation and reset its cursor
    Animator.playSingleAnimation(pad, animClipName, true)

    //must give it a second, some bug with animation
    //cause it to start off/ahead by a few meters
    //must let it start playing to solve it
    if(resetPadTimeoutId){
      utils.timers.clearTimeout(resetPadTimeoutId)
      resetPadTimeoutId = undefined
    }
    resetPadTimeoutId = utils.timers.setTimeout(() => {
      Animator.stopAllAnimations(pad,true)
    },110)
  }

  resetPad(); //so in intial state

  const padSummon = engine.addEntity()
  //engine.addEntity(padSummon);
  //padSummon.setParent(_scene);
  Transform.create(padSummon,{
    position: Vector3.create(48, 0, 40),
    rotation: Quaternion.create(0, 0, 0, 1),
    scale: Vector3.create(1, 1, 1),
    parent: _scene
  });

  GltfContainer.create(padSummon,{
    src:"models/summonpad.glb"
  })

  pointerEventsSystem.onPointerDown(
    {
      entity:padSummon,
      opts: {
          button: InputAction.IA_POINTER,
          hoverText: "Summon Pad",
      }
    },
    (e) => {
      summonPad()
    }
  )

  


  const MAX_DISTANCE = 3.5

  const offset=Vector3.create(0, .1, 0)//move up from feet a tiny bit
  const distance=Vector3.create(0, -1*MAX_DISTANCE, 0)//seems a player can jump about 2x their height



  const checkInterval = new IntervalUtil(250,'delta')  
  const SHUTTLE_PAD_MESH_NAME = "Pad_collider" //name of mesh for the shutte pad to start
  //WORKAROUND - adding to ray cast over and over breaks and ray casts stop resolving even if i make a new object, no idea why
  //for now do continuous seems most reliable
  const CONTIUOUS_CAST = false 
  let USE_NEW_ENT_EACH_TIME = false
  let lastResultTicketNumber = -1
  let retryCounter = 0

  let onPad = false
  let rayCastRegistered = false

  const enableDebug = false
 

  //WORKAROUND bounce between 2 entities for raycast
  let rayCastUsedIdx = 0
  const rayEnts:Entity[] = []

  rayEnts.push(createEntity());
  rayEnts.push(createEntity());
  rayEnts.push(createEntity());
  rayEnts.push(createEntity());
  
  let rayEntity:Entity|undefined = rayEnts[0]
   

  function workaroundClearRayEntity(){
    //workaround, ray cast does not do well with resubmissions of ray cast with same entity
    //so must make a new one:(
    if(!CONTIUOUS_CAST && rayEntity){
      if(USE_NEW_ENT_EACH_TIME){
        engine.removeEntity(rayEntity)
        rayEntity = undefined
        if(enableDebug) log(CLASSNAME,METHOD_NAME,"workaroundClearRayEntity","rayResult","rayEntity",rayEntity,"all new each time")
      }else{
        //this seems to have worked
        RaycastResult.deleteFrom(rayEntity)
        Raycast.deleteFrom(rayEntity)

        rayEntity = rayEnts[rayCastUsedIdx++]
        if(rayCastUsedIdx >= rayEnts.length){
          rayCastUsedIdx = 0
        } 
        if(enableDebug) log(CLASSNAME,METHOD_NAME,"workaroundClearRayEntity","rayResult","rayEntity",rayEntity,rayCastUsedIdx,"reusing pool")
      }
      
    } 
  }
  function createRayCastEntityIfNeeded(){
    if(rayEntity === undefined){
      rayEntity = createEntity()
    }
    return rayEntity
  }
  function createEntity(){ 
    const rayEntity = engine.addEntity()
    if(enableDebug) MeshRenderer.setBox(rayEntity)
    //TODO consider AvatarAnchorPointType.AAPT_POSITION
    AvatarAttach.create(rayEntity,{anchorPointId:AvatarAnchorPointType.AAPT_NAME_TAG});
    return rayEntity
  }
  function handleResult(rayResult:PBRaycastResult) {
    //debugger 
    if(enableDebug) log(CLASSNAME,METHOD_NAME,"system","rayResult","rayEntity",rayEntity,rayResult)

    let _onPad = false

    if(!CONTIUOUS_CAST) rayCastRegistered = false
    
    if(rayResult){
      // Do stuff
      //log("rayFromPlayerButt HIT hitFirst ",e.didHit,e.entity.meshName,e.entity.entityId)
      //if (this.padInit && e.didHit && e.entity.meshName == SHUTTLE_PAD_MESH_NAME) {
      if(rayResult.hits && rayResult.hits.length > 0 && rayResult.hits[0].position){
        for(const p of rayResult.hits){
          if(p.meshName === SHUTTLE_PAD_MESH_NAME){
            //log(CLASSNAME,METHOD_NAME,"system","hit",SHUTTLE_PAD_MESH_NAME,rayResult)
            //REGISTRY.entities.pad.moveAnimState.play();
            Animator.playSingleAnimation(pad, animClipName, false)
            _onPad = true
            break;
          } else {
            //fall back to hit any, then die
            //this.hitAnyCount = 1
            //REGISTRY.entities.pad.moveAnimState.pause();
            
          }
        }
      }
            
      if(onPad && _onPad === false){
        Animator.stopAllAnimations(pad, false)
      }
      onPad = _onPad

      //log(CLASSNAME,METHOD_NAME,"system","onPad",onPad)
    }
  }

  
  engine.addSystem((dt:number) => {

    rayEntity = createRayCastEntityIfNeeded()
    //must check every frame for result
    const rayResult = RaycastResult.getOrNull(rayEntity)
    if(rayResult && rayResult.tickNumber != lastResultTicketNumber){
      lastResultTicketNumber = rayResult.tickNumber
      handleResult(rayResult as PBRaycastResult);
      if(!CONTIUOUS_CAST) RaycastResult.deleteFrom(rayEntity)
      workaroundClearRayEntity()
    }else{
      //if(enableDebug) log(CLASSNAME,METHOD_NAME,"system","same ticket number ignoring",rayResult,lastResultTicketNumber )
    }

    if(!checkInterval.update(dt)){
      //log(CLASSNAME,METHOD_NAME,"system","not time yet skipping...",dt,checkInterval.elapsedTime,checkInterval.targetTime )
      return
    }

    
    
    if(!rayCastRegistered || retryCounter > 2){
      if(enableDebug) log(CLASSNAME,METHOD_NAME,"system","register ray cast","rayEntity",rayEntity,dt,checkInterval.elapsedTime,checkInterval.targetTime)
      
      if(retryCounter > 2){
        //revert to known working way if something bugs out
        USE_NEW_ENT_EACH_TIME = true
        if(enableDebug) log(CLASSNAME,METHOD_NAME,"system","FORCING register ray cast","rayEntity",rayEntity,dt,checkInterval.elapsedTime,checkInterval.targetTime)
        workaroundClearRayEntity()
        rayEntity = createRayCastEntityIfNeeded()
      }
      retryCounter = 0
      rayCastRegistered = true

      if(!CONTIUOUS_CAST) RaycastResult.deleteFrom(rayEntity)

      Raycast.createOrReplace(rayEntity as Entity, {
        continuous: CONTIUOUS_CAST,
        //direction: {$case:"localDirection", localDirection:Vector3.create(0, -1, 0)},
        direction: {$case:"globalDirection", globalDirection:Vector3.create(0, -1, 0)},
        //origin: Vector3.create(transform.position.x,18, transform.position.z),
        //direction: {localDirection:Vector3.create(0, -1, 0)},
        maxDistance: MAX_DISTANCE,
        queryType: RaycastQueryType.RQT_QUERY_ALL
      })
      
      /*
      //new ray cast
      raycastSystem.registerLocalDirectionRaycast(
        {
          entity: rayEntity,
          opts: {
            continuous: false,
            direction: Vector3.create(0, -1, 0),
            //origin: Vector3.create(transform.position.x,18, transform.position.z),
            //direction: {localDirection:Vector3.create(0, -1, 0)},
            maxDistance: MAX_DISTANCE,
            queryType: RaycastQueryType.RQT_QUERY_ALL
          },
        },
        (rayResult) => {
          handleResult(rayResult as PBRaycastResult)
          if(!CONTIUOUS) raycastSystem.removeRaycasterEntity(rayEntity)
          workaroundClearRayEntity()
        }
      )
      */
    }else{
      if(enableDebug) log(CLASSNAME,METHOD_NAME,"system","already registered ray cast","rayEntity",rayEntity,dt,checkInterval.elapsedTime,checkInterval.targetTime)
      if(!CONTIUOUS_CAST) retryCounter++
    }
  })
  
  
  onIdleStateChangedObservable.add((isIdle)=>{
    log(CLASSNAME,"onIdleStateChangedObservable","ENTRY","player idle data is ", isIdle,"onPad",onPad)
    if(isIdle){
      //send player to pad //with cooldown
      if(!onPad){
       // summonPad()
      }else{
        log(CLASSNAME,"onIdleStateChangedObservable","player idle data is ", isIdle,"but already on pad",onPad)
      }
    }else{
      
    }
  })
}