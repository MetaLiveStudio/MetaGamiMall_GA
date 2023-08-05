//import { _scene } from "src/game"
import { REGISTRY } from "src/registry";
import { WearableBoothArgs } from "./types";

export const CARD_OFFSET_SOUTH = new Vector3(0, 0.5, -1);
export const CARD_OFFSET_NORTH = new Vector3(0, 0.5, 1);
export const CARD_OFFSET_WEST = new Vector3(-1.5, 0.5, 0);
export const CARD_OFFSET_EAST = new Vector3(1, 0.5, 0);

const ROTATE_VELOCITY = Quaternion.Euler(0, 10, 0);
const ROTATE_VELOCITY_OFF:Quaternion = undefined; //Quaternion.Euler(0, 0, 0)
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

  //START MAKING REWARD L1
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
      contract: "0x8215dea718a90e541e14f9b29c413f1784538019",
      itemId: "0",
      options: {
        type: "2D-UI",
        featuredEntityData: {
          parent: _scene,
          entityName: "entL1",
          shapeName: "models/Rewards",
          hoverText: "Claim a Meama ARCH CityBack",
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
          image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x8215dea718a90e541e14f9b29c413f1784538019:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
          //imageSection: {  },
          imageWidth: 1024,
          imageHeight: 1024,
          detailsFontSize: 12, 
          
          detailsInfo: "8% GamiMall Coin bonus, Holders will \n receive a Meama coffee cup",
          directLink: "https://market.decentraland.org/",
          directLinkFontSize: 10,
          title: "ARCH CityBack",
          detailsTitle: "HIGH LIGHTS!",
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
          qtyTotal:3,
          claimWindowEnabled:true,//defaults to true
          claimStartMS: Date.UTC(2023,3,7,14,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
          position: new Vector3(48, 0, 40),
          rotation: new Quaternion(0, 0, 0, 1),
          scale: new Vector3(1, 1, 1),
        };
      //)
  
      wearableArr.push({
        sceneId: "gamimall",
        contract: "0xc8d0f351ff0a03c9fc1aaf97bbbeb5af68ef97a8",
        itemId: "0",
        options: {
          type: "2D-UI",
          featuredEntityData: {
            parent: _scene,
            entityName: "entL2",
            shapeName: "models/Rewards/rewardL2.glb",
            hoverText: "Claim a Sensorium ARCH Cloth",
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
            image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xc8d0f351ff0a03c9fc1aaf97bbbeb5af68ef97a8:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
            //imageSection: {  },
            imageWidth: 1024,
            imageHeight: 1024,
            detailsFontSize: 12, 
            
            detailsInfo: "8% GamiMall Coin bonus, holders can \n have 1 free Sensorium avatar",
            directLink: "https://market.decentraland.org/",
            directLinkFontSize: 10,
            title: "Sensorium ARCH Cloth",
            detailsTitle: "HIGH LIGHTS!",
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
            qtyTotal:3,
            claimWindowEnabled:true,//defaults to true
            claimStartMS:  Date.UTC(2023,3,7,14,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0xaecc75052227ae7156a2d4a0531530683ed36cf6",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entL3",
        shapeName: "models/Rewards/rewardL3.glb",
        hoverText: "Claim a Soul Magic Pickaxe",
        transform: transformArgs,

        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"models/Rewards/UniversalGIft.glb",  
            positionType: 'absolute', 
            position: new Vector3(34.7,0.8,30.7)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: new Vector3(8,1,8),
            position: new Vector3(40,4,35)//where to put the trigger, triggerPositionType affects its relative offset
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xaecc75052227ae7156a2d4a0531530683ed36cf6:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "3% GamiMall Coin bonus \n improve 2% Soul Magic mining chance",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Soul Magic Pickaxe",
        detailsTitle: "HIGH LIGHTS!",
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
        claimStartMS:  Date.UTC(2023,3,7,13,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x2f67ab53c91d73ef16718a96286cec18ed2b8a1d",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entL4",
        shapeName: "models/Rewards/rewardL4.glb",
        hoverText: "Claim a BPF gloves ",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"models/Rewards/UniversalGIft.glb",  
            positionType: 'absolute', 
            position: new Vector3(34.7,0.8,30.7+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: new Vector3(8,1,8),
            position: new Vector3(40,4,35)//where to put the trigger, triggerPositionType affects its relative offset
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x2f67ab53c91d73ef16718a96286cec18ed2b8a1d:0/thumbnail",//"https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x9B0A93EA49955a5ef1878c1a1e8f8645d049e597:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "3% GamiMall Coin bonus \n Add 2s vehicle time in BP Farm",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "BPF gloves",
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
        claimStartMS:  Date.UTC(2023,3,7,13,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x828f5e02a1b26c5736bcf6303caecbafec3c3a7c",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entL5",
        shapeName: "models/Rewards/rewardL5.glb",
        hoverText: "Claim a MUA Recurve",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"models/Rewards/UniversalGIft.glb",  
            positionType: 'absolute', 
            position: new Vector3(34.7,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: new Vector3(8,1,8),
            position: new Vector3(40,4,35)//where to put the trigger, triggerPositionType affects its relative offset
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x828f5e02a1b26c5736bcf6303caecbafec3c3a7c:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 750,
        imageHeight: 750,
        detailsFontSize: 12, 
        
        detailsInfo: "3% GamiMall Coin bonus \n 100 USDT raffle ticket",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "MUA Recurve ",
        detailsTitle: "HIGH LIGHTS!",
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
        claimStartMS:  Date.UTC(2023,3,7,13,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x9d82a09b425e90e0b6dc7cdf34d5bf6db37362c4",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entL6",
        shapeName: "models/Rewards/rewardL6.glb",
        hoverText: "Claim a Vroomway Aura",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"models/Rewards/UniversalGIft.glb",  
            positionType: 'absolute', 
            position: new Vector3(34.7,0.8,30.7+3.85+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: new Vector3(8,1,8),
            position: new Vector3(40,4,35)//where to put the trigger, triggerPositionType affects its relative offset
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x9d82a09b425e90e0b6dc7cdf34d5bf6db37362c4:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "1% GamiMall Coin Bonus \n 2% Vroomway Ex bonus",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Vroomway Aura",
        detailsTitle: "HIGH LIGHTS!",
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
        claimStartMS:  Date.UTC(2023,3,7,13,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0xd6114ec98774a5544cf2480171ac0720a327f88d",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entR1",
        shapeName: "models/Rewards",
        hoverText: "Claim a WonderMine Wearable ",
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
        image: "images/wearables/DG.png",//"https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xb048b4f6ddca77d37534242f4856eb54b0934aac:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "8% GamiMall Coin bonus \n enjoy DG discord unique role",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "DG ARCH Dress",
        detailsTitle: "HIGH LIGHTS!",
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
        qtyTotal: 3,
        claimWindowEnabled:true,//defaults to true
        claimStartMS: Date.UTC(2023,3,7,14,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0xb048b4f6ddca77d37534242f4856eb54b0934aac",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entR2",
        shapeName: "models/Rewards/rewardR2.glb",
        hoverText: "Claim a MetaViu ARCH Hat",
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xb048b4f6ddca77d37534242f4856eb54b0934aac:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "8% GamiMall Coin bonus \n MetaViu future wearable airdrop",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "MetaViu ARCH Hat",
        detailsTitle: "HIGH LIGHTS!",
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
        qtyTotal: 3,
        claimWindowEnabled:true,//defaults to true
        claimStartMS: Date.UTC(2023,3,7,14,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x8f69e4a278e3451b8a93b52cca27b25798658fc0",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entR3",
        shapeName: "models/Rewards/rewardR3.glb",
        hoverText: "Claim a KOA Coin Couture ",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"models/Rewards/UniversalGIft.glb",  
            positionType: 'absolute', 
            position: new Vector3(34.7+10.75,0.8,30.7)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: new Vector3(8,1,8),
            position: new Vector3(40,4,35)//where to put the trigger, triggerPositionType affects its relative offset
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x8f69e4a278e3451b8a93b52cca27b25798658fc0:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "3% GamiMall Coin bonus \n 3 coins/15 minutes On KOA",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "KOA Coin Couture",
        detailsTitle: "HIGH LIGHTS!",
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
        claimStartMS: Date.UTC(2023,3,7,13,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x89b18692a789c4e23d780a399497cc02c62ae4c2",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entR4",
        shapeName: "models/Rewards/rewardR4.glb",
        hoverText: "Claim a Mini Doge VoxBoarder ",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"models/Rewards/UniversalGIft.glb",  
            positionType: 'absolute', 
            position: new Vector3(34.7+10.75,0.8,30.7+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: new Vector3(8,1,8),
            position: new Vector3(40,4,35)//where to put the trigger, triggerPositionType affects its relative offset
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x89b18692a789c4e23d780a399497cc02c62ae4c2:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "3% GamiMall coin bonus \n 3% Voxboard coin bonus",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Mini Doge VoxBoarder",
        detailsTitle: "HIGH LIGHTS!",
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
        claimStartMS: Date.UTC(2023,3,7,13,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x5a1556c3ca8251c898a336f386900df689926888",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entR5",
        shapeName: "models/Rewards/rewardR5.glb",
        hoverText: "Claim a CD Raffle Hat",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"models/Rewards/UniversalGIft.glb",  
            positionType: 'absolute', 
            position: new Vector3(34.7+10.75,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: new Vector3(8,1,8),
            position: new Vector3(40,4,35)//where to put the trigger, triggerPositionType affects its relative offset
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x5a1556c3ca8251c898a336f386900df689926888:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "3% GamiMall Coin bonus \n 100 USDT raffle ticket",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "CD Raffle Hat",
        detailsTitle: "HIGH LIGHTS!",
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
        claimStartMS: Date.UTC(2023,3,7,13,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
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
        entityName: "entR6",
        shapeName: "models/Rewards/rewardR6.glb",
        hoverText: "Claim a Polygonal Mind Mega Vision",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"models/Rewards/UniversalGIft.glb",  
            positionType: 'absolute', 
            position: new Vector3(34.7+10.75,0.8,30.7+3.85+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: new Vector3(8,1,8),
            position: new Vector3(40,4,35)//where to put the trigger, triggerPositionType affects its relative offset
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
        
        detailsInfo: "Unique utility in the next MegaCube",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Mega Vision",
        detailsTitle: "HIGH LIGHTS!",
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
        qtyTotal: 1000,
        claimWindowEnabled:true,//defaults to true
        claimStartMS:Date.UTC(2023,3,7,13,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x9590eb47aee3d9f412448a81007f39443e167bbc",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entR6",
        shapeName: "models/Rewards/rewardR61.glb",
        hoverText: "Claim a CryptoSlots T-shirt",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"models/Rewards/UniversalGIft.glb",  
            positionType: 'absolute', 
            position: new Vector3(34.7+10.75,0.8,30.7-3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: new Vector3(8,1,8),
            position: new Vector3(40,4,30)//where to put the trigger, triggerPositionType affects its relative offset
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x9590eb47aee3d9f412448a81007f39443e167bbc:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "3% Gamimall coins bonus \n 3% CryptoSlots future game bonus",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Winning Streak Hoodie",
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
        claimStartMS:Date.UTC(2023,3,7,13,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x12fedcf4e359b56e7677e0ddb6512c64b94a3167",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS1",
        shapeName: "models/Rewards/rewardS1.glb",
        hoverText: "Claim a Chef Baker Hat ",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"models/Rewards/SilversponsorGIft.glb",  
            positionType: 'featureEnt', 
            //position: new Vector3(34.7+10.75,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: new Vector3(14,1,1),
            position: new Vector3(40,1 ,61)//where to put the trigger, triggerPositionType affects its relative offset
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x12fedcf4e359b56e7677e0ddb6512c64b94a3167:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "Want to be a chef in metaverse?",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Chef Baker Hat",
        detailsTitle: "HIGH LIGHTS!",
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
        claimStartMS: Date.UTC(2023,3,7,12,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
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
        hoverText: "Claim a SpanishMuseum Jacket ",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"",  
            positionType: 'featureEnt', 
            //position: new Vector3(34.7+10.75,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: new Vector3(14,1,1),
            position: new Vector3(40,1 ,61)//where to put the trigger, triggerPositionType affects its relative offset
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
        detailsTitle: "HIGH LIGHTS!",
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
        claimStartMS: Date.UTC(2023,3,7,12,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0xc8333367125ed310a9d8c3e9da06d1b0bb469d6d",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS3",
        shapeName: "models/Rewards/rewardS3.glb",
        hoverText: "Claim a MetaCat T-shirt",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"",  
            positionType: 'featureEnt', 
            //position: new Vector3(34.7+10.75,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: new Vector3(14,1,1),
            position: new Vector3(40,1 ,61)//where to put the trigger, triggerPositionType affects its relative offset
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xc8333367125ed310a9d8c3e9da06d1b0bb469d6d:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "1% GamiMall Coin bonus \n MetaCat Land using right",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "MetaCat T shirt",
        detailsTitle: "HIGH LIGHTS!",
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
        qtyTotal: 80,
        claimWindowEnabled:true,//defaults to true
        claimStartMS: Date.UTC(2023,3,7,12,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x97ad16f8182a30a919bc687a35ca714bc2ae77fb",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS4",
        shapeName: "models/Rewards/rewardS4.glb",
        hoverText: "Claim a MRT raffle ticket",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"",  
            positionType: 'featureEnt', 
            //position: new Vector3(34.7+10.75,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: new Vector3(14,1,1),
            position: new Vector3(40,1 ,61)//where to put the trigger, triggerPositionType affects its relative offset
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
        image: "images/wearables/MRT.png",//"https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x30d3387ff3de2a21bef7032f82d00ff7739e403c:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 600,
        imageHeight: 600,
        detailsFontSize: 12, 
        
        detailsInfo: "2 winners will reiceve a MRT apartment",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "MRT ticket",
        detailsTitle: "HIGH LIGHTS!",
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
        qtyTotal: 5,
        claimWindowEnabled:true,//defaults to true
        claimStartMS:Date.UTC(2023,3,7,12,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x115035d249604f767ff6795827a4bba06b1c332c",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS5",
        shapeName: "models/Rewards/rewardS5.glb",
        hoverText: "Claim a Apes 3D Rocket ",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"",  
            positionType: 'featureEnt', 
            //position: new Vector3(34.7+10.75,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: new Vector3(14,1,1),
            position: new Vector3(40,1 ,61)//where to put the trigger, triggerPositionType affects its relative offset
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
        image: "images/wearables/apes3d.png",//"https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x115035d249604f767ff6795827a4bba06b1c332c:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 256,
        imageHeight: 256,
        detailsFontSize: 12, 
        
        detailsInfo: "1% GamiMall Coin bonus",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Apes3D Rocket",
        detailsTitle: "HIGH LIGHTS!",
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
        qtyTotal: 40,
        claimWindowEnabled:true,//defaults to true
        claimStartMS:Date.UTC(2023,3,7,12,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x0e4f31c0c0d4cefa34b624c6ad09e4c04af624fa",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS6",
        shapeName: "models/Rewards/rewardS6.glb",
        hoverText: "Claim a Waifumon3D",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"",  
            positionType: 'featureEnt', 
            //position: new Vector3(34.7+10.75,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: new Vector3(14,1,1),
            position: new Vector3(40,1 ,61)//where to put the trigger, triggerPositionType affects its relative offset
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x0e4f31c0c0d4cefa34b624c6ad09e4c04af624fa:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "5% GamiMall Coin bonus",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Waifumon3D",
        detailsTitle: "HIGH LIGHTS!",
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
        qtyTotal: 60,
        claimWindowEnabled:true,//defaults to true
        claimStartMS:Date.UTC(2023,3,7,12,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x35f8aee672cdE8e5FD09C93D2BfE4FF5a9cF0756",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS7",
        shapeName: "models/Rewards/rewardS7.glb",
        hoverText: "Claim a Golfcraft Sammich ticket",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"",  
            positionType: 'featureEnt', 
            //position: new Vector3(34.7+10.75,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: new Vector3(14,1,1),
            position: new Vector3(40,1 ,61)//where to put the trigger, triggerPositionType affects its relative offset
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
        image: "images/wearables/golfcraft.png",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 600,
        imageHeight: 600,
        detailsFontSize: 12, 
        
        detailsInfo: "Get a random Sammich wearable",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Golfcraft ticket",
        detailsTitle: "HIGH LIGHTS!",
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
        qtyTotal: 6,
        claimWindowEnabled:true,//defaults to true
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
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
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
            //position: new Vector3(34.7+10.75,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: new Vector3(14,1,1),
            position: new Vector3(40,1 ,61)//where to put the trigger, triggerPositionType affects its relative offset
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
        detailsTitle: "HIGH LIGHTS!",
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
        qtyTotal: 20,
        claimWindowEnabled:true,//defaults to true
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
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x2dc7f6b5044ba0cdd0aa84cc02b32b4eb36e3f61",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS9",
        shapeName: "models/Rewards/rewardS9.glb",
        hoverText: "Claim a Meama Hoodie",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"",  
            positionType: 'featureEnt', 
            //position: new Vector3(34.7+10.75,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: new Vector3(14,1,1),
            position: new Vector3(40,1 ,61)//where to put the trigger, triggerPositionType affects its relative offset
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x2dc7f6b5044ba0cdd0aa84cc02b32b4eb36e3f61:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "A coffee can always keep you fresh and warm",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Meama Hoodie",
        detailsTitle: "HIGH LIGHTS!",
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
        claimStartMS:Date.UTC(2023,3,7,12,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x7df780724f2f816e1b8428d8b192fd8c3539c22b",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS10",
        shapeName: "models/Rewards/rewardS10.glb",
        hoverText: "Claim a Sensorium T-shirt",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"",  
            positionType: 'featureEnt', 
            //position: new Vector3(34.7+10.75,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: new Vector3(14,1,1),
            position: new Vector3(40,1 ,61)//where to put the trigger, triggerPositionType affects its relative offset
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x7df780724f2f816e1b8428d8b192fd8c3539c22b:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "1% GamiMall Coin bonus \n Sensorium Future token airdrop",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Sensorium T-shirt",
        detailsTitle: "HIGH LIGHTS!",
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
        qtyTotal: 80,
        claimWindowEnabled:true,//defaults to true
        claimStartMS:Date.UTC(2023,3,7,12,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    };
  //)

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0x5aaaf59cf52b38af117a78b6f7763748aede1a13",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS10",
        shapeName: "models/Rewards/rewardS11.glb",
        hoverText: "Claim a pair of NUO Sneakers",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"",  
            positionType: 'featureEnt', 
            //position: new Vector3(34.7+10.75,0.8,30.7+3.85+3.85)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: new Vector3(14,1,1),
            position: new Vector3(40,1 ,61)//where to put the trigger, triggerPositionType affects its relative offset
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x5aaaf59cf52b38af117a78b6f7763748aede1a13:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "Cool Asian style sneakers with \n one of the best designs",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "NUO Sneakers",
        detailsTitle: "HIGH LIGHTS!",
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
        qtyTotal: 80,
        claimWindowEnabled:true,//defaults to true
        claimStartMS:Date.UTC(2023,3,7,12,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}
/*
//START MAKING REWARD S12
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
    contract: "0x55e59c43f0b2eea14d5126fc8d531476fbd69529",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS12",
        shapeName: "",//"models/Rewards/rewardS12.glb",
        hoverText: "Claim a Muscle Doge wearable ",
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x55e59c43f0b2eea14d5126fc8d531476fbd69529:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "MVFW METADOGE",
        detailsTitle: "HIGH LIGHTS!",
        cost: [
          {
            price: 5999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 100,
        claimWindowEnabled:true,//defaults to true
        claimStartMS: Date.UTC(2022,10,18,14,30,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}
*/
//OTHERS

  //START MAKING REWARD Moon1
  if (true) {
    //block scope
    const transformArgs =
      {
        position: new Vector3(48, 0, 40),
        rotation: new Quaternion(0, 0, 0, 1),
        scale: new Vector3(1, 1, 1),
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
            //position: new Vector3(34.7,0.8,30.7)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: new Vector3(25,1,25),
            position: new Vector3(25,24,52)//where to put the trigger, triggerPositionType affects its relative offset
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
          detailsTitle: "HIGH LIGHTS!",
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
          position: new Vector3(48, 0, 40),
          rotation: new Quaternion(0, 0, 0, 1),
          scale: new Vector3(1, 1, 1),
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
                //position: new Vector3(34.7,0.8,30.7)
              }, 
              trigger: { 
                debugEnabled:false,
                positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
                size: new Vector3(25,1,25),
                position: new Vector3(25,24,52)//where to put the trigger, triggerPositionType affects its relative offset
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
            detailsTitle: "HIGH LIGHTS!",
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
        position: new Vector3(48, 0, 40),//37,3,3),//
        rotation: new Quaternion(0, 0, 0, 1),
        scale: new Vector3(1, 1, 1),
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
              //position: new Vector3(34.7,0.8,30.7)
            }, 
            trigger: { 
              debugEnabled:false,
              positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
              size: new Vector3(25,1,25),
              position: new Vector3(25,24,52)//where to put the trigger, triggerPositionType affects its relative offset
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
          detailsTitle: "HIGH LIGHTS!",
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
              position: new Vector3(48, 0, 40),//37,3,3),//
              rotation: new Quaternion(0, 0, 0, 1),
              scale: new Vector3(1, 1, 1),
            };
      
          wearableArr.push({
            sceneId: "gamimall",
            contract: "0xa064e9e96bdc3a74c5257b7b0751e47003084300",
            itemId: "0",
            options: {
              type: "2D-UI",
              featuredEntityData: {
                parent: _scene,
                entityName: "ent4",
                shapeName: "models/Rewards/Moon4.glb",//
                hoverText: "Claim a Shoe-tiful",
                transform: transformArgs,
                lazyLoading:{
                  enabled: true,
                  debugEnabled:false, 
                  placeHolder:{
                    enabled:true,
                    shapeName:"models/Rewards/MoonSquareGifts.glb",  
                    positionType: 'featureEnt', 
                    //position: new Vector3(34.7,0.8,30.7)
                  }, 
                  trigger: { 
                    debugEnabled:false,
                    positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
                    size: new Vector3(25,1,25),
                    position: new Vector3(25,24,52)//where to put the trigger, triggerPositionType affects its relative offset
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
                image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xa064e9e96bdc3a74c5257b7b0751e47003084300:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
                //imageSection: {  },
                imageWidth: 1024,
                imageHeight: 1024,
                detailsFontSize: 12,
                
                detailsInfo: "Sponsored By PunkPink \n GRAB IT WHILE STOCK LAST",
                directLink: "https://market.decentraland.org/",
                directLinkFontSize: 10,
                title: "Shoe-tiful",
                detailsTitle: "HIGH LIGHTS!",
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
          position: new Vector3(48, 0, 40),
          rotation: new Quaternion(0, 0, 0, 1),
          scale: new Vector3(1, 1, 1),
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
                //position: new Vector3(34.7,0.8,30.7)
              }, 
              trigger: { 
                debugEnabled:false,
                positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
                size: new Vector3(20,1,20),
                position: new Vector3(27,51,56)//where to put the trigger, triggerPositionType affects its relative offset
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
            detailsTitle: "HIGH LIGHTS!",
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
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
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
            //position: new Vector3(34.7,0.8,30.7)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: new Vector3(20,1,20),
            position: new Vector3(27,51,56)//where to put the trigger, triggerPositionType affects its relative offset
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
        detailsTitle: "HIGH LIGHTS!",
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
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
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
            //position: new Vector3(34.7,0.8,30.7)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: new Vector3(18,1,18),
            position: new Vector3(50,32,60)//where to put the trigger, triggerPositionType affects its relative offset
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
        detailsTitle: "HIGH LIGHTS!",
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
          position: new Vector3(48, 0, 40),
          rotation: new Quaternion(0, 0, 0, 1),
          scale: new Vector3(1, 1, 1),
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
                //position: new Vector3(34.7,0.8,30.7)
              }, 
              trigger: { 
                debugEnabled:false,
                positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
                size: new Vector3(18,1,18),
                position: new Vector3(50,32,60)//where to put the trigger, triggerPositionType affects its relative offset
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
            detailsTitle: "HIGH LIGHTS!",
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
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    };

  wearableArr.push({
    sceneId: "gamimall",
    contract: "0xb942cdee678aaf8a17a3bbb405b0b32f08bedad6",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "ent4",
        shapeName: "models/Rewards/Mars3.glb",
        hoverText: "Claim a CryptoCrow NFT ",
        transform: transformArgs,
        lazyLoading:{
          enabled: true,
          debugEnabled:false, 
          placeHolder:{
            enabled:true,
            shapeName:"",  
            positionType: 'featureEnt', 
            //position: new Vector3(34.7,0.8,30.7)
          }, 
          trigger: { 
            debugEnabled:false,
            positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
            size: new Vector3(18,1,18),
            position: new Vector3(50,32,60)//where to put the trigger, triggerPositionType affects its relative offset
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
        image: "images/wearables/CCRW.png",//"https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x85503e1c32b7669614ff5738c5da732b6670e8cd:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 732,
        imageHeight: 586,
        detailsFontSize: 12,
        
        detailsInfo: "CryptoCrow NFT created by Deadstar \n  more info in our discord",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "CryptoCrow",
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
        qtyTotal: 10,
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
        position: new Vector3(48, 0, 40),
        rotation: new Quaternion(0, 0, 0, 1),
        scale: new Vector3(1, 1, 1),
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
              //position: new Vector3(34.7,0.8,30.7)
            }, 
            trigger: { 
              debugEnabled:false,
              positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
              size: new Vector3(18,1,18),
              position: new Vector3(57,10,52)//where to put the trigger, triggerPositionType affects its relative offset
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
          detailsTitle: "HIGH LIGHTS!",
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
          position: new Vector3(48, 0, 40),
          rotation: new Quaternion(0, 0, 0, 1),
          scale: new Vector3(1, 1, 1),
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
                //position: new Vector3(34.7,0.8,30.7)
              }, 
              trigger: { 
                debugEnabled:false,
                positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
                size: new Vector3(18,1,18),
                position: new Vector3(57,10,52)//where to put the trigger, triggerPositionType affects its relative offset
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
            detailsTitle: "HIGH LIGHTS!",
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
          position: new Vector3(48, 0, 40),
          rotation: new Quaternion(0, 0, 0, 1),
          scale: new Vector3(1, 1, 1),
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
                //position: new Vector3(34.7,0.8,30.7)
              }, 
              trigger: { 
                debugEnabled:false,
                positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
                size: new Vector3(18,1,18),
                position: new Vector3(57,10,52)//where to put the trigger, triggerPositionType affects its relative offset
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
            detailsTitle: "HIGH LIGHTS!",
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
          position: new Vector3(48, 0, 40),
          rotation: new Quaternion(0, 0, 0, 1),
          scale: new Vector3(1, 1, 1),
        };
    
      wearableArr.push({
        sceneId: "gamimall",
        contract: "0x635cf423513422f2194b8dbddf3c864808420fa7",
        itemId: "0",
        options: {
          type: "2D-UI",
          featuredEntityData: {
            parent: _scene,
            entityName: "ent4",
            shapeName: "models/Rewards/CoinsBag.glb",
            hoverText: "Claim a MetaGamiMall Coins Bag V1",
            transform: transformArgs,
            lazyLoading:{
              enabled: false,
              debugEnabled:false, 
              placeHolder:{
                enabled:true,
                shapeName:"",  
                positionType: 'featureEnt', 
                //position: new Vector3(34.7,0.8,30.7)
              }, 
              trigger: { 
                debugEnabled:false,
                positionType: 'absolute',//if parented to featuredEntityData object or not absolute scene position
                size: new Vector3(18,1,18),
                position: new Vector3(57,10,52)//where to put the trigger, triggerPositionType affects its relative offset
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
            image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x635cf423513422f2194b8dbddf3c864808420fa7:0/thumbnail",
            imageWidth: 1000,
            imageHeight: 1000,
            detailsFontSize: 12,
            
            detailsInfo: "3% coins bonus,Burn this \n wearable to redeem 10k GameMall Coins",
            directLink: "https://market.decentraland.org/",
            directLinkFontSize: 10,
            title: "Coins Bag V1",
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
            qtyTotal: 200,
            claimWindowEnabled:true,//defaults to true
            claimStartMS:  Date.UTC(2023,5,10,13,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
            claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
          },
        },
      });
    } 
    //END MAKING REWARD CoinsBag
    

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
