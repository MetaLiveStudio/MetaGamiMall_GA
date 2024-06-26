import { Color4, Vector3 } from "@dcl/sdk/math"
import { disconnect } from "../gamimall/connection"
import { REGISTRY } from "../registry"
import * as ui from 'dcl-ui-toolkit'
import { log } from "../back-ports/backPorts"
import { CONFIG, SCENE_TYPE_GAMIMALL, SCENE_TYPE_PX } from "../config"

const CLASS_NAME = "ui_px.ts"




const PARCELS_PX_DISABLED_STR:string[] = [
  /*"3,3",//test
  "145,60",
  "145,61",
  "145,62",
  "145,63",
  "145,64",
  "145,65",
  "146,60",
  "146,61",
  "146,62",
  "146,63",
  "146,64",
  "146,65",
  "147,60",
  "147,61",
  "147,62",
  "147,63",
  "147,64",
  "147,65",
  "148,60",
  "148,61",
  "148,62",
  "148,63",
  "148,64",
  "148,65",
  "149,60",
  "149,61",
  "149,62",
  "149,63",
  "149,64",
  "149,65"*/
]

//convert string "x,y" to Map<string,Map<string,string>>
export const PARCELS_PX_DISABLED:Record<string,Record<string,string>> = {}
for(const p of PARCELS_PX_DISABLED_STR){
  if(!p || p ==="") continue //skip
  const [x,y] = p.split(",")
  if(!PARCELS_PX_DISABLED[x]){
    PARCELS_PX_DISABLED[x] = {}
  }
  PARCELS_PX_DISABLED[x][y] = "disabled"
}

//log(CLASS_NAME,"PARCELS_PX_DISABLED",PARCELS_PX_DISABLED)

let pxEnabled = true

export function isPxEnabled(){
  return pxEnabled
}  
export function setPxEnabled(_pxEnabled:boolean,_force?:boolean){
  const METHOD_NAME = "setPxEnabled"
  //log(CLASS_NAME,METHOD_NAME,"ENTRY",_pxEnabled,"_force",_force) 
  if(_pxEnabled !== pxEnabled || (_force!== undefined && _force)){
    if(!_pxEnabled){
      //disable
      log(CLASS_NAME,METHOD_NAME,"px disabled for this parcel, calling disconnect",_pxEnabled,"_force",_force)
      disconnect(true) 
      setPxStatusMsg("PX Disabled While On This Parcel\nIt will reactivate once off parcel",Color4.Red());
      
      //TODO BRING BACK
      
      //REGISTRY.ui.loginPanel.hide()
      REGISTRY.ui.staminaPanel.hide()
      REGISTRY.ui.gameTools.hide()
    }else{
      setPxStatusMsg("",Color4.Green());
      //TODO BRING BACK
      //REGISTRY.ui.loginPanel.show()
      REGISTRY.ui.staminaPanel.show()
      REGISTRY.ui.gameTools.show()
    }
  }else{  
    if(pxEnabled){
      //log(CLASS_NAME,METHOD_NAME,"px enabled for this parcel, already connecting",_pxEnabled)
    }else{
      //log(CLASS_NAME,METHOD_NAME,"px disabled for this parcel, already called disconnect",_pxEnabled)
    }
  }
  pxEnabled = _pxEnabled
}

export const PARCEL_16_METERS = Vector3.create(16,16,16)


const pxStatusMsgUI = ui.createComponent(ui.CornerLabel, { value: 'Disabled ... ',xOffset: -300 })
pxStatusMsgUI.color = Color4.Red()

//pxStatusMsgUI.show()
/*
const pxStatusMsgUI = new UIText(canvas);
pxStatusMsgUI.fontSize = 15;
pxStatusMsgUI.width = 120;
pxStatusMsgUI.height = 30;
pxStatusMsgUI.hTextAlign = "right";
pxStatusMsgUI.vAlign = "bottom";
pxStatusMsgUI.hAlign = "right";
pxStatusMsgUI.positionX = -200;
pxStatusMsgUI.positionY = 0;*/

export function setPxStatusVisible(visible:boolean){
  log(CLASS_NAME,"setPxStatusVisible",visible);
  if(pxStatusMsgUI.isVisible() != visible){
    if(visible){
      pxStatusMsgUI.show()
    }else{
      pxStatusMsgUI.hide()
    }
  }
} 
export function setPxStatusMsg(msg:string,color:Color4 = Color4.White()){
  log(CLASS_NAME,"setPxStatusMsg",msg,color);
  pxStatusMsgUI.set(msg)
  if(pxStatusMsgUI.color !== color){
    pxStatusMsgUI.color = color;
  }
}
 
export function initPxState(){
  if(CONFIG.SCENE_TYPE !== SCENE_TYPE_PX){
    log(CLASS_NAME,"initPxState","scene is not PX, disable, scene_type is",CONFIG.SCENE_TYPE)
    return
  }
  //setPxStatusMsg("PX Running");
  //setPxStatusMsg("PX Is Loading...");
  setPxStatusMsg("")//default msg value
  setPxStatusVisible(true)
}