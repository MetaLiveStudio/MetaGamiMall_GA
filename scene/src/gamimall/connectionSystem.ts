
import { connect, disconnect, showConnectingEnded, showConnectingStarted } from './connection'
//import { onConnect } from './onConnect'
import { Room } from 'colyseus.js'

import { PARCELS_PX_DISABLED, PARCEL_16_METERS, isPxEnabled, setPxEnabled } from '../ui/ui_px'
import { log } from '../back-ports/backPorts'
import { getRealm } from '~system/Runtime'
import { IntervalUtil } from '../meta-decentrally/modules/interval-util'
import { isNull } from '../utils'
import { GAME_STATE } from '../state'
import { CONFIG } from '../config'
import { startGame } from '../gameplay'
import { REGISTRY } from '../registry'
import { Transform, engine } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

let currentRealm: string | null = null
let currentRoom: string | null = null

const CLASS_NAME = "ConnectSystem"


export class ConnectSystem  {
  
  checkInterval:IntervalUtil
  checkParcleInterval:IntervalUtil

  connected: boolean = false
  isPreview: boolean = false
  checking: boolean = false
  async update(dt: number) {
    const METHOD_NAME = "update"

    const playerPos = Transform.getOrNull(engine.PlayerEntity)
    if(this.checkParcleInterval.update(dt) && playerPos !== null){
      const parcelVec =  Vector3.floor(Vector3.divide(playerPos.position,PARCEL_16_METERS))//Camera.instance.worldPosition.divide(PARCEL_16_METERS).floor()
      
      if(!isNull(PARCELS_PX_DISABLED[parcelVec.x.toString()]?.[parcelVec.z.toString()])){
        log(CLASS_NAME,METHOD_NAME,"px disabled for this parcel",parcelVec)
        setPxEnabled(false)
        return;
      }else{
        setPxEnabled(true)
      }
    }

    if(!this.checkInterval.update(dt)){
      return;
    }

    this.connected = GAME_STATE.gameConnected === "connected"
    
    if(!isPxEnabled()){
      if(this.connected){
        //force disconnect again
        const FORCE = true
        setPxEnabled(false,FORCE)
      }
      log(CLASS_NAME,METHOD_NAME,"px not enabled, skipping","GAME_STATE.gameConnected ",GAME_STATE.gameConnected ,"connectRetryCount",GAME_STATE.connectRetryCount,"CONFIG.GAME_CONNECT_RETRY_MAX",CONFIG.GAME_CONNECT_RETRY_MAX)
      return
    }
 
    if(GAME_STATE.connectRetryCount > CONFIG.GAME_CONNECT_RETRY_MAX){
      log(CLASS_NAME,METHOD_NAME,"connect retry count hit max, will not try again","connectRetryCount",GAME_STATE.connectRetryCount,"CONFIG.GAME_CONNECT_RETRY_MAX",CONFIG.GAME_CONNECT_RETRY_MAX)
      showConnectingEnded(false)
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
    const realm = await getRealm({})
    if (!realm || (!this.isPreview && (realm.realmInfo === undefined || !realm.realmInfo.realmName))) {
      log(CLASS_NAME,METHOD_NAME,'no room yet!')
      this.checking = false
      return false
    } else { 
        
      showConnectingStarted()
      GAME_STATE.connectRetryCount++
 
      if(realm.realmInfo !== undefined ) currentRealm = realm.realmInfo.realmName
      //currentRoom = realm.room
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
    //TODO consider using CONFIG.IN_PREVIEW to force preview check?
    this.isPreview = CONFIG.IN_PREVIEW//(await getRealm({})).realmInfo?.isPreview ?? true
  }
}


//if(CONFIG.GAME_COIN_AUTO_START &&  myConnectSystem) engine.addSystem(myConnectSystem)

export function initConnectionSystem(){
  const checkInterval = new IntervalUtil(2000)
  const checkParcleInterval = new IntervalUtil(1000)//check a little faster than connection check

  const myConnectSystem = new ConnectSystem()
  myConnectSystem.checkInterval = checkInterval
  myConnectSystem.checkParcleInterval = checkParcleInterval

  REGISTRY.intervals.connectCheckInterval = checkInterval

  engine.addSystem((dt:number)=>{ myConnectSystem.update(dt) })
}

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
