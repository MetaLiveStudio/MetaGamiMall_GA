import * as ui from "@dcl/ui-scene-utils";
import { CONFIG, initConfig } from "src/config";
import { CustomPrompt } from "src/dcl-scene-ui-workaround/CustomPrompt";
import resources, { setSection } from "src/dcl-scene-ui-workaround/resources";
import { REGISTRY } from "src/registry";
import { GAME_STATE } from "src/state";
import { CustomOptionsPrompt } from "src/ui/modals";
import { startGame } from "./gameplay";
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
export const loginGamePrompt = new CustomPrompt(ui.PromptStyles.DARKLARGE,400,400)

//loginGamePrompt.hide()

loginGamePrompt.addText("Play Super Dogerio",0,180,Color4.White(),20)

loginGamePrompt.addIcon("images/play-carousel-1.png",0,0,80,80)
loginGamePrompt.addIcon("images/play-carousel-2.png",0,0,80,80)

loginGamePrompt.addText("Play",0,180,Color4.White(),20)

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
  "You must login first.  To login click the 'Login button'.  Make sure you sign the login signature request that pops up.";

export function initUILoginGame() {
  let buttonPosY = BUTTON_POS_Y;

  const loginOptions = {
    width: 420,
    modalWidth: -200,
  };
  const web3ProviderRequiredPrompt = new CustomOptionsPrompt(
    "Login",
    gameTutorialImgDesc,
    "Get Metamask",
    "",
    "Cancel",
    "",
    () => {
      log("get");
      openExternalURL("https://metamask.io/download/");
      hideloginGamePrompt();
    },
    undefined,
    loginOptions
  );
  const loginGamePrompt20 = new CustomOptionsPrompt(
    "Login",
    gameTutorialImgDesc,
    "Login",
    "",
    "Cancel",
    "",
    () => {
      log("login");
      GAME_STATE.playerState.requestDoLoginFlow();
      hideloginGamePrompt();
    },
    undefined,
    loginOptions
  );

  const gameImageList: Texture[] = [
    gameTutorialImgTexture,
    gameTutorialImgTexture,
    gameTutorialImgTexture,
    gameTutorialImgTexture,
    gameTutorialImgTexture,
    gameTutorialImgTexture,
  ];

  const gameImageDescList: string[] = [
    gameTutorialImgDesc,
    //,"(2/6) There are two \n kinds of tokens in \n Beta Version. \n LilCoins and MetaCash, \n 100 LilCoins = 1 MetaCash"
    //,"(3/6) One player can collect\n 100 MetaCash per day, \nbased on UTC Time, \nyou can check UTC in \nthe bottom right corner."
    //,"(4/6) You can check\n your position in the \ndaily/weekly leaderboard,\n which is the right of your\n screen."
    //,"(5/6) We will hold rewards\n contests in the future,\n so get some practice and\n be ready for the rewards!!!"
    //,"(6/6) Lastly, have fun!!!\n We will keep improving \nthe experience and keep\n thinking about how to\n benefit you!!!"
    "(2/6) There are two  kinds of tokens in  Beta Version.  LilCoins and MetaCash,  100 LilCoins = 1 MetaCash",
    "(3/6) One player can collect 100 MetaCash per day, based on UTC Time, you can check UTC in the bottom right corner.",
    "(4/6) You can check your ranking in the daily/weekly leaderboard, which is the right of your screen.",
    "(5/6) We will hold rewards contests in the future, so get some practice and be ready for the rewards!!!",
    "(6/6) Lastly, have fun!!! We will keep improving the experience and keep thinking about how to benefit you!!!",
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
    //gameImage.image.source = gameImageList[index];
    //gameImageSubTitle.text.value = gameImageDescList[index];
  }

  function openloginGamePrompt() {
    //loginGamePrompt.show();

    if (GAME_STATE.playerState.dclUserData?.hasConnectedWeb3) {
      web3ProviderRequiredPrompt.hide();
      loginGamePrompt20.show();

      //btnGetMetaMask.hide();
      //btnLogin.show();
    } else {
      web3ProviderRequiredPrompt.show();
      loginGamePrompt20.hide();

      //btnGetMetaMask.show();
      //btnLogin.hide();
    }

    //FIXME making these invisible also stops them listening!?!?
    // btnNext.image.visible=false
    //btnNext.label.visible = false

    // btnPev.image.visible=false
    // btnPev.label.visible = false
    //btnNext.hide()
    //btnPev.hide()
  }

  function hideloginGamePrompt() {
    //loginGamePrompt.hide();
    loginGamePrompt20.hide()
  }

  REGISTRY.ui.openloginGamePrompt = openloginGamePrompt;
  REGISTRY.ui.hideloginGamePrompt = hideloginGamePrompt;

  //This listener make monkey not work
  /* GAME_STATE.playerState.addChangeListener(
  (key: string, newVal: any, oldVal: any) => {
    log(
      "listener.playerState.ui-leaderboard.ts " +
        key +
        " " +
        newVal +
        " " +
        oldVal
    );

    switch (key) {
      //common ones on top
      case "dclUserData":
        if (GAME_STATE.playerState.dclUserData?.hasConnectedWeb3) {
        } else {
          gameImageSubTitle.text.value =
            "Game requires MetaMask browser extension to play";

          btnLogin.label.value = "Get MetaMask";
          btnLogin
          
          btnLogin.addComponent( () => {
            log("login");
            GAME_STATE.playerState.requestDoLoginFlow();
            hideloginGamePrompt();
          });
}
        break;
    }
  }
);
 */
}
