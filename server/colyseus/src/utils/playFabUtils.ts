import { BlockMaterialDefType } from "../mall_rooms/MyRoomState"
import { RewardData } from "../mall_rooms/MyRoomStateSpec"
import { PlayFabDataUtils, RandomResultTableListingExt } from "./playFabDataUtils"
import * as weighted from 'weighted'
import { notNull } from "./utils"

  export function addMaterialToUser(grantMaterials: PlayFabServerModels.GrantItemsToUserRequest,material: BlockMaterialDefType, amount: number) {
    if(material.itemId === undefined){
      console.log("addMaterialToUser WARNING material itemId was null/missing. not adding",material,amount)
    }
    if(amount > 0 && material.itemId !== undefined){
      for(let x=0;x<amount;x++){
        grantMaterials.ItemIds.push( material.itemId )
      }
    }
  }

  export function createAddUserVirtualCurrency(playFabId:string,symbol: string, amount: number) {
    var addCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest= { 
      Amount: amount !== undefined ? amount : 0,
      PlayFabId: playFabId,
      // Name of the virtual currency which is to be incremented.
      VirtualCurrency: symbol
    }

    return addCurrency
  }


  export function createAddUserStat(playFabId:string,def: BlockMaterialDefType, amount: number) {
    var addCurrency: PlayFabServerModels.StatisticUpdate= { 
      Value: amount !== undefined ? amount : 0,
      //PlayFabId: playFabId,
      // Name of the virtual currency which is to be incremented.
      StatisticName: def.symbol
    }

    return addCurrency
  }

  export function evalRewards(rewards:RewardData[],playFabDataUtils:PlayFabDataUtils):RewardData[]{
    const METHOD_NAME = "evalDropTable"
    const rewardData:RewardData[]=[]

    for(const p of rewards){
      if(p.type === 'VirtualCurrency'){
        rewardData.push(p)
      }else if(p.type === 'CatalogItem'){
        //TODO: add translation to stat if need be
        rewardData.push(p)
      }else if(p.type === 'DropTable'){
        const dropTable = playFabDataUtils.dropTablesMapById.get(p.id)
        if(dropTable !== undefined){
          rewardData.push( ...evalDropTable(dropTable,playFabDataUtils) )
        }else{
          console.log(METHOD_NAME,"WARNING!!! could not find by playFabDataUtils.dropTablesMapById",p.type,p.id)  
        }
      }else{
        console.log(METHOD_NAME,"UNHANDLED TYPE!!!",p.type)
      }

    }
    console.log(METHOD_NAME,"RETURN rewardData",rewards,"returning rewardData",rewardData)
    return rewardData;
  }
  export function evalDropTable(dropTable:RandomResultTableListingExt,playFabDataUtils:PlayFabDataUtils):RewardData[]{
    const METHOD_NAME = "evalDropTable"
    const rewardData:RewardData[]=[]


    var items:string[] = []
    var weights:number[] = []
    let total = 0
    //randomize winning, then redeem
    for(const node of dropTable.Nodes){
      items.push( node.ResultItem )
      total += node.Weight
    }
    for(const node of dropTable.Nodes){
      weights.push( node.Weight/total )
    }
    const pickedItemId = weighted.select(items)
    //console.log(METHOD_NAME,"weighted",items,weights,pickedItemId)

    console.log(METHOD_NAME,"weighted","pickedItemId",pickedItemId)
    
    const serverDefinedReward = playFabDataUtils.catalogItemMapById.get(pickedItemId)

    if(notNull(serverDefinedReward)){
      if(notNull(serverDefinedReward.Container)){
        for(const containerVc in serverDefinedReward.Container.VirtualCurrencyContents){
          const amount = serverDefinedReward.Container.VirtualCurrencyContents[containerVc]
          
          rewardData.push(
            {
              amount: amount,
              type: "VirtualCurrency",
              id: containerVc
            }
          )
        }
      }
      if(notNull(serverDefinedReward.Bundle)){
        for(const containerVc in serverDefinedReward.Bundle.BundledVirtualCurrencies){
          const amount = serverDefinedReward.Bundle.BundledVirtualCurrencies[containerVc]
          
          rewardData.push(
            {
              amount: amount,
              type: "VirtualCurrency",
              id: containerVc
            }
          )
        }
      }
    }else{
      console.log(METHOD_NAME,"WARNING could not find in playFabDataUtils.catalogItemMapById",pickedItemId)  
    }
    console.log(METHOD_NAME,"RETURN weighted",items,weights,pickedItemId,rewardData)

    return rewardData;
  }