import {
  engine,
  Transform,
} from '@dcl/sdk/ecs'
import * as ui from 'dcl-ui-toolkit'
import { Color4 } from '@dcl/sdk/math'
//PER VLM, since they call it DCLs ReactEcsRenderer, we have to use theirs now
//started with version 1.0.0-alpha.11 and higher. 1.0.0-alpha.10 did not have issue
//this is a house of cards but fastest path forward
import {  ReactEcsRenderer } from '@dcl/sdk/react-ecs'
//using vlms react renderer per workaround
//import {ReactEcsRenderer} from  'vlm-dcl'
import * as modals from './ui/modals'
import * as uiBGModals from './ui/ui_background'
import * as inventoryModal from './ui/inventoryModals'
import * as claimModal from './ui/claimModals'

import { setupUiInfoEngine } from './ui/ui_engineInfo'
import { initUILoginGame } from './gamimall/ui-login-game'
import { initBuyUIPrompt } from './store/blockchain'
import { initRewardPrompts } from './ui/rewardPrompts'
import { createDebugUIButtons } from './ui/ui-hud-debugger'
import { UiComponent } from '@dcl/sdk/react-ecs'

//import VLM from 'vlm-dcl'

 
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
  createDebugUIButtons()

  //workaround to get 7.5.0 to compile HOWEVER 7.5.0 seems to have backwards breaking 2dUI issues
  //ReactEcsRenderer.setUiRenderer((uiComponent as any) as UiComponent)
  //https://discord.com/channels/417796904760639509/1047643035833479230/1243021139521962044
  //pinning to 7.4.21 for now till hear back / can fix issues introduced in 7.5.0
  ReactEcsRenderer.setUiRenderer(uiComponent)
}