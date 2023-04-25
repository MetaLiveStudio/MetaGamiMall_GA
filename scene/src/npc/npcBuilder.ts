import resources from "../npc/resources";
//import { tutorialEnableObservable } from './tutorialHandler'
import { NPC, NPCDelay, FollowPathData } from '@dcl/npc-scene-utils'
import { getEntityByName, getEntityByRegex } from "../utils";
import * as utils from "@dcl/ecs-scene-utils";
import { Logger } from "../logging";
import {
  NPC_DEFAULT_DIALOG,
  AliceDialog,
  lilDogeDialog,
  /*DogeTalk,*/ dogeGodFlyingDialog,
  marsDogHeadshakeDialog,
  moondogeMoonwalkDialog,
  muscledogeShowMuscleDialog,
  lilDogeDialog2,
} from "./dialogData";
import { NPC_INSTANCES } from "./npcConstants";
import { CONFIG } from "../config";
import { Pet } from "../npc/pet";

export let npcs_parent = new Entity("234");
let alice: NPC;
let bob: NPC;
//let doge: NPC
let muscledogeShowMuscle: NPC;
let marsDogHeadshake: NPC;
let dogeGodFlying: NPC;
let moondogeMoonwalk: NPC;
let lilDogeNpc: NPC;
let lilDogeNpc2: NPC;

//,{channelId:channel.id}
const logger = new Logger("npcBuilder", {});

let _scene = getEntityByName("_scene");
log("_scene " + _scene);

export function getNpcPosition(
  target: string,
  defaultPos: Vector3,
  type?: string
): Vector3 {
  log("getNpcPosition " + target);
  let pos = defaultPos;
  const entity = getEntityByName(target);
  if (entity && entity !== undefined) {
    if (type === null || type === undefined || type == "global") {
      pos = utils.getEntityWorldPosition(entity);
    } else {
      pos = entity.getComponent(Transform).position.clone();
    }
    if (pos) {
      pos.y += 0.1;
    }
    log(
      "getNpcPosition found " +
        target +
        " using " +
        pos +
        " insteadof  " +
        defaultPos
    );
  } else {
    log("getNpcPosition NOT found " + target + " using fallback " + pos);
  }
  return pos;
}

function adjustForSceneRotation(rotation: Quaternion) {
  if (_scene !== null && _scene !== undefined) {
    rotation = rotation.multiply(_scene.getComponent(Transform).rotation);
  }
  return rotation;
}
function createPath(
  entity: Entity,
  includeEntityInitialPosition: boolean,
  pathItems: Array<string>,
  lockX: boolean,
  lockY: boolean,
  lockZ: boolean
) {
  const METHOD_NAME = "createPath";
  const cpoints = new Array();
  //add current position of item

  log(
    "createPath includeEntityInitialPosition " + includeEntityInitialPosition
  );
  if (entity != null && includeEntityInitialPosition) {
    log(
      "createPath includeEntityInitialPosition " + includeEntityInitialPosition
    );
    cpoints.push(new Vector3().copyFrom(utils.getEntityWorldPosition(entity))); //why must it be second and not first?!?!?
  }

  //loop over item paths
  for (var x = 0; x < pathItems.length; x++) {
    let itmName = pathItems[x];

    if (itmName === null || itmName === undefined) {
      log("createPath: follow path " + x + " invalid item " + itmName);
      continue;
    }
    let pathEnt = getEntityByName(itmName);

    if (pathEnt && pathEnt !== undefined) {
      log(
        "createPath: follow path " +
          x +
          " adding " +
          itmName +
          " point.len " +
          cpoints.length
      );
      cpoints.push(
        new Vector3().copyFrom(utils.getEntityWorldPosition(pathEnt))
      );
    } else {
      if (logger.isWarnEnabled())
        logger.warn(
          METHOD_NAME,
          "Could not find " +
            " " +
            itmName +
            " for action " +
            itmName +
            " for index " +
            x,
          null
        );
    }
  }
  return cpoints;
}

export function addPets() {
  log("calling addPets");
  
  const _alice = alice !== undefined ? alice : NPC_INSTANCES["alice"]
  log("calling addPets", Pet,"alice",_alice);
  if(_alice !== undefined){
    new Pet(_alice);
  }else{
    log("addPets","ERROR","unable to create pet, alice is undefined null??",_alice);
  }
  
}
export function addRobots() {
  //const ringShape = resources.models.robots.rings

  //try one more time
  if (_scene === null || _scene === undefined) {
    _scene = getEntityByName("_scene");
    log("addRobots _scene " + _scene);
  }

  // Alice
  alice = new NPC(
    {
      position: new Vector3(40.5, 2, 60),
      rotation: adjustForSceneRotation(Quaternion.Euler(0, 180, 0)),
    },
    resources.models.robots.metaDogePet,
    () => {
      // animations
      
        alice.playAnimation('Hello', true, 2)

        let dummyent = new Entity()
        dummyent.addComponent(
          new NPCDelay(2, () => {
            alice.playAnimation('Talk')
          })
        )
        engine.addEntity(dummyent)
        
      // sound
      alice.addComponentOrReplace(
        new AudioSource(resources.sounds.robots.alice)
      );
      alice.getComponent(AudioSource).playOnce();

      // dialog UI
      alice.talk(AliceDialog, NPC_DEFAULT_DIALOG["alice"]);
    },
    {
      faceUser: true,
      portrait: {
        path: "images/portraits/Robotdogehead.png",
        height: 256,
        width: 256,
        section: {
          sourceHeight: 512,
          sourceWidth: 512,
        },
      },
      onWalkAway: () => {
        //alice.playAnimation('Goodbye', true, 2)
      },
      coolDownDuration: 2,
      hoverText: "Talk with personal assistant",
      onlyETrigger: true,
    }
  );
  alice.setParent(npcs_parent);
  if (alice.name === null || alice.name === undefined) {
    log("alice old name " + alice.name);
    alice.name = "npc-alice";
  }
  log("alice name " + alice.name);

  //FIXME need to add bounce up down but somehow combine that with follow
  //if we can put the hover animation into the model saves me a lot of work
  /*
  //hover is fighting with the pet summon, disabled for now
    const startingY = alice.getComponent(Transform).position.y//transform5TestxmasDroneHost.position.y
    const bounceAmount = .06
    const startVector = alice.getComponent(Transform).position.clone()
    const endVector= alice.getComponent(Transform).position.clone()
    endVector.y=startingY+bounceAmount//new Vector3(69.5, startingY+bounceAmount, 7.2)
    alice.addComponent(
      new utils.Interval(1000, () => {
        const tr = alice.getComponent(Transform)
        if(tr.position.y - startingY < .05){
          alice.addComponentOrReplace(new utils.MoveTransformComponent(startVector, endVector, 1))
        }else{
          alice.addComponentOrReplace(new utils.MoveTransformComponent(endVector, startVector, 1))
        }
      })
    )
      */
  /*
  let dogeStartPosition:Vector3 = getNpcPosition('indicatorArrow',new Vector3(41, 0.31330442428588867, 39.9229621887207))

  doge = new NPC(
    { position: dogeStartPosition, scale: new Vector3(2, 2, 2) },
    "models/robots/MDP-walking_w_collider.glb",
    () => {
      doge.stopWalking()
      //artist1.endInteraction()
      //artist2.endInteraction()
      //doge.playAnimation('Talk1', true)
      let randomNum = Math.floor(Math.random() * DogeTalk.length)
      doge.talkBubble(DogeTalk, randomNum)
    },
    {
      walkingAnim: 'Armature|maximo.com|Layer0',
      idleAnim: 'Armature|maximo.com|Layer0',
      faceUser: true,
      coolDownDuration: 2,
      hoverText: 'WOW',
      onlyETrigger: true,
      walkingSpeed: 1.9,
      continueOnWalkAway: true,
      onWalkAway: () => {
        doge.followPath()
      },
      textBubble: true,
      //noUI: true,
      bubbleHeight: 3.5,
      noAnimator: true,
      stoppedModel: "models/robots/MuscleDoge_ShowMuscle-name_wc.glb"
    }
  )
  doge.setParent(npcs_parent)
  const dogePathLockY = true
  //,'XwaypointCE21','XwaypointCE22','XwaypointCE23','XwaypointCE24'
  const dogePathArray = createPath( doge,false, ['XwaypointCE25','XwaypointCE20'],false,dogePathLockY,false )
  log("dogePathArray " + dogePathArray)
  if(dogePathArray && dogePathArray.length > 1){
    const dogePath: FollowPathData = {
      path: dogePathArray,
      loop: true,
      // curve: true,
    }
    doge.followPath(dogePath)
  }


  let muscledogeShowMuscleStartPosition: Vector3 = new Vector3(40, 5, 24);
  muscledogeShowMuscle = new NPC(
    {
      position: getNpcPosition(
        "npcPlaceHolder5",
        muscledogeShowMuscleStartPosition
      ),
      rotation: adjustForSceneRotation(
        new Quaternion(
          -8.73301980047498e-16,
          0.8819212913513184,
          -1.0513319637084351e-7,
          0.47139668464660645
        )
      ),
      scale: new Vector3(1, 1, 1),
    },
    "models/robots/MuscleDoge_ShowMuscle-name_wc.glb",
    () => {
      //moondogeMoonwalk.stopWalking()
      let randomNum = 0; //Math.floor(Math.random() * 10)
      muscledogeShowMuscle.talkBubble(muscledogeShowMuscleDialog, randomNum);
    },
    {
      //walkingAnim: 'Armature|mixamo.com|Layer0.004',
      idleAnim: "Armature|mixamo.com|Layer0.004",
      faceUser: true,
      coolDownDuration: 2,
      hoverText: "Talk to Muscle Dodge",
      onlyETrigger: true,
      //walkingSpeed: 1.5,
      //continueOnWalkAway: true,
      //onWalkAway: () => {
      //  doge.followPath()
      //},
      textBubble: true,
      //noUI: true,
      bubbleHeight: 4.2,
    }
  );
  muscledogeShowMuscle.setParent(npcs_parent);

  let marsDogHeadshakeStartPosition: Vector3 = new Vector3(56.5, 30.5, 13.5);
  marsDogHeadshake = new NPC(
    {
      position: getNpcPosition(
        "npcPlaceHolder4",
        marsDogHeadshakeStartPosition
      ),
      rotation: adjustForSceneRotation(new Quaternion(0, 0, 0, 1)),
      scale: new Vector3(1.5, 1.5, 1.5),
    },
    "models/robots/MarsDoge_ThoughtfulHeadShake-name_wc.glb",
    () => {
      //marsDogHeadshake.stopWalking()
      let randomNum = 0; //Math.floor(Math.random() * 10)
      marsDogHeadshake.talkBubble(marsDogHeadshakeDialog, randomNum);
    },
    {
      //walkingAnim: 'Armature|mixamo.com|Layer0.001',
      idleAnim: "Armature|mixamo.com|Layer0.001",
      faceUser: true,
      coolDownDuration: 2,
      hoverText: "Talk to Mars Dodge",
      onlyETrigger: true,
      //walkingSpeed: 1.5,
      //continueOnWalkAway: true,
      //onWalkAway: () => {
      //  doge.followPath()
      //},
      textBubble: true,
      //noUI: true,
      bubbleHeight: 2.2,
    }
  );
  marsDogHeadshake.setParent(npcs_parent);

  let moondogeMoonwalkStartPosition: Vector3 = new Vector3(29.5, 23, 56);
  moondogeMoonwalk = new NPC(
    {
      position: getNpcPosition("npcPlaceHolder", moondogeMoonwalkStartPosition),
      rotation: adjustForSceneRotation(
        new Quaternion(
          6.65064594497863e-16,
          0.7071068286895752,
          -8.429368847373553e-8,
          0.7071067690849304
        )
      ),
      scale: new Vector3(1.5, 1.5, 1.5),
    },
    "models/robots/MoonDoge_Moonwalk-name_wc.glb",
    () => {
      //moondogeMoonwalk.stopWalking()
      let randomNum = 0; //Math.floor(Math.random() * 10)
      moondogeMoonwalk.talkBubble(moondogeMoonwalkDialog, randomNum);
    },
    {
      //walkingAnim: 'Armature|mixamo.com|Layer0.002',
      idleAnim: "Armature|mixamo.com|Layer0.002",
      faceUser: true,
      coolDownDuration: 2,
      hoverText: "Talk to Moon Dodge",
      onlyETrigger: true,
      //walkingSpeed: 1.5,
      //continueOnWalkAway: true,
      //onWalkAway: () => {
      //  doge.followPath()
      //},
      textBubble: true,
      //noUI: true,
      bubbleHeight: 2.6,
    }
  );
  moondogeMoonwalk.setParent(npcs_parent);

  let dogeGodFlyingStartPosition: Vector3 = new Vector3(63.5, 52.5, 57);
  dogeGodFlying = new NPC(
    {
      position: getNpcPosition("npcPlaceHolder3", dogeGodFlyingStartPosition),
      rotation: adjustForSceneRotation(
        new Quaternion(
          0.10838636755943298,
          -0.8154932260513306,
          -0.162211611866951,
          0.5448951125144958
        )
      ),
      scale: new Vector3(1.5, 1.5, 1.5),
    },
    "models/robots/DogeGod_FLying-name_wc.glb",
    () => {
      //dogeGodFlying.stopWalking()
      let randomNum = 0; //Math.floor(Math.random() * 10)
      dogeGodFlying.talkBubble(dogeGodFlyingDialog, randomNum);
    },
    {
      //walkingAnim: 'Armature|maximo.com|Layer0',
      idleAnim: "Armature|mixamo.com|Layer0", //'MDP-god-flying',
      faceUser: true,
      coolDownDuration: 2,
      hoverText: "Talk to Dodge God",
      onlyETrigger: true,
      //walkingSpeed: 1.5,
      //continueOnWalkAway: true,
      //onWalkAway: () => {
      //  doge.followPath()
      //},
      textBubble: true,
      //noUI: true,
      bubbleHeight: 2.2,
    }
  );
  dogeGodFlying.setParent(npcs_parent);
*/
  let lilDogeStartPosition: Vector3 = new Vector3(10.5, 1.0134620666503906, 59);
  lilDogeNpc = new NPC(
    {
      position: getNpcPosition("npcPlaceHolder2", lilDogeStartPosition),
      rotation: adjustForSceneRotation(Quaternion.Euler(0, 290, 0)),
      scale: new Vector3(1.5, 1.5, 1.5),
    },
    "models/robots/LilDoge_Waving-name_wc.glb",
    () => {
      //lilDogeNpc.stopWalking()
      let randomNum = 0; //Math.floor(Math.random() * 10)
      lilDogeNpc.talk(lilDogeDialog, randomNum);
    },
    {
      //walkingAnim: 'Armature|maximo.com|Layer0',
      idleAnim: "Armature|mixamo.com|Layer0.006", //'MDP-lil-waving',
      faceUser: true,
      coolDownDuration: 2,
      hoverText: "Talk to Lil Doge",
      onlyETrigger: true,
      //walkingSpeed: 1.5,
      //continueOnWalkAway: true,
      //onWalkAway: () => {
      //  doge.followPath()
      //},
      //textBubble: true,
      //noUI: true,
      bubbleHeight: 2.2,
    }
  );
  lilDogeNpc.setParent(npcs_parent);

  if (CONFIG.enableSkyMazeInEngine) {
    //this lil doge was for the sky maze. reuse for game play?
    let lilDogeStartPosition2: Vector3 = new Vector3(82, 1, 36.5);
    lilDogeNpc2 = new NPC(
      {
        position: getNpcPosition("XnpcPlaceHolder2", lilDogeStartPosition2),
        rotation: adjustForSceneRotation(Quaternion.Euler(0, -45, 0)),
        scale: new Vector3(1, 1, 1),
      },
      "models/robots/LilDoge_Waving-name_wc.glb",
      () => {
        //lilDogeNpc.stopWalking()
        let randomNum = 0; //Math.floor(Math.random() * 10)
        lilDogeNpc2.talkBubble(lilDogeDialog2, randomNum);
      },
      {
        //walkingAnim: 'Armature|maximo.com|Layer0',
        idleAnim: "Armature|mixamo.com|Layer0.006", //'MDP-lil-waving',
        faceUser: true,
        coolDownDuration: 2,
        hoverText: "Talk to Lil Doge",
        onlyETrigger: true,
        //walkingSpeed: 1.5,
        //continueOnWalkAway: true,
        //onWalkAway: () => {
        //  doge.followPath()
        //},
        textBubble: true,
        //noUI: true,
        bubbleHeight: 2.2,
      }
    );
    lilDogeNpc2.setParent(npcs_parent);
  }

  NPC_INSTANCES["alice"] = alice;
  NPC_INSTANCES["bob"] = bob;
  //NPC_INSTANCES['doge'] = doge
  NPC_INSTANCES["muscledogeShowMuscle"] = muscledogeShowMuscle;
  NPC_INSTANCES["marsDogHeadshake"] = marsDogHeadshake;
  NPC_INSTANCES["dogeGodFlying"] = dogeGodFlying;
  NPC_INSTANCES["moondogeMoonwalk"] = moondogeMoonwalk;
  NPC_INSTANCES["lilDogeNpc"] = lilDogeNpc;
  //NPC_INSTANCES['lilDogeNpc2'] = lilDogeNpc2
}
