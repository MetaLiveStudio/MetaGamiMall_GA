import { CustomPrompt } from "./dcl-scene-ui-workaround/CustomPrompt";
import { GameSceneManager } from "./modules/sceneMgmt/gameSceneManager";
import {
  CustomClaimArgs,
  CustomOkPrompt,
  CustomOptionsPrompt,
} from "./ui/modals";
import {
  GameToolsPanel,
  LoginPanel,
  RacePanel,
  StaminaPanel,
} from "./ui/ui_background";

/*
some ugly trickery to get around cyclic dependencies
*/

export class RegistryEntities {
  pad!: {
    entity: Entity;
    moveAnimState: AnimationState;
  };
  alternativeScene!: Entity;
  rootScene!: Entity;
}
export class Registry2dUI {
  loadingPrompt!: CustomOkPrompt;
  showLoadingUI!: (val: boolean, duration?: number) => void;
  errorPrompt!: CustomOkPrompt;
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

  openStartGamePrompt!: (gameType?: string) => void;
  hideStartGamePrompt!: () => void;

  openloginGamePrompt!: () => void;
  hideloginGamePrompt!: () => void;

  createDebugUIButtons!: () => void;

  loginPanel!: LoginPanel;
  staminaPanel!: StaminaPanel;
  racePanel!: RacePanel;
  gameTools!: GameToolsPanel;
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
  ALT_SCENE: MovePlayerToType = {
    position: new Vector3(28, 0, 35),
    cameraDir: new Vector3(40, 16, 40),
  };
}
export class Registry {
  ui: Registry2dUI = new Registry2dUI();
  entities: RegistryEntities = new RegistryEntities();
  toggles: RegistryToggles = new RegistryToggles();
  sceneMgr!: GameSceneManager;
  movePlayerTo: RegistryMovePlayerTo = new RegistryMovePlayerTo();
}

export let REGISTRY: Registry;

export function initRegistry() {
  log("initRegistry called");
  if (REGISTRY === undefined) {
    REGISTRY = new Registry();
  }
}
