import * as utils from '@dcl-sdk/utils'
import {
  engine,
  Entity,
  Transform,
} from '@dcl/sdk/ecs'
import * as ui from 'dcl-ui-toolkit'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { clearButtonSystemInputListener, ExtIPrompt, PromptWrapper, setBackgroundTexture, setButtonDim, setButtonIconPos, setButtonLabelPos, setImageElementDim, setSelectionUv } from './extDclUiToolkit'
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
import { applyCustomOptionsPanel, CUSTOM_ATLAS, CUSTOM_DELAY_MS, CustomPromptOptions, Modal, OPTION_PROMPT_DEFAULT_HEIGHT, OPTION_PROMPT_DEFAULT_WIDTH, SCALE_FONT_TITLE, updateCloseBtnPosition } from './modals'
import { REGISTRY } from '../registry'
import { PromptButtonExt } from './ext/PromptButtonExt'
import { PromptTextIconBg } from './ext/PromptTextIconBg'

//export const custUiAtlasInventory = "images/ui/Inventory.png"


export class CustomGridTextRow {
  //using button cuz it comes with icon + text + background
  textIconBg: PromptTextIconBg;
  //uiIconImg: UIImage;
  //uiItemBg: UIImage;
  //uiText: PromptText;
  //promptIcon?: ui.CustomPromptIcon;
  //promptText?: PromptText;
  
  //container: UIContainerRect;
  //bg: UIImage;

  constructor(promptButton:PromptTextIconBg){
    //this.container = container
    this.textIconBg = promptButton
    //this.uiIconImg = uiIconImg
    //this.uiText = uiText
    //this.uiItemBg = uiItemBg
  }

  hide(){
    //if(this.container !== undefined){
    //  this.container.visible = false
    //}else{
      /*this.uiIconImg.visible = false
      this.uiText.visible = false
      if(this.uiItemBg !== undefined) this.uiItemBg.visible = false*/
      this.textIconBg?.hide()
    //}
  }
  clear(){
      //setSelectionUv(this.uiIconImg, atlas_mappings.icons.emptyInventorySlot);
      setSelectionUv(this.textIconBg.iconElement, atlas_mappings.icons.emptyInventorySlot);
      this.textIconBg.text = ""
      //this.uiText.value = ""
  }
  setText(text:string){
    this.textIconBg.text = text
  }
  show(){
    //if(this.container !== undefined){
    //  this.container.visible = true
    //}else{
      this.textIconBg?.show()
    //}
  }
};
export type CustomGridTextRowData = {
  uiIconSection: ImageAtlasData;
  text: string;
};




export class AbstractBaseGridPrompt implements Modal {
  prompt: PromptWrapper<ui.CustomPrompt>;;
  title: PromptText;
  text: PromptText;
  closingMsg: PromptText;
  buttonPrimary: PromptButtonExt

  autoCloseEnabled: boolean = false
  autoCloseStartTime?: number
  autoCloseTimeoutMS: number
  autoCloseTimer?: number

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

  vc_vb: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.vc_vb,
    text: "",
  };
  vc_ac: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.vc_ac,
    text: "",
  };
  vc_zc: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.vc_zc,
    text: "",
  };
  vc_rc: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.vc_rc,
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
  coinBagRaffleRedeem: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.coinBagRaffleRedeem,
    text: "",
  };
  coinBagRaffleStat: CustomGridTextRowData = {
    uiIconSection: atlas_mappings.icons.coinBagRaffleStat,
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


  buttonConfirm: string;
  buttonSubtitleConfirm: string;
  
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

    this.prompt = new PromptWrapper(
      ui.createComponent(ui.CustomPrompt, 
          //{ style: ui.PromptStyles.DARKSLANTED } //is exactly the claim UI
          { style: ui.PromptStyles.DARKLARGE } //is mostly right, need to modify selection
      )
    ) 
    //this.prompt = new ui.CustomPrompt(undefined, undefined, undefined, true);
    this.title = this.prompt.addText(
      title,
      60,
      83,
      Color4.create(1, 0.906, 0.553, 1),
      24 * SCALE_FONT_TITLE
    );
    //const sfFont = getOrCreateFont(Fonts.SanFrancisco)
 
    let subtitleText = (this.text = this.prompt.addText(
      text,
      0,
      40 - 10,
      Color4.White(),
      20
    ));
 
    let closingMsg = (this.closingMsg = this.prompt.addText(
      i18n.t("closeAutomaticallyCountdown",{ns:namespaces.ui.prompts,"timeLeftSeconds":5}),
      0,
      -183,
      Color4.White(),
      12 
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
    //TODO HIDE THE BUTTON ICON
    if (myButton.iconElement) {
      /*myButton.iconElement.visible = false;
      log(myButton.label);
      myButton.label.positionX = -5;
      myButton.label.positionY = 5;*/
    } 
    

    this.hide();
    //FIXME call its own formatter, not levelups
    //applyLevelUpPanel(this.prompt, myButton, options);
  }
  initGrid(args:{rowXPos?:number,rowYPos?:number,rowXWidth?:number,rowYHeight?:number}){
    //implement me
  }
  show(): void {
    utils.timers.setTimeout(()=>{
      this.prompt.show();
      this.updateGrid();
      this.startTimers()
    },CUSTOM_DELAY_MS)
    //utils.setTimeout(customDelayMs, () => );
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
        this.closingMsg.value = i18n.t("closeAutomaticallyCountdown",{ns:namespaces.ui.prompts,"timeLeftSeconds":timeLeftSeconds})

        if(delta > this.autoCloseTimeoutMS){
          this.hide()
        }else{
          //schedule again
          this.autoCloseTimer = utils.timers.setTimeout(checkForClose,200)
        }
        
      } 
      this.autoCloseTimer = utils.timers.setTimeout(checkForClose,200)
    }else{
      this.closingMsg.hide()
    }
  }
  clearTimers(){
    if(this.autoCloseTimer) {
      this.autoCloseStartTime = undefined
      utils.timers.clearTimeout(this.autoCloseTimer)
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

    this.textGrid[row].setText( data.text );

    //if(isNaN(data.text)){
      try{
        const numVal = parseInt(data.text)
        if(numVal <= 0){
          this.textGrid[row].textIconBg._hideIconWhenDisabled = false
          this.textGrid[row].textIconBg.grayOut()
          //but bring back my image

          //this.textGrid[row].uiIconImg.opacity = .3
          //TODO set font color apha channel
          //this.textGrid[row].promptButton.iconElement.uiBackground?.color = .3
          //TODO set font color apha channel
          //this.textGrid[row].promptButton.labelElement.opacity = .8
        }else{
          this.textGrid[row].textIconBg.enable()
          //TODO set font color apha channel
          //this.textGrid[row].uiIconImg.opacity = 1
          //this.textGrid[row].uiText.opacity = 1
        } 
        if(numVal > 99999){
          this.textGrid[row].setText( "+99999" );
        }
      }catch(e){

      }
    
    //dim it, dont hide it? row++;
    //this.textGrid[row].uiText.value

    if (data.uiIconSection !== undefined) {
      setSelectionUv(this.textGrid[row].textIconBg.iconElement, data.uiIconSection);
    }
  }
  updateGrid() {
    const arr: CustomGridTextRowData[] = [
      this.coinBagRaffleRedeem,
      this.coinBagRaffleStat,
      this.bronzeShoe,
      this.coins,
      this.coinsEarned,
      this.bronze,
      this.dollars,
      this.vc_vb,
      //this.vc_ac, //uncomment to add to view
      //this.vc_zc,
      //this.vc_rc,
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
    this.title.value = title;
  }
  updateText(text: string) {
    this.text.value = text;
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

  updateVcVB(text: string|number) {
    this.vc_vb.text = typeof text === "string" ? text : Math.floor(text).toFixed(0);
  }
  updateVcAC(text: string|number) {
    this.vc_ac.text = typeof text === "string" ? text : Math.floor(text).toFixed(0);
  }
  updateVcZC(text: string|number) {
    this.vc_zc.text = typeof text === "string" ? text : Math.floor(text).toFixed(0);
  }
  updateVcRC(text: string|number) {
    this.vc_rc.text = typeof text === "string" ? text : Math.floor(text).toFixed(0);
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
  updateCoinBagRaffleRedeem(text: string|number) {
    this.coinBagRaffleRedeem.text = typeof text === "string" ? text : Math.floor(text).toFixed(0);
  }
  updateCoinBagRaffleStat(text: string|number) {
    this.coinBagRaffleStat.text = typeof text === "string" ? text : Math.floor(text).toFixed(0);
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

    const rowXPos = args.rowXPos !== undefined ? args.rowXPos : 70; 
    let rowYPos = args.rowYPos !== undefined ? args.rowYPos : 5; 
    const rowYHeight = args.rowYHeight !== undefined ? args.rowYHeight : 20;
    const fontSize = 15;
    const row1Xwidth = 140;
    const row1X = rowXPos;
    const row2X = row1X + row1Xwidth;
    const row1Ximage = row1X - 50;
    const row2Ximage = row2X - 50; 
    const iconSizeWidth = 20;
    const iconSizeHeight = 20;
    const imageShiftY = -7;
    const labelShiftX = 2

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

      const row1Button = this.prompt.addTextImgBg(
        strText + x,
        row1X,
        rowYPos,
        ()=>{},
        ui.ButtonStyles.E
        //Color4.White(),
        //fontSize
      )
      clearButtonSystemInputListener(row1Button)

      const scaleDown = .9

      
      setButtonDim(row1Button,row1Xwidth,iconSizeHeight)
      setButtonIconPos(row1Button,-1 * (row1Xwidth/2) + iconSizeWidth,imageShiftY)
      setButtonLabelPos(row1Button,'middle-left',labelShiftX,0)
      row1Button.labelElement.fontSize = fontSize
      
      //btn.labelElement.font = UIfont
      setImageElementDim(row1Button.iconElement,iconSizeWidth * scaleDown,iconSizeHeight * scaleDown)
      setBackgroundTexture(row1Button.iconElement,CUSTOM_ATLAS)
      setBackgroundTexture(row1Button.imageElement,CUSTOM_ATLAS)
      //comment out to see full size of cell
      setSelectionUv(row1Button.imageElement, atlas_mappings.icons.transparent)
     
      /*let text = this.prompt.addText(
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
      setBackgroundTexture(icon.imageElement,CUSTOM_ATLAS)*/
      //icon.image.source = custUiAtlas;
      //setSelectionUv(icon.image, atlas_mappings.icons.coin);

      this.textGrid.push(new CustomGridTextRow(row1Button));

      /*text = this.prompt.addText(
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
      setBackgroundTexture(icon.imageElement,CUSTOM_ATLAS)
      //icon.image.source = custUiAtlas;
      //setSelectionUv(icon.image, atlas_mappings.icons.coin);
      */ 

      const row2Button = this.prompt.addTextImgBg(
        strText + x,
        row2X,
        rowYPos,
        ()=>{},
        ui.ButtonStyles.E
        //Color4.White(),
        //fontSize
      )
      clearButtonSystemInputListener(row2Button)


      setButtonDim(row2Button,row1Xwidth,iconSizeHeight)
      setButtonIconPos(row2Button,-1 * (row1Xwidth/2) + iconSizeWidth,imageShiftY)
      setButtonLabelPos(row2Button,'middle-left',labelShiftX,0)
      row2Button.labelElement.fontSize = fontSize
      
      //btn.labelElement.font = UIfont
      setImageElementDim(row2Button.iconElement,iconSizeWidth * scaleDown,iconSizeHeight * scaleDown)
      setBackgroundTexture(row2Button.iconElement,CUSTOM_ATLAS)
      setBackgroundTexture(row2Button.imageElement,CUSTOM_ATLAS)
      //comment out to see full size of cell
      setSelectionUv(row2Button.imageElement, atlas_mappings.icons.transparent)
     

      //dont add right away so it adds down
      addAfter.push(new CustomGridTextRow(row2Button));

      rowYPos -= rowYHeight;
    }

    //debugger 
    for (const p in addAfter) {
      this.textGrid.push(addAfter[p]);
    }

    this.updateGrid();

  }
}