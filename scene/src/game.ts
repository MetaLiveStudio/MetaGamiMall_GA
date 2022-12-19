import { createChannel } from "../node_modules/decentraland-builder-scripts/channel";
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
import Script12, {
  disableArisa,
  enableArisa,
  prepareHostForTrigger,
  PrepareHostForTriggerResult,
} from "../385445f9-b94f-431a-8c67-7650c03c99cc/src/item";
//import * as utils from './decentralandecsutils/triggers/triggerSystem'
//import * as sceneutils from '@dcl/ecs-scene-utils';
import * as utils from "@dcl/ecs-scene-utils";
import { movePlayerTo } from "@decentraland/RestrictedActions";
//start builder script imports
import Script1 from "../846479b0-75d3-450d-bbd6-7e6b3355a7a2/src/item";
import Script2 from "../ef85eb18-f69c-431c-bcfd-dd51d70a604f/src/item";
import Script3 from "../7669807e-1ae3-4d31-a2fa-dbd7a1d66fcc/src/item";
import Script4 from "../410123a0-8213-47ee-800d-cc93cf1074cc/src/item";
import Script5 from "../bcebce0f-1873-4148-89bc-24c2ceb9b2cc/src/item"; //bring ME BACK!!!
import Script6 from "../ab84996d-dcdc-429c-818e-a7640239c803/src/item";
import Script7 from "../f89ab04f-46ef-42ea-912b-b194eb8d2f02/src/item";
import Script8 from "../8bd080c9-9954-43b2-a6ac-0b0913d298c0/src/item";
import Script9 from "../dfebc6ff-bbd4-45dd-ae6d-f363321946cc/src/item";
import Script10 from "../1d65b46f-f82c-4e72-839e-c695b92ddbcc/src/item";
//import Script11 from "../80d9cb1c-2fcf-4585-8e19-e2d5621fd54d/src/item"

import Script13, {
  createTargetList,
} from "../683aa047-8043-40f8-8d31-ceb7ab1b1300/src/item";
import Script14 from "../b88efbbf-2a9a-47b4-86e1-e38ecc2b433b/src/item";
import Script15 from "../7e78cd70-5414-4ec4-be5f-198ec9879a5e/src/item";
import Script16 from "../7d669c08-c354-45e4-b3a3-c915c8fd6b6e/src/item";
import Script17 from "../a747f104-5434-42a8-a543-8739c24cf253/src/item";
import Script18 from "../a5c32dfc-27c5-416b-bfbb-f66f871c8ea7/src/item";
import { loadNftFrames, _scene2 } from "./nft-frames";
import { AVATAR_SWAP_WEARABLES, CONFIG, initConfig } from "./config";
import { GAME_STATE, initGameState } from "./state";
import { handleDelayLoad } from "./delay-loader";
import { getUserDataFromLocal, getAndSetUserData } from "./userData";
import {
  LEADERBOARD_REGISTRY,
  makeLeaderboard,
  PlayerLeaderboardEntryType,
} from "./gamimall/leaderboard";

import { Spawner } from "node_modules/decentraland-builder-scripts/spawner";
import VersadexBillboard, { Props } from "dcl-cube/src/item";
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
import { NPC } from "./npcutils/index";
import Button from "../a747f104-5434-42a8-a543-8739c24cf253/src/item";
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
import { initAltScene } from "./modules/sceneMgmt/alternativeScene";

// FIXME refactor so gameplay can be imported and exlicitly invoked Import the custom gameplay code.
//import "./gamimall/gameplay";

//START COMMON VARS
const metadoge2dHoverText = "Mint Here";
//END COMMON VARS

export let avatarSwapScript: Script12;

export let gameSceneManager: GameSceneManager;

//FIXME, move somewhere better
let mainScene: Scene;
let alternativeScene: Scene;

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

  /*
  const clickArea = new Entity('clickArea')
  engine.addEntity(clickArea)
  clickArea.setParent(_scene)
  const transform33 = new Transform({
    position: new Vector3(7.420251846313477, 1.6673177480697632, 61.23249435424805),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(0.9804997444152832, 1.6889997720718384, 0.9804997444152832)
  })
  clickArea.addComponentOrReplace(transform33)

  const fireworksBox = new Entity('fireworksBox')
  engine.addEntity(fireworksBox)
  fireworksBox.setParent(_scene)
  const transform34 = new Transform({
    position: new Vector3(7.446603775024414, 1.4975833892822266, 61.40011978149414),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1.7037029266357422, 1.7037029266357422, 1.7037029266357422)
  })
  fireworksBox.addComponentOrReplace(transform34)
  const gltfShape3 = new GLTFShape("8838315c-b7e6-4066-9388-b6aa08f29df8/ChineseFireworks_01/ChineseFireworks_01.glb")
  gltfShape3.withCollisions = true
  gltfShape3.isPointerBlocker = true
  gltfShape3.visible = true
  fireworksBox.addComponentOrReplace(gltfShape3)
  */

  // Billboard

  const billboard = new VersadexBillboard();
  const spawner = new Spawner(billboard);

  let versadexbox = spawner.spawn(
    "billboard",
    new Transform({
      position: new Vector3(12, 2.5, 6.5),
      scale: new Vector3(1, 1, 1),
    }),
    {
      id: "c6821db5-9a7c-4d81-a688-123d01acca90",
      auto_rotate: true,
    }
  );

  const verticalWhitePad = new Entity("verticalWhitePad");
  engine.addEntity(verticalWhitePad);
  verticalWhitePad.setParent(_scene);
  const transform35 = new Transform({
    position: new Vector3(8, 0, 72),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  verticalWhitePad.addComponentOrReplace(transform35);

  const verticalWhitePad2 = new Entity("verticalWhitePad2");
  engine.addEntity(verticalWhitePad2);
  verticalWhitePad2.setParent(_scene);
  const transform36 = new Transform({
    position: new Vector3(24, 0, 72),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  verticalWhitePad2.addComponentOrReplace(transform36);

  const verticalWhitePad3 = new Entity("verticalWhitePad3");
  engine.addEntity(verticalWhitePad3);
  verticalWhitePad3.setParent(_scene);
  const transform37 = new Transform({
    position: new Vector3(24, 0, 56),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  verticalWhitePad3.addComponentOrReplace(transform37);

  const verticalWhitePad4 = new Entity("verticalWhitePad4");
  engine.addEntity(verticalWhitePad4);
  verticalWhitePad4.setParent(_scene);
  const transform38 = new Transform({
    position: new Vector3(24, 0, 24),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  verticalWhitePad4.addComponentOrReplace(transform38);

  const verticalWhitePad5 = new Entity("verticalWhitePad5");
  engine.addEntity(verticalWhitePad5);
  verticalWhitePad5.setParent(_scene);
  const transform39 = new Transform({
    position: new Vector3(56, 0, 23.889278411865234),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  verticalWhitePad5.addComponentOrReplace(transform39);

  const verticalWhitePad6 = new Entity("verticalWhitePad6");
  engine.addEntity(verticalWhitePad6);
  verticalWhitePad6.setParent(_scene);
  const transform40 = new Transform({
    position: new Vector3(56, 0, 7.999996185302734),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  verticalWhitePad6.addComponentOrReplace(transform40);

  const verticalWhitePad7 = new Entity("verticalWhitePad7");
  engine.addEntity(verticalWhitePad7);
  verticalWhitePad7.setParent(_scene);
  const transform41 = new Transform({
    position: new Vector3(88, 0, 23.889278411865234),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  verticalWhitePad7.addComponentOrReplace(transform41);

  const verticalWhitePad8 = new Entity("verticalWhitePad8");
  engine.addEntity(verticalWhitePad8);
  verticalWhitePad8.setParent(_scene);
  const transform42 = new Transform({
    position: new Vector3(72, 0, 56),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  verticalWhitePad8.addComponentOrReplace(transform42);

  const verticalWhitePad9 = new Entity("verticalWhitePad9");
  engine.addEntity(verticalWhitePad9);
  verticalWhitePad9.setParent(_scene);
  const transform43 = new Transform({
    position: new Vector3(40, 0, 56),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  verticalWhitePad9.addComponentOrReplace(transform43);

  const verticalWhitePad10 = new Entity("verticalWhitePad10");
  engine.addEntity(verticalWhitePad10);
  verticalWhitePad10.setParent(_scene);
  const transform44 = new Transform({
    position: new Vector3(56, 22.5, 56),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  verticalWhitePad10.addComponentOrReplace(transform44);

  const floorPianoCC = new Entity("floorPianoCC");
  engine.addEntity(floorPianoCC);
  floorPianoCC.setParent(_scene);
  const transform45 = new Transform({
    position: new Vector3(1, 0.40999531745910645, 71.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });

  floorPianoCC.addComponentOrReplace(transform45);

  const floorPianoCC2 = new Entity("floorPianoCC2");
  engine.addEntity(floorPianoCC2);
  floorPianoCC2.setParent(_scene);
  const transform46 = new Transform({
    position: new Vector3(7.5, 0.40999531745910645, 49),
    rotation: new Quaternion(
      -2.4085271740892887e-15,
      -0.7071068286895752,
      8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.000002384185791, 1, 1.000002384185791),
  });
  floorPianoCC2.addComponentOrReplace(transform46);

  const floorPianoCC3 = new Entity("floorPianoCC3");
  engine.addEntity(floorPianoCC3);
  floorPianoCC3.setParent(_scene);
  const transform47 = new Transform({
    position: new Vector3(42.5, 0.40999531745910645, 17),
    rotation: new Quaternion(
      -2.4085271740892887e-15,
      -0.7071068286895752,
      8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.000002145767212, 1, 1.000002145767212),
  });
  floorPianoCC3.addComponentOrReplace(transform47);

  /*
  const fireworkCC = new Entity('fireworkCC')
  engine.addEntity(fireworkCC)
  fireworkCC.setParent(_scene)
  const transform48 = new Transform({
    position: new Vector3(7.466527462005615, 0.6989388465881348, 60.99209976196289),
    rotation: new Quaternion(0.03506234660744667, -0.0005229563685134053, -0.014904214069247246, 0.9992738366127014),
    scale: new Vector3(1.2106809616088867, 1.2106974124908447, 1.2107075452804565)
  })
  fireworkCC.addComponentOrReplace(transform48)

  const fireworkCC2 = new Entity('fireworkCC2')
  engine.addEntity(fireworkCC2)
  fireworkCC2.setParent(_scene)
  const transform49 = new Transform({
    position: new Vector3(7.5302605628967285, 0.2525482177734375, 62.166465759277344),
    rotation: new Quaternion(-0.1288689523935318, 0.005229226313531399, -0.04020584747195244, 0.990832507610321),
    scale: new Vector3(1.389295220375061, 1.3892955780029297, 1.389294147491455)
  })
  fireworkCC2.addComponentOrReplace(transform49)

  const fireworkCC3 = new Entity('fireworkCC3')
  engine.addEntity(fireworkCC3)
  fireworkCC3.setParent(_scene)
  const transform50 = new Transform({
    position: new Vector3(7.2338385581970215, 0.17995810508728027, 61.643882751464844),
    rotation: new Quaternion(0, 0, -0.053260438144207, 0.9985806941986084),
    scale: new Vector3(1.418994426727295, 1.418994426727295, 1.418994426727295)
  })
  fireworkCC3.addComponentOrReplace(transform50)

  const fireworkCC4 = new Entity('fireworkCC4')
  engine.addEntity(fireworkCC4)
  fireworkCC4.setParent(_scene)
  const transform51 = new Transform({
    position: new Vector3(7.5, 0.5, 61.5),
    rotation: new Quaternion(-0.02856915071606636, -0.9995918273925781, 1.1639345132152812e-7, 1.0022372975981853e-7),
    scale: new Vector3(1.2897135019302368, 1.289715051651001, 1.2897146940231323)
  })
  fireworkCC4.addComponentOrReplace(transform51)

  const fireworkCC5 = new Entity('fireworkCC5')
  engine.addEntity(fireworkCC5)
  fireworkCC5.setParent(_scene)
  const transform52 = new Transform({
    position: new Vector3(7.671903133392334, 0.5, 61.83843994140625),
    rotation: new Quaternion(0, 0, -0.024707626551389694, 0.9996947050094604),
    scale: new Vector3(1.3217425346374512, 1.3217425346374512, 1.3217425346374512)
  })
  fireworkCC5.addComponentOrReplace(transform52)
  */

  const poapBooth = new Entity("poapBooth");
  engine.addEntity(poapBooth);
  poapBooth.setParent(_scene);
  const transform53 = new Transform({
    position: new Vector3(8, 0.8, 8.25),
    rotation: Quaternion.Euler(0, -90, 0),
    scale: new Vector3(1.5, 1.5, 1.5),
  });
  poapBooth.addComponentOrReplace(transform53);

  /*
  //AVATARSWAP TESTING
  const toggleTest = new Entity('toggleTest')
  engine.addEntity(toggleTest)
  toggleTest.setParent(_scene)
  const transform53toggleTest = new Transform({
    position: new Vector3(12.5, 0.35, 34),
    rotation: Quaternion.Euler(0, -90, 0),
    scale: new Vector3(1.3152852058410645, 1.3152762651443481, 1.3152852058410645)
  })
  toggleTest.addComponentOrReplace(transform53toggleTest)

  toggleTest.addComponent(new BoxShape())

  toggleTest.addComponent(new OnPointerDown(
      () => {
        if(CONFIG.PLAYER_AVATAR_SWAP_ENABLED == false){
          log("PLAYER_AVATAR_SWAP_ENABLED enable swap")
          CONFIG.PLAYER_AVATAR_SWAP_ENABLED = true
          script12.setAvatarSwapTriggerEnabled(avatarSwap,CONFIG.PLAYER_AVATAR_SWAP_ENABLED)
        }else{
          log("PLAYER_AVATAR_SWAP_ENABLED disable swap")
          CONFIG.PLAYER_AVATAR_SWAP_ENABLED = false
          script12.setAvatarSwapTriggerEnabled(avatarSwap,CONFIG.PLAYER_AVATAR_SWAP_ENABLED)
        }
      },
      { 
        button: ActionButton.PRIMARY,
        hoverText: 'Toggle Swap' 
      }
    )
  )

  */

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
    "c6b0fd6f-88a7-4a6c-a2fa-281706c5987e/Pad3.gltf"
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
  
  //16+8.7, 24-.3, 48+4
  //these coords here would be exact placement of a cube entity
  const transform54X = new Transform({
    position: new Vector3(48,0,40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  padSummon.addComponentOrReplace(transform54X)
  const gltfShapeCS21 = new GLTFShape(
    "models/summonpad.glb"
  );
  padSummon.addComponentOrReplace(gltfShapeCS21);

  padSummon.addComponent(
    new OnPointerDown(
      () => {
        resetPad();
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

  const floorPianoCC4 = new Entity("floorPianoCC4");
  engine.addEntity(floorPianoCC4);
  floorPianoCC4.setParent(_scene);
  const transform56 = new Transform({
    position: new Vector3(49, 0.40999531745910645, 64.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  floorPianoCC4.addComponentOrReplace(transform56);

  /*
  const twitterButtonLink = new Entity('twitterButtonLink')
  engine.addEntity(twitterButtonLink)
  twitterButtonLink.setParent(_scene)
  const transform57 = new Transform({
    position: new Vector3(12.5, 1.2310596704483032, 54),
    rotation: new Quaternion(3.342651678403362e-16, 0.7145393490791321, -8.517972815980102e-8, 0.6995952725410461),
    scale: new Vector3(1.000005841255188, 1, 1.000005841255188)
  })
  twitterButtonLink.addComponentOrReplace(transform57)

  const discordButtonLink = new Entity('discordButtonLink')
  engine.addEntity(discordButtonLink)
  discordButtonLink.setParent(_scene)
  const transform58 = new Transform({
    position: new Vector3(12.5, 1.2698924541473389, 55.5),
    rotation: new Quaternion(-4.337422788828777e-15, 0.4713967442512512, -5.6194870978742983e-8, 0.8819212913513184),
    scale: new Vector3(1.000002145767212, 1, 1.000002145767212)
  })
  discordButtonLink.addComponentOrReplace(transform58)
  */

  const floorPianoCC5 = new Entity("floorPianoCC5");
  engine.addEntity(floorPianoCC5);
  floorPianoCC5.setParent(_scene);
  const transform59 = new Transform({
    position: new Vector3(16.5, 9.409995079040527, 73),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  floorPianoCC5.addComponentOrReplace(transform59);

  const floorPianoCC6 = new Entity("floorPianoCC6");
  engine.addEntity(floorPianoCC6);
  floorPianoCC6.setParent(_scene);
  const transform60 = new Transform({
    position: new Vector3(20, 8.409995079040527, 73.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  floorPianoCC6.addComponentOrReplace(transform60);

  const floorPianoCC7 = new Entity("floorPianoCC7");
  engine.addEntity(floorPianoCC7);
  floorPianoCC7.setParent(_scene);
  const transform61 = new Transform({
    position: new Vector3(27, 8.409995079040527, 73.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  floorPianoCC7.addComponentOrReplace(transform61);

  const floorPianoCC8 = new Entity("floorPianoCC8");
  engine.addEntity(floorPianoCC8);
  floorPianoCC8.setParent(_scene);
  const transform62 = new Transform({
    position: new Vector3(23.5, 9.409995079040527, 49),
    rotation: new Quaternion(
      -2.4085271740892887e-15,
      -0.7071068286895752,
      8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.0000028610229492, 1, 1.0000028610229492),
  });
  floorPianoCC8.addComponentOrReplace(transform62);

  const floorPianoCC9 = new Entity("floorPianoCC9");
  engine.addEntity(floorPianoCC9);
  floorPianoCC9.setParent(_scene);
  const transform63 = new Transform({
    position: new Vector3(
      23.530370712280273,
      22.909996032714844,
      51.911678314208984
    ),
    rotation: new Quaternion(
      -2.4085271740892887e-15,
      -0.7071068286895752,
      8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.0000040531158447, 1, 1.0000040531158447),
  });
  floorPianoCC9.addComponentOrReplace(transform63);

  const floorPianoCC10 = new Entity("floorPianoCC10");
  engine.addEntity(floorPianoCC10);
  floorPianoCC10.setParent(_scene);
  const transform64 = new Transform({
    position: new Vector3(
      23.508840560913086,
      22.90869140625,
      58.93723678588867
    ),
    rotation: new Quaternion(
      -2.4085271740892887e-15,
      -0.7071068286895752,
      8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.000004768371582, 1, 1.000004768371582),
  });
  floorPianoCC10.addComponentOrReplace(transform64);

  const floorPianoCC11 = new Entity("floorPianoCC11");
  engine.addEntity(floorPianoCC11);
  floorPianoCC11.setParent(_scene);
  const transform65 = new Transform({
    position: new Vector3(
      23.48102569580078,
      22.901817321777344,
      61.898460388183594
    ),
    rotation: new Quaternion(
      -2.4085271740892887e-15,
      -0.7071068286895752,
      8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.000004768371582, 1, 1.000004768371582),
  });
  floorPianoCC11.addComponentOrReplace(transform65);

  const floorPianoCC12 = new Entity("floorPianoCC12");
  engine.addEntity(floorPianoCC12);
  floorPianoCC12.setParent(_scene);
  const transform66 = new Transform({
    position: new Vector3(
      39.01240921020508,
      48.94901657104492,
      48.94427490234375
    ),
    rotation: new Quaternion(
      -2.4085271740892887e-15,
      -0.7071068286895752,
      8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.0000054836273193, 1, 1.0000054836273193),
  });
  floorPianoCC12.addComponentOrReplace(transform66);

  const floorPianoCC13 = new Entity("floorPianoCC13");
  engine.addEntity(floorPianoCC13);
  floorPianoCC13.setParent(_scene);
  const transform67 = new Transform({
    position: new Vector3(
      38.98282241821289,
      50.0970573425293,
      51.95213317871094
    ),
    rotation: new Quaternion(
      -2.4085271740892887e-15,
      -0.7071068286895752,
      8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.0000066757202148, 1, 1.0000066757202148),
  });
  floorPianoCC13.addComponentOrReplace(transform67);

  const floorPianoCC14 = new Entity("floorPianoCC14");
  engine.addEntity(floorPianoCC14);
  floorPianoCC14.setParent(_scene);
  const transform68 = new Transform({
    position: new Vector3(
      39.05666732788086,
      50.0970573425293,
      59.00643539428711
    ),
    rotation: new Quaternion(
      -2.4085271740892887e-15,
      -0.7071068286895752,
      8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.000006914138794, 1, 1.000006914138794),
  });
  floorPianoCC14.addComponentOrReplace(transform68);

  const floorPianoCC15 = new Entity("floorPianoCC15");
  engine.addEntity(floorPianoCC15);
  floorPianoCC15.setParent(_scene);
  const transform69 = new Transform({
    position: new Vector3(
      23.47634506225586,
      12.906311988830566,
      30.03190803527832
    ),
    rotation: new Quaternion(
      -2.4085271740892887e-15,
      -0.7071068286895752,
      8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.0000040531158447, 1, 1.0000040531158447),
  });
  floorPianoCC15.addComponentOrReplace(transform69);

  const floorPianoCC16 = new Entity("floorPianoCC16");
  engine.addEntity(floorPianoCC16);
  floorPianoCC16.setParent(_scene);
  const transform70 = new Transform({
    position: new Vector3(
      24.061279296875,
      4.278572082519531,
      26.98544692993164
    ),
    rotation: new Quaternion(
      -2.4085271740892887e-15,
      -0.7071068286895752,
      8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.0000059604644775, 1, 1.0000059604644775),
  });
  floorPianoCC16.addComponentOrReplace(transform70);

  const floorPianoCC17 = new Entity("floorPianoCC17");
  engine.addEntity(floorPianoCC17);
  floorPianoCC17.setParent(_scene);
  const transform71 = new Transform({
    position: new Vector3(
      24.04793930053711,
      4.276188850402832,
      20.018619537353516
    ),
    rotation: new Quaternion(
      -2.4085271740892887e-15,
      -0.7071068286895752,
      8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.0000061988830566, 1, 1.0000061988830566),
  });
  floorPianoCC17.addComponentOrReplace(transform71);

  const floorPianoCC18 = new Entity("floorPianoCC18");
  engine.addEntity(floorPianoCC18);
  floorPianoCC18.setParent(_scene);
  const transform72 = new Transform({
    position: new Vector3(
      48.92872619628906,
      12.905076026916504,
      25.96595001220703
    ),
    rotation: new Quaternion(
      -4.384826987721864e-15,
      -8.940696716308594e-8,
      1.319333944665383e-14,
      -1
    ),
    scale: new Vector3(1.0000028610229492, 1, 1.0000028610229492),
  });
  floorPianoCC18.addComponentOrReplace(transform72);

  const floorPianoCC19 = new Entity("floorPianoCC19");
  engine.addEntity(floorPianoCC19);
  floorPianoCC19.setParent(_scene);
  const transform73 = new Transform({
    position: new Vector3(
      52.045204162597656,
      12.905250549316406,
      26.034034729003906
    ),
    rotation: new Quaternion(
      -4.384826987721864e-15,
      -8.940696716308594e-8,
      1.319333944665383e-14,
      -1
    ),
    scale: new Vector3(1.0000028610229492, 1, 1.0000028610229492),
  });
  floorPianoCC19.addComponentOrReplace(transform73);

  const floorPianoCC20 = new Entity("floorPianoCC20");
  engine.addEntity(floorPianoCC20);
  floorPianoCC20.setParent(_scene);
  const transform74 = new Transform({
    position: new Vector3(
      58.9476203918457,
      12.905250549316406,
      25.92946434020996
    ),
    rotation: new Quaternion(
      -4.384826987721864e-15,
      -8.940696716308594e-8,
      1.319333944665383e-14,
      -1
    ),
    scale: new Vector3(1.0000028610229492, 1, 1.0000028610229492),
  });
  floorPianoCC20.addComponentOrReplace(transform74);

  const floorPianoCC21 = new Entity("floorPianoCC21");
  engine.addEntity(floorPianoCC21);
  floorPianoCC21.setParent(_scene);
  const transform75 = new Transform({
    position: new Vector3(52, 30.425758361816406, 56),
    rotation: new Quaternion(
      -4.384826987721864e-15,
      -8.940696716308594e-8,
      1.319333944665383e-14,
      -1
    ),
    scale: new Vector3(1.0000028610229492, 1, 1.0000028610229492),
  });
  floorPianoCC21.addComponentOrReplace(transform75);

  const floorPianoCC22 = new Entity("floorPianoCC22");
  engine.addEntity(floorPianoCC22);
  floorPianoCC22.setParent(_scene);
  const transform76 = new Transform({
    position: new Vector3(59, 30.425758361816406, 56),
    rotation: new Quaternion(
      -4.384826987721864e-15,
      -8.940696716308594e-8,
      1.319333944665383e-14,
      -1
    ),
    scale: new Vector3(1.0000028610229492, 1, 1.0000028610229492),
  });
  floorPianoCC22.addComponentOrReplace(transform76);

  const floorPianoCC23 = new Entity("floorPianoCC23");
  engine.addEntity(floorPianoCC23);
  floorPianoCC23.setParent(_scene);
  const transform77 = new Transform({
    position: new Vector3(
      61.89426803588867,
      30.90465545654297,
      56.067161560058594
    ),
    rotation: new Quaternion(
      -4.384826987721864e-15,
      -8.940696716308594e-8,
      1.319333944665383e-14,
      -1
    ),
    scale: new Vector3(1.0000028610229492, 1, 1.0000028610229492),
  });
  floorPianoCC23.addComponentOrReplace(transform77);

  const floorPianoCC24 = new Entity("floorPianoCC24");
  engine.addEntity(floorPianoCC24);
  floorPianoCC24.setParent(_scene);
  const transform78 = new Transform({
    position: new Vector3(
      38.42344284057617,
      30.909996032714844,
      61.98925018310547
    ),
    rotation: new Quaternion(
      -2.4085271740892887e-15,
      -0.7071068286895752,
      8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.0000054836273193, 1, 1.0000054836273193),
  });
  floorPianoCC24.addComponentOrReplace(transform78);

  const npcPlaceHolder = new Entity("npcPlaceHolder");
  engine.addEntity(npcPlaceHolder);
  npcPlaceHolder.setParent(_scene);
  const transform79 = new Transform({
    position: new Vector3(30, 22.873924255371094, 56.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  npcPlaceHolder.addComponentOrReplace(transform79);

  //START MANUAL MUSCLE PATH//START MANUAL MUSCLE PATH//START MANUAL MUSCLE PATH
  //START MANUAL MUSCLE PATH//START MANUAL MUSCLE PATH//START MANUAL MUSCLE PATH

  /*
  const XwaypointCE20 = new Entity('XwaypointCE20')
  engine.addEntity(XwaypointCE20)
  XwaypointCE20.setParent(_scene)
  const xTransform74 = new Transform({
    position: new Vector3(10.846829414367676, 0.31330442428588867, 39.4229621887207),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1)
  })
  XwaypointCE20.addComponentOrReplace(xTransform74)

  const XwaypointCE21 = new Entity('XwaypointCE21')
  engine.addEntity(XwaypointCE21)
  XwaypointCE21.setParent(_scene)
  const xTransform75 = new Transform({
    position: new Vector3(19.346830368041992, 0.31330442428588867, 61.9229621887207),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1)
  })
  XwaypointCE21.addComponentOrReplace(xTransform75)

  const XwaypointCE22 = new Entity('XwaypointCE22')
  engine.addEntity(XwaypointCE22)
  XwaypointCE22.setParent(_scene)
  const xTransform76 = new Transform({
    position: new Vector3(44.846832275390625, 0.31330442428588867, 61.9229621887207),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1)
  })
  XwaypointCE22.addComponentOrReplace(xTransform76)

  const XwaypointCE23 = new Entity('XwaypointCE23')
  engine.addEntity(XwaypointCE23)
  XwaypointCE23.setParent(_scene)
  const xTransform77 = new Transform({
    position: new Vector3(60.346832275390625, 0.31330442428588867, 43.4229621887207),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1)
  })
  XwaypointCE23.addComponentOrReplace(xTransform77)

  const XwaypointCE24 = new Entity('XwaypointCE24')
  engine.addEntity(XwaypointCE24)
  XwaypointCE24.setParent(_scene)
  const xxTransform78 = new Transform({
    position: new Vector3(60.346832275390625, 0.31330442428588867, 31.922962188720703),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1)
  })
  XwaypointCE24.addComponentOrReplace(xxTransform78)
    
  const XwaypointCE25 = new Entity('XwaypointCE25')
  engine.addEntity(XwaypointCE25)
  XwaypointCE25.setParent(_scene)
  const xTransform79 = new Transform({
    position: new Vector3(48.846832275390625, 0.31330442428588867, 39.9229621887207),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1)
  })
  XwaypointCE25.addComponentOrReplace(xTransform79)
  */
  //END MANUAL MUSCLE PATH//END MANUAL MUSCLE PATH//END MANUAL MUSCLE PATH
  //END MANUAL MUSCLE PATH//END MANUAL MUSCLE PATH//END MANUAL MUSCLE PATH
  //END MANUAL MUSCLE PATH//END MANUAL MUSCLE PATH//END MANUAL MUSCLE PATH

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
    position: new Vector3(56.5, 30.32171058654785, 14),
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
    position: new Vector3(12, 0.5, 33),
    rotation: Quaternion.Euler(0, 180, 0),
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

  const platformColors2 = new Entity("platformColors2");
  engine.addEntity(platformColors2);
  platformColors2.setParent(_scene);
  const transform118 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  platformColors2.addComponentOrReplace(transform118);
  const gltfShape5 = new GLTFShape(
    "403b600b-1676-4248-bd72-3c9756b8f6ad/platform_colors.gltf"
  );
  gltfShape5.withCollisions = true;
  gltfShape5.isPointerBlocker = true;
  gltfShape5.visible = true;
  platformColors2.addComponentOrReplace(gltfShape5);

  /*
  const exhbitionPad = new Entity('exhbitionPad')
  engine.addEntity(exhbitionPad)
  exhbitionPad.setParent(_scene)
  const transform119 = new Transform({
    position: new Vector3(11, 0.5353442430496216, 59),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(3, 1.985161542892456, 3)
  })
  exhbitionPad.addComponentOrReplace(transform119)

  const gltfShape6 = new GLTFShape("33724bb2-5b8f-4663-9e3b-7548168e846d/Exhbition pad.glb")
  gltfShape6.withCollisions = true
  gltfShape6.isPointerBlocker = true
  gltfShape6.visible = true
  exhbitionPad.addComponentOrReplace(gltfShape6)


  const exhbitionPad2 = new Entity('exhbitionPad2')
  engine.addEntity(exhbitionPad2)
  exhbitionPad2.setParent(_scene)
  exhbitionPad2.addComponentOrReplace(gltfShape6)
  const transform120 = new Transform({
    position: new Vector3(14, 1.7964297533035278, 60.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1.930877923965454, 2.1722376346588135, 1.930877923965454)
  })
  exhbitionPad2.addComponentOrReplace(transform120)

  const exhbitionPad3 = new Entity('exhbitionPad3')
  engine.addEntity(exhbitionPad3)
  exhbitionPad3.setParent(_scene)
  exhbitionPad3.addComponentOrReplace(gltfShape6)
  const transform121 = new Transform({
    position: new Vector3(14.5, 1.23859441280365, 55),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(0.48656341433525085, 1.0947678089141846, 0.48656347393989563)
  })
  exhbitionPad3.addComponentOrReplace(transform121)

  const exhbitionPad4 = new Entity('exhbitionPad4')
  engine.addEntity(exhbitionPad4)
  exhbitionPad4.setParent(_scene)
  exhbitionPad4.addComponentOrReplace(gltfShape6)
  const transform122 = new Transform({
    position: new Vector3(12.5, 0.7552226781845093, 53.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(0.8134764432907104, 1.830322265625, 0.8134765625)
  })
  exhbitionPad4.addComponentOrReplace(transform122)

  const exhbitionPad5 = new Entity('exhbitionPad5')
  engine.addEntity(exhbitionPad5)
  exhbitionPad5.setParent(_scene)
  exhbitionPad5.addComponentOrReplace(gltfShape6)
  const transform123 = new Transform({
    position: new Vector3(10.402129173278809, 1.2560789585113525, 62.42244338989258),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1.2328954935073853, 1.3870073556900024, 1.2328954935073853)
  })
  exhbitionPad5.addComponentOrReplace(transform123)

  const exhbitionPad6 = new Entity('exhbitionPad6')
  engine.addEntity(exhbitionPad6)
  exhbitionPad6.setParent(_scene)
  exhbitionPad6.addComponentOrReplace(gltfShape6)
  const transform124 = new Transform({
    position: new Vector3(7.5, 1.1968728303909302, 61.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(0.8128074407577515, 1.8288168907165527, 0.8128076195716858)
  })
  exhbitionPad6.addComponentOrReplace(transform124)

  const exhbitionPad7 = new Entity('exhbitionPad7')
  engine.addEntity(exhbitionPad7)
  exhbitionPad7.setParent(_scene)
  exhbitionPad7.addComponentOrReplace(gltfShape6)
  const transform125 = new Transform({
    position: new Vector3(12.5, 1.0971850156784058, 55.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(0.48656341433525085, 1.0947678089141846, 0.48656347393989563)
  })
  exhbitionPad7.addComponentOrReplace(transform125)

  */

  /*
  const externalLink = new Entity('externalLink')
  engine.addEntity(externalLink)
  externalLink.setParent(_scene)
  const transform126 = new Transform({
    position: new Vector3(14.5, 1.5070481300354004, 55),
    rotation: new Quaternion(-1.0962155348972938e-15, 0.6343932747840881, -7.562556447737734e-8, 0.7730104327201843),
    scale: new Vector3(1.000002384185791, 1, 1.000002384185791)
  })
  externalLink.addComponentOrReplace(transform126)
  */

  /*
  const exhbitionPad8 = new Entity('exhbitionPad8')
  engine.addEntity(exhbitionPad8)
  exhbitionPad8.setParent(_scene)
  exhbitionPad8.addComponentOrReplace(gltfShape6)
  const transform127 = new Transform({
    position: new Vector3(11, 10.246978759765625, 59),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(3, -2.9777421951293945, 3)
  })
  exhbitionPad8.addComponentOrReplace(transform127)


  const exhbitionPad9 = new Entity('exhbitionPad9')
  engine.addEntity(exhbitionPad9)
  exhbitionPad9.setParent(_scene)
  const XtransformX159 = new Transform({
    position: new Vector3(16, 23, 12),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(7, 7, 7) 
  })
  exhbitionPad9.addComponentOrReplace(XtransformX159)
  const gltfShape6 = new GLTFShape("33724bb2-5b8f-4663-9e3b-7548168e846d/Exhbition pad.glb")
  gltfShape6.withCollisions = true
  gltfShape6.isPointerBlocker = true
  gltfShape6.visible = true
  exhbitionPad9.addComponentOrReplace(gltfShape6)
  */
  /*
  const mmm = new Entity("mmm");
  engine.addEntity(mmm);
  mmm.setParent(_scene);
  const transform128 = new Transform({
    position: new Vector3(52, 1.3, 34),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(
      1.0547715425491333,
      0.7461051940917969,
      0.7461051940917969
    ),
  });
  mmm.addComponentOrReplace(transform128);
  const gltfShape7 = new GLTFShape("3c96156d-c2f6-41a7-bf52-0cb2ba7bced9/M.gltf");
  gltfShape7.withCollisions = true;
  gltfShape7.isPointerBlocker = true;
  gltfShape7.visible = true;
  mmm.addComponentOrReplace(gltfShape7);
  */
  //Mvfw singpostTree start
  /*
  >>>>>>> master
  const signpostTree = new Entity('signpostTree')
  engine.addEntity(signpostTree)
  signpostTree.setParent(_scene)
  const transform130 = new Transform({
    position: new Vector3(15.491682052612305, 0.8693578243255615, 54.87421798706055),
    rotation: new Quaternion(-1.0371813407043448e-14, 0.5609248280525208, -6.686744313810777e-8, -0.827866792678833),
    scale: new Vector3(5.8107452392578125, 4.640761852264404, 2.066225528717041)
  })
  signpostTree.addComponentOrReplace(transform130) 
  */
  //Mvfw singpostTree end

  /*
  const signpostTree2 = new Entity('signpostTree2')
  engine.addEntity(signpostTree2)
  signpostTree2.setParent(_scene)
  const transform131 = new Transform({
    position: new Vector3(32, 3, 2),
    rotation: new Quaternion(-7.251937799454631e-15, -1, 1.1920927533992653e-7, -8.940696716308594e-8),
    scale: new Vector3(3, 3, 3)
  })
  signpostTree2.addComponentOrReplace(transform131)

  const signpostTree3 = new Entity('signpostTree3')
  engine.addEntity(signpostTree3)
  signpostTree3.setParent(_scene)
  const transform132 = new Transform({
    position: new Vector3(79.5, 3, 1.9999946355819702),
    rotation: new Quaternion(-7.251937799454631e-15, -1, 1.1920927533992653e-7, -8.940696716308594e-8),
    scale: new Vector3(3, 3, 3)
  })
  signpostTree3.addComponentOrReplace(transform132)

  const signpostTree4 = new Entity('signpostTree4')
  engine.addEntity(signpostTree4)
  signpostTree4.setParent(_scene)
  const transform133 = new Transform({
    position: new Vector3(81, 3, 13.999996185302734),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(3, 3, 3)
  })
  signpostTree4.addComponentOrReplace(transform133)

  const signpostTree5 = new Entity('signpostTree5')
  engine.addEntity(signpostTree5)
  signpostTree5.setParent(_scene)
  const transform134 = new Transform({
    position: new Vector3(79.5, 20, 32.99999237060547),
    rotation: new Quaternion(-7.251937799454631e-15, -1, 1.1920927533992653e-7, -8.940696716308594e-8),
    scale: new Vector3(7, 7, 7)
  })
  signpostTree5.addComponentOrReplace(transform134)

  const signpostTree6 = new Entity('signpostTree6')
  engine.addEntity(signpostTree6)
  signpostTree6.setParent(_scene)
  const transform135 = new Transform({
    position: new Vector3(80.5, 20, 47),
    rotation: new Quaternion(7.105426934084528e-15, 1.1175870895385742e-7, -2.7037535621846076e-14, -1),
    scale: new Vector3(7, 7, 7)
  })
  signpostTree6.addComponentOrReplace(transform135)

  const signpostTree7 = new Entity('signpostTree7')
  engine.addEntity(signpostTree7)
  signpostTree7.setParent(_scene)
  const transform136 = new Transform({
    position: new Vector3(81.75, 7, 61),
    rotation: new Quaternion(-1.5394153601527394e-15, -0.7071068286895752, 8.429369557916289e-8, 0.7071068286895752),
    scale: new Vector3(3.000004291534424, 3, 3.000004291534424)
  })
  signpostTree7.addComponentOrReplace(transform136)

  const signpostTree8 = new Entity('signpostTree8')
  engine.addEntity(signpostTree8)
  signpostTree8.setParent(_scene)
  const transform137 = new Transform({
    position: new Vector3(94.25, 7, 61),
    rotation: new Quaternion(3.615880737325517e-15, -0.7071068286895752, 8.429368847373553e-8, -0.7071068286895752),
    scale: new Vector3(3.0000104904174805, 3, 3.0000104904174805)
  })
  signpostTree8.addComponentOrReplace(transform137)

  const signpostTree9 = new Entity('signpostTree9')
  engine.addEntity(signpostTree9)
  signpostTree9.setParent(_scene)
  const transform138 = new Transform({
    position: new Vector3(45, 4.5, 71.5),
    rotation: new Quaternion(3.615880737325517e-15, -0.7071068286895752, 8.429368847373553e-8, -0.7071068286895752),
    scale: new Vector3(3.000016212463379, 3, 3.000016212463379)
  })
  signpostTree9.addComponentOrReplace(transform138) 

  const signpostTree10 = new Entity('signpostTree10')
  engine.addEntity(signpostTree10)
  signpostTree10.setParent(_scene)
  const transform139 = new Transform({
    position: new Vector3(35, 4.5, 71.5),
    rotation: new Quaternion(2.006024317334097e-15, 0.7071068286895752, -8.429368136830817e-8, -0.7071068286895752),
    scale: new Vector3(3.00002121925354, 3, 3.00002121925354)
  })
  signpostTree10.addComponentOrReplace(transform139)

  const signpostTree11 = new Entity('signpostTree11')
  engine.addEntity(signpostTree11)
  signpostTree11.setParent(_scene)
  const transform140 = new Transform({
    position: new Vector3(2, 1, 16.5),
    rotation: new Quaternion(2.006024317334097e-15, 0.7071068286895752, -8.429368136830817e-8, -0.7071068286895752),
    scale: new Vector3(3.0000343322753906, 3, 3.0000343322753906)
  })
  signpostTree11.addComponentOrReplace(transform140)

  const signpostTree12 = new Entity('signpostTree12')
  engine.addEntity(signpostTree12)
  signpostTree12.setParent(_scene)
  const transform141 = new Transform({
    position: new Vector3(14, 1, 16.5),
    rotation: new Quaternion(-1.759325886742987e-14, 0.7071068286895752, -8.429369557916289e-8, 0.7071068286895752),
    scale: new Vector3(3.000035524368286, 3, 3.000035524368286)
  })
  signpostTree12.addComponentOrReplace(transform141)

  const signpostTree13 = new Entity('signpostTree13')
  engine.addEntity(signpostTree13)
  signpostTree13.setParent(_scene)
  const transform142 = new Transform({
    position: new Vector3(30, 11.5, 40),
    rotation: new Quaternion(2.006024317334097e-15, 0.7071068286895752, -8.429368136830817e-8, -0.7071068286895752),
    scale: new Vector3(3.4754159450531006, 3.475374698638916, 3.321444272994995)
  })
  signpostTree13.addComponentOrReplace(transform142)

  const signpostTree14 = new Entity('signpostTree14')
  engine.addEntity(signpostTree14)
  signpostTree14.setParent(_scene)
  const transform143 = new Transform({
    position: new Vector3(22.5, 21, 39.5),
    rotation: new Quaternion(-9.14742304662262e-15, 0, -6.481903958754009e-15, 1),
    scale: new Vector3(3.830857515335083, 3.8308181762695312, 3.830857515335083)
  })
  signpostTree14.addComponentOrReplace(transform143)
  

  const xsignpostTree100 = new Entity("signpostTree100");
  engine.addEntity(xsignpostTree100);
  xsignpostTree100.setParent(_scene);
  const xtransform200 = new Transform({
    position: new Vector3(8, 1, 30.5),
    rotation: new Quaternion(
      -9.14742304662262e-15,
      0,
      -6.481903958754009e-15,
      1
    ),
    scale: new Vector3(1.8, 2.5, 3.830857515335083),
  });
  xsignpostTree100.addComponentOrReplace(xtransform200);*/
  /*
  const imageFromURL = new Entity('imageFromURL')
  engine.addEntity(imageFromURL)
  imageFromURL.setParent(_scene)
  const transform144 = new Transform({
    position: new Vector3(34.5, 1.4011707305908203, 54.15150451660156),
    rotation: new Quaternion(6.969842370217532e-15, -1, 1.1920928244535389e-7, -7.450580596923828e-9),
    scale: new Vector3(8.67827033996582, 7.934318542480469, 8.751551628112793)
  })
  imageFromURL.addComponentOrReplace(transform144)

  const imageFromURL2 = new Entity('imageFromURL2')
  engine.addEntity(imageFromURL2)
  imageFromURL2.setParent(_scene)
  const transform145 = new Transform({
    position: new Vector3(48, 25, 56.5),
    rotation: new Quaternion(-7.105429898699844e-15, 3.5762786865234375e-7, -3.529153287966033e-14, -1),
    scale: new Vector3(5.045204162597656, 4.61269998550415, 3.7467544078826904)
  })
  imageFromURL2.addComponentOrReplace(transform145)

  const imageFromURL3 = new Entity('imageFromURL3')
  engine.addEntity(imageFromURL3)
  imageFromURL3.setParent(_scene)
  const transform146 = new Transform({
    position: new Vector3(47.5, 52, 56.5),
    rotation: new Quaternion(-7.105429898699844e-15, 3.5762786865234375e-7, -3.529153287966033e-14, -1),
    scale: new Vector3(5.352777004241943, 4.8939056396484375, 3.9751691818237305)
  })
  imageFromURL3.addComponentOrReplace(transform146)

  const imageFromURL4 = new Entity('imageFromURL4')
  engine.addEntity(imageFromURL4)
  imageFromURL4.setParent(_scene)
  const transform147 = new Transform({
    position: new Vector3(56, 33, 34.5),
    rotation: new Quaternion(-8.675773078734798e-15, 0.7071070671081543, -8.429372400087232e-8, -0.7071065902709961),
    scale: new Vector3(4.804521560668945, 4.392637729644775, 8.597676277160645)
  })
  imageFromURL4.addComponentOrReplace(transform147)

  const imageFromURL5 = new Entity('imageFromURL5')
  engine.addEntity(imageFromURL5)
  imageFromURL5.setParent(_scene)
  const transform148 = new Transform({
    position: new Vector3(47, 6.5, 23.5),
    rotation: new Quaternion(-7.105429898699844e-15, 3.5762786865234375e-7, -3.529153287966033e-14, -1),
    scale: new Vector3(4.994663238525391, 4.566491603851318, 3.7092204093933105)
  })
  imageFromURL5.addComponentOrReplace(transform148) 

  const imageFromURL6 = new Entity('imageFromURL6')
  engine.addEntity(imageFromURL6)
  imageFromURL6.setParent(_scene)
  const transform203 = new Transform({
    position: new Vector3(1.16, 1.2, 24.15),
    rotation: Quaternion.Euler(0,90,0),
    scale: new Vector3(5.8, 5.91708965301514, 2.8)
  })
  imageFromURL6.addComponentOrReplace(transform203)

  const imageFromURL7 = new Entity('imageFromURL7')
  engine.addEntity(imageFromURL7)
  imageFromURL7.setParent(_scene)
  const transform204 = new Transform({
    position: new Vector3(1.16, 1.2, 16.1),
    rotation: Quaternion.Euler(0,90,0),
    scale: new Vector3(5.8, 5.91708965301514, 2.8)
  })
  imageFromURL7.addComponentOrReplace(transform204)

  const imageFromURL8 = new Entity('imageFromURL8')
  engine.addEntity(imageFromURL8)
  imageFromURL8.setParent(_scene)
  const transform205 = new Transform({
    position: new Vector3(1.16, 1.2, 8.1),
    rotation: Quaternion.Euler(0,90,0),
    scale: new Vector3(5.8, 5.91708965301514, 2.8)
  })
  imageFromURL8.addComponentOrReplace(transform205)

  //up-outter large poster
  const imageFromURL9 = new Entity('imageFromURL9')
  engine.addEntity(imageFromURL9)
  imageFromURL9.setParent(_scene)
  const transform206 = new Transform({
    position: new Vector3(46.16, 9.2, 8.1),
    rotation: Quaternion.Euler(0, 90, 0),
    scale: new Vector3(10, 6, 1.9347463846206665)
  })
  imageFromURL9.addComponentOrReplace(transform206)

  //up-inner large poster
  const imageFromURL10 = new Entity('imageFromURL10')
  engine.addEntity(imageFromURL10)
  imageFromURL10.setParent(_scene)
  const transform207 = new Transform({
    position: new Vector3(45.84, 9.2, 8.1),
    rotation: Quaternion.Euler(0, -90, 0),
    scale: new Vector3(10, 6, 1.9347463846206665)
  })
  imageFromURL10.addComponentOrReplace(transform207)

  const imageFromURL11 = new Entity('imageFromURL11')
  engine.addEntity(imageFromURL11)
  imageFromURL11.setParent(_scene)
  const transform208 = new Transform({
    position: new Vector3(14.8, 1.2, 24.1),
    rotation: Quaternion.Euler(0,-90,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })
  imageFromURL11.addComponentOrReplace(transform208)

  const imageFromURL12 = new Entity('imageFromURL12')
  engine.addEntity(imageFromURL12)
  imageFromURL12.setParent(_scene)
  const transform209 = new Transform({
    position: new Vector3(15.2, 1.2, 24.1),
    rotation: Quaternion.Euler(0,90,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })
  imageFromURL12.addComponentOrReplace(transform209)

  const imageFromURL13 = new Entity('imageFromURL13')
  engine.addEntity(imageFromURL13)
  imageFromURL13.setParent(_scene)
  const transform210 = new Transform({
    position: new Vector3(46.16, 1.2, 8.1),
    rotation: Quaternion.Euler(0, 90, 0),
    scale: new Vector3(10, 6, 1.9347463846206665)
  })
  imageFromURL13.addComponentOrReplace(transform210)

  const imageFromURL14 = new Entity('imageFromURL14')
  engine.addEntity(imageFromURL14)
  imageFromURL14.setParent(_scene)
  const transform211 = new Transform({
    position: new Vector3(15.2, 1.2, 8.1),
    rotation: Quaternion.Euler(0,90,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })
  imageFromURL14.addComponentOrReplace(transform211)

  const imageFromURL15 = new Entity('imageFromURL15')
  engine.addEntity(imageFromURL15)
  imageFromURL15.setParent(_scene)
  const transform212 = new Transform({
    position: new Vector3(0.8, 1.2, 24.1),
    rotation: Quaternion.Euler(0,-90,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })
  imageFromURL15.addComponentOrReplace(transform212)

  const imageFromURL16 = new Entity('imageFromURL16')
  engine.addEntity(imageFromURL16)
  imageFromURL16.setParent(_scene)
  const transform213 = new Transform({
    position: new Vector3(0.8, 1.2, 16.1),
    rotation: Quaternion.Euler(0,-90,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })
  imageFromURL16.addComponentOrReplace(transform213)

  const imageFromURL17 = new Entity('imageFromURL17')
  engine.addEntity(imageFromURL17)
  imageFromURL17.setParent(_scene)
  const transform214 = new Transform({
    position: new Vector3(0.8, 1.2, 8.1),
    rotation: Quaternion.Euler(0,-90,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })
  imageFromURL17.addComponentOrReplace(transform214)

  const imageFromURL18 = new Entity('imageFromURL18')
  engine.addEntity(imageFromURL18)
  imageFromURL18.setParent(_scene)
  const transform215 = new Transform({
    position: new Vector3(8, 1.2, 0.84),
    rotation: Quaternion.Euler(0,180,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })
  imageFromURL18.addComponentOrReplace(transform215)

  const imageFromURL19 = new Entity('imageFromURL19')
  engine.addEntity(imageFromURL19)
  imageFromURL19.setParent(_scene)
  const transform216 = new Transform({
    position: new Vector3(11, 8.61, 8),
    rotation: Quaternion.Euler(-90,90,0),
    scale: new Vector3(5.8, 5.91708965301514, 2.8)
  })
  imageFromURL19.addComponentOrReplace(transform216)

  const imageFromURL20 = new Entity('imageFromURL20')
  engine.addEntity(imageFromURL20)
  imageFromURL20.setParent(_scene)
  const transform217 = new Transform({
    position: new Vector3(11, 8.61, 16),
    rotation: Quaternion.Euler(-90,90,0),
    scale: new Vector3(5.8, 5.91708965301514, 2.8)
  })
  imageFromURL20.addComponentOrReplace(transform217)

  const imageFromURL21 = new Entity('imageFromURL21')
  engine.addEntity(imageFromURL21)
  imageFromURL21.setParent(_scene)
  const transform218 = new Transform({
    position: new Vector3(11, 8.61, 24),
    rotation: Quaternion.Euler(-90,90,0),
    scale: new Vector3(5.8, 5.91708965301514, 2.8)
  })
  imageFromURL21.addComponentOrReplace(transform218)

  const imageFromURL22 = new Entity('imageFromURL22')
  engine.addEntity(imageFromURL22)
  imageFromURL22.setParent(_scene)
  const transform219 = new Transform({
    position: new Vector3(16, 1.2, 0.84),
    rotation: Quaternion.Euler(0,180,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })

  imageFromURL22.addComponentOrReplace(transform219)

  const imageFromURL23 = new Entity('imageFromURL23')
  engine.addEntity(imageFromURL23)
  imageFromURL23.setParent(_scene)
  const transform220 = new Transform({
    position: new Vector3(24, 1.2, 0.84),
    rotation: Quaternion.Euler(0,180,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })

  imageFromURL23.addComponentOrReplace(transform220)

  const imageFromURL24 = new Entity('imageFromURL24')
  engine.addEntity(imageFromURL24)
  imageFromURL24.setParent(_scene)
  const transform221 = new Transform({
    position: new Vector3(32, 1.2, 0.84),
    rotation: Quaternion.Euler(0,180,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })

  imageFromURL24.addComponentOrReplace(transform221)

  const imageFromURL25 = new Entity('imageFromURL25')
  engine.addEntity(imageFromURL25)
  imageFromURL25.setParent(_scene)
  const transform222 = new Transform({
    position: new Vector3(40, 1.2, 0.84),
    rotation: Quaternion.Euler(0,180,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })
  imageFromURL25.addComponentOrReplace(transform222)

  const imageFromURL26 = new Entity('imageFromURL26')
  engine.addEntity(imageFromURL26)
  imageFromURL26.setParent(_scene)
  const transform223 = new Transform({
    position: new Vector3(40, 1.2, 15.3),
    rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })

  imageFromURL26.addComponentOrReplace(transform223)

  const imageFromURL27 = new Entity('imageFromURL27')
  engine.addEntity(imageFromURL27)
  imageFromURL27.setParent(_scene)
  const transform224 = new Transform({
    position: new Vector3(32, 1.2, 15.3),
    rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })

  imageFromURL27.addComponentOrReplace(transform224)

  const imageFromURL28 = new Entity('imageFromURL28')
  engine.addEntity(imageFromURL28)
  imageFromURL28.setParent(_scene)
  const transform225 = new Transform({
    position: new Vector3(24, 1.2, 15.3),
    rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })

  imageFromURL28.addComponentOrReplace(transform225)

  const imageFromURL29 = new Entity('imageFromURL29')
  engine.addEntity(imageFromURL29)
  imageFromURL29.setParent(_scene)
  const transform226 = new Transform({
    position: new Vector3(24, 1.2, 14.95),
    rotation: Quaternion.Euler(0,180,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })
  imageFromURL29.addComponentOrReplace(transform226)

  const imageFromURL30 = new Entity('imageFromURL30')
  engine.addEntity(imageFromURL30)
  imageFromURL30.setParent(_scene)
  const transform227 = new Transform({
    position: new Vector3(32, 1.2, 14.95),
    rotation: Quaternion.Euler(0,180,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })
  imageFromURL30.addComponentOrReplace(transform227)

  const imageFromURL31 = new Entity('imageFromURL31')
  engine.addEntity(imageFromURL31)
  imageFromURL31.setParent(_scene)
  const transform228 = new Transform({
    position: new Vector3(40, 1.2, 14.95),
    rotation: Quaternion.Euler(0,180,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })
  imageFromURL31.addComponentOrReplace(transform228)

  const imageFromURL32 = new Entity('imageFromURL32')
  engine.addEntity(imageFromURL29)
  imageFromURL32.setParent(_scene)
  const transform229 = new Transform({
    position: new Vector3(24, 1.2, 1.19),
    rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })

  imageFromURL32.addComponentOrReplace(transform229)

  const imageFromURL33 = new Entity('imageFromURL33')
  engine.addEntity(imageFromURL33)
  imageFromURL33.setParent(_scene)
  const transform230 = new Transform({
    position: new Vector3(32, 1.2, 1.19),
    rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })

  imageFromURL33.addComponentOrReplace(transform230)

  const imageFromURL34 = new Entity('imageFromURL34')
  engine.addEntity(imageFromURL34)
  imageFromURL34.setParent(_scene)
  const transform231 = new Transform({
    position: new Vector3(40, 1.2, 1.19),
    rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })
  imageFromURL34.addComponentOrReplace(transform231)

  const imageFromURL35 = new Entity('imageFromURL35')
  engine.addEntity(imageFromURL35)
  imageFromURL35.setParent(_scene)
  const transform232 = new Transform({
    position: new Vector3(16, 1.2, 1.19),
    rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })

  imageFromURL35.addComponentOrReplace(transform232)

  const imageFromURL36 = new Entity('imageFromURL36')
  engine.addEntity(imageFromURL36)
  imageFromURL36.setParent(_scene)
  const transform233 = new Transform({
    position: new Vector3(8, 1.2, 1.19),
    rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })

  imageFromURL36.addComponentOrReplace(transform233)

  const imageFromURL37 = new Entity('imageFromURL37')
  engine.addEntity(imageFromURL37)
  imageFromURL37.setParent(_scene)
  const transform234 = new Transform({
    position: new Vector3(32, 9.2, 0.84),
    rotation: Quaternion.Euler(0,180,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })

  imageFromURL37.addComponentOrReplace(transform234)

  const imageFromURL38 = new Entity('imageFromURL38')
  engine.addEntity(imageFromURL38)
  imageFromURL38.setParent(_scene)
  const transform235 = new Transform({
    position: new Vector3(40, 9.2, 0.84),
    rotation: Quaternion.Euler(0,180,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })
  imageFromURL38.addComponentOrReplace(transform235)

  const imageFromURL39 = new Entity('imageFromURL39')
  engine.addEntity(imageFromURL39)
  imageFromURL39.setParent(_scene)
  const transform236 = new Transform({
    position: new Vector3(40, 9.2, 15.3),
    rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })

  imageFromURL39.addComponentOrReplace(transform236)

  const imageFromURL40 = new Entity('imageFromURL40')
  engine.addEntity(imageFromURL40)
  imageFromURL40.setParent(_scene)
  const transform237 = new Transform({
    position: new Vector3(32, 9.2, 15.3),
    rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })
  imageFromURL40.addComponentOrReplace(transform237)

  const imageFromURL41 = new Entity('imageFromURL41')
  engine.addEntity(imageFromURL41)
  imageFromURL41.setParent(_scene)
  const transform238 = new Transform({
    position: new Vector3(32, 9.2, 14.95),
    rotation: Quaternion.Euler(0,180,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })
  imageFromURL41.addComponentOrReplace(transform238)

  const imageFromURL42 = new Entity('imageFromURL42')
  engine.addEntity(imageFromURL42)
  imageFromURL42.setParent(_scene)
  const transform239 = new Transform({
    position: new Vector3(40, 9.2, 14.95),
    rotation: Quaternion.Euler(0,180,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })
  imageFromURL42.addComponentOrReplace(transform239)

  const imageFromURL43 = new Entity('imageFromURL43')
  engine.addEntity(imageFromURL43)
  imageFromURL43.setParent(_scene)
  const transform240 = new Transform({
    position: new Vector3(32, 9.2, 1.19),
    rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })

  imageFromURL43.addComponentOrReplace(transform240)

  const imageFromURL44 = new Entity('imageFromURL44')
  engine.addEntity(imageFromURL44)
  imageFromURL44.setParent(_scene)
  const transform241 = new Transform({
    position: new Vector3(40, 9.2, 1.19),
    rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(5.8, 5.85, 2.8)
  })
  imageFromURL44.addComponentOrReplace(transform241)
  */
  // effects images start
  /*
  const imageFromURL45 = new Entity('imageFromURL45')
  engine.addEntity(imageFromURL45)
  imageFromURL45.setParent(_scene)
  const transform242 = new Transform({
    position: new Vector3(27.142301559448242, 1.8759946823120117, 45.5),
    rotation: new Quaternion(6.969842370217532e-15, -1, 1.1920928244535389e-7, -7.450580596923828e-9),
    scale: new Vector3(5.021775245666504, 4.59127950668335, 5.064180374145508)
  })
  imageFromURL45.addComponentOrReplace(transform242)

  const imageFromURL46 = new Entity('imageFromURL46')
  engine.addEntity(imageFromURL46)
  imageFromURL46.setParent(_scene)
  const transform243 = new Transform({
    position: new Vector3(20.951889038085938, 1.8759946823120117, 45.5),
    rotation: new Quaternion(6.969842370217532e-15, -1, 1.1920928244535389e-7, -7.450580596923828e-9),
    scale: new Vector3(5.021775245666504, 4.59127950668335, 5.064180374145508)
  })
  imageFromURL46.addComponentOrReplace(transform243)

  const imageFromURL47 = new Entity('imageFromURL47')
  engine.addEntity(imageFromURL47)
  imageFromURL47.setParent(_scene)
  const transform244 = new Transform({
    position: new Vector3(33.33525085449219, 1.8759946823120117, 45.5),
    rotation: new Quaternion(6.969842370217532e-15, -1, 1.1920928244535389e-7, -7.450580596923828e-9),
    scale: new Vector3(5.021775245666504, 4.59127950668335, 5.064180374145508)
  })
  imageFromURL47.addComponentOrReplace(transform244)

  const imageFromURL48 = new Entity('imageFromURL48')
  engine.addEntity(imageFromURL48)
  imageFromURL48.setParent(_scene)
  const transform245 = new Transform({
    position: new Vector3(33.33525085449219, 1.8759946823120117, 34),
    rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(5.021775245666504, 4.59127950668335, 5.064180374145508)
  })
  imageFromURL48.addComponentOrReplace(transform245)

  const imageFromURL49 = new Entity('imageFromURL49')
  engine.addEntity(imageFromURL49)
  imageFromURL49.setParent(_scene)
  const transform246 = new Transform({
    position: new Vector3(27.142301559448242, 1.8759946823120117, 34),
    rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(5.021775245666504, 4.59127950668335, 5.064180374145508)
  })
  imageFromURL49.addComponentOrReplace(transform246)

  const imageFromURL50 = new Entity('imageFromURL50')
  engine.addEntity(imageFromURL50)
  imageFromURL50.setParent(_scene)
  const transform247 = new Transform({
    position: new Vector3(20.951889038085938, 1.8759946823120117, 34),
    rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(5.021775245666504, 4.59127950668335, 5.064180374145508)
  })
  imageFromURL50.addComponentOrReplace(transform247)
  */
  // effects images end

  // Add NFTAsian Start

  const NFTAsian = new Entity("NFTAsian");
  engine.addEntity(NFTAsian);
  NFTAsian.setParent(_scene);
  const transformCS3 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  NFTAsian.addComponentOrReplace(transformCS3);
  const gltfShapeCS3 = new GLTFShape("models/NFTAsian.glb");
  gltfShapeCS3.withCollisions = true;
  gltfShapeCS3.isPointerBlocker = true;
  gltfShapeCS3.visible = true;
  NFTAsian.addComponentOrReplace(gltfShapeCS3);

  // Add NFTAsian End

  // Fashion week poster start
  /*
  const imageFromURL51 = new Entity('imageFromURL51')
  engine.addEntity(imageFromURL51)
  imageFromURL51.setParent(_scene)
  const transform248 = new Transform({
    position: new Vector3(15.454398155212402, 1.5491070747375488, 54.91776657104492),
    rotation: new Quaternion(-1.1111193972415884e-15, -0.5622609853744507, 6.702672550318312e-8, 0.8269599080085754),
    scale: new Vector3(5.782230854034424, 6.2326579093933105, 1.0462757349014282)
  })
  imageFromURL51.addComponentOrReplace(transform248)
  */
  // Fashion week poster end

  /*
  const npcPlaceHolder6 = new Entity('npcPlaceHolder6')
  engine.addEntity(npcPlaceHolder6)
  npcPlaceHolder6.setParent(_scene)
  const transform149 = new Transform({
    position: new Vector3(14, 3.1123294830322266, 60.5),
    rotation: new Quaternion(0, 0.2902846932411194, -3.4604628496026635e-8, 0.9569403529167175),
    scale: new Vector3(1, 1, 1)
  })
  npcPlaceHolder6.addComponentOrReplace(transform149) */

  /*
  const tubeContainer = new Entity('tubeContainer')
  engine.addEntity(tubeContainer)
  tubeContainer.setParent(_scene)
  const transform150 = new Transform({
    position: new Vector3(14.053997039794922, 2.092360258102417, 60.45151901245117),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(4.343614101409912, 3.6214797496795654, 4.343614101409912)
  })
  tubeContainer.addComponentOrReplace(transform150)
  const gltfShape9 = new GLTFShape("6ec993d8-32bc-46d4-9108-6bd385b739dd/ScienceContainer_01/ScienceContainer_01.glb")
  gltfShape9.withCollisions = true
  gltfShape9.isPointerBlocker = true
  gltfShape9.visible = true
  tubeContainer.addComponentOrReplace(gltfShape9)


  const twitterButtonLink2 = new Entity('twitterButtonLink2')
  engine.addEntity(twitterButtonLink2)
  twitterButtonLink2.setParent(_scene)
  const transform151 = new Transform({
    position: new Vector3(12, 1.2120286226272583, 53),
    rotation: new Quaternion(3.342651678403362e-16, 0.7145393490791321, -8.517972815980102e-8, 0.6995952725410461),
    scale: new Vector3(1.000005841255188, 1, 1.000005841255188)
  })
  twitterButtonLink2.addComponentOrReplace(transform151)
  */

  const videoStream1 = new Entity("videoStream1");
  engine.addEntity(videoStream1);
  videoStream1.setParent(_scene);
  const transformv1 = new Transform({
    position: new Vector3(11.8, 5.2, 40.25),
    rotation: Quaternion.Euler(38, -90, 0),
    scale: new Vector3(2.7, 3.4, 2.75),
  });
  videoStream1.addComponentOrReplace(transformv1);
  /*
  const helmetText = new Entity('helmetText')
  engine.addEntity(helmetText)
  helmetText.setParent(_scene)
  const transform153 = new Transform({
    position: new Vector3(12.840929985046387, 2.2085726261138916, 59.875648498535156),
    rotation: new Quaternion(-2.4085271740892887e-15, -0.8314696550369263, 9.911889975455779e-8, 0.5555702447891235),
    scale: new Vector3(0.3715662956237793, 0.37156471610069275, 0.3715662956237793)
  })
  helmetText.addComponentOrReplace(transform153)
  const gltfShape10 = new GLTFShape("55519131-cfef-4fca-a12e-f0d46302ebcd/Helmet Text.glb")
  gltfShape10.withCollisions = true
  gltfShape10.isPointerBlocker = true
  gltfShape10.visible = true
  helmetText.addComponentOrReplace(gltfShape10) 
  */
  /*
  const signpostTree15 = new Entity('signpostTree15')
  engine.addEntity(signpostTree15)
  signpostTree15.setParent(_scene)
  const transform154 = new Transform({
    position: new Vector3(13.5, 5.112631797790527, 60),
    rotation: new Quaternion(1.5888430942870372e-16, 0.8586313128471375, -1.0235680747427978e-7, -0.512593686580658),
    scale: new Vector3(1.6338529586791992, 3.1564252376556396, 2.845235586166382)
  })
  signpostTree15.addComponentOrReplace(transform154) 

  const signpostTree16 = new Entity("signpostTree16");
  engine.addEntity(signpostTree16);
  signpostTree16.setParent(_scene);
  const transform155 = new Transform({
    position: new Vector3(
      21.664270401000977,
      3.771190643310547,
      49.585968017578125
    ),
    rotation: new Quaternion(
      5.6204341819467065e-15,
      -0.9998165965080261,
      1.1918741904537455e-7,
      0.01915031298995018
    ),
    scale: new Vector3(
      2.6307506561279297,
      1.7661230564117432,
      0.9999999403953552
    ),
  });
  signpostTree16.addComponentOrReplace(transform155);

  const signpostTree17 = new Entity("signpostTree17");
  engine.addEntity(signpostTree17);
  signpostTree17.setParent(_scene);
  const transform156 = new Transform({
    position: new Vector3(
      45.239986419677734,
      1.0544816255569458,
      15.264182090759277
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(2.630751371383667, 1.8991022109985352, 1),
  });
  signpostTree17.addComponentOrReplace(transform156);

  const signpostTree18 = new Entity("signpostTree18");
  engine.addEntity(signpostTree18);
  signpostTree18.setParent(_scene);
  const transform157 = new Transform({
    position: new Vector3(
      4.531469345092773,
      13.003421783447266,
      71.6715316772461
    ),
    rotation: new Quaternion(
      3.83491541067248e-15,
      -0.6994662880897522,
      8.33828863733288e-8,
      -0.7146655917167664
    ),
    scale: new Vector3(
      2.6307482719421387,
      1.7661230564117432,
      0.9999999403953552
    ),
  });
  signpostTree18.addComponentOrReplace(transform157);*/

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
    "ead231c4-4d7d-474c-8df9-22c47615d1a2/main.glb"
  );
  gltfShape11.withCollisions = true;
  gltfShape11.isPointerBlocker = true;
  gltfShape11.visible = true;
  main.addComponentOrReplace(gltfShape11);

  const teleportermoon = new Entity("teleportermoon");
  engine.addEntity(teleportermoon);
  teleportermoon.setParent(_scene);
  const transformCS20 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  teleportermoon.addComponentOrReplace(transformCS20);
  const gltfShapeCS20 = new GLTFShape(
    "models/Teleporter/Moonsquare.glb"
  );
  gltfShapeCS20.withCollisions = true;
  gltfShapeCS20.isPointerBlocker = true;
  gltfShapeCS20.visible = true;
  teleportermoon.addComponentOrReplace(gltfShapeCS20);
  teleportermoon.addComponent(
    new OnPointerDown(
      (e) => {
        movePlayerTo({ x: 24, y: 26, z:48 }, { x: 8, y: 1, z: 8 })
      },
      { hoverText: "Go to Moon Square" }
    )
  )
  
  engine.addEntity(teleportermoon)


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

  // Add voxboard park end

  // Add entrance Start

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

  const rewardmd = new Entity("rewardmd");
  engine.addEntity(rewardmd);
  rewardmd.setParent(_scene);
  const transformCS17 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  rewardmd.addComponentOrReplace(transformCS17);
  const gltfShapeCS17 = new GLTFShape("models/Rewards/rewardmd.gltf");
  gltfShapeCS17.withCollisions = true;
  gltfShapeCS17.isPointerBlocker = true;
  gltfShapeCS17.visible = true;
  rewardmd.addComponentOrReplace(gltfShapeCS17);

  /*
  const dogehead = new Entity("dogehead");
  engine.addEntity(dogehead);
  dogehead.setParent(_scene);
  const transformCS18 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  dogehead.addComponentOrReplace(transformCS18);
  const gltfShapeCS18 = new GLTFShape("models/Rewards/dogehead.glb");
  gltfShapeCS18.withCollisions = true;
  gltfShapeCS18.isPointerBlocker = true;
  gltfShapeCS18.visible = true;
  dogehead.addComponentOrReplace(gltfShapeCS18);
*/
  /*
  const effects = new Entity('effects')
  engine.addEntity(effects)
  effects.setParent(_scene)
  const transformCS2 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1)
  })
  effects.addComponentOrReplace(transformCS2)
  const gltfShapeCS2 = new GLTFShape("models/effects.glb")
  gltfShapeCS2.withCollisions = true
  gltfShapeCS2.isPointerBlocker = true
  gltfShapeCS2.visible = true
  effects.addComponentOrReplace(gltfShapeCS2)

  */
  // Add entrance end

  // Add Metaparty Start

  const Metaparty = new Entity("Metaparty");
  engine.addEntity(Metaparty);
  Metaparty.setParent(_scene);
  const transformCS4 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  Metaparty.addComponentOrReplace(transformCS4);
  const gltfShapeCS4 = new GLTFShape("models/Metaparty.glb");
  gltfShapeCS4.withCollisions = true;
  gltfShapeCS4.isPointerBlocker = true;
  gltfShapeCS4.visible = true;
  Metaparty.addComponentOrReplace(gltfShapeCS4);

  // Add Metaparty end

  // Add entrancepad Start

  const entrancepad = new Entity("entrancepad");
  engine.addEntity(entrancepad);
  entrancepad.setParent(_scene);
  const transformCS5 = new Transform({
    position: new Vector3(48, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entrancepad.addComponentOrReplace(transformCS5);
  const gltfShapeCS5 = new GLTFShape("models/entrancepad.glb");
  gltfShapeCS5.withCollisions = true;
  gltfShapeCS5.isPointerBlocker = true;
  gltfShapeCS5.visible = true;
  entrancepad.addComponentOrReplace(gltfShapeCS5);

  // Add entrancepad end

  /*const signpostTree19 = new Entity("signpostTree19");
  engine.addEntity(signpostTree19);
  signpostTree19.setParent(_scene);
  const transform159 = new Transform({
    position: new Vector3(21, 23.39838218688965, 56),
    rotation: new Quaternion(
      3.83491541067248e-15,
      -0.6994662880897522,
      8.33828863733288e-8,
      -0.7146655917167664
    ),
    scale: new Vector3(
      2.6307482719421387,
      1.7661230564117432,
      0.9999999403953552
    ),
  });
  signpostTree19.addComponentOrReplace(transform159);

  const signpostTree20 = new Entity("signpostTree20");
  engine.addEntity(signpostTree20);
  signpostTree20.setParent(_scene);
  const transform160 = new Transform({
    position: new Vector3(
      36.866458892822266,
      50.80177307128906,
      55.98594284057617
    ),
    rotation: new Quaternion(
      3.83491541067248e-15,
      -0.6994662880897522,
      8.33828863733288e-8,
      -0.7146655917167664
    ),
    scale: new Vector3(
      2.6307482719421387,
      1.7661230564117432,
      0.9999999403953552
    ),
  });
  signpostTree20.addComponentOrReplace(transform160);

  const signpostTree21 = new Entity("signpostTree21");
  engine.addEntity(signpostTree21);
  signpostTree21.setParent(_scene);
  const transform161 = new Transform({
    position: new Vector3(
      55.78982925415039,
      34.70925521850586,
      5.042447566986084
    ),
    rotation: new Quaternion(
      -1.6697572347685284e-14,
      -0.022824525833129883,
      2.7209150488261002e-9,
      -0.9997395277023315
    ),
    scale: new Vector3(2.6307554244995117, 1.7661230564117432, 1),
  });
  signpostTree21.addComponentOrReplace(transform161);

  const signpostTree22 = new Entity("signpostTree22");
  engine.addEntity(signpostTree22);
  signpostTree22.setParent(_scene);
  const transform162 = new Transform({
    position: new Vector3(
      23.457746505737305,
      16.295560836791992,
      21.504819869995117
    ),
    rotation: new Quaternion(
      -1.6697572347685284e-14,
      -0.022824525833129883,
      2.7209150488261002e-9,
      -0.9997395277023315
    ),
    scale: new Vector3(2.630770683288574, 1.7661230564117432, 1),
  });
  signpostTree22.addComponentOrReplace(transform162);*/

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
    const ufo = new Entity("ufo");
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

    /*
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

  //START BELIEVER BRIDGE//START BELIEVER BRIDGE//START BELIEVER BRIDGE
  /*
  const xfloorPianoCC25 = new Entity('XfloorPianoCC25')
  engine.addEntity(xfloorPianoCC25)
  xfloorPianoCC25.setParent(_scene)
  xfloorPianoCC25.addComponent(new BoxShape())
  const Xtransform158 = new Transform({
    position: new Vector3(76, 48.44706726074219, 33.5),
    //position: new Vector3(4, 1, 50),
    rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(1.0000050067901611, 1, 1.0000050067901611)
  })
  xfloorPianoCC25.addComponentOrReplace(Xtransform158)*/

  //START BELIEVER BRIDGE//START BELIEVER BRIDGE//START BELIEVER BRIDGE
  /*
  const xfloorPianoCC26 = new Entity('XfloorPianoCC25')
  engine.addEntity(xfloorPianoCC26)
  xfloorPianoCC26.setParent(_scene)
  xfloorPianoCC26.addComponent(new BoxShape())
  const Xtransform1586 = new Transform({
    position: new Vector3(76, 48.44706726074219, 20),
    //position: new Vector3(4, 1, 50),
    rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(1.0000050067901611, 1, 1.0000050067901611)
  })
  xfloorPianoCC26.addComponentOrReplace(Xtransform1586)*/

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

  const ENABLE_CLICKABLE_PIANO_KEYS = CONFIG.ENABLE_CLICKABLE_PIANO_KEYS;
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
      script3.lightUpAllKeys(skyMazeDisappearCheatDelay, "thick");
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
  const boardPlacement = 33.6;
  const boardPlacementZ = 49.5;
  const boardPlacementY = 1.4; //.8
  const VoxboardPlacement = 48;
  const VoxBoardXSpacing = 2;
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
        boardPlacementZ - boardXSpacing * boardTypeWeekly,
        boardPlacementY,
        boardPlacement
      ),
      rotation: Quaternion.Euler(0, 180, 0),
      scale: new Vector3(2.5, 2.5, 1),
    })
  );

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
  );

  const leaderboardBigDaily = new Entity("XleaderboardBigDaily");
  engine.addEntity(leaderboardBigDaily);
  leaderboardBigDaily.setParent(_scene);
  //XsignpostTreeSkyMaze.setParent(_scene)
  leaderboardBigDaily.addComponentOrReplace(
    new Transform({
      position: new Vector3(
        boardPlacementZ - boardXSpacing * boardTypeDaily,
        boardPlacementY,
        boardPlacement
      ),
      rotation: Quaternion.Euler(0, 180, 0),
      scale: new Vector3(2.5, 2.5, 1),
    })
  );

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
  );

  const leaderboardBigHourly = new Entity("XleaderboardBigHourly");
  engine.addEntity(leaderboardBigHourly);
  leaderboardBigHourly.setParent(_scene);
  //XsignpostTreeSkyMaze.setParent(_scene)
  leaderboardBigHourly.addComponentOrReplace(
    new Transform({
      position: new Vector3(
        boardPlacementZ - boardXSpacing * boardTypeHourly,
        boardPlacementY,
        boardPlacement
      ),
      rotation: Quaternion.Euler(0, 180, 0),
      scale: new Vector3(2.5, 2.5, 1),
    })
  );

  const leaderboardVoxBigHourly = new Entity("XleaderboardVoxBigHourly");
  engine.addEntity(leaderboardVoxBigHourly);
  leaderboardVoxBigHourly.setParent(_scene);
  //XsignpostTreeSkyMaze.setParent(_scene)
  leaderboardVoxBigHourly.addComponentOrReplace(
    new Transform({
      position: new Vector3(
        VoxboardPlacement - VoxBoardXSpacing * boardTypeHourly,
        5,
        20
      ),
      rotation: Quaternion.Euler(0, 180, 0),
      scale: new Vector3(1.5, 1.5, 1),
    })
  );

  /*
  const XsignpostTreeSkyMaze = new Entity('XsignpostTreeSkyMaze')
  engine.addEntity(XsignpostTreeSkyMaze)
  XsignpostTreeSkyMaze.setParent(tubeContainer2)
  //XsignpostTreeSkyMaze.setParent(_scene)
  const transformXsignpostTreeSkyMaze131 = new Transform({
    position: new Vector3(-1, .4, .3),
    rotation: Quaternion.Euler(0,30,0),
    scale: new Vector3(.7, .7, .2)
  })
  XsignpostTreeSkyMaze.addComponentOrReplace(transformXsignpostTreeSkyMaze131)
  */
  /*
  XsignpostTreeSkyMaze.addComponent(new OnPointerDown(
    skyMazePeek,
      { 
        button: ActionButton.POINTER,
        hoverText: 'Take a Peek. Show Entire Maze' 
      }
    )
  )*/
  /*
  const xCheatBoxSkyMaze = new Entity('xCheatBoxSkyMaze')
  engine.addEntity(xCheatBoxSkyMaze)
  xCheatBoxSkyMaze.setParent(_scene)
  xCheatBoxSkyMaze.addComponent(new BoxShape())
  const xTransformxCheatBoxSkyMaze = new Transform({
    position: new Vector3(70, 48.44706726074219, 38),      
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1)
  })
  xCheatBoxSkyMaze.addComponentOrReplace(xTransformxCheatBoxSkyMaze)


  xCheatBoxSkyMaze.addComponent(new OnPointerDown(
      skyMazePeek,
      { 
        button: ActionButton.POINTER,
        hoverText: 'Take a Peek. Show Entire Maze' 
      }
    )
  )*/

  /*
  const hideAvatarSkyMaze = new Entity('hideAvatarSkyMaze')
  engine.addEntity(hideAvatarSkyMaze)
  hideAvatarSkyMaze.setParent(_scene)
  hideAvatarSkyMaze.addComponent(new BoxShape()) //preview where modifier is
  const xTransformxhideAvatarSkyMaze = new Transform({
    //position: new Vector3(16+10, 50, 21),    
    position: new Vector3(16+10, 50, 21),    
    rotation: new Quaternion(0, 0, 0, 1),
    //scale: new Vector3(30, 6, 40)
    scale: new Vector3(1, 1, 1) 
  })

  let avatarModifierAreaComp = new AvatarModifierArea({
    area: { box: new Vector3(30, 6, 40) },
    modifiers: [AvatarModifiers.HIDE_AVATARS]
  })

  hideAvatarSkyMaze.addComponent(avatarModifierAreaComp)

  hideAvatarSkyMaze.addComponentOrReplace(xTransformxhideAvatarSkyMaze)
  */

  //TODO NEED HELMET WEARABLE CONTRACT
  //let wearableNTF = "ethereum://0x495f947276749ce646f68ac8c248420045cb7b5e/2272273421035365284426525578186006263842671319911985459048501126891233607681"

  /*
  tubeContainerShape.addComponent(new OnPointerDown(
      visitMarketForHelmet,
      { 
        button: ActionButton.PRIMARY,
        hoverText: visitMarketHoverText
      }
    )
  )*/

  /*
  const poapBooth2 = new Entity('XpoapBooth2')
  engine.addEntity(poapBooth2)
  poapBooth2.setParent(_scene)
  const Xtransform160 = new Transform({
    position: new Vector3(78, 48.5, 15),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1)
  })
  poapBooth2.addComponentOrReplace(Xtransform160)*/

  const XfloorPianoCC25 = new Entity("XfloorPianoCC25");
  engine.addEntity(XfloorPianoCC25);
  XfloorPianoCC25.setParent(_scene);
  const XtransformX152 = new Transform({
    position: new Vector3(76, 48.44706726074219, 33.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1.0000050067901611, 1, 1.0000050067901611),
  });
  XfloorPianoCC25.addComponentOrReplace(XtransformX152);

  const invisibleWall = new Entity("invisibleWall");
  engine.addEntity(invisibleWall);
  invisibleWall.setParent(_scene);
  const XtransformX153 = new Transform({
    position: new Vector3(80.5, 49, 41.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(18.206729888916016, 0.5, 16.00000762939453),
  });
  invisibleWall.addComponentOrReplace(XtransformX153);

  /*
  const poapBooth2 = new Entity('poapBooth2')
  engine.addEntity(poapBooth2)
  poapBooth2.setParent(_scene)
  const XtransformX154 = new Transform({
    position: new Vector3(4.5, 48.5, 6.5),
    rotation: Quaternion.Euler(0,90,0),
    scale: new Vector3(1, 1, 1)
  })
  poapBooth2.addComponentOrReplace(XtransformX154)  */

  const XfloorPianoCC26 = new Entity("XfloorPianoCC26");
  engine.addEntity(XfloorPianoCC26);
  XfloorPianoCC26.setParent(_scene);
  const XtransformX155 = new Transform({
    position: new Vector3(67, 48.44706726074219, 40.5),
    rotation: new Quaternion(
      -2.743679053076502e-15,
      0.7071068286895752,
      -8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.0000057220458984, 1, 1.0000057220458984),
  });
  XfloorPianoCC26.addComponentOrReplace(XtransformX155);

  const XfloorPianoCC27 = new Entity("XfloorPianoCC27");
  engine.addEntity(XfloorPianoCC27);
  XfloorPianoCC27.setParent(_scene);
  const XtransformX156 = new Transform({
    position: new Vector3(60.5, 48.44706726074219, 4),
    rotation: new Quaternion(
      -2.743679053076502e-15,
      0.7071068286895752,
      -8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.0000057220458984, 1, 1.0000057220458984),
  });
  XfloorPianoCC27.addComponentOrReplace(XtransformX156);

  const XfloorPianoCC28 = new Entity("XfloorPianoCC28");
  engine.addEntity(XfloorPianoCC28);
  XfloorPianoCC28.setParent(_scene);
  const XtransformX157 = new Transform({
    position: new Vector3(50.5, 48.44706726074219, 6),
    rotation: new Quaternion(
      -2.743679053076502e-15,
      0.7071068286895752,
      -8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.0000061988830566, 1, 1.0000061988830566),
  });
  XfloorPianoCC28.addComponentOrReplace(XtransformX157);

  const XfloorPianoCC34 = new Entity("XfloorPianoCC34");
  engine.addEntity(XfloorPianoCC34);
  XfloorPianoCC34.setParent(_scene);
  const XtransformX158 = new Transform({
    position: new Vector3(71, 48.44706726074219, 5.5),
    rotation: new Quaternion(
      -2.743679053076502e-15,
      0.7071068286895752,
      -8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.0000064373016357, 1, 1.0000064373016357),
  });
  XfloorPianoCC34.addComponentOrReplace(XtransformX158);

  const XfloorPianoCC29 = new Entity("XfloorPianoCC29");
  engine.addEntity(XfloorPianoCC29);
  XfloorPianoCC29.setParent(_scene);
  const XtransformX160 = new Transform({
    position: new Vector3(78, 48.44706726074219, 23),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1.0000050067901611, 1, 1.0000050067901611),
  });
  XfloorPianoCC29.addComponentOrReplace(XtransformX160);

  const XfloorPianoCC31 = new Entity("XfloorPianoCC31");
  engine.addEntity(XfloorPianoCC31);
  XfloorPianoCC31.setParent(_scene);
  const XtransformX161 = new Transform({
    position: new Vector3(90.5, 48.44706726074219, 26),
    rotation: new Quaternion(
      -2.743679053076502e-15,
      0.7071068286895752,
      -8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.0000059604644775, 1, 1.0000059604644775),
  });
  XfloorPianoCC31.addComponentOrReplace(XtransformX161);

  const XfloorPianoCC30 = new Entity("XfloorPianoCC30");
  engine.addEntity(XfloorPianoCC30);
  XfloorPianoCC30.setParent(_scene);
  const XtransformX162 = new Transform({
    position: new Vector3(87.5, 48.44706726074219, 24),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1.0000050067901611, 1, 1.0000050067901611),
  });
  XfloorPianoCC30.addComponentOrReplace(XtransformX162);

  const XfloorPianoCC32 = new Entity("XfloorPianoCC32");
  engine.addEntity(XfloorPianoCC32);
  XfloorPianoCC32.setParent(_scene);
  const XtransformX163 = new Transform({
    position: new Vector3(85.5, 48.44706726074219, 14.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1.0000050067901611, 1, 1.0000050067901611),
  });
  XfloorPianoCC32.addComponentOrReplace(XtransformX163);

  const XfloorPianoCC33 = new Entity("XfloorPianoCC33");
  engine.addEntity(XfloorPianoCC33);
  XfloorPianoCC33.setParent(_scene);
  const XtransformX164 = new Transform({
    position: new Vector3(89, 48.44706726074219, 5),
    rotation: new Quaternion(
      -2.743679053076502e-15,
      0.7071068286895752,
      -8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.0000064373016357, 1, 1.0000064373016357),
  });
  XfloorPianoCC33.addComponentOrReplace(XtransformX164);

  const XfloorPianoCC35 = new Entity("XfloorPianoCC35");
  engine.addEntity(XfloorPianoCC35);
  XfloorPianoCC35.setParent(_scene);
  const XtransformX165 = new Transform({
    position: new Vector3(80, 48.44706726074219, 7),
    rotation: new Quaternion(
      -2.743679053076502e-15,
      0.7071068286895752,
      -8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.000006914138794, 1, 1.000006914138794),
  });
  XfloorPianoCC35.addComponentOrReplace(XtransformX165);

  const XfloorPianoCC36 = new Entity("XfloorPianoCC36");
  engine.addEntity(XfloorPianoCC36);
  XfloorPianoCC36.setParent(_scene);
  const XtransformX166 = new Transform({
    position: new Vector3(9.5, 48.44706726074219, 40.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1.0000050067901611, 1, 1.0000050067901611),
  });
  XfloorPianoCC36.addComponentOrReplace(XtransformX166);

  const XfloorPianoCC37 = new Entity("XfloorPianoCC37");
  engine.addEntity(XfloorPianoCC37);
  XfloorPianoCC37.setParent(_scene);
  const XtransformX167 = new Transform({
    position: new Vector3(23.5, 48.44706726074219, 33),
    rotation: new Quaternion(
      -2.743679053076502e-15,
      0.7071068286895752,
      -8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.0000066757202148, 1, 1.0000066757202148),
  });
  XfloorPianoCC37.addComponentOrReplace(XtransformX167);

  const XfloorPianoCC38 = new Entity("XfloorPianoCC38");
  engine.addEntity(XfloorPianoCC38);
  XfloorPianoCC38.setParent(_scene);
  const XtransformX168 = new Transform({
    position: new Vector3(2, 48.44706726074219, 12.5), //
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1.0000050067901611, 1, 1.0000050067901611),
  });
  XfloorPianoCC38.addComponentOrReplace(XtransformX168);

  const XfloorPianoCC39 = new Entity("XfloorPianoCC39");
  engine.addEntity(XfloorPianoCC39);
  XfloorPianoCC39.setParent(_scene);
  const XtransformX169 = new Transform({
    position: new Vector3(14.5, 48.44706726074219, 8.5),
    rotation: new Quaternion(
      -2.743679053076502e-15,
      0.7071068286895752,
      -8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.000006914138794, 1, 1.000006914138794),
  });
  XfloorPianoCC39.addComponentOrReplace(XtransformX169);

  const XfloorPianoCC40 = new Entity("XfloorPianoCC40");
  engine.addEntity(XfloorPianoCC40);
  XfloorPianoCC40.setParent(_scene);
  const XtransformX170 = new Transform({
    position: new Vector3(79, 48.44706726074219, 18),
    rotation: new Quaternion(
      -2.743679053076502e-15,
      0.7071068286895752,
      -8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.0000064373016357, 1, 1.0000064373016357),
  });
  XfloorPianoCC40.addComponentOrReplace(XtransformX170);

  const XfloorPianoCC41 = new Entity("XfloorPianoCC41");
  engine.addEntity(XfloorPianoCC41);
  XfloorPianoCC41.setParent(_scene);
  const XtransformX171 = new Transform({
    position: new Vector3(57.5, 48.44706726074219, 38),
    rotation: new Quaternion(
      -2.743679053076502e-15,
      0.7071068286895752,
      -8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.0000066757202148, 1, 1.0000066757202148),
  });
  XfloorPianoCC41.addComponentOrReplace(XtransformX171);

  const XfloorPianoCC42 = new Entity("XfloorPianoCC42");
  engine.addEntity(XfloorPianoCC42);
  XfloorPianoCC42.setParent(_scene);
  const XtransformX172 = new Transform({
    position: new Vector3(44.5, 48.44706726074219, 39),
    rotation: new Quaternion(
      -2.743679053076502e-15,
      0.7071068286895752,
      -8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.0000073909759521, 1, 1.0000073909759521),
  });
  XfloorPianoCC42.addComponentOrReplace(XtransformX172);

  const XfloorPianoCC43 = new Entity("XfloorPianoCC43");
  engine.addEntity(XfloorPianoCC43);
  XfloorPianoCC43.setParent(_scene);
  const XtransformX173 = new Transform({
    position: new Vector3(36, 48.44706726074219, 37.5),
    rotation: new Quaternion(
      -2.743679053076502e-15,
      0.7071068286895752,
      -8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.0000073909759521, 1, 1.0000073909759521),
  });
  XfloorPianoCC43.addComponentOrReplace(XtransformX173);

  const XfloorPianoCC44 = new Entity("XfloorPianoCC44");
  engine.addEntity(XfloorPianoCC44);
  XfloorPianoCC44.setParent(_scene);
  const XtransformX174 = new Transform({
    position: new Vector3(22, 48.44706726074219, 37),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1.0000050067901611, 1, 1.0000050067901611),
  });
  XfloorPianoCC44.addComponentOrReplace(XtransformX174);

  const XfloorPianoCC45 = new Entity("XfloorPianoCC45");
  engine.addEntity(XfloorPianoCC45);
  XfloorPianoCC45.setParent(_scene);
  const XtransformX175 = new Transform({
    position: new Vector3(11, 48.44706726074219, 30),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1.0000050067901611, 1, 1.0000050067901611),
  });
  XfloorPianoCC45.addComponentOrReplace(XtransformX175);

  const XfloorPianoCC47 = new Entity("XfloorPianoCC47");
  engine.addEntity(XfloorPianoCC47);
  XfloorPianoCC47.setParent(_scene);
  const XtransformX176 = new Transform({
    position: new Vector3(44.5, 48.44706726074219, 28),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1.0000050067901611, 1, 1.0000050067901611),
  });
  XfloorPianoCC47.addComponentOrReplace(XtransformX176);

  const XfloorPianoCC48 = new Entity("XfloorPianoCC48");
  engine.addEntity(XfloorPianoCC48);
  XfloorPianoCC48.setParent(_scene);
  const XtransformX177 = new Transform({
    position: new Vector3(43, 48.44706726074219, 38),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1.0000050067901611, 1, 1.0000050067901611),
  });
  XfloorPianoCC48.addComponentOrReplace(XtransformX177);

  const XfloorPianoCC49 = new Entity("XfloorPianoCC49");
  engine.addEntity(XfloorPianoCC49);
  XfloorPianoCC49.setParent(_scene);
  const XtransformX178 = new Transform({
    position: new Vector3(58, 48.44706726074219, 28),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1.0000050067901611, 1, 1.0000050067901611),
  });
  XfloorPianoCC49.addComponentOrReplace(XtransformX178);

  const XfloorPianoCC50 = new Entity("XfloorPianoCC50");
  engine.addEntity(XfloorPianoCC50);
  XfloorPianoCC50.setParent(_scene);
  const XtransformX179 = new Transform({
    position: new Vector3(55.75, 48.44706726074219, 37.25),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1.0000050067901611, 1, 1.0000050067901611),
  });
  XfloorPianoCC50.addComponentOrReplace(XtransformX179);

  const XfloorPianoCC52 = new Entity("XfloorPianoCC52");
  engine.addEntity(XfloorPianoCC52);
  XfloorPianoCC52.setParent(_scene);
  const XtransformX180 = new Transform({
    position: new Vector3(24, 48.44706726074219, 10),
    rotation: new Quaternion(
      -2.743679053076502e-15,
      0.7071068286895752,
      -8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.0000073909759521, 1, 1.0000073909759521),
  });
  XfloorPianoCC52.addComponentOrReplace(XtransformX180);

  const XfloorPianoCC53 = new Entity("XfloorPianoCC53");
  engine.addEntity(XfloorPianoCC53);
  XfloorPianoCC53.setParent(_scene);
  const XtransformX181 = new Transform({
    position: new Vector3(36.5, 48.44706726074219, 13),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1.0000050067901611, 1, 1.0000050067901611),
  });
  XfloorPianoCC53.addComponentOrReplace(XtransformX181);

  const XfloorPianoCC54 = new Entity("XfloorPianoCC54");
  engine.addEntity(XfloorPianoCC54);
  XfloorPianoCC54.setParent(_scene);
  const XtransformX182 = new Transform({
    position: new Vector3(35, 48.44706726074219, 22),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1.0000050067901611, 1, 1.0000050067901611),
  });
  XfloorPianoCC54.addComponentOrReplace(XtransformX182);

  const XfloorPianoCC55 = new Entity("XfloorPianoCC55");
  engine.addEntity(XfloorPianoCC55);
  XfloorPianoCC55.setParent(_scene);
  const XtransformX183 = new Transform({
    position: new Vector3(22, 48.44706726074219, 19),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1.0000050067901611, 1, 1.0000050067901611),
  });
  XfloorPianoCC55.addComponentOrReplace(XtransformX183);

  const XfloorPianoCC56 = new Entity("XfloorPianoCC56");
  engine.addEntity(XfloorPianoCC56);
  XfloorPianoCC56.setParent(_scene);
  const XtransformX184 = new Transform({
    position: new Vector3(37.5, 48.44706726074219, 4),
    rotation: new Quaternion(
      -2.743679053076502e-15,
      0.7071068286895752,
      -8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.000006914138794, 1, 1.000006914138794),
  });
  XfloorPianoCC56.addComponentOrReplace(XtransformX184);

  const XfloorPianoCC57 = new Entity("XfloorPianoCC57");
  engine.addEntity(XfloorPianoCC57);
  XfloorPianoCC57.setParent(_scene);
  const XtransformX185 = new Transform({
    position: new Vector3(70, 48.44706726074219, 19),
    rotation: new Quaternion(
      -2.743679053076502e-15,
      0.7071068286895752,
      -8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.000006914138794, 1, 1.000006914138794),
  });
  XfloorPianoCC57.addComponentOrReplace(XtransformX185);

  const XfloorPianoCC58 = new Entity("XfloorPianoCC58");
  engine.addEntity(XfloorPianoCC58);
  XfloorPianoCC58.setParent(_scene);
  const XtransformX186 = new Transform({
    position: new Vector3(25, 48.44706726074219, 21.5),
    rotation: new Quaternion(
      -2.743679053076502e-15,
      0.7071068286895752,
      -8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.000007152557373, 1, 1.000007152557373),
  });
  XfloorPianoCC58.addComponentOrReplace(XtransformX186);

  const XfloorPianoCC46 = new Entity("XfloorPianoCC46");
  engine.addEntity(XfloorPianoCC46);
  XfloorPianoCC46.setParent(_scene);
  const XtransformX187 = new Transform({
    position: new Vector3(12.5, 48.44706726074219, 25),
    rotation: new Quaternion(
      -2.743679053076502e-15,
      0.7071068286895752,
      -8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.000007152557373, 1, 1.000007152557373),
  });
  XfloorPianoCC46.addComponentOrReplace(XtransformX187);

  const XfloorPianoCC59 = new Entity("XfloorPianoCC59");
  engine.addEntity(XfloorPianoCC59);
  XfloorPianoCC59.setParent(_scene);
  const XtransformX188 = new Transform({
    position: new Vector3(36.5, 48.44706726074219, 19),
    rotation: new Quaternion(
      -2.743679053076502e-15,
      0.7071068286895752,
      -8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.0000078678131104, 1, 1.0000078678131104),
  });
  XfloorPianoCC59.addComponentOrReplace(XtransformX188);

  const XfloorPianoCC51 = new Entity("XfloorPianoCC51");
  engine.addEntity(XfloorPianoCC51);
  XfloorPianoCC51.setParent(_scene);
  const XXtransform189 = new Transform({
    position: new Vector3(47, 48.44706726074219, 21),
    rotation: new Quaternion(
      -2.743679053076502e-15,
      0.7071068286895752,
      -8.429369557916289e-8,
      0.7071068286895752
    ),
    scale: new Vector3(1.0000081062316895, 1, 1.0000081062316895),
  });
  XfloorPianoCC51.addComponentOrReplace(XXtransform189);

  //END BELIEVER BRIDGE//END BELIEVER BRIDGE//END BELIEVER BRIDGE

  //START GET HELMET COUNT

  type NftBalanceResponse = {
    balance?: number;
    owner?: string;
    queryTime?: number;
  };

  //https://us-central1-sandbox-query-blockchain.cloudfunctions.net/blockChainQueryApp/hello-world
  const customBaseUrl =
    "https://us-central1-sandbox-query-blockchain.cloudfunctions.net";
  async function getHelmetBalance(
    profile: string,
    version: string,
    ownerAddress?: string | null
  ): Promise<NftBalanceResponse> {
    const METHOD_NAME = "getHelmetBalance";
    const resultPromise = executeTask(async () => {
      let response = null;
      //https://us-central1-sandbox-query-blockchain.cloudfunctions.net/blockChainQueryApp/get-account-nft-balance?network=
      //https://us-central1-sandbox-query-blockchain.cloudfunctions.net/blockChainQueryApp/get-account-nft-balance?network=matic&ownerAddress=WALLET-HERE&limit=9&logLevel=debug&storage=cacheX&multiCall=true&contractId=dcl-mtdgpnks
      const callUrl =
        customBaseUrl +
        "/blockChainQueryApp/get-account-nft-balance?" +
        //const callUrl= customBaseUrl + '/blockChainQueryApp/hello-world?'
        "&network=" +
        "matic" +
        "&limit=" +
        10 +
        "&contractId=" +
        "dcl-mtdgpnks" +
        "&profile=" +
        profile +
        "&version=" +
        version +
        "&ownerAddress=" +
        ownerAddress +
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
          return json;
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

  const profile = "metacity";
  const version = "1";
  const subMethodPublicKeyPromise = "XXpublicKeyPromise: ";
  const subMethodConfigPromise = "XXconfigPromise: ";

  let publicKey: string | null = null;
  let helmetNftBalance: NftBalanceResponse;
  const publicKeyRequest = executeTask(async () => {
    await getAndSetUserData();

    const userData = getUserDataFromLocal();
    let publicKey = null;
    if (userData !== null) {
      publicKey = userData.publicKey;
    }
    log(
      subMethodPublicKeyPromise + " publicKeyRequest response " + publicKey,
      userData
    );

    return publicKey;
  })
    .catch(function (error) {
      log(subMethodPublicKeyPromise + " failed getting public key " + error);
      publicKey = "error";
      return null;
    })
    .then(function (value: string | null) {
      if (value !== null) {
        publicKey = value;
      } else {
        publicKey = "";
      }
      log(
        subMethodPublicKeyPromise + "got and setting public key " + publicKey,
        null
      );
      const retValBlank = isNull(publicKey) || publicKey == "";
      if (retValBlank) {
        log(
          subMethodPublicKeyPromise +
            "MISSING public key " +
            publicKey +
            " exiting",
          null
        );
      }
      //START GET HELMET COUNT

      const configRequest = executeTask(async () => {
        let config = await getHelmetBalance(profile, version, publicKey);

        log(subMethodConfigPromise + " response ", config);

        return config;
      });

      configRequest
        .catch(function (error) {
          log(
            subMethodConfigPromise + "ERROR#1 getting balance" + error,
            error
          );
          log(
            subMethodConfigPromise + "ERROR#2 getting balance" + error,
            error
          );
          log(
            subMethodConfigPromise + "ERROR#3 getting balance" + error,
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
  const aliceFollowStopActions = [
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

      //,{"entityName":"toolboxCE","actionId":"rotate","values":{"target":"xMDPWearableHelmet2","x":0,"y":180,"z":0,"curve":"linear","repeatAction":"relative","speed":2,"multiplayer":true,"onComplete":[]}}

      //,{"entityName":"toolboxCE","actionId":"scale","values":{"target":"XfloorPianoCC42","x":0.5,"y":1,"z":1,"curve":"linear","repeatAction":"reverse","speed":3,"multiplayer":false,"onComplete":[]}}
      //,{"entityName":"toolboxCE","actionId":"scale","values":{"target":"XfloorPianoCC34","x":0.5,"y":1,"z":1,"curve":"linear","repeatAction":"reverse","speed":3,"multiplayer":false,"onComplete":[]}}
      //,{"entityName":"toolboxCE","actionId":"scale","values":{"target":"XfloorPianoCC52","x":0.5,"y":1,"z":1,"curve":"linear","repeatAction":"reverse","speed":3,"multiplayer":false,"onComplete":[]}}
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
  let autoStart = [
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
    //,{"entityName":"toolboxCE","actionId":"rotate","values":{"target":"xMDPWearableHelmet2","x":0,"y":180,"z":0,"curve":"linear","repeatAction":"relative","speed":2,"multiplayer":true,"onComplete":[]}}

    //,{"entityName":"toolboxCE","actionId":"scale","values":{"target":"XfloorPianoCC42","x":0.5,"y":1,"z":1,"curve":"linear","repeatAction":"reverse","speed":3,"multiplayer":false,"onComplete":[]}}
    //,{"entityName":"toolboxCE","actionId":"scale","values":{"target":"XfloorPianoCC34","x":0.5,"y":1,"z":1,"curve":"linear","repeatAction":"reverse","speed":3,"multiplayer":false,"onComplete":[]}}
    //,{"entityName":"toolboxCE","actionId":"scale","values":{"target":"XfloorPianoCC52","x":0.5,"y":1,"z":1,"curve":"linear","repeatAction":"reverse","speed":3,"multiplayer":false,"onComplete":[]}}
  ];

  const script1 = new Script1();
  const script2 = new Script2();
  const script3 = new Script3();
  const script4 = new Script4();
  const script5 = new Script5();
  const script6 = new Script6();
  const script7 = new Script7();
  const script8 = new Script8();
  const script9 = new Script9();
  const script10 = new Script10();
  //const script11 = new Script11()
  const script12 = new Script12();
  const script13 = new Script13();
  const script14 = new Script14();
  const script15 = new Script15();
  const script16 = new Script16();
  const script17 = new Script17();
  const script18 = new Script18();

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
  script1.init();
  script2.init();
  script3.init();
  script4.init();
  script5.init();
  script6.init();
  script7.init();
  script8.init();
  script9.init();
  script10.init();
  script12.init();
  script13.init();
  script14.init();
  script15.init();
  script16.init();
  script17.init();
  script18.init();

  script13.spawn(toolboxCE, { loggingLevel: "WARN" }, toolboxChannel);

  const toolboxScript: Script13 = script13;

  avatarSwapScript = script12;

  const pianoFloorScript = script3;
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

  script2.spawn(
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
  script2.spawn(
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
  script2.spawn(
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
  script2.spawn(
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
  script2.spawn(
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
  script2.spawn(
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
  script2.spawn(
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
  script2.spawn(
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
  script2.spawn(
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
  script2.spawn(
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
  );
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
  script5.spawn(
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

  const loadFloorPianos = () => {
    log("loadFloorPianos");
    script3.spawn(
      floorPianoCC4,
      {
        active: false,
        visibleCasing: false,
        keysWithCollisions: false,
        enableClickable: true,
        enabledClickSound: true,
        debugTriggers: false,
        scaleKeysToFitInHostBoundary: true,
        numberOfOctaves: 2,
        numberOfKeys: 12,
        visibleNaturalKeys: true,
        visibleFlatSharpKeys: false,
        naturalToneKeyColor: "transparent",
        naturalToneKeyEmissiveIntensity: 10,
        naturalToneKeyLength: 1,
        naturalToneKeyYOffset: 0,
        flatSharpKeyColor: "Black",
        flatSharpKeyLength: 2,
      },
      createChannel(channelId, floorPianoCC4, channelBus)
    );

    script3.spawn(
      floorPianoCC,
      {
        enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
        active: true,
        enabledClickSound: true,
        debugTriggers: false,
        scaleKeysToFitInHostBoundary: true,
        keysWithCollisions: false,
        numberOfOctaves: 2,
        numberOfKeys: 20,
        visibleCasing: false,
        visibleNaturalKeys: true,
        visibleFlatSharpKeys: false,
        naturalToneKeyColor: "transparent",
        naturalToneKeyEmissiveIntensity: 10,
        naturalToneKeyLength: 1,
        naturalToneKeyYOffset: 0,
        flatSharpKeyColor: "Black",
        flatSharpKeyLength: 2,
      },
      createChannel(channelId, floorPianoCC, channelBus)
    );

    script3.spawn(
      floorPianoCC2,
      {
        enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
        active: true,
        enabledClickSound: true,
        debugTriggers: false,
        scaleKeysToFitInHostBoundary: true,
        keysWithCollisions: false,
        numberOfOctaves: 2,
        numberOfKeys: 45,
        visibleCasing: false,
        visibleNaturalKeys: true,
        visibleFlatSharpKeys: false,
        naturalToneKeyColor: "transparent",
        naturalToneKeyEmissiveIntensity: 10,
        naturalToneKeyLength: 1,
        naturalToneKeyYOffset: 0,
        flatSharpKeyColor: "Black",
        flatSharpKeyLength: 2,
      },
      createChannel(channelId, floorPianoCC2, channelBus)
    );
    script3.spawn(
      floorPianoCC3,
      {
        enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
        active: true,
        enabledClickSound: true,
        debugTriggers: false,
        scaleKeysToFitInHostBoundary: true,
        keysWithCollisions: false,
        numberOfOctaves: 2,
        numberOfKeys: 35,
        visibleCasing: false,
        visibleNaturalKeys: true,
        visibleFlatSharpKeys: false,
        naturalToneKeyColor: "transparent",
        naturalToneKeyEmissiveIntensity: 10,
        naturalToneKeyLength: 1,
        naturalToneKeyYOffset: 0,
        flatSharpKeyColor: "Black",
        flatSharpKeyLength: 2,
      },
      createChannel(channelId, floorPianoCC3, channelBus)
    );
    script3.spawn(
      floorPianoCC5,
      {
        enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
        active: true,
        enabledClickSound: true,
        debugTriggers: false,
        scaleKeysToFitInHostBoundary: true,
        keysWithCollisions: false,
        numberOfOctaves: 2,
        numberOfKeys: 20,
        visibleCasing: false,
        visibleNaturalKeys: true,
        visibleFlatSharpKeys: false,
        naturalToneKeyColor: "transparent",
        naturalToneKeyEmissiveIntensity: 10,
        naturalToneKeyLength: 1,
        naturalToneKeyYOffset: 0,
        flatSharpKeyColor: "Black",
        flatSharpKeyLength: 2,
      },
      createChannel(channelId, floorPianoCC5, channelBus)
    );
    script3.spawn(
      floorPianoCC6,
      {
        enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
        active: true,
        enabledClickSound: true,
        debugTriggers: false,
        scaleKeysToFitInHostBoundary: true,
        keysWithCollisions: false,
        numberOfOctaves: 2,
        numberOfKeys: 20,
        visibleCasing: false,
        visibleNaturalKeys: true,
        visibleFlatSharpKeys: false,
        naturalToneKeyColor: "transparent",
        naturalToneKeyEmissiveIntensity: 10,
        naturalToneKeyLength: 1,
        naturalToneKeyYOffset: 0,
        flatSharpKeyColor: "Black",
        flatSharpKeyLength: 2,
      },
      createChannel(channelId, floorPianoCC6, channelBus)
    );
    script3.spawn(
      floorPianoCC7,
      {
        enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
        enabledClickSound: true,
        active: true,
        debugTriggers: false,
        scaleKeysToFitInHostBoundary: true,
        keysWithCollisions: false,
        numberOfOctaves: 2,
        numberOfKeys: 20,
        visibleCasing: false,
        visibleNaturalKeys: true,
        visibleFlatSharpKeys: false,
        naturalToneKeyColor: "transparent",
        naturalToneKeyEmissiveIntensity: 10,
        naturalToneKeyLength: 1,
        naturalToneKeyYOffset: 0,
        flatSharpKeyColor: "Black",
        flatSharpKeyLength: 2,
      },
      createChannel(channelId, floorPianoCC7, channelBus)
    );
    script3.spawn(
      floorPianoCC8,
      {
        enableClickable: true,
        active: true,
        enabledClickSound: true,
        debugTriggers: false,
        scaleKeysToFitInHostBoundary: true,
        keysWithCollisions: false,
        numberOfOctaves: 2,
        numberOfKeys: 45,
        visibleCasing: false,
        visibleNaturalKeys: true,
        visibleFlatSharpKeys: false,
        naturalToneKeyColor: "transparent",
        naturalToneKeyEmissiveIntensity: 10,
        naturalToneKeyLength: 1,
        naturalToneKeyYOffset: 0,
        flatSharpKeyColor: "Black",
        flatSharpKeyLength: 2,
      },
      createChannel(channelId, floorPianoCC8, channelBus)
    );
    script3.spawn(
      floorPianoCC9,
      {
        enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
        active: true,
        enabledClickSound: true,
        debugTriggers: false,
        scaleKeysToFitInHostBoundary: true,
        keysWithCollisions: false,
        numberOfOctaves: 2,
        numberOfKeys: 60,
        visibleCasing: false,
        visibleNaturalKeys: true,
        visibleFlatSharpKeys: false,
        naturalToneKeyColor: "transparent",
        naturalToneKeyEmissiveIntensity: 10,
        naturalToneKeyLength: 1,
        naturalToneKeyYOffset: 0,
        flatSharpKeyColor: "Black",
        flatSharpKeyLength: 2,
      },
      createChannel(channelId, floorPianoCC9, channelBus)
    );
    script3.spawn(
      floorPianoCC10,
      {
        enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
        active: true,
        enabledClickSound: true,
        debugTriggers: false,
        scaleKeysToFitInHostBoundary: true,
        keysWithCollisions: false,
        numberOfOctaves: 2,
        numberOfKeys: 60,
        visibleCasing: false,
        visibleNaturalKeys: true,
        visibleFlatSharpKeys: false,
        naturalToneKeyColor: "transparent",
        naturalToneKeyEmissiveIntensity: 10,
        naturalToneKeyLength: 1,
        naturalToneKeyYOffset: 0,
        flatSharpKeyColor: "Black",
        flatSharpKeyLength: 2,
      },
      createChannel(channelId, floorPianoCC10, channelBus)
    );
    script3.spawn(
      floorPianoCC11,
      {
        enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
        active: true,
        enabledClickSound: true,
        debugTriggers: false,
        scaleKeysToFitInHostBoundary: true,
        keysWithCollisions: false,
        numberOfOctaves: 2,
        numberOfKeys: 60,
        visibleCasing: false,
        visibleNaturalKeys: true,
        visibleFlatSharpKeys: false,
        naturalToneKeyColor: "transparent",
        naturalToneKeyEmissiveIntensity: 10,
        naturalToneKeyLength: 1,
        naturalToneKeyYOffset: 0,
        flatSharpKeyColor: "Black",
        flatSharpKeyLength: 2,
      },
      createChannel(channelId, floorPianoCC11, channelBus)
    );
    script3.spawn(
      floorPianoCC12,
      {
        enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
        active: true,
        enabledClickSound: true,
        debugTriggers: false,
        scaleKeysToFitInHostBoundary: true,
        keysWithCollisions: false,
        numberOfOctaves: 2,
        numberOfKeys: 40,
        visibleCasing: false,
        visibleNaturalKeys: true,
        visibleFlatSharpKeys: false,
        naturalToneKeyColor: "transparent",
        naturalToneKeyEmissiveIntensity: 10,
        naturalToneKeyLength: 1,
        naturalToneKeyYOffset: 0,
        flatSharpKeyColor: "Black",
        flatSharpKeyLength: 2,
      },
      createChannel(channelId, floorPianoCC12, channelBus)
    );
    script3.spawn(
      floorPianoCC13,
      {
        enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
        active: true,
        enabledClickSound: true,
        debugTriggers: false,
        scaleKeysToFitInHostBoundary: true,
        keysWithCollisions: false,
        numberOfOctaves: 2,
        numberOfKeys: 40,
        visibleCasing: false,
        visibleNaturalKeys: true,
        visibleFlatSharpKeys: false,
        naturalToneKeyColor: "transparent",
        naturalToneKeyEmissiveIntensity: 10,
        naturalToneKeyLength: 1,
        naturalToneKeyYOffset: 0,
        flatSharpKeyColor: "Black",
        flatSharpKeyLength: 2,
      },
      createChannel(channelId, floorPianoCC13, channelBus)
    );
    script3.spawn(
      floorPianoCC14,
      {
        enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
        active: true,
        enabledClickSound: true,
        debugTriggers: false,
        scaleKeysToFitInHostBoundary: true,
        keysWithCollisions: false,
        numberOfOctaves: 2,
        numberOfKeys: 40,
        visibleCasing: false,
        visibleNaturalKeys: true,
        visibleFlatSharpKeys: false,
        naturalToneKeyColor: "transparent",
        naturalToneKeyEmissiveIntensity: 10,
        naturalToneKeyLength: 1,
        naturalToneKeyYOffset: 0,
        flatSharpKeyColor: "Black",
        flatSharpKeyLength: 2,
      },
      createChannel(channelId, floorPianoCC14, channelBus)
    );
    script3.spawn(
      floorPianoCC15,
      {
        enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
        active: true,
        enabledClickSound: true,
        debugTriggers: false,
        scaleKeysToFitInHostBoundary: true,
        keysWithCollisions: false,
        numberOfOctaves: 2,
        numberOfKeys: 80,
        visibleCasing: false,
        visibleNaturalKeys: true,
        visibleFlatSharpKeys: false,
        naturalToneKeyColor: "transparent",
        naturalToneKeyEmissiveIntensity: 10,
        naturalToneKeyLength: 1,
        naturalToneKeyYOffset: 0,
        flatSharpKeyColor: "Black",
        flatSharpKeyLength: 2,
      },
      createChannel(channelId, floorPianoCC15, channelBus)
    );
    script3.spawn(
      floorPianoCC16,
      {
        enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
        active: true,
        enabledClickSound: true,
        debugTriggers: false,
        scaleKeysToFitInHostBoundary: true,
        keysWithCollisions: false,
        numberOfOctaves: 2,
        numberOfKeys: 80,
        visibleCasing: false,
        visibleNaturalKeys: true,
        visibleFlatSharpKeys: false,
        naturalToneKeyColor: "transparent",
        naturalToneKeyEmissiveIntensity: 10,
        naturalToneKeyLength: 1,
        naturalToneKeyYOffset: 0,
        flatSharpKeyColor: "Black",
        flatSharpKeyLength: 2,
      },
      createChannel(channelId, floorPianoCC16, channelBus)
    );
    script3.spawn(
      floorPianoCC17,
      {
        enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
        active: true,
        enabledClickSound: true,
        debugTriggers: false,
        scaleKeysToFitInHostBoundary: true,
        keysWithCollisions: false,
        numberOfOctaves: 2,
        numberOfKeys: 80,
        visibleCasing: false,
        visibleNaturalKeys: true,
        visibleFlatSharpKeys: false,
        naturalToneKeyColor: "transparent",
        naturalToneKeyEmissiveIntensity: 10,
        naturalToneKeyLength: 1,
        naturalToneKeyYOffset: 0,
        flatSharpKeyColor: "Black",
        flatSharpKeyLength: 2,
      },
      createChannel(channelId, floorPianoCC17, channelBus)
    );
    script3.spawn(
      floorPianoCC18,
      {
        enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
        active: true,
        enabledClickSound: true,
        debugTriggers: false,
        scaleKeysToFitInHostBoundary: true,
        keysWithCollisions: false,
        numberOfOctaves: 2,
        numberOfKeys: 22,
        visibleCasing: false,
        visibleNaturalKeys: true,
        visibleFlatSharpKeys: false,
        naturalToneKeyColor: "transparent",
        naturalToneKeyEmissiveIntensity: 10,
        naturalToneKeyLength: 1,
        naturalToneKeyYOffset: 0,
        flatSharpKeyColor: "Black",
        flatSharpKeyLength: 2,
      },
      createChannel(channelId, floorPianoCC18, channelBus)
    );
    script3.spawn(
      floorPianoCC19,
      {
        enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
        active: true,
        enabledClickSound: true,
        debugTriggers: false,
        scaleKeysToFitInHostBoundary: true,
        keysWithCollisions: false,
        numberOfOctaves: 2,
        numberOfKeys: 22,
        visibleCasing: false,
        visibleNaturalKeys: true,
        visibleFlatSharpKeys: false,
        naturalToneKeyColor: "transparent",
        naturalToneKeyEmissiveIntensity: 10,
        naturalToneKeyLength: 1,
        naturalToneKeyYOffset: 0,
        flatSharpKeyColor: "Black",
        flatSharpKeyLength: 2,
      },
      createChannel(channelId, floorPianoCC19, channelBus)
    );
    script3.spawn(
      floorPianoCC20,
      {
        enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
        active: true,
        enabledClickSound: true,
        debugTriggers: false,
        scaleKeysToFitInHostBoundary: true,
        keysWithCollisions: false,
        numberOfOctaves: 2,
        numberOfKeys: 22,
        visibleCasing: false,
        visibleNaturalKeys: true,
        visibleFlatSharpKeys: false,
        naturalToneKeyColor: "transparent",
        naturalToneKeyEmissiveIntensity: 10,
        naturalToneKeyLength: 1,
        naturalToneKeyYOffset: 0,
        flatSharpKeyColor: "Black",
        flatSharpKeyLength: 2,
      },
      createChannel(channelId, floorPianoCC20, channelBus)
    );
    script3.spawn(
      floorPianoCC21,
      {
        enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
        active: true,
        enabledClickSound: true,
        debugTriggers: false,
        scaleKeysToFitInHostBoundary: true,
        keysWithCollisions: false,
        numberOfOctaves: 2,
        numberOfKeys: 60,
        visibleCasing: false,
        visibleNaturalKeys: true,
        visibleFlatSharpKeys: false,
        naturalToneKeyColor: "transparent",
        naturalToneKeyEmissiveIntensity: 10,
        naturalToneKeyLength: 1,
        naturalToneKeyYOffset: 0,
        flatSharpKeyColor: "Black",
        flatSharpKeyLength: 2,
      },
      createChannel(channelId, floorPianoCC21, channelBus)
    );
    script3.spawn(
      floorPianoCC22,
      {
        enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
        active: true,
        enabledClickSound: true,
        debugTriggers: false,
        scaleKeysToFitInHostBoundary: true,
        keysWithCollisions: false,
        numberOfOctaves: 2,
        numberOfKeys: 60,
        visibleCasing: false,
        visibleNaturalKeys: true,
        visibleFlatSharpKeys: false,
        naturalToneKeyColor: "transparent",
        naturalToneKeyEmissiveIntensity: 10,
        naturalToneKeyLength: 1,
        naturalToneKeyYOffset: 0,
        flatSharpKeyColor: "Black",
        flatSharpKeyLength: 2,
      },
      createChannel(channelId, floorPianoCC22, channelBus)
    );
    script3.spawn(
      floorPianoCC23,
      {
        enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
        active: true,
        enabledClickSound: true,
        debugTriggers: false,
        scaleKeysToFitInHostBoundary: true,
        keysWithCollisions: false,
        numberOfOctaves: 2,
        numberOfKeys: 60,
        visibleCasing: false,
        visibleNaturalKeys: true,
        visibleFlatSharpKeys: false,
        naturalToneKeyColor: "transparent",
        naturalToneKeyEmissiveIntensity: 10,
        naturalToneKeyLength: 1,
        naturalToneKeyYOffset: 0,
        flatSharpKeyColor: "Black",
        flatSharpKeyLength: 2,
      },
      createChannel(channelId, floorPianoCC23, channelBus)
    );
    script3.spawn(
      floorPianoCC24,
      {
        enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
        active: true,
        enabledClickSound: true,
        debugTriggers: false,
        scaleKeysToFitInHostBoundary: true,
        keysWithCollisions: false,
        numberOfOctaves: 2,
        numberOfKeys: 20,
        visibleCasing: false,
        visibleNaturalKeys: true,
        visibleFlatSharpKeys: false,
        naturalToneKeyColor: "transparent",
        naturalToneKeyEmissiveIntensity: 12,
        naturalToneKeyLength: 1,
        naturalToneKeyYOffset: 0,
        flatSharpKeyColor: "Black",
        flatSharpKeyLength: 2,
      },
      createChannel(channelId, floorPianoCC24, channelBus)
    );
  };
  handleDelayLoad(
    CONFIG.DELAY_LOAD_FLOOR_PIANOS,
    "loadFloorPianos",
    loadFloorPianos
  );

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

  script9.spawn(
    npcPlaceHolder,
    { active: false, npcName: "Moon Doge" },
    createChannel(channelId, npcPlaceHolder, channelBus)
  );
  script10.spawn(
    waypointCE,
    {
      active: false,
      target: "text",
      targetAltName: "MoonSquare",
    },
    createChannel(channelId, waypointCE, channelBus)
  );
  script10.spawn(
    waypointCE2,
    {
      active: false,
      target: "text",
      targetAltName: "MusleDogeSquare",
    },
    createChannel(channelId, waypointCE2, channelBus)
  );
  script10.spawn(
    waypointCE3,
    {
      active: false,
      target: "text",
      targetAltName: "MarsSquare",
    },
    createChannel(channelId, waypointCE3, channelBus)
  );
  script9.spawn(
    npcPlaceHolder3,
    { active: false, npcName: "DogeGod" },
    createChannel(channelId, npcPlaceHolder3, channelBus)
  );
  script9.spawn(
    npcPlaceHolder4,
    { active: false, npcName: "MarsDoge" },
    createChannel(channelId, npcPlaceHolder4, channelBus)
  );
  script9.spawn(
    npcPlaceHolder5,
    { active: false, npcName: "MuscleDoge" },
    createChannel(channelId, npcPlaceHolder5, channelBus)
  );
  script10.spawn(
    waypointCE4,
    {
      active: false,
      target: "text",
      targetAltName: "HeavenSquare",
    },
    createChannel(channelId, waypointCE4, channelBus)
  );
  script9.spawn(
    npcPlaceHolder2,
    { active: false, npcName: "LilDoge" },
    createChannel(channelId, npcPlaceHolder2, channelBus)
  );
  //script9.spawn(XnpcPlaceHolder2, {"active":false,"npcEnabled":true,"npcName":"LilDoge2"}, createChannel(channelId, XnpcPlaceHolder2, channelBus))
  script10.spawn(
    waypointCE5,
    {
      active: false,
      target: "text",
      targetAltName: "LilDogeSquare",
    },
    createChannel(channelId, waypointCE5, channelBus)
  );

  script10.spawn(
    waypointCERedBall1,
    {
      active: false,
      target: "redBall",
      targetAltName: "RedBall1",
    },
    createChannel(channelId, waypointCERedBall1, channelBus)
  );
  script10.spawn(
    waypointCERedBall1b,
    {
      active: false,
      target: "redBall",
      targetAltName: "RedBall1b",
    },
    createChannel(channelId, waypointCERedBall1b, channelBus)
  );
  script10.spawn(
    waypointCERedBall2,
    {
      active: false,
      target: "redBall",
      targetAltName: "RedBall2",
    },
    createChannel(channelId, waypointCERedBall2, channelBus)
  );
  script10.spawn(
    waypointCERedBall2b,
    {
      active: false,
      target: "redBall",
      targetAltName: "RedBall2b",
    },
    createChannel(channelId, waypointCERedBall2b, channelBus)
  );

  script12.spawn(
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
  //script14.spawn(externalLink, {"url":"https://https://www.metadoge.art/#mint"}, createChannel(channelId, externalLink, channelBus))
  /*script15.spawn(signpostTree, {"text":"","fontSize":60}, createChannel(channelId, signpostTree, channelBus)) 
  script15.spawn(signpostTree2, {"text":"Rent Me !!!","fontSize":60}, createChannel(channelId, signpostTree2, channelBus))
  script15.spawn(signpostTree3, {"text":"Rent Me !!!","fontSize":60}, createChannel(channelId, signpostTree3, channelBus))
  script15.spawn(signpostTree4, {"text":"Rent Me !!!","fontSize":60}, createChannel(channelId, signpostTree4, channelBus))
  script15.spawn(signpostTree5, {"text":"Rent Me !!!","fontSize":60}, createChannel(channelId, signpostTree5, channelBus))
  script15.spawn(signpostTree6, {"text":"Rent Me !!!","fontSize":60}, createChannel(channelId, signpostTree6, channelBus))
  script15.spawn(signpostTree7, {"text":"Rent Me !!!","fontSize":60}, createChannel(channelId, signpostTree7, channelBus))
  script15.spawn(signpostTree8, {"text":"Rent Me !!!","fontSize":60}, createChannel(channelId, signpostTree8, channelBus))
  script15.spawn(signpostTree9, {"text":"Rent Me !!!","fontSize":60}, createChannel(channelId, signpostTree9, channelBus))
  script15.spawn(signpostTree10, {"text":"Rent Me !!!","fontSize":60}, createChannel(channelId, signpostTree10, channelBus))
  script15.spawn(signpostTree13, {"text":"Rent Me !!!","fontSize":60}, createChannel(channelId, signpostTree13, channelBus))
  script15.spawn(signpostTree14, {"text":"Rent Me !!!","fontSize":60}, createChannel(channelId, signpostTree14, channelBus)) */

  const loadImageFromURl = () => {
    log("loadImageFromURl");
    //script16.spawn(imageFromURL, {"image":"https://i.imgur.com/qXcIg6yl.jpg"}, createChannel(channelId, imageFromURL, channelBus))
    //script16.spawn(imageFromURL2, {"image":"https://i.imgur.com/qXcIg6y.jpg"}, createChannel(channelId, imageFromURL2, channelBus))
    //script16.spawn(imageFromURL3, {"image":"https://i.imgur.com/qXcIg6y.jpg"}, createChannel(channelId, imageFromURL3, channelBus))
    //script16.spawn(imageFromURL4, {"image":"https://i.imgur.com/qXcIg6y.jpg"}, createChannel(channelId, imageFromURL4, channelBus))
    //script16.spawn(imageFromURL5, {"image":"https://i.imgur.com/qXcIg6y.jpg"}, createChannel(channelId, imageFromURL5, channelBus))
    /*
  script16.spawn(imageFromURL6, {"image":"https://i.imgur.com/zFRQ74Jl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL6, channelBus))
  script16.spawn(imageFromURL7, {"image":"https://i.imgur.com/naJBj50l.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL7, channelBus))
  script16.spawn(imageFromURL8, {"image":"https://i.imgur.com/bsFDIoAl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL8, channelBus))
  //Big posters in Press Center start
  script16.spawn(imageFromURL9, {"image":"https://i.imgur.com/weL37NQl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL9, channelBus))
  script16.spawn(imageFromURL10, {"image":"https://i.imgur.com/weL37NQl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL10, channelBus))
  //Big posters in Press Center end
  script16.spawn(imageFromURL11, {"image":"https://i.imgur.com/zFRQ74Jl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL11, channelBus))
  script16.spawn(imageFromURL12, {"image":"https://i.imgur.com/zFRQ74Jl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL12, channelBus))
  script16.spawn(imageFromURL13, {"image":"https://i.imgur.com/weL37NQl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL13, channelBus))
  //script16.spawn(imageFromURL14, {"image":"https://i.imgur.com/TKst3Zyl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL14, channelBus))
  script16.spawn(imageFromURL15, {"image":"https://i.imgur.com/zFRQ74Jl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL15, channelBus))
  script16.spawn(imageFromURL16, {"image":"https://i.imgur.com/naJBj50l.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL16, channelBus))
  script16.spawn(imageFromURL17, {"image":"https://i.imgur.com/bsFDIoAl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL17, channelBus))
  script16.spawn(imageFromURL18, {"image":"https://i.imgur.com/0oeghxMl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL18, channelBus))
  script16.spawn(imageFromURL19, {"image":"https://i.imgur.com/C8c3KzWl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL19, channelBus))
  script16.spawn(imageFromURL20, {"image":"https://i.imgur.com/C8c3KzWl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL20, channelBus))
  script16.spawn(imageFromURL21, {"image":"https://i.imgur.com/C8c3KzWl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL21, channelBus))
  script16.spawn(imageFromURL22, {"image":"https://i.imgur.com/3Wcq4Ohl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL22, channelBus))
  script16.spawn(imageFromURL23, {"image":"https://i.imgur.com/p4ODzrkl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL23, channelBus))
  script16.spawn(imageFromURL24, {"image":"https://i.imgur.com/lHiDHjkl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL24, channelBus))
  script16.spawn(imageFromURL25, {"image":"https://i.imgur.com/b2btyHcl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL25, channelBus))
  script16.spawn(imageFromURL26, {"image":"https://i.imgur.com/zFRQ74Jl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL26, channelBus))
  script16.spawn(imageFromURL27, {"image":"https://i.imgur.com/CAXVggvl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL27, channelBus))
  script16.spawn(imageFromURL28, {"image":"https://i.imgur.com/xfhiLfQl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL28, channelBus))
  script16.spawn(imageFromURL29, {"image":"https://i.imgur.com/xfhiLfQl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL29, channelBus))
  script16.spawn(imageFromURL30, {"image":"https://i.imgur.com/CAXVggvl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL30, channelBus))
  script16.spawn(imageFromURL31, {"image":"https://i.imgur.com/zFRQ74Jl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL31, channelBus))
  script16.spawn(imageFromURL32, {"image":"https://i.imgur.com/p4ODzrkl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL32, channelBus))
  script16.spawn(imageFromURL33, {"image":"https://i.imgur.com/lHiDHjkl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL33, channelBus))
  script16.spawn(imageFromURL34, {"image":"https://i.imgur.com/b2btyHcl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL34, channelBus))
  script16.spawn(imageFromURL35, {"image":"https://i.imgur.com/3Wcq4Ohl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL35, channelBus))
  script16.spawn(imageFromURL36, {"image":"https://i.imgur.com/0oeghxMl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL36, channelBus))
  script16.spawn(imageFromURL37, {"image":"https://i.imgur.com/WGuUPUMl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL37, channelBus))
  script16.spawn(imageFromURL38, {"image":"https://i.imgur.com/gshHsJNl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL38, channelBus))
  script16.spawn(imageFromURL39, {"image":"https://i.imgur.com/O2Ebi2ll.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL39, channelBus))
  script16.spawn(imageFromURL40, {"image":"https://i.imgur.com/hXY1ISTl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL40, channelBus))
  script16.spawn(imageFromURL41, {"image":"https://i.imgur.com/hXY1ISTl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL41, channelBus))
  script16.spawn(imageFromURL42, {"image":"https://i.imgur.com/O2Ebi2ll.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL42, channelBus))
  script16.spawn(imageFromURL43, {"image":"https://i.imgur.com/WGuUPUMl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL43, channelBus))
  script16.spawn(imageFromURL44, {"image":"https://i.imgur.com/gshHsJNl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL44, channelBus))
  */
    // effects images start
    /*
  script16.spawn(imageFromURL45, {"image":"https://i.imgur.com/zPcVBs9l.png","clickable":false,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL45, channelBus))
  script16.spawn(imageFromURL46, {"image":"https://i.imgur.com/MHwugzDl.png","clickable":false,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL46, channelBus))
  script16.spawn(imageFromURL47, {"image":"https://i.imgur.com/LTceFUQl.png","clickable":false,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL47, channelBus))
  script16.spawn(imageFromURL48, {"image":"https://i.imgur.com/rPH9OQrl.png","clickable":false,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL48, channelBus))
  script16.spawn(imageFromURL49, {"image":"https://i.imgur.com/zb5kbxnl.png","clickable":false,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL49, channelBus))
  script16.spawn(imageFromURL50, {"image":"https://i.imgur.com/5ZwN7lCl.png","clickable":false,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL50, channelBus))
  */
    // effects images end

    // Fashion week poster start
    //script16.spawn(imageFromURL51, {"image":"https://i.imgur.com/zFRQ74Jl.png","clickable":true,"externalLink":CONFIG.URL_METADOGE_NFT_2D,"hoverText":metadoge2dHoverText},createChannel(channelId, imageFromURL51, channelBus))
    // Fashion week poster end
  };
  handleDelayLoad(
    CONFIG.DELAY_LOAD_IMAGE_FROM_URLS,
    "loadImageFromURl",
    loadImageFromURl
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
  const LEADER_BOARD_SUPER_DOGIO_TITLE = undefined; //"Super Dogerio"

  LEADERBOARD_REGISTRY.hourly = makeLeaderboard(
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
  );

  LEADERBOARD_REGISTRY.daily = makeLeaderboard(
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
  );

  LEADERBOARD_REGISTRY.weekly = makeLeaderboard(
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
  );

  LEADERBOARD_REGISTRY.hourlyVoxSkate = makeLeaderboard(
    leaderboardVoxBigHourly,
    script18.model,
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
    script18.model,
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
    script18.model,
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

  //const curentPlayer = {DisplayName:"You",Position:-1,StatValue:-1}
  //LEADERBOARD_REGISTRY.daily.setCurrentPlayer(curentPlayer)
  //LEADERBOARD_REGISTRY.weekly.setCurrentPlayer(curentPlayer)
  const leaderBoardArr = [
    LEADERBOARD_REGISTRY.daily,
    LEADERBOARD_REGISTRY.weekly,
    LEADERBOARD_REGISTRY.hourly,
    LEADERBOARD_REGISTRY.dailyVoxSkate,
    LEADERBOARD_REGISTRY.weeklyVoxSkate,
    LEADERBOARD_REGISTRY.hourlyVoxSkate,
  ];
  for (const p in leaderBoardArr) {
    const board = leaderBoardArr[p];

    board.setPlayerEntries(playerArr);
    board.updateUI();
  }

  const loadSkyMaze = () => {
    if (enableSkyMazeInEngine) {
      script10.spawn(
        XwaypointSkyMax1CE25,
        {
          active: true,
          target: "text",
          targetAltName: "skyMaze1",
          hoverText: "Sky Maze Entrance 1",
        },
        createChannel(channelId, XwaypointSkyMax1CE25, channelBus)
      );
      script10.spawn(
        XwaypointSkyMax2CE25,
        {
          active: true,
          target: "text",
          targetAltName: "skyMaze2",
          hoverText: "Sky Maze Entrance 1",
        },
        createChannel(channelId, XwaypointSkyMax2CE25, channelBus)
      );
      script3.spawn(
        XfloorPianoCC25,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          multiplayer: skyMazeMultiplayer,
          active: true,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC25, channelBus)
      );
      //script18.spawn(invisibleWall, {"enabled":true}, createChannel(channelId, invisibleWall, channelBus))
      //script5.spawn(poapBooth2, {"enableClickable":true,"clickButton":"POINTER","enabled":true,"multiplayer":skyMazeMultiplayer,"visible":true,"enabledClickSound":skyMazeEnabledClickSound,"hoverTextEnabled":"Get Attendance Token","hoverTextDisabled":"Press Disabled"}, createChannel(channelId, poapBooth2, channelBus))
      //script5.spawn(poapBooth2, {"enableClickable":true,"clickButton":"POINTER","enabled":true,"multiplayer":skyMazeMultiplayer,"visible":true,"enabledClickSound":skyMazeEnabledClickSound,"hoverTextEnabled":"Get Your Badge of Bravery Token"+"\n\n"+CONTEST_SKY_MAZE_MSG2,"hoverTextDisabled":"Press Disabled","serviceUrl":"https://us-central1-sandbox-poap.cloudfunctions.net/app/","eventName":"13038"}, createChannel(channelId, poapBooth, channelBus))

      //script15.spawn(XsignpostTreeSkyMaze, {"text":"Own a Doge Head Helmet?\nSupporter of can take peek at the maze","fontSize":20,"clickable":true,"onClickFn":skyMazePeek,"hoverText":"Take a Peek. Show Entire Maze"}, createChannel(channelId, XsignpostTreeSkyMaze, channelBus))

      script3.spawn(
        XfloorPianoCC26,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC26, channelBus)
      );
      script3.spawn(
        XfloorPianoCC27,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 4,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC27, channelBus)
      );
      script3.spawn(
        XfloorPianoCC28,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC28, channelBus)
      );
      script3.spawn(
        XfloorPianoCC34,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC34, channelBus)
      );
      script3.spawn(
        XfloorPianoCC29,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC29, channelBus)
      );
      script3.spawn(
        XfloorPianoCC31,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC31, channelBus)
      );
      script3.spawn(
        XfloorPianoCC30,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC30, channelBus)
      );
      script3.spawn(
        XfloorPianoCC32,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC32, channelBus)
      );
      script3.spawn(
        XfloorPianoCC33,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC33, channelBus)
      );
      script3.spawn(
        XfloorPianoCC35,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC35, channelBus)
      );
      script3.spawn(
        XfloorPianoCC36,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC36, channelBus)
      );
      script3.spawn(
        XfloorPianoCC37,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC37, channelBus)
      );
      script3.spawn(
        XfloorPianoCC38,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC38, channelBus)
      );
      script3.spawn(
        XfloorPianoCC39,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC39, channelBus)
      );
      script3.spawn(
        XfloorPianoCC40,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC40, channelBus)
      );
      script3.spawn(
        XfloorPianoCC41,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC41, channelBus)
      );
      script3.spawn(
        XfloorPianoCC42,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC42, channelBus)
      );
      script3.spawn(
        XfloorPianoCC43,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC43, channelBus)
      );
      script3.spawn(
        XfloorPianoCC44,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC44, channelBus)
      );
      script3.spawn(
        XfloorPianoCC45,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC45, channelBus)
      );
      script3.spawn(
        XfloorPianoCC47,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC47, channelBus)
      );
      script3.spawn(
        XfloorPianoCC48,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          active: true,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC48, channelBus)
      );
      script3.spawn(
        XfloorPianoCC49,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC49, channelBus)
      );
      script3.spawn(
        XfloorPianoCC50,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC50, channelBus)
      );
      script3.spawn(
        XfloorPianoCC52,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC52, channelBus)
      );
      script3.spawn(
        XfloorPianoCC53,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC53, channelBus)
      );
      script3.spawn(
        XfloorPianoCC54,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC54, channelBus)
      );
      script3.spawn(
        XfloorPianoCC55,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC55, channelBus)
      );
      script3.spawn(
        XfloorPianoCC56,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 4,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC56, channelBus)
      );
      script3.spawn(
        XfloorPianoCC57,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC57, channelBus)
      );
      script3.spawn(
        XfloorPianoCC58,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC58, channelBus)
      );
      script3.spawn(
        XfloorPianoCC46,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC46, channelBus)
      );
      script3.spawn(
        XfloorPianoCC59,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC59, channelBus)
      );
      script3.spawn(
        XfloorPianoCC51,
        {
          enableClickable: ENABLE_CLICKABLE_PIANO_KEYS,
          active: true,
          multiplayer: skyMazeMultiplayer,
          enabledClickSound: skyMazeEnabledClickSound,
          debugTriggers: false,
          triggerSize: "thick",
          disappearDelay: skyMazeDisappearDelay,
          scaleKeysToFitInHostBoundary: true,
          keysWithCollisions: true,
          numberOfOctaves: 2,
          numberOfKeys: 15,
          visibleCasing: skyBridgeCasingVisible,
          visibleNaturalKeys: true,
          visibleFlatSharpKeys: false,
          naturalToneKeyColor: "transparent",
          naturalToneKeyEmissiveIntensity: 10,
          naturalToneKeyLength: 5,
          naturalToneKeyYOffset: 0,
          flatSharpKeyColor: "Black",
          flatSharpKeyLength: 2,
        },
        createChannel(channelId, XfloorPianoCC51, channelBus)
      );
    }
  };

  //loadSkyMaze()

  let videoControlBar: AudioControlBar;
  let videoButton: Button;
  const loadAudioAndVideoBars = () => {
    log("loadAudioAndVideoBars");

    // For AudioStreams
    const backgroundSource: AudioSource = new AudioSource(
      new AudioClip("sounds/the-jaunt-fascinating-earthbound.mp3")
    );
    const audioControlBar = new AudioControlBar(backgroundSource, 10); // start at 100% because sound is positional
    //engine.addEntity(audioControlBar)
    audioControlBar.setOffset(0); //want top

    const regularPlay =
      "https://player.vimeo.com/external/700721034.m3u8?s=89cf4bdb786c9b61ec45e698fc95626d023a23f3";
    //"https://player.vimeo.com/external/691600656.m3u8?s=c947ea55bb629c7585341e3c9c749fc0fa2afc1b"//mario

    const eventPlay =
      "https://player.vimeo.com/external/733906526.m3u8?s=38856d3e7ab7add22326275dc78c80b6630e168f";

    //THIS IS THE REAL START END TIME
    const eventStart = new Date(Date.parse("2022-07-26T12:00:00+00:00"));
    const eventEnd = new Date(Date.parse("2022-08-15T12:00:00+00:00"));
    //UNCOMMENT ME (comment out above) TO TEST SHOW STARTING IN 10 SECONDS ENDING AFTER 40 SECONDS
    //const eventStart = new Date(Date.now() + 10*1000)//new Date(Date.parse("2022-05-01T12:00:00+00:00"))
    //const eventEnd = new Date(Date.now() + 50*1000)//new Date(Date.parse("2022-05-02T12:00:00+00:00"))

    const videoToPlay = regularPlay; //regularPlay

    videoButton = script17.spawn(
      videoStream1,
      {
        startOn: false,
        onClickText: "Play/Pause video",
        volume: 0,
        onClick: [
          { entityName: "videoStream1", actionId: "toggle", values: {} },
        ],
        customStation: videoToPlay,
      },
      createChannel(channelId, videoStream1, channelBus)
    );

    const videoScreenKey = videoStream1.name + "-screen";
    const videoSource = script17.video[videoScreenKey];

    videoControlBar: AudioControlBar;
    log("trying to add videoConrolBar " + videoSource, script17.video);
    if (videoSource !== null && videoSource !== undefined) {
      log("adding videoConrolBar " + videoSource);
      videoControlBar = new AudioControlBar(videoSource, 20); // start at 100% because sound is positional
      //engine.addEntity(videoControlBar)
      videoControlBar.setOffset(30); //want second if exists

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
            if (script17.video[videoScreenKey]) {
              script17.video[videoScreenKey].playing = false;
            }
            //revert back
            script17.video[videoScreenKey] = new VideoTexture(
              new VideoClip(regularPlay)
            );
            script17.materials[videoScreenKey].albedoTexture =
              script17.video[videoScreenKey];
            script17.materials[videoScreenKey].specularIntensity = 0;
            script17.materials[videoScreenKey].roughness = 1;
            script17.materials[videoScreenKey].metallic = 0;
            script17.materials[videoScreenKey].emissiveTexture =
              script17.video[videoScreenKey];
            script17.video[videoScreenKey].playing = true;
            script17.video[videoScreenKey].loop = true;

            videoControlBar.updateSource(script17.video[videoScreenKey]);
            videoControlBar.setVolume(20);
          }
        } else if (eventEnd.getTime() > now && eventStart.getTime() < now) {
          if (this.started) {
            log("event already started!!!"); //,eventStart,eventEnd)
            return;
          }
          log("event started!!!", eventStart, eventEnd);
          this.started = true;

          if (script17.video[videoScreenKey]) {
            script17.video[videoScreenKey].playing = false;
          }

          script17.video[videoScreenKey] = new VideoTexture(
            new VideoClip(eventPlay)
          );
          script17.materials[videoScreenKey].albedoTexture =
            script17.video[videoScreenKey];
          script17.materials[videoScreenKey].specularIntensity = 0;
          script17.materials[videoScreenKey].roughness = 1;
          script17.materials[videoScreenKey].metallic = 0;
          script17.materials[videoScreenKey].emissiveTexture =
            script17.video[videoScreenKey];
          script17.video[videoScreenKey].playing = true;
          script17.video[videoScreenKey].loop = true;

          videoControlBar.updateSource(script17.video[videoScreenKey]);
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
  //script3.spawn(xfloorPianoCC25, {"enableClickable":ENABLE_CLICKABLE_PIANO_KEYS,"triggerSize":'thick',"clickButton":"POINTER","enabled":true,"enabledClickSound":true,"visible":true,"debugTriggers":false,"scaleKeysToFitInHostBoundary":true,"keysWithCollisions":true,"numberOfOctaves":2,"numberOfKeys":30,"visibleCasing":false,"visibleNaturalKeys":true,"visibleFlatSharpKeys":false,"naturalToneKeyColor":"transparent","naturalToneKeyEmissiveIntensity":10,"naturalToneKeyLength":4,"naturalToneKeyYOffset":0,"flatSharpKeyColor":"Black","flatSharpKeyLength":2,"hoverTextEnabled":"Press","hoverTextDisabled":"Press Disabled"}, createChannel(channelId, xfloorPianoCC25, channelBus))
  //script3.spawn(xfloorPianoCC26, {"enableClickable":ENABLE_CLICKABLE_PIANO_KEYS,"triggerSize":'thick',"clickButton":"POINTER","enabled":true,"enabledClickSound":true,"visible":true,"debugTriggers":false,"scaleKeysToFitInHostBoundary":true,"keysWithCollisions":true,"numberOfOctaves":2,"numberOfKeys":10,"visibleCasing":false,"visibleNaturalKeys":true,"visibleFlatSharpKeys":false,"naturalToneKeyColor":"transparent","naturalToneKeyEmissiveIntensity":10,"naturalToneKeyLength":6,"naturalToneKeyYOffset":0,"flatSharpKeyColor":"Black","flatSharpKeyLength":2,"hoverTextEnabled":"Press","hoverTextDisabled":"Press Disabled"}, createChannel(channelId, xfloorPianoCC26, channelBus))

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
          avatarSwapScript.setAvatarSwapTriggerEnabled(
            avatarSwap,
            GAME_STATE.avatarSwapEnabled
          );
        } else {
          log("PLAYER_AVATAR_SWAP_ENABLED disable swap");
          GAME_STATE.setAvatarSwapEnabled(false);
          avatarSwapScript.setAvatarSwapTriggerEnabled(
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
        avatarSwapScript.setAvatarSwapTriggerEnabled(avatarSwap, newVal);
        break;

      case "metaDogeSwapEnabled":
        avatarSwapScript.setAvatarSwapTriggerEnabled(avatarSwap, newVal);
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
  const rootEntities: Entity[] = [_scene,npcs_parent, _scene2]; //versadexbox,

  const mainSubScene = new SubScene(0, "mainScene", [
    new SceneEntity("mainScene", rootEntities),
  ]);
  REGISTRY.entities.rootScene = _scene
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

  function moveToAltScene(){
    if (
      gameSceneManager.activeScene !== gameSceneManager.alternativeScene.sceneName
    ) { 
      gameSceneManager.moveTo(gameSceneManager.alternativeScene.sceneName, REGISTRY.movePlayerTo.ALT_SCENE.position,REGISTRY.movePlayerTo.ALT_SCENE.cameraDir );
    } else {
      //gameSceneManager.moveTo(gameSceneManager.alternativeScene.sceneName, new Vector3( 15,2,63 ) );
      log("already in ")
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
  
  const warpToAltSceneEnt = new Entity("127");
  warpToAltSceneEnt.setParent(_scene)
  warpToAltSceneEnt.addComponent(new BoxShape());
  warpToAltSceneEnt.addComponent(CommonResources.RESOURCES.materials.transparent)
  warpToAltSceneEnt.addComponent(new Transform({ 
    position: new Vector3(16+32.2,24-.3, 48+20.5), //
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
  engine.addEntity(warpToAltSceneEnt);

  function clickVideo() {
    //videoButton.toggle(videoStream1,true)
    //videoButton.video.values.playing = true
    //videoButton.toggle(videoButton.video,true)
    if(videoButton){
      videoButton.clickVideo();
    }else{
      log("warn clickVideo videoButton is null",videoButton)
    }
    
  }

  mainScene = new Scene("mainScene", mainSubScene);
  mainScene.addOnHideListener((entityWrap: BaseEntityWrapper) => {
    log("test hide");
    clickVideo();
    if(videoControlBar) videoControlBar.mute();
  });
  mainScene.addOnShowListener((entityWrap: BaseEntityWrapper) => {
    if (videoButton) {
      clickVideo();
      videoControlBar.setVolume(20);
    }
    log("test show");
  });

  handleDelayLoad(CONFIG.DELAY_LOAD_NFT_FRAMES, "loadNftFrames", ()=>{ log("loadNftFrames was commented out") });
  //handleDelayLoad(CONFIG.DELAY_LOAD_NFT_FRAMES, "loadNftFrames", loadNftFrames); //removed as of july21 2022
}
//end loadPrimaryScene load main scene//end loadPrimaryScene load main scene
//end loadPrimaryScene load main scene//end loadPrimaryScene load main scene

function loadAltScene() {
  initAltScene()
  const altSubScene = new SubScene(0, "rootalternativeScene", [
    new SceneEntity("rootalternativeScene", REGISTRY.entities.alternativeScene), 
  ]);
  alternativeScene = new Scene("alternativeScene", altSubScene);
}
function initGameSceneMgr() {
  gameSceneManager = new GameSceneManager(mainScene, alternativeScene);
  gameSceneManager.start();
  REGISTRY.sceneMgr = gameSceneManager;
}

const directlyBelowPlayerRayCastID = 2;
class RaycastSystem implements ISystem {
  counter: number = 0;
  intervalSeconds = 0.2;
  physicsCast = PhysicsCast.instance;
  cameraInst = Camera.instance;

  padInit: boolean = false;

  update(dt: number) {
    this.counter += dt;
    //check every .11 or more seconds
    if (this.counter >= this.intervalSeconds) {
      this.counter = 0; // reset counter

      const belowPlayer = this.cameraInst.position
        .clone()
        .addInPlace(new Vector3(0, -4, 0));
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

      this.physicsCast.hitFirst(
        rayFromCamera,
        (e) => {
          // Do stuff
          //log("rayFromPlayerButt HIT hitFirst ",e.didHit,e.entity.meshName,e.entity.entityId)
          if (this.padInit && e.didHit && e.entity.meshName == "Pad_collider") {
            REGISTRY.entities.pad.moveAnimState.play();
          } else {
            REGISTRY.entities.pad.moveAnimState.pause();
          }
        },
        //sdk bug cause this.queries[response.payload.queryId] is not a function but not my issue  and goes away after load
        directlyBelowPlayerRayCastID
      );
    }
  }
}
function initRaycastSystem() {
  engine.addSystem(new RaycastSystem());
}
async function start() {
  await initConfig();
  initRegistry();
  initGameState();
  loadPrimaryScene();
  initGamiMallScene();
  loadAltScene();
  initGameSceneMgr();
  initResourceDropIns();
  initWearableStore();
  initUIGameHud();
  initUIStartGame();
  initUIEndGame();
  initUIStartGame();
  initUILoginGame();

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
