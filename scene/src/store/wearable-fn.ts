//import { hud } from "src/builderhud/BuilderHUD";
//import resources from "src/resources"
//import { CommonResources } from "src/resources/common";
import { log } from "../back-ports/backPorts";
import { WearableBoothArgs, WearableBoothInitArgs } from "./types";

//import { WearableMenuItem } from "src/store/ui/menuItemWearable";
//import * as f from "../store/blockchain/fetch";

//const roundedSquareAlpha = CommonResources.RESOURCES.textures.transparent4card; //resource.roundedSquareAlpha
//END INCLUDE BLOCKCHAIN QUERY

//let transparent = CommonResources.RESOURCES.materials.transparent
//transparent.alphaTest = 1
///transparent.texture = CommonResources.RESOURCES.textures.transparent

//just do dirty work here??

export async function createWearableBoothCard(args: WearableBoothInitArgs) {
  log("wearble-fn","createWearableBoothCard","IMPLEMENT ME!!!!!");
  
  //USING IMPLEMENT ME LOG OVER convering this block
  /*args.featureEntity.addComponent(
    new OnPointerDown(
      () => {
        log(
          "createWearableBoothCard disabeld for now, not sure we need it, need to optimize loading of all its models"
        );
      },
      { hoverText: "manually disabled for now" }
    )
  );*/

  /*
  const parent = args.parent
  const cardData = args.options.cardData
  const collection = await f.collection("urn:decentraland:matic:collections-v2:" + args.contract);
  for(const item of collection.items){
      log('item is', item)

      item.available = 33
      item.maxSupply = 40
 
      if(item.blockchainId == args.itemId){
        log('right item')
        let clickItem = new WearableMenuItem(
          parent,
          {},
          roundedSquareAlpha,
          collection,
          item,
          args.options
        ) 
        args.featureEntity.addComponent(new OnPointerDown(()=>{
          clickItem.select()
          },{hoverText: args?.options.featuredEntityData?.hoverText+"F"}))
        if(cardData?.startSelected){
          
          clickItem.select()
        }

        break
      }

  }*/
}
