
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

import * as serverStateSpec from './state/MyRoomStateSpec'

let currentRealm: string | null = null
let currentRoom: string | null = null

const CLASS_NAME = "PlayerTransformSystem"


const dataToSend: serverStateSpec.PlayerTransformState = {
  position: {x:0,y:0,z:0},
  serverTime: -1,
  rotation: { x:0,y:0,z:0,w:0 }
}
//const checkParcleInterval = new IntervalUtil(1000)//check a little faster than connection check
export class PlayerTransformSystem  {
  checkInterval = new IntervalUtil(CONFIG.SEND_RACE_DATA_FREQ_MILLIS)
  connected: boolean = false
  isPreview: boolean = false
  
  async update(dt: number) {
    const METHOD_NAME = "update"

    const playerPos = Transform.getOrNull(engine.PlayerEntity)
    
    if(!this.checkInterval.update(dt)){
      return;
    }

    this.connected = GAME_STATE.gameConnected === "connected"
    
    if(!isPxEnabled()){
      log(CLASS_NAME,METHOD_NAME,"px not enabled, skipping","GAME_STATE.gameConnected ",GAME_STATE.gameConnected ,"connectRetryCount",GAME_STATE.connectRetryCount,"CONFIG.GAME_CONNECT_RETRY_MAX",CONFIG.GAME_CONNECT_RETRY_MAX)
      return
    }
 

    if (playerPos !== null && GAME_STATE.gameRoom !== null && GAME_STATE.gameRoom !== undefined) {
      dataToSend.position= playerPos.position
      dataToSend.rotation= playerPos.rotation
      
      //log(CLASS_NAME,METHOD_NAME,"sending...","GAME_STATE.gameConnected ",GAME_STATE.gameConnected ,"dataToSend",dataToSend)

      GAME_STATE.gameRoom.send("player.transform.update",dataToSend)
    }
    
  }
  constructor() {
    
  }
}
 

//if(CONFIG.GAME_COIN_AUTO_START &&  myConnectSystem) engine.addSystem(myConnectSystem)

export function initPlayerTransformSystem(){
  const playerPosSys = new PlayerTransformSystem()

  engine.addSystem((dt:number)=>{ playerPosSys.update(dt) })
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
