import { UserData } from "@decentraland/Identity"
import { CONFIG } from "src/config"
import { REGISTRY } from "src/registry"
import { GAME_STATE } from "src/state"
import { CheckMultiplierResultType, fetchMultiplier } from "src/store/fetch-utils"
import { getAndSetUserData, getAndSetUserDataSync } from "src/userData"

onProfileChanged.add((profileData) => {
  log("Own profile data is ", profileData)
 
  getAndSetUserDataSync().then((result:UserData)=>{ 
    //now have newest avatardata     
      
    //if connected send it  
    if(GAME_STATE.gameRoom !== undefined && GAME_STATE.gameRoom !== null){
      GAME_STATE.gameRoom.send("player.update.dcl.userData",{version:CONFIG.CHECK_MULTIPLIE_URL_VERSION,userData:result}) 
    }   
    //fetch and add multiplier
    fetchMultiplier().then((res:CheckMultiplierResultType)=>{
      log("fetchMultiplier","onProfileChanged",res)
      //throttle this??   
      if(res !== undefined && res.ok && res.multiplier){
        REGISTRY.ui.staminaPanel.setMultiplier( res.multiplier )

      }
    })
  }) 
  
}) 