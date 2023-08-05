import * as ui from "@dcl/ui-scene-utils";
import { CustomPromptButton, CustomPromptText } from "@dcl/ui-scene-utils";
import * as utils from "@dcl/ecs-scene-utils";
import atlas_mappings from "./atlas_mappings";
import { setSection } from "../dcl-scene-ui-workaround/resources";
import { ImageSection } from "node_modules/@dcl/ui-scene-utils/dist/utils/types";
import { CONFIG } from "src/config";
import { getOrCreateFont } from "src/meta-decentrally/resources/common";
import { formatTime } from "src/meta-decentrally/modules/utilities";
import { convertDateToYMDHMS } from "src/utils";
import { RESOURCES } from "src/gamimall/resources";
import { CommonResources } from "src/resources/common";
import { RewardNotification } from "src/gamimall/coin";
import { fetchNFTData, isNFTResultValid } from "src/store/fetch-utils";
import { i18n, i18nOnLanguageChangedAdd } from "src/i18n/i18n";
import { languages, namespaces } from "src/i18n/i18n.constants";
import { REGISTRY } from "src/registry";
import { ILeaderboardItem, PlayerLeaderboardEntryType, createLeaderBoardPanelText } from "src/gamimall/leaderboard-utils";

const customDelayMs = 200;
const canvas = ui.canvas;
canvas.isPointerBlocker = true;
const pinkNeonColor = new Color4(1, 0, 1, 0.1);

export const custUiAtlasInventory = new Texture(
  "images/ui/Inventory.png"
);

export const custUiAtlas = new Texture(
  "images/ui/dialog-custom-atlas-v3-semi-tran.png"
);

export const AtlasEntryposter1 = new Texture(
  "images/ui/Entryposter1.png"
);

export const AtlasEntryposter2 = new Texture(
  "images/ui/Entryposter2.png"
);

export const mapUiAtlas = new Texture(
  "images/ui/dialog-dark-atlas-v3-semi-tran-02.png"
);
const MASTER_SCALE = 1.2;

const SCALE_FONT_TITLE = MASTER_SCALE;
const SCALE_FONT = MASTER_SCALE;
const SCALE_FONT_PANEL = MASTER_SCALE;

const SCALE_FONT_CLAIM_TITLE = 1;
const SCALE_FONT_CLAIM = 1;

const SCALE_FONT_OK_PROMPT_TITLE = MASTER_SCALE;
const SCALE_FONT_OK_PROMPT_TEXT = 1.4;

const SCALE_UIImage = MASTER_SCALE;
const SCALE_CLAIM_UIImage = 1;
const SCALE_UIImage_PERCENT = MASTER_SCALE;

const claimWindowPrefixNotStarted = "Can claim after " 
const claimWindowPrefixExpired = "Claim expired " 



export interface Modal {
  show(): void;
  hide(): void;
}

export type CustomPromptOptions = {
  width?: number;
  height?: number;
  modalWidth?: number;
  modalHeight?: number;
  buttonPositionY?: number;
  textPositionY?: number;
  textFontSize?: number;
  costShowIcons?: boolean
};

export type I18NParamsType = {key:string, params?:any}

export type CustomMapButton = {
  title: string | I18NParamsType; 
  titleYPos: string;
  buttonText: string | I18NParamsType;
  buttonYPos: string;
  callback?: () => void;
};

const CLAIM_PROMPT_DEFAULT_WIDTH_PADDING = 70 * SCALE_CLAIM_UIImage;
const CLAIM_PROMPT_DEFAULT_HEIGHT_PADDING = 50 * SCALE_CLAIM_UIImage;

const CLAIM_PROMPT_DEFAULT_WIDTH = 750 * SCALE_CLAIM_UIImage;
const CLAIM_PROMPT_DEFAULT_HEIGHT = 450 * SCALE_CLAIM_UIImage;
const CLAIM_PROMPT_RAFFLE_WIDTH = 400 * SCALE_CLAIM_UIImage;
const CLAIM_PROMPT_RAFFLE_HEIGHT = 500 * SCALE_CLAIM_UIImage;

const OPTION_PROMPT_DEFAULT_WIDTH_PADDING = 70 * SCALE_UIImage;
const OPTION_PROMPT_DEFAULT_HEIGHT_PADDING = 50 * SCALE_UIImage;

const OPTION_PROMPT_DEFAULT_WIDTH = 500 * SCALE_UIImage;
const OPTION_PROMPT_DEFAULT_HEIGHT = 300 * SCALE_UIImage;

const OK_PROMPT_DEFAULT_WIDTH_PADDING = 70 * SCALE_UIImage;
const OK_PROMPT_DEFAULT_HEIGHT_PADDING = 50 * SCALE_UIImage;

const OK_PROMPT_DEFAULT_WIDTH = 350 * SCALE_UIImage;
const OK_PROMPT_DEFAULT_HEIGHT = 250 * SCALE_UIImage;

export class CustomOkPrompt implements Modal {
  prompt: ui.CustomPrompt;
  title: ui.CustomPromptText;
  text: ui.CustomPromptText;
  button: ui.CustomPromptButton;
  callback?: () => void;
  onShowcallback?: () => void;
  constructor(
    title: string | I18NParamsType,
    text: string,
    buttonText: string | I18NParamsType,
    callback?: () => void,
    options?: CustomPromptOptions
  ) {
    this.callback = callback;

    //this.text = text;
    //this.buttonText = buttonText;
    this.prompt = new ui.CustomPrompt(undefined, undefined, undefined, true);

    const width = OK_PROMPT_DEFAULT_WIDTH;
    const height = OK_PROMPT_DEFAULT_HEIGHT;

    const width_padding = OK_PROMPT_DEFAULT_WIDTH_PADDING;
    const height_padding = OK_PROMPT_DEFAULT_HEIGHT_PADDING;

    const titleHeight =
      options && options.height ? (options.height - height) / 2 : 55;

    const textPositionY =
      options && options.textPositionY ? options.textPositionY : 0;

    this.title = this.prompt.addText(
      typeof title !== "string" ? i18n.t(title.key,title.params) : title,
      40,
      titleHeight,
      new Color4(1, 0.906, 0.553, 1),
      19 * SCALE_FONT_OK_PROMPT_TITLE
    );

    if(typeof title !== "string"){
      i18nOnLanguageChangedAdd((lng) => {
        if(typeof title !== "string"){
          this.title.text.value = i18n.t(title.key,title.params)
        }
      })
    }

    let promptText = (this.text = new CustomPromptText(
      this.prompt,
      text,
      0,
      textPositionY,
      false,
      Color4.White(),
      options && options.textFontSize
        ? options.textFontSize
        : 12 * SCALE_FONT_OK_PROMPT_TEXT
    ));
    const sfFont = getOrCreateFont(Fonts.SanFrancisco)
    promptText.text.vAlign = "center";
    promptText.text.adaptHeight = true;
    promptText.text.font = sfFont;

    promptText.text.width = width - width_padding;
    promptText.text.height = height - height_padding;
    promptText.text.textWrapping = true;
    promptText.text.vAlign = "center";
    promptText.text.hAlign = "center";

    let myButton = (this.button = this.prompt.addButton(
      typeof buttonText !== "string" ? i18n.t(buttonText.key,buttonText.params) : buttonText,
      0,
      -35,
      () => {
        if (this.callback) this.callback();
        this.hide();
      },
      ui.ButtonStyles.E
    ));
    if (myButton.icon) {
      myButton.icon.visible = false;
      log(myButton.label);
      myButton.label.positionX = 0;
      myButton.label.positionY = 3;
    }

    if(typeof buttonText !== "string"){
      i18nOnLanguageChangedAdd((lng) => {
        if(typeof buttonText !== "string"){
          myButton.label.value = i18n.t(buttonText.key,buttonText.params)
        }
      })
    }


    applyEmptyPanel(this.prompt, myButton, options);
  }
  _show() {
    this.prompt.show();
    if (this.onShowcallback) this.onShowcallback();
  }
  show(delay?: number): void {
    const delayTm = delay !== undefined ? delay : customDelayMs;

    if (delayTm > 0) {
      utils.setTimeout(delayTm, () => {
        this._show();
      });
    } else {
      this._show();
    }
  }
  hide(): void {
    this.prompt.hide();
  }
}


export function uiDimToNumber(val: number | string): number {
  if (typeof val === "string") {
    return parseInt(val.substr(0, val.length - 2));
  } else {
    return val;
  }
}

function updateCloseBtnPosition(prompt: ui.CustomPrompt,_offset?:number) {
  const offset = _offset !== undefined ? _offset : -30
  prompt.closeIcon.positionX = uiDimToNumber(prompt.background.width as number) / 2 + offset;
  prompt.closeIcon.positionY = uiDimToNumber(prompt.background.height as number) / 2 + offset;
}

export class CustomMapPrompt implements Modal {
  prompt: ui.CustomPrompt;
  title: string;
  buttons: CustomMapButton[];
  constructor(title: string, buttons: CustomMapButton[]) {
    this.title = title;
    this.buttons = buttons;

    this.prompt = new ui.CustomPrompt(undefined, undefined, undefined, true);
    const titleUI = this.prompt.addText(
      this.title,
      0,
      0,
      pinkNeonColor,
      19 * SCALE_FONT_TITLE
    );
    titleUI.text.positionY = "40%";
    let customButtons: ui.CustomPromptButton[] = [];
    let customTexts = [];

    buttons.forEach((button) => {  
      const buttonTitle = this.prompt.addText(
        typeof button.title !== "string" ? i18n.t(button.title.key,button.title.params) : button.title,
        0,
        0,
        pinkNeonColor,
        19 * SCALE_FONT_TITLE
      );
      buttonTitle.text.positionX = "22%";
      buttonTitle.text.fontSize = 14;
      buttonTitle.text.positionY = "32.5%";
      let myButton = this.prompt.addButton(
        typeof button.buttonText !== "string" ? i18n.t(button.buttonText.key,button.buttonText.params) : button.buttonText,
        0,
        -30,
        () => {
          if (button.callback) button.callback();
          this.hide();
        },
        ui.ButtonStyles.E
      );
      if (myButton.icon) {
        myButton.icon.visible = false;
        log(myButton.label);
        myButton.label.positionX = 0;
        myButton.image.positionX = "28%";
        myButton.label.positionY = "0%";
        myButton.label.color = pinkNeonColor;
        myButton.image.positionY = button.buttonYPos;
        myButton.label.fontSize = 14;
      }
      
      if(typeof button.buttonText !== "string"){
        i18nOnLanguageChangedAdd((lng) => {
          if(typeof button.buttonText !== "string"){
            myButton.label.value = i18n.t(button.buttonText.key,button.buttonText.params)
          }
        })
      }
      if(typeof button.title !== "string"){
        i18nOnLanguageChangedAdd((lng) => {
          if(typeof button.title !== "string"){
            buttonTitle.text.value = i18n.t(button.title.key,button.title.params)
          }
        })
      }

      customButtons.push(myButton);
      customTexts.push(buttonTitle);
    });
    this.prompt.closeIcon.visible = false;
    applyMapPanel(this.prompt, customButtons);
  }
  show(): void {
    utils.setTimeout(customDelayMs, () => {
      this.prompt.show();
    });
  }
  hide(): void {
    this.prompt.hide();
  }
}


export class CustomOptionsPrompt implements Modal {
  prompt: ui.CustomPrompt;
  title: ui.CustomPromptText;
  text: ui.CustomPromptText;

  buttonConfirmBtn: ui.CustomPromptButton;
  buttonSecondaryBtn: ui.CustomPromptButton;
  buttonConfirm: string;
  buttonSubtitleConfirm: string;
  buttonSecondary: string;
  buttonSubtitleSecondary: string;
  primaryCallback?: () => void;
  secondaryCallback?: () => void;
  constructor(
    title: string,
    text: string,
    buttonConfirm: string,
    buttonSubtitleConfirm: string,
    buttonRaffle: string,
    buttonSubtitleRaffle: string,
    primaryCallback?: () => void,
    secundaryCallback?: () => void,
    options?: CustomPromptOptions
  ) {
    this.primaryCallback = primaryCallback;
    this.secondaryCallback = secundaryCallback;
    //this.title = title;
    //this.text = text;
    this.buttonConfirm = buttonConfirm;
    this.buttonSubtitleConfirm = buttonSubtitleConfirm;
    this.buttonSecondary = buttonRaffle;
    this.buttonSubtitleSecondary = buttonSubtitleRaffle;
    let extraWidth = 0;
    if (options && options.modalWidth) {
      extraWidth = options.modalWidth;
    }
    let extraHeight = 0;
    if (options && options.modalHeight) {
      extraHeight = options.modalHeight;
    }
    const width = OPTION_PROMPT_DEFAULT_WIDTH + extraWidth;
    const height = OPTION_PROMPT_DEFAULT_HEIGHT + extraHeight;
    const width_padding = OPTION_PROMPT_DEFAULT_WIDTH_PADDING;
    const height_padding = OPTION_PROMPT_DEFAULT_HEIGHT_PADDING;

    const titleHeight = 53 * SCALE_UIImage; //((options && options.height) ? ((options.height - height)/2)+92: 92)
    const textHeight =
      options && options.textPositionY
        ? options.textPositionY
        : -12 * SCALE_UIImage; //((opttions && options.height) ? (options.height - height)/2: 25)

    this.prompt = new ui.CustomPrompt(undefined, undefined, undefined, true);
    this.title = this.prompt.addText(
      title,
      title.length < 15 ? 40 : 70,
      titleHeight,
      new Color4(1, 0.906, 0.553, 1),
      19 * SCALE_FONT_TITLE
    );
    const sfFont = getOrCreateFont(Fonts.SanFrancisco)

    let subtitleText = (this.text = new CustomPromptText(
      this.prompt,
      text,
      0,
      textHeight,
      false,
      Color4.White(),
      options && options.textFontSize ? options.textFontSize : 16 * SCALE_FONT
    ));

    subtitleText.text.vAlign = "center";
    subtitleText.text.adaptHeight = true;
    subtitleText.text.font = sfFont;
    subtitleText.text.isPointerBlocker = false;

    subtitleText.text.width = width - (width_padding * 2);
    subtitleText.text.height = height - height_padding;
    subtitleText.text.textWrapping = true;
    subtitleText.text.vAlign = "center";
    subtitleText.text.hAlign = "center";

    let myButton = this.buttonConfirmBtn = this.prompt.addButton(
      this.buttonConfirm,
      -50,
      -30,
      () => {
        log(
          "CustomOptionsPrompt.primaryCallback clicked",
          title,
          text,
          this.primaryCallback
        );
        if (this.primaryCallback) this.primaryCallback();
        this.hide();
      },
      ui.ButtonStyles.E
    );
    if (myButton.icon) {
      myButton.icon.visible = false;
      log(myButton.label);
      myButton.label.positionX = -5;
      myButton.label.positionY = 5;
    }

    let secundaryButton = this.buttonSecondaryBtn = this.prompt.addButton(
      this.buttonSecondary,
      50,
      -30,
      () => {
        log(
          "CustomOptionsPrompt.secondaryCallback clicked",
          this.secondaryCallback
        );
        if (this.secondaryCallback) this.secondaryCallback();
        this.hide();
      },
      ui.ButtonStyles.E
    );
    if (secundaryButton.icon) {
      secundaryButton.icon.visible = false;
      log(secundaryButton.label);
      secundaryButton.label.positionX = -5;
      secundaryButton.label.positionY = 5;
    }
    let subtitleConfirm = new CustomPromptText(
      this.prompt,
      this.buttonSubtitleConfirm,
      65,
      -160,
      false,
      Color4.White(),
      8 * SCALE_FONT
    );

    subtitleConfirm.text.vAlign = "center";
    subtitleConfirm.text.adaptHeight = true;
    subtitleConfirm.text.font = sfFont;
    subtitleConfirm.text.isPointerBlocker = false;

    let subtitleSecondary = new CustomPromptText(
      this.prompt,
      this.buttonSubtitleSecondary,
      -78,
      -160,
      false,
      Color4.White(),
      8
    );
    subtitleSecondary.text.vAlign = "center";
    subtitleSecondary.text.adaptHeight = true;
    subtitleSecondary.text.font = sfFont;
    subtitleSecondary.text.isPointerBlocker = false;

    this.hide();
    applyCustomOptionsPanel(this.prompt, myButton, secundaryButton, options);
  }
  show(): void {
    utils.setTimeout(customDelayMs, () => {
      this.prompt.show();
    });
  }
  hide(): void {
    this.prompt.hide();
  }
}


export class CustomGridTextRow {
  uiIconImg: UIImage;
  uiItemBg: UIImage;
  uiText: UIText;
  promptIcon?: ui.CustomPromptIcon;
  promptText?: ui.CustomPromptText;
  
  container: UIContainerRect;
  bg: UIImage;

  constructor(container:UIContainerRect,uiIconImg: UIImage, uiText: UIText,uiItemBg?: UIImage){
    this.container = container
    this.uiIconImg = uiIconImg
    this.uiText = uiText
    this.uiItemBg = uiItemBg
  }

  hide(){
    if(this.container !== undefined){
      this.container.visible = false
    }else{
      this.uiIconImg.visible = false
      this.uiText.visible = false
      if(this.uiItemBg !== undefined) this.uiItemBg.visible = false
    }
  }
  clear(){
      setSection(this.uiIconImg, atlas_mappings.icons.emptyInventorySlot);
      this.uiText.value = ""
  }
  show(){
    if(this.container !== undefined){
      this.container.visible = true
    }else{
      this.uiIconImg.visible = true
      this.uiText.visible = true
      if(this.uiItemBg !== undefined) this.uiItemBg.visible = true
    }
  }
};
export type CustomGridTextRowData = {
  uiIconSection: ImageSection;
  text: string;
};

export class AbstractBaseGridPrompt implements Modal {
  prompt: ui.CustomPrompt;
  title: ui.CustomPromptText;
  text: ui.CustomPromptText;
  closingMsg: ui.CustomPromptText;
  buttonPrimary: ui.CustomPromptButton

  autoCloseEnabled: boolean = false
  autoCloseStartTime: number
  autoCloseTimeoutMS: number
  autoCloseTimer: Entity

  /*
  coins:CustomTextRow
  coinsEarned:CustomTextRow
  dollars:CustomTextRow

  material1:CustomTextRow
  material2:CustomTextRow
  material3:CustomTextRow
  */

  coins: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.coin,
    text: "",
  };
  coinsEarned: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.coin,
    text: "",
  };
  dollars: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.dimond,
    text: "",
  };

  rock1: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.rock1,
    text: "",
  };
  rock2: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.rock2,
    text: "",
  };
  rock3: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.rock3,
    text: "",
  };
  petro: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.petro,
    text: "",
  };
  nitro: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.nitro,
    text: "",
  };
  bronze: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.bronze,
    text: "",
  };
  bronzeShoe: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.bronzeShoe,
    text: "",
  };
  material1: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.material1,
    text: "",
  };
  material2: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.material2,
    text: "",
  };
  material3: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.material3,
    text: "",
  };

  //coins: ui.CustomPromptText;
  //coinsEarned: ui.CustomPromptText;
  //dollars: ui.CustomPromptText;

  //material1: ui.CustomPromptText;
  //material2: ui.CustomPromptText;
  //material3: ui.CustomPromptText;

  buttonConfirm: string;
  buttonSubtitleConfirm: string;
  //buttonRaffle: string;
  //buttonSubtitleRaffle: string;
  primaryCallback?: () => void;

  textGrid: CustomGridTextRow[] = [];

  constructor(
    title: string,
    text: string,
    buttonConfirm: string,
    primaryCallback?: () => void,
    options?: CustomPromptOptions
  ) {
    this.primaryCallback = primaryCallback;

    this.buttonConfirm = buttonConfirm;
    
    const width = OPTION_PROMPT_DEFAULT_WIDTH;
    const height = OPTION_PROMPT_DEFAULT_HEIGHT;
    this.prompt = new ui.CustomPrompt(undefined, undefined, undefined, true);
    this.title = this.prompt.addText(
      title,
      40,
      83,
      new Color4(1, 0.906, 0.553, 1),
      19 * SCALE_FONT_TITLE
    );
    const sfFont = getOrCreateFont(Fonts.SanFrancisco)
 
    let subtitleText = (this.text = this.prompt.addText(
      text,
      0,
      40,
      Color4.White(),
      16
    ));

    let closingMsg = (this.closingMsg = this.prompt.addText(
      i18n.t("closeAutomaticallyCountdown",{ns:namespaces.ui.prompts,"timeLeftSeconds":5}),
      0,
      -153,
      Color4.White(),
      8
    ));
    
    
    let myButton = this.buttonPrimary = this.prompt.addButton(
      this.buttonConfirm,
      -50,
      -40,
      () => {
        if (this.primaryCallback) this.primaryCallback();
        this.hide();
      },
      ui.ButtonStyles.E
    );
    if (myButton.icon) {
      myButton.icon.visible = false;
      log(myButton.label);
      myButton.label.positionX = -5;
      myButton.label.positionY = 5;
    } 
    /*
    let subtitleRaffle = new CustomPromptText(
      this.prompt,
      "xxxxx",
      -78,
      -185,
      false,
      Color4.White(),
      8
    );
    subtitleRaffle.text.vAlign = "center";
    subtitleRaffle.text.adaptHeight = true;
    subtitleRaffle.text.font = sfFont;
    subtitleRaffle.text.isPointerBlocker = false;*/

    this.hide();
    //FIXME call its own formatter, not levelups
    //applyLevelUpPanel(this.prompt, myButton, options);
  }
  initGrid(args:{rowXPos?:number,rowYPos?:number,rowXWidth?:number,rowYHeight?:number}){
    //implement me
  }
  show(): void {
    utils.setTimeout(customDelayMs, () => {
      this.prompt.show();
      this.updateGrid();
      this.startTimers()
    });
  }

  hide(): void {
    this.clearTimers()
    this.prompt.hide();
  }
  hideGrid() {
    for (let x = 0; x < this.textGrid.length; x++) {
      //log("hideGrid", x);
      this.textGrid[x].hide()
    }
  }
  clearGrid() {
    for (let x = 0; x < this.textGrid.length; x++) {
      //log("hideGrid", x);
      this.textGrid[x].clear()
    }
  }
  startTimers(){
    this.clearTimers()
    //start any new timers
    if(this.autoCloseEnabled){
      this.closingMsg.show()
      this.autoCloseStartTime = Date.now()
      const checkForClose = ()=>{
        if(this.autoCloseStartTime===undefined){
          return
        } 
        const delta = (Date.now() - this.autoCloseStartTime)

        const timeLeftSeconds = Math.ceil((this.autoCloseTimeoutMS-delta)/1000).toFixed(0)
        //log("timeLeftSeconds",timeLeftSeconds)
        this.closingMsg.text.value = i18n.t("closeAutomaticallyCountdown",{ns:namespaces.ui.prompts,"timeLeftSeconds":timeLeftSeconds})

        if(delta > this.autoCloseTimeoutMS){
          this.hide()
        }else{
          //schedule again
          this.autoCloseTimer = utils.setTimeout(200,
            checkForClose)
        }
        
      } 
      this.autoCloseTimer = utils.setTimeout(200,
        checkForClose)
    }else{
      this.closingMsg.hide()
    }
  }
  clearTimers(){
    if(this.autoCloseTimer) {
      this.autoCloseStartTime = undefined
      engine.removeEntity(this.autoCloseTimer)
      this.autoCloseTimer = undefined
      this.closingMsg.hide()
    }
  }
  
  updateGridIndex(row: number, data: CustomGridTextRowData) {
    if(this.textGrid===undefined){
      log("updateGridIndex WARN this.textGrid is null ",row,this.textGrid)
      return;
    }
    if(this.textGrid[row] === undefined){
      //debugger
      log("updateGridIndex WARN invalid index ",row,this.textGrid.length)
      return;
    }
    //this.textGrid[row].text.show();
    //this.textGrid[row].uiIcon.show();
    this.textGrid[row].show()

    this.textGrid[row].uiText.value = data.text;

    //if(isNaN(data.text)){
      try{
        const numVal = parseInt(data.text)
        if(numVal <= 0){
          this.textGrid[row].uiIconImg.opacity = .3
          this.textGrid[row].uiText.opacity = .8
        }else{
          this.textGrid[row].uiIconImg.opacity = 1
          this.textGrid[row].uiText.opacity = 1
        } 
        if(numVal > 9999){
          this.textGrid[row].uiText.value = "+9999";
        }
      }catch(e){

      }
    //}else{
    //  this.textGrid[row].uiIconImg.opacity = 1
    //}
    //dim it, dont hide it? row++;
    //this.textGrid[row].uiText.value

    if (data.uiIconSection !== undefined) {
      setSection(this.textGrid[row].uiIconImg, data.uiIconSection);
    }
  }
  updateGrid() {
    const arr: CustomGridTextRowData[] = [
      this.bronzeShoe,
      this.coins,
      this.coinsEarned,
      this.bronze,
      this.dollars,
      this.rock1,
      this.rock2,
      this.rock3,
      this.nitro,
      this.petro,
      this.material1,
      this.material2,
      this.material3,
    ];
    //ask
    //if(){
    //,
    //}

    this.hideGrid();
    //debugger
    let row = 0;
    for (let x = 0; x < arr.length; x++) {
      if (arr[x].text !== undefined && arr[x].text.length > 0) {
        this.updateGridIndex(row, arr[x]);
        row++;
      } else {
        log("updateGrid was blank", arr[x]);
      }
    }
    /*
    row++
    row++
    //push it down to its own row
    this.updateGridIndex(row,this.coinsEarned)*/
  }
  reset(){
    this.updateTitle("")
    this.updateCoins("")
    this.updateDollar("")
    this.updateSubGameDollars("")
    this.updateText("")
    this.updateMaterial1("")
    this.updateMaterial2("")
    this.updateMaterial3("")
    this.updatePetro("")
    this.updateNitro("")
    this.updateRock1("")
    this.updateRock2("")
    this.updateRock3("")
    this.updateBronze("")
    this.updateBronzeShoe("")
  }
  updateTitle(title: string) {
    this.title.text.value = title;
  }
  updateText(text: string) {
    this.text.text.value = text;
  }
  updateCoins(text: string | number) {
    this.coins.text = typeof text === "string" ? text : Math.floor(text).toFixed(0);
    //this.coins = coins;
  }
  updateCoinsEarned(coins: string) {
    this.coinsEarned.text = coins;
    //TODO
    //updateCoinsEarned
    //this.coins.text.value = coins
  }
  //for voxboard subgame, placeholder if need own object
  updateSubGameDollars(dollar: string) {
    this.dollars.text = dollar;
  }

  //material update placeholders
  updateMaterial1(val: string) {
    this.material1.text = val;
  }
  updateMaterial2(val: string) {
    this.material2.text = val;
  }
  updateMaterial3(val: string) {
    this.material3.text = val;
  }

  updateDollar(text: string|number) {
    this.dollars.text = typeof text === "string" ? text : Math.floor(text).toFixed(0);
  }

  updateRock1(text: string|number) {
    this.rock1.text = typeof text === "string" ? text : Math.floor(text).toFixed(0);
  }
  updateRock2(text: string|number) {
    this.rock2.text = typeof text === "string" ? text : Math.floor(text).toFixed(0);
  }
  updateRock3(text: string|number) {
    this.rock3.text = typeof text === "string" ? text : Math.floor(text).toFixed(0);
  }
  updatePetro(text: string|number) {
    this.petro.text = typeof text === "string" ? text : Math.floor(text).toFixed(0);
  }
  updateNitro(text: string|number) {
    this.nitro.text = typeof text === "string" ? text : Math.floor(text).toFixed(0);
  }
  updateBronze(text: string|number) {
    this.bronze.text = typeof text === "string" ? text : Math.floor(text).toFixed(0);
  }
  updateBronzeShoe(text: string|number) {
    this.bronzeShoe.text = typeof text === "string" ? text : Math.floor(text).toFixed(0);
  }
  
}
export class AbstractGridPrompt extends AbstractBaseGridPrompt implements Modal {
  constructor(
    title: string,
    text: string,
    buttonConfirm: string,
    primaryCallback?: () => void,
    options?: CustomPromptOptions
  ) {
    super(title,text,buttonConfirm,primaryCallback,options)
  }
  initGrid(args:{rowXPos?:number,rowYPos?:number,rowXWidth?:number,rowYHeight?:number}){

    let rowYPos = args.rowYPos !== undefined ? args.rowYPos : 5; 
    const rowYHeight = args.rowYHeight !== undefined ? args.rowYHeight : 20;
    const fontSize = 12;
    const row1Xwidth = 70;
    const row1X = -70;
    const row2X = 70;
    const row1Ximage = row1X - 50;
    const row2Ximage = row2X - 50;
    const iconSizeWidth = 16;
    const iconSizeHeight = 16;
    const imageShiftY = 2;

    const addAfter: CustomGridTextRow[] = [];
    for (let x = 0; x < 4; x++) {
      let strText = "xxx";
      switch (x) {
        case 1:
          strText = "Gwood";
          break;
        case 2:
          strText = "diamon";
          break;
        case 3:
          strText = "lil coin";
          break;
      }

      let text = this.prompt.addText(
        strText + x,
        row1X,
        rowYPos,
        Color4.White(),
        fontSize
      );
      text.text.hTextAlign = "left";
      text.text.width = 70;

      let icon = this.prompt.addIcon(
        "",
        row1Ximage,
        rowYPos - rowYHeight + imageShiftY,
        iconSizeWidth,
        iconSizeHeight,
        atlas_mappings.icons.coin
      );
      icon.image.source = custUiAtlas;
      setSection(icon.image, atlas_mappings.icons.coin);

      this.textGrid.push(new CustomGridTextRow(undefined,icon.image,text.text));

      text = this.prompt.addText(
        strText + x,
        row2X,
        rowYPos,
        Color4.White(),
        fontSize
      );
      text.text.hTextAlign = "left";
      text.text.width = 70;
 
      icon = this.prompt.addIcon(
        "",
        row2Ximage,
        rowYPos - rowYHeight + imageShiftY,
        iconSizeWidth,
        iconSizeHeight,
        atlas_mappings.icons.coin
      );
      icon.image.source = custUiAtlas;
      setSection(icon.image, atlas_mappings.icons.coin);
 
      //dont add right away so it adds down
      addAfter.push(new CustomGridTextRow(undefined,icon.image,text.text));

      rowYPos -= rowYHeight;
    }

    //debugger 
    for (const p in addAfter) {
      this.textGrid.push(addAfter[p]);
    }

    this.updateGrid();

  }
}
export class InventoryPrompt extends AbstractBaseGridPrompt implements Modal {
    constructor(
      title: string,
      text: string,
      buttonConfirm: string,
      primaryCallback?: () => void,
      options?: CustomPromptOptions
    ) {
      // 1200 / 735   
      const scale = .5
      options = {height:735*scale,width:1200*scale}
      super(title,text,buttonConfirm,primaryCallback,options)

      this.initGrid({rowXPos:0,rowYPos:70})

      this.text.text.value = ""
      this.title.text.value = ""
      this.text.text.positionY = -100

      
      //this.prompt.closeIcon.positionX = "41%";
      //this.prompt.closeIcon.positionY = "22%";

      applyInventoryPanel(this.prompt, this.buttonPrimary, options);
      
      updateCloseBtnPosition(this.prompt,-10)
    }
    initGrid(args:{rowXPos?:number,rowYPos?:number,rowXWidth?:number,rowYHeight?:number}){
  
      let _rowXPos = args.rowXPos !== undefined ? args.rowXPos : 5; 
      let rowYPos = args.rowYPos !== undefined ? args.rowYPos : 5; 
      let rowXPos = _rowXPos
      let spacing = 10
      const rowYHeight = args.rowYHeight !== undefined ? args.rowYHeight : 50;
      const rowXWidth = args.rowXWidth !== undefined ? args.rowXWidth : 50;
      const fontSize = 12;
  
      //change these to change number of rows/columns
      const rowDim = 3
      const columnDim = 4 + 3

      const rowXOffset = (rowXWidth * columnDim)/2 * -1
  
      const addAfter: CustomGridTextRow[] = [];
      
      for (let x = 0; x < rowDim; x++) {
        rowXPos = _rowXPos
        for(let y =0; y < columnDim; y++){
          let strText = "xxx";
          switch (x) {
            case 1:
              strText = "Gwood";
              break;
            case 2:
              strText = "diamon";
              break;
            case 3:
              strText = "lil coin";
              break;
          }
    
          const containerWidth = rowXWidth
          const containerHeight = rowYHeight
          const IMAGE_SHIFT_X = 0
          const container = new UIContainerRect(this.prompt.background)
          container.width = containerWidth
          container.height = containerHeight
          container.hAlign = "center"
          container.vAlign = "center"
          container.positionX = rowXOffset + rowXPos
          container.positionY = rowYPos
          
          let shadow = new UIContainerRect(container)
          shadow.hAlign = "right"
          shadow.vAlign = "center"
          shadow.width = containerWidth * 1
          shadow.height = containerWidth * 1
          shadow.color = Color4.Black()
          shadow.opacity = 0//.7
          //shadow.positionX = -7 + IMAGE_SHIFT_X
          //shadow.positionY = -2


          const itemBg = new UIImage(container, custUiAtlasInventory)
          itemBg.width = containerWidth * 1
          itemBg.height = containerHeight * 1
          itemBg.hAlign = "center"
          itemBg.vAlign = "center"
          //itemBg.positionX = -5 + IMAGE_SHIFT_X
          //itemBg.positionY = -2 //+ IMAGE_SHIFT_X

          setSection(itemBg, atlas_mappings.icons.inventoryItemSlot);
 
          const scaleDown = .9
          //const imgTexture = rewardImage !== undefined && rewardImage.length > 0 ? new Texture(rewardImage) : defaultRewardIcon
          const itemImage = new UIImage(container, custUiAtlas)
          itemImage.width = containerWidth * scaleDown
          itemImage.height = containerHeight * scaleDown
          itemImage.hAlign = "center"
          itemImage.vAlign = "center"
          itemImage.positionX = (containerWidth * (1-scaleDown)) + IMAGE_SHIFT_X
          //itemImage.positionY = (containerHeight * (1-scaleDown)) //+ IMAGE_SHIFT_X

          setSection(itemImage, atlas_mappings.icons.coin);

          //const imgTexture = rewardImage !== undefined && rewardImage.length > 0 ? new Texture(rewardImage) : defaultRewardIcon
          const itemText = new UIText(container)
          itemText.value = "x 999"
          itemText.color = Color4.White()
          itemText.fontSize = fontSize
          itemText.width = containerWidth * scaleDown
          itemText.height = containerHeight * scaleDown
          itemText.hAlign = "right"
          itemText.hTextAlign = "right"
          itemText.vAlign = "bottom"
          //itemText.positionX = -1*(containerWidth * (1-scaleDown)) + IMAGE_SHIFT_X
          //itemText.positionY = (containerHeight * (1-scaleDown)) //+ IMAGE_SHIFT_X
    
          this.textGrid.push(new CustomGridTextRow(container,itemImage,itemText,itemBg)); 

          //rowYPos -= rowYHeight;
          rowXPos += rowXWidth + spacing
        }
        rowYPos -= rowYHeight + spacing
        
      }
  
      this.updateGrid();
  
    }
    updateGrid() {
      const arr: CustomGridTextRowData[] = [
        this.coins,
        this.coinsEarned,
        this.bronze,
        this.bronzeShoe,
        this.dollars,

        this.rock1,
        this.rock2,
        this.rock3,

        this.nitro,
        this.petro,

        /* //this is inventory, not VC, not using for now 
        this.material1,
        this.material2,
        this.material3,*/
      ];
      //ask
      //if(){
      //,
      //}
  
      //call hide gride to hide 0 values?
      this.clearGrid();
      //debugger
      let row = 0;
      for (let x = 0; x < arr.length; x++) {
        if (arr[x].text !== undefined && arr[x].text.length > 0) {
          this.updateGridIndex(row, arr[x]);
          //this.textGrid[row].uiText.value = arr[x].text//x+""
          row++;
        } else {
          log("updateGrid was blank", arr[x]);
        }
      }
      /*
      row++
      row++
      //push it down to its own row
      this.updateGridIndex(row,this.coinsEarned)*/
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

    this.title.text.value = "2"
    this.title.text.positionX = 0
    this.title.text.positionY = 55
    this.title.text.vAlign = 'center'
    this.title.text.vTextAlign = 'center'
    this.title.text.fontSize = 80
    this.title.text.color = Color4.White()

    this.text.text.value = ''//not needed right now
    this.text.text.positionX = 0
    this.text.text.positionY = -50 
    this.text.text.vAlign = 'center'
    this.text.text.vTextAlign = 'center'

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
          case CONFIG.GAME_COIN_TYPE_MC:
            this.updateDollar(reward.rewards[p].amount.toFixed(0))
            break;
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

    this.initGrid({}) 


    this.secundaryCallback = secundaryCallback;

    this.buttonConfirm = buttonConfirm;
    this.buttonSubtitleConfirm = buttonSubtitleConfirm;
    this.buttonRaffle = buttonRaffle;
    this.buttonSubtitleRaffle = buttonSubtitleRaffle;
    const sfFont = getOrCreateFont(Fonts.SanFrancisco)

    let secundaryButton = this.prompt.addButton(
      this.buttonRaffle,
      50,
      -50,
      () => {
        if (this.secundaryCallback) this.secundaryCallback();
        this.hide();
      },
      ui.ButtonStyles.E
    );
    if (secundaryButton.icon) {
      secundaryButton.icon.visible = false;
      log(secundaryButton.label);
      secundaryButton.label.positionX = -5;
      secundaryButton.label.positionY = 5;
    }
    let subtitleConfirm = new CustomPromptText(
      this.prompt,
      this.buttonSubtitleRaffle,
      65,
      -160,
      false,
      Color4.White(),
      8
    );

    subtitleConfirm.text.vAlign = "center";
    subtitleConfirm.text.adaptHeight = true;
    subtitleConfirm.text.font = sfFont;
    subtitleConfirm.text.isPointerBlocker = false;
    let subtitleRaffle = new CustomPromptText(
      this.prompt,
      this.buttonSubtitleConfirm,
      -78,
      -160,
      false,
      Color4.White(),
      8
    );
    subtitleRaffle.text.vAlign = "center";
    subtitleRaffle.text.adaptHeight = true;
    subtitleRaffle.text.font = sfFont;
    subtitleRaffle.text.isPointerBlocker = false;

    this.hide();
    applyRafflePanel(this.prompt, this.buttonPrimary, secundaryButton, options);
  }
}

//TODO share with interface type of NFTUIDataPrice and NFTUIDataPriceType
export type CustomClaimPriceType = "VirtualCurrency" | "Material";

export type CustomClaimCost = {
  price: number;
  type: CustomClaimPriceType;
  id: string;
  label: string;
};
export type CustomClaimArgs = {
  imagePath?: string;
  imageHeight?: number;
  imageWidth?: number;
  itemName?: string;
  subtitleItemName?: string;
  title?: string;
  subtitle?: string;
  coins?: string;
  cost?: CustomClaimCost[]; //FIXME, must send in multi costs
  dollars?: string;

  rock1?: string
  rock2?: string
  rock3?: string
  bronze?: string
  nitro?: string
  petro?: string

  bronzeShoe?: string
  
  showStockQty?:boolean //defaults to true
  itemQtyCurrent?:number
  itemQtyTotal?:number

  claimWindowEnabled?:boolean,//defaults to false
  claimStartMS?: number,
  claimEndMS?: number,

  contract?: string,
  itemId?:string,

  claimCallback?: () => void,
  //onOpenCallback?: () => void,
  options?: CustomPromptOptions;
};
export class CustomClaimPrompt implements Modal {
  prompt: ui.CustomPrompt;
  claimButton: ui.CustomPromptButton
  image: ui.CustomPromptIcon;
  itemName: ui.CustomPromptText;
  subtitleItemName: CustomPromptText;
  title: CustomPromptText;
  subtitle: CustomPromptText;
  itemQtyAmount: CustomPromptText;
  claimWindow: CustomPromptText;
  checkingLatestPriceUI: CustomPromptText;
  checkingLatestPrice:boolean = false
  
  coins: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.coin,
    text: "",
  };
  dollars: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.dimond,
    text: "",
  };

  rock1: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.rock1,
    text: "",
  };
  rock2: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.rock2,
    text: "",
  };
  rock3: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.rock3,
    text: "",
  };
  petro: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.petro,
    text: "",
  };
  nitro: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.nitro,
    text: "",
  };
  bronze: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.bronze,
    text: "",
  };
  bronzeShoe: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.bronzeShoe,
    text: "",
  };

  contract?: string
  itemId?:string
  showStockQty?:boolean=false
  itemQtyTotal?:number

  textGrid: CustomGridTextRow[] = [];

  claimCallback?: () => void;
  options?: CustomPromptOptions;
  constructor(args: CustomClaimArgs) {
    this.claimCallback = args.claimCallback;
    //this.title = args.title;
    //this.imagePath = args.imagePath;
    //this.subtitleItemName = args.subtitleItemName;
    //this.itemName = args.itemName;
    //this.subtitle = args.subtitle;
    //this.coins = args.coins;
    //this.dollars = args.dollars;

    this.prompt = new ui.CustomPrompt(undefined, undefined, undefined, true);
    let titleUI = (this.itemName = this.prompt.addText(
      "itemName",
      125 + 75,
      210,
      new Color4(1, 0.906, 0.553, 1),
      25 * SCALE_FONT_CLAIM_TITLE
    ));
    const sfFont = getOrCreateFont(Fonts.SanFrancisco)
    titleUI.text.vAlign = "center";
    titleUI.text.adaptHeight = true;

    titleUI.text.hTextAlign = "left";
    titleUI.text.textWrapping = true
    titleUI.text.width = 280

    /*     titleUI.text.shadowColor = new Color4(1, 0.906, 0.553, 1);
    titleUI.text.shadowOffsetX = 15;
    titleUI.text.shadowOffsetY = 15;
    titleUI.text.shadowBlur = 2; */
      
    let itemsubtitleText = (this.subtitleItemName = new CustomPromptText(
      this.prompt,
      "subtitleItemName",
      112,
      185,
      false,
      new Color4(0.247, 0.82, 0.718, 1),
      16 * SCALE_FONT_CLAIM
    ));

    itemsubtitleText.text.vAlign = "center";
    itemsubtitleText.text.adaptHeight = true;
    itemsubtitleText.text.font = sfFont;
    itemsubtitleText.text.fontSize = 10 * SCALE_FONT_CLAIM;

    let titleText = (this.title = new CustomPromptText(
      this.prompt,
      "title",
      200,
      145,
      false,
      Color4.White(),
      12 * SCALE_FONT_CLAIM
    ));
    titleText.text.vAlign = "center";
    titleText.text.adaptHeight = true;
    titleText.text.font = sfFont;
    titleText.text.fontSize = 15 * SCALE_FONT_CLAIM_TITLE;

    let subtitleText = (this.subtitle = new CustomPromptText(
      this.prompt,
      "subtitle",
      200,
      100,
      false,
      Color4.White(),
      12 * SCALE_FONT_CLAIM
    ));
    subtitleText.text.vAlign = "center";
    subtitleText.text.adaptHeight = true;
    subtitleText.text.font = sfFont;
    subtitleText.text.fontSize = 11 * SCALE_FONT_CLAIM;

 
    let itemQtyAmount = (this.itemQtyAmount = new CustomPromptText(
      this.prompt,
      "00/00",
      125 + 75,
      110 + 70,
      false,
      new Color4(1, 0.906, 0.553, 1),
      14 * SCALE_FONT_CLAIM
    ));
    itemQtyAmount.text.vAlign = "center";
    itemQtyAmount.text.adaptHeight = true;
    itemQtyAmount.text.hTextAlign = "left";
    itemQtyAmount.text.textWrapping = true
    itemQtyAmount.text.width = titleUI.text.width //250
    itemQtyAmount.text.font = sfFont;
    itemQtyAmount.text.fontSize = 14 * SCALE_FONT_CLAIM;

    let claimWindow = (this.claimWindow = new CustomPromptText(
      this.prompt,
      claimWindowPrefixNotStarted + convertDateToYMDHMS(new Date()),
      125 + 75,
      -60 - 120,
      false,
      Color4.White(),//new Color4(1, 0.906, 0.553, 1),
      12 * SCALE_FONT_CLAIM
    ));
    claimWindow.text.vAlign = "center";
    claimWindow.text.adaptHeight = true;
    claimWindow.text.hTextAlign = "left";
    claimWindow.text.textWrapping = true
    claimWindow.text.width = titleUI.text.width //250
    claimWindow.text.font = sfFont;
    claimWindow.text.fontSize = 12 * SCALE_FONT_CLAIM;


    let checkingLatestPrice = this.checkingLatestPriceUI = new CustomPromptText(
      this.prompt,
      i18n.t("checkingLatestPrices",{ns:namespaces.ui.prompts}),
      200,
      -50,
      false,
      Color4.Green(),
      12 * SCALE_FONT_CLAIM
    );
    checkingLatestPrice.text.vAlign = "center";
    checkingLatestPrice.text.adaptHeight = true;
    checkingLatestPrice.text.font = sfFont;
    checkingLatestPrice.text.fontSize = 15 * SCALE_FONT;

    checkingLatestPrice.hide()

    const showCostIcons = CONFIG.CLAIM_CHECK_FOR_LATEST_PRICES 
      && (args.options.costShowIcons === undefined || args.options.costShowIcons === true)

    const COST_X_BASE = showCostIcons && CONFIG.CLAIM_CHECK_FOR_LATEST_PRICES ? 180 : 200
    let costText = new CustomPromptText(
      this.prompt,
      i18n.t("title.costToUpper",{ns:namespaces.common}),
      COST_X_BASE,
      40,
      false,
      Color4.White(),
      12 * SCALE_FONT_CLAIM
    );
    costText.text.vAlign = "center";
    costText.text.adaptHeight = true;
    costText.text.font = sfFont;
    costText.text.fontSize = 15 * SCALE_FONT;

    i18nOnLanguageChangedAdd((lng:string) => {
      costText.text.value = i18n.t("title.costToUpper",{ns:namespaces.common})
    })

    if(showCostIcons){
      let costInfoIcon = this.prompt.addIcon(
        "",
        COST_X_BASE+72,
        40-4,
        28,
        28,
        atlas_mappings.icons.coin
      );
      costInfoIcon.image.source = custUiAtlas;
      setSection(costInfoIcon.image, atlas_mappings.icons.costInfo);
      costInfoIcon.image.onClick = new OnClick(() => {
        openExternalURL("https://docs.google.com/document/d/1a11Xpk1sI4Kmpw_FyN4b5mTI5_vs2PPnEAhUX6en-2Y/edit?usp=sharing")
      });

      let costRefresIcon = this.prompt.addIcon(
        "",
        COST_X_BASE+42,
        40-4,
        28,
        28,
        atlas_mappings.icons.coin
      );
      costRefresIcon.image.source = custUiAtlas;
      setSection(costRefresIcon.image, atlas_mappings.icons.costRefresh);
      costRefresIcon.image.onClick = new OnClick(() => {
        this.refreshData()
      });
    }
    /*
    let coinsText = (this.coins = new CustomPromptText(
      this.prompt,
      "coins",
      130,
      -3,
      false,
      Color4.White(),
      12 * SCALE_FONT_CLAIM
    ));

    coinsText.text.vAlign = "center";
    coinsText.text.adaptHeight = true;
    coinsText.text.font = sfFont;
    
    let dollarsText = (this.dollars = new CustomPromptText(
      this.prompt,
      "dollars",
      130,
      -33,
      false,
      Color4.White(),
      12 * SCALE_FONT_CLAIM
    ));
    dollarsText.text.vAlign = "center";
    dollarsText.text.adaptHeight = true;
    dollarsText.text.font = sfFont;
    
      */
    let claimButton = this.claimButton = this.prompt.addButton(
      i18n.t("button.claim", {ns:namespaces.common}),
      -65,
      -60,
      () => {
        if (this.claimCallback) this.claimCallback();
        this.hide();
      },
      ui.ButtonStyles.E
    );
    
    if (claimButton.icon) {
      claimButton.icon.visible = false;
      log(claimButton.label);
      claimButton.label.positionX = -5;
      claimButton.label.positionY = 5;
    }

    let image = (this.image = this.prompt.addIcon(
      args.imagePath ? args.imagePath : "",
      -135,
      20,
      300,
      300
    ));
    image.image.sourceTop = 0;
    image.image.sourceLeft = 0;
    image.image.vAlign = "center";
    image.image.hAlign = "center";
    image.image.sourceWidth = args.imageWidth ? args.imageWidth : 512;
    image.image.sourceHeight = args.imageHeight ? args.imageHeight : 512;

    let rowYPos = 25;
    const rowYHeight = 20;
    const fontSize = 12;

    const row1Xwidth = 70;
    const row1X = 130;
    const row2X = 130 + 120;
    const row1Ximage = row1X - 50;
    const row2Ximage = row2X - 50;
    const iconSizeWidth = 16;
    const iconSizeHeight = 16;
    const imageShiftY = 2;

    const addAfter: CustomGridTextRow[] = [];
    for (let x = 0; x < 4; x++) {
      let strText = "xxx";
      switch (x) {
        case 1:
          strText = "wood";
          break;
        case 2:
          strText = "diamon";
          break;
        case 3:
          strText = "lil coin";
          break;
      }

      let text = this.prompt.addText(
        strText + x,
        row1X,
        rowYPos,
        Color4.White(),
        fontSize
      );
      text.text.hTextAlign = "left";
      text.text.width = 70;

      let icon = this.prompt.addIcon(
        "",
        row1Ximage,
        rowYPos - rowYHeight + imageShiftY,
        iconSizeWidth,
        iconSizeHeight,
        atlas_mappings.icons.coin
      );
      icon.image.source = custUiAtlas;
      setSection(icon.image, atlas_mappings.icons.coin);

      this.textGrid.push(new CustomGridTextRow(undefined,icon.image,text.text));

      text = this.prompt.addText(
        strText + x,
        row2X,
        rowYPos,
        Color4.White(),
        fontSize
      );
      text.text.hTextAlign = "left";
      text.text.width = 70;

      icon = this.prompt.addIcon(
        "",
        row2Ximage,
        rowYPos - rowYHeight + imageShiftY,
        iconSizeWidth,
        iconSizeHeight,
        atlas_mappings.icons.coin
      );
      icon.image.source = custUiAtlas;
      setSection(icon.image, atlas_mappings.icons.coin);

      //dont add right away so it adds down
      //addAfter.push({ uiIcon: icon, text: text });
      addAfter.push(new CustomGridTextRow(undefined,icon.image,text.text));

      rowYPos -= rowYHeight;
    }

    //this.updateCoins(coins)
    //this.updateDollar(dollars)
    for (const p in addAfter) {
      this.textGrid.push(addAfter[p]);
    }

    for(let row=0;row<this.textGrid.length;row++){
      //if(row === 4){
      //workaround, not sure how but its blocking the cost "?" and "price refresh buttons"
      //if we ever need this clickable will solve why
      if(this.textGrid[row].uiItemBg) this.textGrid[row].uiItemBg.isPointerBlocker = false
      if(this.textGrid[row].uiIconImg) this.textGrid[row].uiIconImg.isPointerBlocker = false
      if(this.textGrid[row].uiText) this.textGrid[row].uiText.isPointerBlocker = false
      //}
    }
    this.updateGrid();

    this.updateData(args);

    this.hide();
    applyClaimPanel(
      this.prompt,
      claimButton,
      undefined,
      args.options ?? this.options
    );
  }
  showCheckingLatestPrice(val:boolean){
    if(val){
      this.checkingLatestPriceUI.show()
    }else{
      this.checkingLatestPriceUI.hide()
    }
    //because of async calls must remember last status
    this.checkingLatestPrice = val
  }
  refreshData():void{
    const METHOD_NAME = "refreshData"
    if(!CONFIG.CLAIM_CHECK_FOR_LATEST_PRICES){
      log("CONFIG.CLAIM_CHECK_FOR_LATEST_PRICES disabled, not to check...",CONFIG.CLAIM_CHECK_FOR_LATEST_PRICES)
      this.showCheckingLatestPrice(false)
      return
    }
    if(this.contract === undefined ){
      log("no contract to check against, ignoreing...")
      this.showCheckingLatestPrice(false)
      return
    }
    this.showCheckingLatestPrice(true)
    //do price update check
    const result = fetchNFTData(this.contract).then(
      (result:any)=>{
        if(isNFTResultValid(result)){

          for(const r in result.assets.supplyNfts){
            const newValItm = result.assets.supplyNfts[r]
            const newValAddress = newValItm.contract ? (newValItm.contract+"").toLowerCase() : undefined
            const newValAmount = newValItm.count
            const costs = newValItm.costs
          
            if (costs !== undefined && costs.length > 0) {
              //reset them so they can be set again
              for(const p of [this.bronzeShoe,this.coins,this.bronze,this.dollars,this.rock1,this.rock2,this.rock3,this.petro,this.nitro]){
                p.text = ""
              }

              for (let p in costs) {
                const price = costs[p].amount?.toFixed(0);
                const id = costs[p].virtualCurrency;
                switch (id) {
                  case CONFIG.GAME_COIN_TYPE_GC:
                    this.coins.text = price;
                    break;
                  case CONFIG.GAME_COIN_TYPE_MC: 
                    this.dollars.text = price;
                    break;
                  case CONFIG.GAME_COIN_TYPE_R1:
                    this.rock1.text = price;
                    break;
                  case CONFIG.GAME_COIN_TYPE_R2: 
                    this.rock2.text = price;
                    break;
                  case CONFIG.GAME_COIN_TYPE_R3:
                    this.rock3.text = price;
                    break;
                  case CONFIG.GAME_COIN_TYPE_BZ: 
                    this.bronze.text = price;
                    break;
                  //TODO bronzeShoe
                  case CONFIG.GAME_COIN_TYPE_NI: 
                    this.nitro.text = price;
                    break;
                  case CONFIG.GAME_COIN_TYPE_BP: 
                    this.petro.text = price;
                    break;
                  case CONFIG.GAME_COIN_TYPE_BRONZE_SHOE_1_ID:
                    this.bronzeShoe.text = price
                    break;
                  case CONFIG.GAME_COIN_TYPE_MATERIAL_1_ID:
                  case CONFIG.GAME_COIN_TYPE_MATERIAL_2_ID:
                  case CONFIG.GAME_COIN_TYPE_MATERIAL_3_ID:
                    //args. = price
                    //TODO
                    break;
                }
              }
            }
    
            this.updateQty( newValAmount )
            this.updateGrid();
          }
        }else{
          log(METHOD_NAME,"invalid result",result)
        }
        this.showCheckingLatestPrice(false)
      }
    )
    
  }
  show(): void {
    this.refreshData()
    utils.setTimeout(customDelayMs, () => {
      this.prompt.show();
      this.showCheckingLatestPrice(this.checkingLatestPrice)
      this.updateGrid();
    });
  }
  hide(): void {
    this.prompt.hide();
  }

  hideGrid() {
    for (let x = 0; x < this.textGrid.length; x++) {
      //log("hideGrid", x);
      this.textGrid[x].hide();
    }
  }

  updateGridIndex(row: number, data: CustomGridTextRowData) {
    if(this.textGrid===undefined){
      log("updateGridIndex WARN this.textGrid is null ",row,this.textGrid)
      return;
    }
    if(this.textGrid[row] === undefined){
      log("updateGridIndex WARN invalid index ",row,this.textGrid.length)
      return;
    }
    this.textGrid[row].show();
    //this.textGrid[row].uiIcon.show();

    if(this.textGrid[row].uiText !== undefined) this.textGrid[row].uiText.value = data.text;

    if (data.uiIconSection !== undefined) {
      setSection(this.textGrid[row].uiIconImg, data.uiIconSection);
    }
  }
  updateGrid() {
    const arr: CustomGridTextRowData[] = [this.bronzeShoe,this.coins, this.bronze, this.dollars
      , this.rock1,this.rock2,this.rock3
      ,this.petro,this.nitro];
    //ask
    //if(){
    //,
    //}

    this.hideGrid();
    //debugger
    let row = 0;
    for (let x = 0; x < arr.length; x++) {
      if (arr[x].text !== undefined && arr[x].text.length > 0) {
        this.updateGridIndex(row, arr[x]);
        row++;
      } else {
        log("updateGrid was blank", arr[x]);
      }
    }
    /*
    row++
    row++
    //push it down to its own row
    this.updateGridIndex(row,this.coinsEarned)*/
  }
  updateData(args: CustomClaimArgs) {
    //this.prompt = new ui.CustomPrompt(undefined, undefined, undefined, true);

    //TODO WEB3 CHECK AND CHANGE BUY TO BUY:WALLET REQUIRED!

    //FIXME need a grid
    if (args.cost !== undefined && args.cost.length > 0) {
      for (let p in args.cost) {
        const price = args.cost[p].price?.toFixed(0);
        const id = args.cost[p].id;
        switch (id) {
          case CONFIG.GAME_COIN_TYPE_GC:
            args.coins = price;
            break;
          case CONFIG.GAME_COIN_TYPE_MC:
            args.dollars = price;
            break;
          case CONFIG.GAME_COIN_TYPE_R1:
            args.rock1 = price;
            break;
          case CONFIG.GAME_COIN_TYPE_R2:
            args.rock2 = price;
            break;
          case CONFIG.GAME_COIN_TYPE_R3:
            args.rock3 = price;
            break;
          case CONFIG.GAME_COIN_TYPE_BP:
            args.petro = price;
            break;
          case CONFIG.GAME_COIN_TYPE_NI:
            args.nitro = price;
            break;
          case CONFIG.GAME_COIN_TYPE_BZ:
            args.bronze = price;
            break;
          case CONFIG.GAME_COIN_TYPE_BRONZE_SHOE_1_ID:
            args.bronzeShoe = price;
            break;
          case CONFIG.GAME_COIN_TYPE_MATERIAL_1_ID:
          case CONFIG.GAME_COIN_TYPE_MATERIAL_2_ID:
          case CONFIG.GAME_COIN_TYPE_MATERIAL_3_ID:
            //args. = price
            //TODO
            break;
        }
      }
      //args.coins = args.cost[0].price?.toFixed(0);
    }

    this.contract = args.contract
    this.itemId = args.itemId
    this.claimCallback = args.claimCallback;
    this.itemName.text.value = args.itemName ? args.itemName : "";
    //this.itemName.text.value = "xsdflkj flsdkj dlskfj dlskfjdskl j"
    //this.itemName.text.value = "slfkjdsflksj fdsl "
    this.subtitleItemName.text.value = args.subtitleItemName
      ? args.subtitleItemName
      : "";

    this.showStockQty = args.showStockQty
    this.itemQtyTotal = args.itemQtyTotal
    const currQty = args.itemQtyCurrent
      this.updateQty(currQty)

      if(args.claimWindowEnabled !== undefined && args.claimWindowEnabled === true){
        const now = Date.now()
        const expired = args.claimEndMS >= 0 && args.claimEndMS < now
        if( args.claimStartMS >= 0 && args.claimStartMS > now && !expired){
          this.claimWindow.text.value = claimWindowPrefixNotStarted + convertDateToYMDHMS( new Date(args.claimStartMS) )
        }else if( expired ){
            this.claimWindow.text.value = claimWindowPrefixExpired + convertDateToYMDHMS( new Date(args.claimEndMS) )
        }else{
          //TODO IMPL OTHER VARIENTS
          this.claimWindow.text.value = ""
        }
      }else{
        //dont show
        this.claimWindow.text.value = ""
      }

    
    this.title.text.value = args.title ? args.title : "";
    this.subtitle.text.value = args.subtitle ? args.subtitle : "";
    
    this.coins.text = args.coins ? args.coins : "";
    this.dollars.text = args.dollars ? args.dollars : "";

    this.rock1.text = args.rock1 ? args.rock1 : "";
    this.rock2.text = args.rock2 ? args.rock2 : "";
    this.rock3.text = args.rock3 ? args.rock3 : "";
    this.petro.text = args.petro ? args.petro : "";
    this.nitro.text = args.nitro ? args.nitro : "";
    this.bronze.text = args.bronze ? args.bronze : "";
    this.bronzeShoe.text = args.bronzeShoe ? args.bronzeShoe : "";

    this.updateGrid();
    /*
    let claimButton = this.prompt.addButton(
      "Claim",
      -65,
      -62,
      () => {
        if (this.claimCallback) this.claimCallback();
        this.hide();
      },
      ui.ButtonStyles.E
    );
    if (claimButton.icon) {
      claimButton.icon.visible = false;
      log(claimButton.label);
      claimButton.label.positionX = -5;
      claimButton.label.positionY = 5;
    }*/

    let image = this.image;
    image.image.source = new Texture(args.imagePath ? args.imagePath : "");
    image.image.sourceWidth = args.imageWidth ? args.imageWidth : 512;
    image.image.sourceHeight = args.imageHeight ? args.imageHeight : 512;
  }
  updateQty(currQty:number){
    if(this.showStockQty === undefined || this.showStockQty === true){
      if( currQty !== undefined && currQty >= 0 ){
        let qtyVal = currQty + ""
        if(this.itemQtyTotal){
          qtyVal += "/" + this.itemQtyTotal
        }else{
          qtyVal += " In Stock"
        }
        this.itemQtyAmount.text.value = "("+qtyVal+")" 
      }else{
        if(currQty === undefined){
          this.itemQtyAmount.text.value = i18n.t("stockNotAvailable",{ns:namespaces.ui.prompts})
        }else{
          this.itemQtyAmount.text.value = i18n.t("stockNotAvailable",{ns:namespaces.ui.prompts})
        }
      i18nOnLanguageChangedAdd((lng:string) => {
        this.itemQtyAmount.text.value = i18n.t("stockNotAvailable",{ns:namespaces.ui.prompts})
      })  
      }
    }else{
      //dont show
      this.itemQtyAmount.text.value = ""
    }
  }
}

function applyMapPanel(
  modal: ui.CustomPrompt,
  buttons: ui.CustomPromptButton[]
) {
  if (mapUiAtlas !== undefined) {
    modal.background.source = mapUiAtlas;

    modal.background.sourceWidth = 3840;
    modal.background.sourceLeft = 212;
    modal.background.sourceTop = 160;

    modal.background.sourceHeight = 2408;
    modal.background.height = OK_PROMPT_DEFAULT_HEIGHT * 2.2;
    modal.background.width = OK_PROMPT_DEFAULT_WIDTH * 2.2;
    modal.closeIcon.positionX = "370%";
    modal.closeIcon.positionY = "580%";
    modal.closeIcon.visible = false;

    if (modal instanceof ui.CustomPrompt) {
      modal.texture = custUiAtlas;
    }
    buttons.forEach((button) => {
      button.image.source = custUiAtlas;
      button.image.sourceLeft = 2340;
      button.image.sourceWidth = 707;
      button.image.sourceTop = 3784;
      button.image.sourceHeight = 158;
      button.image.width = "20%";
    });
  }
}

function applyButtonStyle(button?: CustomPromptButton){
  if (button) {
    button.image.source = custUiAtlas;
    
    button.image.sourceLeft = 2035;
    button.image.sourceWidth = 660;
    button.image.sourceTop = 2585;
    button.image.sourceHeight = 215;
    button.image.height = 75;
  }
}
function applyEmptyPanel(
  modal: ui.CustomPrompt,
  button?: CustomPromptButton,
  options?: CustomPromptOptions
) {
  if (custUiAtlas !== undefined) {
    modal.background.source = custUiAtlas;

    setSection(modal.background, atlas_mappings.backgrounds.emptyPanel);
    //modal.background.sourceWidth = 2024;
    //modal.background.sourceLeft = 0;

    //modal.background.sourceHeight = 1400;
    modal.background.height =
      options && options.height ? options.height : OK_PROMPT_DEFAULT_HEIGHT;
    modal.background.width =
      options && options.width ? options.width : OK_PROMPT_DEFAULT_WIDTH;
    modal.closeIcon.positionX = "40%";
    modal.closeIcon.positionY = "21%";

    
    if(button){
      applyButtonStyle(button);
      button.image.positionY =
        //options && options.height
          //? -1 * (options.height / OK_PROMPT_DEFAULT_HEIGHT) * 100 + 25 + "%"
          "-25%";
    }
    
    if (modal instanceof ui.CustomPrompt) {
      modal.texture = custUiAtlas;
    }
  }
}

const BUTTON_HEIGHT = 60
function applyInventoryPanel(
  modal: ui.CustomPrompt,
  button?: CustomPromptButton,
  options?: CustomPromptOptions
) {
  applyCustomOptionsPanel(modal,button,undefined,options)

  
  modal.background.source = custUiAtlasInventory

  modal.background.sourceWidth = 1200;
  modal.background.sourceLeft = 0;

  modal.background.sourceHeight = 735;

  button.image.positionX = 0

  button.image.height = BUTTON_HEIGHT
  //    raffleGamePrompt.buttonSecondaryBtn.image.height = BUTTON_HEIGHT

  //then fix
}

function applyClaimPanel(
  modal: ui.CustomPrompt,
  firstClaimButton: CustomPromptButton,
  secondaryClaimButton?: CustomPromptButton,
  options?: CustomPromptOptions
): void {
  if (custUiAtlas !== undefined) {
    modal.background.positionY = -30//push down a little away from stanima bar
    modal.background.source = custUiAtlas;

    modal.background.sourceTop = 1601;
    modal.background.sourceWidth = 1986;
    modal.background.sourceLeft = 0;

    modal.background.sourceHeight = 1271;

    modal.background.height =
      options && options.height
        ? options && options.height
        : CLAIM_PROMPT_DEFAULT_HEIGHT;
    modal.background.width =
      options && options.width
        ? options && options.width
        : CLAIM_PROMPT_DEFAULT_WIDTH;

    modal.closeIcon.positionX = "48%";
    modal.closeIcon.positionY = "45%";
    modal.closeIcon.source = custUiAtlas; //<== THIS POINTS AT OUR IMAGE ATLAS
    modal.closeIcon.sourceLeft = 3843; //TODO change these to map to it
    modal.closeIcon.sourceWidth = 105;//change these to map to it
    modal.closeIcon.sourceTop = 310;//change these to map to it
    modal.closeIcon.sourceHeight = 105;//change these to map to it

    if (secondaryClaimButton) {
      firstClaimButton.image.source = custUiAtlas;
      firstClaimButton.image.positionY = "-26%";
      firstClaimButton.image.positionX = "17%";
      firstClaimButton.image.sourceLeft = 2028;
      firstClaimButton.image.sourceWidth = 399;
      firstClaimButton.image.sourceTop = 1800;
      firstClaimButton.image.sourceHeight = 183;
      firstClaimButton.image.width = "20%";
      firstClaimButton.image.height = "15%";
      firstClaimButton.label.positionY = 0;

      secondaryClaimButton.image.source = custUiAtlas;
      secondaryClaimButton.image.positionY = "-26%";
      secondaryClaimButton.image.positionX = "36%";
      secondaryClaimButton.image.sourceLeft = 2028;
      secondaryClaimButton.image.sourceWidth = 399;
      secondaryClaimButton.image.sourceTop = 2074;
      secondaryClaimButton.image.sourceHeight = 183;
      secondaryClaimButton.image.width = "20%";
      secondaryClaimButton.image.height = "15%";
      secondaryClaimButton.label.positionY = 0;
      secondaryClaimButton.label.positionX = 3;
    } else {
      firstClaimButton.image.source = custUiAtlas;
      firstClaimButton.image.positionY = "-27%";
      firstClaimButton.image.positionX = "27%";
      firstClaimButton.image.sourceLeft = 2750;
      firstClaimButton.image.sourceWidth = 800;
      firstClaimButton.image.sourceTop = 2606;
      firstClaimButton.image.sourceHeight = 215;
      firstClaimButton.image.width = "41%";
      firstClaimButton.image.height = "15%";
      firstClaimButton.label.positionY = 10;
    }
    if (modal instanceof ui.CustomPrompt) {
      modal.texture = custUiAtlas;
    }
  }
}


function applyLevelUpPanel(
  modal: ui.CustomPrompt,
  button?: CustomPromptButton,
  options?: CustomPromptOptions
) {
  if (custUiAtlas !== undefined) {
    modal.background.source = CommonResources.RESOURCES.textures.avatarswap04

    modal.background.height =
      options && options.height
        ? options && options.height
        : CLAIM_PROMPT_RAFFLE_HEIGHT;
    modal.background.width =
      options && options.width
        ? options && options.width
        : CLAIM_PROMPT_RAFFLE_WIDTH;

        
    setSection(modal.background,atlas_mappings.backgrounds.levelUp)
    
    modal.closeIcon.positionX = "41%";
    modal.closeIcon.positionY = "22%";

    if (button) {
      button.image.source = custUiAtlas;
      button.image.positionY = "-55%";
      button.image.positionX = "0";
      button.image.sourceLeft = 2035;//TODO move to atlas_mappings and use setSection
      button.image.sourceWidth = 400;
      button.image.sourceTop = 2393;
      button.image.sourceHeight = 215;
      button.image.width = "35%";
      button.image.height = "15%";
    }
    if (modal instanceof ui.CustomPrompt) {
      modal.texture = custUiAtlas;
    }
  }
}
function applyRafflePanel(
  modal: ui.CustomPrompt,
  button?: CustomPromptButton,
  secondaryButton?: CustomPromptButton,
  options?: CustomPromptOptions
) {
  if (custUiAtlas !== undefined) {
    modal.background.source = custUiAtlas;

    modal.background.height =
      options && options.height
        ? options && options.height
        : CLAIM_PROMPT_RAFFLE_HEIGHT;
    modal.background.width =
      options && options.width
        ? options && options.width
        : CLAIM_PROMPT_RAFFLE_WIDTH;

    modal.background.sourceWidth = 1210;
    modal.background.sourceLeft = 2002;

    modal.background.sourceHeight = 1271;
    modal.closeIcon.positionX = "41%";
    modal.closeIcon.positionY = "22%";

    if (button) {
      button.image.source = custUiAtlas;
      button.image.positionY = "-34.5%"//"-35%";
      button.image.positionX = "-18%";
      button.image.sourceLeft = 2035;
      button.image.sourceWidth = 400;
      button.image.sourceTop = 2393;
      button.image.sourceHeight = 215;
      button.image.width = "35%";
      button.image.height = "15%";
    }
    if (secondaryButton) {
      secondaryButton.image.source = custUiAtlas;
      secondaryButton.image.positionY = "-34.5%"//"-35%";
      secondaryButton.image.positionX = "18%";
      secondaryButton.image.sourceLeft = 2426;
      secondaryButton.image.sourceWidth = 424;
      secondaryButton.image.sourceTop = 2393;
      secondaryButton.image.sourceHeight = 215;
      secondaryButton.image.width = "35%";
      secondaryButton.image.height = "15%";
    }
    if (modal instanceof ui.CustomPrompt) {
      modal.texture = custUiAtlas;
    }
  }
}

function applyCustomOptionsPanel(
  modal: ui.CustomPrompt,
  button?: CustomPromptButton,
  secondaryButton?: CustomPromptButton,
  options?: CustomPromptOptions
) {
  if (custUiAtlas !== undefined) {
    /*
    modal.background.source = custUiAtlas;

    modal.background.sourceWidth = 1210;
    modal.background.sourceLeft = 2002;

    modal.background.sourceHeight = 1271;
    modal.background.height = 500;
    modal.background.width = 400;*/

    modal.background.source = custUiAtlas;

    modal.background.sourceWidth = 2024;
    modal.background.sourceLeft = 0;

    modal.background.sourceHeight = 1400;

    //TODO ally setting custom height and width
    modal.background.height =
      options && options.height ? options.height : OPTION_PROMPT_DEFAULT_HEIGHT;
    modal.background.width =
      options && options.width ? options.width : OPTION_PROMPT_DEFAULT_WIDTH;

    modal.closeIcon.positionX = "41%";
    modal.closeIcon.positionY = "22%";

    if (button) {
      button.image.source = custUiAtlas;
      button.image.positionY = "-30%";
      button.image.positionX = "-18%";
      button.image.sourceLeft = 2035;
      button.image.sourceWidth = 400;
      button.image.sourceTop = 2393;
      button.image.sourceHeight = 215;
      button.image.width = "35%";
      button.image.height = "20%";
    }
    if (secondaryButton) {
      secondaryButton.image.source = custUiAtlas;
      secondaryButton.image.positionY = "-30%";
      secondaryButton.image.positionX = "18%";
      secondaryButton.image.sourceLeft = 2426;
      secondaryButton.image.sourceWidth = 424;
      secondaryButton.image.sourceTop = 2393;
      secondaryButton.image.sourceHeight = 215;
      secondaryButton.image.width = "35%";
      secondaryButton.image.height = "20%";
    }
    if (modal instanceof ui.CustomPrompt) {
      modal.texture = custUiAtlas;
    }
  }
}

export class LeaderBoardPrompt extends CustomOkPrompt implements ILeaderboardItem{
  playerEntries?: PlayerLeaderboardEntryType[];
  currentPlayer?: PlayerLeaderboardEntryType;
  formatterCallback?: (text: string|number) => string;
  startIndex:number = 0;
  pageSize:number = CONFIG.GAME_LEADEBOARD_2DUI_MAX_RESULTS
  nextBtn: ui.CustomPromptButton;
  prevBtn: ui.CustomPromptButton;
  constructor(
    title: string,
    text: string,
    buttonText: string,
    callback?: () => void,
    options?: CustomPromptOptions
  ){
    super ( title, text, buttonText, callback, options)

    const nextBtnPosY = -40
    let nextBtn = (this.nextBtn = this.prompt.addButton(
      ">>",
      180,
      nextBtnPosY,
      () => {
        if(this.startIndex + this.pageSize < this.playerEntries.length){
          this.startIndex += this.pageSize
        } 
        this.updateUI()
      },
      ui.ButtonStyles.ROUNDBLACK
    ));

    let prevBtn = (this.prevBtn = this.prompt.addButton(
      "<<",
      -180,
      nextBtnPosY,
      () => {
        this.startIndex -= this.pageSize
        if(this.startIndex < 0){
          this.startIndex = 0
        }
        this.updateUI()
      },
      ui.ButtonStyles.ROUNDBLACK
    ));

    applyButtonStyle(nextBtn)
    applyButtonStyle(prevBtn)
    nextBtn.label.width = 40
    prevBtn.label.width = 40
    prevBtn.label.positionY = 2
    nextBtn.label.positionY = 2
    nextBtn.image.width = 40
    prevBtn.image.width = 40
    nextBtn.image.height = 35
    prevBtn.image.height = 35
    applyLeaderBoardPanel(this)
  }

  setPlayerEntries(arr: PlayerLeaderboardEntryType[]) {
    this.startIndex = 0
    this.playerEntries = arr;
  }
  setCurrentPlayer(arr: PlayerLeaderboardEntryType) {
    this.currentPlayer = arr;
  }
 
  updateUI(): void {
    this.text.text.value = createLeaderBoardPanelText(this,this.startIndex,this.pageSize,this.formatterCallback)
  }
  
  setFormatterCallback(callback: (text: string|number) => string): void {
    this.formatterCallback = callback
  }
  
}

function applyLeaderBoardPanel( prompt:LeaderBoardPrompt){
  prompt.button.image.positionY = -230
  
  prompt.title.text.positionY = 90
  prompt.title.text.positionX = 70

  prompt.text.text.positionY = -60
  prompt.text.text.fontSize = 12

  prompt.prompt.background.positionY = 50
  
}


const languageIcons = [
  {
    name: {key:"english", params:{ns:namespaces.ui.languages}},
    isoCode: languages.en,
    icon: atlas_mappings.icons.language_english
  },
  
  {
    name: {key:"chinese", params:{ns:namespaces.ui.languages}},
    isoCode: languages.zh,
    icon: atlas_mappings.icons.language_china
  }
  ,
  {
    name: {key:"german", params:{ns:namespaces.ui.languages}},
    isoCode: languages.de,
    icon: atlas_mappings.icons.language_german
  }
  , 
  {
    name: {key:"japenese", params:{ns:namespaces.ui.languages}},
    isoCode: languages.jp,
    icon: atlas_mappings.icons.language_japan
  }
  ,
  {
    name: {key:"korean", params:{ns:namespaces.ui.languages}},
    isoCode: languages.ko,
    icon: atlas_mappings.icons.language_korea
  }
  ,
  {
    name: {key:"spanish", params:{ns:namespaces.ui.languages}},
    isoCode: languages.es,
    icon: atlas_mappings.icons.language_spain
  },
  {
    name: {key:"turkey", params:{ns:namespaces.ui.languages}},
    isoCode: languages.tr,
    icon: atlas_mappings.icons.language_turkey
  },
  {
    name: {key:"saudi", params:{ns:namespaces.ui.languages}},
    isoCode: languages.sa,
    icon: atlas_mappings.icons.language_saudi
  },
  {
    name: {key:"portuguese", params:{ns:namespaces.ui.languages}},
    isoCode: languages.br,
    icon: atlas_mappings.icons.language_brazil
  },
  {
    name: {key:"iran", params:{ns:namespaces.ui.languages}},
    isoCode: languages.ir,
    icon: atlas_mappings.icons.language_iran
  }


]

export class PickLanguagePrompt extends CustomOkPrompt{
  constructor(
    title: string | I18NParamsType,
    text: string,
    buttonText: string | I18NParamsType,
    callback?: () => void,
    options?: CustomPromptOptions
  ){
    super ( title, text, buttonText, callback, {
      height: 500
    })
    
    this.title.text.positionY = 75
    this.button.image.positionY = -155

    const containerWidth = 50
    const containerHeight = 70
    const containerPaddX = 10
    const posXStart = -(containerWidth+containerPaddX) * 2.5
    let posX = posXStart
    let posY = 0
    let counter = 0
    
    const ROW_SIZE = 6
    for(const langs of languageIcons){ 
      log("language.btn",langs)
      const container = new UIContainerRect(this.prompt.background)
      container.width = containerWidth
      container.height = containerHeight
      container.hAlign = "center"
      container.vAlign = "center"
      container.positionX = posX
      container.positionY = posY

      const isI18nProp = typeof langs.name !== "string"//i18nProps.hasOwnProperty( 'key')
      
      const itemText = new UIText(container)
          itemText.value = isI18nProp ? i18n.t(langs.name.key,langs.name.params) : langs.name
          itemText.color = Color4.White()
          itemText.fontSize = 12
          itemText.width = containerWidth 
          itemText.height = containerHeight 
          itemText.hAlign = "center"
          itemText.hTextAlign = "center"
          itemText.vAlign = "bottom"


      if(isI18nProp){
        i18nOnLanguageChangedAdd((lng) => {
          itemText.value = i18n.t(langs.name.key,langs.name.params)
        })
      }


      const langImg = new UIImage(container, custUiAtlas)
      langImg.width = containerWidth 
      langImg.height = containerWidth 
      langImg.hAlign = "center"
      langImg.vAlign = "center"
        //itemBg.positionX = -5 + IMAGE_SHIFT_X
        //itemBg.positionY = -2 //+ IMAGE_SHIFT_X

        langImg.onClick = new OnPointerDown(
          () => {
            i18n.changeLanguage(langs.isoCode.toLowerCase())
          }
        )

      setSection(langImg, langs.icon);
      //setSection(langImg, atlas_mappings.icons.costRefresh);

      counter ++
      posX += containerWidth + containerPaddX
      if(counter % ROW_SIZE ==0){
        posX = posXStart
        posY -= containerWidth+containerPaddX
      }
    }
  }

}
