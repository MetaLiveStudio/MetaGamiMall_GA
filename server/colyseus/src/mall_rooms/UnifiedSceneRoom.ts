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
import { coinsUnifiedScene } from "../coin_config/coinsUnifiedScene";


//var PlayFab: PlayFab ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFab");
//var PlayFabClient: PlayFabClientModule.IPlayFabClient ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFabClient");

//let playerLoginResult:LoginResult;

PlayFab.settings.titleId = CONFIG.PLAYFAB_TITLEID
PlayFab.settings.developerSecretKey = CONFIG.PLAYFAB_DEVELOPER_SECRET


export class UnifinedScene extends PadSurferInfin {
  
  async onCreate (options: any) {
    const promise = super.onCreate(options)
    return promise
  }

  gameEndedNotify(data:GameEndType){
    super.gameEndedNotify(data)
  }

  setupLevelCoinPos(){
    //pick coin config 
    this.levelCoinPos = coinsUnifiedScene
  }
  
  setupCoins(){    
    super.setupCoins()
  }
  async setUp(coinDataOptions:serverStateSpec.CoinRoomDataOptions) {
    return super.setUp(coinDataOptions)
  }

  start(){
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

  }

  reSpawnCollectedBlock(blockToCollect: Block) {
    super.reSpawnCollectedBlock(blockToCollect)
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


