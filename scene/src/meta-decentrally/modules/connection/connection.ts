//
// IMPORTANT : 
// - include `noLib: false` to your tsconfig.json file, under "compilerOptions"
//
///<reference lib="es2015.symbol" />
///<reference lib="es2015.symbol.wellknown" />
///<reference lib="es2015.collection" />
///<reference lib="es2015.iterable" />

import { Client, Room } from "colyseus.js";
import { isPreviewMode, getCurrentRealm } from '@decentraland/EnvironmentAPI'
import { getUserData } from "@decentraland/Identity";
import { GAME_STATE } from 'src/state';
import { CONFIG } from "src/meta-decentrally/config";
import { CUSTOM_CODE_MANUAL_ERROR_MSG, decodeConnectionCode, isErrorCode } from "./connection-utils";
import { onDisconnect } from "./onConnect";
import * as ui from '@dcl/ui-scene-utils'
import { Constants } from "../resources/globals";

export const canvas = ui.canvas

export async function connect(roomName: string, options: any = {}) {
    log("connect-flow","connect",roomName,options)
    disconnect()
    
    const isPreview = CONFIG.IN_PREVIEW
    const realm = await getCurrentRealm();

    //
    // make sure users are matched together by the same "realm".
    //
    //realm?.displayName;
    
    options.realm = await getCurrentRealm();
    const userData = await getUserData();
    options.userData = userData

    options.playFabData = {"titleId":CONFIG.PLAYFAB_TITLEID,"id":GAME_STATE.playerState.playFabLoginResult?.PlayFabId,"sessionTicket":GAME_STATE.playerState.playFabLoginResult?.SessionTicket}
 
    log("userData:", options);

    // const ENDPOINT = "wss://hept-j.colyseus.dev";
    const ENDPOINT = (isPreview)
        ? CONFIG.COLYSEUS_ENDPOINT_LOCAL // local environment
        : CONFIG.COLYSEUS_ENDPOINT_NON_LOCAL; // production environment*/

    log("connect-flow","connect",roomName,options,"to",ENDPOINT)

    if (isPreview) { addConnectionDebugger(ENDPOINT); }
    const client = new Client(ENDPOINT);

    try {
        //
        // Docs: https://docs.colyseus.io/client/client/#joinorcreate-roomname-string-options-any
        //
        const room = await client.joinOrCreate<any>(roomName, options);
        updateConnectionGame(room,'connect')
        if (isPreview) { updateConnectionDebugger(room); }

        return room;

    } catch (e:any) {
        log("connect FAILED",e)

        let msg = e.message
        if(msg === undefined){
            msg = "Unable to connect to server"
        }

        updateConnectionMessage(`Error: ${msg}`, Color4.Red())

        //TODO SWITCH TO THIS onGameLeaveDisconnect(room,code)
        onGameLeaveDisconnect(undefined,CUSTOM_CODE_MANUAL_ERROR_MSG,undefined,msg)//Constants.Game_2DUI.showErrorPrompt("",`Error: ${msg}`)
        throw e;
    }
}

export async function reconnect(roomId:string,sessionId:string,options: any = {}) {
    log("reconnect entered",roomId,sessionId)
    const isPreview = CONFIG.IN_PREVIEW
    const realm = await getCurrentRealm();

    //const ENDPOINT = CONFIG.COLYSEUS_ENDPOINT
    const ENDPOINT = (isPreview)
        ? CONFIG.COLYSEUS_ENDPOINT_LOCAL // local environment
        : CONFIG.COLYSEUS_ENDPOINT_NON_LOCAL; // production environment*/

    log("reconnecting to " + ENDPOINT)
    if (isPreview || CONFIG.DEBUG_SHOW_CONNECTION_INFO) { addConnectionDebugger(ENDPOINT); }
    const client = new Client(ENDPOINT);

    try {
        //
        // Docs: https://docs.colyseus.io/client/client/#joinorcreate-roomname-string-options-any
        //
        //let newRoom = null
        //let oldRoom = GAME_STATE.gameRoom
        const newRoom = await client.reconnect(roomId,sessionId)//.then(room_instance => {
        GAME_STATE.gameRoomInstId = new Date().getTime()
        //newRoom = room_instance;
        //onjoin();
        updateConnectionGame(newRoom,'reconnect')
        if (isPreview || CONFIG.DEBUG_SHOW_CONNECTION_INFO && newRoom !== null) { updateConnectionDebugger(newRoom); }
        log("Reconnected successfully!");

        return newRoom;
       // }).catch(e => {
       //     log("reconnect Error", e);
       // });

    } catch (e:any) {
        log("reconnect room.event.connection error",ENDPOINT,e)
       
        updateConnectionMessage(`Reconnect Error: ${e.message} ` + decodeConnectionCode(e.code), Color4.Red())

        //TODO SWITCH TO THIS onGameLeaveDisconnect(room,code)
        onGameLeaveDisconnect(undefined,e.code,e.message,`Reconnect Error: ${e.message} ` + decodeConnectionCode(e.code))
        //Constants.Game_2DUI.showErrorPrompt("",)
        throw e;
    }
}


let message: UIText;


export async function disconnect(_consent?:boolean) {
    log("disconnect",_consent)
    const consent = _consent === undefined || _consent
    if (GAME_STATE.gameRoom !== null && GAME_STATE.gameRoom !== undefined) {
        onDisconnect(GAME_STATE.gameRoom)
        log("disconnect","calling leave",consent)
        try{
            GAME_STATE.gameRoom.removeAllListeners()
            //not awaitin lets it fail in an async thread good or bad idk
            //can throw colyseus.js:802 WebSocket is already in CLOSING or CLOSED state.
            //and is not catchable, just bombs!!!
            GAME_STATE.gameRoom.leave(true).then(()=>{

            }).catch((e)=>{
                log("disconnect.error",e)    
            })
        }catch(e){
            log("disconnect.error",e)
        } 
        log("disconnect","ended calling leave",consent)
        if(consent) GAME_STATE.setGameRoom(undefined)  
        GAME_STATE.setGameConnected('disconnected',"disconnect")
        updateConnectionMessage("not-connected", Color4.White())        
    } 
  }


function addConnectionDebugger(endpoint: string) {
    if(!message || message === undefined || message === null){
        //const canvas = canvas
        message = new UIText(canvas)
        message.fontSize = 10//15
        message.width = 120
        message.height = 30
        message.hTextAlign = "center";
        message.vAlign = "bottom"
        //message.positionX = -80
        message.positionY = 0
    }
    updateConnectionMessage(`Connecting to ${endpoint}`, Color4.White());
}

function updateConnectionMessage(value: string, color: Color4) {
    if(message){
        message.value = value;
        message.color = color;
    }
}

function updateConnectionDebugger(room: Room) {
    updateConnectionMessage("Connected to " +room.name + "("+room.id+")", Color4.Green());
    /*room.onLeave(() =>{ 
        log("LEFT ROOM")
            //GAME_STATE.setGameConnected('disconnected')
            updateConnectionMessage("Connection lost", Color4.Red())
            Constants.Game_2DUI.showErrorPrompt("","Connection lost")
        }
    );*/
    
}


const onGameLeaveDisconnect = (room: Room,code:number,msg?:string,overrideMsg?:string) => {
    //GAME_STATE.setGameRoom(null)
    
    if(isErrorCode(code)){ 
        //TODO PUT ERROR HERE?? Constants.Game_2DUI.showErrorPrompt("","Connection lost")
        //show error box!?!
        if(overrideMsg){
            Constants.Game_2DUI.showErrorPrompt(undefined,overrideMsg)
        }else{
            msg = `Error: ${msg}: ` + decodeConnectionCode(code)
            Constants.Game_2DUI.showErrorPrompt(undefined,msg)
        }
    }else{
        //GOOD OR BAD MSG???
        updateConnectionMessage("Disconnected",Color4.White())
    }
    //TODO check if was notified of disconnection
    //maybe in race, if server does not talk turn this RED!!!
    
    onDisconnect(room,code)
    //removeGameElements()
}

function updateConnectionGame(room: Room,eventName:string) {
    //updateConnectionMessage("Connected.", Color4.Green());
    //https://docs.colyseus.io/colyseus/client/client/#onleave
    const instance = eventName+"."+GAME_STATE.gameRoomInstId//toLocaleDateString
    log("updateConnectionGame room.instance",instance,room.id)
    room.onLeave(((code) => { 
        log(instance,".room.event.leave. updateConnectionGame room.onLeave ENTRY " + code)

        if(!isErrorCode(code)){ 
            onGameLeaveDisconnect(room,code)
            disconnect()//needed?
        }else if(GAME_STATE.gameRoom){
            //wait 500 ms for playfab scores to sync
            log("will attempt reconnect shortly")
            //utils.setTimeout(200,()=>{  
                const oldRoom = GAME_STATE.gameRoom
                //try reconnect
                reconnect(oldRoom.id, oldRoom.sessionId,{}).then((newroom) => {
                    log(instance,".ReConnected!");
                    //GAME_STATE.setGameConnected('connected')
                    
                    //CONNECTION_EVENT_REGISTRY.onJoinActions(newroom,"reconnect")
            
                }).catch((err) => {
                    log(instance,".room.event.leave. reconnect failed",err,code);
                    error(err);
                    onGameLeaveDisconnect(room,code,err.message)
                    disconnect()//needed?
                }); 
            //})
        }
    }))
    room.onError((code, message) => {
        //console.log("oops, error ocurred:");
        //console.log(message);
        const msg = "Oops an error ocurred:" + code + " " + message
        log(instance,".room.onError " + msg)
        
        //GAME_STATE.setGameConnected(false)

        updateConnectionMessage(msg, Color4.Red())
        //TODO SWITCH TO THIS 
        onGameLeaveDisconnect(room,code,message)
      })
}