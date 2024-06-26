import * as utils from '@dcl-sdk/utils'
import {
  engine,
  Entity,
  executeTask,
  PointerFilterMode,
  Transform,
} from '@dcl/sdk/ecs'
import * as ui from 'dcl-ui-toolkit'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { clearButtonSystemInputListener, ExtIPrompt, PromptWrapper, setBackgroundSrcNTexture, setBackgroundTexture, setButtonDim, setButtonIconPos, setButtonLabelPos, setImageElementDim, setSelectionUv } from './extDclUiToolkit'
import atlas_mappings from "./atlas_mappings";
import { PromptText } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Text'
import { PromptButton } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Button'
import { Prompt } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt'
import { CenterLabel } from './ext/CenterLabel'
import { i18n, i18nOnLanguageChangedAdd, i18nOnLanguageChangedAddReplace } from '../i18n/i18n'
import { _openExternalURL, log } from '../back-ports/backPorts'
import { ImageAtlasData } from 'dcl-ui-toolkit/dist/utils/imageUtils'
import { languages, namespaces } from '../i18n/i18n.constants'
import { CONFIG } from '../config'
import { RewardNotification } from '../gamimall/coin'
import { applyButtonStyle, applyCustomOptionsPanel, CUSTOM_ATLAS, CUSTOM_DELAY_MS, CustomPromptOptions, DEFAULT_SCREEN_TYPE, Modal, OPTION_PROMPT_DEFAULT_HEIGHT, OPTION_PROMPT_DEFAULT_WIDTH, SCALE_FONT, SCALE_FONT_TITLE, updateCloseBtnPosition } from './modals'
import { REGISTRY } from '../registry'
import { PromptButtonExt } from './ext/PromptButtonExt'
import { fetchNFTData, fetchOrderMarketData, isNFTResultValid, isOrderMarketResultValid } from '../store/fetch-utils'
import { CustomGridTextRow, CustomGridTextRowData } from './gridModalUtils'
import { convertDateToYMDHMS, generateGUID } from '../utils'
import { MinableUIType } from '../gamimall/state/MyRoomStateSpec'
import { PromptIcon } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Icon'
import * as eth from "eth-connect";
import { PromptExt } from './ext/PromptExt'

const CLASSNAME = "claimModals.tsx"

const SCALE_FONT_CLAIM_TITLE = 1.2;
const SCALE_FONT_CLAIM = 1.2;

const SCALE_CLAIM_UIImage = 1.15;

const CLAIM_PROMPT_DEFAULT_WIDTH = 750 * SCALE_CLAIM_UIImage;
const CLAIM_PROMPT_DEFAULT_HEIGHT = 500 * SCALE_CLAIM_UIImage;

//TODO share with interface type of NFTUIDataPrice and NFTUIDataPriceType
export type CustomClaimPriceType = "VirtualCurrency" | "Material";

const UNKNOWN_PRICE = "???"

//TODO convertion to i18n
const claimWindowPrefixNotStarted = "Can claim after " 
const claimWindowPrefixExpired = "Claim expired " 

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

  vc_vb?: string
  vc_ac?: string
  vc_zc?: string
  vc_rc?: string

  bronzeShoe?: string
  
  uiScale?: number; //defaults to 1
  showStockQty?:boolean //defaults to true
  itemQtyCurrent?:number
  itemQtyTotal?:number

  claimWindowEnabled?:boolean,//defaults to false
  claimStartMS?: number,
  claimEndMS?: number,

  contract?: string,
  itemId?:string,

  checkLatestMarketPrices?:boolean //defaults to false
  checkRemoteCostPrices?:boolean //defaults to true
  uiDisplayType?:MinableUIType
  claimCallback?: () => void,
  //onOpenCallback?: () => void,
  options?: CustomPromptOptions;
};
export class CustomClaimPrompt implements Modal {
  uuid: string;
  prompt: PromptWrapper<PromptExt>
  claimButton: PromptButtonExt
  secondaryButton: PromptButtonExt
  tradeButton: PromptButtonExt
  howItWorksButton: PromptButtonExt
  image: PromptIcon;
  itemName: PromptText;
  subtitleItemName: PromptText;
  title: PromptText;
  subtitle: PromptText;
  itemQtyAmount: PromptText;
  claimWindow: PromptText;
  checkingLatestPriceUI: PromptText;
  checkingLatestMarketPriceUI: PromptText;
  belowButtonText: PromptText;
  checkingLatestPrice:boolean = false
  checkingLatestMarketPrice:boolean = false
  
  showCostIcons:boolean = false
  costInfoIcon:PromptButtonExt
  costText:PromptText
  costRefreshIcon:PromptButtonExt
  howToBuyCoinsNMaterialsBtn: PromptButtonExt

  uiDisplayType:string|undefined

  coins: CustomGridTextRowData = {
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

  contract?: string
  itemId?:string
  showStockQty?:boolean=false
  itemQtyTotal?:number

  checkLatestMarketPrices?:boolean //defaults to true
  checkRemoteCostPrices?:boolean //defaults to true

  textGrid: CustomGridTextRow[] = [];

  claimCallback?: () => void;
  secondaryButtonCallback?: () => void;

  screenType:number = DEFAULT_SCREEN_TYPE
  
  options?: CustomPromptOptions;
  constructor(args: CustomClaimArgs) {
    this.uuid = generateGUID(8)
    this.claimCallback = args.claimCallback;
    //this.title = args.title;
    //this.imagePath = args.imagePath;
    //this.subtitleItemName = args.subtitleItemName;
    //this.itemName = args.itemName;
    //this.subtitle = args.subtitle;
    //this.coins = args.coins;
    //this.dollars = args.dollars;

    this.prompt = new PromptWrapper(
      ui.createComponent( PromptExt,//ui.CustomPrompt, 
          //{ style: ui.PromptStyles.DARKSLANTED } //is exactly the claim UI
          { style: ui.PromptStyles.DARKLARGE } //is mostly right, need to modify selection
      )
    ) 
    
    let titleUI = (this.itemName = this.prompt.addText(
      "itemName",
      125 - 70,
      210,
      Color4.create(1, 0.906, 0.553, 1),
      25 * SCALE_FONT_CLAIM_TITLE
    ));
    //const sfFont = getOrCreateFont(Fonts.SanFrancisco)
    //TODO do we need this?
    //titleUI.text.vAlign = "center";
    //titleUI.text.adaptHeight = true;
    titleUI.textElement.textAlign = "middle-left" //titleUI.text.hTextAlign = "left";
    //titleUI.text.textWrapping = true
    //titleUI.text.width = 280

      
    let itemsubtitleText = (this.subtitleItemName = this.prompt.addText(
      "subtitleItemName",
      125 - 70,
      185,
      Color4.create(0.247, 0.82, 0.718, 1),
      16 * SCALE_FONT_CLAIM
    ));
    itemsubtitleText.textElement.textAlign = "middle-left"

    //itemsubtitleText.text.vAlign = "center";
    //itemsubtitleText.text.adaptHeight = true;
    //itemsubtitleText.text.font = sfFont;
    itemsubtitleText.size = 10 * SCALE_FONT_CLAIM;

    let titleText = (this.title = this.prompt.addText(
      "title",
      200,
      145,
      Color4.White(),
      14 * SCALE_FONT_CLAIM
    ));

    //titleText.text.vAlign = "center";
    //titleText.text.adaptHeight = true;
    //titleText.text.font = sfFont;
    titleText.size = 15 * SCALE_FONT_CLAIM_TITLE;

    let subtitleText = (this.subtitle = this.prompt.addText(
      "subtitle",
      200,
      100,
      Color4.White(),
      12 * SCALE_FONT_CLAIM
    ));
    //subtitleText.text.vAlign = "center";
    //subtitleText.text.adaptHeight = true;
    //subtitleText.text.font = sfFont;
    subtitleText.size = 11 * SCALE_FONT_CLAIM;
 
    let itemQtyAmount = (this.itemQtyAmount = this.prompt.addText(
      "00/00",
      125 + 75,
      110 + 70,
      Color4.create(1, 0.906, 0.553, 1),
      14 * SCALE_FONT_CLAIM
    ));
    //itemQtyAmount.text.vAlign = "center";
    //itemQtyAmount.text.adaptHeight = true;
    titleUI.textElement.textAlign = "middle-left"//itemQtyAmount.text.hTextAlign = "left";
    //itemQtyAmount.text.textWrapping = true
    //itemQtyAmount.text.width = titleUI.text.width //250
    //itemQtyAmount.text.font = sfFont;
    itemQtyAmount.size = 14 * SCALE_FONT_CLAIM;

    let claimWindow = (this.claimWindow = this.prompt.addText(
      claimWindowPrefixNotStarted + convertDateToYMDHMS(new Date()),
      125 + 75,
      -60 - 120,
      Color4.White(),//new Color4(1, 0.906, 0.553, 1),
      12 * SCALE_FONT_CLAIM
    ));
    //claimWindow.text.vAlign = "center";
    //claimWindow.text.adaptHeight = true;
    titleUI.textElement.textAlign = "middle-left"//claimWindow.text.hTextAlign = "left";
    //claimWindow.text.textWrapping = true
    //claimWindow.text.width = titleUI.text.width //250
    //claimWindow.text.font = sfFont;
    claimWindow.size = 12 * SCALE_FONT_CLAIM;


    let checkingLatestPrice = this.checkingLatestPriceUI = this.prompt.addText(
      i18n.t("checkingLatestPrices",{ns:namespaces.ui.prompts}),
      200,
      -20,
      Color4.Green(),
      14 * SCALE_FONT_CLAIM
    );
    //checkingLatestPrice.text.vAlign = "center";
    //checkingLatestPrice.text.adaptHeight = true;
    //checkingLatestPrice.text.font = sfFont;
    checkingLatestPrice.size = 15 * SCALE_FONT;

    checkingLatestPrice.hide()

    let howToBuyCoinsNMaterialsBtn = this.howToBuyCoinsNMaterialsBtn = this.prompt.addButton(
      i18n.t("howToBuyCoinNMaterialsWithMana",{ns:namespaces.ui.prompts}),
      200,
      -77,
      () => {
        //OPEN URL
        _openExternalURL("https://docs.google.com/document/d/16YIznuIbahvo_-A8ix6_Wik3ET19RId-nA20kPRkye0/edit?usp=sharing")
      },
      ui.ButtonStyles.SQUAREBLACK
    );

    //TODO do i need to set width height???
    //howToBuyCoinsNMaterialsBtn.image.width = 275
    //howToBuyCoinsNMaterialsBtn.image.height = 25
    //comment out to test/see size of btn
    setSelectionUv(howToBuyCoinsNMaterialsBtn.imageElement, atlas_mappings.icons.transparent)
    //howToBuyCoinsNMaterialsBtn.image.source = RESOURCES.textures.transparent
    //howToBuyCoinsNMaterialsBtn.label.fontSize = 11//14
    howToBuyCoinsNMaterialsBtn.labelElement.fontSize = 11
    //howToBuyCoinsNMaterialsBtn.label.font = getOrCreateFont(Fonts.SansSerif_Bold)
    howToBuyCoinsNMaterialsBtn.labelElement.color = Color4.Yellow()
    //howToBuyCoinsNMaterialsBtn.label.color = Color4.Yellow()
    i18nOnLanguageChangedAdd((lng:string) => {
      howToBuyCoinsNMaterialsBtn.text = i18n.t("howToBuyCoinNMaterialsWithMana",{ns:namespaces.ui.prompts})
    }) 

    howToBuyCoinsNMaterialsBtn.setSubTextVisible(true)
    howToBuyCoinsNMaterialsBtn.subText="________________________________________________________"
    howToBuyCoinsNMaterialsBtn.setSubTextPosition({top:24 - 8,left:82 - 130})
    
    //TODO DO WE NEED AN UNDERLINE??? maybe just make it the background image???
    /*const howToBuyCoinsNMaterialsBtnUnderline = new UIText(howToBuyCoinsNMaterialsBtn.image)
    howToBuyCoinsNMaterialsBtnUnderline.isPointerBlocker = false
    howToBuyCoinsNMaterialsBtnUnderline.positionX = 0//-80
    howToBuyCoinsNMaterialsBtnUnderline.positionY = -2
    howToBuyCoinsNMaterialsBtnUnderline.value = "_____________________________________________________________________"
    howToBuyCoinsNMaterialsBtnUnderline.color = Color4.Yellow()
    howToBuyCoinsNMaterialsBtnUnderline.fontSize = 8
    howToBuyCoinsNMaterialsBtnUnderline.font = getOrCreateFont(Fonts.SansSerif_Bold)
    howToBuyCoinsNMaterialsBtnUnderline.width = 200
    howToBuyCoinsNMaterialsBtnUnderline.height = 10
    howToBuyCoinsNMaterialsBtnUnderline.hAlign = "center"
    howToBuyCoinsNMaterialsBtnUnderline.hTextAlign = "center"
    howToBuyCoinsNMaterialsBtnUnderline.vAlign = "center"
    howToBuyCoinsNMaterialsBtnUnderline.vTextAlign = "center"*/


    const COST_POS_Y =45

    this.showCostIcons = CONFIG.CLAIM_CHECK_FOR_LATEST_PRICES 
      && (args && args.options?.costShowIcons === undefined || args.options?.costShowIcons === true)

    const COST_X_BASE = this.showCostIcons && CONFIG.CLAIM_CHECK_FOR_LATEST_PRICES ? 180 : 200
    const costText = this.costText = this.prompt.addText(
      i18n.t("title.costToUpper",{ns:namespaces.common}),
      COST_X_BASE,
      COST_POS_Y,
      Color4.White(),
      14 * SCALE_FONT_CLAIM
    );
    //costText.text.vAlign = "center";
    //costText.text.adaptHeight = true;
    //costText.text.font = sfFont;
    costText.size = 15 * SCALE_FONT;

    i18nOnLanguageChangedAdd((lng:string) => {
      costText.value = i18n.t("title.costToUpper",{ns:namespaces.common})
    }) 

    if(this.showCostIcons){
      const costInfoIcon = this.costInfoIcon = this.prompt.addButton( //was addIcon
        "",
        COST_X_BASE+72,
        COST_POS_Y,
        //28,
        //28,
        ()=>{
          _openExternalURL("https://docs.google.com/document/d/1a11Xpk1sI4Kmpw_FyN4b5mTI5_vs2PPnEAhUX6en-2Y/edit?usp=sharing")
        },
        ui.ButtonStyles.ROUNDBLACK
      );
      //costInfoIcon.image.source = CUSTOM_ATLAS;
      //setSection(costInfoIcon.image, atlas_mappings.icons.costInfo);
      //atlas_mappings.icons.coin

      setBackgroundTexture(costInfoIcon.imageElement,CUSTOM_ATLAS)
      //maybe use icon instead of image and set image to transparent?
      setSelectionUv(costInfoIcon.imageElement, atlas_mappings.icons.costInfo)
      //costInfoIcon.
      //costInfoIcon.image.onClick = new OnClick(() => {
       // _openExternalURL("https://docs.google.com/document/d/1a11Xpk1sI4Kmpw_FyN4b5mTI5_vs2PPnEAhUX6en-2Y/edit?usp=sharing")
      //});

      let costRefresIcon = this.costRefreshIcon = this.prompt.addButton( //was addIcon
        "",
        COST_X_BASE+42,
        COST_POS_Y,
        //28,
        //28,
        ()=>{
          this.refreshData()
        },
        ui.ButtonStyles.ROUNDBLACK
        //atlas_mappings.icons.coin
      );
      setBackgroundTexture(costRefresIcon.imageElement,CUSTOM_ATLAS)
      //maybe use icon instead of image and set image to transparent?
      setSelectionUv(costRefresIcon.imageElement, atlas_mappings.icons.costRefresh)
      //costRefresIcon.image.source = CUSTOM_ATLAS;
      //setSection(costRefresIcon.image, atlas_mappings.icons.costRefresh);
      /*costRefresIcon.image.onClick = new OnClick(() => {
        this.refreshData()
      });*/
    }

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
    i18nOnLanguageChangedAddReplace(this.uuid+".claimButton",(lng) => {
      claimButton.text = i18n.t("button.claim", {ns:namespaces.common})
    })
    
    //TODO add back
    /*if (claimButton.icon) {
      claimButton.icon.visible = false;
      log(CLASSNAME,claimButton.label);
      claimButton.label.positionX = -5;
      claimButton.label.positionY = 5;
    }*/

    let secondaryButton = this.secondaryButton = this.prompt.addButton(
      i18n.t("button.raffleViewEntries", {ns:namespaces.common}),
      -65,
      -60,
      () => {
        if (this.secondaryButtonCallback) this.secondaryButtonCallback();
        //this.hide();
      },
      ui.ButtonStyles.ROUNDBLACK
    );
    
    i18nOnLanguageChangedAddReplace(this.uuid+".secondaryButton",(lng) => {
      secondaryButton.text = i18n.t("button.raffleViewEntries", {ns:namespaces.common})
    })

    //TODO add back
    /*if (secondaryButton.icon) {
      secondaryButton.icon.visible = false;
      log(CLASSNAME,secondaryButton.label);
      secondaryButton.label.positionX = -5;
      secondaryButton.label.positionY = 5;
    }*/

    

    let image = (this.image = this.prompt.addIcon(
      args.imagePath ? args.imagePath : "",
      -135,
      52,//20, //push up a little
      300,
      300,
      {
        ...{
          sourceTop: 0, sourceLeft: 0, 
          sourceHeight: args.imageHeight ? args.imageHeight : 512,
          sourceWidth: args.imageWidth ? args.imageWidth : 512,
        },
          atlasHeight: args.imageHeight ? args.imageHeight : 512, 
          atlasWidth: args.imageWidth ? args.imageWidth : 512
      }
    ));
    /*image.image.sourceTop = 0;
    image.image.sourceLeft = 0;
    image.image.vAlign = "center";
    image.image.hAlign = "center";
    image.image.sourceWidth = args.imageWidth ? args.imageWidth : 512;
    image.image.sourceHeight = args.imageHeight ? args.imageHeight : 512;*/

    let tradeButton = this.tradeButton = this.prompt.addButton(
      i18n.t("button.tradeFloorPrice", {ns:namespaces.common,"floorPrice":UNKNOWN_PRICE}),
      -135,
      -58,
      () => {
        //if (this.tradeBtnCallback) this.tradeBtnCallback();
        _openExternalURL("https://market.decentraland.org/contracts/"+this.contract+"/items/" + (this.itemId ? this.itemId : "0"))

        //this.hide();
      },
      ui.ButtonStyles.ROUNDBLACK,
    );
    clearButtonSystemInputListener(tradeButton)
 
    //TODO add back
    /*if (tradeButton.icon) {
      tradeButton.icon.visible = false;
      log(CLASSNAME,tradeButton.label);
    }*/
    tradeButton.subText = i18n.t("button.tradeFloorPriceGoToMarketPlace", {ns:namespaces.common})
    
    i18nOnLanguageChangedAddReplace(this.uuid+".tradeButtonSubText",(lng) => {
      tradeButton.subText = i18n.t("button.tradeFloorPriceGoToMarketPlace", {ns:namespaces.common})
    })
    

    let howItWorksButton = this.howItWorksButton = this.prompt.addButton(
      i18n.t("button.raffleCoinBagHowItWorks", {ns:namespaces.common}),
      -135,
      -58,
      () => {
        ////if (this.tradeBtnCallback) this.tradeBtnCallback();
        _openExternalURL("https://docs.google.com/document/d/1WA0-b4z2suiSBGOqDkBxCIHC3FQ8S7u7eWJRRCQdFOc/edit?usp=sharing")
        ////this.hide();
      },
      ui.ButtonStyles.E,
    );
    //workaround to disable key listener but still let it do show/hide
    clearButtonSystemInputListener(howItWorksButton)
 

    i18nOnLanguageChangedAdd((lng) => {
      this.howItWorksButton.text = i18n.t("button.raffleCoinBagHowItWorks", {ns:namespaces.common})
    })

    if (howItWorksButton.iconElement) {
      setBackgroundTexture(howItWorksButton.iconElement,CUSTOM_ATLAS)
      //maybe use icon instead of image and set image to transparent?
      setSelectionUv(howItWorksButton.iconElement, atlas_mappings.icons.costInfo)
      //setImageElementDim(howItWorksButton.iconElement,28,28)
      //howItWorksButton.icon.source = CUSTOM_ATLAS;
      //setSection(howItWorksButton.icon, atlas_mappings.icons.costInfo);
      //howItWorksButton.icon.visible = false;
      //log(CLASSNAME,howItWorksButton.label);
      /*howItWorksButton.label.positionX = 0;
      howItWorksButton.label.positionY = 5;

      howItWorksButton.icon.positionX = -90;
      howItWorksButton.icon.positionY = 5;*/
    }
    howItWorksButton.labelElement.fontSize = 17


    
    //DOES THIS UI ELEMENT SHOW UP ANYWHERE!?!?!?
    /*let checkingLatestMarketPriceUI = this.checkingLatestMarketPriceUI = this.prompt.addText(
      "REMOVE ME???",//i18n.t("checkingLatestMarketPriceUI",{ns:namespaces.ui.prompts}),
      -130,
      -182,
      Color4.Green(),
      12 * SCALE_FONT_CLAIM
    );
    //checkingLatestMarketPriceUI.text.vAlign = "center";
    checkingLatestMarketPriceUI.textElement.textAlign = "middle-center"//checkingLatestMarketPriceUI.text.hTextAlign = "center";
    //checkingLatestMarketPriceUI.text.adaptHeight = true;
    //checkingLatestMarketPriceUI.text.font = sfFont;
    checkingLatestMarketPriceUI.size = 12 * SCALE_FONT;

    i18nOnLanguageChangedAdd((lng) => {
      this.checkingLatestMarketPriceUI.value = i18n.t("checkingLatestMarketPriceUI",{ns:namespaces.ui.prompts})
    })*/

    let belowButtonText = this.belowButtonText = this.prompt.addText(
      i18n.t("belowButtonText",{ns:namespaces.ui.prompts}),
      190,
      -180,
      Color4.White(),
      14 * SCALE_FONT_CLAIM
    );
    //belowButtonText.text.vAlign = "center";
    belowButtonText.textElement.textAlign = "middle-center"//belowButtonText.text.hTextAlign = "center";
    //belowButtonText.text.adaptHeight = true;
    //belowButtonText.text.font = sfFont;
    belowButtonText.size = 10 * SCALE_FONT;
  
    i18nOnLanguageChangedAddReplace(this.uuid+".belowButtonText",(lng) => {
      this.belowButtonText.value = i18n.t("belowButtonText",{ns:namespaces.ui.prompts})
    })
    
    ////checkingLatestMarketPriceUI.hide()
    
    
    //TODO move / use this with applyUIScaling()
    let rowYPos = 25;
    const rowYHeight = 22;
    const fontSize = 15;

    const row1Xwidth = 200;
    const row1X = 175 + 60;
    const row2X = 175 + 90 + 75; 
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
          strText = "wood";
          break;
        case 2:
          strText = "diamon";
          break;
        case 3:
          strText = "lil coin";
          break;
      }
      /*
      let text = this.prompt.addText(
        strText + x,
        row1X,
        rowYPos,
        Color4.White(),
        fontSize
      );
      text.textElement.textAlign = "middle-left"//text.text.hTextAlign = "left";
      //text.text.width = 70;

      let icon = this.prompt.addIcon(
        "",
        row1Ximage,
        rowYPos - rowYHeight + imageShiftY,
        iconSizeWidth,
        iconSizeHeight,
        atlas_mappings.icons.coin
      );
      icon.image.source = CUSTOM_ATLAS;
      setSection(icon.image, atlas_mappings.icons.coin);
      //TODO convert this whole thing into PromptTextIconBg
      this.textGrid.push(new CustomGridTextRow(undefined,icon.image,text.text));
        */
      /*
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
      icon.image.source = CUSTOM_ATLAS;
      setSection(icon.image, atlas_mappings.icons.coin);

      ////dont add right away so it adds down
      ////addAfter.push({ uiIcon: icon, text: text });
      //TODO convert this whole thing into PromptTextIconBg
      */

      const scaleDown = .9

      //row1
      const btn = this.prompt.addTextImgBg(
        x+"",
        row1Ximage,
        rowYPos,
        () => { },
        ui.ButtonStyles.E //needed for icon
      ) 
      clearButtonSystemInputListener(btn)

      setButtonDim(btn,row1Xwidth,iconSizeHeight)
      setButtonIconPos(btn,-1 * (row1Xwidth/2) + iconSizeWidth,imageShiftY)
      setButtonLabelPos(btn,'middle-left',labelShiftX,0)
      btn.labelElement.fontSize = fontSize
      
      //btn.labelElement.font = UIfont
      setImageElementDim(btn.iconElement,iconSizeWidth * scaleDown,iconSizeHeight * scaleDown)
      setBackgroundTexture(btn.iconElement,CUSTOM_ATLAS)
      setBackgroundTexture(btn.imageElement,CUSTOM_ATLAS)
      //comment out to see full size of cell
      setSelectionUv(btn.imageElement, atlas_mappings.icons.transparent)
     
      this.textGrid.push(new CustomGridTextRow(btn));

      //row2
      const btn2 = this.prompt.addTextImgBg(
        x+"",
        row2X,
        rowYPos,
        () => { },
        ui.ButtonStyles.E //needed for icon
      ) 
      clearButtonSystemInputListener(btn2)

      setButtonDim(btn2,row1Xwidth,iconSizeHeight)
      setButtonIconPos(btn2,-1 * (row1Xwidth/2) + iconSizeWidth,imageShiftY)
      setButtonLabelPos(btn2,'middle-left',labelShiftX,0)
      btn2.labelElement.fontSize = fontSize
      
      //btn.labelElement.font = UIfont
      setImageElementDim(btn2.iconElement,iconSizeWidth * scaleDown,iconSizeHeight * scaleDown)
      setBackgroundTexture(btn2.iconElement,CUSTOM_ATLAS)
      setBackgroundTexture(btn2.imageElement,CUSTOM_ATLAS)
      //comment out to see full size of cell
      setSelectionUv(btn2.imageElement, atlas_mappings.icons.transparent)


      addAfter.push(new CustomGridTextRow(btn2));

      rowYPos -= rowYHeight;
    }

    ////this.updateCoins(coins)
    ////this.updateDollar(dollars)
    for (const p in addAfter) {
      this.textGrid.push(addAfter[p]);
    }

    for(let row=0;row<this.textGrid.length;row++){
      ////if(row === 4){
      //workaround, not sure how but its blocking the cost "?" and "price refresh buttons"
      //if we ever need this clickable will solve why
      //TODO IS THIS NEEDED in sdk7???
      const itm = this.textGrid[row]
      //if(itm.textIconBg.imageElement.uiTransform) itm.textIconBg.imageElement.uiTransform.pointerFilter = 'none'
      //if(this.textGrid[row].uiItemBg) this.textGrid[row].uiItemBg.isPointerBlocker = false
      //if(this.textGrid[row].uiIconImg) this.textGrid[row].uiIconImg.isPointerBlocker = false
      //if(this.textGrid[row].uiText) this.textGrid[row].uiText.isPointerBlocker = false
      //}
    }
    this.updateGrid();

    this.updateData(args);

    this.options = args.options

    this.hide();
    
    this.applyUIScaling()
  }
  applyUIScaling(){
    const METHOD_NAME = "applyUIScaling"
    let SCREEN_TYPE = this.screenType

    //this is legacy, eventaully move it all into applyUIScaling
    
    const claimRaffle = this.uiDisplayType ==="claim-raffle"
    applyClaimPanel(
      this.prompt,
      this.claimButton,
      claimRaffle ? this.secondaryButton : undefined,//secondaryButton,
      this.tradeButton,
      this.howItWorksButton,
      this.options //let args.options pass new changes???
    );
    if(claimRaffle){
      //TODO add this back
      //this.belowButtonText.textElement.uiTransform?.position. = 190
      //applyUIScaling
      this.belowButtonText.xPosition = 225
      this.belowButtonText.yPosition = -175
    }
    //TODO add back???
    //this.image.image.positionY = 23
    if(claimRaffle){
      if(this.secondaryButton){
        this.secondaryButton.show()
      }
      if(this.howItWorksButton){
        this.howItWorksButton.show()
      }
    }else{
      if(this.secondaryButton){
        this.secondaryButton.hide()
        //TODO add back???
        this.secondaryButton.xPosition = -9999
      }
      if(this.belowButtonText){
        //TODO add back???
        this.belowButtonText.xPosition = -9999
      }
      if(this.howItWorksButton){
        this.howItWorksButton.hide()
        //TODO add back???
        this.howItWorksButton.xPosition = -9999
      }
    }
    //debugger
    log(CLASSNAME,CLASSNAME,METHOD_NAME,"this.checkLatestMarketPrices",this.checkLatestMarketPrices)
    if(this.checkLatestMarketPrices === undefined || (this.checkLatestMarketPrices !== undefined && !this.checkLatestMarketPrices)){
      if(this.tradeButton){ 
        this.tradeButton.hide()
        //TODO add back???
        this.tradeButton.xPosition = -9999
      }
    }else{
      if(this.tradeButton){
        //raise above the trade button
        //TODO add back???
        //this.image.image.positionY = 52
        this.tradeButton.show()
        ////this.tradeButton.text = i18n.t("button.raffleViewEntries", {ns:namespaces.common})
      }
    }
    //END LEGACY

    const xOffset = 8 //- 140
    const yOffset = 14 //+ 10

    const xOffset2 = - 140
    const yOffset2 =  14

    this.title.xPosition = 200 + xOffset + 30 + xOffset2
    this.title.yPosition = 142 + yOffset + yOffset2

    this.itemName.xPosition = 125 - 70 + xOffset
    this.itemName.yPosition = 210 + yOffset + 13

    this.subtitleItemName.textElement.textAlign = "middle-right"
    this.subtitleItemName.xPosition = 300 + 70 + xOffset // pushed over right
      //125 - 70 + xOffset//aligned with title
    this.subtitleItemName.yPosition = 185 + yOffset

    this.subtitle.xPosition = 200 + xOffset + 30 + xOffset2
    this.subtitle.yPosition = 100 + yOffset + yOffset2

    this.image.xPosition = -165 + xOffset,
    this.image.yPosition = 22 + yOffset

    this.itemQtyAmount.textElement.textAlign = "middle-left"
    this.itemQtyAmount.xPosition = 25 + xOffset + 30//125 + 75 + xOffset
    this.itemQtyAmount.yPosition = 110 + 70 + yOffset + 5

    this.claimWindow.xPosition = 125 + 75 + xOffset
    this.claimWindow.yPosition = -60 - 130 + yOffset

    // this.checkingLatestPriceUI.xPosition = 200 + xOffset
    // this.checkingLatestPriceUI.yPosition = -20 + yOffset


    this.checkingLatestPriceUI.xPosition = 200 + 15 + xOffset - 100
    this.checkingLatestPriceUI.yPosition = -50 + yOffset

    this.howToBuyCoinsNMaterialsBtn.xPosition = 200 + 20 + xOffset// - 120
    this.howToBuyCoinsNMaterialsBtn.yPosition = -95 + yOffset// + 5


    const COST_POS_Y =45

    const COST_X_BASE = this.showCostIcons && CONFIG.CLAIM_CHECK_FOR_LATEST_PRICES ? 180 + 45 : 200

    this.costText.xPosition = COST_X_BASE - 14
    this.costText.yPosition = COST_POS_Y + 2 + 14
        
    if(this.showCostIcons){
      this.costInfoIcon.xPosition = COST_X_BASE+72
      this.costInfoIcon.yPosition = COST_POS_Y
       
      setButtonDim(this.costInfoIcon,28,28)

      this.costRefreshIcon.xPosition = COST_X_BASE+42
      this.costRefreshIcon.yPosition = COST_POS_Y
       
      setButtonDim(this.costRefreshIcon,28,28)
    }

    updateCloseBtnPosition( this.prompt, 0)

  }
  
  showCheckingLatestMarketPrice(val:boolean){
    //if(!this.checkingLatestMarketPriceUI) return
    if(val){
      //this.checkingLatestMarketPriceUI.hide()
      this.tradeButton.text = i18n.t("checkingLatestMarketPriceUI",{ns:namespaces.ui.prompts})
    }else{
      //this.checkingLatestMarketPriceUI.hide()
    }
    //because of async calls must remember last status
    this.checkingLatestMarketPrice = val
  }
  showCheckingLatestPrice(val:boolean){
    if(val){
      this.checkingLatestPriceUI.show()
      //loop through and disable them
      this.hideGrid()
    }else{
      this.checkingLatestPriceUI.hide()
    }
    //because of async calls must remember last status
    this.checkingLatestPrice = val
  }
  refreshData():void{
    const METHOD_NAME = "refreshData"
    
    
    this.doCostCheck();
    this.doLatestMarketPriceCheck();
    
  }
  doLatestMarketPriceCheck(){
    const METHOD_NAME = "doLatestMarketPriceCheck"

    if(!CONFIG.CLAIM_CHECK_FOR_LATEST_PRICES){
      log(CLASSNAME,METHOD_NAME,"CONFIG.CLAIM_CHECK_FOR_LATEST_PRICES disabled, not to check...",CONFIG.CLAIM_CHECK_FOR_LATEST_PRICES)
      this.showCheckingLatestMarketPrice(false)
      return
    }
    if(this.checkLatestMarketPrices === undefined || (this.checkLatestMarketPrices !== undefined && !this.checkLatestMarketPrices)){
      log(CLASSNAME,METHOD_NAME,"checkLatestMarketPrices disabled, not to check...",this.checkLatestMarketPrices)
      this.showCheckingLatestMarketPrice(false)
      return
    }
    if(this.contract === undefined ){
      log(CLASSNAME,METHOD_NAME,"no contract to check against, ignoreing...")
      this.showCheckingLatestMarketPrice(false)
      return
    }
    this.showCheckingLatestMarketPrice(true)

    //wrapping in a executeTask, not sure if it helps or not to run in seperate thread
    executeTask(async () => {
      if(!this.contract){
        log(CLASSNAME,METHOD_NAME,"fetchOrderMarketData - no contract to check against, ignoreing...")
        return;
      }
      //do price update check
      const result = fetchOrderMarketData({contractId:this.contract, itemId:this.itemId}).then(
        (result:any)=>{
          if(isOrderMarketResultValid(result)){
            log(CLASSNAME,METHOD_NAME,"result",result)

            
            let val = ""
            if( result.data.length > 0){
              const price = result.data[0].price + ""
              val = i18n.t("button.tradeFloorPrice", {ns:namespaces.common,"floorPrice": eth.fromWei(price,"ether")})
            }else{
              val = i18n.t("button.tradeFloorPrice", {ns:namespaces.common,"floorPrice":UNKNOWN_PRICE})
            }
            this.tradeButton.text = val
          }else{
            log(CLASSNAME,METHOD_NAME,"invalid result",result)
          }
          this.showCheckingLatestMarketPrice(false)
        }
      )
    })//end executeTask
  }
  doCostCheck(){
    const METHOD_NAME = "doCostCheck"

    if(!CONFIG.CLAIM_CHECK_FOR_LATEST_PRICES){
      log(CLASSNAME,METHOD_NAME,"CONFIG.CLAIM_CHECK_FOR_LATEST_PRICES disabled, not to check...",CONFIG.CLAIM_CHECK_FOR_LATEST_PRICES)
      this.showCheckingLatestPrice(false)
      return
    }
    if(this.checkRemoteCostPrices !== undefined && !this.checkRemoteCostPrices){
      log(CLASSNAME,METHOD_NAME,"checkRemoteCostPrices disabled, not to check...",this.checkRemoteCostPrices)
      this.showCheckingLatestPrice(false)
      return
    }
    if(this.contract === undefined ){
      log(CLASSNAME,METHOD_NAME,"no contract to check against, ignoreing...")
      this.showCheckingLatestPrice(false)
      return
    }
    this.showCheckingLatestPrice(true)
    
    //wrapping in a executeTask, not sure if it helps or not to run in seperate thread
    executeTask(async () => {
    //do price update check
    const result = fetchNFTData(this.contract,{withMetadata:false}).then(
      (result:any)=>{
        log(CLASSNAME,METHOD_NAME,"result",result)

        if(isNFTResultValid(result)){

          for(const r in result.assets.supplyNfts){
            const newValItm = result.assets.supplyNfts[r]
            const newValAddress = newValItm.contract ? (newValItm.contract+"").toLowerCase() : undefined
            const newValAmount = newValItm.count
            const costs = newValItm.costs
          
            if (costs !== undefined && costs.length > 0) {
              //reset them so they can be set again
              for(const p of [this.coinBagRaffleStat,this.coinBagRaffleRedeem,this.bronzeShoe,this.coins,this.bronze,this.dollars
                ,this.rock1,this.rock2,this.rock3
                , this.vc_vb,this.vc_ac,this.vc_zc,this.vc_rc
                ,this.petro,this.nitro]){
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


                  case CONFIG.GAME_COIN_TYPE_VB:
                      this.vc_vb.text= price
                      break; 
                  case CONFIG.GAME_COIN_TYPE_AC:
                      this.vc_ac.text= price
                      break; 
                  case CONFIG.GAME_COIN_TYPE_ZC:
                      this.vc_zc.text= price
                      break; 
                  case CONFIG.GAME_COIN_TYPE_RC:
                      this.vc_rc.text= price
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
                    ////args. = price
                    //TODO
                    break;
                  //add tickets
                }
                const itemid = costs[p].itemId;
                if(itemid){
                  switch (itemid) {
                    case CONFIG.GAME_COIN_TYPE_REDEEM_RAFFLE_COIN_BAG_ID:
                      this.coinBagRaffleRedeem.text = price;
                      break;
                  }
                }
              }
            }
    
            this.updateQty( newValAmount )
            this.updateGrid();
          }
        }else{
          log(CLASSNAME,METHOD_NAME,"invalid result",result)
        }
        this.showCheckingLatestPrice(false)
      }
    )
    })//end executeTask
  }
  show(): void {
    this.refreshData()

    utils.timers.setTimeout(() => {
      this.prompt.show();
      this.showCheckingLatestPrice(this.checkingLatestPrice)
      this.showCheckingLatestMarketPrice(this.checkingLatestMarketPrice)
      this.updateGrid();
    },CUSTOM_DELAY_MS);
  }
  hide(): void {
    this.prompt.hide();
  }

  hideGrid() {
    for (let x = 0; x < this.textGrid.length; x++) {
      //log(CLASSNAME,"hideGrid", x);
      this.textGrid[x].hide();
    }
  }

  updateGridIndex(row: number, data: CustomGridTextRowData) {
    if(this.textGrid===undefined){
      log(CLASSNAME,"updateGridIndex WARN this.textGrid is null ",row,this.textGrid)
      return;
    }
    if(this.textGrid[row] === undefined){
      log(CLASSNAME,"updateGridIndex WARN invalid index ",row,this.textGrid.length)
      return;
    }
    this.textGrid[row].show();
    //this.textGrid[row].uiIcon.show();

    //if(this.textGrid[row].uiText !== undefined) this.textGrid[row].uiText.value = data.text;
    this.textGrid[row].setText( data.text );

    if (data.uiIconSection !== undefined) {
      setBackgroundTexture(this.textGrid[row].textIconBg.iconElement,CUSTOM_ATLAS)
      //maybe use icon instead of image and set image to transparent?
      setSelectionUv(this.textGrid[row].textIconBg.iconElement, data.uiIconSection);
      //setSection(this.textGrid[row].uiIconImg, data.uiIconSection);
    }
  }
  updateGrid() {
    const arr: CustomGridTextRowData[] = [this.coinBagRaffleStat,this.coinBagRaffleRedeem,this.bronzeShoe,this.coins, this.bronze, this.dollars
      , this.rock1,this.rock2,this.rock3
      , this.vc_vb,this.vc_ac,this.vc_zc,this.vc_rc
      ,this.petro,this.nitro];
    

    this.hideGrid();
    //debugger
    let row = 0;
    for (let x = 0; x < arr.length; x++) {
      if (arr[x].text !== undefined && arr[x].text.length > 0) {
        this.updateGridIndex(row, arr[x]);
        row++;
      } else {
        log(CLASSNAME,"updateGrid was blank", arr[x]);
      }
    }
    /*
    ////row++
    ////row++
    //push it down to its own row
    ////this.updateGridIndex(row,this.coinsEarned)*/
  }
  updateData(args: CustomClaimArgs) {
    const METHOD_NAME = "updateData"
    ////this.prompt = new ui.CustomPrompt(undefined, undefined, undefined, true);

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

          case CONFIG.GAME_COIN_TYPE_VB:
              args.vc_vb= price;
              break; 
          case CONFIG.GAME_COIN_TYPE_AC:
              args.vc_ac= price;
              break; 
          case CONFIG.GAME_COIN_TYPE_ZC:
              args.vc_zc= price;
              break; 
          case CONFIG.GAME_COIN_TYPE_RC:
              args.vc_rc= price;
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
    
    this.checkLatestMarketPrices = args.checkLatestMarketPrices
    this.checkRemoteCostPrices = args.checkRemoteCostPrices
    this.contract = args.contract
    this.itemId = args.itemId
    this.claimCallback = args.claimCallback; 
    this.itemName.value = args.itemName ? args.itemName : "";
    //this.itemName.text.value = "xsdflkj flsdkj dlskfj dlskfjdskl j"
    //this.itemName.text.value = "slfkjdsflksj fdsl "
    this.subtitleItemName.value = args.subtitleItemName
      ? args.subtitleItemName
      : "";

    //scale ui down???

    this.showStockQty = args.showStockQty
    this.itemQtyTotal = args.itemQtyTotal
    const currQty = args.itemQtyCurrent
      this.updateQty(currQty)

      if(args.claimWindowEnabled !== undefined && args.claimWindowEnabled === true){
        const now = Date.now()
        const expired = args && args.claimEndMS && args.claimEndMS >= 0 && args.claimEndMS < now
        if( args && args.claimStartMS && args.claimStartMS >= 0 && args.claimStartMS > now && !expired){
          this.claimWindow.value = claimWindowPrefixNotStarted + convertDateToYMDHMS( new Date(args.claimStartMS) )
        }else if( expired && args.claimEndMS ){
            this.claimWindow.value = claimWindowPrefixExpired + convertDateToYMDHMS( new Date(args.claimEndMS) )
        }else{
          //TODO IMPL OTHER VARIENTS
          this.claimWindow.value = ""
        }
      }else{
        //dont show
        this.claimWindow.value = ""
      }

    //reset trade floor value till looks up new one
    this.tradeButton.text = i18n.t("button.tradeFloorPrice", {ns:namespaces.common,"floorPrice":UNKNOWN_PRICE})
    
    this.title.value = args.title ? args.title : "";
    this.subtitle.value = args.subtitle ? args.subtitle : "";
    
    this.coins.text = args.coins ? args.coins : "";
    this.dollars.text = args.dollars ? args.dollars : "";

    this.vc_vb.text = args.vc_vb ? args.vc_vb : "";
    this.vc_ac.text = args.vc_ac ? args.vc_ac : "";
    this.vc_zc.text = args.vc_zc ? args.vc_zc : "";
    this.vc_rc.text = args.vc_rc ? args.vc_rc : "";

    this.rock1.text = args.rock1 ? args.rock1 : "";
    this.rock2.text = args.rock2 ? args.rock2 : "";
    this.rock3.text = args.rock3 ? args.rock3 : "";
    this.petro.text = args.petro ? args.petro : "";
    this.nitro.text = args.nitro ? args.nitro : "";
    this.bronze.text = args.bronze ? args.bronze : "";
    this.bronzeShoe.text = args.bronzeShoe ? args.bronzeShoe : "";
    //this.coinBagRaffleRedeem.text = args.coinBagRaffleRedeem ? args.coinBagRaffleRedeem : "";

    this.uiDisplayType = args.uiDisplayType

    this.updateGrid();
    

    let image = this.image;
    //debugger
    setBackgroundSrcNTexture(image,args.imagePath ? args.imagePath : "")
    //maybe use icon instead of image and set image to transparent?
    //setSelectionUv(image.imageElement, atlas_mappings.icons.costInfo)
    setSelectionUv(image.imageElement,{ 
        //...atlas_mappings.backgrounds.emptyPanel,
        ...{
          sourceTop: 0, sourceLeft: 0, 
          sourceHeight: args.imageHeight ? args.imageHeight : 512,
          sourceWidth: args.imageWidth ? args.imageWidth : 512,
        },
          atlasHeight: args.imageHeight ? args.imageHeight : 512, 
          atlasWidth: args.imageWidth ? args.imageWidth : 512
      } 
    )
    //image.image.source = new Texture(args.imagePath ? args.imagePath : "");
    //TODO need to add this back, can we without knowing full image dimensions?
    //image.image.sourceWidth = args.imageWidth ? args.imageWidth : 512;
    //image.image.sourceHeight = args.imageHeight ? args.imageHeight : 512;

    this.applyUIScaling()
    
  }
  updateQty(currQty?:number){
    if(this.showStockQty === undefined || this.showStockQty === true){
      if( currQty !== undefined && currQty >= 0 ){
        let qtyVal = currQty + ""
        if(this.itemQtyTotal){
          qtyVal += "/" + this.itemQtyTotal
        }else{
          qtyVal += " In Stock"
        }
        this.itemQtyAmount.value = "("+qtyVal+")" 
      }else{
        if(currQty === undefined){
          this.itemQtyAmount.value = i18n.t("stockNotAvailable",{ns:namespaces.ui.prompts})
        }else{
          this.itemQtyAmount.value = i18n.t("stockNotAvailable",{ns:namespaces.ui.prompts})
        }
      i18nOnLanguageChangedAdd((lng:string) => {
        this.itemQtyAmount.value = i18n.t("stockNotAvailable",{ns:namespaces.ui.prompts})
      })  
      }
    }else{
      //dont show
      this.itemQtyAmount.value = ""
    }
  }
}

function applyClaimPanel(
  modal: PromptWrapper<PromptExt>,
  firstClaimButton: PromptButtonExt,
  secondaryClaimButton?: PromptButtonExt,
  tradeButton?: PromptButtonExt,
  howItWorksButton?: PromptButtonExt,
  options?: CustomPromptOptions
): void {
  //TODO add back
  /*
  //if (CUSTOM_ATLAS !== undefined) {
    modal.background.positionY = -30//push down a little away from stanima bar
    modal.background.source = CUSTOM_ATLAS;

    modal.background.sourceTop = 1601;
    modal.background.sourceWidth = 1986;
    modal.background.sourceLeft = 0;

    modal.background.sourceHeight = 1271;
   */

    //modal._prompt.
    modal._prompt.setPositionTop("55%")
    modal.setTexture( CUSTOM_ATLAS )
    modal.setSelection(atlas_mappings.backgrounds.claimPanel)
    
    /*
    modal.background.height =
      options && options.height
        ? options && options.height
        : CLAIM_PROMPT_DEFAULT_HEIGHT;
    modal.background.width =
      options && options.width
        ? options && options.width
        : CLAIM_PROMPT_DEFAULT_WIDTH;
    */
   //TODO ally setting custom height and width
   modal._prompt.height =
    options && options.height ? options.height : CLAIM_PROMPT_DEFAULT_HEIGHT;
    modal._prompt.width =
      options && options.width ? options.width : CLAIM_PROMPT_DEFAULT_WIDTH;
    
    //call apply style??? applyButtonStyle from modal.tsx??
    /*
    modal.closeIcon.positionX = "48%";
    modal.closeIcon.positionY = "45%";
    modal.closeIcon.source = CUSTOM_ATLAS; //<== THIS POINTS AT OUR IMAGE ATLAS
    modal.closeIcon.sourceLeft = 3843; //TODO change these to map to it
    modal.closeIcon.sourceWidth = 105;//change these to map to it
    modal.closeIcon.sourceTop = 310;//change these to map to it
    modal.closeIcon.sourceHeight = 105;//change these to map to it
    */
    //TODO move / use this with applyUIScaling()

    const BUTTON_Y_POS = -150
    const BUTTON_X_POS = 265 + 55
    const BUTTON_WIDTH = (300 + 45)
    const BUTTON_HEIGHT = 50+5
    if (secondaryClaimButton) {
      setBackgroundTexture(firstClaimButton.imageElement,CUSTOM_ATLAS)
      //maybe use icon instead of image and set image to transparent?
      setSelectionUv(firstClaimButton.imageElement, atlas_mappings.icons.costInfo)
      applyButtonStyle(firstClaimButton) 
      setButtonDim(firstClaimButton,BUTTON_WIDTH/2.1,BUTTON_HEIGHT)
      firstClaimButton.xPosition = BUTTON_X_POS - (BUTTON_WIDTH/2) - 10
      firstClaimButton.yPosition = BUTTON_Y_POS
 

      setBackgroundTexture(secondaryClaimButton.imageElement,CUSTOM_ATLAS)
      //maybe use icon instead of image and set image to transparent?
      setSelectionUv(secondaryClaimButton.imageElement, atlas_mappings.icons.costInfo)
      applyButtonStyle(secondaryClaimButton) 
      setButtonDim(secondaryClaimButton,BUTTON_WIDTH/2.1,BUTTON_HEIGHT)
      secondaryClaimButton.xPosition = BUTTON_X_POS  - 14
      secondaryClaimButton.yPosition = BUTTON_Y_POS

      //TODO PUT BACK
      //TODO SET THE SECONDARY BUTTON!!!

      /*
      firstClaimButton.image.source = CUSTOM_ATLAS;
      firstClaimButton.image.positionY = positionY
      firstClaimButton.image.positionX = "17%";
      firstClaimButton.image.sourceLeft = 2028;
      firstClaimButton.image.sourceWidth = 399;
      firstClaimButton.image.sourceTop = 1800;
      firstClaimButton.image.sourceHeight = 183;
      firstClaimButton.image.width = "20%";
      firstClaimButton.image.height = "13%";
      firstClaimButton.label.positionY = 0;

      secondaryClaimButton.image.source = CUSTOM_ATLAS;
      secondaryClaimButton.image.positionY = positionY
      secondaryClaimButton.image.positionX = "36%";


      secondaryClaimButton.image.sourceLeft = 2035;
      secondaryClaimButton.image.sourceWidth = 400;
      secondaryClaimButton.image.sourceTop = 2398;
      secondaryClaimButton.image.sourceHeight = 183;
      
      secondaryClaimButton.image.width = "20%";
      secondaryClaimButton.image.height = "13%";
      secondaryClaimButton.label.positionY = 0;
      secondaryClaimButton.label.positionX = 3;
      */
    } else {
      //TODO move / use this with applyUIScaling()
      setBackgroundTexture(firstClaimButton.imageElement,CUSTOM_ATLAS)
      //maybe use icon instead of image and set image to transparent?
      setSelectionUv(firstClaimButton.imageElement, atlas_mappings.icons.costInfo)
      applyButtonStyle(firstClaimButton) 
      setButtonDim(firstClaimButton,BUTTON_WIDTH,BUTTON_HEIGHT)
      firstClaimButton.xPosition = BUTTON_X_POS
      firstClaimButton.yPosition = BUTTON_Y_POS
      /*
      firstClaimButton.image.source = CUSTOM_ATLAS;
      firstClaimButton.image.positionY = "-27%";
      firstClaimButton.image.positionX = "27%";
      firstClaimButton.image.sourceLeft = 2750;
      firstClaimButton.image.sourceWidth = 800;
      firstClaimButton.image.sourceTop = 2606;
      firstClaimButton.image.sourceHeight = 215;
      firstClaimButton.image.width = "41%";
      firstClaimButton.image.height = "15%";
      firstClaimButton.label.positionY = 10;
      */
    }
    //TODO move / use this with applyUIScaling()
    if(howItWorksButton){
      howItWorksButton.labelElement.fontSize = 20
      applyButtonStyle(howItWorksButton) 
      setBackgroundTexture(howItWorksButton.imageElement,CUSTOM_ATLAS)
      setSelectionUv(howItWorksButton.imageElement, atlas_mappings.buttons.grayRound)
      //howItWorksButton.image.source = CUSTOM_ATLAS;
      howItWorksButton.yPosition = 220 - 0//"38%";//"-27%"; 
      howItWorksButton.xPosition = -90 - 20//"-133";
      
      const iconSizeWidth = 32
      const btnWidth = 260
      setButtonDim(howItWorksButton,btnWidth,50)
      setButtonIconPos(howItWorksButton,-btnWidth/2 + iconSizeWidth,0)

      setImageElementDim(howItWorksButton.iconElement,iconSizeWidth,iconSizeWidth)
      setSelectionUv(howItWorksButton.iconElement, atlas_mappings.icons.costInfo)
    }
    if(tradeButton){
      tradeButton.labelElement.fontSize = 19
      applyButtonStyle(tradeButton) 
      setBackgroundTexture(tradeButton.imageElement,CUSTOM_ATLAS)
      setSelectionUv(tradeButton.imageElement, atlas_mappings.buttons.primaryRound)
      
      tradeButton.yPosition = -145 - 10//"38%";//"-27%"; 
      tradeButton.xPosition = -40 - 10//"-133";
      
      tradeButton.subTextElement.fontSize = 12
      tradeButton.setTextPosition({top: -10})
      tradeButton.setSubTextPosition({top: 35 - 10})
      tradeButton.setSubTextVisible(true)  

      const iconSizeWidth = 32
      const btnWidth = 370
      setButtonDim(tradeButton,btnWidth,50)
      setButtonIconPos(tradeButton,-btnWidth/2 + iconSizeWidth,0)

      setImageElementDim(tradeButton.iconElement,iconSizeWidth,iconSizeWidth)
      setSelectionUv(tradeButton.iconElement, atlas_mappings.icons.costInfo)
      /*tradeButton.image.source = CUSTOM_ATLAS;
      tradeButton.image.positionY = "-26.1%";//"-27%";
      tradeButton.image.positionX = "-133";
      tradeButton.image.sourceLeft = 2750;
      tradeButton.image.sourceWidth = 800;
      tradeButton.image.sourceTop = 2606;
      tradeButton.image.sourceHeight = 215;
      tradeButton.image.width = "45%";
      tradeButton.image.height = "15%";
      tradeButton.label.positionX = -5;
      tradeButton.label.positionY = 15;*/
    }
    /*if (modal instanceof ui.CustomPrompt) {
      modal.texture = CUSTOM_ATLAS;
    }*/
    
  //}
}

export function initClaimModel(){
  let rewardOpts = {}//{ height: 550 };
  const claimRewardPrompt20 = new CustomClaimPrompt({
    imagePath:
      "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x47f8b9b9ec0f676b45513c21db7777ad7bfedb35:0/thumbnail",
    imageWidth: 1024,
    imageHeight: 1024,
    itemName: "Doge Head",
    subtitleItemName: "Created By Metadoges",
    subtitle:
      "The very first wearable created by Metadoge,\nHolder can swap to LiLDoge here",
    title: "HIHGHLIGHTS",
    coins: "x 3000",
    dollars: "x 1000",
    rock1:"x r1",
    rock2:"x r2",
    rock3:"x r3",
    bronze:"x bz1",
    bronzeShoe:"x shoe",
    nitro:"x nit",
    petro:"x p1",
    itemQtyCurrent: 23,
    itemQtyTotal:100,
    options: rewardOpts,
  });
  claimRewardPrompt20.updateData({ 
    imagePath:
      "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x83d431a9a5084bf26ef4e1081e26fbe90798aa3a:0/thumbnail",
    imageWidth: 1024,
    imageHeight: 1024,
    itemName: "Doge Head sdfl djsflk dsjfslkf jdslk ",
    subtitleItemName: "Created By Metadoges",
    subtitle:
      "The very first wearable created by Metadoge,\nHolder can swap to LiLDoge here",
    title: "HIHGHLIGHTS",
    coins: "x 99",
    dollars: "x 199",
    rock1:"x r1a",
    rock2:"x r2a",
    rock3:"x r3a",

    bronze:"x bz1",
    bronzeShoe:"x shosf dskl fjdskgrie",

    nitro:"x nita",
    petro:"x p1a",
    itemQtyCurrent: 0,
    itemQtyTotal:100,
    options: rewardOpts,

    checkLatestMarketPrices:true,
    checkRemoteCostPrices:true,
    showStockQty:true,
    contract:"0x83d431a9a5084bf26ef4e1081e26fbe90798aa3a",
    itemId:"0",
    uiDisplayType:"claim-raffle",
    
  });

  //for testing make it pop on start, dont want that normally
  //claimRewardPrompt20.show()
  
  //REGISTRY.ui.inventoryPrompt = claimPrompt;


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

  REGISTRY.ui.openClaimRewardPrompt = openClaimRewardPrompt;
  REGISTRY.ui.hideClaimRewardPrompt = hideClaimRewardPrompt;
  REGISTRY.ui.updateRewardPrompt = updateRewardPrompt;

}