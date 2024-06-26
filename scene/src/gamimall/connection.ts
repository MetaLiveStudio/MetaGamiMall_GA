//
// IMPORTANT :
// - trying vanilla without refernce imports and see if it works
//
import * as utils from '@dcl-sdk/utils'
import * as ui from 'dcl-ui-toolkit'
import { Color4 } from "@dcl/sdk/math";
import { Client, Room } from "colyseus.js";
import { log } from "../back-ports/backPorts";
import { getUserData } from "~system/UserIdentity"
import { getRealm } from "~system/Runtime"
import { GAME_STATE } from "../state";
import { CONFIG } from "../config";
import { decodeConnectionCode, isErrorCode, isNormalDisconnect, removeGameElements } from "../gamimall/connection-utils";
import { CenterLabel } from "../ui/ext/CenterLabel";
import { fetchColyseusInfo } from '../store/fetch-utils';
//import { isPreviewMode, getCurrentRealm } from '@decentraland/EnvironmentAPI'
//import { getUserData } from "@decentraland/Identity";

const CLASSNAME = "connection.ts"

class ConnectionEventReg {
    onJoinActions?: (room: Room, eventName: string) => void;
}
  
export const CONNECTION_EVENT_REGISTRY = new ConnectionEventReg();
  
/*
export async function connect(roomName: string, options: any = {}) {
    GAME_STATE.setGameConnected("connecting")

    const realm = await getRealm({

    });
    const isPreview = realm.realmInfo?.isPreview

    //
    // make sure users are matched together by the same "realm".
    //
    //used for matching rooms
    //for px prefixing with "px-scene:"
    options.playerId = GAME_STATE.playerState.playerDclId;
    options.randomId = Math.random()//GAME_STATE.playerState.playerDclId;
    options.realm = realm?.realmInfo?.realmName;

    //other data
    //options.userData = await getUserData({});
    options.userData = GAME_STATE.playerState.dclUserData;

    options.playFabData = {
        id: GAME_STATE.playerState.playFabLoginResult?.PlayFabId,
        sessionTicket: GAME_STATE.playerState.playFabLoginResult?.SessionTicket,
        titleId: CONFIG.PLAYFAB_TITLEID
    };

    log(
        "userData:",
        options.userData + " playFabData:",
        options.playFabData + " isPreview " + isPreview
    );

    //const ENDPOINT = CONFIG.COLYSEUS_ENDPOINT
    const ENDPOINT = isPreview
    ? CONFIG.COLYSEUS_ENDPOINT_LOCAL // local environment
    : CONFIG.COLYSEUS_ENDPOINT_NON_LOCAL; // production environment

    log("connecting to " + ENDPOINT);
    if (isPreview || CONFIG.SHOW_CONNECTION_DEBUG_INFO) {
    addConnectionDebugger(ENDPOINT);
    }
    const client = new Client(ENDPOINT);


    try {
        //
        // Docs: https://docs.colyseus.io/client/client/#joinorcreate-roomname-string-options-any
        //
        const room = await client.joinOrCreate<any>(roomName, options);
        GAME_STATE.gameRoomInstId = new Date().getTime();
        //TODO ADD BACK updateConnectionGame(room, "connect");
        if (isPreview || CONFIG.SHOW_CONNECTION_DEBUG_INFO) {
        updateConnectionDebugger(room);
        }

        return room;
    } catch (e: any) {
        log("connect. room.event.connection error", ENDPOINT, e);
        log("connect. room.event.connection error", ENDPOINT, ".....");
        
        GAME_STATE.setGameConnectedCode(e.code);
        GAME_STATE.setGameErrorMsg(e);
        GAME_STATE.setGameConnected("error");
        GAME_STATE.setGameStarted(false);
        GAME_STATE.setGameHudActive(false);
        GAME_STATE.setScreenBlockLoading(false);
    
        console.error(e)
        updateConnectionMessage(
          `Error: ${e.message} ` + decodeConnectionCode(e.code),
          Color4.Red()
        );
        
        throw e;
    }
}*/

const CONNECTION_MSG_LEFT_POS = "80%"
const CONNECTION_MSG_Y_OFFSET_BASE = 37 //70 is default
const message: CenterLabel = ui.createComponent(CenterLabel
        , { value: 'Connection status', size: 18,yOffset: CONNECTION_MSG_Y_OFFSET_BASE})
message.color = Color4.Green()
message.xOffset = CONNECTION_MSG_LEFT_POS as any
message.show()



const debugMessageUI: CenterLabel = ui.createComponent(CenterLabel
    , { value: '...', size: 15, yOffset:CONNECTION_MSG_Y_OFFSET_BASE-20})
    debugMessageUI.color = Color4.White()
    debugMessageUI.show()
debugMessageUI.xOffset = CONNECTION_MSG_LEFT_POS as any

function getErrorMsg(e:any){
    if(e.code){
        return e.code + " " + decodeConnectionCode(e.code)
    }else if(e.message){
      return e.message
    }else{
      return e
    }
}

export function initColyseusConnection() {
    if (CONFIG.IN_PREVIEW || CONFIG.SHOW_CONNECTION_DEBUG_INFO)
      addConnectionDebugger("not-started-yet");
}
  
export async function connect(roomName: string, options: any = {}) {
    GAME_STATE.setGameConnected("connecting")
    updateConnectionMessage("connecting to " + roomName, Color4.White())        

    const realm = await getRealm({}); 
    const isPreview = CONFIG.IN_PREVIEW //realm.realmInfo?.isPreview

    //
    // make sure users are matched together by the same "realm".
    //
    options.clientSDK = "7.x.x"
    //used for matching rooms
    //for px prefixing with "px-scene:"
    options.playerId = GAME_STATE.playerState.playerDclId;
    options.randomId = Math.random()//GAME_STATE.playerState.playerDclId;

    options.realmInfo = realm?.realmInfo
    //still passed for room filterby
    options.realm = options.realmInfo.realmName;
  
    //other data
    options.userData = GAME_STATE.playerState.dclUserData;
  
    options.playFabData = {
      id: GAME_STATE.playerState.playFabLoginResult?.PlayFabId,
      sessionTicket: GAME_STATE.playerState.playFabLoginResult?.SessionTicket,
      titleId: CONFIG.PLAYFAB_TITLEID
    };
  
    log(
      CLASSNAME,"connect.userData:",   
      options.userData , " playFabData:",
      options.playFabData , " isPreview " , isPreview
    );
  
    //const ENDPOINT = CONFIG.COLYSEUS_ENDPOINT
    const ENDPOINT = isPreview
      ? CONFIG.COLYSEUS_ENDPOINT_LOCAL // local environment
      : CONFIG.COLYSEUS_ENDPOINT_NON_LOCAL; // production environment*/
  
    log(CLASSNAME,"connecting to " + ENDPOINT);
    if (isPreview || CONFIG.SHOW_CONNECTION_DEBUG_INFO) {
      addConnectionDebugger(`Connecting to ${ENDPOINT}`);
    }
    const client = new Client(ENDPOINT);
  
    try {
      //
      // Docs: https://docs.colyseus.io/client/client/#joinorcreate-roomname-string-options-any
      //
      const room = await client.joinOrCreate<any>(roomName, options);
      GAME_STATE.gameRoomInstId = new Date().getTime();
      updateConnectionGame(room, "connect");
      if (isPreview || CONFIG.SHOW_CONNECTION_DEBUG_INFO) {
        updateConnectionDebugger(room);
      }
  
      return room;
    } catch (e: any) {
      log(CLASSNAME,"connect. room.event.connection error", ENDPOINT, e);
      log(CLASSNAME,"connect. room.event.connection error", ENDPOINT, "44444");
      
      GAME_STATE.setGameConnectedCode(e.code);
      GAME_STATE.setGameErrorMsg( getErrorMsg(e));
      GAME_STATE.setGameConnected("error");
      GAME_STATE.setGameStarted(false);
      GAME_STATE.setGameHudActive(false);
      GAME_STATE.setScreenBlockLoading(false);
  
      updateConnectionMessage(
        `Error: ${e.message} ` + decodeConnectionCode(e.code),
        Color4.Red()
      );
      if (isPreview || CONFIG.SHOW_CONNECTION_DEBUG_INFO) {
        addConnectionDebugger(`Failed Connecting to ${ENDPOINT}`);
      }
      throw e;
    }
}
  
 export async function reconnect(
    roomId: string,
    sessionId: string,
    options: any = {}
  ) {
    log(CLASSNAME,"reconnect entered", roomId, sessionId);
    const isPreview = CONFIG.IN_PREVIEW;
    //const realm = await getRealm({});
    //const isPreview = realm.realmInfo?.isPreview
  
    //const ENDPOINT = CONFIG.COLYSEUS_ENDPOINT
    const ENDPOINT = isPreview
      ? CONFIG.COLYSEUS_ENDPOINT_LOCAL // local environment
      : CONFIG.COLYSEUS_ENDPOINT_NON_LOCAL; // production environment*/
  
    log(CLASSNAME,"reconnecting to " + ENDPOINT);
    updateConnectionMessage("Reconnecting... ", Color4.White())        
    if (isPreview || CONFIG.SHOW_CONNECTION_DEBUG_INFO) {
      addConnectionDebugger(`Connecting to ${ENDPOINT}`);
    }
    const client = new Client(ENDPOINT);
  
    try {
      //
      // Docs: https://docs.colyseus.io/client/client/#joinorcreate-roomname-string-options-any
      //
      //let newRoom = null
      let oldRoom = GAME_STATE.gameRoom;
      const newRoom = await client.reconnect(roomId, sessionId); //.then(room_instance => {
      GAME_STATE.gameRoomInstId = new Date().getTime();
      //newRoom = room_instance;
      //onjoin();
      //was testing with new state 'reconnecting', not sure its needed
      //above updateConnectionMessage states reconnecting on UI
      //GAME_STATE.setGameConnected("reconnecting");

      updateConnectionGame(newRoom, "reconnect");
      if (isPreview || (CONFIG.SHOW_CONNECTION_DEBUG_INFO && newRoom !== null)) {
        updateConnectionDebugger(newRoom);
      }

      updateConnectionMessage("Reconnected to " + newRoom.name, Color4.Green())        

      log(CLASSNAME,"Reconnected successfully!");
  
      return newRoom;
      // }).catch(e => {
      //     log("reconnect Error", e);
      // });
    } catch (e: any) {
      log(CLASSNAME,"reconnect room.event.connection error", ENDPOINT, e);
      log(CLASSNAME,"reconnect. room.event.connection error", ENDPOINT, "44444");
      GAME_STATE.setGameConnectedCode(e.code);
      GAME_STATE.setGameErrorMsg(e);
      GAME_STATE.setGameConnected("error");
      GAME_STATE.setGameStarted(false);
      GAME_STATE.setGameHudActive(false);
      GAME_STATE.setScreenBlockLoading(false);
  
      updateConnectionMessage(
        `Reconnect Error: ${e.message} ` + decodeConnectionCode(e.code),
        Color4.Red()
      );
      throw e;
    }
 }
export function showConnectingStarted(){
    //REGISTRY.ui.gameTools.ReloginPanel.setActive(false)//.opacity = .2
}
export function showConnectingEnded(success:boolean){
    //REGISTRY.ui.gameTools.ReloginPanel.setActive(true)//.opacity = 1
} 
export async function disconnect(_consent?:boolean) {
    //if(REGISTRY.intervals.connectCheckInterval) REGISTRY.intervals.connectCheckInterval.reset()
   
    const consent = _consent === undefined || _consent
    log(CLASSNAME,"disconnect","consent",consent,"room",GAME_STATE.gameRoom)
  
    if (GAME_STATE.gameRoom !== null && GAME_STATE.gameRoom !== undefined) {
        GAME_STATE.setGameConnected('disconnecting',"disconnect")
  
        //onDisconnect(GAME_STATE.gameRoom)
        onGameLeaveDisconnect(0)  
        try{
          await GAME_STATE.gameRoom.leave(consent)
          GAME_STATE.setGameConnected('disconnected',"gami.disconnect") 
        }catch(e){
          log(CLASSNAME,"disconnect failed calling leave",e)
        }
        try{
          GAME_STATE.gameRoom.removeAllListeners()
        }catch(e){
          log(CLASSNAME,"disconnect failed calling removeAllListeners",e)
        }
        if(consent) GAME_STATE.setGameRoom(undefined)  
        updateConnectionMessage("not-connected", Color4.White())    
        if (CONFIG.IN_PREVIEW || CONFIG.SHOW_CONNECTION_DEBUG_INFO) {
          addConnectionDebugger("disconnected");
        }    
    }
}

  export function addConnectionDebugger(msg: string) {
    log(
      CLASSNAME,"addConnectionDebugger called debugMessageUI ",
      msg
    );
    debugMessageUI.set( msg )//, Color4.White();*/
  }
  
  export function updateConnectionMessage(value: string, color: Color4) {
    log(CLASSNAME,"updateConnectionMessage","ENTRY",value,color)
    message.set(value);
    message.color = color;
  }
  async function fetchAndDisplayServerDebugInfo(room: Room) {
    if (CONFIG.IN_PREVIEW || CONFIG.SHOW_CONNECTION_DEBUG_INFO){
      const resp:any = await fetchColyseusInfo()
      
      addConnectionDebugger(JSON.stringify(resp));//debugMessageUI.value = JSON.stringify(resp)
    }
  }
  function updateConnectionDebugger(room: Room) {
    updateConnectionMessage("Connected to " + room.name, Color4.Green());
    if (CONFIG.IN_PREVIEW || CONFIG.SHOW_CONNECTION_DEBUG_INFO) {
      addConnectionDebugger("Connected to " + room.name);
    }   
    fetchAndDisplayServerDebugInfo(room)
    //https://docs.colyseus.io/colyseus/client/client/#onleave
    room.onLeave((code) => {
      log(CLASSNAME,"room.event.leave " + code);
      if (!isErrorCode(code)) {
        updateConnectionMessage("Left Room " + code, Color4.White());
      } else {
        updateConnectionMessage(
          "Connection lost " + code + " " + decodeConnectionCode(code),
          Color4.Red()
        );
      }
    });
    room.onError((code, message) => {
      //console.log("oops, error ocurred:");
      //console.log(message);
      const msg =
        "room.event.error oops, error ocurred:" +
        code +
        " " +
        message +
        " " +
        decodeConnectionCode(code);
      log(CLASSNAME,"room.onError " + msg);
  
      updateConnectionMessage(msg, Color4.Red());
    });
  }
  
  const onGameLeaveDisconnect = (code: number) => {
    log(CLASSNAME,"onGameLeaveDisconnect ENTRY",code)
    //GAME_STATE.setGameRoom(null)
    GAME_STATE.setGameConnectedCode(code);
    if(isNormalDisconnect(code)){
      GAME_STATE.setGameConnected('disconnected',"onGameLeaveDisconnect")
    }else{
      GAME_STATE.setGameConnected('disconnecting')
    }
    updateConnectionMessage("not-connected", Color4.White())        
     // GAME_STATE.setGameConnected("disconnecting");
    //}else{
      //GAME_STATE.setGameConnected("disconnected");
    //}
    GAME_STATE.setGameStarted(false);
    GAME_STATE.setScreenBlockLoading(false);
    GAME_STATE.setGameHudActive(false);
  
    if (isErrorCode(code)) {
      //show error box!?!
    }
    removeGameElements();
  };
  
  function updateConnectionGame(room: Room, eventName: string) {
    //updateConnectionMessage("Connected.", Color4.Green());
    //https://docs.colyseus.io/colyseus/client/client/#onleave
    //const instance = GAME_STATE.gameRoomInstId//toLocaleDateString
    const instance = eventName + "." + GAME_STATE.gameRoomInstId; //toLocaleDateString
    log(CLASSNAME,"updateConnectionGame room.instance", instance, room.id);
    room.onLeave((code) => {
      log(
        CLASSNAME,instance,"updateConnectionGame",
        ".room.event.leave. updateConnectionGame room.onLeave ENTRY " + code
      );
      if (code === 1000) {
        //updateConnectionMessage("Left Room " + code, Color4.White())
      } else {
        //updateConnectionMessage("Connection lost " + code, Color4.Red())
      }
      //debugger
  
      if (!isErrorCode(code)) {
        onGameLeaveDisconnect(code);
      } else {
        //wait 500 ms for playfab scores to sync
        log(CLASSNAME,"updateConnectionGame","will attempt reconnect shortly");
        utils.timers.setTimeout( () => {
          const oldRoom = GAME_STATE.gameRoom;
          //try reconnect
          if (oldRoom)
            reconnect(oldRoom.id, oldRoom.sessionId, {})
              .then((newroom) => {
                log(CLASSNAME,instance, ".ReConnected!");
                //GAME_STATE.setGameConnected('connected')
  
                CONNECTION_EVENT_REGISTRY.onJoinActions!(newroom, "reconnect");
              })
              .catch((err) => {
                log(CLASSNAME,instance, "updateConnectionGame", 
                    ".room.event.leave. reconnect failed", err, code);
                //error(err);
                onGameLeaveDisconnect(code);
                //GAME_STATE.setGameConnected("disconnected");
              });
        },200);
      }
    }); 
    room.onError((code, message) => {
      //console.log("oops, error ocurred:");
      //console.log(message);
      const msg = "room.event.error. oops, error ocurred:" + code + " " + message;
      log(CLASSNAME,instance, ".room.onError " + msg,"44444");
      GAME_STATE.setGameErrorMsg(code + " " + message);
      GAME_STATE.setGameConnectedCode(code);
      GAME_STATE.setGameConnected("error");
      GAME_STATE.setGameStarted(false);
      GAME_STATE.setScreenBlockLoading(false);
  
      //GAME_STATE.setGameConnected(false)
  
      updateConnectionMessage(msg, Color4.Red());
    });
  }
  