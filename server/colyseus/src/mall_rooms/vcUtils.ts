import { notNull } from "../utils/utils";
import { BlockTypeTypeConst } from "./MyRoomState";
import * as serverStateSpec from "./MyRoomStateSpec";


export function getCostById(cost: serverStateSpec.CostData[],id: string){
    if(cost !== undefined){
        for(const p in cost){
            const c = cost[p]
            if(c.id === id){
                return c
            }
        }
    }
}

export function costToMapById(cost: serverStateSpec.CostData[]):Map<string,serverStateSpec.CostData>{
    const map:Map<string,serverStateSpec.CostData> = new Map()
    if(cost !== undefined){
        for(const p in cost){
            const c = cost[p]
            map.set(c.id,c)
        }
    }
    return map
}
export function costToRecordById(cost: serverStateSpec.CostData[]):Record<string,serverStateSpec.CostData>{
    const rec:Record<string,serverStateSpec.CostData> = {}
    if(cost !== undefined){
        for(const p in cost){
            const c = cost[p]
            rec[c.id] = c
        }
    }
    return rec
}

export function get2dUICostFormat(cost: serverStateSpec.CostData[], id: string,prefix:string,theDefault:string): string {
  if(cost !== undefined){
    const c = getCostById(cost,id)
      
    if(notNull(c)){
        return prefix + c.amount
    }
  }
  return theDefault
}

export function playerFundsToCost(player:serverStateSpec.IPlayer):serverStateSpec.CostData[]{
    const cost:serverStateSpec.CostData[] = []

    const costGC:serverStateSpec.CostData = {id:BlockTypeTypeConst.GC.symbol,amount:player.coinGcCount,type:"VirtualCurrency" }
    const costMC:serverStateSpec.CostData = {id:BlockTypeTypeConst.MC.symbol,amount:player.coinMcCount,type:"VirtualCurrency" }

    const costVB:serverStateSpec.CostData = {id:BlockTypeTypeConst.VB.symbol,amount:player.coinVbCount,type:"VirtualCurrency" }
    const costAC:serverStateSpec.CostData = {id:BlockTypeTypeConst.AC.symbol,amount:player.coinAcCount,type:"VirtualCurrency" }
    const costZC:serverStateSpec.CostData = {id:BlockTypeTypeConst.ZC.symbol,amount:player.coinZcCount,type:"VirtualCurrency" }
    const costRC:serverStateSpec.CostData = {id:BlockTypeTypeConst.RC.symbol,amount:player.coinRcCount,type:"VirtualCurrency" }

    const costR1:serverStateSpec.CostData = {id:BlockTypeTypeConst.R1.symbol,amount:player.rock1Collected,type:"VirtualCurrency" }
    const costR2:serverStateSpec.CostData = {id:BlockTypeTypeConst.R2.symbol,amount:player.rock2Collected,type:"VirtualCurrency" }
    const costR3:serverStateSpec.CostData = {id:BlockTypeTypeConst.R3.symbol,amount:player.rock3Collected,type:"VirtualCurrency" }
    
    const costBP:serverStateSpec.CostData = {id:BlockTypeTypeConst.BP.symbol,amount:player.petroCollected,type:"VirtualCurrency" }
    const costNI:serverStateSpec.CostData = {id:BlockTypeTypeConst.NI.symbol,amount:player.nitroCollected,type:"VirtualCurrency" }
    const costBZ:serverStateSpec.CostData = {id:BlockTypeTypeConst.BZ.symbol,amount:player.bronzeCollected,type:"VirtualCurrency" }

    const costBronzeShoe:serverStateSpec.CostData = {id:BlockTypeTypeConst.BRONZE_SHOE1.symbol,amount:player.bronzeShoeCollected,type:"CatalogItem" }
     

    if(player.playfabBalance){
        costGC.amount += player.playfabBalance.coinGcCount
        costMC.amount += player.playfabBalance.coinMcCount

        costVB.amount += player.playfabBalance.coinVbCount
        costAC.amount += player.playfabBalance.coinAcCount
        costZC.amount += player.playfabBalance.coinZcCount
        costRC.amount += player.playfabBalance.coinRcCount

        costR1.amount += player.playfabBalance.rock1Collected
        costR2.amount += player.playfabBalance.rock2Collected
        costR3.amount += player.playfabBalance.rock3Collected
        
        costBP.amount += player.playfabBalance.petroCollected
        costNI.amount += player.playfabBalance.nitroCollected

        costBZ.amount += player.playfabBalance.bronzeCollected

        costBronzeShoe.amount += player.playfabBalance.bronzeShoeCollected
    }

    console.log("XXXXplayerFundsToCost","player.coinGcCount",player.coinGcCount)

    costGC.amount += sumRewards(player.currentSavePoint.rewards,BlockTypeTypeConst.GC.symbol)
    costMC.amount += sumRewards(player.currentSavePoint.rewards,BlockTypeTypeConst.MC.symbol)

    costVB.amount += sumRewards(player.currentSavePoint.rewards,BlockTypeTypeConst.VB.symbol)
    costAC.amount += sumRewards(player.currentSavePoint.rewards,BlockTypeTypeConst.AC.symbol)
    costZC.amount += sumRewards(player.currentSavePoint.rewards,BlockTypeTypeConst.ZC.symbol)
    costRC.amount += sumRewards(player.currentSavePoint.rewards,BlockTypeTypeConst.RC.symbol)

    costR1.amount += sumRewards(player.currentSavePoint.rewards,BlockTypeTypeConst.R1.symbol)
    costR2.amount += sumRewards(player.currentSavePoint.rewards,BlockTypeTypeConst.R2.symbol)
    costR3.amount += sumRewards(player.currentSavePoint.rewards,BlockTypeTypeConst.R3.symbol)

    costBP.amount += sumRewards(player.currentSavePoint.rewards,BlockTypeTypeConst.BP.symbol)
    costNI.amount += sumRewards(player.currentSavePoint.rewards,BlockTypeTypeConst.NI.symbol)
    costBZ.amount += sumRewards(player.currentSavePoint.rewards,BlockTypeTypeConst.BZ.symbol)

    costBronzeShoe.amount += sumRewards(player.currentSavePoint.rewards,BlockTypeTypeConst.BRONZE_SHOE1.symbol)
    
    cost.push(costGC,costMC,costBZ
      ,costR1,costR2,costR3
      ,costVB,costAC,costZC,costRC
      ,costBP,costNI
      ,costBronzeShoe
      )

    return cost
}

export function sumRewards(rewards: serverStateSpec.RewardNotification[], symbol: string): number {
    
    let sum = 0
    let maxAllowed = -1
    let redeemable = true
    let currentAmount = 0

    //TODO switch to getCostById
    for(const p in rewards){
      
      const itm = rewards[p]
      if(itm.rewards === undefined){
        continue;
      }
      
      for(const p in itm.rewards){
        const rwd = itm.rewards[p]
        if(rwd.id == symbol){
          sum += rwd.amount

          if(rwd.maxAllowed !== undefined){
            maxAllowed = Math.min(rwd.maxAllowed,maxAllowed)
          }
          if(rwd.redeemable !== undefined){
            redeemable = rwd.redeemable
          }
          if(rwd.currentAmount !== undefined){
            currentAmount = Math.max(rwd.currentAmount,currentAmount)
          }
        }
        /*
        switch(itm.id){
          //WILL BE COUNTED TOWARDS COLLECTED, move to reward bonus
          case CONFIG.GAME_COIN_TYPE_GC:
            //player.coinGcCount += itm.amount
            player.coinGcRewards += itm.amount
            break;
          case CONFIG.GAME_COIN_TYPE_MC:
            //player.coinMcCount += itm.amount
            player.coinMcRewards += itm.amount
            break;
          default:
            console.log("onPlayerLeveledUp",  player.id , player.name , " WARNING !!! unhandled reward type:" , itm);
        }*/
      }
    }
    console.log("sumRewards",symbol,"sum",sum,"but","maxAllowed",maxAllowed,"currentAmount",currentAmount,"redeemable",redeemable)
    
    /*
    if(maxAllowed >= 0 && sum > (maxAllowed+currentAmount)){
      console.log("sumRewards","ALTER sum was",sum,"but","maxAllowed",maxAllowed,"currentAmount",currentAmount)
      sum = maxAllowed - currentAmount
    }
    if(!redeemable){
      console.log("sumRewards","ALTER sum was",sum,"but","redeemable",redeemable)
      sum = 0
    }
    */
    //log("sumRewards",symbol,"sum",sum.toFixed(0))
    return sum
  }
  