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

  //START MAKING REWARD 1
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
      contract: "0x879051feb8c2e0169ffae9e66b022e7136870574",
      itemId: "0",
      options: {
        type: "2D-UI",
        featuredEntityData: {
          parent: _scene,
          entityName: "ent4",
          shapeName: "models/Rewards/tiara.glb",
          hoverText: "Claim a Spanish Museum Tiara ",
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
          image: "images/ui/11.png",//"https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x47f8b9b9ec0f676b45513c21db7777ad7bfedb35:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
          //imageSection: {  },
          imageWidth: 364,
          imageHeight: 364,
          detailsFontSize: 12,
          
          detailsInfo: "SPM Tiara.We use \n this wearable to test our new pricing system",
          directLink: "https://market.decentraland.org/",
          directLinkFontSize: 10,
          title: "SPM Tiara",
          detailsTitle: "HIGH LIGHTS!",
          cost: [
            {
              price: 999, 
              type: "VirtualCurrency",
              id: "GC",
              label: "Coins",
            }
          ],
          showStockQty:true,//defaults to true
          qtyCurrent: -2,
          qtyTotal: 50,
          claimWindowEnabled:true,//defaults to true
          claimStartMS:  -1,//Date.UTC(2022,11,10,13,30,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
          claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
        },
      },
    });
  }
  ////END MAKING REWARD 1

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
      contract: "0xcf4525ccbaa3469ef26b0db8777a8294cf844f44",
      itemId: "0",
      options: {
        type: "2D-UI",
        featuredEntityData: {
          parent: _scene,
          entityName: "entL1",
          shapeName: "models/Rewards/rewardL1.glb",
          hoverText: "Claim a Decentraland Cyber-Tee ",
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
          image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xcf4525ccbaa3469ef26b0db8777a8294cf844f44:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
          //imageSection: {  },
          imageWidth: 1024,
          imageHeight: 1024,
          detailsFontSize: 12, 
          
          detailsInfo: "Decentraland exclusive upper body wearable(Last refill)\n In future, it will give you 3% game bonus here",
          directLink: "https://market.decentraland.org/",
          directLinkFontSize: 10,
          title: "DCL Cyber-Tee",
          detailsTitle: "HIGH LIGHTS!",
          cost: [
            {
              price: 89888, 
              type: "VirtualCurrency",
              id: "GC",
              label: "Coins",
            },
            {
              price: 898, 
              type: "VirtualCurrency",
              id: "MC",
              label: "Coins"
            }
          ],
          showStockQty:true,//defaults to true
          qtyCurrent: -2,
          qtyTotal:6,
          claimWindowEnabled:true,//defaults to true
          claimStartMS: Date.UTC(2022,10,18,13,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
        contract: "0xd3359070df7037c56ce49f0987464153b8f4968d",
        itemId: "0",
        options: {
          type: "2D-UI",
          featuredEntityData: {
            parent: _scene,
            entityName: "entL2",
            shapeName: "models/Rewards/rewardL2.glb",
            hoverText: "Claim a HashKey Mask",
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
            image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xd3359070df7037c56ce49f0987464153b8f4968d:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
            //imageSection: {  },
            imageWidth: 1024,
            imageHeight: 1024,
            detailsFontSize: 12, 
            
            detailsInfo: "HashKey Dx exclusive Mask wearable (Last refill)\n In future, it will give you 3% game bonus here",
            directLink: "https://market.decentraland.org/",
            directLinkFontSize: 10,
            title: "HashKey Mask",
            detailsTitle: "HIGH LIGHTS!",
            cost: [
              {
                price: 87888, 
                type: "VirtualCurrency",
                id: "GC",
                label: "Coins",
              },
              {
                price: 888, 
                type: "VirtualCurrency",
                id: "MC",
                label: "Coins"
              }
            ],
            showStockQty:true,//defaults to true
            qtyCurrent: -2,
            qtyTotal: 3,
            claimWindowEnabled:true,//defaults to true
            claimStartMS:  Date.UTC(2022,10,18,13,30,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
    contract: "0xe4a59ae5bebf4dc43ae733f80cdc57b50bfe1d83",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entL3",
        shapeName: "models/Rewards/rewardL3.glb",
        hoverText: "Claim a Polybasic Cyberpunk Suit",
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xe4a59ae5bebf4dc43ae733f80cdc57b50bfe1d83:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "Polybasic exclusive Cyberpunk Suit NFT",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Polybasic Cyber-Suit",
        detailsTitle: "HIGH LIGHTS!",
        cost: [
          {
            price: 13999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          },
          {
            price: 139, 
            type: "VirtualCurrency",
            id: "MC",
            label: "Coins"
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 50,
        claimWindowEnabled:true,//defaults to true
        claimStartMS:  Date.UTC(2022,10,18,14,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
    contract: "0x9B0A93EA49955a5ef1878c1a1e8f8645d049e597",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entL4",
        shapeName: "models/Rewards/rewardL4.glb",
        hoverText: "Claim a Digifun Ice Shadow ",
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
        image: "images/ui/digifunwearable.png",//"https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x9B0A93EA49955a5ef1878c1a1e8f8645d049e597:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "You'll randomly get a helmet or a body within \n1 mint, 2 mints max per person",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Digifun Ice Shadow",
        detailsTitle: "HIGH LIGHTS!",
        cost: [
          {
            price: 7999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          },
          {
            price: 38, 
            type: "VirtualCurrency",
            id: "MC",
            label: "Coins"
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 100,
        claimWindowEnabled:true,//defaults to true
        claimStartMS:  Date.UTC(2022,10,18,14,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
    contract: "0x4a92c8e90d2134cdca4a50fbf8261ed798ca7873",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entL5",
        shapeName: "models/Rewards/rewardL5.glb",
        hoverText: "Claim a SpanishMuseum Jacket",
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x4a92c8e90d2134cdca4a50fbf8261ed798ca7873:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "Decentraland SpanishMuseum Jacket Wearable NFT",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "SPM Jacket",
        detailsTitle: "HIGH LIGHTS!",
        cost: [
          {
            price: 3999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          },
          {
            price: 18, 
            type: "VirtualCurrency",
            id: "MC",
            label: "Coins"
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 70,
        claimWindowEnabled:true,//defaults to true
        claimStartMS:  Date.UTC(2022,10,18,14,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
    contract: "0x47F8B9b9ec0F676b45513c21db7777Ad7bFEdB35",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entL6",
        shapeName: "models/Rewards/dogehead.glb",
        hoverText: "Claim a Meta live Studio Doge Head",
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
        
        detailsInfo: "Doge Head Wearable NFT.\nIt will give you 3% bonus when collecting coins",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Doge Head",
        detailsTitle: "HIGH LIGHTS!",
        cost: [
          {
            price: 12999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          },
          {
            price: 129, 
            type: "VirtualCurrency",
            id: "MC",
            label: "Coins"
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 50,
        claimWindowEnabled:true,//defaults to true
        claimStartMS:  Date.UTC(2022,10,18,14,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
    contract: "0x199c20d3cd178abd23e3e62c91cfce5aeb1ff52f",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entR1",
        shapeName: "models/Rewards/rewardR1.glb",
        hoverText: "Claim a Decentral Game Cyber-Trouser ",
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
        image: "images/ui/DGwearable.png",//"https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x199c20d3cd178abd23e3e62c91cfce5aeb1ff52f/items/0:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 590,
        imageHeight: 590,
        detailsFontSize: 12, 
        
        detailsInfo: "Decentral Games Cyber-Pant(Last refill),holders enjoy\nunique DG discord roles & 3% game bonus here",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "DG Cyber-Trouser",
        detailsTitle: "HIGH LIGHTS!",
        cost: [
          {
            price: 89888, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          },
          {
            price: 898, 
            type: "VirtualCurrency",
            id: "MC",
            label: "Coins"
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 3,
        claimWindowEnabled:true,//defaults to true
        claimStartMS: Date.UTC(2022,10,18,13,30,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
    contract: "0xac852e781cc7f4fc759ebb384638ad99075420b0",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entR2",
        shapeName: "models/Rewards/rewardR2.glb",
        hoverText: "Claim a Galxe Cyber-Wings",
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xac852e781cc7f4fc759ebb384638ad99075420b0:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "Galxe exclusive Cyber-Wings(Last refill)\nIn future, it will give you 3% game bonus here",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Galxe Cyber-Wings",
        detailsTitle: "HIGH LIGHTS!",
        cost: [
          {
            price: 87888, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          },
          {
            price: 800, 
            type: "VirtualCurrency",
            id: "MC",
            label: "Coins"
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 6,
        claimWindowEnabled:true,//defaults to true
        claimStartMS: Date.UTC(2022,10,18,13,30,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
    contract: "0xcd4ac241ff7002a94f42331d4887296090856c43",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entR3",
        shapeName: "models/Rewards/rewardR3.glb",
        hoverText: "Claim a Mimic Shaans CaT-shirt ",
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xcd4ac241ff7002a94f42331d4887296090856c43:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "Mimic Shaans exclusive CaT-shirt \nholders enjoy unique discord roles",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "MSH CaT-shirt",
        detailsTitle: "HIGH LIGHTS!",
        cost: [
          {
            price: 13999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          },
          {
            price: 139, 
            type: "VirtualCurrency",
            id: "MC",
            label: "Coins"
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 18,
        claimWindowEnabled:true,//defaults to true
        claimStartMS: Date.UTC(2022,10,18,14,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
    contract: "0x683156c152fb247701c5bde3b6da4c97f88b98e7",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entR4",
        shapeName: "models/Rewards/rewardR4.glb",
        hoverText: "Claim a CreatorDAO CDVeste ",
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x683156c152fb247701c5bde3b6da4c97f88b98e7:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "Creator DAO exclusive CDVeste",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Creator DAO CDVeste",
        detailsTitle: "HIGH LIGHTS!",
        cost: [
          {
            price: 5999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          },
          {
            price: 28, 
            type: "VirtualCurrency",
            id: "MC",
            label: "Coins"
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 70,
        claimWindowEnabled:true,//defaults to true
        claimStartMS: Date.UTC(2022,10,18,14,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
    contract: "0x856792f313d0cb243da40e05ab1f86f54699db22",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entR5",
        shapeName: "models/Rewards/rewardR5.glb",
        hoverText: "Claim a Adshares MetaMine Tee",
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x856792f313d0cb243da40e05ab1f86f54699db22:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "Adshares exclusive MetaMine Tee wearable",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Adshares Tee",
        detailsTitle: "HIGH LIGHTS!",
        cost: [
          {
            price: 9999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          },
          {
            price: 99, 
            type: "VirtualCurrency",
            id: "MC",
            label: "Coins"
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 50,
        claimWindowEnabled:true,//defaults to true
        claimStartMS: Date.UTC(2022,10,18,14,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
    contract: "0xa0aff7bf9930f94a2ac256c18a8d056eb21ff790",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entR6",
        shapeName: "models/Rewards/rewardR6.glb",
        hoverText: "Claim a WildernessP2E Wild Pizza Wand",
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xa0aff7bf9930f94a2ac256c18a8d056eb21ff790:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "WildernessP2E exclusive Pizza Wand,dual \ngame utilities in both Wilderness and here",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Wild Pizza Wand",
        detailsTitle: "HIGH LIGHTS!",
        cost: [
          {
            price: 19999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          },
          {
            price: 199, 
            type: "VirtualCurrency",
            id: "MC",
            label: "Coins"
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 5,
        claimWindowEnabled:true,//defaults to true
        claimStartMS:Date.UTC(2022,10,18,14,0,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}

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
    contract: "0x1925eb9b1a0924a14c8dfd3e441765ff1b6753b1",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS1",
        shapeName: "models/Rewards/rewardS1.glb",
        hoverText: "Claim a Soul Magic wearable ",
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x1925eb9b1a0924a14c8dfd3e441765ff1b6753b1:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "Soul Magic exclusive cyberpunk style wearable \n for the Metaminee",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Soul Magic Cyberpunk",
        detailsTitle: "HIGH LIGHTS!",
        cost: [
          {
            price: 19999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 4,
        claimWindowEnabled:true,//defaults to true
        claimStartMS: Date.UTC(2022,10,18,14,30,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
    contract: "0xeE0bF3C1f99Ad2D75F3C71B950F49baF85Da62E3",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS2",
        shapeName: "models/Rewards/rewardS2.glb",
        hoverText: "Claim a Apes3D Wearable ",
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
        image: "images/ui/apes3dwearable.png",//"https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xeE0bF3C1f99Ad2D75F3C71B950F49baF85Da62E3:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "You might get any of the Apes3D wearables\nwith 1 mint, 2 mints max per person",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Apes3D wearble",
        detailsTitle: "HIGH LIGHTS!",
        cost: [
          {
            price: 4999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 75,
        claimWindowEnabled:true,//defaults to true
        claimStartMS: Date.UTC(2022,10,18,14,30,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
    contract: "0xc4a28c49dbe5cbfe1f73d1a347104468ae4fff9b",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS3",
        shapeName: "models/Rewards/rewardS3.glb",
        hoverText: "Claim a GAFC Allowlist T-Shirt",
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xc4a28c49dbe5cbfe1f73d1a347104468ae4fff9b:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "GAFC Allowlist T-Shirt.\n This wearable will be used as GAFC allowlist",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "GAFC T-Shirt",
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
        qtyTotal: 40,
        claimWindowEnabled:true,//defaults to true
        claimStartMS: Date.UTC(2022,10,18,14,30,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
    contract: "0x30d3387ff3de2a21bef7032f82d00ff7739e403c",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS4",
        shapeName: "models/Rewards/rewardS4.glb",
        hoverText: "Claim a Sammich frog outfit",
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
        image: "images/ui/golfcraftwearable.png",//"https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x30d3387ff3de2a21bef7032f82d00ff7739e403c:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "Sponsored by Golfcraft (Out of stock)",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Sammich Frog Outfit",
        detailsTitle: "HIGH LIGHTS!",
        cost: [
          {
            price: 8999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 5,
        claimWindowEnabled:true,//defaults to true
        claimStartMS:Date.UTC(2022,10,18,14,30,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
    contract: "0x10b7830b4ea4c9f21ee2dc58e1339e2ec2d18610",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS5",
        shapeName: "models/Rewards/rewardS5.glb",
        hoverText: "Claim a MD Super Man ",
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x10b7830b4ea4c9f21ee2dc58e1339e2ec2d18610:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 512,
        imageHeight: 512,
        detailsFontSize: 12, 
        
        detailsInfo: "MultiverseDAO Super Man wearable",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "MD Super Man",
        detailsTitle: "HIGH LIGHTS!",
        cost: [
          {
            price: 2999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 50,
        claimWindowEnabled:true,//defaults to true
        claimStartMS:Date.UTC(2022,10,18,14,30,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
    contract: "0x4b202676ab2691fc0c589ab191f2b61927adc27f",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS6",
        shapeName: "models/Rewards/rewardS6.glb",
        hoverText: "Claim a DAMG Fruit Farmer",
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x4b202676ab2691fc0c589ab191f2b61927adc27f:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "DAMG Fruit Farmer wearble",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Fruit Farmer",
        detailsTitle: "HIGH LIGHTS!",
        cost: [
          {
            price: 2999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 20,
        claimWindowEnabled:true,//defaults to true
        claimStartMS:Date.UTC(2022,10,18,14,30,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
    contract: "0x47F8B9b9ec0F676b45513c21db7777Ad7bFEdB35",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS7",
        shapeName: "models/Rewards/rewardS7.glb",
        hoverText: "Claim a MetaCat Pet (Voxel)",
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
        image: "images/ui/metacat.png",//"https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x47f8b9b9ec0f676b45513c21db7777ad7bfedb35:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "Wearable for Voxel Metaverse, please\n contact us on discord if you want to claim",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "MetaCat CV PET",
        detailsTitle: "HIGH LIGHTS!",
        cost: [
          {
            price: 2999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 20,
        claimWindowEnabled:true,//defaults to true
        claimStartMS: Date.UTC(2022,10,18,14,30,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
    contract: "0xae3d6cbe10cb4a0947c5e8362efb2802ab5098ab",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS8",
        shapeName: "models/Rewards/rewardS8.glb",
        hoverText: "Claim a Polygonal Mind University Jacket ",
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xae3d6cbe10cb4a0947c5e8362efb2802ab5098ab:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 1024,
        imageHeight: 1024,
        detailsFontSize: 12, 
        
        detailsInfo: "Polygonal Mind Jacket Wearable with mysteriou utility",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "PM Jacket",
        detailsTitle: "HIGH LIGHTS!",
        cost: [
          {
            price: 6999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 20,
        claimWindowEnabled:true,//defaults to true
        claimStartMS:Date.UTC(2022,10,18,14,30,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
    contract: "0x1409582a6b6467562493dec2373f9a4c018f4394",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS9",
        shapeName: "models/Rewards/rewardS9.glb",
        hoverText: "Claim a MetaPoly T-shirt ",
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
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x1409582a6b6467562493dec2373f9a4c018f4394:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 900,
        imageHeight: 900,
        detailsFontSize: 12, 
        
        detailsInfo: "MetaPoly exclusive T-shirt wearable.\n Holders will have special role in MetaPoly Discord ",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "MetaPoly T-shirt",
        detailsTitle: "HIGH LIGHTS!",
        cost: [
          {
            price: 8999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 50,
        claimWindowEnabled:true,//defaults to true
        claimStartMS:Date.UTC(2022,10,18,14,30,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
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
    contract: "0xcd483597943e369a7ba4861acbb334b17178fa64",
    itemId: "0",
    options: {
      type: "2D-UI",
      featuredEntityData: {
        parent: _scene,
        entityName: "entS10",
        shapeName: "models/Rewards/rewardS10.glb",
        hoverText: "Claim a Zeitgeist Long Gown ",
        transform: transformArgs,
        motionData: {
          rotationVelocity: ROTATE_VELOCITY_OFF,
          moveVelocity: MOVE_VELOCITY,
          moveInterval: MOVE_INTERVAL,
        },
      },
      nftUIData: {
        style: "version20Modal",
        type: "Zeitgeist Long Gown",
        image: "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0xcd483597943e369a7ba4861acbb334b17178fa64:0/thumbnail",//BASE_DIR + "images/makersPlaceAliceInWater.png",
        //imageSection: {  },
        imageWidth: 512,
        imageHeight: 512,
        detailsFontSize: 12, 
        
        detailsInfo: "Zeitgeist's first Decentraland wearable",
        directLink: "https://market.decentraland.org/",
        directLinkFontSize: 10,
        title: "Zeitgeist Long Gown",
        detailsTitle: "HIGH LIGHTS!",
        cost: [
          {
            price: 6999, 
            type: "VirtualCurrency",
            id: "GC",
            label: "Coins",
          }
        ],
        showStockQty:true,//defaults to true
        qtyCurrent: -2,
        qtyTotal: 90,
        claimWindowEnabled:true,//defaults to true
        claimStartMS:Date.UTC(2022,10,18,14,30,0,0),//-1,//Date.UTC(2022,11,11,15,16,17,0),//UTC
        claimEndMS: -1,//Date.UTC(2021,11,11,15,16,17,0),
      },
    },
  });
}

//START MAKING REWARD S11
// blank

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
        shapeName: "models/Rewards/rewardS12.glb",
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
        imageWidth: 512,
        imageHeight: 512,
        detailsFontSize: 12, 
        
        detailsInfo: "Turn yourself into a Muscle Doge!\n2 mints max per person",
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
