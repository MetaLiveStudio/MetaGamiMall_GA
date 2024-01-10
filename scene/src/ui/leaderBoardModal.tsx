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
import { applyButtonStyle, applyCustomOptionsPanel, CUSTOM_ATLAS, CUSTOM_DELAY_MS, CustomOkPrompt, CustomPromptOptions, Modal, OPTION_PROMPT_DEFAULT_HEIGHT, OPTION_PROMPT_DEFAULT_WIDTH, SCALE_FONT_TITLE, updateCloseBtnPosition } from './modals'
import { REGISTRY } from '../registry'
import { PromptButtonExt } from './ext/PromptButtonExt'
import { AbstractBaseGridPrompt, CustomGridTextRow, CustomGridTextRowData } from './gridModalUtils'
import { createLeaderBoardPanelText, ILeaderboardItem, PlayerLeaderboardEntryType } from '../gamimall/leaderboard-utils'


export class LeaderBoardPrompt extends CustomOkPrompt implements ILeaderboardItem{
  playerEntries?: PlayerLeaderboardEntryType[];
  currentPlayer?: PlayerLeaderboardEntryType;
  formatterCallback?: (text: string|number) => string;
  startIndex:number = 0;
  pageSize:number = CONFIG.GAME_LEADEBOARD_2DUI_MAX_RESULTS
  nextBtn: PromptButtonExt;
  prevBtn: PromptButtonExt;
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
        if(this.playerEntries && this.startIndex + this.pageSize < this.playerEntries.length){
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
    
    this.applyUIScaling()
  }

  applyUIScaling(){ 
    applyButtonStyle(this.nextBtn)
    applyButtonStyle(this.prevBtn)
    //TODO ADD BACK
    
    //nextBtn.label.width = 40
    //prevBtn.label.width = 40


    //nextBtn.image.width = 40
    //prevBtn.image.width = 40
    //nextBtn.image.height = 35
    //prevBtn.image.height = 35
      
    this.title.yPosition = 90
    this.title.xPosition = 70

    this.text.size = 14
    this.text.yPosition = 70
    this.text.xPosition = -130 + 20
    this.text.textElement.textAlign = "top-left"//"top-center"
    
    this.button.yPosition = -240
    
    setButtonDim(this.prevBtn,40,35)
    setButtonDim(this.nextBtn,40,35)

    this.prevBtn.yPosition = -50
    this.nextBtn.yPosition = -50

    this.prevBtn.xPosition = -250
    this.nextBtn.xPosition = 110

    updateCloseBtnPosition( this.prompt, 100)
  }

  setPlayerEntries(arr: PlayerLeaderboardEntryType[]) {
    this.startIndex = 0
    this.playerEntries = arr;
  }
  setCurrentPlayer(arr: PlayerLeaderboardEntryType) {
    this.currentPlayer = arr;
  }
 
  updateUI(): void {
    this.text.value = createLeaderBoardPanelText(this,this.startIndex,this.pageSize,this.formatterCallback)
  }
  
  setFormatterCallback(callback: (text: string|number) => string): void {
    this.formatterCallback = callback
  }
  
}


