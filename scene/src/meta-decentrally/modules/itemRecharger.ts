import { CONFIG } from "src/meta-decentrally/config";
import { IntervalUtil } from './interval-util';
import { Constants } from './resources/globals';
import { player } from "./scene";



//TODO centrlize this logic!!!
export const fullBoostTimer = CONFIG.BOOSTERS_MAX_RELOAD_AMOUNT*CONFIG.BOOSTERS_RELOAD_TIME
export const fullProjectileTimer = CONFIG.PROJECTILE_MAX_RELOAD_AMOUNT*CONFIG.PROJECTILE_RELOAD_TIME

const boostReloadTime = new IntervalUtil(CONFIG.ITEM_RECHARGE_CHECK_FREQ_MILLIS)

export class ItemRechargeSystem {

    
    constructor(){
      
    }

    
    reset(){
      
    }

    update(dt: number){  

      const updateUI = (boostReloadTime.update(dt))

      //log("ItemRechargeSystem",player.boostReloadTimer,fullBoostTimer)
      //check to see if reload needed
      if(player.boostReloadTimer < fullBoostTimer){
        //see what percent we have
        player.boostReloadTimer = Math.min( player.boostReloadTimer + dt, fullBoostTimer )
        const amt = player.boostReloadTimer/fullBoostTimer
        //log("ItemRechargeSystem",player.boostReloadTimer,fullBoostTimer,cnt)
        if(updateUI) Constants.Game_2DUI.setBoostBar(amt)
      }
      


      if(player.projectileTimer < fullProjectileTimer){
        //see what percent we have
        player.projectileTimer = Math.min( player.projectileTimer + dt, fullProjectileTimer )

        const amt = player.projectileTimer/fullProjectileTimer
        if(updateUI) Constants.Game_2DUI.setProjectileBar(amt)
      }
      
    }

    
  
  
}