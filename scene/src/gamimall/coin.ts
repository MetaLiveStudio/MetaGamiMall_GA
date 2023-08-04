import * as utils from "@dcl/ecs-scene-utils";
import {
  createTextShape,
  getEntityByName,
  isNull,
  notNull,
  removeFromEngine,
} from "../utils";

import PlayFab from "./playfab_sdk/PlayFabClientApi";

import { GAME_STATE } from "src/state";
import { refreshUserData } from "./login-flow";
import { CONFIG } from "src/config";
import { NFTUIDataPriceType } from "src/store/types";

const collectCoinClip = new AudioClip("sounds/collect-coin.mp3");

export const collectCoinSparkle = new GLTFShape("models/collect-sparkle.glb");
collectCoinSparkle.withCollisions = false;

export const coinShape = new GLTFShape("models/coin.glb"); // Includes the spinning animation
coinShape.withCollisions = false;

export const coinShapeBZ = new GLTFShape("models/VCNMaterials/BronzeCoin.glb"); // Includes the spinning animation
coinShapeBZ.withCollisions = false;


export const material1Shape = new GLTFShape("models/materialA.glb"); 
material1Shape.withCollisions = false;

export const material2Shape = new GLTFShape("models/materialB.glb"); 
material2Shape.withCollisions = false;

export const material3Shape = new GLTFShape("models/materialC.glb"); 
material3Shape.withCollisions = false;

export const coinShapeVB = new GLTFShape("models/VOXBUX.glb"); // Includes the spinning animation
coinShape.withCollisions = false;

export const coinShapeMC = new GLTFShape("models/coin-mc.glb"); // Includes the spinning animation
coinShapeMC.withCollisions = false;

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

export type SpawnCoinArgType = {
  id: string;
  x: number;
  y: number;
  z: number;
  coinType: string;
  value: number;
};
//mirror what colysoius has
export type CoinType = {
  id: string;
  x: number;
  y: number;
  z: number;
  value: number;
  type: string;
  visible: boolean;
  collectedBy: string;
};


export type RewardData = {
  amount: number,
  type: NFTUIDataPriceType
  id: string
};

export type RewardNotification={
  rewardType:string
  newLevel:number,
  rewards:RewardData[]
  sourceObjectId?:string //id it is linked to that gave out the reward
}

// getEntityByName("testCoinPlacementBlock").addComponent(
//     new OnPointerDown(
//         () => {
//             testCoinPlacement()
//         },
//         { hoverText: "Place Coins At Pianos" }
//     )
// )
/*
function testCoinPlacement(){
    coins.forEach((coin, key)=> {
        spawnCoin(`coin-${key}-placement`, coin[0], coin[1]-0.44, coin[2],5,(id)=>{ 
            log("touche test coin") 
        })
    })
}
*/

export class CoinManager {
  coinsSpawned: Record<string, Coin> = {};
  coinPool: Record<string, Coin> = {};

  maxCount: number;

  constructor(_coinCount: number) {
    this.maxCount = _coinCount;
    //this.ballSystem = new BallThrowSystem(this)
    //engine.addSystem(this.ballSystem)
  }

  getCoinById(id: string): Coin {
    let coin: Coin = this.coinPool[id];
    if (coin === undefined) {
      //non optimized way
      coin = getEntityByName(id) as Coin; //TODO optimize
    }
    return coin;
  }
  removeSpawnedCoins() {
    for (let p in this.coinsSpawned) {
      const coin = this.coinsSpawned[p];
      this.removeFromCoinsSpawned(coin);
      this.removeCoinFromScene(coin);
    }
  }
  removeFromCoinsSpawned(entity: Entity) {
    //log("removeFromCoinsSpawned ENTRY")
    const name = entity.name;
    if (name !== null) {
      const key = name != null ? name : "id";
      delete this.coinsSpawned[key];
    }
  }
  removeCoinFromScene(entity: Entity) {
    //log("removeFromScene ENTRY")
    //TODO do a  better remove
    //entity.getComponent(Transform).position.y = entity.getComponent(Transform).position.y + 1
    //entity.getComponent(Transform).scale.y = .2
    //removeFrom

    // call this as side affect? removeFromCoinsSpawned(entity)

    if (entity.alive) engine.removeEntity(entity);
  }
  spawnCoin(
    spawnCoinArg: SpawnCoinArgType,
    onTouchBlock?: (id: string) => void
  ): Coin {
    let id = spawnCoinArg.id;
    let x = spawnCoinArg.x;
    let y = spawnCoinArg.y;
    let z = spawnCoinArg.z;
    let coinType = spawnCoinArg.coinType;
    let value = spawnCoinArg.value;

    //START TODO MOVE THIS INTO ITS OWN COIN CLASS
    // create the entity

    const newCoin = isNull(this.coinPool[id]);

    //TODO pull from object pool?
    const coin = !newCoin ? this.coinPool[id] : new Coin(id);

    this.coinPool[id] = coin;
    this.coinsSpawned[id] = coin;

    // add a transform to the entity
    coin.addComponentOrReplace(
      new Transform({
        position: new Vector3(x, y, z),
        scale: new Vector3(0.6, 0.6, 0.6),
      })
    );

    if (newCoin) {
      //log("spawn making coin " + id)
      // add a shape to the entity
      //const coin = new CoinShape();
      //coin.withCollisions = false;
      //coin.addComponent(coin);
      //TODO make a coin class for encapsulation and reusablilty

      // set random color/material for the coin
      /*
            const coinMaterial = new Material()
            coinMaterial.albedoColor = Color3.Random();
            coinMaterial.metallic = Math.random();
            coinMaterial.roughness = Math.random();
            coin.addComponent(coinMaterial);*/

      //TODO MOVE TO CONSTANTS
      // trigger configurations (Took from https://github.com/decentraland-scenes/switchboard-platforms/)

      coin.setCollectable(true);
      coin.setCoinType(coinType);
      // Button triggers
      coin.addComponent(
        new utils.TriggerComponent(coinTriggerShape, {
          onCameraEnter: () => {
            if (onTouchBlock !== null && onTouchBlock !== undefined)
              onTouchBlock(id);
          },
          enableDebug: false,
        })
      );

      //const coinValue = new Entity(id+"-coin-value")
      //coinValue.setParent(coin)
      //coinValue.addComponent( createTextShape(String(value),Color3.Black(),'SF',3) )
      //coinValue.addComponent(new Transform({ position: new Vector3(0, .5, 0) }))
      //coinValue.addComponent(new Billboard())
      // scale block from 0 to 1

      coin.show();

      /*
            // play click sound
            const clickAudioSource = new AudioSource(clickSound);
            coin.addComponent(clickAudioSource);
            clickAudioSource.playOnce();*/
      //END TODO MOVE THIS INTO ITS OWN COIN CLASS
    } else {
      log("spawn cache hit for coin " + id);

      coin.setCoinType(coinType);

      coin.setCollectable(true);

      coin.show();

      //update trigger
      coin.getComponent(utils.TriggerComponent).onCameraEnter = () => {
        onTouchBlock!(id);
      };
    }

    // add the entity to the engine
    if (!coin.alive) engine.addEntity(coin);

    return coin;
  }
  preloadCoins(qty: number, transformArgs: TranformConstructorArgs) {
    log("preloadCoins called");
    //DO NOT CHANGE PREFIX "block-" UNLESS YOU UPDATE SCENE SIDE TOO - caching by id
    for (let x = 0; x < qty; x++) {
      let coinType = CONFIG.GAME_COIN_TYPE_GC;
      let value = 1;
      if (Math.floor(Math.random() * 2) == 1) {
        coinType = CONFIG.GAME_COIN_TYPE_MC;
        value = 1;
      }
      const coin = this.spawnCoin(
        {
          id: "block-" + x + "",
          x: transformArgs.position!.x,
          y: transformArgs.position!.y,
          z: transformArgs.position!.z,
          coinType: coinType,
          value: value,
        },
        undefined
      );
      coin.hide(-1);
    }
  }

  loadCoins(coins: SpawnCoinArgType[]) {
    log("preloadCoins called");
    //DO NOT CHANGE PREFIX "block-" UNLESS YOU UPDATE SCENE SIDE TOO - caching by id
    for (const p in coins) {
      const coinArg = coins[p];
      const coin = this.spawnCoin(coinArg, undefined);
      //coin.hide(-1)
    }
  }
}

export class SparkleManager {
  balls: Sparkle[];
  maxCount: number;

  constructor(_ballCount: number) {
    this.balls = [];
    this.maxCount = _ballCount;
  }

  spawnSparkle(transform: Transform, visible: boolean): Sparkle {
    let retVal: Sparkle;

    if (this.balls.length < this.maxCount) {
      //TODO make sparkle manager
      let sparkle = new Sparkle("sparkle-" + this.balls.length);
      sparkle.addComponent(collectCoinSparkle);
      sparkle.addComponentOrReplace(transform);
      sparkle.setVisible(visible);

      this.balls.push(sparkle);

      retVal = sparkle;
    } else {
      let instance = this.balls.shift();
      if (instance !== undefined) {
        instance.addComponentOrReplace(transform);
        instance.setVisible(visible);

        this.balls.push(instance); //push it to the end
        retVal = instance;
      } else {
        //should never enter here!!!
        //done to make compiler happy
        log("spawnSparkle never enter here!!!");
        retVal = new Sparkle();
      }
    }

    if (!retVal.alive) engine.addEntity(retVal);

    //log("spawning sparkle: ", retVal);

    return retVal;
  }

  preloadSparkle(qty: number, transformArgs: TranformConstructorArgs) {
    log("preloadSparkle called");
    //DO NOT CHANGE PREFIX "block-" UNLESS YOU UPDATE SCENE SIDE TOO - caching by id
    for (let x = 0; x < qty; x++) {
      
      const spark = this.spawnSparkle(new Transform(transformArgs), true);
      spark.hide();
    }
  }
}

export const COIN_MANAGER: CoinManager = new CoinManager(400);
export const SPARKLE_MANAGER: SparkleManager = new SparkleManager(10);

export class Sparkle extends Entity {
  sound: AudioSource;
  showScale: Vector3;
  visible: boolean = false;

  constructor(name?: string) {
    super(name);

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

export class Coin extends Entity {
  coinType?: string;
  coinModelEntity: Entity;
  value?: number;
  showScale: Vector3;
  visible: boolean = false;
  collectable: boolean = false;

  constructor(name?: string) {
    super(name);

    this.coinModelEntity = new Entity(this.name + "-coin-model");
    this.coinModelEntity.setParent(this);

    const scaleMult = 1; // + value/5
    this.showScale = new Vector3(scaleMult, scaleMult, scaleMult);
  }
  show(speed?: number) {
    this.visible = true;
    if (speed == undefined || speed < 0) {
      //now
      this.getComponent(Transform).scale = this.showScale;
    } else {
      this.addComponentOrReplace(
        new utils.ScaleTransformComponent(
          Vector3.Zero(),
          this.showScale,
          speed !== undefined ? speed : 0.2
        )
      );
    }
  }
  hide(speed?: number) {
    this.visible = false;
    if (speed == undefined || speed < 0) {
      //now
      this.getComponent(Transform).scale = Vector3.Zero();
    } else {
      this.addComponentOrReplace(
        new utils.ScaleTransformComponent(
          this.showScale,
          Vector3.Zero(),
          speed !== undefined ? speed : 0.2
        )
      );
    }
  }

  setCollectable(val: boolean) {
    this.collectable = val;
  }

  collect() {
    if (this.collectable == false) {
      log("already collected. returnined " + this.name);
      return;
    }
    this.setCollectable(false);

    //start where the coin was
    const sparklePos = this.getComponent(Transform).position.clone();
    sparklePos.y -= 1;

    const sparkle = SPARKLE_MANAGER.spawnSparkle(
      new Transform({
        position: sparklePos,
        scale: new Vector3(1, 1, 1),
      }),
      false
    );

    sparkle.show(1000);
    sparkle.playSound();

    //for now solo to reduce memory consumption
    //this.coinCollectModelEntity.setParent(this)

    //zero it out so can still play sound etc
    this.hide();
    removeFromEngine(this, 0);
  }

  setCoinType(coinType: string) {
    this.coinType = coinType;

    if (coinType == CONFIG.GAME_COIN_TYPE_MC) {
      this.coinModelEntity.addComponentOrReplace(coinShapeMC);
    } else if (coinType == CONFIG.GAME_COIN_TYPE_VB) {
      this.coinModelEntity.addComponentOrReplace(coinShapeVB);
    } else if (coinType == CONFIG.GAME_COIN_TYPE_BZ) {
      this.coinModelEntity.addComponentOrReplace(coinShapeBZ);
    } else if (coinType == CONFIG.GAME_COIN_TYPE_MATERIAL_1) {
      this.coinModelEntity.addComponentOrReplace(material1Shape);
    } else if (coinType == CONFIG.GAME_COIN_TYPE_MATERIAL_2) {
      this.coinModelEntity.addComponentOrReplace(material2Shape);
    } else if (coinType == CONFIG.GAME_COIN_TYPE_MATERIAL_3) {
      this.coinModelEntity.addComponentOrReplace(material3Shape);
    } else {
      this.coinModelEntity.addComponentOrReplace(coinShape);
    }
  }
}

/*
let testCoinCounter = 0


const LEFT_MID_RAIL_X = 54.550048828125
const LEFT_OUTER_RAIL_X = 53.06005859375
const RIGHT_MID_RAIL_X = 57.5
const RIGHT_OUTER_RAIL_X = 58.4

const testCoins:SpawnCoinArgType[]=[]
    testCoins.push( { id:"left-low-rail-"+testCoinCounter++,x: LEFT_MID_RAIL_X , y:7 , z:38.0,coinType: CONFIG.GAME_COIN_TYPE_GC ,value:1 } )
    testCoins.push( { id:"left-low-rail-"+testCoinCounter++,x: LEFT_MID_RAIL_X , y:7.8 , z:39.0,coinType: CONFIG.GAME_COIN_TYPE_GC ,value:1 } )
    testCoins.push( { id:"left-low-rail-"+testCoinCounter++,x: LEFT_MID_RAIL_X , y:8.8 , z:40,coinType: CONFIG.GAME_COIN_TYPE_GC ,value:1  ) }
    testCoins.push( { id:"left-low-rail-"+testCoinCounter++,x: LEFT_MID_RAIL_X , y:9.377623558044434 , z:41 ,coinType: CONFIG.GAME_COIN_TYPE_GC ,value:1  }
)



const leftRailZStart = 68.2266845703125
let leftRailZPos=leftRailZStart
const leftRail2CoinCount=4
const leftRailZSpan = (72.430419921875 - leftRailZStart)/(leftRail2CoinCount-1)
for(let x=0;x<leftRail2CoinCount;x++){
    testCoins.push( { id:"left-far-rail-"+testCoinCounter++,x: LEFT_MID_RAIL_X , y:7.344753742218018  , z: leftRailZPos,coinType: CONFIG.GAME_COIN_TYPE_GC ,value:1 } )
    leftRailZPos+=(leftRailZSpan)
}
leftRailZPos=leftRailZStart
for(let x=0;x<leftRail2CoinCount;x++){
    testCoins.push( { id:"right-far-rail-"+testCoinCounter++,x: RIGHT_MID_RAIL_X , y:7.344753742218018  , z: leftRailZPos,coinType: CONFIG.GAME_COIN_TYPE_GC ,value:1 } )
    leftRailZPos+=(leftRailZSpan)
}



const leftTableZStart = 58.524658203125 
let leftTableZPos=leftTableZStart
const leftTableCoinCount=4
const leftTableZSpan = (64.905029296875 - leftTableZStart)/(leftTableCoinCount-1)
for(let x=0;x<leftTableCoinCount;x++){
    testCoins.push( { id:"left-table-"+testCoinCounter++,x: LEFT_OUTER_RAIL_X , y:7.1384077072143555  , z: leftTableZPos,coinType: CONFIG.GAME_COIN_TYPE_GC ,value:1 } )
    leftTableZPos+=(leftTableZSpan)
}

const leftRailLowZStart = 39.4248291015625
let leftRailLowZPos=leftRailLowZStart
const leftRailLowCoinCount=14
const leftRailLowZSpan = (76.1605224609375 - leftRailLowZStart)/(leftRailLowCoinCount-1)
for(let x=0;x<leftRailLowCoinCount;x++){
    testCoins.push( { id:"left-high-rail-"+testCoinCounter++,x: LEFT_OUTER_RAIL_X , y:11.197996139526367 , z: leftRailLowZPos,coinType: CONFIG.GAME_COIN_TYPE_GC ,value:1 } )
    leftRailLowZPos+=(leftRailLowZSpan)
}

const leftRailHighZStart = 42.814453125
let leftRailHighZPos=leftRailHighZStart
const leftRailCoinCount=4
const leftRailHighZSpan = (47.50592041015625 - leftRailHighZStart)/(leftRailCoinCount-1)
for(let x=0;x<leftRailCoinCount;x++){
    testCoins.push( { id:"left-low-rail-"+testCoinCounter++,x: LEFT_MID_RAIL_X  , y:9.473938941955566  , z: leftRailHighZPos,coinType: CONFIG.GAME_COIN_TYPE_GC ,value:1 } )
    leftRailHighZPos+=(leftRailHighZSpan)
}
 

 

const rightRailLowZStart = 39.4248291015625
let rightRailLowZPos=rightRailLowZStart
const rightRailLowCoinCount=8
const rightRailLowZSpan = (57.1973876953125  - rightRailLowZStart)/(rightRailLowCoinCount-1)
for(let x=0;x<rightRailLowCoinCount;x++){
    testCoins.push( { id:"right-high-rail-"+testCoinCounter++,x: RIGHT_OUTER_RAIL_X , y:11.197996139526367 , z: rightRailLowZPos,coinType: CONFIG.GAME_COIN_TYPE_GC ,value:1 } )
    rightRailLowZPos+=(rightRailLowZSpan)
}


COIN_MANAGER.loadCoins(testCoins)*/
