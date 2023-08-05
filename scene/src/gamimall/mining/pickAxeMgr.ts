import * as utils from "@dcl/ecs-scene-utils";
import {
  createTextShape,
  getEntityByName,
  isNull,
  notNull,
  removeFromEngine,
} from "../../utils";

import { CONFIG } from "src/config";
import { NFTUIDataPriceType } from "src/store/types";
import { getOrCreateGLTFShape } from "src/meta-decentrally/resources/common";
import { collectCoinSparkle } from "../coin";

const collectCoinClip = new AudioClip("sounds/collect-coin.mp3");

export const pickAxeShape = new GLTFShape("models/MineGame/Pickaxe.glb"); 
pickAxeShape.withCollisions = false;

export const sparklesShape = collectCoinSparkle
//sparklesShape.withCollisions = false;

//preload it
for(const p of [pickAxeShape,sparklesShape]){
  const ent = new Entity()
  ent.addComponent(p)
  ent.addComponent(new Transform({position:new Vector3(3,-10,3), scale: new Vector3(0.7, 0.7, 0.7)}))//underground
  ent.addComponent(new utils.Delay(0,()=>{
    engine.removeEntity(ent)
  }))
  engine.addEntity(ent)
}

//current size of y:1 and position 1.6 (center of head) seems to work well as
//default camera size is 2 meters.  it does not cause high coins on spiral to be collected by the feet
const coinTriggerShape = new utils.TriggerBoxShape(
  new Vector3(0.6, 0.6, 0.6), // custom trigger shape
  new Vector3(0, 0, 0) // custom trigger shape
  //for default 2x2 trigger shape
  //new Vector3(.6, 1, .6), // size 1.8 is a little bigger than standing 1.6
  //new Vector3(0, 1.6, 0) // position place so walking the camera hits it and jumping camera hits its (feet on avatar)
);

//tracks spawned so end level remove them


const BOX = new BoxShape()
BOX.withCollisions = false

export class PickAxeManager {
  balls: PickAxe[];
  maxCount: number;

  constructor(_ballCount: number) {
    this.balls = [];
    this.maxCount = _ballCount;
  }

  getModelGLTF(modelToUse:string){
    switch(modelToUse){
      case 'axe':
        log("pickAxeMgr.getModelGLTF short hande",modelToUse,pickAxeShape.src);
        return pickAxeShape
      case 'sparkle':
        log("pickAxeMgr.getModelGLTF short hande",modelToUse,sparklesShape.src);
        return sparklesShape
      default:
        //assume is the model
        log("pickAxeMgr.getModelGLTF assume is the model",modelToUse);
        return getOrCreateGLTFShape(modelToUse)
    }
  }
  spawnAxe(modelToUse:string,transform: Transform, visible: boolean): PickAxe {
    let retVal: PickAxe;

    if (this.balls.length < this.maxCount) {
      //TODO make sparkle manager
      let sparkle = new PickAxe("pick-ax-" + this.balls.length);
      sparkle.modelEntity.addComponent(this.getModelGLTF(modelToUse));
      //sparkle.addComponent(new Animator())
      sparkle.addComponentOrReplace(transform);
      sparkle.setVisible(visible);

      
      //debug to help with positioning and orienation testing
      if(false){
        const debugEnt = new Entity()
        debugEnt.addComponent(BOX)
        debugEnt.addComponent(new Transform({
          position:new Vector3(0,0,0),
          scale: new Vector3(3,.5,.5)
        }))
        debugEnt.setParent(sparkle)
      }

      this.balls.push(sparkle);

      retVal = sparkle;
    } else {
      let instance = this.balls.shift();
      if (instance !== undefined) {
        instance.addComponentOrReplace(transform);
        instance.setVisible(visible);
        instance.modelEntity.addComponentOrReplace(this.getModelGLTF(modelToUse));

        this.balls.push(instance); //push it to the end
        retVal = instance;
      } else {
        //should never enter here!!!
        //done to make compiler happy
        log("spawnSparkle never enter here!!!");
        retVal = new PickAxe();
      }
    }

    if (!retVal.alive) engine.addEntity(retVal);

    //log("spawning sparkle: ", retVal);

    return retVal;
  }

  preloadAx(qty: number, transformArgs: TranformConstructorArgs) {
    log("preloadpickAxeMgr called");
    //DO NOT CHANGE PREFIX "block-" UNLESS YOU UPDATE SCENE SIDE TOO - caching by id
    for (let x = 0; x < qty; x++) {
      
      const spark = this.spawnAxe('axe',new Transform(transformArgs), true);
      spark.hide();
    }
  }
}

export const PICK_AXE_MANAGER: PickAxeManager = new PickAxeManager(3);

export class PickAxe extends Entity {
  sound: AudioSource;
  showScale: Vector3;
  visible: boolean = false;
  modelEntity: Entity

  constructor(name?: string) {
    super(name);

    this.modelEntity = new Entity(name+".model");
    this.modelEntity.setParent(this)

    this.sound = new AudioSource(collectCoinClip);
    this.sound.volume = 0.4;
    this.addComponentOrReplace(this.sound);

    const scaleMult = 1; // + value/5
    this.showScale = new Vector3(scaleMult, scaleMult, scaleMult);
  }

  setVisible(val: boolean) {
    if (val) {
      this.show();
    } else {
      this.hide();
    }
  }
  hide() {
    //log(this.name + ".hide called")
    this.visible = false;
    this.addComponentOrReplace(
      new utils.ScaleTransformComponent(this.showScale, Vector3.Zero(), 0.2)
    );
  }
  show(duration?: number) {
    log(this.name + ".show called");
    this.visible = true;
    this.addComponentOrReplace(
      new utils.ScaleTransformComponent(Vector3.Zero(), this.showScale, 0.2)
    );

    const delayVal = duration !== undefined ? duration : -1;
    if (delayVal > 0) {
      this.addComponentOrReplace(
        new utils.Delay(delayVal, () => {
          this.hide();
          removeFromEngine(this, 0);
        })
      );
    } else {
      removeFromEngine(this, 0);
    }
  }
  playSound() {
    this.sound.playOnce();
  }
}
