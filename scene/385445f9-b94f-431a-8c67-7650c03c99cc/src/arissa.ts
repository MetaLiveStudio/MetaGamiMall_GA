import { CONFIG } from "src/config";
import { GAME_STATE } from "src/state";
import { toggleMetaDogeIcon } from "src/ui-bars";
import { getAndSetUserData, getUserDataFromLocal } from "src/userData";

export const OFFSET: Vector3 = new Vector3(-2.4, -0.81, -0.2); // = [0]

const runninSufix = "Run";
const iddleSufix = "Idle";

export class Arissa extends Entity {
  lastState: string;
  enabled: boolean;
  visible: boolean;
  enableAnimatorClips: boolean;
  run: AnimationState[] = [];
  iddle: AnimationState[] = [];
  animators: Animator[] = [];
  parts: Entity[] = [];
  models: GLTFShape[][];
  transform: Transform;
  position: number = 0;
  maxPositions: number = 0;

  constructor(
    models: GLTFShape[],
    transform: Transform,
    enableAnimatorClips: boolean
  ) {
    super();
    this.lastState = "";
    this.enabled = false;
    this.visible = false;
    this.models = [models];
    this.transform = transform;
    this.enableAnimatorClips = enableAnimatorClips;
    if (models.length > 1) {
      this.generateModels(models, transform);
    } else {
      let model = models[0];
      engine.addEntity(this);
      this.transform = transform;
      this.addComponent(model);
      this.addComponent(transform);
    }
  }

  private generateModels(models: GLTFShape[], transform: Transform) {
    log("ARISA" + " START ", models);
    let isParent = true;
    models.forEach((model) => {
      this.buildModel(model, transform, isParent);
      isParent = false;
    });
    if (this.enableAnimatorClips) {
      this.stopAll(this.run);
      this.stopAll(this.iddle);
      this.playAll(this.iddle);
    }
    log("ARISA" + " EXIT ");
  }

  buildModel(model: GLTFShape, transform: Transform, isParent: boolean) {
    if (isParent) {
      engine.addEntity(this);
      this.addComponentOrReplace(model);
      this.addComponentOrReplace(transform);

      let animator = new Animator();
      let filename = this.getAnimationName(model.src);
      let run = new AnimationState(this.getClipName(filename, runninSufix), {
        looping: true,
        layer: 0,
      });
      let iddle = new AnimationState(this.getClipName(filename, iddleSufix), {
        looping: true,
        layer: 1,
      });
      animator.addClip(run);
      animator.addClip(iddle);
      this.addComponentOrReplace(animator);
      this.animators.push(animator);

      this.run.push(run);
      this.iddle.push(iddle);
    } else {
      let accesory_e = new Entity("12");
      accesory_e.addComponentOrReplace(model);

      let animator = new Animator();
      let filename = this.getAnimationName(model.src);
      let run = new AnimationState(this.getClipName(filename, runninSufix), {
        looping: true,
        layer: 0,
      });
      let iddle = new AnimationState(this.getClipName(filename, iddleSufix), {
        looping: true,
        layer: 1,
      });
      animator.addClip(run);
      animator.addClip(iddle);
      this.animators.push(animator);
      accesory_e.addComponentOrReplace(animator);

      this.run.push(run);
      this.iddle.push(iddle);
      if (!isParent) {
        accesory_e.setParent(this);
      }
      this.parts.push(accesory_e);
      engine.addEntity(accesory_e);
    }
    this.parts.push(this);
  }

  /**
   *
   * @param fileName file name
   * @param actionType the type of action wanted
   * @returns the animation name for the
   */
  private getClipName(fileName: string, actionType: string) {
    //default is just concat filename + action type
    let animName = fileName + actionType;
    //if needed put custom logic if need custom naming logic
    /*
    switch(actionType){
      case runninSufix:
        break;
      case iddleSufix:
        break;
    }*/
    log("getArissaClipName", fileName, actionType, animName);
    return animName;
  }

  private getAnimationName(model: string) {
    let regexp = new RegExp("/(.+/)*(.+)/(.+)$");
    //to avoid problems with window system, maybe not required
    let path_formatted = model.replace("\\", "/");
    const matches = path_formatted.match(regexp) ?? "";
    let filename = matches[matches.length - 1].replace(".glb", "");
    log("ARISA" + " path " + model);
    log("ARISA" + " filename " + filename);
    return filename;
  }

  reload() {
    if (this.models.length === 1) {
      executeTask(async () => {
        //fix doge position
        const models = await getMetadoge3DAssets();

        if (models && models.length !== undefined) {
          log("arissa_fetch", models.length);
          GAME_STATE.playerState.nftDogeBalance = models.length;
        } else {
          log("arissa_fetch failed?!?!?!");
        }

        if (models && models.length > 0) {
          //use thes
          this.models = models;
        } else {
          log("arissa_fetch you get the basic skin");
        }

        if (this.models.length > 1) {
          GAME_STATE.metadogeSwapEnabledIcon = true;
          toggleMetaDogeIcon();
        }
        this.position = 0;
        this.maxPositions = this.models.length;
        this.generateModels(this.models[this.position], this.transform);
      });
    } else {
      this.updateModelPosition();
      this.generateModels(this.models[this.position], this.transform);
    }
    return this;
  }
  getModels() {
    return this.models;
  }
  setModels(models: GLTFShape[][]) {
    this.models = models;
  }
  private updateModelPosition() {
    this.position = this.position + 1;
    if (this.position >= this.maxPositions) {
      this.position = 0;
    }
  }

  destroy() {
    this.stopAll(this.run);
    this.stopAll(this.iddle);
    this.parts.forEach((part) => {
      part.removeComponent(GLTFShape);
      part.setParent(false);
      engine.removeEntity(part);
    });
    this.run = [];
    this.iddle = [];
    this.animators = [];
    this.parts = [];
    this.removeComponent(GLTFShape);
    engine.removeEntity(this);
  }

  stopAll(animations: AnimationState[]) {
    log("ARISA" + " stopAll ");
    animations.forEach((animation) => {
      animation.stop();
    });
  }

  playAll(animations: AnimationState[]) {
    log("ARISA" + " playAll ");
    animations.forEach((animation) => {
      animation.play();
    });
  }

  updatePosition(currentPosition: Vector3) {
    this.getComponent(Transform).position.x = currentPosition.x + OFFSET.x;
    this.getComponent(Transform).position.y = currentPosition.y + OFFSET.y;
    this.getComponent(Transform).position.z = currentPosition.z + OFFSET.z;
  }
  // Play running animation
  playRunning() {
    this.show();
    if (this.lastState != "Running") {
      this.lastState = "Running";
      this.stopAll(this.iddle);
      this.playAll(this.run);
    }
  }

  // Play idle animation
  playIdle() {
    this.show();
    if (this.lastState != "Idle") {
      this.lastState = "Idle";
      this.stopAll(this.run);
      this.playAll(this.iddle);
    }
  }

  hide() {
    if (this.visible) {
      const transform = this.getComponent(Transform);
      if (transform.scale.x != 0) {
        //does checking before setting speed it up?
        transform.scale.setAll(0);
      }
      this.visible = false;
    }
    //this.stopAnimations(); if stop animations must show them on show.  just let it play?
  }

  show() {
    if (this.enabled && !this.visible) {
      const transform = this.getComponent(Transform);
      if (transform.scale.x != 1) {
        //does checking before setting speed it up?
        transform.scale.setAll(1);
      }
      this.visible = true;
    }
  }

  enable() {
    this.show();
    this.enabled = true;
  }

  disable() {
    this.hide();
    this.enabled = false;
  }
}

export async function getMetadoge3DAssets() {
  await getAndSetUserData();
  let wallet = await getUserDataFromLocal()?.publicKey;
  const api_url =
    CONFIG.CONTRACT_3D_API_CALL + CONFIG.CONTRACT_OWNER_FIELD + wallet;
  log("url: " + api_url);
  let assets: GLTFShape[][] = [];
  try {
    let response = await fetch(api_url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.status == 200) {
      let json = await response.json();
      if (parseInt(json["count"]) > 0) {
        let dogecount = 0;
        json["assets"].forEach(function (asset: any) {
          let traitcount = 0;
          asset["attributes"].forEach(function (trait: any) {
            if (trait["trait_type"] !== "Background") {
              let model: GLTFShape | null = mapName(
                trait["trait_type"],
                trait["value"]
              );
              if (model != null) {
                if (traitcount == 0) {
                  assets[dogecount] = [];
                }
                assets[dogecount][traitcount] = model;
                traitcount = traitcount + 1;
              }
            }
          });
          dogecount = dogecount + 1;
        });
      }
    } else {
      log(
        " error reponse to reach URL status:" +
          response.status +
          " text:" +
          response.statusText
      );
    }
  } catch (e) {
    log(e);
  } finally {
    return assets;
  }
}

export function fakeNetworkCall() {
  const type = [
    "models/layers3D_Models/00Type/00DogeBro.glb",
    "models/layers3D_Models/00Type/00DogeGod.glb",
    "models/layers3D_Models/00Type/00LilDoge.glb",
    "models/layers3D_Models/00Type/00MarsDoge.glb",
    "models/layers3D_Models/00Type/00MoonDoge.glb",
  ];
  const skin = [
    "models/layers3D_Models/01Skin/01Skin_FaceScar.glb",
    "models/layers3D_Models/01Skin/01Skin_Frackle.glb",
    "models/layers3D_Models/01Skin/01Skin_Pinkcheek.glb",
    "models/layers3D_Models/01Skin/01Skin_RedCheek.glb",
    "models/layers3D_Models/01Skin/01Skin_RedDot.glb",
    "models/layers3D_Models/01Skin/01Skin_Yellowcheek.glb",
  ];
  const object = [
    "models/layers3D_Models/02Object/02Object_BullsEye.glb",
    "models/layers3D_Models/02Object/02Object_Heart.glb",
    "models/layers3D_Models/02Object/02Object_RainbowRobe.glb",
    "models/layers3D_Models/02Object/02Object_Robe.glb",
    "models/layers3D_Models/02Object/02Object_WOW.glb",
  ];

  const chest = [
    "models/layers3D_Models/03Chest/03Chest_AlienGemNecklace.glb",
    "models/layers3D_Models/03Chest/03Chest_BlueGem.001.glb",
    "models/layers3D_Models/03Chest/03Chest_BreastScar.glb",
    "models/layers3D_Models/03Chest/03Chest_Cross.glb",
    "models/layers3D_Models/03Chest/03Chest_DogeNecklace.glb",
    "models/layers3D_Models/03Chest/03Chest_RedGem.glb",
    "models/layers3D_Models/03Chest/03Chest_RedShield.glb",
    "models/layers3D_Models/03Chest/03Chest_YellowShield.glb",
  ];

  const mouth = [
    "models/layers3D_Models/04Mouth/04Mouth_BabyTeeth.glb",
    "models/layers3D_Models/04Mouth/04Mouth_Beard.glb",
    "models/layers3D_Models/04Mouth/04Mouth_Cigarette.glb",
    "models/layers3D_Models/04Mouth/04Mouth_Fire.glb",
    "models/layers3D_Models/04Mouth/04Mouth_Mask.glb",
    "models/layers3D_Models/04Mouth/04Mouth_Mole.glb",
    "models/layers3D_Models/04Mouth/04Mouth_Pipe.glb",
    "models/layers3D_Models/04Mouth/04Mouth_PurpleNose.glb",
    "models/layers3D_Models/04Mouth/04Mouth_RedLip.glb",
    "models/layers3D_Models/04Mouth/04Mouth_RedNose.glb",
    "models/layers3D_Models/04Mouth/04Mouth_VampireBabyTeeth.glb",
    "models/layers3D_Models/04Mouth/04Mouth_VimpireTeeth.glb",
  ];

  const eyes = [
    "models/layers3D_Models/05Eyes&Ears/05Eyes_Ears_Blindfold.glb",
    "models/layers3D_Models/05Eyes&Ears/05Eyes_Ears_CoolDogeSungalsses.glb",
    "models/layers3D_Models/05Eyes&Ears/05Eyes_Ears_DarkRedSunglasses.glb",
    "models/layers3D_Models/05Eyes&Ears/05Eyes_Ears_EyePatch.glb",
    "models/layers3D_Models/05Eyes&Ears/05Eyes_Ears_Flash.glb",
    "models/layers3D_Models/05Eyes&Ears/05Eyes_Ears_Flower.glb",
    "models/layers3D_Models/05Eyes&Ears/05Eyes_Ears_GreenEyes.glb",
    "models/layers3D_Models/05Eyes&Ears/05Eyes_Ears_GreenEyeshadow.glb",
    "models/layers3D_Models/05Eyes&Ears/05Eyes_Ears_IdiotEye.glb",
    "models/layers3D_Models/05Eyes&Ears/05Eyes_Ears_LaserEyes.glb",
    "models/layers3D_Models/05Eyes&Ears/05Eyes_Ears_LaserEyesB_Y.glb",
    "models/layers3D_Models/05Eyes&Ears/05Eyes_Ears_LaserEyesR_Y.glb",
    "models/layers3D_Models/05Eyes&Ears/05Eyes_Ears_NerdGlasses.glb",
    "models/layers3D_Models/05Eyes&Ears/05Eyes_Ears_Polarizer.glb",
    "models/layers3D_Models/05Eyes&Ears/05Eyes_Ears_RedEyes.glb",
    "models/layers3D_Models/05Eyes&Ears/05Eyes_Ears_VRHeadset.glb",
  ];

  const head = [
    "models/layers3D_Models/06Head/06Head_Antenna.glb",
    "models/layers3D_Models/06Head/06Head_Bandana.glb",
    "models/layers3D_Models/06Head/06Head_Beanie.glb",
    "models/layers3D_Models/06Head/06Head_BlackWildHair.glb",
    "models/layers3D_Models/06Head/06Head_Cap.glb",
    "models/layers3D_Models/06Head/06Head_CowBoyHat.glb",
    "models/layers3D_Models/06Head/06Head_DevilEars.glb",
    "models/layers3D_Models/06Head/06Head_Drag.glb",
    "models/layers3D_Models/06Head/06Head_FireEars.glb",
    "models/layers3D_Models/06Head/06Head_Halo.glb",
    "models/layers3D_Models/06Head/06Head_Headband.glb",
    "models/layers3D_Models/06Head/06Head_KnittedCap.glb",
    "models/layers3D_Models/06Head/06Head_LittleSun.glb",
    "models/layers3D_Models/06Head/06Head_MafiaCap.glb",
    "models/layers3D_Models/06Head/06Head_MohawkThin.glb",
    "models/layers3D_Models/06Head/06Head_PoliceCap.glb",
    "models/layers3D_Models/06Head/06Head_PurpleWildHair.glb",
    "models/layers3D_Models/06Head/06Head_RedGemEarring.glb",
    "models/layers3D_Models/06Head/06Head_RedMohawk.glb",
    "models/layers3D_Models/06Head/06Head_Sapling.glb",
    "models/layers3D_Models/06Head/06Head_Shit.glb",
    "models/layers3D_Models/06Head/06Head_SingleHair.glb",
    "models/layers3D_Models/06Head/06Head_TopHat.glb",
    "models/layers3D_Models/06Head/06Head_YellowEars.glb",
    "models/layers3D_Models/06Head/06Head_YellowGemEarring.glb",
  ];

  return [
    new GLTFShape(type[Math.floor(Math.random() * type.length)]),
    new GLTFShape(skin[Math.floor(Math.random() * skin.length)]),
    new GLTFShape(object[Math.floor(Math.random() * object.length)]),
    new GLTFShape(chest[Math.floor(Math.random() * chest.length)]),
    new GLTFShape(mouth[Math.floor(Math.random() * mouth.length)]),
    new GLTFShape(eyes[Math.floor(Math.random() * eyes.length)]),
    new GLTFShape(head[Math.floor(Math.random() * head.length)]),
  ];
}

function mapName(trait: string, name: string) {
  let formated_trait = "None";
  let path = "models/layers3D_Models/";
  if (name === "None") return null;
  switch (trait) {
    case "Type": {
      formated_trait = path + "00Type/00" + name.split(" ").join("") + ".glb";
      break;
    }
    case "Skin": {
      formated_trait =
        path + "01Skin/01Skin_" + name.split(" ").join("") + ".glb";
      break;
    }
    case "Chest": {
      formated_trait =
        path + "03Chest/03Chest_" + name.split(" ").join("") + ".glb";
      break;
    }
    case "Object": {
      formated_trait =
        path + "02Object/02Object_" + name.split(" ").join("") + ".glb";
      break;
    }
    case "Mouth": {
      formated_trait =
        path + "04Mouth/04Mouth_" + name.split(" ").join("") + ".glb";
      break;
    }
    case "Eyes & Ears": {
      formated_trait =
        path + "05Eyes&Ears/05Eyes_Ears_" + name.split(" ").join("") + ".glb";
      break;
    }
    case "Head": {
      formated_trait =
        path + "06Head/06Head_" + name.split(" ").join("") + ".glb";
      break;
    }
    default: {
      return null;
    }
  }
  return new GLTFShape(formated_trait);
}
