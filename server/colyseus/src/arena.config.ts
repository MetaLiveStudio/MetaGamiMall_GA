import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";
import { matchMaker } from 'colyseus'
import basicAuth from "express-basic-auth";
import express from 'express';
import path from 'path';
import cors from "cors";

/**
 * Import your Room files
 */
import { PadSurfer } from "./mall_rooms/PadSurfer";
import { PadSurferInfin } from "./mall_rooms/PadSurferInfin";
import { RandomPlacementChaseRoom } from "./mall_rooms/RandomPlacementChaseRoom";
import { RandomPlacementRoom } from "./mall_rooms/RandomPlacementRoom";
import { VoxBoardParkRoom } from "./mall_rooms/VoxBoardParkRoom";
import { RacingRoom } from "./racing_room/RacingRoom";

import { checkMultiplier, CheckMultiplierResultType, fetchWearableData, nftCheckDogeHeadMultiplier, nftCheckMultiplier, nftDogeHeadCheckCall, nftMetaDogeCheckCall } from "./utils/nftCheck";
import { WearablesByOwnerData } from "./racing_room/state/server-state";
import { getLatestStatVersionsAsync, StatVersionCheckResult } from "./utils/playFabCheckDailyStatsStatus";
import { UnifinedScene } from "./mall_rooms/UnifiedSceneRoom";
import { getCoinCap, getLevelFromXp } from "./utils/leveling/levelingUtils";
import { CONFIG } from "./mall_rooms/config";
import { PXRandomSceneRoom } from "./mall_rooms/PXRandomSceneRoom";
import { UnifinedSceneV2 } from "./mall_rooms/UnifiedSceneRoomV2";

const CLASSNAME = "arena.config"


export default Arena({
    getId: () => "Your Colyseus App",

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        //deprecated
        gameServer
            .define('my_room', PadSurfer)
            .filterBy(['playerId']);
        
        //future names
        //level_ufo_elevetors

        //level_pad_surfer
        gameServer
        .define('level_pad_surfer', PadSurfer)
        .filterBy(['playerId']);

        gameServer
        .define('level_pad_surfer_infin', PadSurferInfin)
        .filterBy(['playerId']);

        gameServer
        .define('level_random_ground_float', RandomPlacementRoom)
        .filterBy(['playerId']);
        
        gameServer
        .define('level_random_ground_float_few', RandomPlacementChaseRoom)
        .filterBy(['playerId']);

        gameServer
        .define('vox_board_park', VoxBoardParkRoom)
        .filterBy(['playerId']);

        // Define "state_handler" room
        gameServer.define("racing_room", RacingRoom)
            .filterBy(['env','titleId','raceDataOptions.levelId',"raceDataOptions.maxPlayers","raceDataOptions.customRoomId"])
            .enableRealtimeListing();

        gameServer
          .define('unified_scene', UnifinedScene)
          .filterBy(['playerId']);
        
        gameServer
          .define('unified_scene_v2', UnifinedSceneV2)
          .filterBy(['playerId']);

        gameServer
          .define('px_random_spawn', PXRandomSceneRoom)
          .filterBy(['playerId']);
    },

    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         */
        app.use(cors({
          origin: true //TODO pass a config to control this
        }));
        
        /**
         * Bind your custom express routes here:
         */
         app.get("/", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });
        //health check 
        app.get("/health/live", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });
        //health check 
        app.get("/info", (req, res) => {
          res.send( JSON.stringify( {
            appId: process.env.APP_ID,
            instanceId: process.env.INSTANCE_ID,
            sha: process.env.GIT_SHORT_SHA
            //provider: process.env.PROVIDER,
            //region: process.env.REGION,
          } ) );
        });


        //health check 
        app.get("/memory", (req, res) => {
          res.send( JSON.stringify( {
            appId: process.env.APP_ID,
            instanceId: process.env.INSTANCE_ID,
            memory: (process.memoryUsage())
            //provider: process.env.PROVIDER,
            //region: process.env.REGION,
          } ) );
        });


        //health check 
        app.get("/env", (req, res) => {
            const whiteList:Record<string,string> = {}
            whiteList["stackName"]="y"
            whiteList["environment"]="y"
            whiteList["PROVIDER"]="y"
            whiteList["REGION"]="y"
            whiteList["INSTANCE_ID"]="y"
            whiteList["APP_ID"]="y"
            
            whiteList["cors.origin"]="y"
            whiteList["info_deploy_time"]="y"
            whiteList["info_deploy_timeGMT"]="y"
            
            
          
            const outputMap:Record<string,string> = {}
          
            for(const p in process.env){
              const val = process.env[p]
              outputMap[p] = val !== undefined ? "****" : ""
              
              if(whiteList[p] !== undefined && val !== undefined){
                outputMap[p] = val
              }
            }
          
            res.send(
              {
                body: {
                  config: outputMap
                }
              }
            );
        });

        //serveIndex prevents POST
        //app.use(serveIndex(path.join(__dirname, "static"), {'icons': true}))
        app.use(express.static(path.join(__dirname, "static")));

        const basicAuthMiddleware = basicAuth({
            // list of users and passwords
            users: {
                "admin": process.env.ACL_ADMIN_PW !== undefined ? process.env.ACL_ADMIN_PW : "admin",//YWRtaW46YWRtaW4=
                "metastudio": "admin",//bWV0YXN0dWRpbzphZG1pbg==
            },
            // sends WWW-Authenticate header, which will prompt the user to fill
            // credentials in
            challenge: true
        });

        app.use("/maintenance", basicAuthMiddleware);
        app.use("/announce", basicAuthMiddleware);


        app.post('/maintenance', (req, res) => {
            let jsonContents: {msg:string} = req.body
            console.log("XX",req.query.payload)
            if (req.query.payload && req.query.payload.length !== 0) {
              jsonContents = JSON.parse(req.query.payload as any)
            }
            if (!jsonContents || !jsonContents.msg || jsonContents.msg.length === 0) {
              console.log('maintenance msg incomplete ', jsonContents)
              res.send('maintenance msg incomplete ')
              return
            }
      
            console.log('sending maintenance to rooms ', 
              jsonContents
            )
      
            matchMaker.presence.publish('maintenance', jsonContents)
            res.send('sent maintenance:'+JSON.stringify(jsonContents))
          })
        app.post('/announce', (req, res) => {
            let jsonContents: {msg:string} = req.body
      
            console.log("XX",req.query.payload)
            if (req.query.payload && req.query.payload.length !== 0) {
              jsonContents = JSON.parse(req.query.payload as any)
            }
            if (!jsonContents || !jsonContents.msg || jsonContents.msg.length === 0) {
              console.log('announce msg incomplete ', jsonContents)
              res.send('announce msg incomplete ')
              return
            }
      
            console.log('sending announcement to rooms ', 
              jsonContents
            )
      
            matchMaker.presence.publish('announce', jsonContents)
            res.send('sent announcement:'+JSON.stringify(jsonContents))
          })
          //is check-daily-rollover still used?
        app.get('/check-daily-rollover', async (req, res) => {
          const METHOD_NAME = "/check-daily-rollover"

          matchMaker.presence.publish('daily-roll-over-event', {})
          
          try{
            const result:StatVersionCheckResult= await getLatestStatVersionsAsync()

            console.log(CLASSNAME,METHOD_NAME,"ROLLOVER CHECK - getLatestStatVersionsAsync",result ? result?.result?.StatisticVersions?.length : 'undefined')
            if(result !== undefined && result.result){
              //host.lastStatVersionResult = result
              matchMaker.presence.publish('daily-roll-over-event', result)
            }else{
            //nothing 
            }
            res.send('getLatestStatVersionsAsync:'+JSON.stringify(result))
          }catch(e){
            console.log(CLASSNAME,METHOD_NAME,"ROLLOVER CHECK - getLatestStatVersionsAsync","FAILED!!!",e)
            res.send('getLatestStatVersionsAsync FAILED:'+JSON.stringify(e))
          }
          
        })
        app.get('/check-multiplier', async (req, res) => {
            const METHOD_NAME = "/check-multiplier"
            let address:any = req.query.address
            let version:any = req.query.version
            let userDataStr:any = req.query.userData
      
            if (!address || address.length === 0) {
              console.log('address msg incomplete ', address)
              res.send('{"ok":false,"msg":"invalid address"}')
              return
            }
      
            const promises = []
            const wearablePromise = checkMultiplier("/check-multiplier",version,address,undefined,undefined)
            promises.push(wearablePromise)

            wearablePromise.then((result:CheckMultiplierResultType)=>{
              
              console.log(METHOD_NAME,"checkMultiplier",result)
            })
            
            await Promise.all( promises ).then(function(result){
              console.log(METHOD_NAME,"DONE",result)
              res.send(JSON.stringify(result))

              return result;
            }).catch((e)=>{
              res.send('{"ok":false,"msg":"'+e+'"}')
            })

            
            //res.send('sent announcement:'+JSON.stringify(jsonContents))
          })

        /**
         * Bind @colyseus/monitor
         * It is recommended to protect this route with a password.
         * Read more: https://docs.colyseus.io/tools/monitor/
         */
        app.use("/colyseus", basicAuthMiddleware, monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});

/*
function testXPandCoinCap(){
  let totalCoins = 0

  console.log("testXPandCoinCap")
  console.log("==================")
  
  for(let x=0;x<150;x++){
    totalCoins += x*500
    const level = getLevelFromXp(totalCoins,CONFIG.GAME_LEVELING_FORMULA_CONST)
    const maxCoinsPerLevel = getCoinCap( Math.floor(level),CONFIG.GAME_DAILY_COIN_MAX_FORMULA_CONST)

    console.log("testXPandCoinCap,","coins:\t",totalCoins,"\tlevel:\t",level,"\tmaxCoins:\t",maxCoinsPerLevel)

  }
  
}

testXPandCoinCap()
*/