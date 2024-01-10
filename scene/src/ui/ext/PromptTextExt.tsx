import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { CornerLabel } from 'dcl-ui-toolkit'
import { Prompt } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt'
import { PromptButton } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Button'
import { getImageAtlasMapping } from 'dcl-ui-toolkit/dist/utils/imageUtils'
import { ExtIPrompt, ExtIPromptButton } from '../extDclUiToolkit'
import { PromptText, PromptTextConfig } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Text'
import { Color4 } from '@dcl/sdk/math'
//import { EntityPropTypes } from '@dcl/react-ecs/dist/components/types'
//import { UiLabelProps } from '@dcl/react-ecs/dist/components/Label/types'
//import { CornerLabel } from '@dcl/ui-scene-utils'

//import { UIObject, UIObjectConfig } from '../UIObject'

//import { defaultFont } from '../../constants/font'

const promptTextInitialConfig: Omit<Required<PromptTextConfig>, 'parent'> = {
    startHidden: false,
    value: '',
    xPosition: 0,
    yPosition: 0,
    color: Color4.Black(),
    size: 15,
  } as const
/**
 * Prompt text
 * @param {boolean} [startHidden=false] starting hidden
 * @param {string | number} [value=''] starting value
 * @param {number} [xPosition=0] Position on X on the prompt, counting from the center of the prompt
 * @param {number} [yPosition=0] Position on Y on the prompt, counting from the center of the prompt
 * @param {boolean} [darkTheme=false] prompt color style
 * @param {Color4} [color=Color4.Black()] text color
 * @param {number} [size=15] text size
 *
 * //https://github.com/decentraland-scenes/dcl-ui-toolkit/blob/main/src/ui-entities/prompts/Prompt/components/Text/index.tsx
 */
export class PromptTextExt extends PromptText {
    public render(key?: string): ReactEcs.JSX.Element {
        return (
          /*<UiEntity
             uiTransform={{
                width:200, height:100, display: 'flex'
                ,positionType: 'absolute'
                ,position: { top: '50%', left: '50%' },
                margin: { left: this.xPosition, top: this.yPosition * -1 },
              }}
             uiBackground={{
              color:Color4.Black()
            }}
            uiText={{value:"sdfs"}}
             >*/
              <Label
                key={key}
                {...this.textElement}
                //textAlign= 'middle-left'

                value={String(this.value)}
                color={this.color || (this.isDarkTheme ? Color4.White() : promptTextInitialConfig.color)}
                fontSize={this.size}
                uiTransform={{
                  ...this.textElement.uiTransform,
                  //maxWidth: '100%',
                  //minWidth: 400,
                  //positionType: 'absolute',
                  //position: { top: '50%', left: '50%' },

                  display: this.visible ? 'flex' : 'none',
                  margin: { left: this.xPosition, top: this.yPosition * -1 },
                }}
                //uiBackground={{ color:Color4.Black()} }
              />
          /*</UiEntity>*/
        )
      }
}