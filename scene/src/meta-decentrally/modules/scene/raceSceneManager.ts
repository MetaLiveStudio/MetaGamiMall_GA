import * as ui from "@dcl/ui-scene-utils";
import { CONFIG } from 'src/meta-decentrally/config'
import { REGISTRY } from 'src/registry'
import { GAME_STATE } from 'src/state'
import { Constants } from '../resources/globals'
import { player, scene } from '../scene'
import { Game_2DUI } from '../ui/index'
import { isNull, realDistance } from '../utilities'
import { LobbyScene } from './lobby'
import { RacingScene } from './race'
import { IRaceSceneManager } from './raceSceneManagerInterface'
import { SceneManager } from './sceneManager'
import { SceneVector3Type, SpawnPoint } from './types'
//import * as gameUI from "../ui/index";
import * as utils from '@dcl/ecs-scene-utils'
import { disconnect } from 'src/gamimall/connection'

const CLASS_NAME = "RaceSceneManager"
export class RaceSceneManager extends SceneManager implements IRaceSceneManager{

  static instance:RaceSceneManager
 
  static getInstance(){
    if(!RaceSceneManager.instance || RaceSceneManager.instance === undefined){
      RaceSceneManager.instance = new RaceSceneManager();
    }
    return RaceSceneManager.instance
  } 

  lobbyScene:LobbyScene
  racingScene:RacingScene
  playerLocationBeforeRace:Vector3

  goRace(force?:boolean){
    const METHOD_NAME = "goRace"
    log(CLASS_NAME,METHOD_NAME,"ENTRY");
    this.racingScene.toggleColliders(true)

    GAME_STATE.gameRoomTarget = "racing"

    //use a timer to give colliders chance to get ready
    utils.setTimeout(300,()=>{
      //debugger
    /*Constants.doLoginFlow(
        {
          onSuccess:()=>{ */
            //fallback catch incase login did not work, enforce it again
            if (isNull(GAME_STATE.playerState.playFabLoginResult)) {
              log(CLASS_NAME,METHOD_NAME,"player not logged in yet");
              //ui.displayAnnouncement("Player not logged in yet");
              REGISTRY.ui.openloginGamePrompt();
              return;
            }
            const alreadyRacing = this.racingScene.visible
            
            //-3 for player height with padding if standing on stuff
            
            this.capturePlayerLobbyPosition()

            if( (force === undefined || !force ) && alreadyRacing ){
              log(CLASS_NAME,METHOD_NAME,"already racing")
              //run these anyway just in case state got messed up
              this.changeToScene(this.racingScene)

              REGISTRY.sceneMgr.hideAllScenes()
              REGISTRY.ui.gameTools.hide()
              REGISTRY.sceneMgr.rootScene.disableSystems() 

              this.racingScene.movePlayerHere()
            }else{
              if(!Constants.showedHowToPlayAlready){
                Constants.Game_2DUI.openHowToPlayPrompt()
              }else{
                const startGameFn = ()=>{ 

                  this.changeToScene(this.racingScene)

                  REGISTRY.sceneMgr.hideAllScenes()
                  REGISTRY.ui.gameTools.hide()
                  REGISTRY.sceneMgr.rootScene.disableSystems()

                  this.racingScene.movePlayerHere()
                  this.racingScene.initRace(force)
                }
                //debugger
                //disconnect if currently playing other game
                if( GAME_STATE.gameRoom !== null && GAME_STATE.gameRoom !== undefined 
                    && GAME_STATE.gameRoom !== undefined 
                    && GAME_STATE.gameRoom.name !== CONFIG.GAME_RACE_ROOM_NAME ){ 
                  log(CLASS_NAME,METHOD_NAME,"currently connected to, disconnect that one " , GAME_STATE.gameRoom.name, GAME_STATE.gameRoomData?.id )

                  ui.displayAnnouncement("Launching DecentRally...",Math.min(3,CONFIG.GAME_OTHER_ROOM_DISCONNECT_TIMER_WAIT_TIME-1))

                  //TODO consider popup to confirm?
                  GAME_STATE.gameRoom.send("quit-game",{});
                  //ADD TIMER IF takes longer than X do this anyways
                  //popup a quitting screen.
                  GAME_STATE.setGameConnected('disconnecting',"goRace")
                  GAME_STATE.setGameHudActive(false);
                  GAME_STATE.setGameStarted(false); 
                  
                  //waiting 3.5 seconds is kind of long bit need time for stats to be collected
                  utils.setTimeout(CONFIG.GAME_OTHER_ROOM_DISCONNECT_TIMER_WAIT_TIME,()=>{
                    log("endGame.timer.force.disconnected","GAME_STATE.gameConnected",GAME_STATE.gameConnected)
                    if(GAME_STATE.gameConnected === 'disconnecting' && GAME_STATE.gameRoom !== null && GAME_STATE.gameRoom !== undefined){
                      disconnect(true)
                      GAME_STATE.setGameStarted(false);
                      GAME_STATE.setGameHudActive(false);
                      log("endGame.timer.already disconnect again and now start","GAME_STATE.gameConnected",GAME_STATE.gameConnected)
                      startGameFn()
                    }else{ 
                      log("endGame.timer.already disconnected","GAME_STATE.gameConnected",GAME_STATE.gameConnected)
                      startGameFn()
                    }
                  })

                  /*//can we add disconnect call back instead of timer?
                  utils.setTimeout(CONFIG.GAME_OTHER_ROOM_DISCONNECT_TIMER_WAIT_TIME,()=>{//is 300 ms long enough?  probably not. 
                    log(CLASS_NAME,METHOD_NAME,"starting game after 300 ms disconnect wait " )
                    
                  })*/
                } else {
                  startGameFn()
                } 

                
              }
            }
          //}
        //}
      //)
    })
  } 
  goLobby(force?:boolean){
    const METHOD_NAME = "goLobby"
    const forceGo = force !== undefined && force
 
    GAME_STATE.gameRoomTarget = "lobby"

      if(!forceGo && this.racingScene.visible){
        //log("gameUI.openEndGameConfirmPrompt",gameUI)
        Game_2DUI.openEndGameConfirmPrompt() 
      }else{
        ///endGame|ConnectSystem|setGameConnected|onGameLeaveDisconnect|room.msg.finished|roomAboutToDisconnect/
        ///endGame|ConnectSystem|setGameConnected|onGameLeaveDisconnect|room.msg.finished|roomAboutToDisconnect/
          log(CLASS_NAME,METHOD_NAME,"currently connected to, RACING disconnect that one " , GAME_STATE.gameRoom.name, GAME_STATE.gameRoomData?.id )
          //TODO consider popup to confirm?
          GAME_STATE.gameRoom.send("quit-game",{});
          //ADD TIMER IF takes longer than X do this anyways
          //popup a quitting screen.
          if( GAME_STATE.gameConnected !== 'disconnected' && GAME_STATE.gameRoom !== null && GAME_STATE.gameRoom !== undefined){
            GAME_STATE.setGameConnected('disconnecting',"goLobby.entry")
          
            GAME_STATE.setGameHudActive(false);
            GAME_STATE.setGameStarted(false);
            //waiting 3.5 seconds is kind of long bit need time for stats to be collected
            utils.setTimeout(CONFIG.GAME_OTHER_ROOM_DISCONNECT_TIMER_WAIT_TIME,()=>{
              log("endGame.timer.force.disconnected RACING","GAME_STATE.gameConnected",GAME_STATE.gameConnected)
              if( GAME_STATE.gameConnected === 'disconnecting' && GAME_STATE.gameRoom !== null && GAME_STATE.gameRoom !== undefined){
                this.racingScene.exitRace()
              }else{ 
                log("endGame.timer.already RACING disconnected","GAME_STATE.gameConnected",GAME_STATE.gameConnected)
                //this.racingScene.exitRace()
                this.racingScene.exitRace() 
                GAME_STATE.setGameConnected('disconnected',"goLobby.after.timer")
                
              }
            })
          }else{
            this.racingScene.exitRace() 
            GAME_STATE.setGameConnected('disconnected',"goLobby.after.non timer")
          }
        
        
        this.changeToScene(this.lobbyScene)

        REGISTRY.sceneMgr.moveTo(REGISTRY.sceneMgr.rootScene.sceneName)
        REGISTRY.ui.gameTools.show()
        REGISTRY.sceneMgr.rootScene.enableSystems()

        const cameraLook = scene.center.clone()
        cameraLook.y = 8
        const spawnPoint:SpawnPoint = new SpawnPoint({
          position: new SceneVector3Type( this.playerLocationBeforeRace.x,this.playerLocationBeforeRace.y,this.playerLocationBeforeRace.z ),
          cameraLookAt: cameraLook
        })
        //spawnPoint.position._cachedFixedPosition = this.playerLocationBeforeRace
        this.lobbyScene.movePlayerHere(spawnPoint)
      }
    
  }

  capturePlayerLobbyPosition(){
    if( player.camera.position.y  < scene.raceGroundElevation - 3 ){
      this.playerLocationBeforeRace = new Vector3().copyFrom( player.camera.position )

      //also check distance from center which is not a place to be spawned

      const centerIgnoreHeight = new Vector3().copyFrom(scene.center)
      centerIgnoreHeight.y = this.playerLocationBeforeRace.y
      const distFromCenter = realDistance(this.playerLocationBeforeRace,centerIgnoreHeight)
      log("goRace check dist from center",this.playerLocationBeforeRace,distFromCenter)
      const minDistance = 8
      if(distFromCenter < minDistance){
        //how did they start a game from in side the tower?
        //TODO have predefined spawn spots?
        this.playerLocationBeforeRace.x += (minDistance-this.playerLocationBeforeRace.x)
        this.playerLocationBeforeRace.y += 1 //to avoid spawning inside something
        log("goRace move out from center",this.playerLocationBeforeRace,distFromCenter)
      }

    }else{
      log("goRace playerLocationBeforeRace player in race so dont capture",this.playerLocationBeforeRace)
      //see if has value, if missing for some reason pick a safe respawn point
      //this.playerLocationBeforeRace
    }
  }
}

//export const SCENE_MGR = new RaceSceneManager();
export function initSceneMgr(){
  Constants.SCENE_MGR = RaceSceneManager.getInstance()
}
 