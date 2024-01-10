import { Entity } from "@dcl/sdk/ecs";
import { log } from "../back-ports/backPorts";
import { CONFIG, initConfig } from "../config";

//TODO MAKE AN INIT LEADERBOARD OBJS
//initConfig()

export type PlayerLeaderboardEntryType = {
  /** Title-specific display name of the user for this leaderboard entry. */
  DisplayName?: string;
  /** PlayFab unique identifier of the user for this leaderboard entry. */
  PlayFabId?: string;
  /** User's overall position in the leaderboard. */
  Position: number;
  /** Specific value of the user's statistic. */
  StatValue: number;
};
export interface ILeaderboardItem {
  //host?: Entity;
  //textHeaderShape?: TextShape;
  //text?: TextShape;
  playerEntries?: PlayerLeaderboardEntryType[];
  currentPlayer?: PlayerLeaderboardEntryType;

  setPlayerEntries(arr: PlayerLeaderboardEntryType[]):void;
  setCurrentPlayer(arr: PlayerLeaderboardEntryType):void;

  updateUI():void
}
const REPEAT_CHAR_CACHE = new Map()
function clearRepeatStrCache(){
  REPEAT_CHAR_CACHE.clear()
}
function repeatStr(char:string,times:number,stringToPrepend?:string){
  let str = ""

  let _times = times;
  if(stringToPrepend){
    //TODO account for non mono space length, shorter need a little more
    if(stringToPrepend.length < times && stringToPrepend.length < 10){
      _times = times - (stringToPrepend.length * .3)
    }else{ 
      _times = times - stringToPrepend.length
    }
  }

  const key = char + "."+_times
  if(REPEAT_CHAR_CACHE.has(key)){
    str = REPEAT_CHAR_CACHE.get(key)
  }else{
    for(let x=0;x<_times;x++){
      str += "."
    }
    REPEAT_CHAR_CACHE.set(key,str)
  }

  return str;
}
export function createLeaderBoardPanelText(board:ILeaderboardItem, startIndex:number, pageSize:number,formatterCallback?: (text: string|number) => string){
  log("createLeaderBoardPanelText",startIndex,pageSize)
  let leaderBoardPlaceHolderText = "";
    //let leaderBoardPlaceHolderText2 = "";

    let counter = 0;

    if (board.playerEntries !== undefined) {
      for (let p = Math.max(startIndex,0) ; p < board.playerEntries.length; p++) {
        const item = board.playerEntries[p];
        leaderBoardPlaceHolderText +=
          Number(item.Position) +
          1 +
          " " +
          item.DisplayName +
          "..." +//repeatStr(".",30,item.DisplayName ) +
          (formatterCallback ? formatterCallback(item.StatValue) : item.StatValue) +
          "\n";

        counter++;

        if (counter >= pageSize) {
          break;
        }
      }
    }

    
    if (board.currentPlayer !== undefined) {
      const defaultNoValue = "0"
      const playerVal = (board.currentPlayer.StatValue ? board.currentPlayer.StatValue : 0)

      const playerFmtVal = playerVal ? (formatterCallback ? formatterCallback(playerVal) : playerVal) : defaultNoValue

      leaderBoardPlaceHolderText +=
        "\n" +
        board.currentPlayer.DisplayName +
        "..." +//repeatStr(".",30,board.currentPlayer.DisplayName ) +
        playerFmtVal
    }

    clearRepeatStrCache()

  return leaderBoardPlaceHolderText
}

export class LeaderboardItem implements ILeaderboardItem {
  
  host?: Entity;

  //TODO BRING BACK!
  //textHeaderShape?: TextShape;
  //text?: TextShape;
  playerEntries?: PlayerLeaderboardEntryType[];
  currentPlayer?: PlayerLeaderboardEntryType;
  formatterCallback?: (text: string|number) => string;
  startIndex:number = 0;
  pageSize:number = CONFIG.GAME_LEADEBOARD_BILLBOARD_MAX_RESULTS
  
  setPlayerEntries(arr: PlayerLeaderboardEntryType[]) {
    this.startIndex = 0
    this.playerEntries = arr;
  }
  setCurrentPlayer(arr: PlayerLeaderboardEntryType) {
    this.currentPlayer = arr;
  }

  updateUI() {
    const leaderBoardPlaceHolderText = createLeaderBoardPanelText(this,this.startIndex,this.pageSize,this.formatterCallback)
    //TODO BRING BACK!
    //if (this.text) {
    //  this.text!.value = leaderBoardPlaceHolderText;
    //}
  }
  setFormatterCallback(callback: (text: string|number) => string): void {
    this.formatterCallback = callback
  }
}


export class LeaderboardRegistry {
  daily: ILeaderboardItem[]=[];
  weekly: ILeaderboardItem[]=[];
  hourly: ILeaderboardItem[]=[];
  epoch: ILeaderboardItem[]=[];
  raffleCoinBag: ILeaderboardItem[]=[];


  //dailyVoxSkate?: LeaderboardItem;
  //weeklyVoxSkate?: LeaderboardItem;
  //hourlyVoxSkate?: LeaderboardItem;
}

let LEADERBOARD_REGISTRY:LeaderboardRegistry

export function getLeaderboardRegistry(){
  if(LEADERBOARD_REGISTRY===undefined){
    LEADERBOARD_REGISTRY = new LeaderboardRegistry();
  }
  return LEADERBOARD_REGISTRY
}
export function initLeaderboardRegistry() {
  getLeaderboardRegistry()
}

export function updateLeaderboard(playerNames: string[]) {
  /*
    while (playerNames.length < 10) {
        playerNames.push("");
    }
    playerNames = playerNames.filter((_, i) => i < 10);
    leaderboard.value = `Leaderboard:\n\n${playerNames.join("\n")}`;
    */
}

export const leaderBoardsConfigs = [
  {
    prefix: "",
    hourly: () => {
      return LEADERBOARD_REGISTRY.hourly;
    },
    daily: () => {
      return LEADERBOARD_REGISTRY.daily;
    },
    weekly: () => {
      return LEADERBOARD_REGISTRY.weekly;
    },
    epoch: () => {
      return LEADERBOARD_REGISTRY.epoch;
    },
    raffleCoinBag: () => {
      return LEADERBOARD_REGISTRY.raffleCoinBag;
    },
  }/*,
  {
    prefix: "VB_",
    hourly: () => {
      return LEADERBOARD_REGISTRY.hourlyVoxSkate;
    },
    daily: () => {
      return LEADERBOARD_REGISTRY.dailyVoxSkate;
    },
    weekly: () => {
      return LEADERBOARD_REGISTRY.weeklyVoxSkate;
    },
  },*/
];

