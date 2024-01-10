import ReactEcs, { Button, Label, PositionShorthand, PositionUnit, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { CornerLabel } from 'dcl-ui-toolkit'
import { Prompt } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt'
import { PromptButton } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Button'
import { getImageAtlasMapping } from 'dcl-ui-toolkit/dist/utils/imageUtils'
import { ExtIPrompt } from '../extDclUiToolkit'
import { Position } from '~system/EngineApi'
//import { EntityPropTypes } from '@dcl/react-ecs/dist/components/types'
//import { UiLabelProps } from '@dcl/react-ecs/dist/components/Label/types'
//import { CornerLabel } from '@dcl/ui-scene-utils'

//import { UIObject, UIObjectConfig } from '../UIObject'

//import { defaultFont } from '../../constants/font'

/**
 * Creates a prompt object that includes a background and a close icon, and supports adding as many custom UI elements as desired
 * @param {boolean} [startHidden=true] starting hidden
 * @param {PromptStyles} [style=PromptStyles.LIGHT]: pick from a few predefined options of color, shape and size, or provide the string path to a custom image
 * @param {number} width background width
 * @param {number} height background height
 * @param {Callback} onClose callback on prompt close
 *
 */
export class PromptExt extends Prompt {
  _hAlignment:"center"|"right" = "center"
  _vAlignment:"center"|"top" = "center"
  _marginTop:number = 0
  _marginLeft:number = 0

  _posTop:PositionUnit = "50%"
  
  
  show(){
    super.show()
    //overloading contructor was not easi y -added side affect so not called a lot
    //this.textElement.textAlign = 'bottom-center'
  }
  
  setPositionTop(posTop:PositionUnit){
    this._posTop = posTop
  }

  public render(key?: string): ReactEcs.JSX.Element {
    const width = this.realWidth()
    const height = this.realHeight()

    //workaround to keep compiler happy
    const _promptExt = (this as unknown) as ExtIPrompt

    const posLeft = this._hAlignment == 'center' ? "50%" : '100%'
    const posTop = this._vAlignment == 'center' ? this._posTop : '0%'
    return ( 
      <UiEntity
        key={key}
        uiTransform={{
          display: this.visible ? 'flex' : 'none',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          positionType: 'absolute',
          position: { top: posTop, left: posLeft },
          margin: { top: (-height /  (this._vAlignment == 'center' ? 2 : 2)) + this._marginTop, left: (-width / (this._hAlignment == 'center' ? 2 : 1)) + this._marginLeft },
          width,
          height,
        }}
      >
        <UiEntity
          uiTransform={{
            positionType: 'absolute',
            position: { top: 0, left: 0 },
            width: '100%',
            height: '100%',
          }}
          uiBackground={{
            textureMode: 'stretch',
            texture: {
              src: _promptExt._texture,
            },
            uvs: getImageAtlasMapping(_promptExt._section),
          }}
        />
        {this.visible &&
          _promptExt._components.map((component, idx) => component.render(`prompt-component-${idx}`))}
      </UiEntity>
    )
  }
}