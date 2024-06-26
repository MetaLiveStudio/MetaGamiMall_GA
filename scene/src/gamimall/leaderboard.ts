import { CONFIG } from "../config";
import { logChangeListenerEntry } from "../logging";
import { GAME_STATE, PlayerState, initGameState } from "../state";
import { isNull } from "../utils";
import { fetchLeaderboardInfo } from "./login-flow";
import { getUserDisplayName } from "./player-utils";
//import { createMaterial, GLOBAL_CANVAS } from "./resources";
//import { LeaderBoardPrompt } from "../ui/modals";
import { REGISTRY } from "../registry";
import { getLevelFromXp } from "../modules/leveling/levelingUtils";
import { ILeaderboardItem, PlayerLeaderboardEntryType, createLeaderBoardPanelText, getLeaderboardRegistry, leaderBoardsConfigs, leaderBoardsConfigsType } from "./leaderboard-utils";
import { log } from "../back-ports/backPorts";
import { LeaderBoardPrompt } from "../ui/leaderBoardModal";
import { Entity, Font, GltfContainer, InputAction, MeshCollider, MeshRenderer, PBGltfContainer, TextAlignMode, TextShape, Transform, TransformTypeWithOptionals, engine, pointerEventsSystem } from "@dcl/sdk/ecs";
import { Color3, Color4, Plane, Quaternion, Vector3 } from "@dcl/sdk/math";
import { GetLeaderboardResult } from "./playfab_sdk/playfab.types";
import * as PlayFabSDK from "./playfab_sdk/index";

//TODO MAKE AN INIT LEADERBOARD OBJS
//initGameState()

//export const uiCanvas = GLOBAL_CANVAS;
//let textHeaderShape: TextShape | undefined;

const CLASSNAME = "leaderboard.ts"

//TODO ADD BACK

export class LeaderboardItem implements ILeaderboardItem {
  entity: Entity;
  textHeaderShape?: Entity;
  textEntity?: Entity;
  loading:boolean
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
  setLoading(_loading:boolean){
    this.loading = true
  }

  updateUI() {
    const leaderBoardPlaceHolderText = createLeaderBoardPanelText(this,this.startIndex,this.pageSize,this.formatterCallback)
    if(this.textEntity){
      const text = TextShape.getMutableOrNull(this.textEntity)
      if (text) {
        text.text = leaderBoardPlaceHolderText;
      }
    }
  }
  setFormatterCallback(callback: (text: string|number) => string): void {
    this.formatterCallback = callback
  }
  setScreenType(type:number){
    
  }
  applyUIScaling() {
    //nothing to do for 3d
  }
}


export function makeLeaderboard(
  host: Entity,
  model: PBGltfContainer | undefined | null | string,
  title: string | undefined | null,
  title2: string | undefined | null,
  text: string,
  fontSize: number,
  modelTransform?: TransformTypeWithOptionals,
  textHeaderTransform?: TransformTypeWithOptionals,
  textHeaderTransform2?: TransformTypeWithOptionals,
  textTransform?: TransformTypeWithOptionals,
  fontColor?: Color4,
  onClick?:{
    fn:()=>void
    hoverText:string
    maxDistance?:number
  }
): LeaderboardItem {
  const sign = engine.addEntity()//new Entity(host.name + "-sign");
  //sign.setParent(host);

  if(modelTransform){
    modelTransform.parent = host
  }
  Transform.createOrReplace(sign,
    modelTransform !== undefined ? modelTransform : {parent:host}
    )
  //sign.addComponent(
  //  modelTransform !== undefined ? modelTransform : new Transform({})
  //);

  if (model) {
    //ADD POINTERDOWN
    const modelEnt = engine.addEntity()

    if(onClick){
      pointerEventsSystem.onPointerDown(
        {
          entity:modelEnt,
          opts: {hoverText: onClick.hoverText, maxDistance: onClick.maxDistance ? onClick.maxDistance : 6, button: InputAction.IA_POINTER }
        },
        (e) => {
          onClick.fn()
        }
      )
    }
    
    Transform.createOrReplace(modelEnt,{
      //position: Vector3.create(.5, 1, -.15),
      position: Vector3.create(.5, 1, -1.15),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0),
      scale: Vector3.create(1.35, 2.5, 1.5),
      parent: host
    })
    //sign.addComponent(model);
    if(typeof model === "string"){
      //MeshRenderer.setPlane(modelEnt)
      MeshCollider.setPlane(modelEnt)
    }else{ 
      GltfContainer.createOrReplace(modelEnt,model)
    }

    //TODO BRING BACK!!!
    /*let signBackground = new Entity(host.name + "-sign-background");
    signBackground.setParent(host);
    signBackground.addComponent(new PlaneShape());
    signBackground.addComponent(
      new Transform({
        position: Vector3.create(0, 0.8, 0.02),
        //rotation: Quaternion.Euler(0, 180, 0),
        scale: Vector3.create(1, 1.3, 1),
      })
    );
    let material = createMaterial(Color3.Blue(), false);
    signBackground.addComponent(material);*/
  }

  /*
  //TODO BRING BACK!!!
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
            position: Vector3.create(0, -0.5, 0.04),
            rotation: Quaternion.Euler(0, 180, 0),
            scale: Vector3.create(0.05, 0.05, 0.05),
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
            position: Vector3.create(0, -0.5, 0.04),
            rotation: Quaternion.Euler(0, 180, 0),
            scale: Vector3.create(0.05, 0.05, 0.05),
          })
    );
  }
  */

  let signText = engine.addEntity()//new Entity(host.name + "-sign-text");
  //signText.setParent(host);

  //const key = text + "_" + fontSize;

  //TODO ADD TEXT SHAPE BACK!
  /*let textShape = //TEXTSHAPECACHE[key]
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
  */
  TextShape.create(signText, {
    text: text,
    textColor: fontColor ? fontColor : Color4.fromHexString("#8cfdff"),
    fontSize: fontSize,
    font: Font.F_SANS_SERIF,
    outlineWidth: .1,
    outlineColor: Color4.fromHexString("#000000"),
    width: 20,
    height: 10,
    textAlign: TextAlignMode.TAM_TOP_LEFT//TextAlignMode.TAM_TOP_CENTER
  })

  //log("signText " + signText.name + " "  + signText.hasComponent(TextShape) )

  if(textTransform){
    textTransform.parent = host
  }
  Transform.createOrReplace(signText,
    textTransform !== undefined
      ? textTransform
      : {
          position: Vector3.create(0, 0.55, 0.04),
          rotation: Quaternion.fromEulerDegrees(0, 180, 0),
          scale: Vector3.create(0.05, 0.05, 0.05),
          parent: host
        }
    )
  /*
  signText.addComponent(
    textTransform !== undefined
      ? textTransform
      : new Transform({
          position: Vector3.create(0, 0.55, 0.04),
          rotation: Quaternion.Euler(0, 180, 0),
          scale: Vector3.create(0.05, 0.05, 0.05),
        })
  );
  */

  const item = new LeaderboardItem();
  item.entity = host;
  //TODO will text shape handle internally
  item.textEntity = signText;
  //item.textHeaderShape = textHeaderShape;

  return item;
}

export function updateLeaderboard(playerNames: string[]) {
  
}

export function createLeaderBoardUI(){
  const METHOD_NAME = "createLeaderBoardUI()"
  log(CLASSNAME,METHOD_NAME,"ENTRY");
  if(CONFIG.SCENE_TYPE !== "gamimall"){
    log(CLASSNAME,METHOD_NAME,"DISABLED FOR SCENE TYPE",CONFIG.SCENE_TYPE)
    return
  }
  //TODO ADD BACK
  
  let playerArr: PlayerLeaderboardEntryType[] = [];
    let leaderBoardPlaceHolderText = "\nSign in to see leaderboard";
    playerArr.push({
      DisplayName: "Sign in to see leaderboard",
      Position: 0,
      StatValue: 0,
    });

  const LEADERBOARD_PROMPT_HEIGHT = 620 + 20;
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
  
  const dailyLeaderboard = new LeaderBoardPrompt(
    "Daily Leaderboard",
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


  const monthlyLeaderboard = new LeaderBoardPrompt(
    "Monthly Leaderboard",
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


  const pointsMonthlyLeaderboard = new LeaderBoardPrompt(
    "Monthly Points Leaderboard",
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

  const coinBagRaffleLeaderboard = new LeaderBoardPrompt(
    "Coin Bag Raffle Entries",
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


  //levelLeaderboard.show()


  //TODO on open do deeper fetch. Or just fetch 100 up front now instead of 16??
  //when hit max path and has full patch, fetch more?

  REGISTRY.ui.openLeaderboardHourly = ()=> { hourlyLeaderBoard.show() }
  REGISTRY.ui.openLeaderboardDaily = ()=> { dailyLeaderboard.show() }
  REGISTRY.ui.openLeaderboardWeekly = ()=> { weeklyLeaderboard.show() }
  REGISTRY.ui.openLeaderboardMonthly = ()=> { 
    //TODO on open refresh?  trick is must save and refresh
    //or what is is in players stat menu wont match server for rankings
    monthlyLeaderboard.show() 
  }
  REGISTRY.ui.openLeaderboardPointsMonthly = ()=> { 
    //TODO on open refresh?  trick is must save and refresh
    //or what is is in players stat menu wont match server for rankings
    pointsMonthlyLeaderboard.show() 
  }
  
  REGISTRY.ui.openLeaderboardLevelEpoch = ()=> { levelLeaderboard.show() }
  REGISTRY.ui.openRaffleCoinBagEntries = ()=> { coinBagRaffleLeaderboard.show() }

  const LEADERBOARD_REG = getLeaderboardRegistry()
  LEADERBOARD_REG.hourly.push(hourlyLeaderBoard)
  LEADERBOARD_REG.weekly.push(weeklyLeaderboard)
  //LEADERBOARD_REG.monthly.push(monthlyLeaderboard)
  LEADERBOARD_REG.daily.push(dailyLeaderboard)
  LEADERBOARD_REG.epoch.push(levelLeaderboard)
  LEADERBOARD_REG.raffleCoinBag.push(coinBagRaffleLeaderboard)
  LEADERBOARD_REG.pointsMonthly.push(pointsMonthlyLeaderboard)


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
      let leaderArr: PlayFabClientModels.PlayerLeaderboardEntry[] = [];

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
          leaderBoardConfig.monthly() &&
          key == leaderBoardConfig.prefix + "monthlyLeaderboard"
        ) {
          leaderBoardItem = leaderBoardConfig.monthly();
          leaderArr = newVal.Leaderboard;
          maxResults = CONFIG.GAME_LEADERBOARDS.COINS.MONTHLY.defaultPageSize
          break;
        } else if (
          leaderBoardConfig.epoch() &&
          key == leaderBoardConfig.prefix + "levelEpochLeaderboard"
        ) {
          leaderBoardItem = leaderBoardConfig.epoch();
          leaderArr = newVal.Leaderboard;
          maxResults = CONFIG.GAME_LEADEBOARD_LVL_MAX_RESULTS
          break;
        } else if (
          leaderBoardConfig.raffleCoinBag() &&
          key == leaderBoardConfig.prefix + "raffle_coin_bag"
        ) {
          leaderBoardItem = leaderBoardConfig.raffleCoinBag();
          leaderArr = newVal.Leaderboard;
          maxResults = CONFIG.GAME_LEADEBOARD_RAFFLE_MAX_RESULTS
          break;
        } else if (
          leaderBoardConfig.pointsMonthly() &&
          key == leaderBoardConfig.prefix + "pointsMonthlyLeaderboard"
        ) {
          leaderBoardItem = leaderBoardConfig.pointsMonthly();
          leaderArr = newVal.Leaderboard;
          maxResults = CONFIG.GAME_LEADERBOARDS.POINTS.MONTHLY.defaultPageSize
          break;
        } else if (
          leaderBoardConfig.pointsEpoch() &&
          key == leaderBoardConfig.prefix + "pointsEpochLeaderboard"
        ) {
          leaderBoardItem = leaderBoardConfig.pointsEpoch();
          leaderArr = newVal.Leaderboard;
          maxResults = CONFIG.GAME_LEADERBOARDS.POINTS.EPOCH.defaultPageSize
          break;
        }
      }

      updateLeaderBoard(key,leaderBoardItem,leaderArr,maxResults)
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

            let raffleCoinBagStat: PlayFabClientModels.StatisticValue;
            let coinCollectingEpochStat: PlayFabClientModels.StatisticValue;
            let coinCollectingDailyStat: PlayFabClientModels.StatisticValue;
            let coinCollectingWeeklyStat: PlayFabClientModels.StatisticValue;
            let coinCollectingMonthyStat: PlayFabClientModels.StatisticValue;
            let coinCollectingHourlyStat: PlayFabClientModels.StatisticValue;
            let pointsEarnedMonthtlyStat: PlayFabClientModels.StatisticValue;
            let pointsEarnedEpochStat: PlayFabClientModels.StatisticValue;
            
            
            let playerFabUserInfo:
              | PlayFabClientModels.GetPlayerCombinedInfoResultPayload
              | null
              | undefined = GAME_STATE.playerState.playFabUserInfo;
            if (playerFabUserInfo) {
              let playerStatics = playerFabUserInfo.PlayerStatistics;
              if (playerStatics) {
                for (const p in playerStatics) {
                  const stat: PlayFabClientModels.StatisticValue = playerStatics[p];
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
                  } else if (
                    stat.StatisticName ==
                    leaderBoardConfig.prefix + "raffle_coin_bag"
                  ) {
                    raffleCoinBagStat = stat;
                  } else if (
                    stat.StatisticName ==
                    leaderBoardConfig.prefix + CONFIG.GAME_LEADERBOARDS.COINS.MONTHLY.name
                  ) {
                    coinCollectingMonthyStat = stat;
                  } else if (
                    stat.StatisticName ==
                    leaderBoardConfig.prefix + CONFIG.GAME_LEADERBOARDS.POINTS.MONTHLY.name
                  ) {
                    pointsEarnedMonthtlyStat = stat;
                  } else if (
                    stat.StatisticName ==
                    leaderBoardConfig.prefix + CONFIG.GAME_LEADERBOARDS.POINTS.EPOCH.name
                  ) {
                    pointsEarnedEpochStat = stat;
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
              leaderBoardConfig.raffleCoinBag()?.forEach((p=>{
                p.setCurrentPlayer({
                  DisplayName: playerName + "",
                  Position: -1,
                  StatValue:raffleCoinBagStat!
                    ? raffleCoinBagStat.Value
                    : -1,
                })
              }));

              leaderBoardConfig.monthly()?.forEach((p=>{
                p.setCurrentPlayer({
                  DisplayName: playerName + "",
                  Position: -1,
                  StatValue:coinCollectingMonthyStat! ? coinCollectingMonthyStat.Value : -1,
                })
              }));

              leaderBoardConfig.pointsMonthly()?.forEach((p=>{
                p.setCurrentPlayer({
                  DisplayName: playerName + "",
                  Position: -1,
                  StatValue:pointsEarnedMonthtlyStat! ? pointsEarnedMonthtlyStat.Value : -1,
                })
              }));

              leaderBoardConfig.pointsEpoch()?.forEach((p=>{
                p.setCurrentPlayer({
                  DisplayName: playerName + "",
                  Position: -1,
                  StatValue:pointsEarnedEpochStat! ? pointsEarnedEpochStat.Value : -1,
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
}//end createLeaderBoardUI()

export function setLeaderboardLoading(leaderBoardItem: ILeaderboardItem[] | undefined,loading:boolean){
  //UPDATE set loading
  if(leaderBoardItem){
    for(const p of leaderBoardItem){
      if (p !== undefined) {
        log("addChangeListener to update loading ",loading);
        p.setLoading(loading)
        p.updateUI()
      }
    }
  }
}
export function updateLeaderBoard(key:string,leaderBoardItem: ILeaderboardItem[] | undefined,leaderArr: PlayFabClientModels.PlayerLeaderboardEntry[],maxResults:number){
  //if(key === "raffle_coin_bag") debugger

  let playerArr: PlayerLeaderboardEntryType[] = [];

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
  if(leaderBoardItem){
    for(const p of leaderBoardItem){
      if (p !== undefined) {
        log("addChangeListener to update for " + key);
        //UPDATE not loading
        p.setPlayerEntries(playerArr);
        p.setLoading(false)
        p.updateUI();
      } else {
        log("addChangeListener failed to update for " + key);
      }
    }
  }
}


/*
//const curentPlayer = {DisplayName:"You",Position:-1,StatValue:-1}
  //LEADERBOARD_REG.daily.setCurrentPlayer(curentPlayer)
  //LEADERBOARD_REG.weekly.setCurrentPlayer(curentPlayer)
  const leaderBoardArr = [
    ...LEADERBOARD_REG.daily,
    ...LEADERBOARD_REG.weekly,
    ...LEADERBOARD_REG.hourly,
    ...LEADERBOARD_REG.epoch,
    //LEADERBOARD_REG.dailyVoxSkate,
    //LEADERBOARD_REG.weeklyVoxSkate,
    //LEADERBOARD_REG.hourlyVoxSkate,
  ]; 
  for (const p in leaderBoardArr) {
    const board = leaderBoardArr[p];

    board.setPlayerEntries(playerArr);
    board.updateUI();
  }
  */