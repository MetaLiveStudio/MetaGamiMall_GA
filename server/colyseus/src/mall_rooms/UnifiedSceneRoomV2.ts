import { Client } from "colyseus";
//import PlayFab from "../playfab_sdk/PlayFabClientApi";
//import * as PlayFabSDK from  '../playfab_sdk/index'
//import { EntityTokenResponse, GetPlayerCombinedInfoResultPayload, LoginResult, TreatmentAssignment, UserSettings } from '../playfab_sdk/playfab.types'; 
import { PlayFab } from "playfab-sdk";
import { BaseCoinRoom } from "./BaseCoinRoom";
import { CONFIG } from "./config";
import { UnifinedScene } from "./UnifiedSceneRoom";
import { coinsUnifiedSceneV2 } from "../coin_config/coinsUnifiedSceneV2";


//var PlayFab: PlayFab ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFab");
//var PlayFabClient: PlayFabClientModule.IPlayFabClient ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFabClient");

//let playerLoginResult:LoginResult;

PlayFab.settings.titleId = CONFIG.PLAYFAB_TITLEID
PlayFab.settings.developerSecretKey = CONFIG.PLAYFAB_DEVELOPER_SECRET


export class UnifinedSceneV2 extends UnifinedScene {
 
  setupLevelCoinPos(){
    //pick coin config 
    this.levelCoinPos = coinsUnifiedSceneV2
  }
  
  setupCoins(){
    super.setupCoins()
  }
}


