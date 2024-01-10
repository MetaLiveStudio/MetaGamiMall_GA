//import { Realm } from "@decentraland/EnvironmentAPI";
//import { UserData } from "@decentraland/Identity";
import { Room } from "colyseus.js";
import { CONFIG } from "./config";
import {
  GetPlayerCombinedInfoResultPayload,
  LoginResult,
  StatisticValue,
} from "./gamimall/playfab_sdk/playfab.types";
import { GameLevelData as GameRoomData } from "./gamimall/resources";
//import { TESTDATA_USE_SIGNED_FETCH } from './config'


//import { RaceData } from 'src/meta-decentrally/modules/race'
//import { TrackData } from 'src/meta-decentrally/modules/trackPlacement'
import { GetPlayerCombinedInfoResultHelper } from "./gamimall/playfab-utils/playfabGetPlayerCombinedInfoResultHelper";
import { UserData } from "~system/Players";
import { RealmInfo } from "~system/Runtime";
import { ObservableComponentSubscription, log } from "./back-ports/backPorts";
import { onIdleStateChangedObservable } from "./back-ports/onIdleStateChangedObservable";
import { EnvironmentRealm } from "~system/EnvironmentApi";

 


export class PlayerState {
  playerCustomID: string | null = null;
  playerDclId: string = "not-set"; //player DCL address
  playerPlayFabId: string = "not-set"; //player playfab address
  dclUserData: UserData | null = null;
  //let userData: UserData
  dclUserRealm: RealmInfo | null = null;
  playFabLoginResult: LoginResult | null = null;
  playFabUserInfo: GetPlayerCombinedInfoResultPayload | undefined | null;
  playFabUserInfoHelper: GetPlayerCombinedInfoResultHelper
  nftDogeHelmetBalance: number = 0; //starts off 0, move to player
  nftDogeBalance: number = 0;
  loginSuccess: boolean = false; // move to player

  loginFlowState: PlayerLoginState = "undefined";

  playerStateListeners: ObservableComponentSubscription[] = [];

  constructor(){
    this.playFabUserInfoHelper = new GetPlayerCombinedInfoResultHelper();
  }
  requestDoLoginFlow() {
    this.notifyOnChange("requestDoLoginFlow", null, null);
  }
  setPlayerCustomID(val: string | null) {
    const oldVal = this.playerCustomID;
    this.playerCustomID = val;
    this.notifyOnChange("playerCustomID", val, oldVal);
  }
  setLoginFlowState(val: PlayerLoginState) {
    const oldVal = this.loginFlowState;
    this.loginFlowState = val;
    this.notifyOnChange("loginFlowState", val, oldVal);
  }
  setLoginSuccess(val: boolean) {
    const oldVal = this.loginSuccess;
    this.loginSuccess = val;
    this.notifyOnChange("loginSuccess", val, oldVal);
  }
  setPlayFabLoginResult(val: LoginResult | null) {
    const oldVal = this.playFabLoginResult;
    this.playFabLoginResult = val;
    this.notifyOnChange("playFabLoginResult", val, oldVal);
  }
  setNftDogeHelmetBalance(val: number) {
    const oldVal = this.nftDogeHelmetBalance;
    this.nftDogeHelmetBalance = val;
    this.notifyOnChange("nftDogeHelmetBalance", val, oldVal);
  }
  setDclUserData(val: UserData) {
    const oldVal = this.dclUserData;
    this.dclUserData = val;
    this.playerDclId = val.userId; //sideaffect
    this.notifyOnChange("dclUserData", val, oldVal);
  }
  setDclUserRealm(val: RealmInfo) {
    const oldVal = this.dclUserRealm;
    this.dclUserRealm = val;
    this.notifyOnChange("dclUserRealm", val, oldVal);
  }

  setPlayFabUserInfoData(
    val: GetPlayerCombinedInfoResultPayload | undefined | null
  ) {
    const oldVal = this.playFabUserInfo;
    //TODO parse it out and detect what changed
    this.playFabUserInfo = val;
    this.playFabUserInfoHelper.update(val)
    this.notifyOnChange("playFabUserInfo", val, oldVal);
  }

  notifyOnChange(key: string, newVal: any, oldVal: any) {
    for (let p in this.playerStateListeners) {
      this.playerStateListeners[p](key, newVal, oldVal);
    }
  }
  addChangeListener(fn: ObservableComponentSubscription) {
    this.playerStateListeners.push(fn);
  }
}

class LeaderboardState {
  leaderBoardStateListeners: ObservableComponentSubscription[] = [];

  levelEpochLeaderboard?: PlayFabClientModels.GetLeaderboardResult;
  weeklyLeaderboard?: PlayFabClientModels.GetLeaderboardResult;
  dailyLeaderboard?: PlayFabClientModels.GetLeaderboardResult;
  hourlyLeaderboard?: PlayFabClientModels.GetLeaderboardResult;

  levelEpochLeaderboardRecord: Record<
    string,
    PlayFabClientModels.GetLeaderboardResult
  > = {};
  weeklyLeaderboardRecord: Record<
    string,
    PlayFabClientModels.GetLeaderboardResult
  > = {};
  dailyLeaderboardRecord: Record<
    string,
    PlayFabClientModels.GetLeaderboardResult
  > = {};
  hourlyLeaderboardRecord: Record<
    string,
    PlayFabClientModels.GetLeaderboardResult
  > = {};

  setHourlyLeaderBoard(
    val: PlayFabClientModels.GetLeaderboardResult,
    prefix: string = ""
  ) {
    const oldVal = this.hourlyLeaderboard;

    if (prefix && prefix !== "") {
      this.hourlyLeaderboardRecord[prefix] = val;
    } else {
      this.hourlyLeaderboard = val;
    }
    this.notifyOnChange(prefix + "hourlyLeaderboard", val, oldVal);
  }
  
  setLevelEpocLeaderBoard(
    val: PlayFabClientModels.GetLeaderboardResult,
    prefix: string = ""
  ) {
    const oldVal = this.levelEpochLeaderboard;
    if (prefix && prefix !== "") {
      this.levelEpochLeaderboardRecord[prefix] = val;
    } else {
      this.levelEpochLeaderboard = val;
    }
    this.notifyOnChange(prefix + "levelEpochLeaderboard", val, oldVal);
  }
  setWeeklyLeaderBoard(
    val: PlayFabClientModels.GetLeaderboardResult,
    prefix: string = ""
  ) {
    const oldVal = this.weeklyLeaderboard;
    if (prefix && prefix !== "") {
      this.weeklyLeaderboardRecord[prefix] = val;
    } else {
      this.weeklyLeaderboard = val;
    }
    this.notifyOnChange(prefix + "weeklyLeaderboard", val, oldVal);
  }
  setDailyLeaderBoard(
    val: PlayFabClientModels.GetLeaderboardResult,
    prefix: string = ""
  ) {
    const oldVal = this.dailyLeaderboard;
    if (prefix && prefix !== "") {
      this.dailyLeaderboardRecord[prefix] = val;
    } else {
      this.dailyLeaderboard = val;
    }
    this.notifyOnChange(prefix + "dailyLeaderboard", val, oldVal);
  }
  notifyOnChange(key: string, newVal: any, oldVal: any) {
    for (let p in this.leaderBoardStateListeners) {
      this.leaderBoardStateListeners[p](key, newVal, oldVal);
    }
  }
  addChangeListener(fn: ObservableComponentSubscription) {
    this.leaderBoardStateListeners.push(fn);
  }
}
//export type GameStateType='undefined'|'error'|'started'|'ended'
//export type GameConnectedStateType='undefined'|'disconnected'|'error'|'connected'
//export type PlayerLoginState='undefined'|'error'|'customid-success'|'customid-error'|'playfab-error'|'playfab-success'
//export type GamePlayStateType='undefined'|'started'|'ended'

//| "wallet-success" -> customid-success
//  | "wallet-error" -> customid-error

//export type GameStateType='undefined'|'error'|'started'|'ended'
export type GameConnectedStateType =
  | "undefined"
  | "disconnected"
  | "disconnecting"
  | "error"
  | "connecting"
  | "connected";
export type PlayerLoginState =
  | "undefined"
  | "error"
  | "wallet-success"
  | "wallet-error"
  | "playfab-error"
  | "playfab-success";
//export type GamePlayStateType='undefined'|'started'|'ended'
export interface RaffleInterface {
  cost: number;
  multiplier: number;
  amountWon: number;
  hasEnoughToPlay: boolean;
}
export type GameEndResultType = {
  gcStarted: number;
  gcEnded: number;
  gcTotal: number;
  gcCollected: number;
  gcBonusEarned: number;
  coinMultiplier: number;
  gcCollectedToMC: number;
  guestCoinCollected: number;
  guestCoinName: string;
  mcCollected: number;
  mcAdjustAmount: number;
  mcCollectedAdjusted: number;
  mcTotalEarnedToday: number;

  rock1Collected: number,
  rock2Collected: number,
  rock3Collected: number,
  petroCollected: number,
  nitroCollected: number,
  bronzeCollected: number,

  bronzeShoeCollected: number
  
  material1Collected: number;
  material2Collected: number;
  material3Collected: number;

  statRaffleCoinBag: number
  ticketRaffleCoinBag: number
  redeemRaffleCoinBag: number

  autoCloseEnabled: boolean;
  autoCloseTimeoutMS: number

  walletTotal: number;
  gameTimeTaken: number;
  raffleResult: RaffleInterface;
};


export class GameState {
  gameEnabled: boolean = false;
  gameStarted: boolean = false; //if game started
  gameConnected: GameConnectedStateType = "undefined"; //if game connected
  gameErrorMsg: string = "";

  gameRoomTarget: string = ""//game room we want to be playing
  //https://docs.colyseus.io/colyseus/server/room/#table-of-websocket-close-codes
  gameConnectedCode: number = -1; //if game connected
  //gameConnectedMsg:string //if game connected

  //max auto connect retries, prevent error always visible, paired with GAME_CONNECT_RETRY_MAX=3
  connectRetryCount:number = 0;
  gameStartTime: number = 0; //when game started
  lastCoinEpochTime: number = 0; //should be in seconds
  coolDownTimerActive: boolean = false;
  gameStateListeners: ObservableComponentSubscription[] = [];
  avatarSwapEnabled: boolean = false; //starts off disabled, only changes when has wearable on
  metadogeSwapEnabled: boolean = false;
  locationEnabled: boolean = false;
  personalAssistantEnabled: boolean =
    CONFIG.PERSONAL_ASSISTANT_ENABLED_DEFAULT_STATE; //the default starting state
  screenBlockLoading: boolean = false;

  //start src/meta-decentrally
  //raceData:RaceData
  //trackData:TrackData
  //end src/meta-decentrally

  playerState: PlayerState = new PlayerState();
  leaderboardState: LeaderboardState = new LeaderboardState();

  gameRoom?: Room;
  gameRoomInstId: number = new Date().getTime();
  gameRoomData?: GameRoomData;

  serverTime?: number;
  playFabTime?: number;

  countDownTimerValue: number = 0;
  gameHudActive: boolean = false;

  gameCoinsCollectedEpochValue: number = 0;
  gameCoinsCollectedDailyValue: number = 0;
  gameCoinGCValue: number = 0;
  gameCoinMCValue: number = 0;

  gameCoinVBValue: number = 0;
  gameCoinACValue: number = 0;
  gameCoinZCValue: number = 0;
  gameCoinRCValue: number = 0;

  gameCoinBPValue: number = 0;
  gameCoinNIValue: number = 0;
  gameCoinBZValue: number = 0;

  gameCoinR1Value: number = 0;
  gameCoinR2Value: number = 0;
  gameCoinR3Value: number = 0;

  gameCoinRewardGCValue: number = 0;
  gameCoinRewardMCValue: number = 0;

  gameCoinRewardVBValue: number = 0;
  gameCoinRewardACValue: number = 0;
  gameCoinRewardZCValue: number = 0;
  gameCoinRewardRCValue: number = 0;
  

  gameCoinRewardNIValue: number = 0;
  gameCoinRewardBPValue: number = 0;
  gameCoinRewardBZValue: number = 0

  gameCoinRewardR1Value: number = 0;
  gameCoinRewardR2Value: number = 0;
  gameCoinRewardR3Value: number = 0;

  gameCoinsCollectedValue: number = 0;
  gameCoinsTotalValue: number = 0;

  gameMaterial1Value: number = 0;
  gameMaterial2Value: number = 0;
  gameMaterial3Value: number = 0;

  gameItemBronzeShoeValue: number = 0;
  gameItemRewardBronzeShoeValue: number = 0;

  statRaffleCoinBag: number = 0;
  ticketRaffleCoinBag: number = 0;

  statRewardRaffleCoinBag: number = 0;
  ticketRewardRaffleCoinBag: number = 0;

  //TODO make more generic
  inVox8Park: boolean = false;

  isIdle: boolean = false

  gameEndResult?: GameEndResultType;
  metadogeSwapEnabledIcon: boolean = false;
  //store full game object results here, using flags above to track changing them
  //wrap this in an additional observer pattern
  //playerCombinedInfoResult:GetPlayerCombinedInfoResult

  setPersonalAssistantEnabled(val: boolean) {
    const oldVal = this.personalAssistantEnabled;
    this.personalAssistantEnabled = val;
    this.notifyOnChange("personalAssistantEnabled", val, oldVal);
  }

  setLoginSuccess(val: boolean) {
    this.playerState.setLoginSuccess(val);
  }


  setNftDogeHelmetBalance(val: number) {
    this.playerState.setNftDogeHelmetBalance(val);
  }

  setMetaDogeSwap(val: boolean) {
    this.metadogeSwapEnabled = val;
    this.notifyOnChange("metaDogeSwapEnabled", val, true);
  }

  setLocation(val: boolean) {
    const oldVal = this.locationEnabled;
    this.locationEnabled = val;
    this.notifyOnChange("locationEnabled", val, oldVal);
  }

  setAvatarSwapEnabled(val: boolean) {
    const oldVal = this.avatarSwapEnabled;
    this.avatarSwapEnabled = val;
    this.notifyOnChange("avatarSwapEnabled", val, oldVal);
  }
  setAvatarSwap() {
    this.notifyOnChange("avatarSwap", true, false);
  }
  setInVox8Park(val: boolean) {
    const oldVal = this.inVox8Park;
    this.inVox8Park = val;
    this.notifyOnChange("inVox8Park", val, oldVal);
  }

  setGameEndResult(val: GameEndResultType) {
    const oldVal = this.gameEndResult;
    this.gameEndResult = val;
    this.notifyOnChange("gameEndResult", val, oldVal);
  }

  setGameRoom(val: Room|undefined) {
    log("setGameRoom",val)
    const oldVal = this.gameRoom;
    this.gameRoom = val;
    this.notifyOnChange("gameRoom", val, oldVal);
  }
  setGameRoomData(val: GameRoomData) {
    const oldVal = this.gameRoomData;
    this.gameRoomData = val;
    this.notifyOnChange("gameRoomData", val, oldVal);
  }

  setGameConnectedCode(val: number) {
    const oldVal = this.gameConnectedCode;
    this.gameConnectedCode = val;
    this.notifyOnChange("gameConnectedCode", val, oldVal);
  }
  
  setGameCoinRewardGCValue(val: number) {
    const oldVal = this.gameCoinRewardGCValue;
    this.gameCoinRewardGCValue = val;
    this.notifyOnChange("gameCoinRewardGCValue", val, oldVal);
  }
  setGameCoinRewardMCValue(val: number) {
    const oldVal = this.gameCoinRewardMCValue;
    this.gameCoinRewardMCValue = val;
    this.notifyOnChange("gameCoinRewardMCValue", val, oldVal);
  }


  setGameCoinRewardVBValue(val: number) {
    const oldVal = this.gameCoinRewardVBValue;
    this.gameCoinRewardVBValue = val;
    this.notifyOnChange("gameCoinRewardVBValue", val, oldVal);
  }
  setGameCoinRewardACValue(val: number) {
    const oldVal = this.gameCoinRewardACValue;
    this.gameCoinRewardACValue = val;
    this.notifyOnChange("gameCoinRewardACValue", val, oldVal);
  }
  setGameCoinRewardZCValue(val: number) {
    const oldVal = this.gameCoinRewardZCValue;
    this.gameCoinRewardZCValue = val;
    this.notifyOnChange("gameCoinRewardZCValue", val, oldVal);
  }
  setGameCoinRewardRCValue(val: number) {
    const oldVal = this.gameCoinRewardRCValue;
    this.gameCoinRewardRCValue = val;
    this.notifyOnChange("gameCoinRewardRCValue", val, oldVal);
  }

  setGameCoinRewardBPValue(val: number) {
    const oldVal = this.gameCoinRewardBPValue;
    this.gameCoinRewardBPValue = val;
    this.notifyOnChange("gameCoinRewardBPValue", val, oldVal);
  }
  setGameCoinRewardBZValue(val: number) {
    const oldVal = this.gameCoinRewardBZValue;
    this.gameCoinRewardBZValue = val;
    this.notifyOnChange("gameCoinRewardBZValue", val, oldVal);
  }
  setGameCoinRewardNIValue(val: number) {
    const oldVal = this.gameCoinRewardNIValue;
    this.gameCoinRewardNIValue = val;
    this.notifyOnChange("gameCoinRewardNIValue", val, oldVal);
  }
  setGameCoinRewardR1Value(val: number) {
    const oldVal = this.gameCoinRewardR1Value;
    this.gameCoinRewardR1Value = val;
    this.notifyOnChange("setGameCoinRewardR1Value", val, oldVal);
  }
  setGameCoinRewardR2Value(val: number) {
    const oldVal = this.gameCoinRewardR2Value;
    this.gameCoinRewardR2Value = val;
    this.notifyOnChange("gameCoinRewardR2Value", val, oldVal);
  }
  setGameCoinRewardR3Value(val: number) {
    const oldVal = this.gameCoinRewardR3Value;
    this.gameCoinRewardR3Value = val;
    this.notifyOnChange("gameCoinRewardR3Value", val, oldVal);
  }
  setGameItemRewardBronzeShoeValue(val: number) {
    const oldVal = this.gameItemRewardBronzeShoeValue; 
    this.gameItemRewardBronzeShoeValue = val;
    this.notifyOnChange("gameItemRewardBronzeShoeValue", val, oldVal);
  }

  setGameItemRewardStatRaffleCoinBag(val: number) {
    const oldVal = this.statRewardRaffleCoinBag;
    this.statRewardRaffleCoinBag = val;
    this.notifyOnChange("statRewardRaffleCoinBag", val, oldVal);
  }
  setGameItemRewardTicketRaffleCoinBag(val: number) {
    const oldVal = this.ticketRewardRaffleCoinBag;
    this.ticketRewardRaffleCoinBag = val;
    this.notifyOnChange("ticketRewardRaffleCoinBag", val, oldVal);
  }

   
  setGameCoinGCValue(val: number) {
    const oldVal = this.gameCoinGCValue;
    this.gameCoinGCValue = val;
    this.notifyOnChange("gameCoinGCValue", val, oldVal);
  }
  setGameCoinsCollectedEpochValue(val: number) {
    const oldVal = this.gameCoinsCollectedEpochValue;
    this.gameCoinsCollectedEpochValue = val;
    this.notifyOnChange("gameCoinsCollectedEpochValue", val, oldVal);
  }
  setGameCoinsCollectedDailyValue(val: number) {
    const oldVal = this.gameCoinsCollectedDailyValue;
    this.gameCoinsCollectedDailyValue = val;  
    this.notifyOnChange("gameCoinsCollectedDailyValue", val, oldVal);
  }

  setGameCoinBPValue(val: number) {
    const oldVal = this.gameCoinBPValue;
    this.gameCoinBPValue = val;
    this.notifyOnChange("gameCoinBPValue", val, oldVal);
  }
  setGameCoinNIValue(val: number) {
    const oldVal = this.gameCoinNIValue;
    this.gameCoinNIValue = val;
    this.notifyOnChange("gameCoinNIValue", val, oldVal);
  }
  setGameCoinBZValue(val: number) {
    const oldVal = this.gameCoinBZValue;
    this.gameCoinBZValue = val;
    this.notifyOnChange("gameCoinBZValue", val, oldVal);
  }
  

  setGameCoinR1Value(val: number) {
    const oldVal = this.gameCoinR1Value;
    this.gameCoinR1Value = val;
    this.notifyOnChange("gameCoinR1Value", val, oldVal);
  }
  setGameCoinR2Value(val: number) {
    const oldVal = this.gameCoinR2Value;
    this.gameCoinR2Value = val;
    this.notifyOnChange("gameCoinR2Value", val, oldVal);
  }
  setGameCoinR3Value(val: number) {
    const oldVal = this.gameCoinR3Value;
    this.gameCoinR3Value = val;
    this.notifyOnChange("gameCoinR3Value", val, oldVal);
  }
  setGameItemStatRaffleCoinBag(val: number) {
    const oldVal = this.statRaffleCoinBag;
    this.statRaffleCoinBag = val;
    this.notifyOnChange("statRaffleCoinBag", val, oldVal);
  }
  setGameItemTicketRaffleCoinBag(val: number) {
    const oldVal = this.ticketRaffleCoinBag;
    this.ticketRaffleCoinBag = val;
    this.notifyOnChange("ticketRaffleCoinBag", val, oldVal);
  }

  setGameItemBronzeShoeValue(val: number) {
    const oldVal = this.gameItemBronzeShoeValue;
    this.gameItemBronzeShoeValue = val;
    this.notifyOnChange("gameItemBronzeShoeValue", val, oldVal);
  }
  
  setGameMaterial1Value(val: number) {
    const oldVal = this.gameMaterial1Value;
    this.gameMaterial1Value = val;
    this.notifyOnChange("gameMaterial1Value", val, oldVal);
  }
  setGameMaterial2Value(val: number) {
    const oldVal = this.gameMaterial2Value;
    this.gameMaterial2Value = val;
    this.notifyOnChange("gameMaterial2Value", val, oldVal);
  }
  setGameMaterial3Value(val: number) {
    const oldVal = this.gameMaterial3Value;
    this.gameMaterial3Value = val;
    this.notifyOnChange("gameMaterial3Value", val, oldVal);
  }

  setGameCoinsCollectedValue(val: number) {
    const oldVal = this.gameCoinsCollectedValue;
    this.gameCoinsCollectedValue = val;
    this.notifyOnChange("gameCoinsCollectedValue", val, oldVal);
  }
  setGameCoinsTotalValue(val: number) {
    const oldVal = this.gameCoinsTotalValue;
    this.gameCoinsTotalValue = val;
    this.notifyOnChange("gameCoinsTotalValue", val, oldVal);
  }

  setGameCoinMCValue(val: number) {
    const oldVal = this.gameCoinMCValue;
    this.gameCoinMCValue = val;
    this.notifyOnChange("gameCoinMCValue", val, oldVal);
  }

  setGameCoinVBValue(val: number) {
    const oldVal = this.gameCoinVBValue;
    this.gameCoinVBValue = val;
    this.notifyOnChange("gameCoinVBValue", val, oldVal);
  }
  setGameCoinACValue(val: number) {
    const oldVal = this.gameCoinACValue;
    this.gameCoinACValue = val;
    this.notifyOnChange("gameCoinACValue", val, oldVal);
  }
  setGameCoinZCValue(val: number) {
    const oldVal = this.gameCoinZCValue;
    this.gameCoinZCValue = val;
    this.notifyOnChange("gameCoinZCValue", val, oldVal);
  }
  setGameCoinRCValue(val: number) {
    const oldVal = this.gameCoinRCValue;
    this.gameCoinRCValue = val;
    this.notifyOnChange("gameCoinRCValue", val, oldVal);
  }
  

  setGameCoinGuestValue(val: number) {
    const oldVal = -1; //this.gameCoinMCValue
    //this.gameCoinMCValue = val
    this.notifyOnChange("gameCoinGuestValue", val, oldVal);
  }

  setGameHudActive(val: boolean) {
    const oldVal = this.gameHudActive;
    this.gameHudActive = val;
    this.notifyOnChange("gameHudActive", val, oldVal);
  }

  setCountDownTimerValue(val: number) {
    const oldVal = this.countDownTimerValue;
    this.countDownTimerValue = val;
    this.notifyOnChange("countDownTimerValue", val, oldVal);
  }

  setScreenBlockLoading(val: boolean) {
    const oldVal = this.screenBlockLoading;
    this.screenBlockLoading = val;
    this.notifyOnChange("screenBlockLoading", val, oldVal);
  } 
  setGameStarted(val: boolean) {
    const oldVal = this.gameStarted;
    this.gameStarted = val;
    this.notifyOnChange("gameStarted", val, oldVal);
  } 
  setGameConnected(val: GameConnectedStateType,calledBy?:string) {
    log("setGameConnected",val,calledBy)
    /*if(val == "error"){
      debugger
    }*/
    const oldVal = this.gameConnected;
    this.gameConnected = val;
    this.notifyOnChange("gameConnected", val, oldVal);
  }
  setGameErrorMsg(val: string) {
    const oldVal = this.gameErrorMsg;
    this.gameErrorMsg = val;
    this.notifyOnChange("gameErrorMsg", val, oldVal);
  }

  setLastCoinEpochTime(val: number) {
    const oldVal = this.lastCoinEpochTime;
    this.lastCoinEpochTime = val;
    this.notifyOnChange("lastCoinEpochTime", val, oldVal);
  }
  getLastCoinEpochTimeNowDiff() {
    const SECONDS_IN_1_DAY = 86400;
    return (this.lastCoinEpochTime + SECONDS_IN_1_DAY) * 1000 - Date.now();
  }

  coinCollected(coinId: string) {
    this.notifyOnChange("coinCollected", coinId, null);
  }
  notifyInGameMsg(newVal: any) {
    this.notifyOnChange("inGameMsg", newVal, null);
  }
  notifyOnChange(key: string, newVal: any, oldVal: any) {
    for (let p in this.gameStateListeners) {
      this.gameStateListeners[p](key, newVal, oldVal);
    }
  }
  addChangeListener(fn: ObservableComponentSubscription) {
    this.gameStateListeners.push(fn);
  }
}

export let GAME_STATE: GameState;
export function initGameState() {
  log("initGameState called");
  if (GAME_STATE === undefined) {
    GAME_STATE = new GameState();


    onIdleStateChangedObservable.add((isIdle: boolean) => {
      log("Idle State change: ", isIdle)
      GAME_STATE.isIdle = isIdle
    })
  }
}

export function getTimeFormat(distance: number): string {
  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  let timeLeftFormatted =
    (hours < 10 ? "0" + hours : hours) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    ":" +
    (seconds < 10 ? "0" + seconds : seconds);

  return timeLeftFormatted;
}


export function resetAllGameStateGameCoin(){
  
  GAME_STATE.setGameCoinGCValue(0)
  GAME_STATE.setGameCoinMCValue(0)
  GAME_STATE.setGameCoinBZValue(0)

  GAME_STATE.setGameCoinR1Value(0)
  GAME_STATE.setGameCoinR2Value(0)
  GAME_STATE.setGameCoinR3Value(0)

  GAME_STATE.setGameCoinBPValue(0)
  GAME_STATE.setGameCoinNIValue(0)
  GAME_STATE.setGameItemBronzeShoeValue(0)


  GAME_STATE.setGameItemStatRaffleCoinBag(0)
  GAME_STATE.setGameItemTicketRaffleCoinBag(0)

}
export function resetAllGameStateGameCoinRewards(){
  GAME_STATE.setGameCoinRewardGCValue(0)
  GAME_STATE.setGameCoinRewardMCValue(0)
  GAME_STATE.setGameCoinRewardBZValue(0)

  GAME_STATE.setGameCoinRewardR1Value(0)
  GAME_STATE.setGameCoinRewardR2Value(0)
  GAME_STATE.setGameCoinRewardR3Value(0)

  GAME_STATE.setGameCoinRewardBPValue(0)
  GAME_STATE.setGameCoinRewardNIValue(0)
  GAME_STATE.setGameItemRewardBronzeShoeValue(0)


  GAME_STATE.setGameItemRewardStatRaffleCoinBag(0)
  GAME_STATE.setGameItemRewardTicketRaffleCoinBag(0)
  
}
