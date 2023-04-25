import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";
import { matchMaker } from 'colyseus'
import basicAuth from "express-basic-auth";
import express from 'express';
import path from 'path';

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

export default Arena({
    getId: () => "Your Colyseus App",

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        //deprecated
        gameServer
            .define('my_room', PadSurfer)
            .filterBy(['realm','playerId']);
        
        //future names
        //level_ufo_elevetors

        //level_pad_surfer
        gameServer
        .define('level_pad_surfer', PadSurfer)
        .filterBy(['realm','playerId']);

        gameServer
        .define('level_pad_surfer_infin', PadSurferInfin)
        .filterBy(['realm','playerId']);

        gameServer
        .define('level_random_ground_float', RandomPlacementRoom)
        .filterBy(['realm','playerId']);
        
        gameServer
        .define('level_random_ground_float_few', RandomPlacementChaseRoom)
        .filterBy(['realm','playerId']);

        gameServer
        .define('vox_board_park', VoxBoardParkRoom)
        .filterBy(['realm','playerId']);

        // Define "state_handler" room
        gameServer.define("racing_room", RacingRoom)
            .filterBy(['env','titleId','raceDataOptions.levelId',"raceDataOptions.maxPlayers","raceDataOptions.customRoomId"])
            .enableRealtimeListing();

    },

    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         */
        app.get("/", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });

        //serveIndex prevents POST
        //app.use(serveIndex(path.join(__dirname, "static"), {'icons': true}))
        app.use(express.static(path.join(__dirname, "static")));

        const basicAuthMiddleware = basicAuth({
            // list of users and passwords
            users: {
                "admin": process.env.ACL_ADMIN_PW !== undefined ? process.env.ACL_ADMIN_PW : "admin",
                "metastudio": "admin",
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

        app.get('/check-multiplier', async (req, res) => {
            const METHOD_NAME = "/check-multiplier"
            let address:any = req.query.address
      
            if (!address || address.length === 0) {
              console.log('address msg incomplete ', address)
              res.send('{"ok":false,"msg":"invalid address"}')
              return
            }
      
            const promises = []
            const wearablePromise = checkMultiplier("/check-multiplier",address)
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