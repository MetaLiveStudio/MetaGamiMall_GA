import { Room, Client, ServerError } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";
import { CONFIG } from "./config";
import * as OTHER_CONFIG from "../mall_rooms/config";
import { PlayerButtonState, PlayerServerSideData, PlayerState, RaceState, RacingRoomState, TrackFeatureState } from "./state/server-state";
import * as serverStateSpec from "./state/server-state-spec";
import * as PlayFabHelper from "./playfab/PlayFabWrapper";
import * as PlayFabHelperCoin from "../mall_rooms/PlayFabWrapper";
import { LEVEL_MGR } from "./levelData/levelData";
import { nftMetaDogeCheckCall, nftCheckMultiplier, nftDogeHeadCheckCall, nftCheckDogeHeadMultiplier, initPlayerStateNftOwnership, fetchWearableData,  wearablesByOwnerToStringUrlArray, checkMultiplier, CheckMultiplierResultType, getCheckMultiplierVersionNum } from "../utils/nftCheck";
import { BlockTypeTypeConst, Player } from "../mall_rooms/MyRoomState";
import { addMaterialToUser, createAddUserVirtualCurrency } from "../utils/playFabUtils";
import { getCoinCap, getLevelFromXp, getLevelPercentFromXp, getXPDiffBetweenLevels } from "../utils/leveling/levelingUtils";
import { RealmInfo, RewardData, RewardNotification } from "../mall_rooms/MyRoomStateSpec";
import { GetPlayerCombinedInfoResultHelper } from "../utils/playfabGetPlayerCombinedInfoResultHelper";

function logEntry(classname:string,roomId:string,method:string,params?:any){
    console.log(classname,roomId,method," ENTRY",params)
}
function log(classname:string,roomId:string,method:string,msg?:string,...args:any[]){
    console.log(classname,roomId,method,msg,...args)
}

function pickWithinRange(range: number[]) {
    const METHOD_NAME = "pickWithinRange";

    let retVal = 0;

    const max = Math.max(range[0], range[1]);
    const min = Math.min(range[0], range[1]);
    //Math.floor(Math.random() * (max - min + 1) + min)
    const delta = range[1] - range[0];
    retVal = Math.random() * (max - min) + min;

    return retVal;
}

const CLASSNAME = "RacingRoom"
const ENTRY = " ENTRY"
export class RacingRoom extends Room<RacingRoomState> {
    
    maxClients = 8;
    roomCreateTime: number
    clientVersion: number;
    timeSyncLapseTime: number = 0

    protected coinCapEnabled:boolean = false
    protected coinCapOverageReduction:number
  

    //globalOrientation:OrientationType = {alpha:0,beta:0,gamma:0,absolute:true}

    async onCreate (options: any) {
        const METHOD_NAME = "onCreate"
        logEntry(CLASSNAME,this.roomId,METHOD_NAME, options);

        this.roomCreateTime = Date.now()
        this.setSimulationInterval((deltaTime) => this.update(deltaTime));


        //version of client, to know if client ready for activated features or not
        this.clientVersion = options.clientVersion;


        const state = new RacingRoomState()
        state.enrollment.maxPlayers = this.maxClients
        this.setState(state);

        //setup game
        

        // Get secret santa notifications
        this.presence.subscribe('announce', (msg: {msg:string,duration:number}) => {
            console.log('received announce on room ', this.roomId,msg)
            
            this.broadcast("inGameMsg",msg)
        })
        // Get secret santa notifications
        this.presence.subscribe('maintenance', (msg: {msg:string,duration:number}) => {
            console.log('received maintenance on room ', this.roomId,msg)
            
            this.broadcast("notifyMaintenance",msg)
        })
            
        this.onMessage("quit-game",(client: Client, data: any) => {
            console.log("quit-game ",client.sessionId," is quitting, act now");
            //if(CONFIG.LEVEL_COINS_SAVE_STATS_MID_GAME){
            //side affect broadcasts "finished"
            //this.savePlayerData(true);
            this.updatePlayerStats().then((result)=>{
                log(CLASSNAME,this.roomId,METHOD_NAME,"XXXXX endRace all promised completed " , result)
                this.broadcast("ended.roomAboutToDisconnect");
            })
            //}
            //send ack quit? right now savePlayerData side affect will send "finished" like it ended normally
        })
        this.onMessage("levelData.trackFeature.add", (client: Client, trackFeatUpdate: serverStateSpec.TrackFeatureConstructorArgs) => {
            const METHOD_NAME = "levelData.trackFeature.add"
            log(CLASSNAME,this.roomId,METHOD_NAME, "",[client.sessionId,trackFeatUpdate]);

            if(!trackFeatUpdate.name || !trackFeatUpdate.type || !trackFeatUpdate.position){
                log(CLASSNAME,this.roomId,METHOD_NAME, "missing required/invalid field",trackFeatUpdate)
                return
            }
            //find it and update it
            const trackToUpdate = this.state.levelData.trackFeatures.get( trackFeatUpdate.name )

            if(trackToUpdate){
                log(CLASSNAME,this.roomId,METHOD_NAME, "already exists???",trackToUpdate.activateTime,trackFeatUpdate.activateTime)
                //trackToUpdate.activateTime = trackFeatUpdate.activateTime
            }else{
                log(CLASSNAME,this.roomId,METHOD_NAME, "adding",trackFeatUpdate.name)
                const trackFeatState = new TrackFeatureState( trackFeatUpdate )
                //trackFeatState.copyFrom( trackFeatUpdate )
                this.state.levelData.trackFeatures.set(trackFeatUpdate.name, trackFeatState)
            }
        })
        this.onMessage("levelData.trackFeature.update", (client: Client, trackFeatUpdate: serverStateSpec.TrackFeatureConstructorArgs) => {
            const METHOD_NAME = "levelData.trackFeature.update"
            log(CLASSNAME,this.roomId,METHOD_NAME, "",[client.sessionId,trackFeatUpdate]);
            //find it and update it
            const trackToUpdate = this.state.levelData.trackFeatures.get( trackFeatUpdate.name )

            if(trackToUpdate){
                log(CLASSNAME,this.roomId,METHOD_NAME, "updating",trackToUpdate.activateTime,trackFeatUpdate.activateTime)

                
                const player = this.state.players.get(client.sessionId)
                if(player){
                    this.updatePlayerFromTrackFeature( client,player,trackToUpdate )
                }else{
                    log(CLASSNAME,this.roomId,METHOD_NAME, "WARNING cound not find player",client.sessionId)
                }
                

                trackToUpdate.activateTime = trackFeatUpdate.activateTime
            }else{
                log(CLASSNAME,this.roomId,METHOD_NAME, "could not find track to update",trackFeatUpdate.name)
            }
        })
        this.onMessage("player.racingData.update", (client: Client, racingData: serverStateSpec.PlayerRaceDataState) => {
            const METHOD_NAME = "player.racingData.update"
            //log(CLASSNAME,this.roomId,METHOD_NAME, "",[client.sessionId,racingData]);

            const player = this.state.players.get(client.sessionId)
            if(player){
                player.setRacingData(racingData) //replacing entire object as many things can be changing as a set
            }else{
                log(CLASSNAME,this.roomId,METHOD_NAME, "WARNING cound not find player",client.sessionId)
            }
            this.updatePlayerRanks()
            this.checkIsRaceOver()
          });
        
        this.onMessage("player.buttons.update", (client: Client, buttons:serverStateSpec.PlayerButtonState) => {
            const METHOD_NAME = "player.buttons.update"
            //log(CLASSNAME,this.roomId,METHOD_NAME, "",[client.sessionId,buttons]);
    
            const player = this.state.players.get(client.sessionId)
            
            if(player) player.setButtons(buttons) //replacing entire object as many things can be changing as a set
        });
        this.onMessage("player.userData.name.update", (client: Client, name:string) => {
            const METHOD_NAME = "player.userData.name.update"
            log(CLASSNAME,this.roomId,METHOD_NAME, "",[client.sessionId,name]);

            const player = this.state.players.get(client.sessionId)
            player.userData.updateName(name)
            
          });
          //let them pass lots of stuff
        this.onMessage("player.userData.update", (client: Client, playerData:serverStateSpec.PlayerState) => {
            const METHOD_NAME = "player.update"
            log(CLASSNAME,this.roomId,METHOD_NAME, "",[client.sessionId,playerData]);

            const player = this.state.players.get(client.sessionId)
            //player.update(player)
        });
        this.onMessage("enrollment.extendTime", (client: Client, amount?: number) => {
            this.extendEnrollmentTime(amount)
        });
        this.onMessage("race.start", (client: Client) => {
            this.start()
        });

        const racingDataOptions:serverStateSpec.RaceDataOptions = options.raceDataOptions

        // set-up the game!
        await this.setup(racingDataOptions);
    }
    checkIsRaceOver(){
        const METHOD_NAME = "checkIsRaceOver"
        if(!this.state.raceData.hasRaceStarted() || this.state.raceData.isRaceOver()){
            //log(CLASSNAME,this.roomId,METHOD_NAME,"checkIsRaceOver race not started/over",this.state.raceData.status)
            return false
        }
        //(lap + 1) * closestSegId + percentOfSeg }

        let countPlayersDone = 0
        let totalPlayers = 0
        let playersConnected = 0
        let playersGone = 0
        let playersGoneNeverFinished = 0
        //const playerData:PlayerRankingsType[] = []
        this.state.players.forEach(
            (val:PlayerState)=>{
                const playerGoneBln = val.connStatus != 'connected' && val.type == 'racer'
                if (val.racingData.hasFinishedRace()) {
                    countPlayersDone++;
                } else if (playerGoneBln) {
                    playersGoneNeverFinished++;
                }

                if(val.connStatus == 'connected' && val.type == 'racer'){
                    playersConnected ++
                }
                if(playerGoneBln){
                    playersGone ++
                }
                if(val.type == 'racer'){
                    totalPlayers++
                }
            }
        )

        let raceOver = false

        if( totalPlayers <= (countPlayersDone+playersGoneNeverFinished) ){
            log(CLASSNAME,this.roomId,METHOD_NAME,"players done","totalPlayers",totalPlayers
            ,"playersGoneNeverFinished",playersGoneNeverFinished
            ,"playersGone",playersGone,"countPlayersDone",countPlayersDone,"playersConnected",playersConnected
            ,"raceOver",raceOver,"raceData.status",this.state.raceData.status,"raceData.hasRaceStarted()",this.state.raceData.hasRaceStarted()
            ,"raceData.isRaceOver",this.state.raceData.isRaceOver())
                
            this.endRace()
            raceOver = true
        }
        //const playerDataRanked = playerData.sort((n1,n2) => (n1.totalProgress > n2.totalProgress) ? -1 : 1);

        //log(CLASSNAME,this.roomId,METHOD_NAME,"players done",countPlayersDone,playersConnected,raceOver,this.state.raceData.status,this.state.raceData.hasRaceStarted(),this.state.raceData.isRaceOver())
        return raceOver
    }
    updatePlayerRanks() {
        const METHOD_NAME = "updatePlayerRanks"

        
        //(lap + 1) * closestSegId + percentOfSeg }

        type PlayerRankingsType={
            totalProgress:number
            id:string
        }
        const now = Date.now()

        //FIXME consider caching somehow?
        const playerData:PlayerRankingsType[] = []
        
        this.state.players.forEach(
            (val:PlayerState)=>{
                
                const closestSegId = (val.racingData.closestSegmentID !== undefined) ? val.racingData.closestSegmentID: 0
                const percentOfSeg = (val.racingData.closestSegmentPercent !== undefined) ? val.racingData.closestSegmentPercent: 0
                //base 1
                const lap = (val.racingData.lap !== undefined) ? val.racingData.lap: 0

                let totalProg = 0
                
                if(this.state.raceData.hasRaceStarted() && !val.racingData.visitedSegment0 && closestSegId == 0){
                    val.racingData.visitedSegment0 = true
                }
                if(val.racingData.visitedSegment0){
                    val.racingData.lastKnownSegment = closestSegId
                }
                
                if(val.racingData.endTime === undefined || val.racingData.endTime <= 0){
                    //1000000(~16 minutes) must be bigger than the last person to join the race (30 second wait time?)
                    //as we compute start rankings based on that
                    totalProg = (lap*1000000) + closestSegId + percentOfSeg
                }else{
                    //if completed the race use their finish time
                    //so we get valid sorting best lap time (smallest)
                    //will subtrack max val - time.  smaller race time leaves you at a higher overall race time
                    totalProg = 9999999999999 - val.racingData.endTime
                }
                //prevent reranking based on progress when race not started
                if(!val.racingData.visitedSegment0 || (!this.state.raceData.isRaceOver() && !this.state.raceData.hasRaceStarted())){
                    totalProg = val.racingData.enrollTime - this.roomCreateTime
                }

                //build a short term array list to compute player ranks
                playerData.push( {id:val.sessionId,totalProgress: totalProg })

                if( lap > 1 && val.racingData.lastKnownLap != lap){
                    val.racingData.lapTimes.push( now - val.racingData.lastLapStartTime )
                    val.racingData.lastLapStartTime = now
                    val.racingData.lastKnownLap = lap
                }

                //log(CLASSNAME,this.roomId,METHOD_NAME,"",val.userData.name,totalProg,lap,"closestSegId",closestSegId,"val.racingData.visitedSegment0",val.racingData.visitedSegment0,"maxlaps" , this.state.raceData.maxLaps,val.racingData.hasFinishedRace(),val.racingData.endTime)
                if(lap > this.state.raceData.maxLaps && !val.racingData.hasFinishedRace()){
                    //mark race is over for player
                    val.racingData.endTime = now
                    log(CLASSNAME,this.roomId,METHOD_NAME,"player",val.userData.userId,val.userPrivateData.playFabData,"finished the race","lap",lap
                    ,"racingData.lastKnownLap",val.racingData.lastKnownLap
                    ,"val.racingData.lapTimes",val.racingData.lapTimes.toArray()) 
                }


                //log(CLASSNAME,this.roomId,METHOD_NAME,"","lap",lap,"lastKnownLap",val.racingData.lastKnownLap,"lastLapStartTime",val.racingData.lastLapStartTime,"now",now)
            }
        )

        const playerDataRanked = playerData.sort((n1,n2) => (n1.totalProgress > n2.totalProgress) ? -1 : 1);

        //TODO add tiebreaker?  will enforce order based on playerDataRanked array results. do we risk ties and unstable sort order?
        let counter = 1
        for(const p in playerDataRanked){
            const player = playerDataRanked[p]
            this.state.players.get( player.id ).racingData.racePosition = counter
            counter++
        }
        //log(CLASSNAME,this.roomId,METHOD_NAME,"new ranks",playerDataRanked)
    }

    addPlayer(client:Client, options:any) { 
        const METHOD_NAME = "addPlayer"
        logEntry(CLASSNAME,this.roomId,METHOD_NAME, [client.sessionId,options]);

        client.send("hello", "world");
        const player = this.state.createPlayer(client.sessionId);

        //update enrollment status?? 
        //workaround, not sure can trust client time is update enrollment servertime
        if(this.state.enrollment.open){
            this.state.enrollment.serverTime = Date.now()
        }

        player.connStatus = "connected"
        player.type = 'racer'
        if(options.userData){
            log(CLASSNAME,this.roomId,METHOD_NAME, "snapshot", [client.sessionId,options.userData.avatar]);
            if(options.userData.displayName) player.userData.name = options.userData.displayName
            if(options.userData.userId) player.userData.userId = options.userData.userId
            /*if(options.userData.avatar && options.userData.avatar.snapshots){
                log(CLASSNAME,this.roomId,METHOD_NAME, "snapshot", [client.sessionId,options.userData.avatar.snapshots]);
                player.userData.snapshotFace128 = options.userData.avatar.snapshots.face128
            } */
        } 

        //TODO verify on map

        if(this.state.players.size > this.maxClients){
            this.preventNewPlayers()
        }

        return player
    }
    
    async onAuth(client:Client, options:any):Promise<any> { 
        const METHOD_NAME = "onAuth()"
        logEntry(CLASSNAME,this.roomId,METHOD_NAME, [client.sessionId,options]);

        const promises:Promise<any>[] = [];

        const retData:PlayerServerSideData = {playFabData:undefined,coinMultiplier:1}

        let playerState:PlayerState

        const realmInfo:RealmInfo = options.realmInfo
        const userData = options.userData
        const playfabData = options.playFabData

        const userDataForDebug = 
        {
          displayName: userData ? userData.displayName : "",
          publicKey: userData ? userData.publicKey : "",
          hasConnectedWeb3: userData ? userData.hasConnectedWeb3 : "",
          userId: userData ? userData.userId : "",
          version: userData ? userData.version : ""
        }

        let defaultPlayerMultiplier = 1

        if(CONFIG.PLAYFAB_ENABLED){
            if(userData && playfabData && CONFIG.PLAYFAB_TITLEID !== playfabData.titleId){
                log(CLASSNAME,this.roomId,METHOD_NAME," joined with wrong titleId " , CONFIG.PLAYFAB_TITLEID , "vs",playfabData.titleId)
                //this.broadcast("showError",{title:"Error","message":"Joined with wrong title id " +playfabData.titleId + " Expected " + CONFIG.PLAYFAB_TITLEID});
                
                const playFabAuth = new Promise((resolve, reject) => {
                    reject(new ServerError(4401, "Failed to Authenticate Session:" + "Joined with wrong title id " +playfabData.titleId + " Expected " + CONFIG.PLAYFAB_TITLEID))
                    return false
                })
                
                promises.push(playFabAuth)
            }else if(CONFIG.ON_JOIN_REQUIRE_PLAYFAB_DATA_OPTIONS  && (!userData || !playfabData)){
                log(CLASSNAME,this.roomId,METHOD_NAME," joined with no playfab data " , playfabData)
                //this.broadcast("showError",{title:"Error","message":"Joined with wrong title id " +playfabData.titleId + " Expected " + CONFIG.PLAYFAB_TITLEID});
                
                const playFabAuth = new Promise((resolve, reject) => {
                    reject(new ServerError(4401, "Failed to Authenticate Session:" + "Playfab Options Data is required"))
                    return false
                })
                
                promises.push(playFabAuth)
            }else if(userData && playfabData){
                if(playfabData.sessionId){
                    throw new ServerError(4401, "Failed to Authenticate Session")
                }
                const playFabAuth = new Promise((resolve, reject) => {
                    PlayFabHelper.AuthenticateSessionTicket( {"SessionTicket":playfabData.sessionTicket} ).then(
                    (result:PlayFabServerModels.AuthenticateSessionTicketResult)=>{
                        log(CLASSNAME,this.roomId,METHOD_NAME,"PlayFabHelper.AuthenticateSessionTicket.result",result)
                        //TODO set player id to something? wallet? fab id does not seem safe  
                        
                
                
                        if(result && result.IsSessionTicketExpired !== undefined && result.IsSessionTicketExpired === false){
                            const player = this.addPlayer(client,options)
                            playerState = player

                            //const data:PlayerServerSideData = retData// = {sessionId:client.sessionId,playFabData:options.playFabData}
                            //retData.sessionId = client.sessionId
                            retData.playFabData = playfabData
                
                            player.userPrivateData = {
                                playFabData:{id:playfabData.id,sessionTicket:playfabData.sessionTicket}
                                ,coinMultiplier:defaultPlayerMultiplier
                                ,wearables:[]
                                }
                            

                            initPlayerStateNftOwnership(player)
                            
                            log(CLASSNAME,this.roomId,METHOD_NAME,"client.sessionId " + client.sessionId)
                
                            console.log(METHOD_NAME,player.userData.name, "fetching combined data....",);

                            const params = this.createPlayfabCombinedInfoReq(retData.playFabData.id)
                            //NOW LOOKUP STATS FOR BASELINE
                            PlayFabHelper.GetPlayerCombinedInfo( params ).then(
                                (result:PlayFabServerModels.GetPlayerCombinedInfoResult)=>{
                                    //retData.playFabCombinedInfoResult = result
                                    
                                    console.log(METHOD_NAME,player.userData.name, "fetching combined data returned....",result.InfoResultPayload.PlayerStatistics);
                                    
                                    const playerCombinedInfoHelper:GetPlayerCombinedInfoResultHelper = new GetPlayerCombinedInfoResultHelper()
                                    playerCombinedInfoHelper.update(result.InfoResultPayload)


                                    const wearablePromise = checkMultiplier("/check-multiplier",getCheckMultiplierVersionNum(this.clientVersion)
                                        ,userDataForDebug.publicKey ? userDataForDebug.publicKey : userDataForDebug.userId
                                        ,playerCombinedInfoHelper.inventory.bronzeShoe,userData,realmInfo)
                                    promises.push(wearablePromise)

                                    if(userData && userData.userId){
                                        wearablePromise.then((result:CheckMultiplierResultType)=>{
                                            console.log(METHOD_NAME,"checkMultiplier",result)
                                            if(result && result.ok && result.multiplier){
                                                defaultPlayerMultiplier = result.multiplier 
                                                retData.coinMultiplier = defaultPlayerMultiplier
                                            }
                                            console.log(METHOD_NAME,"checkMultiplier",retData.coinMultiplier)
                                        })
                                    }
                            
                                    
                                    let playerStatics = result.InfoResultPayload.PlayerStatistics
                                    let coinCollectingEpochStat:PlayFabServerModels.StatisticValue
                                    let coinCollectingDailyStat:PlayFabServerModels.StatisticValue
                                    if (playerStatics) {
                                        for (const p in playerStatics) {
                                            const stat: PlayFabServerModels.StatisticValue = playerStatics[p];
                                            console.log(METHOD_NAME,"stat ", stat);
                                            if ( stat.StatisticName == "coinsCollectedEpoch" ) {
                                                coinCollectingEpochStat = stat;
                                            }else if ( stat.StatisticName == "coinsCollectedDaily" ) {
                                                coinCollectingDailyStat = stat;
                                            }
                                        }
                                        
                                    }
                                    player.inventory.coinsCollectedEpoch = coinCollectingEpochStat!==undefined ? coinCollectingEpochStat.Value : 0
                                    player.inventory.coinsCollectedDaily = coinCollectingDailyStat!==undefined ? coinCollectingDailyStat.Value : 0
                                    player.inventory.currentLevel = Math.floor(getLevelFromXp(player.inventory.coinsCollectedEpoch,CONFIG.GAME_LEVELING_FORMULA_CONST))
                                    //not map it both ways sessionId and playfabId 
                                    //only map session id, keep it secret? can just loop serverside data object
                                    //this.playerServerSideData[client.sessionId] = retData
                                    //this.playerServerSideData[options.playFabData] = data
                                    
                                    log(CLASSNAME,this.roomId,METHOD_NAME,player.userData.name, "authed! => ", options.realm,userDataForDebug,playfabData);
                            
                                    log(CLASSNAME,this.roomId,METHOD_NAME,player.userData.name, "authed! returning => ", retData);
                            
                                    resolve(retData)
                                }
                            )
                            
                        }else{
                            console.log( "failed to auth player, did not join => ", result, options.realm,userDataForDebug,options.playFabData);
                    
                            //when in onJoin it tells them to leave
                            //4000 range, 401 for unauthorized
                            //client.leave(4401,"Failed to Authenticate Session")
                    
                            reject(new ServerError(4401, "Failed to Authenticate Session"));
                            return false;
                
                        //dispose room?
                        }
                    }
                    ).catch( (reason:any) => {
                        log(CLASSNAME,roomId,METHOD_NAME,"playFabAuth promise FAILED " , reason)
                        //TODO tack on server errors
                        reject(new ServerError(4401, "Failed to Authenticate Session"));
                        return false;
                    })
                })//end promise


                promises.push(playFabAuth)
            }else{
                //add observer???
                log(CLASSNAME,this.roomId,METHOD_NAME,"playing joined but no playfab/dcl data???",CONFIG.PLAYFAB_ENABLED,options)    
                const player = this.addPlayer(client,options)
                playerState = player
                player.userPrivateData = {
                    playFabData:{id:"playfabData.id",sessionTicket:"playfabData.sessionTicket"}
                    ,coinMultiplier:defaultPlayerMultiplier
                    }
            }
        }else{
            log(CLASSNAME,this.roomId,METHOD_NAME,"PlayFab not enabled.  Not authenticating player",options)    
            const player = this.addPlayer(client,options)
            playerState = player
            player.userPrivateData = {
                playFabData:{id:"playfabData.id",sessionTicket:"playfabData.sessionTicket"}
                ,coinMultiplier:defaultPlayerMultiplier
                }
        }
        
        const roomId = this.roomId
        return Promise.all( promises ).then(function(result){
            log(CLASSNAME,roomId,METHOD_NAME,"all promised completed " , result,"playerMultiplier",defaultPlayerMultiplier,"retData.coinMultiplier",retData.coinMultiplier)

            if(playerState !== undefined) playerState.userPrivateData.coinMultiplier = retData.coinMultiplier
            
            return retData;
        }).catch( (reason:any) =>{
            log(CLASSNAME,roomId,METHOD_NAME,"all promised FAILED " , reason)
            if(reason instanceof Error){
                throw reason
            }
            return false;
        } )

        //options.userData.displayName ||
        //return true;
    }

    onJoin(client: Client) {
        const METHOD_NAME = "onJoin()"
        logEntry(CLASSNAME,this.roomId,METHOD_NAME, client.sessionId);


        //this.onJoinSendLevelData(client)
    }

    //not needed, promoted levelData to state
    /*onJoinSendLevelData(client: Client){
        const METHOD_NAME = "onJoinSendLevelData()"
        logEntry(CLASSNAME,this.roomId,METHOD_NAME, client.sessionId);


        const retval:serverStateSpec.LevelDataState = { 
            id: this.state.raceData.id,
            name: this.state.raceData.name,
            trackFeatures: [],
            maxLaps: this.state.raceData.maxLaps,
            trackPath: []
        }

        this.state.levelData.copyTo( retval )

        const initLevelData = retval//JSON.stringify(retval)
        log(CLASSNAME,this.roomId,METHOD_NAME,"sending initLevelData")//,initLevelData)
        client.send("setup.initLevelData",initLevelData)
    }*/

    preventNewPlayers(){
        const METHOD_NAME = "preventNewPlayers()"
        if(!this.state.enrollment.open){
            log(CLASSNAME,this.roomId,METHOD_NAME,"room already locked",this.roomId)    
            return
        }
        log(CLASSNAME,this.roomId,METHOD_NAME,"no more racers allowed",this.roomId)
        this.lock()
        //lock prevents anyone else from joining
        this.state.enrollment.open=false
        this.state.enrollment.endTime = Date.now()
        this.setPrivate(true) //will let you join if u know the room ID
    }


    async onLeave(client: Client, consented: boolean) {
        const METHOD_NAME = "onLeave()"
        logEntry(CLASSNAME,this.roomId,METHOD_NAME, [client.sessionId,consented]);
        
        const player = this.state.players.get(client.sessionId);

        const playerWasCreated = player !== undefined
        /*
        try {
        client.send("onLeave","consented:"+consented) 
        } catch (e) {
        console.log("failed sending onLeave event",player.name,client.sessionId,e)
        }*/
        let removePlayer = this.state.raceData.status == "not-started"

        const waitForReconnect = CONFIG.RECONNECT_WAIT_ENABLED && !consented

        log(CLASSNAME,this.roomId,METHOD_NAME,"waitForReconnect:"+waitForReconnect,"playerWasCreated:"+playerWasCreated)
    
        if (waitForReconnect) {
            if(playerWasCreated) player.connStatus = "reconnecting"
            try {
                log(CLASSNAME,this.roomId,METHOD_NAME, "try for a reconnect!!!", [player.userData.name,this.roomName,this.roomId])
                // allow disconnected client to reconnect into this room until 20 seconds
                await this.allowReconnection(client, CONFIG.RECONNECT_WAIT_TIME);
 
                log(CLASSNAME,this.roomId,METHOD_NAME,"reconnnected!!!", player.userData.name)
                // client returned! let's re-activate it.
                //this.state.players.get(client.sessionId).connected = true;
                removePlayer = false

                if(playerWasCreated) player.connStatus = "connected"
            } catch (e) {
                log(CLASSNAME,this.roomId,METHOD_NAME,"reconnect failed!!!", [player.userData.name, client.sessionId, e])

                if(playerWasCreated) player.connStatus = "lost connection"
                this.checkIsRaceOver()
            }
        }else{
            if(playerWasCreated) player.connStatus = "disconnected"
            this.checkIsRaceOver()
        }

        if (removePlayer) {
            // 20 seconds expired. let's remove the client.
            if (playerWasCreated) {
                this.state.removePlayer(client.sessionId);

                //not removing player because need to rank them at the end
            } else {
                log(CLASSNAME,this.roomId,METHOD_NAME,"already gone? / cound not find " + client.sessionId);
            }
            //this.state.players.delete(client.sessionId);
        }

    }

    createPlayfabCombinedInfoReq(playFabId:string):PlayFabServerModels.GetPlayerCombinedInfoRequest{

        //const playFabId = updateStats.playFabId
        //const now = new Date();
    
        var getPlayerCombinedInfoRequestParams: PlayFabServerModels.GetPlayerCombinedInfoRequestParams = {
          // Whether to get character inventories. Defaults to false.
          GetCharacterInventories: false,
          // Whether to get the list of characters. Defaults to false.
          GetCharacterList: false,
          // Whether to get player profile. Defaults to false. Has no effect for a new player.
          GetPlayerProfile: false,
          // Whether to get player statistics. Defaults to false.
          GetPlayerStatistics: true,
          // Whether to get title data. Defaults to false.
          GetTitleData: false,
          // Whether to get the player's account Info. Defaults to false
          GetUserAccountInfo: false,
          // Whether to get the player's custom data. Defaults to false
          GetUserData: false,
          // Whether to get the player's inventory. Defaults to false
          GetUserInventory: false,
          // Whether to get the player's read only data. Defaults to false
          GetUserReadOnlyData: true,
          // Whether to get the player's virtual currency balances. Defaults to false
          GetUserVirtualCurrency: true,
          // Specific statistics to retrieve. Leave null to get all keys. Has no effect if GetPlayerStatistics is false
          //PlayerStatisticNames?: string[];
          // Specifies the properties to return from the player profile. Defaults to returning the player's display name.
          //ProfileConstraints?: PlayerProfileViewConstraints;
          // Specific keys to search for in the custom data. Leave null to get all keys. Has no effect if GetTitleData is false
          //TitleDataKeys?: string[];
          // Specific keys to search for in the custom data. Leave null to get all keys. Has no effect if GetUserData is false
          //UserDataKeys?: string[];
          // Specific keys to search for in the custom data. Leave null to get all keys. Has no effect if GetUserReadOnlyData is
          // false
          UserReadOnlyDataKeys: ['testReadOnly','coinsCollectedEpoch','coinCollectingEpoch']
        }
        const getPlayerCombinedInfoRequest: PlayFabServerModels.GetPlayerCombinedInfoRequest= {
          // The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.).
          //CustomTags?: { [key: string]: string | null };
          // Flags for which pieces of info to return for the user.
          InfoRequestParameters: getPlayerCombinedInfoRequestParams,
          // PlayFabId of the user whose data will be returned
          PlayFabId: playFabId,
        }
        return getPlayerCombinedInfoRequest
      }
    onDispose() {
        const METHOD_NAME = "onDispose()"
        logEntry(CLASSNAME,this.roomId,METHOD_NAME);

        if(!this.state.raceData.savedPlayerStats){
            //one last rank update
            this.updatePlayerRanks()

            this.updatePlayerStats().then((result)=>{
                log(CLASSNAME,this.roomId,METHOD_NAME,"XXXXX endRace all promised completed " , result)
                this.broadcast("ended.roomAboutToDisconnect");
            })
        }
    }
    doEnrollment(){
        const METHOD_NAME = "doEnrollment()"
        logEntry(CLASSNAME,this.roomId,METHOD_NAME);
        const now = Date.now()
        //i dont know why but seeing precision issues with clock checking.  8 ms off?? 
        //this.state.enrollment.endTime <= now
        const paddingMS = 15
        if(this.state.enrollment.endTime - now < paddingMS){
            log(CLASSNAME,this.roomId,METHOD_NAME,"starting race",this.state.enrollment.endTime , now,(this.state.enrollment.endTime - now),paddingMS)
            //start race
            this.start()
        }else{
            //race not started yet 1655999493364-1655999493356
            log(CLASSNAME,this.roomId,METHOD_NAME,"race not started yet",this.state.enrollment.endTime , now,(this.state.enrollment.endTime - now),paddingMS)
        }
    }
    extendEnrollmentTime(amount?:number){
        const METHOD_NAME = "extendEnrollment"
        logEntry(CLASSNAME,this.roomId,METHOD_NAME,amount);

        if(!this.state.enrollment.open){
            console.log("enrollment is closed")
            return;
        }
        if(!this.state.enrollment.open || this.state.raceData.status != "not-started"){
            console.log("race started cannot extend enrollment")
            return;
        }
            
        this.state.enrollment.endTime += amount && amount > 0 ? amount : CONFIG.MAX_WAIT_TO_START_TIME_MILLIS
        this.state.enrollment.updateServerTime()

        this.startEnrollTimer()
    }
    //GAMELOOP
    update(dt:number){
        //trying without the game loop
        /*
        switch(this.state.raceData.status){
            case "not-started":
                this.doEnrollment()
                break;
            case "started":

                break;

        }*/
    }//END GAMELOOP
    
    endRace(){
        const METHOD_NAME = "endRace()"
        logEntry(CLASSNAME,this.roomId,METHOD_NAME);

        if(this.state.raceData.isRaceOver()){
            log(CLASSNAME,this.roomId,METHOD_NAME,"racing already over, skipping ")
            return
        }
        this.state.raceData.updateServerTime() 
        this.state.raceData.endTime = Date.now()
        this.state.raceData.status = "ended"
        //broadcast to players?

        //one last rank update
        this.updatePlayerRanks()

        this.updatePlayerStats().then((result)=>{
            log(CLASSNAME,this.roomId,METHOD_NAME,"XXXXX endRace all promised completed " , result)
            this.broadcast("ended.roomAboutToDisconnect");
        })
        //this.updatePlayerStats()

        //force terminate connection in X seconds
        
        this.clock.clear();
 
        const waitToCloseTime = 3*1000
        log(CLASSNAME,this.roomId,METHOD_NAME,"will close room in " +waitToCloseTime + " ms")
        //MOVE THIS INTO a game loop if need more than 1 timer?
        this.clock.setTimeout(
            ()=>{
                log(CLASSNAME,this.roomId,METHOD_NAME,"force closing room now ")
                this.disconnect()
            },waitToCloseTime
            )
            
    }
    async updatePlayerStats():Promise<any[]>{
        const METHOD_NAME = "updatePlayerStats()"
        logEntry(CLASSNAME,this.roomId,METHOD_NAME);

        if(this.state.raceData.savedPlayerStats){
            log(CLASSNAME,this.roomId,METHOD_NAME,"updatePlayerStats already calld, not executing again")    
            return
        }
        this.state.raceData.savedPlayerStats = true

        const roomId = this.roomId

        const promises:Promise<any>[] = [];
    
        let loopCount = 0
    
        if(!CONFIG.PLAYFAB_ENABLED){
            log(CLASSNAME,this.roomId,METHOD_NAME,"PlayFab not enabled.  Not saving player stats")    
            return Promise.all( promises ).then(function(result){
                log(CLASSNAME,roomId,METHOD_NAME,"XXXXXX PlayFab not enabled.  Not saving player stats " , result)
                return result;
              })
        }
        this.state.players.forEach((player) => {
            log(CLASSNAME,this.roomId,METHOD_NAME," looping" + loopCount + this.state.players.size)
            //this.state.players.forEach((player) => {
      
            const completedLevel = player.racingData.hasFinishedRace()
            if( !completedLevel ){
                if(!CONFIG.LEVEL_RACING_SAVE_STATS_MID_GAME){
                    log(CLASSNAME,this.roomId,METHOD_NAME," did not finish race, skipping stats" + loopCount, player.userData.name)
                    return
                }else{
                    log(CLASSNAME,this.roomId,METHOD_NAME," did not finish race, but LEVEL_RACING_SAVE_STATS_MID_GAME is true so going to save" + loopCount, player.userData.name)
                }
            }

            //player.id
            const playerData:PlayerState = player

            const playerDebugId =  loopCount + " " + (playerData.userData ? playerData.userData.name : "") + " " + playerData.sessionId
            
            if(!playerData.userPrivateData){
                //warn and continue
                log(CLASSNAME,this.roomId,METHOD_NAME," looping " + loopCount + " " + playerDebugId +  " was missing userPrivateData")
                return
            }
            const playFabId = playerData.userPrivateData.playFabData.id;
            //const player = playerData.clientSide
    
            log(CLASSNAME,this.roomId,METHOD_NAME," looping " + loopCount + " " + playerDebugId + "  "+ playerData)
            if(playerData === undefined){
                log(CLASSNAME,this.roomId,METHOD_NAME," looping " + loopCount + " " + playerDebugId + " was nulll")
              return
            }
      
            const updatePlayerStats: PlayFabHelper.EndLevelUpdatePlayerStatsRequest = {
              playFabId: playFabId,
              totalTime: (playerData.racingData.endTime > -1 && playerData.racingData.endTime !== undefined ) ? (playerData.racingData.endTime - this.state.raceData.startTime) : CONFIG.MAX_POSSIBLE_RACE_TIME,
              lapTimes: playerData.racingData.lapTimes.toArray(),
              //trk_feat_destroyed
              //trackFeaturesDestroyed
              place: playerData.racingData.racePosition,
              levelName: this.state.raceData.name,
              levelId: this.state.raceData.id,
              coinMultiplier: 1,
              inventory: player.inventory,
              completedLevel: completedLevel
              //playerCombinedInfo: getPlayerCombinedInfo
            }
      
            const promise = PlayFabHelper.EndLevelGivePlayerUpdatePlayerStats(updatePlayerStats)
            
            promise.then(function(result:PlayFabHelper.EndLevelUpdatePlayerStatsResult){
                log(CLASSNAME,roomId,METHOD_NAME,"XXXXX updatePlayerStats promise.EndLevelGivePlayerUpdatePlayerStats " + playerDebugId + " " + playerData.sessionId,result);
                //myRoom.authResult = result;
    
                //where to put this?
                //playerData.serverSide.endGameResult = result.endGameResult
                //client.send("announce",'TODO show game finished stats')
            }).catch(function(error:PlayFabServerModels.ModifyUserVirtualCurrencyResult){
                log(CLASSNAME,roomId,METHOD_NAME,"promise.EndLevelGivePlayerUpdatePlayerStats failed",error);
            })

            
            //const promiseCoinWrapper = new Promise( wrapperResolve )
            //promises.push(promiseCoinWrapper)
            promises.push(promise)

            promise.then(()=>{
                const promiseCoins = this.updateCoinStats(player)
                if(promiseCoins !== null){
                    promises.push(promiseCoins)
                }
                //promiseCoins.then((result)=>{
                //    wrapperResolve(result,undefined)
                //})
            })
    
            loopCount++;
          })
    
          log(CLASSNAME,roomId,METHOD_NAME," loopCount" + loopCount )
          
          return Promise.all( promises ).then(function(result){
            log(CLASSNAME,roomId,METHOD_NAME,"XXXXXX all promised completed " , result)
            return result;
          })
    }

    updateCoinStats(player:PlayerState):Promise<any>|null{
        const METHOD_NAME = "updateCoinStats()"
        logEntry(CLASSNAME,this.roomId,METHOD_NAME);

        const completedLevel = player.racingData.hasFinishedRace()
        if( !completedLevel ){
            if(!CONFIG.LEVEL_RACING_SAVE_STATS_MID_GAME){
                log(CLASSNAME,this.roomId,METHOD_NAME," did not finish race, skipping" + player.userData.name)
                return null;
            }else{
                log(CLASSNAME,this.roomId,METHOD_NAME," did not finish race, but LEVEL_RACING_SAVE_STATS_MID_GAME is true so going to save" , player.userData.name)
            }
        }
        const playerData = player
        const playFabId = playerData.userPrivateData.playFabData.id;

       
        
        var addGCPlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.GC.symbol,player.inventory.coinGcCount )
        var addMCPlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.MC.symbol,player.inventory.coinMcCount )
        
        var addVBPlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.VB.symbol,0 )
        var addACPlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.AC.symbol,0 )
        var addZCPlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.ZC.symbol,0 )
        var addRCPlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.RC.symbol,0 )

        var addGCRewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.GC.symbol, this.sumRewards(player.inventory.rewards,BlockTypeTypeConst.GC.symbol) )
        var addMCRewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.MC.symbol, this.sumRewards(player.inventory.rewards,BlockTypeTypeConst.MC.symbol) )
        
        var addVBRewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.VB.symbol, this.sumRewards(player.inventory.rewards,BlockTypeTypeConst.VB.symbol) )
        var addACRewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.AC.symbol, this.sumRewards(player.inventory.rewards,BlockTypeTypeConst.AC.symbol) )
        var addZCRewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.ZC.symbol, this.sumRewards(player.inventory.rewards,BlockTypeTypeConst.ZC.symbol) )
        var addRCRewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.RC.symbol, this.sumRewards(player.inventory.rewards,BlockTypeTypeConst.RC.symbol) )
        
        var addBZPlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.BZ.symbol,player.inventory.bronzeCollected )
        var addNIPlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.NI.symbol,player.inventory.nitroCollected )
        var addBPPlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.BP.symbol,player.inventory.petroCollected )
        var addR1PlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.R1.symbol,player.inventory.rock1Collected )
        var addR2PlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.R2.symbol,player.inventory.rock2Collected )
        var addR3PlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.R3.symbol,player.inventory.rock3Collected )

        var addBZRewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.BZ.symbol, this.sumRewards(player.inventory.rewards,BlockTypeTypeConst.BZ.symbol) )
        var addNIRewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.NI.symbol, this.sumRewards(player.inventory.rewards,BlockTypeTypeConst.NI.symbol) )
        var addBPRewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.BP.symbol, this.sumRewards(player.inventory.rewards,BlockTypeTypeConst.BP.symbol) )
        var addR1RewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.R1.symbol, this.sumRewards(player.inventory.rewards,BlockTypeTypeConst.R1.symbol) )
        var addR2RewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.R2.symbol, this.sumRewards(player.inventory.rewards,BlockTypeTypeConst.R2.symbol) )
        var addR3RewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.R3.symbol, this.sumRewards(player.inventory.rewards,BlockTypeTypeConst.R3.symbol) )
        
        
        var grantMaterial1: PlayFabServerModels.GrantItemsToUserRequest = { ItemIds: [], PlayFabId: playFabId }
        var grantMaterial2: PlayFabServerModels.GrantItemsToUserRequest = { ItemIds: [], PlayFabId: playFabId }
        var grantMaterial3: PlayFabServerModels.GrantItemsToUserRequest = { ItemIds: [], PlayFabId: playFabId }
        var grantBronzeShoe1: PlayFabServerModels.GrantItemsToUserRequest = { ItemIds: [], PlayFabId: playFabId }

        addMaterialToUser( grantMaterial1,BlockTypeTypeConst.M1,player.inventory.material1Count )
        addMaterialToUser( grantMaterial2,BlockTypeTypeConst.M2,player.inventory.material2Count )
        addMaterialToUser( grantMaterial3,BlockTypeTypeConst.M3,player.inventory.material3Count )

        addMaterialToUser( grantBronzeShoe1,BlockTypeTypeConst.BRONZE_SHOE1,0 )
        //this.addMaterialToUser( grantMaterials,BlockTypeTypeConst.C1,player.container1Count )
        
        var addGuestPlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest= { 
          Amount: 0,
          PlayFabId: playFabId,
          // Name of the virtual currency which is to be incremented.
          VirtualCurrency: ''
        }

        var updatePlayerStats: PlayFabHelperCoin.EndLevelUpdatePlayerStatsRequest = {
          playFabId: playFabId,
          coinMultiplier: playerData.userPrivateData && playerData.userPrivateData.coinMultiplier ? playerData.userPrivateData.coinMultiplier : 1,
          addGCCurrency: addGCPlayerCurrency,
          addMCCurrency: addMCPlayerCurrency,
          addVBCurrency: addVBPlayerCurrency,
          addACCurrency: addACPlayerCurrency,
          addZCCurrency: addZCPlayerCurrency,
          addRCCurrency: addRCPlayerCurrency,
          addR1Currency: addR1PlayerCurrency,
          addR2Currency: addR2PlayerCurrency,
          addR3Currency: addR3PlayerCurrency,
          addBZCurrency: addBZPlayerCurrency,
          addNICurrency: addNIPlayerCurrency,
          addBPCurrency: addBPPlayerCurrency,
          addGCRewardCurrency: addGCRewardCurrency,
          addMCRewardCurrency: addMCRewardCurrency,
          addVBRewardCurrency: addVBRewardCurrency,
          addACRewardCurrency: addACRewardCurrency,
          addZCRewardCurrency: addZCRewardCurrency,
          addRCRewardCurrency: addRCRewardCurrency,
          addR1RewardCurrency: addR1RewardCurrency,
          addR2RewardCurrency: addR2RewardCurrency,
          addR3RewardCurrency: addR3RewardCurrency,
          addNIRewardCurrency: addNIRewardCurrency,
          addBZRewardCurrency: addBZRewardCurrency,
          addBPRewardCurrency: addBPRewardCurrency,

          grantMaterial1: grantMaterial1,
          grantMaterial2: grantMaterial2,
          grantMaterial3: grantMaterial3,

          grantBronzeShoe: grantBronzeShoe1,

          addGuestCurrency: addGuestPlayerCurrency,
          //playerCombinedInfo: getPlayerCombinedInfo
                    
          addStatRaffleCoinBag: undefined,
          grantTicketRaffleCoinBag: undefined

        }
  
        const promise = PlayFabHelperCoin.EndLevelGivePlayerUpdatePlayerStats(updatePlayerStats)
        
        const roomId = this.roomId
        //const guestCoinType = this.guestCoinType
        promise.then((result:PlayFabHelperCoin.EndLevelUpdatePlayerStatsResult)=>{
            console.log("XXXXX updatePlayerStats promise.EndLevelGivePlayerUpdatePlayerStats "  + " " + player.id,result);
            log(CLASSNAME,roomId,METHOD_NAME,"XXXXX updatePlayerStats promise.EndLevelGivePlayerUpdatePlayerStats "  + " " + player.id,result)
            //myRoom.authResult = result;


            //playerData.serverSide.endGameResult = result.endGameResult
            //client.send("announce",'TODO show game finished stats')
        }).catch(function(error:PlayFabServerModels.ModifyUserVirtualCurrencyResult){
          console.log("promise.EndLevelGivePlayerUpdatePlayerStats failed",error);
          log(CLASSNAME,roomId,METHOD_NAME,"promise.EndLevelGivePlayerUpdatePlayerStats failed",error)
        })

        return promise
    }
        
    sumRewards(rewards: RewardNotification[], symbol: string): number {
        
        let sum = 0
        for(const p in rewards){
        
        const itm = rewards[p]
        if(itm.rewards === undefined){
            continue;
        }
        for(const p in itm.rewards){
            const rwd = itm.rewards[p]
            if(rwd.id == symbol){
            sum += rwd.amount
            }
            /*
            switch(itm.id){
            //WILL BE COUNTED TOWARDS COLLECTED, move to reward bonus
            case CONFIG.GAME_COIN_TYPE_GC:
                //player.coinGcCount += itm.amount
                player.coinGcRewards += itm.amount
                break;
            case CONFIG.GAME_COIN_TYPE_MC:
                //player.coinMcCount += itm.amount
                player.coinMcRewards += itm.amount
                break;
            default:
                console.log("onPlayerLeveledUp",  player.id , player.name , " WARNING !!! unhandled reward type:" , itm);
            }*/
        }
        }
        log("sumRewards",symbol,"sum",sum.toFixed(0))
        return sum
    }
    //clock loop update, 1 second
    clockIntervalUpdate(elapsedTime:number,dt:number){
        const METHOD_NAME = "clockIntervalUpdate"
        //log(CLASSNAME,this.roomId,METHOD_NAME,"elapsedTime",elapsedTime.toFixed(2),"dt",dt,"this.timeSyncLapseTime",this.timeSyncLapseTime)
        //noop
        this.timeSyncLapseTime += dt

        //update every 10 seconds good?
        if(this.timeSyncLapseTime > 10000 ){
            this.timeSyncLapseTime = 0
            this.state.playFabTime += dt
            this.state.serverTime += dt
        }

    }
    start(){
        const METHOD_NAME = "start()"
        logEntry(CLASSNAME,this.roomId,METHOD_NAME)

        if(this.state.raceData.status == "started"){
            log(CLASSNAME,this.roomId,METHOD_NAME,"already started!!!!")
            return;
        }
        if(this.state.raceData.status == "ended"){
            log(CLASSNAME,this.roomId,METHOD_NAME,"race is over, cannot start again")
            return;
        }
        this.preventNewPlayers()

        this.clock.clear();
 
        this.state.raceData.status = "starting"
        this.state.raceData.updateServerTime()
        this.state.raceData.startTime = Date.now() + CONFIG.STARTING_COUNTDOWN_TIME_MILLIS

        log(CLASSNAME,this.roomId,METHOD_NAME,"setting new clock timeout to start")

        //init lap start times
        this.state.players.forEach(
            (val:PlayerState)=>{
                log(CLASSNAME,this.roomId,METHOD_NAME,"setting first lap start time",this.state.raceData.startTime)
                val.racingData.lastLapStartTime = this.state.raceData.startTime
            }
        )

        //MOVE THIS INTO a game loop if need more than 1 timer?
        this.clock.setTimeout(()=>{
            this.state.raceData.status = "started"

            //MOVE THIS INTO a game loop if need more than 1 timer?
            this.clock.setTimeout(()=>{
                this.endRace()
            },CONFIG.MAX_GAME_TIME_MILLIS)

        }, CONFIG.STARTING_COUNTDOWN_TIME_MILLIS)
        
        this.clock.setInterval(() => {
        
            this.clockIntervalUpdate(this.clock.elapsedTime,this.clock.deltaTime+1000)
    
          }, 1000);
        
    }
    startEnrollTimer(){
        const METHOD_NAME = "startEnrollTimer"
        logEntry(CLASSNAME,this.roomId,METHOD_NAME)
    
        // make sure we clear previous interval
        this.clock.clear();

        this.clock.setTimeout(()=>{
            log(CLASSNAME,this.roomId,METHOD_NAME,"calling doEnrollment/start")
            this.doEnrollment()
        },this.state.enrollment.endTime - Date.now())
    }

    getCurrentTime(){
        return this.clock.currentTime
    }
    
    async setup(raceDataOptions:serverStateSpec.RaceDataOptions){
        const METHOD_NAME = "setup()"
        logEntry(CLASSNAME,this.roomId,METHOD_NAME,raceDataOptions)

        // setup round countdown
        //this.state.countdown = this.levelDuration;
    
        PlayFabHelper.GetTime({}).then((val:PlayFabServerModels.GetTimeResult)=>{
            log(CLASSNAME,this.roomId,"PlayFabHelper.GetTime"," result",val)
        
            this.state.serverTime = this.getCurrentTime()
            this.state.playFabTime = Date.parse( val.Time )
        
            log(CLASSNAME,this.roomId,"PlayFabHelper.GetTime"," result",val,new Date(this.state.playFabTime).toUTCString())
        })

        //drives coin distribution logic
        //minable reward logic
        await this.fetchAndStoreRemoteConfig()
  

        // make sure we clear previous interval
        this.clock.clear();
    
        //log("pausing for a few seconds to give sdk time to place items")
        //set timer to start

        this.setupRaceTrack(raceDataOptions)
        

        const now = Date.now()
        this.state.enrollment.startTime = now

        this.state.enrollment.endTime = now + CONFIG.MAX_WAIT_TO_START_TIME_MILLIS
        this.state.enrollment.updateServerTime()

        this.startEnrollTimer()
    }

    setupRaceTrack(raceDataOptions:serverStateSpec.RaceDataOptions){
        const METHOD_NAME = "setupRaceTrack()"
        logEntry(CLASSNAME,this.roomId,METHOD_NAME,raceDataOptions)

        if(raceDataOptions){
            this.state.raceData.id = raceDataOptions.levelId
            this.state.levelData.id = raceDataOptions.levelId
            this.state.levelData._featureDef =
                raceDataOptions.featureDefinition !== undefined
                    ? raceDataOptions.featureDefinition
                    : {
                        features: [
                            { type: "boost", enabled:true }, { type: "slow-down",enabled:true },
                            { type: "coin-gc" ,spawnAmount: [3,5], spawnPercentage: [.7,.9] ,enabled:true}, 
                            { type: "coin-gc" ,spawnAmount: [3,5], spawnPercentage: [.7,.9] ,enabled:true}, //add multi times for more weight
                            { type: "coin-gc" ,spawnAmount: [3,5], spawnPercentage: [.7,.9] ,enabled:true}, //add multi times for more weight
                            { type: "coin-mc" ,enabled:true } //default values when not passed
                        ] 
                    };
            //TODO WIRE THIS INTO TRACK DATA TO BROADCAST BACK BEFORE START!
            if(raceDataOptions.levelId == 'custom'){
                if(raceDataOptions.name) this.state.raceData.name = raceDataOptions.name
                if(raceDataOptions.maxLaps) this.state.raceData.maxLaps = raceDataOptions.maxLaps
                //if(raceDataOptions.maxPlayers) this.state.raceData.m = raceDataOptions.maxPlayers
            }else{
                const level = LEVEL_MGR.getLevel( raceDataOptions.levelId )
                if(level !== undefined){
                    //loop up from table
                    if(level.name){
                        this.state.raceData.name = level.name
                    }else{
                        this.state.raceData.name = raceDataOptions.levelId + " name not set"
                    }
                }else{
                    log(CLASSNAME,this.roomId,METHOD_NAME,"WARNING level not found ",raceDataOptions.levelId,raceDataOptions)
                    //this.state.raceData.name = "TODO pull race config from server file"
                    this.state.raceData.name = "track id: " + raceDataOptions.levelId + " not recognized"
                }
            }
        }else{
            log(CLASSNAME,this.roomId,METHOD_NAME,"WARNING raceDataOptions not provided!!!! ",raceDataOptions)
            this.state.raceData.name = "Unnamed Track"
        }
        
        const trackFeatures = this.setupRaceTrackFeatures()


        const retval:serverStateSpec.LevelDataState = { 
            id: this.state.raceData.id,
            name: this.state.raceData.name,
            trackFeatures: new Map(),
            localTrackFeatures: trackFeatures,
            maxLaps: this.state.raceData.maxLaps,
            trackPath: []
        }

        this.state.levelData.copyFrom( retval )

        //this.state.levelData = retval

        //TODO higher level logging return 'retval' itself
        log(CLASSNAME,this.roomId,METHOD_NAME,"created level")
    }
    setupRaceTrackFeatures(){
        const METHOD_NAME = "setupRaceTrackFeatures()"
        logEntry(CLASSNAME,this.roomId,METHOD_NAME)
        
        //TODO FIXME pull data from track ID

        const featureDef = this.state.levelData._featureDef;
        
        if(!featureDef){
            log(CLASSNAME, this.roomId, METHOD_NAME, "WARNING featureDef missing", featureDef);
            return
        }
        
        const featuresEnabledTypeArray:serverStateSpec.TrackFeatureType[] = []
        const featuresEnabledMapByType: Map<serverStateSpec.TrackFeatureType,serverStateSpec.TrackFeatureInstDef> = new Map()
        for (const itm of featureDef.features) {
            log(CLASSNAME, this.roomId, METHOD_NAME, "featuresEnabled.itm", itm);
            if (itm.enabled !== undefined && itm.enabled) {
                featuresEnabledMapByType.set(itm.type, itm);
                //TODO add weighted, push it multiple times???
                featuresEnabledTypeArray.push(itm.type)//TODO dedoup?? but not while using for weighted picking
            }
        }

        //by not passing triggersize and shape, it allows current theme to define them
        const numSegements = 200 //FIXME //level1.trackPath.length
        const keepStartClear = 1
        const featureTypesCnt = featuresEnabledMapByType.size //CONFIG.TRACK_FEATURE_TYPE_COUNT //
        //featureTrackDensity: bigger the number, less dense it will be, 1 will be 1 segement
        const featureTrackDensity =
            featureDef.featureDensity !== undefined ? featureDef.featureDensity : featureTypesCnt + 5; 
        //let spawnAmount = 2 //1 for 1.  2 for more if reaches the value randomly
        const maxOffset = 2
        const maxCloseness = .3

        const _featureDensitiy = Math.max(featureTypesCnt,featureTrackDensity)
        let totalSpawned = 0
        let attemptedSpawned = 0


        let lastSpawnedOffset = 99
        let lastCenterOffset = 99

        const debugTrackFeat = false

        const trackFeatures:serverStateSpec.TrackFeatureConstructorArgs[] = []


        log(CLASSNAME,this.roomId,METHOD_NAME,"featureTypes",featureTypesCnt,"featuresEnabledTypeArray",featuresEnabledTypeArray)

        if (CONFIG.DEBUG_HARCODED_TRACK_FEATURE_TESTING_ENABLED) {
            //for quick testing could spawn some at very beginning
            trackFeatures.push( {name:"test.1",type:"boost", position:new serverStateSpec.TrackFeaturePosition({startSegment:2,endSegment:1, centerOffset:1}) } )
            trackFeatures.push( {name:"test.2a",type:"slow-down", position:new serverStateSpec.TrackFeaturePosition({startSegment:2,endSegment:1, centerOffset:-1}) } )
            if(featuresEnabledMapByType.has('coin-gc')) trackFeatures.push( {name:"test.2.5",type:"coin-gc", position:new serverStateSpec.TrackFeaturePosition({startSegment:2.5,endSegment:1, centerOffset:-1}) } )
            if(featuresEnabledMapByType.has('coin-mc')) trackFeatures.push( {name:"test.3",type:"coin-mc", position:new serverStateSpec.TrackFeaturePosition({startSegment:3,endSegment:1, centerOffset:-1}) } )


            trackFeatures.push( {name:"test.-1",type:"boost", position:new serverStateSpec.TrackFeaturePosition({startSegment:175,endSegment:1, centerOffset:1}) } )
            trackFeatures.push( {name:"test.-2",type:"slow-down", position:new serverStateSpec.TrackFeaturePosition({startSegment:175,endSegment:1, centerOffset:-1}) } )

            if(featuresEnabledMapByType.has('coin-bp')) trackFeatures.push( {name:"test.coin-bp",type:"coin-bp", position:new serverStateSpec.TrackFeaturePosition({startSegment:2.5,endSegment:1, centerOffset:1}) } )
            if(featuresEnabledMapByType.has('coin-ni')) trackFeatures.push( {name:"test.coin-ni",type:"coin-ni", position:new serverStateSpec.TrackFeaturePosition({startSegment:3,endSegment:1, centerOffset:1}) } )
        }
        log(CLASSNAME,this.roomId,METHOD_NAME,"featureTypes",featureTypesCnt,"CONFIG.DEBUG_HARCODED_TRACK_FEATURE_TESTING_ENABLED",CONFIG.DEBUG_HARCODED_TRACK_FEATURE_TESTING_ENABLED,"trackFeatures",trackFeatures)

        for(let x = keepStartClear ; x< numSegements - keepStartClear ; x++){
            //dont put stuff in near beginning or end
            const randomType = Math.floor(Math.random() * _featureDensitiy)
            let type:serverStateSpec.TrackFeatureType=undefined
            let spawnAmount = 2
            let spawnPercentage = .5

            let segmentFeatureDef:serverStateSpec.TrackFeatureInstDef|undefined = undefined

            /*
            switch(randomType){
                case 0: //boost
                    featureDef = featuresEnabledMapByType.get("boost")
                break;
                case 1: //slowdown
                    featureDef = featuresEnabledMapByType.get("slow-down")
                    break;
                case 2: //gc
                    spawnAmount = 3
                    spawnPercentage = .9
                    
                    featureDef = featuresEnabledMapByType.get("coin-gc")
                break;
                case 3: //gc
                    spawnAmount = 4
                    spawnPercentage = .7
                    featureDef = featuresEnabledMapByType.get("coin-gc")
                    break;
                case 4: //gc
                case 5: //gc
                    spawnAmount = 5
                    spawnPercentage = .7
                    featureDef = featuresEnabledMapByType.get("coin-gc")
                    break;
                case 6: //mc 
                    featureDef = featuresEnabledMapByType.get("coin-mc")
                    break;
                case 7: //petro 
                    featureDef = featuresEnabledMapByType.get("coin-bp")
                    break;
                case 8: //nitro 
                    featureDef = featuresEnabledMapByType.get("coin-ni")
                    break;
            }*/
            
            if (randomType < featuresEnabledTypeArray.length) {
                segmentFeatureDef = featuresEnabledMapByType.get( featuresEnabledTypeArray[randomType] );
                if (segmentFeatureDef === undefined || (segmentFeatureDef.enabled !== undefined && !segmentFeatureDef.enabled)) {
                    if (debugTrackFeat)
                        log(
                            CLASSNAME, this.roomId, METHOD_NAME,
                            "spawn type not enabled", randomType, "not enabled", segmentFeatureDef
                        );
                }else{
                    type = segmentFeatureDef.type
                }
            } else {
                if (segmentFeatureDef)
                    log(CLASSNAME, this.roomId, METHOD_NAME, "out of bounds", randomType, "not enabled", segmentFeatureDef);
            }

            spawnPercentage = segmentFeatureDef !== undefined && segmentFeatureDef.spawnPercentage !== undefined ? pickWithinRange(segmentFeatureDef.spawnPercentage) : spawnPercentage

            const spawnIt = Math.random() < spawnPercentage
            

            //log(CLASSNAME, this.roomId, METHOD_NAME, "randomType", randomType, "type", type);


            if(spawnIt && type !== undefined){
                type = segmentFeatureDef.type
                spawnAmount = segmentFeatureDef.spawnAmount !== undefined ?  Math.floor(pickWithinRange(segmentFeatureDef.spawnAmount)) : spawnAmount
                

                attemptedSpawned++
                const spawnCount = Math.max(1,Math.round(Math.random() * spawnAmount))

                //must keep track of last spawned
                
                let spawnCnt = 0
                while(spawnCnt<spawnCount){
                    //TODO prevent overlap
                    //take full offset then subtract half to get somewhere in the middle
                    const centerOffset = (Math.random() * maxOffset*2) - maxOffset
                    const xOffset = x + Math.random()
                    //too close, try again
                    if(Math.abs(xOffset - lastSpawnedOffset) < maxCloseness && Math.abs(centerOffset - lastCenterOffset) < maxCloseness){
                        log(CLASSNAME,this.roomId,METHOD_NAME,"adding addTrackFeature  too close try again",type,x+"",spawnIt+"",xOffset , lastSpawnedOffset , centerOffset , lastCenterOffset)
                        continue;
                    }
                    
                    //log(CLASSNAME,this.roomId,METHOD_NAME,"adding addTrackFeature ",type,x,spawnIt)
                    //level1.addTrackFeature( new TrackFeature( {name:type+"-"+spawnCnt+"."+xOffset.toFixed(1),type:type,triggerSize:undefined,shape:undefined, position:new TrackFeaturePosition({startSegment:xOffset,endSegment:xOffset, centerOffset:centerOffset, offset: new Vector3(0,0,0)}) } ))

                    trackFeatures.push( {name:type+"-"+spawnCnt+"."+xOffset.toFixed(1),type:type, position:new serverStateSpec.TrackFeaturePosition({startSegment:xOffset,endSegment:xOffset, centerOffset:centerOffset}) } )

                    totalSpawned++
                    spawnCnt++
                    lastSpawnedOffset = xOffset
                    lastCenterOffset = centerOffset
                }
            }else{
                //log("nospawn addTrackFeature ",type,x,spawnIt)
            }
            
        }
        log(CLASSNAME,this.roomId,METHOD_NAME,"results ",numSegements.toFixed(0),totalSpawned.toFixed(0),attemptedSpawned.toFixed(0))

        return trackFeatures
    }
    updatePlayerFromTrackFeature(client:Client,player:PlayerState,trackFeature:serverStateSpec.ITrackFeatureState){
        const METHOD_NAME = "updatePlayerFromTrackFeature()"
        logEntry(CLASSNAME,this.roomId,METHOD_NAME)
        
        if(trackFeature.activateTime < Date.now()){
            log(CLASSNAME,this.roomId,METHOD_NAME,"not active ",trackFeature)
            return;
        }

        //export type TrackFeatureType='boost'|'slow-down'|'inert'|'wall'|'coin-gc'|'coin-mc'|'material-a'
        
        const maxCoinsPerLevel = getCoinCap( Math.floor(player.inventory.currentLevel),CONFIG.GAME_DAILY_COIN_MAX_FORMULA_CONST)
        
        //this.state.playFabTime
        //this.state.levelData.coinsCollectedDailyVersion
        /*if(this.coinCapEnabled){
        player.coinCollectDailyCapPercent = player.coinsCollectedDaily / maxCoinsPerLevel
        }else{
        player.coinCollectDailyCapPercent = -1
        }*/
        
        const hitCoinCap = player.inventory.coinsCollectedDaily >= maxCoinsPerLevel //player.coinCollectDailyCapPercent >= 1
        //set it to .1 if its every 10 == 1
        const coinCapOverageReduction = hitCoinCap ? this.coinCapOverageReduction : 1
        
        const incValue = 1 * coinCapOverageReduction

        switch(trackFeature.type){
            case 'coin-gc':
                player.inventory.coinGcCount+=incValue
                player.inventory.coinsCollectedEpoch+=incValue
                player.inventory.coinsCollectedDaily+=incValue
                break;
            case 'coin-mc': 
                player.inventory.coinMcCount+=incValue
                player.inventory.coinsCollectedEpoch+=incValue
                player.inventory.coinsCollectedDaily+=incValue
                break;
            case 'coin-bp': 
                //player.inventory.coinsCollectedEpoch++
                player.inventory.petroCollected++
                break;
            case 'coin-bz': 
                //player.inventory.coinsCollectedEpoch+=incValue
                player.inventory.bronzeCollected+=incValue
                player.inventory.coinsCollectedEpoch+=incValue
                player.inventory.coinsCollectedDaily+=incValue
                break;
            case 'coin-ni': 
                //player.inventory.coinsCollectedEpoch++
                player.inventory.nitroCollected++
                break;
            case 'coin-r1': 
                //player.inventory.coinsCollectedEpoch++
                player.inventory.rock1Collected++
                break;
            case 'coin-r2': 
                //player.inventory.coinsCollectedEpoch++
                player.inventory.rock2Collected++
                break;
            case 'coin-r3': 
                //player.inventory.coinsCollectedEpoch++
                player.inventory.rock3Collected++
                break;
            case 'material-a':
                player.inventory.material1Count++
                break;
            default:

        }

        

        //check rewards
        
        let levelRecalced = Math.floor(getLevelFromXp(player.inventory.coinsCollectedEpoch,CONFIG.GAME_LEVELING_FORMULA_CONST))

        const TESTING = false
        const leveledUp = 
        !TESTING ? levelRecalced != player.inventory.currentLevel
            : player.inventory.coinsCollected % 5 == 0 //testing is ever 5 level up
        if(TESTING && leveledUp){
            levelRecalced++
        }
        console.log("collectBlock",  player.id , player.userData.name 
            ,"player.coinsCollectedEpoch",player.inventory.coinsCollectedEpoch
            ,"player.coinsCollectedDaily",player.inventory.coinsCollectedDaily
            ,"coinCapEnabled",this.coinCapEnabled
            ,"hitCoinCap",hitCoinCap
            ,"maxCoinsPerLevel",maxCoinsPerLevel
            ,"coinCapOverageReduction",coinCapOverageReduction
            ,"level",levelRecalced,"vs",player.inventory.currentLevel
            ,"lvl.percent",getLevelPercentFromXp(player.inventory.coinsCollectedEpoch,CONFIG.GAME_LEVELING_FORMULA_CONST).toFixed(2), leveledUp ? "LEVELED UP!!!!":"");


        
        if(leveledUp){
            //send message with rewards
            this.onPlayerLeveledUp(client,player,levelRecalced)
        }
        log(CLASSNAME,this.roomId,METHOD_NAME,"player inventory ",player.inventory.coinGcCount,player.inventory.coinMcCount)


    }

  onPlayerLeveledUp(client:Client,player:PlayerState,newVal:number){
    console.log("onPlayerLeveledUp",newVal)
    console.log("onPlayerLeveledUp",newVal)
    console.log("onPlayerLeveledUp",newVal)
    player.inventory.currentLevel = newVal
    //player.lastLevelUpTime = now
    //player.currentLevel = levelRecalced

    //TODO sync with scene
    //export type NFTUIDataPriceType='VirtualCurrency'|'Material'

    //need reward look up table

    //going to use the diff as the reward value for now
    let diff = 0

    if(newVal > 0){
      diff = getXPDiffBetweenLevels(newVal-1,newVal,CONFIG.GAME_LEVELING_FORMULA_CONST)
    }

    const levelUpRewards:RewardData[] = [
      { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: Math.floor(diff*CONFIG.LEVEL_UP_REWARD_PERCENT_GC) },
      { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: Math.floor(diff*CONFIG.LEVEL_UP_REWARD_PERCENT_MC)}
    ]

    const notifyLevelUp:RewardNotification = {
      rewardType:"level-up",
      newLevel: newVal,
      rewards: levelUpRewards
    }
    if(player.inventory.rewards === undefined ) player.inventory.rewards = []
    player.inventory.rewards.push(notifyLevelUp)

    console.log("onPlayerLeveledUp",  player.id , player.userData.name , " earned:" , levelUpRewards);
    //if(player.inventory.currentSavePoint.rewards === undefined ) player.inventory.currentSavePoint.rewards = []
    //player.inventory.currentSavePoint.rewards.push(notifyLevelUp)
    /*
    for(const p in levelUpRewards){
      
      const itm = levelUpRewards[p]
      
      switch(itm.id){
        //WILL BE COUNTED TOWARDS COLLECTED, move to reward bonus
        case CONFIG.GAME_COIN_TYPE_GC:
          //player.coinGcCount += itm.amount
          player.coinGcRewards += itm.amount
          break;
        case CONFIG.GAME_COIN_TYPE_MC:
          //player.coinMcCount += itm.amount
          player.coinMcRewards += itm.amount
          break;
        default:
          console.log("onPlayerLeveledUp",  player.id , player.name , " WARNING !!! unhandled reward type:" , itm);
      }
    }*/


    client.send("notify.levelUp",notifyLevelUp)
  }

  async fetchAndStoreRemoteConfig(){
    const METHOD_NAME = "fetchAndStoreRemoteConfig"
    const promises:Promise<any>[] = [];

    const remoteConfigPromise = new Promise<{data:serverStateSpec.RemoteBaseCoinRoomConfig}>((mainResolve, reject) => {
      //console.log("nftMetaDogeCheckCall entered promise")
      (async () => {
        /*if( isInvalidPublicKey(publicKey) ){
          const retData:any = {"ok":false,"msg":"invalid key"}
          
          log(CLASSNAME,roomId,METHOD_NAME," ERROR","publicKey was empty. returning empty array",retData)

          mainResolve(retData)
          return retData
        }*/
        const nftURL = 
          OTHER_CONFIG.CONFIG.CHECK_REMOTE_CONFIG_API_CALL + OTHER_CONFIG.CONFIG.CHECK_REMOTE_CONFIG_API_CALL_ROOM_ID + this.roomName //+ publicKey
        try {
          log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME," calling",nftURL)
          let nftResponse = await fetch(nftURL, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            //body: body,
            //   identity: myIdentity,
          })
      
          //let rewardsResponseData: RewardData = await rewardsResponse.json()
          let configData:{data:serverStateSpec.RemoteBaseCoinRoomConfig} = await nftResponse.json()// as WearablesByOwnerData
      
          log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,'config response: ', configData)
      
          if(configData){
            if(configData.data.coinCap ){
              //short term, long term 
              
              this.coinCapEnabled = configData.data.coinCap.enabled
              this.coinCapOverageReduction = configData.data.coinCap.overageReduction
              if(this.coinCapEnabled){
                log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME," WARNING", "this.coinCap",configData.data.coinCap,this.coinCapEnabled,"client version wrong",this.clientVersion,"need v4 or greating")
              }
              
              log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME," copying", "this.coinCap.enabled",configData.data.coinCap,this.coinCapEnabled)
              log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME," copying", "this.coinCap",configData.data.coinCap,this.coinCapOverageReduction)
            }else if(configData.data.coinCap ){
              
            }
          }

          mainResolve(configData)
          return configData
        } catch (error) {
          const retData:any = {"ok":false,"msg":error}
          log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME," ERROR FETCHING FROM",nftURL,error,"publicKey was empty. returning empty array",retData)
          mainResolve(retData)
          return retData
        }
      })()
    })
    
    promises.push(remoteConfigPromise)

    return Promise.all( promises ).then(function(result){
      console.log(METHOD_NAME,". all promised completed " , result)
      //return retData;

      //playfabDataUtils.init()
      return;
    })
  }
  getLogRoomIdent(){
    return this.roomName + "." + this.roomId
  }
}
