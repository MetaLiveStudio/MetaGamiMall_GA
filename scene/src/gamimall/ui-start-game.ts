import * as ui from "@dcl/ui-scene-utils";
import { CONFIG } from "src/config";
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
export const startGamePrompt = new CustomPrompt(ui.PromptStyles.DARKLARGE,400,400)

//startGamePrompt.hide()

startGamePrompt.addText("Play Super Dogerio",0,180,Color4.White(),20)

startGamePrompt.addIcon("images/play-carousel-1.png",0,0,80,80)
startGamePrompt.addIcon("images/play-carousel-2.png",0,0,80,80)

startGamePrompt.addText("Play",0,180,Color4.White(),20)

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

let gameTypeToPlay: string = "main";

export function initUIStartGame() {
  const startX = -370;
  const startY = MAIN_CONTENT_START_Y;
  const rowHeight = 30;
  const rowPaddY = 10;
  const colWidth = 200;
  const buttonHeight = BUTTON_HEIGHT;

  let yCounter = startX;

  const gameTutorialImg = RESOURCES.textures.gameTutorialBg.src;
  const gameTutorialImgTexture = RESOURCES.textures.gameTutorialBg;
  const voxGameTutorialImgTexture = new Texture(
    "images/game/VoxBoardsBackground.png"
  );

  const gameTutorialImgDesc =
    "Coins will pop up \n along the roads (or other areas), touch them to collect!";

  let buttonPosY = BUTTON_POS_Y;
  const startOptions = {
    width: 420,
    modalWidth: -200,
  };
  const startGamePrompt20 = new CustomOptionsPrompt(
    "Start Game",
    gameTutorialImgDesc,
    "Start Game",
    "",
    "Cancel",
    "",
    () => {
      log("play");
      startGame(gameTypeToPlay);
      hideStartGamePrompt();
    },
    undefined,
    startOptions
  );

  const gameImageList_SUPER_DOGERIO: Texture[] = [
    gameTutorialImgTexture,
    gameTutorialImgTexture,
    gameTutorialImgTexture,
    gameTutorialImgTexture,
    gameTutorialImgTexture,
    gameTutorialImgTexture,
  ];

  const gameImageList_VOX_PARK: Texture[] = [
    voxGameTutorialImgTexture,
    voxGameTutorialImgTexture,
    voxGameTutorialImgTexture,
    voxGameTutorialImgTexture,
    voxGameTutorialImgTexture,
  ];

  let gameImageList: Texture[] = gameImageList_SUPER_DOGERIO;

  const gameImageDescList_VOX_PARK: string[] = [
    "(1/5) VoxBux will pop up along the skatepark \n\n Catch as many as you can",
    "(2/5) The top 10 on the WEEKLY LEADERBOARD will win \nPRIZES EVERY SUNDAY",
    "(3/5) During events prizes will be sent to the top 10 on the HOURLY LEADERBOARD \n\nEvents every monday, wednesday and sunday at 10pm UTC",
    "(4/5) Weekly prizes and event prizes\n\n Wearables and other NFTs",
    "(5/5) Prizes\n\n1st Place Prizes\n -1 wearable\n -1 voxboard NFT (Open Sea)\n -1 Extra NFT\n\n2nd to 10th Place Prizes\n -1 voxboard NFT(Open Sea)",
    // "","","","",""
  ];
  const gameImageDescListVtextAlign_VOX_PARK: string[] = [
    "",
    "",
    "",
    "",
    "left",
  ];
  const gameImageDescListFontSize_VOX_PARK: number[] = [0, 0, 0, 0, 16];

  const gameImageDescList_SUPER_DOGERIO: string[] = [
    gameTutorialImgDesc,
    //,"(2/6) There are two \n kinds of tokens in \n Beta Version. \n LilCoins and MetaCash, \n 100 LilCoins = 1 MetaCash"
    //,"(3/6) One player can collect\n 100 MetaCash per day, \nbased on UTC Time, \nyou can check UTC in \nthe bottom right corner."
    //,"(4/6) You can check\n your position in the \ndaily/weekly leaderboard,\n which is the right of your\n screen."
    //,"(5/6) We will hold rewards\n contests in the future,\n so get some practice and\n be ready for the rewards!!!"
    //,"(6/6) Lastly, have fun!!!\n We will keep improving \nthe experience and keep\n thinking about how to\n benefit you!!!"
    "(2/6) There are two kinds of tokens in beta version: LilCoins and MetaCash. 100x LilCoins = 1x MetaCash.",
    "(3/6) A player can collect 100x MetaCash per day, based on UTC Time. You can check the time in the bottom right corner clock.",
    "(4/6) You can check your ranking in the daily & weekly leaderboard, located on the right side panel.",
    "(5/6) We will hold reward contests in the future, so start practicing and get ready for those prizes!!!",
    "(6/6) Lastly, have fun!!! We will keep working to improve the experience and we're constantly thinking of ways to reward our players!",
  ];
  const gameImageDescListVtextAlign_SUPER_DOGERIO: string[] = [
    "",
    "",
    "",
    "",
    "",
  ];
  const gameImageDescListFontSize_SUPER_DOGERIO: number[] = [0, 0, 0, 0, 0];

  let gameImageDescList: string[] = gameImageDescList_SUPER_DOGERIO;
  let gameImageDescListVtextAlign: string[] =
    gameImageDescListVtextAlign_SUPER_DOGERIO;
  let gameImageDescListFontSize: number[] =
    gameImageDescListFontSize_SUPER_DOGERIO;
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
  }

  function openStartGamePrompt(gameType?: string) {
    
    index = 0;
    nextGameImage(-1);
    nextGameImage(1);

    //startGamePrompt.show();
    startGamePrompt20.show();

  }

  function hideStartGamePrompt() {
    //startGamePrompt.hide();
    startGamePrompt20.hide();
  }

  REGISTRY.ui.openStartGamePrompt = openStartGamePrompt;
  REGISTRY.ui.hideStartGamePrompt = hideStartGamePrompt;
}
