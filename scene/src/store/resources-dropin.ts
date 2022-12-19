//import { _scene } from "src/game"
import { REGISTRY } from "src/registry";
import { WearableBoothArgs } from "./types";

export const CARD_OFFSET_SOUTH = new Vector3(0, 0.5, -1);
export const CARD_OFFSET_NORTH = new Vector3(0, 0.5, 1);
export const CARD_OFFSET_WEST = new Vector3(-1.5, 0.5, 0);
export const CARD_OFFSET_EAST = new Vector3(1, 0.5, 0);

const ROTATE_VELOCITY = Quaternion.Euler(0, 10, 0);
const ROTATE_VELOCITY_OFF = undefined; //Quaternion.Euler(0, 0, 0)
const MOVE_VELOCITY = new Vector3(0, 0.05, 0);
const MOVE_INTERVAL = 2;

//export const MODEL_BASE_DIR = "store-assets/"
const BASE_DIR = "store-assets/";

const wearableArr: WearableBoothArgs[] = [
  /*
  //"cube-invisible"  
  {sceneId:"gamimall",contract: "0x47f8b9b9ec0f676b45513c21db7777ad7bfedb35", itemId:"0"
    ,options:{type:"card"
      ,featuredEntityData: {entityName:"ent1",shapeName:"cube",hoverText: "Preview FRONT NO ROTATE", transform:{position: new Vector3(23.68,1,11.47), rotation: Quaternion.Euler(0,0,0), scale: new Vector3(1,1,1)}}
      ,cardData:{ autoSelected:false, cardOffset:CARD_OFFSET_SOUTH, buttonData:{text:"GET",hoverTextBuyable:"GET WEARABLE"} }
    }}
  ,{sceneId:"gamimall",contract: "0x55e59c43f0b2eea14d5126fc8d531476fbd69529", itemId:"0"
    ,options:{type:"card"
      ,featuredEntityData: {entityName:"ent2",shapeName:"cube",hoverText: "Preview LEFT ROTATE",transform:{position: new Vector3(21.4,1.1,8.68), rotation: Quaternion.Euler(0,0,0), scale: new Vector3(1,1,1)},motionData:{rotationVelocity: ROTATE_VELOCITY,moveVelocity: MOVE_VELOCITY, moveInterval:MOVE_INTERVAL}}
      ,cardData:{  cardOffset:CARD_OFFSET_WEST,autoSelected:false, buttonData:{text:"GET",hoverTextBuyable:"GET WEARABLE"} }
    }}
  ,{sceneId:"gamimall",contract: "0x55e59c43f0b2eea14d5126fc8d531476fbd69529", itemId:"0"  
    ,options:{type:"card"
      ,featuredEntityData: {entityName:"ent3",shapeName:"cube",hoverText: "Preview XX",transform:{position: new Vector3(21.4,3,8.68), rotation: Quaternion.Euler(0,0,0), scale: new Vector3(1,1,1)} }
      ,cardData:{cardOffset:CARD_OFFSET_WEST,autoSelected:false, buttonData:{text:"GET",hoverTextBuyable:"GET WEARABLE"} }
    }}
  ,{sceneId:"gamimall",contract: "0x55e59c43f0b2eea14d5126fc8d531476fbd69529", itemId:"0"
    ,options:{type:"2D-UI"
      ,featuredEntityData: {entityName:"ent4",shapeName:"cube",hoverText: "Preview 2d info panel",transform:{position: new Vector3(25.4,1,8.68), rotation: Quaternion.Euler(0,0,0), scale: new Vector3(1,1,1)},motionData:{rotationVelocity: ROTATE_VELOCITY,moveVelocity: MOVE_VELOCITY, moveInterval:MOVE_INTERVAL}}
      ,nftUIData:{ style:"infoPanel", type:"MetaDoge",image:BASE_DIR+"images/makersPlaceAliceInWater.png",detailsFontSize:12,detailsInfo:"info",directLink:"https://market.decentraland.org/",directLinkFontSize:10,title:"title" }
    }}
  ,{sceneId:"gamimall",contract: "0x55e59c43f0b2eea14d5126fc8d531476fbd69529", itemId:"0"
    ,options:{type:"2D-UI"
      ,featuredEntityData: {entityName:"ent4",shapeName:"cube",hoverText: "Preview 2d-cust-cust-ui",transform:{position: new Vector3(25.4,3,8.68), rotation: Quaternion.Euler(0,0,0), scale: new Vector3(1,1,1)},motionData:{rotationVelocity: ROTATE_VELOCITY,moveVelocity: MOVE_VELOCITY, moveInterval:MOVE_INTERVAL}}
      ,nftUIData:{ style:"customNftDialog", type:"MetaDoge",image:BASE_DIR+"images/makersPlaceAliceInWater.png",detailsFontSize:12,detailsInfo:"info",directLink:"https://market.decentraland.org/",directLinkFontSize:10,title:"title", price:20, currency:"Meta Cash" }
    }}*/
];

export function initResourceDropIns() {
  //const keepRotatingComp = new utils.KeepRotatingComponent(Quaternion.Euler(0,15,0))
  let counter = 0; //  disabled for now 10
  let row = 0;
  let col = 0;

  const _scene = REGISTRY.sceneMgr.rootScene.rootEntity;

  if (true) {
    //block scope
    const transformArgs =
      //new Transform(
      {
        position: new Vector3(48, 0, 40),
        rotation: new Quaternion(0, 0, 0, 1),
        scale: new Vector3(1, 1, 1),
      };
    //)

    wearableArr.push({
      sceneId: "gamimall",
      contract: "0x47F8B9b9ec0F676b45513c21db7777Ad7bFEdB35",
      itemId: "0",
      options: {
        type: "2D-UI",
        featuredEntityData: {
          parent: _scene,
          entityName: "ent4",
          shapeName: "models/Rewards/dogehead.glb",
          hoverText: "Claim a Meta Doge Head NFT Wearable",
          transform: transformArgs,
          motionData: {
            rotationVelocity: ROTATE_VELOCITY_OFF,
            moveVelocity: MOVE_VELOCITY,
            moveInterval: MOVE_INTERVAL,
          },
        },
        nftUIData: {
          style: "version20Modal",
          type: "MetaDoge",
          image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x47f8b9b9ec0f676b45513c21db7777ad7bfedb35:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
          //imageSection: {  },
          imageWidth: 1024,
          imageHeight: 1024,
          detailsFontSize: 12,
          
          detailsInfo: "Decentraland Doge Head Wearable NFT.\nSoon to be claimable!!!",
          directLink: "https://market.decentraland.org/",
          directLinkFontSize: 10,
          title: "Doge Head",
          detailsTitle: "HIGH LIGHTS!",
          cost: [
            {
              price: 2000, 
              type: "VirtualCurrency",
              id: "GC",
              label: "LilCoin"
            }
          ]
        },
      },
    });
  }

  for (let x = 0; x < counter; x++) {
    if (x == counter / 2) {
      col = 0;
    }
    if (x >= counter / 2) {
      row = 1;
    }
    //const ent = rewardHeadEntities[p] as Entity

    //const boxReward = new Entity('boxReward'+row + ","+col)
    //boxReward.addComponent(new BoxShape())
    //engine.addEntity(boxReward)
    //boxReward.setParent(_scene)

    const transformArgs =
      //new Transform(
      {
        //{ position: new Vector3( 34.648681640625 , 3.3254482746124268 , 17.1937255859375 ) },HIT ENTITY:  main(Ecl) POS:  {position: {…}, rotation: {…}, scale: {…}}
        position: new Vector3(17.2 + col * 5, 2.3, 34.6 + row * 10.5),
        rotation: new Quaternion(0, 0, 0, 1),
        scale: new Vector3(1, 1, 1),
      };
    //)

    wearableArr.push({
      sceneId: "gamimall",
      contract: "0x47F8B9b9ec0F676b45513c21db7777Ad7bFEdB35",
      itemId: "0",
      options: {
        type: "2D-UI",
        featuredEntityData: {
          parent: _scene,
          entityName: "ent4",
          shapeName: "cube",
          hoverText: "Preview 2d-cust-cust-ui-" + row + "-" + col,
          transform: transformArgs,
          motionData: {
            rotationVelocity: ROTATE_VELOCITY,
            moveVelocity: MOVE_VELOCITY,
            moveInterval: MOVE_INTERVAL,
          },
        },
        nftUIData: {
          style: "customNftDialog",
          type: "MetaDoge",
          image: BASE_DIR + "images/makersPlaceAliceInWater.png",
          detailsFontSize: 12,
          detailsInfo: "info",
          directLink: "https://market.decentraland.org/",
          directLinkFontSize: 10,
          title: "title",
          cost: [
            {
              price: 999999, 
              type: "VirtualCurrency",
              id: "MC",
              label: "Meta Cash"
            }
          ]
        },
      },
    });

    //boxReward.addComponentOrReplace()

    //boxReward.addComponent(keepRotatingComp)

    col++;
    //counter++
    //ent.addComponent(keepRotatingComp)
  }
}

export default {
  baseDir: BASE_DIR,
  featureToggles: {
    enableOverheadLabels: false,
    makeCubeVisible: false,
  },
  lookAt: {
    centerOfRoom: { x: 16 / 2, y: 1, z: 32 / 2 },
  },
  sceneId: "gamimall", //id of scene used to filter larger list of wearables
  //WearableOptionsType
  wearables: wearableArr,
};
