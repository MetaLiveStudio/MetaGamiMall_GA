
import { createChannel } from "../node_modules/decentraland-builder-scripts/channel";
import { isPreviewMode } from '@decentraland/EnvironmentAPI'
import { triggerEmote, PredefinedEmote } from '@decentraland/RestrictedActions'
import * as Ads from "@adshares/decentraland";
import { metaAds } from './metaAds/MetaAds'
import { createInventory } from "../node_modules/decentraland-builder-scripts/inventory";
import {
  addPets,
  addRobots,
  getNpcPosition,
  npcs_parent,
} from "./npc/npcBuilder";
import {
  getUserData,
  getUserPublicKey,
  UserData,
} from "@decentraland/Identity";
//import { loadArcade } from '../arcade-games/src/game'
import { logChangeListenerEntry, Logger } from "./logging";
import { getEntityBy, getEntityByName, isNull, notNull } from "./utils";
import { AudioControlBar } from "./dclconnect/index";
import { loadUIBars } from "./ui-bars";
import AvatarSwapScript, { //old name Script12 //385445f9-b94f-431a-8c67-7650c03c99cc
  disableArisa,
  enableArisa,
  prepareHostForTrigger,
  PrepareHostForTriggerResult,
} from "src/smartItems/avatar-swap/src/item"; ///from "../385445f9-b94f-431a-8c67-7650c03c99cc/src/item";
import * as utils from "@dcl/ecs-scene-utils";
import { movePlayerTo } from "@decentraland/RestrictedActions";
import PoapBoothScript from "src/smartItems/poap-booth/src/item";//from "../bcebce0f-1873-4148-89bc-24c2ceb9b2cc/src/item"; //bring ME BACK!!!//X
import ToolboxScript, { //old name Script13
  createTargetList,
} from "src/smartItems/tool-box/src/item"; //old folder /683aa047-8043-40f8-8d31-ceb7ab1b1300
import VideoScreenScript from "src/smartItems/stream-preview/src/item"; //old name Script17, old folder /a747f104-5434-42a8-a543-8739c24cf253 //X
import LeaderBoardScript from "src/smartItems/leader-board/src/item"; //old name Script18, old folder /a5c32dfc-27c5-416b-bfbb-f66f871c8ea7 //X
import { loadNftFrames, _scene2 } from "./nft-frames";
import { AVATAR_SWAP_WEARABLES, CONFIG, initConfig } from "./config";
import { GAME_STATE, initGameState } from "./state";
import { handleDelayLoad } from "./delay-loader";
import { getUserDataFromLocal, getAndSetUserData } from "./userData";
import {
  makeLeaderboard
} from "./gamimall/leaderboard";

import { Spawner } from "node_modules/decentraland-builder-scripts/spawner";
import { NPC_INSTANCES } from "./npc/npcConstants";
import { AliceDialog } from "./npc/dialogData";
import { GameSceneManager } from "./modules/sceneMgmt/gameSceneManager";
import { Scene } from "./modules/sceneMgmt/scene";
import {
  BaseEntityWrapper,
  SceneEntity,
  SubScene,
} from "./modules/sceneMgmt/subScene";
import { BlockObject, EthBlockFilter } from "eth-connect";
import { NPC } from '@dcl/npc-scene-utils'
import { OscilateComponent } from "./actions/oscilateComponent";
import { CommonResources } from "./resources/common";
import { initGamiMallScene } from "./gamimall/scene";
import { initRegistry, REGISTRY } from "./registry";
import { initUIGameHud } from "./gamimall/ui-game-hud";
import { initUIStartGame } from "./gamimall/ui-start-game";
import { initUIEndGame } from "./gamimall/ui-end-game";
import { initUILoginGame } from "./gamimall/ui-login-game";
import { initResourceDropIns } from "./store/resources-dropin";
import { initWearableStore } from "./store/wearables";
import { initAltScene } from "./modules/sceneMgmt/scenes/alternativeScene";
import { startDecentrally } from "./meta-decentrally/game";
import { addAutoPlayerLoginTrigger } from "./autologin";
import { initSecondAltScene } from "./modules/sceneMgmt/scenes/secondAlternativeScene";
import { SceneNames } from "./modules/sceneMgmt/scenes/sceneNames";
import { getHelmetBalance, NftBalanceResponse, updateStoreNFTCounts } from "./store/fetch-utils";
import { LogoBlackBackground,Howtoplayposter,Entryposter1Close,Entryposter1text } from "./ui/ui_background";
import {getUserAccount} from '@decentraland/EthereumController'
import {getParcel, ILand} from "@decentraland/ParcelIdentity";
import {MetaViuAd, MetaViuEvent} from "./MetaViu/MetaViuAd"
import { initUIRaffle } from "./gamimall/ui-play-raffle";
import { registerLoginFlowListener } from "./gamimall/login-flow";
import { i18n, i18nOnLanguageChangedAdd } from "src/i18n/i18n";
import { namespaces } from "src/i18n/i18n.constants";
import { LEADERBOARD_REGISTRY, PlayerLeaderboardEntryType } from "./gamimall/leaderboard-utils";
// FIXME refactor so gameplay can be imported and explicitly invoked Import the custom gameplay code.
//import "./gamimall/gameplay";

//START COMMON VARS
const metadoge2dHoverText = "Mint Here";
//END COMMON VARS

export let avatarSwapScript2InstExport: AvatarSwapScript;

export let gameSceneManager: GameSceneManager;

//FIXME, move somewhere better
let mainScene: Scene;
let alternativeScene: Scene;
let secondaryAlternativeScene: Scene;

function loadPrimaryScene() {
  const _scene = new Entity("_scene");
  engine.addEntity(_scene);
  const transform = new Transform({
    position: new Vector3(5 * 16, 0, 0), //-6*16
    //rotation: new Quaternion(0, 0, 0, 1),
    rotation: Quaternion.Euler(0, -90, 0),
    scale: new Vector3(1, 1, 1),
  });
  _scene.addComponentOrReplace(transform);
/*
  const text = new Entity("text");
  engine.addEntity(text);
  text.setParent(_scene);
  const transform32 = new Transform({
    position: new Vector3(67, 15, 20.5),
    rotation: new Quaternion(
      0.026984253898262978,
      0.1554890125989914,
      0.16405515372753143,
      0.9737458825111389
    ),
    scale: new Vector3(0.9999997615814209, 1, 1.0000003576278687),
  });
  text.addComponentOrReplace(transform32);
  const gltfShape2 = new GLTFShape(
    "cb175f01-f0c5-4bde-b8c3-ad131a50fd3c/Text.glb"
  );
  gltfShape2.withCollisions = true;
  gltfShape2.isPointerBlocker = true;
  gltfShape2.visible = true;
  text.addComponentOrReplace(gltfShape2);
*/

const MGMPlanetStageTeleporter = new Entity("MGMPlanetStageTeleporter");
MGMPlanetStageTeleporter.setParent(_scene);
  const transformCS108 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  MGMPlanetStageTeleporter.addComponentOrReplace(transformCS108);
  const gltfShapeCS108 = new GLTFShape("models/Teleporter/Stageteleporter.glb");
  MGMPlanetStageTeleporter.addComponentOrReplace(gltfShapeCS108);
  MGMPlanetStageTeleporter.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://play.decentraland.org/world/MGMPlanetStage")
      },
      { hoverText: i18n.t("hoverVisitMGMPlanetStage",{ns:namespaces.ui.hovers}) }
    ));
  engine.addEntity(MGMPlanetStageTeleporter);

//MetaViu Start

const metaViuPanel = new MetaViuAd("panel",104, null, 19,2.5,6,    0,90,0,  0.8,0.8,0.8)
const metaViuPanel2 = new MetaViuAd("panel",113, null, 28,2.5,15,    0,0,0,  0.8,0.8,0.8)
const metaViuPanel3 = new MetaViuAd("panel",196, null, 28,33.5,56.05,    0,90,0,  0.8,0.8,0.8)
const metaViuPanel4 = new MetaViuAd("panel",197, null, 61.35,15,56.05,    0,90,0,  0.8,0.8,0.8)
const metaViuPanel5 = new MetaViuAd("panel",200, null, 28,2.5,33,    0,0,0,  0.8,0.8,0.8)
const metaViuPanel6 = new MetaViuAd("panel",201, null, 33.5,51.5,66.17,    0,0,0,  0.8,0.8,0.8)

//MetaViu End
//Adshare Start

const agent = Ads.SupplyAgent.fromWallet('https://app.web3ads.net', 'bsc', '0x05060Fa97e54a812d1E15cEc6c34e79f74eBD0b3')

const placement1 = new Ads.PlainPlacement('unit1', {
  position: new Vector3(28.12, 3, 21),
  rotation: Quaternion.Euler(0, -90, 0),
  width: 5,
  ratio: '16:9',
})
engine.addEntity(placement1)

const placement2 = new Ads.PlainPlacement('unit2', {
  position: new Vector3(67, 3, 56),
  rotation: Quaternion.Euler(0, 90, 0),
  width: 5,
  ratio: '16:9',
})
engine.addEntity(placement2)

agent.addPlacement(placement1, placement2).spawn()

//Adshare End

//MetaAds Start

// These control arrays will be passed into the MetaAds class constructor,
// to control the placement and content for MetaAds ad displays.

// Positions of screens in 3-dimension space
// position is a 3D vector, it sets the position of the entity's center on all three axes, stored as a Vector3 object
const metaAdsPositions: Vector3[] = [
  new Vector3(21, 33, 50)
]
// Rotations of screens
// Euler angles, the more common x, y and z notation with numbers that go from 0 to 360
const metaAdsImageRotations: Quaternion[] = [
  Quaternion.Euler(0, 90, 180)
]
// Scales of screens
const metaAdsScales: Vector3[] = [
  new Vector3(5, 3, 1)
]

// PINs for displays
const metaAdsPins: number[] = [
  509694
]

// Parent entities of display(s)
// NB: Supply the parent entity of a display, if there is one, else null
const metaAdsParentEntities: Array<Entity | null> = [
  null
]

// Now instantiate the MetaAds system that uses those control arrays
new metaAds(metaAdsPositions, metaAdsImageRotations, metaAdsScales, metaAdsPins, metaAdsParentEntities) 


//MetaAds End

  const poapBooth = new Entity("poapBooth");
  engine.addEntity(poapBooth);
  poapBooth.setParent(_scene);
  const transform53 = new Transform({
    position: new Vector3(8, 0.8, 8.25),
    rotation: Quaternion.Euler(0, -90, 0),
    scale: new Vector3(1.5, 1.5, 1.5),
  });
  poapBooth.addComponentOrReplace(transform53);

  

  const pad = new Entity("pad");
  engine.addEntity(pad);
  pad.setParent(_scene);
  const transform54 = new Transform({
    position: new Vector3(
      25.78313446044922,
      0.8795676231384277,
      49.322696685791016
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  pad.addComponentOrReplace(transform54);
  const gltfShape4 = new GLTFShape(
    "models/Pad3.gltf"
  );
  gltfShape4.withCollisions = true;
  gltfShape4.isPointerBlocker = true;
  gltfShape4.visible = true;
  pad.addComponentOrReplace(gltfShape4);

  pad.addComponent(new Animator());
  const padAnimatorStat = new AnimationState("Pad.001Action.002", {});
  pad.getComponent(Animator).addClip(padAnimatorStat);
  padAnimatorStat.stop();

  REGISTRY.entities.pad = { entity: pad, moveAnimState: padAnimatorStat };
  REGISTRY.entities.pad.moveAnimState.speed = .6

  function resetPad() {
    padAnimatorStat.reset();
    //must play to move it
    padAnimatorStat.play(true);
    pad.addComponentOrReplace(
      //must give it a second, some bug with animation
      //cause it to start off/ahead by a few meters
      //must let it start playing to solve it
      new utils.Delay(1000, () => {
        //pause it immeidatly
        padAnimatorStat.pause();
      })
    );
  }

  resetPad(); //so in intial state

  const padSummon = new Entity("padSummon");
  engine.addEntity(padSummon);
  padSummon.setParent(_scene);
  const transform54X = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  padSummon.addComponentOrReplace(transform54X);
  const gltfShapeCS21 = new GLTFShape("models/summonpad.glb");
  padSummon.addComponentOrReplace(gltfShapeCS21);

  padSummon.addComponent(
    new OnPointerDown(
      () => {
        resetPad();
        movePlayerTo({ x:30.41, y: 8, z: 25.8 }, { x:30.41, y: 2, z: 15.44 });
      },
      {
        hoverText: "Summon Pad",
      }
    )
  );
  /*
  const plainText10 = new Entity("plainText10");
  engine.addEntity(plainText10);
  plainText10.setParent(_scene);
  const transform55 = new Transform({
    position: new Vector3(65, 32.5, 37.5),
    rotation: new Quaternion(
      -4.149367074978219e-15,
      0.72709721326828,
      -8.667674222806454e-8,
      -0.6865345239639282
    ),
    scale: new Vector3(4.748433589935303, 4.748416423797607, 2.780848264694214),
  });
  plainText10.addComponentOrReplace(transform55);*/

  const npcPlaceHolder = new Entity("npcPlaceHolder");
  engine.addEntity(npcPlaceHolder);
  npcPlaceHolder.setParent(_scene);
  const transform79 = new Transform({
    position: new Vector3(30, 23.4, 56.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  npcPlaceHolder.addComponentOrReplace(transform79);



  //START REDBALL WAYPOINT//START REDBALL WAYPOINT
  //17, 23.8, 65.50
  //17, 23.8, 24.8
  const redBallY = 24;
  const redBallZ = 62.5; //23
  const redBallXPadd = 0.2;
  const waypointCERedBall2b = new Entity("waypointCERedBall2b");
  engine.addEntity(waypointCERedBall2b);
  waypointCERedBall2b.setParent(_scene);
  waypointCERedBall2b.addComponentOrReplace(
    new Transform({
      position: new Vector3(62, redBallY, redBallZ + redBallXPadd),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    })
  );

  const waypointCERedBall2 = new Entity("waypointCERedBall2");
  engine.addEntity(waypointCERedBall2);
  waypointCERedBall2.setParent(_scene);
  waypointCERedBall2.addComponentOrReplace(
    new Transform({
      position: new Vector3(62, redBallY, redBallZ + 0),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    })
  );

  const waypointCERedBall1b = new Entity("waypointCERedBall1b");
  engine.addEntity(waypointCERedBall1b);
  waypointCERedBall1b.setParent(_scene);
  waypointCERedBall1b.addComponentOrReplace(
    new Transform({
      position: new Vector3(32, redBallY, redBallZ + redBallXPadd),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    })
  );

  const waypointCERedBall1 = new Entity("waypointCERedBall1");
  engine.addEntity(waypointCERedBall1);
  waypointCERedBall1.setParent(_scene);
  waypointCERedBall1.addComponentOrReplace(
    new Transform({
      position: new Vector3(32, redBallY, redBallZ + 0),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    })
  );

  //END REDBALL WAYPOINT//END REDBALL WAYPOINT
  //END REDBALL WAYPOINT//END REDBALL WAYPOINT

  const waypointCE = new Entity("waypointCE");
  engine.addEntity(waypointCE);
  waypointCE.setParent(_scene);
  const transform80 = new Transform({
    position: new Vector3(48, 23, 57.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  waypointCE.addComponentOrReplace(transform80);

  const waypointCE2 = new Entity("waypointCE2");
  engine.addEntity(waypointCE2);
  waypointCE2.setParent(_scene);
  const transform81 = new Transform({
    position: new Vector3(48.5, 4.5, 25.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  waypointCE2.addComponentOrReplace(transform81);

  const waypointCE3 = new Entity("waypointCE3");
  engine.addEntity(waypointCE3);
  waypointCE3.setParent(_scene);
  const transform82 = new Transform({
    position: new Vector3(54.5, 30.5, 34.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  waypointCE3.addComponentOrReplace(transform82);

  const npcPlaceHolder3 = new Entity("npcPlaceHolder3");
  engine.addEntity(npcPlaceHolder3);
  npcPlaceHolder3.setParent(_scene);
  const transform83 = new Transform({
    position: new Vector3(63.5, 52, 57),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  npcPlaceHolder3.addComponentOrReplace(transform83);

  const npcPlaceHolder4 = new Entity("npcPlaceHolder4");
  engine.addEntity(npcPlaceHolder4);
  npcPlaceHolder4.setParent(_scene);
  const transform84 = new Transform({
    position: new Vector3(56.5, 31, 14),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  npcPlaceHolder4.addComponentOrReplace(transform84);

  const npcPlaceHolder5 = new Entity("npcPlaceHolder5");
  engine.addEntity(npcPlaceHolder5);
  npcPlaceHolder5.setParent(_scene);
  const transform85 = new Transform({
    position: new Vector3(35.5, 4.189321041107178, 23.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  npcPlaceHolder5.addComponentOrReplace(transform85);

  const waypointCE4 = new Entity("waypointCE4");
  engine.addEntity(waypointCE4);
  waypointCE4.setParent(_scene);
  const transform86 = new Transform({
    position: new Vector3(47.5, 50, 57.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  waypointCE4.addComponentOrReplace(transform86);

  const npcPlaceHolder2 = new Entity("npcPlaceHolder2");
  engine.addEntity(npcPlaceHolder2);
  npcPlaceHolder2.setParent(_scene);
  const transform89 = new Transform({
    position: new Vector3(5.5, 0.3, 13),
    rotation: Quaternion.Euler(0, 220, 0),
    scale: new Vector3(1.5, 1.5, 1.5),
  });
  npcPlaceHolder2.addComponentOrReplace(transform89);

  const waypointCE5 = new Entity("waypointCE5");
  engine.addEntity(waypointCE5);
  waypointCE5.setParent(_scene);
  const transform90 = new Transform({
    position: new Vector3(9.5, 1.0352280139923096, 57.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  waypointCE5.addComponentOrReplace(transform90);

  const avatarSwap = new Entity("avatarSwap");
  engine.addEntity(avatarSwap);
  avatarSwap.setParent(_scene);
  const transform116 = new Transform({
    position: new Vector3(27, 4, 43),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  avatarSwap.addComponentOrReplace(transform116);

  const toolboxCE = new Entity("toolboxCE");
  engine.addEntity(toolboxCE);
  toolboxCE.setParent(_scene);
  const transform117 = new Transform({
    position: new Vector3(4, 0, 45.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  toolboxCE.addComponentOrReplace(transform117);

  const videoStream1 = new Entity("videoStream1");
  engine.addEntity(videoStream1);
  videoStream1.setParent(_scene);
  const transformv1 = new Transform({
    position: new Vector3(63.2, 5.9, 39.9),
    rotation: Quaternion.Euler(0, -90, 0),
    scale: new Vector3(2.7, 3.4, 2.75),
  });
  videoStream1.addComponentOrReplace(transformv1);



  
  const main = new Entity("main");
  engine.addEntity(main);
  main.setParent(_scene);
  const transform158 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  main.addComponentOrReplace(transform158);
  const gltfShape11 = new GLTFShape(
    "models/mains/main.glb"
  );
  gltfShape11.withCollisions = true;
  gltfShape11.isPointerBlocker = true;
  gltfShape11.visible = true;
  main.addComponentOrReplace(gltfShape11);

  const ExchangeCenter = new Entity("ExchangeCenter");
  engine.addEntity(ExchangeCenter);
  ExchangeCenter.setParent(_scene);
  const transformCS107 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  ExchangeCenter.addComponentOrReplace(transformCS107);
  const gltfShapeCS107= new GLTFShape(
    "models/mains/ExchangeCenter.glb"
  );
  ExchangeCenter.addComponentOrReplace(gltfShapeCS107);

  const Entrancerock = new Entity("Entrancerock");
  engine.addEntity(Entrancerock);
  Entrancerock.setParent(_scene);
  const transformCS109 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  Entrancerock.addComponentOrReplace(transformCS109);
  const gltfShapeCS109= new GLTFShape(
    "models/entrancerock.glb"
  );
  Entrancerock.addComponentOrReplace(gltfShapeCS109);
  Entrancerock.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 20, y: 2, z: 20 }, { x: 8, y: 1, z: 8 });
      },
      {  hoverText:  i18n.t("hoverMineField",{ns:namespaces.ui.hovers}), }
    )
  );


  const myTexture = new Texture("images/HowtoPlay.png")
  const myMaterial = new BasicMaterial()
  myMaterial.texture  = myTexture

  const Guidebook = new Entity("Guidebook");
  engine.addEntity(Guidebook);
  Guidebook.setParent(_scene);
  const transformCS110 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  Guidebook.addComponentOrReplace(transformCS110);
  const gltfShapeCS110= new GLTFShape(
    "models/Guidebook.glb"
  );
  Guidebook.addComponentOrReplace(gltfShapeCS110);
  Guidebook.addComponent(myMaterial)
  Guidebook.addComponent(
    new OnPointerDown((e) => {
      log("Howtoplay was clicked", e)
      Howtoplayposter.visible = true
      Entryposter1Close.visible = true
      Entryposter1text.visible = true
    },
    {
      hoverText:  i18n.t("hoverPoster",{ns:namespaces.ui.hovers}),
      distance: 10,
    }
  ));

/*
  const Howtoplay = new Entity()
  Howtoplay.addComponent(new PlaneShape())
  Howtoplay.setParent(_scene);
  const transformCS99 = new Transform({
    position: new Vector3(13.35, 4.48, 23.75),
    rotation: Quaternion.Euler(180,-90,0),
    scale: new Vector3(13.2, 6.5, 7),
  });
  Howtoplay.addComponentOrReplace(transformCS99);
  
  Howtoplay.addComponent(myMaterial)
  Howtoplay.addComponent(
    new OnPointerDown((e) => {
      log("Howtoplay was clicked", e)
      Howtoplayposter.visible = true
      Entryposter1Close.visible = true
      Entryposter1text.visible = true
    },
    {
      hoverText:  i18n.t("hoverPoster",{ns:namespaces.ui.hovers}),
      distance: 10,
    }
  ));
*/
  const Howtoplay2 = new Entity()
  Howtoplay2.addComponent(new PlaneShape())
  Howtoplay2.setParent(_scene);
  const transformCS100 = new Transform({
    position: new Vector3(42.4, 3.47, 60.8),
    rotation: Quaternion.Euler(180,-90,0),
    scale: new Vector3(13.2*0.59, 6.5*0.6, 7*0.6),
  });
  Howtoplay2.addComponentOrReplace(transformCS100);
  Howtoplay2.addComponent(myMaterial)
  Howtoplay2.addComponent(
    new OnPointerDown((e) => {
      log("Howtoplay was clicked", e)
      Howtoplayposter.visible = true
      Entryposter1Close.visible = true
      Entryposter1text.visible = true
    },
    {
      hoverText:  i18n.t("hoverPoster",{ns:namespaces.ui.hovers}),
      distance: 10,
    }
  ));

  


//loadMainBuildingFn() //call imme

  const teleportermuscle = new Entity("teleportermuscle");
  engine.addEntity(teleportermuscle);
  teleportermuscle.setParent(_scene);
  const transformCS20 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  teleportermuscle.addComponentOrReplace(transformCS20);
  const gltfShapeCS20 = new GLTFShape("models/Teleporter/Musclesquare.glb");
  gltfShapeCS20.withCollisions = true;
  gltfShapeCS20.isPointerBlocker = true;
  gltfShapeCS20.visible = true;
  teleportermuscle.addComponentOrReplace(gltfShapeCS20);
  teleportermuscle.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 56, y: 5, z: 48 }, { x: 8, y: 1, z: 8 });
      },
      {  hoverText:  i18n.t("hoverMuscle",{ns:namespaces.ui.hovers}), }
    )
  );

  const teleportermoon = new Entity("teleportermoon");
  engine.addEntity(teleportermoon);
  teleportermoon.setParent(_scene);
  const transformCS24 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  teleportermoon.addComponentOrReplace(transformCS24);
  const gltfShapeCS24 = new GLTFShape("models/Teleporter/Moonsquare.glb");
  teleportermoon.addComponentOrReplace(gltfShapeCS24);
  teleportermoon.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 24, y: 26, z: 48 }, { x: 8, y: 1, z: 8 });
      },
      {  hoverText:  i18n.t("hoverMoon",{ns:namespaces.ui.hovers}),}
    )
  );

  const teleportermars = new Entity("teleportermars");
  engine.addEntity(teleportermars);
  teleportermars.setParent(_scene);
  const transformCS25 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  teleportermars.addComponentOrReplace(transformCS25);
  const gltfShapeCS25 = new GLTFShape("models/Teleporter/Marssquare.glb");
  teleportermars.addComponentOrReplace(gltfShapeCS25);
  teleportermars.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 37, y: 32, z: 55 }, { x: 8, y: 1, z: 8 });
      },
      {  hoverText:  i18n.t("hoverMars",{ns:namespaces.ui.hovers}) }
    )
  );

  const teleporterheaven = new Entity("teleporterheaven");
  engine.addEntity(teleporterheaven);
  teleporterheaven.setParent(_scene);
  const transformCS26 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  teleporterheaven.addComponentOrReplace(transformCS26);
  const gltfShapeCS26 = new GLTFShape("models/Teleporter/Heavensquare.glb");
  teleporterheaven.addComponentOrReplace(gltfShapeCS26);
  teleporterheaven.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 24, y: 51, z: 51 }, { x: 8, y: 1, z: 8 });
      },
      {  hoverText:  i18n.t("hoverHeaven",{ns:namespaces.ui.hovers}) }
    )
  );

  const teleportermuscleback = new Entity("teleportermuscleback");
  engine.addEntity(teleportermuscleback);
  teleportermuscleback.setParent(_scene);
  const transformCS28 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  teleportermuscleback.addComponentOrReplace(transformCS28);
  const gltfShapeCS28 = new GLTFShape("models/Teleporter/Musclesquareback.glb");
  teleportermuscleback.addComponentOrReplace(gltfShapeCS28);
  teleportermuscleback.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 40, y: 2, z: 2 }, { x: 40, y: 2, z: 8 });
      },
      { hoverText:  i18n.t("hoverEntrance",{ns:namespaces.ui.hovers}) }
    )
  );

  const Moonsquareback = new Entity("Moonsquareback");
  engine.addEntity(Moonsquareback);
  Moonsquareback.setParent(_scene);
  const transformCS29 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  Moonsquareback.addComponentOrReplace(transformCS29);
  const gltfShapeCS29 = new GLTFShape("models/Teleporter/Moonsquareback.glb");
  Moonsquareback.addComponentOrReplace(gltfShapeCS29);
  Moonsquareback.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 40, y: 2, z: 2 }, { x: 40, y: 2, z: 8 });
      },
      { hoverText:  i18n.t("hoverEntrance",{ns:namespaces.ui.hovers})}
    )
  );

  const Marssquareback = new Entity("Marssquareback");
  engine.addEntity(Marssquareback);
  Marssquareback.setParent(_scene);
  const transformCS30 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  Marssquareback.addComponentOrReplace(transformCS30);
  const gltfShapeCS30 = new GLTFShape("models/Teleporter/Marssquareback.glb");
  Marssquareback.addComponentOrReplace(gltfShapeCS30);
  Marssquareback.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 40, y: 2, z: 2 }, { x: 40, y: 2, z: 8 });
      },
      { hoverText:  i18n.t("hoverEntrance",{ns:namespaces.ui.hovers}) }
    )
  );

  const Heavensquareback = new Entity("Heavensquareback");
  engine.addEntity(Heavensquareback);
  Heavensquareback.setParent(_scene);
  const transformCS31 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  Heavensquareback.addComponentOrReplace(transformCS31);
  const gltfShapeCS31 = new GLTFShape("models/Teleporter/Heavensquareback.glb");
  Heavensquareback.addComponentOrReplace(gltfShapeCS31);
  Heavensquareback.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 40, y: 2, z: 2 }, { x: 40, y: 2, z: 8 });
      },
      { hoverText:  i18n.t("hoverEntrance",{ns:namespaces.ui.hovers}) }
    )
  );

  const Goldtier = new Entity("Goldtier");
  engine.addEntity(Goldtier);
  Goldtier.setParent(_scene);
  const transformCS32 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  Goldtier.addComponentOrReplace(transformCS32);
  const gltfShapeCS32 = new GLTFShape("models/Adsboxes/Goldtier.glb");
  Goldtier.addComponentOrReplace(gltfShapeCS32);
  Goldtier.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 40, y: 2, z: 11.5 }, { x: 40, y: 1.8, z: 40 });
      },
      {  hoverText: i18n.t("hoverReward",{ns:namespaces.ui.hovers}) }
    )
  );

  const Silvertier = new Entity("Silvertier");
  engine.addEntity(Silvertier);
  Silvertier.setParent(_scene);
  const transformCS33 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  Silvertier.addComponentOrReplace(transformCS33);
  const gltfShapeCS33 = new GLTFShape("models/Adsboxes/Silvertier.glb");
  Silvertier.addComponentOrReplace(gltfShapeCS33);
  Silvertier.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x:40, y: 2, z: 65 }, { x: 40, y: 1.8, z: 40 });
      },
      { hoverText: i18n.t("hoverReward",{ns:namespaces.ui.hovers})  }
    )
  );

  const SP1Teleportertorewardscenter = new Entity("SP1Teleportertorewardscenter");
  engine.addEntity(SP1Teleportertorewardscenter);
  SP1Teleportertorewardscenter.setParent(_scene);
  const transformCS34 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  SP1Teleportertorewardscenter.addComponentOrReplace(transformCS34);
  const gltfShapeCS34 = new GLTFShape("models/Adsshops/SP1Teleportertorewardscenter.glb");
  SP1Teleportertorewardscenter.addComponentOrReplace(gltfShapeCS34);
  SP1Teleportertorewardscenter.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 40, y: 2, z: 11.5 }, { x: 40, y: 1.8, z: 40 });
      },
      {  hoverText: i18n.t("hoverReward",{ns:namespaces.ui.hovers})  }
    )
  );

  const SP2Teleportertorewardscenter = new Entity("SP2Teleportertorewardscenter");
  engine.addEntity(SP2Teleportertorewardscenter);
  SP2Teleportertorewardscenter.setParent(_scene);
  const transformCS35 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  SP2Teleportertorewardscenter.addComponentOrReplace(transformCS35);
  const gltfShapeCS35 = new GLTFShape("models/Adsshops/SP2Teleportertorewardscenter.glb");
  SP2Teleportertorewardscenter.addComponentOrReplace(gltfShapeCS35);
  SP2Teleportertorewardscenter.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 40, y: 2, z: 11.5 }, { x: 40, y: 1.8, z: 40 });
      },
      {  hoverText: i18n.t("hoverReward",{ns:namespaces.ui.hovers}) }
    )
  );

  const SP3Teleportertorewardscenter = new Entity("SP3Teleportertorewardscenter");
  engine.addEntity(SP3Teleportertorewardscenter);
  SP3Teleportertorewardscenter.setParent(_scene);
  const transformCS36 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  SP3Teleportertorewardscenter.addComponentOrReplace(transformCS36);
  const gltfShapeCS36 = new GLTFShape("models/Adsshops/SP3Teleportertorewardscenter.glb");
  SP3Teleportertorewardscenter.addComponentOrReplace(gltfShapeCS36);
  SP3Teleportertorewardscenter.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 40, y: 2, z: 11.5 }, { x: 40, y: 1.8, z: 40 });
      },
      { hoverText: i18n.t("hoverReward",{ns:namespaces.ui.hovers})  }
    )
  );

  const SP4Teleportertorewardscenter = new Entity("SP4Teleportertorewardscenter");
  engine.addEntity(SP4Teleportertorewardscenter);
  SP4Teleportertorewardscenter.setParent(_scene);
  const transformCS37 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  SP4Teleportertorewardscenter.addComponentOrReplace(transformCS37);
  const gltfShapeCS37 = new GLTFShape("models/Adsshops/SP4Teleportertorewardscenter.glb");
  SP4Teleportertorewardscenter.addComponentOrReplace(gltfShapeCS37);
  SP4Teleportertorewardscenter.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 40, y: 2, z: 11.5 }, { x: 40, y: 1.8, z: 40 });
      },
      {  hoverText: i18n.t("hoverReward",{ns:namespaces.ui.hovers}) }
    )
  );

  const SP5Teleportertorewardscenter = new Entity("SP5Teleportertorewardscenter");
  engine.addEntity(SP5Teleportertorewardscenter);
  SP5Teleportertorewardscenter.setParent(_scene);
  const transformCS38 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  SP5Teleportertorewardscenter.addComponentOrReplace(transformCS38);
  const gltfShapeCS38 = new GLTFShape("models/Adsshops/SP5Teleportertorewardscenter.glb");
  SP5Teleportertorewardscenter.addComponentOrReplace(gltfShapeCS38);
  SP5Teleportertorewardscenter.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 40, y: 2, z: 45 }, { x: 50, y: 1.8, z: 0 });
      },
      { hoverText: i18n.t("hoverReward",{ns:namespaces.ui.hovers})  }
    )
  );

  const SP6Teleportertorewardscenter = new Entity("SP6Teleportertorewardscenter");
  engine.addEntity(SP6Teleportertorewardscenter);
  SP6Teleportertorewardscenter.setParent(_scene);
  const transformCS39 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  SP6Teleportertorewardscenter.addComponentOrReplace(transformCS39);
  const gltfShapeCS39 = new GLTFShape("models/Adsshops/SP6Teleportertorewardscenter.glb");
  SP6Teleportertorewardscenter.addComponentOrReplace(gltfShapeCS39);
  SP6Teleportertorewardscenter.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 40, y: 2, z: 45 }, { x: 50, y: 1.8, z: 0 });
      },
      { hoverText: i18n.t("hoverReward",{ns:namespaces.ui.hovers}) }
    )
  );

  const SP7Teleportertorewardscenter = new Entity("SP7Teleportertorewardscenter");
  engine.addEntity(SP7Teleportertorewardscenter);
  SP7Teleportertorewardscenter.setParent(_scene);
  const transformCS40 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  SP7Teleportertorewardscenter.addComponentOrReplace(transformCS40);
  const gltfShapeCS40 = new GLTFShape("models/Adsshops/SP7Teleportertorewardscenter.glb");
  SP7Teleportertorewardscenter.addComponentOrReplace(gltfShapeCS40);
  SP7Teleportertorewardscenter.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 40, y: 2, z: 45 }, { x: 50, y: 1.8, z: 0 });
      },
      { hoverText: i18n.t("hoverReward",{ns:namespaces.ui.hovers})  }
    )
  );

  const SP8Teleportertorewardscenter = new Entity("SP8Teleportertorewardscenter");
  engine.addEntity(SP8Teleportertorewardscenter);
  SP8Teleportertorewardscenter.setParent(_scene);
  const transformCS41 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  SP8Teleportertorewardscenter.addComponentOrReplace(transformCS41);
  const gltfShapeCS41 = new GLTFShape("models/Adsshops/SP8Teleportertorewardscenter.glb");
  SP8Teleportertorewardscenter.addComponentOrReplace(gltfShapeCS41);
  SP8Teleportertorewardscenter.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 40, y: 2, z: 45 }, { x: 50, y: 1.8, z: 0 });
      },
      {  hoverText: i18n.t("hoverReward",{ns:namespaces.ui.hovers})  }
    )
  );

  const SP9Teleportertorewardscenter = new Entity("SP9Teleportertorewardscenter");
  engine.addEntity(SP9Teleportertorewardscenter);
  SP9Teleportertorewardscenter.setParent(_scene);
  const transformCS42 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  SP9Teleportertorewardscenter.addComponentOrReplace(transformCS42);
  const gltfShapeCS42 = new GLTFShape("models/Adsshops/SP9Teleportertorewardscenter.glb");
  SP9Teleportertorewardscenter.addComponentOrReplace(gltfShapeCS42);
  SP9Teleportertorewardscenter.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 40, y: 2, z: 45 }, { x: 50, y: 1.8, z: 0 });
      },
      {  hoverText: i18n.t("hoverReward",{ns:namespaces.ui.hovers})  }
    )
  );

  const SP10Teleportertorewardscenter = new Entity("SP10Teleportertorewardscenter");
  engine.addEntity(SP10Teleportertorewardscenter);
  SP10Teleportertorewardscenter.setParent(_scene);
  const transformCS43 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  SP10Teleportertorewardscenter.addComponentOrReplace(transformCS43);
  const gltfShapeCS43 = new GLTFShape("models/Adsshops/SP10Teleportertorewardscenter.glb");
  SP10Teleportertorewardscenter.addComponentOrReplace(gltfShapeCS43);
  SP10Teleportertorewardscenter.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 40, y: 2, z: 45 }, { x: 50, y: 1.8, z: 0 });
      },
      {  hoverText: i18n.t("hoverReward",{ns:namespaces.ui.hovers})  }
    )
  );

  const SP11Teleportertorewardscenter = new Entity("SP11Teleportertorewardscenter");
  engine.addEntity(SP11Teleportertorewardscenter);
  SP11Teleportertorewardscenter.setParent(_scene);
  const transformCS44 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  SP11Teleportertorewardscenter.addComponentOrReplace(transformCS44);
  const gltfShapeCS44 = new GLTFShape("models/Adsshops/SP11Teleportertorewardscenter.glb");
  SP11Teleportertorewardscenter.addComponentOrReplace(gltfShapeCS44);
  SP11Teleportertorewardscenter.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 40, y: 2, z: 45 }, { x: 50, y: 1.8, z: 0 });
      },
      {  hoverText: i18n.t("hoverReward",{ns:namespaces.ui.hovers}) }
    )
  );

  const SP12Teleportertorewardscenter = new Entity("SP12Teleportertorewardscenter");
  engine.addEntity(SP12Teleportertorewardscenter);
  SP12Teleportertorewardscenter.setParent(_scene);
  const transformCS45 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  SP12Teleportertorewardscenter.addComponentOrReplace(transformCS45);
  const gltfShapeCS45 = new GLTFShape("models/Adsshops/SP12Teleportertorewardscenter.glb");
  SP12Teleportertorewardscenter.addComponentOrReplace(gltfShapeCS45);
  SP12Teleportertorewardscenter.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 40, y: 2, z: 45 }, { x: 50, y: 1.8, z: 0 });
      },
      {  hoverText: i18n.t("hoverReward",{ns:namespaces.ui.hovers})  }
    )
  );

  const SP61Teleportertorewardscenter = new Entity("SP61Teleportertorewardscenter");
  engine.addEntity(SP61Teleportertorewardscenter);
  SP61Teleportertorewardscenter.setParent(_scene);
  const transformCS103 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  SP61Teleportertorewardscenter.addComponentOrReplace(transformCS103);
  const gltfShapeCS103 = new GLTFShape("models/Adsshops/SP61Teleportertorewardscenter.glb");
  SP61Teleportertorewardscenter.addComponentOrReplace(gltfShapeCS103);
  SP61Teleportertorewardscenter.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 40, y: 2, z: 45 }, { x: 50, y: 1.8, z: 0 });
      },
      {  hoverText: i18n.t("hoverReward",{ns:namespaces.ui.hovers})  }
    )
  );

  const TeleporterL1 = new Entity("TeleporterL1");
  engine.addEntity(TeleporterL1);
  TeleporterL1.setParent(_scene);
  const transformCS46 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TeleporterL1.addComponentOrReplace(transformCS46);
  const gltfShapeCS46 = new GLTFShape("models/Rewards/TeleporterL1.glb");
  TeleporterL1.addComponentOrReplace(gltfShapeCS46);
  TeleporterL1.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 11.6, y: 11, z: 22.7 }, { x: 50, y: 1.8, z: 0 }) ;
      },
      { hoverText: i18n.t("hoverBrand",{ns:namespaces.ui.hovers}) }
    )
  );

  const TeleporterL2 = new Entity("TeleporterL2");
  engine.addEntity(TeleporterL2);
  TeleporterL2.setParent(_scene);
  const transformCS47 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TeleporterL2.addComponentOrReplace(transformCS47);
  const gltfShapeCS47 = new GLTFShape("models/Rewards/TeleporterL2.glb");
  TeleporterL2.addComponentOrReplace(gltfShapeCS47);
  TeleporterL2.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 12, y: 24, z: 49.7 }, { x: 50, y: 1.8, z: 0 });
      },
      { hoverText: i18n.t("hoverBrand",{ns:namespaces.ui.hovers}) }
    )
  );

  const TeleporterL3 = new Entity("TeleporterL3");
  engine.addEntity(TeleporterL3);
  TeleporterL3.setParent(_scene);
  const transformCS48 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TeleporterL3.addComponentOrReplace(transformCS48);
  const gltfShapeCS48 = new GLTFShape("models/Rewards/TeleporterL3.glb");
  TeleporterL3.addComponentOrReplace(gltfShapeCS48);
  TeleporterL3.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 16.3, y: 51, z: 50 }, { x: 50, y: 1.8, z: 0 });
      },
      { hoverText: i18n.t("hoverBrand",{ns:namespaces.ui.hovers}) }
    )
  );

  const TeleporterL4 = new Entity("TeleporterL4");
  engine.addEntity(TeleporterL4);
  TeleporterL4.setParent(_scene);
  const transformCS49 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TeleporterL4.addComponentOrReplace(transformCS49);
  const gltfShapeCS49 = new GLTFShape("models/Rewards/TeleporterL4.glb");
  TeleporterL4.addComponentOrReplace(gltfShapeCS49);
  TeleporterL4.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 36, y: 32, z: 47.73 }, { x: 50, y: 1.8, z: 0 });
      },
      { hoverText: i18n.t("hoverBrand",{ns:namespaces.ui.hovers}) }
    )
  );

  const TeleporterL5 = new Entity("TeleporterL5");
  engine.addEntity(TeleporterL5);
  TeleporterL5.setParent(_scene);
  const transformCS50 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TeleporterL5.addComponentOrReplace(transformCS50);
  const gltfShapeCS50 = new GLTFShape("models/Rewards/TeleporterL5.glb");
  TeleporterL5.addComponentOrReplace(gltfShapeCS50);
  TeleporterL5.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 55.87, y: 14, z: 71.89 }, { x: 50, y: 1.8, z: 0 });
      },
      { hoverText: i18n.t("hoverBrand",{ns:namespaces.ui.hovers}) }
    )
  );
  
  const TeleporterL6 = new Entity("TeleporterL6");
  engine.addEntity(TeleporterL6);
  TeleporterL6.setParent(_scene);
  const transformCS51 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TeleporterL6.addComponentOrReplace(transformCS51);
  const gltfShapeCS51 = new GLTFShape("models/Rewards/TeleporterL6.glb");
  TeleporterL6.addComponentOrReplace(gltfShapeCS51);
  TeleporterL6.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 70.49, y: 2.5, z: 79.19 }, { x: 50, y: 1.8, z: 0 });
      },
      { hoverText: i18n.t("hoverBrand",{ns:namespaces.ui.hovers}) }
    )
  );

  const TeleporterR1 = new Entity("TeleporterR1");
  engine.addEntity(TeleporterR1);
  TeleporterR1.setParent(_scene);
  const transformCS52 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TeleporterR1.addComponentOrReplace(transformCS52);
  const gltfShapeCS52 = new GLTFShape("models/Rewards/TeleporterR1.glb");
  TeleporterR1.addComponentOrReplace(gltfShapeCS52);
  TeleporterR1.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 12, y: 24, z: 37.2 }, { x: 50, y: 1.8, z: 0 });
      },
      { hoverText: i18n.t("hoverBrand",{ns:namespaces.ui.hovers}) }
    )
  );

  const TeleporterR2 = new Entity("TeleporterR2");
  engine.addEntity(TeleporterR2);
  TeleporterR2.setParent(_scene);
  const transformCS53 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TeleporterR2.addComponentOrReplace(transformCS53);
  const gltfShapeCS53 = new GLTFShape("models/Rewards/TeleporterR2.glb");
  TeleporterR2.addComponentOrReplace(gltfShapeCS53);
  TeleporterR2.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 12, y: 24, z: 62.5 }, { x: 50, y: 1.8, z: 0 });
      },
      {hoverText: i18n.t("hoverBrand",{ns:namespaces.ui.hovers})}
    )
  );

  const TeleporterR3 = new Entity("TeleporterR3");
  engine.addEntity(TeleporterR3);
  TeleporterR3.setParent(_scene);
  const transformCS54 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TeleporterR3.addComponentOrReplace(transformCS54);
  const gltfShapeCS54 = new GLTFShape("models/Rewards/TeleporterR3.glb");
  TeleporterR3.addComponentOrReplace(gltfShapeCS54);
  TeleporterR3.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 16.3, y: 51, z: 60 }, { x: 50, y: 1.8, z: 0 });
      },
      {hoverText: i18n.t("hoverBrand",{ns:namespaces.ui.hovers})}
    )
  );

  const TeleporterR4 = new Entity("TeleporterR4");
  engine.addEntity(TeleporterR4);
  TeleporterR4.setParent(_scene);
  const transformCS55 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TeleporterR4.addComponentOrReplace(transformCS55);
  const gltfShapeCS55 = new GLTFShape("models/Rewards/TeleporterR4.glb");
  TeleporterR4.addComponentOrReplace(gltfShapeCS55);
  TeleporterR4.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 47, y: 32, z: 47.73 }, { x: 50, y: 1.8, z: 0 });
      },
      { hoverText: i18n.t("hoverBrand",{ns:namespaces.ui.hovers}) }
    )
  );

  const TeleporterR5 = new Entity("TeleporterR5");
  engine.addEntity(TeleporterR5);
  TeleporterR5.setParent(_scene);
  const transformCS56 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TeleporterR5.addComponentOrReplace(transformCS56);
  const gltfShapeCS56 = new GLTFShape("models/Rewards/TeleporterR5.glb");
  TeleporterR5.addComponentOrReplace(gltfShapeCS56);
  TeleporterR5.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 55.87, y: 14, z: 40.2 }, { x: 50, y: 1.8, z: 0 });
      },
      { hoverText: i18n.t("hoverBrand",{ns:namespaces.ui.hovers}) }
    )
  );

  const TeleporterR6 = new Entity("TeleporterR6");
  engine.addEntity(TeleporterR6);
  TeleporterR6.setParent(_scene);
  const transformCS57 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TeleporterR6.addComponentOrReplace(transformCS57);
  const gltfShapeCS57 = new GLTFShape("models/Rewards/TeleporterR6.glb");
  TeleporterR6.addComponentOrReplace(gltfShapeCS57);
  TeleporterR6.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 70.49, y: 2.5, z: 66 }, { x: 50, y: 1.8, z: 0 });
      },
      { hoverText: i18n.t("hoverBrand",{ns:namespaces.ui.hovers}) }
    )
  );

  const TeleporterR61 = new Entity("TeleporterR61");
  engine.addEntity(TeleporterR61);
  TeleporterR61.setParent(_scene);
  const transformCS104 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TeleporterR61.addComponentOrReplace(transformCS104);
  const gltfShapeCS104 = new GLTFShape("models/Rewards/TeleporterR61.glb");
  TeleporterR61.addComponentOrReplace(gltfShapeCS104);
  TeleporterR61.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 60.99, y: 31.54, z: 47.66 }, { x: 50, y: 1.8, z: 0 });
      },
      { hoverText: i18n.t("hoverBrand",{ns:namespaces.ui.hovers}) }
    )
  );
  const TwitterL1 = new Entity("TwitterL1");
  TwitterL1.setParent(_scene);
  const transformCS58 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterL1.addComponentOrReplace(transformCS58);
  const gltfShapeCS58 = new GLTFShape("models/Rewards/Sociallinks/TwitterL1.glb");
  TwitterL1.addComponentOrReplace(gltfShapeCS58);
  TwitterL1.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/DecentralGames")
      },
      { hoverText:  i18n.t("hoverTwitter",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(TwitterL1);

  const TwitterL2 = new Entity("TwitterL2");
  TwitterL2.setParent(_scene);
  const transformCS59 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterL2.addComponentOrReplace(transformCS59);
  const gltfShapeCS59 = new GLTFShape("models/Rewards/Sociallinks/TwitterL2.glb");
  TwitterL2.addComponentOrReplace(gltfShapeCS59);
  TwitterL2.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/SensoriumGalaxy")
      },
      { hoverText:  i18n.t("hoverTwitter",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(TwitterL2);

  const TwitterL3 = new Entity("TwitterL3");
  TwitterL3.setParent(_scene);
  const transformCS60 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterL3.addComponentOrReplace(transformCS60);
  const gltfShapeCS60 = new GLTFShape("models/Rewards/Sociallinks/TwitterL3.glb");
  TwitterL3.addComponentOrReplace(gltfShapeCS60);
  TwitterL3.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/soulmagicnft")
      },
      { hoverText:  i18n.t("hoverTwitter",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(TwitterL3);

  const TwitterL4 = new Entity("TwitterL4");
  TwitterL4.setParent(_scene);
  const transformCS61 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterL4.addComponentOrReplace(transformCS61);
  const gltfShapeCS61 = new GLTFShape("models/Rewards/Sociallinks/TwitterL4.glb");
  TwitterL4.addComponentOrReplace(gltfShapeCS61);
  TwitterL4.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/ButterflyPrawn")
      },
      { hoverText:  i18n.t("hoverTwitter",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(TwitterL4);

  const TwitterL5 = new Entity("TwitterL5");
  TwitterL5.setParent(_scene);
  const transformCS62 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterL5.addComponentOrReplace(transformCS62);
  const gltfShapeCS62 = new GLTFShape("models/Rewards/Sociallinks/TwitterL5.glb");
  TwitterL5.addComponentOrReplace(gltfShapeCS62);
  TwitterL5.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/MUA_MUADAO")
      },
      { hoverText:  i18n.t("hoverTwitter",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(TwitterL5);

  const TwitterL6 = new Entity("TwitterL6");
  TwitterL6.setParent(_scene);
  const transformCS63 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterL6.addComponentOrReplace(transformCS63);
  const gltfShapeCS63 = new GLTFShape("models/Rewards/Sociallinks/TwitterL6.glb");
  TwitterL6.addComponentOrReplace(gltfShapeCS63);
  TwitterL6.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/Vroomwayio")
      },
      { hoverText:  i18n.t("hoverTwitter",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(TwitterL6);

  const TwitterR1 = new Entity("TwitterR1");
  TwitterR1.setParent(_scene);
  const transformCS64 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterR1.addComponentOrReplace(transformCS64);
  const gltfShapeCS64 = new GLTFShape("models/Rewards/Sociallinks/TwitterR1.glb");
  TwitterR1.addComponentOrReplace(gltfShapeCS64);
  TwitterR1.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/WonderZoneGames")
      },
      { hoverText:  i18n.t("hoverTwitter",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(TwitterR1);

  const TwitterR2 = new Entity("TwitterR2");
  TwitterR2.setParent(_scene);
  const transformCS65 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterR2.addComponentOrReplace(transformCS65);
  const gltfShapeCS65 = new GLTFShape("models/Rewards/Sociallinks/TwitterR2.glb");
  TwitterR2.addComponentOrReplace(gltfShapeCS65);
  TwitterR2.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/meta_viu")
      },
      { hoverText:  i18n.t("hoverTwitter",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(TwitterR2);

  const TwitterR3 = new Entity("TwitterR3");
  TwitterR3.setParent(_scene);
  const transformCS66 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterR3.addComponentOrReplace(transformCS66);
  const gltfShapeCS66 = new GLTFShape("models/Rewards/Sociallinks/TwitterR3.glb");
  TwitterR3.addComponentOrReplace(gltfShapeCS66);
  TwitterR3.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/KnightsOfAntrom")
      },
      { hoverText:  i18n.t("hoverTwitter",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(TwitterR3);

  const TwitterR4 = new Entity("TwitterR4");
  TwitterR4.setParent(_scene);
  const transformCS67 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterR4.addComponentOrReplace(transformCS67);
  const gltfShapeCS67 = new GLTFShape("models/Rewards/Sociallinks/TwitterR4.glb");
  TwitterR4.addComponentOrReplace(gltfShapeCS67);
  TwitterR4.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/VoxBoardsNFT")
      },
      { hoverText:  i18n.t("hoverTwitter",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(TwitterR4);

  const TwitterR5 = new Entity("TwitterR5");
  TwitterR5.setParent(_scene);
  const transformCS68 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterR5.addComponentOrReplace(transformCS68);
  const gltfShapeCS68 = new GLTFShape("models/Rewards/Sociallinks/TwitterR5.glb");
  TwitterR5.addComponentOrReplace(gltfShapeCS68);
  TwitterR5.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/creatordaocc")
      },
      { hoverText:  i18n.t("hoverTwitter",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(TwitterR5);

  const TwitterR6 = new Entity("TwitterR6");
  TwitterR6.setParent(_scene);
  const transformCS69 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterR6.addComponentOrReplace(transformCS69);
  const gltfShapeCS69 = new GLTFShape("models/Rewards/Sociallinks/TwitterR6.glb");
  TwitterR6.addComponentOrReplace(gltfShapeCS69);
  TwitterR6.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/megacubeio")
      },
      { hoverText:  i18n.t("hoverTwitter",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(TwitterR6);

  const TwitterR61 = new Entity("TwitterR6");
  TwitterR61.setParent(_scene);
  const transformCS101 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterR61.addComponentOrReplace(transformCS101);
  const gltfShapeCS101 = new GLTFShape("models/Rewards/Sociallinks/TwitterR61.glb");
  TwitterR61.addComponentOrReplace(gltfShapeCS101);
  TwitterR61.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/Crypto_Slots")
      },
      { hoverText:  i18n.t("hoverTwitter",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(TwitterR61);

  const TwitterS1 = new Entity("TwitterS1");
  TwitterS1.setParent(_scene);
  const transformCS70 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterS1.addComponentOrReplace(transformCS70);
  const gltfShapeCS70 = new GLTFShape("models/Rewards/Sociallinks/TwitterS1.glb");
  TwitterS1.addComponentOrReplace(gltfShapeCS70);
  TwitterS1.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/freethought3D")
      },
      { hoverText:  i18n.t("hoverTwitter",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(TwitterS1);

  const TwitterS2 = new Entity("TwitterS2");
  TwitterS2.setParent(_scene);
  const transformCS71 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterS2.addComponentOrReplace(transformCS71);
  const gltfShapeCS71 = new GLTFShape("models/Rewards/Sociallinks/TwitterS2.glb");
  TwitterS2.addComponentOrReplace(gltfShapeCS71);
  TwitterS2.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/SpanishMuseum")
      },
      { hoverText:  i18n.t("hoverTwitter",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(TwitterS2);

  const TwitterS3 = new Entity("TwitterS3");
  TwitterS3.setParent(_scene);
  const transformCS72 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterS3.addComponentOrReplace(transformCS72);
  const gltfShapeCS72 = new GLTFShape("models/Rewards/Sociallinks/TwitterS3.glb");
  TwitterS3.addComponentOrReplace(gltfShapeCS72);
  TwitterS3.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/Metacat007")
      },
      { hoverText:  i18n.t("hoverTwitter",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(TwitterS3);

  const TwitterS4 = new Entity("TwitterS4");
  TwitterS4.setParent(_scene);
  const transformCS73 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterS4.addComponentOrReplace(transformCS73);
  const gltfShapeCS73 = new GLTFShape("models/Rewards/Sociallinks/TwitterS4.glb");
  TwitterS4.addComponentOrReplace(gltfShapeCS73);
  TwitterS4.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/residence_meta")
      },
      { hoverText:  i18n.t("hoverTwitter",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(TwitterS4);

  const TwitterS5 = new Entity("TwitterS5");
  TwitterS5.setParent(_scene);
  const transformCS74 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterS5.addComponentOrReplace(transformCS74);
  const gltfShapeCS74 = new GLTFShape("models/Rewards/Sociallinks/TwitterS5.glb");
  TwitterS5.addComponentOrReplace(gltfShapeCS74);
  TwitterS5.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/Apes3D")
      },
      { hoverText:  i18n.t("hoverTwitter",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(TwitterS5);

  const TwitterS6 = new Entity("TwitterS6");
  TwitterS6.setParent(_scene);
  const transformCS75 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterS6.addComponentOrReplace(transformCS75);
  const gltfShapeCS75 = new GLTFShape("models/Rewards/Sociallinks/TwitterS6.glb");
  TwitterS6.addComponentOrReplace(gltfShapeCS75);
  TwitterS6.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/Waifumons")
      },
      { hoverText:  i18n.t("hoverTwitter",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(TwitterS6);

  const TwitterS7 = new Entity("TwitterS7");
  TwitterS7.setParent(_scene);
  const transformCS76 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterS7.addComponentOrReplace(transformCS76);
  const gltfShapeCS76 = new GLTFShape("models/Rewards/Sociallinks/TwitterS7.glb");
  TwitterS7.addComponentOrReplace(gltfShapeCS76);
  TwitterS7.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/GolfcraftGame")
      },
      { hoverText: i18n.t("hoverTwitter",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(TwitterS7);

  const TwitterS8 = new Entity("TwitterS8");
  TwitterS8.setParent(_scene);
  const transformCS77 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterS8.addComponentOrReplace(transformCS77);
  const gltfShapeCS77 = new GLTFShape("models/Rewards/Sociallinks/TwitterS8.glb");
  TwitterS8.addComponentOrReplace(gltfShapeCS77);
  TwitterS8.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/CocaCola")
      },
      { hoverText:  i18n.t("hoverTwitter",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(TwitterS8);

  const TwitterS9 = new Entity("TwitterS9");
  TwitterS9.setParent(_scene);
  const transformCS78 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterS9.addComponentOrReplace(transformCS78);
  const gltfShapeCS78 = new GLTFShape("models/Rewards/Sociallinks/TwitterS9.glb");
  TwitterS9.addComponentOrReplace(gltfShapeCS78);
  TwitterS9.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/Meamacoffee")
      },
      { hoverText:  i18n.t("hoverTwitter",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(TwitterS9);

  const TwitterS10 = new Entity("TwitterS10");
  TwitterS10.setParent(_scene);
  const transformCS79 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterS10.addComponentOrReplace(transformCS79);
  const gltfShapeCS79 = new GLTFShape("models/Rewards/Sociallinks/TwitterS10.glb");
  TwitterS10.addComponentOrReplace(gltfShapeCS79);
  TwitterS10.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/SensoriumGalaxy")
      },
      { hoverText:  i18n.t("hoverTwitter",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(TwitterS10);

  const TwitterS11 = new Entity("TwitterS11");
  TwitterS11.setParent(_scene);
  const transformCS80 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterS11.addComponentOrReplace(transformCS80);
  const gltfShapeCS80 = new GLTFShape("models/Rewards/Sociallinks/TwitterS11.glb");
  TwitterS11.addComponentOrReplace(gltfShapeCS80);
  TwitterS11.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/TraditioNow")
      },
      { hoverText:  i18n.t("hoverTwitter",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(TwitterS11);

  const TwitterHeaven1 = new Entity("TwitterHeaven1");
  TwitterHeaven1.setParent(_scene);
  const transformCS106 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterHeaven1.addComponentOrReplace(transformCS106);
  const gltfShapeCS105 = new GLTFShape("models/Rewards/Sociallinks/TwitterlinkHeaven1.glb");
  TwitterHeaven1.addComponentOrReplace(gltfShapeCS105);
  TwitterHeaven1.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/FeBoComp")
      },
      { hoverText:  i18n.t("hoverTwitter",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(TwitterHeaven1);
/*
  const TwitterS12 = new Entity("TwitterS12");
  TwitterS12.setParent(_scene);
  const transformCS81 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  TwitterS12.addComponentOrReplace(transformCS81);
  const gltfShapeCS81 = new GLTFShape("models/Rewards/Sociallinks/TwitterS12.glb");
  TwitterS12.addComponentOrReplace(gltfShapeCS81);
  TwitterS12.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://twitter.com/MetaGamiMall")
      },
      { hoverText: "Check Brand's Discord" })
    );
  engine.addEntity(TwitterS12);*/

  const DiscordL1 = new Entity("DiscordL1");
  DiscordL1.setParent(_scene);
  const transformCS82 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  DiscordL1.addComponentOrReplace(transformCS82);
  const gltfShapeCS82 = new GLTFShape("models/Rewards/Sociallinks/DiscordL1.glb");
  DiscordL1.addComponentOrReplace(gltfShapeCS82);
  DiscordL1.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://discord.com/invite/decentralgames")
      },
      { hoverText:  i18n.t("hoverWeb",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(DiscordL1);

  const DiscordL2 = new Entity("DiscordL2");
  DiscordL2.setParent(_scene);
  const transformCS83 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  DiscordL2.addComponentOrReplace(transformCS83);
  const gltfShapeCS83 = new GLTFShape("models/Rewards/Sociallinks/DiscordL2.glb");
  DiscordL2.addComponentOrReplace(gltfShapeCS83);
  DiscordL2.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://discord.com/invite/SFcxQMPfpH")
      },
      { hoverText:  i18n.t("hoverDiscord",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(DiscordL2);

  const DiscordL3 = new Entity("DiscordL3");
  DiscordL3.setParent(_scene);
  const transformCS84 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  DiscordL3.addComponentOrReplace(transformCS84);
  const gltfShapeCS84 = new GLTFShape("models/Rewards/Sociallinks/DiscordL3.glb");
  DiscordL3.addComponentOrReplace(gltfShapeCS84);
  DiscordL3.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://discord.com/invite/soulmagic")
      },
      { hoverText:  i18n.t("hoverDiscord",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(DiscordL3);

  const DiscordL4 = new Entity("DiscordL4");
  DiscordL4.setParent(_scene);
  const transformCS85 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  DiscordL4.addComponentOrReplace(transformCS85);
  const gltfShapeCS85 = new GLTFShape("models/Rewards/Sociallinks/DiscordL4.glb");
  DiscordL4.addComponentOrReplace(gltfShapeCS85);
  DiscordL4.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://discord.gg/3t4ZJAPd9m")
      },
      { hoverText:  i18n.t("hoverDiscord",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(DiscordL4);

  const DiscordL5 = new Entity("DiscordL5");
  DiscordL5.setParent(_scene);
  const transformCS86 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  DiscordL5.addComponentOrReplace(transformCS86);
  const gltfShapeCS86 = new GLTFShape("models/Rewards/Sociallinks/DiscordL5.glb");
  DiscordL5.addComponentOrReplace(gltfShapeCS86);
  DiscordL5.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://discord.com/invite/mua-dao")
      },
      { hoverText:  i18n.t("hoverDiscord",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(DiscordL5);

  const DiscordL6 = new Entity("DiscordL6");
  DiscordL6.setParent(_scene);
  const transformCS87 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  DiscordL6.addComponentOrReplace(transformCS87);
  const gltfShapeCS87 = new GLTFShape("models/Rewards/Sociallinks/DiscordL6.glb");
  DiscordL6.addComponentOrReplace(gltfShapeCS87);
  DiscordL6.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://discord.com/invite/G4phU6jJpq")
      },
      { hoverText:  i18n.t("hoverDiscord",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(DiscordL6);

  const DiscordR1 = new Entity("DiscordR1");
  DiscordR1.setParent(_scene);
  const transformCS88 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  DiscordR1.addComponentOrReplace(transformCS88);
  const gltfShapeCS88 = new GLTFShape("models/Rewards/Sociallinks/DiscordR1.glb");
  DiscordR1.addComponentOrReplace(gltfShapeCS88);
  DiscordR1.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://discord.com/invite/puM8KZCkcU")
      },
      { hoverText:  i18n.t("hoverDiscord",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(DiscordR1);

  const DiscordR2 = new Entity("DiscordR2");
  DiscordR2.setParent(_scene);
  const transformCS89 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  DiscordR2.addComponentOrReplace(transformCS89);
  const gltfShapeCS89 = new GLTFShape("models/Rewards/Sociallinks/DiscordR2.glb");
  DiscordR2.addComponentOrReplace(gltfShapeCS89);
  DiscordR2.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://discord.com/invite/sz8bvW6hYZ")
      },
      { hoverText:  i18n.t("hoverDiscord",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(DiscordR2);

  const DiscordR3 = new Entity("DiscordR3");
  DiscordR3.setParent(_scene);
  const transformCS90 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  DiscordR3.addComponentOrReplace(transformCS90);
  const gltfShapeCS90 = new GLTFShape("models/Rewards/Sociallinks/DiscordR3.glb");
  DiscordR3.addComponentOrReplace(gltfShapeCS90);
  DiscordR3.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://discord.com/invite/jAnBaw6YU7")
      },
      { hoverText:  i18n.t("hoverDiscord",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(DiscordR3);

  const DiscordR4 = new Entity("DiscordR4");
  DiscordR4.setParent(_scene);
  const transformCS91 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  DiscordR4.addComponentOrReplace(transformCS91);
  const gltfShapeCS91 = new GLTFShape("models/Rewards/Sociallinks/DiscordR4.glb");
  DiscordR4.addComponentOrReplace(gltfShapeCS91);
  DiscordR4.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://discord.com/invite/pJ38gDuHxG")
      },
      { hoverText:  i18n.t("hoverDiscord",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(DiscordR4);

  const DiscordR5 = new Entity("DiscordR5");
  DiscordR5.setParent(_scene);
  const transformCS92 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  DiscordR5.addComponentOrReplace(transformCS92);
  const gltfShapeCS92 = new GLTFShape("models/Rewards/Sociallinks/DiscordR5.glb");
  DiscordR5.addComponentOrReplace(gltfShapeCS92);
  DiscordR5.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://discord.com/invite/creatordao")
      },
      { hoverText:  i18n.t("hoverDiscord",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(DiscordR5);

  const DiscordR6 = new Entity("DiscordR6");
  DiscordR6.setParent(_scene);
  const transformCS93 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  DiscordR6.addComponentOrReplace(transformCS93);
  const gltfShapeCS93 = new GLTFShape("models/Rewards/Sociallinks/DiscordR6.glb");
  DiscordR6.addComponentOrReplace(gltfShapeCS93);
  DiscordR6.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://discord.com/invite/jVEZYy4")
      },
      { hoverText:  i18n.t("hoverDiscord",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(DiscordR6);

  const DiscordR61 = new Entity("DiscordR61");
  DiscordR61.setParent(_scene);
  const transformCS102 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  DiscordR61.addComponentOrReplace(transformCS102);
  const gltfShapeCS102 = new GLTFShape("models/Rewards/Sociallinks/DiscordR61.glb");
  DiscordR61.addComponentOrReplace(gltfShapeCS102);
  DiscordR61.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://www.cryptoslots.com/en/dcl?utm_source=ext&utm_medium=web&utm_content=2023-fashionmine-feature&utm_campaign=metaverse-dcl")
      },
      { hoverText:  i18n.t("hoverWeb",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(DiscordR61);

const loadPlantFn = ()=>{
  const plant = new Entity("plant");
  engine.addEntity(plant);
  plant.setParent(_scene);
  const transformCS95 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  plant.addComponentOrReplace(transformCS95);
  const gltfShapeCS95 = new GLTFShape("models/mains/plants.glb");
  plant.addComponentOrReplace(gltfShapeCS95);
  engine.addEntity(plant);
};//END loadPlantFn
handleDelayLoad(CONFIG.DELAY_LOAD_PLANT, 
  "plant", 
  loadPlantFn);
/*
  const loadSquareFn = ()=>{
  const squares = new Entity("squares");
  engine.addEntity(squares);
  squares.setParent(_scene);
  const transformCS96 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  squares.addComponentOrReplace(transformCS96);
  const gltfShapeCS96 = new GLTFShape("models/mains/squares.glb");
  squares.addComponentOrReplace(gltfShapeCS96);
  engine.addEntity(squares);
  }//END loadSquareFn
  handleDelayLoad(CONFIG.DELAY_LOAD_SQUARES, 
  "square", 
    loadSquareFn
  );*/
/*
  const loadWearablesFn = ()=>{
  const wearables = new Entity("wearables");
  engine.addEntity(wearables);
  wearables.setParent(_scene);
  const transformCS97 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  wearables.addComponentOrReplace(transformCS97);
  const gltfShapeCS97 = new GLTFShape("models/Rewards/metaminewearables.glb");
  wearables.addComponentOrReplace(gltfShapeCS97);
  engine.addEntity(wearables);
 };
 handleDelayLoad(CONFIG.DELAY_LOAD_WEARABLES, 
  "wearables", 
  loadWearablesFn
  ); 

  const barrier = new Entity("barrier");
  engine.addEntity(barrier);
  barrier.setParent(_scene);
  const transformCS98 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  barrier.addComponentOrReplace(transformCS98);
  const gltfShapeCS98 = new GLTFShape("models/mains/Barrier.glb");
  barrier.addComponentOrReplace(gltfShapeCS98);
  engine.addEntity(barrier);
*/

  const musclesquareupdownpad = new Entity("musclesquareupdownpad");
  engine.addEntity(musclesquareupdownpad);
  musclesquareupdownpad.setParent(_scene);
  const transformCS23 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  musclesquareupdownpad.addComponentOrReplace(transformCS23);
  const gltfShapeCS23 = new GLTFShape("models/mains/musclesquareupdownpad.glb");
  musclesquareupdownpad.addComponentOrReplace(gltfShapeCS23);
  engine.addEntity(musclesquareupdownpad);
/*
  const stage = new Entity("stage");
  engine.addEntity(stage);
  stage.setParent(_scene);
  const transformCS27 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  stage.addComponentOrReplace(transformCS27);
  const gltfShapeCS27 = new GLTFShape("models/Teleporter/stage.glb");
  stage.addComponentOrReplace(gltfShapeCS27);
  engine.addEntity(stage);

  // Add mini games
  /*const movingball = new Entity("movingball");
  engine.addEntity(movingball);
  movingball.setParent(_scene);
  const transformCS6 = new Transform({
    //position: new Vector3(48, 0, 40),
    position: new Vector3(28, redBallY, redBallZ + 0),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  movingball.addComponentOrReplace(transformCS6);
  const gltfShapeCS6 = new GLTFShape(
    "ead231c4-4d7d-474c-8df9-22c47615d1a2/movingball.glb"
  );
  gltfShapeCS6.withCollisions = true;
  gltfShapeCS6.isPointerBlocker = true;
  gltfShapeCS6.visible = true;
  movingball.addComponentOrReplace(gltfShapeCS6);

  //redball collider not working, maybe cuz its a sphere. player goes through it when speed is not even that fast
  //this seems to fix that issue
  const redBallColliderWorkaround = new Entity("redBallTest");
  engine.addEntity(redBallColliderWorkaround);
  redBallColliderWorkaround.setParent(movingball);
  redBallColliderWorkaround.addComponentOrReplace(
    new Transform({
      position: new Vector3(0, 0, 0), //new Vector3(32, redBallY, redBallZ+0),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(2.5, 1, 1),
    })
  );
  redBallColliderWorkaround.addComponent(
    CommonResources.RESOURCES.materials.transparent
  );
  redBallColliderWorkaround.addComponent(new BoxShape());

  const rotatingpad = new Entity("rotatingpad");
  engine.addEntity(rotatingpad);
  rotatingpad.setParent(_scene);
  const transformCS7 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  rotatingpad.addComponentOrReplace(transformCS7);
  const gltfShapeCS7 = new GLTFShape(
    "ead231c4-4d7d-474c-8df9-22c47615d1a2/rotatingpad.glb"
  );
  gltfShapeCS7.withCollisions = true;
  gltfShapeCS7.isPointerBlocker = true;
  gltfShapeCS7.visible = true;
  rotatingpad.addComponentOrReplace(gltfShapeCS7);

  const upsidedownpad = new Entity("upsidedownpad");
  engine.addEntity(upsidedownpad);
  upsidedownpad.setParent(_scene);
  const transformCS8 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  upsidedownpad.addComponentOrReplace(transformCS8);
  const gltfShapeCS8 = new GLTFShape(
    "ead231c4-4d7d-474c-8df9-22c47615d1a2/upsidedownpad.glb"
  );
  gltfShapeCS8.withCollisions = true;
  gltfShapeCS8.isPointerBlocker = true;
  gltfShapeCS8.visible = true;
  upsidedownpad.addComponentOrReplace(gltfShapeCS8);

  const rotatingpadcollider = new Entity("rotatingpadcollider");
  engine.addEntity(rotatingpadcollider);
  rotatingpadcollider.setParent(_scene);
  const transformCS19 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  rotatingpadcollider.addComponentOrReplace(transformCS19);
  const gltfShapeCS19 = new GLTFShape(
    "ead231c4-4d7d-474c-8df9-22c47615d1a2/rotatingpadcollider.glb"
  );
  gltfShapeCS19.withCollisions = true;
  gltfShapeCS19.isPointerBlocker = true;
  gltfShapeCS19.visible = true;
  rotatingpadcollider.addComponentOrReplace(gltfShapeCS19);


  if (true) {
    //block scope
    const moveUpDownAmount = 1;
    const timeDuration = 5;
    const start = upsidedownpad
      .getComponent(Transform)
      .position.clone()
      .subtract(new Vector3(0, moveUpDownAmount, 0));
    const end = upsidedownpad
      .getComponent(Transform)
      .position.clone()
      .add(new Vector3(0, moveUpDownAmount, 0));
    upsidedownpad.addComponent(
      new OscilateComponent(
        start,
        end,
        timeDuration,
        undefined,
        undefined,
        utils.InterpolationType.EASEINSINE
      )
    );
  }
  */
  /*
  // Add voxboardpark start
  const voxboardpark = new Entity("voxboardpark");
  engine.addEntity(voxboardpark);
  voxboardpark.setParent(_scene);
  const transformCS1 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  voxboardpark.addComponentOrReplace(transformCS1);
  const gltfShapeCS1 = new GLTFShape("models/voxboardpark.glb");
  gltfShapeCS1.withCollisions = true;
  gltfShapeCS1.isPointerBlocker = true;
  gltfShapeCS1.visible = true;
  voxboardpark.addComponentOrReplace(gltfShapeCS1);
*/
  // Add voxboard park end

  // Add entrance Start
/*
  const rewardL1 = new Entity("rewardL1");
  engine.addEntity(rewardL1);
  rewardL1.setParent(_scene);
  const transformCS9 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  rewardL1.addComponentOrReplace(transformCS9);
  const gltfShapeCS9 = new GLTFShape("models/Rewards/rewardL1.gltf");
  gltfShapeCS9.withCollisions = true;
  gltfShapeCS9.isPointerBlocker = true;
  gltfShapeCS9.visible = true;
  rewardL1.addComponentOrReplace(gltfShapeCS9);

  const rewardL2 = new Entity("rewardL2");
  engine.addEntity(rewardL2);
  rewardL2.setParent(_scene);
  const transformCS10 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  rewardL2.addComponentOrReplace(transformCS10);
  const gltfShapeCS10 = new GLTFShape("models/Rewards/rewardL2.gltf");
  gltfShapeCS10.withCollisions = true;
  gltfShapeCS10.isPointerBlocker = true;
  gltfShapeCS10.visible = true;
  rewardL2.addComponentOrReplace(gltfShapeCS10);

  const rewardL3 = new Entity("rewardL3");
  engine.addEntity(rewardL3);
  rewardL3.setParent(_scene);
  const transformCS11 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  rewardL3.addComponentOrReplace(transformCS11);
  const gltfShapeCS11 = new GLTFShape("models/Rewards/rewardL3.gltf");
  gltfShapeCS11.withCollisions = true;
  gltfShapeCS11.isPointerBlocker = true;
  gltfShapeCS11.visible = true;
  rewardL3.addComponentOrReplace(gltfShapeCS11);

  const rewardL4 = new Entity("rewardL4");
  engine.addEntity(rewardL4);
  rewardL4.setParent(_scene);
  const transformCS12 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  rewardL4.addComponentOrReplace(transformCS12);
  const gltfShapeCS12 = new GLTFShape("models/Rewards/rewardL4.gltf");
  gltfShapeCS12.withCollisions = true;
  gltfShapeCS12.isPointerBlocker = true;
  gltfShapeCS12.visible = true;
  rewardL4.addComponentOrReplace(gltfShapeCS12);

  const rewardR1 = new Entity("rewardR1");
  engine.addEntity(rewardR1);
  rewardR1.setParent(_scene);
  const transformCS13 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  rewardR1.addComponentOrReplace(transformCS13);
  const gltfShapeCS13 = new GLTFShape("models/Rewards/rewardR1.gltf");
  gltfShapeCS13.withCollisions = true;
  gltfShapeCS13.isPointerBlocker = true;
  gltfShapeCS13.visible = true;
  rewardR1.addComponentOrReplace(gltfShapeCS13);

  const rewardR2 = new Entity("rewardR2");
  engine.addEntity(rewardR2);
  rewardR2.setParent(_scene);
  const transformCS14 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  rewardR2.addComponentOrReplace(transformCS14);
  const gltfShapeCS14 = new GLTFShape("models/Rewards/rewardR2.gltf");
  gltfShapeCS14.withCollisions = true;
  gltfShapeCS14.isPointerBlocker = true;
  gltfShapeCS14.visible = true;
  rewardR2.addComponentOrReplace(gltfShapeCS14);

  const rewardR3 = new Entity("rewardR3");
  engine.addEntity(rewardR3);
  rewardR3.setParent(_scene);
  const transformCS15 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  rewardR3.addComponentOrReplace(transformCS15);
  const gltfShapeCS15 = new GLTFShape("models/Rewards/rewardR3.gltf");
  gltfShapeCS15.withCollisions = true;
  gltfShapeCS15.isPointerBlocker = true;
  gltfShapeCS15.visible = true;
  rewardR3.addComponentOrReplace(gltfShapeCS15);

  const rewardR4 = new Entity("rewardR4");
  engine.addEntity(rewardR4);
  rewardR4.setParent(_scene);
  const transformCS16 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  rewardR4.addComponentOrReplace(transformCS16);
  const gltfShapeCS16 = new GLTFShape("models/Rewards/rewardR4.gltf");
  gltfShapeCS16.withCollisions = true;
  gltfShapeCS16.isPointerBlocker = true;
  gltfShapeCS16.visible = true;
  rewardR4.addComponentOrReplace(gltfShapeCS16);  
*/
  const rewardmd = new Entity("rewardmd");
  rewardmd.setParent(_scene);
  const transformCS17 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  rewardmd.addComponentOrReplace(transformCS17);
  const gltfShapeCS17 = new GLTFShape("models/Rewards/rewardmd.glb");
  rewardmd.addComponentOrReplace(gltfShapeCS17);
  rewardmd.addComponentOrReplace(
    new OnPointerDown(
      (e) => {
        openExternalURL("https://www.metadoge.art")
      },
      {  hoverText:  i18n.t("hoverMGMWeb",{ns:namespaces.ui.hovers}) })
    );
  engine.addEntity(rewardmd);

// Add auto dance

  const danceAreas: any = [
    {
      transform: {
        position: new Vector3(40, 0, 8),
        scale: new Vector3(15, 4, 15)
      },
      type: PredefinedEmote.ROBOT
    }]
  
  ////// DEBUG FLAG - Set to true to view all dance areas
  const DEBUG_FLAG = false
  
  
  ///// This system acts on the danceAreas defined above
  
  class DanceSystem {
    length = 11
    timer = 2
    routine: any
    danceFunction: () => void = () => {
      //   log('pointer Up')
      this.dance()
    }
  
    routines: PredefinedEmote[] = [
      PredefinedEmote.ROBOT,
      PredefinedEmote.TIK,
      PredefinedEmote.TEKTONIK,
      PredefinedEmote.HAMMER,
      PredefinedEmote.HEAD_EXPLODDE,
      PredefinedEmote.HANDS_AIR,
      PredefinedEmote.DISCO,
      PredefinedEmote.DAB
    ]
  
    constructor(routine: PredefinedEmote) {
      this.routine = routine
    }
  
    update(dt: number) {
      if (this.timer > 0) {
        this.timer -= dt
      } else {
        this.dance()
      }
    }
    dance() {
      this.timer = this.length
      if (this.routine === 'all') {
        const rand = Math.floor(Math.random() * (this.routine.length - 0) + 0)
        void triggerEmote({ predefined: this.routines[rand] })
      } else {
        void triggerEmote({ predefined: this.routine })
      }
    }
    addEvents() {
      Input.instance.subscribe(
        'BUTTON_UP',
        ActionButton.FORWARD,
        false,
        this.danceFunction
      )
  
      Input.instance.subscribe(
        'BUTTON_UP',
        ActionButton.BACKWARD,
        false,
        this.danceFunction
      )
  
      Input.instance.subscribe(
        'BUTTON_UP',
        ActionButton.RIGHT,
        false,
        this.danceFunction
      )
  
      Input.instance.subscribe(
        'BUTTON_UP',
        ActionButton.LEFT,
        false,
        this.danceFunction
      )
    }
    removeEvents() {
      Input.instance.unsubscribe(
        'BUTTON_UP',
        ActionButton.FORWARD,
        this.danceFunction
      )
  
      Input.instance.unsubscribe(
        'BUTTON_UP',
        ActionButton.BACKWARD,
        this.danceFunction
      )
  
      Input.instance.unsubscribe(
        'BUTTON_UP',
        ActionButton.RIGHT,
        this.danceFunction
      )
  
      Input.instance.unsubscribe(
        'BUTTON_UP',
        ActionButton.LEFT,
        this.danceFunction
      )
    }
  }
  
  for (const i in danceAreas) {
    const area = new Entity('dance-' + i);
    area.setParent(_scene);
    area.addComponent(new Transform(danceAreas[i].transform))
  
    void executeTask(async () => {
      if (DEBUG_FLAG && (await isPreviewMode())) {
        area.addComponent(new BoxShape())
        area.getComponent(BoxShape).withCollisions = false
      }
    })
  
    engine.addEntity(area)
    const dsystem = new DanceSystem(danceAreas[i].type)
  
    area.addComponent(
      new utils.TriggerComponent(
        new utils.TriggerBoxShape(
          new Vector3(
            area.getComponent(Transform).scale.x,
            area.getComponent(Transform).scale.y,
            area.getComponent(Transform).scale.z
          ),
          new Vector3(0, 2.5, 0)
        ),
        {
          enableDebug: false,
          onCameraEnter: () => {
            engine.addSystem(dsystem)
            dsystem.addEvents()
          },
          onCameraExit: () => {
            dsystem.removeEvents()
            engine.removeSystem(dsystem)
          }
        }
      )
    )
  }  



  //loadArcade()

  //START CUSTOM TRIGGER FOR CITY ENTRY

  const cityWideTrigger = new Entity("cityWideTrigger");
  engine.addEntity(cityWideTrigger);
  cityWideTrigger.setParent(_scene);
  const Xtransform116 = new Transform({
    position: new Vector3(27, 4, 43),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  cityWideTrigger.addComponentOrReplace(Xtransform116);

  //true dims - "96, 99, 80"
  //true dims - "88, 88, 76"
  const cityWideTriggerResults: PrepareHostForTriggerResult =
    prepareHostForTrigger(
      _scene,
      cityWideTrigger,
      true,
      false,
      "88, 88, 76",
      undefined,
      undefined
    );

  const vox8ParkTrigger = new Entity("vox8ParkTrigger");
  engine.addEntity(vox8ParkTrigger);
  vox8ParkTrigger.setParent(_scene);
  //vox8ParkTrigger.addComponent(new BoxShape())
  const Xtransform116Skate = new Transform({
    position: new Vector3(55, 4.6, 24),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(65, 8, 13),
  });
  vox8ParkTrigger.addComponentOrReplace(Xtransform116Skate);

  //true dims - "96, 99, 80"
  //true dims - "88, 88, 76"
  const vox8ParkTriggerResults: PrepareHostForTriggerResult =
    prepareHostForTrigger(
      _scene,
      vox8ParkTrigger,
      false,
      false,
      "1, 3, 1",
      undefined,
      undefined
    );

  //

  //START CUSTOM Zeitgeist//START CUSTOM Zeitgeist//START CUSTOM Zeitgeist

  const loadNonPrimaryScene = () => {
    /*const ufo = new Entity("ufo");
    engine.addEntity(ufo);
    ufo.setParent(_scene);
    const transform129 = new Transform({
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    ufo.addComponentOrReplace(transform129);
    const gltfShape8 = new GLTFShape(
      "e13fecce-d795-4b50-ba54-c4dc159436b3/UFO.gltf"
    );
    gltfShape8.withCollisions = true;
    gltfShape8.isPointerBlocker = true;
    gltfShape8.visible = true;
    ufo.addComponentOrReplace(gltfShape8);


    const background = new Entity('background')
    engine.addEntity(background)
    background.setParent(_scene)
    const transform163 = new Transform({
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1)
    })
    background.addComponentOrReplace(transform163)
    const gltfShape12 = new GLTFShape("c7ab28cd-7b89-431f-b13d-f4644c03d848/Background.gltf")
    gltfShape12.withCollisions = true
    gltfShape12.isPointerBlocker = true
    gltfShape12.visible = true
    background.addComponentOrReplace(gltfShape12)


    const xZeitgeist = new Entity('Zeitgeist')
    engine.addEntity(xZeitgeist)
    xZeitgeist.setParent(_scene)
    const Xtransform163 = new Transform({
      position: new Vector3(48, 0, 40),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1)
    })
    xZeitgeist.addComponentOrReplace(Xtransform163)
    const XgltfShape100 = new GLTFShape("models/Zeitgeist.gltf")
    XgltfShape100.withCollisions = true
    XgltfShape100.isPointerBlocker = true
    XgltfShape100.visible = true
    xZeitgeist.addComponentOrReplace(XgltfShape100)


      //END CUSTOM Zeitgeist //END CUSTOM Zeitgeist
      const xAdversting_walls = new Entity("Adversting_walls");
      engine.addEntity(xAdversting_walls);
      xAdversting_walls.setParent(_scene);
      const Xtransform201 = new Transform({
        position: new Vector3(48, 0, 40),
        rotation: new Quaternion(0, 0, 0, 1),
        scale: new Vector3(1, 1, 1),
      });
      xAdversting_walls.addComponentOrReplace(Xtransform201);
      const XgltfShape201 = new GLTFShape("models/Advertisingwalls.gltf");
      XgltfShape201.withCollisions = true;
      XgltfShape201.isPointerBlocker = true;
      XgltfShape201.visible = true;
      xAdversting_walls.addComponentOrReplace(XgltfShape201);
    };

    */
  };
  //loadNonPrimaryScene()
  handleDelayLoad(
    CONFIG.DELAY_LOAD_NON_PRIMARY_SCENE,
    "loadNonPrimaryScene",
    loadNonPrimaryScene
  );
  //START CUSTOM Adversting walls//START CUSTOM Adversting walls//START CUSTOM Adversting walls
  /*
  const xAdversting_walls = new Entity("Adversting_walls");
  engine.addEntity(xAdversting_walls);
  xAdversting_walls.setParent(_scene);
  const Xtransform201 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  xAdversting_walls.addComponentOrReplace(Xtransform201);
  const XgltfShape201 = new GLTFShape("models/Advertisingwalls.gltf");
  XgltfShape201.withCollisions = true;
  XgltfShape201.isPointerBlocker = true;
  XgltfShape201.visible = true;
  xAdversting_walls.addComponentOrReplace(XgltfShape201);
  */
  //loadNonPrimaryScene()

  //END CUSTOM Adversting walls //END CUSTOM Adversting walls

  //START CUSTOM CUSTOM NFTFrame
  /*
  //TODO consider moving these to nft-frames.ts
  const HQnftFrames:Entity[]=[]

  const xNFTFrame = new Entity('NFTFrame')
  engine.addEntity(xNFTFrame)
  HQnftFrames.push(xNFTFrame)
  xNFTFrame.setParent(_scene)
  const Xtransform205 = new Transform({
    position: new Vector3(16, 2, 8),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1)
  })
  xNFTFrame.addComponentOrReplace(Xtransform205)
  const XgltfShape205 = new GLTFShape("models/NFTFrame.gltf")
  XgltfShape205.withCollisions = true
  XgltfShape205.isPointerBlocker = true
  XgltfShape205.visible = true
  xNFTFrame.addComponentOrReplace(XgltfShape205)

  const xNFTFrame2 = new Entity('NFTFrame2')
  engine.addEntity(xNFTFrame2)
  HQnftFrames.push(xNFTFrame2)
  xNFTFrame2.setParent(_scene)
  const Xtransform206 = new Transform({
    position: new Vector3(8, 2, 16),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1)
  })
  xNFTFrame2.addComponentOrReplace(Xtransform206)
  xNFTFrame2.addComponentOrReplace(XgltfShape205) //reusing same model

  const xNFTFrame3 = new Entity('NFTFrame3')
  engine.addEntity(xNFTFrame3)
  HQnftFrames.push(xNFTFrame3)
  xNFTFrame3.setParent(_scene)
  const Xtransform207 = new Transform({
    position: new Vector3(8, 2, 24),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1)
  })
  xNFTFrame3.addComponentOrReplace(Xtransform207)
  xNFTFrame3.addComponentOrReplace(XgltfShape205)

  const xNFTFrame4 = new Entity('NFTFrame4')
  engine.addEntity(xNFTFrame4)
  HQnftFrames.push(xNFTFrame4)
  xNFTFrame4.setParent(_scene)
  const Xtransform208 = new Transform({
    position: new Vector3(24, 2, 8),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1)
  })
  xNFTFrame4.addComponentOrReplace(Xtransform208)
  xNFTFrame4.addComponentOrReplace(XgltfShape205)


  const xNFTFrame5 = new Entity('NFTFrame5')
  engine.addEntity(xNFTFrame5)
  HQnftFrames.push(xNFTFrame5)
  xNFTFrame5.setParent(_scene)
  const Xtransform209 = new Transform({
    position: new Vector3(32, 2, 8),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1)
  })
  xNFTFrame5.addComponentOrReplace(Xtransform209)
  xNFTFrame5.addComponentOrReplace(XgltfShape205)

  for(const p in HQnftFrames){
    const nftFrame = HQnftFrames[p]
    nftFrame.addComponent(new OnPointerDown(
      () => {
        //openNFTDialog(wearableNTF, null)
        openExternalURL(CONFIG.URL_METADOGE_NFT_2D)
      },
      {
        button: ActionButton.PRIMARY,
        hoverText: metadoge2dHoverText
      }
    )
  )
  }
  */
  //END CUSTOM NFTFrame

  // START CUSTOM Kusama//START CUSTOM Kusama//START CUSTOM Kusama
  /*
  const xKusama = new Entity('Kusama')
  engine.addEntity(xKusama)
  xKusama.setParent(_scene)
  const Xtransform201 = new Transform({
    position: new Vector3(8,0.5,8),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1)
  })
  xKusama.addComponentOrReplace(Xtransform201)
  const XgltfShape101 = new GLTFShape("models/Kusama.gltf")
  XgltfShape101.withCollisions = true
  XgltfShape101.isPointerBlocker = true
  XgltfShape101.visible = true
  xKusama.addComponentOrReplace(XgltfShape101)
  */
  //END CUSTOM Kusama //END CUSTOM Kusama

  // START CUSTOM Polkadot//START CUSTOM Polkadot//START CUSTOM Polkadot
  /*
  const xPolkadot = new Entity('Polkadot')
  engine.addEntity(xPolkadot)
  xPolkadot.setParent(_scene)
  const Xtransform202 = new Transform({
    position: new Vector3(8,0.5,24),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1)
  })
  xPolkadot.addComponentOrReplace(Xtransform202)
  const XgltfShape102 = new GLTFShape("models/Polkadot.gltf")
  XgltfShape102.withCollisions = true
  XgltfShape102.isPointerBlocker = true
  XgltfShape102.visible = true
  xPolkadot.addComponentOrReplace(XgltfShape102)
  */
  //END CUSTOM Polkadot //END CUSTOM Polkadot

  //START CUSTOM MetaDogeHQ//START MetaDogeHQ//START MetaDogeHQ
  /*
  const xMetaDogeHQ = new Entity("MetaDogeHQ");
  engine.addEntity(xMetaDogeHQ);
  xMetaDogeHQ.setParent(_scene);
  const Xtransform203 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  xMetaDogeHQ.addComponentOrReplace(Xtransform203);
  const XgltfShape202 = new GLTFShape("models/MetaDogeHQ.gltf");
  XgltfShape202.withCollisions = true;
  XgltfShape202.isPointerBlocker = true;
  XgltfShape202.visible = true;
  xMetaDogeHQ.addComponentOrReplace(XgltfShape202);
*/
  //END CUSTOM MetaDogeHQ //END CUSTOM MetaDogeHQ

  //START ROTATING HELMET//START ROTATING HELMET//START ROTATING HELMET//START ROTATING HELMET
  /*
  const xMDPWearableHelmet = new Entity('xMDPWearableHelmet')
  engine.addEntity(xMDPWearableHelmet)
  xMDPWearableHelmet.setParent(_scene)
  const xgltfShape = new GLTFShape("models/wearables/mucledoge_skin.glb")
  xgltfShape.withCollisions = true
  xgltfShape.isPointerBlocker = true
  xgltfShape.visible = true
  xMDPWearableHelmet.addComponentOrReplace(xgltfShape)
  //cannot use npcPlaceHolder6 because the scale is soo different lots of error in placement
  const wearableHelmetPos = getNpcPosition('npcPlaceHolder6',new Vector3(14, 3.2, 60.5),'relative')
  log("wearableHelmetPos " + wearableHelmetPos)

  wearableHelmetPos.y -= .4
  const xtransform2 = new Transform({
      position: wearableHelmetPos,
      rotation: Quaternion.Euler(0,215,0),
      scale: new Vector3(.6, .6, .6)
  })

  xMDPWearableHelmet.addComponentOrReplace(xtransform2)
  */
  /*
  //TODO NEED HELMET WEARABLE CONTRACT
  let wearableNTF = "ethereum://0x495f947276749ce646f68ac8c248420045cb7b5e/2272273421035365284426525578186006263842671319911985459048501126891233607681"
  const helmetMarketUrl = CONFIG.URL_MUSCLEDOGE_SKIN_URL //CONFIG.URL_METADOGE_HELMET_URL
  tubeContainer.addComponent(new OnPointerDown(
      () => {
        //openNFTDialog(wearableNTF, null)
        openExternalURL(helmetMarketUrl)
      },
      {
        button: ActionButton.PRIMARY,
        hoverText: 'Visit Decentraland Marketplace'
      }
    )
  )
  */

  /*
  const helmetText2 = new Entity('helmetText2')
  engine.addEntity(helmetText2)
  helmetText2.setParent(_scene)
  const transform153Helm2 = new Transform({
    position: new Vector3(12.840929985046387, 2.2085726261138916, 59.875648498535156),
    rotation: new Quaternion(-2.4085271740892887e-15, -0.8314696550369263, 9.911889975455779e-8, 0.5555702447891235),
    scale: new Vector3(0.3715662956237793, 0.37156471610069275, 0.3715662956237793)
  })
  xMDPWearableHelmet2.addComponentOrReplace(transform153Helm2)
  helmetText2.addComponentOrReplace(gltfShape10)
  */

  //END ROTATING HELMET//END ROTATING HELMET//END ROTATING HELMET//END ROTATING HELMET//END ROTATING HELMET

  // y - 48.44706726074219
  /*
  const XnpcPlaceHolder2 = new Entity('XnpcPlaceHolder2')
  engine.addEntity(XnpcPlaceHolder2)
  XnpcPlaceHolder2.setParent(_scene)
  //XnpcPlaceHolder2.addComponent(new BoxShape())
  const Xtransform89 = new Transform({
    position: new Vector3(80, 48.44706726074219, 35.5),
    //position: new Vector3(82, 1, 36.5),
    rotation: Quaternion.Euler(0,-45,0),
    scale: new Vector3(1, 1, 1)
  })
  XnpcPlaceHolder2.addComponentOrReplace(Xtransform89)

  /*
  const XnpcPlaceHolderSale2 = new Entity('XnpcPlaceHolderSale2')
  engine.addEntity(XnpcPlaceHolderSale2)
  XnpcPlaceHolderSale2.setParent(_scene)
  //XnpcPlaceHolder2.addComponent(new BoxShape())
  const XtransformXnpcPlaceHolderSale289 = new Transform({
    position: new Vector3(73, 48.44706726074219, 36),
    //position: new Vector3(82, 1, 36.5),
    rotation: Quaternion.Euler(0,-45,0),
    scale: new Vector3(1, 1, 1)
  })
  XnpcPlaceHolderSale2.addComponentOrReplace(XtransformXnpcPlaceHolderSale289) */

  /*
  const tubeContainer2 = new Entity('tubeContainer2')
  engine.addEntity(tubeContainer2)
  tubeContainer2.setParent(_scene)
  const transform150Tub2 = new Transform({
    //position: new Vector3(4, 2.092360258102417, 60.45151901245117),
    position: getNpcPosition('XnpcPlaceHolderSale2',new Vector3(80, 1, 35.5),'relative'),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(4.343614101409912, 3.6214797496795654, 4.343614101409912)
  })
  tubeContainer2.addComponentOrReplace(transform150Tub2)

  //tubeContainer2.addComponentOrReplace(gltfShape9)

  const tubeContainerShape = new Entity('tubeContainerShape')
  engine.addEntity(tubeContainerShape)
  tubeContainerShape.setParent(tubeContainer2)
  const transform150TubShape2 = new Transform({
    //position: new Vector3(4, 2.092360258102417, 60.45151901245117),
    position: new Vector3(0,0,0),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1)
  })
  tubeContainerShape.addComponentOrReplace(transform150TubShape2)

  tubeContainerShape.addComponentOrReplace(gltfShape9)
  */

  const XwaypointSkyMax1CE25 = new Entity("XwaypointSkyMax1CE25");
  engine.addEntity(XwaypointSkyMax1CE25);
  XwaypointSkyMax1CE25.setParent(_scene);
  const xTransformSkyMaz179 = new Transform({
    position: new Vector3(78, 48.44706726074219, 34),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  XwaypointSkyMax1CE25.addComponentOrReplace(xTransformSkyMaz179);

  const XwaypointSkyMax2CE25 = new Entity("XwaypointSkyMax2CE25");
  engine.addEntity(XwaypointSkyMax2CE25);
  XwaypointSkyMax2CE25.setParent(_scene);
  const xTransformSkyMaz279 = new Transform({
    position: new Vector3(67, 48.44706726074219, 38),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  XwaypointSkyMax2CE25.addComponentOrReplace(xTransformSkyMaz279);

  /*
  const xMDPWearableHelmet2 = new Entity('xMDPWearableHelmet2')
  engine.addEntity(xMDPWearableHelmet2)
  xMDPWearableHelmet2.setParent(tubeContainer2)
  //xMDPWearableHelmet2.setParent(_scene)
  xMDPWearableHelmet2.addComponentOrReplace(xgltfShape)
  //cannot use npcPlaceHolder6 because the scale is soo different lots of error in placement
  /*const wearableHelmetPos2 = getNpcPosition('npcPlaceHolder6',new Vector3(14, 2.2, 60.5),'relative')
  log("wearableHelmetPos2 " + wearableHelmetPos2)*/
  /*
  const xtransformHelmet2 = new Transform({
      position: new Vector3(0,.3,0),
      rotation: Quaternion.Euler(0,215,0),
      scale: new Vector3(.02*.27, .02*.27, .02*.27)
  })

  xMDPWearableHelmet2.addComponentOrReplace(xtransformHelmet2) */

  const AVATAR_SWAP_ENABLED = CONFIG.AVATAR_SWAP_ENABLED;
  const ENABLE_NPCS = CONFIG.ENABLE_NPCS;

  const enableSkyMazeInEngine = CONFIG.enableSkyMazeInEngine;
  const skyBridgeCasingVisible = CONFIG.skyBridgeCasingVisible;
  const skyMazeEnabledClickSound = CONFIG.skyMazeEnabledClickSound;
  const skyMazeMultiplayer = CONFIG.skyMazeMultiplayer; //only a local effect
  const skyMazeDisappearDelay = CONFIG.skyMazeDisappearDelay;
  const skyMazeDisappearCheatDelay = CONFIG.skyMazeDisappearCheatDelay;

  const visitMarketHoverText =
    "Get your Doge Head Helmet Now!\nVisit Decentraland Marketplace";

  const skyMazePeek = () => {
    const METHOD_NAME = "skyMazePeek";
    log(METHOD_NAME + " ENTRY ", helmetNftBalance);
    //openNFTDialog(wearableNTF, null)
    //openExternalURL(helmetMarketUrl)
    if (hasSkyMazeCriteria()) {
      log(METHOD_NAME + " calling lightUpAllKeys");
    } else {
      log(METHOD_NAME + " need a helmet");
      visitMarketForHelmet();
    }
    log(METHOD_NAME + " EXIT ");
  };
  const visitMarketForHelmet = () => {
    //openNFTDialog(wearableNTF, null)
    openExternalURL(CONFIG.URL_METADOGE_3D_MINT_URL);
  };

  //75 for hourly
  //
  const boardPlacement = 43.5;
  const boardPlacementZ = 14.40;
  const boardPlacementY = 5.8; //.8
 // const VoxboardPlacement = 48;
  //const VoxBoardXSpacing = 2;
  const boardXSpacing = 3.6;
  const boardTypeHourly = 0;
  const boardTypeDaily = 1;
  const boardTypeWeekly = 2;

  const leaderboardBigWeekly = new Entity("XleaderboardBigWeekly");
  engine.addEntity(leaderboardBigWeekly);
  leaderboardBigWeekly.setParent(_scene);
  //XsignpostTreeSkyMaze.setParent(_scene)
  leaderboardBigWeekly.addComponentOrReplace(
    new Transform({
      position: new Vector3(
        boardPlacementZ ,
        boardPlacementY,
        boardPlacement- boardXSpacing * boardTypeWeekly
      ),
      rotation: Quaternion.Euler(-30, 90, 0),
      scale: new Vector3(2.5, 2.5, 1),
    })
  );
/*
  const leaderboardVoxBigWeekly = new Entity("XleaderboardVoxBigWeekly");
  engine.addEntity(leaderboardVoxBigWeekly);
  leaderboardVoxBigWeekly.setParent(_scene);
  //XsignpostTreeSkyMaze.setParent(_scene)
  leaderboardVoxBigWeekly.addComponentOrReplace(
    new Transform({
      //position: new Vector3(boardPlacement-(boardXSpacing*boardTdypeWeekly), .4+6, 29),
      position: new Vector3(
        VoxboardPlacement - VoxBoardXSpacing * boardTypeWeekly,
        5,
        20
      ),
      rotation: Quaternion.Euler(0, 180, 0),
      scale: new Vector3(1.5, 1.5, 1),
    })
  );*/

  const leaderboardBigDaily = new Entity("XleaderboardBigDaily");
  engine.addEntity(leaderboardBigDaily);
  leaderboardBigDaily.setParent(_scene);
  //XsignpostTreeSkyMaze.setParent(_scene)
  leaderboardBigDaily.addComponentOrReplace(
    new Transform({
      position: new Vector3(
        boardPlacementZ ,
        boardPlacementY,
        boardPlacement- boardXSpacing * boardTypeDaily
      ),
      rotation: Quaternion.Euler(-30, 90, 0),
      scale: new Vector3(2.5, 2.5, 1),
    })
  );
/*
  const leaderboardVoxBigDaily = new Entity("XleaderboardVoxBigDaily");
  engine.addEntity(leaderboardBigDaily);
  leaderboardVoxBigDaily.setParent(_scene);
  //XsignpostTreeSkyMaze.setParent(_scene)
  leaderboardVoxBigDaily.addComponentOrReplace(
    new Transform({
      position: new Vector3(
        VoxboardPlacement - VoxBoardXSpacing * boardTypeDaily,
        5,
        20
      ),
      rotation: Quaternion.Euler(0, 180, 0),
      scale: new Vector3(1.5, 1.5, 1),
    })
  );*/

  const leaderboardBigHourly = new Entity("XleaderboardBigHourly");
  engine.addEntity(leaderboardBigHourly);
  leaderboardBigHourly.setParent(_scene);
  //XsignpostTreeSkyMaze.setParent(_scene)
  leaderboardBigHourly.addComponentOrReplace(
    new Transform({
      position: new Vector3(
        boardPlacementZ,
        boardPlacementY,
        boardPlacement - boardXSpacing * boardTypeHourly
      ),
      rotation: Quaternion.Euler(-30, 90, 0),
      scale: new Vector3(2.5, 2.5, 1),
    })
  );

  const invisibleWall = new Entity("invisibleWall");
  engine.addEntity(invisibleWall);
  invisibleWall.setParent(_scene);
  const XtransformX153 = new Transform({
    position: new Vector3(80.5, 49, 41.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(18.206729888916016, 0.5, 16.00000762939453),
  });
  invisibleWall.addComponentOrReplace(XtransformX153);

  //END BELIEVER BRIDGE//END BELIEVER BRIDGE//END BELIEVER BRIDGE

  //START GET HELMET COUNT
  const profile = "metacity";
  const version = "1";
  let helmetNftBalance: NftBalanceResponse;
  const subMethodConfigPromise = "XXconfigPromise: ";

  const getHelmetBalanceRequest = executeTask(async () => {
    let userData = getUserDataFromLocal();
    let publicKey:undefined|string
    if(!userData){
      await getAndSetUserData();
      userData = getUserDataFromLocal();

      publicKey = userData.publicKey
    }

    let config = await getHelmetBalance(profile, version, publicKey);

    log(subMethodConfigPromise + " response ", config);

    return config;
  });

  getHelmetBalanceRequest
    .catch(function (error) {
      log(
        subMethodConfigPromise + "ERROR#1 getting balance" + error,
        error
      );

      return null;
    })
    .then(function (value: NftBalanceResponse | null) {
      log(subMethodConfigPromise + "balance CONFIG answer ", value);
      if (value !== null) {
        helmetNftBalance = value;
      }

      updateHelmetDependants(helmetNftBalance);

      return helmetNftBalance;
    });

  function hasSkyMazeCriteria(): boolean {
    const METHOD_NAME = "hasSkyMazeCriteria";
    log(METHOD_NAME + " ENTRY ", helmetNftBalance);
    if (
      notNull(helmetNftBalance) &&
      notNull(helmetNftBalance.balance) &&
      helmetNftBalance.balance !== undefined
    ) {
      //CONFIG.PLAYER_NFT_DOGE_HELMET_BALANCE = helmetNftBalance.balance
      GAME_STATE.setNftDogeHelmetBalance(helmetNftBalance.balance);
      log(
        "CONFIG.PLAYER_NFT_DOGE_HELMET_BALANCE " +
          GAME_STATE.playerState.nftDogeHelmetBalance
      );
    }
    const retVal = GAME_STATE.playerState.nftDogeHelmetBalance > 0;
    log(METHOD_NAME + " EXIT ", retVal);
    return retVal;
  }

  function updateHelmetDependants(helmetNftBalance: NftBalanceResponse) {
    const METHOD_NAME = "updateHelmetDependants";
    log(METHOD_NAME + " ENTRY ", helmetNftBalance);

    const entityOnClickNeedUpdating: never[] = []; //[getEntityByName(XsignpostTreeSkyMaze.name+"-sign"),getEntityByName(XsignpostTreeSkyMaze.name+"-sign-text")]
    const entityTextNeedUpdating: never[] = []; //[getEntityByName(XsignpostTreeSkyMaze.name+"-sign-text")]

    const skyMazePerksEnabled = hasSkyMazeCriteria();

    const supporterText =
      "You own a Doge Head Helmet!\nThank you for supporting us!\nTake a 4 second Peek.\nShow Entire Maze";
    const notSupporterText =
      "Want a 4 second peek at the maze?\nGet Your Doge Head Helmet Now!\nVisit Decentraland Marketplace";
    const supporterTextShort = "Take a 4 second Peek. Show Entire Maze";
    const notSupporterTextShort =
      "Get Your Doge Head Helmet Now!\nVisit Decentraland Marketplace";

    for (const p in entityOnClickNeedUpdating) {
      const entity: Entity = entityOnClickNeedUpdating[p] as Entity;
      if (notNull(entity) && entity.hasComponent(OnPointerDown)) {
        if (skyMazePerksEnabled) {
          entity.getComponent(OnPointerDown).hoverText =
            entity.name ?? "".indexOf("sign") > -1
              ? supporterTextShort
              : supporterText;
        } else {
          entity.getComponent(OnPointerDown).hoverText =
            entity.name ?? "".indexOf("sign") > -1
              ? notSupporterTextShort
              : notSupporterText;
        }
      }
    }

    for (const p in entityTextNeedUpdating) {
      const entity: Entity = entityTextNeedUpdating[p] as Entity;
      //log("XXXX entityTextNeedUpdating $$" + entity.name)
      //log("XXXX entityTextNeedUpdating " + entity.name + " - " + entity.hasComponent(TextShape) )
      if (notNull(entity) && entity.hasComponent(TextShape)) {
        const textShape = entity.getComponent(TextShape);
        if (skyMazePerksEnabled) {
          textShape.value = supporterText;
        } else {
          textShape.value = notSupporterText;
        }
      }
    }

    log(METHOD_NAME + " EXIT ");
  }

  //END GET HELMET COUNT

  const aliceFollowActions: Actions = [
    {
      entityName: "toolboxCE",
      actionId: "facePlayer",
      values: {
        target: "npc-alice",
        lockMode: "quaternion",
        lockX: false,
        lockY: false,
        lockZ: false,
        curve: "linear",
        repeatAction: "relative",
        trackingType: "follow",
        speed: 20,
        multiplayer: false,
        onComplete: [],
      },
    },
    {
      entityName: "toolboxCE",
      actionId: "moveToPlayer",
      values: {
        target: "npc-alice",
        lockX: false,
        lockY: false,
        lockZ: false,
        moveNoCloserThan: 2,
        percentOfDistanceToTravel: 100,
        curve: "linear",
        repeatAction: "relative",
        trackingType: "follow",
        speed: 20,
        multiplayer: false,
        onComplete: [],
      },
    },
  ];
  const aliceFollowStopActions: Actions = [
    {
      entityName: "toolboxCE",
      actionId: "tweenControlAction",
      values: {
        target: "npc-alice",
        controlMode: "stop",
        tweenControlMove: true,
        tweenControlRotate: false,
        tweenControlScale: true,
        multiplayer: false,
        onComplete: [],
      },
    },
  ];

  const loadAddRobots = () => {
    addRobots();
    log("loadAddRobots calling addPets");
    try {
      addPets();
    } catch (e) {
      debugger;
      log("failed to load pet", e);
      //error(e)
    }

    let autoStart: Actions = [
      {
        entityName: "toolboxCE",
        actionId: "rotate",
        values: {
          target: "xMDPWearableHelmet",
          x: 0,
          y: 180,
          z: 0,
          curve: "linear",
          repeatAction: "relative",
          speed: 2,
          multiplayer: true,
          onComplete: [],
        },
      },
      {
        entityName: "toolboxCE",
        actionId: "followItemPath",
        values: {
          target: "movingball",
          targets: "",
          pathItem1: "waypointCERedBall2",
          pathItem2: "waypointCERedBall2b",
          pathItem3: "waypointCERedBall1",
          pathItem4: "",
          pathItem5: "",
          returnToFirst: true,
          turnToFaceNext: true,
          numberOfSegments: 20,
          lockX: false,
          lockY: false,
          lockZ: false,
          repeatAction: "absolute",
          speed: 14,
          multiplayer: false,
          onComplete: [],
        },
      },
    ];
    const aliceStartingActions = GAME_STATE.personalAssistantEnabled
      ? aliceFollowActions
      : aliceFollowStopActions;
    for (const p in aliceStartingActions) {
      autoStart.push(aliceStartingActions[p]);
    }
    logger.log("game.js", "sending autostart npc", null);
    toolboxChannel.sendActions(autoStart);
  };

  if (ENABLE_NPCS) {
    handleDelayLoad(CONFIG.DELAY_LOAD_NPCS, "loadAddRobots", loadAddRobots);
  }

  handleDelayLoad(CONFIG.DELAY_LOAD_UI_BARS, "loadUIBars", loadUIBars);

  const centeredSoundPosition = getNpcPosition(
    "XwaypointCE25",
    new Vector3(14, 2.2, 60.5),
    "relative"
  );

  //,{channelId:channel.id}
  const logger = new Logger("game.js", {});

  const channelId = Math.random().toString(16).slice(2);
  const channelBus = new MessageBus();
  const inventory = createInventory(UICanvas, UIContainerStack, UIImage);
  const options = { inventory };

  const CONTEST_TASKS = "";
  /*
        " 1/ Please follow our Twitters (MetaLiveStudio & Metdogepunks) "
        +"\n 2/ Tweet your selfie that was taken in the city "
        +"\n 3/ @MetaLiveStudio @Metadogepunks and 3 of your friends."*/

  const CONTEST_MSG2 = ""; //"To participate in our giveaway, \n" + CONTEST_TASKS
  const CONTEST_MSG = ""; //"To participate in our giveaway, find the Twitter buttons in the entrance \n"  + CONTEST_TASKS

  const CONTEST_SKY_MAZE_MSG2 = ""; //"To participate in our giveaway, \n" + CONTEST_TASKS

  const toolboxChannel: IChannel = createChannel(
    channelId,
    toolboxCE,
    channelBus
  );
  let autoStart: Actions = [
    //{"entityName":"toolboxCE","actionId":"facePlayer","values":{"target":"npc-alice","lockMode":"quaternion","lockX":false,"lockY":false,"lockZ":false,"curve":"linear","repeatAction":"relative","trackingType":"follow","speed":20,"multiplayer":false,"onComplete":[]}}
    //,{"entityName":"toolboxCE","actionId":"moveToPlayer","values":{"target":"npc-alice","lockX":false,"lockY":false,"lockZ":false,"moveNoCloserThan":2,"percentOfDistanceToTravel":100,"curve":"linear","repeatAction":"relative","trackingType":"follow","speed":20,"multiplayer":false,"onComplete":[]}}
    {
      entityName: "toolboxCE",
      actionId: "rotate",
      values: {
        target: "xMDPWearableHelmet",
        x: 0,
        y: 180,
        z: 0,
        curve: "linear",
        repeatAction: "relative",
        speed: 2,
        multiplayer: true,
        onComplete: [],
      },
    },
  ];

  //const script4 = new Script4();
  const poapBoothScriptInst = new PoapBoothScript();//was script5
  //const script6 = new Script6();
  //const script7 = new Script7();
  //const script8 = new Script8();
  //const script11 = new Script11()
  const avatarSwapScript2Inst = new AvatarSwapScript();//was script12
  const toolboxScriptInst = new ToolboxScript();//was script13
  //const script14 = new Script14();
  //const script15 = new Script15();
  const videoScreenScriptInst = new VideoScreenScript();//was script17
  const leaderBoardScriptInst = new LeaderBoardScript();//was script18

  //todo: Ina comment this block during the error cleaning, is options necesary? incompatible with init button
  /* script1.init(options);
  script2.init(options);
  script3.init(options);
  script4.init(options);
  script5.init(options);
  script6.init(options);
  script7.init(options);
  script8.init(options);
  script9.init(options);
  script10.init(options);
  script12.init(options);
  script13.init(options);
  script14.init(options);
  script15.init(options);
  script16.init(options);
  script17.init(options);
  script18.init(options); */
  //Added init without options

  //verticleWhitePadScriptInst.init();
  //script4.init();
  poapBoothScriptInst.init();
  //script6.init();
  //script7.init();
  //script8.init();
  avatarSwapScript2Inst.init();
  toolboxScriptInst.init();
  //script14.init();
  //script15.init();
  videoScreenScriptInst.init();
  leaderBoardScriptInst.init();

  toolboxScriptInst.spawn(toolboxCE, { loggingLevel: "WARN" }, toolboxChannel);

  //const ToolboxScript: toolboxScript = toolboxScriptInst;

  avatarSwapScript2InstExport = avatarSwapScript2Inst;

  //CUSTOM TRIGGER AREA FOR EVENT
  if (false) {
    //block scope
    let timesFired = 0;
    const trigger = new utils.TriggerBoxShape(
      cityWideTriggerResults.triggerAreaDims.clone(),
      //new Vector3(hostPos.x-triggerAreaDims.x, triggerAreaDims.y/2, hostPos.z-triggerAreaDims.z)
      cityWideTriggerResults.triggerPos
    );

    cityWideTrigger.addComponent(
      new utils.TriggerComponent(trigger, {
        onCameraEnter: () => {
          log("enter city: " + timesFired);

          if (timesFired < 99) {
            log("show messge " + timesFired);
            toolboxChannel.sendActions([
              {
                entityName: "toolboxCE",
                actionId: "print",
                values: {
                  message: CONTEST_MSG,
                  duration: 10,
                  multiplayer: false,
                },
              },
            ]);
          }
          timesFired++;
        },
        onCameraExit: () => {
          log("leave city: ");
        },
        enableDebug: false,
      })
    );
  }
  //

  //START CUSTOM TRIGGER FOR VOXPARK
  if (false) {
    const trigger = new utils.TriggerBoxShape(
      vox8ParkTriggerResults.triggerAreaDims.clone(),
      //new Vector3(hostPos.x-triggerAreaDims.x, triggerAreaDims.y/2, hostPos.z-triggerAreaDims.z)
      vox8ParkTriggerResults.triggerPos
    );

    vox8ParkTrigger.addComponent(
      new utils.TriggerComponent(trigger, {
        onCameraEnter: () => {
          log("enter skate park: ");
          GAME_STATE.setInVox8Park(true);
        },
        onCameraExit: () => {
          log("leave skate park: ");
          GAME_STATE.setInVox8Park(false);
        },
        enableDebug: false,
      })
    );
    log("vox8ParkTrigger");
    log(
      "vox8ParkTrigger",
      vox8ParkTrigger.hasComponent(utils.TriggerComponent)
    );
    log(
      "vox8ParkTrigger",
      vox8ParkTrigger.getComponent(utils.TriggerComponent)
    );
  }
  //END CUSTOM TRIGGER FOR VOXPARK

  const rewardHeadEntities: IEntity[] = [];
  /*

  const rewardLookup = createTargetList("rewardL1","reward[LR][0-9]")

  if(rewardLookup){
    for(const p in rewardLookup){
      const targetItm = rewardLookup[p]
      const entities:IEntity[] = getEntityBy(targetItm)

      for(const p in entities){
        let entity = entities[p]

        if (entity && entity !== undefined) {
          rewardHeadEntities.push(entity)
        }
      }
    }
  }*/
  /*
  Charlie said he will place each item explicitly and handle rotation so no need for this for now
  const keepRotatingComp = new utils.KeepRotatingComponent(Quaternion.Euler(0,15,0))
  let counter = 10
  let row = 0
  let col = 0
  for(let x =0;x<counter;x++){
    if(x==counter/2){
      col = 0
    }
    if(x>=counter/2){
      row = 1
    }
    //const ent = rewardHeadEntities[p] as Entity

    const boxReward = new Entity('boxReward'+row + ","+col)
    boxReward.addComponent(new BoxShape())
    engine.addEntity(boxReward)
    boxReward.setParent(_scene)

    boxReward.addComponentOrReplace(new Transform({
      //{ position: new Vector3( 34.648681640625 , 3.3254482746124268 , 17.1937255859375 ) },HIT ENTITY:  main(Ecl) POS:  {position: {…}, rotation: {…}, scale: {…}}
        position: new Vector3(17.2+ (col*5), 2.3, 34.6 + (row*10.5) ),
        rotation: new Quaternion(0, 0, 0, 1),
        scale: new Vector3(1, 1, 1)
      }))


    boxReward.addComponent(keepRotatingComp)

    col++
    //counter++
    //ent.addComponent(keepRotatingComp)
  }
  */
/*
  verticleWhitePadScriptInst.spawn(
    verticalWhitePad,
    {
      distance: 13,
      speed: 6,
      autoStart: true,
      onReachEnd: [
        { entityName: "verticalWhitePad", actionId: "goToStart", values: {} },
      ],
      onReachStart: [
        { entityName: "verticalWhitePad", actionId: "goToEnd", values: {} },
      ],
    },
    createChannel(channelId, verticalWhitePad, channelBus)
  );
  verticleWhitePadScriptInst.spawn(
    verticalWhitePad2,
    {
      distance: 9,
      speed: 6,
      autoStart: true,
      onReachEnd: [
        { entityName: "verticalWhitePad2", actionId: "goToStart", values: {} },
      ],
      onReachStart: [
        { entityName: "verticalWhitePad2", actionId: "goToEnd", values: {} },
      ],
    },
    createChannel(channelId, verticalWhitePad2, channelBus)
  );
  verticleWhitePadScriptInst.spawn(
    verticalWhitePad3,
    {
      distance: 25,
      speed: 6,
      autoStart: true,
      onReachEnd: [
        { entityName: "verticalWhitePad3", actionId: "goToStart", values: {} },
      ],
      onReachStart: [
        { entityName: "verticalWhitePad3", actionId: "goToEnd", values: {} },
      ],
    },
    createChannel(channelId, verticalWhitePad3, channelBus)
  );
  verticleWhitePadScriptInst.spawn(
    verticalWhitePad4,
    {
      distance: 17,
      speed: 6,
      autoStart: true,
      onReachEnd: [
        { entityName: "verticalWhitePad4", actionId: "goToStart", values: {} },
      ],
      onReachStart: [
        { entityName: "verticalWhitePad4", actionId: "goToEnd", values: {} },
      ],
    },
    createChannel(channelId, verticalWhitePad4, channelBus)
  );
  verticleWhitePadScriptInst.spawn(
    verticalWhitePad5,
    {
      distance: 31,
      speed: 4,
      autoStart: true,
      onReachEnd: [
        { entityName: "verticalWhitePad5", actionId: "goToStart", values: {} },
      ],
      onReachStart: [
        { entityName: "verticalWhitePad5", actionId: "goToEnd", values: {} },
      ],
    },
    createChannel(channelId, verticalWhitePad5, channelBus)
  );
  verticleWhitePadScriptInst.spawn(
    verticalWhitePad6,
    {
      distance: 35,
      speed: 6,
      autoStart: true,
      onReachEnd: [
        { entityName: "verticalWhitePad6", actionId: "goToStart", values: {} },
      ],
      onReachStart: [
        { entityName: "verticalWhitePad6", actionId: "goToEnd", values: {} },
      ],
    },
    createChannel(channelId, verticalWhitePad6, channelBus)
  );
  verticleWhitePadScriptInst.spawn(
    verticalWhitePad7,
    {
      distance: 17,
      speed: 4,
      autoStart: true,
      onReachEnd: [
        { entityName: "verticalWhitePad7", actionId: "goToStart", values: {} },
      ],
      onReachStart: [
        { entityName: "verticalWhitePad7", actionId: "goToEnd", values: {} },
      ],
    },
    createChannel(channelId, verticalWhitePad7, channelBus)
  );
  verticleWhitePadScriptInst.spawn(
    verticalWhitePad8,
    {
      distance: 56,
      speed: 2,
      autoStart: true,
      onReachEnd: [
        { entityName: "verticalWhitePad8", actionId: "goToStart", values: {} },
      ],
      onReachStart: [
        { entityName: "verticalWhitePad8", actionId: "goToEnd", values: {} },
      ],
    },
    createChannel(channelId, verticalWhitePad8, channelBus)
  );
  verticleWhitePadScriptInst.spawn(
    verticalWhitePad9,
    {
      distance: 52,
      speed: 2,
      autoStart: true,
      onReachEnd: [
        { entityName: "verticalWhitePad9", actionId: "goToStart", values: {} },
      ],
      onReachStart: [
        { entityName: "verticalWhitePad9", actionId: "goToEnd", values: {} },
      ],
    },
    createChannel(channelId, verticalWhitePad9, channelBus)
  );
  verticleWhitePadScriptInst.spawn(
    verticalWhitePad10,
    {
      distance: 30,
      speed: 4,
      autoStart: true,
      onReachEnd: [
        { entityName: "verticalWhitePad10", actionId: "goToStart", values: {} },
      ],
      onReachStart: [
        { entityName: "verticalWhitePad10", actionId: "goToEnd", values: {} },
      ],
    },
    createChannel(channelId, verticalWhitePad10, channelBus)
  );*/
  /*
  const loadFireWorks = ()=>{
    log("loadFireWorks")
  script1.spawn(clickArea, {"enabled":true,"onClickText":"Fire me","button":"POINTER","onClick":[{"entityName":"fireworkCC","actionId":"launchFirework","values":{"delay":0}},{"entityName":"fireworkCC2","actionId":"launchFirework","values":{"delay":2000}},{"entityName":"fireworkCC3","actionId":"launchFirework","values":{"delay":4000}},{"entityName":"fireworkCC4","actionId":"launchFirework","values":{"delay":6000}},{"entityName":"fireworkCC5","actionId":"launchFirework","values":{"delay":10000}}]}, createChannel(channelId, clickArea, channelBus))
  script4.spawn(fireworkCC, {"enabled":true,"fireWorkShapeName":"Firework_05.glb"}, createChannel(channelId, fireworkCC, channelBus))
  script4.spawn(fireworkCC2, {"enabled":true,"fireWorkShapeName":"Firework_06.glb","onLaunch":[]}, createChannel(channelId, fireworkCC2, channelBus))
  script4.spawn(fireworkCC3, {"enabled":true,"fireWorkShapeName":"Firework_07.glb"}, createChannel(channelId, fireworkCC3, channelBus))
  script4.spawn(fireworkCC4, {"enabled":true,"fireWorkShapeName":"Firework_02.glb"}, createChannel(channelId, fireworkCC4, channelBus))
  script4.spawn(fireworkCC5, {"enabled":true,"fireWorkShapeName":"Firework_03.glb"}, createChannel(channelId, fireworkCC5, channelBus))
  }
  handleDelayLoad(CONFIG.DELAY_LOAD_FIREWORKS,'loadFireWorks',loadFireWorks)
  */
  //script5.spawn(poapBooth, {"enableClickable":true,"clickButton":"POINTER","enabled":true,"visible":true,"enabledClickSound":true,"hoverTextEnabled":"Get Attendance Token"+"\n\n"+CONTEST_MSG2,"hoverTextDisabled":"Press Disabled","serviceUrl":"https://us-central1-sandbox-poap.cloudfunctions.net/app/","eventName":"meta-city-event0"}, createChannel(channelId, poapBooth, channelBus))
  //hprivos poap service
  //http://time-time.net/times/time-zones/world-time-zones.php helpful to get current time to add a few min to test
  poapBoothScriptInst.spawn(
    poapBooth,
    {
      serviceUrl: "https://www.metadoge.art/api/dcl/claim/poap",
      eventName: "29943",
      enableTime: "2022-03-25T13:00:00+00:00",
      enabled: true,
      enableClickable: true,
      visible: false,
      hoverTextEnabled: "Get Attendance Token" + "\n\n" + CONTEST_MSG2,
      hoverTextDisabled: "Press Disabled",
      clickButton: ActionButton.POINTER,
    },
    createChannel(channelId, poapBooth, channelBus)
  );

  /*script6.spawn(
    plainText10,
    {
      text: "Walk Against the Hand Rail\nPrevent Unexpected Falling",
      font: "SF",
      color: "#FFFFFF",
    },
    createChannel(channelId, plainText10, channelBus)
  );*/
  //script7.spawn(twitterButtonLink, {"url":"https://twitter.com/Metalivestudio","bnw":false,"name":"Meta Live Studio"}, createChannel(channelId, twitterButtonLink, channelBus))
  //script8.spawn(discordButtonLink, {"url":"https://discord.com/invite/metadoge","bnw":false,"name":"MetaDoge"}, createChannel(channelId, discordButtonLink, channelBus))


  //START MUSCLE DOGE MNAUAL PATH//START MUSCLE DOGE MNAUAL PATH//START MUSCLE DOGE MNAUAL PATH
  /*
  script10.spawn(XwaypointCE25, {"active":false,"target":"text","pathIndex":0,"targetAltName":"muscleDogeWalking"}, createChannel(channelId, XwaypointCE25, channelBus))
  script10.spawn(XwaypointCE20, {"active":false,"target":"text","pathIndex":1,"targetAltName":"muscleDogeWalking"}, createChannel(channelId, XwaypointCE20, channelBus))
  script10.spawn(XwaypointCE21, {"active":false,"target":"text","pathIndex":2,"targetAltName":"muscleDogeWalking"}, createChannel(channelId, XwaypointCE21, channelBus))
  script10.spawn(XwaypointCE22, {"active":false,"target":"text","pathIndex":3,"targetAltName":"muscleDogeWalking"}, createChannel(channelId, XwaypointCE22, channelBus))
  script10.spawn(XwaypointCE23, {"active":false,"target":"text","pathIndex":4,"targetAltName":"muscleDogeWalking"}, createChannel(channelId, XwaypointCE23, channelBus))
  script10.spawn(XwaypointCE24, {"active":false,"target":"text","pathIndex":5,"targetAltName":"muscleDogeWalking"}, createChannel(channelId, XwaypointCE24, channelBus))
  */

  //END MUSCLE DOGE MNAUAL PATH//END MUSCLE DOGE MNAUAL PATH//END MUSCLE DOGE MNAUAL PATH


  avatarSwapScript2Inst.spawn(
    avatarSwap,
    {
      enabled: AVATAR_SWAP_ENABLED && GAME_STATE.avatarSwapEnabled,
      entireScene: true,
      whenActiveHideWho: "current",
      relative: true,
      enableAnimatorClips: false,
      debugTriggers: false,
      playerMovingCheckInterval: 0.05,
      sceneDimensions: "96, 99, 80",
    },
    createChannel(channelId, avatarSwap, channelBus)
  );

  //script9.spawn(npcPlaceHolder6, {"active":false,"npcEnabled":true,"npcName":"LilDoge"}, createChannel(channelId, npcPlaceHolder6, channelBus))
  //script7.spawn(twitterButtonLink2, {"url":"https://twitter.com/metadogeNFT","bnw":true,"name":"MetaDoge"}, createChannel(channelId, twitterButtonLink2, channelBus))

  //script15.spawn(signpostTree15, {"text":"Holders can turn\nto LilDoge in\nthe Meta CIty \nIn the future","fontSize":33}, createChannel(channelId, signpostTree15, channelBus))
  /*script18.spawn(
    signpostTree16,
    { text: "3 Mins \nShuttle \nBus-Pad \nPoint", fontSize: 30 },
    createChannel(channelId, signpostTree16, channelBus)
  );
  script18.spawn(
    signpostTree17,
    { text: "3 Mins \nShuttle \nBus-Pad \nPoint", fontSize: 30 },
    createChannel(channelId, signpostTree17, channelBus)
  );
  script18.spawn(
    signpostTree18,
    { text: "3 Mins \nShuttle \nUFO-Pad \nPoint", fontSize: 30 },
    createChannel(channelId, signpostTree18, channelBus)
  );
  script18.spawn(
    signpostTree19,
    { text: "3 Mins \nShuttle \nUFO-Pad \nPoint", fontSize: 30 },
    createChannel(channelId, signpostTree19, channelBus)
  );
  script18.spawn(
    signpostTree20,
    { text: "3 Mins \nShuttle \nUFO-Pad \nPoint", fontSize: 30 },
    createChannel(channelId, signpostTree20, channelBus)
  );
  script18.spawn(
    signpostTree21,
    { text: "3 Mins \nShuttle \nUFO-Pad \nPoint", fontSize: 30 },
    createChannel(channelId, signpostTree21, channelBus)
  );
  script18.spawn(
    signpostTree22,
    { text: "3 Mins \nShuttle \nUFO-Pad \nPoint", fontSize: 30 },
    createChannel(channelId, signpostTree22, channelBus)
  ); */

  let playerArr: PlayerLeaderboardEntryType[] = [];
  let leaderBoardPlaceHolderText = "\nSign in to see leaderboard";
  playerArr.push({
    DisplayName: "Sign in to see leaderboard",
    Position: 0,
    StatValue: 0,
  });
  /*for(let x=0;x<CONFIG.GAME_LEADEBOARD_MAX_RESULTS;x++){
    playerArr.push({DisplayName:"p"+x,Position:x,StatValue:100+x})
  }*/

  //leaderBoardPlaceHolderText+="\n\n"+"You"+99+"......"+"2344"

  //script15.spawn(leaderboardBigDaily, {"text":leaderBoardPlaceHolderText,"fontSize":15,"clickable":false}, createChannel(channelId, leaderboardBigDaily, channelBus))

  const LEADERBOARD_TITLE_TRANSFORM = new Transform({
    position: new Vector3(0, 1.4, -0.02),
  });
  const LEADERBOARD_TITLE2_TRANSFORM = new Transform({
    position: new Vector3(0, 1.57, -0.02),
  });
  const LEADERBOARD_SUPER_DOGIO_TEXT_SCALE = new Vector3(0.7, 0.7, 0.7);
  const LEADERBOARD_SUPER_DOGIO_FONT_COLOR = Color3.White();
  const LEADER_BOARD_SUPER_DOGIO_TITLE: string = undefined; //"Super Dogerio"
 
  LEADERBOARD_REGISTRY.hourly.push(makeLeaderboard(
    leaderboardBigHourly,
    undefined /*script18.model*/,
    undefined /*"Leaderboard (Hourly)"*/,
    LEADER_BOARD_SUPER_DOGIO_TITLE,
    leaderBoardPlaceHolderText,
    1,
    undefined,
    LEADERBOARD_TITLE_TRANSFORM,
    LEADERBOARD_TITLE2_TRANSFORM,
    new Transform({
      position: new Vector3(0, 1.28, -0.02),
      scale: LEADERBOARD_SUPER_DOGIO_TEXT_SCALE,
    }),
    LEADERBOARD_SUPER_DOGIO_FONT_COLOR
  ));

  LEADERBOARD_REGISTRY.daily.push(makeLeaderboard(
    leaderboardBigDaily,
    undefined /*script18.model*/,
    undefined /*"Leaderboard (Daily)"*/,
    LEADER_BOARD_SUPER_DOGIO_TITLE,
    leaderBoardPlaceHolderText,
    1,
    undefined,
    LEADERBOARD_TITLE_TRANSFORM,
    LEADERBOARD_TITLE2_TRANSFORM,
    new Transform({
      position: new Vector3(0, 1.28, -0.02),
      scale: LEADERBOARD_SUPER_DOGIO_TEXT_SCALE,
    }),
    LEADERBOARD_SUPER_DOGIO_FONT_COLOR
  ));

  LEADERBOARD_REGISTRY.weekly.push(makeLeaderboard(
    leaderboardBigWeekly,
    undefined /*script18.model*/,
    undefined /*"Leaderboard (Weekly)"*/,
    LEADER_BOARD_SUPER_DOGIO_TITLE,
    leaderBoardPlaceHolderText,
    1,
    undefined,
    LEADERBOARD_TITLE_TRANSFORM,
    LEADERBOARD_TITLE2_TRANSFORM,
    new Transform({
      position: new Vector3(0, 1.28, -0.02),
      scale: LEADERBOARD_SUPER_DOGIO_TEXT_SCALE,
    }),
    LEADERBOARD_SUPER_DOGIO_FONT_COLOR
  ));
    /*
  LEADERBOARD_REGISTRY.hourlyVoxSkate = makeLeaderboard(
    leaderboardVoxBigHourly,
    leaderBoardScriptInst.model,
    "Leaderboard (Hourly)",
    "sk8craft",
    leaderBoardPlaceHolderText,
    1,
    undefined,
    LEADERBOARD_TITLE_TRANSFORM,
    LEADERBOARD_TITLE2_TRANSFORM,
    new Transform({
      position: new Vector3(0, 1.28, -0.02),
      scale: new Vector3(0.6, 0.6, 0.6),
    })
  );

  LEADERBOARD_REGISTRY.dailyVoxSkate = makeLeaderboard(
    leaderboardVoxBigDaily,
    leaderBoardScriptInst.model,
    "Leaderboard (Daily)",
    "sk8craft",
    leaderBoardPlaceHolderText,
    1,
    undefined,
    LEADERBOARD_TITLE_TRANSFORM,
    LEADERBOARD_TITLE2_TRANSFORM,
    new Transform({
      position: new Vector3(0, 1.28, -0.02),
      scale: new Vector3(0.6, 0.6, 0.6),
    })
  );

  LEADERBOARD_REGISTRY.weeklyVoxSkate = makeLeaderboard(
    leaderboardVoxBigWeekly,
    leaderBoardScriptInst.model,
    "Leaderboard (Weekly)",
    "sk8craft",
    leaderBoardPlaceHolderText,
    1,
    undefined,
    LEADERBOARD_TITLE_TRANSFORM,
    LEADERBOARD_TITLE2_TRANSFORM,
    new Transform({
      position: new Vector3(0, 1.28, -0.02),
      scale: new Vector3(0.6, 0.6, 0.6),
    })
  );
    */
   

  const loadSkyMaze = () => {
    if (enableSkyMazeInEngine) {
    }
  };

  //loadSkyMaze() 

  let videoControlBar: AudioControlBar;
  let videoButton: VideoScreenScript;
  const videoScreenKey = videoStream1.name + "-screen";
  const loadAudioAndVideoBars = () => {
    log("loadAudioAndVideoBars");

    // For AudioStreams
    const backgroundSource: AudioSource = new AudioSource(
      new AudioClip("sounds/the-jaunt-fascinating-earthbound.mp3")
    );
    const audioControlBar = new AudioControlBar(backgroundSource, 30); // start at 100% because sound is positional
    //engine.addEntity(audioControlBar)
    audioControlBar.setOffset(0); //want top

    REGISTRY.audio.rootSceneBG = backgroundSource
    REGISTRY.audio.audioControlBar = audioControlBar

    const regularPlay =
      "https://player.vimeo.com/external/817201306.m3u8?s=5811d9173779a0404c14e94e3cd4c4e586415e90";
    //"https://player.vimeo.com/external/691600656.m3u8?s=c947ea55bb629c7585341e3c9c749fc0fa2afc1b"//mario

    const eventPlay =
      "https://player.vimeo.com/external/817201306.m3u8?s=5811d9173779a0404c14e94e3cd4c4e586415e90";

    //THIS IS THE REAL START END TIME
    const eventStart = new Date(Date.parse("2022-08-5T8:00:00+00:00"));
    const eventEnd = new Date(Date.parse("2022-08-20T8:00:00+00:00"));
    //UNCOMMENT ME (comment out above) TO TEST SHOW STARTING IN 10 SECONDS ENDING AFTER 40 SECONDS
    //const eventStart = new Date(Date.now() + 10*1000)//new Date(Date.parse("2022-05-01T12:00:00+00:00"))
    //const eventEnd = new Date(Date.now() + 50*1000)//new Date(Date.parse("2022-05-02T12:00:00+00:00"))

    const videoToPlay = regularPlay; //regularPlay
 
    videoButton = videoScreenScriptInst.spawn(
      videoStream1,
      {
        startOn: false,
        onClickText: "Play/Pause video",
        volume: 30,
        onClick: [
          { entityName: "videoStream1", actionId: "toggle", values: {} },
        ],
        customStation: videoToPlay,
      },
      createChannel(channelId, videoStream1, channelBus)
    );

    
    const videoSource = videoScreenScriptInst.video[videoScreenKey];

    videoControlBar: AudioControlBar;
    log("trying to add videoConrolBar " + videoSource, videoScreenScriptInst.video);
    if (videoSource !== null && videoSource !== undefined) {
      log("adding videoConrolBar " + videoSource);
      videoControlBar = new AudioControlBar(videoSource, 20); // start at 100% because sound is positional
      //engine.addEntity(videoControlBar)
      videoControlBar.setOffset(30); //want second if exists


      REGISTRY.videoTextures.videoControlBar = videoControlBar

      videoSource.loop = true;
    }

    backgroundSource.loop = true;
    backgroundSource.playing = true;

    class RunOfShow implements ISystem {
      counter = 0;
      started = false;
      intermissionStarted = false;
      countdownStarted = false;
      lapseTime = 0;
      interval = 1; //per second
      constructor() {}

      update(dt: number) {
        this.lapseTime += dt;
        if (this.lapseTime < this.interval) {
          return;
        }
        this.lapseTime = 0;
        log("check");

        let removeSystem = false;
        const now = Date.now();
        if (eventEnd.getTime() < now) {
          log("event over time after", eventEnd);
          removeSystem = true;

          if (this.started) {
            if (videoScreenScriptInst.video[videoScreenKey]) {
              videoScreenScriptInst.video[videoScreenKey].playing = false;
            }
            //revert back
            videoScreenScriptInst.video[videoScreenKey] = new VideoTexture(
              new VideoClip(regularPlay)
            );
            videoScreenScriptInst.materials[videoScreenKey].albedoTexture =
              videoScreenScriptInst.video[videoScreenKey];
            videoScreenScriptInst.materials[videoScreenKey].specularIntensity = 0;
            videoScreenScriptInst.materials[videoScreenKey].roughness = 1;
            videoScreenScriptInst.materials[videoScreenKey].metallic = 0;
            videoScreenScriptInst.materials[videoScreenKey].emissiveTexture =
              videoScreenScriptInst.video[videoScreenKey];
            videoScreenScriptInst.video[videoScreenKey].playing = true;
            videoScreenScriptInst.video[videoScreenKey].loop = true;

            videoControlBar.updateSource(videoScreenScriptInst.video[videoScreenKey]);
            videoControlBar.setVolume(20);
          }
        } else if (eventEnd.getTime() > now && eventStart.getTime() < now) {
          if (this.started) {
            log("event already started!!!"); //,eventStart,eventEnd)
            return;
          }
          log("event started!!!", eventStart, eventEnd);
          this.started = true;

          if (videoScreenScriptInst.video[videoScreenKey]) {
            videoScreenScriptInst.video[videoScreenKey].playing = false;
          }

          videoScreenScriptInst.video[videoScreenKey] = new VideoTexture(
            new VideoClip(eventPlay)
          );
          videoScreenScriptInst.materials[videoScreenKey].albedoTexture =
            videoScreenScriptInst.video[videoScreenKey];
          videoScreenScriptInst.materials[videoScreenKey].specularIntensity = 0;
          videoScreenScriptInst.materials[videoScreenKey].roughness = 1;
          videoScreenScriptInst.materials[videoScreenKey].metallic = 0;
          videoScreenScriptInst.materials[videoScreenKey].emissiveTexture =
            videoScreenScriptInst.video[videoScreenKey];
          videoScreenScriptInst.video[videoScreenKey].playing = true;
          videoScreenScriptInst.video[videoScreenKey].loop = true;

          videoControlBar.updateSource(videoScreenScriptInst.video[videoScreenKey]);
          videoControlBar.setVolume(50);

          //removeSystem = true
        } else {
          log("not time yet", eventStart, eventEnd); //,new Date())
        }

        if (removeSystem) {
          log("no more days, stop system");
          engine.removeSystem(this);
        }
      }
    }

    log("adding runof show");
    engine.addSystem(new RunOfShow());

    /*
    const entityBGSoundWrapper = new Entity("backgroundSource");
    entityBGSoundWrapper.addComponent(backgroundSource);
    engine.addEntity(entityBGSoundWrapper);

    centeredSoundPosition.y = 20;
    entityBGSoundWrapper.addComponent(
      new Transform({
        position: centeredSoundPosition, //-6*16
        scale: new Vector3(1, 1, 1),
      })
    );
    entityBGSoundWrapper.setParent(_scene)
    */
    //entityBGSoundWrapper.addComponent(new BoxShape())
  };

  handleDelayLoad(
    CONFIG.DELAY_LOAD_AUDIO_AND_VIDEO_BARS,
    "loadAudioAndVideoBars",
    loadAudioAndVideoBars
  );

  //POST SCRIPT INITS
  logger.log("game.js", "sending autostart stuff", null);
  toolboxChannel.sendActions(autoStart);

  //16 if to platform

  //log("XXX very end " + getEntityByName(XsignpostTreeSkyMaze.name+"-sign-text").hasComponent(TextShape))

  function isPlayerEligibleForAvatarSwap(user: UserData | null) {
    let matches = false;

    if (
      (user !== null && user !== undefined && user.avatar !== null) ||
      user?.avatar !== undefined
    ) {
      for (const p in user.avatar.wearables) {
        const wearble = user.avatar.wearables[p];
        for (const q in AVATAR_SWAP_WEARABLES) {
          if (wearble == AVATAR_SWAP_WEARABLES[q]) {
            matches = true;
            break;
          }
        }
      }
    }

    //no requirements, anyone can swap
    if (!CONFIG.AVATAR_SWAP_WEARBLE_DETECT_ENABLED) {
      matches = true;
    }

    log("isPlayerEligible " + user?.userId + " " + matches);
    return matches;
  }

  function checkIfPlayerAvatarSwap() {
    getUserData().then(function (value: UserData | null) {
      const enablable = isPlayerEligibleForAvatarSwap(value);
      log("userData " + enablable, value);

      let toggle = false;
      if (enablable && !GAME_STATE.avatarSwapEnabled) {
        toggle = true;
      } else if (!enablable && GAME_STATE.avatarSwapEnabled) {
        toggle = true;
      }

      if (toggle) {
        if (GAME_STATE.avatarSwapEnabled == false) {
          log("PLAYER_AVATAR_SWAP_ENABLED enable swap");
          GAME_STATE.setAvatarSwapEnabled(true);
          avatarSwapScript2Inst.setAvatarSwapTriggerEnabled(
            avatarSwap,
            GAME_STATE.avatarSwapEnabled
          );
        } else {
          log("PLAYER_AVATAR_SWAP_ENABLED disable swap");
          GAME_STATE.setAvatarSwapEnabled(false);
          avatarSwapScript2Inst.setAvatarSwapTriggerEnabled(
            avatarSwap,
            GAME_STATE.avatarSwapEnabled
          );
        }
      }
    });
  }
  //do on load
  //checkIfPlayerAvatarSwap();

  /*
  //not enabling this anymore will use button
  //TODO only check when CONFIG.PLAYER_NFT_DOGE_HELMET_BALANCE > 0
  class CheckPlayerChangedWearable implements ISystem {
    counter:number = 0
    update(dt: number) {
      //if(CONFIG.PLAYER_NFT_DOGE_HELMET_BALANCE<=0) return;

      //log(dt)
      this.counter += dt
      //check every .11 or more seconds
      if(this.counter >= CONFIG.CHECK_INTERVAL_CHECK_PLAYER_CHANGED){
        this.counter = 0 // reset counter
        log("check if players changed")

        checkIfPlayerAvatarSwap()

      }
    }
  }
  if(AVATAR_SWAP_ENABLED&&CONFIG.AVATAR_SWAP_WEARBLE_DETECT_ENABLED){
    engine.addSystem(new CheckPlayerChangedWearable())
  }
  */

  GAME_STATE.addChangeListener((key: string, newVal: any, oldVal: any) => {
    logChangeListenerEntry("listener.game.ts ", key, newVal, oldVal);

    switch (key) {
      //common ones on top
      case "avatarSwapEnabled":
        avatarSwapScript2Inst.setAvatarSwapTriggerEnabled(avatarSwap, newVal);
        break;

      case "metaDogeSwapEnabled":
        avatarSwapScript2Inst.setAvatarSwapTriggerEnabled(avatarSwap, newVal);
        break;
      case "personalAssistantEnabled":
        if (newVal) {
          toolboxChannel.sendActions(aliceFollowActions);
        } else {
          toolboxChannel.sendActions(aliceFollowStopActions);
          NPC_INSTANCES["alice"].talk(AliceDialog, "dismiss");
        }
    }
  });

  log("SCENE LOADED");
  const rootEntities: Entity[] = [_scene, npcs_parent, _scene2]; //versadexbox,

  const mainSubScene = new SubScene(0, "mainScene", [
    new SceneEntity("mainScene", rootEntities),
  ]);
  REGISTRY.entities.rootScene = _scene;
  mainSubScene.rootEntity = _scene;

  /*
  var callback = (type: string) : void => {
    if (type=="show"){
      if(videoButton){
        clickVideo()
        videoControlBar.setVolume(20)
      }
      log("test show")
    } else if (type =="hide"){
      log("test hide")
      clickVideo()
      videoControlBar.mute()
    }
  }*/

  //Test cube

  //ask to leave visible, its in blue dome

  function moveToAltScene() {
    if (
      gameSceneManager.activeScene.sceneName !== SceneNames.alternativeScene
    ) {
      gameSceneManager.moveTo(
        SceneNames.alternativeScene,
        REGISTRY.movePlayerTo.ALT_SCENE.position,
        REGISTRY.movePlayerTo.ALT_SCENE.cameraDir
      );
    } else {
      //gameSceneManager.moveTo(gameSceneManager.alternativeScene.sceneName, new Vector3( 15,2,63 ) );
      log("already in ");
      //gameSceneManager.moveTo(gameSceneManager.rootScene.sceneName);
    }
  }

  function moveToSecondaryAltScene() {
    if (
      gameSceneManager.activeScene.sceneName !==
      SceneNames.secondaryAlternativeScene
    ) {
      
      new LogoBlackBackground().show()
      gameSceneManager.moveTo(
        SceneNames.secondaryAlternativeScene,
        REGISTRY.movePlayerTo.ALT_SCENE.position,
        REGISTRY.movePlayerTo.ALT_SCENE.cameraDir
      );
    } else {
      //gameSceneManager.moveTo(gameSceneManager.alternativeScene.sceneName, new Vector3( 15,2,63 ) );
      log("already in ");
      //gameSceneManager.moveTo(gameSceneManager.rootScene.sceneName);
    }
  }
  /*
  const warpToAltSceneEnt2 = new Entity("127");
  warpToAltSceneEnt2.addComponent(new BoxShape());
  warpToAltSceneEnt2.addComponent(new Transform({
    position: new Vector3(16-4.5, 1, 48+.25), //24-.3
    scale: new Vector3(1.2,1.2,1.2)
  }));
  warpToAltSceneEnt2.addComponent(
    new OnPointerDown(
      (e) => {
        //toggleScenes()
      },
      {
        hoverText: "Go to New Dimension",
      }
    )
  );
  engine.addEntity(warpToAltSceneEnt2);*/
  /*
  const warpToAltSceneEnt = new Entity("127");
  warpToAltSceneEnt.setParent(_scene)
  warpToAltSceneEnt.addComponent(new BoxShape());
  warpToAltSceneEnt.addComponent(new Transform({
    position: new Vector3(48+.25, 1, 16-4.5), //24-.3
    scale: new Vector3(1.2,1.2,1.2)
  }));
  warpToAltSceneEnt.addComponent(
    new OnPointerDown(
      (e) => {
        moveToAltScene()
      },
      {
        hoverText: "Go to New Dimension",
      }
    )
  );
  engine.addEntity(warpToAltSceneEnt);*/

  //coords to summon pad 16+8.7, 24-.3, 48+4
/*
  const warpToAltSceneEnt = new Entity("warpToAltSceneEnt");
  warpToAltSceneEnt.setParent(_scene);
  const gltfShapeCS94 = new GLTFShape("models/Teleporter/Stageteleporter.glb");
  warpToAltSceneEnt.addComponentOrReplace(gltfShapeCS94);
  /*warpToAltSceneEnt.addComponent(
    CommonResources.RESOURCES.materials.transparent
  );
  warpToAltSceneEnt.addComponent(
    new Transform({
      position: new Vector3(26, 1, 6), //
      scale: new Vector3(1, 1, 1),
    })
  );
  warpToAltSceneEnt.addComponent(
    new OnPointerDown(
      (e) => {
        moveToAltScene();
      },
      {
        hoverText: "Go to Planet Stage",
      }
    )
  );
  engine.addEntity(warpToAltSceneEnt);
*/
  function setVideoPlaying(val?:boolean) {
    //videoButton.toggle(videoStream1,true)
    //videoButton.video.values.playing = true
    //videoButton.toggle(videoButton.video,true)
    if (videoButton) {
      //videoButton.clickVideo(val);
      videoButton.toggleByName(videoScreenKey,val)
    } else {
      log("warn clickVideo videoButton is null", videoButton);
    }
  }

  mainScene = new Scene(SceneNames.rootScene, mainSubScene);
  mainScene.addOnHideListener((entityWrap: BaseEntityWrapper) => {
    log("gamemanager.mainscene hide");
    setVideoPlaying(false);
    if (videoControlBar) videoControlBar.mute();
    if(REGISTRY.audio.rootSceneBG) REGISTRY.audio.rootSceneBG.playing = false

    if(REGISTRY.audio.audioControlBar) {
      REGISTRY.audio.audioControlBar.mute()
      REGISTRY.audio.audioControlBar.hide()
      //REGISTRY.audio.audioControlBar.
    }

    if(REGISTRY.videoTextures.videoControlBar) {
      //REGISTRY.videoTextures.videoControlBar.mute()
      //REGISTRY.videoTextures.videoControlBar.hide()
    }
  });
  mainScene.addOnShowListener((entityWrap: BaseEntityWrapper) => {
    if (videoButton) {
      setVideoPlaying(true);
      videoControlBar.setVolume(20);
 
      if(REGISTRY.videoTextures.videoControlBar){
        REGISTRY.videoTextures.videoControlBar.updateSource( videoButton.video[videoScreenKey] )
        REGISTRY.videoTextures.videoControlBar.unmute()
        REGISTRY.videoTextures.videoControlBar.setVolume(30)
        REGISTRY.videoTextures.videoControlBar.show()
      } 
    }
    if(REGISTRY.audio.rootSceneBG) REGISTRY.audio.rootSceneBG.playing = true
    
    if(REGISTRY.audio.audioControlBar){
      REGISTRY.audio.audioControlBar.unmute()
      REGISTRY.audio.audioControlBar.setVolume(5)
      REGISTRY.audio.audioControlBar.show()
    } 
    log("gamemanager.mainscene test show");
  });

  handleDelayLoad(CONFIG.DELAY_LOAD_NFT_FRAMES, "loadNftFrames", () => {
    log("loadNftFrames was commented out");
  });
  //handleDelayLoad(CONFIG.DELAY_LOAD_NFT_FRAMES, "loadNftFrames", loadNftFrames); //removed as of july21 2022
}
//end loadPrimaryScene load main scene//end loadPrimaryScene load main scene
//end loadPrimaryScene load main scene//end loadPrimaryScene load main scene

function loadAltScene() {
  initAltScene();
  const altSubScene = new SubScene(0, "rootalternativeScene", [
    new SceneEntity("rootalternativeScene", REGISTRY.entities.alternativeScene),
  ]);
  alternativeScene = new Scene(SceneNames.alternativeScene, altSubScene);
  
  alternativeScene.addOnHideListener((entityWrap: BaseEntityWrapper) => {
    log("gamemanager.alternativeScene hide");

  });
  alternativeScene.addOnShowListener((entityWrap: BaseEntityWrapper) => {
 
    log("gamemanager.alternativeScene show",REGISTRY.videoTextures.secondaryAlternativeScene.playing);
  });
}

function loadSecondAltScene() {
  initSecondAltScene();
  const secondAltSubScene = new SubScene(0, "secondaryrootalternativeScene", [
    new SceneEntity(
      "secondaryrootalternativeScene",
      REGISTRY.entities.secondaryAlternativeScene
    ),
  ]);
  secondaryAlternativeScene = new Scene(
    SceneNames.secondaryAlternativeScene,
    secondAltSubScene
  );

  secondaryAlternativeScene.addOnHideListener((entityWrap: BaseEntityWrapper) => {
    log("gamemanager.secondaryAlternativeScene hide");
    if(REGISTRY.videoTextures.secondaryAlternativeScene !== undefined ){
      REGISTRY.videoTextures.secondaryAlternativeScene.playing = false 
    }
  });
  secondaryAlternativeScene.addOnShowListener((entityWrap: BaseEntityWrapper) => {
    if(REGISTRY.videoTextures.secondaryAlternativeScene !== undefined ){
      REGISTRY.videoTextures.secondaryAlternativeScene.playing = true
      if(REGISTRY.videoTextures.videoControlBar){
        REGISTRY.videoTextures.videoControlBar.updateSource( REGISTRY.videoTextures.secondaryAlternativeScene )
      }
      log("gamemanager.secondaryAlternativeScene show",REGISTRY.videoTextures.secondaryAlternativeScene.playing);
    }else{
      log("gamemanager.secondaryAlternativeScene show","REGISTRY.videoTextures.secondaryAlternativeScene undefined");
    }
    
    
  });
}

function initGameSceneMgr() {
  gameSceneManager = new GameSceneManager(mainScene, [
    alternativeScene,
    secondaryAlternativeScene,
  ]);
  gameSceneManager.start();
  REGISTRY.sceneMgr = gameSceneManager;
}

/*const feetPositionDebugCube= new Entity()
feetPositionDebugCube.addComponent(new BoxShape()).withCollisions = false
feetPositionDebugCube.addComponent(new Transform({position:Vector3.One(),scale:new Vector3(2,.05,2)}))
engine.addEntity(feetPositionDebugCube)*/

//set to undefiend to get around sdk6 error 
//sdk bug cause this.queries[response.payload.queryId] is not a function but not my issue  and goes away after load
const directlyBelowPlayerRayCastID:number|undefined = undefined;
const SHUTTLE_PAD_MESH_NAME = "Pad_collider" //name of mesh for the shutte pad to start
class RaycastSystem implements ISystem {
  counter: number = 0;
  intervalSeconds = 0.25;
  physicsCast = PhysicsCast.instance;
  cameraInst = Camera.instance;

  padInit: boolean = false;

  onPad:boolean = false

  hitAnyCount:number = 0

  offset=new Vector3(0, .1, 0)//move up from feet a tiny bit
  distance=new Vector3(0, -2, 0)//seems a player can jump about 2x their height

  update(dt: number) {
    this.counter += dt;
    //check every .11 or more seconds
    if (this.counter >= this.intervalSeconds) {
      this.counter = 0; // reset counter

      const belowPlayer = this.cameraInst.feetPosition
        .clone()
        .addInPlace(this.offset)
        .addInPlace(this.distance); //distance of ray cast

        //feetPositionDebugCube.getComponent(Transform).position = this.cameraInst.feetPosition.clone().addInPlace(this.offset)
      
        let rayFromCamera = this.physicsCast.getRayFromPositions(
        this.cameraInst.position,
        belowPlayer
      );

      if (!this.padInit) {
        this.padInit =
          REGISTRY.entities.pad &&
          REGISTRY.entities.pad.entity &&
          REGISTRY.entities.pad.moveAnimState !== undefined;
      }

      //alternate between hit first and hitAll
      //helps with performance as hitAll cost more.
      //if no the pad no need to run a hitAll
      if(!this.onPad || this.hitAnyCount <= 0){
        this.physicsCast.hitFirst(
          rayFromCamera,
          (e) => {
            // Do stuff
            //log("rayFromPlayerButt HIT hitFirst ",e.didHit,e.entity.meshName,e.entity.entityId)
            if (this.padInit && e.didHit && e.entity.meshName == SHUTTLE_PAD_MESH_NAME) {
              REGISTRY.entities.pad.moveAnimState.play();
              this.onPad = true
            } else {
              //fall back to hit any, then die
              this.hitAnyCount = 1
              //REGISTRY.entities.pad.moveAnimState.pause();
            }
          },
          //sdk bug cause this.queries[response.payload.queryId] is not a function but not my issue  and goes away after load
          directlyBelowPlayerRayCastID
        );
      }else{
        this.hitAnyCount--
        this.physicsCast.hitAll(
          rayFromCamera,
          (e) => {
            // Do stuff
            //log("rayFromPlayerButt HIT hitAll ",e.didHit,e.entities)//,e.entity.meshName,e.entity.entityId)
            
            let hit = false
            if (this.padInit && e.didHit){
              for(const ent of e.entities){
                //log("rayFromPlayerButt HIT hitAll ",e.didHit,e.entities,"ent.entity.meshName",ent.entity.meshName)
                if(ent.entity.meshName == SHUTTLE_PAD_MESH_NAME) {
                  hit = true
                  break;
                }
              }
            }
            if(hit){
                this.onPad = true
                REGISTRY.entities.pad.moveAnimState.play();
            }else{
              this.onPad = false
              REGISTRY.entities.pad.moveAnimState.pause();
            }
          },
          //sdk bug cause this.queries[response.payload.queryId] is not a function but not my issue  and goes away after load
          directlyBelowPlayerRayCastID
        );
      }
    }
  }
}
function initRaycastSystem() {
  const system = new RaycastSystem();
  REGISTRY.sceneMgr.rootScene.addSystem(system);
  engine.addSystem(system);
}
async function start() {
  await initConfig();
  initRegistry();
  initGameState();
  registerLoginFlowListener()
  loadPrimaryScene();
  initGamiMallScene();
  loadAltScene();
  loadSecondAltScene();
  initGameSceneMgr();
  initResourceDropIns();
 
  executeTask(async () => {
    updateStoreNFTCounts()
  })

  initWearableStore();
  initUIGameHud();
  initUIStartGame();
  initUIEndGame();
  initUIStartGame();
  initUILoginGame();
  initUIRaffle();
  startDecentrally();
  addAutoPlayerLoginTrigger();

  handleDelayLoad(1000, "initRaycastSystem()", initRaycastSystem);

  if (CONFIG.TEST_CONTROLS_ENABLE) {
    //load once scene is up
    utils.setTimeout(400, () => {
      try {
        REGISTRY.ui.createDebugUIButtons();
      } catch (e) {
        log("failed to init debug buttons", e);
      }
    });
  } //END OF SHOW TEST BUTTONS
}

log("SCENE LOADED");
/*
getUserData().then(function (value: UserData | null) {
  log("userData " , value);
})*/
start();

onCameraModeChangedObservable.add(({ cameraMode }) => {
  if (!GAME_STATE.avatarSwapEnabled) return;
  if (cameraMode == CameraMode.FirstPerson) {
    disableArisa();
    log("Camera mode changed:", cameraMode);
  } else {
    enableArisa();
  }
});
