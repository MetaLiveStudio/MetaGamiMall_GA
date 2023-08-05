import { CONFIG } from "src/config";
import { logChangeListenerEntry } from "src/logging";
import { GAME_STATE, PlayerState, initGameState } from "src/state";
import { isNull } from "src/utils";
import { fetchLeaderboardInfo } from "./login-flow";
import { getUserDisplayName } from "./player-utils";
import {
  GetPlayerCombinedInfoResultPayload,
  PlayerLeaderboardEntry,
  StatisticValue,
} from "./playfab_sdk/playfab.types";
import { createMaterial, GLOBAL_CANVAS } from "./resources";
import { LeaderBoardPrompt } from "src/ui/modals";
import { REGISTRY } from "src/registry";
import { getLevelFromXp } from "src/modules/leveling/levelingUtils";
import { ILeaderboardItem, LEADERBOARD_REGISTRY, PlayerLeaderboardEntryType, createLeaderBoardPanelText, leaderBoardsConfigs } from "./leaderboard-utils";

initGameState()

export const uiCanvas = GLOBAL_CANVAS;
let textHeaderShape: TextShape | undefined;
/*
const leaderboardBackground = new UIContainerRect(uiCanvas);
leaderboardBackground.alignmentUsesSize = true;
leaderboardBackground.positionX = "-41%";
leaderboardBackground.positionY = "5%";
leaderboardBackground.width = 200;
leaderboardBackground.height = 200;
leaderboardBackground.color = Color4.Black();
leaderboardBackground.opacity = 0.5;

uiCanvas.positionX = 0;

let leaderboard: UIText = new UIText(uiCanvas);
leaderboard.positionX = "-41%";
leaderboard.positionY = "5%";
leaderboard.paddingLeft = 10;
leaderboard.fontSize = 15;
leaderboard.width = 200;
leaderboard.height = 210;
leaderboard.hTextAlign = "left";
leaderboard.vAlign = "center";
leaderboard.color = Color4.White();

*/

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


export function makeLeaderboard(
  host: Entity,
  model: GLTFShape | undefined | null,
  title: string | undefined | null,
  title2: string | undefined | null,
  text: string,
  fontSize: number,
  modelTransform?: Transform,
  textHeaderTransform?: Transform,
  textHeaderTransform2?: Transform,
  textTransform?: Transform,
  fontColor?: Color3
): LeaderboardItem {
  const sign = new Entity(host.name + "-sign");
  sign.setParent(host);

  sign.addComponent(
    modelTransform !== undefined ? modelTransform : new Transform({})
  );

  if (model) {
    sign.addComponent(model);

    let signBackground = new Entity(host.name + "-sign-background");
    signBackground.setParent(host);
    signBackground.addComponent(new PlaneShape());
    signBackground.addComponent(
      new Transform({
        position: new Vector3(0, 0.8, 0.02),
        //rotation: Quaternion.Euler(0, 180, 0),
        scale: new Vector3(1, 1.3, 1),
      })
    );
    let material = createMaterial(Color3.Blue(), false);
    signBackground.addComponent(material);
  }

  if (title2 !== null && title2 !== undefined) {
    let signHeaderText2 = new Entity(host.name + "-sign-text2");
    signHeaderText2.setParent(host);

    let textHeaderShape2 = //TEXTSHAPECACHE[key]
      //if(isNull(text)){
      new TextShape(title2);
    textHeaderShape2.fontSize = fontSize;
    textHeaderShape2.color = fontColor
      ? fontColor
      : Color3.FromHexString("#8cfdff");
    textHeaderShape2.outlineWidth = 0.1;
    textHeaderShape2.outlineColor = Color3.FromHexString("#000000");

    textHeaderShape2.width = 20;
    textHeaderShape2.height = 10;
    textHeaderShape2.vTextAlign = "top";
    textHeaderShape2.hTextAlign = "center";

    //TEXTSHAPECACHE[key] = text
    //}

    signHeaderText2.addComponent(textHeaderShape2);

    //log("signText " + signText.name + " "  + signText.hasComponent(TextShape) )

    signHeaderText2.addComponent(
      textHeaderTransform2 !== undefined
        ? textHeaderTransform2
        : new Transform({
            position: new Vector3(0, -0.5, 0.04),
            rotation: Quaternion.Euler(0, 180, 0),
            scale: new Vector3(0.05, 0.05, 0.05),
          })
    );
  }

  if (title !== null && title !== undefined) {
    let signHeaderText = new Entity(host.name + "-sign-text");
    signHeaderText.setParent(host);

    let textHeaderShape = //TEXTSHAPECACHE[key]
      //if(isNull(text)){
      new TextShape(title);
    textHeaderShape.fontSize = fontSize;
    textHeaderShape.color = fontColor
      ? fontColor
      : Color3.FromHexString("#8cfdff");
    textHeaderShape.outlineWidth = 0.1;
    textHeaderShape.outlineColor = Color3.FromHexString("#000000");

    textHeaderShape.width = 20;
    textHeaderShape.height = 10;
    textHeaderShape.vTextAlign = "top";
    textHeaderShape.hTextAlign = "center";

    //TEXTSHAPECACHE[key] = text
    //}

    signHeaderText.addComponent(textHeaderShape);

    //log("signText " + signText.name + " "  + signText.hasComponent(TextShape) )

    signHeaderText.addComponent(
      textHeaderTransform !== undefined
        ? textHeaderTransform
        : new Transform({
            position: new Vector3(0, -0.5, 0.04),
            rotation: Quaternion.Euler(0, 180, 0),
            scale: new Vector3(0.05, 0.05, 0.05),
          })
    );
  }

  let signText = new Entity(host.name + "-sign-text");
  signText.setParent(host);

  const key = text + "_" + fontSize;

  let textShape = //TEXTSHAPECACHE[key]
    //if(isNull(text)){
    new TextShape(text);
  textShape.fontSize = fontSize;
  textShape.color = fontColor ? fontColor : Color3.FromHexString("#8cfdff");
  textShape.outlineWidth = 0.1;
  textShape.outlineColor = Color3.FromHexString("#000000");

  textShape.width = 20;
  textShape.height = 10;
  textShape.vTextAlign = "top";
  textShape.hTextAlign = "center";

  //TEXTSHAPECACHE[key] = text
  //}

  signText.addComponent(textShape);

  //log("signText " + signText.name + " "  + signText.hasComponent(TextShape) )

  signText.addComponent(
    textTransform !== undefined
      ? textTransform
      : new Transform({
          position: new Vector3(0, 0.55, 0.04),
          rotation: Quaternion.Euler(0, 180, 0),
          scale: new Vector3(0.05, 0.05, 0.05),
        })
  );

  const item = new LeaderboardItem();
  item.host = host;
  item.text = textShape;

  item.textHeaderShape = textHeaderShape;

  return item;
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


let playerArr: PlayerLeaderboardEntryType[] = [];
  let leaderBoardPlaceHolderText = "\nSign in to see leaderboard";
  playerArr.push({
    DisplayName: "Sign in to see leaderboard",
    Position: 0,
    StatValue: 0,
  });

const LEADERBOARD_PROMPT_HEIGHT = 620;
const LEADERBOARD_PROMPT_WIDTH = 500;
const hourlyLeaderBoard = new LeaderBoardPrompt(
  "Hourly Leaderboard",
  leaderBoardPlaceHolderText,
  "OK",
  () => {},
  {
    //textPositionY: -30,
    //modalHeight: 500,
    height: LEADERBOARD_PROMPT_HEIGHT,
    width: LEADERBOARD_PROMPT_WIDTH,
  }
);

//hourlyLeaderBoard.show()

const weeklyLeaderboard = new LeaderBoardPrompt(
  "Weekly Leaderboard",
  leaderBoardPlaceHolderText,
  "OK",
  () => {},
  {
    //textPositionY: -30,
    //modalHeight: 500,
    height: LEADERBOARD_PROMPT_HEIGHT,
    width: LEADERBOARD_PROMPT_WIDTH,
  }
);


const levelLeaderboard = new LeaderBoardPrompt(
  "Level Leaderboard",
  leaderBoardPlaceHolderText,
  "OK",
  () => {},
  {
    //textPositionY: -30,
    //modalHeight: 500,
    height: LEADERBOARD_PROMPT_HEIGHT,
    width: LEADERBOARD_PROMPT_WIDTH,
  }
);
levelLeaderboard.setFormatterCallback(
  (text:string|number)=>{
    const rawVal = typeof text === "string" ? parseInt(text) : text

    if(rawVal >= 0){
      const level = getLevelFromXp( rawVal ,CONFIG.GAME_LEVELING_FORMULA_CONST)
      return level.toFixed(0)
    }else{
      return "0"
    }
  }
)

//levelLeaderboard.show()


REGISTRY.ui.openLeaderboardHourly = ()=> { hourlyLeaderBoard.show() }
REGISTRY.ui.openLeaderboardWeekly = ()=> { weeklyLeaderboard.show() }
REGISTRY.ui.openLeaderboardLevelEpoch = ()=> { levelLeaderboard.show() }

LEADERBOARD_REGISTRY.hourly.push(hourlyLeaderBoard)
LEADERBOARD_REGISTRY.weekly.push(weeklyLeaderboard)
LEADERBOARD_REGISTRY.epoch.push(levelLeaderboard)


GAME_STATE.leaderboardState.addChangeListener(
  (key: string, newVal: any, oldVal: any) => {
    log(
      "listener.leaderboardState.ui-leaderboard.ts " +
        key +
        " " +
        newVal +
        " " +
        oldVal
    );

    let leaderBoardItem: ILeaderboardItem[] | undefined = undefined;
    let playerArr: PlayerLeaderboardEntryType[] = [];
    let leaderArr: PlayerLeaderboardEntry[] = [];

    let maxResults = CONFIG.GAME_LEADEBOARD_MAX_RESULTS
    //scan to find matching key
    for (const p in leaderBoardsConfigs) {
      const leaderBoardConfig = leaderBoardsConfigs[p];

      if (
        leaderBoardConfig.hourly() &&
        key == leaderBoardConfig.prefix + "hourlyLeaderboard"
      ) {
        leaderBoardItem = leaderBoardConfig.hourly();
        leaderArr = newVal.Leaderboard;
        break;
      } else if (
        leaderBoardConfig.daily() &&
        key == leaderBoardConfig.prefix + "dailyLeaderboard"
      ) {
        leaderBoardItem = leaderBoardConfig.daily();
        leaderArr = newVal.Leaderboard;
        break;
      } else if (
        leaderBoardConfig.weekly() &&
        key == leaderBoardConfig.prefix + "weeklyLeaderboard"
      ) {
        leaderBoardItem = leaderBoardConfig.weekly();
        leaderArr = newVal.Leaderboard;
        break;
      } else if (
        leaderBoardConfig.weekly() &&
        key == leaderBoardConfig.prefix + "levelEpochLeaderboard"
      ) {
        leaderBoardItem = leaderBoardConfig.epoch();
        leaderArr = newVal.Leaderboard;
        maxResults = CONFIG.GAME_LEADEBOARD_LVL_MAX_RESULTS
        break;
      }
      
    }

    if (leaderArr != null && leaderArr.length > 0) {
      let counter = 0;
      for (const p in leaderArr) {
        //const weekStr = (dailyLeaderArr[p].Position+1) + " " + dailyLeaderArr[p].DisplayName + " " + dailyLeaderArr[p].StatValue
        playerArr.push(leaderArr[p]);
        counter++;
        if (counter >= maxResults) {
          break;
        }
      }
    } else {
      playerArr.push({
        DisplayName: "No data for Coins Collected",
        Position: 0,
        StatValue: -1,
      });
    }
    for(const p of leaderBoardItem){
      if (p !== undefined) {
        log("addChangeListener to update for " + key);
        p.setPlayerEntries(playerArr);
        p.updateUI();
      } else {
        log("addChangeListener failed to update for " + key);
      }
    }
  }
);

GAME_STATE.playerState.addChangeListener(
  (key: string, newVal: any, oldVal: any) => {
    log(
      "listener.playerState.ui-leaderboard.ts " +
        key +
        " " +
        newVal +
        " " +
        oldVal
    );

    switch (key) {
      //common ones on top
      case "playFabUserInfo":
        //avatarSwapScript.setAvatarSwapTriggerEnabled(avatarSwap,newVal)
        //if(playerUI && playerUI.PAGE_1_MENU){
        const dailyLeaderArrStr: string[] = [];

        //TODO what if displayname is null???
        const playerName = getUserDisplayName(GAME_STATE.playerState);
        //pushStrToArr(dailyLeaderArrStr,"MetaCash:",GAME_STATE.playerState.playFabUserInfo?.UserVirtualCurrency?.MC)

        for (const p in leaderBoardsConfigs) {
          const leaderBoardConfig = leaderBoardsConfigs[p];

          let coinCollectingEpochStat: StatisticValue;
          let coinCollectingDailyStat: StatisticValue;
          let coinCollectingWeeklyStat: StatisticValue;
          let coinCollectingHourlyStat: StatisticValue;

          let playerFabUserInfo:
            | GetPlayerCombinedInfoResultPayload
            | null
            | undefined = GAME_STATE.playerState.playFabUserInfo;
          if (playerFabUserInfo) {
            let playerStatics = playerFabUserInfo.PlayerStatistics;
            if (playerStatics) {
              for (const p in playerStatics) {
                const stat: StatisticValue = playerStatics[p];
                log("stat ", stat);
                if (
                  stat.StatisticName ==
                  leaderBoardConfig.prefix + "coinsCollectedEpoch"
                ) {
                  coinCollectingEpochStat = stat;
                } else if (
                  stat.StatisticName ==
                  leaderBoardConfig.prefix + "coinsCollectedDaily"
                ) {
                  coinCollectingDailyStat = stat;
                } else if (
                  stat.StatisticName ==
                  leaderBoardConfig.prefix + "coinsCollectedWeekly"
                ) {
                  coinCollectingWeeklyStat = stat;
                } else if (
                  stat.StatisticName ==
                  leaderBoardConfig.prefix + "coinsCollectedHourly"
                ) {
                  coinCollectingHourlyStat = stat;
                }
              }
            }
            //pushStrToArr(dailyLeaderArrStr,"Coins Collected Today",coinCollectingDailyStat?.Value,"0")
            //pushStrToArr(dailyLeaderArrStr,"Coins Collected Epoch",coinCollectingEpochStat?.Value,"0")
            //pushStrToArr(dailyLeaderArrStr,"MetaCash Earned Today",concatString([coinsMCEarnedDailyStat?.Value,'/' + CONFIG.GAME_COIN_MC_MAX_PER_DAY],'-'))
            //pushStrToArr(dailyLeaderArrStr,"Meta Coins:",GAME_STATE.playerState.playFabUserInfo?.UserVirtualCurrency?.MC)

            //todo check it
            leaderBoardConfig.hourly()?.forEach((p=>{
              p.setCurrentPlayer({
                DisplayName: playerName + "",
                Position: -1,
                StatValue: coinCollectingHourlyStat!
                  ? coinCollectingHourlyStat.Value
                  : -1,
              });
            }))
            leaderBoardConfig.daily()?.forEach((p=>{
              p.setCurrentPlayer({
                DisplayName: playerName + "",
                Position: -1,
                StatValue: coinCollectingDailyStat!
                  ? coinCollectingDailyStat.Value
                  : -1,
                })
            }));
            leaderBoardConfig.weekly()?.forEach((p=>{
              p.setCurrentPlayer({
                DisplayName: playerName + "",
                Position: -1,
                StatValue: coinCollectingWeeklyStat!
                  ? coinCollectingWeeklyStat.Value
                  : -1,
              })
            }));
            leaderBoardConfig.epoch()?.forEach((p=>{
              p.setCurrentPlayer({
                DisplayName: playerName + "",
                Position: -1,
                StatValue:coinCollectingEpochStat!
                  ? coinCollectingEpochStat.Value
                  : -1,
              })
            }));
          }
          //}
          break;
        }
    }
  }
);

GAME_STATE.addChangeListener((key: string, newVal: any, oldVal: any) => {
  logChangeListenerEntry("listener.leaderboard ", key, newVal, oldVal);

  switch (key) {
    //common ones on top
    case "countDownTimerValue":
    case "gameCoinGCValue":
    case "gameCoinMCValue":
    case "gameCoinGuestValue":
    case "gameCoinsCollectedValue":
    case "gameCoinsTotalValue":
    case "screenBlockLoading":
    case "gameRoomData":
    case "gameErrorMsg":
      break;
    case "inVox8Park":
      if (
        GAME_STATE.playerState.loginSuccess &&
        GAME_STATE.leaderboardState.dailyLeaderboardRecord["VB_"] === undefined
      ) {
        //detect if end game update involved VB coin and if so update that stat?
        fetchLeaderboardInfo("VB_"); //takes longer to update ?!?!
      }
      break;
  }
});

/*
//const curentPlayer = {DisplayName:"You",Position:-1,StatValue:-1}
  //LEADERBOARD_REGISTRY.daily.setCurrentPlayer(curentPlayer)
  //LEADERBOARD_REGISTRY.weekly.setCurrentPlayer(curentPlayer)
  const leaderBoardArr = [
    ...LEADERBOARD_REGISTRY.daily,
    ...LEADERBOARD_REGISTRY.weekly,
    ...LEADERBOARD_REGISTRY.hourly,
    ...LEADERBOARD_REGISTRY.epoch,
    //LEADERBOARD_REGISTRY.dailyVoxSkate,
    //LEADERBOARD_REGISTRY.weeklyVoxSkate,
    //LEADERBOARD_REGISTRY.hourlyVoxSkate,
  ]; 
  for (const p in leaderBoardArr) {
    const board = leaderBoardArr[p];

    board.setPlayerEntries(playerArr);
    board.updateUI();
  }
  */