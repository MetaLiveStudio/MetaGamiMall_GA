import * as utils from "@dcl/ecs-scene-utils";
import * as eth from "eth-connect";
//import { hud } from "src/builderhud/BuilderHUD";
import resourcesDropin from "./resources-dropin";
import { CommonResources } from "src/resources/common";
import { createWearableBoothCard } from "../store/wearable-fn";
import { KeepFloatingComponent } from "./anim/keepFloatingComponent";

import {
  NFTUIDataCost,
  WearableBoothArgs,
  WearableBoothInitArgs,
  WearableOptionsType,
} from "./types";
import { CustomNFTDialog, InfoPanel } from "./2d-ui/nft-infoPanel";
import * as UI from "@dcl/ui-scene-utils";
import { buyVC } from "./blockchain/index";
import { isNull } from "src/utils";
import { GAME_STATE } from "src/state";
import { REGISTRY } from "src/registry";

log("createWearableLinks start");

export let transparent = CommonResources.RESOURCES.materials.transparent;

export async function createWearableLink(arg: WearableBoothArgs) {
  log("createWearableLink ", arg);
  let options = arg.options;
  //debugger
  let ent = new Entity("bhost-" + options.featuredEntityData?.entityName);
  if (options.featuredEntityData?.parent)
    ent.setParent(options.featuredEntityData?.parent);

  if (options.featuredEntityData?.transform)
    ent.addComponent(new Transform(options.featuredEntityData?.transform));

  let featureEntity = new Entity(ent.name + "-feature-");
  //if(options.featureEntData && options.featureEntData.transform){
  //featureEntity.addComponent(new Transform(options.featureEntData.transform))
  //}else{
  featureEntity.addComponent(new Transform({}));
  //}
  engine.addEntity(featureEntity);
  featureEntity.setParent(ent);

  if (resourcesDropin.featureToggles.enableOverheadLabels) {
    let debugEnt = new Entity();
    debugEnt.addComponent(new TextShape(ent.name));
    debugEnt.addComponent(
      new Transform({
        position: new Vector3(0, 2, 0),
        scale: new Vector3(0.3, 0.3, 0.3),
      })
    );
    engine.addEntity(debugEnt);
    debugEnt.setParent(ent);
  }
  let startSelected =
    options.cardData?.autoSelected !== undefined
      ? options.cardData.autoSelected
      : false;

  //options.curr

  engine.addEntity(ent);
  //hud.attachToEntity(ent)
  // {cardOffset:new Vector3(0, 0.5, -1)
  //,buttonData:{text:"Claim",hoverTextBuyable:"BUY WEARABLE"}}

  let optionsBooth: WearableOptionsType = {
    type: options.type,
    featuredEntityData: options.featuredEntityData,
    cardData: options.cardData,
    nftUIData: options.nftUIData,
  };
  //resourcesDropin.wearables[i].options as WearableBoothArgs

  WEARABLE_BOOTH_MANAGER.createWearableBooth({
    parent: ent,
    featureEntity: featureEntity,
    //hoverText: options.featuredEntityData.hoverText,
    contract: arg.contract,
    itemId: arg.itemId,
    options: optionsBooth,
  });
}
async function createWearableLinks() {
  log("createWearableLinks");
  log("createWearableLinks", resourcesDropin.wearables.length);

  //const fromAddress = await getUserAccount();

  for (let i = 0; i < resourcesDropin.wearables.length; i++) {
    if (
      resourcesDropin.wearables[i].sceneId &&
      resourcesDropin.wearables[i].sceneId != resourcesDropin.sceneId
    ) {
      log(
        "createWearableLinks skipping wearable as scene id does not match",
        resourcesDropin.sceneId,
        resourcesDropin.wearables[i].sceneId
      );
      //skip
      continue;
    }

    createWearableLink(resourcesDropin.wearables[i]);
  }
}

class WearableBooth {}

export class WearableBoothManager {
  booths: Record<string, WearableBooth> = {};

  ui2dNFTPanel?: InfoPanel;
  customNFTDialog?: CustomNFTDialog;

  constructor() {}

  getBoothById(id: string): WearableBooth {
    let coin: WearableBooth = this.booths[id];
    if (coin === undefined) {
      //non optimized way
      //coin = getEntityByName(id) as Coin //TODO optimize
    }
    return coin;
  }

  async createWearableBooth(args: WearableBoothInitArgs) {
    const options = args.options;
    if (options.featuredEntityData) {
      const cardData = options.featuredEntityData;
      let featuredShape;
      if (
        cardData.shapeName !== undefined &&
        cardData.shapeName !== "cube-invisible" &&
        cardData.shapeName !== "cube"
      ) {
        featuredShape = new GLTFShape(cardData.shapeName);
      } else {
        featuredShape = new BoxShape();
      }

      args.featureEntity.addComponent(featuredShape);
      if (
        cardData.shapeName !== undefined &&
        cardData.shapeName === "cube-invisible"
      ) {
        if (!resourcesDropin.featureToggles.makeCubeVisible) {
          args.featureEntity.addComponent(transparent);
        }
      }

      if (cardData.motionData && cardData.motionData.rotationVelocity) {
        args.featureEntity.addComponent(
          new utils.KeepRotatingComponent(cardData.motionData.rotationVelocity)
        );
      }
      if (cardData.motionData && cardData.motionData.moveVelocity) {
        args.featureEntity.addComponent(new KeepFloatingComponent(0.03, 3, 0));
      }
    }

    switch (args.options.type) {
      case "card":
        await this.createWearableBoothCard(args);
        break;
      case "2D-UI":
        await this.createWearable2dWearable(args);
        break;
      default: //link
        this.createWearableBoothLink(args);
    }
  }
  async createWearableBoothLink(args: WearableBoothArgs) {
    /*
    //https://market.decentraland.org/contracts/0x099c493ed36b18b661df222a679fb47c5e1ec2c9/items/0
    let url = "https://market.decentraland.org/contracts/" + args.contractAddress + "/items/" + args.itemId

    if(args.options && args.options.url){
      url = args.options.url
    }

    const parent = args.parent

    parent.addComponent(new OnPointerDown(()=>{
      openExternalURL(url)
      },{hoverText: args.hoverText}))

    args.featureEntity.addComponent(new OnPointerDown(()=>{
      openExternalURL(url)
      },{hoverText: args.hoverText}))*/
  }
  async createWearableBoothCard(args: WearableBoothInitArgs) {
    await createWearableBoothCard(args);
  }

  async createWearable2dWearable(args: WearableBoothInitArgs) {
    if (!args.options.nftUIData)
      throw new Error("args.options.nftUIData required ");

    if (!this.ui2dNFTPanel) this.ui2dNFTPanel = new InfoPanel(UI.canvas);
    if (!this.customNFTDialog)
      this.customNFTDialog = new CustomNFTDialog(UI.canvas);

    //FIXME need to account for multicost
    let singleCost:NFTUIDataCost
    if(args.options.nftUIData.cost !== undefined && args.options.nftUIData.cost.length > 0){
      singleCost = args.options.nftUIData.cost[0]
    }

    args.featureEntity.addComponent(
      new OnPointerDown(
        () => {
          if (!args.options.nftUIData)
            throw new Error("args.options.nftUIData required ");

          switch (args.options.nftUIData.style) {
            case "infoPanel":
              this.ui2dNFTPanel?.openInfoPanel(args.options?.nftUIData);
              break;
            case "version20Modal":
              //,nftUIData:{ style:"version20Modal", type:"MetaDoge",image:BASE_DIR+"images/makersPlaceAliceInWater.png",detailsFontSize:12,detailsInfo:"info",directLink:"https://market.decentraland.org/",directLinkFontSize:10,title:"title", price:100, currency:"Meta Cash" }
              /* imagePath:"https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x47f8b9b9ec0f676b45513c21db7777ad7bfedb35:0/thumbnail",
              imageWidth:1024,
              imageHeight:1024,
              itemName:"Doge Head",
              subtitleItemName:"Created By Metadoge",
              subtitle:"The very first wearable created by Metadoge,\nHolder can swap to LiLDoge here",
              title:"HIHGHLIGHTS",
              coins:"x 3000",
              dollars:"x 1000"*/


              REGISTRY.ui.updateRewardPrompt({
                imagePath: args.options.nftUIData.image,
                subtitle: args.options.nftUIData.detailsInfo,
                title: args.options.nftUIData.detailsTitle ? args.options.nftUIData.detailsTitle : "HIGHLIGHTS",
                itemName: args.options.nftUIData.title,
                cost: args.options.nftUIData.cost, 
                imageHeight: args.options.nftUIData.imageHeight,
                imageWidth: args.options.nftUIData.imageWidth,
                claimCallback: () => {
                  if (false) {
                    //if( isNull(GAME_STATE.playerState.playFabLoginResult) ){
                    log("player not logged in yet");
                    UI.displayAnnouncement("Player not logged in yet");
                    this.customNFTDialog?.hide();
                    REGISTRY.ui.openloginGamePrompt();
                  } else {
                    log("try to buy game");
                    this.customNFTDialog?.hide();
                    buyVC(
                      args.contract,
                      "0",
                      eth
                        .toWei(singleCost.price + "", "ether")
                        .valueOf() + ""
                      , singleCost.label
                    );
                  }
                },
              });
              REGISTRY.ui.openClaimRewardPrompt();
              break;
            default:
              this.customNFTDialog?.openInfoPanel(args.options?.nftUIData);
              this.customNFTDialog?.setBuyCallback(() => {
                if (isNull(GAME_STATE.playerState.playFabLoginResult)) {
                  log("player not logged in yet");
                  UI.displayAnnouncement("Player not logged in yet");
                  this.customNFTDialog?.hide();
                  REGISTRY.ui.openloginGamePrompt();
                } else {
                  log("try to buy game");
                  this.customNFTDialog?.hide();
                  buyVC(
                    args.contract,
                    "0",
                    eth
                      .toWei(singleCost.price + "", "ether")
                      .valueOf() + ""
                    , singleCost.label
                  );
                }
              });
          }

          /*openNFTDialog(
        "ethereum://0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/558536"
      )*/
        },
        { hoverText: args.options.featuredEntityData?.hoverText + "F" }
      )
    );
  }
}

export let WEARABLE_BOOTH_MANAGER: WearableBoothManager;
//REGISTRY.
export function initWearableStore() {
  log("initWearableStore called");
  if (!WEARABLE_BOOTH_MANAGER) {
    WEARABLE_BOOTH_MANAGER = new WearableBoothManager();
  }
  log("initWearableStore calling createWearableLinks");
  //REGISTRY.toggles.createWearableLinks = createWearableLinks
  createWearableLinks();
}

//createPortals()
