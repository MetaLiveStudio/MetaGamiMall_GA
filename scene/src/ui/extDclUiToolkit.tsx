import { Color4 } from '@dcl/sdk/math'
import * as ui from 'dcl-ui-toolkit'
import { Prompt } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt'
import { IPrompt } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/IPrompt'
import { PromptButton, PromptButtonIconElementProps, PromptButtonImageElementProps, PromptButtonStyles } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Button'
import { PromptCheckbox } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Checkbox'
import { PromptCloseIcon } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/CloseIcon'
import { PromptIcon } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Icon'
import { PromptInput } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Input'
import { PromptSwitch } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Switch'
import { PromptText } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Text'
import { ImageAtlasData, getImageAtlasMapping } from 'dcl-ui-toolkit/dist/utils/imageUtils'
import { PromptButtonExt } from './ext/PromptButtonExt'
import { TextAlignType,PositionShorthand } from '@dcl/react-ecs'
import { PromptTextIconBg } from './ext/PromptTextIconBg'
import { PromptTextExt } from './ext/PromptTextExt'
/**
 * expose the internal private methods for quick non standard manipulation
 */
export type ExtIPrompt = IPrompt & { 
  _texture: string
  _section: ImageAtlasData
  _components: (
      | PromptCloseIcon
      | PromptText
      | PromptIcon
      | PromptButton
      | PromptCheckbox
      | PromptSwitch
      | PromptInput
  )[] 
  _getPromptComponentCustomConfig(): any
}
/**
 * expose the internal private methods for quick non standard manipulation
 * https://github.com/decentraland-scenes/dcl-ui-toolkit/blob/main/src/ui-entities/prompts/Prompt/components/Button/index.tsx
 */
export type ExtIPromptButton = { 
   _xPosition: number | undefined
   _yPosition: number | undefined
    _width: number
    _height: number
   _disabled: boolean
    _labelColor: Color4
    _labelDisabledColor: Color4
    _style: PromptButtonStyles
    _isEStyle: boolean
    _isFStyle: boolean
    _click : ()=> void 
    _buttonIconPos(textLen: number): number
   //_buttonSystemInputAction: SystemInputActions | undefined 
}
export function setSelection(uielem:Prompt|PromptButton,_section: ImageAtlasData){
  const ext = (uielem as unknown) as ExtIPrompt
  ext._section = _section
}
export function setSelectionUv(uielem:PromptButtonImageElementProps|PromptButtonIconElementProps,_section: ImageAtlasData){
  if(uielem.uiBackground) uielem.uiBackground.uvs = getImageAtlasMapping( _section )
}

export function setBackgroundSrcNTexture(uielem:PromptIcon,src:string){
  if(uielem) uielem.image = src
  setBackgroundTexture(uielem.imageElement,src)
}
export function setBackgroundTexture(uielem:PromptButtonImageElementProps|PromptButtonIconElementProps,src:string){
  if(uielem.uiBackground?.texture) uielem.uiBackground.texture.src = src
}
export function setImageElementDim(uielem:PromptButtonImageElementProps|PromptButtonIconElementProps,width:number,height:number){
  if(uielem.uiTransform){
    uielem.uiTransform.width = width
    uielem.uiTransform.height = height
  }
}
//export function syncCloseIconWithPrompt(prompt:Prompt){
  //const ext = (uielem as unknown) as ExtIPrompt
  //if(prompt.width) prompt.closeIcon.xPosition = prompt.width/2
  //if(prompt.height) prompt.closeIcon.yPosition = prompt.height/2
//}
export function setButtonDim(button: PromptButton,width:number,height:number) {
  //TODO adjust text, icon + image???
  setImageElementDim(button.imageElement,width,height)
}
export function setButtonLabelDisableColor(button: PromptButton,color:Color4) {
  const mnuAnyExt = (button as unknown) as ExtIPromptButton
  mnuAnyExt._labelDisabledColor = color
}
export function setButtonLabelPos(menuPanel: PromptButton,textAlign?:TextAlignType,xpos?:number,ypos?:number) {
  const mnuAny = ((menuPanel as unknown) as ExtIPromptButton)
  const mnuAnyExt = ((menuPanel as unknown) as PromptButtonExt)
  //workaround to positioning the label
  //https://github.com/decentraland-scenes/dcl-ui-toolkit/blob/main/src/ui-entities/prompts/Prompt/components/Button/index.tsx#L248
  
  if(textAlign){
    mnuAnyExt.labelElement.textAlign = textAlign
  } 
  if(mnuAnyExt.labelElement.uiTransform){
    if(xpos || ypos) {
      mnuAnyExt.labelElement.uiTransform.position = {left:xpos,top:ypos}
    }
  }
}
export function setButtonIconPos(menuPanel: PromptButton,xpos?:number,ypos?:number) {
  const mnuAny = ((menuPanel as unknown) as ExtIPromptButton)
  const mnuAnyExt = ((menuPanel as unknown) as PromptButtonExt)
  //workaround to positioning the icon
  //https://github.com/decentraland-scenes/dcl-ui-toolkit/blob/main/src/ui-entities/prompts/Prompt/components/Button/index.tsx#L248
  //TODO we need to fully redefine the button render method to make this work
  if(xpos !== undefined){
    mnuAny._buttonIconPos = ()=>{
      return xpos 
    }
  }
  mnuAnyExt._buttonIconPosY = ypos
}

//workaround to disable key listener but still let it do show/hide
export function clearButtonSystemInputListener(menuPanel: PromptButton) {
  const mnuAny = ((menuPanel as any))
      //mnuAny._isFStyle = false
    const origShow = menuPanel.show
    mnuAny.origShow = origShow
    const myfn = function(){  
      mnuAny.origShow(); 
      //clear it each time show is called
      mnuAny._clearSystemInputAction()  
    }
    menuPanel.show = myfn

    //clear it for this time
    mnuAny._clearSystemInputAction() 
    
}


export class PromptWrapper<T extends Prompt>  implements IPrompt {
  
  _prompt: T
  private _promptExt: ExtIPrompt
  //using getter/setters
  private _scaling:number = 1

  constructor(prompt: T) {
    this._prompt = prompt
    this._promptExt = (prompt as unknown) as ExtIPrompt

    this._prompt.realWidth = ()=>{return this.realWidth()}//.bind(this)
    this._prompt.realHeight = ()=>{return this.realHeight()}//.bind(this)
    //this._prompt.realHeight = this.realHeight//
  }
  realWidth(): number {
    ///return this._prompt.realWidth() * this.scaling
    return (this._prompt.width ? this._prompt.width : this._promptExt._section.sourceWidth) * this._scaling
  }
  realHeight(): number {
    //return this._prompt.realHeight() * this.scaling
    return (this._prompt.height ? this._prompt.height : this._promptExt._section.sourceHeight) * this._scaling
  }
  isVisible(): boolean {
    return this._prompt.isVisible()
  }
  _getPromptComponentCustomConfig() {
    return this._promptExt._getPromptComponentCustomConfig()
  }
  //https://github.com/decentraland-scenes/dcl-ui-toolkit/blob/main/src/ui-entities/prompts/Prompt/components/Icon/index.tsx
  addIcon(image: string, xPosition: number, yPosition: number, width:number, height:number, section: ImageAtlasData): PromptIcon {
    return this._prompt.addIcon(
      {
        image,
        xPosition: xPosition,
        yPosition: yPosition,
        width: width,
        height: height,
        section: section
      }
    )
  }
  
  addText(title: string, xPosition: number, yPosition: number, color: Color4, fontSize: number): PromptTextExt {
    const uiText = new PromptTextExt({
      ...{
        value: title,
        xPosition: xPosition,
        yPosition: yPosition,
        color: color,
        size: fontSize
      },
      ...this._getPromptComponentCustomConfig(),
    })

    this._promptExt._components.push(uiText)

    return uiText
  }
  
  addTextImgBg(text: string, xPosition: number, yPosition: number, onMouseDown: () => void, style: ui.ButtonStyles): PromptTextIconBg {
    const uiButton = new PromptTextIconBg({
      ...{
        text: text,
        xPosition: xPosition,
        yPosition: yPosition,
        onMouseDown: onMouseDown,
        style: style
      },
      ...this._getPromptComponentCustomConfig(),
    })

    this._promptExt._components.push(uiButton)

    return uiButton
  } 
  addButton(text: string, xPosition: number, yPosition: number, onMouseDown: () => void, style: ui.ButtonStyles): PromptButtonExt {
    const uiButton = new PromptButtonExt({
      ...{
        text: text,
        xPosition: xPosition,
        yPosition: yPosition,
        onMouseDown: onMouseDown,
        style: style
      },
      ...this._getPromptComponentCustomConfig(),
    })

    this._promptExt._components.push(uiButton)

    return uiButton
  } 
  setTexture(texture: string) {
    this._promptExt._texture = texture
  }
  setSelection(_section: ImageAtlasData) {
    setSelection(this._prompt,_section)
    //this._promptExt._section = _section
  }
  removeCloseIcon(){
    //TODO remove the close icon
    this._prompt.closeIcon.hide()
  }
  getSelection() {
    return this._promptExt._section
  }
  show(){
    this._prompt.show()
  }
  hide(){
    this._prompt.hide()
  }
  set scaling(scaling: number) {
    this._scaling = scaling
  }
  get scaling() {
    return this._scaling
  }
  get isDarkTheme(): boolean {
    return this._prompt.isDarkTheme
  }
}
