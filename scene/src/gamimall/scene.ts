import * as utils from "@dcl/ecs-scene-utils";
import { CONFIG } from "src/config";
import { REGISTRY } from "src/registry";
import { COIN_MANAGER, SPARKLE_MANAGER } from "./coin";
import { initColyseusConnection } from "./connection";

//
// Most of the code on this file have been generated through Decentraland Builder.
// https://builder.decentraland.org/
//

/*
startGameBlock.addComponent(
    new OnPointerDown(
        () => openExternalURL("https://github.com/colyseus/decentraland"),
        { hoverText: "View source-code" }
    )
);*/

export function initGamiMallScene() {
  initColyseusConnection();

  //do it async pretty much
  utils.setTimeout(1000, () => {
    log("calling preloadCoins called");
    COIN_MANAGER.preloadCoins(100, {
      position: CONFIG.GAME_COIN_VAULT_POSITION,
    });

    SPARKLE_MANAGER.preloadSparkle(SPARKLE_MANAGER.maxCount, {
      position: CONFIG.GAME_COIN_VAULT_POSITION,
    });
  });

  //START COIN COLLECTING

  const playGameStationModel = new GLTFShape("models/multicolor_pattern.glb");
  playGameStationModel.withCollisions = true;
  playGameStationModel.isPointerBlocker = true;
  playGameStationModel.visible = true;

  const startGameStationsPos: Vector3[] = [
    /*
  //first floor stage
  new Vector3( 39.794677734375 , 1 , 49.413848876953125 ),
  //muscle
  new Vector3( 56.0086669921875 , 6.104999542236328 , 66.14651489257812 ) ,
  //moon
  new Vector3( 24.2001953125 , 24.755104064941406 , 61.082366943359375 ) ,
  //mars
  new Vector3( 36.195068359375 , 32.25499725341797 , 56.09576416015625 ) ,
  //heaven
  new Vector3( 23.7607421875 , 51.75499725341797 , 67.50439453125 ) */
  ];

  for (const p in startGameStationsPos) {
    const startGameBlock = new Entity("startGameButton-" + p);
    engine.addEntity(startGameBlock);
    //startGameBlock.setParent(_scene)
    const transform12X = new Transform({
      position: startGameStationsPos[p],
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    startGameBlock.addComponentOrReplace(transform12X);

    startGameBlock.addComponentOrReplace(playGameStationModel);

    startGameBlock.addComponent(
      new utils.KeepRotatingComponent(Quaternion.Euler(0, 45, 0))
    );

    startGameBlock.addComponent(
      new OnPointerDown(
        () => {
          REGISTRY.ui.openStartGamePrompt();
        },
        { hoverText: "Start Game" }
      )
    );
  }
}
// const testCoinPlacementBlock = new Entity('testCoinPlacementBlock')
// engine.addEntity(testCoinPlacementBlock)
// //startGameBlock.setParent(_scene)
// const transform12testCoinPlacementBlockX = new Transform({
//   position: new Vector3(0.4, 0.7, 0),
//   rotation: new Quaternion(0, 0, 0, 1),
//   scale: new Vector3(1, 1, 1)
// })
// testCoinPlacementBlock.addComponentOrReplace(transform12testCoinPlacementBlockX)
// testCoinPlacementBlock.addComponent(new BoxShape())
// testCoinPlacementBlock.addComponent(new sceneutils.KeepRotatingComponent(Quaternion.Euler(0, 45, 0)));

//END COIN COLLECTING
