import { Room, Client, Protocol } from "colyseus";
import { Block, BlockType, MyRoomState, Player } from "./MyRoomState";
//import PlayFab from "../playfab_sdk/PlayFabClientApi";
//import * as PlayFabSDK from  '../playfab_sdk/index'
//import { EntityTokenResponse, GetPlayerCombinedInfoResultPayload, LoginResult, TreatmentAssignment, UserSettings } from '../playfab_sdk/playfab.types'; 
import { PlayFab,PlayFabAuthentication, PlayFabServer } from "playfab-sdk";
import date from "date-and-time";
import { CONFIG } from "./config";

//var PlayFab: PlayFab ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFab");
//var PlayFabClient: PlayFabClientModule.IPlayFabClient ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFabClient");

//2021-12-10T02:57:57.208Z
//want to match playfab format just for consistancy
//2021-12-09T22:53:34 GMT-0500

PlayFab.settings.titleId = CONFIG.PLAYFAB_TITLEID
PlayFab.settings.developerSecretKey = CONFIG.PLAYFAB_DEVELOPER_SECRET

function notNull(val:any){
  return val !== null && val !== undefined
}
function isNull(val:any){
  return val === null && val === undefined
}

const c = (resolve:any, reject:any) => {
  //flipped what Pablo gave me. why?
  //return (result:any,error:any) => {
  return (error:any,result:any) => {
      if(error){
          console.log("PlayFab Error", error);
          console.log("PlayFab Result", result);
          reject(error)
      }else{
          resolve(result.data);
      }
  }
}
 
export const GetEntityToken = (request:PlayFabAuthenticationModels.GetEntityTokenRequest):Promise<PlayFabAuthenticationModels.ValidateEntityTokenResponse> => {
      return new Promise((resolve, reject)=>{
        PlayFabAuthentication.GetEntityToken( request, c(resolve, reject)) 
      })
};


export const AddCharacterVirtualCurrency = (request:PlayFabServerModels.AddUserVirtualCurrencyRequest):Promise<PlayFabServerModels.ModifyUserVirtualCurrencyResult> => {
    return new Promise((resolve, reject)=>{
      PlayFabServer.AddUserVirtualCurrency( request, c(resolve, reject)) 
    })
};


export const SubtractUserVirtualCurrency = (request:PlayFabServerModels.SubtractUserVirtualCurrencyRequest):Promise<PlayFabServerModels.ModifyUserVirtualCurrencyResult> => {
  return new Promise((resolve, reject)=>{
    PlayFabServer.SubtractUserVirtualCurrency( request, c(resolve, reject)) 
  })
};


export const AddUserVirtualCurrency = (request:PlayFabServerModels.AddUserVirtualCurrencyRequest):Promise<PlayFabServerModels.ModifyUserVirtualCurrencyResult> => {
  return new Promise((resolve, reject)=>{
    PlayFabServer.AddUserVirtualCurrency( request, c(resolve, reject)) 
  })
};


export const GetPlayerCombinedInfo = (request:PlayFabServerModels.GetPlayerCombinedInfoRequest):Promise<PlayFabServerModels.GetPlayerCombinedInfoResult> => {
  return new Promise((resolve, reject)=>{
    PlayFabServer.GetPlayerCombinedInfo( request, c(resolve, reject)) 
  })
};


export const UpdateUserReadOnlyData = (request:PlayFabServerModels.UpdateUserDataRequest):Promise<PlayFabServerModels.UpdateUserDataResult> => {
  return new Promise((resolve, reject)=>{
    PlayFabServer.UpdateUserReadOnlyData( request, c(resolve, reject)) 
  })
};


export const UpdatePlayerStatistics = (request:PlayFabServerModels.UpdatePlayerStatisticsRequest):Promise<PlayFabServerModels.UpdatePlayerStatisticsResult> => {
  return new Promise((resolve, reject)=>{
    PlayFabServer.UpdatePlayerStatistics( request, c(resolve, reject)) 
  })
};

export const GrantItemsToUser = (request:PlayFabServerModels.GrantItemsToUserRequest):Promise<PlayFabServerModels.GrantItemsToUserResult> => {
  return new Promise((resolve, reject)=>{
    PlayFabServer.GrantItemsToUser( request, c(resolve, reject)) 
  })
};


export const AuthenticateSessionTicket = (request:PlayFabServerModels.AuthenticateSessionTicketRequest):Promise<PlayFabServerModels.AuthenticateSessionTicketResult> => {
  return new Promise((resolve, reject)=>{
    PlayFabServer.AuthenticateSessionTicket( request, c(resolve, reject)) 
  })
};


// or re-usable `sleep` function:
const doSleep = (milliseconds:number) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

//const list = [1, 2, 3, 4, 5]
const sleep = async (val:number) => {
  //for (const item of list) {
    await doSleep(val);
    console.log('slept for ' + val );
  //}
}

const sleepLoop = (seconds:number)=>{
  var waitTill = new Date(new Date().getTime() + seconds * 1000);
  while(waitTill > new Date()){}
}

function appendGrantMaterial(grantItemAgg:PlayFabServerModels.GrantItemsToUserRequest,grantItem:PlayFabServerModels.GrantItemsToUserRequest){
  if(grantItem !== undefined && grantItem.ItemIds !== undefined && grantItem.ItemIds.length){
    for(let p in grantItem.ItemIds){
      grantItemAgg.ItemIds.push(grantItem.ItemIds[p] )
    }
  }  
}


export const EndLevelGivePlayerUpdatePlayerStats = async (updateStats:EndLevelUpdatePlayerStatsRequest):Promise<EndLevelUpdatePlayerStatsResult> => {

  console.log("EndLevelGivePlayerUpdatePlayerStats START ",updateStats)

  const results: EndLevelUpdatePlayerStatsResult = {}
  const promises:Promise<any>[] = [];

  const playFabId = updateStats.playFabId
  const now = new Date();

  var getPlayerCombinedInfoRequestParams: PlayFabServerModels.GetPlayerCombinedInfoRequestParams = {
    // Whether to get character inventories. Defaults to false.
    GetCharacterInventories: false,
    // Whether to get the list of characters. Defaults to false.
    GetCharacterList: false,
    // Whether to get player profile. Defaults to false. Has no effect for a new player.
    GetPlayerProfile: false,
    // Whether to get player statistics. Defaults to false.
    GetPlayerStatistics: false,
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
  var getPlayerCombinedInfoRequest: PlayFabServerModels.GetPlayerCombinedInfoRequest= {
    // The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.).
    //CustomTags?: { [key: string]: string | null };
    // Flags for which pieces of info to return for the user.
    InfoRequestParameters: getPlayerCombinedInfoRequestParams,
    // PlayFabId of the user whose data will be returned
    PlayFabId: playFabId,
  }
  
  let coinsGCCollectedPrev = 0

  const coinMultiplier = updateStats.coinMultiplier

  var grantMaterials: PlayFabServerModels.GrantItemsToUserRequest = { ItemIds: [], PlayFabId: playFabId }

  appendGrantMaterial( grantMaterials, updateStats.grantMaterial1 )
  appendGrantMaterial( grantMaterials, updateStats.grantMaterial2 ) 
  appendGrantMaterial( grantMaterials, updateStats.grantMaterial3 )

  let anyCoinCollectedThisGame = updateStats.addGCCurrency.Amount + updateStats.addMCCurrency.Amount
  let anyMaterialCollectedThisGame = grantMaterials.ItemIds.length

  let coinsGCCollectedThisGame = updateStats.addGCCurrency.Amount
  let coinsGCCollectedThisGameWithBonuses = Math.round(coinsGCCollectedThisGame * coinMultiplier);
  
  let coinsGCBonusEarned = coinsGCCollectedThisGameWithBonuses - coinsGCCollectedThisGame;
  

  const runningGuestGame = updateStats.addGuestCurrency && updateStats.addGuestCurrency.VirtualCurrency && updateStats.addGuestCurrency.VirtualCurrency.length != 0

  let prefix = "";

  if(runningGuestGame){
    prefix = updateStats.addGuestCurrency.VirtualCurrency + "_"
  }

  let coinsGuestCollectedThisGame = (updateStats.addGuestCurrency) ? updateStats.addGuestCurrency.Amount : -1;
  

  let coinsMCCollectThisGame = updateStats.addMCCurrency.Amount;
  if(runningGuestGame){
    coinsMCCollectThisGame = coinsGuestCollectedThisGame
    anyCoinCollectedThisGame = updateStats.addGuestCurrency.Amount //+ updateStats.addGuestCurrency.Amount
  }
  let coinsCollectedRemainder = 0
  let coinsCollectedEpoch = 0;
  let currentEpoch:Date = null
  let newEpoch:string = null
  let userData:any = {}
  let resetEpoch = false;

  let gameEndResult:GameEndResultType={
    gcCollected:-1,
    gcCollectedToMC: -1,
    guestCoinCollected: -1,
    guestCoinName: "N/A",
    mcCollected: -1,
    mcAdjustAmount:0, //means no modification
    mcCollectedAdjusted:-1,
    mcTotalEarnedToday:-1,
    walletTotal:-1,
    gameTimeTaken:-1,
    gcStarted:-1,
    gcEnded:-1,
    gcTotal:-1,
    coinMultiplier: coinMultiplier,
    gcBonusEarned:-1,


    material1Collected: -1,
    material2Collected: -1,
    material3Collected: -1

  }
  

  var getPlayerCombinedInfo = new Promise((mainResolve, reject)=>{
    GetPlayerCombinedInfo(getPlayerCombinedInfoRequest).then(
      function(result:PlayFabServerModels.GetPlayerCombinedInfoResult){
        console.log("promise.EndLevelGivePlayerUpdatePlayerStats.GetPlayerCombinedInfoResult",result);
        console.log("promise.EndLevelGivePlayerUpdatePlayerStats.GetPlayerCombinedInfoResult.UserReadOnlyData",result.InfoResultPayload.UserReadOnlyData);
        //myRoom.authResult = result;
        results.playerCombinedInfo = result;
        
        //let coinsToCollectThisEpoch = 0
        //let coinsCollectedRemainder = 0
        //let coinsCollectedEpoch = 0;
        //let currentEpoch:Date = null
        //let newEpoch = null
        //let userData:any = {}
        //let resetEpoch = false;

        if(result.InfoResultPayload.UserVirtualCurrency){
          //see if they have GC already 
          console.log("result.InfoResultPayload.UserVirtualCurrency.GC" , result.InfoResultPayload.UserVirtualCurrency.GC , result.InfoResultPayload.UserVirtualCurrency.XX)
          if(result.InfoResultPayload.UserVirtualCurrency.GC){
            coinsGCCollectedPrev = result.InfoResultPayload.UserVirtualCurrency.GC
          }
        }
        
        if( notNull(result.InfoResultPayload.UserReadOnlyData[prefix+'coinsCollectedEpoch']) ){
          const coinsCollectedEpochData = result.InfoResultPayload.UserReadOnlyData[prefix+'coinsCollectedEpoch']
          console.log("read coinsCollectedEpoch " , coinsCollectedEpochData)
          //TODO check if needs updating
          if(notNull(coinsCollectedEpochData.Value)){
            coinsCollectedEpoch = Number(coinsCollectedEpochData.Value)
            console.log("using coinsCollectedEpoch " + coinsCollectedEpoch)
          }else{
            coinsCollectedEpoch = 0
            console.log("creating coinsCollectedEpoch " + coinsCollectedEpoch)  
          }
        }else{
          coinsCollectedEpoch = 0
          console.log("creating coinsCollectedEpoch " + coinsCollectedEpoch)
        }
        
        if( notNull(result.InfoResultPayload.UserReadOnlyData[prefix+'coinCollectingEpoch']) ){
          //TODO switch to coinsMCEarnedDaily.lastReset (stat)???
          const lastEpochData = result.InfoResultPayload.UserReadOnlyData[prefix+'coinCollectingEpoch']

          console.log("read curEpoch " , lastEpochData)
          if(notNull(lastEpochData.Value)){
            const lastEpoch = date.parse(lastEpochData.Value,CONFIG.DATE_FORMAT_PATTERN,true)
            const diff = (now.getTime() - lastEpoch.getTime()) / (1000 * 60) //minutes
            console.log("read parsed " + lastEpoch + " epoch-now diff " + diff + " epoch size " + CONFIG.EPOCH_MINUTES + " minutes")
            //TODO check if needs updating
            if(diff >= CONFIG.EPOCH_MINUTES){//needs updating
              //reset counter
              resetEpoch = true
            }else{
              //within current epoc
              console.log("appending to  coinsCollectedEpoch " + coinsCollectedEpoch);
            }
          }else{
            //is null
            resetEpoch = true
          }
          
        }else{
          //does not exist make one
          resetEpoch = true
        }

        if(resetEpoch){
          //TODO use coinsCollectedDaily epoch so they sync. only override for testing?!?!?
          const newEpochtime = new Date()

          //because we are doing 24 hour flooring it so it matches utc clock
          newEpochtime.setUTCHours(0,0,0,0);

          currentEpoch = newEpochtime
          newEpoch = date.format(newEpochtime, CONFIG.DATE_FORMAT_PATTERN,true);
          coinsCollectedEpoch = 0
          console.log("creating curEpoch " , newEpoch,newEpochtime.toUTCString(),'--',newEpochtime.toLocaleString());
          console.log("resetting  coinsCollectedEpoch " + coinsCollectedEpoch);
        }

        //coinsGCCollectedPrev

        const INCLUDE_PREV_GAME_COINS = true

        const coinsGCCollectedSubTotal = coinsGCCollectedThisGameWithBonuses + (INCLUDE_PREV_GAME_COINS ? coinsGCCollectedPrev : 0)//for now not including previous
        
        if(coinsGCCollectedSubTotal >= CONFIG.GC_TO_MC_CONVESION){
          coinsCollectedRemainder = coinsGCCollectedSubTotal % CONFIG.GC_TO_MC_CONVESION
        }else{
          coinsCollectedRemainder = coinsGCCollectedThisGameWithBonuses
        }
        const gcToMC = Math.floor(coinsGCCollectedSubTotal / CONFIG.GC_TO_MC_CONVESION)

        gameEndResult.mcCollected = coinsMCCollectThisGame //before added on to
        
        coinsMCCollectThisGame += gcToMC

        const coinsCollectedEpochBeforeGame = coinsCollectedEpoch
        coinsCollectedEpoch += coinsMCCollectThisGame
        console.log("coinsCollectedEpoch coinsCollectedThisGame:" + coinsGCCollectedThisGameWithBonuses + " carry over " + coinsGCCollectedPrev 
          + " subtotal:" + (coinsGCCollectedSubTotal) + " gcToMC " + gcToMC + " epoch.subtotal " + coinsCollectedEpoch + " this game " + coinsMCCollectThisGame + " MC remainder " + coinsCollectedRemainder + " GC");


        gameEndResult.gcStarted = coinsGCCollectedPrev
        gameEndResult.gcTotal = coinsGCCollectedSubTotal
        gameEndResult.gcCollected = coinsGCCollectedThisGame
        gameEndResult.gcBonusEarned = coinsGCBonusEarned
        gameEndResult.guestCoinCollected = coinsGuestCollectedThisGame
        gameEndResult.gcCollectedToMC = gcToMC

        gameEndResult.material1Collected = updateStats.grantMaterial1.ItemIds.length
        gameEndResult.material2Collected = updateStats.grantMaterial2.ItemIds.length
        gameEndResult.material3Collected = updateStats.grantMaterial3.ItemIds.length
        
        //TODO need to write to guest currency somehow!!!

        let subtractAmount = 0;

        if(coinsCollectedEpoch > CONFIG.MAX_COINS_PER_EPOCH){
          console.log("maxed out collecting today epoch.pre:" + coinsCollectedEpochBeforeGame + " epoch.sum:" + coinsCollectedEpoch + " vs this.game:" + coinsMCCollectThisGame + " vs max:" + CONFIG.MAX_COINS_PER_EPOCH);

          //coinsCollectedEpochBeforeGame

          //0 16 4

          //max-pre

          
          coinsMCCollectThisGame = CONFIG.MAX_COINS_PER_EPOCH - coinsCollectedEpochBeforeGame //cannot get anymore.  need to subtract down to max

          gameEndResult.mcAdjustAmount = CONFIG.MAX_COINS_PER_EPOCH - coinsCollectedEpoch
          gameEndResult.mcCollectedAdjusted = coinsMCCollectThisGame

          coinsCollectedRemainder = -1*coinsGCCollectedPrev// zero it out //dont keep adding GC
          
          subtractAmount = coinsCollectedRemainder

          coinsCollectedEpoch = CONFIG.MAX_COINS_PER_EPOCH //
        }else{
          //can we roll up
          if(gcToMC > 0 && coinsMCCollectThisGame > 0){
            //FIXME this assumes we never ever go above accidently the possible conversion factor
            //is that even possible?
            subtractAmount = -1* ((coinsGCCollectedPrev - coinsCollectedRemainder))
          }
        }


        console.log("coinsCollectedEpoch.adjusted coinsCollectedThisGame:" + coinsGCCollectedThisGameWithBonuses + " mc:" + coinsMCCollectThisGame + " epoch.sum:" + coinsCollectedEpoch + "/" + CONFIG.MAX_COINS_PER_EPOCH + " MC remainder " + coinsCollectedRemainder + " GC subtractAmount:" + subtractAmount);
  

        
        if(newEpoch != null){
          userData[prefix+"coinCollectingEpoch"] = newEpoch
        }
        userData[prefix+"coinsCollectedEpoch"] = coinsCollectedEpoch
        if(!runningGuestGame) gameEndResult.mcTotalEarnedToday = coinsCollectedEpoch
        if(!runningGuestGame) gameEndResult.gcEnded = coinsCollectedRemainder
                
        const promisesInner:Promise<any>[] = [];

        
        //must write it
        const updateReadOnlyData = UpdateUserReadOnlyData(
          {
            // The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.).
            //CustomTags?: { [key: string]: string | null };
            // Key-value pairs to be written to the custom data. Note that keys are trimmed of whitespace, are limited in size, and may
            // not begin with a '!' character or be null.
            Data: userData,
            // Optional list of Data-keys to remove from UserData. Some SDKs cannot insert null-values into Data due to language
            // constraints. Use this to delete the keys directly.
            //KeysToRemove?: string[];
            // Permission to be applied to all user data keys written in this request. Defaults to "private" if not set.
            //Permission?: string;
            // Unique PlayFab assigned ID of the user on whom the operation will be performed.
            PlayFabId: playFabId
          }
        )
        promisesInner.push(updateReadOnlyData)

        const thisGameStats:PlayFabServerModels.StatisticUpdate[] = []

        if(!runningGuestGame){
          thisGameStats.push(
            {StatisticName: "coinsMCEarnedDaily",
                  Value: coinsMCCollectThisGame}
          )
        }

        //PREFIX IT WHEN A GUEST GAME  VB_coinCollected....
        for(const p in CONFIG.STATS_LEVEL_ANY_COIN_COLLECTED_NAMES){
          const statName = prefix + CONFIG.STATS_LEVEL_ANY_COIN_COLLECTED_NAMES[p]
          thisGameStats.push(
            {
              // unique name of the statistic
              StatisticName: statName,
              // statistic value for the player
              Value: anyCoinCollectedThisGame //FIXME this is not adding up coins, game config setting in playfab
              // for updates to an existing statistic value for a player, the version of the statistic when it was loaded. Null when
              // setting the statistic value for the first time.
              //Version?: number;
            }
          )
        }
        for(const p in CONFIG.STATS_LEVEL_ANY_COIN_COLLECTED_NAMES){
          const statName = prefix + CONFIG.STATS_LEVEL_ANY_MATERIAL_COLLECTED_NAMES[p]
          thisGameStats.push(
            {
              // unique name of the statistic
              StatisticName: statName,
              // statistic value for the player
              Value: anyMaterialCollectedThisGame
            }
          )
        }
        

        const updatePlayerStats = UpdatePlayerStatistics(
          {
            // The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.).
            //CustomTags?: { [key: string]: string | null };
            // Indicates whether the statistics provided should be set, regardless of the aggregation method set on the statistic.
            // Default is false.
            //ForceUpdate?: boolean;
            // Unique PlayFab assigned ID of the user on whom the operation will be performed.
            PlayFabId: playFabId,
            // Statistics to be updated with the provided values
            Statistics: thisGameStats
          }
        )
        promisesInner.push(updatePlayerStats)

        //https://community.playfab.com/questions/43530/optimal-way-to-add-multiple-currencies-and-items-w.html
        if(grantMaterials !== undefined && grantMaterials.ItemIds !== undefined
          && grantMaterials.ItemIds.length > 0){
          const grantMaterialsPromise = GrantItemsToUser(
            grantMaterials
          )
          promisesInner.push(grantMaterialsPromise)
        }else{
          //no materials picked up
          console.log("no materials picked up")
        }
        

        const addCurrencyPromise = new Promise((currencyResolve, reject)=>{
          //console.log("start  " + 1, Date.now())
          //sleepLoop(1)
          //console.log("returned from " + 1, Date.now())
          
          const promisesCurrency:Promise<any>[] = [];

          
          if(coinsMCCollectThisGame>0){
            const addMCCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = {
              PlayFabId:updateStats.addMCCurrency.PlayFabId,
              Amount: coinsMCCollectThisGame,
              VirtualCurrency: (!runningGuestGame) ? updateStats.addMCCurrency.VirtualCurrency : updateStats.addGuestCurrency.VirtualCurrency
            }

            const addMCCurrencyPromise = AddUserVirtualCurrency(addMCCurrency).then(
              function(result:PlayFabServerModels.ModifyUserVirtualCurrencyResult){
                console.log("promise.EndLevelGivePlayerUpdatePlayerStats.AddUserVirtualCurrency.MC",result);
                //myRoom.authResult = result;
                results.addMCCurrency = result;

                gameEndResult.walletTotal = result.Balance //is this right? dont we need to sum gc+mc???
                //resolve(result);
            })
            promisesCurrency.push(addMCCurrencyPromise)
          }
          
          //for now game coin will not carry over
          if(INCLUDE_PREV_GAME_COINS){
            if(coinsCollectedRemainder>0 && subtractAmount >=0){
              //ADJUST GC
              //Math.abs(remainder-startingTotal) = +69
              const adjustGCCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest = {
                PlayFabId:updateStats.addGCCurrency.PlayFabId,
                Amount: coinsCollectedRemainder,
                VirtualCurrency: updateStats.addGCCurrency.VirtualCurrency
              }

              const adjustGCCurrencyPromise = AddUserVirtualCurrency(adjustGCCurrency).then(
                function(result:PlayFabServerModels.ModifyUserVirtualCurrencyResult){
                  console.log("promise.EndLevelGivePlayerUpdatePlayerStats.AddUserVirtualCurrency.GC",result);
                  //myRoom.authResult = result;
                  results.addGCCurrency = result;

                  gameEndResult.gcEnded = result.Balance
                  //resolve(result);
              })
              promisesCurrency.push(adjustGCCurrencyPromise)
            }else if (subtractAmount<0){
              //ADJUST GC
              //Math.abs(remainder-startingTotal) = +69
              const adjustGCCurrency: PlayFabServerModels.SubtractUserVirtualCurrencyRequest = {
                PlayFabId:updateStats.addGCCurrency.PlayFabId,
                Amount: Math.abs(subtractAmount),
                VirtualCurrency: updateStats.addGCCurrency.VirtualCurrency
              }

              const adjustGCCurrencyPromise = SubtractUserVirtualCurrency(adjustGCCurrency).then(
                function(result:PlayFabServerModels.ModifyUserVirtualCurrencyResult){
                  console.log("promise.EndLevelGivePlayerUpdatePlayerStats.SubtractUserVirtualCurrency.GC",result);
                  //myRoom.authResult = result;
                  results.addGCCurrency = result;

                  gameEndResult.gcEnded = result.Balance
                  //resolve(result);
              })
              promisesCurrency.push(adjustGCCurrencyPromise)
            }
          }
          
          Promise.all( promisesCurrency ).then(()=>{
            console.log("currencyResolve promised completed " , result)
            //console.log("start.currencyResolve  " + 2, Date.now())
            //sleepLoop(2)
            //console.log("returned.currencyResolve from " + 2, Date.now())
            currencyResolve(result);
          })
        })
        
        promisesInner.push( addCurrencyPromise )

        Promise.all( promisesInner ).then(()=>{
          console.log("promisesInner promised completed " , result)
          //console.log("start  " + 2, Date.now())
          //sleepLoop(2)
          //console.log("returned from " + 2, Date.now())


          results.endGameResult=gameEndResult

          mainResolve(results);
        })
        
    })
  })
  //promises.push( addCurrencyPromise )
  promises.push( getPlayerCombinedInfo );
  /*
  const allDonePromise = new Promise( function(resolve , reject ){

  }*/

  return Promise.all( promises ).then(function(result){
    console.log("all promised completed " , result)
    return results;
  })
};

export type EndLevelUpdatePlayerStatsRequest= {
  playFabId: string
  coinMultiplier: number
  addGCCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest
  addMCCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest
  addGuestCurrency: PlayFabServerModels.AddUserVirtualCurrencyRequest

  grantMaterial1: PlayFabServerModels.GrantItemsToUserRequest
  grantMaterial2: PlayFabServerModels.GrantItemsToUserRequest
  grantMaterial3: PlayFabServerModels.GrantItemsToUserRequest

  //playerCombinedInfo?: PlayFabServerModels.GetPlayerCombinedInfoRequest
}

export type GameEndResultType={
  gcStarted:number
  gcEnded:number
  gcTotal:number
  gcCollected:number
  gcCollectedToMC: number
  mcCollected:number
  mcAdjustAmount:number
  mcCollectedAdjusted:number
  mcTotalEarnedToday:number
  guestCoinCollected: number
  guestCoinName: string,
  walletTotal:number
  gameTimeTaken:number
  coinMultiplier:number
  gcBonusEarned:number

  material1Collected: number;
  material2Collected: number;
  material3Collected: number;
}

export type EndLevelUpdatePlayerStatsResult= {
  addGCCurrency?: PlayFabServerModels.ModifyUserVirtualCurrencyResult
  addMCCurrency?: PlayFabServerModels.ModifyUserVirtualCurrencyResult
  playerCombinedInfo?: PlayFabServerModels.GetPlayerCombinedInfoResult
  endGameResult?: GameEndResultType
}
  
function DoExampleLoginWithCustomID(): void {
    var loginRequest: PlayFabAuthenticationModels.GetEntityTokenRequest= {
        // The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.).
        //CustomTags?: { [key: string]: string | null };
        // The entity to perform this action on.
        //Entity: {
        //  Id: PlayFab.settings.titleId
        //}
    };

    PlayFabAuthentication.GetEntityToken( loginRequest, LoginCallback  )
}

function LoginCallback(error: PlayFabModule.IPlayFabError, result: PlayFabModule.IPlayFabSuccessContainer<PlayFabAuthenticationModels.ValidateEntityTokenResponse>): void {
    if (result !== null) {
        console.log("Congratulations, you made your first successful API call!",result);
    } else if (error !== null) {
        console.log("Something went wrong with your first API call.");
        console.log("Here's some debug information:");
        console.log(CompileErrorReport(error));
    }
}

// This is a utility function we haven't put into the core SDK yet.  Feel free to use it.
function CompileErrorReport(error: PlayFabModule.IPlayFabError): string {
    if (error == null)
        return "";
    var fullErrors: string = error.errorMessage;
    for (var paramName in error.errorDetails)
        for (var msgIdx in error.errorDetails[paramName])
            fullErrors += "\n" + paramName + ": " + error.errorDetails[paramName][msgIdx];
    return fullErrors;
}