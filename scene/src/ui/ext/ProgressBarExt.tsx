import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { CornerLabel } from 'dcl-ui-toolkit'
import { Prompt } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt'
import { PromptButton } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Button'
import { getImageAtlasMapping } from 'dcl-ui-toolkit/dist/utils/imageUtils'
import { ExtIPrompt } from '../extDclUiToolkit'
import { BarStyles, ProgressBar } from 'dcl-ui-toolkit/dist/ui-entities/ProgressBar'
import { sourcesComponentsCoordinates } from '../dcl-ui-toolkit-workaround/resources'
import { Color4 } from '@dcl/sdk/math'
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
export class ProgressBarExt extends ProgressBar {
  text:string = ""
  fontColor:Color4 = Color4.White()
  fontSize:number = 20
  height:number = 32
  width:number= 128
  
  public render(key?: string): ReactEcs.JSX.Element {
    const thisAny = this as any
    thisAny._width = this.width * thisAny.scale
    thisAny._height = this.height * thisAny.scale
    //thisAny._height /= 2

    const isNotDefaultBorders =
      thisAny.style === BarStyles.ROUNDWHITE ||
      thisAny.style === BarStyles.ROUNDBLACK ||
      thisAny.style === BarStyles.SQUAREWHITE ||
      thisAny.style === BarStyles.SQUAREBLACK

    thisAny._progressPaddingTop = (isNotDefaultBorders ? 3 : 2) * thisAny.scale
    thisAny._progressPaddingBottom = (isNotDefaultBorders ? 3 : 4) * thisAny.scale
    thisAny._progressPaddingLeft = (isNotDefaultBorders ? 3 : 2) * thisAny.scale
    thisAny._progressPaddingRight = (isNotDefaultBorders ? 3 : 2) * thisAny.scale
    thisAny._progressHeight = thisAny._height - thisAny._progressPaddingTop - thisAny._progressPaddingBottom

    const { sourceWidth: progressSourceWidth, ...progressSourcesComponentsCoordinates } = sourcesComponentsCoordinates.buttons[
      this.style.startsWith('round') ? 'roundWhite' : 'squareWhite'
    ];

    return (
      <UiEntity
        key={key}
        {...this.barElement}
        uiTransform={{
          ...this.barElement.uiTransform,
          display: this.visible ? 'flex' : 'none',
          position: { top: this.yOffset, right: this.xOffset * -1 },
          width: thisAny._width,
          height: thisAny._height,
        }}
      >

        <UiEntity
          {...this.backgroundElement}
          uiBackground={{
            ...this.backgroundElement.uiBackground,
            uvs: getImageAtlasMapping({
              ...sourcesComponentsCoordinates.buttons[this.style],
              atlasHeight: sourcesComponentsCoordinates.atlasHeight,
              atlasWidth: sourcesComponentsCoordinates.atlasWidth,
            }),
          }}
        >

          
        </UiEntity>
        <UiEntity
          {...this.processElement}
          uiTransform={{
            ...this.processElement.uiTransform,
            //positionType: 'absolute',
            width:
              thisAny._width * thisAny._value - thisAny._progressPaddingLeft - thisAny._progressPaddingRight,
            height: thisAny._progressHeight,
            position: {
              top: thisAny._progressPaddingTop,
              left: thisAny._progressPaddingLeft,
            },
          }}
          uiBackground={{
            ...this.processElement.uiBackground,
            color: this.color,
            uvs: getImageAtlasMapping({
              ...progressSourcesComponentsCoordinates,
              sourceWidth: progressSourceWidth * thisAny._value,
              atlasHeight: sourcesComponentsCoordinates.atlasHeight,
              atlasWidth: sourcesComponentsCoordinates.atlasWidth,
            }),
          }}
        >
          
        </UiEntity>
        
        
        <Label
              //CONSIDER PER TO ADD LABEL TO PROGRESS BAR
              //key={key}
              //{...this.textElement}
              color={this.fontColor}
              //fontSize={this.size}
              fontSize={this.fontSize}
              value={this.text}
              uiTransform={{
                //...this.textElement.uiTransform,
                //display: this.visible ? 'flex' : 'none',
                //positionType: 'absolute',
                position: { top: "-10%", left: "-50%" },
              }}
            />
        
      </UiEntity>
    )
  }

}