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
import { AbstractBaseGridPrompt, CustomGridTextRow, CustomGridTextRowData } from './gridModalUtils'

export const custUiAtlasInventory = "images/ui/Inventory.png"

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
 
      this.initGrid({rowXPos:-75,rowYPos:70})

      this.text.value = ""
      this.title.value = ""
      //TODO FIX POSITIONING
      //this.text.text.positionY = -100

      
      ////this.prompt.closeIcon.positionX = "41%";
      ////this.prompt.closeIcon.positionY = "22%";

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

          const btn = this.prompt.addTextImgBg(
            x+"",
            rowXOffset + rowXPos,
            rowYPos,
            () => {
              
            },
            ui.ButtonStyles.E //needed for icon
          ) 
          clearButtonSystemInputListener(btn)
          const scaleDown = .7

          setButtonDim(btn,containerWidth,containerHeight)
          setButtonIconPos(btn,-4,-20)
          setButtonLabelPos(btn,'bottom-right',undefined,3)
          btn.labelElement.fontSize = fontSize
          
          //btn.labelElement.font = UIfont
          setImageElementDim(btn.iconElement,containerWidth * scaleDown,containerHeight * scaleDown)
          setBackgroundTexture(btn.iconElement,CUSTOM_ATLAS)
          setBackgroundTexture(btn.imageElement,custUiAtlasInventory)
          setSelectionUv(btn.imageElement, atlas_mappings.icons.inventoryItemSlot)
          //setButtonIcon(btn,atlas_mappings.icons.coin)
          //TODO MAKE GRID
          /*
          
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

          setSelectionUv(itemBg, atlas_mappings.icons.inventoryItemSlot);
 
          const scaleDown = .9
          //const imgTexture = rewardImage !== undefined && rewardImage.length > 0 ? new Texture(rewardImage) : defaultRewardIcon
          const itemImage = new UIImage(container, CUSTOM_ATLAS)
          itemImage.width = containerWidth * scaleDown
          itemImage.height = containerHeight * scaleDown
          itemImage.hAlign = "center"
          itemImage.vAlign = "center"
          itemImage.positionX = (containerWidth * (1-scaleDown)) + IMAGE_SHIFT_X
          //itemImage.positionY = (containerHeight * (1-scaleDown)) //+ IMAGE_SHIFT_X

          setSelectionUv(itemImage, atlas_mappings.icons.coin);

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
    
          
          */
          this.textGrid.push(new CustomGridTextRow(btn)); 
          //rowYPos -= rowYHeight;
          rowXPos += rowXWidth + spacing
        }
        rowYPos -= rowYHeight + spacing
        
      }
  
      this.updateGrid();
  
    }
    isVisibile(){
      return this.prompt.isVisible()
    }
    updateGrid() {
      const arr: CustomGridTextRowData[] = [
        this.coins,
        this.coinsEarned,
        this.bronze,
        this.bronzeShoe,
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
        this.coinBagRaffleRedeem,
        this.coinBagRaffleStat,
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
/*
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
*/
const BUTTON_HEIGHT = 60
function applyInventoryPanel(
  modal: PromptWrapper<Prompt>,
  button?: PromptButton,
  options?: CustomPromptOptions
) {
  applyCustomOptionsPanel(modal,button,undefined,options)
  if (button) {
    button.xPosition = 0
  }
  modal.setTexture(custUiAtlasInventory)
  //modal.background.source = custUiAtlasInventory

  //modal.set
  
  modal.setSelection({
    ...{
      sourceLeft : 30,
      sourceWidth : 1200,
      sourceTop : 30,
      sourceHeight : 735,
    },
    atlasHeight: atlas_mappings.atlasData.inventory.atlasHeight, 
    atlasWidth: atlas_mappings.atlasData.inventory.atlasWidth
  })
  /*
  //TODO UPDATE BACKGROUND SOURCE VALUES
  button.image.positionX = 0

  button.image.height = BUTTON_HEIGHT
  */
  //    raffleGamePrompt.buttonSecondaryBtn.image.height = BUTTON_HEIGHT

  //then fix
}
/*
function applyLevelUpPanel(
  modal: PromptWrapper<Prompt>,
  button?: PromptButton,
  options?: CustomPromptOptions
) {
  if (CUSTOM_ATLAS !== undefined) {
    modal.background.source = CommonResources.RESOURCES.textures.avatarswap04

    modal.background.height =
      options && options.height
        ? options && options.height
        : CLAIM_PROMPT_RAFFLE_HEIGHT;
    modal.background.width =
      options && options.width
        ? options && options.width
        : CLAIM_PROMPT_RAFFLE_WIDTH;

        
    modal.setSelection(atlas_mappings.backgrounds.levelUp)
    //setSelectionUv(modal.background,atlas_mappings.backgrounds.levelUp)
    
    modal.closeIcon.positionX = "41%";
    modal.closeIcon.positionY = "22%";

    if (button) {
      button.image.source = CUSTOM_ATLAS;
      button.image.positionY = "-55%";
      button.image.positionX = "0";
      button.image.sourceLeft = 2035;//TODO move to atlas_mappings and use setSelectionUv
      button.image.sourceWidth = 400;
      button.image.sourceTop = 2393;
      button.image.sourceHeight = 215;
      button.image.width = "35%";
      button.image.height = "15%";
    }
    if (modal instanceof ui.CustomPrompt) {
      modal.texture = CUSTOM_ATLAS;
    }
  }
}*/
export function initInventoryModel(){
  const inventoryPrompt = new InventoryPrompt("Inventory","inventory text","OK",()=>{
    log("ok clicked")
  })

  inventoryPrompt.updateCoins("1000000")
  inventoryPrompt.updateDollar("3")
  

  inventoryPrompt.updateMaterial1("4")
  inventoryPrompt.updateMaterial2("5")
  inventoryPrompt.updateMaterial3("6")

  inventoryPrompt.updateRock1("11")
  inventoryPrompt.updateRock2("12")
  inventoryPrompt.updateRock3("13")

  inventoryPrompt.updateBronze("14bz")
  inventoryPrompt.updateBronzeShoe("shoe")

  inventoryPrompt.updateNitro("14n")
  inventoryPrompt.updatePetro("15")

  //for testing make it pop on start, dont want that normally
  //inventoryPrompt.show()
  
  REGISTRY.ui.inventoryPrompt = inventoryPrompt;
}
