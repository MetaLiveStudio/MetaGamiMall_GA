import * as utils from "./decentralandecsutils/triggers/triggerSystem";
import { CONSTANTS } from "./constants";
import * as escutils from "./decentralandecsutils/timer/component/delay";
import { CommonResources } from "src/resources/common";

export const sceneMessageBus = new MessageBus();

export let keys: PianoKey[][] = [];

const materialCache: Record<string, ObservableComponent> = {};

export class PianoKey extends Entity {
  //material: Material
  onColor: Color3; // = new Color3(1.75, 1.25, 0.0) // Orange glow
  offColor: Color3 = Color3.Black(); // To zero out emissive
  parentId: number;
  colorCacheName: string;
  note: number;
  disappearDelay: number | undefined;
  keyType: string | undefined;
  multiplayer: boolean;

  constructor(
    name: string,
    shape: PlaneShape,
    transform: Transform,
    keyTransparent: boolean,
    color: Color3,
    colorOn: Color3,
    emissiveIntensity: number,
    sound: AudioClip,
    trigger: utils.TriggerBoxShape,
    note: number,
    parentId: number,
    disappearDelay?: number,
    keyType?: string,
    multiplayer?: boolean
  ) {
    super(name);
    //engine.addEntity(this)
    this.addComponent(shape);
    this.addComponent(transform);

    this.colorCacheName =
      color.toHexString() +
      "-" +
      colorOn.toHexString() +
      "-" +
      emissiveIntensity;
    if (keyTransparent) {
      this.colorCacheName =
        "transparent" + "-" + colorOn.toHexString() + "-" + emissiveIntensity;
    }
    this.onColor = colorOn;

    this.disappearDelay = disappearDelay;
    this.keyType = keyType;
    this.multiplayer =
      multiplayer !== null && multiplayer !== undefined ? multiplayer : true;

    //cache?!?!
    let materialComp: ObservableComponent =
      materialCache[this.colorCacheName + "-off"];
    if (!materialComp) {
      if (!keyTransparent) {
        let material = new Material();
        material.albedoColor = color;
        material.emissiveColor = this.offColor;
        //material.emissiveIntensity
        material.metallic = 0.0;
        material.roughness = 1.0;

        materialCache[this.colorCacheName + "-off"] = material;

        materialComp = material;
      } else {
        //do stuff to make transparent
        let material = CommonResources.RESOURCES.materials.transparent;
        materialCache[this.colorCacheName + "-off"] = material;

        materialComp = material;
      }

      let onMat = new Material();
      onMat.albedoColor = color;
      onMat.metallic = 0.0;
      onMat.roughness = 1.0;
      onMat.emissiveColor = this.onColor;
      onMat.emissiveIntensity = emissiveIntensity;

      materialCache[this.colorCacheName + "-on"] = onMat;
    }

    if (materialComp) {
      this.addComponentOrReplace(materialComp);
    }

    // note ID
    this.note = note;
    this.parentId = parentId;

    // Sound
    if (sound) {
      this.addComponent(new AudioSource(sound));
    }

    // Create trigger
    this.addComponent(
      new utils.TriggerComponentCE(trigger, {
        onCameraEnter: () => {
          //log('enter trigger: ', this.note)
          this.activateKey();
        },
        onCameraExit: () => {
          this.deactivateKey();
        },
        enableDebug: CONSTANTS.DEBUG_ENABLED,
      })
    );
  }
  public activateKey() {
    if (this.multiplayer) {
      sceneMessageBus.emit("noteOn", {
        parentId: this.parentId,
        note: this.note,
      });
    } else {
      this.play();
    }
  }
  public deactivateKey() {
    if (this.multiplayer) {
      sceneMessageBus.emit("noteOff", {
        parentId: this.parentId,
        note: this.note,
        delay: this.disappearDelay,
      });
    } else {
      //TODO refactor with message bus
      if (this.disappearDelay !== null && this.disappearDelay !== undefined) {
        log("deactivateKey non multi delay " + this.disappearDelay);
        this.addComponentOrReplace(
          new escutils.Delay(this.disappearDelay, () => {
            this.end();
          })
        );
      } else {
        log("deactivateKey non multi immedaite ");
        this.end();
      }
    }
  }
  public play(): void {
    if (this.hasComponent(AudioSource))
      this.getComponent(AudioSource).playOnce();
    //this.material.emissiveColor = this.onColor
    this.addComponentOrReplace(materialCache[this.colorCacheName + "-on"]);
  }
  public end(): void {
    //this.material.emissiveColor = this.offColor
    this.addComponentOrReplace(materialCache[this.colorCacheName + "-off"]);
  }
}

sceneMessageBus.on("noteOn", (e) => {
  //log('noteOn event: ', e)
  keys[e.parentId][e.note].play();
});

sceneMessageBus.on("noteOff", (e) => {
  //log('off event: ', e)
  if (e.delay !== null && e.delay !== undefined) {
    keys[e.parentId][e.note].addComponentOrReplace(
      new escutils.Delay(e.delay, () => {
        keys[e.parentId][e.note].end();
      })
    );
  } else {
    keys[e.parentId][e.note].end();
  }
});
