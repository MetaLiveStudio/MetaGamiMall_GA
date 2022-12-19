import { Room, Client, ServerError } from "colyseus";
import { Block, BlockType,  BlockTypeTypeConst, MyRoomState, Player } from "./MyRoomState";
//import PlayFab from "../playfab_sdk/PlayFabClientApi";
//import * as PlayFabSDK from  '../playfab_sdk/index'
//import { EntityTokenResponse, GetPlayerCombinedInfoResultPayload, LoginResult, TreatmentAssignment, UserSettings } from '../playfab_sdk/playfab.types'; 
import { PlayFab,PlayFabAuthentication, PlayFabServer } from "playfab-sdk";
import * as PlayFabHelper from "./PlayFabWrapper";

import { coins, voxParkCoins } from "./coins";
import { CONFIG } from "./config";
import { BaseCoinRoom } from "./BaseCoinRoom";
import { GameEndType, PlayerData } from "./types";


//var PlayFab: PlayFab ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFab");
//var PlayFabClient: PlayFabClientModule.IPlayFabClient ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFabClient");

//let playerLoginResult:LoginResult;

PlayFab.settings.titleId = CONFIG.PLAYFAB_TITLEID
PlayFab.settings.developerSecretKey = CONFIG.PLAYFAB_DEVELOPER_SECRET


export class VoxBoardParkRoom extends BaseCoinRoom {
  
  onCreate (options: any) {
    super.onCreate(options)
  }

  gameEndedNotify(data:GameEndType){
    super.gameEndedNotify(data)
  }

  updatePlayerStats():Promise<any[]>{
    return super.updatePlayerStats()
  }


  setUp() {

    this.levelDuration = 90
    this.guestCoinType = BlockTypeTypeConst.VB
    this.levelCoinPos = voxParkCoins

    super.setUp()
  }

  setupCoins(){
    super.setupCoins()
  }
  
  //@Overriding
  initCoinsPool(){
    
    //const blocks = []
    this.levelCoinPos.forEach((coin, key)=> {
      let blockType = BlockTypeTypeConst.GC.symbol
      const block = this.factoryNewBlock({id:`coin-${key}`, x:coin[0], y:coin[1]+CONFIG.COIN_HEIGHT_ADJUSTED, z:coin[2], type: blockType, visible:true})
      block.type = BlockTypeTypeConst.VB.symbol
      //blocks.push(block)
    })
    //how many
    /*const maxMC = Math.min(this.blockList.length,this.maxMCSpawn)
    for(let x=0;x<maxMC;x++){
      const index = Math.floor(Math.random() * this.blockList.length)
      const block = this.blockList[index]
      if(block.type != BlockTypeTypeConst.MC.symbol){
        block.type = BlockTypeTypeConst.MC.symbol
      }else{
        x--//keep looping
      }
    }*/
  }

  start(){

    super.start();
    
  } 

  removeBlock(id: string) {
    super.removeBlock(id)  
  }

  collectBlock(playerData:PlayerData,id: string) {
    super.collectBlock(playerData,id)
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


