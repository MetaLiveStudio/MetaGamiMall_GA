import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { CornerLabel, MediumIcon } from 'dcl-ui-toolkit'
import { getImageAtlasMapping } from 'dcl-ui-toolkit/dist/utils/imageUtils'
//import { EntityPropTypes } from '@dcl/react-ecs/dist/components/types'
//import { UiLabelProps } from '@dcl/react-ecs/dist/components/Label/types'
//import { CornerLabel } from '@dcl/ui-scene-utils'

//import { UIObject, UIObjectConfig } from '../UIObject'

//import { defaultFont } from '../../constants/font'

/**
 * Displays an icon in the bottom-left corner.
 *
 * @param {boolean} [startHidden=true] starting hidden
 * @param {string} image path to image file
 * @param {number} [width=128] image width
 * @param {number} [height=128] image height
 * @param {number} [xOffset=0] offset on X
 * @param {number} [yOffset=0] offset on Y
 * @param {ImageAtlasData} section cut out a section of the image, as an object specifying atlasWidth, atlasHeight, sourceLeft, sourceTop, sourceWidth and sourceHeight
 *
 */
export class MediumCenterIcon extends MediumIcon {
  show(){
    super.show()
    //overloading contructor was not easi y -added side affect so not called a lot
    //this.imageElement.textAlign = 'bottom-center'
  }
  public render(key?: string): ReactEcs.JSX.Element {
    return (
        <UiEntity
          key={key}
          {...this.imageElement}
          uiBackground={{
            ...this.imageElement.uiBackground,
            texture: {
              src: this.image,
            },
            uvs: getImageAtlasMapping(this.section),
          }}
          uiTransform={{
            ...this.imageElement.uiTransform,
            width: this.width,
            height: this.height,
            display: this.visible ? 'flex' : 'none',
            position: { bottom: this.yOffset, left: this.xOffset },
          }}
        />
      )
  }
}