//import { _scene } from "src/game"
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { REGISTRY } from "../registry";
import { WearableBoothArgs } from "./types";
import { Entity } from "@dcl/sdk/ecs";
import { log } from "../back-ports/backPorts";
import { CONFIG, SCENE_TYPE_GAMIMALL } from "../config";

const CLASSNAME = "resources-dropins.ts"

export const CARD_OFFSET_SOUTH = Vector3.create(0, 0.5, -1);
export const CARD_OFFSET_NORTH = Vector3.create(0, 0.5, 1);
export const CARD_OFFSET_WEST = Vector3.create(-1.5, 0.5, 0);
export const CARD_OFFSET_EAST = Vector3.create(1, 0.5, 0);

const ROTATE_VELOCITY = Quaternion.fromEulerDegrees(0, 10, 0);
const ROTATE_VELOCITY_OFF:Quaternion|undefined = undefined; //Quaternion.Euler(0, 0, 0)
const MOVE_VELOCITY = Vector3.create(0, 0.05, 0);
const MOVE_INTERVAL = 2;

//export const MODEL_BASE_DIR = "store-assets/"
const BASE_DIR = "store-assets/";

const wearableArr: WearableBoothArgs[] = [
  /*
  //"cube-invisible"  
  {sceneId:"gamimall",contract: "0x47f8b9b9ec0f676b45513c21db7777ad7bfedb35", itemId:"0"
    ,options:{type:"card"
      ,featuredEntityData: {entityName:"ent1",shapeName:"cube",hoverText: "Preview FRONT NO ROTATE", transform:{position: Vector3.create(23.68,1,11.47), rotation: Quaternion.Euler(0,0,0), scale: Vector3.create(1,1,1)}}
      ,cardData:{ autoSelected:false, cardOffset:CARD_OFFSET_SOUTH, buttonData:{text:"GET",hoverTextBuyable:"GET WEARABLE"} }
    }}
  ,{sceneId:"gamimall",contract: "0x55e59c43f0b2eea14d5126fc8d531476fbd69529", itemId:"0"
    ,options:{type:"card"
      ,featuredEntityData: {entityName:"ent2",shapeName:"cube",hoverText: "Preview LEFT ROTATE",transform:{position: Vector3.create(21.4,1.1,8.68), rotation: Quaternion.Euler(0,0,0), scale: Vector3.create(1,1,1)},motionData:{rotationVelocity: ROTATE_VELOCITY,moveVelocity: MOVE_VELOCITY, moveInterval:MOVE_INTERVAL}}
      ,cardData:{  cardOffset:CARD_OFFSET_WEST,autoSelected:false, buttonData:{text:"GET",hoverTextBuyable:"GET WEARABLE"} }
    }}
  ,{sceneId:"gamimall",contract: "0x55e59c43f0b2eea14d5126fc8d531476fbd69529", itemId:"0"  
    ,options:{type:"card"
      ,featuredEntityData: {entityName:"ent3",shapeName:"cube",hoverText: "Preview XX",transform:{position: Vector3.create(21.4,3,8.68), rotation: Quaternion.Euler(0,0,0), scale: Vector3.create(1,1,1)} }
      ,cardData:{cardOffset:CARD_OFFSET_WEST,autoSelected:false, buttonData:{text:"GET",hoverTextBuyable:"GET WEARABLE"} }
    }}
  ,{sceneId:"gamimall",contract: "0x55e59c43f0b2eea14d5126fc8d531476fbd69529", itemId:"0"
    ,options:{type:"2D-UI"
      ,featuredEntityData: {entityName:"ent4",shapeName:"cube",hoverText: "Preview 2d info panel",transform:{position: Vector3.create(25.4,1,8.68), rotation: Quaternion.Euler(0,0,0), scale: Vector3.create(1,1,1)},motionData:{rotationVelocity: ROTATE_VELOCITY,moveVelocity: MOVE_VELOCITY, moveInterval:MOVE_INTERVAL}}
      ,nftUIData:{ style:"infoPanel", type:"MetaDoge",image:BASE_DIR+"images/makersPlaceAliceInWater.png",detailsFontSize:12,detailsInfo:"info",directLink:"https://market.decentraland.org/",directLinkFontSize:10,title:"title" }
    }}
  ,{sceneId:"gamimall",contract: "0x55e59c43f0b2eea14d5126fc8d531476fbd69529", itemId:"0"
    ,options:{type:"2D-UI"
      ,featuredEntityData: {entityName:"ent4",shapeName:"cube",hoverText: "Preview 2d-cust-cust-ui",transform:{position: Vector3.create(25.4,3,8.68), rotation: Quaternion.Euler(0,0,0), scale: Vector3.create(1,1,1)},motionData:{rotationVelocity: ROTATE_VELOCITY,moveVelocity: MOVE_VELOCITY, moveInterval:MOVE_INTERVAL}}
      ,nftUIData:{ style:"customNftDialog", type:"MetaDoge",image:BASE_DIR+"images/makersPlaceAliceInWater.png",detailsFontSize:12,detailsInfo:"info",directLink:"https://market.decentraland.org/",directLinkFontSize:10,title:"title", price:20, currency:"Meta Cash" }
    }}*/
];

export function initResourceDropIns(_scene:Entity) {
  const METHOD_NAME = "initResourceDropIns()"
  log(CLASSNAME,METHOD_NAME,"ENTRY");
  if(CONFIG.SCENE_TYPE !== SCENE_TYPE_GAMIMALL){
    log(CLASSNAME,METHOD_NAME,"DISABLED FOR SCENE TYPE",CONFIG.SCENE_TYPE)
    return
  }
  //const keepRotatingComp = new utils.KeepRotatingComponent(Quaternion.Euler(0,15,0))
  let counter = 0; //  disabled for now 10
  let row = 0;
  let col = 0;

  //const _scene = //REGISTRY.sceneMgr.rootScene.rootEntity;

  //START MAKING REWARD L1
  if (true) {
    //block scope
    const transformArgs =
      //new Transform(
      {
        position: Vector3.create(48, 0, 40),
        rotation: Quaternion.create(0, 0, 0, 1),
        scale: Vector3.create(1, 1, 1),
      };
    //)

    wearableArr.push({
      sceneId: "gamimall",
      contract: "0x1e5c7f7bd7bc0cf32f9739a31e6930ae09f02b59",
      itemId: "0",
      options: {
        type: "2D-UI",
        featuredEntityData: {
          parent: _scene,
          entityName: "entL1",
          shapeName: "models/Rewards/rewardL1.glb",
          hoverText: "Claim a SX Bet Wearable",
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
          image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x1e5c7f7bd7bc0cf32f9739a31e6930ae09f02b59:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
          //imageSection: {  },
          imageWidth: 1024,
          imageHeight: 1024,
          detailsFontSize: 12, 
          
          detailsInfo: "4% GamiMall Coin bonus, 35 USD  \n free credits in SX Bet",
          directLink: "https://market.decentraland.org/",
          directLinkFontSize: 10,
          title: "DAOAlchemist JetPack",
          detailsTitle: "HIGHLIGHTS!",
          cost: [
            {
              price: 9999999, 
              type: "VirtualCurrency",
              id: "GC",
              label: "Coins",
            },
            {
              price: 9999999, 
              type: "VirtualCurrency",
              id: "MC",
              label: "Coins"
            }
          ],
          showStockQty:true,//defaults to true
          qtyCurrent: -2,
          qtyTotal:100,
          claimWindowEnabled:true,//defaults to true
          checkLatestMarketPrices: true,
          claimStartMS: Date.UTC(2023,8,15,15,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
          claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
        },
      },
    });
  }

    //START MAKING REWARD L2
    if (true) {
      //block scope
      const transformArgs =
        //new Transform(
        {
          position: Vector3.create(48, 0, 40),
          rotation: Quaternion.create(0, 0, 0, 1),
          scale: Vector3.create(1, 1, 1),
        };
      //)
  
      wearableArr.push({
        sceneId: "gamimall",
        contract: "0xe8420d97a71f29a682fb573bc4ee82a152ec93cf",
        itemId: "0",
        options: {
          type: "2D-UI",
          featuredEntityData: {
            parent: _scene,
            entityName: "entL2",
            shapeName: "models/Rewards/rewardL2.glb",
            hoverText: "Claim a MetaViu Wearable",
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
            image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xe8420d97a71f29a682fb573bc4ee82a152ec93cf:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
            //imageSection: {  },
            imageWidth: 1024,
            imageHeight: 1024,
            detailsFontSize: 12, 
            
            detailsInfo: "4% GamiMall Coin bonus, a total  \n  500 USD raffle for 10 people",
            directLink: "https://market.decentraland.org/",
            directLinkFontSize: 10,
            title: "DAOAlchemist Trouser",
            detailsTitle: "HIGHLIGHTS!",
            cost: [
              {
                price: 9999999, 
                type: "VirtualCurrency",
                id: "GC",
                label: "Coins",
              },
              {
                price: 9999999, 
                type: "VirtualCurrency",
                id: "MC",
                label: "Coins"
              }
            ],
            showStockQty:true,//defaults to true
            qtyCurrent: -2,
            qtyTotal:90,
            claimWindowEnabled:true,//defaults to true
            checkLatestMarketPrices: true,
            claimStartMS:  Date.UTC(2023,8,15,15,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
            claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
          },
        },
      });
    }

//START MAKING REWARD L3
if (true) {
  //block scope
  const transformArgs =
    //new Transform(
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x83d431a9a5084bf26ef4e1081e26fbe90798aa3a",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entL3",
        shapeName: "models/Rewards/rewardL3.glb",
        hoverText: "Claim a Soul Magic Wearable",
        transform: transformArgs,

        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"models/Rewards/UniversalGIft.glb",  
            positionType: 'absolute', 
            position: Vector3.create(34.7,0.8,30.7)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: Vector3.create(8,1,8),
            position: Vector3.create(40,4,35)//where to put the trigger, triggerPositionType affects its relative offset
          } 
        },
        motionData: {
          rotationVelocity: ROTATE_VELOCITY_OFF,
          moveVelocity: MOVE_VELOCITY,
          moveInterval: MOVE_INTERVAL,
        },
      },
      nftUIData: {
        style: "version20Modal",
        type: "MetaDoge",
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x83d431a9a5084bf26ef4e1081e26fbe90798aa3a:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "2% GamiMall Coin bonus \n Critical material in Soul Magic",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Soul Magic StarDust",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          },
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "MC",
            label: "Coins"
          }
        ],
        checkLatestMarketPrices:true,
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 60,
        claimWindowEnabled:true,//defaults to true
        claimStartMS:  Date.UTC(2023,8,15,14,30,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}

//START MAKING REWARD L4
if (true) {
  //block scope
  const transformArgs =
    //new Transform(
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0xf3f331927ce45cb51b1b73b40b3bbda1e186bf87",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entL4",
        shapeName: "models/Rewards/rewardL4.glb",
        hoverText: "Claim a VIPE wearable",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"models/Rewards/UniversalGIft.glb",  
            positionType: 'absolute', 
            position: Vector3.create(34.7,0.8,30.7+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: Vector3.create(8,1,8),
            position: Vector3.create(40,4,35)//where to put the trigger, triggerPositionType affects its relative offset
          } 
        },
        motionData: {
          rotationVelocity: ROTATE_VELOCITY_OFF,
          moveVelocity: MOVE_VELOCITY,
          moveInterval: MOVE_INTERVAL,
        },
      },
      nftUIData: {
        style: "version20Modal",
        type: "MetaDoge",
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xf3f331927ce45cb51b1b73b40b3bbda1e186bf87:0/thumbnail",//"https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x9B0A93EA49955a5ef1878c1a1e8f8645d049e597:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "2% GamiMall Coin bonus \n Raffle tickets for 10 VIPE heros",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "VIPE Jacket",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          },
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "MC",
            label: "Coins"
          }
        ],
        //checkLatestMarketPrices:true,
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 100,
        claimWindowEnabled:true,//defaults to true
        checkLatestMarketPrices: true,
        claimStartMS:  Date.UTC(2023,8,15,14,30,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}

//START MAKING REWARD L5
if (true) {
  //block scope
  const transformArgs =
    //new Transform(
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x43dd2ba27cc0ff7b7fe014b0f2c2147ba7b72e9d",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entL5",
        shapeName: "models/Rewards/rewardL5.glb",
        hoverText: "Claim a MUA Wearable",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"models/Rewards/UniversalGIft.glb",  
            positionType: 'absolute', 
            position: Vector3.create(34.7,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: Vector3.create(8,1,8),
            position: Vector3.create(40,4,35)//where to put the trigger, triggerPositionType affects its relative offset
          } 
        },
        motionData: {
          rotationVelocity: ROTATE_VELOCITY_OFF,
          moveVelocity: MOVE_VELOCITY,
          moveInterval: MOVE_INTERVAL,
        },
      },
      nftUIData: {
        style: "version20Modal",
        type: "MetaDoge",
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x43dd2ba27cc0ff7b7fe014b0f2c2147ba7b72e9d:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "3% GamiMall Coin bonus \n total 50 USD raffle",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Cyber Tiara",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          },
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "MC",
            label: "Coins"
          }
        ],
        checkLatestMarketPrices:true,
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 50,
        claimWindowEnabled:true,//defaults to true
        claimStartMS:  Date.UTC(2023,8,15,14,30,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}

//START MAKING REWARD L6
if (true) {
  //block scope
  const transformArgs =
    //new Transform(
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x89182938e2051d0e4d03603fdbc5deb2ebefa814",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entL6",
        shapeName: "models/Rewards/rewardL6.glb",
        hoverText: "Claim a MRDingia Builds Wearable",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"models/Rewards/UniversalGIft.glb",  
            positionType: 'absolute', 
            position: Vector3.create(34.7,0.8,30.7+3.85+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: Vector3.create(8,1,8),
            position: Vector3.create(40,4,35)//where to put the trigger, triggerPositionType affects its relative offset
          } 
        },
        motionData: {
          rotationVelocity: ROTATE_VELOCITY_OFF,
          moveVelocity: MOVE_VELOCITY,
          moveInterval: MOVE_INTERVAL,
        },
      },
      nftUIData: {
        style: "version20Modal",
        type: "MetaDoge",
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x89182938e2051d0e4d03603fdbc5deb2ebefa814:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "3% GamiMall Coin Bonus \n total 50 USD raffle",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Dhingia Bot Buddy",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          },
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "MC",
            label: "Coins"
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 70,
        claimWindowEnabled:true,//defaults to true
        checkLatestMarketPrices: true,
        claimStartMS:  Date.UTC(2023,8,15,14,30,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}

//START MAKING REWARD R1
if (true) {
  //block scope
  const transformArgs =
    //new Transform(
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x498857ed6659791c204b07fc4c3527692f92e119",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entR1",
        shapeName: "models/Rewards/rewardR1.glb",
        hoverText: "Claim a Decentral Games Wearable ",
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x498857ed6659791c204b07fc4c3527692f92e119:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "4% GamiMall Coin bonus \n SNG wearbale with 15 shines",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "DAOAlchemist Helmet",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          },
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "MC",
            label: "Coins"
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 100,
        claimWindowEnabled:true,//defaults to true
        checkLatestMarketPrices: true,
        claimStartMS: Date.UTC(2023,8,15,15,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}

//START MAKING REWARD R2
if (true) {
  //block scope
  const transformArgs =
    //new Transform(
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0xe0dfb4793f82b5c2b619fa4305a308e5880c2537",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entR2",
        shapeName: "models/Rewards/rewardR2.glb",
        hoverText: "Claim a WonderZone Wearable",
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xe0dfb4793f82b5c2b619fa4305a308e5880c2537:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "4% GamiMall Coin bonus \n 4% WonderMine minging bonus",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "DAOAlchemist Torso",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          },
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "MC",
            label: "Coins"
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 50,
        claimWindowEnabled:true,//defaults to true
        checkLatestMarketPrices: true,
        claimStartMS: Date.UTC(2023,8,15,15,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}

//START MAKING REWARD R3
if (true) {
  //block scope
  const transformArgs =
    //new Transform(
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0xe93455667c8ee9fe0294920b9c0afaccfab84158",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entR3",
        shapeName: "models/Rewards/rewardR3.glb",
        hoverText: "Claim Meta Residence Tower Wearable ",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"models/Rewards/UniversalGIft.glb",  
            positionType: 'absolute', 
            position: Vector3.create(34.7+10.75,0.8,30.7)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: Vector3.create(8,1,8),
            position: Vector3.create(40,4,35)//where to put the trigger, triggerPositionType affects its relative offset
          } 
        },
        motionData: {
          rotationVelocity: ROTATE_VELOCITY_OFF,
          moveVelocity: MOVE_VELOCITY,
          moveInterval: MOVE_INTERVAL,
        },
      },
      nftUIData: {
        style: "version20Modal",
        type: "MetaDoge",
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xe93455667c8ee9fe0294920b9c0afaccfab84158:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "3% GamiMall Coin bonus \n 5 coins per 15 minutes in MRT ",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "MRT Pink Slippers",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          },
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "MC",
            label: "Coins"
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 60,
        claimWindowEnabled:true,//defaults to true
        checkLatestMarketPrices: true,
        claimStartMS: Date.UTC(2023,8,15,14,30,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}

//START MAKING REWARD R4
if (true) {
  //block scope
  const transformArgs =
    //new Transform(
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x681a6e37e96340f21bf7401e3d770d10e3e1f1d7",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entR4",
        shapeName: "models/Rewards/rewardR4.glb",
        hoverText: "Claim a VroomWay wearable ",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"models/Rewards/UniversalGIft.glb",  
            positionType: 'absolute', 
            position: Vector3.create(34.7+10.75,0.8,30.7+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: Vector3.create(8,1,8),
            position: Vector3.create(40,4,35)//where to put the trigger, triggerPositionType affects its relative offset
          } 
        },
        motionData: {
          rotationVelocity: ROTATE_VELOCITY_OFF,
          moveVelocity: MOVE_VELOCITY,
          moveInterval: MOVE_INTERVAL,
        },
      },
      nftUIData: {
        style: "version20Modal",
        type: "MetaDoge",
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x681a6e37e96340f21bf7401e3d770d10e3e1f1d7:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "3% GamiMall coin bonus \n smart wearable with multiple utilities ",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "BuildaVroom Skin",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          },
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "MC",
            label: "Coins"
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 50,
        claimWindowEnabled:true,//defaults to true
        checkLatestMarketPrices: true,
        claimStartMS: Date.UTC(2023,8,15,14,30,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}

//START MAKING REWARD R5
if (true) {
  //block scope
  const transformArgs =
    //new Transform(
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x49962c9b084430ac77fd3f3960cc43ee6a5033ee",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entR5",
        shapeName: "models/Rewards/rewardR5.glb",
        hoverText: "Claim a MetaParty Wearable",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"models/Rewards/UniversalGIft.glb",  
            positionType: 'absolute', 
            position: Vector3.create(34.7+10.75,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: Vector3.create(8,1,8),
            position: Vector3.create(40,4,35)//where to put the trigger, triggerPositionType affects its relative offset
          } 
        },
        motionData: {
          rotationVelocity: ROTATE_VELOCITY_OFF,
          moveVelocity: MOVE_VELOCITY,
          moveInterval: MOVE_INTERVAL,
        },
      },
      nftUIData: {
        style: "version20Modal",
        type: "MetaDoge",
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x49962c9b084430ac77fd3f3960cc43ee6a5033ee:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "3% GamiMall Coin bonus \n total 50 USD raffle",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "DAOAlchemist Glasses",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          },
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "MC",
            label: "Coins"
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 60,
        claimWindowEnabled:true,//defaults to true
        checkLatestMarketPrices: true,
        claimStartMS: Date.UTC(2023,8,15,14,30,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}

//START MAKING REWARD R6
if (true) {
  //block scope
  const transformArgs =
    //new Transform(
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x8b9d82662463c15017fd6b30de51e4754b57dc33",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entR6",
        shapeName: "models/Rewards/rewardR6.glb",
        hoverText: "Claim a DG Live Wearable",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"models/Rewards/UniversalGIft.glb",  
            positionType: 'absolute', 
            position: Vector3.create(34.7+10.75,0.8,30.7+3.85+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: Vector3.create(8,1,8),
            position: Vector3.create(40,4,35)//where to put the trigger, triggerPositionType affects its relative offset
          } 
        }, 
        motionData: {
          rotationVelocity: ROTATE_VELOCITY_OFF,
          moveVelocity: MOVE_VELOCITY,
          moveInterval: MOVE_INTERVAL,
        },
      },
      nftUIData: {
        style: "version20Modal",
        type: "MetaDoge",
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x8b9d82662463c15017fd6b30de51e4754b57dc33:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "3% Meta GamiMall Coins Bonus \n total 50 USD raffle",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "DAOAlchemist Mask",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          },
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "MC",
            label: "Coins"
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 80,
        claimWindowEnabled:true,//defaults to true
        checkLatestMarketPrices: true,
        claimStartMS:Date.UTC(2023,8,15,14,30,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}

////START MAKING REWARD R61
if (true) {
  //block scope
  const transformArgs =
    //new Transform(
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x27637f88b881538c7148c78ccaae10d6f2bf22a2",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entR6",
        shapeName: "models/Rewards/RewardR61.glb",
        hoverText: "Claim a SpottieWifi skin",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"models/Rewards/UniversalGIft.glb",  
            positionType: 'absolute', 
            position: Vector3.create(34.7+10.75,0.8,30.7-3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: Vector3.create(8,1,8),
            position: Vector3.create(40,4,30)//where to put the trigger, triggerPositionType affects its relative offset
          } 
        }, 
        motionData: {
          rotationVelocity: ROTATE_VELOCITY_OFF,
          moveVelocity: MOVE_VELOCITY,
          moveInterval: MOVE_INTERVAL,
        },
      },
      nftUIData: {
        style: "version20Modal",
        type: "MetaDoge",
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x27637f88b881538c7148c78ccaae10d6f2bf22a2:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "Claim a SpottieWifi skin, win \n All time high NFT",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Spottiewifi Skin",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          },
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "MC",
            label: "Coins"
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 80,
        claimWindowEnabled:true,//defaults to true
        checkLatestMarketPrices: true,
        claimStartMS:Date.UTC(2023,8,15,14,30,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}
////START MAKING REWARD R61

//START MAKING REWARD S1
if (true) {
  //block scope
  const transformArgs =
    //new Transform(
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x6fad7711dda6bb2f6901508e81dcf0ca20ee16c7",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS1",
        shapeName: "models/Rewards/rewardS1.glb",
        hoverText: "Claim a Cutter for a Cause Wearable ",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"models/Rewards/SilversponsorGIft.glb",  
            positionType: 'featureEnt', 
            //position: Vector3.create(34.7+10.75,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: Vector3.create(14,1,1),
            position: Vector3.create(40,1 ,61)//where to put the trigger, triggerPositionType affects its relative offset
          } 
        }, 
        motionData: {
          rotationVelocity: ROTATE_VELOCITY_OFF,
          moveVelocity: MOVE_VELOCITY,
          moveInterval: MOVE_INTERVAL,
        },
      },
      nftUIData: {
        style: "version20Modal",
        type: "MetaDoge",
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x6fad7711dda6bb2f6901508e81dcf0ca20ee16c7:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "Cute Cookie Pawprint Gloves ",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Pawprint Gloves",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 100,
        claimWindowEnabled:true,//defaults to true
        checkLatestMarketPrices: false,
        claimStartMS: Date.UTC(2023,8,15,14,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}

//START MAKING REWARD S2
if (true) {
  //block scope
  const transformArgs =
    //new Transform(
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x4a92c8e90d2134cdca4a50fbf8261ed798ca7873",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS2",
        shapeName: "models/Rewards/rewardS2.glb",
        hoverText: "Claim a SpanishMuseum Wearable ",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"",  
            positionType: 'featureEnt', 
            //position: Vector3.create(34.7+10.75,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: Vector3.create(14,1,1),
            position: Vector3.create(40,1 ,61)//where to put the trigger, triggerPositionType affects its relative offset
          } 
        }, 
        motionData: {
          rotationVelocity: ROTATE_VELOCITY_OFF,
          moveVelocity: MOVE_VELOCITY,
          moveInterval: MOVE_INTERVAL,
        },
      },
      nftUIData: {
        style: "version20Modal",
        type: "MetaDoge",
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x4a92c8e90d2134cdca4a50fbf8261ed798ca7873:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "Classic Spanish Museum wearable",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "SPM Jacket",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 100,
        claimWindowEnabled:true,//defaults to true
        checkLatestMarketPrices: false,
        claimStartMS: Date.UTC(2023,8,15,14,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}

//START MAKING REWARD S3
if (true) {
  //block scope
  const transformArgs =
    //new Transform(
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x5343af57a265ffd9b64762d692528b87c1286053",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS3",
        shapeName: "models/Rewards/rewardS3.glb",
        hoverText: "Claim a DJ-Trax Wearable",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"",  
            positionType: 'featureEnt', 
            //position: Vector3.create(34.7+10.75,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: Vector3.create(14,1,1),
            position: Vector3.create(40,1 ,61)//where to put the trigger, triggerPositionType affects its relative offset
          } 
        }, 
        motionData: {
          rotationVelocity: ROTATE_VELOCITY_OFF,
          moveVelocity: MOVE_VELOCITY,
          moveInterval: MOVE_INTERVAL,
        },
      },
      nftUIData: {
        style: "version20Modal",
        type: "MetaDoge",
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x5343af57a265ffd9b64762d692528b87c1286053:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 512,
        imageHeight: 512,
        detailsFontSize: 12, 
        
        detailsInfo: "Very popular TRax Head",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "DJ-Trax Head",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 50,
        claimWindowEnabled:true,//defaults to true
        checkLatestMarketPrices: false,
        claimStartMS: Date.UTC(2023,8,15,14,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}

//START MAKING REWARD S4
if (true) {
  //block scope
  const transformArgs =
    //new Transform(
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0xf3eb38b1649bdccc8761f3a0526b3173597a0363",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS4",
        shapeName: "models/Rewards/rewardS4.glb",
        hoverText: "Claim a Low Poly Models Wearable",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"",  
            positionType: 'featureEnt', 
            //position: Vector3.create(34.7+10.75,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: Vector3.create(14,1,1),
            position: Vector3.create(40,1 ,61)//where to put the trigger, triggerPositionType affects its relative offset
          } 
        }, 
        motionData: {
          rotationVelocity: ROTATE_VELOCITY_OFF,
          moveVelocity: MOVE_VELOCITY,
          moveInterval: MOVE_INTERVAL,
        },
      },
      nftUIData: {
        style: "version20Modal",
        type: "MetaDoge",
        image: "images/wearables/Lowpolyreward.png",//"https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x30d3387ff3de2a21bef7032f82d00ff7739e403c:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 512,
        imageHeight: 512,
        detailsFontSize: 12, 
        
        detailsInfo: "Claim 1 random part of the wearble that \n is in the suite (3 claims per account)",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "LPMxSOA|Breakout",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 150,
        claimWindowEnabled:true,//defaults to true
        checkLatestMarketPrices: true,
        claimStartMS:Date.UTC(2023,8,15,14,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}

//START MAKING REWARD S5
if (true) {
  //block scope
  const transformArgs =
    //new Transform(
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x367999927133f4d54fccb80150013933a139abb1",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS5",
        shapeName: "models/Rewards/rewardS5.glb",
        hoverText: "Claim a PinkPunk Wearable ",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"",  
            positionType: 'featureEnt', 
            //position: Vector3.create(34.7+10.75,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: Vector3.create(14,1,1),
            position: Vector3.create(40,1 ,61)//where to put the trigger, triggerPositionType affects its relative offset
          } 
        }, 
        motionData: {
          rotationVelocity: ROTATE_VELOCITY_OFF,
          moveVelocity: MOVE_VELOCITY,
          moveInterval: MOVE_INTERVAL,
        },
      },
      nftUIData: {
        style: "version20Modal",
        type: "MetaDoge",
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x367999927133f4d54fccb80150013933a139abb1:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "Interesting design by Punk Pink",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "5 Ghosts",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 50,
        claimWindowEnabled:true,//defaults to true
        checkLatestMarketPrices: false,
        claimStartMS:Date.UTC(2023,8,15,14,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}

//START MAKING REWARD S6
if (true) {
  //block scope
  const transformArgs =
    //new Transform(
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x35f8aee672cde8e5fd09c93d2bfe4ff5a9cf0756",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS6",
        shapeName: "models/Rewards/rewardS6.glb",
        hoverText: "Claim a GolfCraft Fashion Tickets",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"",  
            positionType: 'featureEnt', 
            //position: Vector3.create(34.7+10.75,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: Vector3.create(14,1,1),
            position: Vector3.create(40,1 ,61)//where to put the trigger, triggerPositionType affects its relative offset
          } 
        }, 
        motionData: {
          rotationVelocity: ROTATE_VELOCITY_OFF,
          moveVelocity: MOVE_VELOCITY,
          moveInterval: MOVE_INTERVAL,
        },
      },
      nftUIData: {
        style: "version20Modal",
        type: "MetaDoge",
        image: "images/wearables/Golfcraftreward.png",//"https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x0e4f31c0c0d4cefa34b624c6ad09e4c04af624fa:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 512,
        imageHeight: 512,
        detailsFontSize: 12, 
        
        detailsInfo: "Holders of this NFT can Redeem \n 500 GolfCraft Fashion Tickets",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "GC Fashion Tickets",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 7,
        claimWindowEnabled:true,//defaults to true
        checkLatestMarketPrices: false,
        claimStartMS:Date.UTC(2023,8,15,14,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}

//START MAKING REWARD S7
if (true) {
  //block scope
  const transformArgs =
    //new Transform(
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x8755e5bc8dc1458285161f4f4c3562535aa37610",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS7",
        shapeName: "models/Rewards/rewardS7.glb",
        hoverText: "Claim a Polygonal Mind Wearable",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"",  
            positionType: 'featureEnt', 
            //position: Vector3.create(34.7+10.75,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: Vector3.create(14,1,1),
            position: Vector3.create(40,1 ,61)//where to put the trigger, triggerPositionType affects its relative offset
          } 
        }, 
        motionData: {
          rotationVelocity: ROTATE_VELOCITY_OFF,
          moveVelocity: MOVE_VELOCITY,
          moveInterval: MOVE_INTERVAL,
        },
      },
      nftUIData: {
        style: "version20Modal",
        type: "MetaDoge",
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x8755e5bc8dc1458285161f4f4c3562535aa37610:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "Utility tool in next MegaCube",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Mega Vision",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          }
        ],
        checkLatestMarketPrices:false,
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 1000,
        claimWindowEnabled:false,//defaults to true
        claimStartMS: Date.UTC(2023,3,7,12,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}

//START MAKING REWARD S8
if (true) {
  //block scope
  const transformArgs =
    //new Transform(
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x1d0f011d0ab221c87b3047140395a0c2510e8067",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS8",
        shapeName: "models/Rewards/rewardS8.glb",
        hoverText: "Claim a Coca-Cola Jumper",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"",  
            positionType: 'featureEnt', 
            //position: Vector3.create(34.7+10.75,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: Vector3.create(14,1,1),
            position: Vector3.create(40,1 ,61)//where to put the trigger, triggerPositionType affects its relative offset
          } 
        }, 
        motionData: {
          rotationVelocity: ROTATE_VELOCITY_OFF,
          moveVelocity: MOVE_VELOCITY,
          moveInterval: MOVE_INTERVAL,
        },
      },
      nftUIData: {
        style: "version20Modal",
        type: "MetaDoge",
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x1d0f011d0ab221c87b3047140395a0c2510e8067:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "Classic, Classic and Classic",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Coca-Cola Jumper",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 50,
        claimWindowEnabled:true,//defaults to true
        checkLatestMarketPrices: false,
        claimStartMS:Date.UTC(2023,3,7,12,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}

//START MAKING REWARD S9
if (true) {
  //block scope
  const transformArgs =
    //new Transform(
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x0c0de214ab1ceae679c757249868ac656cf51f32",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS9",
        shapeName: "models/Rewards/rewardS9.glb",
        hoverText: "Claim a BeatTrekkers Wearable",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"",  
            positionType: 'featureEnt', 
            //position: Vector3.create(34.7+10.75,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: Vector3.create(14,1,1),
            position: Vector3.create(40,1 ,61)//where to put the trigger, triggerPositionType affects its relative offset
          } 
        }, 
        motionData: {
          rotationVelocity: ROTATE_VELOCITY_OFF,
          moveVelocity: MOVE_VELOCITY,
          moveInterval: MOVE_INTERVAL,
        },
      },
      nftUIData: {
        style: "version20Modal",
        type: "MetaDoge",
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x0c0de214ab1ceae679c757249868ac656cf51f32:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "Do you feel the beats?",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "BeatTrekkers Jeans",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 100,
        claimWindowEnabled:true,//defaults to true
        checkLatestMarketPrices: false,
        claimStartMS:Date.UTC(2023,8,15,14,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}

//START MAKING REWARD S10
if (true) {
  //block scope
  const transformArgs =
    //new Transform(
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x4c3b25b9d607cd3baa61158110e9bf5429df13b8",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS10",
        shapeName: "models/Rewards/rewardS10.glb",
        hoverText: "Claim a SXBet T-shirt",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"",  
            positionType: 'featureEnt', 
            //position: Vector3.create(34.7+10.75,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: Vector3.create(14,1,1),
            position: Vector3.create(40,1 ,61)//where to put the trigger, triggerPositionType affects its relative offset
          } 
        }, 
        motionData: {
          rotationVelocity: ROTATE_VELOCITY_OFF,
          moveVelocity: MOVE_VELOCITY,
          moveInterval: MOVE_INTERVAL,
        },
      },
      nftUIData: {
        style: "version20Modal",
        type: "MetaViu Hat",
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x4c3b25b9d607cd3baa61158110e9bf5429df13b8:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "20 usd free credits in SXBet",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "SXBet Tshirt",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 200,
        claimWindowEnabled:true,//defaults to true
        checkLatestMarketPrices: false,
        claimStartMS:Date.UTC(2023,8,15,14,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}

//START MAKING REWARD S11
if (true) {
  //block scope
  const transformArgs =
    //new Transform(
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x348829d82bf657a8640bd96d7a8e89eef12fe72e",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS10",
        shapeName: "models/Rewards/rewardS11.glb",
        hoverText: "Claim a MetaFoxCrew Wearable",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"",  
            positionType: 'featureEnt', 
            //position: Vector3.create(34.7+10.75,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: Vector3.create(14,1,1),
            position: Vector3.create(40,1 ,61)//where to put the trigger, triggerPositionType affects its relative offset
          } 
        }, 
        motionData: {
          rotationVelocity: ROTATE_VELOCITY_OFF,
          moveVelocity: MOVE_VELOCITY,
          moveInterval: MOVE_INTERVAL,
        },
      },
      nftUIData: {
        style: "version20Modal",
        type: "NUO Mask",
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x348829d82bf657a8640bd96d7a8e89eef12fe72e:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "Be a member of the Metafox Crew",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Metafox Crew Member",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 9999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 100,
        claimWindowEnabled:true,//defaults to true
        checkLatestMarketPrices: false,
        claimStartMS:Date.UTC(2023,8,15,14,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}

//START MAKING REWARD S12
if (true) {
  //block scope
  const transformArgs =
    //new Transform(
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x683156c152fb247701c5bde3b6da4c97f88b98e7",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS12",
        shapeName: "models/Rewards/rewardS12.glb",
        hoverText: "Claim a CreatorDAO Wearable",
        transform: transformArgs,
        motionData: {
          rotationVelocity: ROTATE_VELOCITY_OFF,
          moveVelocity: MOVE_VELOCITY,
          moveInterval: MOVE_INTERVAL,
        },
      },
      nftUIData: {
        style: "version20Modal",
        type: "MVFW METADOGE",
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x683156c152fb247701c5bde3b6da4c97f88b98e7:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "The first DCL wearable of Creator DAO",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "CDVeste",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 9999999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 100,
        claimWindowEnabled:true,//defaults to true
        checkLatestMarketPrices: false,
        claimStartMS: Date.UTC(2023,8,15,14,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}

//OTHERS

  //START MAKING REWARD Moon1
  if (true) {
    //block scope
    const transformArgs =
      {
        position: Vector3.create(48, 0, 40),
        rotation: Quaternion.create(0, 0, 0, 1),
        scale: Vector3.create(1, 1, 1),
      };

    wearableArr.push({
      sceneId: "gamimall",
      contract: "0x19c068d957b8f95e3935ad63a07c0c3c4a66a703",
      itemId: "0",
      options: {
        type: "2D-UI",
        featuredEntityData: {
          parent: _scene,
          entityName: "ent4",
          shapeName: "models/Rewards/Moon1.glb",
          hoverText: "Claim a MetaMine Cyber Glass #1 ",
          transform: transformArgs,

        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"models/Rewards/MoonSquareGifts.glb",  
            positionType: 'featureEnt', 
            //position: Vector3.create(34.7,0.8,30.7)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: Vector3.create(25,1,25),
            position: Vector3.create(25,24,52)//where to put the trigger, triggerPositionType affects its relative offset
          } 
        },
          motionData: {
            rotationVelocity: ROTATE_VELOCITY_OFF,
            moveVelocity: MOVE_VELOCITY,
            moveInterval: MOVE_INTERVAL,
          },
        },
        nftUIData: {
          style: "version20Modal",
          type: "MetaDoge",
          image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x19c068d957b8f95e3935ad63a07c0c3c4a66a703:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
          //imageSection: {  },
          imageWidth: 1024,
          imageHeight: 1024,
          detailsFontSize: 12,
          
          detailsInfo: "MetaMine Cyber Glass #1, it can give \n holder 1% coin bonus",
          directLink: "https://market.decentraland.org/",
          directLinkFontSize: 10,
          title: "Cyber Glass #1",
          detailsTitle: "HIGHLIGHTS!",
          cost: [
            {
              price: 999999, 
              type: "VirtualCurrency",
              id: "GC",
              label: "Coins",
            },
            {
              price: 999999, 
              type: "VirtualCurrency",
              id: "MC",
              label: "Coins"
            }
          ],
          showStockQty:true,//defaults to true
          qtyCurrent: -2,
          qtyTotal: 500,
          claimWindowEnabled:true,//defaults to true
          claimStartMS:  Date.UTC(2022,11,23,12,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
          claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
        },
      },
    });
  } 
  ////END MAKING REWARD Moon1

  //START MAKING REWARD Moon2
    if (true) {
      //block scope
      const transformArgs =
        {
          position: Vector3.create(48, 0, 40),
          rotation: Quaternion.create(0, 0, 0, 1),
          scale: Vector3.create(1, 1, 1),
        };  
  
      wearableArr.push({
        sceneId: "gamimall",
        contract: "0x1ad53cce925b96fd723a4515da35ac3d19f9a9af",
        itemId: "0",
        options: {
          type: "2D-UI",
          featuredEntityData: {
            parent: _scene,
            entityName: "ent4",
            shapeName: "models/Rewards/Moon2.glb",
            hoverText: "Claim a MetaMine Ear Phone ",
            transform: transformArgs, //gives position of the model
            lazyLoading:{
              enabled: true,
              debugEnabled:false, 
              placeHolder:{
                enabled:true,
                shapeName:"",  
                positionType: 'featureEnt', 
                //position: Vector3.create(34.7,0.8,30.7)
              }, 
              trigger: { 
                debugEnabled:false,
                positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
                size: Vector3.create(25,1,25),
                position: Vector3.create(25,24,52)//where to put the trigger, triggerPositionType affects its relative offset
              } 
            },
            motionData: {
              rotationVelocity: ROTATE_VELOCITY_OFF,
              moveVelocity: MOVE_VELOCITY,
              moveInterval: MOVE_INTERVAL,
            },
          },
          nftUIData: {
            style: "version20Modal",
            type: "MetaDoge",
            image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x1ad53cce925b96fd723a4515da35ac3d19f9a9af:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
            //imageSection: {  },
            imageWidth: 1024,
            imageHeight: 1024,
            detailsFontSize: 12,
            
            detailsInfo: "MetaMine Cyber EarPhone, it can give \n holder 1% coin bonus",
            directLink: "https://market.decentraland.org/",
            directLinkFontSize: 10,
            title: "Cyber Ear Phone",
            detailsTitle: "HIGHLIGHTS!",
            cost: [
              {
                price: 999999, 
                type: "VirtualCurrency",
                id: "GC",
                label: "Coins",
              },
              {
                price: 999999, 
                type: "VirtualCurrency",
                id: "MC",
                label: "Coins"
              }
            ],
            showStockQty:true,//defaults to true
            qtyCurrent: -2,
            qtyTotal: 500,
            claimWindowEnabled:true,//defaults to true
            claimStartMS: Date.UTC(2022,11,23,12,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
            claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
          },
        },
      });
    } 
    ////END MAKING REWARD Moon2

      //START MAKING REWARD Moon3
  if (true) {
    //block scope
    const transformArgs =
      {
        position: Vector3.create(48, 0, 40),//37,3,3),//
        rotation: Quaternion.create(0, 0, 0, 1),
        scale: Vector3.create(1, 1, 1),
      };

    wearableArr.push({
      sceneId: "gamimall",
      contract: "0x73968d44377a914d7deb7bdc65c33e5cfe400c39",
      itemId: "0",
      options: {
        type: "2D-UI",
        featuredEntityData: {
          parent: _scene,
          entityName: "ent4",
          shapeName: "models/Rewards/Moon3.glb",//
          hoverText: "Claim a Cyber Glass #2 ",
          transform: transformArgs,
          lazyLoading:{
            enabled: true,
            debugEnabled:false, 
            placeHolder:{
              enabled:true,
              shapeName:"models/Rewards/MoonSquareGifts.glb",  
              positionType: 'featureEnt', 
              //position: Vector3.create(34.7,0.8,30.7)
            }, 
            trigger: { 
              debugEnabled:false,
              positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
              size: Vector3.create(25,1,25),
              position: Vector3.create(25,24,52)//where to put the trigger, triggerPositionType affects its relative offset
            } 
          },
          motionData: {
            rotationVelocity: ROTATE_VELOCITY_OFF,
            moveVelocity: MOVE_VELOCITY,
            moveInterval: MOVE_INTERVAL,
          },
        },
        nftUIData: {
          style: "version20Modal",
          type: "MetaDoge",
          image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x73968d44377a914d7deb7bdc65c33e5cfe400c39:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
          //imageSection: {  },
          imageWidth: 1024,
          imageHeight: 1024,
          detailsFontSize: 12,
          
          detailsInfo: "MetaMine Cyber Glass #2, it can give \n holder 1% coin bonus",
          directLink: "https://market.decentraland.org/",
          directLinkFontSize: 10,
          title: "Cyber Glass #2",
          detailsTitle: "HIGHLIGHTS!",
          cost: [
            {
              price: 999999, 
              type: "VirtualCurrency",
              id: "GC",
              label: "Coins",
            },
            {
              price: 999999, 
              type: "VirtualCurrency",
              id: "MC",
              label: "Coins"
            }
          ],
          showStockQty:true,//defaults to true
          qtyCurrent: -2,
          qtyTotal: 500,
          claimWindowEnabled:true,//defaults to true
          claimStartMS: Date.UTC(2022,11,23,12,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
          claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
        },
      },
    });
  } 
  ////END MAKING REWARD Moon3

  //START MAKING REWARD Moon4
        if (true) {
          //block scope
          const transformArgs =
            {
              position: Vector3.create(48, 0, 40),//37,3,3),//
              rotation: Quaternion.create(0, 0, 0, 1),
              scale: Vector3.create(1, 1, 1),
            };
      
          wearableArr.push({
            sceneId: "gamimall",
            contract: "0x2596aa76d20d911b591e8c5f24a55c3c5a5d75c0",
            itemId: "0",
            options: {
              type: "2D-UI",
              featuredEntityData: {
                parent: _scene,
                entityName: "ent4",
                shapeName: "models/Rewards/Moon4.glb",//
                hoverText: "Claim a Helpimstreaming wearable",
                transform: transformArgs,
                lazyLoading:{
                  enabled: true,
                  debugEnabled:false, 
                  placeHolder:{
                    enabled:true,
                    shapeName:"models/Rewards/MoonSquareGifts.glb",  
                    positionType: 'featureEnt', 
                    //position: Vector3.create(34.7,0.8,30.7)
                  }, 
                  trigger: { 
                    debugEnabled:false,
                    positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
                    size: Vector3.create(25,1,25),
                    position: Vector3.create(25,24,52)//where to put the trigger, triggerPositionType affects its relative offset
                  } 
                },
                motionData: {
                  rotationVelocity: ROTATE_VELOCITY_OFF,
                  moveVelocity: MOVE_VELOCITY,
                  moveInterval: MOVE_INTERVAL,
                },
              },
              nftUIData: {
                style: "version20Modal",
                type: "MetaDoge",
                image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x2596aa76d20d911b591e8c5f24a55c3c5a5d75c0:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
                //imageSection: {  },
                imageWidth: 512,
                imageHeight: 512,
                detailsFontSize: 12,
                
                detailsInfo: "Sponsored By Helpimstreaming \n MANA logo on your eyes",
                directLink: "https://market.decentraland.org/",
                directLinkFontSize: 10,
                title: "MANA Vision",
                detailsTitle: "HIGHLIGHTS!",
                cost: [
                  {
                    price: 999999, 
                    type: "VirtualCurrency",
                    id: "GC",
                    label: "Coins",
                  },
                  {
                    price: 999999, 
                    type: "VirtualCurrency",
                    id: "MC",
                    label: "Coins"
                  }
                ],
                showStockQty:true,//defaults to true
                qtyCurrent: -2,
                qtyTotal: 100,
                claimWindowEnabled:true,//defaults to true
                claimStartMS: Date.UTC(2022,11,23,12,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
                claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
              },
            },
          });
        } 
        ////END MAKING REWARD Moon4

  //START MAKING REWARD Heaven1
    if (true) {
      //block scope
      const transformArgs =
        {
          position: Vector3.create(48, 0, 40),
          rotation: Quaternion.create(0, 0, 0, 1),
          scale: Vector3.create(1, 1, 1),
        };
  
      wearableArr.push({
        sceneId: "gamimall",
        contract: "0xb48c49837467698962753e512670e3d5d874b627",
        itemId: "0",
        options: {
          type: "2D-UI",
          featuredEntityData: {
            parent: _scene,
            entityName: "ent4",
            shapeName: "models/Rewards/Heaven1.glb",
            hoverText: "Claim a Febo Slim Pants",
            transform: transformArgs,
            lazyLoading:{
              enabled: true,
              debugEnabled:false, 
              placeHolder:{
                enabled:true,
                shapeName:"models/Rewards/HeavenSquareGifts.glb",  
                positionType: 'featureEnt', 
                //position: Vector3.create(34.7,0.8,30.7)
              }, 
              trigger: { 
                debugEnabled:false,
                positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
                size: Vector3.create(20,1,20),
                position: Vector3.create(27,51,56)//where to put the trigger, triggerPositionType affects its relative offset
              } 
            },
            motionData: {
              rotationVelocity: ROTATE_VELOCITY_OFF,
              moveVelocity: MOVE_VELOCITY,
              moveInterval: MOVE_INTERVAL,
            },
          },
          nftUIData: {
            style: "version20Modal",
            type: "MetaDoge",
            image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xb48c49837467698962753e512670e3d5d874b627:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
            //imageSection: {  },
            imageWidth: 1024,
            imageHeight: 1024,
            detailsFontSize: 12,
            
            detailsInfo: "Slick trouser designed by Febo \n with future utility ",
            directLink: "https://market.decentraland.org/",
            directLinkFontSize: 10,
            title: "Febo Slim Pants",
            detailsTitle: "HIGHLIGHTS!",
            cost: [
              {
                price: 999999, 
                type: "VirtualCurrency",
                id: "GC",
                label: "Coins",
              },
              {
                price: 999999, 
                type: "VirtualCurrency",
                id: "MC",
                label: "Coins"
              }
            ],
            showStockQty:true,//defaults to true
            qtyCurrent: -2,
            qtyTotal: 27,
            claimWindowEnabled:true,//defaults to true
            claimStartMS:  Date.UTC(2023,3,7,12,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
            claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
          },
        },
      });
    } 
    ////END MAKING REWARD Heaven1

    //START MAKING REWARD Heaven2
if (true) {
  //block scope
  const transformArgs =
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0xf34db83d8d0b281909a27cd12dcae68ef68f9a34",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "ent4",
        shapeName: "models/Rewards/Heaven2.glb",
        hoverText: "Claim a Soul Magic Rabbit Hat ",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"",  
            positionType: 'featureEnt', 
            //position: Vector3.create(34.7,0.8,30.7)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: Vector3.create(20,1,20),
            position: Vector3.create(27,51,56)//where to put the trigger, triggerPositionType affects its relative offset
          } 
        },
        motionData: {
          rotationVelocity: ROTATE_VELOCITY_OFF,
          moveVelocity: MOVE_VELOCITY,
          moveInterval: MOVE_INTERVAL,
        },
      },
      nftUIData: {
        style: "version20Modal",
        type: "MetaDoge",
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xf34db83d8d0b281909a27cd12dcae68ef68f9a34:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12,
        
        detailsInfo: "Year of Rabbit Hat \n designed by Soul Magic",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Rabbit Hat",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 100,
        claimWindowEnabled:true,//defaults to true
        claimStartMS:  -1,//Date.UTC(2022,11,10,13,30,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
} 

  ////END MAKING REWARD Heaven2

//START MAKING REWARD Mars1
if (true) {
  //block scope
  const transformArgs =
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x55e59c43f0b2eea14d5126fc8d531476fbd69529",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "ent4",
        shapeName: "models/Rewards/Mars1.glb",
        hoverText: "Claim a Muscle Doge",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"models/Rewards/MarsSquareGifts.glb",  
            positionType: 'featureEnt', 
            //position: Vector3.create(34.7,0.8,30.7)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: Vector3.create(18,1,18),
            position: Vector3.create(50,32,60)//where to put the trigger, triggerPositionType affects its relative offset
          } 
        },
        motionData: {
          rotationVelocity: ROTATE_VELOCITY_OFF,
          moveVelocity: MOVE_VELOCITY,
          moveInterval: MOVE_INTERVAL,
        },
      },
      nftUIData: {
        style: "version20Modal",
        type: "MetaDoge",
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x55e59c43f0b2eea14d5126fc8d531476fbd69529:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 512,
        imageHeight: 512,
        detailsFontSize: 12,
        
        detailsInfo: "Turn to a Muscle Doge!!!",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Muscle Doge",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          },
          {
            price: 999999, 
            type: "VirtualCurrency",
            id: "MC",
            label: "Coins"
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 80,
        claimWindowEnabled:true,//defaults to true
        claimStartMS:  -1,//Date.UTC(2023,3,7,12,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
} 
////END MAKING REWARD Mars1

  //START MAKING REWARD Mars2
    if (true) {
      //block scope
      const transformArgs =
        {
          position: Vector3.create(48, 0, 40),
          rotation: Quaternion.create(0, 0, 0, 1),
          scale: Vector3.create(1, 1, 1),
        };
  
      wearableArr.push({
        sceneId: "gamimall",
        contract: "0x85503e1c32b7669614ff5738c5da732b6670e8cd",
        itemId: "0",
        options: {
          type: "2D-UI",
          featuredEntityData: {
            parent: _scene,
            entityName: "ent4",
            shapeName: "models/Rewards/Mars2.glb",
            hoverText: "Claim a MetaMine Cyber Earring ",
            transform: transformArgs,
            lazyLoading:{
              enabled: true,
              debugEnabled:false, 
              placeHolder:{
                enabled:true,
                shapeName:"",  
                positionType: 'featureEnt', 
                //position: Vector3.create(34.7,0.8,30.7)
              }, 
              trigger: { 
                debugEnabled:false,
                positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
                size: Vector3.create(18,1,18),
                position: Vector3.create(50,32,60)//where to put the trigger, triggerPositionType affects its relative offset
              } 
            },
            motionData: {
              rotationVelocity: ROTATE_VELOCITY_OFF,
              moveVelocity: MOVE_VELOCITY,
              moveInterval: MOVE_INTERVAL,
            },
          },
          nftUIData: {
            style: "version20Modal",
            type: "MetaDoge",
            image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x85503e1c32b7669614ff5738c5da732b6670e8cd:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
            //imageSection: {  },
            imageWidth: 1024,
            imageHeight: 1024,
            detailsFontSize: 12,
            
            detailsInfo: "MetaMine Cyber Earring, it can give \n holder 1% coin bonus",
            directLink: "https://market.decentraland.org/",
            directLinkFontSize: 10,
            title: "Cyber Earring",
            detailsTitle: "HIGHLIGHTS!",
            cost: [
              {
                price: 999999, 
                type: "VirtualCurrency",
                id: "GC",
                label: "Coins",
              },
              {
                price: 999999, 
                type: "VirtualCurrency",
                id: "MC",
                label: "Coins"
              }
            ],
            showStockQty:true,//defaults to true
            qtyCurrent: -2,
            qtyTotal: 500,
            claimWindowEnabled:true,//defaults to true
            claimStartMS:  Date.UTC(2022,11,23,12,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
            claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
          },
        },
      });
    } 
    ////END MAKING REWARD Mars2

//START MAKING REWARD Mars3
if (true) {
  //block scope
  const transformArgs =
    {
      position: Vector3.create(48, 0, 40),
      rotation: Quaternion.create(0, 0, 0, 1),
      scale: Vector3.create(1, 1, 1),
    };

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0xd2132c5f42e9b0e2fb494b98963dc9a4470c19d0",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "ent4",
        shapeName: "models/Rewards/Mars3.glb",
        hoverText: "Claim a Exodus wearable ",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"",  
            positionType: 'featureEnt', 
            //position: Vector3.create(34.7,0.8,30.7)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: Vector3.create(18,1,18),
            position: Vector3.create(50,32,60)//where to put the trigger, triggerPositionType affects its relative offset
          } 
        },
        motionData: {
          rotationVelocity: ROTATE_VELOCITY_OFF,
          moveVelocity: MOVE_VELOCITY,
          moveInterval: MOVE_INTERVAL,
        },
      },
      nftUIData: {
        style: "version20Modal",
        type: "MetaDoge",
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xd2132c5f42e9b0e2fb494b98963dc9a4470c19d0:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 512,
        imageHeight: 512,
        detailsFontSize: 12,
        
        detailsInfo: "Sponsored by JTV's Exodus",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Red santa hat",
        detailsTitle: "HIGHLIGHTS!",
        cost: [
          {
            price: 999999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          },
          {
            price: 999999, 
            type: "VirtualCurrency",
            id: "MC",
            label: "Coins"
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 50,
        claimWindowEnabled:true,//defaults to true
        claimStartMS:  Date.UTC(2022,11,23,12,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
} 
////END MAKING REWARD Mars3

  //START MAKING REWARD Muscle1
  if (true) {
    //block scope
    const transformArgs =
      {
        position: Vector3.create(48, 0, 40),
        rotation: Quaternion.create(0, 0, 0, 1),
        scale: Vector3.create(1, 1, 1),
      };
  
    wearableArr.push({
      sceneId: "gamimall",
      contract: "0x3674eb9ab0e9678db7f0d25b646cbcc78ab4432c",
      itemId: "0",
      options: {
        type: "2D-UI",
        featuredEntityData: {
          parent: _scene,
          entityName: "ent4",
          shapeName: "models/Rewards/aloneone.glb",
          hoverText: "Claim a MetaViu Hat",
          transform: transformArgs,
          lazyLoading:{
            enabled: true,
            debugEnabled:false, 
            placeHolder:{
              enabled:true,
              shapeName:"models/Rewards/MuscleSquareGifts.glb",  
              positionType: 'featureEnt', 
              //position: Vector3.create(34.7,0.8,30.7)
            }, 
            trigger: { 
              debugEnabled:false,
              positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
              size: Vector3.create(18,1,18),
              position: Vector3.create(57,10,52)//where to put the trigger, triggerPositionType affects its relative offset
            } 
          },
          motionData: {
            rotationVelocity: ROTATE_VELOCITY_OFF,
            moveVelocity: MOVE_VELOCITY,
            moveInterval: MOVE_INTERVAL,
          },
        },
        nftUIData: {
          style: "version20Modal",
          type: "MetaDoge",
          image: "images/wearables/metaviu.png",//"https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x3674eb9ab0e9678db7f0d25b646cbcc78ab4432c:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
          //imageSection: {  },
          imageWidth: 512,
          imageHeight: 512,
          detailsFontSize: 12,
          
          detailsInfo: "The first MetaViu wearable",
          directLink: "https://market.decentraland.org/",
          directLinkFontSize: 10,
          title: "MetaViu Hat",
          detailsTitle: "HIGHLIGHTS!",
          cost: [
            {
              price: 999999, 
              type: "VirtualCurrency",
              id: "GC",
              label: "Coins",
            },
            {
              price: 999999, 
              type: "VirtualCurrency",
              id: "MC",
              label: "Coins"
            }
          ],
          showStockQty:true,//defaults to true
          qtyCurrent: -2,
          qtyTotal: 100,
          claimWindowEnabled:true,//defaults to true
          claimStartMS:  Date.UTC(2023,3,7,12,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
          claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
        },
      },
    });
  } 
  //END MAKING REWARD Muscle1

  //START MAKING REWARD Muscle2
    if (true) {
      //block scope
      const transformArgs =
        {
          position: Vector3.create(48, 0, 40),
          rotation: Quaternion.create(0, 0, 0, 1),
          scale: Vector3.create(1, 1, 1),
        };
    
      wearableArr.push({
        sceneId: "gamimall",
        contract: "0xcd483597943e369a7ba4861acbb334b17178fa64",
        itemId: "0",
        options: {
          type: "2D-UI",
          featuredEntityData: {
            parent: _scene,
            entityName: "ent4",
            shapeName: "models/Rewards/muscle1.glb",
            hoverText: "Claim a Zeitgeist Long Gown",
            transform: transformArgs,
            lazyLoading:{
              enabled: true,
              debugEnabled:false, 
              placeHolder:{
                enabled:true,
                shapeName:"",  
                positionType: 'featureEnt', 
                //position: Vector3.create(34.7,0.8,30.7)
              }, 
              trigger: { 
                debugEnabled:false,
                positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
                size: Vector3.create(18,1,18),
                position: Vector3.create(57,10,52)//where to put the trigger, triggerPositionType affects its relative offset
              } 
            },
            motionData: {
              rotationVelocity: ROTATE_VELOCITY_OFF,
              moveVelocity: MOVE_VELOCITY,
              moveInterval: MOVE_INTERVAL,
            },
          },
          nftUIData: {
            style: "version20Modal",
            type: "MetaDoge",
            image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xcd483597943e369a7ba4861acbb334b17178fa64:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
            //imageSection: {  },
            imageWidth: 512,
            imageHeight: 512,
            detailsFontSize: 12,
            
            detailsInfo: "Popular wearable in MetaMine S1",
            directLink: "https://market.decentraland.org/",
            directLinkFontSize: 10,
            title: "Zeitgeist Long Gown",
            detailsTitle: "HIGHLIGHTS!",
            cost: [
              {
                price: 999999, 
                type: "VirtualCurrency",
                id: "GC",
                label: "Coins",
              },
              {
                price: 999999, 
                type: "VirtualCurrency",
                id: "MC",
                label: "Coins"
              }
            ],
            showStockQty:true,//defaults to true
            qtyCurrent: -2,
            qtyTotal: 100,
            claimWindowEnabled:true,//defaults to true
            claimStartMS:  Date.UTC(2022,11,23,12,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
            claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
          },
        },
      });
    } 
    //END MAKING REWARD Muscle2
    //START MAKING REWARD Muscle3
    if (true) {
      //block scope
      const transformArgs =
        {
          position: Vector3.create(48, 0, 40),
          rotation: Quaternion.create(0, 0, 0, 1),
          scale: Vector3.create(1, 1, 1),
        };
    
      wearableArr.push({
        sceneId: "gamimall",
        contract: "0x3b30663a6cf8fdf8c8d6f1c7da76bad44f9c129c",
        itemId: "0",
        options: {
          type: "2D-UI",
          featuredEntityData: {
            parent: _scene,
            entityName: "ent4",
            shapeName: "models/Rewards/muscle2.glb",
            hoverText: "Claim a ScarCryptoFace Hood",
            transform: transformArgs,
            lazyLoading:{
              enabled: true,
              debugEnabled:false, 
              placeHolder:{
                enabled:true,
                shapeName:"",  
                positionType: 'featureEnt', 
                //position: Vector3.create(34.7,0.8,30.7)
              }, 
              trigger: { 
                debugEnabled:false,
                positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
                size: Vector3.create(18,1,18),
                position: Vector3.create(57,10,52)//where to put the trigger, triggerPositionType affects its relative offset
              } 
            },
            motionData: {
              rotationVelocity: ROTATE_VELOCITY_OFF,
              moveVelocity: MOVE_VELOCITY,
              moveInterval: MOVE_INTERVAL,
            },
          },
          nftUIData: {
            style: "version20Modal",
            type: "MetaDoge",
            image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x3b30663a6cf8fdf8c8d6f1c7da76bad44f9c129c:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
            //imageSection: {  },
            imageWidth: 512,
            imageHeight: 512,
            detailsFontSize: 12,
            
            detailsInfo: "Unqie community wearable",
            directLink: "https://market.decentraland.org/",
            directLinkFontSize: 10,
            title: "ScarCryptoFace Hood",
            detailsTitle: "HIGHLIGHTS!",
            cost: [
              {
                price: 999999, 
                type: "VirtualCurrency",
                id: "GC",
                label: "Coins",
              },
              {
                price: 999999, 
                type: "VirtualCurrency",
                id: "MC",
                label: "Coins"
              }
            ],
            showStockQty:true,//defaults to true
            qtyCurrent: -2,
            qtyTotal: 400,
            claimWindowEnabled:true,//defaults to true
            claimStartMS:  Date.UTC(2022,11,23,12,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
            claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
          },
        },
      });
    } 
    //END MAKING REWARD Muscle3
    //START MAKING REWARD CoinsBag
    if (true) {
      //block scope
      const transformArgs =
        {
          position: Vector3.create(48, 0, 40),
          rotation: Quaternion.create(0, 0, 0, 1),
          scale: Vector3.create(1, 1, 1),
        };
    
      wearableArr.push({
        sceneId: "gamimall",
        contract: "0xe0bb1d4a85ed78418f7378bacab475a5aafb5446",
        itemId: "0",
        options: {
          type: "2D-UI",
          featuredEntityData: {
            parent: _scene,
            entityName: "ent4",
            shapeName: "models/Rewards/CoinsBag.glb",
            hoverText: "Claim a MetaGamiMall Coins Bag V2",
            transform: transformArgs,
            lazyLoading:{
              enabled: false,
              debugEnabled:false, 
              placeHolder:{
                enabled:true,
                shapeName:"",  
                positionType: 'featureEnt', 
                //position: Vector3.create(34.7,0.8,30.7)
              }, 
              trigger: { 
                debugEnabled:false,
                positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
                size: Vector3.create(18,1,18),
                position: Vector3.create(57,10,52)//where to put the trigger, triggerPositionType affects its relative offset
              } 
            },
            motionData: {
              rotationVelocity: ROTATE_VELOCITY_OFF,
              moveVelocity: MOVE_VELOCITY,
              moveInterval: MOVE_INTERVAL,
            },
          },
          nftUIData: {
            style: "version20Modal",
            type: "MetaDoge",
            image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xe0bb1d4a85ed78418f7378bacab475a5aafb5446:0/thumbnail",
            imageWidth: 256,
            imageHeight: 256,
            detailsFontSize: 12,
            
            detailsInfo: "1-10% aggregatable coins bonus,Burn \n it to redeem 5k GameMall Coins",
            directLink: "https://market.decentraland.org/",
            directLinkFontSize: 10,
            title: "Coins Bag V2",
            detailsTitle: "HIGHLIGHTS!",
            cost: [
              {
                price: 999999, 
                type: "VirtualCurrency",
                id: "GC",
                label: "Coins",
              },
              {
                price: 999999, 
                type: "VirtualCurrency",
                id: "MC",
                label: "Coins"
              }
            ],
            showStockQty:false,//defaults to true
            qtyCurrent: -2,
            qtyTotal: 100,
            claimWindowEnabled:true,//defaults to true
            checkLatestMarketPrices: true,
            claimStartMS:  Date.UTC(2023,5,10,13,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
            claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
          },
        },
      });
    } 
    //END MAKING REWARD CoinsBag

       //START MAKING REWARD Music Stage Left
       if (true) {
        //block scope
        const transformArgs =
          {
            position: Vector3.create(48, 0, 40),
            rotation: Quaternion.create(0, 0, 0, 1),
            scale: Vector3.create(1, 1, 1),
          };
      
        wearableArr.push({
          sceneId: "gamimall",
          contract: "0x80e0c106f4fe576bdbbe7818b61df6e8456ab65d",
          itemId: "0",
          options: {
            type: "2D-UI",
            featuredEntityData: {
              parent: _scene,
              entityName: "ent4",
              shapeName: "models/Rewards/Xmas2023/L.glb",
              hoverText: "BTFD Denim Jacket",
              transform: transformArgs,
              lazyLoading:{
                enabled: false,
                debugEnabled:false, 
                placeHolder:{
                  enabled:true,
                  shapeName:"",  
                  positionType: 'featureEnt', 
                  //position: Vector3.create(34.7,0.8,30.7)
                }, 
                trigger: { 
                  debugEnabled:false,
                  positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
                  size: Vector3.create(18,1,18),
                  position: Vector3.create(57,10,52)//where to put the trigger, triggerPositionType affects its relative offset
                } 
              },
              motionData: {
                rotationVelocity: ROTATE_VELOCITY_OFF,
                moveVelocity: MOVE_VELOCITY,
                moveInterval: MOVE_INTERVAL,
              },
            },
            nftUIData: {
              style: "version20Modal",
              type: "MetaDoge",
              image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x80e0c106f4fe576bdbbe7818b61df6e8456ab65d:0/thumbnail",
              imageWidth: 256,
              imageHeight: 256,
              detailsFontSize: 12,
              
              detailsInfo: "BTFD Denim Jacket",
              directLink: "https://market.decentraland.org/",
              directLinkFontSize: 10,
              title: "BTFD Denim Jacket",
              detailsTitle: "HIGHLIGHTS!",
              cost: [
                {
                  price: 999999, 
                  type: "VirtualCurrency",
                  id: "GC",
                  label: "Coins",
                },
                {
                  price: 999999, 
                  type: "VirtualCurrency",
                  id: "MC",
                  label: "Coins"
                }
              ],
              showStockQty:true,//defaults to true
              qtyCurrent: -2,
              qtyTotal: 100,
              claimWindowEnabled:true,//defaults to true
              checkLatestMarketPrices: true,
              claimStartMS:  -1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
              claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
            },
          },
        });
      } 
      //END MAKING REWARD Music Stage Left

         //START MAKING REWARD Music Stage Middle
         if (true) {
          //block scope
          const transformArgs =
            {
              position: Vector3.create(48, 0, 40),
              rotation: Quaternion.create(0, 0, 0, 1),
              scale: Vector3.create(1, 1, 1),
            };
        
          wearableArr.push({
            sceneId: "gamimall",
            contract: "0xf744E1e1c75CeB37B54b96cBEDb94B3c137E9FC0",
            itemId: "0",
            options: {
              type: "2D-UI",
              featuredEntityData: {
                parent: _scene,
                entityName: "ent4",
                shapeName: "models/Rewards/Xmas2023/M.glb",
                hoverText: "Wanna be a Diamond Hand? ",
                transform: transformArgs,
                lazyLoading:{
                  enabled: false,
                  debugEnabled:false, 
                  placeHolder:{
                    enabled:true,
                    shapeName:"",  
                    positionType: 'featureEnt', 
                    //position: Vector3.create(34.7,0.8,30.7)
                  }, 
                  trigger: { 
                    debugEnabled:false,
                    positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
                    size: Vector3.create(18,1,18),
                    position: Vector3.create(57,10,52)//where to put the trigger, triggerPositionType affects its relative offset
                  } 
                },
                motionData: {
                  rotationVelocity: ROTATE_VELOCITY_OFF,
                  moveVelocity: MOVE_VELOCITY,
                  moveInterval: MOVE_INTERVAL,
                },
              },
              nftUIData: {
                style: "version20Modal",
                type: "MetaDoge",
                image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xf744E1e1c75CeB37B54b96cBEDb94B3c137E9FC0:0/thumbnail",
                imageWidth: 256,
                imageHeight: 256,
                detailsFontSize: 12,
                
                detailsInfo: "Wanna be a Diamond Hand?",
                directLink: "https://market.decentraland.org/",
                directLinkFontSize: 10,
                title: "BTFD Diamond Hands",
                detailsTitle: "HIGHLIGHTS!",
                cost: [
                  {
                    price: 999999, 
                    type: "VirtualCurrency",
                    id: "GC",
                    label: "Coins",
                  },
                  {
                    price: 999999, 
                    type: "VirtualCurrency",
                    id: "MC",
                    label: "Coins"
                  }
                ],
                showStockQty:true,//defaults to true
                qtyCurrent: -2,
                qtyTotal: 5,
                claimWindowEnabled:true,//defaults to true
                checkLatestMarketPrices: true,
                claimStartMS: -1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
                claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
              },
            },
          });
        } 
        //END MAKING REWARD Music Stage Middle

         //START MAKING REWARD Music Stage Right
         if (true) {
          //block scope
          const transformArgs =
            {
              position: Vector3.create(48, 0, 40),
              rotation: Quaternion.create(0, 0, 0, 1),
              scale: Vector3.create(1, 1, 1),
            };
        
          wearableArr.push({
            sceneId: "gamimall",
            contract: "0x17de223fb3df3221bffe384dc65706934cfc28a8",
            itemId: "0",
            options: {
              type: "2D-UI",
              featuredEntityData: {
                parent: _scene,
                entityName: "ent4",
                shapeName: "models/Rewards/Xmas2023/R.glb",
                hoverText: "Wonder Wall Crew - 23",
                transform: transformArgs,
                lazyLoading:{
                  enabled: false,
                  debugEnabled:false, 
                  placeHolder:{
                    enabled:true,
                    shapeName:"",  
                    positionType: 'featureEnt', 
                    //position: Vector3.create(34.7,0.8,30.7)
                  }, 
                  trigger: { 
                    debugEnabled:false,
                    positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
                    size: Vector3.create(18,1,18),
                    position: Vector3.create(57,10,52)//where to put the trigger, triggerPositionType affects its relative offset
                  } 
                },
                motionData: {
                  rotationVelocity: ROTATE_VELOCITY_OFF,
                  moveVelocity: MOVE_VELOCITY,
                  moveInterval: MOVE_INTERVAL,
                },
              },
              nftUIData: {
                style: "version20Modal",
                type: "MetaDoge",
                image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x17de223fb3df3221bffe384dc65706934cfc28a8:0/thumbnail",
                imageWidth: 256,
                imageHeight: 256,
                detailsFontSize: 12,
                
                detailsInfo: "Wonder Wall Crew - 23'",
                directLink: "https://market.decentraland.org/",
                directLinkFontSize: 10,
                title: "Wonder Wall Crew - 23'",
                detailsTitle: "HIGHLIGHTS!",
                cost: [
                  {
                    price: 999999, 
                    type: "VirtualCurrency",
                    id: "GC",
                    label: "Coins",
                  },
                  {
                    price: 999999, 
                    type: "VirtualCurrency",
                    id: "MC",
                    label: "Coins"
                  }
                ],
                showStockQty:true,//defaults to true
                qtyCurrent: -2,
                qtyTotal: 50,
                claimWindowEnabled:true,//defaults to true
                checkLatestMarketPrices: true,
                claimStartMS: -1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
                claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
              },
            },
          });
        } 
        //END MAKING REWARD Music Stage Right

         //START MAKING REWARD Music Stage Pool
         if (true) {
          //block scope
          const transformArgs =
            {
              position: Vector3.create(48, 0, 40),
              rotation: Quaternion.create(0, 0, 0, 1),
              scale: Vector3.create(1, 1, 1),
            };
        
          wearableArr.push({
            sceneId: "gamimall",
            contract: "0x7d87bbb0746de9a602058715afaa84449de3a9f1",
            itemId: "0",
            options: {
              type: "2D-UI",
              featuredEntityData: {
                parent: _scene,
                entityName: "ent4",
                shapeName: "models/Rewards/Xmas2023/Pool.glb",
                hoverText: "VTATV BROADCASTER",
                transform: transformArgs,
                lazyLoading:{
                  enabled: false,
                  debugEnabled:false, 
                  placeHolder:{
                    enabled:true,
                    shapeName:"",  
                    positionType: 'featureEnt', 
                    //position: Vector3.create(34.7,0.8,30.7)
                  }, 
                  trigger: { 
                    debugEnabled:false,
                    positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
                    size: Vector3.create(18,1,18),
                    position: Vector3.create(57,10,52)//where to put the trigger, triggerPositionType affects its relative offset
                  } 
                },
                motionData: {
                  rotationVelocity: ROTATE_VELOCITY_OFF,
                  moveVelocity: MOVE_VELOCITY,
                  moveInterval: MOVE_INTERVAL,
                },
              },
              nftUIData: {
                style: "version20Modal",
                type: "MetaDoge",
                image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x7d87bbb0746de9a602058715afaa84449de3a9f1:0/thumbnail",
                imageWidth: 256,
                imageHeight: 256,
                detailsFontSize: 12,
                
                detailsInfo: "Watch TV broadcast with this smart wearable!",
                directLink: "https://market.decentraland.org/",
                directLinkFontSize: 10,
                title: "VTATV BROADCAST VIEWER",
                detailsTitle: "HIGHLIGHTS!",
                cost: [
                  {
                    price: 999999, 
                    type: "VirtualCurrency",
                    id: "GC",
                    label: "Coins",
                  },
                  {
                    price: 999999, 
                    type: "VirtualCurrency",
                    id: "MC",
                    label: "Coins"
                  }
                ],
                showStockQty:true,//defaults to true
                qtyCurrent: -2,
                qtyTotal: 5,
                claimWindowEnabled:true,//defaults to true
                checkLatestMarketPrices: true,
                claimStartMS: -1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
                claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
              },
            },
          });
        } 
        //END MAKING REWARD Music Stage Pool

         //START MAKING REWARD Metaroost
         if (true) {
          //block scope
          const transformArgs =
            {
              position: Vector3.create(48, 0, 40),
              rotation: Quaternion.create(0, 0, 0, 1),
              scale: Vector3.create(1, 1, 1),
            };
        
          wearableArr.push({
            sceneId: "gamimall",
            contract: "0xefdc35e6c832495ce84d3b38bfad1880dbee42a9",
            itemId: "0",
            options: {
              type: "2D-UI",
              featuredEntityData: {
                parent: _scene,
                entityName: "ent4",
                shapeName: "models/Rewards/ChickenHead.glb",
                hoverText: "Metaroost",
                transform: transformArgs,
                lazyLoading:{
                  enabled: false,
                  debugEnabled:false, 
                  placeHolder:{
                    enabled:true,
                    shapeName:"",  
                    positionType: 'featureEnt', 
                    //position: Vector3.create(34.7,0.8,30.7)
                  }, 
                  trigger: { 
                    debugEnabled:false,
                    positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
                    size: Vector3.create(18,1,18),
                    position: Vector3.create(57,10,52)//where to put the trigger, triggerPositionType affects its relative offset
                  } 
                },
                motionData: {
                  rotationVelocity: ROTATE_VELOCITY_OFF,
                  moveVelocity: MOVE_VELOCITY,
                  moveInterval: MOVE_INTERVAL,
                },
              },
              nftUIData: {
                style: "version20Modal",
                type: "MetaDoge",
                image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xefdc35e6c832495ce84d3b38bfad1880dbee42a9:0/thumbnail",
                imageWidth: 256,
                imageHeight: 256,
                detailsFontSize: 12,
                
                detailsInfo: "Want to have a chicken head?",
                directLink: "https://market.decentraland.org/",
                directLinkFontSize: 10,
                title: "Metaroost",
                detailsTitle: "HIGHLIGHTS!",
                cost: [
                  {
                    price: 999999, 
                    type: "VirtualCurrency",
                    id: "GC",
                    label: "Coins",
                  },
                  {
                    price: 999999, 
                    type: "VirtualCurrency",
                    id: "MC",
                    label: "Coins"
                  }
                ],
                showStockQty:true,//defaults to true
                qtyCurrent: -2,
                qtyTotal: 25,
                claimWindowEnabled:true,//defaults to true
                checkLatestMarketPrices: true,
                claimStartMS: -1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
                claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
              },
            },
          });
        } 
        //END MAKING REWARD Metaroost
    
    

  //OTHERS

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
}
