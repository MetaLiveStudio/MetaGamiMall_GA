import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { CornerLabel } from 'dcl-ui-toolkit'
import { PromptButton } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Button'
//import { EntityPropTypes } from '@dcl/react-ecs/dist/components/types'
//import { UiLabelProps } from '@dcl/react-ecs/dist/components/Label/types'
//import { CornerLabel } from '@dcl/ui-scene-utils'

//import { UIObject, UIObjectConfig } from '../UIObject'

//import { defaultFont } from '../../constants/font'

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
export class MenuPromptButton extends PromptButton {
  show(){
    super.show()
    //overloading contructor was not easi y -added side affect so not called a lot
    //this.textElement.textAlign = 'bottom-center'
  }
  /*public render(key?: string): ReactEcs.JSX.Element {
    return (
      <Label
        key={key}
        {...this.textElement}
        color={this.color}
        fontSize={this.size}
        value={String((this as any)._value)}
        uiTransform={{
          ...this.textElement.uiTransform,
          display: this.visible ? 'flex' : 'none',
          position: { bottom: this.yOffset, left: "50%" },
        }}
      />
    )
  }*/
}