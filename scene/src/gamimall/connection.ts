//
// IMPORTANT :
// - include `noLib: false` to your tsconfig.json file, under "compilerOptions"
//
///<reference lib="es2015.symbol" />
///<reference lib="es2015.symbol.wellknown" />
///<reference lib="es2015.collection" />
///<reference lib="es2015.iterable" />

import * as utils from "@dcl/ecs-scene-utils";
import { Client, Room } from "colyseus.js";
import { isPreviewMode, getCurrentRealm } from "@decentraland/EnvironmentAPI";
import { GAME_STATE } from "src/state";
import {
  decodeConnectionCode,
  isErrorCode,
  removeGameElements,
} from "./connection-utils";
import { CONFIG } from "src/config";
import { GLOBAL_CANVAS } from "./resources";

class ConnectionEventReg {
  onJoinActions?: (room: Room, eventName: string) => void;
}

export const CONNECTION_EVENT_REGISTRY = new ConnectionEventReg();

const canvas = GLOBAL_CANVAS;

const debugMessageUI = new UIText(canvas);
debugMessageUI.fontSize = 15;
debugMessageUI.width = 120;
debugMessageUI.height = 30;
debugMessageUI.hTextAlign = "center";
debugMessageUI.vAlign = "bottom";
debugMessageUI.positionX = -80;
debugMessageUI.positionY = 20;

log("created debugMessageUI " + debugMessageUI);

const message = new UIText(canvas);
message.fontSize = 15;
message.width = 120;
message.height = 30;
message.hTextAlign = "center";
message.vAlign = "bottom";
message.positionX = -80;

export function initColyseusConnection() {
  if (CONFIG.IN_PREVIEW || CONFIG.SHOW_CONNECTION_DEBUG_INFO)
    addConnectionDebugger("not-started-yet");
}

export async function connect(roomName: string, options: any = {}) {
  const isPreview = CONFIG.IN_PREVIEW;
  const realm = await getCurrentRealm();

  //
  // make sure users are matched together by the same "realm".
  //

  //used for matching rooms
  options.playerId = GAME_STATE.playerState.playerDclId;
  options.randomId = Math.random()//GAME_STATE.playerState.playerDclId;
  options.realm = realm?.displayName;

  //other data
  options.userData = GAME_STATE.playerState.dclUserData;

  options.playFabData = {
    id: GAME_STATE.playerState.playFabLoginResult?.PlayFabId,
    sessionTicket: GAME_STATE.playerState.playFabLoginResult?.SessionTicket,
  };

  log(
    "userData:",
    options.userData + " playFabData:",
    options.playFabData + " isPreview " + isPreview
  );

  //const ENDPOINT = CONFIG.COLYSEUS_ENDPOINT
  const ENDPOINT = isPreview
    ? CONFIG.COLYSEUS_ENDPOINT_LOCAL // local environment
    : CONFIG.COLYSEUS_ENDPOINT_NON_LOCAL; // production environment*/

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
    updateConnectionGame(room, "connect");
    if (isPreview || CONFIG.SHOW_CONNECTION_DEBUG_INFO) {
      updateConnectionDebugger(room);
    }

    return room;
  } catch (e: any) {
    log("connect. room.event.connection error", ENDPOINT, e);
    GAME_STATE.setGameConnectedCode(e.code);
    GAME_STATE.setGameErrorMsg(e);
    GAME_STATE.setGameConnected("error");
    GAME_STATE.setGameStarted(false);
    GAME_STATE.setGameHudActive(false);
    GAME_STATE.setScreenBlockLoading(false);

    updateConnectionMessage(
      `Error: ${e.message} ` + decodeConnectionCode(e.code),
      Color4.Red()
    );
    throw e;
  }
}

export async function reconnect(
  roomId: string,
  sessionId: string,
  options: any = {}
) {
  log("reconnect entered", roomId, sessionId);
  const isPreview = CONFIG.IN_PREVIEW;
  const realm = await getCurrentRealm();

  //const ENDPOINT = CONFIG.COLYSEUS_ENDPOINT
  const ENDPOINT = isPreview
    ? CONFIG.COLYSEUS_ENDPOINT_LOCAL // local environment
    : CONFIG.COLYSEUS_ENDPOINT_NON_LOCAL; // production environment*/

  log("reconnecting to " + ENDPOINT);
  if (isPreview || CONFIG.SHOW_CONNECTION_DEBUG_INFO) {
    addConnectionDebugger(ENDPOINT);
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
    updateConnectionGame(newRoom, "reconnect");
    if (isPreview || (CONFIG.SHOW_CONNECTION_DEBUG_INFO && newRoom !== null)) {
      updateConnectionDebugger(newRoom);
    }
    log("Reconnected successfully!");

    return newRoom;
    // }).catch(e => {
    //     log("reconnect Error", e);
    // });
  } catch (e: any) {
    log("reconnect room.event.connection error", ENDPOINT, e);
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
export function disconnect(_consent?:boolean) {
   
  const consent = _consent === undefined || _consent
  log("disconnect","consent",consent,"room",GAME_STATE.gameRoom)

  if (GAME_STATE.gameRoom !== null && GAME_STATE.gameRoom !== undefined) {
      //onDisconnect(GAME_STATE.gameRoom)
      onGameLeaveDisconnect(0)  
      try{
        GAME_STATE.gameRoom.leave(consent)
      }catch(e){
        log("disconnect failed calling leave",e)
      }
      try{
        GAME_STATE.gameRoom.removeAllListeners()
      }catch(e){
        log("disconnect failed calling removeAllListeners",e)
      }
      if(consent) GAME_STATE.setGameRoom(undefined)  
      updateConnectionMessage("not-connected", Color4.White())        
  }
}
function addConnectionDebugger(endpoint: string) {
  log(
    "addConnectionDebugger called debugMessageUI " + debugMessageUI,
    endpoint
  );
  (debugMessageUI.value = `Connecting to ${endpoint}`), Color4.White();
}

function updateConnectionMessage(value: string, color: Color4) {
  message.value = value;
  message.color = color;
}

function updateConnectionDebugger(room: Room) {
  updateConnectionMessage("Connected.", Color4.Green());
  //https://docs.colyseus.io/colyseus/client/client/#onleave
  room.onLeave((code) => {
    log("room.event.leave " + code);
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
    log("room.onError " + msg);

    updateConnectionMessage(msg, Color4.Red());
  });
}

const onGameLeaveDisconnect = (code: number) => {
  //GAME_STATE.setGameRoom(null)
  GAME_STATE.setGameConnectedCode(code);
  GAME_STATE.setGameConnected("disconnected");
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
  log("updateConnectionGame room.instance", instance, room.id);
  room.onLeave((code) => {
    log(
      instance,
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
      log("will attempt reconnect shortly");
      utils.setTimeout(200, () => {
        const oldRoom = GAME_STATE.gameRoom;
        //try reconnect
        if (oldRoom)
          reconnect(oldRoom.id, oldRoom.sessionId, {})
            .then((newroom) => {
              log(instance, ".ReConnected!");
              //GAME_STATE.setGameConnected('connected')

              CONNECTION_EVENT_REGISTRY.onJoinActions!(newroom, "reconnect");
            })
            .catch((err) => {
              log(instance, ".room.event.leave. reconnect failed", err, code);
              error(err);
              onGameLeaveDisconnect(code);
            });
      });
    }
  });
  room.onError((code, message) => {
    //console.log("oops, error ocurred:");
    //console.log(message);
    const msg = "room.event.error. oops, error ocurred:" + code + " " + message;
    log(instance, ".room.onError " + msg);
    GAME_STATE.setGameErrorMsg(code + " " + message);
    GAME_STATE.setGameConnectedCode(code);
    GAME_STATE.setGameConnected("error");
    GAME_STATE.setGameStarted(false);
    GAME_STATE.setScreenBlockLoading(false);

    //GAME_STATE.setGameConnected(false)

    updateConnectionMessage(msg, Color4.Red());
  });
}
