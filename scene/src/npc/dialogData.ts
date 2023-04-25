import { movePlayerTo } from "@decentraland/RestrictedActions";
import * as utils from "@dcl/ecs-scene-utils";
import { getEntityByName, getEntityByRegex } from "../utils";
import { Dialog } from '@dcl/npc-scene-utils'
//import { alice, bob, doge } from './npcBuilder'
import { NPC_INSTANCES } from "./npcConstants";

export const NPC_DEFAULT_DIALOG: { [key: string]: string } = {};
NPC_DEFAULT_DIALOG["alice"] = "";

function movePlayerToEntity(target: string, lookTarget: string) {
  log("movePlayerToEntity " + target + " lookat " + lookTarget);
  const entity = getEntityByName(target);
  const entityLook = getEntityByName(lookTarget);

  let lookAt = null;
  if (entityLook !== null && entityLook !== undefined) {
    //move up from the arrow a little as want to look at face, not feet
    lookAt = utils
      .getEntityWorldPosition(entityLook)
      .addInPlace(new Vector3(0, 1.6, 0));
  } else {
    log("movePlayerToEntity could not find entityLook " + entityLook);
  }
  if (entity !== null && entity !== undefined) {
    const fudgeForArrowTooLow = new Vector3(0, 0.5, 0); //arrow may be slightly too low (inside floor), adjust a small amount to accomadate
    const moveToPos = utils
      .getEntityWorldPosition(entity)
      .addInPlace(fudgeForArrowTooLow);
    log("movePlayerToEntity moving to " + moveToPos + " looking at " + lookAt);
    if (lookAt) {
      movePlayerTo(moveToPos); //,lookAt );// not passing this.  when tried the payer looked down when should be looking up.  idk? ,lookAt )
    } else {
      movePlayerTo(moveToPos);
    }
  } else {
    log("movePlayerToEntity could not find entity " + target);
  }
}

export const AliceDialog: Dialog[] = [
  {
    //0
    text: "Hello.  I am your personal teleporter and guide to Meta GamiMall.",
    skipable: false,
  },
  {
    text: "Hey, Welcome to MetaGamiMall!!! ",
    skipable: false,
    triggeredByNext: () => {
      NPC_DEFAULT_DIALOG["alice"] = "how-may-i-help";
    },
  },
  {
    name: "how-may-i-help",
    text: "How may I help? ",
    isQuestion: true,
    buttons: [
      { label: "Teleport", goToDialog: "i-want-to-teleport" },
      { label: "Mall Info", goToDialog: "tell-me-about-mall" },
      { label: "MetaDoge", goToDialog: "tell-me-about-mdp" },
      { label: "Nothing", goToDialog: "dismiss-dialog" },
    ],
  },
  {
    name: "dismiss-dialog",
    text: "Okay, I'll be around if you get curious!",
    isEndOfDialog: true,
    triggeredByNext: () => {
      NPC_INSTANCES["alice"].playAnimation("Goodbye", true, 2);
    },
  },
  {
    name: "dismiss-teleport",
    text: "Okay, I'll be around if you want to go anywhere!",
    isEndOfDialog: true,
    triggeredByNext: () => {
      NPC_INSTANCES["alice"].playAnimation("Goodbye", true, 2);
    },
  },
  {
    text:
      "MetaDoge is a metaverse NFT collection with only 4,999 supplies.MetaDoge has a 2D version and a 3D version " +
      "MetaDoge 3D holders can enjoy coin bonus in Meta GamiMall and they can swap to their unqiue avatar here !",
    skipable: true,
    //+ " This is an NFT collection has various use cases, truly scarcity and a wonderful story with a engaging development plan."
  },
  {
    text:
      "MetaDoge 2D holders can see their Metadoge2D as the face of me, more untitlies will come next.",
    skipable: true,
    //+ " This is an NFT collection has various use cases, truly scarcity and a wonderful story with a engaging development plan."
  },
  {
    text: "Well that's it from me. So what are you waiting for? Go and explore the world!",
    triggeredByNext: () => {
      NPC_INSTANCES["alice"].playAnimation("Goodbye", true, 2);
    },
    isEndOfDialog: true,
  },
  {
    name: "tell-me-about-Mall",
    text:
      "Meta GamiMall is a metaverse shopping mall for shopping, games, meta-activities.  " +
      "With an increasing number of user, events and buildings, we believe in the future of Decentraland, and we want to push it forward through our expertise.",
    skipable: false,
    triggeredByNext: () => {
      NPC_INSTANCES["alice"].playAnimation("Goodbye", true, 2);
    },
    isEndOfDialog: true,
  },
  {
    name: "i-want-to-teleport",
    text: "Let me know where do you want to go, I will teleport you there in less than a second! (Page 1)",
    triggeredByNext: () => {
      NPC_INSTANCES["alice"].playAnimation("Goodbye", true, 2);
    },
    isQuestion: true,
    buttons: [
      { label: "MuscleSquare", goToDialog: "teleport-muscle" }, //, fontSize: 8 },//, offsetY: -17.5, },//second button first?
      { label: "Entrance", goToDialog: "teleport-lild" }, // offsetY: -17.5, },//first button second?
      { label: "MoonSquare", goToDialog: "teleport-moon" },
      { label: "More on Page 2", goToDialog: "i-want-to-teleport-pg2" },
    ],
  },

  {
    name: "i-want-to-teleport-pg2",
    text: "Let me know where do you want to go, I will teleport you there in less than a second! (Page 2)",
    triggeredByNext: () => {
      NPC_INSTANCES["alice"].playAnimation("Goodbye", true, 2);
    },
    isQuestion: true,
    buttons: [
      { label: "HeavenSquare", goToDialog: "teleport-heaven" }, //,, fontSize: 8, },//second button first?
      { label: "MarsSquare", goToDialog: "teleport-mars" }, //,, fontSize: 10,},//first button second?
      { label: "Page 1", goToDialog: "i-want-to-teleport" },
      { label: "Cancel", goToDialog: "dismiss-teleport" },
    ],
  },
  {
    name: "teleport-lild",
    text: "You have selected entrance",
    triggeredByNext: () => {
      log("GO TO LilDoge");
      movePlayerToEntity("waypointCE5", "npcPlaceHolder6");
    },
    isEndOfDialog: true,
  },
  {
    name: "teleport-moon",
    text: "You have selected Moon Square",
    triggeredByNext: () => {
      log("GO TO Moon");
      movePlayerToEntity("waypointCE", "npcPlaceHolder");
    },
    isEndOfDialog: true,
  },
  {
    name: "teleport-mars",
    text: "You have selected Mars Square",
    triggeredByNext: () => {
      log("GO TO Mars");
      movePlayerToEntity("waypointCE3", "npcPlaceHolder4");
    },
    isEndOfDialog: true,
  },
  {
    name: "teleport-heaven",
    text: "You have selected Heaven Square",
    triggeredByNext: () => {
      log("GO TO Heaven");
      movePlayerToEntity("waypointCE4", "npcPlaceHolder3");
    },
    isEndOfDialog: true,
  },
  {
    name: "teleport-muscle",
    text: "You have selected Muscle Square",
    triggeredByNext: () => {
      log("GO TO Muscle");
      movePlayerToEntity("waypointCE2", "npcPlaceHolder5");
    },
    isEndOfDialog: true,
  },
  {
    name: "dismiss",
    text: "You want to explore by yourself?  I understand.  You can summon me again by clicking the top left button",
    triggeredByNext: () => {},
    isEndOfDialog: true,
  },
];

export const BobDialog: Dialog[] = [
  {
    text: "G'day human! My name is Bob and I'm a robot. Would you like to learn more about the history of Decentraland and how it all started?",
    isQuestion: true,
    offsetY: 20,
    buttons: [
      { label: "YES", goToDialog: 2 },
      { label: "NO", goToDialog: "no" },
    ],
  },
  {
    text: "Okay, I'll be around if you get curious.",
    name: "no",
    triggeredByNext: () => {
      NPC_INSTANCES["bob"].playAnimation("Goodbye", true, 2);
    },
    isEndOfDialog: true,
  },
  {
    text: "Decentraland's unique proposal is to create a virtual world governed by its users.",
  },
  {
    text: "This little museum takes you through some of the milestones in Decentraland's history.",
  },
  {
    text: "Some key events in the history of the project were: the Terraform Event, which had the first LAND sale.",
  },
  {
    text: "The second auction in late 2018; the creation of Avatars and Wearables in 2019; the release of the open source client and the DAO in 2020.",
  },
  {
    text: "So much has happened already, and we're just getting started...",
  },
  {
    text: "Take a look around. If you're interested in any of the items, click on them and I'll tell you the background story.",
    triggeredByNext: () => {
      NPC_INSTANCES["bob"].playAnimation("Goodbye", true, 2);
    },
    isEndOfDialog: true,
  },
];

/*
export let DogeTalk: Dialog[] = [
  {
    text: 'Did you see my brother Lil Doge? When he grows up he will look just like me.',
    triggeredByNext: () => {
      NPC_INSTANCES['doge'].followPath()
    },
    timeOn: 4.1,
    isEndOfDialog: true,
  },
  {
    text: 'Did you know all the RED STRUCTURES are available for rent,?  DM via Discord if you are interested.',
    triggeredByNext: () => {
      NPC_INSTANCES['doge'].followPath()
    },
    timeOn: 4.1,
    isEndOfDialog: true,
  },
  {
    text: 'Meta GamiMall is a fancy, walking-friendly and vivid place.  I love it here!',
    triggeredByNext: () => {
      NPC_INSTANCES['doge'].followPath()
    },
    timeOn: 4.1,
    isEndOfDialog: true,
  },
]
*/

export const muscledogeShowMuscleDialog: Dialog[] = [
  {
    text: "Hi, Welcome to Muscle Square!!!",
    skipable: true,
  },
  {
    text: "Lil Doge has grown up to Muscle Doge. It is the FUN & LOVE belief that made us strong. We came here to shill the entire world!",
    //triggeredByNext: () => {
    //bob.playAnimation('Goodbye', true, 2)
    //},
    isEndOfDialog: true,
  },
];

export const marsDogHeadshakeDialog: Dialog[] = [
  {
    text: "Hi, Welcome to Mars Square!!! ",
    skipable: true,
  },
  {
    text: "We conquer Mars! Omg, Mars is so hot! The environment of Mars makes our bodies grow blisters! What?! Who said we look like demons?",
    //triggeredByNext: () => {
    //bob.playAnimation('Goodbye', true, 2)
    //},
    isEndOfDialog: true,
  },
];

export const dogeGodFlyingDialog: Dialog[] = [
  {
    text: "Hi, Welcome to Heaven Square!!!",
    skipable: true,
  },
  {
    text: "MetaDoge become Doge God! Back to the original starting point, but our bodies and eyes are shining colourfully, and we become eternity!",
    //triggeredByNext: () => {
    //bob.playAnimation('Goodbye', true, 2)
    //},
    isEndOfDialog: true,
  },
];

export const moondogeMoonwalkDialog: Dialog[] = [
  {
    text: "Hi, Welcome to Moon Square!!! ",
    skipable: true,
  },
  {
    text: "We went to the Moon! And we breed MetaDoge culture over there. Our bodies changed due to the moon environment! We can see the world clearer with the evolved eyes!",
    //triggeredByNext: () => {
    //bob.playAnimation('Goodbye', true, 2)
    //},
    isEndOfDialog: true,
  },
];

export const lilDogeDialog: Dialog[] = [
  {
    text: "Hi, Welcome to the MetaMine!!! I am your host, MetaDoge.\nIf you are looking for Mr.SWE DJ show, please turn left, walk to the teleporter, click it, you will be there in a few seconds",
    skipable: false,
  },
  {
    text: "MetaMine is a gamified event joined by 23 brands, they are sepreated into 3 tiers, Premium, Gold and Silver", 
    skipable: false,
  },  
  {
    text: " ande ALL of them have provided exclusive wearables for you to claim. There a cyber suit wearable that is made of 4 different wearables, offered by Decentraland, Decentral Game, Hahskey Dx and Galxe", 
    skipable: false,
  },  
  {
    text: "In order to claim, you need to check how many coins needed by clikcing the wearables that you want to claim and check the price",
    skipable: false,
  },
  {
    text: "For example, you can try with the doge head wearable beside me, you can close it by clicking the black cross sign in the right top corner",
    skipable: false,
  },
  {
    text: "Next, you need to collect coins that you can find in the scene by touching them",
    skipable: false,
  },
  {
    text: "finally, you need to come back to the wearable, click the wearable, and then click claim, after a few seconds, the wearable will come to your wallet address and you can see in your bagpack!!!",
    skipable: false,
  },
  {
  text: "Lastly, feel free to check this amazing Doge head wearable, it can let you collect coins 3% faster in MetaMine (In the future). Be quick, it will run out soon!!!",
  isEndOfDialog: true,
  },
];

export const lilDogeDialog2: Dialog[] = [
  {
    text: "Hi, Welcome to the Sky Maze!!! ",
    skipable: true,
  },
  {
    text: "I hope you are not afraid of heights.  Make it to the end and recieve a POAP proving your bravery",
  },
  {
    text: "Own a Doge Head Helmet?  Supporter of can take peek at the maze\nThird person view strongly recommended. Press (V) to switch\n",
    //triggeredByNext: () => {
    //bob.playAnimation('Goodbye', true, 2)
    //},
    isEndOfDialog: true,
  },
];
