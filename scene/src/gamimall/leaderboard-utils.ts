import { CONFIG, initConfig } from "src/config";

initConfig()

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
          "......" +
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
        "......" +
        playerFmtVal
    }
  return leaderBoardPlaceHolderText
}

export class LeaderboardItem implements ILeaderboardItem {
  host?: Entity;
  textHeaderShape?: TextShape;
  text?: TextShape;
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
    if (this.text) {
      this.text!.value = leaderBoardPlaceHolderText;
    }
  }
  setFormatterCallback(callback: (text: string|number) => string): void {
    this.formatterCallback = callback
  }
}


export class LeaderboardRegistry {
  daily?: ILeaderboardItem[]=[];
  weekly?: ILeaderboardItem[]=[];
  hourly?: ILeaderboardItem[]=[];
  epoch?: ILeaderboardItem[]=[];

  dailyVoxSkate?: LeaderboardItem;
  weeklyVoxSkate?: LeaderboardItem;
  hourlyVoxSkate?: LeaderboardItem;
}

export const LEADERBOARD_REGISTRY = new LeaderboardRegistry();


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

