import * as ui from "@dcl/ui-scene-utils";
import { CONFIG } from "src/config";
import { CustomPrompt } from "src/dcl-scene-ui-workaround/CustomPrompt";
import resources, { setSection } from "src/dcl-scene-ui-workaround/resources";
import { REGISTRY } from "src/registry";
import { GameEndResultType, GAME_STATE } from "src/state";
import { isNull } from "src/utils";
import { refreshUserData } from "./login-flow";
import { RESOURCES } from "./resources";

/*
const entity = new Entity()
entity.addComponent(new GLTFShape('models/Lildoge_NLA.gltf'))
entity.addComponent(new Transform({position:new Vector3(1,1,1)}))

if(!entity.hasComponent(Animator)) entity.addComponentOrReplace(new Animator())
entity.getComponent(Animator).addClip(new AnimationState("Run", { looping: true })))
entity.getComponent(Animator).addClip(new AnimationState("Idle", { looping: true }))

entity.getComponent(Animator).getClip("Run").play()

engine.addEntity(entity)
*/
/*
export const raffleGamePrompt = new CustomPrompt(ui.PromptStyles.DARKLARGE,400,400)

//raffleGamePrompt.hide()

raffleGamePrompt.addText("Play Super Dogerio",0,180,Color4.White(),20)

raffleGamePrompt.addIcon("images/play-carousel-1.png",0,0,80,80)
raffleGamePrompt.addIcon("images/play-carousel-2.png",0,0,80,80)

raffleGamePrompt.addText("Play",0,180,Color4.White(),20)

*/

const SHIFTY = -30;
const SHIFTY_TEXT = -10;

export const PROMPT_PICKER_WIDTH = 530;
export const PROMPT_PICKER_HEIGHT = 500; //550
export const PROMPT_OFFSET_X = 0; //80//move it away from communications box as cant click thru it
export const PROMPT_OFFSET_Y = 40;
export const MAIN_CONTENT_START_Y = 180;
export const PROMPT_TITLE_HEIGHT = 230 + SHIFTY; //250 + SHIFTY
export const PROMPT_TITLE_COLOR = Color4.White();
export const BUTTON_HEIGHT = 60;

export const PROMPT_OVERLAY_TEXT_COLOR = Color4.White();

export const PROMPT_PICKER_OVERLAY_WIDTH = PROMPT_PICKER_WIDTH;
export const PROMPT_PICKER_OVERLAY_HEIGHT = 320;
export const PROMPT_OVERLAY_OFFSET_X = 0;
export const PROMPT_OVERLAY_OFFSET_Y = 60;

export const BUTTON_POS_Y = -120; //-180

const BANNER_SOURCE_WIDTH = 1093; //1038
const BANNER_SOURCE_HEIGHT = 128;
const BANNER_IMAGE_SCALE = 0.3;

const startX = -370;
const startY = MAIN_CONTENT_START_Y;
const rowHeight = 30;
const rowPaddY = 10;
const colWidth = 200;
const buttonHeight = BUTTON_HEIGHT;

let yCounter = startX;

const gameTutorialImg = RESOURCES.textures.gameTutorialBg.src;
const gameTutorialImgTexture = RESOURCES.textures.gameTutorialBg;
const gameTutorialImgDesc =
  "(1/3) Raffle Game.\nIt costs 100 LilCoins (1 MetaCash) To Play.\n Are you feeling lucky!";

let buttonPosY = BUTTON_POS_Y;

//export const agePrompt = new CustomPrompt(CUSTOM_TEXTURE,400,300)
export const raffleGamePrompt = new CustomPrompt(
  RESOURCES.textures.darkThemeSemiTransparent.src,
  PROMPT_PICKER_WIDTH,
  PROMPT_PICKER_HEIGHT
);
if (CONFIG.UI_REPLACE_TEXTURE_WITH_SINGLETON)
  raffleGamePrompt.background.source =
    RESOURCES.textures.darkThemeSemiTransparent; //workaround to try to save textures
setSection(raffleGamePrompt.background, resources.backgrounds.promptBackground);
setSection(raffleGamePrompt.closeIcon, resources.icons.closeD);

raffleGamePrompt.hide();

raffleGamePrompt.background.positionX = PROMPT_OFFSET_X;
raffleGamePrompt.background.positionY = PROMPT_OFFSET_Y;

//why is it behind the background????
//raffleGamePrompt.closeIcon.visible=true
//raffleGamePrompt.closeIcon.positionX = PROMPT_OFFSET_X
//bug where draws behind and too low. have to move it out
raffleGamePrompt.closeIcon.positionY = 310; //310
raffleGamePrompt.closeIcon.positionX = 280; //280

//closeIcon: UIImage = new UIImage(this.background, this.texture)
/*
raffleGamePrompt.closeIcon = new UIImage(raffleGamePrompt.background, raffleGamePrompt.texture)
setSection(raffleGamePrompt.closeIcon, resources.icons.closeW) 
raffleGamePrompt.closeIcon.visible=true
raffleGamePrompt.closeIcon.positionY = 300//310
raffleGamePrompt.closeIcon.positionX = 270//280*/

//need to override its close logic
raffleGamePrompt.closeIcon.onClick = new OnClick(() => {
  hideRaffleGamePrompt();
});

//        this.closeIcon.positionY = height ? height / 2 - 25 : 145

//raffleGamePrompt.addText("Super Dogerio", 0, PROMPT_TITLE_HEIGHT, PROMPT_TITLE_COLOR, 30)

let promptBannerImage = raffleGamePrompt.addIcon(
  RESOURCES.textures.superDogerioBanner.src,
  0,
  PROMPT_TITLE_HEIGHT,
  BANNER_SOURCE_WIDTH * BANNER_IMAGE_SCALE,
  BANNER_SOURCE_HEIGHT * BANNER_IMAGE_SCALE,
  { sourceHeight: BANNER_SOURCE_HEIGHT, sourceWidth: BANNER_SOURCE_WIDTH }
);
if (CONFIG.UI_REPLACE_TEXTURE_WITH_SINGLETON)
  promptBannerImage.image.source = RESOURCES.textures.superDogerioBanner; //workaround to try to save textures

//const pickBoxText:ui.CustomPromptText = raffleGamePrompt.addText("Collect coins, earn MetaCash have fun", 0, PROMPT_TITLE_HEIGHT-20+SHIFTY_TEXT)
//raffleGamePrompt.addText("Collect coins, earn MetaCash", 0, PROMPT_TITLE_HEIGHT-40,undefined,10)

//const eventStatusText:ui.CustomPromptText = raffleGamePrompt.addText("_Event Status_", 200, 260)
//const timeTillNextGiveGive:ui.CustomPromptText = raffleGamePrompt.addText("_NextGiftGive_", 200, 230)

const PLAYER_IMGSHOT_Y = 30; //40

const backdrop_scale = 0; //16 is a little bigger bit fits tight
const image_scale = 0; //16 is a little bigger bit fits tight
//let gameImageBackDrop = raffleGamePrompt.addIcon('images/background.png',0,PLAYER_IMGSHOT_Y,256+backdrop_scale,256+backdrop_scale,{sourceHeight:256,sourceWidth:256})

let gameImage = raffleGamePrompt.addIcon(
  gameTutorialImg,
  0,
  PLAYER_IMGSHOT_Y,
  256 + image_scale,
  256 + image_scale,
  { sourceHeight: 256, sourceWidth: 256 }
);
if (CONFIG.UI_REPLACE_TEXTURE_WITH_SINGLETON)
  gameImage.image.source = gameTutorialImgTexture; //workaround to try to save textures
//raffleGamePrompt.background.opacity = CONFIG.UI_BACKGROUND_OPACITY

let gameImageSubTitle = raffleGamePrompt.addText(
  gameTutorialImgDesc,
  0,
  PLAYER_IMGSHOT_Y,
  Color4.White(),
  18
); //BUTTON_POS_Y + BUTTON_HEIGHT*1.6)
//let gameImageSubTitleAddress = raffleGamePrompt.addText("No Player Selected", 0, BUTTON_POS_Y + BUTTON_HEIGHT*1.2)
gameImageSubTitle.text.width = 256 + image_scale - 30;
gameImageSubTitle.text.height = 256 + image_scale - 50;
gameImageSubTitle.text.textWrapping = true;
gameImageSubTitle.text.vAlign = "center";
gameImageSubTitle.text.hAlign = "center";
//pushes to top and to left
//gameImageSubTitle.text.hTextAlign = 'left'
//gameImageSubTitle.text.vTextAlign = 'top'
//centers it completely
gameImageSubTitle.text.hTextAlign = "center";
gameImageSubTitle.text.vTextAlign = "center";

let btnPev = raffleGamePrompt.addButton(
  "Prev",
  -100,
  buttonPosY,
  () => {
    log("Prev");
    nextGameImage(-1);
  },
  ui.ButtonStyles.E
);
btnPev.hide();

const arrowXOffset = 200;

let btnPrevImg = raffleGamePrompt.addIcon(
  "images/ui/icons8-prev-page-64-E2-wt.png",
  arrowXOffset * -1,
  64 - 16,
  64,
  128,
  { sourceHeight: 128, sourceWidth: 64 }
);
btnPrevImg.image.onClick = new OnClick(() => {
  log("Prev");
  nextGameImage(-1);
});

let btnNext = raffleGamePrompt.addButton(
  "Next",
  100,
  buttonPosY,
  () => {
    log("Next");
    nextGameImage(1);
  },
  ui.ButtonStyles.F
);
btnNext.hide();

let btnNextImg = raffleGamePrompt.addIcon(
  "images/ui/icons8-next-page-64-F2-wt.png",
  arrowXOffset,
  64 - 16,
  64,
  128,
  { sourceHeight: 128, sourceWidth: 64 }
);
btnNextImg.image.onClick = new OnClick(() => {
  log("Next");
  nextGameImage(1);
});

Input.instance.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, false, (e) => {
  if (
    !btnPev.image.visible &&
    +Date.now() - raffleGamePrompt.UIOpenTime > 100
  ) {
    //onClick()
    nextGameImage(-1);
  }
});
//} else if (style == ButtonStyles.F) {
Input.instance.subscribe("BUTTON_DOWN", ActionButton.SECONDARY, false, (e) => {
  if (
    !btnNext.image.visible &&
    +Date.now() - raffleGamePrompt.UIOpenTime > 100
  ) {
    nextGameImage(1);
  }
});

let btnSendGift = raffleGamePrompt.addButton(
  "Play",
  100,
  buttonPosY - buttonHeight,
  () => {
    log("play");

    if (isNull(GAME_STATE.playerState.playFabLoginResult)) {
      log("player not logged in yet");
      ui.displayAnnouncement("Player not logged in yet");
      hideRaffleGamePrompt();
      REGISTRY.ui.openloginGamePrompt();
    } else {
      showPlayResultsUI(true);
    }
    //start game.
    //hideRaffleGamePrompt()
  },
  ui.ButtonStyles.ROUNDGOLD
);

let btnCancel = raffleGamePrompt.addButton(
  "Cancel",
  -100,
  buttonPosY - buttonHeight,
  () => {
    log("No");
    //raffleGamePrompt.hide()
    hideRaffleGamePrompt();
    ///showPickerPrompt()
  }
  //ui.ButtonStyles.F
);
/*
const input = Input.instance
input.subscribe("BUTTON_DOWN", ActionButton.SECONDARY, false, (e) => {
  log("pointer Down", e)
  nextGameImage(1)
})
input.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, false, (e) => {
  log("pointer Down", e)
  nextGameImage(-1)
})*/

const gameImageList: Texture[] = [
  gameTutorialImgTexture,
  gameTutorialImgTexture,
  //,gameTutorialImgTexture
  //,gameTutorialImgTexture
  //,gameTutorialImgTexture
  //,gameTutorialImgTexture
];

const gameImageDescList: string[] = [
  gameTutorialImgDesc,
  //,"(2/6) There are two \n kinds of tokens in \n Beta Version. \n LilCoins and MetaCash, \n 100 LilCoins = 1 MetaCash"
  //,"(3/6) One player can collect\n 100 MetaCash per day, \nbased on UTC Time, \nyou can check UTC in \nthe bottom right corner."
  //,"(4/6) You can check\n your position in the \ndaily/weekly leaderboard,\n which is the right of your\n screen."
  //,"(5/6) We will hold rewards\n contests in the future,\n so get some practice and\n be ready for the rewards!!!"
  //,"(6/6) Lastly, have fun!!!\n We will keep improving \nthe experience and keep\n thinking about how to\n benefit you!!!"
  "(2/3) Play for a chance to win up to double your bet.",
  "(3/3) There are two kinds of tokens in beta version: LilCoins and MetaCash. 100x LilCoins = 1x MetaCash.",
  //,"(3/6) A player can collect 100x MetaCash per day, based on UTC Time. You can check the time in the bottom right corner clock."
  //,"(4/6) You can check your ranking in the daily & weekly leaderboard, located on the right side panel."
  //,"(5/6) We will hold reward contests in the future, so start practicing and get ready for those prizes!!!"
  //,"(6/6) Lastly, have fun!!! We will keep working to improve the experience and we're constantly thinking of ways to reward our players!"
];

let index = 0;
function nextGameImage(dir: number) {
  if (dir > 0) {
    if (gameImageList.length > index + dir) {
      index += dir;
    } else {
      index = 0;
    }
  } else {
    if (index + dir >= 0) {
      index += dir;
    } else {
      index = gameImageList.length - 1;
    }
  }
  log(
    "index " +
      index +
      " dir " +
      dir +
      " " +
      gameImageList.length +
      " " +
      (gameImageList.length < index + dir)
  );
  //GAME_STATE.setPickedPlayerId( gameImageList[index] )
  gameImage.image.source = gameImageList[index];
  gameImageSubTitle.text.value = gameImageDescList[index];
}

export function openRaffleGamePrompt() {
  raffleGamePrompt.show();

  //FIXME making these invisible also stops them listening!?!?
  btnNext.image.visible = false;
  btnNext.label.visible = false;

  btnPev.image.visible = false;
  btnPev.label.visible = false;
  //btnNext.hide()
  //btnPev.hide()
}

export function hideRaffleGamePrompt() {
  raffleGamePrompt.hide();
}

export const playResultsPrompt = new CustomPrompt(
  RESOURCES.textures.darkThemeSemiTransparent.src,
  400,
  400
);
//export const startGamePrompt = new CustomPrompt(RESOURCES.textures.darkThemeSemiTransparent.src,PROMPT_PICKER_WIDTH,PROMPT_PICKER_HEIGHT)
if (CONFIG.UI_REPLACE_TEXTURE_WITH_SINGLETON)
  playResultsPrompt.background.source =
    RESOURCES.textures.darkThemeSemiTransparent; //workaround to try to save textures
setSection(
  playResultsPrompt.background,
  resources.backgrounds.promptBackground
);
setSection(playResultsPrompt.closeIcon, resources.icons.closeD);

playResultsPrompt.hide();

const bgicon = playResultsPrompt.addIcon(
  RESOURCES.textures.loadingBg.src,
  0,
  PLAYER_IMGSHOT_Y,
  256 + image_scale,
  256 + image_scale,
  { sourceHeight: 256, sourceWidth: 256 }
);
if (CONFIG.UI_REPLACE_TEXTURE_WITH_SINGLETON)
  bgicon.image.source = RESOURCES.textures.loadingBg; //workaround to try to save textures

//70 just above
//30 == cursor
const loadingText = playResultsPrompt.addText(
  "RESULTS...",
  0,
  100,
  Color4.White(),
  22
);

const playResults = playResultsPrompt.addText("....", 0, 0, Color4.White(), 18);
//let gameImageSubTitleAddress = startGamePrompt.addText("No Player Selected", 0, BUTTON_POS_Y + BUTTON_HEIGHT*1.2)
playResults.text.width = 256 + image_scale - 30;
playResults.text.height = 256 + image_scale - 50;
playResults.text.textWrapping = true;
playResults.text.vAlign = "center";
playResults.text.hAlign = "center";
//pushes to top and to left
//gameImageSubTitle.text.hTextAlign = 'left'
//gameImageSubTitle.text.vTextAlign = 'top'
//centers it completely
playResults.text.hTextAlign = "center";
playResults.text.vTextAlign = "center";

let bntClose = playResultsPrompt.addButton(
  "OK",
  0,
  -150, //buttonPosY - buttonHeight,
  () => {
    //log('play')
    showPlayResultsUI(false);
    //start game.
    //hideRaffleGamePrompt()
  },
  ui.ButtonStyles.ROUNDGOLD
);

//export const loadingIcon = new ui.LoadingIcon(DEFAULT_LOAD_ICON_DURATION)
//loadingIcon.hide()

export function showPlayResultsUI(val: boolean, duration?: number) {
  log("showLoadingUI START ", val, duration);

  //log("showLoadingUI  " + loadingIcon.image.visible)

  playResults.text.value = "...";

  if (val) {
    playResultsPrompt.show();

    playRaffle().then((result: GameEndResultType) => {
      if (!result.raffleResult) {
        playResults.text.value = "Unexpected response";
        return;
      }
      if (!result.raffleResult.hasEnoughToPlay) {
        playResults.text.value = "You do not have enough to play :(";
        return;
      }
      let refreshData = false;
      if (result.raffleResult.amountWon < 0) {
        playResults.text.value =
          "You lost " + result.raffleResult.amountWon + " :(";
        refreshData = true;
      } else if (result.raffleResult.amountWon == 0) {
        playResults.text.value = "You broke even :)";
      } else {
        playResults.text.value =
          "You won " + result.raffleResult.amountWon + " :)";
        refreshData = true;
      }

      if (refreshData) {
        refreshUserData();
      }
    });
  } else {
    playResultsPrompt.hide();
  }

  //new ui.LoadingIcon(DEFAULT_LOAD_ICON_DURATION,50,50)

  /*if(val && duration && duration !== undefined ){
    utils.setTimeout(
        duration ? duration : DEFAULT_LOAD_ICON_DURATION, () => {
          log("showLoadingUI hide timer fired")
          playResultsPrompt.hide()
        }
    )
  }*/
}

const customBaseUrl = CONFIG.RAFFLE_URL;
export async function playRaffle(): Promise<GameEndResultType> {
  const METHOD_NAME = "playRaffle";
  const resultPromise = executeTask(async () => {
    let response = null;
    //https://us-central1-sandbox-query-blockchain.cloudfunctions.net/blockChainQueryApp/get-account-nft-balance?network=
    //https://us-central1-sandbox-query-blockchain.cloudfunctions.net/blockChainQueryApp/get-account-nft-balance?network=matic&ownerAddress=WALLET-HERE&limit=9&logLevel=debug&storage=cacheX&multiCall=true&contractId=dcl-mtdgpnks
    const callUrl =
      customBaseUrl +
      "?" +
      //const callUrl= customBaseUrl + '/blockChainQueryApp/hello-world?'
      "&playFabId=" +
      GAME_STATE.playerState.playFabLoginResult?.PlayFabId + //GAME_STATE.playerState.playerPlayFabId
      "&session=" +
      GAME_STATE.playerState.playFabLoginResult?.SessionTicket +
      //+'&publicKey=' + GAME_STATE.playerState.dclUserData?.publicKey
      "&_unique=" +
      new Date().getTime();

    try {
      log(METHOD_NAME + " calling " + callUrl);
      response = await fetch(callUrl, {
        //headers: { "Content-Type": "application/json" },
        method: "GET",
        //body: JSON.stringify(myBody),
      });
      if (response.status == 200) {
        let json = await response.json();

        //log(json)
        log(METHOD_NAME + " reponse ", json);
        const retVal = json[0].endGameResult;
        log(METHOD_NAME + " reponse ", retVal);
        return retVal;
      } else {
        let json = await response.json();
        //log("NFTRepository reponse " + response.status + " " + response.statusText)
        log(
          METHOD_NAME +
            " error reponse to reach URL status:" +
            response.status +
            " text:" +
            response.statusText +
            " json:" +
            JSON.stringify(json)
        );
        //throw new Error(response.status + " " + response.statusText)
        return {
          errorMsg: response.status + " " + response.statusText + " " + json,
        };
      }
    } catch (e) {
      log(METHOD_NAME + ".failed to reach URL " + e + " " + response);
      throw e;
    }
  });

  return resultPromise;
}
