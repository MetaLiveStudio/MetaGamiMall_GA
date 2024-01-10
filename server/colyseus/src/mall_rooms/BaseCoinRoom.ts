import { Room, Client, ServerError } from "colyseus";
import { Block, BlockDefType, BlockMaterialDefType, BlockType,  BlockTypeTypeConst, MyRoomState, Player, PlayerSavePoint, TrackFeaturePositionState, TrackFeatureState, Vector3State } from "./MyRoomState";
import { RewardData, CostData, RewardNotification } from "./MyRoomStateSpec";

//import PlayFab from "../playfab_sdk/PlayFabClientApi";
//import * as PlayFabSDK from  '../playfab_sdk/index'
//import { EntityTokenResponse, GetPlayerCombinedInfoResultPayload, LoginResult, TreatmentAssignment, UserSettings } from '../playfab_sdk/playfab.types'; 
import { PlayFab,PlayFabAuthentication, PlayFabServer } from "playfab-sdk";
import * as PlayFabHelper from "./PlayFabWrapper";

import { coins } from "../coin_config/coins";
import { CONFIG } from "./config";
import { GameEndType, PlayerData, PlayerServerSideData } from "./types";
import { nftMetaDogeCheckCall, nftCheckMultiplier, nftDogeHeadCheckCall, nftCheckDogeHeadMultiplier, initPlayerStateNftOwnership, fetchWearableData, checkMultiplier, CheckMultiplierResultType, getCheckMultiplierVersionNum } from "../utils/nftCheck";
import { addMaterialToUser, createAddUserStat, createAddUserVirtualCurrency, evalRewards } from "../utils/playFabUtils";
import { getCoinCap, getLevelFromXp, getLevelPercentFromXp, getXPDiffBetweenLevels, getXPFromLevel } from "../utils/leveling/levelingUtils";
import * as serverStateSpec from "./MyRoomStateSpec";
import { BaseCoinRoomTrackFeatureUtil, FEATURE_INSTANCE_UNUSED_POOL } from "./BaseCoinRoomTrackFeatureUtil";
import { isNull } from "../utils/utils";
import { costToRecordById, playerFundsToCost, sumRewards } from "./vcUtils";
import { PlayFabDataUtils } from "../utils/playFabDataUtils";
import { GetPlayerCombinedInfoResultHelper } from "../utils/playfabGetPlayerCombinedInfoResultHelper";
import { getLatestStatVersionsAsync } from "../utils/playFabCheckDailyStatsStatus";
import { StatVersionCheckResult } from "../utils/playFabCheckDailyStatsStatus";
import { getLatestStatVersionsAsyncRaffle } from "../utils/playFabCheckDailyRaffle";
import { giveOutRewards } from "../utils/raffleUtils";

//var PlayFab: PlayFab ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFab");
//var PlayFabClient: PlayFabClientModule.IPlayFabClient ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFabClient");

//let playerLoginResult:LoginResult;

PlayFab.settings.titleId = CONFIG.PLAYFAB_TITLEID
PlayFab.settings.developerSecretKey = CONFIG.PLAYFAB_DEVELOPER_SECRET


function logEntry(classname:string,roomId:string,method:string,params?:any){
  console.log(classname,roomId,method," ENTRY",params)
}
function log(classname:string,roomId:string,method:string,msg?:string,...args:any[]){
  console.log(classname,roomId,method,msg,...args)
}

const CLASSNAME = "BaseCoinRoom"
const ENTRY = " ENTRY"

function sleep(ms:number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const ZERO_SPAWN = { min: 0, max:0, percent:0}
export class BaseCoinRoom extends Room<MyRoomState> {
  //maxClients = 1; //solo expereince, prevent player playing in multiple realms etc.
  //minClients = 1; 
  protected currentHeight: number = 0;
  protected maxBlocksCollectable: number = 0
  protected isFinished: boolean = false;
  protected isStarted: boolean = false;
  protected blockIdGenerator = 0;
  protected blockList:Block[] = [] //creation order is easier to track, spawn them all, then decide which to keep
  //protected blockSpawnList:Block[] = [] //blocks to spawn, get picked up by timer
  protected blockPoolList:Block[] = [] //creation order is easier to track. keeps track of unused blocks
  protected authResult: PlayFabAuthenticationModels.ValidateEntityTokenResponse 
  //TODO playerServerSideData consider moving this to state so when state cleared
  //this is cleared???
  protected playerServerSideData:Record<string,PlayerServerSideData> = {}
  protected expireTimeInSeconds = -1
  protected onCollectRespawnTimeInSeconds = -1
  protected enableOnExpireRespawn = false
  protected enableOnCollectRespawn = false
  protected enableEndGameWhenCollectThresholdReached = true

  //remotely managed by /server/firebase/functions/src/colyseusConfigs.ts
  //try to keep these in sync should remote call fail
  protected mCSpawn:serverStateSpec.CoinSpawnDef = { min: 5, max:999, percent:.03}
  protected gCSpawn:serverStateSpec.CoinSpawnDef = { min: 250, max:999, percent:.9}
  protected bZSpawn:serverStateSpec.CoinSpawnDef = { min: 5, max:999, percent:.03}
  
  protected vbSpawn:serverStateSpec.CoinSpawnDef = { min: 0, max:0, percent:0}
  protected aCSpawn:serverStateSpec.CoinSpawnDef = { min: 0, max:0, percent:0}
  protected zCSpawn:serverStateSpec.CoinSpawnDef = { min: 0, max:0, percent:0}
  protected rCSpawn:serverStateSpec.CoinSpawnDef = { min: 0, max:0, percent:0}

  protected r1Spawn:serverStateSpec.CoinSpawnDef = { min: 0, max:0, percent:0}
  protected r2Spawn:serverStateSpec.CoinSpawnDef = { min: 0, max:0, percent:0}
  protected r3Spawn:serverStateSpec.CoinSpawnDef = { min: 0, max:0, percent:0}
  protected bpSpawn:serverStateSpec.CoinSpawnDef = { min: 0, max:0, percent:0}
  protected niSpawn:serverStateSpec.CoinSpawnDef = { min: 0, max:0, percent:0}
  

  protected maxMaterial1Spawn:serverStateSpec.CoinSpawnDef = CONFIG.SPAWN_MATERIAL_ITEMS_ENABLED ? { min: 1, max:9, percent:.03} : ZERO_SPAWN
  protected maxMaterial2Spawn:serverStateSpec.CoinSpawnDef = CONFIG.SPAWN_MATERIAL_ITEMS_ENABLED ? { min: 1, max:9, percent:.03} : ZERO_SPAWN
  protected maxMaterial3Spawn:serverStateSpec.CoinSpawnDef = CONFIG.SPAWN_MATERIAL_ITEMS_ENABLED ? { min: 1, max:9, percent:.03} : ZERO_SPAWN
  protected pullBlockCount = 5
  protected startGameWaitTime = CONFIG.START_GAME_WAIT_TIME
  protected levelDuration = CONFIG.ROUND_DURATION
  protected levelTime = 0
  /** true - means will count time **/
  protected levelDurationEnabled = true
  /** negative is down, + is up, 0 is no counting**/
  protected levelDurationIncrement = -1 
  /** when reached is over **/
  protected levelDurationThreshold = 0
  
  protected levelCoinPos:number[][] = coins
  protected guestCoinType:BlockDefType
  protected saveInterval:number=CONFIG.SAVE_DATA_INTERVAL

  protected coinCapEnabled:boolean = false
  protected coinCapOverageReduction:number
  
  protected saveLapseTime:number=0
  protected savedPlayerStats:boolean = false

  protected timeSyncLapseTime:number=0
  protected statVersionLapseTime:number=0
  protected lastStatVersionResult:StatVersionCheckResult
  protected lastStatVersionResultRaffle:StatVersionCheckResult

  protected trackFeatureUtil:BaseCoinRoomTrackFeatureUtil
  protected playFabDataUtils:PlayFabDataUtils
  protected clientVersion: number;

  //update time every 1 second
  //do onCreate
  //this.setSimulationInterval((deltaTime) => this.update(deltaTime), 1000);

  // GAME SERVER LOOP
  //update(dt:number){

    
  async onCreate (options: any) {
    // Kick off the actual login call
    //DoExampleLoginWithCustomID();
    const myRoom = this

    /*
    //login server side playfab
    var loginRequest: PlayFabAuthenticationModels.GetEntityTokenRequest= {}
    PlayFabHelper.GetEntityToken(loginRequest).then(function(result:PlayFabAuthenticationModels.ValidateEntityTokenResponse){
        console.log("promise.GetEntityToken",result);
        myRoom.authResult = result;
    }).catch(function(error:PlayFabAuthenticationModels.ValidateEntityTokenResponse){
      console.log("promise.GetEntityToken failed",error);
    })*/

    //version of client, to know if client ready for activated features or not
    this.clientVersion = options.clientVersion;
    
    this.setState(new MyRoomState());

    const coinDataOptions:serverStateSpec.CoinRoomDataOptions = options.coinDataOptions

    // set-up the game!
    await this.setUp(coinDataOptions);

    // Get secret santa notifications
    this.presence.subscribe('announce', (msg: {msg:string,duration:number}) => {
      console.log('received announce on room ', this.roomId,msg)
      
      this.broadcast("inGameMsg",msg)
    })
    // Get secret santa notifications
    this.presence.subscribe('daily-roll-over-event', (result: StatVersionCheckResult) => {
      console.log('received daily-roll-over-event on room ', this.roomId,result)
      
      try{
        this.checkLatestStatVersionResult(result)
      }catch(e){
        this.handleUnexpectedError(CLASSNAME,this.roomId,"received daily-roll-over-event on room",[result],"",undefined,e)
      }
    })
    
    // Get secret santa notifications
    this.presence.subscribe('maintenance', (msg: {msg:string,duration:number}) => {
      console.log('received maintenance on room ', this.roomId,msg)
      
      this.broadcast("notifyMaintenance",msg)
    })
    
    this.onMessage("touch-block", (client: Client, id: string) => {
      // set player new position

      if(!this.isStarted){
        console.log("on.msg.touch-block game not started yet " + client.id + " " + client.sessionId);
        return;
      }

      const playerData = this.getPlayerData(client.sessionId)
      const player:Player = playerData.clientSide;

      //too chatty
      //console.log("touch-block " + player.id + " " + player.name + " touched " + id + " " + this.currentHeight)
      this.collectBlock(client,playerData,id);

      //this.currentHeight >= CONFIG.MAX_BLOCK_HEIGHT ||
      if ( (this.currentHeight >= this.maxBlocksCollectable) ){
        if(!this.enableEndGameWhenCollectThresholdReached){
          console.log("on.msg.touch-block  " + client.id + " " + client.sessionId),"endGameWhenCollectThresholdReached",this.enableEndGameWhenCollectThresholdReached,"not ending game";
        }else if (!this.isFinished) {
          //
          // winner! reached max block height!
          //
          
          this.gameEndedNotify({timedOut:false})

        }

      }
    });

    this.onMessage("quit-game",(client: Client, data: any) => {
      console.log("quit-game ",client.sessionId," is quitting, act now");
      
      if(CONFIG.LEVEL_COINS_SAVE_STATS_MID_GAME){
        //side affect broadcasts "finished"
        try{
          this.savePlayerData('end-game');
        }catch(e){
          this.handleUnexpectedError(CLASSNAME,this.roomId,"msg.quit-game",[client.sessionId,data],"",client,e)
        }
      }
      //send ack quit? right now savePlayerData side affect will send "finished" like it ended normally
    })
    
    this.onMessage("save-game",(client: Client, data: any) => {
      console.log("save-game ",client.sessionId," is saving");
      if(CONFIG.LEVEL_COINS_SAVE_STATS_MID_GAME){
        //side affect broadcasts "finished"
        try{
          this.savePlayerData('save-game');
        }catch(e){
          this.handleUnexpectedError(CLASSNAME,this.roomId,"msg.save-game",[client.sessionId,data],"",client,e)
        }
      }
      //send ack quit? right now savePlayerData side affect will send "finished" like it ended normally
    })
    this.onMessage("fall", (client: Client, atPosition: any) => {
      this.broadcast("fall", atPosition);
    });

    this.onMessage( "player.transform.update", (client: Client, posData: serverStateSpec.PlayerTransformState) => {
          const METHOD_NAME = "player.transform.update";
          //log(CLASSNAME,this.roomId,METHOD_NAME, "",[client.sessionId,racingData]);

          const playerData = this.getPlayerData(client.sessionId)
          const playerServerData:PlayerServerSideData = playerData.serverSide;
          if (playerServerData) {
            posData.serverTime = this.getCurrentTime() //replacing entire object as many things can be changing as a set
            playerServerData.playerTransform = posData

            //log(CLASSNAME, this.roomId, METHOD_NAME, "player pos", posData);
          } else {
              log(CLASSNAME, this.roomId, METHOD_NAME, "WARNING cound not find player", client.sessionId);
          }
      }
    );

    this.onMessage("player.update.dcl.userData",(client: Client, data: any) => {
      const METHOD_NAME = "player.update.dcl.userData "
      console.log("player.update.dcl.userData ",client.sessionId," ",data);
      const playerData = this.getPlayerData(client.sessionId)
        const player:Player = playerData.clientSide;
        const userData = data.userData
        let bronzeShoeQty = 0
        if(playerData){
          playerData.serverSide.dclUserData = userData
        }
        if(player){
          //pull from rewards
          const rewards = sumRewards(player.playfabBalance.rewards,BlockTypeTypeConst.BRONZE_SHOE1.symbol)
          //add it to collected + current balance
          bronzeShoeQty = rewards + playerData.clientSide.bronzeShoeCollected + player.playfabBalance.bronzeShoeCollected
        }
        
        //get multiplier again
        if(userData && playerData){
          const wearablePromise = checkMultiplier("/check-multiplier",getCheckMultiplierVersionNum(this.clientVersion)
          ,userData.publicKey ? userData.publicKey : userData.userId
          ,bronzeShoeQty,userData,playerData.serverSide.realmInfo)
          wearablePromise.then((result:CheckMultiplierResultType)=>{
              console.log(METHOD_NAME,"checkMultiplier",result)
              let coinMultiplier = result.multiplier
              if(result && result.ok && result.multiplier){
                  //defaultPlayerMultiplier = result.multiplier 
                  //retData.coinMultiplier = defaultPlayerMultiplier
                  playerData.serverSide.coinMultiplier = coinMultiplier
              }
              console.log(METHOD_NAME,"checkMultiplier",coinMultiplier)
          })
        }else{
          console.log(METHOD_NAME,"checkMultiplier failed missing userData or playerData",playerData,userData)
        }
    })
    
    this.onMessage("pullBlocksFixed", (client: Client, id: string) => {
      console.log("pullBlocksFixed ",this.state.blocks.size,this.state.countdown)
      
      if(this.pullBlockCount > 0 ){
        this.pullBlockCount --

        console.log("pullBlocksFixed ",this.state.blocks)
        
        this.state.blocks.forEach((value: Block, key: string)=>{
          const block = value
          console.log("xxxx ",block)
          //this.removeBlockAndGenNew(block.id)
        })

        const keys = Array.from(this.state.blocks.keys())
        /*for(const p in keys){
          const block = this.state.blocks.get(keys[p])
          console.log("reshuffle.remove ",p,keys[p],block)
          super.removeBlock(block.id)
          //this.randomlyPlaceBlock(block)
        }*/
        //must reshuffle them
      
        for(const p in keys){
          const block = this.state.blocks.get(keys[p])
          //const block = this.getBlockFromPool()
          console.log("reshuffle.add ",p,keys[p],block)
          
          //this.randomlyPlaceBlock(block)
          //this.removeBlockAndGenNew(block.id)

          //console.log("adding to state block ",block.id,block.x)
          //this.state.blocks.set(block.id,block)
          //this.randomlyPlaceBlock(block)
        }

        client.send("inGameMsg","Coins Pulled") 
      
        
      }else{
        //"All reshuffles used"
       // client.send
       client.send("inGameMsg","All pulls used") 
      }
    })
  
    this.onMessage("levelData.trackFeature.update", (client: Client, trackFeatUpdate: serverStateSpec.TrackFeatureConstructorArgs) => {
      const METHOD_NAME = "levelData.trackFeature.update"
      log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME, "",[client.sessionId,trackFeatUpdate]);
      //find it and update it
      const trackToUpdate =  (this.state.levelData.trackFeatures.get( trackFeatUpdate.id ) as TrackFeatureState)

      if(trackToUpdate){
          log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME, "updating",trackToUpdate.activateTime,trackFeatUpdate.activateTime)

          const playerData = this.getPlayerData(client.sessionId)
          const player:Player = playerData.clientSide;
  
          if(trackToUpdate.type && trackToUpdate.type.indexOf("minable") > -1 ){
            this.handleMinedCost(client,player,trackToUpdate)
          }else if(trackToUpdate.type && trackToUpdate.type.indexOf("buyable") > -1 ){
            this.handleBuyableCost(client,player,trackToUpdate)
          }else{
            log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME, "UNKNOWN track type",trackFeatUpdate.id,trackToUpdate.type)
          }
          //trackToUpdate.updateServerTime(this.getCurrentTime())
          //trackToUpdate.health.current = trackToUpdate.health.current + trackFeatUpdate.health
      }else{
          log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME, "could not find track to update",trackFeatUpdate.id)
      }
    })

    this.onMessage("levelData.trackFeature.adjustHealth", (client, adjustHealth:serverStateSpec.AlterHealthDataState) => {
      const METHOD_NAME = "levelData.trackFeature.adjustHealth"
      log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME, "",[client.sessionId,adjustHealth]);
      //find it and update it
      const trackToUpdate = this.state.levelData.trackFeatures.get( adjustHealth.playerIdTo ) as TrackFeatureState

      if(adjustHealth === undefined || adjustHealth === null){
          log(
              CLASSNAME, this.roomId, METHOD_NAME,
              "adjustHealth required, should not be null",
              [client.sessionId, adjustHealth]
          );
          return;
      }

      /*if (!this.state.battleData.hasBattleStarted()) {
          log(
              CLASSNAME,
              this.roomId,
              METHOD_NAME,
              "battle not started, cannot adjust health yet",
              [client.sessionId, adjustHealth]
          );
          return;
      }*/

      if(trackToUpdate){

        const playerData = this.getPlayerData(client.sessionId)
        const player:Player = playerData.clientSide;

          this.handleMinedCost(client,player,trackToUpdate)
          /*log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME, "updating",trackToUpdate)
          //trackToUpdate.health.current += adjustHealth.amount
          
          let oldVal = trackToUpdate.health.current
          let newVal = trackToUpdate.health.current - adjustHealth.amount
          if(newVal>trackToUpdate.health.max){
              newVal = trackToUpdate.health.max
          }
          if(newVal<0){
              newVal = 0
          }
          trackToUpdate.health.current = newVal
          trackToUpdate.health.updateServerTime(this.getCurrentTime())

          if(newVal <= 0){
              if(adjustHealth.respawnTime !== undefined){
                  trackToUpdate.activateTime = this.getCurrentTime() + adjustHealth.respawnTime
                  //TODO sync this better
                  trackToUpdate.lastTouchTime = this.getCurrentTime()
              }
              this.clock.setTimeout(()=>{
                  log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME, "respawn fired",trackToUpdate.name,adjustHealth.playerIdTo)
                  trackToUpdate.health.current = trackToUpdate.health.max
              },adjustHealth.respawnTime)
          }

          trackToUpdate.updateServerTime(this.getCurrentTime()) 

          log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME, "health",adjustHealth,"oldVal",oldVal,"newVal",newVal)
          //if(!trackToUpdate.isReUsable){
              //remove it??
          //}**/
      }else{
          log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME, "could not find track to update",adjustHealth.playerIdTo)
      }
    })
    return
  }

  
  hitMaxInvCnt(player:Player,trackToUpdate:TrackFeatureState):{maxAmountOK:boolean,maxAmountHit:CostData[]}{
    const METHOD_NAME = "hitMaxInvCnt()"
    if(player.rewards === undefined ) player.rewards = []
    let maxAmountOK = true
    const lackOfFunds:CostData[]=[]

    //player.playfabBalance
    const evaluatedRewards = this.createEvalRewards(trackToUpdate)
    const playerFunds = playerFundsToCost(player)
    const playerFundsRec = costToRecordById(playerFunds)
    
    log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"playerFundsRec",playerFundsRec)

    for(const p in evaluatedRewards){
      const reward = evaluatedRewards[p]
      //levelUpRewards.push( { type:reward.type,"id":reward.id,amount: reward.amount, maxAllowed: reward.maxAllowed, redeemable: false } )
      const curAmount = playerFundsRec[reward.id]
      if(reward.maxAllowed !== undefined && reward.maxAllowed >= 0){
        //check player and determin
        log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"audit","TODO check inventory for maxAllowed",p,reward,"curAmount",curAmount)
        if(curAmount !== undefined && curAmount.amount !== undefined && curAmount.amount >= reward.maxAllowed){
          maxAmountOK = false

          lackOfFunds.push( curAmount )
        }
      }
    }
    //evaluatedRewards
    //const playerFunds = playerFundsToCost(player)
    //const playerFundsRec = costToRecordById(playerFunds)



    const retVal = {maxAmountOK: maxAmountOK,maxAmountHit:lackOfFunds}

    log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"audit","retVal",retVal)
    log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"RETURN",retVal)

    return retVal
  }
  hasEnoughFunds(player:Player,costs:CostData[]):{hasFunds:boolean,lackOfFunds:CostData[]}{
    const METHOD_NAME = "hasEnoughFunds()"
    if(player.rewards === undefined ) player.rewards = []
    let hasFunds = false
    const lackOfFunds:CostData[]=[]

    const playerFunds = playerFundsToCost(player)
    const playerFundsRec = costToRecordById(playerFunds)

    log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"audit","playerFundsRec",playerFundsRec,"costs",costs)

    let hasFundsCount = 0
    let costsNeededCount = 0
    for(const c of costs){
      if(c.type==="CatalogItem"||c.type==="DropTable"){
        log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"ignoring for now",c.type,c.id,)
        continue; 
      }
      costsNeededCount++
      const playerFunds = playerFundsRec[c.id]
      log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"audit",c.type,c.id,"player",playerFunds !== undefined ? playerFunds.amount : "n/a","cost",c.amount)
      if(isNull(playerFunds) || playerFunds.amount < Math.abs(c.amount)){
        if(isNull(playerFunds)){
          lackOfFunds.push( {id:c.id,type:c.type,amount:-9999} )
        }else{
          lackOfFunds.push( playerFunds )
        }
      }else{
        hasFundsCount++
      }
    }

    hasFunds = hasFundsCount === costsNeededCount

    const retVal = {hasFunds: hasFunds,lackOfFunds:lackOfFunds}

    log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"audit","hasFundsCount",hasFundsCount,"retVal",retVal)
    log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"RETURN",retVal)

    return retVal
  }

  getLogRoomIdent(){
    return this.roomName + "." + this.roomId
  }

  handleBuyableCost(client:Client,player:Player,trackToUpdate:TrackFeatureState){
    const METHOD_NAME = "handleBuyableCost()"
    logEntry(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,[trackToUpdate.id,trackToUpdate.status]);

    this.handleMinedCost(client,player,trackToUpdate)
  }
  getTrackFeatureInteractionType(trackToUpdate:TrackFeatureState){
    const featureDef = trackToUpdate._featureDef
    let interactionType = 'unknown'
    if(featureDef.type && featureDef.type.indexOf('minable')>-1 ){
      interactionType = 'mining'
    }else if(featureDef.type && featureDef.type.indexOf('buyable')>-1 ){
      interactionType = 'buying'
    }
    return interactionType
  }
  handleMinedCost(client:Client,player:Player,trackToUpdate:TrackFeatureState){
    const METHOD_NAME = "handleMinedCost()"
    logEntry(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,[trackToUpdate.id,trackToUpdate.status]);

    const featureDef = trackToUpdate._featureDef

    const interactionType = this.getTrackFeatureInteractionType(trackToUpdate)

    //debounce check
    const lastTouchDelta = this.getCurrentTime() - trackToUpdate.lastTouchTime
    const debounceTolerance =  featureDef?.spawnDef?.coolDownTime ? featureDef.spawnDef.coolDownTime : 500
    if(lastTouchDelta < debounceTolerance){
      log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"DEBOUNCE FIRED, CLAIMED LESS THAN",debounceTolerance,"ago",lastTouchDelta)
      return
    }

    
    if(trackToUpdate.status !== 'active'){
      log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"is in invalid status",trackToUpdate.status)
      return
    }

    /*
    FIXME want here but is ruining the "mining time"
    this.markTrackFeature(trackToUpdate)
    //using new value 
    */
    
    const miningCosts:RewardData[] = [
      //{ type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: 1 },
      //{ type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: 2 }
    ]
    for(const p in featureDef.cost){
      const cost = featureDef.cost[p]
      miningCosts.push( { type:cost.type,"id":cost.id,amount: -1*cost.amount } )
    }

    const notifyMiningPaid:RewardNotification = {
      rewardType:interactionType+"-paid",
      newLevel: -1,
      rewards: miningCosts,
      sourceObjectId: trackToUpdate.id
    }

    const lackOfFundsResult = this.hasEnoughFunds(player,miningCosts)
    const maxAmountInvResult = this.hitMaxInvCnt(player,trackToUpdate)

    if(!lackOfFundsResult.hasFunds){
      log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"NOT ENOUGH FUNDS",lackOfFundsResult)
      const notifyMiningNotEnough:RewardNotification = {
        rewardType:interactionType+"-lack-of-funds",
        newLevel: -1,
        rewards: lackOfFundsResult.lackOfFunds,
        sourceObjectId: trackToUpdate.id
      }
      client.send("notify."+interactionType+"LackOfFunds",notifyMiningNotEnough)
      return;
    }else{
      log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"has funds",lackOfFundsResult)
    }
    if(!maxAmountInvResult.maxAmountOK){
      log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"max inventory hit",maxAmountInvResult)
      const notifyMiningNotEnough:RewardNotification = {
        rewardType:interactionType+"-maxed-out-inventory",
        newLevel: -1,
        rewards: maxAmountInvResult.maxAmountHit,
        sourceObjectId: trackToUpdate.id
      }
      client.send("notify."+interactionType+"MaxedOutInventory",notifyMiningNotEnough)
      return;
    }else{
      log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"did not max out inventory OK",maxAmountInvResult)
    }
    

    if(player.rewards === undefined ) player.rewards = []
    //player.rewards.push(miningCosts)
    player.rewards.push(notifyMiningPaid)

    if(player.currentSavePoint.rewards === undefined ) player.currentSavePoint.rewards = []
    //player.currentSavePoint.rewards.push(miningCosts)
    player.currentSavePoint.rewards.push(notifyMiningPaid)

    this.distributeTrackFeatures(trackToUpdate.type)

    client.send("notify."+interactionType+"Paid",notifyMiningPaid)
  
    const claimInTime = featureDef.purchaseDelay !== undefined ? featureDef.purchaseDelay : 0

    log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"claimInTime",claimInTime)

    this.clock.setTimeout(()=>{
      this.handleMinedReward(client,player,trackToUpdate)
    },claimInTime)
    //client.send("notify.miningPaid",notifyMiningPaid)
  }
  markTrackFeature(trackToUpdate:TrackFeatureState){
    trackToUpdate.lastTouchTime = this.getCurrentTime()
    trackToUpdate.lastActivateTime = trackToUpdate.activateTime
    trackToUpdate.activateTime = FEATURE_INSTANCE_UNUSED_POOL //way in future//trackFeatUpdate.activateTime
    trackToUpdate.updateServerTime(this.getCurrentTime())
  }

  createEvalRewards(trackToUpdate:TrackFeatureState) {
    const featureDef = trackToUpdate._featureDef
      
    
    //TODO CHECK PLAYER INVENTORY RIGHT NOW, AND unsaved rewards???

    const evaluatedRewards = evalRewards( featureDef.rewards, this.playFabDataUtils )

    return evaluatedRewards
  }

  handleMinedReward(client:Client,player:Player,trackToUpdate:TrackFeatureState){
    const METHOD_NAME = "handleMinedReward()"
    logEntry(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,[trackToUpdate.id]);

    const subType = this.getTrackFeatureInteractionType(trackToUpdate)
    /*
    
    FIXME want in handleMinedCost but is ruining the "mining time"
    */
    this.markTrackFeature(trackToUpdate)
    this.trackFeatureUtil.putFeatureZoneBackInPool(trackToUpdate,"handleMinedReward")
    
    
        //TODO sync this better
        //trackToUpdate.lastTouchTime = this.getCurrentTime()
    //}

    const levelUpRewards:RewardData[] = [
      //{ type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: 1 },
      //{ type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: 2 }
    ]

    const evaluatedRewards = this.createEvalRewards(trackToUpdate)

    for(const p in evaluatedRewards){
      const reward = evaluatedRewards[p]
      levelUpRewards.push( { type:reward.type,"id":reward.id,amount: reward.amount, maxAllowed: reward.maxAllowed, redeemable: false } )
    }

    const notifyLevelUp:RewardNotification = {
      rewardType:subType+"-reward",
      newLevel: -1,
      rewards: levelUpRewards
    }
    if(player.rewards === undefined ) player.rewards = []
    //player.rewards.push(miningCosts)
    player.rewards.push(notifyLevelUp)

    if(player.currentSavePoint.rewards === undefined ) player.currentSavePoint.rewards = []
    //player.currentSavePoint.rewards.push(miningCosts)
    player.currentSavePoint.rewards.push(notifyLevelUp)

    this.distributeTrackFeatures(trackToUpdate.type)

    client.send("notify."+subType+"Reward",notifyLevelUp)
  }

  savePlayerData(saveType:'end-game'|'save-game'|'auto-save'|'cap-roll-over'):Promise<any>{
    const METHOD_NAME = "savePlayerData()"
    logEntry(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,saveType);

    const promise = this.updatePlayerStats(saveType).then(async (result:PlayFabHelper.EndLevelUpdatePlayerStatsResult[])=>{
      console.log("XXXXX updatePlayerStats all promised completed " , result)
      //can a player be concurrently logged in????
      //if so lets collect based on px version of player and agg to main
      //can then send both a notification? broadcast will do that
      //but playerid is what is filtering so add a secondary id. "sceneId" maybe so can connect concurrently...
      
      //if(data.client){
        //player.id
        //this.clients
        for(let p in this.clients){
          
          //FIXME looping over all clients but dont know result was for them, need result to be a  player id map
          //WORKAROUND is scan result for playerCombinedInfo.PlayFabId == client.player.playfabId
          

          const client = this.clients[p]
          console.log("XXXXX updatePlayerStats sending to client " , client.sessionId)
          const playerData:PlayerData = this.getPlayerData(client.sessionId)

          if(!playerData){
            console.log("XXXXX updatePlayerStats FAILED TO FIND PLAYER DATA FOR CLIENT " , client.sessionId,"playerData",playerData) 
            continue;
          }

          const thisPlayerResult = playerData?.serverSide?.playFabData !== undefined ? PlayFabHelper.getPlayerResultById(playerData.serverSide.playFabData.id,result) : undefined
          //const playFabId = playerData.serverSide.playFabData.id;
          //const player = playerData.clientSide

                  
          //maybe track before and after save for any missed
          //too slow, need to do this when update player stats is running!
          if(saveType=='save-game'){
            //workaround????
            this.resetPlayerCollectedItems( playerData.clientSide )
          }

          //why would this be undefined???  - because playerData?.serverSide might be null somehow???
          //why do i need this to not be null to read new values???
          //if(thisPlayerResult !== undefined){
            //need to execute read again, because write just happened, so now need to get latest
            //npe risk! on serverSide.playFabData???
            const params = this.createPlayfabCombinedInfoReq(playerData.serverSide.playFabData.id)
            //NOW LOOKUP STATS FOR BASELINE
            const postSaveResult:PlayFabServerModels.GetPlayerCombinedInfoResult = await PlayFabHelper.GetPlayerCombinedInfo( params )

            console.log("XXXXX updatePlayerStats found result for client " , client.sessionId,"thisPlayerResult",thisPlayerResult,"playerData.clientSide.playfabBalance",playerData.clientSide.playfabBalance) 

            if(thisPlayerResult !== undefined){
              console.log("XXXXX updatePlayerStats save vs re-read " , client.sessionId
                ,thisPlayerResult.playerCombinedInfo.InfoResultPayload.PlayerStatistics,thisPlayerResult.playerCombinedInfo.InfoResultPayload.UserVirtualCurrency
                ," vs postsave"
                ,postSaveResult.InfoResultPayload.PlayerStatistics,postSaveResult.InfoResultPayload.UserVirtualCurrency) 
            }else{
              console.log("XXXXX updatePlayerStats re-read " , client.sessionId
              //,thisPlayerResult.playerCombinedInfo.InfoResultPayload.PlayerStatistics,thisPlayerResult.playerCombinedInfo.InfoResultPayload.UserVirtualCurrency
              ," postsave"
              ,postSaveResult.InfoResultPayload.PlayerStatistics,postSaveResult.InfoResultPayload.UserVirtualCurrency) 
            }

            const playerCombinedInfoHelper:GetPlayerCombinedInfoResultHelper = new GetPlayerCombinedInfoResultHelper()
            playerCombinedInfoHelper.update(postSaveResult.InfoResultPayload)
  
            copyToPlayerBalance(playerData.clientSide,playerCombinedInfoHelper)

            console.log("XXXXX updatePlayerStats found result for client " , client.sessionId,"post adjusted","playerData.clientSide.playfabBalance",playerData.clientSide.playfabBalance) 
          //}else{
            console.log("XXXXX updatePlayerStats FAILED TO FIND RESULT FOR CLIENT " , client.sessionId,"thisPlayerResult",thisPlayerResult) 
          //}

          
          if(playerData !== undefined && playerData.serverSide !== undefined){
            console.log("sending "+playerData.serverSide.endGameResult)
            if(saveType === 'end-game'){
              client.send("endGameResultsMsg",playerData.serverSide.endGameResult) 
            }else{//} if(saveType === 'auto-save'){
              //notify 
              //client.send("endGameResultsMsg",playerData.serverSide.endGameResult) 
            }
            //this.broadcast("endGameResultsMsg",playerData.serverSide.endGameResult)
          }else{
            if(playerData === undefined){ 
              console.log("ERROR unable to send, playerData missing ",playerData)
            }else if(playerData.serverSide === undefined){
              console.log("ERROR unable to send, playerData.serverSide missing ",playerData.serverSide)
            }else{
              console.log("ERROR unable to send, unknown reason ")
            }
          }
        }
      //}
      if(saveType=='end-game'){
        this.broadcast("finished");//what does this do? rename to savingPlayerDataFinished
      }else if(saveType=='save-game'){
        //send results to update faster?
        this.broadcast("game-saved");//what does this do? rename to savingPlayerDataFinished
      }else if(saveType=='cap-roll-over'){
        this.broadcast("game-auto-saved-daily-reset");//what does this do? rename to savingPlayerDataFinished
      }else{
        this.broadcast("game-auto-saved");//what does this do? rename to savingPlayerDataFinished
      }
      
    }).catch((error:any)=>{
      console.log("savePlayerData ERROR unable to save, unknown reason ",error)
      this.handleUnexpectedError(CLASSNAME,this.roomId,"msg.save-game",[saveType],"",undefined,error)
    })
    return promise
  }
  gameEndedNotify(data:GameEndType){
    console.log("gameEndedNotify called ",data)

    if(!this.isFinished){
      this.isFinished = true;

      this.clock.clear()

      try{
        this.savePlayerData('end-game');
      }catch(e){
        this.handleUnexpectedError(CLASSNAME,this.roomId,"gameEndedNotify",[data],"",undefined,e)
      }
    }else{
      console.log("gameEndedNotify called already!!!! ",data)
    }
  }

  updatePlayerStats(saveType:'end-game'|'save-game'|'auto-save'|'cap-roll-over'):Promise<any[]>{
    const METHOD_NAME = "updatePlayerStats()"
    logEntry(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,saveType);

    const promises:Promise<any>[] = [];

    let loopCount = 0

    
    //TODO store on individual player record??
    if(this.savedPlayerStats){
      log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"updatePlayerStats already calld, save point should be safe to call again???")    
      //return
    } 
    this.savedPlayerStats = true
  
    
    

    for(const p in this.playerServerSideData){
        console.log("updatePlayerStats looping" + loopCount + " " + p)
      //this.state.players.forEach((player) => {
        
        //player.id
        const playerData:PlayerData = this.getPlayerData(this.playerServerSideData[p].sessionId)
        const player = playerData.clientSide

        if(!player.playFabAuthenticated){
          console.log("updatePlayerStats looping" + loopCount + " " + p + " was NOT playfab playFabAuthenticated, skipping saving",player,playerData)
          continue;
        }

        //console.log("updatePlayerStats looping" + loopCount + " " + p + "  "+ playerData,player.id,"savePoint",savePoint)
        if(playerData === undefined || player === undefined){
          console.log("updatePlayerStats looping" + loopCount + " " + p + " playerData or player was nulll",player,playerData)
          continue;
        }
        if(playerData.serverSide === undefined){
          console.log("updatePlayerStats looping" + loopCount + " " + p + " playerData.serverSide was nulll",player,playerData)
          continue;
        }
        
        //NPE ON serverSide?
        if(!playerData?.serverSide?.playFabData){
          console.log("updatePlayerStats looping" + loopCount + " " + p,"MISSING PLAYFAB DATA!!!","--------------------")
          console.log("updatePlayerStats looping" + loopCount + " " + p,"MISSING PLAYFAB DATA!!!",playerData)
          console.log("updatePlayerStats looping" + loopCount + " " + p,"MISSING PLAYFAB DATA!!!","--------------------")
          
          //continue;
        }
        

        const playFabId = playerData.serverSide.playFabData ? playerData.serverSide.playFabData.id : "updatePlayerStats-PLAYFABID-WAS-MISSING!!"
        
  

        const savePoint = player.currentSavePoint
        //this.copyPlayerData(player,savePoint)


          

        if(!this.hasDataToSave(savePoint)){
          if( saveType !== 'cap-roll-over' ){
            log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"updatePlayerStats savePoint has nothing to save",player.id,player.name,", save point saving",saveType,savePoint)    
            promises.push(new Promise((resolve, reject) => {
              //EndLevelUpdatePlayerStatsResult
              resolve({})
              return true
            }))
            continue
          }else{
            log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"updatePlayerStats savePoint has nothing to save BUT still saving because type is cap-roll-over",player.id,player.name,", save point saving",saveType,savePoint)    
          }
        } 

        if(player.saveInProgress){
          log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"updatePlayerStats save in progress",player.id,player.name,", save point not calling again")    
          promises.push(new Promise((resolve, reject) => {
            //EndLevelUpdatePlayerStatsResult
            resolve({})
            return true
          }))
          continue
        } 
          
        player.saveInProgress = true
        savePoint.saveInProgress = true
        
        //is after X time
        //during save can we pop this off sooner?
        //resetting save point
        const newSavePoint = new PlayerSavePoint()
        //FIXME this resets the save in progress flag :(
        //but save not done
        this.resetPlayer( newSavePoint ) 
        player.currentSavePoint = newSavePoint

        //then push
        player.pastSavePoints.push( savePoint )
          
        //copy the data here to see if anything else gets added???


        console.log("updatePlayerStats looping" + loopCount + " player " + player , " vs ",savePoint)


        //MOVE THIS TO RESETPLAYER BEFORE WE ASSIGN???
        //copy over remainers for next time
        newSavePoint.coinGcCount += savePoint.coinGcCount    - Math.floor(savePoint.coinGcCount) 
        newSavePoint.coinMcCount += savePoint.coinMcCount    - Math.floor(savePoint.coinMcCount)    

        newSavePoint.coinVbCount += savePoint.coinVbCount    - Math.floor(savePoint.coinVbCount)    
        newSavePoint.coinAcCount += savePoint.coinAcCount    - Math.floor(savePoint.coinAcCount)    
        newSavePoint.coinZcCount += savePoint.coinZcCount    - Math.floor(savePoint.coinZcCount)    
        newSavePoint.coinRcCount += savePoint.coinRcCount    - Math.floor(savePoint.coinRcCount)    

        newSavePoint.bronzeCollected += savePoint.bronzeCollected    - Math.floor(savePoint.bronzeCollected)    

        newSavePoint.coinsCollected += savePoint.coinsCollected    - Math.floor(savePoint.coinsCollected) 
        //newSavePoint.coinsCollectedEpoch += savePoint.coinsCollectedEpoch    - Math.floor(savePoint.coinsCollectedEpoch) 

        savePoint.coinGcCount = Math.floor(savePoint.coinGcCount)
        savePoint.coinMcCount = Math.floor(savePoint.coinMcCount)
        
        savePoint.coinVbCount = Math.floor(savePoint.coinVbCount)
        savePoint.coinAcCount = Math.floor(savePoint.coinAcCount)
        savePoint.coinZcCount = Math.floor(savePoint.coinZcCount)
        savePoint.coinRcCount = Math.floor(savePoint.coinRcCount)

        savePoint.bronzeCollected = Math.floor(savePoint.bronzeCollected)
        savePoint.rock1Collected = Math.floor(savePoint.rock1Collected)
        savePoint.rock2Collected = Math.floor(savePoint.rock2Collected)
        savePoint.rock3Collected = Math.floor(savePoint.rock3Collected)
        savePoint.nitroCollected = Math.floor(savePoint.nitroCollected)
        savePoint.petroCollected = Math.floor(savePoint.petroCollected)
        
        //savePoint.petroCollected = Math.floor(savePoint.)
        //savePoint.coin = Math.floor(savePoint.coinMcCount)

        console.log("updatePlayerStats CARRYING OVER" 
          ,"newSavePoint.coinsCollected",newSavePoint.coinsCollected,"newSavePoint.coinsCollectedEpoch",newSavePoint.coinsCollectedEpoch
          ,"newSavePoint.coinsCollectedDaily",newSavePoint.coinsCollectedDaily
          ,"newSavePoint.coinGcCount",newSavePoint.coinGcCount,"newSavePoint.bronzeCollected",newSavePoint.bronzeCollected,"newSavePoint.coinMcCount",newSavePoint.coinMcCount)

        console.log("updatePlayerStats rewards" 
            ,JSON.stringify( savePoint.rewards ))


        //on save, reset internal tallys
        //player._coinGcCount
        //player._coinMcCount 
        //player._material1Count
        //player._material2Count
        //player._material3Count
        //player._rewards
        //player.coinGcCount
        //player.coinMcCount 
        //player.material1Count
        //player.material2Count
        //player.material3Count
        //player.rewards
        var addGCPlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.GC.symbol,savePoint.coinGcCount )
        var addMCPlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.MC.symbol,savePoint.coinMcCount )

        var addVBPlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.VB.symbol,savePoint.coinVbCount )
        var addACPlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.AC.symbol,savePoint.coinAcCount )
        var addZCPlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.ZC.symbol,savePoint.coinZcCount )
        var addRCPlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.RC.symbol,savePoint.coinRcCount )


        var addGCRewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.GC.symbol, sumRewards(savePoint.rewards,BlockTypeTypeConst.GC.symbol) )
        var addMCRewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.MC.symbol, sumRewards(savePoint.rewards,BlockTypeTypeConst.MC.symbol) )

        var addVBRewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.VB.symbol, sumRewards(savePoint.rewards,BlockTypeTypeConst.VB.symbol) )
        var addACRewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.AC.symbol, sumRewards(savePoint.rewards,BlockTypeTypeConst.AC.symbol) )
        var addZCRewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.ZC.symbol, sumRewards(savePoint.rewards,BlockTypeTypeConst.ZC.symbol) )
        var addRCRewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.RC.symbol, sumRewards(savePoint.rewards,BlockTypeTypeConst.RC.symbol) )
        
        var addBZPlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.BZ.symbol,savePoint.bronzeCollected )
        var addNIPlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.NI.symbol,savePoint.nitroCollected )
        var addBPPlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.BP.symbol,savePoint.petroCollected )
        var addR1PlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.R1.symbol,savePoint.rock1Collected )
        var addR2PlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.R2.symbol,savePoint.rock2Collected )
        var addR3PlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.R3.symbol,savePoint.rock3Collected )

        var addBZRewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.BZ.symbol, sumRewards(savePoint.rewards,BlockTypeTypeConst.BZ.symbol) )
        var addNIRewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.NI.symbol, sumRewards(savePoint.rewards,BlockTypeTypeConst.NI.symbol) )
        var addBPRewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.BP.symbol, sumRewards(savePoint.rewards,BlockTypeTypeConst.BP.symbol) )
        var addR1RewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.R1.symbol, sumRewards(savePoint.rewards,BlockTypeTypeConst.R1.symbol) )
        var addR2RewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.R2.symbol, sumRewards(savePoint.rewards,BlockTypeTypeConst.R2.symbol) )
        var addR3RewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.R3.symbol, sumRewards(savePoint.rewards,BlockTypeTypeConst.R3.symbol) )
        

        var grantMaterial1: PlayFabServerModels.GrantItemsToUserRequest = { ItemIds: [], PlayFabId: playFabId }
        var grantMaterial2: PlayFabServerModels.GrantItemsToUserRequest = { ItemIds: [], PlayFabId: playFabId }
        var grantMaterial3: PlayFabServerModels.GrantItemsToUserRequest = { ItemIds: [], PlayFabId: playFabId }
        var grantBronzeShoe1: PlayFabServerModels.GrantItemsToUserRequest = { ItemIds: [], PlayFabId: playFabId }
        var grantTicketRaffleCoinBag: PlayFabServerModels.GrantItemsToUserRequest = { ItemIds: [], PlayFabId: playFabId }

        addMaterialToUser( grantMaterial1,BlockTypeTypeConst.M1,savePoint.material1Count )
        addMaterialToUser( grantMaterial2,BlockTypeTypeConst.M2,savePoint.material2Count )
        addMaterialToUser( grantMaterial3,BlockTypeTypeConst.M3,savePoint.material3Count )
        //pull from rewards
        addMaterialToUser( grantBronzeShoe1,BlockTypeTypeConst.BRONZE_SHOE1,sumRewards(savePoint.rewards,BlockTypeTypeConst.BRONZE_SHOE1.itemId) )
        addMaterialToUser( grantTicketRaffleCoinBag,BlockTypeTypeConst.TICKET_RAFFLE_COIN_BAG,sumRewards(savePoint.rewards,BlockTypeTypeConst.TICKET_RAFFLE_COIN_BAG.itemId) )
        
        //buy stats
        //coin cap, xp, raffle
        var addStatRaffleCoinBag = createAddUserStat( playFabId, BlockTypeTypeConst.STAT_RAFFLE_COIN_BAG, sumRewards(savePoint.rewards,BlockTypeTypeConst.STAT_RAFFLE_COIN_BAG.itemId) )
        //var addStatRaffleCoinBag = createAddUserStat( playFabId, BlockTypeTypeConst.RAFFLE_COIN_BAG, sumRewards(savePoint.rewards,BlockTypeTypeConst.RAFFLE_COIN_BAG.itemId) )
        //redeemable

        //this.addMaterialToUser( grantMaterials,BlockTypeTypeConst.C1,savePoint.container1Count )
        
        var addGuestPlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest= { 
          Amount: player.coinGuestCount,
          PlayFabId: playFabId,
          // Name of the virtual currency which is to be incremented.
          VirtualCurrency: (this.guestCoinType) ? this.guestCoinType.symbol : ''
        }

        var updatePlayerStats: PlayFabHelper.EndLevelUpdatePlayerStatsRequest = {
          playFabId: playFabId,
          //because we are using coinMultiplier during the coin adding process
          //not passing it here to be applied again
          coinMultiplier: 1,//(this.guestCoinType) ? 1 : playerData.serverSide.coinMultiplier,
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
          addBZRewardCurrency: addBZRewardCurrency,
          addNIRewardCurrency: addNIRewardCurrency,
          addBPRewardCurrency: addBPRewardCurrency,
          
          grantMaterial1: grantMaterial1,
          grantMaterial2: grantMaterial2,
          grantMaterial3: grantMaterial3,
          grantBronzeShoe: grantBronzeShoe1,

          addGuestCurrency: addGuestPlayerCurrency,

          addStatRaffleCoinBag: addStatRaffleCoinBag,
          grantTicketRaffleCoinBag: grantTicketRaffleCoinBag,
          //playerCombinedInfo: getPlayerCombinedInfo
        }
  
        const promise = PlayFabHelper.EndLevelGivePlayerUpdatePlayerStats(updatePlayerStats,this.playFabDataUtils)
        
        const host = this
        
        const guestCoinType = this.guestCoinType
        promise.then(function(result:PlayFabHelper.EndLevelUpdatePlayerStatsResult){
            console.log("XXXXX updatePlayerStats promise.EndLevelGivePlayerUpdatePlayerStats " + p + " " + player.id,result);
            //myRoom.authResult = result;

            if(result.endGameResult && guestCoinType){ 
              result.endGameResult.guestCoinName = guestCoinType.name
            }
            /*
            //is after X time
            //during save can we pop this off sooner?
            //resetting save point
            player.pastSavePoints.push( savePoint )
            const newSavePoint = new PlayerSavePoint()
            host.resetPlayer( newSavePoint )
            player.currentSavePoint = newSavePoint
            */
            
            player.saveInProgress = false
    
            //TODO sum these up
            playerData.serverSide.endGameResult = result.endGameResult
            //client.send("announce",'TODO show game finished stats')
        }).catch(function(error:PlayFabServerModels.ModifyUserVirtualCurrencyResult){
          console.log("promise.EndLevelGivePlayerUpdatePlayerStats FAILED!!!",error);
          //FIXME TODO restore what we were unable to save for next time?  depends on the error
          //do we pop it back out?
          player.saveInProgress = false
        })

        promises.push(promise)

        loopCount++;
      }

      console.log("updatePlayerStats loopCount" + loopCount )
      

      //promises.push( sleep(8000) )


      return Promise.all( promises ).then(function(result){
        console.log("XXXXX updatePlayerStats all promised completed " , result)
        return result;
      })
  }


  getPlayerData(sessionId:string): PlayerData {
    return {serverSide: this.playerServerSideData[sessionId],clientSide: this.state.players.get(sessionId) }
  }

  resetCoinData(){
    if (this.blockPoolList.length > 0) {
      // clear previous blocks
      this.blockPoolList = []
    }
    if (this.blockList.length > 0) {
      // clear previous blocks
      this.blockList = []
    }
    if (this.state.blocks.size > 0) {
      // clear previous blocks
      //clear is not donig it, call delete

      const ids:string[] = []
      this.state.blocks.forEach((value: Block, key: string)=>{
        ids.push(value.id)
      })
      //console.log("resetCoinData.deleteing",ids)
      for(const p in ids){
        this.state.blocks.delete(ids[p])
      }

      //this.state.blocks.clear();
    }
  }
  getCurrentTime(){
    return this.clock.currentTime
  }
  handleUnexpectedError(CLASSNAME: string, roomId: string, METHOD_NAME: string, args:any, msg: string, client: Client, e: any,supressRethrow?:boolean) {
      log(CLASSNAME,roomId,METHOD_NAME, "UNHANDLED ERROR OCCURED!!!", "CLASSNAME",CLASSNAME, "roomId", roomId, "METHOD_NAME",METHOD_NAME)
      log(CLASSNAME,roomId,METHOD_NAME, "UNHANDLED ERROR OCCURED!!!", "CLASSNAME",CLASSNAME, "roomId", roomId, "METHOD_NAME",METHOD_NAME, "args",args, "msg", msg, "client",client?.sessionId, "error", e);
      log(CLASSNAME,roomId,METHOD_NAME, "UNHANDLED ERROR OCCURED!!!", "CLASSNAME",CLASSNAME, "roomId", roomId, "METHOD_NAME",METHOD_NAME)
      if(!CONFIG.SILENCE_UNHANDLED_ERRORS){
        if(supressRethrow !== undefined && supressRethrow){
          log(CLASSNAME,roomId,METHOD_NAME, "UNHANDLED ERROR OCCURED!!! supressRethrow enabled so not throwing supressRethrow:"+supressRethrow, "CLASSNAME",CLASSNAME, "roomId", roomId, "METHOD_NAME",METHOD_NAME)
        }else{
          throw e
        }
      }
  }
  //FIXME easily override the chain call to inject new values if get 3 level inheritance, add new helper
  async setUp(coinDataOptions:serverStateSpec.CoinRoomDataOptions) {

    this.resetCoinData()
    
    //set it to now
    this.state.serverTime = this.getCurrentTime()
    //set it now and let server update with better time
    this.state.playFabTime = this.getCurrentTime()

    //hoping this is fast, if not do we have wait condition, should we wait?
    //combine it with waiting for fetchAndStoreRemoteConfig?
    PlayFabHelper.GetTime({}).then((val:PlayFabServerModels.GetTimeResult)=>{
      log(CLASSNAME,this.getLogRoomIdent(),"PlayFabHelper.GetTime"," result",val)

      this.state.serverTime = this.getCurrentTime()
      this.state.playFabTime = Date.parse( val.Time )

      log(CLASSNAME,this.getLogRoomIdent(),"PlayFabHelper.GetTime"," result",val,new Date(this.state.playFabTime).toUTCString())
    }).catch((error:any)=>{
      log(CLASSNAME,this.getLogRoomIdent(),"PlayFabHelper.GetTime","ERROR!!! failed to get playfab server time. using this server time instead. playFabTime may be off by a bit",error)
    })

    //drives coin distribution logic
    //minable reward logic
    //try{
      await this.fetchAndStoreRemoteConfig()
    //}catch(e){
    //  log(CLASSNAME,this.getLogRoomIdent(),"fetchAndStoreRemoteConfig","ERROR!!! failed",e);
    //}
    //try{
      //TODO cache this per server, not per room
      await this.fetchAndStorePlayfabData()
    //}catch(e){
    //  log(CLASSNAME,this.getLogRoomIdent(),"fetchAndStorePlayfabData","ERROR!!! failed",e);
    //}

    

    this.setupCoins()


    this.currentHeight = 0;
    this.isFinished = false;
    this.isStarted = false


    // reset all player's score position
    this.state.players.forEach((player) => {
      this.resetPlayer(player)
      if(player.currentSavePoint) this.resetPlayer(player.currentSavePoint)
    });


    const defaultBuyables:serverStateSpec.TrackFeatureInstDef[] = []
    const defaultMinables:serverStateSpec.MinableTypeDef[] = [
      /*{
        id:"minable.rock1",
        name:"Rock1",
        type:"minable.rock1",
        enabled:true,
        spawnDef:{
          concurrentMax:2,
          expireTime:[-1], //never expire
          respawnTime:[-1], //immediate respawn
          //coolDownTime:-1,//no cooldown
          zones:[
            {position: {x:1,y:1,z:1}},
            {position: {x:2,y:1,z:1}},
            {position: {x:3,y:1,z:1}},
            {position: {x:4,y:1,z:1}},
          ]
        }
      } */
    ]

    let trackFeatMinables = {
        minables: defaultMinables,
        buyables: defaultBuyables
    }

    if(coinDataOptions){

      //this.state.raceData.id = raceDataOptions.levelId
      //this.state.levelData.id = raceDataOptions.levelId
      trackFeatMinables = 
          coinDataOptions.featuresDefinition !== undefined ? coinDataOptions.featuresDefinition : {
              minables: defaultMinables, buyables: []
          }
    }
    this.state.levelData._featureDef = trackFeatMinables

    this.trackFeatureUtil = new BaseCoinRoomTrackFeatureUtil(this.roomId,this.state,this.clock,this.playFabDataUtils)

    const trackFeatures = this.setupRaceTrackFeatures();

    const retval: serverStateSpec.LevelDataState = {
        id: "TODO",//this.state.battleData.id,
        name: "TODO",//this.state.battleData.name,
        trackFeatures: new Map(),
        localTrackFeatures: trackFeatures,
        //maxLaps: this.state.battleData.maxLaps,
        //trackPath: [],
    };

    //TODO this will copy and make features in level
    this.state.levelData.copyFrom(retval,this.getCurrentTime());

    //distribute track features
    //this.distributeTrackFeatures()

    //this.distributeTrackFeatures()

    return
  }

  distributeTrackFeatures(type?:string){
    const METHOD_NAME = "distributeTrackFeatures()"
    logEntry(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,{"type":type})

    this.trackFeatureUtil.distributeTrackFeatures(type)
  }
  
  setupRaceTrackFeatures(){ 
    const METHOD_NAME = "setupRaceTrackFeatures()"

    const featureDef = this.state.levelData._featureDef

    logEntry(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,[featureDef])

    return this.trackFeatureUtil.setupRaceTrackFeatures()
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
          CONFIG.CHECK_REMOTE_CONFIG_API_CALL + CONFIG.CHECK_REMOTE_CONFIG_API_CALL_ROOM_ID + this.roomName //+ publicKey
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
      
          log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,'config response: ', JSON.stringify(configData))
      
          this.applyRemoteConfig(configData)

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
    })/*.catch((error:any)=>{
      log(CLASSNAME,this.getLogRoomIdent(),"ERROR FAILED fetchAndStoreRemoteConfig",error)
    })*/
  }
  //called from inside setup()
  applyRemoteConfig(configData: { data: serverStateSpec.RemoteBaseCoinRoomConfig; }) {
    const METHOD_NAME = "applyRemoteConfig"
    if(configData){
      //this.levelDurationThreshold = 0//when reached it is over

      this.levelDurationEnabled = false
      //this.levelDurationIncrement = -1 //direction of counter
      this.enableOnExpireRespawn = true
      this.enableOnCollectRespawn = CONFIG.GAME_ININITE_MODE_ON_COLLECT_RESPAWN_ENABLED
      //below 0 is undefiend
      if(CONFIG.GAME_ININITE_MODE_ON_COLLECT_RESPAWN_DELAY > -1){
        this.onCollectRespawnTimeInSeconds = CONFIG.GAME_ININITE_MODE_ON_COLLECT_RESPAWN_DELAY
      }

      if(configData.data.items){
        
        //this.levelDurationIncrement = -1 //direction of counter
        if(configData.data.items.enableOnExpireRespawn !== undefined) this.enableOnExpireRespawn = configData.data.items.enableOnExpireRespawn
        if(configData.data.items.expireTimeInSeconds !== undefined) this.expireTimeInSeconds = configData.data.items.expireTimeInSeconds
        if(configData.data.items.enableOnCollectRespawn !== undefined) this.enableOnCollectRespawn = configData.data.items.enableOnCollectRespawn
        //below 0 is undefiend
        if(configData.data.items.onCollectRespawnTimeInSeconds !== undefined) this.onCollectRespawnTimeInSeconds = configData.data.items.onCollectRespawnTimeInSeconds
        
        if(configData.data.items.spawnFrequency){
          const spawnMap = new Map<string,serverStateSpec.CoinSpawnDef>()
          spawnMap.set(BlockTypeTypeConst.GC.symbol,this.gCSpawn)
          spawnMap.set(BlockTypeTypeConst.MC.symbol,this.mCSpawn)
          
          spawnMap.set(BlockTypeTypeConst.VB.symbol,this.vbSpawn)
          spawnMap.set(BlockTypeTypeConst.AC.symbol,this.aCSpawn)
          spawnMap.set(BlockTypeTypeConst.ZC.symbol,this.zCSpawn)
          spawnMap.set(BlockTypeTypeConst.RC.symbol,this.rCSpawn)

          spawnMap.set(BlockTypeTypeConst.BZ.symbol,this.bZSpawn)
          spawnMap.set(BlockTypeTypeConst.R1.symbol,this.r1Spawn)
          spawnMap.set(BlockTypeTypeConst.R2.symbol,this.r2Spawn)
          spawnMap.set(BlockTypeTypeConst.R3.symbol,this.r3Spawn)
          spawnMap.set(BlockTypeTypeConst.BP.symbol,this.bpSpawn)
          spawnMap.set(BlockTypeTypeConst.NI.symbol,this.niSpawn)
          
          for(const p of configData.data.items.spawnFrequency){
            const lookup = spawnMap.get(p.id)
            if(lookup){
              if(p.spawnDef){
                log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME," copying",p,"over",lookup)

                lookup.amount = p.spawnDef.amount
                lookup.max = p.spawnDef.max
                lookup.min = p.spawnDef.min
                lookup.percent = p.spawnDef.percent
              }
            }else{
              log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME," unable to find copying",p,"over",)
            }
          }
        }
      }
      if(configData.data.saveInterval && configData.data.saveInterval.value){
        this.saveInterval = configData.data.saveInterval.value
        log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME," copying", "this.saveInterval",configData.data.saveInterval,this.saveInterval)
      }
      if(configData.data.coinCap ){
        //short term, long term 
        


        this.coinCapEnabled = configData.data.coinCap.enabled
        this.coinCapOverageReduction = configData.data.coinCap.overageReduction
        if(this.coinCapEnabled && (this.clientVersion === undefined || this.clientVersion < 4)){
          log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME," WARNING", "this.coinCap",configData.data.coinCap,this.coinCapEnabled,"client version wrong",this.clientVersion,"need v4 or greater")
        }
        
        log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME," copying", "this.coinCap.enabled",configData.data.coinCap.enabled,this.coinCapEnabled)
        log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME," copying", "this.coinCap",configData.data.coinCap,this.coinCapOverageReduction)

        if(configData.data.coinCap.formula){
          CONFIG.GAME_DAILY_COIN_MAX_FORMULA_CONST.x = configData.data.coinCap.formula.x
          CONFIG.GAME_DAILY_COIN_MAX_FORMULA_CONST.y = configData.data.coinCap.formula.y
          CONFIG.GAME_DAILY_COIN_MAX_FORMULA_CONST.max = configData.data.coinCap.formula.max
          CONFIG.GAME_DAILY_COIN_MAX_FORMULA_CONST.min = configData.data.coinCap.formula.min
          CONFIG.GAME_DAILY_COIN_MAX_FORMULA_CONST.levelOffset = configData.data.coinCap.formula.levelOffset

          log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME," copying", "this.coinCap.formula",configData.data.coinCap.formula,CONFIG.GAME_DAILY_COIN_MAX_FORMULA_CONST)
        }

      }else if(configData.data.coinCap ){
        
      }
    }
  }

  async fetchAndStorePlayfabData(){
    const METHOD_NAME = "fetchAndStorePlayfabData"
    const promises:Promise<any>[] = [];

    const playfabDataUtils = this.playFabDataUtils = new PlayFabDataUtils()
    const CatalogVersion = CONFIG.CATALOG_VERSION_MINABLES
    const catalogItmsReq:PlayFabServerModels.GetCatalogItemsRequest={
      CatalogVersion:CatalogVersion
    }
    const catalogPromise = PlayFabHelper.GetCatalogItems(catalogItmsReq).then((result:PlayFabServerModels.GetCatalogItemsResult)=>{
      playfabDataUtils.catalogItems = result
      return result
    })
    promises.push(catalogPromise)

    const dropTableReq:PlayFabAdminModels.GetRandomResultTablesRequest={
      CatalogVersion:CatalogVersion
    }
    const dropTablePromise = PlayFabHelper.GetRandomResultTablesAdmin(dropTableReq).then((result:PlayFabServerModels.GetRandomResultTablesResult)=>{
      playfabDataUtils.dropTables = result
      return result
    })
    promises.push(dropTablePromise)

    return Promise.all( promises ).then(function(result){
      console.log(METHOD_NAME,". all promised completed " , result)
      //return retData;

      playfabDataUtils.init()
      return;
    })
  }
  hasDataToSave(player:serverStateSpec.IPlayer){
    const hasDataToSave = 
         player.coinsCollected > 0 || player.score > 0
      || player.coinMcCount > 0 || player.coinGcCount > 0

      || player.coinVbCount > 0 || player.coinVbCount > 0
      || player.coinAcCount > 0 || player.coinAcCount > 0
      || player.coinZcCount > 0 || player.coinZcCount > 0
      || player.coinRcCount > 0 || player.coinRcCount > 0

      || player.material1Count > 0 || player.material2Count > 0
      || player.material3Count > 0 || player.container1Count > 0

      || player.bronzeCollected > 0 || player.nitroCollected > 0
      || player.petroCollected > 0 || player.rock1Collected > 0
      || player.rock2Collected > 0 || player.rock3Collected > 0

      || player.rewards.length > 0

      //|| player.b > 0

    console.log("hasDataToSave",player,hasDataToSave)
    return hasDataToSave
  }

  resetPlayerCollectedItems(player:serverStateSpec.IPlayer){
    player.coinsCollected = 0;
    //player.coinsCollectedEpoch= 0;//do not reset this or will break leveling logic
    player.score = 0;
    player.coinGcCount = 0;
    player.coinMcCount = 0;

    player.coinVbCount = 0;
    player.coinAcCount = 0;
    player.coinZcCount = 0;
    player.coinRcCount = 0;

    player.rock1Collected = 0;
    player.rock2Collected = 0;
    player.rock3Collected = 0;
    player.nitroCollected = 0;
    player.bronzeCollected = 0;
    player.petroCollected = 0;

    player.bronzeShoeCollected = 0;

    player.rewards = []
    //player.pastSavePoints = []
    player.material1Count = 0;
    player.material2Count = 0;
    player.material3Count = 0;
    player.container1Count = 0;

    player.coinGuestCount = 0;
    player.saveInProgress = false
    
  }
  resetPlayer(player:serverStateSpec.IPlayer){
    
    //player.rewards = []
    player.pastSavePoints = []
    
    player.saveInProgress = false

    this.resetPlayerCollectedItems(player)
    
  }
  copyPlayerData(src:serverStateSpec.IPlayer,dest:serverStateSpec.IPlayer){
    dest.coinsCollected = src.coinsCollected
    dest.score = src.score
    dest.coinGcCount = src.coinGcCount;
    dest.coinMcCount = src.coinMcCount;

    dest.coinVbCount = src.coinVbCount;
    dest.coinAcCount = src.coinAcCount;
    dest.coinZcCount = src.coinZcCount;
    dest.coinRcCount = src.coinRcCount;

    dest.rock1Collected = src.rock1Collected;
    dest.rock2Collected = src.rock2Collected;
    dest.rock3Collected = src.rock3Collected;
    dest.nitroCollected = src.nitroCollected;
    dest.bronzeCollected = src.bronzeCollected;
    dest.petroCollected = src.petroCollected;
    
    //dest.rewards = src
    //dest.pastSavePoints = []
    dest.material1Count = src.material1Count;
    dest.material2Count = src.material2Count;
    dest.material3Count = src.material3Count;
    dest.container1Count = src.container1Count;

    dest.coinGuestCount = src.coinGuestCount;
    dest.saveInProgress = false
    
  }

 //colyseus tracks changes, so if i reuse a block i must dirty its fields or it will not send them as changes
 //i could also just make new blocks but then i have to clean up the old ones in my blockList and blockPoolList
 //or in some other way figure out how to decouple block state from block general info
 //for now will do a make dirty.  could also add a replaceBlockWith() and do the swap in my tracked fields
  makeAllFieldsDirty(block:Block){
    const origId = block.id
    const origType = block.type

    block.id += "_"
    block.id = origId

    block.x ++ ; block.x --
    block.y ++ ; block.y --
    block.z ++ ; block.z --

    block.createTime ++ ; block.createTime --
    block.expireTime ++ ; block.expireTime --
    block.value ++ ; block.value --
    
    block.type += "_"
    block.type = origType

    block.visible = !block.visible; block.visible = !block.visible
  }
  

  returnBlockToPool(block:Block){
    if(block !== undefined){
      //console.log("putting back in pool ",block.id)
      this.blockPoolList.push(block)
    }else{
      //console.log("unable to put back in pool ",block)
    }
  }

  preAddBlockToSpawnMgr(block:Block,event:string,immediate:boolean){

  }
  //will be added to list to be spawned when timer fires
  addToSpawnMgr(block:Block,event:string,immediate:boolean){
    //this.blockSpawnList.push(block)

    //must wait for state to sync before changing it again

    //have own timer for this???
    //1 clock keeps track of all the clocks it appears

    //dont go below 500 ms, to give state time to sync up
    //500 is arbitrary guess as safe time syncup time

    const respawnTime = Math.max(500, block.createTime - Date.now() )

    if(immediate || respawnTime <= 0){
      
      //console.log(event,".adding to state block ",block.id,block.x,"immediate",immediate, " respawnTime: ",respawnTime,"ms")
      this.state.blocks.set(block.id,block)
    }else{
      console.log("addToSpawnMgr",event,".queue to be added ",block.id,"type",block.type,"x",block.x,"immediate",immediate, " after ",respawnTime,"ms")
      this.clock.setTimeout(()=>{
        console.log("addToSpawnMgr",event,".adding to state block ",block.id,"type",block.type,"x",block.x,"immediate",immediate, " after ",respawnTime,"ms")
        //do call back to allow for any quick final changes
        this.preAddBlockToSpawnMgr(block,event,immediate);
        this.state.blocks.set(block.id,block)
      }, respawnTime)   
    }
  }

  //FIXME, rethink the pool, do we need a pool server side?  just make new block?
  //if needed to prevent overspawning just keep track of state.block.size and dont go over MAX
  getBlockFromPool(blockToFind?: Block){
    //this.factoryNewBlock()
    if(this.blockPoolList.length > 0){
      
      let block
      
      if(blockToFind !== undefined){
        const idx = this.blockPoolList.indexOf(blockToFind)
        block = this.blockPoolList[idx];
        this.blockPoolList.splice(idx, 1);
        console.log("getBlockFromPool","returning blockToFind ",block.id,"poolSize:",this.blockPoolList.length,"found block:",block?.id)
      }else{
        block = this.blockPoolList.shift()  
        console.log("getBlockFromPool","returning block ",block.id,"poolSize:",this.blockPoolList.length)
      }
      
      return block
    }else{
      console.log("getBlockFromPool","ERROR error, no blocks in pull to spawn new ",this.blockPoolList.length)
    }
  }
  
  adjustBlockForJumpHeight(block: Block) {
    block.y += Math.abs( CONFIG.COIN_HEIGHT_ADJUSTED * 4.6 )
  }

  getMainCoin(): string {
    //BlockTypeTypeConst.BZ.symbol //BlockTypeTypeConst.GC.symbol
    //if client not passing clientVersion or is version 1 its too old to support this
    //if no client version then its default GC, if has version +1 its BZ
    return this.clientVersion === undefined || this.clientVersion <= 1 ? BlockTypeTypeConst.GC.symbol : BlockTypeTypeConst.BZ.symbol;
  }
  initCoinsPool(){
    const METHOD_NAME = "initCoinsPool"
    const MAIN_COIN = this.getMainCoin()
    //const blocks = []
    let totalItems = 0
    this.levelCoinPos.forEach((coin, key)=> {
      let blockType = MAIN_COIN
      const block = this.factoryNewBlock({id:`coin-${key}`, x:coin[0], y:coin[1]+CONFIG.COIN_HEIGHT_ADJUSTED, z:coin[2], type: blockType, visible:true})
      totalItems++
      //blocks.push(block)
    })
    console.log(METHOD_NAME,"placed","spawnDef","totalItems",totalItems,"this.maxBlocksCollectable",this.maxBlocksCollectable)
    if(MAIN_COIN == BlockTypeTypeConst.BZ.symbol){
      //must distribute GC again
      this.spawnOtherTypes( this.gCSpawn, CONFIG.MAX_SPAWN_SEARCH_TRIES, MAIN_COIN,BlockTypeTypeConst.GC.symbol )
    }else if(this.clientVersion === undefined || this.clientVersion > 1 ){
      // distribute BZ, not a thing till version 2 of client so if not v2 dont do anything
      this.spawnOtherTypes( this.bZSpawn, CONFIG.MAX_SPAWN_SEARCH_TRIES, MAIN_COIN,BlockTypeTypeConst.BZ.symbol )
    }
    if(this.clientVersion === undefined || this.clientVersion > 1 ){
      //spawn petro and nitro
    }
    //how many
    this.spawnOtherTypes( this.mCSpawn, CONFIG.MAX_SPAWN_SEARCH_TRIES, MAIN_COIN,BlockTypeTypeConst.MC.symbol )

    //how many - add spawn for VB
    //this.spawnOtherTypes( this.mCSpawn, CONFIG.MAX_SPAWN_SEARCH_TRIES, MAIN_COIN,BlockTypeTypeConst.MC.symbol )
    
    //FIXME! change this to array of types, loop thru and try
    if(CONFIG.SPAWN_MATERIAL_ITEMS_ENABLED){
      
      this.spawnOtherTypes( this.maxMaterial1Spawn, CONFIG.MAX_SPAWN_SEARCH_TRIES, MAIN_COIN,BlockTypeTypeConst.M1.symbol )
      this.spawnOtherTypes( this.maxMaterial2Spawn, CONFIG.MAX_SPAWN_SEARCH_TRIES, MAIN_COIN,BlockTypeTypeConst.M2.symbol )
      this.spawnOtherTypes( this.maxMaterial3Spawn, CONFIG.MAX_SPAWN_SEARCH_TRIES, MAIN_COIN,BlockTypeTypeConst.M3.symbol )

      
    }
    
    //TODO VC MATERIALS
    if(false){
      this.spawnOtherTypes( this.r1Spawn, CONFIG.MAX_SPAWN_SEARCH_TRIES, MAIN_COIN,BlockTypeTypeConst.R1.symbol )
      this.spawnOtherTypes( this.r2Spawn, CONFIG.MAX_SPAWN_SEARCH_TRIES, MAIN_COIN,BlockTypeTypeConst.R2.symbol )
      this.spawnOtherTypes( this.r3Spawn, CONFIG.MAX_SPAWN_SEARCH_TRIES, MAIN_COIN,BlockTypeTypeConst.R3.symbol )

      this.spawnOtherTypes( this.bpSpawn, CONFIG.MAX_SPAWN_SEARCH_TRIES, MAIN_COIN,BlockTypeTypeConst.BP.symbol )
      this.spawnOtherTypes( this.niSpawn, CONFIG.MAX_SPAWN_SEARCH_TRIES, MAIN_COIN,BlockTypeTypeConst.NI.symbol )
    }

    this.spawnOtherTypes( this.vbSpawn, CONFIG.MAX_SPAWN_SEARCH_TRIES, MAIN_COIN,BlockTypeTypeConst.VB.symbol )
    this.spawnOtherTypes( this.aCSpawn, CONFIG.MAX_SPAWN_SEARCH_TRIES, MAIN_COIN,BlockTypeTypeConst.AC.symbol )
    this.spawnOtherTypes( this.zCSpawn, CONFIG.MAX_SPAWN_SEARCH_TRIES, MAIN_COIN,BlockTypeTypeConst.ZC.symbol )
    this.spawnOtherTypes( this.rCSpawn, CONFIG.MAX_SPAWN_SEARCH_TRIES, MAIN_COIN,BlockTypeTypeConst.RC.symbol )

    /*const maxMC = Math.min(this.blockList.length,this.maxMCSpawn)
    for(let x=0;x<maxMC;x++){
      const index = Math.floor(Math.random() * this.blockList.length)
      const block = this.blockList[index]
      if(block.type == BlockTypeTypeConst.GC.symbol){
        block.type = BlockTypeTypeConst.MC.symbol
      }else{
        x--//keep looping
      }
    }*/
  }

  spawnOtherTypes(spawnDef:serverStateSpec.CoinSpawnDef,maxAttempts:number,swapSymbol:string,replaceTypeSymbol:string){
    const METHOD_NAME = "spawnOtherTypes"
    //how many
    const totalItems = this.blockList.length
    //if < 1 let it at least be 1
    const percentAmount =  spawnDef.percent && spawnDef.percent > 0 && (totalItems * spawnDef.percent) < 1 
                          ? 1 : Math.floor(totalItems * spawnDef.percent)
    const targetAmount = (spawnDef.amount !== undefined ? spawnDef.amount : percentAmount)
    const maxAllowed:number = Math.min( targetAmount,spawnDef.max)

    let attemptCnt = 0
    let replaceCnt = 0
    const maxMC = Math.min(this.blockList.length,maxAllowed)
    for(let x=0;x<maxMC;x++){
      const index = Math.floor(Math.random() * this.blockList.length)
      const block = this.blockList[index]
      if(block.type === swapSymbol){
        block.type = replaceTypeSymbol
        replaceCnt++
      }else{
        x--//keep looping
      }
      if(attemptCnt > maxAttempts){
        console.log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"reached max attempts to place",replaceTypeSymbol,attemptCnt,maxAttempts)
        break;
      }
      attemptCnt++
    }
    console.log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"placed",replaceCnt,"spawnDef",spawnDef,"totalItems",totalItems,"percentAmount",percentAmount
      ,"targetAmount",targetAmount,"maxAllowed",maxAllowed,replaceTypeSymbol,"attemptCnt",attemptCnt,"maxAttempts",maxAttempts)
  }

  setupLevelCoinPos(){
    //pick coin config 
    this.levelCoinPos = coins
  }
  
  setupCoins() {
    this.setupLevelCoinPos()
    this.initCoinsPool()

    let skippedCoin = 0
    let jumpCoin = 0
    let counter = 0
    const skipEveryXCoin = CONFIG.COIN_SKIP_EVERY_N
    const jumpEveryXCoin = CONFIG.COIN_JUMP_EVERY_N
    //randomly shifts pick spot
    let skipCounterStartPos = Math.floor(Math.random() * skipEveryXCoin)
    let jumpCounterStartPos = Math.floor(Math.random() * jumpEveryXCoin)
    const skipType = CONFIG.COIN_SKIP_TYPE
    const jumpType = CONFIG.COIN_JUMP_TYPE

    for(const p in this.blockList){
      const block = this.blockList[p]
      switch(skipType){
        case 'random':
          //randomly pick
          skipCounterStartPos = Math.floor(Math.random() * skipEveryXCoin)
        break;
        default:  
      }
      switch(jumpType){
        case 'random':
          //randomly pick
          jumpCounterStartPos = Math.floor(Math.random() * jumpEveryXCoin)
        break;
        default:  
      }
      skipCounterStartPos = Math.floor(Math.random() * skipEveryXCoin)
      //even skip
      if(skipEveryXCoin == 0 || skipCounterStartPos % skipEveryXCoin != 0){
        if(jumpEveryXCoin != 0 && jumpCounterStartPos % jumpEveryXCoin == 0){
          this.adjustBlockForJumpHeight(block)
          jumpCoin++;
        }
        this.addToSpawnMgr(block,"setupCoins",true)
        //this.state.blocks.set(block.id,block)
      }else{
        //skip it
        skippedCoin++;
      }
      counter++;
    }
        
    if(CONFIG.GAME_MAX_COINS_COLLECTABLE_THRESHOLD > -1){
      this.maxBlocksCollectable = CONFIG.GAME_MAX_COINS_COLLECTABLE_THRESHOLD
    }else{
      //setting to state block size for now but nothing says it cannot grow or not match state block size (hidden coins for example)
      this.maxBlocksCollectable = this.state.blocks.size
    }

    this.state.totalCoins = this.levelCoinPos.length //should this be something else?
    
    console.log("setup total:",counter,'this.maxBlocksCollectable',this.maxBlocksCollectable," skipped",skippedCoin,'everyXCoin',skipEveryXCoin,'skipType',skipType,'jumpCoin',jumpCoin)
    //randomly change block type
    
  }

  //clock loop update, 1 second
  clockIntervalUpdate(elapsedTime:number,dt:number){
    const METHOD_NAME = "clockIntervalUpdate"
    //log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"elapsedTime",elapsedTime.toFixed(2),"dt",dt,"this.levelTime",this.levelTime,"this.saveInterval",this.saveInterval,"saveLapseTime",this.saveLapseTime,"timeSyncLapseTime",this.timeSyncLapseTime)
     //noop
     this.levelTime += dt
     this.saveLapseTime += dt
     this.timeSyncLapseTime += dt
     this.statVersionLapseTime += dt


     //check every 30 seconds? use promise to single thread the check
     if(this.statVersionLapseTime > 10000 ){
      this.statVersionLapseTime = 0
      const playFabDate = new Date(this.state.playFabTime)
      const host = this

      try{  
        //
        //https://{{TitleId}}.playfabapi.com/Admin/GetPlayerStatisticVersions?sdk=PostmanCollection-0.145.220406
        //better is https://learn.microsoft.com/en-us/gaming/playfab/api-references/events/title-statistic-version-changed
        //need to test
        //perform stat rollover check when near top of day
        if(host.lastStatVersionResult === undefined || (playFabDate.getUTCHours() === 0 && playFabDate.getUTCMinutes() < 15)){
          //do rollover check
          log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"COINCAP","DO ROLLOVER CHECK - playFabDate.hours",playFabDate.toUTCString(),playFabDate.getUTCHours(),"getMinutes",playFabDate.getUTCMinutes())

          getLatestStatVersionsAsync().then((result:StatVersionCheckResult)=>{
            log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"COINCAP","ROLLOVER CHECK - getLatestStatVersionsAsync",result ? result?.result?.StatisticVersions?.length : 'undefined')
            if(result !== undefined){
              this.checkLatestStatVersionResult(result)
            }
          }).catch((e)=>{
            console.log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,'getLatestStatVersionsAsync ERROR FAILED RETURNED: ',e)
          })
        }else{
          log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"COINCAP","NOT TIME FOR ROLLOVER CHECK - playFabDate.hours",playFabDate.toUTCString(),playFabDate.getUTCHours(),"getMinutes",playFabDate.getUTCMinutes())
        }
      }catch(e){
        console.log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"ERROR large try catch. getLatestStatVersionsAsync.FAILED",e);
      }

      try{
        if(host.lastStatVersionResultRaffle === undefined || (playFabDate.getUTCHours() === 0 && playFabDate.getUTCMinutes() < 15)){
          //do rollover check
          log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"RAFFLE","DO ROLLOVER CHECK - playFabDate.hours",playFabDate.toUTCString(),playFabDate.getUTCHours(),"getMinutes",playFabDate.getUTCMinutes())

          
          getLatestStatVersionsAsyncRaffle().then((result:StatVersionCheckResult)=>{
            log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"RAFFLE","ROLLOVER CHECK - getLatestStatVersionsAsyncRaffle",result ? result?.result?.StatisticVersions?.length : 'undefined')
            if(result !== undefined){
              
              this.checkLatestStatVersionResultRaffle(result)
              
            }
          }).catch((e)=>{
            console.log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,'getLatestStatVersionsAsyncRaffle ERROR FAILED RETURNED: ',e)
          })
        
        }else{
          log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"RAFFLE","NOT TIME FOR ROLLOVER CHECK - playFabDate.hours",playFabDate.toUTCString(),playFabDate.getUTCHours(),"getMinutes",playFabDate.getUTCMinutes())
        }
      }catch(e){
        console.log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"ERROR large try catch. getLatestStatVersionsAsyncRaffle.FAILED",e);
      }
    }


     //update every 10 seconds good?
     if(this.timeSyncLapseTime > 10000 ){
      this.timeSyncLapseTime = 0
      this.state.playFabTime += dt
      this.state.serverTime += dt
     }

     
     
     // 10000 saveLapseTime 15764
     if(this.saveLapseTime > this.saveInterval ){
      this.saveLapseTime = 0
      try{
        this.savePlayerData('auto-save')
      }catch(e){
        const supressRethrow = true
        this.handleUnexpectedError(CLASSNAME,this.roomId,"clockIntervalUpdate",[elapsedTime,dt],"",undefined,e,supressRethrow)
      }
     }
  }
  checkLatestStatVersionResult(result: StatVersionCheckResult) {
    const METHOD_NAME = "checkLatestStatVersionResult"
    const host = this
    if(!result || !result.result){
      log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"ERROR ROLLOVER CHECK failed result is undefined",result)
      return;
    }
    if(!host.lastStatVersionResult ){
        //new info
        log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"ROLLOVER CHECK - first time got list",host.lastStatVersionResult?.result?.StatisticVersions?.length)// , result?.result?.StatisticVersions?.length,result?.result?.StatisticVersions)
    }else if( host?.lastStatVersionResult?.result.StatisticVersions.length < result.result.StatisticVersions.length ){
      //new item in list
      log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"ROLLOVER CHECK - new item in list",host.lastStatVersionResult?.result?.StatisticVersions?.length , result?.result?.StatisticVersions?.length)//,result?.result?.StatisticVersions)

      log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"ROLLOVER CHECK DO FETCH update daily cap!!!")

      //fetch and reset 
      //has side affect of getting daily coin data
      this.savePlayerData('cap-roll-over')
    }else{
      log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"ROLLOVER CHECK - NO CHANGE",host.lastStatVersionResult?.result?.StatisticVersions?.length)// , result?.result?.StatisticVersions?.length,result?.result?.StatisticVersions)
    }
    host.lastStatVersionResult = result
  }
  checkLatestStatVersionResultRaffle(result: StatVersionCheckResult) {
    const METHOD_NAME = "checkLatestStatVersionResultRaffle"
    const host = this
    
    if(!result || !result.result){
      log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"ROLLOVER CHECK failed result is undefined",result)
      return;
    }
    
    if(!host.lastStatVersionResultRaffle ){
        //new info
        log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"ROLLOVER CHECK - first time got list",host.lastStatVersionResult?.result?.StatisticVersions?.length)// , result?.result?.StatisticVersions?.length,result?.result?.StatisticVersions)
         
        const statHostLen = result.result.StatisticVersions.length
        if(statHostLen >= 1){
          giveOutRewards( "raffle_coin_bag", result.result.StatisticVersions[statHostLen-1].Version ).then((val:any)=>{
            console.log('giveOutRewards.firstCheckon VERSION:',result.result.StatisticVersions[statHostLen-1].Version,' RETURNED: ', val)
          })
        }
        
    }else if( host?.lastStatVersionResultRaffle?.result.StatisticVersions.length < result.result.StatisticVersions.length ){
      //new item in list
      log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"ROLLOVER CHECK - new item in list",host.lastStatVersionResultRaffle?.result?.StatisticVersions?.length , result?.result?.StatisticVersions?.length)//,result?.result?.StatisticVersions)

      log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"ROLLOVER CHECK DO FETCH raffle!!!")

      //fetch and reset 
      //has side affect of getting daily coin data
      //
      //make call to 

      //raffle/admin/sync?raffleName=raffle_coin_bag
      //then
      //raffle/admin/pick-winners?raffleName=raffle_coin_bag&version=2
      const statHostLen = host?.lastStatVersionResultRaffle?.result.StatisticVersions.length
      giveOutRewards( "raffle_coin_bag", host?.lastStatVersionResultRaffle?.result.StatisticVersions[statHostLen-1].Version ).then((val:any)=>{
        console.log('giveOutRewards.firstCheck RETURNED: ', val)
        //TODO is this right, to call save player data here?  and if so at min need to pass better context
        //replace arg cap-roll-over with 'raffle_coin_bag'
        //goal is to force player to reload their data???
        this.savePlayerData('cap-roll-over')
      })
    }else{
      log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"ROLLOVER CHECK - NO CHANGE",host.lastStatVersionResultRaffle?.result?.StatisticVersions?.length)// , result?.result?.StatisticVersions?.length,result?.result?.StatisticVersions)
    }
    host.lastStatVersionResultRaffle = result
  }

  start(){

    // setup round countdown
    this.state.countdown = this.levelDuration;

    // make sure we clear previous interval
    this.clock.clear();

    console.log("pausing for a few seconds to give sdk time to place coins")
    //set timer to start
    this.clock.setTimeout(()=>{
      console.log("pause over. game starting pool",this.blockPoolList.length)
      this.clock.clear();
      
      this.distributeTrackFeatures()
      //this.distributeTrackFeatures()

      this.clock.setInterval(() => {
        try{
          this.clockIntervalUpdate(this.clock.elapsedTime,this.clock.deltaTime+1000)
        }catch(e){
          const supressRethrow = true
          this.handleUnexpectedError(CLASSNAME,this.roomId,"this.clock.setInterval",undefined,"",undefined,e,supressRethrow)
        }
        if (
          (this.levelDurationIncrement < 0 && this.state.countdown > this.levelDurationThreshold)//counts down
          || (this.levelDurationIncrement < 0 && this.state.countdown < this.levelDurationThreshold) //counts up
          ) {
          if (!this.isFinished) {
            this.state.countdown += this.levelDurationIncrement;
          }
        } else {
          //this.broadcast("restart");

          // countdown reached zero! restart the game!
          this.gameEndedNotify({timedOut:false})
        }
      }, 1000);

      this.isStarted = true

      this.broadcast("start");
    },this.startGameWaitTime) //delay start for 4 seconds to give client a chance to fire up
  } 

  collectBlock(client: Client,playerData:PlayerData,id: string) {
    //TODO fix race condition
    const blockToCollect = this.state.blocks.get( id );
    
    if(blockToCollect === null || blockToCollect === undefined ){
      //TODO track collected block / call back to remove from scene if somehow remains
      console.log("collectBlock block not found. collected already or not real " + id)
      return;
    }

    const player = playerData.clientSide;

    
    const maxCoinsPerLevel = getCoinCap( Math.floor(player.currentLevel),CONFIG.GAME_DAILY_COIN_MAX_FORMULA_CONST)
    
    //this.state.playFabTime
    //this.state.levelData.coinsCollectedDailyVersion
    /*if(this.coinCapEnabled){
      player.coinCollectDailyCapPercent = player.coinsCollectedDaily / maxCoinsPerLevel
    }else{
      player.coinCollectDailyCapPercent = -1
    }*/
    
    const hitCoinCap = player.coinsCollectedDaily >= maxCoinsPerLevel //player.coinCollectDailyCapPercent >= 1
    //set it to .1 if its every 10 == 1
    const coinCapOverageReduction = hitCoinCap ? this.coinCapOverageReduction : 1
    
    const playfabId = playerData?.serverSide?.playFabData ? playerData.serverSide.playFabData.id : "failed-to-get-playfab-id"

    blockToCollect.collectedBy = player.id+";;" + player.name+";;fabid-"+playfabId
    player.coinsCollected += 1 * playerData.serverSide.coinMultiplier * coinCapOverageReduction
    player.coinsCollectedEpoch += 1 * playerData.serverSide.coinMultiplier * coinCapOverageReduction
    player.coinsCollectedDaily += 1 * playerData.serverSide.coinMultiplier * coinCapOverageReduction
    
    player.currentSavePoint.coinsCollected += 1 * playerData.serverSide.coinMultiplier * coinCapOverageReduction
    player.currentSavePoint.coinsCollectedEpoch += 1 * playerData.serverSide.coinMultiplier * coinCapOverageReduction
    player.currentSavePoint.coinsCollectedDaily += 1 * playerData.serverSide.coinMultiplier * coinCapOverageReduction
    
    
    //console.log("coin ",blockToCollect.type,"val",blockToCollect.value,"gc",player.coinGcCount,"mc",player.coinMcCount,"m1",player.material1Count,player.material2Count,player.material3Count)

    //TODO need to determine type
    if(blockToCollect.type==BlockTypeTypeConst.GC.symbol){
      player.coinGcCount += blockToCollect.value * playerData.serverSide.coinMultiplier * coinCapOverageReduction
      player.currentSavePoint.coinGcCount += blockToCollect.value * playerData.serverSide.coinMultiplier * coinCapOverageReduction
    }else if(blockToCollect.type==BlockTypeTypeConst.MC.symbol){
      player.coinMcCount += blockToCollect.value * playerData.serverSide.coinMultiplier * coinCapOverageReduction
      player.currentSavePoint.coinMcCount += blockToCollect.value * playerData.serverSide.coinMultiplier * coinCapOverageReduction
    

    }else if(blockToCollect.type==BlockTypeTypeConst.VB.symbol){
      player.coinVbCount += blockToCollect.value * playerData.serverSide.coinMultiplier * coinCapOverageReduction
      player.currentSavePoint.coinVbCount += blockToCollect.value * playerData.serverSide.coinMultiplier * coinCapOverageReduction
    }else if(blockToCollect.type==BlockTypeTypeConst.AC.symbol){
      player.coinAcCount += blockToCollect.value * playerData.serverSide.coinMultiplier * coinCapOverageReduction
      player.currentSavePoint.coinAcCount += blockToCollect.value * playerData.serverSide.coinMultiplier * coinCapOverageReduction
    }else if(blockToCollect.type==BlockTypeTypeConst.ZC.symbol){
      player.coinZcCount += blockToCollect.value * playerData.serverSide.coinMultiplier * coinCapOverageReduction
      player.currentSavePoint.coinZcCount += blockToCollect.value * playerData.serverSide.coinMultiplier * coinCapOverageReduction
    }else if(blockToCollect.type==BlockTypeTypeConst.RC.symbol){
      player.coinRcCount += blockToCollect.value * playerData.serverSide.coinMultiplier * coinCapOverageReduction
      player.currentSavePoint.coinRcCount += blockToCollect.value * playerData.serverSide.coinMultiplier * coinCapOverageReduction
    

    //should coin multiplier appy to these???
    }else if(blockToCollect.type==BlockTypeTypeConst.R1.symbol){
      player.rock1Collected += blockToCollect.value * playerData.serverSide.coinMultiplier * coinCapOverageReduction
      player.currentSavePoint.rock1Collected += blockToCollect.value * playerData.serverSide.coinMultiplier * coinCapOverageReduction
    }else if(blockToCollect.type==BlockTypeTypeConst.R2.symbol){
      player.rock2Collected += blockToCollect.value * playerData.serverSide.coinMultiplier * coinCapOverageReduction
      player.currentSavePoint.rock2Collected += blockToCollect.value * playerData.serverSide.coinMultiplier * coinCapOverageReduction
    }else if(blockToCollect.type==BlockTypeTypeConst.R3.symbol){
      player.rock3Collected += blockToCollect.value * playerData.serverSide.coinMultiplier * coinCapOverageReduction
      player.currentSavePoint.rock3Collected += blockToCollect.value * playerData.serverSide.coinMultiplier * coinCapOverageReduction
    }else if(blockToCollect.type==BlockTypeTypeConst.BP.symbol){
      player.petroCollected += blockToCollect.value * playerData.serverSide.coinMultiplier * coinCapOverageReduction
      player.currentSavePoint.petroCollected += blockToCollect.value * playerData.serverSide.coinMultiplier * coinCapOverageReduction
    }else if(blockToCollect.type==BlockTypeTypeConst.NI.symbol){
      player.nitroCollected += blockToCollect.value * playerData.serverSide.coinMultiplier * coinCapOverageReduction
      player.currentSavePoint.nitroCollected += blockToCollect.value * playerData.serverSide.coinMultiplier * coinCapOverageReduction
    }else if(blockToCollect.type==BlockTypeTypeConst.BZ.symbol){
      player.bronzeCollected += blockToCollect.value * playerData.serverSide.coinMultiplier * coinCapOverageReduction
      player.currentSavePoint.bronzeCollected += blockToCollect.value * playerData.serverSide.coinMultiplier * coinCapOverageReduction

    }else if(blockToCollect.type==BlockTypeTypeConst.M1.symbol){
      player.material1Count += blockToCollect.value
      player.currentSavePoint.material1Count += blockToCollect.value
    }else if(blockToCollect.type==BlockTypeTypeConst.M2.symbol){
      player.material2Count += blockToCollect.value
      player.currentSavePoint.material2Count += blockToCollect.value
    }else if(blockToCollect.type==BlockTypeTypeConst.M3.symbol){
      player.material3Count += blockToCollect.value
      player.currentSavePoint.material3Count += blockToCollect.value
    }else if(blockToCollect.type==BlockTypeTypeConst.VB.symbol){
      console.log("coin ",blockToCollect.type,blockToCollect.value,player.coinGuestCount)
      player.coinGuestCount += blockToCollect.value
      player.currentSavePoint.coinGuestCount += blockToCollect.value
    }else{
      console.warn("unknown block type dont know how to score it ",blockToCollect) 
    }

    let levelRecalced = Math.floor(getLevelFromXp(player.coinsCollectedEpoch,CONFIG.GAME_LEVELING_FORMULA_CONST))

    const TESTING = false
    const leveledUp = 
      !TESTING ? levelRecalced != player.currentLevel
        : player.coinsCollected % 5 == 0 //testing is ever 5 level up
    if(TESTING && leveledUp){
      levelRecalced++
    }
    console.log("collectBlock",  player.id , player.name , " touched.id:" , id , "this.currentHeight" , this.currentHeight
     ,"player.coinGcCount",player.coinGcCount
      , "this.maxBlocksCollectable" , this.maxBlocksCollectable
      ,"player.coinsCollectedEpoch",player.coinsCollectedEpoch
      ,"player.coinsCollectedDaily",player.coinsCollectedDaily
      ,"coinCapEnabled",this.coinCapEnabled
      ,"hitCoinCap",hitCoinCap
      ,"maxCoinsPerLevel",maxCoinsPerLevel
      ,"coinCapOverageReduction",coinCapOverageReduction
      ,"level",levelRecalced,"vs",player.currentLevel,"lvl.percent",getLevelPercentFromXp(player.coinsCollectedEpoch,CONFIG.GAME_LEVELING_FORMULA_CONST).toFixed(2), leveledUp ? "LEVELED UP!!!!":"");


      
    if(leveledUp){
      //send message with rewards
      this.onPlayerLeveledUp(client,player,levelRecalced)
    }
    //

    this.currentHeight++;

    console.log("collectBlock","calling removeBlock")
    //this.removeBlockAndGenNew( id )
    this.removeBlock( id )

    console.log("collectBlock","calling postCollectBlockAction")
    this.postCollectBlockAction(playerData,id,blockToCollect);

    console.log("collectBlock","RETURN")
  }

  
  
  onPlayerLeveledUp(client:Client,player:Player,newVal:number){
    player.currentLevel = newVal
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

    //CONSTVAL used for debugging when level up happens, should be 0 in production
    const CONSTVAL = 0//newVal //temp should be 0
    const levelUpRewards:RewardData[] = [
      { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: CONSTVAL+Math.floor(diff*CONFIG.LEVEL_UP_REWARD_PERCENT_GC) },
      { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: CONSTVAL+Math.floor(diff*CONFIG.LEVEL_UP_REWARD_PERCENT_MC)}
    ]

    const notifyLevelUp:RewardNotification = {
      rewardType:"level-up",
      newLevel: newVal,
      rewards: levelUpRewards
    }
    if(player.rewards === undefined ) player.rewards = []
    player.rewards.push(notifyLevelUp)

    if(player.currentSavePoint.rewards === undefined ) player.currentSavePoint.rewards = []
    player.currentSavePoint.rewards.push(notifyLevelUp)
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

  postCollectBlockAction(playerData:PlayerData,id: string,block:Block) {
    //no-op for right now, overload 
  }
  

  removeBlock(id: string) {
    const blockToCollect = this.state.blocks.get( id );
    this.state.blocks.delete(id)
    this.returnBlockToPool(blockToCollect)
  }

  factoryNewBlock(args?:BlockType) {
    const block = new Block().assign(args);
    
    /*
    //is this faster / better
    new Block().assign({
      x: 8,
      y: 1,
      z: 8,
    })*/


    let blockType = args.type
    if(blockType == BlockTypeTypeConst.MC.symbol){ //50% of time make it worth more
      block.value = 1;//CONFIG.GC_TO_MC_CONVESION
    }else{
      block.value = 1 //Math.floor(Math.random() * 5)
    }
    block.id = "block-"+this.blockIdGenerator++ //DO NOT CHANGE PREFIX "block-" UNLESS YOU UPDATE SCENE SIDE TOO - caching by id

    const nowMs = new Date().getTime()
    block.createTime = nowMs
    if(this.expireTimeInSeconds >= 0){
      block.expireTime = nowMs + (this.expireTimeInSeconds)
    }
    
    this.blockList.push(block)
  
    return block
  }

  onAuth(client:Client, options:any):Promise<any> { 
    const METHOD_NAME = "onAuth"
    //move AuthenticateSessionTicket to async onAuth(client, options) { ???

    const promises:Promise<any>[] = [];

    const retData:PlayerServerSideData = {sessionId:undefined,playFabData:undefined,coinMultiplier:1,playFabCombinedInfoResult:undefined,dclUserData:undefined,playerTransform:undefined,realmInfo:undefined}


    const realmInfo:serverStateSpec.RealmInfo = options.realmInfo
    const userData = options.userData
    const playfabData = options.playFabData
    const userDataForDebug = 
    {
      displayName: userData ? userData.displayName : "",
      publicKey: userData ? userData.publicKey : "",
      hasConnectedWeb3: userData ? userData.hasConnectedWeb3 : "",
      userId: userData ? userData.userId : "",
      version: userData ? userData.version : "",
      playFabData:playfabData
    }
    
    
    console.log(METHOD_NAME,"STARTING",userDataForDebug)

    //common assignment
    //these are non auth things we want to store
    retData.realmInfo = options.realmInfo
    //const data:PlayerServerSideData = retData// = {sessionId:client.sessionId,playFabData:playfabData}
    retData.sessionId = client.sessionId
    retData.dclUserData = userData
  
    //do not enable till client code that sends title is deployed
    const CHECK_CLIENT_AND_SERVER_TITLE_MATCH = false
    if(CHECK_CLIENT_AND_SERVER_TITLE_MATCH && userData && playfabData && CONFIG.PLAYFAB_TITLEID !== playfabData.titleId){
      log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME," joined with wrong titleId " , CONFIG.PLAYFAB_TITLEID , "vs",playfabData.titleId)
      //this.broadcast("showError",{title:"Error","message":"Joined with wrong title id " +playfabData.titleId + " Expected " + CONFIG.PLAYFAB_TITLEID});
      
      const playFabAuth = new Promise((resolve, reject) => {
          reject(new ServerError(4401, "Failed to Authenticate Session:" + "Joined with wrong title id " +playfabData.titleId + " Expected " + CONFIG.PLAYFAB_TITLEID))
          return false
      })
      
      promises.push(playFabAuth)
    } else if (userData !== undefined && playfabData !== undefined) {
      const playFabAuth = new Promise((resolve, reject) => {
        const playfabSessionCheck = {"SessionTicket": playfabData.sessionTicket }
        console.log(METHOD_NAME,"PlayFabHelper.AuthenticateSessionTicket.calling",playfabSessionCheck)
      
        PlayFabHelper.AuthenticateSessionTicket( playfabSessionCheck ).then(
          (result:PlayFabServerModels.AuthenticateSessionTicketResult)=>{
            console.log(METHOD_NAME,"PlayFabHelper.AuthenticateSessionTicket.result",result)
            //TODO set player id to something? wallet? fab id does not seem safe  
    
            if(result.IsSessionTicketExpired !== undefined && result.IsSessionTicketExpired === false){
              const newPlayer = new Player().assign({
                name: userData.displayName || "Anonymous",
                score: 0, coinsCollected: 0,coinGcCount: 0,coinMcCount: 0
                ,coinVbCount: 0,coinAcCount: 0,coinZcCount: 0,coinRcCount: 0
                ,bronzeCollected: 0,bronzeShoeCollected:0
                , rock1Collected:0, rock2Collected:0, rock3Collected:0, petroCollected:0, nitroCollected: 0
                ,coinGuestCount: 0, material1Count: 0, material2Count: 0, material3Count: 0, container1Count: 0, rewards:[]
              });
              newPlayer.currentSavePoint = new PlayerSavePoint()
              newPlayer.playfabBalance = new PlayerSavePoint()
              this.resetPlayer(newPlayer.currentSavePoint)
              this.resetPlayer(newPlayer.playfabBalance)
              
              newPlayer.playFabAuthenticated = true
              
              //common assignment done above outside if

              retData.playFabData = playfabData

              //override playfabid with one from session for security
              retData.playFabData.id = result.UserInfo.PlayFabId
              newPlayer.playerFabId = result.UserInfo.PlayFabId
              
              const alreadyLoggedIn = this.checkIfLoggedInAlreadyByPlayFabId( retData.playFabData.id )
              
              if(alreadyLoggedIn){
                console.log("onauth","REJECTING","alreadyLoggedIn",newPlayer.playerFabId,"throwing 4402")
                reject(new ServerError(4402, "You may have no more than 1 session per wallet"));
              }
              
              this.state.players.set(client.sessionId, newPlayer);
              
              console.log(METHOD_NAME,"client.sessionId " + client.sessionId)
    
              console.log(METHOD_NAME,newPlayer.name, "fetching combined data....",);

              
              const params = this.createPlayfabCombinedInfoReq(retData.playFabData.id)
              //NOW LOOKUP STATS FOR BASELINE
              //should we wait for this???? does it matter???
              PlayFabHelper.GetPlayerCombinedInfo( params ).then(
                (result:PlayFabServerModels.GetPlayerCombinedInfoResult)=>{
                  retData.playFabCombinedInfoResult = result
                  
                  console.log(METHOD_NAME,newPlayer.name, "fetching combined data returned....",result.InfoResultPayload.PlayerStatistics);

                  const playerCombinedInfoHelper:GetPlayerCombinedInfoResultHelper = new GetPlayerCombinedInfoResultHelper()
                  playerCombinedInfoHelper.update(result.InfoResultPayload)
                  //if(thisPlayerResult){
                    copyToPlayerBalance(newPlayer,playerCombinedInfoHelper)
                  //}
                 
                  //let playerMultiplier:number=1
                  let defaultPlayerMultiplier = 1
                  const wearablePromise = checkMultiplier("/check-multiplier"
                        ,getCheckMultiplierVersionNum(this.clientVersion)
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

                  //not map it both ways sessionId and playfabId 
                  //only map session id, keep it secret? can just loop serverside data object
                  this.playerServerSideData[client.sessionId] = retData
                  //this.playerServerSideData[playfabData] = data
                
                  //TODO lookup player current coin colltecting power now
                  
                  console.log(METHOD_NAME,newPlayer.name, "authed! => ", options.realmInfo,userDataForDebug,playfabData);
        
                  console.log(METHOD_NAME,newPlayer.name, "authed! returning => ", retData,"newPlayer.coinsCollectedEpoch",newPlayer.coinsCollectedEpoch
                    ,"newPlayer.coinsCollectedDaily",newPlayer.coinsCollectedDaily);
        
                  //if(true){
                    //1011 is generic server error
                    //reject(new ServerError(1011, "test onAuth failure hardcoded. remove me"))
                  //  reject(new ServerError(4402, "Failed to Authenticate Session"));
                  //}

                  resolve(retData)
                }
              )
              //do a retry??
              /*.catch( 
                function(error:PlayFabAuthenticationModels.ValidateEntityTokenResponse){
                  console.log( METHOD_NAME,"failed to get GetPlayerCombinedInfo, did not join => ", error, options.realmInfo,userDataForDebug,playfabData);
                  reject(new ServerError(4402, "Failed to Calling GetPlayerCombinedInfo"));
                  return false;
                }
                //reject(new ServerError(4401, "Failed to Authenticate Session"));
              )*/
    
            }else{
              console.log( METHOD_NAME,"failed to auth player, did not join => ", result, options.realmInfo,userDataForDebug,playfabData);
    
              //when in onJoin it tells them to leave
              //4000 range, 401 for unauthorized
              //client.leave(4401,"Failed to Authenticate Session")
    
              reject(new ServerError(4401, "Failed to Authenticate Session"));
              return false;
    
              //dispose room?
            }
          }
        ).catch(function(error:PlayFabAuthenticationModels.ValidateEntityTokenResponse){
          console.log( METHOD_NAME,"failed to auth player, did not join => ", error, options.realmInfo,userDataForDebug,playfabData);
          reject(new ServerError(4401, "Failed to Authenticate Session"));
          return false;
        })
      })
      //https://www.metadoge.art/api/wallet?contractAddress=0x1acF970cf09a6C9dC5c5d7F2ffad9b1F05e4f7a8&ownerAddress=0xbd5b79D53D75497673e699A571AFA85492a2cc74

      promises.push(playFabAuth)
    } else if (CONFIG.ON_JOIN_REQUIRE_PLAYFAB_DATA_OPTIONS && (!userData || !playfabData)) {
      log(CLASSNAME, this.roomId, METHOD_NAME, " joined with no playfab data ", playfabData);
      //this.broadcast("showError",{title:"Error","message":"Joined with wrong title id " +playfabData.titleId + " Expected " + CONFIG.PLAYFAB_TITLEID});

      const playFabAuth = new Promise((resolve, reject) => {
          reject(
              new ServerError(4401, "Failed to Authenticate Session:" + "Playfab Options Data is required")
          );
          return false;
      });

      promises.push(playFabAuth);
    }else{
      //add observer???
      log(
        CLASSNAME,
        this.roomId,
        METHOD_NAME,
        "playing joined but no playfab/dcl data???",
        "CONFIG.PLAYFAB_ENABLED",CONFIG.PLAYFAB_ENABLED,
        "CONFIG.ON_JOIN_REQUIRE_PLAYFAB_DATA_OPTIONS",CONFIG.ON_JOIN_REQUIRE_PLAYFAB_DATA_OPTIONS,
        options
      );
      const newPlayer = new Player().assign({
        name: "Anonymous#",
        score: 0, coinsCollected: 0,coinGcCount: 0,coinMcCount: 0
        ,coinVbCount: 0,coinAcCount: 0,coinZcCount: 0,coinRcCount: 0
        ,bronzeCollected: 0, bronzeShoeCollected: 0
        , rock1Collected:0, rock2Collected:0, rock3Collected:0, petroCollected:0, nitroCollected: 0
        ,coinGuestCount: 0, material1Count: 0, material2Count: 0, material3Count: 0, container1Count: 0, rewards:[]
      });
      newPlayer.playFabAuthenticated = false
      newPlayer.currentSavePoint = new PlayerSavePoint()
      newPlayer.playfabBalance = new PlayerSavePoint()
      this.resetPlayer(newPlayer.currentSavePoint)
      this.resetPlayer(newPlayer.playfabBalance)
      
      //common assignment done above outside this if

      newPlayer.playerFabId = retData.playFabData?.id

      const alreadyLoggedIn = this.checkIfLoggedInAlreadyByPlayFabId( newPlayer.playerFabId )
      
      if(alreadyLoggedIn){
        console.log("onauth","REJECTING","alreadyLoggedIn",newPlayer.playerFabId,"throwing 4402")
        throw new ServerError(4402, "You may have no more than 1 session per wallet")
      }

      this.state.players.set(client.sessionId, newPlayer);

      
    }
    //promises.push(nftCheck)

    return Promise.all( promises ).then(function(result){
      console.log("onAuth. all promised completed " , result)
      return retData;
    })
  }
  checkIfLoggedInAlreadyByPlayFabId(id: string) {
    //see if player already exists
    let found = false
    this.state.players.forEach((player:Player) => {
      if(player.playerFabId ===id){
        console.log("checkIfLoggedInAlreadyByPlayFabId","found ",player.playerFabId,id,"this.state.players.size",this.state.players.size,player)
        found = true
      }
    })
    if(!found) console.log("checkIfLoggedInAlreadyByPlayFabId","did not find ",id)
    return found;
  }

  onJoin (client: Client, options: any) {
    console.log("onJoin START " , options)

    this.start()

    //notfy client of config
    //make copy to make sure does not copy any unwanted data
    const remoteConfigSync:serverStateSpec.RemoteBaseCoinRoomConfig = 
      {items:undefined,saveInterval:undefined
        ,coinCap:{enabled:false,notes:undefined,overageReduction:undefined,formula:undefined}}

    remoteConfigSync.coinCap.enabled = this.coinCapEnabled
    remoteConfigSync.coinCap.overageReduction = this.coinCapOverageReduction
    remoteConfigSync.coinCap.formula = CONFIG.GAME_DAILY_COIN_MAX_FORMULA_CONST
    

    client.send("update.config",remoteConfigSync)

  }
 
  async onLeave (client: Client, consented: boolean) {
    const METHOD_NAME = "onLeave"
    console.log("onLeave ",consented,client.sessionId)
    const player = this.state.players.get(client.sessionId);
    const playerWasCreated = player !== undefined
    /*
    try {
      client.send("onLeave","consented:"+consented) 
    } catch (e) {
      console.log("failed sending onLeave event",player.name,client.sessionId,e)
    }*/
    let removePlayer = true
    
    const waitForReconnect = CONFIG.RECONNECT_WAIT_ENABLED && !consented
    console.log("onLeave ",consented,client.sessionId,"waitForReconnect",waitForReconnect,"max wait time ",CONFIG.RECONNECT_WAIT_TIME)
    if (waitForReconnect) {
      try {
      
        // allow disconnected client to reconnect into this room until 20 seconds
        await this.allowReconnection(client, CONFIG.RECONNECT_WAIT_TIME);
    
        console.log("onLeave player reconnnected!!!",player.name)
        // client returned! let's re-activate it.
        //this.state.players.get(client.sessionId).connected = true;
        removePlayer = false
      } catch (e) {
        if(player && player !== undefined){
          console.log("onLeave player reconnect failed!!!",player.name,client.sessionId,e)
        }else{
          console.log("onLeave player reconnect failed!!!",player,client.sessionId,e)
        }
      }
    }

    if(removePlayer){
      // 20 seconds expired. let's remove the client.
      if(player && player !== undefined){
        console.log(player.name, "left!");

        //if(consented) client.send("announce",'Thanks for playing')
        /*if(this.isFinished){
          //send finish info

          //player.id
          const playerData:PlayerData = this.getPlayerData(client.sessionId)
          //const playFabId = playerData.serverSide.playFabData.id;
          //const player = playerData.clientSide
          
          console.log("sending "+playerData.serverSide.endGameResult)
          client.send("endGameResultsMsg",playerData.serverSide.endGameResult) 
    
        }*/
      }else{
        console.log("onLeave already gone? / cound not find " + client.sessionId);
      }
      if(playerWasCreated){
        console.log("onLeave","CONFIG.LEVEL_COINS_SAVE_STATS_MID_GAME",CONFIG.LEVEL_COINS_SAVE_STATS_MID_GAME);
        if(CONFIG.LEVEL_COINS_SAVE_STATS_MID_GAME){
          try{
            await this.savePlayerData('end-game')
          }catch(e){
            try{
              const supressRethrow = true
              this.handleUnexpectedError(CLASSNAME,this.roomId,"onLeave failed saving player data",[client.sessionId,consented],"",client,e,supressRethrow)
            }catch(e){
              //silence it, nothing we can do on leaving
              log(CLASSNAME,this.roomId,METHOD_NAME, "UNHANDLED ERROR OCCURED!!! silence it, nothing we can do on leaving", "CLASSNAME",CLASSNAME, "roomId", this.roomId, "METHOD_NAME",METHOD_NAME)
            }
          }
        }
        //timer to delete? and do it first incase of errors above???
        this.state.players.delete(client.sessionId);
        //also delete the server side data
        delete this.playerServerSideData[client.sessionId]
      }
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
      GetUserInventory: true,
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
    console.log("Disposing room...autoDispose",this.autoDispose);
  }

}

function copyToPlayerBalance(playerData: serverStateSpec.IPlayer, playerCombinedInfoHelper: GetPlayerCombinedInfoResultHelper) {
  playerData.playfabBalance.coinGcCount = playerCombinedInfoHelper.virtualCurrency.gc
  playerData.playfabBalance.coinMcCount = playerCombinedInfoHelper.virtualCurrency.mc
  playerData.playfabBalance.bronzeCollected = playerCombinedInfoHelper.virtualCurrency.bz

  playerData.playfabBalance.coinVbCount = playerCombinedInfoHelper.virtualCurrency.vb
  playerData.playfabBalance.coinAcCount = playerCombinedInfoHelper.virtualCurrency.ac
  playerData.playfabBalance.coinZcCount = playerCombinedInfoHelper.virtualCurrency.zc
  playerData.playfabBalance.coinRcCount = playerCombinedInfoHelper.virtualCurrency.rc

  playerData.playfabBalance.rock1Collected = playerCombinedInfoHelper.virtualCurrency.r1
  playerData.playfabBalance.rock2Collected = playerCombinedInfoHelper.virtualCurrency.r2
  playerData.playfabBalance.rock3Collected = playerCombinedInfoHelper.virtualCurrency.r3
  playerData.playfabBalance.petroCollected = playerCombinedInfoHelper.virtualCurrency.bp
  playerData.playfabBalance.nitroCollected = playerCombinedInfoHelper.virtualCurrency.ni

  playerData.playfabBalance.bronzeShoeCollected = playerCombinedInfoHelper.inventory.bronzeShoe

  console.log("copyToPlayerBalance","pre","playerData.coinsCollectedEpoch",playerData.coinsCollectedEpoch
    ,"playerData.coinsCollectedDaily",playerData.coinsCollectedDaily);

  //GAME_STATE.playerState.playFabUserInfo.PlayerStatistics
  playerData.coinsCollectedEpoch = playerCombinedInfoHelper.stats.allTimeCoins
  playerData.coinsCollectedDaily = playerCombinedInfoHelper.stats.dailyCoins
  playerData.currentLevel = Math.floor(getLevelFromXp(playerData.coinsCollectedEpoch,CONFIG.GAME_LEVELING_FORMULA_CONST))

  console.log("copyToPlayerBalance",playerData,"playerCombinedInfoHelper.stats.allTimeCoins"
    ,playerCombinedInfoHelper.stats.allTimeCoins,"playerData.coinsCollectedEpoch",playerData.coinsCollectedEpoch
    ,"playerData.coinsCollectedDaily",playerData.coinsCollectedDaily);
  //retData.coinsCollectedEpoch = 
}

