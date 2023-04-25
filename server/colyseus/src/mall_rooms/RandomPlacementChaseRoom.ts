import { Room, Client, ServerError } from "colyseus";
import { Block, BlockType,  BlockTypeTypeConst, MyRoomState, Player } from "./MyRoomState";
//import PlayFab from "../playfab_sdk/PlayFabClientApi";
//import * as PlayFabSDK from  '../playfab_sdk/index'
//import { EntityTokenResponse, GetPlayerCombinedInfoResultPayload, LoginResult, TreatmentAssignment, UserSettings } from '../playfab_sdk/playfab.types'; 
import { PlayFab,PlayFabAuthentication, PlayFabServer } from "playfab-sdk";
import * as PlayFabHelper from "./PlayFabWrapper";

import { coins } from "./coins";
import { CONFIG } from "./config";
import { BaseCoinRoom } from "./BaseCoinRoom";
import { GameEndType, PlayerData } from "./types";
import { RandomPlacementRoom } from "./RandomPlacementRoom";


//var PlayFab: PlayFab ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFab");
//var PlayFabClient: PlayFabClientModule.IPlayFabClient ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFabClient");

//let playerLoginResult:LoginResult;

const maxFloorHeight = 6
const defaultPlayerHeight = 1.724029541015625
const maxDistanceRndPosition = (CONFIG.PARCEL_SIZE/2) * 16;

export class RandomPlacementChaseRoom extends RandomPlacementRoom {
  
  onCreate (options: any) {
    super.onCreate(options)
  }

  gameEndedNotify(data:GameEndType){
    super.gameEndedNotify(data)
  }


  setUp() {
    this.levelDuration = 2 * 60
    this.expireTimeInSeconds = -1 //5*1000// 10*1000
    this.numCoinsToPlace = 30
    this.enableOnExpireRespawn = false
    this.enableOnCollectRespawn = false

    this.levelCoinPos = coins

    this.maxMCSpawn = this.levelCoinPos.length * (this.maxMCSpawn/this.numCoinsToPlace)

    if(CONFIG.SPAWN_MATERIAL_ITEMS_ENABLED){
      this.maxMaterial1Spawn = this.levelCoinPos.length * (this.maxMaterial1Spawn/this.numCoinsToPlace)
      this.maxMaterial2Spawn = this.levelCoinPos.length * (this.maxMaterial2Spawn/this.numCoinsToPlace)
      this.maxMaterial3Spawn = this.levelCoinPos.length * (this.maxMaterial3Spawn/this.numCoinsToPlace)
    }
    
    //this.everyNCoinsBigBonus = -1

    super.setUp()
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

  _applyBoundaries(coord: number) {
    // ensure value is between 1 and 15.
    return Math.max(2, Math.min((CONFIG.PARCEL_SIZE * 16) - 2, coord));
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


