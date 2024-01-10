import ReactEcs, { Button, EntityPropTypes, Label, Position, PositionShorthand, ReactEcsRenderer, UiEntity, UiLabelProps } from '@dcl/sdk/react-ecs'

import { Prompt } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt'
import { PromptButton } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Button'
import { getImageAtlasMapping } from 'dcl-ui-toolkit/dist/utils/imageUtils'
import { ExtIPrompt, ExtIPromptButton, setButtonIconPos } from '../extDclUiToolkit'
//import { EntityPropTypes } from '@dcl/react-ecs/dist/components/types'
//import { UiLabelProps } from '@dcl/react-ecs/dist/components/Label/types'
//import { CornerLabel } from '@dcl/ui-scene-utils'

//import { UIObject, UIObjectConfig } from '../UIObject'

//import { defaultFont } from '../../constants/font'

//TODO make sharable
type PromptButtonLabelElementProps = EntityPropTypes & Omit<UiLabelProps, 'value' | 'uiTransform'>&{
  uiTransform?: Omit<NonNullable<EntityPropTypes['uiTransform']>, 'margin'>;
};;

/**
 * Prompt button
 * @param {boolean} [startHidden=false] starting hidden
 * @param {string | number} [text=''] label text
 * @param {number} [xPosition=0] Position on X on the prompt, counting from the center of the prompt
 * @param {number} [yPosition=0] Position on Y on the prompt, counting from the center of the prompt
 * @param {Callback} [onMouseDown=0] click action
 * @param {PromptButtonStyles} [style=CloseIconStyles.ROUNDSILVER] visible variant
 *
 */ 
export class PromptButtonExt extends PromptButton {
  _buttonIconPosY?:number
  _hideIconWhenDisabled:boolean = true //default to true , its how parent PromptButton works but allow override
  
  subText:string
  subTextElement:PromptButtonLabelElementProps = {
    textAlign:'bottom-center',
    uiTransform:{
      //margin:{top:0,left:"-50%"},
      display:"none",
      positionType: 'absolute',
      position: { 
        top: 40//this._buttonIconPosY ? this._buttonIconPosY : -26 / 2
        //,left: _btnExt._buttonIconPos(String(this.text).length) - 26 / 2 
      }
    }
  }
  show(){
    super.show()

    //overloading contructor was not easi y -added side affect so not called a lot
    //this.textElement.textAlign = 'bottom-center'
  }
  setSubTextVisible(b:boolean){
    if(this.subTextElement.uiTransform) {
      this.subTextElement.uiTransform.display = b ? 'flex' : 'none'
    }
  }

  setTextPosition(pos:Partial<Position>){
    if(!this.labelElement.uiTransform){
      this.labelElement.uiTransform = {}
    }
    if(this.labelElement.uiTransform ) {
      this.labelElement.uiTransform.position = pos
    }
  }
  setIconPos(xpos?:number,ypos?:number){
    setButtonIconPos(this,xpos,ypos)
  }
  setSubTextPosition(pos:Partial<Position>){
    if(this.subTextElement.uiTransform && this.subTextElement.uiTransform.position) {
      this.subTextElement.uiTransform.position = pos
    }
  }
  public render(key?: string): ReactEcs.JSX.Element {
    
    //workaround to keep compiler happy
    const _btnExt = (this as unknown) as ExtIPromptButton

    //https://github.com/decentraland-scenes/dcl-ui-toolkit/blob/main/src/ui-entities/prompts/Prompt/components/Button/index.tsx
    _btnExt._xPosition = this.promptWidth / -2 + _btnExt._width / 2 + this.xPosition
    _btnExt._yPosition = this.promptHeight / 2 + _btnExt._height / -2 + this.yPosition

    return (
      <UiEntity
        key={key}
        {...this.imageElement}
        uiTransform={{
          ...this.imageElement.uiTransform,
          display: this.visible ? 'flex' : 'none',
          position: { bottom: _btnExt._yPosition, right: _btnExt._xPosition * -1 },
        }}
        onMouseDown={() => {
          console.log('prompt button onMouseDown_________________')
          _btnExt._click()
        }}
      >
        <UiEntity
          {...this.iconElement}
          uiTransform={{
            ...this.iconElement.uiTransform,
            display: this._hideIconWhenDisabled &&( _btnExt._disabled || (!_btnExt._isEStyle && !_btnExt._isFStyle)) ? 'none' : 'flex',
            margin: {
              top: this._buttonIconPosY ? this._buttonIconPosY : -26 / 2,
              left: _btnExt._buttonIconPos(String(this.text).length) - 26 / 2,
            },
          }}
        />
        <Label
          {...this.labelElement}
          value={String(this.text)}
          color={
            _btnExt._disabled ? _btnExt._labelDisabledColor : this.labelElement.color || _btnExt._labelColor
          }
        />
        <Label 
          {...this.subTextElement}
          value={String(this.subText)}
          color={
            _btnExt._disabled ? _btnExt._labelDisabledColor : this.labelElement.color || _btnExt._labelColor
          }
          uiTransform={{
            ...this.subTextElement.uiTransform
          }}
        />
      </UiEntity>
    )
  }

}