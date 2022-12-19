import * as utils from "@dcl/ecs-scene-utils";
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

import * as EthereumController from "@decentraland/EthereumController";
import { getProvider } from "@decentraland/web3-provider";
import { GLOBAL_CANVAS } from "./resources";
import { GAME_STATE } from "src/state";
import {
  getAndSetUserDataIfNullNoWait,
  getUserDataFromLocal,
} from "src/userData";
import { loginErrorPrompt } from "src/ui-bars";
import { isNull, notNull } from "src/utils";
import { CONFIG } from "src/config";
import { REGISTRY } from "src/registry";

PlayFab.settings.titleId = CONFIG.PLAYFAB_TITLEID;

// play ambient music
//playLoop(ambienceSound, 0.4);

//
// Request login with MetaMask
//
// const dclAuthURL = 'http://localhost:3000/api/dcl/auth'
const dclAuthURL = CONFIG.LOGIN_ENDPOINT; //'https://dev.metadoge.art/api/dcl/auth'

//this is a active logout, will make calls
export function logout() {
  //TODO make logout calls
  resetLoginState();
}
export function resetLoginState() {
  GAME_STATE.playerState.setLoginFlowState("undefined");
  GAME_STATE.playerState.setPlayerCustomID(null);
  GAME_STATE.playerState.setPlayFabLoginResult(null);
  GAME_STATE.playerState.setPlayFabUserInfoData(null);
  GAME_STATE.playerState.setLoginSuccess(false);
}
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
function signWithWallet() {
  executeTask(async () => {
    log("walletsign start ");
    const address = await EthereumController.getUserAccount().then((res) =>
      res.toLowerCase()
    );
    const nonceReq = await fetch(`${dclAuthURL}?address=${address}`);
    const nonceRes = await nonceReq.json();
    log("walletsign nonceRes ", nonceRes);
    const provider = await getProvider();
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
  });
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
    loginUser(playerCustId);
    //loginUser("will-sdk-test")
  });
}

//
// Connect to Colyseus server!
// Set up the scene after connection has been established.
//
//let playerLoginResult:LoginResult;

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

function addLoginInfo(title: string) {
  updatePlayerHudInfo(`**Logging in ${title}`, Color4.White());
}

function updatePlayerHudInfo(msg: string, color: Color4) {
  log("updatePlayerHudInfo ", msg);
  if (CONFIG.IN_PREVIEW && CONFIG.SHOW_PLAYER_DEBUG_INFO) {
    message.value = msg;
    message.color = color;
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

export function refreshUserData() {
  log("refreshUserData called");
  //quick and dirty - place holder. for now just will relogin
  //FIXME long term should call fetch user data. want to track logins and resusing here muddles the login vs info fetching
  //wait 500 ms for playfab scores to sync
  utils.setTimeout(1000, () => {
    fetchPlayerCombinedInfo();
  });
  utils.setTimeout(3000, () => {
    fetchLeaderboardInfo(); //takes longer to update ?!?!
    //TODO only fetch when in that section, trick is need to also know when this type of game ended
    fetchLeaderboardInfo("VB_"); //takes longer to update ?!?!
  });
}
export function loginUser(uuid: any) {
  log("loginUser START");
  //make sure we have it
  getAndSetUserDataIfNullNoWait(); //not calling await, hoping its fast

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
      GetUserInventory: true,
      GetUserVirtualCurrency: true,
      GetPlayerStatistics: true,
      GetCharacterInventories: false,
      GetCharacterList: false,
      GetPlayerProfile: false,
      GetTitleData: true,
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
      log("promise.LoginWithCustomID", result);

      GAME_STATE.playerState.setPlayFabLoginResult(result);

      updateLoginInfoFromResult(result);

      REGISTRY.ui.loginPanel.hide();
      //REGISTRY.ui.racePanel.show()
      REGISTRY.ui.staminaPanel.show();
      //TODO update user wallet address (UpdateUserData) + displayname (UpdateUserTitleDisplayName)
    })
    .catch(function (error: LoginResult) {
      log("promise.LoginWithCustomID failed", error);
      updateLoginInfoFromResult(error);
    });
}

export function fetchLeaderboardInfo(prefix: string = "") {
  log("fetchLeaderboardInfo called");
  var getLeaderboardDaily: PlayFabServerModels.GetLeaderboardRequest = {
    StatisticName: prefix + "coinsCollectedDaily",
    StartPosition: 0,
    MaxResultsCount: CONFIG.GAME_LEADEBOARD_MAX_RESULTS,
  };
  var getLeaderboardWeekly: PlayFabServerModels.GetLeaderboardRequest = {
    StatisticName: prefix + "coinsCollectedWeekly",
    StartPosition: 0,
    MaxResultsCount: CONFIG.GAME_LEADEBOARD_MAX_RESULTS,
  };
  var getLeaderboardHourly: PlayFabServerModels.GetLeaderboardRequest = {
    StatisticName: prefix + "coinsCollectedHourly",
    StartPosition: 0,
    MaxResultsCount: CONFIG.GAME_LEADEBOARD_MAX_RESULTS,
  };
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
}
//Wake is Thursday, The funeral is this Friday. I already have a vacation day scheduled for that.  If I do get bereavement but I already called off vacation can I ethically cancel the vacation for bereavement?

function fetchPlayerCombinedInfo() {
  log("fetchPlayerCombinedInfo called");
  var getPlayerCombinedInfoRequestParams: PlayFabServerModels.GetPlayerCombinedInfoRequestParams =
    {
      GetUserReadOnlyData: true,
      GetUserInventory: true,
      GetUserVirtualCurrency: true,
      GetPlayerStatistics: true,
      GetCharacterInventories: false,
      GetCharacterList: false,
      GetPlayerProfile: true,
      GetTitleData: true,
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
  PlayFabSDK.GetPlayerCombinedInfo(getPlayerCombinedInfoRequest).then(
    (result: GetPlayerCombinedInfoResult) => {
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
    }
  );
}
//testCoinPlacement();

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
