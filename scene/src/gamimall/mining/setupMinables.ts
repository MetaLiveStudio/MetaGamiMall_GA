import { CONFIG, initConfig } from "src/config";
import * as serverStateSpec from "src/gamimall/state/MyRoomStateSpec";

initConfig()

export const COIN_GAME_FEATURE_DEF:serverStateSpec.TrackFeatureDef = 
{
  buyables:[ 
    {
    id: 'buyable.item.bronze.shoe',
    name: "MetaMine Pass Key",
    enabled: true && CONFIG.GAME_BUYABLES_ENABLED,
    type: 'buyable.item.bronze.shoe',//tree/rock
    rewards:[
      //can only send these values to a server with debug enabled
      //we cannot let client to send these values as it can be hacked
      { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: 0 },
      { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: 1 } ,
      //{ type:"DropTable","id":'minable.rock1.reward',amount: 0 },
      //{ type:"RemoteConfig","id":'minable.rock1.reward',amount: 0 },
    ],//RewardData[]
    purchaseDelay:0, //time mining to take 
    cost:[
      //can only send these values to a server with debug enabled
      //we cannot let client to send these values as it can be hacked
      { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: 1 },
      { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: 1 },
      //{ type:"CatalogItem","id":"Minables.v1",amount: 0 },
    ],//CostData[]
    ui:{ //configure stuff visible for scene
      minableModel:"models/Items/PassKey.glb",
      description:"Unlock your potential \n gives you 1% coin bonus",
      descriptionTitle:"Information",
      portrait:{src:"images/game/PassKey.png",width:300,height:300},  
      hoverText:"Buy MetaMine PassKey",
      modalClaimButtonLabel: "Buy!"//
      //toolDistanceOffCenterTarget:-1.8
      //toolModel:"",
      //toolOffset:new Vector3(1,0,1)
    },
    //triggerSize?: Vector3State 
    //health:HealthDataState
    //activateDistance?:number //distance to activate
    spawnDef:{
      concurrentMax:1,
      expireTime:undefined, //-1 or undefined = never expire
      respawnTime:undefined, //-1 or undefined = immediate respawn
      coolDownTime: 1000, //-1 or undefined = time to cooldown between expire/hit
      zones:[
        {position: {x:40.2,y:2,z:11.5},scale:new Vector3(1,1,1)},//{position: {x:1 + 30,y:0,z:1}},
      ] 
    } 
    }
   ,{
      id: 'buyable.rock2',
      name: "Craft Red Rock",
      enabled: true && CONFIG.GAME_BUYABLES_ENABLED,
      type: 'buyable.rock2',//tree/rock
      rewards:[
        //can only send these values to a server with debug enabled
        //we cannot let client to send these values as it can be hacked
        { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: 0 },
        { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: 1 } ,
        //{ type:"DropTable","id":'minable.rock1.reward',amount: 0 },
        //{ type:"RemoteConfig","id":'minable.rock1.reward',amount: 0 },
      ],//RewardData[]
      purchaseDelay:0, //time mining to take 
      cost:[
        //can only send these values to a server with debug enabled
        //we cannot let client to send these values as it can be hacked
        { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: 1 },
        { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: 1 },
        //{ type:"CatalogItem","id":"Minables.v1",amount: 0 },
      ],//CostData[]
      ui:{ //configure stuff visible for scene
        minableModel:"models/ExchangeCenter/RedRock.glb",
        description:"Craft 5 Red Rock",
        descriptionTitle:"Information",
        portrait:{src:"images/ui/RedRock.png",width:300,height:300},  
        hoverText:"Craft 5 Red Rock",
        modalClaimButtonLabel: "Craft!"//
        //toolDistanceOffCenterTarget:-1.8
        //toolModel:"",
        //toolOffset:new Vector3(1,0,1)
      },
      //triggerSize?: Vector3State 
      //health:HealthDataState
      //activateDistance?:number //distance to activate
      spawnDef:{
        concurrentMax:1,
        expireTime:undefined, //-1 or undefined = never expire
        respawnTime:undefined, //-1 or undefined = immediate respawn
        coolDownTime: 1000, //-1 or undefined = time to cooldown between expire/hit
        zones:[
          {position: {x:52.44,y:2,z:11.5},scale:new Vector3(1,1,1)},//{position: {x:1 + 30,y:0,z:1}},
        ] 
      } ,
      },
      {
        id: 'buyable.rock3',
        name: "Craft Blue Rock",
        enabled: true && CONFIG.GAME_BUYABLES_ENABLED,
        type: 'buyable.rock3',//tree/rock
        rewards:[
          //can only send these values to a server with debug enabled
          //we cannot let client to send these values as it can be hacked
          { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: 0 },
          { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: 1 } ,
          //{ type:"DropTable","id":'minable.rock1.reward',amount: 0 },
          //{ type:"RemoteConfig","id":'minable.rock1.reward',amount: 0 },
        ],//RewardData[]
        purchaseDelay:0, //time mining to take 
        cost:[
          //can only send these values to a server with debug enabled
          //we cannot let client to send these values as it can be hacked
          { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: 1 },
          { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: 1 },
          //{ type:"CatalogItem","id":"Minables.v1",amount: 0 },
        ],//CostData[]
        ui:{ //configure stuff visible for scene
          minableModel:"models/ExchangeCenter/BlueRock.glb",
          description:"Craft 5 Blue Rock",
          descriptionTitle:"Information",
          portrait:{src:"images/ui/BlueRock.png",width:300,height:300},  
          hoverText:"Craft 5 Blue Rock",
          modalClaimButtonLabel: "Craft!"//
          //toolDistanceOffCenterTarget:-1.8
          //toolModel:"",
          //toolOffset:new Vector3(1,0,1)
        },
        //triggerSize?: Vector3State 
        //health:HealthDataState
        //activateDistance?:number //distance to activate
        spawnDef:{
          concurrentMax:1,
          expireTime:undefined, //-1 or undefined = never expire
          respawnTime:undefined, //-1 or undefined = immediate respawn
          coolDownTime: 1000, //-1 or undefined = time to cooldown between expire/hit
          zones:[
            {position: {x:52.44+2.5,y:2,z:11.5},scale:new Vector3(1,1,1)},//{position: {x:1 + 30,y:0,z:1}},
          ] 
        } ,
        },
        {
          id: 'buyable.BP',
          name: "Craft Petrol",
          enabled: true && CONFIG.GAME_BUYABLES_ENABLED,
          type: 'buyable.BP',//tree/rock
          rewards:[
            //can only send these values to a server with debug enabled
            //we cannot let client to send these values as it can be hacked
            { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: 0 },
            { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: 1 } ,
            //{ type:"DropTable","id":'minable.rock1.reward',amount: 0 },
            //{ type:"RemoteConfig","id":'minable.rock1.reward',amount: 0 },
          ],//RewardData[]
          purchaseDelay:0, //time mining to take 
          cost:[
            //can only send these values to a server with debug enabled
            //we cannot let client to send these values as it can be hacked
            { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: 1 },
            { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: 1 },
            //{ type:"CatalogItem","id":"Minables.v1",amount: 0 },
          ],//CostData[]
          ui:{ //configure stuff visible for scene
            minableModel:"models/ExchangeCenter/Petrol.glb",
            description:"Craft 5 Petrol",
            descriptionTitle:"Information",
            portrait:{src:"images/ui/Petrol.png",width:300,height:300},  
            hoverText:"Craft 5 Petrol",
            modalClaimButtonLabel: "Craft!"//
            //toolDistanceOffCenterTarget:-1.8
            //toolModel:"",
            //toolOffset:new Vector3(1,0,1)
          },
          //triggerSize?: Vector3State 
          //health:HealthDataState
          //activateDistance?:number //distance to activate
          spawnDef:{
            concurrentMax:1,
            expireTime:undefined, //-1 or undefined = never expire
            respawnTime:undefined, //-1 or undefined = immediate respawn
            coolDownTime: 1000, //-1 or undefined = time to cooldown between expire/hit
            zones:[
              {position: {x:52.44+2.5+2.5,y:2,z:11.5},scale:new Vector3(1,1,1)},//{position: {x:1 + 30,y:0,z:1}},
            ] 
          } ,
          },
          {
            id: 'buyable.NI',
            name: "Craft Nitro",
            enabled: true && CONFIG.GAME_BUYABLES_ENABLED,
            type: 'buyable.NI',//tree/rock
            rewards:[
              //can only send these values to a server with debug enabled
              //we cannot let client to send these values as it can be hacked
              { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: 0 },
              { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: 1 } ,
              //{ type:"DropTable","id":'minable.rock1.reward',amount: 0 },
              //{ type:"RemoteConfig","id":'minable.rock1.reward',amount: 0 },
            ],//RewardData[]
            purchaseDelay:0, //time mining to take 
            cost:[
              //can only send these values to a server with debug enabled
              //we cannot let client to send these values as it can be hacked
              { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: 1 },
              { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: 1 },
              //{ type:"CatalogItem","id":"Minables.v1",amount: 0 },
            ],//CostData[]
            ui:{ //configure stuff visible for scene
              minableModel:"models/ExchangeCenter/Nitro.glb",
              description:"Craft 5 Nitro",
              descriptionTitle:"Information",
              portrait:{src:"images/ui/Nitro.png",width:300,height:300},  
              hoverText:"Craft 5 Nitro",
              modalClaimButtonLabel: "Craft!"//
              //toolDistanceOffCenterTarget:-1.8
              //toolModel:"",
              //toolOffset:new Vector3(1,0,1)
            },
            //triggerSize?: Vector3State 
            //health:HealthDataState
            //activateDistance?:number //distance to activate
            spawnDef:{
              concurrentMax:1,
              expireTime:undefined, //-1 or undefined = never expire
              respawnTime:undefined, //-1 or undefined = immediate respawn
              coolDownTime: 1000, //-1 or undefined = time to cooldown between expire/hit
              zones:[
                {position: {x:52.44+2.5+2.5+2.5,y:2,z:11.5},scale:new Vector3(1,1,1)},//{position: {x:1 + 30,y:0,z:1}},
              ] 
            },
            },
            {
              id: 'buyable.ADS',
              name: "Exchange AdsCoin",
              enabled: true && CONFIG.GAME_BUYABLES_ENABLED,
              type: 'buyable.ADS',//tree/rock
              rewards:[
                //can only send these values to a server with debug enabled
                //we cannot let client to send these values as it can be hacked
                { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: 0 },
                { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: 1 } ,
                //{ type:"DropTable","id":'minable.rock1.reward',amount: 0 },
                //{ type:"RemoteConfig","id":'minable.rock1.reward',amount: 0 },
              ],//RewardData[]
              purchaseDelay:0, //time mining to take 
              cost:[
                //can only send these values to a server with debug enabled
                //we cannot let client to send these values as it can be hacked
                { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: 1 },
                { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: 1 },
                //{ type:"CatalogItem","id":"Minables.v1",amount: 0 },
              ],//CostData[]
              ui:{ //configure stuff visible for scene
                minableModel:"models/ExchangeCenter/CoinsToAdsCoins.glb",
                description:"Exchange 300 AdsCoin",
                descriptionTitle:"Information",
                portrait:{src:"images/ui/exchangeadscoin.png",width:500,height:500},  
                hoverText:"Exchange 300 AdsCoin",
                modalClaimButtonLabel: "Exchange!"//
                //toolDistanceOffCenterTarget:-1.8
                //toolModel:"",
                //toolOffset:new Vector3(1,0,1)
              },
              //triggerSize?: Vector3State 
              //health:HealthDataState
              //activateDistance?:number //distance to activate
              spawnDef:{
                concurrentMax:1,
                expireTime:undefined, //-1 or undefined = never expire
                respawnTime:undefined, //-1 or undefined = immediate respawn
                coolDownTime: 1000, //-1 or undefined = time to cooldown between expire/hit
                zones:[
                  {position: {x:76.78,y:4,z:8.06},scale:new Vector3(1,1,1)},//{position: {x:1 + 30,y:0,z:1}},
                ] 
              },
              },
              {
                id: 'buyable.MC',
                name: "Exchange Diamonds",
                enabled: true && CONFIG.GAME_BUYABLES_ENABLED,
                type: 'buyable.MC',//tree/rock
                rewards:[
                  //can only send these values to a server with debug enabled
                  //we cannot let client to send these values as it can be hacked
                  { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: 0 },
                  { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: 1 } ,
                  //{ type:"DropTable","id":'minable.rock1.reward',amount: 0 },
                  //{ type:"RemoteConfig","id":'minable.rock1.reward',amount: 0 },
                ],//RewardData[]
                purchaseDelay:0, //time mining to take 
                cost:[
                  //can only send these values to a server with debug enabled
                  //we cannot let client to send these values as it can be hacked
                  { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: 1 },
                  { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: 1 },
                  //{ type:"CatalogItem","id":"Minables.v1",amount: 0 },
                ],//CostData[]
                ui:{ //configure stuff visible for scene
                  minableModel:"models/ExchangeCenter/CoinsToDiamonds.glb",
                  description:"Exchange 300 Diamonds",
                  descriptionTitle:"Information",
                  portrait:{src:"images/ui/exchangediamonds.png",width:500,height:500},  
                  hoverText:"Exchange 300 Diamonds",
                  modalClaimButtonLabel: "Exchange!"//
                  //toolDistanceOffCenterTarget:-1.8
                  //toolModel:"",
                  //toolOffset:new Vector3(1,0,1)
                },
                //triggerSize?: Vector3State 
                //health:HealthDataState
                //activateDistance?:number //distance to activate
                spawnDef:{
                  concurrentMax:1,
                  expireTime:undefined, //-1 or undefined = never expire
                  respawnTime:undefined, //-1 or undefined = immediate respawn
                  coolDownTime: 1000, //-1 or undefined = time to cooldown between expire/hit
                  zones:[
                    {position: {x:75.99,y:4,z:4.80},scale:new Vector3(1,1,1)},//{position: {x:1 + 30,y:0,z:1}},
                  ]
                },
                },
                {
                  id: 'buyable.rock1',
                  name: "Exchange GreyRock",
                  enabled: true && CONFIG.GAME_BUYABLES_ENABLED,
                  type: 'buyable.rock1',//tree/rock
                  rewards:[
                    //can only send these values to a server with debug enabled
                    //we cannot let client to send these values as it can be hacked
                    { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: 0 },
                    { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: 1 } ,
                    //{ type:"DropTable","id":'minable.rock1.reward',amount: 0 },
                    //{ type:"RemoteConfig","id":'minable.rock1.reward',amount: 0 },
                  ],//RewardData[]
                  purchaseDelay:0, //time mining to take 
                  cost:[
                    //can only send these values to a server with debug enabled
                    //we cannot let client to send these values as it can be hacked
                    { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: 1 },
                    { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: 1 },
                    //{ type:"CatalogItem","id":"Minables.v1",amount: 0 },
                  ],//CostData[]
                  ui:{ //configure stuff visible for scene
                    minableModel:"models/ExchangeCenter/CoinsToGreyRock.glb",
                    description:"Exchange 300 GreyRock",
                    descriptionTitle:"Information",
                    portrait:{src:"images/ui/exchangegreyrock.png",width:500,height:500},  
                    hoverText:"Exchange 300 GreyRock",
                    modalClaimButtonLabel: "Exchange!"//
                    //toolDistanceOffCenterTarget:-1.8
                    //toolModel:"",
                    //toolOffset:new Vector3(1,0,1)
                  },
                  //triggerSize?: Vector3State 
                  //health:HealthDataState
                  //activateDistance?:number //distance to activate
                  spawnDef:{
                    concurrentMax:1,
                    expireTime:undefined, //-1 or undefined = never expire
                    respawnTime:undefined, //-1 or undefined = immediate respawn
                    coolDownTime: 1000, //-1 or undefined = time to cooldown between expire/hit
                    zones:[
                      {position: {x:75.90,y:4,z:11.41},scale:new Vector3(1,1,1)},//{position: {x:1 + 30,y:0,z:1}},
                    ] 
                  },
                  },
  ],
  minables:[
    /*{
      id: 'minable.rnd1',//NOT READY YET
      enabled: true,
      type: 'minable.rnd1',//tree/rock  //NOT READY YET
      rewards:[],//RewardData[]
      cost:[],//CostData[]

      //triggerSize?: Vector3State
      //health:HealthDataState
      //activateDistance?:number //distance to activate

      spawnDef:{ 
        concurrentMax:2,
        expireTime:[1000,10000], //-1 or undefined = never expire
        respawnTime:[5000,10000], //-1 or undefined = immediate respawn
        coolDownTime: 1000, //-1 or undefined = time to cooldown between expire/hit
        zones:[
          {position: {x:24,y:0,z:20}},//{position: {x:1 + 30,y:0,z:1}},
          {position: {x:14,y:0,z:24}},//{position: {x:2+ 30,y:0,z:1}},
          {position: {x:24,y:0,z:27}},//{position: {x:3+ 30,y:0,z:1}},
          {position: {x:18,y:0,z:30}},//{position: {x:4+ 30,y:0,z:1}},
        ]
      },
      subTypes:[
        
      ]
    },*/ 
    {
    id: 'minable.rock1',
    name: "CyberRocks",
    enabled: true && CONFIG.GAME_MINABLES_ENABLED,
    type: 'minable.rock1',//tree/rock
    rewards:[
      //can only send these values to a server with debug enabled
      //we cannot let client to send these values as it can be hacked
      { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: 0 },
      { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: 1 } ,
      //{ type:"DropTable","id":'minable.rock1.reward',amount: 0 },
      //{ type:"RemoteConfig","id":'minable.rock1.reward',amount: 0 },
    ],//RewardData[]
    purchaseDelay:10000, //time mining to take
    cost:[
      //can only send these values to a server with debug enabled
      //we cannot let client to send these values as it can be hacked
      { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: 1 },
      { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: 1 },
      //{ type:"CatalogItem","id":"Minables.v1",amount: 0 },
    ],//CostData[]
    ui:{ //configure stuff visible for scene
      minableModel:"models/MineGame/MineRock.glb",
      description:"Mine this rock to gain materials",
      descriptionTitle:"Information",
      portrait:{src:"images/ui/portraits/minable-rock-1.png",width:500,height:500},
      hoverText:"Mine CyberRock",
      modalClaimButtonLabel: "Mine!",//
      tool:{ 
        enabled:true,
        //distanceOffCenterTarget:.5,
        //transformScale:new Vector3(2,2,2)
        model:'axe'
      },
      animations:{ 
        enabled:false
      }
      //toolModel:"",
      //toolOffset:new Vector3(1,0,1)
    },
    //triggerSize?: Vector3State 
    //health:HealthDataState
    //activateDistance?:number //distance to activate

      spawnDef:{
        concurrentMax:2,
        expireTime:[90000,100000], //-1 or undefined = never expire
        respawnTime:[5000,10000], //-1 or undefined = immediate respawn
        coolDownTime: 1000, //-1 or undefined = time to cooldown between expire/hit
        zones:[
          {position: {x:7.45,y:1.5,z:20.86},scale:new Vector3(2.2,2.2,2.2)},//{position: {x:1 + 30,y:0,z:1}},
          {position: {x:23.71,y:1.5,z:37.87},scale:new Vector3(2.2,2.2,2.2)},//{position: {x:2+ 30,y:0,z:1}},
          {position: {x:22.7,y:1.5,z:26.86},scale:new Vector3(2.2,2.2,2.2)},//{position: {x:3+ 30,y:0,z:1}},
          {position: {x:19.28,y:1.5,z:29.92},scale:new Vector3(2.2,2.2,2.2)},//{position: {x:4+ 30,y:0,z:1}},
          {position: {x:13.70,y:1.5,z:24.04},scale:new Vector3(1.9,1.9,1.9)},//{position: {x:4+ 30,y:0,z:1}},
          {position: {x:23.14,y:1.5,z:20.00},scale:new Vector3(2.2,2.2,2.2)},//{position: {x:4+ 30,y:0,z:1}},
        ] 
      } 
    },
    /*{
      id: 'minable.test.voxbucks',
      name: "CyberRocks",
      enabled: true && CONFIG.GAME_MINABLES_ENABLED,
      type: 'minable.test.voxbucks',//tree/rock
      rewards:[
        //can only send these values to a server with debug enabled
        //we cannot let client to send these values as it can be hacked
        { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: 0 },
        { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: 1 } ,
        //{ type:"DropTable","id":'minable.rock1.reward',amount: 0 },
        //{ type:"RemoteConfig","id":'minable.rock1.reward',amount: 0 },
      ],//RewardData[]
      purchaseDelay:7000, //time mining to take
      cost:[
        //can only send these values to a server with debug enabled
        //we cannot let client to send these values as it can be hacked
        { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: 1 },
        { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: 1 },
        //{ type:"CatalogItem","id":"Minables.v1",amount: 0 },
      ],//CostData[]
      ui:{ //configure stuff visible for scene
        minableModel:"models/MineGame/MineRock.glb",
        description:"Mine this rock to gain materials",
        descriptionTitle:"Information",
        portrait:{src:"images/ui/portraits/minable-rock-1.png",width:500,height:500},
        hoverText:"Mine CyberRock",
        modalClaimButtonLabel: "Mine!",//
        tool:{ 
          enabled:true,
          //distanceOffCenterTarget:.5,
          //transformScale:new Vector3(2,2,2)
          model:'axe'
        },
        animations:{ 
          enabled:false
        }
        //toolModel:"",
        //toolOffset:new Vector3(1,0,1)
      },
      //triggerSize?: Vector3State 
      //health:HealthDataState
      //activateDistance?:number //distance to activate
  
        spawnDef:{
          concurrentMax:1,
          expireTime:[90000,100000], //-1 or undefined = never expire
          respawnTime:[1000,2000], //-1 or undefined = immediate respawn
          coolDownTime: 1000, //-1 or undefined = time to cooldown between expire/hit
          zones:[
            {position: {x:10,y:1.5,z:10},scale:new Vector3(6,6,6)},//{position: {x:1 + 30,y:0,z:1}},
          ] 
        } 
      },*/
    {
      id: 'minable.MysteryBlock',  
      name: "Mystery Block",
      enabled: true && CONFIG.GAME_MINABLES_ENABLED,
      type: 'minable.MysteryBlock',//tree/rock
      rewards:[
        //can only send these values to a server with debug enabled
        //we cannot let client to send these values as it can be hacked
        { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: 2 },
        { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: 2 } 
      ],//RewardData[]
      purchaseDelay:0, //time mining to take
      cost:[
        { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: 1 },
        { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: 0 } 
      ],//CostData[]
      ui:{ //configure stuff visible for scene
        minableModel:"models/VCNMaterials/MysteryBlock.glb",
        portrait:{src:"images/ui/mysteryblock.png",width:500,height:500},
        description:"Click and see what you can get \n in this mystery block",
        descriptionTitle:"Information",
        hoverText:"Open Mystery Block",
        tool:{
          enabled:true,
          distanceOffCenterTarget:0,
          transformScale:new Vector3(4,4,4),
          model:'sparkle',
          onHideDelayMS: 500
        },
        animations:{
          enabled:false
        }
      },
      //triggerSize?: Vector3State
      //health:HealthDataState
      //activateDistance?:number //distance to activate

        spawnDef:{
          concurrentMax:2,
          expireTime:[60000,60000], //-1 or undefined = never expire
          respawnTime:[10000,50000], //-1 or undefined = immediate respawn
          coolDownTime: 1000, //-1 or undefined = time to cooldown between expire/hit
          zones:[
            {position: {x:30.75,y:2,z:30},scale:new Vector3(1,1,1)},//{position: {x:1 + 30,y:0,z:1}},
            {position: {x:30.75,y:2,z:8.09},scale:new Vector3(1,1,1)},//{position: {x:2+ 30,y:0,z:1}},
            {position: {x:24,y:24.5,z:38},scale:new Vector3(1,1,1)}, //moonsquare
            {position: {x:24,y:24.5,z:55},scale:new Vector3(1,1,1)},//moonsquare
            {position: {x:24,y:24.5,z:62},scale:new Vector3(1,1,1)},//moonsquare
            {position: {x:55,y:5.7,z:38},scale:new Vector3(1,1,1)},//musclesqaure
            {position: {x:55,y:5.7,z:66},scale:new Vector3(1,1,1)},//musclesqaure
            {position: {x:44,y:32.4,z:55},scale:new Vector3(1,1,1)},//marssqaure
            {position: {x:55,y:32.4,z:55},scale:new Vector3(1,1,1)},//marssqaure
            {position: {x:24,y:52,z:50},scale:new Vector3(1,1,1)},//heavensqaure
            {position: {x:24,y:52,z:62},scale:new Vector3(1,1,1)},//heavensqaure
            {position: {x:53,y:2,z:30},scale:new Vector3(1,1,1)},//groundfloor
            {position: {x:39,y:2,z:63},scale:new Vector3(1,1,1)},//groundfloor
            {position: {x:61,y:2,z:79},scale:new Vector3(1,1,1)},//groundfloor
            {position: {x:14,y:2,z:22},scale:new Vector3(1,1,1)},//groundfloor
            {position: {x:20,y:2,z:33},scale:new Vector3(1,1,1)},//groundfloor
            {position: {x:16,y:2,z:13},scale:new Vector3(1,1,1)},//groundfloor
            {position: {x:53,y:2,z:66},scale:new Vector3(1,1,1)},//groundfloor
            {position: {x:71,y:2,z:4},scale:new Vector3(1,1,1)},//groundfloor
            {position: {x:42,y:22,z:35},scale:new Vector3(1,1,1)},//Vip roof
            {position: {x:42,y:22,z:65},scale:new Vector3(1,1,1)},//Vip roof
            {position: {x:57,y:14.5,z:57},scale:new Vector3(1,1,1)},
            {position: {x:70,y:14.5,z:37},scale:new Vector3(1,1,1)},
         
          ]
        }
      }
    ]
  }

 