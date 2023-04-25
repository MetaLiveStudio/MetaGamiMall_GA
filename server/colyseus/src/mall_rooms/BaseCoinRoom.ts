import { Room, Client, ServerError } from "colyseus";
import { Block, BlockDefType, BlockMaterialDefType, BlockType,  BlockTypeTypeConst, IPlayer, MyRoomState, Player, PlayerSavePoint, RewardData, RewardNotification } from "./MyRoomState";
//import PlayFab from "../playfab_sdk/PlayFabClientApi";
//import * as PlayFabSDK from  '../playfab_sdk/index'
//import { EntityTokenResponse, GetPlayerCombinedInfoResultPayload, LoginResult, TreatmentAssignment, UserSettings } from '../playfab_sdk/playfab.types'; 
import { PlayFab,PlayFabAuthentication, PlayFabServer } from "playfab-sdk";
import * as PlayFabHelper from "./PlayFabWrapper";

import { coins } from "./coins";
import { CONFIG } from "./config";
import { GameEndType, PlayerData, PlayerServerSideData } from "./types";
import { nftMetaDogeCheckCall, nftCheckMultiplier, nftDogeHeadCheckCall, nftCheckDogeHeadMultiplier, initPlayerStateNftOwnership, fetchWearableData, checkMultiplier, CheckMultiplierResultType } from "../utils/nftCheck";
import { addMaterialToUser, createAddUserVirtualCurrency } from "../utils/playFabUtils";
import { getLevelFromXp, getLevelPercentFromXp, getXPDiffBetweenLevels, getXPFromLevel } from "../utils/leveling/levelingUtils";

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

export class BaseCoinRoom extends Room<MyRoomState> {
  protected currentHeight: number = 0;
  protected maxBlocksCollectable: number = 0
  protected isFinished: boolean = false;
  protected isStarted: boolean = false;
  protected blockIdGenerator = 0;
  protected blockList:Block[] = [] //creation order is easier to track, spawn them all, then decide which to keep
  //protected blockSpawnList:Block[] = [] //blocks to spawn, get picked up by timer
  protected blockPoolList:Block[] = [] //creation order is easier to track. keeps track of unused blocks
  protected authResult: PlayFabAuthenticationModels.ValidateEntityTokenResponse 
  protected playerServerSideData:Record<string,PlayerServerSideData> = {}
  protected expireTimeInSeconds = -1
  protected onCollectRespawnTimeInSeconds = -1
  protected enableOnExpireRespawn = false
  protected enableOnCollectRespawn = false
  protected enableEndGameWhenCollectThresholdReached = true
  protected maxMCSpawn = 5 //max number of meta coins are visible
  protected maxMaterial1Spawn = CONFIG.SPAWN_MATERIAL_ITEMS_ENABLED ? 9 : 0//max number of material 1
  protected maxMaterial2Spawn = CONFIG.SPAWN_MATERIAL_ITEMS_ENABLED ? 9 : 0//max number of material 1
  protected maxMaterial3Spawn = CONFIG.SPAWN_MATERIAL_ITEMS_ENABLED ? 9 : 0//max number of material 1
  protected pullBlockCount = 5
  protected startGameWaitTime = CONFIG.START_GAME_WAIT_TIME
  protected levelDuration = CONFIG.ROUND_DURATION
  protected levelTime = 0
  protected levelDurationEnabled = true//means will count time
  protected levelDurationIncrement = -1 //negative is down, + is up, 0 is no counting
  protected levelDurationThreshold = 0//when reached is over
  
  protected levelCoinPos:number[][] = coins
  protected guestCoinType:BlockDefType
  protected saveInterval:number=CONFIG.SAVE_DATA_INTERVAL
  protected saveLapseTime:number=0
  protected savedPlayerStats:boolean = false

  //update time every 1 second
  //do onCreate
  //this.setSimulationInterval((deltaTime) => this.update(deltaTime), 1000);

  // GAME SERVER LOOP
  //update(dt:number){

    
  onCreate (options: any) {
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
    
    this.setState(new MyRoomState());

    // set-up the game!
    this.setUp();

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
        this.savePlayerData('end-game');
      }
      //send ack quit? right now savePlayerData side affect will send "finished" like it ended normally
    })
    this.onMessage("save-game",(client: Client, data: any) => {
      console.log("save-game ",client.sessionId," is saving");
      if(CONFIG.LEVEL_COINS_SAVE_STATS_MID_GAME){
        //side affect broadcasts "finished"
        this.savePlayerData('save-game');
      }
      //send ack quit? right now savePlayerData side affect will send "finished" like it ended normally
    })
    this.onMessage("fall", (client: Client, atPosition: any) => {
      this.broadcast("fall", atPosition);
    });

    
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
  
  }

  savePlayerData(saveType:'end-game'|'save-game'|'auto-save'){
    const METHOD_NAME = "savePlayerData()"
    logEntry(CLASSNAME,this.roomId,METHOD_NAME,saveType);

    this.updatePlayerStats(saveType).then((result)=>{
      console.log("XXXXX updatePlayerStats all promised completed " , result)
      
      //if(data.client){
        //player.id
        //this.clients
        for(let p in this.clients){
          
          const client = this.clients[p]
          console.log("XXXXX updatePlayerStats sending to client " , client.sessionId)
          const playerData:PlayerData = this.getPlayerData(client.sessionId)
          //const playFabId = playerData.serverSide.playFabData.id;
          //const player = playerData.clientSide

          //maybe track before and after save for any missed
          //too slow, need to do this when update player stats is running!
          if(saveType=='save-game'){
            //workaround????
            this.resetPlayerCollectedItems( playerData.clientSide )
          }


          if(playerData !== undefined && playerData.serverSide !== undefined){
            console.log("sending "+playerData.serverSide.endGameResult)
            client.send("endGameResultsMsg",playerData.serverSide.endGameResult) 
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
      }else{
        this.broadcast("game-auto-saved");//what does this do? rename to savingPlayerDataFinished
      }
      
    })
  }
  gameEndedNotify(data:GameEndType){
    console.log("gameEndedNotify called ",data)

    if(!this.isFinished){
      this.isFinished = true;

      this.clock.clear()

      this.savePlayerData('end-game')
    }else{
      console.log("gameEndedNotify called already!!!! ",data)
    }
  }

  updatePlayerStats(saveType:'end-game'|'save-game'|'auto-save'):Promise<any[]>{
    const METHOD_NAME = "updatePlayerStats()"
    logEntry(CLASSNAME,this.roomId,METHOD_NAME,saveType);

    const promises:Promise<any>[] = [];

    let loopCount = 0

    
    //TODO store on individual player record??
    if(this.savedPlayerStats){
      log(CLASSNAME,this.roomId,METHOD_NAME,"updatePlayerStats already calld, save point should be safe to call again???")    
      //return
    } 
    this.savedPlayerStats = true
  
    

    for(const p in this.playerServerSideData){
        console.log("updatePlayerStats looping" + loopCount + " " + p)
      //this.state.players.forEach((player) => {
  
        //player.id
        const playerData:PlayerData = this.getPlayerData(this.playerServerSideData[p].sessionId)
        const playFabId = playerData.serverSide.playFabData.id;
        const player = playerData.clientSide


        //console.log("updatePlayerStats looping" + loopCount + " " + p + "  "+ playerData,player.id,"savePoint",savePoint)
        if(playerData === undefined || player === undefined){
          console.log("updatePlayerStats looping" + loopCount + " " + p + " was nulll",player,playerData)
          continue;
        }
  

        const savePoint = player.currentSavePoint
        //this.copyPlayerData(player,savePoint)


          

        if(!this.hasDataToSave(savePoint)){
          log(CLASSNAME,this.roomId,METHOD_NAME,"updatePlayerStats savePoint has nothing to save",player.id,player.name,", save point saving",savePoint)    
          promises.push(new Promise((resolve, reject) => {
            //EndLevelUpdatePlayerStatsResult
            resolve({})
            return true
          }))
          continue
        } 

        if(player.saveInProgress){
          log(CLASSNAME,this.roomId,METHOD_NAME,"updatePlayerStats save in progress",player.id,player.name,", save point not calling again")    
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
        this.resetPlayer( newSavePoint )
        player.currentSavePoint = newSavePoint

        //then push
        player.pastSavePoints.push( savePoint )
          
        //copy the data here to see if anything else gets added???


        console.log("updatePlayerStats looping" + loopCount + " player " + player , " vs ",savePoint)


        //copy over remainers for next time
        newSavePoint.coinGcCount += savePoint.coinGcCount    - Math.floor(savePoint.coinGcCount) 
        newSavePoint.coinMcCount += savePoint.coinMcCount    - Math.floor(savePoint.coinMcCount)    

        newSavePoint.coinsCollected += savePoint.coinsCollected    - Math.floor(savePoint.coinsCollected) 
        newSavePoint.coinsCollectedEpoch += savePoint.coinsCollectedEpoch    - Math.floor(savePoint.coinsCollectedEpoch) 

        savePoint.coinGcCount = Math.floor(savePoint.coinGcCount)
        savePoint.coinMcCount = Math.floor(savePoint.coinMcCount)
        //savePoint.coin = Math.floor(savePoint.coinMcCount)

        console.log("updatePlayerStats CARRYING OVER" 
          ,"newSavePoint.coinsCollected",newSavePoint.coinsCollected,"newSavePoint.coinsCollectedEpoch",newSavePoint.coinsCollectedEpoch
          ,"newSavePoint.coinGcCount",newSavePoint.coinGcCount,"newSavePoint.coinMcCount",newSavePoint.coinMcCount)


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

        var addGCRewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.GC.symbol, this.sumRewards(savePoint.rewards,BlockTypeTypeConst.GC.symbol) )
        var addMCRewardCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.MC.symbol, this.sumRewards(savePoint.rewards,BlockTypeTypeConst.MC.symbol) )
        
        var grantMaterial1: PlayFabServerModels.GrantItemsToUserRequest = { ItemIds: [], PlayFabId: playFabId }
        var grantMaterial2: PlayFabServerModels.GrantItemsToUserRequest = { ItemIds: [], PlayFabId: playFabId }
        var grantMaterial3: PlayFabServerModels.GrantItemsToUserRequest = { ItemIds: [], PlayFabId: playFabId }

        addMaterialToUser( grantMaterial1,BlockTypeTypeConst.M1,savePoint.material1Count )
        addMaterialToUser( grantMaterial2,BlockTypeTypeConst.M2,savePoint.material2Count )
        addMaterialToUser( grantMaterial3,BlockTypeTypeConst.M3,savePoint.material3Count )

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
          addGCRewardCurrency: addGCRewardCurrency,
          addMCRewardCurrency: addMCRewardCurrency,
          
          grantMaterial1: grantMaterial1,
          grantMaterial2: grantMaterial2,
          grantMaterial3: grantMaterial3,

          addGuestCurrency: addGuestPlayerCurrency
          //playerCombinedInfo: getPlayerCombinedInfo
        }
  
        const promise = PlayFabHelper.EndLevelGivePlayerUpdatePlayerStats(updatePlayerStats)
        
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
          console.log("promise.EndLevelGivePlayerUpdatePlayerStats failed",error);
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
  setUp() {

    this.resetCoinData()

    this.setupCoins()


    this.currentHeight = 0;
    this.isFinished = false;
    this.isStarted = false

    // reset all player's score position
    this.state.players.forEach((player) => {
      this.resetPlayer(player)
      if(player.currentSavePoint) this.resetPlayer(player.currentSavePoint)
    });


  }
  hasDataToSave(player:IPlayer){
    const hasDataToSave = 
         player.coinsCollected > 0 || player.score > 0
      || player.coinMcCount > 0 || player.coinGcCount > 0
      || player.material1Count > 0 || player.material2Count > 0
      || player.material3Count > 0 || player.container1Count > 0
      || player.rewards.length > 0

    console.log("hasDataToSave",player,hasDataToSave)
    return hasDataToSave
  }

  resetPlayerCollectedItems(player:IPlayer){
    player.coinsCollected = 0;
    //player.coinsCollectedEpoch= 0;//do not reset this or will break leveling logic
    player.score = 0;
    player.coinGcCount = 0;
    player.coinMcCount = 0;
    player.rewards = []
    //player.pastSavePoints = []
    player.material1Count = 0;
    player.material2Count = 0;
    player.material3Count = 0;
    player.container1Count = 0;

    player.coinGuestCount = 0;
    player.saveInProgress = false
    
  }
  resetPlayer(player:IPlayer){
    
    //player.rewards = []
    player.pastSavePoints = []
    
    player.saveInProgress = false

    this.resetPlayerCollectedItems(player)
    
  }
  copyPlayerData(src:IPlayer,dest:IPlayer){
    dest.coinsCollected = src.coinsCollected
    dest.score = src.score
    dest.coinGcCount = src.coinGcCount;
    dest.coinMcCount = src.coinMcCount;
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
      console.log(event,".queue to be added ",block.id,block.x,"immediate",immediate, " after ",respawnTime,"ms")
      this.clock.setTimeout(()=>{
        console.log(event,".adding to state block ",block.id,block.x,"immediate",immediate, " after ",respawnTime,"ms")
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
        console.log("returning blockToFind ",block.id,"poolSize:",this.blockPoolList.length)
      }else{
        block = this.blockPoolList.shift()  
        console.log("returning block ",block.id,"poolSize:",this.blockPoolList.length)
      }
      
      return block
    }else{
      console.log("error, no blocks in pull to spawn new ",this.blockPoolList.length)
    }
  }
  
  adjustBlockForJumpHeight(block: Block) {
    block.y += Math.abs( CONFIG.COIN_HEIGHT_ADJUSTED * 4.6 )
  }

  initCoinsPool(){
    
    //const blocks = []
    this.levelCoinPos.forEach((coin, key)=> {
      let blockType = BlockTypeTypeConst.GC.symbol
      const block = this.factoryNewBlock({id:`coin-${key}`, x:coin[0], y:coin[1]+CONFIG.COIN_HEIGHT_ADJUSTED, z:coin[2], type: blockType, visible:true})
      //blocks.push(block)
    })
    //how many
    this.spawnOtherTypes( this.maxMCSpawn, CONFIG.MAX_SPAWN_SEARCH_TRIES, BlockTypeTypeConst.GC.symbol,BlockTypeTypeConst.MC.symbol )

    if(CONFIG.SPAWN_MATERIAL_ITEMS_ENABLED){
      this.spawnOtherTypes( this.maxMaterial1Spawn, CONFIG.MAX_SPAWN_SEARCH_TRIES, BlockTypeTypeConst.GC.symbol,BlockTypeTypeConst.M1.symbol )
      this.spawnOtherTypes( this.maxMaterial2Spawn, CONFIG.MAX_SPAWN_SEARCH_TRIES, BlockTypeTypeConst.GC.symbol,BlockTypeTypeConst.M2.symbol )
      this.spawnOtherTypes( this.maxMaterial3Spawn, CONFIG.MAX_SPAWN_SEARCH_TRIES, BlockTypeTypeConst.GC.symbol,BlockTypeTypeConst.M3.symbol )
    }
    
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

  spawnOtherTypes(maxAllowed:number,maxAttempts:number,swapSymbol:string,replaceTypeSymbol:string){
    //how many
    let attemptCnt = 0
    const maxMC = Math.min(this.blockList.length,maxAllowed)
    for(let x=0;x<maxMC;x++){
      const index = Math.floor(Math.random() * this.blockList.length)
      const block = this.blockList[index]
      if(block.type === swapSymbol){
        block.type = replaceTypeSymbol
      }else{
        x--//keep looping
      }
      if(attemptCnt > maxAttempts){
        console.log("spawnOtherTypes reached max attempts to place",replaceTypeSymbol,attemptCnt,maxAttempts)
        break;
      }
      attemptCnt++
    }
    console.log("spawnOtherTypes placed",maxAllowed,replaceTypeSymbol,"attemptCnt",attemptCnt,"maxAttempts",maxAttempts)
  }

  setupCoins() {
    
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
    //log(CLASSNAME,this.roomId,METHOD_NAME,"elapsedTime",elapsedTime.toFixed(2),"dt",dt,"this.levelTime",this.levelTime,"this.saveInterval",this.saveInterval,"saveLapseTime",this.saveLapseTime)
     //noop
     this.levelTime += dt
     this.saveLapseTime += dt
     // 10000 saveLapseTime 15764
     if(this.saveLapseTime > this.saveInterval ){
      this.saveLapseTime = 0
      this.savePlayerData('auto-save')
     }
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
      this.clock.setInterval(() => {
        
        this.clockIntervalUpdate(this.clock.elapsedTime,this.clock.deltaTime+1000)

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

    

    blockToCollect.collectedBy = player.id+";;" + player.name+";;fabid-"+playerData.serverSide.playFabData.id
    player.coinsCollected += 1 * playerData.serverSide.coinMultiplier
    player.coinsCollectedEpoch += 1 * playerData.serverSide.coinMultiplier
    
    player.currentSavePoint.coinsCollected += 1 * playerData.serverSide.coinMultiplier
    player.currentSavePoint.coinsCollectedEpoch += 1 * playerData.serverSide.coinMultiplier
    
    
    //console.log("coin ",blockToCollect.type,"val",blockToCollect.value,"gc",player.coinGcCount,"mc",player.coinMcCount,"m1",player.material1Count,player.material2Count,player.material3Count)

    //TODO need to determine type
    if(blockToCollect.type==BlockTypeTypeConst.GC.symbol){
      player.coinGcCount += blockToCollect.value * playerData.serverSide.coinMultiplier
      player.currentSavePoint.coinGcCount += blockToCollect.value * playerData.serverSide.coinMultiplier
    }else if(blockToCollect.type==BlockTypeTypeConst.MC.symbol){
      player.coinMcCount += blockToCollect.value * playerData.serverSide.coinMultiplier
      player.currentSavePoint.coinMcCount += blockToCollect.value * playerData.serverSide.coinMultiplier
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
      ,"level",levelRecalced,"vs",player.currentLevel,"lvl.percent",getLevelPercentFromXp(player.coinsCollectedEpoch,CONFIG.GAME_LEVELING_FORMULA_CONST).toFixed(2), leveledUp ? "LEVELED UP!!!!":"");


      
    if(leveledUp){
      //send message with rewards
      this.onPlayerLeveledUp(client,player,levelRecalced)
    }
    //

    this.currentHeight++;

    //this.removeBlockAndGenNew( id )
    this.removeBlock( id )

    this.postCollectBlockAction(playerData,id,blockToCollect);
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

    const levelUpRewards:RewardData[] = [
      { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_GC,amount: Math.floor(diff*CONFIG.LEVEL_UP_REWARD_PERCENT_GC) },
      { type:"VirtualCurrency","id":CONFIG.GAME_COIN_TYPE_MC,amount: Math.floor(diff*CONFIG.LEVEL_UP_REWARD_PERCENT_MC)}
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

    const retData:PlayerServerSideData = {sessionId:undefined,playFabData:undefined,coinMultiplier:1,playFabCombinedInfoResult:undefined}


    const userData = options.userData
    const playfabData = options.playFabData
    const userDataForDebug = 
    {
      displayName: userData ? userData.displayName : "",
      publicKey: userData ? userData.publicKey : "",
      hasConnectedWeb3: userData ? userData.hasConnectedWeb3 : "",
      userId: userData ? userData.userId : "",
      version: userData ? userData.version : "",
      playFabData:options.playFabData
    }
    
    
    console.log(METHOD_NAME,"STARTING",userDataForDebug)

    //let playerMultiplier:number=1
    let defaultPlayerMultiplier = 1
    const wearablePromise = checkMultiplier("/check-multiplier",userDataForDebug.publicKey)
    promises.push(wearablePromise)

  
    const playfabSessionCheck = {"SessionTicket":options.playFabData.sessionTicket}
    console.log(METHOD_NAME,"PlayFabHelper.AuthenticateSessionTicket.calling",playfabSessionCheck)
    //do not enable till client code that sends title is deployed
    const CHECK_CLIENT_AND_SERVER_TITLE_MATCH = false
    if(CHECK_CLIENT_AND_SERVER_TITLE_MATCH && userData && playfabData && CONFIG.PLAYFAB_TITLEID !== playfabData.titleId){
      log(CLASSNAME,this.roomId,METHOD_NAME," joined with wrong titleId " , CONFIG.PLAYFAB_TITLEID , "vs",playfabData.titleId)
      //this.broadcast("showError",{title:"Error","message":"Joined with wrong title id " +playfabData.titleId + " Expected " + CONFIG.PLAYFAB_TITLEID});
      
      const playFabAuth = new Promise((resolve, reject) => {
          reject(new ServerError(4401, "Failed to Authenticate Session:" + "Joined with wrong title id " +playfabData.titleId + " Expected " + CONFIG.PLAYFAB_TITLEID))
          return false
      })
      
      promises.push(playFabAuth)
    }else{
      const playFabAuth = new Promise((resolve, reject) => {
        PlayFabHelper.AuthenticateSessionTicket( playfabSessionCheck ).then(
          (result:PlayFabServerModels.AuthenticateSessionTicketResult)=>{
            console.log(METHOD_NAME,"PlayFabHelper.AuthenticateSessionTicket.result",result)
            //TODO set player id to something? wallet? fab id does not seem safe  
    
            if(result.IsSessionTicketExpired !== undefined && result.IsSessionTicketExpired === false){
              const newPlayer = new Player().assign({
                name: options.userData.displayName || "Anonymous",
                score: 0, coinsCollected: 0,coinGcCount: 0,coinMcCount: 0,coinGuestCount: 0, material1Count: 0, material2Count: 0, material3Count: 0, container1Count: 0, rewards:[]
              });
              newPlayer.currentSavePoint = new PlayerSavePoint()
              this.resetPlayer(newPlayer.currentSavePoint)
              
              this.state.players.set(client.sessionId, newPlayer);
    
              //const data:PlayerServerSideData = retData// = {sessionId:client.sessionId,playFabData:options.playFabData}
              retData.sessionId = client.sessionId
              retData.playFabData = options.playFabData

              console.log(METHOD_NAME,"client.sessionId " + client.sessionId)
    
              console.log(METHOD_NAME,newPlayer.name, "fetching combined data....",);

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
              const params = this.createPlayfabCombinedInfoReq(retData.playFabData.id)
              //NOW LOOKUP STATS FOR BASELINE
              PlayFabHelper.GetPlayerCombinedInfo( params ).then(
                (result:PlayFabServerModels.GetPlayerCombinedInfoResult)=>{
                  retData.playFabCombinedInfoResult = result
                  
                  console.log(METHOD_NAME,newPlayer.name, "fetching combined data returned....",result.InfoResultPayload.PlayerStatistics);

                  let playerStatics = result.InfoResultPayload.PlayerStatistics
                  let coinCollectingEpochStat:PlayFabServerModels.StatisticValue
                  if (playerStatics) {
                    for (const p in playerStatics) {
                      const stat: PlayFabServerModels.StatisticValue = playerStatics[p];
                      console.log(METHOD_NAME,"stat ", stat);
                      if (
                        stat.StatisticName == "coinsCollectedEpoch"
                      ) {
                        coinCollectingEpochStat = stat;
                      }
                    }
                    
                  }
                  //GAME_STATE.playerState.playFabUserInfo.PlayerStatistics
                  newPlayer.coinsCollectedEpoch = coinCollectingEpochStat!==undefined ? coinCollectingEpochStat.Value : 0
                  newPlayer.currentLevel = Math.floor(getLevelFromXp(newPlayer.coinsCollectedEpoch,CONFIG.GAME_LEVELING_FORMULA_CONST))
                  //retData.coinsCollectedEpoch = 

                  //not map it both ways sessionId and playfabId 
                  //only map session id, keep it secret? can just loop serverside data object
                  this.playerServerSideData[client.sessionId] = retData
                  //this.playerServerSideData[options.playFabData] = data
                
                  //TODO lookup player current coin colltecting power now
                  
                  console.log(METHOD_NAME,newPlayer.name, "authed! => ", options.realm,userDataForDebug,options.playFabData);
        
                  console.log(METHOD_NAME,newPlayer.name, "authed! returning => ", retData,"newPlayer.coinsCollectedEpoch",newPlayer.coinsCollectedEpoch);
        


                  resolve(retData)
                }
              )
    
            }else{
              console.log( METHOD_NAME,"failed to auth player, did not join => ", result, options.realm,userDataForDebug,options.playFabData);
    
              //when in onJoin it tells them to leave
              //4000 range, 401 for unauthorized
              //client.leave(4401,"Failed to Authenticate Session")
    
              reject(new ServerError(4401, "Failed to Authenticate Session"));
              return false;
    
              //dispose room?
            }
          }
        ).catch(function(error:PlayFabAuthenticationModels.ValidateEntityTokenResponse){
          console.log( METHOD_NAME,"failed to auth player, did not join => ", error, options.realm,userDataForDebug,options.playFabData);
          reject(new ServerError(4401, "Failed to Authenticate Session"));
          return false;
        })
      })
      //https://www.metadoge.art/api/wallet?contractAddress=0x1acF970cf09a6C9dC5c5d7F2ffad9b1F05e4f7a8&ownerAddress=0xbd5b79D53D75497673e699A571AFA85492a2cc74

      promises.push(playFabAuth)
    }
    //promises.push(nftCheck)

    return Promise.all( promises ).then(function(result){
      console.log("onAuth. all promised completed " , result)
      return retData;
    })
  }

  onJoin (client: Client, options: any) {
    console.log("onJoin START " , options)

    this.start()

  }
 
  async onLeave (client: Client, consented: boolean) {
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
            this.savePlayerData('end-game')
          }catch(e){
            console.log("onLeave failed saving player data" + client.sessionId);
          }
        }
        //timer to delete?
        this.state.players.delete(client.sessionId);
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
    console.log("Disposing room...autoDispose",this.autoDispose);
  }

}

