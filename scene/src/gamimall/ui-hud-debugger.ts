import * as ui from "@dcl/ui-scene-utils";
import * as utils from "@dcl/ecs-scene-utils";
import { CONFIG } from "src/config";
import {
  CustomPrompt,
  CustomPromptButton,
} from "src/dcl-scene-ui-workaround/CustomPrompt";
import { avatarSwapScript2InstExport as avatarSwapScript2Inst, gameSceneManager } from "src/game";
import { GAME_STATE } from "src/state";
import { avatarSwapCTAPrompt } from "src/ui-bars";
import {
  colyseusReConnect,
  endGame,
  pullBlocksFixed,
  reshuffleBlocks,
  startGame,
} from "./gameplay";
import {
  doLoginFlow,
  fetchLeaderboardInfo,
  logout,
  refreshUserData,
  resetLoginState,
} from "./login-flow";
//import { loadingPrompt, showLoadingUI } from './ui-game-hud'
import { getAndSetUserData, getAndSetUserDataIfNull, getUserDataFromLocal } from "src/userData";
import { REGISTRY } from "src/registry";
import { SceneNames } from "src/modules/sceneMgmt/scenes/sceneNames";

const textFont = new Font(Fonts.SansSerif);

const canvas = ui.canvas;

export async function createDebugUIButtons() {
  if (!CONFIG.TEST_CONTROLS_ENABLE) {
    return;
  }
  log("debug buttons");

  let userData = await getAndSetUserDataIfNull();
  let wallet = userData !== undefined ? userData.publicKey : undefined
  if (wallet) wallet = wallet.toLowerCase();
  let allowed = false;
  for (const p in CONFIG.ADMINS) {
    if (CONFIG.ADMINS[p] == "any") {
      allowed = true;
      break;
    }
    if (wallet == CONFIG.ADMINS[p]?.toLowerCase()) {
      allowed = true;
      break;
    }
  }

  log("debug.allowed ", allowed, wallet);
  if (!allowed) return;

  const buttonPosSTART = -350;
  let buttonPosCounter = buttonPosSTART;
  let buttonPosY = -60//-40; //350
  const buttomWidth = 140;
  const changeButtomWidth = 130;
  const changeButtomHeight = 20;

  let testButton: CustomPromptButton;

  const testControlsToggle = new CustomPrompt(ui.PromptStyles.DARKLARGE, 1, 1);

  testControlsToggle.background.positionY = 350;
  //testControls.background.visible = false
  testControlsToggle.closeIcon.visible = false;
  //testControls.addText('Who should get a gift?', 0, 280, Color4.Red(), 30)
  //const pickBoxText:ui.CustomPromptText = testControls.addText("_It's an important decision_", 0, 260)

  const enableDisableToggle = (testButton = testControlsToggle.addButton(
    "show:false",
    buttonPosCounter,
    buttonPosY,
    () => {
      log("enableDisableToggle " + testControls.background.visible);
      if (testControls.background.visible) {
        testControls.hide();
        testControls.closeIcon.visible = testControls.background.visible;
      } else {
        testControls.show();
        testControls.closeIcon.visible = testControls.background.visible;
      }
      enableDisableToggle.label.value =
        "show:" + !testControls.background.visible;
    },
    ui.ButtonStyles.RED
  ));
  if (changeButtomWidth > 0) testButton.image.width = changeButtomWidth;
  if (changeButtomHeight > 0) testButton.image.height = changeButtomHeight;

  buttonPosCounter += buttomWidth;

  const testControls = new CustomPrompt(ui.PromptStyles.DARKLARGE, 1, 1);

  testControls.background.positionY = 350;
  //testControls.background.visible = false
  testControls.closeIcon.visible = false;
  //testControls.addText('Who should get a gift?', 0, 280, Color4.Red(), 30)
  //const pickBoxText:ui.CustomPromptText = testControls.addText("_It's an important decision_", 0, 260)

  testControls.background.positionY = 350;
  //testControls.background.visible = false
  testControls.closeIcon.visible = false;
  //testControls.addText('Who should get a gift?', 0, 280, Color4.Red(), 30)
  //const pickBoxText:ui.CustomPromptText = testControls.addText("_It's an important decision_", 0, 260)

  testButton = testControls.addButton(
    "ReLoginFlow",
    buttonPosCounter,
    buttonPosY,
    () => {
      resetLoginState();
      GAME_STATE.playerState.requestDoLoginFlow();
    },
    ui.ButtonStyles.RED
  );
  if (changeButtomWidth > 0) testButton.image.width = changeButtomWidth;
  if (changeButtomHeight > 0) testButton.image.height = changeButtomHeight;

  buttonPosCounter += buttomWidth; //next column

  testButton = testControls.addButton(
    "Logout",
    buttonPosCounter,
    buttonPosY,
    () => {
      logout();
    },
    ui.ButtonStyles.RED
  );
  if (changeButtomWidth > 0) testButton.image.width = changeButtomWidth;
  if (changeButtomHeight > 0) testButton.image.height = changeButtomHeight;

  buttonPosCounter += buttomWidth; //next column

  testButton = testControls.addButton(
    "ReLoginPlafab",
    buttonPosCounter,
    buttonPosY,
    () => {
      GAME_STATE.setLoginSuccess(false);
      GAME_STATE.playerState.loginFlowState = "wallet-success";
      doLoginFlow();
    },
    ui.ButtonStyles.RED
  );
  if (changeButtomWidth > 0) testButton.image.width = changeButtomWidth;
  if (changeButtomHeight > 0) testButton.image.height = changeButtomHeight;

  buttonPosCounter += buttomWidth; //next column

  testButton = testControls.addButton(
    "RefreshUsrData",
    buttonPosCounter,
    buttonPosY,
    () => {
      refreshUserData('ui-hud-debugger.ReLoginPlafab');
    },
    ui.ButtonStyles.RED
  );
  if (changeButtomWidth > 0) testButton.image.width = changeButtomWidth;
  if (changeButtomHeight > 0) testButton.image.height = changeButtomHeight;

  buttonPosCounter += buttomWidth; //next column

  //NEW ROW//NEW ROW
  buttonPosY -= changeButtomHeight + 2;
  buttonPosCounter = buttonPosSTART;

  testButton = testControls.addButton(
    "GameStart",
    buttonPosCounter,
    buttonPosY,
    () => {
      //launches game from anywhere
      REGISTRY.ui.openStartGamePrompt();
    },
    ui.ButtonStyles.RED
  );
  if (changeButtomWidth > 0) testButton.image.width = changeButtomWidth;
  if (changeButtomHeight > 0) testButton.image.height = changeButtomHeight;

  buttonPosCounter += buttomWidth; //next column

  testButton = testControls.addButton(
    "GameEnd",
    buttonPosCounter,
    buttonPosY,
    () => {
      REGISTRY.ui.openEndGameConfirmPrompt();
    },
    ui.ButtonStyles.RED
  );
  if (changeButtomWidth > 0) testButton.image.width = changeButtomWidth;
  if (changeButtomHeight > 0) testButton.image.height = changeButtomHeight;

  buttonPosCounter += buttomWidth; //next column

  testButton = testControls.addButton(
    "NoConsent",
    buttonPosCounter,
    buttonPosY,
    () => {
      if (GAME_STATE.gameRoom) GAME_STATE.gameRoom.leave(false);
    },
    ui.ButtonStyles.RED
  );
  if (changeButtomWidth > 0) testButton.image.width = changeButtomWidth;
  if (changeButtomHeight > 0) testButton.image.height = changeButtomHeight;

  buttonPosCounter += buttomWidth; //next column

  testButton = testControls.addButton(
    "ReConnect",
    buttonPosCounter,
    buttonPosY,
    () => {
      colyseusReConnect();
    },
    ui.ButtonStyles.RED
  );
  if (changeButtomWidth > 0) testButton.image.width = changeButtomWidth;
  if (changeButtomHeight > 0) testButton.image.height = changeButtomHeight;

  buttonPosCounter += buttomWidth; //next column

  testButton = testControls.addButton(
    "ReShuffle",
    buttonPosCounter,
    buttonPosY,
    () => {
      reshuffleBlocks();
    },
    ui.ButtonStyles.RED
  );
  if (changeButtomWidth > 0) testButton.image.width = changeButtomWidth;
  if (changeButtomHeight > 0) testButton.image.height = changeButtomHeight;

  buttonPosCounter += buttomWidth; //next column

  //NEW ROW//NEW ROW
  buttonPosY -= changeButtomHeight + 2;
  buttonPosCounter = buttonPosSTART;

  testButton = testControls.addButton(
    "RefreshLeaderBrd",
    buttonPosCounter,
    buttonPosY,
    () => {
      fetchLeaderboardInfo();
    },
    ui.ButtonStyles.RED
  );
  if (changeButtomWidth > 0) testButton.image.width = changeButtomWidth;
  if (changeButtomHeight > 0) testButton.image.height = changeButtomHeight;

  buttonPosCounter += buttomWidth; //next column

  const loadingToggle = (testButton = testControls.addButton(
    "TglLoading",
    buttonPosCounter,
    buttonPosY,
    () => {
      GAME_STATE.setScreenBlockLoading(!GAME_STATE.screenBlockLoading);
      loadingToggle.label.value =
        "ShowLoading:" + !GAME_STATE.screenBlockLoading;
    },
    ui.ButtonStyles.RED
  ));
  if (changeButtomWidth > 0) testButton.image.width = changeButtomWidth;
  if (changeButtomHeight > 0) testButton.image.height = changeButtomHeight;

  buttonPosCounter += buttomWidth; //next column

  testButton = testControls.addButton(
    "ShowAvtrSwapErr",
    buttonPosCounter,
    buttonPosY,
    () => {
      avatarSwapCTAPrompt.show();
    },
    ui.ButtonStyles.RED
  );
  if (changeButtomWidth > 0) testButton.image.width = changeButtomWidth;
  if (changeButtomHeight > 0) testButton.image.height = changeButtomHeight;

  buttonPosCounter += buttomWidth; //next column

  testButton = testControls.addButton(
    "ShoWaltLoginErr",
    buttonPosCounter,
    buttonPosY,
    () => {
      REGISTRY.ui.web3ProviderRequiredPrompt.show(); //FIXME loginErrorPrompt.show() show wallet login error show metamask cancel error
    },
    ui.ButtonStyles.RED
  );
  if (changeButtomWidth > 0) testButton.image.width = changeButtomWidth;
  if (changeButtomHeight > 0) testButton.image.height = changeButtomHeight;

  buttonPosCounter += buttomWidth; //next column

  const gmCntToggle = (testButton = testControls.addButton(
    "TglGmHUD",
    buttonPosCounter,
    buttonPosY,
    () => {
      GAME_STATE.setGameHudActive(!GAME_STATE.gameHudActive);
      gmCntToggle.label.value = "TglGmHUD:" + !GAME_STATE.gameHudActive;
    },
    ui.ButtonStyles.RED
  ));
  if (changeButtomWidth > 0) testButton.image.width = changeButtomWidth;
  if (changeButtomHeight > 0) testButton.image.height = changeButtomHeight;

  buttonPosCounter += buttomWidth; //next column

  //NEW ROW//NEW ROW
  buttonPosY -= changeButtomHeight + 2;
  buttonPosCounter = buttonPosSTART;

  /*
const gmLByToggle = testButton = testControls.addButton(
  'TglLbyHUD',
  buttonPosCounter,
  buttonPosY,
  () => { 
    GAME_STATE.setGameHudActive(!GAME_STATE.gameHudActive)
    gmCntToggle.label.value='TglGmHUD:'+!GAME_STATE.gameHudActive
  },
  ui.ButtonStyles.RED
)
if(changeButtomWidth>0) testButton.image.width = changeButtomWidth
if(changeButtomHeight>0) testButton.image.height = changeButtomHeight

buttonPosCounter += buttomWidth //next column
*/

  testButton = testControls.addButton(
    "TglGmEnd",
    buttonPosCounter,
    buttonPosY,
    () => {
      GAME_STATE.setGameEndResult({
        gcStarted: 100,
        gcCollected: 111,
        gcTotal: 211,
        gcEnded: 11,
        gcCollectedToMC: 2,
        gameTimeTaken: 123,
        mcCollected: 5,
        mcAdjustAmount: -3,
        mcCollectedAdjusted: 2,
        mcTotalEarnedToday: 3,
        walletTotal: 1234,
        guestCoinCollected: 999,
        guestCoinName: "test",
        coinMultiplier: 1.1,
        gcBonusEarned: 9,

        material1Collected: 3,
        material2Collected: 4,
        material3Collected: 5,

        //todo check default values
        raffleResult: {
          cost: 0,
          multiplier: 0,
          amountWon: 0,
          hasEnoughToPlay: false,
        },
      });
      //REGISTRY.ui.openEndGamePrompt();
      REGISTRY.ui.openEndGamePrompt();
    },
    ui.ButtonStyles.RED
  );
  if (changeButtomWidth > 0) testButton.image.width = changeButtomWidth;
  if (changeButtomHeight > 0) testButton.image.height = changeButtomHeight;

  buttonPosCounter += buttomWidth; //next column

  testButton = testControls.addButton(
    "CoinPullF",
    buttonPosCounter,
    buttonPosY,
    () => {
      pullBlocksFixed();
    },
    ui.ButtonStyles.RED
  );
  if (changeButtomWidth > 0) testButton.image.width = changeButtomWidth;
  if (changeButtomHeight > 0) testButton.image.height = changeButtomHeight;

  buttonPosCounter += buttomWidth; //next column

  let lastAvatarVal = false;
  const avatarHiderBtn = (testButton = testControls.addButton(
    "Tgl:AvtrMod:" + !lastAvatarVal,
    buttonPosCounter,
    buttonPosY,
    () => {
      lastAvatarVal = !lastAvatarVal;
      avatarSwapScript2Inst.setHideEntityEnabled(lastAvatarVal);
      avatarHiderBtn.label.value = "Tgl:AvtrMod:" + !lastAvatarVal;
    },
    ui.ButtonStyles.RED
  ));
  if (changeButtomWidth > 0) testButton.image.width = changeButtomWidth;
  if (changeButtomHeight > 0) testButton.image.height = changeButtomHeight;

  buttonPosCounter += buttomWidth; //next column

  const testIncCoinsLevels = (testButton = testControls.addButton(
    "Inc:LvlgCoins",
    buttonPosCounter,
    buttonPosY,
    () => {
      REGISTRY.ui.staminaPanel.updateAllTimeCoins( REGISTRY.ui.staminaPanel.allTimeCoins + 1000)
    },
    ui.ButtonStyles.RED
  ));
  if (changeButtomWidth > 0) testButton.image.width = changeButtomWidth;
  if (changeButtomHeight > 0) testButton.image.height = changeButtomHeight;

  buttonPosCounter += buttomWidth; //next column



  const test = (testButton = testControls.addButton(
    "Tgl:Bars",
    buttonPosCounter,
    buttonPosY,
    () => {
      if(REGISTRY.audio.audioControlBar.isVisible()){

        REGISTRY.audio.audioControlBar.mute()
        REGISTRY.audio.audioControlBar.hide()
      }else{

        REGISTRY.audio.audioControlBar.unmute()
        REGISTRY.audio.audioControlBar.show()
      }
    },
    ui.ButtonStyles.RED
  ));
  if (changeButtomWidth > 0) testButton.image.width = changeButtomWidth;
  if (changeButtomHeight > 0) testButton.image.height = changeButtomHeight;

  buttonPosCounter += buttomWidth; //next column


  (testButton = testControls.addButton(
    "SaveGame",
    buttonPosCounter,
    buttonPosY,
    () => {
      GAME_STATE.gameRoom.send("save-game",{})
    },
    ui.ButtonStyles.RED
  ));
  if (changeButtomWidth > 0) testButton.image.width = changeButtomWidth;
  if (changeButtomHeight > 0) testButton.image.height = changeButtomHeight;

  buttonPosCounter += buttomWidth; //next column


  if (gameSceneManager.activeSceneName === SceneNames.alternativeScene){
  const scnSwpBtn = (testButton = testControls.addButton(
    "Tgl:ScnSwp:" + gameSceneManager.activeScene.sceneName.substr(0, 4),
    buttonPosCounter,
    buttonPosY,
    () => {
      lastAvatarVal = !lastAvatarVal;
      if (
        gameSceneManager.activeScene.sceneName === gameSceneManager.rootScene.sceneName
      ) {
        gameSceneManager.moveTo(gameSceneManager.activeScene.sceneName, REGISTRY.movePlayerTo.ALT_SCENE.position );
        gameSceneManager.moveTo(gameSceneManager.activeScene.sceneName);
        scnSwpBtn.label.value =
          "Tgl:ScnSwp:" + gameSceneManager.rootScene.sceneName.substr(0, 4);
      } else {
        gameSceneManager.moveTo(gameSceneManager.rootScene.sceneName);
        scnSwpBtn.label.value =
          "Tgl:ScnSwp:" +
          gameSceneManager.activeScene.sceneName.substr(0, 4);
      }
    },
    ui.ButtonStyles.RED
  ));
  if (changeButtomWidth > 0) testButton.image.width = changeButtomWidth;
  if (changeButtomHeight > 0) testButton.image.height = changeButtomHeight;

  buttonPosCounter += buttomWidth; //next column
  } 
}//END OF SHOW TEST BUTTONS

REGISTRY.ui.createDebugUIButtons = createDebugUIButtons;
