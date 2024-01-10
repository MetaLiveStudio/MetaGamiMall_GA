import {
  engine,
  Transform,
} from '@dcl/sdk/ecs'
import * as ui from 'dcl-ui-toolkit'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'

import * as modals from './ui/modals'
import * as uiBGModals from './ui/ui_background'
import * as inventoryModal from './ui/inventoryModals'
import * as claimModal from './ui/claimModals'

import { setupUiInfoEngine } from './ui/ui_engineInfo'
import { initUILoginGame } from './gamimall/ui-login-game'
import { initBuyUIPrompt } from './store/blockchain'
import { initRewardPrompts } from './ui/rewardPrompts'


 
function getPlayerPosition() {
  const playerPosition = Transform.getOrNull(engine.PlayerEntity)
  if (!playerPosition) return ' no data yet'
  const { x, y, z } = playerPosition.position
  return `{X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, z: ${z.toFixed(2)} }`
}

const uiComponent = () => [
  //uiComponentDemo    
  ui.render()
]

export function setupUi() {
  setupUiInfoEngine()
  modals.initModals()
  uiBGModals.initUIBGModals()
  inventoryModal.initInventoryModel()
  claimModal.initClaimModel()
  initUILoginGame()
  initBuyUIPrompt()
  initRewardPrompts()
  ReactEcsRenderer.setUiRenderer(uiComponent)
}