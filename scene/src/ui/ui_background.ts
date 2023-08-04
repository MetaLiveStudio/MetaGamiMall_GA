import * as ui from "@dcl/ui-scene-utils";
import { CONFIG, initConfig } from "src/config";
import { initRegistry, Registry, REGISTRY } from "src/registry";
import { GAME_STATE, initGameState,PlayerState } from "src/state";
import { CustomMapPrompt, custUiAtlas, I18NParamsType, Modal, PickLanguagePrompt} from "./modals";
import { setSection } from "../dcl-scene-ui-workaround/resources";
import atlas_mappings from "./atlas_mappings";
import { ImageSection } from "node_modules/@dcl/ui-scene-utils/dist/utils/types";
import { logChangeListenerEntry, Logger } from "src/logging";
import { movePlayerTo } from "@decentraland/RestrictedActions";
import { getCoinCap, getLevelFromXp, getLevelPercentFromXp, getXPFromLevel } from "src/modules/leveling/levelingUtils";
import * as utils from "@dcl/ecs-scene-utils";
import { getHelmetBalance, NftBalanceResponse, updateStoreNFTCounts } from "src/store/fetch-utils";
import { resetLoginState } from "src/gamimall/login-flow";
import { disconnect, showConnectingStarted } from "src/gamimall/connection";
import { IntervalUtil } from "src/meta-decentrally/modules/interval-util";
import { i18n, i18nOnLanguageChangedAddReplace, i18nOnLanguageChangedAdd } from "src/i18n/i18n";
import { namespaces } from "src/i18n/i18n.constants";

const canvas = ui.canvas;
canvas.isPointerBlocker = true;
const reloginCooldown = new IntervalUtil(3000,'abs-time')
//const custUiAtlas = new Texture("images/dialog-dark-atlas-v3-semi-tran.png");

initRegistry();
initConfig();
initGameState(); 

//work around 99.99 rounding up to 100 :(
//https://stackoverflow.com/questions/4187146/truncate-number-to-two-decimal-places-without-rounding
function toFixed(num:number, fixed:number) {
  if(num !== undefined && num !== null){
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    const str = num.toString()
    if(re.test(str)){
      return str.match(re)[0];
    }
  }
  log("toFixed","WARNING!!!", "failed for " + num + " fixed " + fixed)
  return "NaN";
} 

const MASTER_SCALE = 1.2;

const SCALE_FONT_TITLE = MASTER_SCALE;
const SCALE_FONT = MASTER_SCALE;
const SCALE_FONT_PANEL = MASTER_SCALE;

const SCALE_UIImage = MASTER_SCALE;
const SCALE_UIImage_PERCENT = MASTER_SCALE;
const SCALE_UITextPostion_PERCENT = 0.8;


let AtlasEntryposter1 = "images/ui/Entryposter1.png"
let AtlasEntryposter2 = "images/ui/Entryposter2.png"
let AtlasEntryposter3 = "images/ui/Entryposter3.png"
let AtlasHowtoplay = "images/HowtoPlay.png"

let Entryposter1Texture = new Texture(AtlasEntryposter1)
let Entryposter2Texture = new Texture(AtlasEntryposter2)
let Entryposter3Texture = new Texture(AtlasEntryposter3)
let HowtoplayTexture = new Texture(AtlasHowtoplay)

export const Howtoplayposter = new UIImage(canvas, HowtoplayTexture)
Howtoplayposter.sourceLeft = 0;
Howtoplayposter.sourceTop = 0;
Howtoplayposter.sourceWidth = 2400;
Howtoplayposter.sourceHeight = 1200;
Howtoplayposter.vAlign = "center"
Howtoplayposter.width = 900
Howtoplayposter.height = 450
Howtoplayposter.visible = false

const Entryposter3 = new UIImage(canvas, Entryposter3Texture)
Entryposter3.sourceLeft = 0;
Entryposter3.sourceTop = 0;
Entryposter3.sourceWidth = 2400;
Entryposter3.sourceHeight = 1200;
Entryposter3.vAlign = "center"
Entryposter3.width = 900
Entryposter3.height = 450
Entryposter3.visible = false

const Entryposter2 = new UIImage(canvas, Entryposter2Texture)
Entryposter2.sourceLeft = 0;
Entryposter2.sourceTop = 0;
Entryposter2.sourceWidth = 2400;
Entryposter2.sourceHeight = 1200;
Entryposter2.vAlign = "center"
Entryposter2.width = 900
Entryposter2.height = 450
Entryposter2.visible = false

const Entryposter1 = new UIImage(canvas, Entryposter1Texture)
Entryposter1.sourceLeft = 0;
Entryposter1.sourceTop = 0;
Entryposter1.sourceWidth = 2400;
Entryposter1.sourceHeight = 1200;
Entryposter1.vAlign = "center"
Entryposter1.width = 900
Entryposter1.height = 450
Entryposter1.visible = false

const Entryposter3Close = new UIImage(canvas, custUiAtlas)
Entryposter3Close.positionY = -157;
Entryposter3Close.positionX = 70;
Entryposter3Close.sourceLeft = 2010;
Entryposter3Close.sourceTop = 2400;
Entryposter3Close.sourceWidth = 400;
Entryposter3Close.sourceHeight = 200;
Entryposter3Close.height = 60 * SCALE_UIImage
Entryposter3Close.width = 125 * SCALE_UIImage;
Entryposter3Close.visible = false
Entryposter3Close.onClick = new OnPointerDown((e) => {
  Entryposter3.visible = false
  Entryposter3Close.visible = false
  Entryposter3text.visible = false
  Entryposter3Back.visible = false
  Entryposter3textback.visible =false
})

const Entryposter3Back = new UIImage(canvas, custUiAtlas)
Entryposter3Back.positionY = -157;
Entryposter3Back.positionX = -70;
Entryposter3Back.sourceLeft = 2010;
Entryposter3Back.sourceTop = 2400;
Entryposter3Back.sourceWidth = 400;
Entryposter3Back.sourceHeight = 200;
Entryposter3Back.height = 60 * SCALE_UIImage
Entryposter3Back.width = 125 * SCALE_UIImage;
Entryposter3Back.visible = false
Entryposter3Back.onClick = new OnPointerDown((e) => {
  Entryposter3.visible = false
  Entryposter3Close.visible = false
  Entryposter3text.visible = false
  Entryposter3Back.visible = false
  Entryposter3textback.visible = false
  Entryposter2.visible = true
  Entryposter2Close.visible = true
  Entryposter2text.visible = true
  Entryposter2Back.visible = true
  Entryposter2textback.visible = true
})

const Entryposter2Close = new UIImage(canvas, custUiAtlas)
Entryposter2Close.positionY = -157;
Entryposter2Close.positionX = 70;
Entryposter2Close.sourceLeft = 2010;
Entryposter2Close.sourceTop = 2400;
Entryposter2Close.sourceWidth = 400;
Entryposter2Close.sourceHeight = 200;
Entryposter2Close.height = 60 * SCALE_UIImage
Entryposter2Close.width = 125 * SCALE_UIImage;
Entryposter2Close.visible = false
Entryposter2Close.onClick = new OnPointerDown((e) => {
  Entryposter2Close.visible = false
  Entryposter2.visible = false
  Entryposter2text.visible = false
  Entryposter3Close.visible = true
  Entryposter3.visible = true
  Entryposter3text.visible = true
  Entryposter2Back.visible = false
  Entryposter2textback.visible = false
  Entryposter3Back.visible = true
  Entryposter3textback.visible = true
})

export const Entryposter1Close = new UIImage(canvas, custUiAtlas)
Entryposter1Close.positionY = -237;
Entryposter1Close.positionX = 0;
Entryposter1Close.sourceLeft = 2010;
Entryposter1Close.sourceTop = 2400;
Entryposter1Close.sourceWidth = 400;
Entryposter1Close.sourceHeight = 200;
Entryposter1Close.height = 60 * SCALE_UIImage
Entryposter1Close.width = 125 * SCALE_UIImage;
Entryposter1Close.visible = false
Entryposter1Close.onClick = new OnPointerDown((e) => {
  Entryposter1Close.visible = false
  Howtoplayposter.visible = false
  Entryposter1text.visible = false
})

const Entryposter2Back = new UIImage(canvas, custUiAtlas)
Entryposter2Back.positionY = -157;
Entryposter2Back.positionX = -70;
Entryposter2Back.sourceLeft = 2010;
Entryposter2Back.sourceTop = 2400;
Entryposter2Back.sourceWidth = 400;
Entryposter2Back.sourceHeight = 200;
Entryposter2Back.height = 60 * SCALE_UIImage
Entryposter2Back.width = 125 * SCALE_UIImage;
Entryposter2Back.visible = false
Entryposter2Back.onClick = new OnPointerDown((e) => {
  Entryposter2.visible = false
  Entryposter2Close.visible = false
  Entryposter2text.visible = false
  Entryposter2Back.visible = false
  Entryposter2textback.visible = false
  Entryposter1.visible = true
  Entryposter1Close.visible = true
  Entryposter1text.visible = true
})

const Entryposter3text = new UIText(canvas)
Entryposter3text.value = "Let's Go!!!";
Entryposter3text.fontSize = 20;
Entryposter3text.positionY = -138;
Entryposter3text.positionX = 78;
Entryposter3text.visible = false
Entryposter3text.isPointerBlocker = false

const Entryposter3textback = new UIText(canvas)
Entryposter3textback.value = "Back";
Entryposter3textback.fontSize = 20;
Entryposter3textback.positionY = -138;
Entryposter3textback.positionX = -38;
Entryposter3textback.visible = false
Entryposter3textback.isPointerBlocker = false

const Entryposter2text = new UIText(canvas)
Entryposter2text.value = "Next Page";
Entryposter2text.fontSize = 20;
Entryposter2text.positionY = -138;
Entryposter2text.positionX = 78;
Entryposter2text.visible = false
Entryposter2text.isPointerBlocker = false

const Entryposter2textback = new UIText(canvas)
Entryposter2textback.value = "Back";
Entryposter2textback.fontSize = 20;
Entryposter2textback.positionY = -138;
Entryposter2textback.positionX = -38;
Entryposter2textback.visible = false
Entryposter2textback.isPointerBlocker = false

export const Entryposter1text = new UIText(canvas)
Entryposter1text.value = i18n.t("closePoster", {ns:namespaces.pages.hello});
Entryposter1text.fontSize = 20;
Entryposter1text.positionY = -220;
Entryposter1text.positionX = 28;
Entryposter1text.isPointerBlocker = false
Entryposter1text.visible = false

i18nOnLanguageChangedAdd((lng:string) => {
  Entryposter1text.value = i18n.t("closePoster",{ns:namespaces.pages.hello})
})

const PurplePanel = new UIImage(canvas, custUiAtlas)
PurplePanel.positionY = "57%";
PurplePanel.positionX = "15%";
PurplePanel.sourceLeft = 1300;
PurplePanel.sourceTop = 2786;
PurplePanel.sourceWidth = 400;
PurplePanel.sourceHeight = 600;
PurplePanel.height = 170 
PurplePanel.width = 100 ;
PurplePanel.visible = false //hidden by default

const bronzePadPassCard = new UIImage(PurplePanel, custUiAtlas)
bronzePadPassCard.positionY = "-7%";
bronzePadPassCard.positionX = "20%";
bronzePadPassCard.sourceLeft = 1700;
bronzePadPassCard.sourceTop = 2786;
bronzePadPassCard.sourceWidth = 400;
bronzePadPassCard.sourceHeight = 600;
bronzePadPassCard.height = 170 
bronzePadPassCard.width = 110 ;

const pickLanguagePrompt = new PickLanguagePrompt(
    {key:"pickLanuage", params:{ns:namespaces.ui.prompts}}, ""
    , 
    {key:"button.ok", params:{ns:namespaces.common}}
    )
//pickLanguagePrompt.show()

export class StaminaPanel implements Modal {
  staminaPanel: UIImage;
  staminaText: UIText;
  staminaCoins: UIText;
  bronzeCoins: UIText;
  
  allTimeCoins: number
  dailyCoins:number
  level: UIText;
  levelBar: ui.UIBar;
  coinBarTxt: UIText;
  coinBar: ui.UIBar;
  levelXP: UIText;
  //levelXP: UIText;
  staminaDollars: UIText;
  staminaMultiplier: UIText;
  StaminaTime: UIText;
  multiplier:number
  
  constructor() {
    this.staminaPanel = new UIImage(canvas, custUiAtlas);
    this.staminaPanel.width = 30 * SCALE_UIImage_PERCENT + "%";
    this.staminaPanel.height = 110 * SCALE_UIImage + "px";
    this.staminaPanel.positionY = 305;
    this.staminaPanel.positionX = "31%";
    this.staminaPanel.sourceLeft = 0;
    this.staminaPanel.sourceTop = 3586;
    this.staminaPanel.sourceWidth = 1271;
    this.staminaPanel.sourceHeight = 330;
    this.staminaPanel.visible = false;

    const barY = 10
    this.levelBar = new ui.UIBar(0,0,0,Color4.Purple(),ui.BarStyles.SQUAREBLACK,1,false)
    const levelBarHeight = 20
    const levelBarFullWidth = 285
    this.levelBar.background.vAlign = 'top'
    this.levelBar.background.hAlign = 'center'
    this.levelBar.background.height = levelBarHeight
    this.levelBar.fullWidth = levelBarFullWidth
    this.levelBar.background.width = levelBarFullWidth + 2
    this.levelBar.bar.height = levelBarHeight-1
    this.levelBar.background.positionX = "31.2%"//-85;
    this.levelBar.background.positionY = barY;

    this.coinBar = new ui.UIBar(0,0,0,Color4.Purple(),ui.BarStyles.SQUAREBLACK,1,false)
    this.coinBar.background.vAlign = 'top'
    this.coinBar.background.hAlign = 'center'
    this.coinBar.background.height = levelBarHeight/2
    this.coinBar.fullWidth = levelBarFullWidth
    this.coinBar.background.width = levelBarFullWidth + 2
    this.coinBar.bar.height = (levelBarHeight/2)-1
    this.coinBar.background.positionX = "31.2%"//-85;
    this.coinBar.background.positionY = barY + (levelBarHeight/2) + 1;
    

    this.level = new UIText(canvas); 
    this.level.value = "Level 0";
    this.level.positionY = "52.8%"; //bigger goes up, smaller goes down
    this.level.positionX = "26%";
    this.level.color = Color4.White();
    this.level.visible = false;
    this.level.fontSize = 15;

    this.coinBarTxt = new UIText(canvas); 
    this.coinBarTxt.value = "Daily cap ???";
    this.coinBarTxt.positionY = "55.5%"//"52.8%"; //bigger goes up, smaller goes down
    this.coinBarTxt.positionX = "26%";
    this.coinBarTxt.color = Color4.White();
    this.coinBarTxt.visible = true;
    this.coinBarTxt.fontSize = 10;

    

    this.staminaText = new UIText(canvas);
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

    //next to gami mall left
    //this.staminaMultiplier.positionY = "58%";
    //this.staminaMultiplier.positionX = "16%";
    //next to gami mall left-little-lower
    //this.staminaMultiplier.positionY = "56%";
    //this.staminaMultiplier.positionX = "43%";

    //next to gami mall below
    //this.staminaMultiplier.positionY = "56%";
    //this.staminaMultiplier.positionX = "24%";

    this.staminaMultiplier.color = Color4.White();
    this.staminaMultiplier.visible = false;
    this.staminaMultiplier.fontSize = 12;


    this.StaminaTime = new UIText(canvas);
    this.StaminaTime.value = "00:00";
    this.StaminaTime.positionY = "48%";
    this.StaminaTime.positionX = "41%";
    this.StaminaTime.color = Color4.White();
    this.StaminaTime.visible = false;
    this.StaminaTime.fontSize = 12;
  }
  show(): void {
    this.staminaPanel.visible = true;
    this.staminaText.visible = true;
    this.staminaDollars.visible = true;
    this.staminaCoins.visible = true;
    this.bronzeCoins.visible = false//disabled for now
    this.StaminaTime.visible = true;
    this.level.visible = true 
    if(this.multiplier > 1) this.staminaMultiplier.visible = true
    this.coinBarTxt.visible = true && CONFIG.GAME_COIN_CAP_ENABLED
    this.levelBar.show()
    if(CONFIG.GAME_COIN_CAP_ENABLED) this.coinBar.show()
  }
  hide(): void {
    this.staminaPanel.visible = false;
    this.staminaText.visible = false;
    this.staminaDollars.visible = false;
    this.staminaCoins.visible = false;
    this.bronzeCoins.visible = false
    this.StaminaTime.visible = false;
    this.level.visible = false
    this.staminaMultiplier.visible = false
    this.coinBarTxt.visible = false
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
  setMultiplier(val:number){
    this.multiplier = val
    const host = this
    this.staminaMultiplier.value = i18n.t( "bonusDisplay",{value:toFixed(((val-1)*100),1),ns:namespaces.ui.staminaPanel})

    i18nOnLanguageChangedAddReplace("setMultiplier",(lng:string) => {
      //log("i18n","updateDailyCoins","onLanguageChanged",lng)
      host.setMultiplier(val)
    })
    if(this.staminaPanel.visible && val > 1){
      this.staminaMultiplier.visible = true
    }else{
      this.staminaMultiplier.visible = false
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
      this.coinBarTxt.color = Color4.White(); 
      /*this.coinBarTxt.value = "Daily Cap " + toFixed(val,1) + "/" + toFixed(maxCoinsPerLevelCeiled,0) + " " 
              + "("+ toFixed(valDiff,1) +" till max) " + toFixed(percent,1) +" %" //+ ";"+val*/
      this.coinBarTxt.value = i18n.t( "dailyCap.notMet"
        ,{ns:namespaces.ui.staminaPanel,
          currentValue:toFixed(val,1),maxValue:toFixed(maxCoinsPerLevelCeiled,0),remainingValue:toFixed(valDiff,1),currentPercent:toFixed(percent,1)
        })
      this.coinBar.set(percent/100) 
    }else{ 
      this.coinBarTxt.color = Color4.Yellow();
      this.coinBar.set(1) 
      /*this.coinBarTxt.value = "Daily Cap " + toFixed(maxCoinsPerLevelCeiled,0) + " HIT! " 
              + " Collect Ability Reduced to " + toFixed(speedCapOverageReduction,1) + "%" //+ ";"+val*/
      this.coinBarTxt.value = i18n.t( "dailyCap.hit"
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
    /*this.level.value = "Level " + Math.floor(level) + " " 
            + "("+ toFixed(nextLevelXP-num,1) +" till next) " + toFixed(getLevelPercent,1) +" %" //+ ";"+val*/
    this.level.value = i18n.t( "levelDisplay"
        ,{ns:namespaces.ui.staminaPanel,
          currentValue:Math.floor(level),currentPercent:toFixed(getLevelPercent,1),remainingValue: toFixed(nextLevelXP-num,1)})
    this.levelBar.set(percent/100)
  }
  updateBronze(text: string | number) {
    //log("updateBronze",text)   
    //stubbed place holder 
    this.bronzeCoins.value = typeof text === "string" ? text : Math.floor(text).toFixed(0)
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
    
    PurplePanel.visible = has
  }
}

const BASE_RACEPANEL_POSITION_Y = 49; //55 but lowerd it to 49 to see as error msgs over top of it
export class RacePanel implements Modal {
  racePanel: UIImage;
  raceTitle: UIText;
  raceCoins: UIText;
  raceDollars: UIText;
  raceTime: UIText;
  constructor() {
    //race bar, upper right
    this.racePanel = new UIImage(canvas, custUiAtlas);
    this.racePanel.hAlign = "center";
    this.racePanel.vAlign = "center";
    this.racePanel.positionY = BASE_RACEPANEL_POSITION_Y + "%"; //"55%";
    this.racePanel.positionX = "0%";
    this.racePanel.sourceLeft = 176;
    this.racePanel.sourceTop = 3040;
    this.racePanel.sourceWidth = 1076;
    this.racePanel.sourceHeight = 248;
    this.racePanel.width = 376 * SCALE_UIImage;
    this.racePanel.height = 76 * SCALE_UIImage;
    this.racePanel.visible = false;

    this.raceTitle = new UIText(canvas);
    this.raceTitle.value = "COIN RACE PROCESSING";
    this.raceTitle.hAlign = "center";
    this.raceTitle.vAlign = "center";
    this.raceTitle.positionY = BASE_RACEPANEL_POSITION_Y + 5 + "%";
    this.raceTitle.adaptWidth = true;
    this.raceTitle.fontSize = 12 * SCALE_FONT_TITLE;
    this.raceTitle.positionX = "0%";
    this.raceTitle.color = Color4.White();
    this.raceTitle.visible = false;

    this.raceCoins = new UIText(canvas);
    this.raceCoins.value = "x 0";
    this.raceCoins.positionY =
      BASE_RACEPANEL_POSITION_Y + 1.5 * SCALE_UITextPostion_PERCENT + "%";
    this.raceCoins.positionX = -4 * SCALE_UIImage + "%";
    this.raceCoins.color = Color4.White();
    this.raceCoins.visible = false;
    this.raceCoins.fontSize = 11 * SCALE_FONT;

    this.raceDollars = new UIText(canvas);
    this.raceDollars.value = "x 0";
    this.raceDollars.positionY =
      BASE_RACEPANEL_POSITION_Y + 1.5 * SCALE_UITextPostion_PERCENT + "%";
    this.raceDollars.positionX = "4%";
    this.raceDollars.color = Color4.White();
    this.raceDollars.visible = false;
    this.raceDollars.fontSize = 11 * SCALE_FONT;

    this.raceTime = new UIText(canvas);
    this.raceTime.value = "00:00";
    this.raceTime.positionY =
      BASE_RACEPANEL_POSITION_Y + 1.5 * SCALE_UITextPostion_PERCENT + "%";
    this.raceTime.positionX = 11.5 * SCALE_UIImage + "%";
    this.raceTime.color = Color4.White();
    this.raceTime.visible = false;
    this.raceTime.fontSize = 11 * SCALE_FONT;

    if(!CONFIG.GAME_UI_RACE_PANEL_ENABLED){
      log("RacePanel.how disabled hiding immeidatly CONFIG.GAME_UI_RACE_PANEL_ENABLED","CONFIG.GAME_UI_RACE_PANEL_ENABLED",CONFIG.GAME_UI_RACE_PANEL_ENABLED);
      this.hide()
    }
  }
  show(): void {
    if(!CONFIG.GAME_UI_RACE_PANEL_ENABLED){
      log("RacePanel.show disabled CONFIG.GAME_UI_RACE_PANEL_ENABLED","CONFIG.GAME_UI_RACE_PANEL_ENABLED",CONFIG.GAME_UI_RACE_PANEL_ENABLED);
      return;
    }
    this.racePanel.visible = true;
    this.raceDollars.visible = true;
    this.raceCoins.visible = true;
    this.raceTime.visible = true;
    this.raceTitle.visible = true;
  }
  hide(): void {
    this.racePanel.visible = false;
    this.raceDollars.visible = false;
    this.raceCoins.visible = false;
    this.raceTime.visible = false;
    this.raceTitle.visible = false;
  }
  updateDollars(text: string) {
    this.raceDollars.value = text;
  }
  //material update placeholders
  updateMaterial1(text: string) {}
  updateMaterial2(text: string) {}
  updateMaterial3(text: string) {}

  //for voxboard subgame, placeholder if need own object
  updateSubGameDollars(text: string) { 
    this.raceDollars.value = text;
  }

  updateCoins(text: string) {
    this.raceCoins.value = text;
  }
  updateBronze(text: string) {
    //stubbed place holder
  }

  updateTime(text: string|number) {
    let val = text
    if(typeof text === 'string' ){
      //for large exponent
      if(text.indexOf("+305") > 0 || text.indexOf("+308") > 0){
        val = "∞"
      } 
    }else{
      if(text > 86400){ //larger than 24 hours assume infinite
        val = "∞"
      }
    }
    if(this.raceTime.value != val){
      this.raceTime.value = val + "";
    }
  }
}



export class SocialMediaPanel implements Modal{
  twitterButton: UIImage
  discordButton: UIImage;
  websiteButton: UIImage;

  constructor() {

    this.twitterButton = new UIImage(canvas, custUiAtlas);
    this.twitterButton.positionY = "-48%";
    this.twitterButton.positionX = "39.4%";
    this.twitterButton.sourceLeft = 2944;
    this.twitterButton.sourceTop = 3328;
    this.twitterButton.sourceWidth = 124;
    this.twitterButton.sourceHeight = 116;
    this.twitterButton.height = 50 * SCALE_UIImage;
    this.twitterButton.width = 50 * SCALE_UIImage;
    this.twitterButton.onClick = new OnPointerDown((e) => {
      openExternalURL("https://twitter.com/MetaGamiMall")
    });
    
    this.discordButton = new UIImage(canvas, custUiAtlas);
    this.discordButton.positionY = "-48%";
    this.discordButton.positionX = "43.1%";
    this.discordButton.sourceLeft = 3068;
    this.discordButton.sourceTop = 3328;
    this.discordButton.sourceWidth = 124;
    this.discordButton.sourceHeight = 116;
    this.discordButton.height = 50 * SCALE_UIImage;
    this.discordButton.width = 50 * SCALE_UIImage;
    //this.discordButton.height = 40 * SCALE_UIImage;
    this.discordButton.onClick = new OnPointerDown((e) => {
      openExternalURL("https://discord.com/invite/metalivestudio-series")
    });

    
    this.websiteButton = new UIImage(canvas, custUiAtlas);
    this.websiteButton.positionY = "-48%";
    this.websiteButton.positionX = "46.9%";
    this.websiteButton.sourceLeft = 3192;
    this.websiteButton.sourceTop = 3328;
    this.websiteButton.sourceWidth = 124;
    this.websiteButton.sourceHeight = 116;
    this.websiteButton.height = 50 * SCALE_UIImage;
    this.websiteButton.width = 50 * SCALE_UIImage;
   // this.websiteButton.height = 40 * SCALE_UIImage;
    this.websiteButton.onClick = new OnPointerDown((e) => {
      openExternalURL("https://metalivestudio.com/")
    });
  }
  show(): void {
    this.twitterButton.visible = true
    this.discordButton.visible = true
    this.websiteButton.visible = true
    
  }
  hide(): void {
    this.twitterButton.visible = false
    this.discordButton.visible = false
    this.websiteButton.visible = false
  }

}
export class LoginPanel implements Modal {
  loginPanel: UIImage;
  loginText: UIText;
  loginButton: UIImage;
  constructor() {
    this.loginPanel = new UIImage(canvas, custUiAtlas);
    this.loginPanel.width = "30%";
    this.loginPanel.height = "98px";
    this.loginPanel.positionY = 322;
    this.loginPanel.positionX = "39%";
    this.loginPanel.sourceLeft = 330;
    this.loginPanel.sourceTop = 3361;
    this.loginPanel.sourceWidth = 1144;
    this.loginPanel.sourceHeight = 220;
    this.loginPanel.visible = false;

    this.loginButton = new UIImage(canvas, custUiAtlas);
    this.loginButton.positionY = "52%";
    this.loginButton.positionX = "40.5%";
    this.loginButton.sourceLeft = 2596;
    this.loginButton.sourceTop = 2118;
    this.loginButton.sourceWidth = 275;
    this.loginButton.sourceHeight = 99;
    this.loginButton.height = 40 * SCALE_UIImage;
    this.loginButton.onClick = new OnPointerDown((e) => {
      //Code to login
      //then (if logged) this.hide()
      //this.hide();

      REGISTRY.ui.openloginGamePrompt();
    });
    this.loginButton.visible = false;

    this.loginText = new UIText(canvas);
    this.loginText.value = "Loading";
    this.loginText.positionY = "55%";
    this.loginText.positionX = "42.3%";
    this.loginText.color = Color4.White();
    this.loginText.fontSize = 12 * SCALE_FONT_TITLE;
    this.loginText.isPointerBlocker = false;
    this.loginText.visible = false;
  }
  show(): void {
    this.loginPanel.visible = true;
    this.loginText.visible = true;
    this.loginButton.visible = true;
  }
  hide(): void {
    this.loginPanel.visible = false;
    this.loginText.visible = false;
    this.loginButton.visible = false;
  }
}

export type TogglePanelArgs = {
  activeIconImageSection: ImageSection;
  inActiveIconImageSection: ImageSection;
};
export class TogglePanel implements Modal {
  avatarText: UIText;
  avatarButton: UIImage;
  gcoin: UIImage;
  activeIconImageSection: ImageSection = atlas_mappings.icons.coin;
  inActiveIconImageSection: ImageSection = atlas_mappings.icons.gametools;
  enableDisplay: boolean = true
  constructor(
    i18nProps: string | I18NParamsType,
    positionYPercent: number,
    callback: () => void,
    opts?: TogglePanelArgs
  ) {
    if (opts && opts.activeIconImageSection !== undefined)
      this.activeIconImageSection = opts.activeIconImageSection;
    if (opts && opts.inActiveIconImageSection !== undefined)
      this.inActiveIconImageSection = opts.inActiveIconImageSection;

    this.avatarButton = new UIImage(canvas, custUiAtlas);

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
    setSection(this.gcoin, this.activeIconImageSection);

    const isI18nProp = typeof i18nProps !== "string"//i18nProps.hasOwnProperty( 'key')
    this.avatarText = new UIText(canvas);
    this.avatarText.value = isI18nProp ? i18n.t(i18nProps.key,i18nProps.params) : i18nProps;
    //this.avatarText.positionY = positionYPercent + -1 + "%"; //panel text CS
    this.avatarText.positionX = "44.5%";
    this.avatarText.color = Color4.White();
    this.avatarText.fontSize = 11 * SCALE_FONT_PANEL;
    this.avatarText.visible = false;
    this.avatarText.isPointerBlocker = false;
    
    this.updatePositionY(positionYPercent)

    if(isI18nProp){
      i18nOnLanguageChangedAdd((lng) => {
        this.avatarText.value = i18n.t(i18nProps.key,i18nProps.params);
      })
    }
  }
  updatePositionY( positionYPercent: number ){
    this.gcoin.positionY = positionYPercent + -3.8 + "%";
    this.avatarButton.positionY = positionYPercent + -4 + "%";
    this.avatarText.positionY = positionYPercent + -1 + "%"; //panel text CS
  }
  setActiveImageSection(imgSection: ImageSection) {
    this.activeIconImageSection;
  }
  setActive(val: boolean) {
    if (val) {
      setSection(this.gcoin, this.inActiveIconImageSection);
    } else {
      setSection(this.gcoin, this.activeIconImageSection);
    }
  }
  show(): void {
    if(this.enableDisplay === false) return
    
    this.avatarText.visible = true;
    this.gcoin.visible = true;
    this.avatarButton.visible = true;
  }
  hide(): void {
    this.avatarText.visible = false;
    this.gcoin.visible = false;
    this.avatarButton.visible = false;
  }
}

export class AvatarSwapPanel extends TogglePanel {
  constructor() {
    super(
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

export class SummonPetRobotPanel extends TogglePanel {
  constructor() {
    super(
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

const button1 = {
  //title: i18n.t("zone", {ns:namespaces.ui.locationButton}),
  title: {key:"zone", params:{ns:namespaces.ui.locationButton}},
  titleYPos: "32.5%",
  //buttonText: i18n.t("tpPoint", {ns:namespaces.ui.locationButton}),
  buttonText: {key:"tpPoint", params:{ns:namespaces.ui.locationButton}},
  buttonYPos: "25%",
  callback: () => {
    REGISTRY.toggles.toggleLocation();
    movePlayerTo({ x: 23, y: 2, z: 7 });
  },
};


const button2 = {
  title: {key:" ", params:{ns:namespaces.ui.locationButton}},
  titleYPos: "32.5%",
  buttonText: {key:"muscleSquare", params:{ns:namespaces.ui.locationButton}},
  buttonYPos: "18%",
  callback: () => {
    REGISTRY.toggles.toggleLocation();
    movePlayerTo({ x: 56, y: 5, z: 48 }, { x: 8, y: 1, z: 8 });
  },
};

const button3 = {
  title: {key:" ", params:{ns:namespaces.ui.locationButton}},
  titleYPos: "32.5%",
  buttonText: {key:"moonSquare", params:{ns:namespaces.ui.locationButton}},
  buttonYPos: "11%",
  callback: () => {
    REGISTRY.toggles.toggleLocation();
    movePlayerTo({ x: 24, y: 26, z: 48 }, { x: 8, y: 1, z: 8 });
  },
};

const button4 = {
  title: {key:" ", params:{ns:namespaces.ui.locationButton}},
  titleYPos: "32.5%",
  buttonText: {key:"marsSquare", params:{ns:namespaces.ui.locationButton}},
  buttonYPos: "4%",
  callback: () => {
    REGISTRY.toggles.toggleLocation();
    movePlayerTo({ x: 37, y: 32, z: 55 }, { x: 8, y: 1, z: 8 });
  },
};

const button5 = {
  title: {key:" ", params:{ns:namespaces.ui.locationButton}},
  titleYPos: "32.5%",
  buttonText: {key:"heavenSquare", params:{ns:namespaces.ui.locationButton}},
  buttonYPos: "-3%",
  callback: () => {
    REGISTRY.toggles.toggleLocation();
    movePlayerTo({ x: 24, y: 51, z: 51 }, { x: 8, y: 1, z: 8 });
  },
};

const button6 = {
  title: {key:" ", params:{ns:namespaces.ui.locationButton}},
  titleYPos: "32.5%",
  buttonText: {key:"rewardCenter", params:{ns:namespaces.ui.locationButton}},
  buttonYPos: "-10%",
  callback: () => {
    REGISTRY.toggles.toggleLocation();
    movePlayerTo({ x: 40, y: 0, z: 23 }, { x: 8, y: 8, z: 128 });
  },
};

const mapModal = new CustomMapPrompt("", [button1, button2, button3, button4, button5, button6]);
mapModal.hide();
export class LocationPanel extends TogglePanel {
  constructor() {
    super(
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
}
export class RafflePanel extends TogglePanel {
  constructor() {
    super(
      {key:"raffleButton", params:{ns:namespaces.ui.sideButton}},
      12,
      () => {
        log("clicked RafflePanel  ");

        REGISTRY.ui.openRaffleGamePrompt()
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

export class InventoryPanel extends TogglePanel {
  constructor() {
    super(
      {key:"inventoryButton", params:{ns:namespaces.ui.sideButton}},
      6,
      () => {
        log("clicked InventoryPanel ");
        if(REGISTRY.ui.inventoryPrompt.prompt.background.visible){
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

export class GameguidePanel extends TogglePanel {
  constructor() {
    super(
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

export class ReloginPanel extends TogglePanel {
  constructor() {
    super(
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
      ui.displayAnnouncement(i18n.t("attemptRelogin", {ns:namespaces.ui.prompts}),)


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
            
          utils.setTimeout(500,()=>{
            //when already disconnected bombs hard :( workaround force disconnected state
            GAME_STATE.setGameConnected('disconnected',"RELOGIN_BTN_post_disconnected")
            GAME_STATE.gameRoom = undefined
            reloginWork()
          })
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

export class RefreshPanel extends TogglePanel {
  constructor() {
    super(
      {key:"refreshSave", params:{ns:namespaces.ui.sideButton}},
      -12,
      () => {
        log("clicked RefreshPanel ");
        GAME_STATE.gameRoom.send("save-game",{}),
      executeTask(async () => {
        updateStoreNFTCounts()
      })
      },
      {
        activeIconImageSection: atlas_mappings.icons.Refreshicon_on,
        inActiveIconImageSection: atlas_mappings.icons.Refreshicon_off,
      }
    );
  }
}


export class ShowLeaderboardPanel extends TogglePanel {
  constructor() {
    super(
      {key:"showLvlLeaderBoard", params:{ns:namespaces.ui.sideButton}},
      -18,
      () => {
        log("clicked ShowLeaderboardPanel ");
        //open modal, fetch data
        REGISTRY.ui.openLeaderboardLevelEpoch()
      },
      {
        activeIconImageSection: atlas_mappings.icons.LeaderBoardicon_on,
        inActiveIconImageSection: atlas_mappings.icons.LeaderBoardicon_off,
      }
    );
  }
}


export class LanguagePanel extends TogglePanel {
  constructor() {
    super(
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

const startGameYPos = 30;
export class StartEndGamePanel extends TogglePanel {
  subPanels: TogglePanel[] = [];

  startGame: TogglePanel; 
  startSubGame: TogglePanel;

  gameHudContext!: GameHudVisContext;

  constructor() {
    super("STUBB", startGameYPos, () => {
      log("clicked StartEndGamePanel on ");
      log("REGISTRY.toggles", REGISTRY.toggles);
      //REGISTRY.toggles.togglePersonalAssistant();
      //TODO NEED LOGIC FOR WHAT TO DO WHEN
      //start game REGISTRY.ui.openStartGamePrompt();
      //end game REGISTRY.ui.openEndGameConfirmPrompt();
      //sub game REGISTRY.ui.openStartGamePrompt("VB");
    });

    this.avatarText.visible = false;
    this.gcoin.visible = false;
    this.avatarButton.visible = false;

    this.startGame = new TogglePanel(
      "",
      startGameYPos,
      () => {
        REGISTRY.ui.openStartGamePrompt();
      },
      {
        activeIconImageSection: atlas_mappings.icons.startgame,
        inActiveIconImageSection: atlas_mappings.icons.startgame_off,
      }
    ); 
    this.startSubGame = new TogglePanel(
      "Start Sub-Game",
      startGameYPos,
      () => {
        REGISTRY.ui.openStartGamePrompt("VB");
      },
      {
        activeIconImageSection: atlas_mappings.icons.material1,
        inActiveIconImageSection: atlas_mappings.icons.material2,
      }
    );

    this.subPanels.push(this.startGame);
    this.subPanels.push(this.startSubGame);
    //this.subPanels.push(this.endGame);
  }
  setSubPanelsVisible(val: boolean) {
    for (let p in this.subPanels) {
      if (val) {
        this.subPanels[p].show();
      } else {
        this.subPanels[p].hide();
      }
    }
  }

  updateHudContext(ctx: GameHudVisContext) {
    this.gameHudContext = ctx;
  }

  hide(): void {
    this.setSubPanelsVisible(false);
  }
  show(): void {
    //this.setSubPanelsVisible(true)
    log("gametool.show", this.gameHudContext);
    switch (this.gameHudContext) {
      case "game-hud":
        this.startGame.hide();
        this.startSubGame.hide(); 
        break;
      case "lobby":
        this.startGame.show();
        this.startSubGame.hide(); 
        break;
      case "sub-lobby":
        this.startGame.hide();
        this.startSubGame.show(); 
        break;
    }
  }
}

export type GameHudVisContext = "lobby" | "game-hud" | "sub-lobby";

export class GameToolsPanel implements Modal {
  gtext: UIText;
  gimagebutton: UIImage;
  gdoge: UIImage;
  petPanel: SummonPetRobotPanel;
  avatarSwapPanel: AvatarSwapPanel;
  locationPanel: LocationPanel;
  startEndGamePanel: StartEndGamePanel;
  socialMediaPanel: SocialMediaPanel;
  rafflePanel
  InventoryPanel
  GameguidePanel
  ReloginPanel
  RefreshPanel
  leaderBoardPanel:ShowLeaderboardPanel
  languagePanel:LanguagePanel

  subPanels: TogglePanel[] = [];

  gameHudContext?: GameHudVisContext;

  isShown: boolean;

  subPanelsVisible: boolean = false;

  constructor() {
    this.gimagebutton = new UIImage(canvas, custUiAtlas);
    this.gimagebutton.positionY = "34.5%";
    this.gimagebutton.positionX = "43%";
    setSection(this.gimagebutton, atlas_mappings.backgrounds.expandPanel);
    this.gimagebutton.width = 150 * SCALE_UIImage;
    this.gimagebutton.height = 60;
    this.socialMediaPanel = new SocialMediaPanel();
    this.petPanel = new SummonPetRobotPanel();
    this.avatarSwapPanel = new AvatarSwapPanel();
    //this.startEndGamePanel = new StartEndGamePanel();
    this.locationPanel = new LocationPanel();
    this.rafflePanel = new RafflePanel();
    this.InventoryPanel = new InventoryPanel();
    this.GameguidePanel = new GameguidePanel();
    this.ReloginPanel = new ReloginPanel();
    this.RefreshPanel = new RefreshPanel();
    this.leaderBoardPanel = new ShowLeaderboardPanel()
    if(CONFIG.SIDE_BAR_LANGUAGE_PICKER_ENABLED) this.languagePanel = new LanguagePanel()
    this.socialMediaPanel.show();

    this.subPanels.push(this.avatarSwapPanel);
    this.subPanels.push(this.petPanel);
    this.subPanels.push(this.locationPanel);
    //this.subPanels.push(this.startEndGamePanel);
    this.subPanels.push(this.rafflePanel);
    this.subPanels.push(this.InventoryPanel);
    this.subPanels.push(this.GameguidePanel);
    this.subPanels.push(this.ReloginPanel);
    this.subPanels.push(this.RefreshPanel);
    this.subPanels.push(this.leaderBoardPanel);
    if(this.languagePanel) this.subPanels.push(this.languagePanel);

    this.updateSubPanelPositions();


    this.isShown = false;
    this.gimagebutton.onClick = new OnPointerDown((e) => {
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
  }
  updateSubPanelPositions(){
    let startPos = 30
    let increment = -6
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
    if(this.startEndGamePanel) this.startEndGamePanel.updateHudContext(ctx);
  }
  show(): void {
    this.gtext.visible = true;
    this.gimagebutton.visible = true;
    this.gdoge.visible = true;
    this.setSubPanelsVisible(true)
    this.socialMediaPanel.show()
  }
  hide(): void {
    this.gtext.visible = false;
    this.gimagebutton.visible = false;
    this.gdoge.visible = false;
    this.socialMediaPanel.hide()

    this.setSubPanelsVisible(false)
  }
}

REGISTRY.ui.gameTools = new GameToolsPanel();
REGISTRY.ui.gameTools.show();
REGISTRY.ui.gameTools.setSubPanelsVisible(true);

GAME_STATE.addChangeListener((key: string, newVal: any, oldVal: any) => {
  logChangeListenerEntry("listener.ui_background.ts ", key, newVal, oldVal);

  switch (key) {
    //common ones on top
    case "avatarSwapEnabled":
      REGISTRY.ui.gameTools.avatarSwapPanel.setActive(newVal);
      break;
    case "personalAssistantEnabled":
      REGISTRY.ui.gameTools.petPanel.setActive(newVal);
      break;
    case "locationEnabled":
      REGISTRY.ui.gameTools.locationPanel.setActive(newVal);
      break;
    
  }
});
export class LogoBlackBackground implements Modal{

  image: UIImage
  background: UICanvas
  constructor() {
    const background= new UIContainerStack(canvas)
    background.adaptWidth = true
    background.width = "1000%"
    background.height = "1000%"
    background.color = Color4.Black() 
    background.stackOrientation = UIStackOrientation.HORIZONTAL
    background.visible=false
    this.background = background
    let texture = new Texture("images/ui/planetstagethumbnail.png")
    const image = new UIImage(canvas, texture)
    image.sourceLeft = 0
    image.sourceTop = 0
    image.sourceWidth = 1024
    image.sourceHeight = 1024
    image.vAlign = "center"
    image.width = 700
    image.height = 700
    image.visible = false
    this.image = image


  }
  show(): void { 

    this.image.visible = true;
    this.background.visible = true;
    //10 seconds
    utils.setTimeout(6000, () => {
      this.image.visible = false;
      this.background.visible = false;
    });
    }
  hide(): void {
    this.background.visible = false
    this.image.visible = true
  }

} 

