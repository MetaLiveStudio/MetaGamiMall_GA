//TODO DELETE THIS FILE all stuff in here should have been migrated to own locations

import * as utils from '@dcl-sdk/utils'
import * as ui from 'dcl-ui-toolkit'
import { CONFIG, initConfig } from "../config";
//import { CustomPrompt } from "src/dcl-scene-ui-workaround/CustomPrompt";
//import resources, { setSection } from "src/dcl-scene-ui-workaround/resources";
import { logChangeListenerEntry } from "../logging";
import { REGISTRY } from "../registry";
import { GameEndResultType, GAME_STATE } from "../state";
import { endGame } from "../gameplay";
import { Color4 } from '@dcl/sdk/math';
import { CustomOptionsPrompt } from '../ui/modals';
import { CustomClaimArgs, CustomClaimPrompt } from '../ui/claimModals';
import { log } from '../back-ports/backPorts';
import { CustomRewardPrompt } from '../ui/rewardPrompts';
//import { RESOURCES } from "./resources";
/*import {
  CustomClaimArgs,
  CustomClaimPrompt,
  CustomOptionsPrompt,
  CustomRewardPrompt,
  InventoryPrompt,
  LevelUpPrompt,
} from "../ui/modals";
*/
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
export const endGamePrompt = new CustomPrompt(ui.PromptStyles.DARKLARGE,400,400)

//endGamePrompt.hide()

endGamePrompt.addText("Play Super Dogerio",0,180,Color4.White(),20)

endGamePrompt.addIcon("images/play-carousel-1.png",0,0,80,80)
endGamePrompt.addIcon("images/play-carousel-2.png",0,0,80,80)

endGamePrompt.addText("Play",0,180,Color4.White(),20)

*/

//initConfig()
/*
const SHIFTY = -30;
const SHIFTY_TEXT = -70;

export const PROMPT_PICKER_WIDTH = 450;
export const PROMPT_PICKER_HEIGHT = 450; //550
export const PROMPT_OFFSET_X = 0; //80//move it away from communications box as cant click thru it
export const PROMPT_OFFSET_Y = 40;
export const MAIN_CONTENT_START_Y = 180;
export const PROMPT_TITLE_HEIGHT = 200 + SHIFTY; //250 + SHIFTY
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

export function initUIEndGame() {
  let buttonPosY = BUTTON_POS_Y;

  const startX = -370;
  const startY = MAIN_CONTENT_START_Y;
  const rowHeight = 30;
  const rowPaddY = 10;
  const colWidth = 200;
  const buttonHeight = BUTTON_HEIGHT;

  let yCounter = startX;
  */
  /*
  const gameTutorialImg = 'images/game/gameTutorial-Img1.png'
  const gameTutorialImgTexture = new Texture(gameTutorialImg);
  const gameTutorialImgDesc = "Game Explaination"
  */

    /*
  const endGameOfPrompt20 = new CustomRewardPrompt("End Current Game","End Current Game\n No progress will be saved.","End Game","","Cancel",""
  ,()=>{
    log('end')
    endGame()
    hideEndGameConfirmPrompt()
  })
  */
  /*
  //MOVED TO ui/claimModals.tsx

  let rewardOpts = { height: 550 };
  const claimRewardPrompt20 = new CustomClaimPrompt({
    imagePath:
      "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x47f8b9b9ec0f676b45513c21db7777ad7bfedb35:0/thumbnail",
    imageWidth: 1024,
    imageHeight: 1024,
    itemName: "Doge Head",
    subtitleItemName: "Created By Metadoge",
    subtitle:
      "The very first wearable created by Metadoge,\nHolder can swap to LiLDoge here",
    title: "HIHGHLIGHTS",
    coins: "x 3000",
    dollars: "x 1000",
    rock1:"x r1",
    rock2:"x r2",
    rock3:"x r3",
    bronze:"x bz1",
    bronzeShoe:"x shoe",
    nitro:"x nit",
    petro:"x p1",
    itemQtyCurrent: 23,
    itemQtyTotal:100,
    options: rewardOpts,
  });
  claimRewardPrompt20.updateData({
    imagePath:
      "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x47f8b9b9ec0f676b45513c21db7777ad7bfedb35:0/thumbnail",
    imageWidth: 1024,
    imageHeight: 1024,
    itemName: "Doge Head",
    subtitleItemName: "Created By Metadoge",
    subtitle:
      "The very first wearable created by Metadoge,\nHolder can swap to LiLDoge here",
    title: "HIHGHLIGHTS",
    coins: "x 99",
    dollars: "x 199",
    rock1:"x r1a",
    rock2:"x r2a",
    rock3:"x r3a",

    bronze:"x bz1",
    bronzeShoe:"x shoe",

    nitro:"x nita",
    petro:"x p1a",
    itemQtyCurrent: 3,
    itemQtyTotal:100,
    options: rewardOpts,
  });

  claimRewardPrompt20.show()
  */
  
  //MOVED TO ui/rewardPrompts
  /*const levelUpPrompt = new LevelUpPrompt("title","text","OK",()=>{}) 
  levelUpPrompt.updateCoins("2")
  levelUpPrompt.updateDollar("3")
  levelUpPrompt.hide()
  REGISTRY.ui.levelUpPrompt = levelUpPrompt;*/

  

  /*
  //MOVED TO ui inventoryModals.tsx
  const inventoryPrompt = new InventoryPrompt("Inventory","inventory text","OK",()=>{
    log("ok clicked")
  })

  inventoryPrompt.updateCoins("1000000")
  inventoryPrompt.updateDollar("3")
  

  inventoryPrompt.updateMaterial1("4")
  inventoryPrompt.updateMaterial2("5")
  inventoryPrompt.updateMaterial3("6")

  inventoryPrompt.updateRock1("11")
  inventoryPrompt.updateRock2("12")
  inventoryPrompt.updateRock3("13")

  inventoryPrompt.updateBronze("14bz")
  inventoryPrompt.updateBronzeShoe("shoe")

  inventoryPrompt.updateNitro("14n")
  inventoryPrompt.updatePetro("15")

  //inventoryPrompt.show()
  
  REGISTRY.ui.inventoryPrompt = inventoryPrompt;*/
  
//}//end initUIEndGame
