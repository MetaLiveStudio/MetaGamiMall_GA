import * as utils from '@dcl-sdk/utils'
import {
  engine,
  executeTask,
  Transform,
} from '@dcl/sdk/ecs'
import * as ui from 'dcl-ui-toolkit'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { clearButtonSystemInputListener, ExtIPrompt, PromptWrapper,  setBackgroundTexture,  setButtonIconPos,  setSelectionUv } from './extDclUiToolkit'
import atlas_mappings from "./atlas_mappings";
import { PromptText } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Text'
import { PromptButton } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Button'
import { Prompt } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt'
import { CenterLabel } from './ext/CenterLabel'
import { MediumCenterIcon } from './ext/MediumCenterIcon'

import { wordWrap } from '../utils/helperFunctions'
import { i18n, i18nOnLanguageChangedAdd, i18nOnLanguageChangedAddReplace } from '../i18n/i18n'
import { _openExternalURL, _teleportTo, log } from '../back-ports/backPorts'
import { CUSTOM_ATLAS, CustomOkPrompt, DEFAULT_SCREEN_TYPE, I18NParamsType, Modal, PickLanguagePrompt, SCREEN_RETINA, SCREEN_STANDARD } from './modals'
import { languages, namespaces } from '../i18n/i18n.constants'
import { REGISTRY } from '../registry'
import { getImageAtlasMapping, ImageAtlasData } from 'dcl-ui-toolkit/dist/utils/imageUtils'
import { MenuPromptButton } from './ext/MenuPromptButton'
import { IPrompt } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/IPrompt'
import { PromptExt } from './ext/PromptExt'
import { CONFIG } from '../config'
import { GAME_STATE } from '../state'
import { disconnect, showConnectingStarted } from '../gamimall/connection'
import { resetLoginState } from '../gamimall/login-flow'
import { IntervalUtil } from '../meta-decentrally/modules/interval-util'
import { getCoinCap, getLevelFromXp, getLevelPercentFromXp, getXPFromLevel } from '../modules/leveling/levelingUtils'
import { ProgressBarExt } from './ext/ProgressBarExt'
import { CheckMultiplierResultType, fetchMultiplier } from '../store/fetch-utils'
import { strLPad } from '../utils'
import { onCanvasInfoChangedObservable } from './ui_engineInfo'
import { teleportTo } from '~system/RestrictedActions'
import { getAndSetRealmDataIfNull } from '../userData'
import { leaderBoardsConfigs } from '../gamimall/leaderboard-utils'

const MASTER_SCALE = 1.2;

const SCALE_FONT_TITLE = MASTER_SCALE;
const SCALE_FONT = MASTER_SCALE;
const SCALE_FONT_PANEL = MASTER_SCALE;

const SCALE_UIImage = MASTER_SCALE;
const SCALE_UIImage_PERCENT = MASTER_SCALE;
const SCALE_UITextPostion_PERCENT = 0.8;

const reloginCooldown = new IntervalUtil(3000,'abs-time')

  
//work around 99.99 rounding up to 100 :(
//https://stackoverflow.com/questions/4187146/truncate-number-to-two-decimal-places-without-rounding
function toFixed(num:number, fixed:number) {
  if(num !== undefined && num !== null){
    /*var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    const str = num.toString()
    if(re.test(str)){
      const arr = str.match(re)
      return arr ? arr[0] : 0;
    }*/
    //is OOTB tofixed better again in SDK7?
    return num.toFixed(fixed)
  }
  log("toFixed","WARNING!!!", "failed for " + num + " fixed " + fixed)
  return "NaN";
} 


const STAMINA_PROMPT_SCALE = [1.2,2]

const STAMINA_PROMPT_MARGIN_LEFT = [-5,-20]

const labelFont = [26,42]
const statsFont = [18,31]
const STATS_BOTTOM_ROW_Y = [-28,-55]

const BAR_Y_BASE = [80,140]
const BAR_X_OFFSET = [-100,-200]
const BAR_WIDTH_SCALE = [3.05 ,5]

const LEVEL_FONTSIZE = [20,34]
const COINBAR_FONTSIZE = [14,22]


export class StaminaPanel implements Modal {
  //staminaPanel: UIImage; //make a prompt and be BG
  staminaPanel: PromptWrapper<PromptExt>;
  staminaText: PromptText;
  staminaCoins: PromptText;
  //bronzeCoins: UIText;
  
  allTimeCoins: number
  dailyCoins:number
  //level: UIText;
  levelBar: ProgressBarExt;
  //coinBarTxt: UIText;
  coinBar: ProgressBarExt;
  //levelXP: UIText;
  staminaDollars: PromptText;
  staminaMultiplier: PromptText;
  StaminaTime: PromptText;
  multiplier:number

  screenType:number = DEFAULT_SCREEN_TYPE
  
  constructor() {


    let promptExtWrap = this.staminaPanel = new PromptWrapper(
      ui.createComponent(PromptExt, 
          //{ style: ui.PromptStyles.DARKSLANTED } //is exactly the claim UI
          { style: ui.PromptStyles.DARK } //is mostly right, need to modify selection
      )
    ) 
    let promptExt = ((this.staminaPanel._prompt as unknown) as PromptExt)
    promptExt._hAlignment = "right"
    promptExt._vAlignment = "top"
     
    promptExtWrap.setTexture(CUSTOM_ATLAS)
    promptExtWrap.setSelection(atlas_mappings.backgrounds.staminaPanel)
    promptExtWrap.removeCloseIcon()
    //setBackgroundTexture(promptExtWrap._prompt., CUSTOM_ATLAS)

    let SCREEN_TYPE = this.screenType
    
    this.levelBar = ui.createComponent(ProgressBarExt, {
      value: .9,   
      xOffset: BAR_X_OFFSET[SCREEN_TYPE],
      yOffset: BAR_Y_BASE[SCREEN_TYPE],//80,
      color: Color4.Purple(),
      style: ui.BarStyles.SQUAREBLACK,
      scale: 1,
    })

    this.coinBar = ui.createComponent(ProgressBarExt, {
      value: 1,   
      xOffset: BAR_X_OFFSET[SCREEN_TYPE],
      yOffset: BAR_Y_BASE[SCREEN_TYPE] - (SCREEN_TYPE == SCREEN_STANDARD ? 18 : 25),
      color: Color4.Purple(),
      style: ui.BarStyles.SQUAREBLACK,
      scale: 1,
    })
    

    this.staminaCoins = promptExtWrap.addText("coins",0,STATS_BOTTOM_ROW_Y[SCREEN_TYPE],Color4.White(),statsFont[SCREEN_TYPE])
    
    this.staminaDollars = promptExtWrap.addText("dollars",0,STATS_BOTTOM_ROW_Y[SCREEN_TYPE],Color4.White(),statsFont[SCREEN_TYPE])
    
    this.StaminaTime = promptExtWrap.addText("time",0,STATS_BOTTOM_ROW_Y[SCREEN_TYPE],Color4.White(),statsFont[SCREEN_TYPE])
    
    this.staminaText = promptExtWrap.addText("META GAMIMALL",0,0,Color4.White(),labelFont[SCREEN_TYPE])
    
    this.staminaMultiplier = promptExtWrap.addText("mult",0,0,Color4.White(),statsFont[SCREEN_TYPE])
    
    this.applyUIScaling()
    /*this.staminaPanel = new UIImage(canvas, custUiAtlas);
    this.staminaPanel.width = 30 * SCALE_UIImage_PERCENT + "%";
    this.staminaPanel.height = 110 * SCALE_UIImage + "px";
    this.staminaPanel.positionY = 305;
    this.staminaPanel.positionX = "31%";
    this.staminaPanel.sourceLeft = 0;
    this.staminaPanel.sourceTop = 3586;
    this.staminaPanel.sourceWidth = 1271;
    this.staminaPanel.sourceHeight = 330;
    this.staminaPanel.visible = false;*/

    

    

    /*this.staminaText = new UIText(canvas);
    this.staminaText.value = "META GAMIMALL";
    this.staminaText.positionY = "58%";
    this.staminaText.positionX = "23.7%";
    this.staminaText.color = Color4.White();
    this.staminaText.visible = false;
    this.staminaText.fontSize = 18;

    this.staminaCoins = new UIText(canvas);
    this.staminaCoins.value = "111";
    this.staminaCoins.positionY = "48%";
    this.staminaCoins.positionX = "26%";
    this.staminaCoins.color = Color4.White();
    this.staminaCoins.visible = false;
    this.staminaCoins.fontSize = 12;

    this.bronzeCoins = new UIText(canvas);
    this.bronzeCoins.value = "222";
    this.bronzeCoins.positionY = "48%";
    this.bronzeCoins.positionX = "23%";
    this.bronzeCoins.color = Color4.White();
    this.bronzeCoins.visible = false;
    this.bronzeCoins.fontSize = 12;
    

    this.staminaDollars = new UIText(canvas);
    this.staminaDollars.value = "222";
    this.staminaDollars.positionY = "48%";
    this.staminaDollars.positionX = "33.5%";
    this.staminaDollars.color = Color4.White();
    this.staminaDollars.visible = false;
    this.staminaDollars.fontSize = 12;

    
    this.staminaMultiplier = new UIText(canvas);
    this.staminaMultiplier.value = "Bonus: 5%";
    //next to gami mall right
    this.staminaMultiplier.positionY = "58%";
    this.staminaMultiplier.positionX = "38%";

    this.staminaMultiplier.color = Color4.White();
    this.staminaMultiplier.visible = false;
    this.staminaMultiplier.fontSize = 12;


    this.StaminaTime = new UIText(canvas);
    this.StaminaTime.value = "00:00";
    this.StaminaTime.positionY = "48%";
    this.StaminaTime.positionX = "41%";
    this.StaminaTime.color = Color4.White();
    this.StaminaTime.visible = false;
    this.StaminaTime.fontSize = 12;*/
  }
  applyUIScaling(){
    let SCREEN_TYPE = this.screenType

    this.staminaPanel._prompt.width = 500 * STAMINA_PROMPT_SCALE[SCREEN_TYPE]
    //making small height so is not cursor blocking
    this.staminaPanel._prompt.height = 140 * STAMINA_PROMPT_SCALE[SCREEN_TYPE]
    this.staminaPanel._prompt._marginTop = 75 * STAMINA_PROMPT_SCALE[SCREEN_TYPE]
    this.staminaPanel._prompt._marginLeft = STAMINA_PROMPT_MARGIN_LEFT[SCREEN_TYPE] * STAMINA_PROMPT_SCALE[SCREEN_TYPE]
    //promptExtWrap._prompt.height = 200
    //promptExt._prompt.width = 200
    //promptExt._prompt.

    //health2.show()


    
    const levelBar = this.levelBar
    levelBar.fontSize = LEVEL_FONTSIZE[SCREEN_TYPE]
    //levelBar.text = "Level 2 (2323 till next) 43.%"
    levelBar.width = 128 * (BAR_WIDTH_SCALE[SCREEN_TYPE])
    levelBar.height = 32 + (SCREEN_TYPE == SCREEN_STANDARD ? -5 : 5)
    levelBar.xOffset = BAR_X_OFFSET[SCREEN_TYPE]
    levelBar.yOffset = BAR_Y_BASE[SCREEN_TYPE]

    const coinBar  = this.coinBar
    //coinBar.text = "Daily cap 0/1234 (2112 till max) 0%"
    coinBar.fontSize = COINBAR_FONTSIZE[SCREEN_TYPE] 
    coinBar.height = 32 / (SCREEN_TYPE == 0 ? 1.5 : 1.2)
    coinBar.width = 128 * BAR_WIDTH_SCALE[SCREEN_TYPE]
    coinBar.xOffset = BAR_X_OFFSET[SCREEN_TYPE]
    coinBar.yOffset = BAR_Y_BASE[SCREEN_TYPE] - (SCREEN_TYPE == SCREEN_STANDARD ? 18 : 25)
    //health.show() 


    this.staminaCoins.xPosition = SCREEN_TYPE == SCREEN_STANDARD ? -110 :-180
    this.staminaCoins.yPosition = STATS_BOTTOM_ROW_Y[SCREEN_TYPE]
    this.staminaCoins.size = statsFont[SCREEN_TYPE] 

    log("staminaPanel","applyUIScaling",this.staminaCoins.size,statsFont[SCREEN_TYPE] ,this.screenType)
    this.staminaDollars.xPosition = SCREEN_TYPE == SCREEN_STANDARD ? 10 :20
    this.staminaDollars.yPosition = STATS_BOTTOM_ROW_Y[SCREEN_TYPE]
    this.staminaDollars.size = statsFont[SCREEN_TYPE]

    this.StaminaTime.xPosition = SCREEN_TYPE == SCREEN_STANDARD ? 150 : 250
    this.StaminaTime.yPosition = STATS_BOTTOM_ROW_Y[SCREEN_TYPE]
    this.StaminaTime.size = statsFont[SCREEN_TYPE]

    this.staminaText.xPosition = SCREEN_TYPE == SCREEN_STANDARD ? -80 : -120
    this.staminaText.yPosition = SCREEN_TYPE == SCREEN_STANDARD ? 60 : 80
    this.staminaText.size = labelFont[SCREEN_TYPE]
    //this.staminaText.textElement. = SCREEN_TYPE == SCREEN_STANDARD ? 15 : 26 
    //REQUIRED for workaround to set color to diff values.  If color is set it will also let font size work. this has to be a bug
    if(SCREEN_TYPE == SCREEN_STANDARD){
      this.staminaText.color = Color4.create(1,1,.999,1)//Color4.Black()
    }else{
      this.staminaText.color = Color4.White()
    } 
    
    
    this.staminaMultiplier.xPosition = SCREEN_TYPE == SCREEN_STANDARD ? 110 : 180
    this.staminaMultiplier.yPosition = SCREEN_TYPE == SCREEN_STANDARD ? 48 : 65
    this.staminaMultiplier.size = statsFont[SCREEN_TYPE]
  }
  show(): void {
    
    if(this.staminaPanel) this.staminaPanel.show()
    /*this.staminaText.visible = true;
    this.staminaDollars.visible = true;
    this.staminaCoins.visible = true;
    this.bronzeCoins.visible = false//disabled for now
    this.StaminaTime.visible = true;*/

    //if(this.multiplier > 1) this.staminaMultiplier.visible = true
    if(CONFIG.GAME_COIN_CAP_ENABLED){
      //this.coinBarTxt.visible = true && CONFIG.GAME_COIN_CAP_ENABLED
      this.coinBar.show()
    }
    this.levelBar.show()
  }
  hide(): void {
    if(this.staminaPanel) this.staminaPanel.hide()
    /*this.staminaText.visible = false;
    this.staminaDollars.visible = false;
    this.staminaCoins.visible = false;
    this.bronzeCoins.visible = false
    this.StaminaTime.visible = false;
    this.staminaMultiplier.visible = false*/
    
    this.levelBar.hide()
    this.coinBar.hide()
  }

  //material update placeholders
  updateMaterial1(text: string | number) {}
  updateMaterial2(text: string | number) {}
  updateMaterial3(text: string | number) {}

  updateDollars(text: string | number) {
    this.staminaDollars.value =
      typeof text === "string" ? text : Math.floor(text).toFixed(0)
  }

  updateVcVB(text: string|number) {
    //this.vc_vb.text = typeof text === "string" ? text : Math.floor(text).toFixed(0);
  }
  updateVcAC(text: string|number) {
    //this.vc_ac.text = typeof text === "string" ? text : Math.floor(text).toFixed(0);
  }
  updateVcZC(text: string|number) {
    //this.vc_zc.text = typeof text === "string" ? text : Math.floor(text).toFixed(0);
  }
  updateVcRC(text: string|number) {
    //this.vc_rc.text = typeof text === "string" ? text : Math.floor(text).toFixed(0);
  }
  
  setMultiplier(val:number){
    this.multiplier = val
    const host = this
    this.staminaMultiplier.value = i18n.t( "bonusDisplay",{value:toFixed(((val-1)*100),1),ns:namespaces.ui.staminaPanel})

    i18nOnLanguageChangedAddReplace("setMultiplier",(lng:string) => {
      //log("i18n","updateDailyCoins","onLanguageChanged",lng)
      host.setMultiplier(val)
    })
    if(this.staminaPanel.isVisible() && val > 1){
      this.staminaMultiplier.show()
    }else{
      this.staminaMultiplier.hide()
    }
  }
  updateDailyCoins(val:number){
    this.dailyCoins = val
    log("updateDailyCoins",this.dailyCoins)
    
    const host = this
    //registering or replacing callback for on language change to replay this last update with new language
    i18nOnLanguageChangedAddReplace("updateDailyCoins",(lng:string) => {
      //log("i18n","updateDailyCoins","onLanguageChanged",lng)
      host.updateDailyCoins(val)
    })

    const num = val 
    const level = getLevelFromXp(this.allTimeCoins,CONFIG.GAME_LEVELING_FORMULA_CONST)
    const maxCoinsPerLevel = getCoinCap( Math.floor(level),CONFIG.GAME_DAILY_COIN_MAX_FORMULA_CONST)
    //this.levelBar.set(percent/100)
    log("updateDailyCoins","dailyCoins:",this.dailyCoins,"level",level,maxCoinsPerLevel)
      
    const maxCoinsPerLevelCeiled = Math.ceil(maxCoinsPerLevel) 
    const valDiff = maxCoinsPerLevel-val
    const percent = maxCoinsPerLevel > 0 ? ((( val/maxCoinsPerLevelCeiled ) )*100) : 0
    
    const speedCapOverageReduction = CONFIG.speedCapOverageReduction * 100//drive via configuration!!!
    //val = maxCoinsPerLevel
    if(val < maxCoinsPerLevel){
      this.coinBar.fontColor = Color4.White(); 
      
      this.coinBar.text = i18n.t( "dailyCap.notMet"
        ,{ns:namespaces.ui.staminaPanel,
          currentValue:toFixed(val,1),maxValue:toFixed(maxCoinsPerLevelCeiled,0),remainingValue:toFixed(valDiff,1),currentPercent:toFixed(percent,1)
        })
      this.coinBar.set(percent/100) 
    }else{ 
      this.coinBar.fontColor = Color4.Yellow();
      this.coinBar.set(1) 
      
      this.coinBar.text = i18n.t( "dailyCap.hit"
        ,{ns:namespaces.ui.staminaPanel,
          currentValue:toFixed(val,1),maxValue:toFixed(maxCoinsPerLevelCeiled,0),remainingValue:toFixed(valDiff,1),currentPercent:toFixed(percent,1),collectionRate:toFixed(speedCapOverageReduction,1)
        })
    }
    
    
  }
  updateAllTimeCoins(val:number){
 
    const host = this
    //registering or replacing callback for on language change to replay this last update with new language
    i18nOnLanguageChangedAddReplace("updateAllTimeCoins",(lng:string) => {
      log("i18n","updateAllTimeCoins","onLanguageChanged",lng)
      host.updateAllTimeCoins(val)
    })

    this.allTimeCoins = val
    const num = val
    const level = getLevelFromXp(num,CONFIG.GAME_LEVELING_FORMULA_CONST)
    const thisLevelBaseXp = getXPFromLevel(Math.floor(level),CONFIG.GAME_LEVELING_FORMULA_CONST)
    const getLevelPercent = getLevelPercentFromXp( num,CONFIG.GAME_LEVELING_FORMULA_CONST )
    const nextLevelXP = getXPFromLevel(Math.floor(level + 1),CONFIG.GAME_LEVELING_FORMULA_CONST)
    const valDiff = val-thisLevelBaseXp
    const levelDiff = nextLevelXP-thisLevelBaseXp
    const percent = levelDiff > 0 ? (( valDiff/(levelDiff) )*100) : 0
    log("updateAllTimeCoins","val",val,"level",level,"thisLevelBaseXp",thisLevelBaseXp,"nextLevelXP",nextLevelXP,valDiff,levelDiff,"percent",percent)
    
    this.levelBar.text = i18n.t( "levelDisplay"
        ,{ns:namespaces.ui.staminaPanel,
          currentValue:Math.floor(level),currentPercent:toFixed(getLevelPercent,1),remainingValue: toFixed(nextLevelXP-num,1)})
    this.levelBar.set(percent/100)
  }
  updateBronze(text: string | number) {
    //log("updateBronze",text)   
    //stubbed place holder 
    //this.bronzeCoins.value = typeof text === "string" ? text : Math.floor(text).toFixed(0)
  }
  updateCoins(text: string | number) {
    //log("updateCoins",text)
    this.staminaCoins.value = typeof text === "string" ? text : Math.floor(text).toFixed(0)
  }

  updateTime(text: string | number) {
    this.StaminaTime.value = typeof text === "string" ? text : text.toFixed(0)
  }

  updateBronzeShoe(text: string | number){
    let has = false
    if(typeof text === "string"){ 
      has = text.toLocaleLowerCase() == "true"
      if(!has){
        try{
          has = parseInt( text ) > 0
        }catch(e){

        }
      }
    }else{
      has = text > 0
    }
    
    //TODO bring back
    //PurplePanel.visible = has
  }
}

export class GameToolsLowerScreen implements Modal{
  
  socialMediaPanel: SocialMediaPanel;

  monthlyLeaderBoardBtn: MediumCenterIcon

  screenType:number = DEFAULT_SCREEN_TYPE
  
  constructor() {
    //width?: number*: Image width on screen in pixels. 
    //Default value depends on icon's type (32 for SmallIcon, 64 for MediumIcon and 128 for LargeIcon).

    this.socialMediaPanel = new SocialMediaPanel();
    
    if(true){ 
      //lower center
      this.monthlyLeaderBoardBtn = ui.createComponent(MediumCenterIcon, 
        { 
          image: CUSTOM_ATLAS, startHidden:false, 
          //yOffset: 40,
          section: atlas_mappings.buttons.monthlyLeaderboardBtn
        }
      ) 
      this.monthlyLeaderBoardBtn.imageElement.onMouseDown = ()=>{
        if(REGISTRY.ui.openLeaderboardMonthly){
          REGISTRY.ui.openLeaderboardMonthly()
        }else{ 
          log("ShowMonthlyLeaderboardPanel","ERROR!!! REGISTRY.ui.openLeaderboardMonthly is undefined")
        }
      }
    }
 
    
  }
  applyUIScaling() {
    let SCREEN_TYPE = this.screenType

    if(true && this.monthlyLeaderBoardBtn){
      //TODO MOVE THIS TO "center-bottom"
      let _scale = 1
      
      if(SCREEN_TYPE == SCREEN_STANDARD){
        this.monthlyLeaderBoardBtn.xOffset = "40%" as any  
        this.monthlyLeaderBoardBtn.yOffset = 40
      }else{
        _scale = 1.8
        this.monthlyLeaderBoardBtn.yOffset = 20
        this.monthlyLeaderBoardBtn.xOffset = "38%" as any
        //this.monthlyLeaderBoardBtn.height = "40%" as any
      }
      this.monthlyLeaderBoardBtn.height = 110 * _scale
      this.monthlyLeaderBoardBtn.width = 320 * _scale
    }
  }
  show(): void {
    this.socialMediaPanel.show()
  }
  hide(): void {
    this.socialMediaPanel.hide()
  }

}

export class SocialMediaPanel implements Modal{
  twitterButton: ui.MediumIcon
  discordButton: ui.MediumIcon;
  websiteButton: ui.MediumIcon;

  constructor() {
    //width?: number*: Image width on screen in pixels. 
    //Default value depends on icon's type (32 for SmallIcon, 64 for MediumIcon and 128 for LargeIcon).

    const xOffset = -64
    this.twitterButton = ui.createComponent(ui.MediumIcon, 
      { 
        image: CUSTOM_ATLAS, startHidden:false, xOffset: xOffset*1,
        section: atlas_mappings.icons.twitter
      }
      )  
    this.twitterButton.imageElement.onMouseDown = ()=>{
      _openExternalURL("https://twitter.com/MetaGamiMall")
    }

    this.discordButton = ui.createComponent(ui.MediumIcon, 
      { 
        image: CUSTOM_ATLAS, startHidden:false, xOffset: xOffset*2,
        section: atlas_mappings.icons.discord
      }
    ) 
    this.discordButton.imageElement.onMouseDown = ()=>{
      _openExternalURL("https://discord.com/invite/metalivestudio-series")
    }

    this.websiteButton = ui.createComponent(ui.MediumIcon, 
      { 
        image: CUSTOM_ATLAS, startHidden:false, xOffset: xOffset*3 ,
        section: atlas_mappings.icons.website
      }
    ) 
    this.websiteButton.imageElement.onMouseDown = ()=>{
      _openExternalURL("https://metalivestudio.com/")
    }
    
  }
  show(): void {
    this.twitterButton.show()
    this.discordButton.show()
    this.websiteButton.show()
  }
  hide(): void {
    this.twitterButton.hide()
    this.discordButton.hide()
    this.websiteButton.hide()
  }

}


export type TogglePanelArgs = {
  activeIconImageSection: ImageAtlasData;
  inActiveIconImageSection: ImageAtlasData;
};


export type GameHudVisContext = "lobby" | "game-hud" | "sub-lobby";


export class GameToolsPanel implements Modal {
  prompt: PromptWrapper<PromptExt>;
  header: TogglePanelButton
  /*gtext: UIText;
  gimagebutton: UIImage;
  gdoge: UIImage;*/
  //petPanel: SummonPetRobotPanel;
  avatarSwapPanel: AvatarSwapPanel;
  /*locationPanel: LocationPanel;
  startEndGamePanel: StartEndGamePanel;*/
  gameToolsLowerScreen: GameToolsLowerScreen
  
  
  //visitMetaGamiMall: VisitGamiMallPanel;

  //rafflePanel
  InventoryPanel
  //GameguidePanel
  ReloginPanel
  RefreshPanel
  leaderBoardPanel:ShowLeaderboardPanel
  monthlyLeaderBoardPanel:ShowMonthlyLeaderboardPanel
  languagePanel:LanguagePanel

  subPanels: TogglePanelButton[] = [];

  gameHudContext?: GameHudVisContext;

  isShown: boolean;

  subPanelsVisible: boolean = false;

  screenType:number = DEFAULT_SCREEN_TYPE

  constructor() {
    
    let promptExtWrap = this.prompt = new PromptWrapper(
      ui.createComponent(PromptExt, 
          //{ style: ui.PromptStyles.DARKSLANTED } //is exactly the claim UI
          { style: ui.PromptStyles.DARK } //is mostly right, need to modify selection
      )
    ) 
    let promptExt = ((this.prompt._prompt as unknown) as PromptExt)
    promptExt._hAlignment = "right"
     
    promptExtWrap.setTexture(CUSTOM_ATLAS)
    promptExtWrap.setSelection(atlas_mappings.backgrounds.transparent)
    promptExtWrap.removeCloseIcon()
    //setBackgroundTexture(promptExtWrap._prompt., CUSTOM_ATLAS)


    this.header = new TogglePanelButton(this.prompt, {key:"gameTool"
      , params:{ns:namespaces.ui.sideButton}}, 200, () => {},{
        activeIconImageSection: atlas_mappings.icons.gametools,
        inActiveIconImageSection: atlas_mappings.icons.gametools
      })
    //redefine the atlas for header
    setSelectionUv(this.header.menuPanel.imageElement, atlas_mappings.backgrounds.expandPanel)
    //make a little bigger
    //debugger
    
    //headerImgAny._width = BASE_WIDTH_SIZE * HEADER_SCALE
    //headerImgAny._height = BASE_HEIGHT_SIZE * HEADER_SCALE 
     
    
    /*this.gimagebutton = new UIImage(canvas, custUiAtlas);
    this.gimagebutton.positionY = "34.5%";
    this.gimagebutton.positionX = "43%";
    setSection(this.gimagebutton, atlas_mappings.backgrounds.expandPanel);
    this.gimagebutton.width = 150 * SCALE_UIImage;
    this.gimagebutton.height = 60;
    */
    
    this.gameToolsLowerScreen = new GameToolsLowerScreen();
    
    
    //this.petPanel = new SummonPetRobotPanel();
    //this.avatarSwapPanel = new AvatarSwapPanel(this.prompt);
    
    //this.startEndGamePanel = new StartEndGamePanel();
    //this.locationPanel = new LocationPanel();
    //this.rafflePanel = new RafflePanel();
    this.InventoryPanel = new InventoryPanel(this.prompt);
    //this.GameguidePanel = new GameguidePanel();
    this.ReloginPanel = new ReloginPanel(this.prompt);
    this.RefreshPanel = new RefreshPanel(this.prompt);
    //this.visitMetaGamiMall = new VisitGamiMallPanel(this.prompt);
    this.leaderBoardPanel = new ShowLeaderboardPanel(this.prompt)
    if(CONFIG.SIDE_BAR_LANGUAGE_PICKER_ENABLED) this.languagePanel = new LanguagePanel(this.prompt)

    //this.monthlyLeaderBoardPanel = new ShowMonthlyLeaderboardPanel(this.prompt)
   
    if(this.gameToolsLowerScreen) this.gameToolsLowerScreen.show();
 
    
    //this.subPanels.push(this.avatarSwapPanel);
    //this.subPanels.push(this.petPanel);
    //this.subPanels.push(this.locationPanel);
    //this.subPanels.push(this.startEndGamePanel);
    //this.subPanels.push(this.rafflePanel);
    this.subPanels.push(this.InventoryPanel);
    //this.subPanels.push(this.GameguidePanel);
    
    this.subPanels.push(this.ReloginPanel);
    this.subPanels.push(this.RefreshPanel);
    if(this.leaderBoardPanel) this.subPanels.push(this.leaderBoardPanel);
    if(this.monthlyLeaderBoardPanel) this.subPanels.push(this.monthlyLeaderBoardPanel);
    if(this.languagePanel) this.subPanels.push(this.languagePanel);
    //this.subPanels.push(this.visitMetaGamiMall)
    
    this.updateSubPanelPositions();

 
    //this.isShown = false;
    
    /*this.gimagebutton.onClick = new OnPointerDown((e) => {
      this.isShown = !this.isShown;
      if (this.isShown) {
        this.setSubPanelsVisible(true);
      } else {
        this.setSubPanelsVisible(false);
      }
    });

    this.gimagebutton.visible = false;
    this.gdoge = new UIImage(canvas, custUiAtlas);
    this.gdoge.positionY = "34%";
    this.gdoge.positionX = "39.5%";
    setSection(this.gdoge, atlas_mappings.icons.gametools);

    this.gdoge.height = 23 * SCALE_UIImage;
    this.gdoge.width = 25 * SCALE_UIImage;
    this.gdoge.positionX = "39%";
    this.gdoge.isPointerBlocker = false;
    this.gdoge.visible = false;

    this.gtext = new UIText(canvas);
    this.gtext.value = i18n.t("gameTool", {ns:namespaces.ui.sideButton});
    this.gtext.positionY = "38%";
    this.gtext.positionX = "44%";
    this.gtext.color = Color4.White();
    this.gtext.isPointerBlocker = false;
    this.gtext.fontSize = 11 * SCALE_FONT_PANEL;
    this.gtext.visible = false;

    i18nOnLanguageChangedAdd((lng:string) => {
      this.gtext.value = i18n.t("gameTool",{ns:namespaces.ui.sideButton})
    })
    */
   this.applyUIScaling()
  }
  setScreenType(type:number){
    this.screenType=type
    this.gameToolsLowerScreen.screenType = type
  }
  applyUIScaling(){
    let SCREEN_TYPE = this.screenType

    this.prompt._prompt.width = SCREEN_TYPE == SCREEN_STANDARD ? 170 : 170
    //making small height so is not cursor blocking
    this.prompt._prompt.height = SCREEN_TYPE == SCREEN_STANDARD ? -50 : -100
    //promptExtWrap._prompt.height = 200
    //promptExt._prompt.width = 200
    //promptExt._prompt.

    const headerImgAny = this.header.menuPanel as any
    const BASE_WIDTH_SIZE = 184
    const BASE_HEIGHT_SIZE = 46
    const HEADER_SCALE = SCREEN_TYPE == SCREEN_STANDARD ? 1.05 : 2

    this.header.menuPanel.labelElement.fontSize = SCREEN_TYPE == SCREEN_STANDARD ? 15 + 5 : 26 + 5

    if(this.header.menuPanel.imageElement.uiTransform){
      this.header.menuPanel.imageElement.uiTransform.width = BASE_WIDTH_SIZE * HEADER_SCALE
      this.header.menuPanel.imageElement.uiTransform.height = BASE_HEIGHT_SIZE * HEADER_SCALE
    } 
    setButtonIconPos(this.header.menuPanel, SCREEN_TYPE == SCREEN_STANDARD ? -60 : -110 )
 
    for (let p in this.subPanels) {
      this.subPanels[p].screenType = SCREEN_TYPE
      this.subPanels[p].applyUIScaling()
    }
    this.updateSubPanelPositions()

    this.gameToolsLowerScreen.applyUIScaling()
  }
  updateSubPanelPositions(){
    let SCREEN_TYPE = this.screenType

    let startPos = this.header.menuPanel.yPosition
    let increment = SCREEN_TYPE == SCREEN_STANDARD ? -40 : -70

    startPos += increment
    
    for (let p in this.subPanels) {
      if(this.subPanels[p].enableDisplay === false){
        this.subPanels[p].hide()
        continue
      }
      this.subPanels[p].updatePositionY(startPos)
      startPos += increment
    }
  }
  updateHudContext(ctx: GameHudVisContext) {
    this.gameHudContext = ctx;
    this.setSubPanelsHudeContext(ctx);
    this.updateSubPanels();
  }
  updateSubPanels() {
    if (this.subPanelsVisible) {
      this.setSubPanelsVisible(true);
    }
  }
  setSubPanelsVisible(val: boolean) {
    this.subPanelsVisible = val;
    for (let p in this.subPanels) {
      if (val) {
        this.subPanels[p].show();
      } else {
        this.subPanels[p].hide();
      }
    }
  }
  setSubPanelsHudeContext(ctx: GameHudVisContext) {
    //if(this.startEndGamePanel) this.startEndGamePanel.updateHudContext(ctx);
  }
  show(): void {
    this.prompt.show()
    if(this.header) this.header.show()
    
    this.setSubPanelsVisible(true)
    if(this.gameToolsLowerScreen) this.gameToolsLowerScreen.show()
  }
  hide(): void {
    this.prompt.hide()
    if(this.header) this.header.hide()
    
    if(this.gameToolsLowerScreen) this.gameToolsLowerScreen.hide()

    this.setSubPanelsVisible(false)
  }
}


export class TogglePanelButton implements Modal {
  menuPanel: PromptButton
  /*avatarText: UIText;
  avatarButton: UIImage;
  gcoin: UIImage;*/
  activeIconImageAtlasData: ImageAtlasData = atlas_mappings.icons.coin;
  inActiveIconImageAtlasData: ImageAtlasData = atlas_mappings.icons.gametools;
  enableDisplay: boolean = true
  screenType:number = DEFAULT_SCREEN_TYPE

  constructor(
    parent: PromptWrapper<ui.CustomPrompt>,
    i18nProps: string | I18NParamsType,
    positionYPercent: number,
    callback: () => void,
    opts?: TogglePanelArgs
  ) {
    if (opts && opts.activeIconImageSection !== undefined)
      this.activeIconImageAtlasData = opts.activeIconImageSection;
    if (opts && opts.inActiveIconImageSection !== undefined)
      this.inActiveIconImageAtlasData = opts.inActiveIconImageSection;

    const isI18nProp = typeof i18nProps !== "string"//i18nProps.hasOwnProperty( 'key')
    
    const menuPanel = this.menuPanel = parent._prompt.addButton(
      {  
        text: isI18nProp ? i18n.t(i18nProps.key,i18nProps.params) : i18nProps,
        xPosition: 0,
        yPosition: positionYPercent,
        onMouseDown: ()=>{ callback() },
        style: ui.ButtonStyles.F //workaround to enable button icon,next will undo the side effects
      }
    )
      
    //workaround to disable key listener but still let it do show/hide
    clearButtonSystemInputListener(menuPanel)
 
    //TODO solve aligning the text right now no uiTransform for me to modify its positionin

    setBackgroundTexture(this.menuPanel.imageElement, CUSTOM_ATLAS)
    setSelectionUv(this.menuPanel.imageElement, atlas_mappings.buttons.togglePanel)

    setBackgroundTexture(this.menuPanel.iconElement, CUSTOM_ATLAS)
    //setSelectionUv(this.menuPanel.iconElement, atlas_mappings.buttons.togglePanel)
    this.setActive(false)
    
    //menuPanel.iconElement.uiTransform

    /*ui.createComponent(MenuPromptButton, 
      {   
        parent: parent,
        text: isI18nProp ? i18n.t(i18nProps.key,i18nProps.params) : i18nProps,
        xPosition: 0,
        yPosition: 0,
        onMouseDown: ()=>{ callback() }
      }
      ) */ 
    /*this.avatarButton = new UIImage(canvas, custUiAtlas);

    //this.avatarButton.positionY = positionYPercent + -4 + "%";
    this.avatarButton.positionX = "43%";
    this.avatarButton.sourceLeft = 2364;
    this.avatarButton.sourceTop = 3496; 
    this.avatarButton.sourceWidth = 508;
    this.avatarButton.sourceHeight = 140;
    this.avatarButton.width = 140 * SCALE_UIImage;
    this.avatarButton.onClick = new OnPointerDown((e) => {
      callback();
    });
    this.avatarButton.visible = false;

    this.gcoin = new UIImage(canvas, custUiAtlas);
    //this.gcoin.positionY = positionYPercent + -3.8 + "%";
    this.gcoin.positionX = "39.2%";    
    this.gcoin.height = 23 * SCALE_UIImage;
    this.gcoin.width = 23 * SCALE_UIImage;
    this.gcoin.isPointerBlocker = false;
    this.gcoin.visible = false;
    setSection(this.gcoin, this.activeIconImageAtlasData);
    */
    
    /*
    this.avatarText = new UIText(canvas);
    this.avatarText.value = isI18nProp ? i18n.t(i18nProps.key,i18nProps.params) : i18nProps;
    //this.avatarText.positionY = positionYPercent + -1 + "%"; //panel text CS
    this.avatarText.positionX = "44.5%";
    this.avatarText.color = Color4.White();
    this.avatarText.fontSize = 11 * SCALE_FONT_PANEL;
    this.avatarText.visible = false;
    this.avatarText.isPointerBlocker = false;*/
    
    this.updatePositionY(positionYPercent)

    if(isI18nProp){
      i18nOnLanguageChangedAdd((lng) => {
        this.menuPanel.text = i18n.t(i18nProps.key,i18nProps.params);
      })
    }
    this.applyUIScaling()
  }
  applyUIScaling(){
    let SCREEN_TYPE = this.screenType

    const BASE_WIDTH_SIZE = 160
    const BASE_HEIGHT_SIZE = 46
    const HEADER_SCALE = SCREEN_TYPE == SCREEN_STANDARD ? 1.05 : 2

    if(this.menuPanel.imageElement.uiTransform){
      this.menuPanel.imageElement.uiTransform.width = BASE_WIDTH_SIZE * HEADER_SCALE
      this.menuPanel.imageElement.uiTransform.height = BASE_HEIGHT_SIZE * HEADER_SCALE
    } 
    this.menuPanel.labelElement.fontSize = SCREEN_TYPE == SCREEN_STANDARD ? 15 : 26 

    //this.menuPanel.he
    //workaround to positioning the icon
    setButtonIconPos(this.menuPanel, SCREEN_TYPE == SCREEN_STANDARD ? -55 : -100 )

    this.menuPanel.labelElement.fontSize = SCREEN_TYPE == SCREEN_STANDARD ? 15 : 30
  }
  updatePositionY( positionYPercent: number ){
    this.menuPanel.yPosition = positionYPercent
    //this.menuPanel.yPosition = positionYPercent + -4 + "%";
    /*this.gcoin.positionY = positionYPercent + -3.8 + "%";
    this.avatarButton.positionY = positionYPercent + -4 + "%";
    this.avatarText.positionY = positionYPercent + -1 + "%"; //panel text CS
    */
  }
  setActiveImageAtlasData(imgSection: ImageAtlasData) {
    this.activeIconImageAtlasData;
  }
  setActive(val: boolean) {
    //if(!this.menuPanel.iconElement.uiBackground) return
    //FIXME i think at its core we flipped active vs inactive
    if (val) {
      setSelectionUv(this.menuPanel.iconElement,this.inActiveIconImageAtlasData)
      //this.menuPanel.iconElement.uiBackground.uvs = getImageAtlasMapping(this.inActiveIconImageAtlasData)
    } else {
      setSelectionUv(this.menuPanel.iconElement,this.activeIconImageAtlasData)
      //this.menuPanel.iconElement.uiBackground.uvs = getImageAtlasMapping(this.activeIconImageAtlasData)
    }
  }
  show(): void {
    if(this.enableDisplay === false) return
    
    this.menuPanel.show()
  }
  hide(): void {
    this.menuPanel.hide()
  }
}


export class VisitGamiMallPanel extends TogglePanelButton {
  constructor(parent: PromptWrapper<ui.CustomPrompt>) {
    super(
      parent,
      {key:"visitGamiMall", params:{ns:namespaces.ui.sideButton}},
      30,
      () => {
        _teleportTo( 145,60 )
      },
      {
        activeIconImageSection: atlas_mappings.icons.avatarswap,
        inActiveIconImageSection: atlas_mappings.icons.avatarswap_off,
      }
    );
  }
}

export class AvatarSwapPanel extends TogglePanelButton {
  constructor(parent: PromptWrapper<ui.CustomPrompt>) {
    super(
      parent,
      {key:"avatarSwap", params:{ns:namespaces.ui.sideButton}},
      30,
      () => {
        //do avatar swap
        log("REGISTRY.toggles", REGISTRY.toggles);
        REGISTRY.toggles.doAvatarSwap();
      },
      {
        activeIconImageSection: atlas_mappings.icons.avatarswap,
        inActiveIconImageSection: atlas_mappings.icons.avatarswap_off,
      }
    );
  }
}
export class SummonPetRobotPanel extends TogglePanelButton {
  constructor(parent: PromptWrapper<ui.CustomPrompt>) {
    super(
      parent,
      {key:"summonPet", params:{ns:namespaces.ui.sideButton}},
      24,
      () => {
        log("clicked personalAssistantEnableIcon on ");
        log("REGISTRY.toggles", REGISTRY.toggles);
        REGISTRY.toggles.togglePersonalAssistant();
      },
      {
        activeIconImageSection: atlas_mappings.icons.summonpet,
        inActiveIconImageSection: atlas_mappings.icons.summonpet_off,
      }
    );
  }
}
/*
export class LocationPanel extends TogglePanelButton {
  constructor(parent: PromptWrapper<ui.CustomPrompt>) {
    super(
      parent,
      {key:"locationButton", params:{ns:namespaces.ui.sideButton}},
      18,
      () => {
        log("clicked LocationEnableIcon on ");
        log("REGISTRY.toggles", REGISTRY.toggles);
        REGISTRY.toggles.toggleLocation();
        if (GAME_STATE.locationEnabled) {
          mapModal.show();
        } else {
          mapModal.hide();
        }
      },
      {
        activeIconImageSection: atlas_mappings.icons.locationicon,
        inActiveIconImageSection: atlas_mappings.icons.locationicon_off,
      }
    );
  }
}*/
export class RafflePanel extends TogglePanelButton {
  constructor(parent: PromptWrapper<ui.CustomPrompt>) {
    super(
      parent,
      {key:"raffleButton", params:{ns:namespaces.ui.sideButton}},
      12,
      () => {
        log("clicked RafflePanel  ");

        //TODO needed for PX?
        //REGISTRY.ui.openRaffleGamePrompt()
        /*log("REGISTRY.toggles", REGISTRY.toggles);
        REGISTRY.toggles.toggleLocation();
        if (GAME_STATE.locationEnabled) {
          mapModal.show();
        } else {
          mapModal.hide();
        }*/
      },
      {
        activeIconImageSection: atlas_mappings.icons.raffleicon,
        inActiveIconImageSection: atlas_mappings.icons.raffleicon_off,
      }
    );
  }
}

export class InventoryPanel extends TogglePanelButton {
  constructor(parent: PromptWrapper<ui.CustomPrompt>) {
    super(
      parent,
      {key:"inventoryButton", params:{ns:namespaces.ui.sideButton}},
      6,
      () => {
        log("clicked InventoryPanel ");
        //TODO bring back
        if(REGISTRY.ui.inventoryPrompt.isVisibile()){
          REGISTRY.ui.inventoryPrompt.hide()
        }else{
          REGISTRY.ui.inventoryPrompt.show()
        }
      },
      {
        activeIconImageSection: atlas_mappings.icons.inventoryicon_on,
        inActiveIconImageSection: atlas_mappings.icons.inventoryicon_off,
      }
    );
  }
}
/*
export class GameguidePanel extends TogglePanelButton {
  constructor(parent: PromptWrapper<ui.CustomPrompt>) {
    super(
      parent,
      {key:"gameGuide", params:{ns:namespaces.ui.sideButton}},
      0,
      () => {
        log("clicked GameguidePanel ");
        Howtoplayposter.visible = true
        Entryposter1Close.visible = true
        Entryposter1text.visible = true
        Entryposter2.visible = false
        Entryposter2Close.visible = false
        Entryposter2text.visible = false
        Entryposter2Back.visible = false
        Entryposter2textback.visible = false
        Entryposter3.visible = false
        Entryposter3Close.visible = false
        Entryposter3text.visible = false
        Entryposter3Back.visible = false
        Entryposter3textback.visible = false
      },
      {
        activeIconImageSection: atlas_mappings.icons.GameGuideicon_on,
        inActiveIconImageSection: atlas_mappings.icons.GameGuideicon_off,
      }
    );
  }
}
*/
export class ReloginPanel extends TogglePanelButton {
  constructor(parent: PromptWrapper<ui.CustomPrompt>) {
    const announcement = ui.createComponent(ui.Announcement, { value: i18n.t("attemptRelogin", {ns:namespaces.ui.prompts}), duration: 3 })
    super(
      parent,
      {key:"reloginButton", params:{ns:namespaces.ui.sideButton}},
      -6,
      () => {
        log("clicked ReloginPanel ");
       
        if(!reloginCooldown.update()){
          log("RELOGIN cooldown hit, wait a little longer")
          //ui.displayAnnouncement("")
          return;
        }
        showConnectingStarted()
        announcement.value = i18n.t("attemptRelogin", {ns:namespaces.ui.prompts})
        announcement.show( 3 )
        
        

        const reloginWork = ()=>{
          REGISTRY.intervals.connectCheckInterval.reset()
          //reset retries
          GAME_STATE.connectRetryCount = 0
          resetLoginState();
          if(GAME_STATE.playerState){ 
            GAME_STATE.playerState.requestDoLoginFlow();
          }
        }
  
        try{
          if (GAME_STATE.gameRoom){
            executeTask(async () => {
              //TODO figure out how to check for is connected a better way
              //when already disconnected bombs hard :( workaround
              disconnect(true)
              return true
            });
              
            utils.timers.setTimeout(()=>{
              //when already disconnected bombs hard :( workaround force disconnected state
              GAME_STATE.setGameConnected('disconnected',"RELOGIN_BTN_post_disconnected")
              GAME_STATE.gameRoom = undefined
              reloginWork()
            },500)
          }else{
            //when already disconnected bombs hard :( workaround force disconnected state
            GAME_STATE.setGameConnected('disconnected',"RELOGIN_BTN_never_connected")
            GAME_STATE.gameRoom = undefined
            reloginWork()
          }
        }catch(e){
          log("failed to relogin",e)
        }
      },
      {
        activeIconImageSection: atlas_mappings.icons.Reloginicon_on,
        inActiveIconImageSection: atlas_mappings.icons.Reloginicon_off,
      }
    );
  }
}

export class RefreshPanel extends TogglePanelButton {
  constructor(parent: PromptWrapper<ui.CustomPrompt>) {
    super(
      parent,
      {key:"refreshSave", params:{ns:namespaces.ui.sideButton}},
      -12,
      () => {
        log("clicked RefreshPanel ");
        GAME_STATE.gameRoom?.send("save-game",{}),
        executeTask(async () => {
          //TODO is this needed for PX
          //updateStoreNFTCounts()
        })
      },
      {
        activeIconImageSection: atlas_mappings.icons.Refreshicon_on,
        inActiveIconImageSection: atlas_mappings.icons.Refreshicon_off,
      }
    );
  }
}


export class ShowMonthlyLeaderboardPanel extends TogglePanelButton {
  constructor(parent: PromptWrapper<ui.CustomPrompt>) {
    super(
      parent,
      {key:"showMonthLeaderBoard", params:{ns:namespaces.ui.sideButton}},
      -18,
      () => {
        log("clicked ShowMonthlyLeaderboardPanel ");
        //open modal, fetch data
        //TODO is this needed for PX
        if(REGISTRY.ui.openLeaderboardMonthly){
          REGISTRY.ui.openLeaderboardMonthly()
        }else{ 
          log("ShowMonthlyLeaderboardPanel","ERROR!!! REGISTRY.ui.openLeaderboardMonthly is undefined")
        }
      },
      {
        activeIconImageSection: atlas_mappings.icons.LeaderBoardicon_on,
        inActiveIconImageSection: atlas_mappings.icons.LeaderBoardicon_off,
      }
    );
  }
}
export class ShowLeaderboardPanel extends TogglePanelButton {
  constructor(parent: PromptWrapper<ui.CustomPrompt>) {
    super(
      parent,
      {key:"showLvlLeaderBoard", params:{ns:namespaces.ui.sideButton}},
      -18,
      () => {
        log("clicked ShowLeaderboardPanel ");
        //open modal, fetch data
        //TODO is this needed for PX
        if(REGISTRY.ui.openLeaderboardLevelEpoch){
          REGISTRY.ui.openLeaderboardLevelEpoch()
        }else{ 
          log("ShowLeaderboardPanel","ERROR!!! REGISTRY.ui.openLeaderboardLevelEpoch is undefined")
        }
      },
      {
        activeIconImageSection: atlas_mappings.icons.LeaderBoardicon_on,
        inActiveIconImageSection: atlas_mappings.icons.LeaderBoardicon_off,
      }
    );
  }
}

let pickLanguagePrompt:PickLanguagePrompt

export class LanguagePanel extends TogglePanelButton {
  constructor(parent: PromptWrapper<ui.CustomPrompt>) {
    super(
      parent,
      {key:"language", params:{ns:namespaces.ui.sideButton}},
      -24,
      () => {
        log("clicked Language ");
        pickLanguagePrompt.show()
        //open modal, fetch data
        //REGISTRY.ui.openLeaderboardLevelEpoch()
      },
      { 
        activeIconImageSection: atlas_mappings.icons.language_on,
        inActiveIconImageSection: atlas_mappings.icons.language_off,
      }
    );
  }
}

export function initUIBGModals(){
  // 

  pickLanguagePrompt = new PickLanguagePrompt(
    {key:"pickLanuage", params:{ns:namespaces.ui.prompts}}, ""
    , 
    {key:"button.ok", params:{ns:namespaces.common}}
    )
  //const socialMediaPanel = new SocialMediaPanel();
  //socialMediaPanel.show()


  const gameTools = new GameToolsPanel();
  gameTools.show()
  
  REGISTRY.ui.gameTools = gameTools

  const staminaPanel = new StaminaPanel();
  
  CONFIG.GAME_COIN_CAP_ENABLED = true
  staminaPanel.show()
  staminaPanel.setMultiplier(1.2)
  staminaPanel.updateTime("UTC 22:24")
  staminaPanel.updateCoins(21231312)
  staminaPanel.updateDollars(89898)

  REGISTRY.ui.staminaPanel = staminaPanel
  
  
  onCanvasInfoChangedObservable.add((info)=>{
    log("staminaPanel.onCanvasInfoChangedObservable","ENTRY",info)
    if(!info){
      return
    }
    const scale = info.height / 1080
    

    if(scale > 1){
      staminaPanel.screenType = SCREEN_RETINA
      gameTools.setScreenType(SCREEN_RETINA)
      leaderBoardsConfigs.forEach((config)=>{
        config.daily().forEach((item)=>{ item.setScreenType(SCREEN_RETINA) })
        config.weekly().forEach((item)=>{ item.setScreenType(SCREEN_RETINA) })
        config.hourly().forEach((item)=>{ item.setScreenType(SCREEN_RETINA) })
        config.monthly().forEach((item)=>{ item.setScreenType(SCREEN_RETINA) })
        config.raffleCoinBag().forEach((item)=>{ item.setScreenType(SCREEN_RETINA) })
      })
    }else{
      staminaPanel.screenType = SCREEN_STANDARD
      gameTools.setScreenType(SCREEN_STANDARD )
      leaderBoardsConfigs.forEach((config)=>{
        config.daily().forEach((item)=>{ item.setScreenType(SCREEN_STANDARD) })
        config.weekly().forEach((item)=>{ item.setScreenType(SCREEN_STANDARD) })
        config.hourly().forEach((item)=>{ item.setScreenType(SCREEN_STANDARD) })
        config.monthly().forEach((item)=>{ item.setScreenType(SCREEN_STANDARD) })
        config.raffleCoinBag().forEach((item)=>{ item.setScreenType(SCREEN_STANDARD) })
      })
    }
    log("staminaPanel.onCanvasInfoChangedObservable",info,"scale",scale,"screenType",staminaPanel.screenType)

    
    leaderBoardsConfigs.forEach((config)=>{
      config.daily().forEach((item)=>{ item.applyUIScaling()})
      config.weekly().forEach((item)=>{ item.applyUIScaling() })
      config.hourly().forEach((item)=>{ item.applyUIScaling() })
      config.monthly().forEach((item)=>{ item.applyUIScaling() })
      config.raffleCoinBag().forEach((item)=>{ item.applyUIScaling() })
    })
    staminaPanel.applyUIScaling() 
    gameTools.applyUIScaling() 
  })
  

  let lastTime = -1;
  utils.timers.setTimeout(()=>{
    //no need to fire every second as it updates on the minute
    //new utils.Interval(2000, () => {
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
    //})
  },2000);



  getAndSetRealmDataIfNull().then(()=>{
      //fetch and add multiplier
      fetchMultiplier(GAME_STATE.playerState.dclUserRealm).then((res:CheckMultiplierResultType )=>{
        if(res !== undefined && res.ok && res.multiplier){
          REGISTRY.ui.staminaPanel.setMultiplier( res.multiplier )
        }
      })
    }
  )

  //TODO
  /*
  REGISTRY.ui.gameTools = new GameToolsPanel();
  REGISTRY.ui.gameTools.show();
  REGISTRY.ui.gameTools.setSubPanelsVisible(true);
  */
}
