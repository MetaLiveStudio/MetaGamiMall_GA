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

const customDelayMs = 200;
const canvas = ui.canvas;
canvas.isPointerBlocker = true;
const pinkNeonColor = new Color4(1, 0, 1, 0.1);

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
};

export type CustomMapButton = {
  title: string;
  titleYPos: string;
  buttonText: string;
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
    title: string,
    text: string,
    buttonText: string,
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
      title,
      40,
      titleHeight,
      new Color4(1, 0.906, 0.553, 1),
      19 * SCALE_FONT_OK_PROMPT_TITLE
    );

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
      buttonText,
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
        button.title,
        0,
        0,
        pinkNeonColor,
        19 * SCALE_FONT_TITLE
      );
      buttonTitle.text.positionX = "22%";
      buttonTitle.text.fontSize = 14;
      buttonTitle.text.positionY = "32.5%";
      let myButton = this.prompt.addButton(
        button.buttonText,
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
        : -12 * SCALE_UIImage; //((options && options.height) ? (options.height - height)/2: 25)

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

    subtitleText.text.width = width - width_padding;
    subtitleText.text.height = height - height_padding;
    subtitleText.text.textWrapping = true;
    subtitleText.text.vAlign = "center";
    subtitleText.text.hAlign = "center";

    let myButton = this.prompt.addButton(
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

    let secundaryButton = this.prompt.addButton(
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

    this.prompt.hide();
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

export type CustomGridTextRow = {
  uiIcon: ui.CustomPromptIcon;
  text: ui.CustomPromptText;
};
export type CustomGridTextRowData = {
  uiIconSection: ImageSection;
  text: string;
};

export class AbstractGridPrompt implements Modal {
  prompt: ui.CustomPrompt;
  title: ui.CustomPromptText;
  text: ui.CustomPromptText;
  buttonPrimary: ui.CustomPromptButton

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

    this.prompt.hide();
    //FIXME call its own formatter, not levelups
    //applyLevelUpPanel(this.prompt, myButton, options);
  }
  initGrid(args:{rowYPos?:number,rowYHeight?:number}){

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

      this.textGrid.push({ uiIcon: icon, text: text });

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
      addAfter.push({ uiIcon: icon, text: text });

      rowYPos -= rowYHeight;
    }

    //debugger 
    for (const p in addAfter) {
      this.textGrid.push(addAfter[p]);
    }

    this.updateGrid();

  }
  show(): void {
    utils.setTimeout(customDelayMs, () => {
      this.prompt.show();
      this.updateGrid();
    });
  }

  hide(): void {
    this.prompt.hide();
  }
  hideGrid() {
    for (let x = 0; x < this.textGrid.length; x++) {
      //log("hideGrid", x);
      this.textGrid[x].text.hide();
      this.textGrid[x].text.text.visible = false;
      this.textGrid[x].uiIcon.hide();
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
    this.textGrid[row].text.show();
    this.textGrid[row].uiIcon.show();

    this.textGrid[row].text.text.value = data.text;

    if (data.uiIconSection !== undefined) {
      setSection(this.textGrid[row].uiIcon.image, data.uiIconSection);
    }
  }
  updateGrid() {
    const arr: CustomGridTextRowData[] = [
      this.coins,
      this.coinsEarned,
      this.dollars,
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
  }
  updateTitle(title: string) {
    this.title.text.value = title;
  }
  updateText(text: string) {
    this.text.text.value = text;
  }
  updateCoins(coins: string) {
    this.coins.text = coins;
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

  updateDollar(dollar: string) {
    this.dollars.text = dollar;
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


    //this.primaryCallback = primaryCallback;
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

    this.prompt.hide();
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
      "Checking Latest Prices...",
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

    const COST_X_BASE = CONFIG.CLAIM_CHECK_FOR_LATEST_PRICES ? 180 : 200
    let costText = new CustomPromptText(
      this.prompt,
      "COST",
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

    if(CONFIG.CLAIM_CHECK_FOR_LATEST_PRICES){
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
    let claimButton = this.prompt.addButton(
      "Claim",
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

      this.textGrid.push({ uiIcon: icon, text: text });

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
      addAfter.push({ uiIcon: icon, text: text });

      rowYPos -= rowYHeight;
    }

    //this.updateCoins(coins)
    //this.updateDollar(dollars)
    for (const p in addAfter) {
      this.textGrid.push(addAfter[p]);
    }

    this.updateGrid();

    this.updateData(args);

    this.prompt.hide();
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
              this.coins.text = ""
              this.dollars.text = ""

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
      this.textGrid[x].text.hide();
      this.textGrid[x].text.text.visible = false;
      this.textGrid[x].uiIcon.hide();
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
    this.textGrid[row].text.show();
    this.textGrid[row].uiIcon.show();

    if(this.textGrid[row].text.text !== undefined) this.textGrid[row].text.text.value = data.text;

    if (data.uiIconSection !== undefined) {
      setSection(this.textGrid[row].uiIcon.image, data.uiIconSection);
    }
  }
  updateGrid() {
    const arr: CustomGridTextRowData[] = [this.coins, this.dollars];
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
          this.itemQtyAmount.text.value = "(Stock Not Available)" 
        }else{
          this.itemQtyAmount.text.value = "(Stock Not Available)"
        }
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

function applyEmptyPanel(
  modal: ui.CustomPrompt,
  button?: CustomPromptButton,
  options?: CustomPromptOptions
) {
  if (custUiAtlas !== undefined) {
    modal.background.source = custUiAtlas;

    modal.background.sourceWidth = 2024;
    modal.background.sourceLeft = 0;

    modal.background.sourceHeight = 1400;
    modal.background.height =
      options && options.height ? options.height : OK_PROMPT_DEFAULT_HEIGHT;
    modal.background.width =
      options && options.width ? options.width : OK_PROMPT_DEFAULT_WIDTH;
    modal.closeIcon.positionX = "40%";
    modal.closeIcon.positionY = "21%";

    if (button) {
      button.image.source = custUiAtlas;
      button.image.positionY =
        options && options.height
          ? -1 * (options.height / OK_PROMPT_DEFAULT_HEIGHT) * 100 + 25 + "%"
          : "-25%";
      button.image.sourceLeft = 2035;
      button.image.sourceWidth = 660;
      button.image.sourceTop = 2585;
      button.image.sourceHeight = 215;
      button.image.height = "25%";
    }
    if (modal instanceof ui.CustomPrompt) {
      modal.texture = custUiAtlas;
    }
  }
}

function applyClaimPanel(
  modal: ui.CustomPrompt,
  firstClaimButton: CustomPromptButton,
  secondaryClaimButton?: CustomPromptButton,
  options?: CustomPromptOptions
): void {
  if (custUiAtlas !== undefined) {
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

    modal.closeIcon.positionX = "47.5%";
    modal.closeIcon.positionY = "45%";
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
      button.image.positionY = "-35%";
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
      secondaryButton.image.positionY = "-35%";
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
