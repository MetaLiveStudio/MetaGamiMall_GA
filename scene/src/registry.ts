/*import { AudioControlBar } from "./dclconnect/index";
import { CustomPrompt } from "./dcl-scene-ui-workaround/CustomPrompt";
import { GameSceneManager } from "./modules/sceneMgmt/gameSceneManager";
import {
  CustomClaimArgs,
  CustomOkPrompt,
  CustomOptionsPrompt,
  InventoryPrompt,
  LevelUpPrompt,
} from "./ui/modals";
import {
  GameToolsPanel,
  LoginPanel,
  RacePanel,
  StaminaPanel,
} from "./ui/ui_background";
*/
import { IntervalUtil } from "./meta-decentrally/modules/interval-util";

/*
some ugly trickery to get around cyclic dependencies
*/

import { Entity, VideoTexture } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";
import { CustomOkPrompt, CustomOptionsPrompt } from "./ui/modals";
import { GameToolsPanel, StaminaPanel } from "./ui/ui_background";
import { InventoryPrompt } from "./ui/inventoryModals";
import { CustomClaimArgs } from "./ui/claimModals";
import { CustomPrompt } from "dcl-ui-toolkit";
import { LevelUpPrompt } from "./ui/rewardPrompts";
import { AvatarSwap } from "./modules/avatar-swap/arissa";


export class RegistryVideoTexutres {
  secondaryAlternativeScene!: VideoTexture;
  //videoControlBar!: AudioControlBar
}
export class RegistryAudio {
  //rootSceneBG!: AudioSource;
  //audioControlBar!: AudioControlBar
}
export class RegistryEntities {
  pad?: {
    entity: Entity;
    //moveAnimState: AnimationState;
  };
  avatarSwap?:AvatarSwap
  /*
  alternativeScene!: Entity;
  secondaryAlternativeScene!: Entity;
  rootScene!: Entity;*/
} 
export class Registry2dUI {
  loadingPrompt!: CustomOkPrompt;
  showLoadingUI!: (val: boolean, duration?: number) => void;
  errorPrompt!: CustomOkPrompt;
  levelUpPrompt!: LevelUpPrompt
  
  inventoryPrompt!: InventoryPrompt
  showErrorUI!: (
    val: boolean,
    code?: number,
    msg?: string,
    duration?: number
  ) => void;
  
  endGamePrompt!: CustomPrompt;
  endGameConfirmPrompt!: CustomOptionsPrompt;
  hideEndGamePrompt!: () => void;
  openEndGameConfirmPrompt!: () => void;
  hideEndGameConfirmPrompt!: () => void;
  openEndGamePrompt!: () => void;
  
  openClaimRewardPrompt!: () => void;
  hideClaimRewardPrompt!: () => void;
  updateRewardPrompt!: (args: CustomClaimArgs) => void;
  
  openRewardsPrompt!: () => void;
  /*
  openStartGamePrompt!: (gameType?: string) => void;
  hideStartGamePrompt!: () => void;
  */
  openloginGamePrompt!: () => void;
  hideloginGamePrompt!: () => void;
  
  web3ProviderRequiredPrompt!:CustomOptionsPrompt
  /*
  openRaffleGamePrompt!: () => void;
  hideRaffleGamePrompt!: () => void;

  createDebugUIButtons!: () => void;

  loginPanel!: LoginPanel;
  */
  staminaPanel!: StaminaPanel;
  
  //racePanel!: RacePanel;
  gameTools!: GameToolsPanel;
    
  openLeaderboardHourly!: () => void;
  openLeaderboardDaily!: () => void;
  openLeaderboardWeekly!: () => void;
  openLeaderboardMonthly!: () => void;
  openLeaderboardLevelEpoch!: () => void;
  openRaffleCoinBagEntries!: () => void;
}

export class RegistryToggles {
  toggleAvatarSwap!: () => void;
  togglePersonalAssistant!: () => void;
  toggleLocation!: () => void;
  doAvatarSwap!: () => void;
  //createWearableLinks!: ()=> Promise<void>
}
type MovePlayerToType = {
  position?: Vector3;
  cameraDir?: Vector3;
};
export class RegistryMovePlayerTo {
  /*ALT_SCENE: MovePlayerToType = {
    position: new Vector3(40, 400, 52),
    cameraDir: new Vector3(40, 16, 40),
  };*/
}

export class RegistryIntervals {
  connectCheckInterval: IntervalUtil
}
export class Registry {
  ui: Registry2dUI = new Registry2dUI();
  entities: RegistryEntities = new RegistryEntities();
  videoTextures: RegistryVideoTexutres = new RegistryVideoTexutres();
  audio: RegistryAudio = new RegistryAudio()
  toggles: RegistryToggles = new RegistryToggles();
  //sceneMgr!: GameSceneManager;
  movePlayerTo: RegistryMovePlayerTo = new RegistryMovePlayerTo();
  intervals:RegistryIntervals = new RegistryIntervals()
}

export let REGISTRY: Registry;
export function initRegistry() {
  console.log("initRegistry called");
  if (REGISTRY === undefined) {
    REGISTRY = new Registry();
  }
}