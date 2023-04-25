import { BlockMaterialDefType } from "../mall_rooms/MyRoomState"

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
      Amount: amount,
      PlayFabId: playFabId,
      // Name of the virtual currency which is to be incremented.
      VirtualCurrency: symbol
    }

    return addCurrency
  }

