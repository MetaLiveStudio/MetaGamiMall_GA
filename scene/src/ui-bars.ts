import * as ui from "@dcl/ui-scene-utils";
import { CONFIG, initConfig } from "./config";
import { GlobalCanvas } from "./dclconnect/gui/canvas";
import { getUserDisplayName } from "./gamimall/player-utils";
import {
  GetPlayerCombinedInfoResultPayload,
  StatisticValue,
} from "./gamimall/playfab_sdk/playfab.types";
import { REGISTRY } from "./registry";
import { GAME_STATE, initGameState } from "./state";
import { CheckMultiplierResultType, fetchMultiplier } from "./store/fetch-utils";
import { LoginPanel, RacePanel, StaminaPanel } from "./ui/ui_background";
import { concatString, pushStrToArr } from "./utils";
import { i18n, i18nOnLanguageChangedAdd } from "src/i18n/i18n";
import { namespaces } from "src/i18n/i18n.constants";
//import { avatarSwap, avatarSwapScript } from "./game";
//import { GAME_STATE } from "./state";
//const GlobalCanvas = new UICanvas()

initConfig();
initGameState();

// /385445f9-b94f-431a-8c67-7650c03c99cc/src/arissa.ts
export function toggleMetaDogeIcon() {
  log("toggleAvatarSwap called");
  if (GAME_STATE.metadogeSwapEnabledIcon) {
    //metadogeSwapIcon.visible = true;
  } else {
    //metadogeSwapIcon.visible = false;
  }
}

///src/gamimall/ui-hud-debugger.ts
export const avatarSwapCTAPrompt = new ui.OptionPrompt(
  "Unable to Avatar Swap",
  "You must own a qualifying MetaDoge NFT to avatar swap",
  () => {
    avatarSwapCTAPrompt.close();
  },
  () => {
    const helmetMarketUrl = CONFIG.URL_METADOGE_3D_MINT_URL;

    openExternalURL(helmetMarketUrl);
    avatarSwapCTAPrompt.close();
  },
  "Maybe Later",
  "Get One Now",
  true
);
avatarSwapCTAPrompt.hide();

export function loadUIBars() {
  if (CONFIG.AVATAR_SWAP_ENABLED) {
    //createAvatarswapIcons();
  }

  REGISTRY.ui.loginPanel = new LoginPanel();
  REGISTRY.ui.loginPanel.show();
 
  REGISTRY.ui.racePanel = new RacePanel();
  //REGISTRY.ui.racePanel.show();
  REGISTRY.ui.racePanel.updateCoins("x 100");

  REGISTRY.ui.staminaPanel = new StaminaPanel();

  //fetch and add multiplier
  fetchMultiplier().then((res:CheckMultiplierResultType)=>{
    if(res !== undefined && res.ok && res.multiplier){
      REGISTRY.ui.staminaPanel.setMultiplier( res.multiplier )

    }
  })

  function doAvatarSwap() {
    log(
      "clicked avatarswap on " + GAME_STATE.playerState.nftDogeHelmetBalance,
      GAME_STATE.playerState.nftDogeBalance
    );

    if (
      !CONFIG.AVATAR_SWAP_WEARBLE_DETECT_ENABLED ||
      GAME_STATE.playerState.nftDogeHelmetBalance > 0 ||
      GAME_STATE.playerState.nftDogeBalance > 0
    ) {
      toggleAvatarSwap();
    } else {
      //up sell you need to own a qualifying metadog nft
      //avatarSwapCTAPrompt.show();
    }
  }

  function toggleAvatarSwap() {
    log("toggleAvatarSwap called");

    if (GAME_STATE.avatarSwapEnabled == false) {
      log("PLAYER_AVATAR_SWAP_ENABLED enable swap");
      GAME_STATE.setAvatarSwapEnabled(true);

      //avatarSwapScript.setAvatarSwapTriggerEnabled(avatarSwap,GAME_STATE.avatarSwapEnabled)

      //avatarSwapEnableIcon.visible = false;
      //avatarSwapDisableIcon.visible = true;
    } else {
      log("PLAYER_AVATAR_SWAP_ENABLED disable swap");
      GAME_STATE.setAvatarSwapEnabled(false);
      //avatarSwapScript.setAvatarSwapTriggerEnabled(avatarSwap,GAME_STATE.avatarSwapEnabled)

      //avatarSwapEnableIcon.visible = true;
      //avatarSwapDisableIcon.visible = false;
    }
  }

  function toggleLocation() {
    log("toggleMap called");

    if (GAME_STATE.locationEnabled == false) {
      log("toggleMap enable map");
      GAME_STATE.setLocation(true);
    } else {
      log("toggleMap disable map");
      GAME_STATE.setLocation(false);
    }
  }

  function togglePersonalAssistant() {
    log("togglePersonalAssistant called");

    if (GAME_STATE.personalAssistantEnabled == false) {
      log("personalAssistantEnabled enable swap");
      GAME_STATE.setPersonalAssistantEnabled(true);
    } else {
      log("personalAssistantEnabled disable personal assist");
      GAME_STATE.setPersonalAssistantEnabled(false);
    }

    //personalAssistantEnableIcon.visible =
    // GAME_STATE.personalAssistantEnabled == false;
    //personalAssistantDisableIcon.visible =
    //  GAME_STATE.personalAssistantEnabled == true;
  }

  REGISTRY.toggles.doAvatarSwap = doAvatarSwap;
  REGISTRY.toggles.toggleAvatarSwap = toggleAvatarSwap;
  REGISTRY.toggles.togglePersonalAssistant = togglePersonalAssistant;
  REGISTRY.toggles.toggleLocation = toggleLocation;
}

/*
const HEADER_TEXT_HERE = "Notice & Tips";
const HEADER_TEXT_PAGE_2 = "Leaderboards";
const HEADER_TEXT_3 = "Player";

const textBullets: string[] = [
  "Next Event:",
  "TBD ",
  "------------------------",
  "Tips:",
  "1. Talk to your following robot and teleport to 5 squares within a second!!!",
  "2. Use the left audio bar to adjust the music/video volume.",
  //"* this message is qu't long long long long long\n fit in a single line. \nI hope that's not a problem\nI hope that's not a problem\nI hope that's not a problem\nI hope that's not a problem\nI hope that's not a problem\nI hope that's not a \nproblem.",
  //"* xxxsdfs sdflk dsjflsdjf ds",
  //"* second sdfsdf sdfsd fds fsd\n fds f",
  //"* third",
  //"* four \n foursdflkjdslfk jdsflk jdsklf jsdl",
  //"* five\nfive\nfive\nfive\n"
  //"-"
];

const textBulletsPage2: string[] = [
  "-" ,
];

const textLeaderboardPlaceHolder: string[] = [
  "Leaderboard",
  "-------",
  "Sign in",
  "to see",
  "leaderboard",
  "-",
  "-",
];

const textPlayerPlaceHolder: string[] = [
  "player name",
  "-------",
  "Login Required",
  "-",
  "-",
  "-",
  "-",
];

const headerFont = new Font(Fonts.SansSerif_Bold);
const textFont = new Font(Fonts.SansSerif);

class UIContainerCustPageUI extends Entity {
  container?: UIContainerStack;

  PANEL_WIDTH?: number;
  HEADER_HEIGHT?: number;
  IMAGE_HEIGHT?: number;

  headerText?: string;
  textBullets?: string[];

  headerContainer?: UIContainerRect;
  header?: UIText;
  clickableImageShow?: UIImage;
  clickableNextImageShow?: UIImage;
  bar?: UIContainerRect;

  bulletTextUIList: UIShape[] = [];

  fullMenuVis: boolean = false;
  enablePaging = false;
  parent: UIContainerCustUIStack | null;
  constructor(parent: UIContainerCustUIStack | null, name?: string) {
    super(name);
    this.parent = parent;
  }

  hide() {
    log(this.name + ".hide.updateMenuPage");

    if (this.header) {
      this.header.visible = false;
      this.header.height = 0;
    }
    if (this.headerContainer) {
      this.headerContainer.visible = false;
      this.headerContainer.height = 0;
    }
    if (this.bar) this.bar.visible = false;
    if (this.clickableImageShow) {
      this.clickableImageShow.visible = false;
      this.clickableImageShow.height = 0;
    }

    if (this.enablePaging && this.clickableNextImageShow) {
      this.clickableNextImageShow.visible = false;
      this.clickableNextImageShow.height = 0;
    }

    //this.clickableNextImageShow.height = 0
    this.collapse();

    //this.container.height = this.HEADER_HEIGHT
    //this.container.adaptHeight = false
  }
  show() {
    log(this.name + ".show.updateMenuPage");

    if (this.header) {
      this.header.visible = true;
      if (this.HEADER_HEIGHT) {
        this.header.height = this.HEADER_HEIGHT;
      }
    }
    if (this.headerContainer) {
      this.headerContainer.visible = true;
      if (this.HEADER_HEIGHT) {
        this.headerContainer.height = this.HEADER_HEIGHT;
      }
    }

    if (this.bar) this.bar.visible = true;
    if (this.clickableImageShow) {
      this.clickableImageShow.visible = true;

      if (this.IMAGE_HEIGHT) {
        this.clickableImageShow.height = this.IMAGE_HEIGHT;
      }
    }

    if (this.enablePaging && this.clickableNextImageShow) {
      this.clickableNextImageShow.visible = true;
      if (this.IMAGE_HEIGHT) {
        this.clickableNextImageShow.height = this.IMAGE_HEIGHT;
      }
    }

    //this.container.adaptHeight = true

    this.expand();
  }

  collapse() {
    for (const p in this.bulletTextUIList) {
      this.bulletTextUIList[p].height = 0;
      this.bulletTextUIList[p].visible = false;
      if (this.bulletTextUIList[p] instanceof UIText) {
        (this.bulletTextUIList[p] as UIText).adaptHeight = false;
        (this.bulletTextUIList[p] as UIText).textWrapping = false;
      }
    }
  }
  expand() {
    for (const p in this.bulletTextUIList) {
      //bulletTextUIList[p].height = 0
      this.bulletTextUIList[p].visible = true;
      if (this.bulletTextUIList[p] instanceof UIText) {
        (this.bulletTextUIList[p] as UIText).adaptHeight = true;
        (this.bulletTextUIList[p] as UIText).textWrapping = true;
      }
    }
  }

  setBulletText(textBullets: string[]) {
    if (this.container) {
      for (const p in textBullets) {
        this.bulletTextUIList.push(
          this.createBulletText(textBullets[p], this.container)
        );
      }
    }
  }

  updateBulletText(textBullets: string[]) {
    for (const p in this.bulletTextUIList) {
      const uiText = this.bulletTextUIList[p] as UIText;
      const text = textBullets[p];

      if (text) {
        uiText.value = text;
      } else {
        uiText.value = "-";
      }
    }
  }

  createBulletText(text: string, parent: UIShape): UIText {
    log(this.name + ".createBulletText", text, parent);
    const myText = new UIText(parent);
    myText.value = text;
    myText.fontSize = 15;
    myText.font = textFont;
    myText.paddingRight = 10;
    myText.paddingLeft = 10;
    //myText.paddingTop = 10
    //myText.paddingBottom = 10
    myText.hAlign = "left";
    myText.vAlign = "bottom";
    //myText.adaptWidth = true
    myText.adaptHeight = true;
    myText.width = parent.width;
    myText.textWrapping = true;
    //myText.positionX = 0
    //myText.positionY = 20
    //myText.width = "200"
    //myText.text.width = "100%"
    return myText;
  }

  toggleMenu(val?: boolean) {
    const toggleVal =
      val !== null && val !== undefined ? val : !this.fullMenuVis;
    log(this.name + "page.toggleVal " + toggleVal + " vs " + val);
    for (const p in this.bulletTextUIList) {
      this.bulletTextUIList[p].visible = toggleVal;
    }
    if (!toggleVal) {
      if (this.container) {
        this.container.width = 1;
        this.container.adaptHeight = false;
        if (this.HEADER_HEIGHT) {
          this.container.height = this.HEADER_HEIGHT;
        }
        this.collapse();
        //header.height = 0

        //inventoryContainer.visible = false

        //inventoryContainer.height = 30
       

        if (this.clickableImageShow)
          this.clickableImageShow.source = new Texture(
            "images/ui/menu-show.png"
          );
        //clickableImagePageChange.visible = false
      }
    } else {
      if (this.container) {
        if (this.PANEL_WIDTH) {
          this.container.width = this.PANEL_WIDTH;
        }
        this.container.adaptHeight = true;

        this.expand();

        if (this.clickableImageShow)
          this.clickableImageShow.source = new Texture(
            "images/ui/menu-hide.png"
          );
        //clickableImagePageChange.visible = true
      }
    }
    //inventoryContainer.height = 200

    this.fullMenuVis = toggleVal;
  }
}

class UIContainerCustUIStack extends Entity {
  container: UIContainerStack;

  PANEL_WIDTH: number;
  PAGE_1_MENU?: UIContainerCustPageUI;
  PAGE_2_MENU?: UIContainerCustPageUI;

  fullMenuVis = true;
  enablePaging = false;
  pageOne = true;

  constructor(parent: UIShape | null, name: string, width: number) {
    //super(parent);
    super(name);

    this.PANEL_WIDTH = width;

    const inventoryContainer = (this.container = new UIContainerStack(parent));

    //inventoryContainer.PANEL_WIDTH = PANEL_WIDTH

    //inventoryContainer.adaptWidth = true
    inventoryContainer.width = this.PANEL_WIDTH; //
    inventoryContainer.spacing = 0; //-22
    inventoryContainer.positionX = -5;
    //inventoryContainer.positionY = 100
    //inventoryContainer.positionX = 0
    //inventoryContainer.height = textRect.height - 30
    //inventoryContainer.adaptHeight=true
    inventoryContainer.color = Color4.Black();
    inventoryContainer.vAlign = "top";
    inventoryContainer.hAlign = "right";
    //opacity - seems to be inheritted making text semi transparent and harder to see.  and 100% is somehow still opac?
    inventoryContainer.opacity = 1;
    inventoryContainer.stackOrientation = UIStackOrientation.VERTICAL;
  }

  setEnablePaging(val: boolean) {
    if (this.PAGE_1_MENU == undefined) {
      log("Error: looks like loadUIBars was not called yet");
    }
    this.enablePaging = val;
    if (this.PAGE_1_MENU) this.PAGE_1_MENU.enablePaging = val;
    if (this.PAGE_2_MENU) this.PAGE_2_MENU.enablePaging = val;

    if (val == false) {
      if (this.PAGE_1_MENU)
        if (this.PAGE_1_MENU.clickableNextImageShow)
          this.PAGE_1_MENU.clickableNextImageShow.visible = false;
      if (this.PAGE_2_MENU) {
        if (this.PAGE_2_MENU.clickableNextImageShow)
          this.PAGE_2_MENU.clickableNextImageShow.visible = false;
        if (this.PAGE_2_MENU.clickableNextImageShow)
          this.PAGE_2_MENU.clickableNextImageShow.height = 0;
      }
    }
  }

  toggleMenuPage(val?: boolean) {
    const toggleVal = val !== null && val !== undefined ? val : !this.pageOne;
    log(this.name + ".toggleMenuPage.updateMenuPage " + " " + toggleVal);

    this.pageOne = toggleVal;

    this.updateMenuPage();
  }

  updateMenuPage() {
    log(this.name + ".updateMenuPage " + " " + this.pageOne);
    if (this.pageOne) {
      if (this.PAGE_2_MENU) this.PAGE_2_MENU.hide();
      if (this.PAGE_1_MENU) this.PAGE_1_MENU.show();
    } else {
      if (this.PAGE_2_MENU) this.PAGE_2_MENU.show();
      if (this.PAGE_1_MENU) this.PAGE_1_MENU.hide();
    }
  }

  hide() {
    if (this.PAGE_2_MENU) this.PAGE_2_MENU.hide();
    if (this.PAGE_1_MENU) this.PAGE_1_MENU.hide();
    this.container.visible = false;
  }

  toggleMenu(val?: boolean) {
    const toggleVal =
      val !== null && val !== undefined ? val : !this.fullMenuVis;

    log(this.name + ".toggleVal.updateMenuPage " + toggleVal + " vs " + val);

    //log("calling toggle " + this.PAGE_1_MENU)
    if (this.PAGE_1_MENU) this.PAGE_1_MENU.toggleMenu(toggleVal);
    if (this.PAGE_2_MENU) this.PAGE_2_MENU.toggleMenu(toggleVal);

    this.fullMenuVis = toggleVal;

    if (toggleVal) {
      log(
        this.name +
          ".toggleVal.calling.updateMenuPage pageOne:" +
          this.pageOne +
          " toggleVal " +
          toggleVal
      );
      this.updateMenuPage();
    }
  }
}

let leaderBoardUI: UIContainerCustUIStack;
let playerUI: UIContainerCustUIStack;

export function loadUIBars() {
  if (CONFIG.AVATAR_SWAP_ENABLED) {
    createAvatarswapIcons();
  }

  const PANEL_WIDTH = 200;
  const PANEL_PADD_RIGHT = 5;
  const START_EXPANDED = true;

  const parentContainer = new UIContainerStack(GlobalCanvas);

  //inventoryContainer.PANEL_WIDTH = PANEL_WIDTH

  //inventoryContainer.adaptWidth = true
  parentContainer.width = PANEL_WIDTH; //
  parentContainer.spacing = 0; //-22
  parentContainer.positionX = -5;
  //inventoryContainer.positionY = 100
  //inventoryContainer.positionX = 0
  //inventoryContainer.height = textRect.height - 30
  //inventoryContainer.adaptHeight=true
  //parentContainer.color = Color4.White()
  parentContainer.vAlign = "top";
  parentContainer.hAlign = "right";
  parentContainer.opacity = 0.8;
  parentContainer.stackOrientation = UIStackOrientation.VERTICAL;

  createHyperLinkIconsTop();

  const custUI = new UIContainerCustUIStack(
    parentContainer,
    "tips",
    PANEL_WIDTH
  );

  custUI.PAGE_1_MENU = createUIBars(custUI, HEADER_TEXT_HERE, textBullets);
  custUI.PAGE_2_MENU = createUIBars(custUI, HEADER_TEXT_HERE + "-PG2", [
    "note1",
    "note2",
  ]);

  custUI.setEnablePaging(false);
  //custUI.disablePageTwo()
  //custUI.PAGE_1_MENU.show()
  //custUI.PAGE_2_MENU.hide()
  custUI.toggleMenu(true);

  //put them in a container to move if wanted
  const barSpacer = new UIContainerRect(parentContainer);
  barSpacer.width = PANEL_WIDTH;
  barSpacer.height = 10;
  //barSpacer.color = Color4.White()
  barSpacer.positionY = 0;
  //bar.opacity = 0
  barSpacer.hAlign = "right";
  barSpacer.vAlign = "top";

  const custUI2 = (leaderBoardUI = new UIContainerCustUIStack(
    parentContainer,
    "leaderboard-stats",
    PANEL_WIDTH
  ));

  custUI2.PAGE_1_MENU = createUIBars(
    custUI2,
    HEADER_TEXT_PAGE_2,
    textLeaderboardPlaceHolder
  );
  custUI2.PAGE_2_MENU = createUIBars(
    custUI2,
    HEADER_TEXT_PAGE_2,
    textLeaderboardPlaceHolder
  );
  //custUI.PAGE_2_MENU=createUIBars(custUI,HEADER_TEXT_PAGE_2,textBulletsPage2)
  //PAGE_2_MENU.visible=false

  custUI2.setEnablePaging(true);
  custUI2.PAGE_2_MENU.hide();
  custUI2.toggleMenu(true);

  const custUI3 = (playerUI = new UIContainerCustUIStack(
    parentContainer,
    "player-data",
    PANEL_WIDTH
  ));

  custUI3.PAGE_1_MENU = createUIBars(
    custUI3,
    HEADER_TEXT_3,
    textPlayerPlaceHolder
  );
  custUI3.PAGE_2_MENU = createUIBars(
    custUI3,
    HEADER_TEXT_3,
    textPlayerPlaceHolder
  );
  //custUI.PAGE_2_MENU=createUIBars(custUI,HEADER_TEXT_PAGE_2,textBulletsPage2)
  //PAGE_2_MENU.visible=false

  custUI3.setEnablePaging(true);
  custUI3.PAGE_2_MENU.hide();
  custUI3.toggleMenu(true);

  if (!CONFIG.IN_PREVIEW) custUI3.hide(); //for now not showing this
}

type IconType = {
  img: string;
  url?: string;
  onClick?: OnClick;
};

function createHyperLinkIconsTop() {
  const PANEL_WIDTH = 208;
  const IMAGE_WIDTH = 42;
  const PADDING = 6;

  const icons: IconType[] = [
    {
      img: "images/ui/Discord.png",
      url: "https://discord.com/invite/gMGBaUy6pj",
    },
    {
      img: "images/ui/twitter-icon-circle-blue-logo.png",
      url: "https://twitter.com/metadogeNFT",
    },
    {
      img: "images/ui/twitter-icon-circle-black-logo.png",
      url: "https://twitter.com/Metalivestudio",
    },
  ];

  //put them in a container to move if wanted
  const bar = new UIContainerRect(GlobalCanvas);
  //bar.adaptHeight = true
  bar.width = PANEL_WIDTH;
  //bar.positionY = 60
  //bar.positionX = -100
  bar.height = PANEL_WIDTH;
  //bar.color = Color4.White()
  bar.positionY = 0;
  //bar.opacity = 0
  bar.hAlign = "right";
  bar.vAlign = "top";
  //bar.adaptHeight = true

  let counter = 1;
  for (const p in icons) {
    const iconInst: IconType = icons[p];
    const iconImg = new UIImage(bar, new Texture(iconInst.img));
    iconImg.name = "icon-" + iconInst.img;
    iconImg.vAlign = "top";
    iconImg.hAlign = "right";
    iconImg.positionY = 62;
    iconImg.positionX =
      PANEL_WIDTH * -1 + IMAGE_WIDTH * counter + PADDING * counter;
    //iconImg.paddingLeft = PANEL_WIDTH - 20 - PANEL_PADD_RIGHT
    iconImg.width = IMAGE_WIDTH + "px";
    iconImg.paddingBottom = 0;
    iconImg.paddingTop = 0;
    iconImg.height = IMAGE_WIDTH + "px";
    iconImg.sourceWidth = 300;
    iconImg.sourceHeight = 300;
    iconImg.isPointerBlocker = true;
    iconImg.onClick = new OnClick(() => {
      if (iconInst.url) {
        openExternalURL(iconInst.url);
      } else {
        log("external link not found");
      }
    });

    counter++;
  }
}

export const loginErrorPrompt = new ui.OptionPrompt(
  "Unable to Login",
  "Error",
  () => {
    loginErrorPrompt.close();
  },
  () => {
    loginErrorPrompt.hide();
    GAME_STATE.playerState.requestDoLoginFlow();
  },
  "Cancel",
  "Try Again",
  true
);

loginErrorPrompt.hide();

let avatarSwapEnableIcon: UIImage;
let avatarSwapDisableIcon: UIImage;
let metadogeSwapIcon: UIImage;

let personalAssistantEnableIcon: UIImage;
let personalAssistantDisableIcon: UIImage;

export const avatarSwapCTAPrompt = new ui.OptionPrompt(
  "Unable to Avatar Swap",
  "You must own a qualifying MetaDoge NFT to avatar swap",
  () => {
    avatarSwapCTAPrompt.close();
  },
  () => {
    const helmetMarketUrl = CONFIG.URL_METADOGE_3D_MINT_URL;

    openExternalURL(helmetMarketUrl);
    avatarSwapCTAPrompt.close();
  },
  "Maybe Later",
  "Get One Now",
  true
);

avatarSwapCTAPrompt.hide();
avatarSwapCTAPrompt.title.visible = false; //WORKAROUND TILL CORE FIXED

const PANNEL_PADD_X = 0;
const PANEL_WIDTH = 208;

const toggleBar = new UIContainerRect(GlobalCanvas);
//bar.adaptHeight = true
toggleBar.width = PANEL_WIDTH;
//bar.positionY = 60
//bar.positionX = -100
toggleBar.height = PANEL_WIDTH;
//bar.color = Color4.White()
toggleBar.positionY = 0;
//bar.opacity = .5
toggleBar.hAlign = "left";
toggleBar.vAlign = "top";
//bar.adaptHeight = true

function createAvatarswapIcons() {
  const icons: IconType[] = [
    
    //{"img":"images/ui/avatar-swap-lil.png","onClick":
    //      new OnClick(() => {
    //        GAME_STATE.setAvatarSwapEnabled(true)
    //      })
    //},
    //{"img":"images/ui/avatar-swap-mars.png","onClick":
    //      new OnClick(() => {
    //        GAME_STATE.setAvatarSwapEnabled(false)
    //      })
    //}
  ];

  //put them in a container to move if wanted

  avatarSwapEnableIcon = createAvatarSwapIcon(
    toggleBar,
    {
      img: "images/ui/avatar-swap-on.png",
      onClick: new OnClick(() => {
        log(
          "clicked avatarswap on " +
            GAME_STATE.playerState.nftDogeHelmetBalance,
          GAME_STATE.playerState.nftDogeBalance
        );

        if (
          !CONFIG.AVATAR_SWAP_WEARBLE_DETECT_ENABLED ||
          GAME_STATE.playerState.nftDogeHelmetBalance > 0 ||
          GAME_STATE.playerState.nftDogeBalance > 0
        ) {
          toggleAvatarSwap();
        } else {
          //up sell you need to own a qualifying metadog nft
          avatarSwapCTAPrompt.show();
        }
      }),
    },
    0
  );

  metadogeSwapIcon = createAvatarSwapIcon(
    toggleBar,
    {
      img: "images/ui/avatar-swap-on.png",
      onClick: new OnClick(() => {
        log(
          "clicked metadogeSwap on " +
            GAME_STATE.playerState.nftDogeHelmetBalance,
          GAME_STATE.playerState.nftDogeBalance
        );
        if (
          GAME_STATE.playerState.nftDogeHelmetBalance > 0 ||
          GAME_STATE.playerState.nftDogeBalance > 0
        ) {
          toggleMetadogeSwap();
        } else {
          //up sell you need to own a qualifying metadog nft
          avatarSwapCTAPrompt.show();
        }
      }),
    },
    -1
  );

  metadogeSwapIcon.visible = false;

  avatarSwapDisableIcon = createAvatarSwapIcon(
    toggleBar,
    {
      img: "images/ui/avatar-swap-off.png",
      onClick: new OnClick(() => {
        toggleAvatarSwap();
      }),
    },
    0
  );

  avatarSwapEnableIcon.visible = !GAME_STATE.avatarSwapEnabled;
  avatarSwapDisableIcon.visible = GAME_STATE.avatarSwapEnabled;

  let counter = -2;
  for (const p in icons) {
    //for(var x=0;x++;x<10){

    const iconInst: IconType = icons[p];

    createAvatarSwapIcon(toggleBar, iconInst, counter);

    counter++;
  }
}
export function toggleMetaDogeIcon() {
  log("toggleAvatarSwap called");
  if (GAME_STATE.metadogeSwapEnabledIcon) {
    metadogeSwapIcon.visible = true;
  } else {
    metadogeSwapIcon.visible = false;
  }
}
function toggleMetadogeSwap() {
  log("toggleAvatarSwap called");
  if (GAME_STATE.metadogeSwapEnabled == false) {
    log("PLAYER_AVATAR_SWAP_ENABLED enable swap");
    GAME_STATE.setMetaDogeSwap(true);
    GAME_STATE.avatarSwapEnabled = true;
    avatarSwapEnableIcon.visible = false;
    avatarSwapDisableIcon.visible = true;
  }
}

function toggleAvatarSwap() {
  log("toggleAvatarSwap called");

  if (GAME_STATE.avatarSwapEnabled == false) {
    log("PLAYER_AVATAR_SWAP_ENABLED enable swap");
    GAME_STATE.setAvatarSwapEnabled(true);
    //avatarSwapScript.setAvatarSwapTriggerEnabled(avatarSwap,GAME_STATE.avatarSwapEnabled)

    avatarSwapEnableIcon.visible = false;
    avatarSwapDisableIcon.visible = true;
  } else {
    log("PLAYER_AVATAR_SWAP_ENABLED disable swap");
    GAME_STATE.setAvatarSwapEnabled(false);
    //avatarSwapScript.setAvatarSwapTriggerEnabled(avatarSwap,GAME_STATE.avatarSwapEnabled)

    avatarSwapEnableIcon.visible = true;
    avatarSwapDisableIcon.visible = false;
  }
}

personalAssistantEnableIcon = createPersonalAssistIcon(
  toggleBar,
  {
    img: "images/ui/personal-assistant-on.png",
    onClick: new OnClick(() => {
      log("clicked personalAssistantEnableIcon on ");
      togglePersonalAssistant();
    }),
  },
  0
);

personalAssistantDisableIcon = createPersonalAssistIcon(
  toggleBar,
  {
    img: "images/ui/personal-assistant-off.png",
    onClick: new OnClick(() => {
      togglePersonalAssistant();
    }),
  },
  0
);

personalAssistantEnableIcon.visible =
  GAME_STATE.personalAssistantEnabled == false;
personalAssistantDisableIcon.visible =
  GAME_STATE.personalAssistantEnabled == true;

function togglePersonalAssistant() {
  log("togglePersonalAssistant called");

  if (GAME_STATE.personalAssistantEnabled == false) {
    log("personalAssistantEnabled enable swap");
    GAME_STATE.setPersonalAssistantEnabled(true);
  } else {
    log("personalAssistantEnabled disable personal assist");
    GAME_STATE.setPersonalAssistantEnabled(false);
  }

  personalAssistantEnableIcon.visible =
    GAME_STATE.personalAssistantEnabled == false;
  personalAssistantDisableIcon.visible =
    GAME_STATE.personalAssistantEnabled == true;
}

function createAvatarSwapIcon(
  bar: UIContainerRect,
  iconInst: IconType,
  counter: number
): UIImage {
  const IMAGE_WIDTH = 42;
  const PADDING = 6;

  const iconImg = new UIImage(bar, new Texture(iconInst.img));
  iconImg.name = "icon-" + iconInst.img;
  iconImg.vAlign = "top";
  iconImg.hAlign = "right";
  iconImg.positionY = 60 + IMAGE_WIDTH * counter + PADDING * counter;
  iconImg.positionX = 0; //
  //iconImg.paddingLeft = PANEL_WIDTH - 20 - PANEL_PADD_RIGHT
  iconImg.width = IMAGE_WIDTH + "px";
  iconImg.paddingBottom = 0;
  iconImg.paddingTop = 0;
  iconImg.height = IMAGE_WIDTH + "px";
  iconImg.sourceWidth = 300;
  iconImg.sourceHeight = 300;
  iconImg.isPointerBlocker = true;
  if (iconInst.onClick) {
    iconImg.onClick = iconInst.onClick;
  }

  return iconImg;
}

function createPersonalAssistIcon(
  bar: UIContainerRect,
  iconInst: IconType,
  counter: number
): UIImage {
  const IMAGE_WIDTH = 42;
  const PADDING = 6;

  const iconImg = new UIImage(bar, new Texture(iconInst.img));
  iconImg.name = "icon-" + iconInst.img;
  iconImg.vAlign = "top";
  iconImg.hAlign = "right";
  iconImg.positionY = 60 + IMAGE_WIDTH * counter + PADDING * counter;
  iconImg.positionX = IMAGE_WIDTH * (counter + 1) + PADDING * (counter + 1); //
  //iconImg.paddingLeft = PANEL_WIDTH - 20 - PANEL_PADD_RIGHT
  iconImg.width = IMAGE_WIDTH + "px";
  iconImg.paddingBottom = 0;
  iconImg.paddingTop = 0;
  iconImg.height = IMAGE_WIDTH + "px";
  iconImg.sourceWidth = 300;
  iconImg.sourceHeight = 300;
  iconImg.isPointerBlocker = true;
  if (iconInst.onClick) {
    iconImg.onClick = iconInst.onClick;
  }

  return iconImg;
}

export function createUIBars(
  parent: UIContainerCustUIStack,
  HEADER_TEXT_HERE: string,
  textBullets: string[]
): UIContainerCustPageUI {
  const PANEL_WIDTH = parent.PANEL_WIDTH; //200
  const PANEL_PADD_RIGHT = 5;
  const START_EXPANDED = true;

  const custUIPage = new UIContainerCustPageUI(parent, HEADER_TEXT_HERE);

  custUIPage.HEADER_HEIGHT = 40;
  custUIPage.IMAGE_HEIGHT = 20; //"20px"

  const inventoryContainer = (custUIPage.container = parent.container);

  //log("createUIBars.inventoryContainer  " + inventoryContainer)


  const headerContainer = new UIContainerRect(inventoryContainer);
  //bar.adaptHeight = true
  headerContainer.width = inventoryContainer.width; //"100%"
  headerContainer.height = custUIPage.HEADER_HEIGHT;
  //headerContainer.color = Color4.Green()
  headerContainer.positionY = 0;
  //rect.opacity = 0.5
  headerContainer.hAlign = "right";
  headerContainer.vAlign = "top";
  //bar.adaptHeight = true

  const header = new UIText(headerContainer);
  header.value = HEADER_TEXT_HERE;
  header.height = custUIPage.HEADER_HEIGHT;
  header.font = headerFont;
  header.fontSize = 20;
  header.hAlign = "left";
  header.vAlign = "top";
  header.positionY = 10;
  //header.hAlign = 'right'
  header.paddingRight = 0;
  header.paddingLeft = 10;
  header.paddingTop = 0;
  header.paddingBottom = 0; //Number(inventoryContainer.spacing) * -1

  custUIPage.headerContainer = headerContainer;
  custUIPage.header = header;
  //header.lineSpacing = 0
  //header.textWrapping = false
  //header.width = "90%"
  //myText.text.width = "100%"

  const bar = new UIContainerRect(inventoryContainer);
  //bar.adaptHeight = true
  bar.width = inventoryContainer.width; //"100%"
  bar.height = 2;
  bar.color = Color4.White();
  bar.positionY = 0;
  //rect.opacity = 0.5
  bar.hAlign = "right";
  bar.vAlign = "top";
  //bar.adaptHeight = true

  custUIPage.bar = bar;

  //bulletTextUIList.push(bar)

  const clickableImageShow = new UIImage(
    headerContainer,
    new Texture("images/ui/menu-show.png")
  );
  clickableImageShow.name = "clickable-image";
  clickableImageShow.vAlign = "top";
  clickableImageShow.hAlign = "left";
  clickableImageShow.positionY = -10;
  clickableImageShow.paddingLeft = PANEL_WIDTH - 20 - PANEL_PADD_RIGHT;
  clickableImageShow.width = PANEL_WIDTH - PANEL_PADD_RIGHT + "px";
  clickableImageShow.paddingBottom = 0;
  clickableImageShow.paddingTop = 0;
  clickableImageShow.height = custUIPage.IMAGE_HEIGHT;
  clickableImageShow.sourceWidth = 512;
  clickableImageShow.sourceHeight = 512;
  clickableImageShow.isPointerBlocker = true;
  clickableImageShow.onClick = new OnClick(() => {
    // DO SOMETHING
    log("you clicked show");
    parent.toggleMenu();
  });
  //clickableImageShow.visible = false

  custUIPage.clickableImageShow = clickableImageShow;

  //if(false){
  const clickableImagePageChange = new UIImage(
    headerContainer,
    new Texture("images/ui/menu-next-page.png")
  );
  clickableImagePageChange.name = "clickable-image";
  clickableImagePageChange.vAlign = "top";
  clickableImagePageChange.hAlign = "left";
  clickableImagePageChange.positionY = -10;
  clickableImagePageChange.paddingLeft = PANEL_WIDTH - 40 - PANEL_PADD_RIGHT;
  clickableImagePageChange.width = PANEL_WIDTH - 20 - PANEL_PADD_RIGHT + "px";
  clickableImagePageChange.paddingBottom = 0;
  clickableImagePageChange.paddingTop = 0;
  clickableImagePageChange.height = custUIPage.IMAGE_HEIGHT;
  clickableImagePageChange.sourceWidth = 512;
  clickableImagePageChange.sourceHeight = 512;
  clickableImagePageChange.isPointerBlocker = true;
  clickableImagePageChange.onClick = new OnClick(() => {
    // DO SOMETHING
    log("you clicked change page");
    parent.toggleMenuPage();
  });
  clickableImagePageChange.visible = true;

  custUIPage.clickableNextImageShow = clickableImagePageChange;
  //}
  custUIPage.setBulletText(textBullets);

  //parent.toggleMenu(START_EXPANDED)

  return custUIPage;
}

function getTimeFormat(distance: number): string {
  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  let timeLeftFormatted =
    (hours < 10 ? "0" + hours : hours) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    ":" +
    (seconds < 10 ? "0" + seconds : seconds);

  return timeLeftFormatted;
}

GAME_STATE.leaderboardState.addChangeListener(
  (key: string, newVal: any, oldVal: any) => {
    log(
      "listener.leaderboardState.ui-bars.ts " +
        key +
        " " +
        newVal +
        " " +
        oldVal
    );

    switch (key) {
      //common ones on top
      case "dailyLeaderboard":
        //avatarSwapScript.setAvatarSwapTriggerEnabled(avatarSwap,newVal)
        if (leaderBoardUI && leaderBoardUI.PAGE_1_MENU) {
          let dailyleaderboard = GAME_STATE.leaderboardState.dailyLeaderboard;
          let dailyvalue: any = undefined;
          if (dailyleaderboard) {
            dailyvalue =
              GAME_STATE.leaderboardState.dailyLeaderboard!.Leaderboard;
          }
          const dailyLeaderArr = dailyvalue;

          const dailyLeaderArrStr: string[] = [
            "Coins Collected (Daily)",
            "------------",
          ];
          if (dailyLeaderArr != undefined) {
            let counter = 0;
            for (const p in dailyLeaderArr) {
              const weekStr =
                dailyLeaderArr[p].Position +
                1 +
                " " +
                dailyLeaderArr[p].DisplayName +
                " " +
                dailyLeaderArr[p].StatValue;
              dailyLeaderArrStr.push(weekStr);
              counter++;
              if (counter >= CONFIG.GAME_LEADEBOARD_UI_MAX_RESULTS) {
                break;
              }
            }
          } else {
            dailyLeaderArrStr.push("No data for Coins Collected (Daily)");
          }
          leaderBoardUI.PAGE_1_MENU.updateBulletText(dailyLeaderArrStr);
        }
        break;
      case "weeklyLeaderboard":
        //avatarSwapScript.setAvatarSwapTriggerEnabled(avatarSwap,newVal)
        if (leaderBoardUI && leaderBoardUI.PAGE_2_MENU) {
          const weeklyleaderboard =
            GAME_STATE.leaderboardState.weeklyLeaderboard;

          let weeklyvalue: any = undefined;
          if (weeklyleaderboard) {
            weeklyvalue =
              GAME_STATE.leaderboardState.weeklyLeaderboard!.Leaderboard;
          }
          const weeklyLeaderArr = weeklyvalue;

          const weeklyLeaderArrStr: string[] = [
            "Coins Collected (Weekly)",
            "------------",
          ];
          if (weeklyLeaderArr != null) {
            let counter = 0;
            for (const p in weeklyLeaderArr) {
              const weekStr =
                weeklyLeaderArr[p].Position +
                1 +
                " " +
                weeklyLeaderArr[p].DisplayName +
                " " +
                weeklyLeaderArr[p].StatValue;
              weeklyLeaderArrStr.push(weekStr);
              counter++;
              if (counter >= CONFIG.GAME_LEADEBOARD_UI_MAX_RESULTS) {
                break;
              }
            }
          } else {
            weeklyLeaderArrStr.push("No data for Coins Collected (Weekly)");
          }
          leaderBoardUI.PAGE_2_MENU.updateBulletText(weeklyLeaderArrStr);
        }
        break;
    }
  }
);

GAME_STATE.playerState.addChangeListener(
  (key: string, newVal: any, oldVal: any) => {
    log("listener.playerState.ui-bars.ts " + key + " " + newVal + " " + oldVal);

    switch (key) {
      //common ones on top
      case "playFabUserInfo":
        //avatarSwapScript.setAvatarSwapTriggerEnabled(avatarSwap,newVal)
        if (playerUI && playerUI.PAGE_1_MENU) {
          const dailyLeaderArrStr: string[] = [];

          //TODO what if displayname is null???
          pushStrToArr(
            dailyLeaderArrStr,
            "Name",
            getUserDisplayName(GAME_STATE.playerState)
          );

          pushStrToArr(
            dailyLeaderArrStr,
            "MetaCash:",
            GAME_STATE.playerState.playFabUserInfo?.UserVirtualCurrency?.MC
          );

          let coinCollectingEpochStat: StatisticValue | undefined;
          let coinCollectingDailyStat: StatisticValue | undefined;
          let coinsMCEarnedDailyStat: StatisticValue | undefined;
          //todo review this:
          let playerFabUserInfo:
            | GetPlayerCombinedInfoResultPayload
            | null
            | undefined = GAME_STATE.playerState.playFabUserInfo;
          if (playerFabUserInfo) {
            let playerStatics = playerFabUserInfo.PlayerStatistics;
            if (playerStatics) {
              for (const p in playerStatics) {
                const stat: StatisticValue = playerStatics[p];
                log("stat ", stat);
                switch (stat.StatisticName) {
                  case "coinsCollectedEpoch":
                    coinCollectingEpochStat = stat;
                    break;
                  case "coinsCollectedDaily":
                    coinCollectingDailyStat = stat;
                    break;
                  case "coinsMCEarnedDaily":
                    coinsMCEarnedDailyStat = stat;
                }
              }
            }
          }

          //TODO reformat
          //TODO swich to coinsMCEarnedDailyStat // last reset time + 24 hours
          let dateStr =
            GAME_STATE.playerState.playFabUserInfo?.UserReadOnlyData
              ?.coinCollectingEpoch?.Value;
          if (dateStr) {
            log("getTimeFormat dateStr RAW " + dateStr);

            dateStr = dateStr.replace(" GMT", "");
            const dateDT = new Date(dateStr);
            dateStr = dateDT.toISOString();
            //log("getTimeFormat dateStr converted " + dateDT.toISOString())
            //log("getTimeFormat dateStr now " + new Date().toISOString())

            const EPOCH_SIZE = CONFIG.GAME_EPOCH_SIZE_MILLIS;

            //log("getTimeFormat( Date.now() - dateDT.getTime()  ) " + getTimeFormat( Date.now() - dateDT.getTime()  ))
            //log("getTimeFormat(  dateDT.getTime() -Date.now()   ) " + getTimeFormat( (dateDT.getTime() + EPOCH_SIZE) -Date.now()  ))
            dateStr = getTimeFormat(dateDT.getTime() + EPOCH_SIZE - Date.now()); //MAKE A TIMER
            //((dateDT.get + SECONDS_IN_1_DAY) * 1000) - (Date.now())
          }
          pushStrToArr(dailyLeaderArrStr, "Next Epoch", dateStr);
          //todo: review if coincollectingdailystat and next could be undefined
          let dailyCoin = 0;
          if (coinCollectingDailyStat) {
            dailyCoin = coinCollectingDailyStat.Value;
          }

          pushStrToArr(
            dailyLeaderArrStr,
            "Coins Collected Today",
            dailyCoin,
            "0"
          );

          let epochcoin = 0;
          if (coinCollectingEpochStat) {
            epochcoin = coinCollectingEpochStat.Value;
          }
          pushStrToArr(
            dailyLeaderArrStr,
            "Coins Collected Epoch",
            epochcoin,
            "0"
          );
          let mccoin = 0;
          if (coinsMCEarnedDailyStat) {
            mccoin = coinsMCEarnedDailyStat.Value;
          }
          pushStrToArr(
            dailyLeaderArrStr,
            "MetaCash Earned Today",
            concatString(
              [mccoin + "", "/" + CONFIG.GAME_COIN_MC_MAX_PER_DAY],
              "-"
            )
          );
          //pushStrToArr(dailyLeaderArrStr,"Meta Coins:",GAME_STATE.playerState.playFabUserInfo?.UserVirtualCurrency?.MC)

          playerUI.PAGE_1_MENU.updateBulletText(dailyLeaderArrStr);
        }
        break;
    }
  }
);
*/
