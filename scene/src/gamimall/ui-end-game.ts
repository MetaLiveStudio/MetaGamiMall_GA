import * as ui from "@dcl/ui-scene-utils";
import { CONFIG, initConfig } from "src/config";
import { CustomPrompt } from "src/dcl-scene-ui-workaround/CustomPrompt";
import resources, { setSection } from "src/dcl-scene-ui-workaround/resources";
import { logChangeListenerEntry } from "src/logging";
import { REGISTRY } from "src/registry";
import { GameEndResultType, GAME_STATE } from "src/state";
import { endGame } from "./gameplay";
import { RESOURCES } from "./resources";
import {
  CustomClaimArgs,
  CustomClaimPrompt,
  CustomOptionsPrompt,
  CustomRewardPrompt,
  LevelUpPrompt,
} from "src/ui/modals";

/*
const entity = new Entity()
entity.addComponent(new GLTFShape('models/Lildoge_NLA.gltf'))
entity.addComponent(new Transform({position:new Vector3(1,1,1)}))

if(!entity.hasComponent(Animator)) entity.addComponentOrReplace(new Animator())
entity.getComponent(Animator).addClip(new AnimationState("Run", { looping: true })))
entity.getComponent(Animator).addClip(new AnimationState("Idle", { looping: true }))

entity.getComponent(Animator).getClip("Run").play()

engine.addEntity(entity)
*/
/*
export const endGamePrompt = new CustomPrompt(ui.PromptStyles.DARKLARGE,400,400)

//endGamePrompt.hide()

endGamePrompt.addText("Play Super Dogerio",0,180,Color4.White(),20)

endGamePrompt.addIcon("images/play-carousel-1.png",0,0,80,80)
endGamePrompt.addIcon("images/play-carousel-2.png",0,0,80,80)

endGamePrompt.addText("Play",0,180,Color4.White(),20)

*/

//initConfig()

const SHIFTY = -30;
const SHIFTY_TEXT = -70;

export const PROMPT_PICKER_WIDTH = 450;
export const PROMPT_PICKER_HEIGHT = 450; //550
export const PROMPT_OFFSET_X = 0; //80//move it away from communications box as cant click thru it
export const PROMPT_OFFSET_Y = 40;
export const MAIN_CONTENT_START_Y = 180;
export const PROMPT_TITLE_HEIGHT = 200 + SHIFTY; //250 + SHIFTY
export const PROMPT_TITLE_COLOR = Color4.White();
export const BUTTON_HEIGHT = 60;

export const PROMPT_OVERLAY_TEXT_COLOR = Color4.White();

export const PROMPT_PICKER_OVERLAY_WIDTH = PROMPT_PICKER_WIDTH;
export const PROMPT_PICKER_OVERLAY_HEIGHT = 320;
export const PROMPT_OVERLAY_OFFSET_X = 0;
export const PROMPT_OVERLAY_OFFSET_Y = 60;

export const BUTTON_POS_Y = -120; //-180

const BANNER_SOURCE_WIDTH = 1093; //1038
const BANNER_SOURCE_HEIGHT = 128;

const BANNER_IMAGE_SCALE = 0.3;
type RowModifierAmountData={
  bonusPercent:number
  bonusAmount:number
  bonusLabel:string
}
function makeRowText(val:number,labal:string,modifierAmountData:RowModifierAmountData,minValToShow:number,fallbackText:string){
  if(val < minValToShow){
    return fallbackText
  }else{
    let valText = 'x' + '' + val
    if(modifierAmountData !== undefined ){
      if(modifierAmountData.bonusAmount !== undefined && modifierAmountData.bonusAmount > 0){
        valText += "+" + modifierAmountData.bonusAmount
      }
      let bonusParens = ""
      if(modifierAmountData.bonusPercent !== undefined){
        bonusParens += "%"+ (((modifierAmountData.bonusPercent < 1) ? modifierAmountData.bonusPercent : modifierAmountData.bonusPercent-1)*100).toFixed(0)
      }
      if(modifierAmountData.bonusLabel !== undefined){
        bonusParens += " "+modifierAmountData.bonusLabel
      }
      if(bonusParens !== undefined && bonusParens.length > 0){
        valText += "("+bonusParens+")"
      }
    }
    return valText
  }
}

export function initUIEndGame() {
  let buttonPosY = BUTTON_POS_Y;

  const startX = -370;
  const startY = MAIN_CONTENT_START_Y;
  const rowHeight = 30;
  const rowPaddY = 10;
  const colWidth = 200;
  const buttonHeight = BUTTON_HEIGHT;

  let yCounter = startX;
  /*
const gameTutorialImg = 'images/game/gameTutorial-Img1.png'
const gameTutorialImgTexture = new Texture(gameTutorialImg);
const gameTutorialImgDesc = "Game Explaination"
*/

  const endOptions = {
    width: 420,
    modalWidth: -200,
  };
  const endGameConfirmPrompt20 = new CustomOptionsPrompt(
    "End Current Game",
    "End Current Game\n No progress will be saved.",
    "End Game",
    "",
    "Cancel",
    "",
    () => {
      log("end");
      endGame();
      hideEndGameConfirmPrompt();
    },
    undefined,
    endOptions
  );

  /*
const endGameOfPrompt20 = new CustomRewardPrompt("End Current Game","End Current Game\n No progress will be saved.","End Game","","Cancel",""
,()=>{
  log('end')
  endGame()
  hideEndGameConfirmPrompt()
})
*/
  let rewardOpts = { height: 550 };
  const claimRewardPrompt20 = new CustomClaimPrompt({
    imagePath:
      "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x47f8b9b9ec0f676b45513c21db7777ad7bfedb35:0/thumbnail",
    imageWidth: 1024,
    imageHeight: 1024,
    itemName: "Doge Head",
    subtitleItemName: "Created By Metadoge",
    subtitle:
      "The very first wearable created by Metadoge,\nHolder can swap to LiLDoge here",
    title: "HIHGHLIGHTS",
    coins: "x 3000",
    dollars: "x 1000",
    itemQtyCurrent: 23,
    itemQtyTotal:100,
    options: rewardOpts,
  });
  claimRewardPrompt20.updateData({
    imagePath:
      "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x47f8b9b9ec0f676b45513c21db7777ad7bfedb35:0/thumbnail",
    imageWidth: 1024,
    imageHeight: 1024,
    itemName: "Doge Head",
    subtitleItemName: "Created By Metadoge",
    subtitle:
      "The very first wearable created by Metadoge,\nHolder can swap to LiLDoge here",
    title: "HIHGHLIGHTS",
    coins: "x 99",
    dollars: "x 199",
    itemQtyCurrent: 3,
    itemQtyTotal:100,
    options: rewardOpts,
  });

  //claimRewardPrompt20.show()

  
  const levelUpPrompt = new LevelUpPrompt("title","text","OK",()=>{}) 
  levelUpPrompt.updateCoins("2")
  levelUpPrompt.updateDollar("3")
  levelUpPrompt.hide()
  REGISTRY.ui.levelUpPrompt = levelUpPrompt;

  const endGamePrompt20 = new CustomRewardPrompt(
    "Congratulations",
    "You have collected",
    "x111",
    "x111",
    "Confirm",
    "This is enough for me..",
    "Join Raffle",
    "Under Development...",
    () => {},
    () => {},
    {
      height: 430,
    }
  );
  //endGamePrompt20.show()
  REGISTRY.ui.endGameConfirmPrompt = endGameConfirmPrompt20;

  function openClaimRewardPrompt() {
    claimRewardPrompt20.show();
  }
  function hideClaimRewardPrompt() {
    claimRewardPrompt20.hide();
  }
  function updateRewardPrompt(args: CustomClaimArgs) {
    //endGamePrompt.show();
    claimRewardPrompt20.updateData(args);
  }

  function openEndGamePrompt() {
    //endGamePrompt.show();
    endGamePrompt20.show();
    if (GAME_STATE.inVox8Park) {
      //resultMetaCoinText.text.visible = false;
      //resultGameCoinEarnedText.text.visible = false;
      //promptBannerImage.image.source = RESOURCES.textures.voxBanner; //workaround to try to save textures
      //gameImageDescList = gameImageDescList_VOX_PARK
      //gameImageList = gameImageList_VOX_PARK
    } else {
      //promptBannerImage.image.source = RESOURCES.textures.superDogerioBanner; //workaround to try to save textures
      //resultMetaCoinText.text.visible = true;
      //resultGameCoinEarnedText.text.visible = true;
      //gameImageDescList = gameImageDescList_SUPER_DOGERIO
      //gameImageList = gameImageList_SUPER_DOGERIO
    }
  }

  function hideEndGamePrompt() {
    //endGamePrompt.hide();
    endGamePrompt20.hide();
  }

  function openEndGameConfirmPrompt() {
    //endGameConfirmPrompt.show();
    endGameConfirmPrompt20.show();
  }
  function hideEndGameConfirmPrompt() {
    //endGameConfirmPrompt.hide();
    endGameConfirmPrompt20.hide();
  }
  REGISTRY.ui.hideEndGamePrompt = hideEndGamePrompt;
  REGISTRY.ui.openEndGameConfirmPrompt = openEndGameConfirmPrompt;
  REGISTRY.ui.hideEndGameConfirmPrompt = hideEndGameConfirmPrompt;
  REGISTRY.ui.openEndGamePrompt = openEndGamePrompt;

  REGISTRY.ui.openClaimRewardPrompt = openClaimRewardPrompt;
  REGISTRY.ui.hideClaimRewardPrompt = hideClaimRewardPrompt;
  REGISTRY.ui.updateRewardPrompt = updateRewardPrompt;

  GAME_STATE.addChangeListener((key: string, newVal: any, oldVal: any) => {
    logChangeListenerEntry(
      "listener.game.ui-end-game.ts ",
      key,
      newVal,
      oldVal
    );

    switch (key) {
      //common ones on top
      case "gameEndResult":
        const endGameResult = newVal as GameEndResultType;

        if (
          GAME_STATE.inVox8Park ||
          (GAME_STATE.gameRoom && GAME_STATE.gameRoom.name == "vox_board_park")
        ) {
          const txt =
            endGameResult.guestCoinCollected +
            " " +
            endGameResult.guestCoinName;
          endGamePrompt20.updateSubGameDollars(txt);
          //resultGameCoinStartText.text.value = strPad("Game Coins Started With",".",textColLen+col2Len," " + endGameResult.gcStarted) // + " --> " + endGameResult.gcCollectedToMC + " MC"
          //resultGameCoinFoundText.text.value = txt; // + " --> " + endGameResult.gcCollectedToMC + " MC"
          //resultGameCoinText.text.value = strPad("New Game Coin Total ",".",textColLen," " + endGameResult.gcTotal )  + " --> " + endGameResult.gcCollectedToMC + " MC"
          //resultMetaCoinText.text.value = endGameResult.mcCollected + " MetaCash"
          //resultMetaCoinText.text.visible = false;
          //resultGameCoinEarnedText.text.visible = false;
        } else {
          log("listener.gameEndResult", endGameResult);
          
          const minValToShow = 1
          const textWhenBelowMin = ""
          let m1 = makeRowText(endGameResult.material1Collected,CONFIG.GAME_COIN_TYPE_MATERIAL_1,undefined,minValToShow,textWhenBelowMin)
          let m2 = makeRowText(endGameResult.material2Collected,CONFIG.GAME_COIN_TYPE_MATERIAL_1,undefined,minValToShow,textWhenBelowMin)
          let m3 = makeRowText(endGameResult.material3Collected,CONFIG.GAME_COIN_TYPE_MATERIAL_1,undefined,minValToShow,textWhenBelowMin)


          let txtD = makeRowText(endGameResult.mcCollected , " MetaCash",undefined,minValToShow,textWhenBelowMin);
          //todo add gcBonusEarned to it???
          let txtC = makeRowText(
              endGameResult.gcCollected , " LilCoin"
              ,undefined//{bonusAmount:endGameResult.gcBonusEarned,bonusLabel:"Bonus",bonusPercent:endGameResult.coinMultiplier}
              ,minValToShow,textWhenBelowMin);
          
          let txtEarned =
            makeRowText(
              endGameResult.gcBonusEarned , " LilCoin"
              ,{bonusAmount:-1,bonusLabel:"Bonus",bonusPercent:endGameResult.coinMultiplier}
              ,minValToShow,textWhenBelowMin);
          //resultMetaCoinText.text.visible = true;
          //resultGameCoinStartText.text.value = strPad("Game Coins Started With",".",textColLen+col2Len," " + endGameResult.gcStarted) // + " --> " + endGameResult.gcCollectedToMC + " MC"

          //resultGameCoinFoundText.text.value = txtC; // + " --> " + endGameResult.gcCollectedToMC + " MC"
          if (endGameResult.gcBonusEarned && endGameResult.coinMultiplier) {
            //resultGameCoinEarnedText.text.visible = true;
            //resultGameCoinEarnedText.text.value = txtEarned;
          } else {
            //txtEarned = "+" + 0 + " LilCoin Bonus";
            //resultGameCoinEarnedText.text.value = txtEarned;
          }
          endGamePrompt20.updateCoinsEarned(txtEarned);
          endGamePrompt20.updateCoins(txtC);
          endGamePrompt20.updateDollar(txtD);

          endGamePrompt20.updateMaterial1(m1);
          endGamePrompt20.updateMaterial2(m2);
          endGamePrompt20.updateMaterial3(m3);

          //resultGameCoinText.text.value = strPad("New Game Coin Total ",".",textColLen," " + endGameResult.gcTotal )  + " --> " + endGameResult.gcCollectedToMC + " MC"
          //resultMetaCoinText.text.value = txtD;
        }

        break;
    }
  });
  //todo: test it
  //start off value
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
    coinMultiplier: 1,
    gcBonusEarned: 0,
    guestCoinName: "",
    material1Collected: 4,
    material2Collected: 5,
    material3Collected: 6,
    raffleResult: {
      cost: 0,
      amountWon: 0,
      multiplier: 0,
      hasEnoughToPlay: false,
    },
  });
}
