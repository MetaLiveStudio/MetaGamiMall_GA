import * as ui from "@dcl/ui-scene-utils";
import * as utils from "@dcl/ecs-scene-utils";

import { GameConnectedStateType, GAME_STATE, initGameState } from "src/state";
import { CustomPrompt } from "src/dcl-scene-ui-workaround/CustomPrompt";
import { RESOURCES } from "./resources";
import { CONFIG, initConfig } from "src/config";
import { decodeConnectionCode, isErrorCode } from "./connection-utils";
import resources, { setSection } from "src/dcl-scene-ui-workaround/resources";
import { logChangeListenerEntry } from "src/logging";
import { isNull } from "src/utils";
import { openRaffleGamePrompt } from "./ui-play-raffle";
import { REGISTRY } from "src/registry";
import { CustomOkPrompt } from "src/ui/modals";
import { refreshUserData } from "./login-flow";

export function initUIGameHud() {
  const textFont = new Font(Fonts.SansSerif);

  const canvas = ui.canvas;

  const PLAYER_IMGSHOT_Y = 0;

  const backdrop_scale = 0; //16 is a little bigger bit fits tight
  const image_scale = 0; //16 is a little bigger bit fits tight

  const DEFAULT_LOAD_ICON_DURATION = 3;

  const loadingGamePrompt20 = new CustomOkPrompt(
    "Loading",
    "Loading...",
    "XX",
    () => {}
  );
  loadingGamePrompt20.onShowcallback = () => {
    loadingGamePrompt20.button.image.visible = false;
    loadingGamePrompt20.button.label.visible = false;
    loadingGamePrompt20.prompt.closeIcon.visible = false;
  };

  loadingGamePrompt20.text.text.value = "Hint: Find the coins";
  loadingGamePrompt20.text.text.positionY = -35
  loadingGamePrompt20.text.text.height = 50
  loadingGamePrompt20.text.text.vTextAlign = "center"
  loadingGamePrompt20.text.text.fontSize = 17

  //export const loadingIcon = new ui.LoadingIcon(DEFAULT_LOAD_ICON_DURATION)
  //loadingIcon.hide()

  function showLoadingUI(val: boolean, duration?: number) {
    log("showLoadingUI START ", val, duration,"CONFIG.GAME_LOADING_SCREEN_ENABLED",CONFIG.GAME_UI_LOADING_SCREEN_ENABLED);

    if(!CONFIG.GAME_UI_LOADING_SCREEN_ENABLED){
      log("showLoadingUI disabled CONFIG.GAME_LOADING_SCREEN_ENABLED", val, duration,"CONFIG.GAME_LOADING_SCREEN_ENABLED",CONFIG.GAME_UI_LOADING_SCREEN_ENABLED);
      return
    }
    //log("showLoadingUI  " + loadingIcon.image.visible)

    if (val) {
      //loadingPrompt.show();
      loadingGamePrompt20.show();
      //loadingGamePrompt20.button.icon.visible = false
    } else {
      //loadingPrompt.hide();
      loadingGamePrompt20.hide();
    }

    //new ui.LoadingIcon(DEFAULT_LOAD_ICON_DURATION,50,50)

    if (val && duration && duration !== undefined) {
      utils.setTimeout(duration ? duration : DEFAULT_LOAD_ICON_DURATION, () => {
        log("showLoadingUI hide timer fired");
        //loadingPrompt.hide();
        loadingGamePrompt20.hide();
      });
    }
  }
  REGISTRY.ui.showLoadingUI = showLoadingUI;

  //const errorPrompt = new CustomPrompt(ui.PromptStyles.DARKLARGE, 400, 400);
  const errorPrompt20 = new CustomOkPrompt(
    "Error Has Occurred",
    "Some Error...",
    "OK",
    () => {}
  );

  REGISTRY.ui.errorPrompt = errorPrompt20;

  /*errorPrompt.hide();

  errorPrompt.addText("Error Has Occurred", 0, 30, Color4.White(), 20);

  const errorCode = errorPrompt.addText("-1", 0, 0, Color4.White(), 20);
  const errorText = errorPrompt.addText(
    "Error Desc",
    0,
    -30,
    Color4.White(),
    15
  );*/

  //export const loadingIcon = new ui.LoadingIcon(DEFAULT_LOAD_ICON_DURATION)
  //loadingIcon.hide()

  function showErrorUI(
    val: boolean,
    code?: number,
    msg?: string,
    duration?: number
  ) {
    log("showErrorUI ENTRY ", val, code, msg, duration);

    if (val) {
      if (code !== undefined) {
        //errorCode.text.value = code + "";
      } else {
        //errorCode.text.value = "-1";
      }
      if (msg !== undefined) {
        errorPrompt20.text.text.value = msg;
      } else {
        errorPrompt20.text.text.value = "ERROR CODE:"+code+"";
      }
      //errorPrompt.show();
      errorPrompt20.show();
    } else {
      //errorPrompt.hide();
      errorPrompt20.hide();
    }

    //

    if (val && duration && duration !== undefined) {
      utils.setTimeout(duration ? duration : DEFAULT_LOAD_ICON_DURATION, () => {
        log("showLoadingUI hide timer fired");
        //errorPrompt.hide();
        errorPrompt20.hide();
      });
    }
  }
  REGISTRY.ui.showErrorUI = showErrorUI;


  // create UI countdown
  const timeCounterPosX = -18; //-200
  const coinGCCounterPosX = -270; // + 20
  const coinMCCounterPosX = coinGCCounterPosX + 120;
  const coinCoinsCollectedCounterPosX = -420 + 20;
  const PADDY_TOP = -65; //0//-50
  const counterPosY_R1 = 90 + PADDY_TOP;
  const counterPosY_R2 = 65 + PADDY_TOP;
  const fontSize = 20;

  const GAME_HUD_ELEMENTS: UIShape[] = [];
  const LOBBY_HUD_ELEMENTS: UIShape[] = [];
  const SUB_LOBBY_HUD_ELEMENTS: UIShape[] = [];

  //TODO move this someone else
  function strLPad(text: string, pad: string, amount: number, rtrail: string) {
    let str = text;

    for (let x = str.length + rtrail.length; x < amount; x++) {
      str = pad + str;
    }

    str += rtrail;

    return str;
  }

  let lastTime = -1;
  // create entity
  const clockEntity = new Entity("226");
  // give entity a shape and transform
  clockEntity.addComponent(new Transform());
  engine.addEntity(clockEntity);

  // add a repeated function
  clockEntity.addComponent(
    //no need to fire every second as it updates on the minute
    new utils.Interval(2000, () => {
      const clockdate = new Date();
      const clockMins = clockdate.getUTCMinutes();
      if (lastTime >= clockMins) {
        return;
      }
      lastTime = clockMins;
      //TODO add time check to reduce string creation
      //const str = clockdate.toUTCString()

      const clockTimeValue =
        "UTC " +
        strLPad(String(clockdate.getUTCHours()), "0", 2, "") +
        ":" +
        strLPad(String(clockdate.getUTCMinutes()), "0", 2, "");

      //worldClock.value = clockTimeValue
      REGISTRY.ui.staminaPanel.updateTime(clockTimeValue);
    })
  );

  function showGameHud(val: boolean) {
    //if(!val){//only let old ui elements be hidden. need to fully remove next
    for (const p in GAME_HUD_ELEMENTS) {
      GAME_HUD_ELEMENTS[p].visible = val;
    }
    //}

    //subgameBG.visible = val && GAME_STATE.inVox8Park;
    //gameBG.visible = val && !GAME_STATE.inVox8Park;
    //coinGCCounter.uiText.visible = val && !GAME_STATE.inVox8Park;

    if (val) {
      REGISTRY.ui.racePanel.show();
      REGISTRY.ui.gameTools.updateHudContext("game-hud");
    } else {
      REGISTRY.ui.racePanel.hide();
    }
  }
  function showSubLobbyHud(val: boolean) {
    for (const p in SUB_LOBBY_HUD_ELEMENTS) {
      SUB_LOBBY_HUD_ELEMENTS[p].visible = val;
    }
    if (val) REGISTRY.ui.gameTools.updateHudContext("sub-lobby");
  }

  function showLobbyHud(val: boolean) {
    //if(!val){//only let old ui elements be hidden. need to fully remove next
    for (const p in LOBBY_HUD_ELEMENTS) {
      LOBBY_HUD_ELEMENTS[p].visible = val;
    }
    //}

    const loggedIn = !isNull(GAME_STATE.playerState.playFabLoginResult);
    //loginGameBtn.visible = !loggedIn;
    if (loggedIn) {
      REGISTRY.ui.loginPanel.hide();
      REGISTRY.ui.staminaPanel.show();
    } else {
      REGISTRY.ui.loginPanel.show();
      REGISTRY.ui.staminaPanel.hide();
    }

    if (val) REGISTRY.ui.gameTools.updateHudContext("lobby");

    //if (startGameBtn.visible && !loggedIn) startGameBtn.visible = false;
    //if (startRaffleBtn.visible && !loggedIn) startRaffleBtn.visible = false;
    //if (startSubGameBtn.visible && !loggedIn) startSubGameBtn.visible = false; //loggedIn && GAME_STATE.inVox8Park
  }
  showGameHud(false);
  showLobbyHud(true);
  showSubLobbyHud(false);

  GAME_STATE.addChangeListener((key: string, newVal: any, oldVal: any) => {
    logChangeListenerEntry("listener.game-hud ", key, newVal, oldVal);

    const stats = GAME_STATE.playerState.playFabUserInfoHelper.stats
    const vc = GAME_STATE.playerState.playFabUserInfoHelper.virtualCurrency
    //const vc = GAME_STATE.playerState.playFabUserInfoHelper.virtualCurrencyGameCache

    if(key == "gameCoinGCValue" || key == "gameCoinMCValue" ){
      REGISTRY.ui.staminaPanel.updateAllTimeCoins(stats.allTimeCoins + (GAME_STATE.gameCoinGCValue + GAME_STATE.gameCoinMCValue))
    }
    
    switch (key) {
      //common ones on top
      case "countDownTimerValue":
        //countdown.set(newVal);
        REGISTRY.ui.racePanel.updateTime(newVal);
        break;
      case "gameCoinGCValue":
        //coinGCCounter.set(newVal);
        REGISTRY.ui.racePanel.updateCoins(newVal);
        REGISTRY.ui.staminaPanel.updateCoins(vc.gc + GAME_STATE.gameCoinGCValue + GAME_STATE.gameCoinRewardGCValue)//+ (newVal-oldVal))
        break;
      case "gameCoinMCValue":
        //coinMCCounter.set(newVal);
        REGISTRY.ui.racePanel.updateDollars(newVal);
        REGISTRY.ui.staminaPanel.updateDollars(vc.mc + GAME_STATE.gameCoinMCValue + GAME_STATE.gameCoinRewardMCValue)//+ (newVal-oldVal))
        break;
      case "coinsCollectedEpochValue":
        //coinMCCounter.set(newVal);
        REGISTRY.ui.staminaPanel.updateAllTimeCoins(newVal)
        break;
      case "gameMaterial1Value":
        //coinMCCounter.set(newVal);
        REGISTRY.ui.racePanel.updateMaterial1(newVal);
        break;
      case "gameMaterial2Value":
        //coinMCCounter.set(newVal);
        REGISTRY.ui.racePanel.updateMaterial2(newVal);
        break;
      case "gameMaterial3Value":
        //coinMCCounter.set(newVal);
        REGISTRY.ui.racePanel.updateMaterial3(newVal);
        break;
      case "gameCoinGuestValue":
        //coinMCCounter.set(newVal); // reusing for now subCoinGCCounter
        REGISTRY.ui.racePanel.updateSubGameDollars(newVal);
        break;
      case "gameCoinsCollectedValue":
        //if (CONFIG.IN_PREVIEW && CONFIG.SHOW_GAME_DEBUG_INFO)
        //coinCollectedCounter.set(newVal);
        break;
      case "gameCoinsTotalValue":
        //if (CONFIG.IN_PREVIEW && CONFIG.SHOW_GAME_DEBUG_INFO)
        //coinTotalText.value = "/ " + newVal;
        break;
      case "screenBlockLoading":
        showLoadingUI(newVal);
        break;
      case "gameRoomData":
        if (CONFIG) {
          let txt = "Hint: " + GAME_STATE.gameRoomData?.loadingHint;
          loadingGamePrompt20.text.text.value = txt;
        }
        break;
      case "gameErrorMsg":
        break;
      case "gameConnected":
        const gameConnVal: GameConnectedStateType = newVal;
        switch (gameConnVal) {
          case "disconnected":
            refreshUserData('gameConnected.disconnected')
            break;
          case "error":
            log("showErrorUI called by gameConnectedCode.error")
            showErrorUI(
              true,
              GAME_STATE.gameConnectedCode,
              GAME_STATE.gameErrorMsg
            );
            break;
          default:
            log("showErrorUI called by gameConnectedCode.default")
            showErrorUI(false);
            break;
        }

        break;
      case "inVox8Park":
        const loggedIn = !isNull(GAME_STATE.playerState.playFabLoginResult);
        showSubLobbyHud(newVal && !GAME_STATE.gameHudActive && loggedIn);
        break;
      case "gameConnectedCode":
        const code: number = newVal;
        if (isErrorCode(code)) {
          log("showErrorUI called by gameConnectedCode")
          showErrorUI(true, code, decodeConnectionCode(code));
          break;
        }
      case "gameHudActive":
        showGameHud(newVal);
        showLobbyHud(!newVal);
        showSubLobbyHud(!newVal && GAME_STATE.inVox8Park);
        break;
    }
  });

  GAME_STATE.playerState.addChangeListener(
    (key: string, newVal: any, oldVal: any) => {
      log("listener.playerState.ui-bars.ts ", key, " ", newVal, " ", oldVal);

      switch (key) {
        case "loginSuccess":
          showLobbyHud(newVal);
          showSubLobbyHud(newVal && GAME_STATE.inVox8Park);
          break;
        //common ones on top
        case "playFabUserInfo":
          //avatarSwapScript.setAvatarSwapTriggerEnabled(avatarSwap,newVal)
          //GAME_STATE.
          const vc = GAME_STATE.playerState.playFabUserInfoHelper.virtualCurrency
          const stats = GAME_STATE.playerState.playFabUserInfoHelper.stats
          //consider letting gamestate set it, for now keep game logic seperate from basic
          //player state info??? but let game logic update other direction???
          GAME_STATE.setGameCoinsCollectedEpochValue(stats.allTimeCoins)
          REGISTRY.ui.staminaPanel.updateAllTimeCoins(stats.allTimeCoins)
          REGISTRY.ui.staminaPanel.updateCoins(vc.gc);
          REGISTRY.ui.staminaPanel.updateDollars(vc.mc);
          REGISTRY.ui.staminaPanel.updateMaterial1(vc.m1);
          REGISTRY.ui.staminaPanel.updateMaterial2(vc.m2);
          REGISTRY.ui.staminaPanel.updateMaterial3(vc.m3);

          break;
      }
    }
  );

  /*
export const gameStatsTopBar = new CustomPrompt(ui.PromptStyles.DARKLARGE,400,400)

//gameStatsTopBar.background.vAlign = 'top'

gameStatsTopBar.addText("Coins",0,0)*/
}
