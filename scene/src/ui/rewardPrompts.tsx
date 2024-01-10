import * as utils from '@dcl-sdk/utils'
import {
  engine,
  Entity,
  Transform,
} from '@dcl/sdk/ecs'
import * as ui from 'dcl-ui-toolkit'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { ExtIPrompt, PromptWrapper, setBackgroundTexture, setButtonDim, setButtonIconPos, setButtonLabelPos, setImageElementDim, setSelectionUv } from './extDclUiToolkit'
import atlas_mappings from "./atlas_mappings";
import { PromptText } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Text'
import { PromptButton } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Button'
import { Prompt } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt'
import { CenterLabel } from './ext/CenterLabel'
import { i18n, i18nOnLanguageChangedAdd } from '../i18n/i18n'
import { log } from '../back-ports/backPorts'
import { ImageAtlasData } from 'dcl-ui-toolkit/dist/utils/imageUtils'
import { languages, namespaces } from '../i18n/i18n.constants'
import { CONFIG } from '../config'
import { RewardNotification } from '../gamimall/coin'
import { applyButtonStyle, applyCustomOptionsPanel, CUSTOM_ATLAS, CUSTOM_DELAY_MS, CustomOptionsPrompt, CustomPromptOptions, Modal, OPTION_PROMPT_DEFAULT_HEIGHT, OPTION_PROMPT_DEFAULT_WIDTH, SCALE_FONT_TITLE, updateCloseBtnPosition } from './modals'
import { REGISTRY } from '../registry'
import { PromptButtonExt } from './ext/PromptButtonExt'
import { AbstractBaseGridPrompt, AbstractGridPrompt, CustomGridTextRow, CustomGridTextRowData } from './gridModalUtils'
import { GAME_STATE, GameEndResultType } from '../state'
import { logChangeListenerEntry } from '../logging'
import { endGame } from '../gameplay'

const SCALE_RAFFLE_UIImage = 1;
const MASTER_SCALE = 1

const CLAIM_PROMPT_RAFFLE_WIDTH = 400 * SCALE_RAFFLE_UIImage;
const CLAIM_PROMPT_RAFFLE_HEIGHT = 500 * SCALE_RAFFLE_UIImage;


function applyLevelUpPanel(
  modal: PromptWrapper<Prompt>,
  button?: PromptButton,
  options?: CustomPromptOptions
) {
  //if (custUiAtlas !== undefined) {

    modal.setTexture( "images/ui/Avatarswap-04.png" )
    //modal.background.source = CommonResources.RESOURCES.textures.avatarswap04

    modal._prompt.height =
    options && options.height ? options.height : CLAIM_PROMPT_RAFFLE_HEIGHT;
    modal._prompt.width =
      options && options.width ? options.width : CLAIM_PROMPT_RAFFLE_WIDTH;

    modal.setSelection(atlas_mappings.backgrounds.levelUp)
    
    //TODO BRING BACK
    //modal.closeIcon.positionX = "41%";
    //modal.closeIcon.positionY = "22%";

    if (button) {
      /*
      button.image.source = custUiAtlas;
      button.image.positionY = "-55%";
      button.image.positionX = "0";
      button.image.sourceLeft = 2035;//TODO move to atlas_mappings and use setSection
      button.image.sourceWidth = 400;
      button.image.sourceTop = 2393;
      button.image.sourceHeight = 215;
      button.image.width = "35%";
      button.image.height = "15%";
      */
      setBackgroundTexture(button.imageElement,CUSTOM_ATLAS)
      //maybe use icon instead of image and set image to transparent?
      setSelectionUv(button.imageElement, atlas_mappings.icons.costInfo)
      applyButtonStyle(button)
    }
    
  //}
}

function applyRafflePanel(
  modal: PromptWrapper<Prompt>,
  button?: PromptButton,
  secondaryButton?: PromptButton,
  options?: CustomPromptOptions
) {
  
    modal.setTexture( CUSTOM_ATLAS )
    
    
   //TODO ally setting custom height and width
   modal._prompt.height =
    options && options.height ? options.height : CLAIM_PROMPT_RAFFLE_HEIGHT;
    modal._prompt.width =
      options && options.width ? options.width : CLAIM_PROMPT_RAFFLE_WIDTH;

    
    modal.setSelection(atlas_mappings.backgrounds.rewardsPanel)  
    /*
    modal.background.sourceWidth = 1210;
    modal.background.sourceLeft = 2002;

    modal.background.sourceHeight = 1271;
    modal.closeIcon.positionX = "41%";
    modal.closeIcon.positionY = "22%";
    */

    if (button) {
      /*
      button.image.source = custUiAtlas;
      button.image.positionY = "-34.5%"//"-35%";
      button.image.positionX = "-18%";
      button.image.sourceLeft = 2035;
      button.image.sourceWidth = 400;
      button.image.sourceTop = 2393;
      button.image.sourceHeight = 215;
      button.image.width = "35%";
      button.image.height = "15%";*/
      setBackgroundTexture(button.imageElement,CUSTOM_ATLAS)
      //maybe use icon instead of image and set image to transparent?
      setSelectionUv(button.imageElement, atlas_mappings.icons.costInfo)
      applyButtonStyle(button)
    }
    if (secondaryButton) {
      /*
      secondaryButton.image.source = custUiAtlas;
      secondaryButton.image.positionY = "-34.5%"//"-35%";
      secondaryButton.image.positionX = "18%";
      secondaryButton.image.sourceLeft = 2426;
      secondaryButton.image.sourceWidth = 424;
      secondaryButton.image.sourceTop = 2393;
      secondaryButton.image.sourceHeight = 215;
      secondaryButton.image.width = "35%";
      secondaryButton.image.height = "15%";*/
      setBackgroundTexture(secondaryButton.imageElement,CUSTOM_ATLAS)
      //maybe use icon instead of image and set image to transparent?
      setSelectionUv(secondaryButton.imageElement, atlas_mappings.icons.costInfo)
      applyButtonStyle(button)
    }
  
}


export class LevelUpPrompt extends AbstractGridPrompt {
  constructor(
    title: string,
    text: string,
    buttonConfirm: string,
    primaryCallback?: () => void,
    options?: CustomPromptOptions
  ) {
    super(title,text,buttonConfirm,primaryCallback,options)

    this.initGrid({rowYPos:-120})

    this.title.value = "2"

    this.title.xPosition = 0//this.title.text.positionX = 0
    this.title.yPosition = 55;//this.title.text.positionY = 55
    //this.title.text.vAlign = 'center'
    //this.title.text.vTextAlign = 'center'
    this.title.size = 80////this.title.text.fontSize = 80
    this.title.color = Color4.White()//this.title.text.color = Color4.White()

    this.text.value = ''//not needed right now
    /*this.text.text.positionX = 0
    this.text.text.positionY = -50 
    this.text.text.vAlign = 'center'
    this.text.text.vTextAlign = 'center'*/

    applyLevelUpPanel(this.prompt, this.buttonPrimary, options);
  }
  update(reward:RewardNotification){
    
    //clear out last values
    this.reset()

    this.updateTitle(reward.newLevel.toFixed(0))

    if(reward.rewards!==undefined){
      for(const p in reward.rewards){
        switch(reward.rewards[p].id){
          case CONFIG.GAME_COIN_TYPE_GC:
            this.updateCoins(reward.rewards[p].amount.toFixed(0))
            break;
          case CONFIG.GAME_COIN_TYPE_MC:
            this.updateDollar(reward.rewards[p].amount.toFixed(0))
            break;
          case CONFIG.GAME_COIN_TYPE_VB:
            this.updateVcVB(reward.rewards[p].amount.toFixed(0))
            break; 
          case CONFIG.GAME_COIN_TYPE_AC:
            this.updateVcAC(reward.rewards[p].amount.toFixed(0))
            break; 
          case CONFIG.GAME_COIN_TYPE_ZC:
            this.updateVcZC(reward.rewards[p].amount.toFixed(0))
            break; 
          case CONFIG.GAME_COIN_TYPE_RC:
            this.updateVcRC(reward.rewards[p].amount.toFixed(0))
            break; 
          /*case CONFIG.GAME_COIN_TYPE_MC:
            this.updateDollar(reward.rewards[p].amount.toFixed(0))
            break;*/
          case CONFIG.GAME_COIN_TYPE_R1:
            this.updateRock1(reward.rewards[p].amount.toFixed(0))
            break;
          case CONFIG.GAME_COIN_TYPE_R2:
            this.updateRock2(reward.rewards[p].amount.toFixed(0))
            break;
          case CONFIG.GAME_COIN_TYPE_R3:
            this.updateRock3(reward.rewards[p].amount.toFixed(0))
            break;
          case CONFIG.GAME_COIN_TYPE_BP:
            this.updatePetro(reward.rewards[p].amount.toFixed(0))
            break;
          case CONFIG.GAME_COIN_TYPE_NI:
            this.updateNitro(reward.rewards[p].amount.toFixed(0))
            break;
          case CONFIG.GAME_COIN_TYPE_BZ:
            this.updateBronze(reward.rewards[p].amount.toFixed(0))
            break;
          case CONFIG.GAME_COIN_TYPE_BRONZE_SHOE_1_ID:
            this.updateBronzeShoe(reward.rewards[p].amount.toFixed(0))
            break; 
          case CONFIG.GAME_COIN_TYPE_STAT_RAFFLE_COIN_BAG_3_ID:
            //this.updateBronzeShoe(reward.rewards[p].amount.toFixed(0))
            break; 
          case CONFIG.GAME_COIN_TYPE_TICKET_RAFFLE_COIN_BAG_ID:
            //this.updateBronzeShoe(reward.rewards[p].amount.toFixed(0))
            break;
          case CONFIG.GAME_COIN_TYPE_REDEEM_RAFFLE_COIN_BAG_ID:
            this.updateCoinBagRaffleRedeem(reward.rewards[p].amount.toFixed(0))
            break; 
          default:
            log("unhandled reward type",reward.rewards[p].id,reward.rewards[p])
        }
      }
      this.updateGrid()
    }
  }
}

export class CustomRewardPrompt extends AbstractGridPrompt {
  //prompt: ui.CustomPrompt;
  //title: ui.CustomPromptText;
  //text: ui.CustomPromptText;

  /*
  coins:CustomTextRow
  coinsEarned:CustomTextRow
  dollars:CustomTextRow

  material1:CustomTextRow
  material2:CustomTextRow
  material3:CustomTextRow
  */

  //coins: ui.CustomPromptText;
  //coinsEarned: ui.CustomPromptText;
  //dollars: ui.CustomPromptText;

  //material1: ui.CustomPromptText;
  //material2: ui.CustomPromptText;
  //material3: ui.CustomPromptText;

  //buttonConfirm: string;
  //buttonSubtitleConfirm: string;
  buttonRaffle: string;
  buttonSubtitleRaffle: string;
  //primaryCallback?: () => void;
  secundaryCallback?: () => void;

  secondaryButton: PromptButtonExt

  //textGrid: CustomGridTextRow[] = [];

  constructor(
    title: string,
    text: string,
    coins: string,
    dollars: string,
    buttonConfirm: string,
    buttonSubtitleConfirm: string,
    buttonRaffle: string,
    buttonSubtitleRaffle: string,
    primaryCallback?: () => void,
    secundaryCallback?: () => void,
    options?: CustomPromptOptions
  ) {
    super( title,text,buttonConfirm,primaryCallback,options )

    this.initGrid({rowXPos:-110})//this.initGrid({}) 


    this.secundaryCallback = secundaryCallback;

    this.buttonConfirm = buttonConfirm;
    this.buttonSubtitleConfirm = buttonSubtitleConfirm;
    this.buttonRaffle = buttonRaffle;
    this.buttonSubtitleRaffle = buttonSubtitleRaffle;
    //const sfFont = getOrCreateFont(Fonts.SanFrancisco)

    let secundaryButton = this.secondaryButton = this.prompt.addButton(
      this.buttonRaffle,
      50,
      -50,
      () => {
        if (this.secundaryCallback) this.secundaryCallback();
        this.hide();
      },
      ui.ButtonStyles.E
    );
    //TODO BRING BACK
    /*
    if (secundaryButton.icon) {
      secundaryButton.icon.visible = false;
      log(secundaryButton.label);
      secundaryButton.label.positionX = -5;
      secundaryButton.label.positionY = 5;
    }*/
    
    this.buttonPrimary.subText = this.buttonSubtitleConfirm

    //subtitleConfirm.text.vAlign = "center";
    //subtitleConfirm.text.adaptHeight = true;
    //subtitleConfirm.text.font = sfFont;
    //if(subtitleConfirm.textElement.uiTransform) subtitleConfirm.textElement.uiTransform.pointerFilter = "none"

    secundaryButton.subText = this.buttonSubtitleRaffle
   
    this.hide();
    
    applyRafflePanel(this.prompt, this.buttonPrimary, secundaryButton, options);
    this.applyUIScaling()
  }
  applyUIScaling(){
    //super.applyUIScaling()
    ///let SCREEN_TYPE = this.screenType

    updateCloseBtnPosition( this.prompt, 90)

    applyButtonStyle(this.secondaryButton)

    //this.buttonPrimary.xPosition = 0
    this.secondaryButton.yPosition = -157
    this.secondaryButton.xPosition = 90 
    this.secondaryButton.setIconPos( undefined, -18)
    this.secondaryButton.setTextPosition({top:-8})
    this.secondaryButton.setSubTextVisible(true)
    setButtonDim(this.secondaryButton,170,55)

    //this.buttonPrimary.xPosition = 0
    this.buttonPrimary.yPosition = -157
    this.buttonPrimary.xPosition = -90 
    this.buttonPrimary.setIconPos( undefined, -18)
    this.buttonPrimary.setTextPosition({top:-8})
    this.buttonPrimary.setSubTextVisible(true)
    setButtonDim(this.buttonPrimary,170,55)
    
  }
}

type RowModifierAmountData={
  bonusPercent:number
  bonusAmount:number
  bonusLabel:string
}
function makeRowText(val:number,labal:string,modifierAmountData:RowModifierAmountData|undefined,minValToShow:number,fallbackText:string){
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
export function initRewardPrompts(){
  const levelUpPrompt = new LevelUpPrompt("title","text","OK",()=>{}) 
  levelUpPrompt.updateCoins("2")
  levelUpPrompt.updateDollar("3")
  levelUpPrompt.hide()
  REGISTRY.ui.levelUpPrompt = levelUpPrompt;


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
      height: CLAIM_PROMPT_RAFFLE_WIDTH * 1.2,//*MASTER_SCALE,
      width: CLAIM_PROMPT_RAFFLE_WIDTH * 1.2//*MASTER_SCALE  
    }
  );
  endGamePrompt20.autoCloseEnabled = true
  endGamePrompt20.autoCloseTimeoutMS = 5000
  //endGamePrompt20.show()
  REGISTRY.ui.endGameConfirmPrompt = endGameConfirmPrompt20;

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
          

          let rock1 = makeRowText(endGameResult.rock1Collected,CONFIG.GAME_COIN_TYPE_R1,undefined,minValToShow,textWhenBelowMin)
          let rock2 = makeRowText(endGameResult.rock2Collected,CONFIG.GAME_COIN_TYPE_R2,undefined,minValToShow,textWhenBelowMin)
          let rock3 = makeRowText(endGameResult.rock3Collected,CONFIG.GAME_COIN_TYPE_R3,undefined,minValToShow,textWhenBelowMin)
          
          let bronze = makeRowText(endGameResult.bronzeCollected,CONFIG.GAME_COIN_TYPE_BZ,undefined,minValToShow,textWhenBelowMin)

          let bronzeShoe = makeRowText(endGameResult.bronzeShoeCollected,CONFIG.GAME_COIN_TYPE_BRONZE_SHOE_1,undefined,minValToShow,textWhenBelowMin)


          let nitro = makeRowText(endGameResult.nitroCollected,CONFIG.GAME_COIN_TYPE_NI,undefined,minValToShow,textWhenBelowMin)
          let petrol = makeRowText(endGameResult.petroCollected,CONFIG.GAME_COIN_TYPE_BP,undefined,minValToShow,textWhenBelowMin)
          

          let statRaffleCoinBag = makeRowText(endGameResult.statRaffleCoinBag,CONFIG.GAME_COIN_TYPE_STAT_RAFFLE_COIN_BAG_3_ID,undefined,minValToShow,textWhenBelowMin)
          let redeemRaffleCoinBag = makeRowText(endGameResult.redeemRaffleCoinBag,CONFIG.GAME_COIN_TYPE_REDEEM_RAFFLE_COIN_BAG_ID,undefined,minValToShow,textWhenBelowMin)
          //ticketRaffleCoinBag: ticketRaffleCoinBag,

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

          endGamePrompt20.autoCloseEnabled = endGameResult.autoCloseEnabled;
          endGamePrompt20.autoCloseTimeoutMS = endGameResult.autoCloseTimeoutMS;

          endGamePrompt20.updateCoinsEarned(txtEarned);
          endGamePrompt20.updateCoins(txtC);
          endGamePrompt20.updateDollar(txtD);

          endGamePrompt20.updateRock1(rock1);
          endGamePrompt20.updateRock2(rock2);
          endGamePrompt20.updateRock3(rock3);

          
          endGamePrompt20.updateBronze(bronze);
          endGamePrompt20.updateBronzeShoe(bronzeShoe);

          endGamePrompt20.updateNitro(nitro);
          endGamePrompt20.updatePetro(petrol);

          endGamePrompt20.updateMaterial1(m1);
          endGamePrompt20.updateMaterial2(m2);
          endGamePrompt20.updateMaterial3(m3);

          endGamePrompt20.updateCoinBagRaffleRedeem(redeemRaffleCoinBag)
          endGamePrompt20.updateCoinBagRaffleStat(statRaffleCoinBag)
          

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
    rock1Collected: 0,
    rock2Collected: 0,
    rock3Collected: 13,
    petroCollected: 14,
    nitroCollected: 15,
    bronzeCollected: 14.4,
    bronzeShoeCollected: 14.6,
    material1Collected: 4,
    material2Collected: 5,
    material3Collected: 6,
    statRaffleCoinBag: 7,
    ticketRaffleCoinBag: 8,
    redeemRaffleCoinBag: 9,
    autoCloseEnabled: true,
    autoCloseTimeoutMS: 5000,
    raffleResult: {
      cost: 0,
      amountWon: 0,
      multiplier: 0,
      hasEnoughToPlay: false,
    },
  });

    
  //endGamePrompt20.show() 
  //endGameConfirmPrompt20.show()

  
}
