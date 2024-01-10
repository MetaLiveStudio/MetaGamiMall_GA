import * as utils from '@dcl-sdk/utils'
/*import {
  createTextShape,
  getEntityByName,
  isNull,
  notNull,
  removeFromEngine,
} from "../../utils";*/

//import { CONFIG } from "../../config";
//import { NFTUIDataPriceType } from "src/store/types";
//import { getOrCreateGLTFShape } from "../../meta-decentrally/resources/common";
import { collectCoinSparkle } from "../coin";
import { Vector3 } from "@dcl/sdk/math";
import { engineTweenStartScaling, log } from "../../back-ports/backPorts";
import { AudioSource, Entity, GltfContainer, PBAudioSource, PBGltfContainer, Transform, TransformTypeWithOptionals, VisibilityComponent, engine } from '@dcl/sdk/ecs';

//const collectCoinClip = new AudioClip("sounds/collect-coin.mp3");
const collectCoinClip:PBAudioSource = {audioClipUrl:"sounds/collect-coin.mp3",loop:false,volume:0.4,playing:false};

const pickAxeShape:PBGltfContainer = {src:"models/MineGame/Pickaxe.glb"}; //new GLTFShape("models/MineGame/Pickaxe.glb"); 
//pickAxeShape.withCollisions = false;

const sparklesShape = collectCoinSparkle
//sparklesShape.withCollisions = false;

function _removeFromEngine(wrapper: PickAxe, time:number) {
  console.log("_removeFromEngine for ",wrapper,"ignoring right now since no way to just add back, need new way to add remove or dont")
  //make it not visible
  VisibilityComponent.createOrReplace(wrapper.modelEntity,{visible:true})
  //engine.removeEntity(entity);
}


//tracks spawned so end level remove them


//const BOX = new BoxShape()
//BOX.withCollisions = false

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
        log("pickAxeMgr.getModelGLTF short hande",modelToUse,pickAxeShape);
        return pickAxeShape
      case 'sparkle':
        log("pickAxeMgr.getModelGLTF short hande",modelToUse,sparklesShape);
        return sparklesShape
      default:
        //assume is the model
        log("pickAxeMgr.getModelGLTF assume is the model",modelToUse);
        //TODO consdier caching this???
        return {src:modelToUse} //getOrCreateGLTFShape(modelToUse)
    }
  }
  spawnAxe(modelToUse:string,transform: TransformTypeWithOptionals, visible: boolean): PickAxe {
    log("spawnAxe",modelToUse,transform,visible)
    let retVal: PickAxe;

    if (this.balls.length < this.maxCount) {
      //TODO make sparkle manager
      let sparkle = new PickAxe("pick-ax-" + this.balls.length);
      GltfContainer.createOrReplace(sparkle.modelEntity,this.getModelGLTF(modelToUse))
      //sparkle.modelEntity.addComponent(this.getModelGLTF(modelToUse));
      //sparkle.addComponent(new Animator())
      const currTf = Transform.getOrNull(sparkle.entity)
      Transform.createOrReplace(sparkle.entity,{
        ...transform,
        parent: currTf ? currTf.parent : undefined
      })
      //sparkle.addComponentOrReplace(transform);
      sparkle.setVisible(visible);

      
      //debug to help with positioning and orienation testing
      //TODO ADD DEBUG BACK
      /*if(false){
        const debugEnt = new Entity()
        debugEnt.addComponent(BOX)
        debugEnt.addComponent(new Transform({
          position:Vector3.create(0,0,0),
          scale: Vector3.create(3,.5,.5)
        }))
        debugEnt.setParent(sparkle)
      }*/

      this.balls.push(sparkle);

      retVal = sparkle;
    } else {
      let instance = this.balls.shift();
      if (instance !== undefined) {
        const currTf = Transform.getOrNull(instance.entity)
        //instance.addComponentOrReplace(transform);
        Transform.createOrReplace(instance.entity,{
          ...transform,
          parent: currTf ? currTf.parent : undefined
        })
        instance.setVisible(visible);
        //instance.modelEntity.addComponentOrReplace(this.getModelGLTF(modelToUse));
        GltfContainer.createOrReplace(instance.modelEntity,this.getModelGLTF(modelToUse))

        this.balls.push(instance); //push it to the end
        retVal = instance;
      } else {
        //should never enter here!!!
        //done to make compiler happy
        log("spawnSparkle never enter here!!!");
        retVal = new PickAxe();
      }
    }

    //TODO STILL NEEDED???
    //if (!retVal.alive) engine.addEntity(retVal);
    VisibilityComponent.createOrReplace(retVal.modelEntity,{visible:true})

    //log("spawning sparkle: ", retVal);

    return retVal;
  }

  preloadAx(qty: number, transformArgs: TransformTypeWithOptionals) {
    log("preloadpickAxeMgr called");
    //DO NOT CHANGE PREFIX "block-" UNLESS YOU UPDATE SCENE SIDE TOO - caching by id
    for (let x = 0; x < qty; x++) {
      
      const spark = this.spawnAxe('axe',transformArgs, true);
      spark.hide();
    }
  }
}

export class PickAxe /*extends Entity*/ {
  name:string|undefined
  //TODO BRING BACK
  //sound: AudioSource;
  entity:Entity
  showScale: Vector3;
  visible: boolean = false;
  modelEntity: Entity
  timerId?:utils.TimerId

  constructor(name?: string) {
    this.name = name
    //super(name);

    this.entity = engine.addEntity()

    this.modelEntity = engine.addEntity()//new Entity(name+".model");
    Transform.create(this.modelEntity, {
      parent: this.entity
    })

    AudioSource.createOrReplace(this.entity, collectCoinClip)

    const scaleMult = 1; // + value/5
    this.showScale = Vector3.create(scaleMult, scaleMult, scaleMult);
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

    engineTweenStartScaling(
    //utils.tweens.startScaling(
      this.entity, this.showScale, Vector3.Zero(), 0.2 * 1000
      )
    //this.addComponentOrReplace(
    //  new utils.ScaleTransformComponent(this.showScale, Vector3.Zero(), 0.2)
    //);
  }
  show(duration?: number) {
    log(this.name + ".show called");
    this.visible = true;
    engineTweenStartScaling(
    //utils.tweens.startScaling(
      this.entity, Vector3.Zero(), this.showScale, 0.2 * 1000
      )
    //this.addComponentOrReplace(
    //  new utils.ScaleTransformComponent(Vector3.Zero(), this.showScale, 0.2)
    //);

    const delayVal = duration !== undefined ? duration : -1;
    if (delayVal > 0) {
      if(this.timerId){
        utils.timers.clearTimeout(this.timerId)
        this.timerId = undefined
    }
      this.timerId = utils.timers.setTimeout(() => {
        this.hide();
        _removeFromEngine(this, 0);
      }, delayVal);
    } else {
      _removeFromEngine(this, 0);
    }
  }
  playSound() {
    //this.sound.playOnce();
    AudioSource.getMutable(this.entity).playing=true
  }
}

export let PICK_AXE_MANAGER: PickAxeManager

export function initPickAxeManager() {
  //preload it
  for(const p of [pickAxeShape,sparklesShape]){
    const ent = engine.addEntity()
    GltfContainer.create(ent,p)
    Transform.create(ent,{position:Vector3.create(3,-10,3), scale: Vector3.create(0.7, 0.7, 0.7)})//underground


    utils.timers.setTimeout(()=>{
      engine.removeEntity(ent);
    },0)
  }

  if( !PICK_AXE_MANAGER ) PICK_AXE_MANAGER = new PickAxeManager(3);
  //return new PickAxeManager(10);
}