//import * as utils from "@dcl/ecs-scene-utils";
import * as utils from '@dcl-sdk/utils'
import * as eth from "eth-connect";
//import { hud } from "src/builderhud/BuilderHUD";
import resourcesDropin from "./resources-dropin";
//import { CommonResources } from "src/resources/common";
import { createWearableBoothCard } from "../store/wearable-fn";
//TODO ADD BACK
//import { KeepFloatingComponent } from "./anim/keepFloatingComponent";

import {
  NFTUIDataCost,
  WearableBoothArgs,
  WearableBoothInitArgs,
  WearableOptionsType,
} from "./types";
//import { CustomNFTDialog, InfoPanel } from "./2d-ui/nft-infoPanel";
//import * as UI from "@dcl/ui-scene-utils";
import { buyVC } from "./blockchain/index";
import { isNull } from "../utils";
import { GAME_STATE } from "../state";
import { REGISTRY } from "../registry";
//import { _scene2 } from "../nft-frames";
import { CONFIG, SCENE_TYPE_GAMIMALL } from "../config";
import { log } from "../back-ports/backPorts";
import * as ui from 'dcl-ui-toolkit'
import { Entity, GltfContainer, InputAction, TextShape, Transform, VisibilityComponent, engine, pointerEventsSystem } from '@dcl/sdk/ecs';
import { Color3, Vector3 } from '@dcl/sdk/math';
import { cameraOnlyTrigger } from '../sdk7-utils/cameraOnlyTrigger';
import { TransformSafeWrapper } from '../back-ports/workarounds';

const CLASSNAME = "wearables.ts"

log(CLASSNAME,"createWearableLinks start");

//export let transparent = CommonResources.RESOURCES.materials.transparent;

export async function createWearableLink(arg: WearableBoothArgs) {
  log(CLASSNAME,"createWearableLink ", arg);
  let options = arg.options;
  //debugger
  const entName = "bhost-" + options.featuredEntityData?.entityName
  let ent = engine.addEntity()//new Entity(entName);
  //if (options.featuredEntityData?.parent)
  //  ent.setParent(options.featuredEntityData?.parent);

  if (options.featuredEntityData?.transform){
    //ent.addComponent(new Transform(options.featuredEntityData?.transform));
    TransformSafeWrapper.create(ent,{
      ...options.featuredEntityData?.transform,
      parent: options.featuredEntityData?.parent
    })
  }else{
    //define default transform so can set parent if set
    TransformSafeWrapper.create(ent,{
      //...options.featuredEntityData?.transform,
      parent: options.featuredEntityData?.parent
    })
  }

  let featureEntity = engine.addEntity();//new Entity(entName + "-feature-");
  ////if(options.featureEntData && options.featureEntData.transform){
  ////featureEntity.addComponent(new Transform(options.featureEntData.transform))
  ////}else{
    TransformSafeWrapper.create(featureEntity, {parent: ent})
  //featureEntity.addComponent(new Transform({}));
  ////}
  //engine.addEntity(featureEntity);
  //featureEntity.setParent(ent);


  if(options.featuredEntityData !== undefined){
    const cardData = options.featuredEntityData

    if(cardData.lazyLoading !== undefined && cardData.lazyLoading.enabled !== undefined && cardData.lazyLoading.enabled == true){


      //const hasPlaceHolderEntity = cardData.lazyLoading.placeHolderShape !== undefined && cardData.lazyLoading.placeHolderShape == true
      const triggerDebugEnabled = cardData.lazyLoading.trigger.debugEnabled !== undefined && cardData.lazyLoading.trigger.debugEnabled == true
      //HARDCODING THEM ALL TO TRUE FOR TESTING :)
      const triggerDebugUIEnabled = true //cardData.lazyLoading.debugEnabled !== undefined && cardData.lazyLoading.debugEnabled == true
       
      //for debugging
      //utils.triggers.enableDebugDraw(true)

      let featureEntityPlaceHolder:Entity
      let triggerEnt:Entity|undefined = undefined
      let triggerDebugEnt: Entity

      if(cardData.lazyLoading.placeHolder !== undefined && cardData.lazyLoading.placeHolder.enabled !== undefined && cardData.lazyLoading.placeHolder.enabled == true){
        //let featurePlaceHolderShape 
        featureEntityPlaceHolder = engine.addEntity()//new Entity(entName + "-feature.placeholder-");
        if (
          cardData.lazyLoading.placeHolder.shapeName !== undefined &&
          cardData.lazyLoading.placeHolder.shapeName !== "cube-invisible" &&
          cardData.lazyLoading.placeHolder.shapeName !== "cube" &&
          cardData.lazyLoading.placeHolder.shapeName !== "cylinder"
        ) {
          GltfContainer.create(featureEntityPlaceHolder,{
            src:cardData.lazyLoading!.placeHolder!.shapeName
          })
          VisibilityComponent.createOrReplace(featureEntityPlaceHolder,{ 
            visible: true
          })
          //featurePlaceHolderShape = new GLTFShape( cardData.lazyLoading.placeHolder.shapeName );
        } else if(cardData.lazyLoading.placeHolder.shapeName === "cylinder"){
          //featurePlaceHolderShape = new CylinderShape();
        } else {
          //featurePlaceHolderShape = new BoxShape();
        }
        
        ////if(options.featureEntData && options.featureEntData.transform){
        ////featureEntity.addComponent(new Transform(options.featureEntData.transform))
        ////}else{

          TransformSafeWrapper.create(featureEntityPlaceHolder,{
            position: cardData.lazyLoading.placeHolder.position !== undefined ? cardData.lazyLoading.placeHolder.position : Vector3.Zero()
          })
          //featureEntityPlaceHolder.addComponent(new Transform({
          //  position: cardData.lazyLoading.placeHolder.position !== undefined ? cardData.lazyLoading.placeHolder.position : Vector3.Zero()
          //}));
          //featureEntityPlaceHolder.addComponent(featurePlaceHolderShape)
        ////}
        //engine.addEntity(featureEntityPlaceHolder);

        if(cardData.lazyLoading.placeHolder.positionType ==='featureEnt.parent'){
          Transform.getMutable(featureEntityPlaceHolder).parent = Transform.get(ent).parent
          //featureEntityPlaceHolder.setParent(ent.getParent())
        }else if( cardData.lazyLoading.placeHolder.positionType ==='featureEnt'){
          Transform.getMutable(featureEntityPlaceHolder).parent = ent
          //featureEntityPlaceHolder.setParent(ent);
        }else if( cardData.lazyLoading.placeHolder.positionType ==='absolute'){
          
        }
        ////
        ////engine.removeEntity(featureEntityPlaceHolder)
      }

      if(cardData.lazyLoading.trigger.positionType ==='featureEnt.parent'){
        triggerEnt = engine.addEntity()
        TransformSafeWrapper.create(triggerEnt,{
          parent: Transform.get(ent).parent
        })
        //triggerEnt.addComponent(triggerComp)
        //engine.addEntity(triggerEnt)
        //triggerEnt.setParent(ent.getParent())
      }else if( cardData.lazyLoading.trigger.positionType ==='featureEnt'){
        triggerEnt = engine.addEntity()
        TransformSafeWrapper.create(triggerEnt,{
          parent: ent
        })
        //triggerEnt.addComponent(triggerComp)
        //engine.addEntity(triggerEnt)
        //triggerEnt.setParent(ent)
      }else if( cardData.lazyLoading.trigger.positionType ==='absolute'){
        triggerEnt = engine.addEntity()
        //triggerEnt.addComponent(triggerComp)
        
        pointerEventsSystem.onPointerDown(
          {
            entity: triggerEnt,
            opts: {
                button: InputAction.IA_POINTER,
                hoverText: cardData.shapeName + "\ndebug trigger ent for",
            }
          },
          ()=>{}
        )
          //triggerEnt.addComponent(new OnPointerDown(
          //()=>{},{
          //hoverText: cardData.shapeName + "\ndebug trigger ent for"
        //}))
        //engine.addEntity(triggerEnt)
      }

      if(triggerEnt !== undefined){
        if(triggerDebugUIEnabled){
          triggerDebugEnt = engine.addEntity()
          
          //TODO ADD BACK??
          //triggerDebugEnt.addComponent(new BoxShape()).withCollisions=false

          TransformSafeWrapper.create(triggerDebugEnt,
          //triggerDebugEnt.addComponent( new Transform(
            {position:Vector3.add(
              cardData.lazyLoading.trigger.position ? cardData.lazyLoading.trigger.position : Vector3.Zero(),
              Vector3.create(0,1,0)) }
          ) 
          ////engine.addEntity(triggerDebugEnt)//
          ////triggerDebugEnt.setParent(triggerEnt)
        
        
        }
      }


      //TODO ADD THIS BACK! create trigger on triggerEnt

      //TODO SOLVE ON OFF!!! just add/remove gltfcontainer????
      //utils.triggers
      //only need to test against camera layer
      cameraOnlyTrigger.addTrigger(
        triggerEnt!, utils.NO_LAYERS, utils.LAYER_1,
        [{type:'sphere',radius: cardData.lazyLoading.trigger.size.x, position: cardData.lazyLoading.trigger.position}],
        (entity: Entity) => {    
          VisibilityComponent.createOrReplace(featureEntity,{ visible: true })
          if(triggerDebugEnt) { VisibilityComponent.createOrReplace(triggerDebugEnt,{ visible: true }) }   
          if(featureEntityPlaceHolder) { VisibilityComponent.createOrReplace(featureEntityPlaceHolder,{ visible: false }) }
        },
        (entity: Entity) => {
          VisibilityComponent.createOrReplace(featureEntity,{ visible: false })
          if(triggerDebugEnt !== undefined) engine.removeEntity(triggerDebugEnt)      
          if(triggerDebugEnt) { VisibilityComponent.createOrReplace(triggerDebugEnt,{ visible: false }) }
          if(featureEntityPlaceHolder) { VisibilityComponent.createOrReplace(featureEntityPlaceHolder,{ visible: true }) }
        },
        Color3.Red()
      )
      /*const triggerComp = new utils.TriggerComponent(
        new utils.TriggerSphereShape(
          cardData.lazyLoading.trigger.size.x,
          cardData.lazyLoading.trigger.position,
        ),
        {
          enableDebug: triggerDebugEnabled,
          onCameraEnter: () => {
            engine.addEntity(featureEntity)   
            if(triggerDebugEnt !== undefined) engine.addEntity(triggerDebugEnt)         
            if(featureEntityPlaceHolder !== undefined) engine.removeEntity(featureEntityPlaceHolder)      
          },
          onCameraExit: () => {
            engine.removeEntity(featureEntity) 
            if(triggerDebugEnt !== undefined) engine.removeEntity(triggerDebugEnt)      
            if(featureEntityPlaceHolder !== undefined) engine.addEntity(featureEntityPlaceHolder)         
          }
        }
      )*/
      
      //default feature hidden
      VisibilityComponent.createOrReplace(featureEntity,{ visible: false })

      //engine.removeEntity(featureEntity)   
    }//end lazy loading trigger
    
  }

  if (resourcesDropin.featureToggles.enableOverheadLabels) {
    let debugEnt = engine.addEntity()
    TextShape.create(debugEnt,{
      text:entName
    })
    //debugEnt.addComponent(new TextShape(ent.name));
    /*debugEnt.addComponent(
      new Transform({
        position: Vector3.create(0, 2, 0),
        scale: Vector3.create(0.3, 0.3, 0.3),
      })
    );*/
    TransformSafeWrapper.create(debugEnt,{
      position: Vector3.create(0, 2, 0),
      scale: Vector3.create(0.3, 0.3, 0.3),
      parent: ent
    })
    //engine.addEntity(debugEnt);
    //debugEnt.setParent(ent);
  }
  let startSelected =
    options.cardData?.autoSelected !== undefined
      ? options.cardData.autoSelected
      : false;

  ////options.curr

  //engine.addEntity(ent);
  ////hud.attachToEntity(ent)
  //// {cardOffset:Vector3.create(0, 0.5, -1)
  ////,buttonData:{text:"Claim",hoverTextBuyable:"BUY WEARABLE"}}

  let optionsBooth: WearableOptionsType = {
    type: options.type,
    featuredEntityData: options.featuredEntityData,
    cardData: options.cardData,
    nftUIData: options.nftUIData,
  };
  ////resourcesDropin.wearables[i].options as WearableBoothArgs

  WEARABLE_BOOTH_MANAGER.createWearableBooth({
    parent: ent,
    featureEntity: featureEntity,
    ////hoverText: options.featuredEntityData.hoverText,
    contract: arg.contract,
    itemId: arg.itemId,
    options: optionsBooth,
  });
}
async function createWearableLinks() {
  log(CLASSNAME,"createWearableLinks");
  log(CLASSNAME,"createWearableLinks", resourcesDropin.wearables.length);

  ////const fromAddress = await getUserAccount();

  for (let i = 0; i < resourcesDropin.wearables.length; i++) {
    if (
      resourcesDropin.wearables[i].sceneId &&
      resourcesDropin.wearables[i].sceneId != resourcesDropin.sceneId
    ) {
      log(CLASSNAME,
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

  //REMOVED FOR NOW NOT USED
  //ui2dNFTPanel?: InfoPanel;
  //customNFTDialog?: CustomNFTDialog;

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
      //let featuredShape;
      if (
        cardData.shapeName !== undefined &&
        cardData.shapeName !== "cube-invisible" &&
        cardData.shapeName !== "cube"
      ) {
        GltfContainer.create(args.featureEntity,{
          //TODO change shapeName to PBGltfContainer
          src:cardData.shapeName
        })
        //featuredShape = new GLTFShape(cardData.shapeName);
      } else {
        //TODO ADD ME BACK
        //featuredShape = new BoxShape();
      }

      //args.featureEntity.addComponent(featuredShape);
      if (
        cardData.shapeName !== undefined &&
        cardData.shapeName === "cube-invisible"
      ) {
        if (!resourcesDropin.featureToggles.makeCubeVisible) {
          //TODO ADD ME BACK
          //TODO just dont add the meshrenderer
          //args.featureEntity.addComponent(transparent);
        }
      }

      if (cardData.motionData && cardData.motionData.rotationVelocity) {
        utils.perpetualMotions.startRotation(args.featureEntity, cardData.motionData.rotationVelocity)
        /*args.featureEntity.addComponent(
          new utils.KeepRotatingComponent(cardData.motionData.rotationVelocity)
        );*/
      }
      if (cardData.motionData && cardData.motionData.moveVelocity) {
        log(CLASSNAME,CLASSNAME,"IMPLEMENT KeepFloatingComponent!!!",args,cardData.motionData)
        //args.featureEntity.addComponent(new KeepFloatingComponent(0.03, 3, 0));
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
    //WAS FULLY COMMENTED OUT, REMOVED 
  }
  async createWearableBoothCard(args: WearableBoothInitArgs) {
    await createWearableBoothCard(args);
  }

  async createWearable2dWearable(args: WearableBoothInitArgs) {
    if (!args.options.nftUIData)
      throw new Error("args.options.nftUIData required ");

    //REMOVED FOR NOW NOT USED
    //if (!this.ui2dNFTPanel) this.ui2dNFTPanel = new InfoPanel(UI.canvas);
    //if (!this.customNFTDialog)
    //  this.customNFTDialog = new CustomNFTDialog(CLASSNAME,UI.canvas);

    //FIXME need to account for multicost
    let singleCost:NFTUIDataCost
    if(args.options.nftUIData.cost !== undefined && args.options.nftUIData.cost.length > 0){
      singleCost = args.options.nftUIData.cost[0]
    }

    pointerEventsSystem.onPointerDown(
      {
        entity:args.featureEntity,
        opts: {
            button: InputAction.IA_POINTER,
            hoverText: args.options.featuredEntityData?.hoverText,
        }
      },
      //args.featureEntity.addComponent(
      //new OnPointerDown(
        () => {
          if (!args.options.nftUIData)
            throw new Error("args.options.nftUIData required ");

          log(CLASSNAME,"args.options.nftUIData clicked",args.options.nftUIData.style)
          switch (args.options.nftUIData.style) {
            case "infoPanel":
              //REMOVED FOR NOW NOT USED
              //this.ui2dNFTPanel?.openInfoPanel(args.options?.nftUIData);
              break;
            case "version20Modal":
              ////,nftUIData:{ style:"version20Modal", type:"MetaDoge",image:BASE_DIR+"images/makersPlaceAliceInWater.png",detailsFontSize:12,detailsInfo:"info",directLink:"https://market.decentraland.org/",directLinkFontSize:10,title:"title", price:100, currency:"Meta Cash" }
              
              if(CONFIG.STORE_WEARABLES_ON_OPEN_CLAIM_PROMPT_DO_SAVE){
                if(GAME_STATE.gameRoom) GAME_STATE.gameRoom.send("save-game",{})
              }
              REGISTRY.ui.updateRewardPrompt({
                imagePath: args.options.nftUIData.image,
                subtitle: args.options.nftUIData.detailsInfo,
                title: args.options.nftUIData.detailsTitle ? args.options.nftUIData.detailsTitle : "HIGHLIGHTS",
                itemName: args.options.nftUIData.title,
                checkRemoteCostPrices: args.options.nftUIData.checkRemoteCostPrices,
                checkLatestMarketPrices: args.options.nftUIData.checkLatestMarketPrices,
                cost: args.options.nftUIData.cost, 
                imageHeight: args.options.nftUIData.imageHeight,
                imageWidth: args.options.nftUIData.imageWidth,
                showStockQty: args.options.nftUIData.showStockQty,
                itemQtyCurrent: args.options.nftUIData.qtyCurrent,
                itemQtyTotal: args.options.nftUIData.qtyTotal,
                claimWindowEnabled: args.options.nftUIData.claimWindowEnabled,//defaults to false
                claimStartMS: args.options.nftUIData.claimStartMS,
                claimEndMS: args.options.nftUIData.claimEndMS,
                contract: args.contract,//refreshDataOnOpen: args.options.nftUIData
                itemId: args.itemId,
                claimCallback: () => {
                  if (false) {
                    /* //REMOVED FOR NOW NOT USED
                    ////if( isNull(GAME_STATE.playerState.playFabLoginResult) ){
                    log(CLASSNAME,"player not logged in yet");
                    UI.displayAnnouncement("Player not logged in yet");
                    //this.customNFTDialog?.hide();
                    REGISTRY.ui.openloginGamePrompt();*/
                  } else {
                    log(CLASSNAME,"try to buy game");
                    //REMOVED FOR NOW NOT USED
                    //this.customNFTDialog?.hide();
                    buyVC(
                      args.contract,
                      "0",
                      eth
                        .toWei(singleCost.price + "", "ether")
                        .valueOf() + ""
                      , singleCost.label
                      , undefined
                      , args.options.nftUIData
                    );
                  }
                },
              });
              REGISTRY.ui.openClaimRewardPrompt();
              break;
            default:
              //REMOVED FOR NOW NOT USED
              /*
              this.customNFTDialog?.openInfoPanel(args.options?.nftUIData);
              this.customNFTDialog?.setBuyCallback(() => {
                if (isNull(GAME_STATE.playerState.playFabLoginResult)) {
                  log(CLASSNAME,"player not logged in yet");
                  UI.displayAnnouncement("Player not logged in yet");
                  this.customNFTDialog?.hide();
                  REGISTRY.ui.openloginGamePrompt();
                } else {
                  log(CLASSNAME,"try to buy game");
                  this.customNFTDialog?.hide();
                  buyVC(
                    args.contract,
                    "0",
                    eth
                      .toWei(singleCost.price + "", "ether")
                      .valueOf() + ""
                    , singleCost.label
                    , undefined
                    , args.options.nftUIData
                  );
                }
              });
              */
             log(CLASSNAME,CLASSNAME,"IMPLEMENT ME!!!",args.options.nftUIData.style)
          }

          /*openNFTDialog(CLASSNAME,
        "ethereum://0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/558536"
      )*/
        }
      //)
    );
  }
}

let WEARABLE_BOOTH_MANAGER: WearableBoothManager;
//REGISTRY.
export function initWearableStore() {
  const METHOD_NAME = "initWearableStore()"
  log(CLASSNAME,METHOD_NAME,"ENTRY");
  if(CONFIG.SCENE_TYPE !== SCENE_TYPE_GAMIMALL){
    log(CLASSNAME,METHOD_NAME,"DISABLED FOR SCENE TYPE",CONFIG.SCENE_TYPE)
    return
  }
  if (!WEARABLE_BOOTH_MANAGER) {
    WEARABLE_BOOTH_MANAGER = new WearableBoothManager();
  }
  log(CLASSNAME,"initWearableStore calling createWearableLinks");
  //REGISTRY.toggles.createWearableLinks = createWearableLinks
  createWearableLinks();
}

//createPortals()
