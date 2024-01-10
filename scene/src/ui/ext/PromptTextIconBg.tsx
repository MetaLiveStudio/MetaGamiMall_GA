import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { CornerLabel } from 'dcl-ui-toolkit'
import { Prompt } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt'
import { PromptButton } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Button'
import { getImageAtlasMapping } from 'dcl-ui-toolkit/dist/utils/imageUtils'
import { ExtIPrompt, ExtIPromptButton } from '../extDclUiToolkit'
import { PromptButtonExt } from './PromptButtonExt'
//import { EntityPropTypes } from '@dcl/react-ecs/dist/components/types'
//import { UiLabelProps } from '@dcl/react-ecs/dist/components/Label/types'
//import { CornerLabel } from '@dcl/ui-scene-utils'

//import { UIObject, UIObjectConfig } from '../UIObject'

//import { defaultFont } from '../../constants/font'

/**
 * Prompt image text icon bg reusable
 * @param {boolean} [startHidden=false] starting hidden
 * @param {string | number} [text=''] label text
 * @param {number} [xPosition=0] Position on X on the prompt, counting from the center of the prompt
 * @param {number} [yPosition=0] Position on Y on the prompt, counting from the center of the prompt
 * @param {Callback} [onMouseDown=0] click action
 * @param {PromptButtonStyles} [style=CloseIconStyles.ROUNDSILVER] visible variant
 *
 */
export class PromptTextIconBg extends PromptButtonExt {
  
}