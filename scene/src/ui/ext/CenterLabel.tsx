import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { CornerLabel } from 'dcl-ui-toolkit'
//import { EntityPropTypes } from '@dcl/react-ecs/dist/components/types'
//import { UiLabelProps } from '@dcl/react-ecs/dist/components/Label/types'
//import { CornerLabel } from '@dcl/ui-scene-utils'

//import { UIObject, UIObjectConfig } from '../UIObject'

//import { defaultFont } from '../../constants/font'

/**
 * Displays a text on center of the UI.
 *
 * @param {boolean} [startHidden=true] starting hidden
 * @param {string | number} [value=''] starting value
 * @param {number} [xOffset=-40] offset on X
 * @param {number} [yOffset=70] offset on Y
 * @param {Color4} [color=Color4.White()] text color
 * @param {number} [size=25] text size
 *
 */
export class CenterLabel extends CornerLabel {
  show(){
    super.show()
    //overloading contructor was not easi y -added side affect so not called a lot
    this.textElement.textAlign = 'bottom-center'
  }
  public render(key?: string): ReactEcs.JSX.Element {
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
  }
}