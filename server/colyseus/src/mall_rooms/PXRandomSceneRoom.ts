import { Client } from "colyseus";
//import PlayFab from "../playfab_sdk/PlayFabClientApi";
//import * as PlayFabSDK from  '../playfab_sdk/index'
//import { EntityTokenResponse, GetPlayerCombinedInfoResultPayload, LoginResult, TreatmentAssignment, UserSettings } from '../playfab_sdk/playfab.types'; 
import { PlayFab } from "playfab-sdk";
import { BaseCoinRoom } from "./BaseCoinRoom";
import { CONFIG } from "./config";
import { Block, BlockType } from "./MyRoomState";
import { GameEndType, PlayerData } from "./types";
import * as serverStateSpec from "./MyRoomStateSpec";
import { PadSurferInfin } from "./PadSurferInfin";
import { coinsPXPlayerAsScene } from "../coin_config/coinsPXScene";
import { RandomPlacementRoom } from "./RandomPlacementRoom";


//var PlayFab: PlayFab ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFab");
//var PlayFabClient: PlayFabClientModule.IPlayFabClient ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFabClient");

//let playerLoginResult:LoginResult;

PlayFab.settings.titleId = CONFIG.PLAYFAB_TITLEID
PlayFab.settings.developerSecretKey = CONFIG.PLAYFAB_DEVELOPER_SECRET

const CLASSNAME = "PXRandomSceneRoom"

function plusOrMinus(){
  return Math.random() < 0.5 ? -1 : 1;
} 

export class PXRandomSceneRoom extends RandomPlacementRoom {
  
  async onCreate (options: any) {
    const promise = super.onCreate(options)
    return promise
  }

  gameEndedNotify(data:GameEndType){
    super.gameEndedNotify(data)
  }

  setupLevelCoinPos(){
    //pick coin config 
    this.levelCoinPos = coinsPXPlayerAsScene
  }
  setupCoins(){
    this.setupLevelCoinPos()
    //this.parcelSize = {x:2,y:16,z:2}
    
    super.setupCoins()

  }

  //called from inside setup
  applyRemoteConfig(configData: { data: serverStateSpec.RemoteBaseCoinRoomConfig; }) {
    const METHOD_NAME = "applyRemoteConfig"

    //this.expireTimeInSeconds
    //calling here cuz is not a promise that will cause issues
    //and need it before coins are setup. no good place to overide
    //with how setUp is overloaded in mulitple places
    //below 0 is undefined

    //setting defaults for remote config to override if defined
    this.numCoinsToPlace = 5
    this.maxDistanceSpawnRndPosition = 16;

    super.applyRemoteConfig(configData)    

    //for testing fast spawning
    //this.expireTimeInSeconds = 2
  }

  async setUp(coinDataOptions:serverStateSpec.CoinRoomDataOptions) {
    this.expireTimeInSeconds = 3*60//-1 //default to 3 minutes expire in case in walls etc
    //make respawn time what was default a level duration
    
    if(CONFIG.GAME_ININITE_MODE_RESHUFFLE_DURATION > -1){
      this.levelDuration = CONFIG.GAME_ININITE_MODE_RESHUFFLE_DURATION //coded to mean infinite, but dont want overflow errors
    }

    //do end game when threshold reached. break out into own flag??
    this.enableEndGameWhenCollectThresholdReached = CONFIG.GAME_MAX_COINS_COLLECTABLE_THRESHOLD > -1

    //this.levelDurationThreshold = 0//when reached it is over
    this.levelDurationEnabled = false
    //this.levelDurationIncrement = -1 //direction of counter
    this.enableOnExpireRespawn = true
    this.enableOnCollectRespawn = CONFIG.GAME_ININITE_MODE_ON_COLLECT_RESPAWN_ENABLED
    //below 0 is undefiend
    if(CONFIG.GAME_ININITE_MODE_ON_COLLECT_RESPAWN_DELAY > -1){
      this.onCollectRespawnTimeInSeconds = CONFIG.GAME_ININITE_MODE_ON_COLLECT_RESPAWN_DELAY
    }

    this.startGameWaitTime = 0//for inite no wait time
    
    return super.setUp(coinDataOptions)
  }

  start(){
    super.start();
    
  } 

  //px means only 1 person here so fetch only player
  getPlayerOfPX():PlayerData{
    const METHOD_NAME = "getPlayerOfPX"

    const serverSide = Object.values(this.playerServerSideData)[0]
    const clientSide = this.state.players.values().next().value

    //make sure same person
    if(!serverSide){
      //maybe just disconnected???
      console.log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"ERROR!!!!!!!!! no serverSide to check on??!?!?!? match!!!",this.playerServerSideData,clientSide?.playerFabId)
      console.log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"ERROR!!!!!!!!! no serverSide to check on??!?!?!? match!!!",this.playerServerSideData,clientSide?.playerFabId)
      console.log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"ERROR!!!!!!!!! no serverSide to check on??!?!?!? match!!!",this.playerServerSideData,clientSide?.playerFabId)
    }else if(!serverSide?.playFabData){
      //maybe just disconnected???
      console.log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"WARNING!!!!!! no playFabData to check on??!?!?!? match!!!",serverSide?.playFabData,clientSide?.playerFabId)
    } else if( serverSide.playFabData && serverSide.playFabData.id !== clientSide.playerFabId){
      console.log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"WARNING!!!!!! playfabid miss match!!!",serverSide?.playFabData.id,clientSide?.playerFabId)
    }

    return {serverSide: serverSide,clientSide: clientSide }
  }

  assignRandomBlockPosition(block:Block){
    const METHOD_NAME = "assignRandomBlockPosition"

    super.assignRandomBlockPosition(block);

    //px means only 1 person here so fetch only player
    
    const playerData = this.getPlayerOfPX()
    if(playerData && playerData.serverSide && playerData.serverSide.playerTransform){
      const playerTransform = playerData.serverSide.playerTransform

      const jumpEveryXCoin = CONFIG.COIN_JUMP_EVERY_N

      const origBlockVals = {x:block.x,y:block.y,z:block.z}

      block.x = (block.x*plusOrMinus())+playerTransform.position.x
      block.y = playerTransform.position.y + .5//+ (CONFIG.COIN_HEIGHT_ADJUSTED/2)
      block.z = (block.z*plusOrMinus())+playerTransform.position.z

      if(jumpEveryXCoin != 0 && Math.random( ) * jumpEveryXCoin <= 1){
        this.adjustBlockForJumpHeight(block)
      }

      //console.log(METHOD_NAME,"adjusted block relative to player position",playerData?.serverSide?.playerTransform,"was ",origBlockVals,"now",JSON.stringify(block))

      this.makeAllFieldsDirty( block )
    }else{
      console.log(CLASSNAME,this.getLogRoomIdent(),METHOD_NAME,"WARNING no player data to alter position",playerData?.serverSide?.playerTransform,playerData)
    }
  }

  removeBlock(id: string) {
    super.removeBlock(id)  
  }

  collectBlock(client: Client,playerData:PlayerData,id: string) {
    super.collectBlock(client,playerData,id)
  }

  postCollectBlockAction(playerData:PlayerData,id: string,block:Block) {
    super.postCollectBlockAction(playerData,id,block)

  }
  preAddBlockToSpawnMgr(block:Block,event:string,immediate:boolean){
    super.preAddBlockToSpawnMgr(block,event,immediate);

    //apply random position again to match player current area
    this.assignRandomBlockPosition(block)
  }
  /*reSpawnCollectedBlock(blockToCollect: Block) {
    super.reSpawnCollectedBlock(blockToCollect)
  }*/

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


