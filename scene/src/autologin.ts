import * as utils from '@dcl/ecs-scene-utils';
import { UserData } from '@decentraland/Identity';
import { CONFIG } from "./config";
import { Constants as DecentRallyConstants } from "src/meta-decentrally/modules/resources/globals";
//import { Constants } from './modules/resources/globals';
//import { player, scene } from './modules/scene';
//import { Constants.SCENE_MGR } from "./modules/scene/raceSceneManager";
import { GAME_STATE } from 'src/state';
import { REGISTRY } from './registry';

function getUserId(){
  let userId = 'not-set-yet'
  if(GAME_STATE && GAME_STATE.playerState && GAME_STATE.playerState.dclUserData){
    userId = GAME_STATE.playerState.dclUserData.userId
  }
  return userId
}
//copied from decentrally however intergrated witht the scene as a whole
function doPlayerMainLogin(){
    
  if(!GAME_STATE.playerState.loginSuccess){
    //TODO add 'doLoginFlow' to REGISTRY
      DecentRallyConstants.doLoginFlow(
          { 
            onSuccess:()=>{
              //fetch leaderboards
            }
          }
        )
      //GAME_STATE.playerState.requestDoLoginFlow()
  }else{
      log("onEnterSceneObservable.player already logged in: ", GAME_STATE.playerState.loginSuccess,GAME_STATE.playerState.loginFlowState)
  }
}

//TODO consider login button so dont waist logins on passer-bys
export function addAutoPlayerLoginTrigger(){
  if(CONFIG.LOGIN_FLOW_TYPE != 'dclSignedFetch' || !CONFIG.AUTO_LOGIN_ENABLED){
      //DISABLED
      log("addAutoPlayerLoginTrigger disabled for now",CONFIG.LOGIN_FLOW_TYPE,CONFIG.AUTO_LOGIN_ENABLED)
      return 
  }
  log("addAutoPlayerLoginTrigger running now",CONFIG.LOGIN_FLOW_TYPE,CONFIG.AUTO_LOGIN_ENABLED)

  //only triggers on enter. does not trigger on local if already in the scene. make a trigger instead so fires when inside?
  onEnterSceneObservable.add((player) => {
      log("onEnterSceneObservable.player entered scene.doPlayerMainLogin: ", player.userId)
      doPlayerMainLogin()
  })
  
  const centerEntity = new Entity();
  engine.addEntity(centerEntity)
  centerEntity.addComponent(new Transform({
    position:new Vector3(CONFIG.sizeX/2, 1, CONFIG.sizeZ/2)
    ,scale:new Vector3(1,33,1)
  }))
  //if( CONFIG.DEBUGGING_ENABLED && CONFIG.DEBUGGING_UI_ENABLED ){
    /*
      centerEntity.addComponent( new BoxShape() )
      centerEntity.addComponent( new OnPointerDown(
          ()=>{},
          { 
              hoverText:"Centered in scene. (Only visible in debug mode)"
          }
      ) )*/
  //}

  let triggerBox = new utils.TriggerBoxShape(new Vector3(CONFIG.sizeX-1,3,CONFIG.sizeZ-1), new Vector3(0, 1, 0))
  //workaround make a trigger also so fires when in local doing testing
  utils.addOneTimeTrigger(triggerBox, {
      onCameraEnter : () => {
          log("addOneTimeTrigger.onCameraEnter.player entered scene.doPlayerMainLogin: ", getUserId())
          doPlayerMainLogin() 
      },
      enableDebug: false
  },centerEntity)
}