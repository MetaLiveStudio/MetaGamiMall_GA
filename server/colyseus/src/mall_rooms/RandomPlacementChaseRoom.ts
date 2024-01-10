import { Room, Client, ServerError } from "colyseus";
import { Block, BlockType,  BlockTypeTypeConst, MyRoomState, Player } from "./MyRoomState";
//import PlayFab from "../playfab_sdk/PlayFabClientApi";
//import * as PlayFabSDK from  '../playfab_sdk/index'
//import { EntityTokenResponse, GetPlayerCombinedInfoResultPayload, LoginResult, TreatmentAssignment, UserSettings } from '../playfab_sdk/playfab.types'; 
import { PlayFab,PlayFabAuthentication, PlayFabServer } from "playfab-sdk";
import * as PlayFabHelper from "./PlayFabWrapper";

import { coins } from "../coin_config/coins";
import { CONFIG } from "./config";
import { BaseCoinRoom } from "./BaseCoinRoom";
import { GameEndType, PlayerData } from "./types";
import { RandomPlacementRoom } from "./RandomPlacementRoom";
import * as serverStateSpec from "./MyRoomStateSpec";

//var PlayFab: PlayFab ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFab");
//var PlayFabClient: PlayFabClientModule.IPlayFabClient ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFabClient");

//let playerLoginResult:LoginResult;

const maxFloorHeight = 6
const defaultPlayerHeight = 1.724029541015625
const maxDistanceRndPosition = (CONFIG.PARCEL_SIZE/2) * 16;

export class RandomPlacementChaseRoom extends RandomPlacementRoom {
  
  async onCreate (options: any) {
    return super.onCreate(options)
  }

  gameEndedNotify(data:GameEndType){
    super.gameEndedNotify(data)
  }


  async setUp(coinDataOptions:serverStateSpec.CoinRoomDataOptions) {
    this.levelDuration = 2 * 60
    this.expireTimeInSeconds = -1 //5*1000// 10*1000
    this.numCoinsToPlace = 30
    this.enableOnExpireRespawn = false
    this.enableOnCollectRespawn = false

    this.levelCoinPos = coins

    this.mCSpawn.amount = this.levelCoinPos.length * (this.mCSpawn.max/this.numCoinsToPlace)

    if(CONFIG.SPAWN_MATERIAL_ITEMS_ENABLED){
      this.maxMaterial1Spawn.amount = this.levelCoinPos.length * (this.maxMaterial1Spawn.max/this.numCoinsToPlace)
      this.maxMaterial2Spawn.amount = this.levelCoinPos.length * (this.maxMaterial2Spawn.max/this.numCoinsToPlace)
      this.maxMaterial3Spawn.amount = this.levelCoinPos.length * (this.maxMaterial3Spawn.max/this.numCoinsToPlace)
    }
    
    //this.everyNCoinsBigBonus = -1

    return super.setUp(coinDataOptions)
  }

  //clock loop update, 1 second
  clockIntervalUpdate(elapsedTime:number,dt:number){
    super.clockIntervalUpdate(elapsedTime,dt);

    
  }

  
  setupCoins() {
    super.setupCoins()
  }

  start(){

    super.start();
    
  } 

  collectBlock(client: Client,playerData:PlayerData,id: string) {
    super.collectBlock(client,playerData,id)
  }

  removeBlock(id: string) {
    //overriding
    super.removeBlock(id)
    //this.removeBlockAndGenNew(id)  
  }

  removeBlockAndGenNew(id: string) {
    super.removeBlockAndGenNew(id)
  }

  //POSSIBLE FIXME, this room was not used and the argument value passed in changed possibly
  //changing how this works, coord is now random position
  _applyBoundaries(coord: number, minParcelPos:number,maxParcelPos:number) {
    return super._applyBoundaries(coord,minParcelPos,maxParcelPos)
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


