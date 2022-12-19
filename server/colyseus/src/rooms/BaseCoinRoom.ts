import { Room, Client, ServerError } from "colyseus";
import { Block, BlockDefType, BlockMaterialDefType, BlockType,  BlockTypeTypeConst, MyRoomState, Player } from "./MyRoomState";
//import PlayFab from "../playfab_sdk/PlayFabClientApi";
//import * as PlayFabSDK from  '../playfab_sdk/index'
//import { EntityTokenResponse, GetPlayerCombinedInfoResultPayload, LoginResult, TreatmentAssignment, UserSettings } from '../playfab_sdk/playfab.types'; 
import { PlayFab,PlayFabAuthentication, PlayFabServer } from "playfab-sdk";
import * as PlayFabHelper from "./PlayFabWrapper";

import { coins } from "./coins";
import { CONFIG } from "./config";
import { GameEndType, PlayerData, PlayerServerSideData } from "./types";
import fetch from 'decentraland-crypto-fetch'

//var PlayFab: PlayFab ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFab");
//var PlayFabClient: PlayFabClientModule.IPlayFabClient ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFabClient");

//let playerLoginResult:LoginResult;

PlayFab.settings.titleId = CONFIG.PLAYFAB_TITLEID
PlayFab.settings.developerSecretKey = CONFIG.PLAYFAB_DEVELOPER_SECRET



export class BaseCoinRoom extends Room<MyRoomState> {
  protected currentHeight: number = 0;
  protected maxBlocksCollectable: number = 0
  protected isFinished: boolean = false;
  protected isStarted: boolean = false;
  protected blockIdGenerator = 0;
  protected blockList:Block[] = [] //creation order is easier to track
  protected blockPoolList:Block[] = [] //creation order is easier to track. keeps track of unused blocks
  protected authResult: PlayFabAuthenticationModels.ValidateEntityTokenResponse 
  protected playerServerSideData:Record<string,PlayerServerSideData> = {}
  protected expireTimeInSeconds = -1
  protected enableOnExpireRespawn = false
  protected enableOnCollectRespawn = false
  protected maxMCSpawn = 5 //max number of meta coins are visible
  protected maxMaterial1Spawn = 9 //max number of material 1
  protected maxMaterial2Spawn = 9 //max number of material 1
  protected maxMaterial3Spawn = 9 //max number of material 1
  protected pullBlockCount = 5
  protected levelDuration = CONFIG.ROUND_DURATION
  protected levelCoinPos:number[][] = coins
  protected guestCoinType:BlockDefType

  //update time every 1 second
  //do onCreate
  //this.setSimulationInterval((deltaTime) => this.update(deltaTime), 1000);

  // GAME SERVER LOOP
  //update(dt:number){

    
  onCreate (options: any) {
    // Kick off the actual login call
    //DoExampleLoginWithCustomID();
    const myRoom = this

    //login server side playfab
    var loginRequest: PlayFabAuthenticationModels.GetEntityTokenRequest= {}
    PlayFabHelper.GetEntityToken(loginRequest).then(function(result:PlayFabAuthenticationModels.ValidateEntityTokenResponse){
        console.log("promise.GetEntityToken",result);
        myRoom.authResult = result;
    }).catch(function(error:PlayFabAuthenticationModels.ValidateEntityTokenResponse){
      console.log("promise.GetEntityToken failed",error);
    })
    
    this.setState(new MyRoomState());

    // set-up the game!
    this.setUp();

    
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
      this.collectBlock(playerData,id);

      if (this.currentHeight >= CONFIG.MAX_BLOCK_HEIGHT || this.currentHeight >= this.maxBlocksCollectable) {

        if (!this.isFinished) {
          //
          // winner! reached max block height!
          //
          
          this.gameEndedNotify({timedOut:false})

        }

      }
    });

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

  gameEndedNotify(data:GameEndType){
    console.log("gameEndedNotify called ",data)

    if(!this.isFinished){
      this.isFinished = true;

      this.clock.clear()

      this.updatePlayerStats().then((result)=>{
        console.log("XXXXX gameEndedNotify all promised completed " , result)
        
        //if(data.client){
          //player.id
          //this.clients
          for(let p in this.clients){
            
            const client = this.clients[p]
            console.log("XXXXX gameEndedNotify sending to client " , client.sessionId)
            const playerData:PlayerData = this.getPlayerData(client.sessionId)
            //const playFabId = playerData.serverSide.playFabData.id;
            //const player = playerData.clientSide
            if(playerData !== undefined){
              console.log("sending "+playerData.serverSide.endGameResult)
              client.send("endGameResultsMsg",playerData.serverSide.endGameResult) 
              //this.broadcast("endGameResultsMsg",playerData.serverSide.endGameResult)
            }
          }
        //}
        this.broadcast("finished");
        
      })
    }else{
      console.log("gameEndedNotify called already!!!! ",data)
    }
  }

  updatePlayerStats():Promise<any[]>{
    const promises:Promise<any>[] = [];

    let loopCount = 0

    for(const p in this.playerServerSideData){
        console.log("updatePlayerStats looping" + loopCount + " " + p)
      //this.state.players.forEach((player) => {
  
        //player.id
        const playerData:PlayerData = this.getPlayerData(this.playerServerSideData[p].sessionId)
        const playFabId = playerData.serverSide.playFabData.id;
        const player = playerData.clientSide

        console.log("updatePlayerStats looping" + loopCount + " " + p + "  "+ playerData,player.id)
        if(playerData === undefined){
          console.log("updatePlayerStats looping" + loopCount + " " + p + " was nulll")
          continue;
        }
  
        var addGCPlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = this.createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.GC.symbol,player.coinGcCount )
        var addMCPlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = this.createAddUserVirtualCurrency( playFabId, BlockTypeTypeConst.MC.symbol,player.coinMcCount )
        
        
        var grantMaterial1: PlayFabServerModels.GrantItemsToUserRequest = { ItemIds: [], PlayFabId: playFabId }
        var grantMaterial2: PlayFabServerModels.GrantItemsToUserRequest = { ItemIds: [], PlayFabId: playFabId }
        var grantMaterial3: PlayFabServerModels.GrantItemsToUserRequest = { ItemIds: [], PlayFabId: playFabId }

        this.addMaterialToUser( grantMaterial1,BlockTypeTypeConst.M1,player.material1Count )
        this.addMaterialToUser( grantMaterial2,BlockTypeTypeConst.M2,player.material2Count )
        this.addMaterialToUser( grantMaterial3,BlockTypeTypeConst.M3,player.material3Count )

        //this.addMaterialToUser( grantMaterials,BlockTypeTypeConst.C1,player.container1Count )
        
        var addGuestPlayerCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest= { 
          Amount: player.coinGuestCount,
          PlayFabId: playFabId,
          // Name of the virtual currency which is to be incremented.
          VirtualCurrency: (this.guestCoinType) ? this.guestCoinType.symbol : ''
        }

        var updatePlayerStats: PlayFabHelper.EndLevelUpdatePlayerStatsRequest = {
          playFabId: playFabId,
          coinMultiplier: (this.guestCoinType) ? 1 : playerData.serverSide.coinMultiplier,
          addGCCurrency: addGCPlayerCurrency,
          addMCCurrency: addMCPlayerCurrency,
          
          grantMaterial1: grantMaterial1,
          grantMaterial2: grantMaterial2,
          grantMaterial3: grantMaterial3,

          addGuestCurrency: addGuestPlayerCurrency
          //playerCombinedInfo: getPlayerCombinedInfo
        }
  
        const promise = PlayFabHelper.EndLevelGivePlayerUpdatePlayerStats(updatePlayerStats)
        
        const guestCoinType = this.guestCoinType
        promise.then(function(result:PlayFabHelper.EndLevelUpdatePlayerStatsResult){
            console.log("XXXXX updatePlayerStats promise.EndLevelGivePlayerUpdatePlayerStats " + p + " " + player.id,result);
            //myRoom.authResult = result;

            if(result.endGameResult && guestCoinType){ 
              result.endGameResult.guestCoinName = guestCoinType.name
            }

            playerData.serverSide.endGameResult = result.endGameResult
            //client.send("announce",'TODO show game finished stats')
        }).catch(function(error:PlayFabServerModels.ModifyUserVirtualCurrencyResult){
          console.log("promise.EndLevelGivePlayerUpdatePlayerStats failed",error);
        })

        promises.push(promise)

        loopCount++;
      }

      console.log("updatePlayerStats loopCount" + loopCount )
      
      return Promise.all( promises ).then(function(result){
        console.log("XXXXX updatePlayerStats all promised completed " , result)
        return result;
      })
  }


  addMaterialToUser(grantMaterials: PlayFabServerModels.GrantItemsToUserRequest,material: BlockMaterialDefType, amount: number) {
    if(material.itemId === undefined){
      console.log("addMaterialToUser WARNING material itemId was null/missing. not adding",material,amount)
    }
    if(amount > 0 && material.itemId !== undefined){
      for(let x=0;x<amount;x++){
        grantMaterials.ItemIds.push( material.itemId )
      }
    }
  }

  createAddUserVirtualCurrency(playFabId:string,symbol: string, amount: number) {
    var addCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest= { 
      Amount: amount,
      PlayFabId: playFabId,
      // Name of the virtual currency which is to be incremented.
      VirtualCurrency: symbol
    }

    return addCurrency
  }


  getPlayerData(sessionId:string): PlayerData {
    return {serverSide: this.playerServerSideData[sessionId],clientSide: this.state.players.get(sessionId) }
  }

  setUp() {

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
      this.state.blocks.clear();
    }

    this.setupCoins()


    this.currentHeight = 0;
    this.isFinished = false;
    this.isStarted = false

    // reset all player's score position
    this.state.players.forEach((player) => {
      player.coinsCollected = 0;
      player.score = 0;
      player.coinGcCount = 0;
      player.coinMcCount = 0;

      player.material1Count = 0;
      player.material2Count = 0;
      player.material3Count = 0;
      player.container1Count = 0;

      player.coinGuestCount = 0;
    });


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
      console.log("putting back in pool ",block.id)
      this.blockPoolList.push(block)
    }else{
      console.log("unable to put back in pool ",block)
    }
  }
  getBlockFromPool(){
    //this.factoryNewBlock()
    if(this.blockPoolList.length > 0){
      const block = this.blockPoolList.shift()

      console.log("returning block ",block.id,"poolSize:",this.blockPoolList.length)

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

    this.spawnOtherTypes( this.maxMaterial1Spawn, CONFIG.MAX_SPAWN_SEARCH_TRIES, BlockTypeTypeConst.GC.symbol,BlockTypeTypeConst.M1.symbol )
    this.spawnOtherTypes( this.maxMaterial2Spawn, CONFIG.MAX_SPAWN_SEARCH_TRIES, BlockTypeTypeConst.GC.symbol,BlockTypeTypeConst.M2.symbol )
    this.spawnOtherTypes( this.maxMaterial3Spawn, CONFIG.MAX_SPAWN_SEARCH_TRIES, BlockTypeTypeConst.GC.symbol,BlockTypeTypeConst.M3.symbol )
    
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
        this.state.blocks.set(block.id,block)
      }else{
        //skip it
        skippedCoin++;
      }
      counter++;
    }
    //setting to state block size for now but nothing says it cannot grow or not match state block size (hidden coins for example)
    this.maxBlocksCollectable = this.state.blocks.size

    this.state.totalCoins = this.levelCoinPos.length //should this be something else?
    
    console.log("setup total:",counter,'this.maxBlocksCollectable',this.maxBlocksCollectable," skipped",skippedCoin,'everyXCoin',skipEveryXCoin,'skipType',skipType,'jumpCoin',jumpCoin)
    //randomly change block type
    
  }

  //clock loop update, 1 second
  clockIntervalUpdate(dt:number){
     //noop
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
        
        this.clockIntervalUpdate(this.clock.elapsedTime)

        if (this.state.countdown > 0) {
          if (!this.isFinished) {
            this.state.countdown--;
          }
        } else {
          //this.broadcast("restart");

          // countdown reached zero! restart the game!
          this.gameEndedNotify({timedOut:false})
        }
      }, 1000);

      this.isStarted = true

      this.broadcast("start");
    },CONFIG.START_GAME_WAIT_TIME) //delay start for 4 seconds to give client a chance to fire up
  } 

  collectBlock(playerData:PlayerData,id: string) {
    //TODO fix race condition
    const blockToCollect = this.state.blocks.get( id );
    
    if(blockToCollect === null || blockToCollect === undefined ){
      //TODO track collected block / call back to remove from scene if somehow remains
      console.log("collectBlock block not found. collected already or not real " + id)
      return;
    }

    const player = playerData.clientSide;

    

    blockToCollect.collectedBy = player.id+";;" + player.name+";;fabid-"+playerData.serverSide.playFabData.id
    player.coinsCollected ++

    //console.log("coin ",blockToCollect.type,"val",blockToCollect.value,"gc",player.coinGcCount,"mc",player.coinMcCount,"m1",player.material1Count,player.material2Count,player.material3Count)

    //TODO need to determine type
    if(blockToCollect.type==BlockTypeTypeConst.GC.symbol){
      player.coinGcCount += blockToCollect.value
    }else if(blockToCollect.type==BlockTypeTypeConst.MC.symbol){
      player.coinMcCount += blockToCollect.value
    }else if(blockToCollect.type==BlockTypeTypeConst.M1.symbol){
      player.material1Count += blockToCollect.value
    }else if(blockToCollect.type==BlockTypeTypeConst.M2.symbol){
      player.material2Count += blockToCollect.value
    }else if(blockToCollect.type==BlockTypeTypeConst.M3.symbol){
      player.material3Count += blockToCollect.value
    }else if(blockToCollect.type==BlockTypeTypeConst.VB.symbol){
      console.log("coin ",blockToCollect.type,blockToCollect.value,player.coinGuestCount)
      player.coinGuestCount += blockToCollect.value
    }else{
      console.warn("unknown block type dont know how to score it ",blockToCollect)
    }

    this.currentHeight++;

    //this.removeBlockAndGenNew( id )
    this.removeBlock( id )
  }

  removeBlock(id: string) {
    const blockToCollect = this.state.blocks.get( id );
    this.state.blocks.delete(id)
    this.blockPoolList.push(blockToCollect)
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
    //move AuthenticateSessionTicket to async onAuth(client, options) { ???

    const promises:Promise<any>[] = [];

    const retData:PlayerServerSideData = {sessionId:undefined,playFabData:undefined,coinMultiplier:1}


    const userDataForDebug = 
    {
      displayName: options.userData.displayName,
      publicKey: options.userData.publicKey,
      hasConnectedWeb3: options.userData.hasConnectedWeb3,
      userId: options.userData.userId,
      version: options.userData.version
    }
  

    console.log("STARTING")
    const nftCheck = new Promise((mainResolve, reject) => {
      //console.log("nftCheck entered promise")
      (async () => {
        const nftURL = CONFIG.CONTRACT_3D_API_CALL + CONFIG.CONTRACT_OWNER_FIELD + userDataForDebug.publicKey
        try {
          console.log("nftCheck calling",nftURL)
          let nftResponse = await fetch(nftURL, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            //body: body,
            //   identity: myIdentity,
          })
      
          //let rewardsResponseData: RewardData = await rewardsResponse.json()
          let nftResponseData = await nftResponse.json()
      
          console.log('NFT RESPONSE: ', nftResponseData)
      
          const nftTypes:string[] = []
          if(nftResponseData.assets){
            for(const p in nftResponseData.assets){
              const nft = nftResponseData.assets[p]
              if(!nft.attributes) continue
              for(const q in nft.attributes){
                const attrs = nft.attributes[q]
                if( attrs.trait_type && attrs.trait_type =='Type' ){
                    nftTypes.push( attrs.value )
                    break
                }
              }
            }
          }
          let multiplier = 1
          for(const p in nftTypes){
            const lowerVal = nftTypes[p].toLowerCase()
            //i dont know exact values so guessing
            if(lowerVal.indexOf("lil") >=0){
              multiplier = Math.max(multiplier,CONFIG.COIN_MULTIPLIER_LILDOGE)
            }else if(lowerVal.indexOf("bro") >=0){
              multiplier = Math.max(multiplier,CONFIG.COIN_MULTIPLIER_DOGE_BRO)
            }else if(lowerVal.indexOf("moon") >=0){
              multiplier = Math.max(multiplier,CONFIG.COIN_MULTIPLIER_MOON_DOGE)
            }else if(lowerVal.indexOf("mars") >=0){
              multiplier = Math.max(multiplier,CONFIG.COIN_MULTIPLIER_MARS_DOGE)
            }else if(lowerVal.indexOf("god") >=0){
              multiplier = Math.max(multiplier,CONFIG.COIN_MULTIPLIER_DOGE_GOD)
            }
          }

          console.log("nftTypes",nftTypes)

          //retData.nftData = nftResponseData
          retData.coinMultiplier = multiplier

          mainResolve(nftResponseData)
          return nftResponseData
        } catch (error) {
          console.log('ERROR FETCHING FROM ', nftURL, error)
          //reject(error)
          //still return, just wont add multiplier
          const failure = {success:false}
          mainResolve(failure)
          return failure
        }
      })()
    })
    const playFabAuth = new Promise((resolve, reject) => {
      PlayFabHelper.AuthenticateSessionTicket( {"SessionTicket":options.playFabData.sessionTicket} ).then(
        (result:PlayFabServerModels.AuthenticateSessionTicketResult)=>{
          console.log("PlayFabHelper.AuthenticateSessionTicket.result",result)
          //TODO set player id to something? wallet? fab id does not seem safe  
          
  
  
          if(result.IsSessionTicketExpired !== undefined && result.IsSessionTicketExpired === false){
            const newPlayer = new Player().assign({
              name: options.userData.displayName || "Anonymous",
              score: 0, coinsCollected: 0,coinGcCount: 0,coinMcCount: 0,coinGuestCount: 0, material1Count: 0, material2Count: 0, material3Count: 0, container1Count: 0
            });
            this.state.players.set(client.sessionId, newPlayer);
  
            //const data:PlayerServerSideData = retData// = {sessionId:client.sessionId,playFabData:options.playFabData}
            retData.sessionId = client.sessionId
            retData.playFabData = options.playFabData

            console.log("onAuth.client.sessionId " + client.sessionId)
  
            //not map it both ways sessionId and playfabId 
            //only map session id, keep it secret? can just loop serverside data object
            this.playerServerSideData[client.sessionId] = retData
            //this.playerServerSideData[options.playFabData] = data
          
            //TODO lookup player current coin colltecting power now
            
            console.log(newPlayer.name, "authed! => ", options.realm,userDataForDebug,options.playFabData);
  
            console.log(newPlayer.name, "authed! returning => ", retData);
  
            resolve(retData)
  
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
      )
      })
    //https://www.metadoge.art/api/wallet?contractAddress=0x1acF970cf09a6C9dC5c5d7F2ffad9b1F05e4f7a8&ownerAddress=WALLET-HERE

    promises.push(playFabAuth)
    promises.push(nftCheck)

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

    /*
    try {
      client.send("onLeave","consented:"+consented) 
    } catch (e) {
      console.log("failed sending onLeave event",player.name,client.sessionId,e)
    }*/
    let removePlayer = true
    
    const waitForReconnect = CONFIG.RECONNECT_WAIT_ENABLED && !consented

    if (waitForReconnect) {
      try {
      
        // allow disconnected client to reconnect into this room until 20 seconds
        await this.allowReconnection(client, CONFIG.RECONNECT_WAIT_TIME);
    
        console.log("onLeave player reconnnected!!!",player.name)
        // client returned! let's re-activate it.
        //this.state.players.get(client.sessionId).connected = true;
        removePlayer = false
      } catch (e) {
        console.log("onLeave player reconnect failed!!!",player.name,client.sessionId,e)
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
      this.state.players.delete(client.sessionId);
    }

  }

  onDispose() {
    console.log("Disposing room...autoDispose",this.autoDispose);
  }

}


