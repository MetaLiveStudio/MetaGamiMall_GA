import * as utils from '@dcl-sdk/utils'
import {
  engine,
  Transform,
} from '@dcl/sdk/ecs'
import * as ui from 'dcl-ui-toolkit'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { ExtIPrompt, PromptWrapper, setBackgroundTexture, setSelectionUv } from './extDclUiToolkit'
import atlas_mappings from "./atlas_mappings";
import { PromptText } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Text'
import { PromptButton } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Button'
import { Prompt } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt'
import { CenterLabel } from './ext/CenterLabel'
import { wordWrap } from '../utils/helperFunctions'
import { i18n, i18nOnLanguageChangedAdd } from '../i18n/i18n'
import { log } from '../back-ports/backPorts'
import { ImageAtlasData } from 'dcl-ui-toolkit/dist/utils/imageUtils'
import { languages, namespaces } from '../i18n/i18n.constants'
import { PromptButtonExt } from './ext/PromptButtonExt'


export const CUSTOM_DELAY_MS = 200;

export const CUSTOM_ATLAS = "images/ui/dialog-custom-atlas-v3-semi-tran.png"

export const MASTER_SCALE = 1.2;

export const SCALE_FONT_TITLE = MASTER_SCALE;
export const SCALE_FONT = MASTER_SCALE;
export const SCALE_FONT_PANEL = MASTER_SCALE;


const SCALE_FONT_OK_PROMPT_TITLE = MASTER_SCALE;
const SCALE_FONT_OK_PROMPT_TEXT = 1.4;

export const SCALE_UIImage = MASTER_SCALE;

export const OPTION_PROMPT_DEFAULT_WIDTH_PADDING = 70 * SCALE_UIImage;
export const OPTION_PROMPT_DEFAULT_HEIGHT_PADDING = 50 * SCALE_UIImage;

export const OPTION_PROMPT_DEFAULT_WIDTH = 500 * SCALE_UIImage;
export const OPTION_PROMPT_DEFAULT_HEIGHT = 300 * SCALE_UIImage;

const OK_PROMPT_DEFAULT_WIDTH_PADDING = 70 * SCALE_UIImage;
const OK_PROMPT_DEFAULT_HEIGHT_PADDING = 50 * SCALE_UIImage;

const OK_PROMPT_DEFAULT_WIDTH = 350 * SCALE_UIImage;
const OK_PROMPT_DEFAULT_HEIGHT = 250 * SCALE_UIImage;



  //0 is non 4k
  //1 is 4k
  export const SCREEN_STANDARD = 0
  export const SCREEN_RETINA = 1
  //for some reason must start with standard screen even if is retina :shrug:
  export const DEFAULT_SCREEN_TYPE = SCREEN_STANDARD

//START TESTING

/*
const prompt = ui.createComponent(ui.CustomPrompt, 
    //{ style: ui.PromptStyles.DARKSLANTED } //is exactly the claim UI
    { style: ui.PromptStyles.DARKLARGE } //is mostly right, need to modify selection
)
prompt.show()

const promptExt:PromptWrapper = new PromptWrapper(prompt) 
//promptExt.setTexture( "images/dialog-dark-atlas-v3-semi-tran.png" )
promptExt.setTexture( "images/dialog-custom-atlas-v3-semi-tran.png" )
promptExt.setSelection({ 
    ...atlas_mappings.backgrounds.emptyPanel,
      atlasHeight: atlas_mappings.atlasHeight, 
      atlasWidth: atlas_mappings.atlasWidth
  }
)
prompt.width = OK_PROMPT_DEFAULT_WIDTH
prompt.height = OK_PROMPT_DEFAULT_HEIGHT 
promptExt.scaling = 2
*/
////END TESTING


//port from sdk6 scene incase need it
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




export function applyButtonStyle(button?: PromptButton){
  
  if(button?.imageElement.uiBackground?.texture?.src !== undefined){
    setBackgroundTexture(button.imageElement, CUSTOM_ATLAS)
    //have to set the uvs
    //TODO figure out how to do 
    setSelectionUv(button.imageElement, atlas_mappings.buttons.primaryRound)
    if(button.imageElement.uiTransform) button.imageElement.uiTransform.height = 45
  }
}

export function updateCloseBtnPosition(prompt: PromptWrapper<Prompt>,yPosition?:number) {
  //TODO IMPLMENT ME
  //const offset = _offset !== undefined ? _offset : -30
  //syncCloseIconWithPrompt(prompt._prompt)
  //prompt._prompt.closeIcon.xPosition = //uiDimToNumber(prompt.background.width as number) / 2 + offset;
  if(yPosition) prompt._prompt.closeIcon.yPosition = yPosition//uiDimToNumber(prompt.background.height as number) / 2 + offset;
}
function applyEmptyPanel(
  promptExt: PromptWrapper<Prompt>,
  button?: PromptButton,
  options?: CustomPromptOptions
) {
  if (CUSTOM_ATLAS !== undefined) {
    promptExt.setTexture( CUSTOM_ATLAS )
    promptExt.setSelection({ 
        ...atlas_mappings.backgrounds.emptyPanel,
        atlasHeight: atlas_mappings.atlasData.customAtlas.atlasHeight, 
        atlasWidth: atlas_mappings.atlasData.customAtlas.atlasWidth
      }
    )

    promptExt._prompt.height =
      options && options.height ? options.height : OK_PROMPT_DEFAULT_HEIGHT;
    promptExt._prompt.width =
      options && options.width ? options.width : OK_PROMPT_DEFAULT_WIDTH;
    
      //TODO FIXME
    //modal.closeIcon.positionX = "40%";
    //modal.closeIcon.positionY = "21%";
    updateCloseBtnPosition(promptExt,70)
    
    if(button){
      applyButtonStyle(button);
      button.yPosition = promptExt._prompt.height * -.3
      /*button.image.positionY =
        //options && options.height
          //? -1 * (options.height / OK_PROMPT_DEFAULT_HEIGHT) * 100 + 25 + "%"
          "-25%";*/
    }
    
    /*if (modal instanceof ui.CustomPrompt) {
      modal.texture = custUiAtlas;
    }*/
  }
}

export function applyCustomOptionsPanel(
  promptExt: PromptWrapper<Prompt>,
  button?: PromptButton,
  secondaryButton?: PromptButton,
  options?: CustomPromptOptions
) {
  if (CUSTOM_ATLAS !== undefined) {
    /*
    modal.background.source = custUiAtlas;

    modal.background.sourceWidth = 1210;
    modal.background.sourceLeft = 2002;

    modal.background.sourceHeight = 1271;
    modal.background.height = 500;
    modal.background.width = 400;*/

    promptExt.setTexture( CUSTOM_ATLAS )
    promptExt.setSelection({ 
        ...atlas_mappings.backgrounds.emptyPanel,
        atlasHeight: atlas_mappings.atlasData.customAtlas.atlasHeight, 
        atlasWidth: atlas_mappings.atlasData.customAtlas.atlasWidth
      }
    )

    //TODO ally setting custom height and width
    promptExt._prompt.height =
      options && options.height ? options.height : OPTION_PROMPT_DEFAULT_HEIGHT;
    promptExt._prompt.width =
      options && options.width ? options.width : OPTION_PROMPT_DEFAULT_WIDTH;
    

    //FIXME TODO
    /*
    promptExt.closeIcon.positionX = "41%";
    promptExt.closeIcon.positionY = "22%";
      */
    updateCloseBtnPosition(promptExt,70)

    if (button) {
      applyButtonStyle(button);
      button.yPosition = promptExt._prompt.height * -.3
      /*
      button.image.source = custUiAtlas;
      button.image.positionY = "-30%";
      button.image.positionX = "-18%";
      button.image.sourceLeft = 2035;
      button.image.sourceWidth = 400;
      button.image.sourceTop = 2393;
      button.image.sourceHeight = 215;
      button.image.width = "35%";
      button.image.height = "20%";*/
    }
    if (secondaryButton) {
      applyButtonStyle(secondaryButton);
      secondaryButton.yPosition = promptExt._prompt.height * -.3
      /*
      secondaryButton.image.source = custUiAtlas;
      secondaryButton.image.positionY = "-30%";
      secondaryButton.image.positionX = "18%";
      secondaryButton.image.sourceLeft = 2426;
      secondaryButton.image.sourceWidth = 424;
      secondaryButton.image.sourceTop = 2393;
      secondaryButton.image.sourceHeight = 215;
      secondaryButton.image.width = "35%";
      secondaryButton.image.height = "20%";*/
    }
    /*
    if (modal instanceof ui.CustomPrompt) {
      modal.texture = custUiAtlas;
    }*/
  }
}

export class CustomOkPrompt implements Modal {
  prompt: PromptWrapper<ui.CustomPrompt>;
  title: PromptText;
  text: PromptText
  button: PromptButton;
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
    //this.prompt = new ui.CustomPrompt(undefined, undefined, undefined, true);

    let promptExt = this.prompt = new PromptWrapper(
      ui.createComponent(ui.CustomPrompt, 
          //{ style: ui.PromptStyles.DARKSLANTED } //is exactly the claim UI
          { style: ui.PromptStyles.DARKLARGE } //is mostly right, need to modify selection
      )
    ) 
    //promptExt.setTexture( "images/dialog-dark-atlas-v3-semi-tran.png" )
    

    const width = OK_PROMPT_DEFAULT_WIDTH;
    const height = OK_PROMPT_DEFAULT_HEIGHT;

    this.prompt._prompt.width = width
    this.prompt._prompt.height = height
    //promptExt.scaling = 2
    
    const width_padding = OK_PROMPT_DEFAULT_WIDTH_PADDING;
    const height_padding = OK_PROMPT_DEFAULT_HEIGHT_PADDING;

    const titleHeight =
      options && options.height ? (options.height - height) / 2 : 60;

    const textPositionY =
      options && options.textPositionY ? options.textPositionY : 0;

    this.title = this.prompt._prompt.addText(
      {
        value: typeof title !== "string" ? i18n.t(title.key,title.params) : title,
        xPosition: 58,
        yPosition: titleHeight,
        color:Color4.create(1, 0.906, 0.553, 1),
        size:19 * SCALE_FONT_OK_PROMPT_TITLE
      }
    )
    this.title.textElement.textAlign = "middle-center"
     
    if(typeof title !== "string"){
      i18nOnLanguageChangedAdd((lng) => {
        if(typeof title !== "string"){
          this.title.value = i18n.t(title.key,title.params)
        }
      })
    }
    let textToUse = wordWrap(text, 48, 4) 
    let promptText = (this.text = this.prompt._prompt.addText(
      {
        value: textToUse,
        xPosition: 0,
        yPosition: textPositionY,
        color: Color4.White(),
        size: options && options.textFontSize
            ? options.textFontSize
            : 12 * SCALE_FONT_OK_PROMPT_TEXT
      }
    ))
    /*
    const sfFont = getOrCreateFont(Fonts.SanFrancisco)
    promptText.text.vAlign = "center";
    promptText.text.adaptHeight = true;
    promptText.text.font = sfFont;

    promptText.text.width = width - width_padding;
    promptText.text.height = height - height_padding;
    promptText.text.textWrapping = true;
    promptText.text.vAlign = "center";
    promptText.text.hAlign = "center";*/
      
    
    let myButton = (this.button = this.prompt._prompt.addButton(
      {
        text: typeof buttonText !== "string" ? i18n.t(buttonText.key,buttonText.params) : buttonText,
        xPosition: 0,
        yPosition: -90,//-35,
        //color: Color4.White(),
        style: ui.ButtonStyles.E,
        onMouseDown:() => {
          if (this.callback) this.callback();
          this.hide();
        }  
      }
    ));

    
    /*if (myButton.icon) {
      myButton.icon.visible = false;
      log(myButton.label);
      myButton.label.positionX = 0;
      myButton.label.positionY = 3;
    }*/
    
    if(typeof buttonText !== "string"){
      i18nOnLanguageChangedAdd((lng) => {
        if(typeof buttonText !== "string"){
          myButton.text = i18n.t(buttonText.key,buttonText.params)
        }
      })
    }

    
    applyEmptyPanel(this.prompt, myButton, options);
    
  }
  setTextValue(text:string){
    log("CustomOkPrompt","setTextValue",text)
    let textToUse = wordWrap(text, 48, 4) 
    this.text.value = textToUse
  }
  _show() {
    this.prompt.show();
    if (this.onShowcallback) this.onShowcallback();
  }
  show(delay?: number): void {
    const delayTm = delay !== undefined ? delay : CUSTOM_DELAY_MS;

    if (delayTm > 0) {
      utils.timers.setTimeout(() => {
        this._show();
      },delayTm);
    } else {
      this._show();
    }
  }
  hide(): void {
    this.prompt.hide();
  }
}

//TODO export class CustomMapPrompt implements Modal {

export class CustomOptionsPrompt implements Modal {
  prompt: PromptWrapper<ui.CustomPrompt>;
  title: PromptText;
  text: PromptText;

  buttonConfirmBtn: PromptButtonExt;
  buttonSecondaryBtn: PromptButtonExt;
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

        //ui.createComponent(ui.OptionPrompt, 
    let promptExt = this.prompt = new PromptWrapper(
      ui.createComponent(ui.CustomPrompt, 
          { style: ui.PromptStyles.DARKSLANTED } //is exactly the claim UI
          /*{ title: title, text: text, useDarkTheme: true
              , onAccept: ()=>{ 
                log(
                  "CustomOptionsPrompt.primaryCallback clicked",
                  title,
                  text,
                  this.primaryCallback
                );
                if(primaryCallback) primaryCallback(); 
                promptExt.hide()
              } 
              , onClose: ()=>{ 
                if(secundaryCallback) secundaryCallback() ; 
                promptExt.hide()  
              }
            }*/ //is mostly right, need to modify selection
      )
    ) 
    //this.prompt = new ui.CustomPrompt(undefined, undefined, undefined, true);
    //promptExt._prompt.titleElement
    this.title =this.prompt.addText(
      title,
      title.length < 15 ? 40 : 70,
      titleHeight,
      Color4.create(1, 0.906, 0.553, 1),
      19 * SCALE_FONT_TITLE
    );
    //const sfFont = getOrCreateFont(Fonts.SanFrancisco)

    //promptExt._prompt.textElement)
    let subtitleText = (this.text = this.prompt.addText(
      text,
      0,
      textHeight,
      Color4.White(),
      options && options.textFontSize ? options.textFontSize : 16 * SCALE_FONT
    ));
    //this.title.textElement.textAlign = "middle-center"
    /*subtitleText.text.vAlign = "center";
    subtitleText.text.adaptHeight = true;
    subtitleText.text.font = sfFont;
    subtitleText.text.isPointerBlocker = false;

    subtitleText.text.width = width - (width_padding * 2);
    subtitleText.text.height = height - height_padding;
    subtitleText.text.textWrapping = true;
    subtitleText.text.vAlign = "center";
    subtitleText.text.hAlign = "center";*/

    const X_MARGIN = 20;
    const X_OFF_CENTER = 70;
    //promptExt._prompt.primaryButtonElement
    let myButton = this.buttonConfirmBtn = this.prompt.addButton(
      this.buttonConfirm,
      (X_OFF_CENTER * -1) - X_MARGIN, 
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
    //TODO FIXME
    /*
    if (myButton.icon) {
      myButton.icon.visible = false;
      log(myButton.label);
      myButton.label.positionX = -5;
      myButton.label.positionY = 5;
    }*/

    //this.buttonConfirmBtn = promptExt._prompt.primaryButtonElement
    let secundaryButton = this.buttonSecondaryBtn = this.prompt.addButton(
      this.buttonSecondary,
      X_OFF_CENTER + X_MARGIN,
      -30,
      () => {
        log(
          "CustomOptionsPrompt.secondaryCallback clicked",
          this.secondaryCallback
        );
        if (this.secondaryCallback) this.secondaryCallback();
        this.hide();
      },
      ui.ButtonStyles.F
    );
    //TODO FIXME
    /*
    if (secundaryButton.icon) {
      secundaryButton.icon.visible = false;
      log(secundaryButton.label);
      secundaryButton.label.positionX = -5;
      secundaryButton.label.positionY = 5;
    }
    */
    let subtitleConfirm = this.prompt.addText(
      this.buttonSubtitleConfirm,
      65,
      -160,
      Color4.White(),
      8 * SCALE_FONT
    );

    /*subtitleConfirm.text.vAlign = "center";
    subtitleConfirm.text.adaptHeight = true;
    subtitleConfirm.text.font = sfFont;
    subtitleConfirm.text.isPointerBlocker = false;*/

    let subtitleSecondary = this.prompt.addText(
      this.buttonSubtitleSecondary,
      -78,
      -160,
      Color4.White(),
      8
    );
    /*subtitleSecondary.text.vAlign = "center";
    subtitleSecondary.text.adaptHeight = true;
    subtitleSecondary.text.font = sfFont;
    subtitleSecondary.text.isPointerBlocker = false;*/

    this.hide();
    applyCustomOptionsPanel(this.prompt, myButton, secundaryButton, options);
  }
  show(): void {
    utils.timers.setTimeout(() => {
      this.prompt.show();
    },CUSTOM_DELAY_MS);
  }
  hide(): void {
    this.prompt.hide();
  }
}

let languageIcons:LanguageIconsType[]

export class PickLanguagePrompt extends CustomOkPrompt{
  constructor(
    title: string | I18NParamsType,
    text: string,
    buttonText: string | I18NParamsType,
    callback?: () => void,
    options?: CustomPromptOptions
  ){
    super ( title, text, buttonText, callback, {
      height: 500, width: 550
    })
    
    this.title.yPosition = 75
    this.button.yPosition = -155 - 20

    const containerWidth = 50
    const containerHeight = 70
    const containerPaddX = 28//10
    const posXStart = -(containerWidth+containerPaddX) * 3.25//2.5
    let posX = posXStart
    let posY = 0
    let counter = 0
    
    const ROW_SIZE = 6
    const btnLblNewLine = "\n\n\n\n"
    for(const langs of languageIcons){ 
      log("language.btn",langs)

      const isI18nProp = typeof langs.name !== "string"//i18nProps.hasOwnProperty( 'key')

      const title = btnLblNewLine+ (isI18nProp ? i18n.t(langs.name.key,langs.name.params) : langs.name)
      /*const uiText = this.prompt.addText(
        title, posX, posY, Color4.White(), 8 * SCALE_FONT
      )*/

      const uiBtn = this.prompt.addButton(
        title, posX, posY, () => {
          i18n.changeLanguage(langs.isoCode.toLowerCase())
        }, ui.ButtonStyles.ROUNDBLACK
      )
      uiBtn.labelElement.fontSize = 14

      setBackgroundTexture(uiBtn.imageElement, CUSTOM_ATLAS)
      setSelectionUv(uiBtn.imageElement,langs.icon)
      if(uiBtn.imageElement.uiTransform){
        uiBtn.imageElement.uiTransform.width = containerWidth
      }

      if(isI18nProp){
        i18nOnLanguageChangedAdd((lng) => {
          //uiText.value = "Y\n"+
          uiBtn.text = btnLblNewLine + i18n.t(langs.name.key,langs.name.params)
        })
      }
      /*const container = new UIContainerRect(this.prompt.background)
      container.width = containerWidth
      container.height = containerHeight
      container.hAlign = "center"
      container.vAlign = "center"
      container.positionX = posX
      container.positionY = posY

      
      
      const itemText = new UIText(container)
          itemText.value = isI18nProp ? i18n.t(langs.name.key,langs.name.params) : langs.name
          itemText.color = Color4.White()
          itemText.fontSize = 12
          itemText.width = containerWidth 
          itemText.height = containerHeight 
          itemText.hAlign = "center"
          itemText.hTextAlign = "center"
          itemText.vAlign = "bottom"




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
          */
      counter ++
      posX += containerWidth + containerPaddX
      if(counter % ROW_SIZE ==0){
        posX = posXStart
        posY -= containerWidth+containerPaddX
      }
    }
  }

}
type LanguageIconsType={
  name: I18NParamsType,
  isoCode: string,
  icon: ImageAtlasData
}


export function initModals(){
  //

  languageIcons = [
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
  
}

/*
const endOptions = {
  //width: 420,
  //modalWidth: -200,
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
    
  },
  undefined,
  endOptions
);

endGameConfirmPrompt20.show()
*/

/*const prompt = ui.createComponent(ui.OptionPrompt, 
  //{ style: ui.PromptStyles.DARKSLANTED } //is exactly the claim UI
  { title:"hi",text:"text",onAccept:()=>{} } //is mostly right, need to modify selection
)
prompt.show()*/

/*
//const errorPrompt = new CustomPrompt(ui.PromptStyles.DARKLARGE, 400, 400);
const errorPrompt20 = new CustomOkPrompt(
  "Error Has Occurred",
  "Some Error\nasfjsdaklf jdsalf jsdlkf jsdlf jadslfk jdslf jslfk jsd lkasdjf lksdjflasd fjladssd fdsf jdsfljsflk sdjf ldsj",
  "OK", 
  () => {},
  {
    height: 500,
  }
);
errorPrompt20.show()
*/
/*
const healthLabel = ui.createComponent(CenterLabel, { value: 'Connection status' })
healthLabel.color = Color4.Green()
healthLabel.show()*/
