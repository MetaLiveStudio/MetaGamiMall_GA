//import * as utils from "@dcl/ecs-scene-utils";
import * as utils from '@dcl-sdk/utils'
//import * as ui from "@dcl/ui-scene-utils";
import PlayFab from "./playfab_sdk/PlayFabClientApi";
import * as PlayFabSDK from "./playfab_sdk/index";
import {
  EntityTokenResponse,
  GetLeaderboardResult,
  GetPlayerCombinedInfoResult,
  GetPlayerCombinedInfoResultPayload,
  LoginResult,
  TreatmentAssignment,
  UserSettings,
} from "./playfab_sdk/playfab.types";

//import * as EthereumController from "@decentraland/EthereumController";
//import { getProvider } from "@decentraland/web3-provider";
//import { GLOBAL_CANVAS } from "./resources";
import { GAME_STATE } from "../state";
import {
  getAndSetRealmDataIfNull,
  getAndSetUserData,
  getAndSetUserDataIfNull,
  getAndSetUserDataIfNullNoWait,
  getRealmDataFromLocal,
  getUserDataFromLocal,
} from "../userData";

import { isNull, notNull } from "../utils";
import { CONFIG, initConfig } from "../config";
import { initRegistry, REGISTRY } from "../registry";
//import { Constants as DecentRallyConstants } from "src/meta-decentrally/modules/resources/globals";
import { LoginFlowCallback, LoginFlowResult } from "../meta-decentrally/login/login-types";
import { preventConcurrentExecution } from "../meta-decentrally/modules/utilities";
//import { signedFetch } from '@decentraland/SignedFetch';
import { log } from "../back-ports/backPorts";
import { executeTask } from "@dcl/sdk/ecs";
import { signedFetch } from "~system/SignedFetch";
import { Color4 } from "@dcl/sdk/math";
import * as ui from 'dcl-ui-toolkit'
import { leaderBoardsConfigs } from './leaderboard-utils';
import { setLeaderboardLoading } from './leaderboard';

//initRegistry()
//initConfig()

// play ambient music
//playLoop(ambienceSound, 0.4);

//
// Request login with MetaMask
//
// const dclAuthURL = 'http://localhost:3000/api/dcl/auth'
 //'https://dev.metadoge.art/api/dcl/auth'

 
///src/gamimall/login-flow.ts
//TODO remake this!!!

export const loginErrorPrompt = new ui.OptionPrompt(
  {
   text: "Unable to Login",
   title: "Error",
   onReject: () => {
      loginErrorPrompt.hide()
    },
   onAccept: () => {
      loginErrorPrompt.hide();
      GAME_STATE.playerState.requestDoLoginFlow();
    },
    rejectLabel: "Cancel",
    acceptLabel: "Try Again",
    useDarkTheme: true
  }
);

//loginErrorPrompt.show()


//this is a active logout, will make calls
export function logout() {
  //TODO make logout calls
  resetLoginState();
}
export function resetLoginState() {
  if(!GAME_STATE.playerState){
    log("resetLoginState GAME_STATE.playerState undefined skipping",GAME_STATE.playerState);
    return;
  }
  GAME_STATE.playerState.setLoginFlowState("undefined");
  GAME_STATE.playerState.setPlayerCustomID(null);
  GAME_STATE.playerState.setPlayFabLoginResult(null);
  GAME_STATE.playerState.setPlayFabUserInfoData(null);
  GAME_STATE.playerState.setLoginSuccess(false);
}


/*
export function doLoginFlow() {
  log("doLoginFlow " + GAME_STATE.playerState.loginFlowState);
  switch (GAME_STATE.playerState.loginFlowState) {
    case "undefined":
    case "error":
    case "wallet-error":
      signWithWallet();
      break;
    case "wallet-success":
    case "playfab-error":
      loginUser(GAME_STATE.playerState.playerCustomID);
    case "playfab-success":
      log("doLoginFlow already logged in");
  }
}
*/

export function doLoginFlow(callback?:LoginFlowCallback,resultInPlace?:LoginFlowResult):Promise<LoginFlowResult>{
  const promise:Promise<LoginFlowResult> = new Promise( async (resolve, reject)=>{
      try{
          let loginRes:LoginFlowResult
          /*if(CONFIG.LOGIN_FLOW_TYPE == 'signedTypeV4'){
            loginRes = await doLoginFlowAsync()
          }else */if(CONFIG.LOGIN_FLOW_TYPE == 'dclSignedFetch'){
            loginRes = await doLoginFlowAsync_signedFetch()
          }else{
            const msg = 'ERROR: unrecognized '+CONFIG.LOGIN_FLOW_TYPE
            log(msg)
            reject(msg)
            return;
          }
          resolve( loginRes )
      }catch(e){
          log("doLoginFlow failed ",e)
          //if(CONFIG.ENABLE_DEBUGGER_BREAK_POINTS) debugger
          reject(e)
      }
  })
  //if doLoginFlowAsync is preventConcurrentExecution wrapped
  //confirmed that if it returns the same promise or a new one
  //promise.then just adds more to the callback so all callers
  //will get their callbacks ran
  promise.then(()=>{
      if(callback && callback.onSuccess){
          log("doLoginFlow calling callback. onSuccess")
          callback.onSuccess()
      }else{
          log("doLoginFlow success,no callback. onSuccess")
      }
  })
  return promise
}
//DecentRallyConstants.doLoginFlow = doLoginFlow
//REGISTRY.doLoginFlow = doLoginFlow


export function registerLoginFlowListener(){
  GAME_STATE.playerState.addChangeListener(
    (key: string, newVal: any, oldVal: any) => {
      log(
        "listener.playerState.login-flow.ts " + key + " " + newVal + " " + oldVal
      );

      switch (key) {
        //common ones on top
        case "requestDoLoginFlow":
          doLoginFlow();
          break;
      }
    }
  );
}


//prevent login action ran more than 1 at a time
/*const doLoginFlowAsync = preventConcurrentExecution("doLoginFlowAsync",async (resultInPlace?:LoginFlowResult) => {
  log("doLoginFlowAsync " + GAME_STATE.playerState.loginFlowState)
  log("preventConcurrentExecution.doLoginFlowAsync")
  const retVal:LoginFlowResult = resultInPlace !== undefined ? resultInPlace : {chain:[]}
  
  try{
  switch(GAME_STATE.playerState.loginFlowState){
      case 'error':
          //HANDLE??
      case 'wallet-error':
      case 'undefined':  
          log("doLoginFlowAsync.calling.fetchCustomId")
          retVal.chain.push( GAME_STATE.playerState.loginFlowState )
          //TODO add catch? call do login flow aync again?
          
          await signWithWallet();
          //const uuid = await fetchCustomId()
          //GAME_STATE.playerState.playerCustomID = uuid
          retVal.customId = GAME_STATE.playerState.playerCustomID
          retVal.playfabResult = GAME_STATE.playerState.playFabLoginResult
          break;
      case 'wallet-success':
          retVal.chain.push( GAME_STATE.playerState.loginFlowState )
          //TODO add catch? call do login flow aync again?
          await loginUser(GAME_STATE.playerState.playerCustomID)

          retVal.customId = GAME_STATE.playerState.playerCustomID
          retVal.playfabResult = GAME_STATE.playerState.playFabLoginResult
          break;
      case 'playfab-error':
          //HANDLE??
      case 'playfab-success':
          retVal.chain.push( GAME_STATE.playerState.loginFlowState )
          log("doLoginFlowAsync already logged in",retVal.chain)
          retVal.playfabResult = GAME_STATE.playerState.playFabLoginResult
  }
  }catch(e:any){
      retVal.chain.push( GAME_STATE.playerState.loginFlowState )
      retVal.chain.push( e.message )
      //debugger
      log("doLoginFlowAsync threw an error",retVal,e)   
  }
  return retVal
})*/


//prevent login action ran more than 1 at a time
const doLoginFlowAsync_signedFetch = preventConcurrentExecution("doLoginFlowAsync_signedFetch",async (resultInPlace?:LoginFlowResult) => {
  log("doLoginFlowAsync " + GAME_STATE.playerState.loginFlowState)
  log("preventConcurrentExecution.doLoginFlowAsync")
  const retVal:LoginFlowResult = resultInPlace !== undefined ? resultInPlace : {chain:[]}
  try{
  switch(GAME_STATE.playerState.loginFlowState){
      case 'error':
          //HANDLE??
      case 'wallet-error':
      case 'undefined':  
          log("doLoginFlowAsync.calling.fetchCustomId")
          retVal.chain.push( GAME_STATE.playerState.loginFlowState )
          //TODO add catch? call do login flow aync again?
          const uuid = await fetchCustomId()
          GAME_STATE.playerState.playerCustomID = uuid
          retVal.customId = uuid
      case 'wallet-success':
        log("doLoginFlowAsync.calling.loginUser")
          retVal.chain.push( GAME_STATE.playerState.loginFlowState )
          //TODO add catch? call do login flow aync again?
          const result = await loginUser(GAME_STATE.playerState.playerCustomID)
          retVal.playfabResult = result
      case 'playfab-error':
          //HANDLE??
      case 'playfab-success':
          retVal.chain.push( GAME_STATE.playerState.loginFlowState )
          log("doLoginFlowAsync already logged in",retVal.chain)
          retVal.playfabResult = GAME_STATE.playerState.playFabLoginResult
  }
  }catch(e:any){
      retVal.chain.push( GAME_STATE.playerState.loginFlowState )
      retVal.chain.push( e.message )
      //debugger
      log("doLoginFlowAsync threw an error",retVal,e)   
  }
  return retVal
})
function handleCustomIdError(json:any|Error){
    log("handleCustomIdError",json)
    //TODO HANDLE ALL POSSIBLE ERROR STATES
    if(json instanceof Error){
        GAME_STATE.playerState.loginFlowState='wallet-error'

        loginErrorPrompt.textElement.value =
          "There was a an error signing in\n" + json.message //);
        loginErrorPrompt.show();
        ////Constants.Game_2DUI.showLoginErrorPrompt( undefined,"There was a an error signing in\n" + json.message  )
    }else{
        GAME_STATE.playerState.loginFlowState='wallet-error'
        loginErrorPrompt.textElement.value =
          "There was a an error signing in\n" + json.message;
        loginErrorPrompt.show();
    }
}
//TODO return value
//see //https://github.com/MetaLiveStudio/metadoge#apidclauth
async function fetchCustomId(){
  //return //async () => {
      log("fetchCustomId start ")

      const callUrl = CONFIG.LOGIN_ENDPOINT

      const userData = await getAndSetUserDataIfNull()
      const realm = await getAndSetRealmDataIfNull()

      let method = "POST"
      let headers = { "Content-Type": "application/json" }
      let body = JSON.stringify({
          address: userData?.userId,
          hasConnectedWeb3: userData?.hasConnectedWeb3,
          catalyst: realm?.baseUrl,//,//realm?.domain,
          room: ""////realm?.layer //deprecated avoid it
      }) 
      
      try {
          //+ "?&titleId="+CONFIG.PLAYFAB_TITLEID
          //for some reason any query params breaks it
          let response = await signedFetch({url:callUrl , init:{
            headers: headers,
            method: method,
            body: body,
            }})
      
          if (!response.body) {
              throw new Error("Invalid response")
          }
      
          let json = JSON.parse(response.body)
       
          log("fetchCustomId","Response received: ", json)
          if (json.data && json.data.uuid){ 
              GAME_STATE.playerState.loginFlowState='wallet-success'
              
              //{ valid: true, msg: 'Valid request', data: {uuid: uuid} }
              log("fetchCustomId calling PlayFabSDK.LoginWithCustomID")
              addLoginInfo(PlayFab.settings.titleId)
              const playerCustId=json.data.uuid
              GAME_STATE.playerState.setPlayerCustomID(playerCustId) 

              return playerCustId// as string
          }else{
              handleCustomIdError(json)
              //return 'error'
              throw new Error( json.msg )
          }
      } catch (err){
          log("fetchCustomId failed to reach URL",err)
          handleCustomIdError(err)
          //return err.message 
          throw err
      }
  //}

}
/*
async function signWithWallet(doLogin?:boolean) {
  //executeTask(async () => {
    log("walletsign start ");
    const address = await EthereumController.getUserAccount().then((res) =>
      res.toLowerCase()
    );
    const nonceReq = await fetch(`${dclAuthURL}?address=${address}`);
    const nonceRes = await nonceReq.json();
    log("walletsign nonceRes ", nonceRes);
    const provider = await getProvider();

    //FIXME, make it so this is blocking
    provider.sendAsync(
      {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_signTypedData_v4",
        params: [address, nonceRes.data.nonce],
      },
      function (err: any, res: any) {
        log("walletsign result ", err, res);
        if (!err) {
          GAME_STATE.playerState.loginFlowState = "wallet-success";
          verifyLoginWithMetamask(address, res.result);
        } else {
          GAME_STATE.playerState.loginFlowState = "wallet-error";
          loginErrorPrompt.text.value =
            "There was a an error signing in\n" + err.message;
          loginErrorPrompt.show();
        }
      }
    );
  //});
}

//doLoginFlow()

//
// Verify login with MetaMask
//
function verifyLoginWithMetamask(address: any, signature: any) {
  executeTask(async () => {
    const verifyReq = await fetch(dclAuthURL, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ address, signature }),
    });
    const verifyRes = await verifyReq.json();
    //PlayFab.PlayFabClient
    log("calling PlayFabSDK.LoginWithCustomID");
    addLoginInfo(PlayFab.settings.titleId);
    const playerCustId = verifyRes.data.uuid;
    GAME_STATE.playerState.setPlayerCustomID(playerCustId);
    await loginUser(playerCustId);
    //loginUser("will-sdk-test")
  });
}
*/
//
// Connect to Colyseus server!
// Set up the scene after connection has been established.
//
//let playerLoginResult:LoginResult;
/*
const canvas = GLOBAL_CANVAS;

let message: UIText;
message = new UIText(canvas);
message.fontSize = 15;
message.width = 120;
message.height = 30;
message.hTextAlign = "right";
message.vAlign = "bottom";
message.positionX = 300;
message.positionY = 30;
*/

function addLoginInfo(title: string) {
  updatePlayerHudInfo(`**Logging in ${title}`, Color4.White());
}

function updatePlayerHudInfo(msg: string, color: Color4) {
  log("updatePlayerHudInfo ", msg);
  if (CONFIG.IN_PREVIEW && CONFIG.SHOW_PLAYER_DEBUG_INFO) {
    //message.value = msg;
    //message.color = color;
  }
}

function updateLoginInfoFromResult(result: LoginResult) {
  log("updateLoginInfoFromResult");
  if (notNull(result) && isNull(result.error)) {
    GAME_STATE.playerState.loginFlowState = "playfab-success";
    GAME_STATE.setLoginSuccess(true); // STORE WHOLE LoginResult? thinking no
    GAME_STATE.playerState.setPlayFabUserInfoData(result.InfoResultPayload);
    updatePlayerHudInfo(
      "Player Info\n" +
        "ID: " +
        result.PlayFabId +
        " \n(last login:" +
        result.LastLoginTime +
        ")" +
        //"\nAccountInfo:" + JSON.stringify(result.InfoResultPayload?.AccountInfo != null ? result.InfoResultPayload.AccountInfo: '') +
        "\nCoins:" +
        JSON.stringify(
          result.InfoResultPayload != null
            ? result.InfoResultPayload.UserVirtualCurrency
            : ""
        ) +
        "\nInventory:" +
        JSON.stringify(
          result.InfoResultPayload != null
            ? result.InfoResultPayload.UserInventory
            : ""
        ),
      Color4.Green()
    );

    //make sure we have it
    //if(!getUserDataFromLocal()){
    //    await getAndSetUserData() // calling await, need it now
    //}

    const userData = getUserDataFromLocal();
    if (userData !== null) {
      PlayFabSDK.UpdateUserTitleDisplayName({
        DisplayName: userData.displayName,
      }).then(() => {
        if(userData.publicKey !== undefined){
          //dont do them at the same time as causes race condition errors writting too fast to player
          PlayFabSDK.UpdateUserData({
            Data: {
              ethPublicKey: userData.publicKey,
            },
            // Optional list of Data-keys to remove from UserData. Some SDKs cannot insert null-values into Data due to language
            // constraints. Use this to delete the keys directly.
            //KeysToRemove?: string[];
            // Permission to be applied to all user data keys written in this request. Defaults to "private" if not set. This is used
            // for requests by one player for information about another player; those requests will only return Public keys.
            Permission: "private",
          });
        }
      });
    } else {
      log("WARNING userdata existant. cannot set display title/user key");
    }

    fetchLeaderboardInfo();
  } else {
    GAME_STATE.playerState.loginFlowState = "playfab-error";
    GAME_STATE.setLoginSuccess(false);
    updatePlayerHudInfo(
      "Login Failed: " +
        result.errorCode +
        "\n" +
        result.error +
        "\n" +
        result.errorMessage,
      Color4.Red()
    );
  }
} 

export function refreshUserData(calledBy:string) {
  log("refreshUserData called","calledBy",calledBy);
  //quick and dirty - place holder. for now just will relogin
  //FIXME long term should call fetch user data. want to track logins and resusing here muddles the login vs info fetching
  //wait 500 ms for playfab scores to sync
  utils.timers.setTimeout(()=>{
    fetchPlayerCombinedInfo();
  },1000)
  utils.timers.setTimeout(()=>{
    fetchLeaderboardInfo(); //takes longer to update ?!?!
    //TODO only fetch when in that section, trick is need to also know when this type of game ended
    //fetchLeaderboardInfo("VB_"); //takes longer to update ?!?!
  },3000)
}
export function loginUser(uuid: any):Promise<LoginResult>{
  log("loginUser START");
  const promise = new Promise<LoginResult>((resolve, reject)=>{
      //make sure we have it
      getAndSetUserDataIfNullNoWait(); //not calling await, hoping its fast

      PlayFab.settings.titleId = CONFIG.PLAYFAB_TITLEID;
      log("loginUser","calling LoginWithCustomID");
      PlayFabSDK.LoginWithCustomID({
        CreateAccount: true,
        // Custom unique identifier for the user, generated by the title.
        CustomId: uuid,
        // The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.).
        //CustomTags?: { [key: string]: string | null };
        // Base64 encoded body that is encrypted with the Title's public RSA key (Enterprise Only).
        //EncryptedRequest?: string;
        // Flags for which pieces of info to return for the user.
        InfoRequestParameters: {
          GetUserReadOnlyData: true,
          GetUserInventory: CONFIG.GAME_PLAFAB_INVENTORY_ENABLED, //needed for bronze.shoe
          GetUserVirtualCurrency: true, //need for currency
          GetPlayerStatistics: true,//needed for coins collected/xp
          GetCharacterInventories: false,
          GetCharacterList: false,
          GetPlayerProfile: false,
          GetTitleData: false,
          GetUserAccountInfo: true,
          GetUserData: true,
        },
        // Player secret that is used to verify API request signatures (Enterprise Only).
        //PlayerSecret?: string;
        // Unique identifier for the title, found in the Settings > Game Properties section of the PlayFab developer site when a
        // title has been selected.
        TitleId: PlayFab.settings.titleId,
      })
        .then(function (result: LoginResult) {
          log("loginUser","promise.LoginWithCustomID", result);

          GAME_STATE.playerState.setPlayFabLoginResult(result);

          updateLoginInfoFromResult(result);

          //TODO add login panel call back!!!
          //REGISTRY.ui.loginPanel.hide();
          //////REGISTRY.ui.racePanel.show()
          REGISTRY.ui.staminaPanel.show();

          resolve(result)
          //TODO update user wallet address (UpdateUserData) + displayname (UpdateUserTitleDisplayName)
        })
        .catch(function (error: LoginResult) {
          log("loginUser","promise.LoginWithCustomID failed", error);
          updateLoginInfoFromResult(error);

          reject(error)
        });
      })
      return promise
}

export function fetchLeaderboardInfo(prefix: string = "") {
  log("fetchLeaderboardInfo called");
  if(prefix == "VB_"){
    log("fetchLeaderboardInfo DISABLED FOR ",prefix);
    return
  }
  var getLeaderboardDaily: PlayFabClientModels.GetLeaderboardRequest = {
    StatisticName: prefix + "coinsCollectedDaily",
    StartPosition: 0,
    MaxResultsCount: CONFIG.GAME_LEADEBOARD_MAX_RESULTS,
  };
  var getLeaderboardLevelEpoch: PlayFabClientModels.GetLeaderboardRequest = {
    StatisticName: prefix + "coinsCollectedEpoch", //coins collected is level when formula applied
    StartPosition: 0,
    MaxResultsCount: CONFIG.GAME_LEADEBOARD_LVL_MAX_RESULTS,
  };
  
  var getLeaderboardWeekly: PlayFabClientModels.GetLeaderboardRequest = {
    StatisticName: prefix + "coinsCollectedWeekly",
    StartPosition: 0,
    MaxResultsCount: CONFIG.GAME_LEADEBOARD_MAX_RESULTS,
  };
  var getLeaderboardHourly: PlayFabClientModels.GetLeaderboardRequest = {
    StatisticName: prefix + "coinsCollectedHourly",
    StartPosition: 0,
    MaxResultsCount: CONFIG.GAME_LEADEBOARD_MAX_RESULTS,
  };

  var getLeaderboardPointsMonthly: PlayFabClientModels.GetLeaderboardRequest = {
    StatisticName: prefix + CONFIG.GAME_LEADERBOARDS.POINTS.MONTHLY.name,
    StartPosition: 0,
    MaxResultsCount: CONFIG.GAME_LEADERBOARDS.POINTS.MONTHLY.defaultPageSize,
  };

  leaderBoardsConfigs.filter((p)=>{ return p.prefix === prefix }).forEach((p)=>{  
    //setLeaderboardLoading(p.monthly(),true)
    setLeaderboardLoading(p.hourly(),true)
    setLeaderboardLoading(p.weekly(),true)
    setLeaderboardLoading(p.daily(),true)
    setLeaderboardLoading(p.pointsMonthly(),true)
})

  PlayFabSDK.GetLeaderboard(getLeaderboardHourly).then(
    (result: GetLeaderboardResult) => {
      GAME_STATE.leaderboardState.setHourlyLeaderBoard(result, prefix);
    }
  );
  PlayFabSDK.GetLeaderboard(getLeaderboardDaily).then(
    (result: GetLeaderboardResult) => {
      GAME_STATE.leaderboardState.setDailyLeaderBoard(result, prefix);
    }
  );
  PlayFabSDK.GetLeaderboard(getLeaderboardWeekly).then(
    (result: GetLeaderboardResult) => {
      GAME_STATE.leaderboardState.setWeeklyLeaderBoard(result, prefix);
    }
  );
  PlayFabSDK.GetLeaderboard(getLeaderboardLevelEpoch).then(
    (result: GetLeaderboardResult) => {
      GAME_STATE.leaderboardState.setLevelEpocLeaderBoard(result, prefix);
    }
  );
  PlayFabSDK.GetLeaderboard(getLeaderboardPointsMonthly).then(
    (result: GetLeaderboardResult) => {
      GAME_STATE.leaderboardState.setPointsMonthlyLeaderBoard(result, prefix);
    }
  );
}

export function fetchPlayerCombinedInfo() {
  log("fetchPlayerCombinedInfo called");
  var getPlayerCombinedInfoRequestParams: PlayFabClientModels.GetPlayerCombinedInfoRequestParams =
    {
      GetUserReadOnlyData: true,
      GetUserInventory: CONFIG.GAME_PLAFAB_INVENTORY_ENABLED,
      GetUserVirtualCurrency: true,
      GetPlayerStatistics: true,
      GetCharacterInventories: false,
      GetCharacterList: false,
      GetPlayerProfile: true,
      GetTitleData: false,
      GetUserAccountInfo: true,
      GetUserData: true,
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
      UserReadOnlyDataKeys: [
        "testReadOnly",
        "coinsCollectedToday",
        "coinCollectingEpoch",
      ],
    };
  var getPlayerCombinedInfoRequest: PlayFabClientModels.GetPlayerCombinedInfoRequest =
    {
      // The optional custom tags associated with the request (e.g. build number, external trace identifiers, etc.).
      //CustomTags?: { [key: string]: string | null };
      // Flags for which pieces of info to return for the user.
      InfoRequestParameters: getPlayerCombinedInfoRequestParams,
      // PlayFabId of the user whose data will be returned
      //PlayFabId: playFabId,
    };
  
    const promise = PlayFabSDK.GetPlayerCombinedInfo( 
        getPlayerCombinedInfoRequest
    )
    promise.then( (result:GetPlayerCombinedInfoResult) => {
      GAME_STATE.playerState.setPlayFabUserInfoData(result.InfoResultPayload);
      updatePlayerHudInfo(
        "** Player Info\n" +
          "ID: " +
          result.PlayFabId +
          " \n(last login:" +
          result.InfoResultPayload?.PlayerProfile?.LastLogin +
          ")" +
          //"\nAccountInfo:" + JSON.stringify(result.InfoResultPayload?.AccountInfo != null ? result.InfoResultPayload.AccountInfo: '') +
          "\nCoins:" +
          JSON.stringify(
            result.InfoResultPayload != null
              ? result.InfoResultPayload.UserVirtualCurrency
              : ""
          ) +
          "\nInventory:" +
          JSON.stringify(
            result.InfoResultPayload != null
              ? result.InfoResultPayload.UserInventory
              : ""
          ),
        Color4.Green()
      );
    })
    return promise
}
//testCoinPlacement();
