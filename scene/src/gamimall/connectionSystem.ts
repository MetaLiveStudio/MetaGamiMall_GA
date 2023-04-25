import { getCurrentRealm, isPreviewMode } from '@decentraland/EnvironmentAPI'
import { connect } from './connection'
//import { onConnect } from './onConnect'
import { Room } from 'colyseus.js'
import { CONFIG } from 'src/config'
import { startGame } from './gameplay'
import { IntervalUtil } from 'src/meta-decentrally/modules/interval-util'
import { GAME_STATE } from 'src/state'
import { isNull } from 'src/utils'
import { REGISTRY } from 'src/registry'

let currentRealm: string | null = null
let currentRoom: string | null = null

const CLASS_NAME = "ConnectSystem"

const checkInterval = new IntervalUtil(2000)
export class ConnectSystem implements ISystem {
  
  connected: boolean = false
  isPreview: boolean = false
  checking: boolean = false
  async update(dt: number) {
    const METHOD_NAME = "update"

    if(!checkInterval.update(dt)){
      return;
    }
    if(GAME_STATE.connectRetryCount > CONFIG.GAME_CONNECT_RETRY_MAX){
      log(CLASS_NAME,METHOD_NAME,"connect retry count hit max, will not try again","connectRetryCount",GAME_STATE.connectRetryCount,"CONFIG.GAME_CONNECT_RETRY_MAX",CONFIG.GAME_CONNECT_RETRY_MAX)
      return;
    }
    if(isNull(GAME_STATE.playerState.playFabLoginResult)){
      log(CLASS_NAME,METHOD_NAME,"not logged in yet",GAME_STATE.playerState.playFabLoginResult)
      return;
    }
    
    if( this.checking ){
      log(CLASS_NAME,METHOD_NAME,"mid check, skip",this.checking,GAME_STATE.gameConnected)
      return;
    }
    if( GAME_STATE.gameConnected === 'connecting' || GAME_STATE.gameConnected === 'disconnecting' ){
      log(CLASS_NAME,METHOD_NAME,"mid check, skip",this.checking,GAME_STATE.gameConnected)
      return;
    }
    if( GAME_STATE.gameRoom !== null && GAME_STATE.gameRoom !== undefined ){
      log(CLASS_NAME,METHOD_NAME,"currently connected to " , GAME_STATE.gameRoom.name, GAME_STATE.gameRoomData !== undefined ? GAME_STATE.gameRoomData.id : "???" )
      return;
    }
    
    if( GAME_STATE.gameRoomTarget === "racing" ){
      log(CLASS_NAME,METHOD_NAME,"skip trying to connect to ",GAME_STATE.gameRoomTarget)
      return;
    }
      
    this.checking = true
    const realm = await getCurrentRealm()
    if (!realm || (!this.isPreview && !realm.room)) {
      log(CLASS_NAME,METHOD_NAME,'no room yet!')
      this.checking = false
      return false
    } else { 
        
      GAME_STATE.connectRetryCount++
 
      currentRealm = realm.displayName
      currentRoom = realm.room
      log(CLASS_NAME,METHOD_NAME,'CONNECTING TO default room',"connectRetryCount",GAME_STATE.connectRetryCount,"CONFIG.GAME_CONNECT_RETRY_MAX",CONFIG.GAME_CONNECT_RETRY_MAX,"GAME_STATE.gameConnected",GAME_STATE.gameConnected)
      //this is not blocking!!!! need way to know when finished or not
      startGame(); 

      this.connected = GAME_STATE.gameConnected === "connected"
      this.checking = false
 
      //engine.removeSystem(this)
    
    }
  }
  constructor() {
    this.getPreviewMode()
  }
  async getPreviewMode() {
    this.isPreview = await isPreviewMode()
  }
}

let myConnectSystem = new ConnectSystem()
REGISTRY.intervals.connectCheckInterval = checkInterval
if(CONFIG.GAME_COIN_AUTO_START &&  myConnectSystem) engine.addSystem(myConnectSystem)


// // ground
// let floor = new Entity()
// floor.addComponent(new GLTFShape('models/FloorBaseGrass.glb'))
// floor.addComponent(
//   new Transform({
//     position: new Vector3(23*16/2, 0, 23*16/2),
//     scale: new Vector3(24, 0.1, 24),
//   })
// )
// engine.addEntity(floor)
