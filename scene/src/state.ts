import { Realm } from "@decentraland/EnvironmentAPI";
import { UserData } from "@decentraland/Identity";
import { Room } from "colyseus.js";
import { CONFIG } from "./config";
import {
  GetPlayerCombinedInfoResultPayload,
  LoginResult,
} from "./gamimall/playfab_sdk/playfab.types";
import { GameLevelData as GameRoomData } from "./gamimall/resources";
//import { TESTDATA_USE_SIGNED_FETCH } from './config'

//export const PLAYER_DATA_CACHE: Record<string,UserData|null> = {}

export class PlayerState {
  playerCustomID: string | null = null;
  playerDclId: string = "not-set"; //player DCL address
  playerPlayFabId: string = "not-set"; //player playfab address
  dclUserData: UserData | null = null;
  //let userData: UserData
  dclUserRealm: Realm | null = null;
  playFabLoginResult: LoginResult | null = null;
  playFabUserInfo: GetPlayerCombinedInfoResultPayload | undefined | null;
  nftDogeHelmetBalance: number = 0; //starts off 0, move to player
  nftDogeBalance: number = 0;
  loginSuccess: boolean = false; // move to player

  loginFlowState: PlayerLoginState = "undefined";

  playerStateListeners: ObservableComponentSubscription[] = [];

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
  setDclUserRealm(val: Realm) {
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

  weeklyLeaderboard?: PlayFabServerModels.GetLeaderboardResult;
  dailyLeaderboard?: PlayFabServerModels.GetLeaderboardResult;
  hourlyLeaderboard?: PlayFabServerModels.GetLeaderboardResult;

  weeklyLeaderboardRecord: Record<
    string,
    PlayFabServerModels.GetLeaderboardResult
  > = {};
  dailyLeaderboardRecord: Record<
    string,
    PlayFabServerModels.GetLeaderboardResult
  > = {};
  hourlyLeaderboardRecord: Record<
    string,
    PlayFabServerModels.GetLeaderboardResult
  > = {};

  setHourlyLeaderBoard(
    val: PlayFabServerModels.GetLeaderboardResult,
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
  setWeeklyLeaderBoard(
    val: PlayFabServerModels.GetLeaderboardResult,
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
    val: PlayFabServerModels.GetLeaderboardResult,
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
export type GameConnectedStateType =
  | "undefined"
  | "disconnected"
  | "error"
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

  material1Collected: number;
  material2Collected: number;
  material3Collected: number;

  walletTotal: number;
  gameTimeTaken: number;
  raffleResult: RaffleInterface;
};

export class GameState {
  gameEnabled: boolean = false;
  gameStarted: boolean = false; //if game started
  gameConnected: GameConnectedStateType = "undefined"; //if game connected
  gameErrorMsg: string = "";

  //https://docs.colyseus.io/colyseus/server/room/#table-of-websocket-close-codes
  gameConnectedCode: number = -1; //if game connected
  //gameConnectedMsg:string //if game connected

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

  playerState: PlayerState = new PlayerState();
  leaderboardState: LeaderboardState = new LeaderboardState();

  gameRoom?: Room;
  gameRoomInstId: number = new Date().getTime();
  gameRoomData?: GameRoomData;

  countDownTimerValue: number = 0;
  gameHudActive: boolean = false;

  gameCoinGCValue: number = 0;
  gameCoinMCValue: number = 0;
  gameCoinsCollectedValue: number = 0;
  gameCoinsTotalValue: number = 0;

  gameMaterial1Value: number = 0;
  gameMaterial2Value: number = 0;
  gameMaterial3Value: number = 0;

  //TODO make more generic
  inVox8Park: boolean = false;

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

  setGameCoinGCValue(val: number) {
    const oldVal = this.gameCoinGCValue;
    this.gameCoinGCValue = val;
    this.notifyOnChange("gameCoinGCValue", val, oldVal);
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
  setGameConnected(val: GameConnectedStateType) {
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
