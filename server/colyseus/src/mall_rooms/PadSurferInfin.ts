import { Client } from "colyseus";
//import PlayFab from "../playfab_sdk/PlayFabClientApi";
//import * as PlayFabSDK from  '../playfab_sdk/index'
//import { EntityTokenResponse, GetPlayerCombinedInfoResultPayload, LoginResult, TreatmentAssignment, UserSettings } from '../playfab_sdk/playfab.types'; 
import { PlayFab } from "playfab-sdk";
import { BaseCoinRoom } from "./BaseCoinRoom";
import { CONFIG } from "./config";
import { Block, BlockType } from "./MyRoomState";
import { GameEndType, PlayerData } from "./types";



//var PlayFab: PlayFab ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFab");
//var PlayFabClient: PlayFabClientModule.IPlayFabClient ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFabClient");

//let playerLoginResult:LoginResult;

PlayFab.settings.titleId = CONFIG.PLAYFAB_TITLEID
PlayFab.settings.developerSecretKey = CONFIG.PLAYFAB_DEVELOPER_SECRET


export class PadSurferInfin extends BaseCoinRoom {
  
  private reloadLevelElapseTime = 0
  private reloadLevelIntervalMillis = 10 * 1000

  onCreate (options: any) {
    super.onCreate(options)
  }

  gameEndedNotify(data:GameEndType){
    console.log("gameEndedNotify called (PadSurferInfin) ",data)
    //super.gameEndedNotify(data)//would end game

    //console.log("clockIntervalUpdate",elapsedTime,dt,this.levelTime,this.reloadLevelElapseTime);
    
    //just restart it
   // if( this.reloadLevelElapseTime > this.reloadLevelIntervalMillis ){
      console.log("clockIntervalUpdate.reload");
      
      //this.broadcast("");

      this.state.countdown = this.levelDuration;

      this.resetCoinData()

      this.setupCoins()

      this.reloadLevelElapseTime = 0 //reset

      //reset height (coins collected) so endGame does not get triggered
      this.currentHeight = 0
    //}
    //keep track of dt. if 
  }


  setupCoins(){
    super.setupCoins()
  }
  setUp() {
    this.expireTimeInSeconds = -1
    //make respawn time what was default a level duration
    
    if(CONFIG.GAME_ININITE_MODE_RESHUFFLE_DURATION > -1){
      this.levelDuration = CONFIG.GAME_ININITE_MODE_RESHUFFLE_DURATION //coded to mean infinite, but dont want overflow errors
    }

    //do end game when threshold reached. break out into own flag??
    this.enableEndGameWhenCollectThresholdReached = CONFIG.GAME_MAX_COINS_COLLECTABLE_THRESHOLD > -1

    //this.levelDurationThreshold = 0//when reached it is over
    this.levelDurationEnabled = false
    //this.levelDurationIncrement = -1 //direction of counter
    this.enableOnExpireRespawn = false
    this.enableOnCollectRespawn = CONFIG.GAME_ININITE_MODE_ON_COLLECT_RESPAWN_ENABLED
    //below 0 is undefiend
    if(CONFIG.GAME_ININITE_MODE_ON_COLLECT_RESPAWN_DELAY > -1){
      this.onCollectRespawnTimeInSeconds = CONFIG.GAME_ININITE_MODE_ON_COLLECT_RESPAWN_DELAY
    }

    this.startGameWaitTime = 0//for inite no wait time
    super.setUp()
  }

  start(){
    this.isStarted = true
    super.start();
    
  } 

  clockIntervalUpdate(elapsedTime:number,dt:number){
    super.clockIntervalUpdate(elapsedTime,dt)

    this.reloadLevelElapseTime += dt
    
    
  }
  removeBlock(id: string) {
    super.removeBlock(id)  
  }

  collectBlock(client: Client,playerData:PlayerData,id: string) {
    super.collectBlock(client,playerData,id)
  }

  postCollectBlockAction(playerData:PlayerData,id: string,block:Block) {
    super.postCollectBlockAction(playerData,id,block)

    if(this.enableOnCollectRespawn){
      this.reSpawnCollectedBlock(block)
    }
  }

  reSpawnCollectedBlock(blockToCollect: Block) {
    //const blockToCollect = this.state.blocks.get( id );

    //this.returnBlockToPool(blockToCollect)

    const block = this.getBlockFromPool(blockToCollect)//blockToCollect

    //place block
    //const atIndex = this.blockList.indexOf(block)
    //console.log("collectBlock atIndex:" + atIndex," blockSize",this.state.blocks.size)
    

    const nowMs = new Date().getTime()
    let createTime = nowMs
    if(this.onCollectRespawnTimeInSeconds >=0 ){
      createTime = nowMs + (this.onCollectRespawnTimeInSeconds*1000)
    }
    block.createTime = createTime //will use create time and can future stamp it
    if(this.expireTimeInSeconds >= 0){
      block.expireTime = nowMs + (this.expireTimeInSeconds)
    }else{
      block.expireTime = -1
    }
    this.makeAllFieldsDirty(block)
    //this.randomlyPlaceBlock(block)

    //will schedule it to be added to state when time comes
    this.addToSpawnMgr(block,"reSpawnCollectedBlock",false)
  }

  factoryNewBlock(args?:BlockType) {
    return super.factoryNewBlock(args);
  }

  onAuth(client:Client, options:any):Promise<any> { 
    return super.onAuth(client,options)
  }

  onJoin (client: Client, options: any) {
    super.onJoin(client,options)
  }
 
  async onLeave (client: Client, consented: boolean) {
    super.onLeave(client,consented)
  }

  onDispose() {
    super.onDispose()
  }

}


