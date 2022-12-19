import * as ui from "@dcl/ui-scene-utils";
import { CONFIG, initConfig } from "src/config";
import { initRegistry, Registry, REGISTRY } from "src/registry";
import { GAME_STATE, initGameState } from "src/state";
import { CustomMapPrompt, custUiAtlas, Modal } from "./modals";
import { setSection } from "../dcl-scene-ui-workaround/resources";
import atlas_mappings from "./atlas_mappings";
import { ImageSection } from "node_modules/@dcl/ui-scene-utils/dist/utils/types";
import { logChangeListenerEntry } from "src/logging";
import { movePlayerTo } from "@decentraland/RestrictedActions";
const canvas = ui.canvas;
canvas.isPointerBlocker = true;
//const custUiAtlas = new Texture("images/dialog-dark-atlas-v3-semi-tran.png");

initRegistry();
initConfig();
initGameState();

const MASTER_SCALE = 1.2;

const SCALE_FONT_TITLE = MASTER_SCALE;
const SCALE_FONT = MASTER_SCALE;
const SCALE_FONT_PANEL = MASTER_SCALE;

const SCALE_UIImage = MASTER_SCALE;
const SCALE_UIImage_PERCENT = MASTER_SCALE;
const SCALE_UITextPostion_PERCENT = 0.8;

export class StaminaPanel implements Modal {
  staminaPanel: UIImage;
  staminaText: UIText;
  staminaCoins: UIText;
  staminaDollars: UIText;
  StaminaTime: UIText;
  constructor() {
    this.staminaPanel = new UIImage(canvas, custUiAtlas);
    this.staminaPanel.width = 30 * SCALE_UIImage_PERCENT + "%";
    this.staminaPanel.height = 110 * SCALE_UIImage + "px";
    this.staminaPanel.positionY = 305;
    this.staminaPanel.positionX = "31%";
    this.staminaPanel.sourceLeft = 0;
    this.staminaPanel.sourceTop = 3586;
    this.staminaPanel.sourceWidth = 1271;
    this.staminaPanel.sourceHeight = 330;
    this.staminaPanel.visible = false;

    this.staminaText = new UIText(canvas);
    this.staminaText.value = "META GAMIMALL";
    this.staminaText.positionY = "58%";
    this.staminaText.positionX = "23.7%";
    this.staminaText.color = Color4.White();
    this.staminaText.visible = false;
    this.staminaText.fontSize = 18;

    this.staminaCoins = new UIText(canvas);
    this.staminaCoins.value = "111";
    this.staminaCoins.positionY = "48%";
    this.staminaCoins.positionX = "26%";
    this.staminaCoins.color = Color4.White();
    this.staminaCoins.visible = false;
    this.staminaCoins.fontSize = 12;

    this.staminaDollars = new UIText(canvas);
    this.staminaDollars.value = "222";
    this.staminaDollars.positionY = "48%";
    this.staminaDollars.positionX = "33.5%";
    this.staminaDollars.color = Color4.White();
    this.staminaDollars.visible = false;
    this.staminaDollars.fontSize = 12;

    this.StaminaTime = new UIText(canvas);
    this.StaminaTime.value = "00:00";
    this.StaminaTime.positionY = "48%";
    this.StaminaTime.positionX = "41%";
    this.StaminaTime.color = Color4.White();
    this.StaminaTime.visible = false;
    this.StaminaTime.fontSize = 12;
  }
  show(): void {
    this.staminaPanel.visible = true;
    this.staminaText.visible = true;
    this.staminaDollars.visible = true;
    this.staminaCoins.visible = true;
    this.StaminaTime.visible = true;
  }
  hide(): void {
    this.staminaPanel.visible = false;
    this.staminaText.visible = false;
    this.staminaDollars.visible = false;
    this.staminaCoins.visible = false;
    this.StaminaTime.visible = false;
  }

  //material update placeholders
  updateMaterial1(text: string | number) {}
  updateMaterial2(text: string | number) {}
  updateMaterial3(text: string | number) {}

  updateDollars(text: string | number) {
    this.staminaDollars.value =
      typeof text === "string" ? text : text.toString();
  }

  updateCoins(text: string | number) {
    this.staminaCoins.value = typeof text === "string" ? text : text.toString();
  }

  updateTime(text: string | number) {
    this.StaminaTime.value = typeof text === "string" ? text : text.toString();
  }
}

const BASE_RACEPANEL_POSITION_Y = 49; //55 but lowerd it to 49 to see as error msgs over top of it
export class RacePanel implements Modal {
  racePanel: UIImage;
  raceTitle: UIText;
  raceCoins: UIText;
  raceDollars: UIText;
  raceTime: UIText;
  constructor() {
    //race bar, upper right
    this.racePanel = new UIImage(canvas, custUiAtlas);
    this.racePanel.hAlign = "center";
    this.racePanel.vAlign = "center";
    this.racePanel.positionY = BASE_RACEPANEL_POSITION_Y + "%"; //"55%";
    this.racePanel.positionX = "0%";
    this.racePanel.sourceLeft = 176;
    this.racePanel.sourceTop = 3040;
    this.racePanel.sourceWidth = 1076;
    this.racePanel.sourceHeight = 248;
    this.racePanel.width = 376 * SCALE_UIImage;
    this.racePanel.height = 76 * SCALE_UIImage;
    this.racePanel.visible = false;

    this.raceTitle = new UIText(canvas);
    this.raceTitle.value = "COIN RACE PROCESSING";
    this.raceTitle.hAlign = "center";
    this.raceTitle.vAlign = "center";
    this.raceTitle.positionY = BASE_RACEPANEL_POSITION_Y + 5 + "%";
    this.raceTitle.adaptWidth = true;
    this.raceTitle.fontSize = 12 * SCALE_FONT_TITLE;
    this.raceTitle.positionX = "0%";
    this.raceTitle.color = Color4.White();
    this.raceTitle.visible = false;

    this.raceCoins = new UIText(canvas);
    this.raceCoins.value = "x 0";
    this.raceCoins.positionY =
      BASE_RACEPANEL_POSITION_Y + 1.5 * SCALE_UITextPostion_PERCENT + "%";
    this.raceCoins.positionX = -4 * SCALE_UIImage + "%";
    this.raceCoins.color = Color4.White();
    this.raceCoins.visible = false;
    this.raceCoins.fontSize = 11 * SCALE_FONT;

    this.raceDollars = new UIText(canvas);
    this.raceDollars.value = "x 0";
    this.raceDollars.positionY =
      BASE_RACEPANEL_POSITION_Y + 1.5 * SCALE_UITextPostion_PERCENT + "%";
    this.raceDollars.positionX = "4%";
    this.raceDollars.color = Color4.White();
    this.raceDollars.visible = false;
    this.raceDollars.fontSize = 11 * SCALE_FONT;

    this.raceTime = new UIText(canvas);
    this.raceTime.value = "00:00";
    this.raceTime.positionY =
      BASE_RACEPANEL_POSITION_Y + 1.5 * SCALE_UITextPostion_PERCENT + "%";
    this.raceTime.positionX = 11.5 * SCALE_UIImage + "%";
    this.raceTime.color = Color4.White();
    this.raceTime.visible = false;
    this.raceTime.fontSize = 11 * SCALE_FONT;
  }
  show(): void {
    this.racePanel.visible = true;
    this.raceDollars.visible = true;
    this.raceCoins.visible = true;
    this.raceTime.visible = true;
    this.raceTitle.visible = true;
  }
  hide(): void {
    this.racePanel.visible = false;
    this.raceDollars.visible = false;
    this.raceCoins.visible = false;
    this.raceTime.visible = false;
    this.raceTitle.visible = false;
  }
  updateDollars(text: string) {
    this.raceDollars.value = text;
  }
  //material update placeholders
  updateMaterial1(text: string) {}
  updateMaterial2(text: string) {}
  updateMaterial3(text: string) {}

  //for voxboard subgame, placeholder if need own object
  updateSubGameDollars(text: string) {
    this.raceDollars.value = text;
  }

  updateCoins(text: string) {
    this.raceCoins.value = text;
  }

  updateTime(text: string) {
    this.raceTime.value = text;
  }
}

export class LoginPanel implements Modal {
  loginPanel: UIImage;
  loginText: UIText;
  loginButton: UIImage;
  constructor() {
    this.loginPanel = new UIImage(canvas, custUiAtlas);
    this.loginPanel.width = "30%";
    this.loginPanel.height = "98px";
    this.loginPanel.positionY = 322;
    this.loginPanel.positionX = "39%";
    this.loginPanel.sourceLeft = 330;
    this.loginPanel.sourceTop = 3361;
    this.loginPanel.sourceWidth = 1144;
    this.loginPanel.sourceHeight = 220;
    this.loginPanel.visible = false;

    this.loginButton = new UIImage(canvas, custUiAtlas);
    this.loginButton.positionY = "52%";
    this.loginButton.positionX = "40.5%";
    this.loginButton.sourceLeft = 2596;
    this.loginButton.sourceTop = 2118;
    this.loginButton.sourceWidth = 275;
    this.loginButton.sourceHeight = 99;
    this.loginButton.height = 40 * SCALE_UIImage;
    this.loginButton.onClick = new OnPointerDown((e) => {
      //Code to login
      //then (if logged) this.hide()
      //this.hide();

      REGISTRY.ui.openloginGamePrompt();
    });
    this.loginButton.visible = false;

    this.loginText = new UIText(canvas);
    this.loginText.value = "Login";
    this.loginText.positionY = "55%";
    this.loginText.positionX = "42.3%";
    this.loginText.color = Color4.White();
    this.loginText.fontSize = 12 * SCALE_FONT_TITLE;
    this.loginText.isPointerBlocker = false;
    this.loginText.visible = false;
  }
  show(): void {
    this.loginPanel.visible = true;
    this.loginText.visible = true;
    this.loginButton.visible = true;
  }
  hide(): void {
    this.loginPanel.visible = false;
    this.loginText.visible = false;
    this.loginButton.visible = false;
  }
}

export type TogglePanelArgs = {
  activeIconImageSection: ImageSection;
  inActiveIconImageSection: ImageSection;
};
export class TogglePanel implements Modal {
  avatarText: UIText;
  avatarButton: UIImage;
  gcoin: UIImage;
  activeIconImageSection: ImageSection = atlas_mappings.icons.coin;
  inActiveIconImageSection: ImageSection = atlas_mappings.icons.gametools;
  constructor(
    label: string,
    positionYPercent: number,
    callback: () => void,
    opts?: TogglePanelArgs
  ) {
    if (opts && opts.activeIconImageSection !== undefined)
      this.activeIconImageSection = opts.activeIconImageSection;
    if (opts && opts.inActiveIconImageSection !== undefined)
      this.inActiveIconImageSection = opts.inActiveIconImageSection;

    this.avatarButton = new UIImage(canvas, custUiAtlas);

    this.avatarButton.positionY = positionYPercent + -4 + "%";
    this.avatarButton.positionX = "43%";
    this.avatarButton.sourceLeft = 2364;
    this.avatarButton.sourceTop = 3496;
    this.avatarButton.sourceWidth = 508;
    this.avatarButton.sourceHeight = 140;
    this.avatarButton.width = 120 * SCALE_UIImage;
    this.avatarButton.onClick = new OnPointerDown((e) => {
      callback();
    });
    this.avatarButton.visible = false;

    this.gcoin = new UIImage(canvas, custUiAtlas);
    this.gcoin.positionY = positionYPercent + -4.5 + "%";
    this.gcoin.positionX = "39.8%";
    this.gcoin.height = 23 * SCALE_UIImage;
    this.gcoin.width = 23 * SCALE_UIImage;
    this.gcoin.isPointerBlocker = false;
    this.gcoin.visible = false;
    setSection(this.gcoin, this.activeIconImageSection);

    this.avatarText = new UIText(canvas);
    this.avatarText.value = label;
    this.avatarText.positionY = positionYPercent + -1 + "%"; //panel text CS
    this.avatarText.positionX = "44.5%";
    this.avatarText.color = Color4.White();
    this.avatarText.fontSize = 11 * SCALE_FONT_PANEL;
    this.avatarText.visible = false;
    this.avatarText.isPointerBlocker = false;
  }
  setActiveImageSection(imgSection: ImageSection) {
    this.activeIconImageSection;
  }
  setActive(val: boolean) {
    if (val) {
      setSection(this.gcoin, this.inActiveIconImageSection);
    } else {
      setSection(this.gcoin, this.activeIconImageSection);
    }
  }
  show(): void {
    this.avatarText.visible = true;
    this.gcoin.visible = true;
    this.avatarButton.visible = true;
  }
  hide(): void {
    this.avatarText.visible = false;
    this.gcoin.visible = false;
    this.avatarButton.visible = false;
  }
}

export class AvatarSwapPanel extends TogglePanel {
  constructor() {
    super(
      "Avatar Swap",
      23.5,
      () => {
        //do avatar swap
        log("REGISTRY.toggles", REGISTRY.toggles);
        REGISTRY.toggles.doAvatarSwap();
      },
      {
        activeIconImageSection: atlas_mappings.icons.avatarswap,
        inActiveIconImageSection: atlas_mappings.icons.avatarswap_off,
      }
    );
  }
}

export class SummonPetRobotPanel extends TogglePanel {
  constructor() {
    super(
      "Summon Pet",
      17,
      () => {
        log("clicked personalAssistantEnableIcon on ");
        log("REGISTRY.toggles", REGISTRY.toggles);
        REGISTRY.toggles.togglePersonalAssistant();
      },
      {
        activeIconImageSection: atlas_mappings.icons.summonpet,
        inActiveIconImageSection: atlas_mappings.icons.summonpet_off,
      }
    );
  }
}

const button1 = {
  title: "ZONE 1",
  titleYPos: "32.5%",
  buttonText: "Odaily",
  buttonYPos: "25%",
  callback: () => {
    REGISTRY.toggles.toggleLocation();
    movePlayerTo({ x: 24, y: 26, z: 48 });
  },
};
const mapModal = new CustomMapPrompt("NAVIGATOR OF META GAMIMALL", [button1]);
mapModal.hide();
export class LocationPanel extends TogglePanel {
  constructor() {
    super(
      "Location",
      10.5,
      () => {
        log("clicked LocationEnableIcon on ");
        log("REGISTRY.toggles", REGISTRY.toggles);
        REGISTRY.toggles.toggleLocation();
        if (GAME_STATE.locationEnabled) {
          mapModal.show();
        } else {
          mapModal.hide();
        }
      },
      {
        activeIconImageSection: atlas_mappings.icons.locationicon,
        inActiveIconImageSection: atlas_mappings.icons.locationicon_off,
      }
    );
  }
}
const startGameYPos = 30;
export class StartEndGamePanel extends TogglePanel {
  subPanels: TogglePanel[] = [];

  startGame: TogglePanel;
  endGame: TogglePanel;
  startSubGame: TogglePanel;

  gameHudContext!: GameHudVisContext;

  constructor() {
    super("STUBB", startGameYPos, () => {
      log("clicked StartEndGamePanel on ");
      log("REGISTRY.toggles", REGISTRY.toggles);
      //REGISTRY.toggles.togglePersonalAssistant();
      //TODO NEED LOGIC FOR WHAT TO DO WHEN
      //start game REGISTRY.ui.openStartGamePrompt();
      //end game REGISTRY.ui.openEndGameConfirmPrompt();
      //sub game REGISTRY.ui.openStartGamePrompt("VB");
    });

    this.avatarText.visible = false;
    this.gcoin.visible = false;
    this.avatarButton.visible = false;

    this.startGame = new TogglePanel(
      "Start Game",
      startGameYPos,
      () => {
        REGISTRY.ui.openStartGamePrompt();
      },
      {
        activeIconImageSection: atlas_mappings.icons.startgame,
        inActiveIconImageSection: atlas_mappings.icons.startgame_off,
      }
    );

    this.endGame = new TogglePanel(
      "End Game",
      startGameYPos,
      () => {
        REGISTRY.ui.openEndGameConfirmPrompt();
      },
      {
        activeIconImageSection: atlas_mappings.icons.startgame,
        inActiveIconImageSection: atlas_mappings.icons.startgame_off,
      }
    );
    this.startSubGame = new TogglePanel(
      "Start Sub-Game",
      startGameYPos,
      () => {
        REGISTRY.ui.openStartGamePrompt("VB");
      },
      {
        activeIconImageSection: atlas_mappings.icons.material1,
        inActiveIconImageSection: atlas_mappings.icons.material2,
      }
    );

    this.subPanels.push(this.startGame);
    this.subPanels.push(this.startSubGame);
    this.subPanels.push(this.endGame);
  }
  setSubPanelsVisible(val: boolean) {
    for (let p in this.subPanels) {
      if (val) {
        this.subPanels[p].show();
      } else {
        this.subPanels[p].hide();
      }
    }
  }

  updateHudContext(ctx: GameHudVisContext) {
    this.gameHudContext = ctx;
  }

  hide(): void {
    this.setSubPanelsVisible(false);
  }
  show(): void {
    //this.setSubPanelsVisible(true)
    log("gametool.show", this.gameHudContext);
    switch (this.gameHudContext) {
      case "game-hud":
        this.startGame.hide();
        this.startSubGame.hide();
        this.endGame.show();
        break;
      case "lobby":
        this.startGame.show();
        this.startSubGame.hide();
        this.endGame.hide();
        break;
      case "sub-lobby":
        this.startGame.hide();
        this.startSubGame.show();
        this.endGame.hide();
        break;
    }
  }
}

export type GameHudVisContext = "lobby" | "game-hud" | "sub-lobby";

export class GameToolsPanel implements Modal {
  gtext: UIText;
  gimagebutton: UIImage;
  gdoge: UIImage;
  petPanel: SummonPetRobotPanel;
  avatarSwapPanel: AvatarSwapPanel;
  locationPanel: LocationPanel;
  startEndGamePanel: StartEndGamePanel;

  subPanels: TogglePanel[] = [];

  gameHudContext?: GameHudVisContext;

  isShown: boolean;

  subPanelsVisible: boolean = false;

  constructor() {
    this.gimagebutton = new UIImage(canvas, custUiAtlas);
    this.gimagebutton.positionY = "35%";
    this.gimagebutton.positionX = "43%";
    setSection(this.gimagebutton, atlas_mappings.backgrounds.expandPanel);
    this.gimagebutton.width = 130 * SCALE_UIImage;
    this.petPanel = new SummonPetRobotPanel();
    this.avatarSwapPanel = new AvatarSwapPanel();
    this.startEndGamePanel = new StartEndGamePanel();
    this.locationPanel = new LocationPanel();
    this.subPanels.push(this.petPanel);
    this.subPanels.push(this.avatarSwapPanel);
    this.subPanels.push(this.locationPanel);
    this.subPanels.push(this.startEndGamePanel);

    this.isShown = false;
    this.gimagebutton.onClick = new OnPointerDown((e) => {
      this.isShown = !this.isShown;
      if (this.isShown) {
        this.setSubPanelsVisible(true);
      } else {
        this.setSubPanelsVisible(false);
      }
    });

    this.gimagebutton.visible = false;
    this.gdoge = new UIImage(canvas, custUiAtlas);
    this.gdoge.positionY = "34.5%";
    this.gdoge.positionX = "39.5%";
    setSection(this.gdoge, atlas_mappings.icons.gametools);

    this.gdoge.height = 23 * SCALE_UIImage;
    this.gdoge.width = 25 * SCALE_UIImage;
    this.gdoge.isPointerBlocker = false;
    this.gdoge.visible = false;

    this.gtext = new UIText(canvas);
    this.gtext.value = "Game Tools";
    this.gtext.positionY = "38.5%";
    this.gtext.positionX = "44%";
    this.gtext.color = Color4.White();
    this.gtext.isPointerBlocker = false;
    this.gtext.fontSize = 11 * SCALE_FONT_PANEL;
    this.gtext.visible = false;
  }
  updateHudContext(ctx: GameHudVisContext) {
    this.gameHudContext = ctx;
    this.setSubPanelsHudeContext(ctx);
    this.updateSubPanels();
  }
  updateSubPanels() {
    if (this.subPanelsVisible) {
      this.setSubPanelsVisible(true);
    }
  }
  setSubPanelsVisible(val: boolean) {
    this.subPanelsVisible = val;
    for (let p in this.subPanels) {
      if (val) {
        this.subPanels[p].show();
      } else {
        this.subPanels[p].hide();
      }
    }
  }
  setSubPanelsHudeContext(ctx: GameHudVisContext) {
    this.startEndGamePanel.updateHudContext(ctx);
  }
  show(): void {
    this.gtext.visible = true;
    this.gimagebutton.visible = true;
    this.gdoge.visible = true;
  }
  hide(): void {
    this.gtext.visible = false;
    this.gimagebutton.visible = false;
    this.gdoge.visible = false;
  }
}

REGISTRY.ui.gameTools = new GameToolsPanel();
REGISTRY.ui.gameTools.show();
REGISTRY.ui.gameTools.setSubPanelsVisible(true);

GAME_STATE.addChangeListener((key: string, newVal: any, oldVal: any) => {
  logChangeListenerEntry("listener.ui_background.ts ", key, newVal, oldVal);

  switch (key) {
    //common ones on top
    case "avatarSwapEnabled":
      REGISTRY.ui.gameTools.avatarSwapPanel.setActive(newVal);
      break;
    case "personalAssistantEnabled":
      REGISTRY.ui.gameTools.petPanel.setActive(newVal);
      break;
    case "locationEnabled":
      REGISTRY.ui.gameTools.locationPanel.setActive(newVal);
      break;
  }
});
