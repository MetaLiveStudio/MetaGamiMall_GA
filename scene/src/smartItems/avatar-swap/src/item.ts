import { Arissa, OFFSET, fakeNetworkCall } from "./arissa";
import * as utils from "./decentralandecsutils/triggers/triggerSystem";
import { getEntityByName } from "./utils";
import config from "./config";
import { GameState, GAME_STATE } from "src/state";
import { CONFIG } from "src/config";

//CALL setAvatarSwapTriggerEnabled TO DISABLE/ENABLE SWAPPING
let global_arissa: Arissa;
export function disableArisa() {
  global_arissa?.disable();
}
export function enableArisa() {
  global_arissa?.enable();
}
export type Props = {
  onEnter?: Actions;
  onLeave?: Actions;
  enabled: boolean;
  debugTriggers?: boolean;
  entireScene?: boolean;
  whenActiveHideWho?: string;
  enableAnimatorClips?: boolean;
  fixedOrigin?: string;
  fixedArea?: string;
  sceneDimensions?: string;
  relative?: boolean;

  playerMovingCheckInterval?: number;
};

export type PrepareHostForTriggerResult = {
  areaDimSource: Vector3;
  absTriggerAreaDims: Vector3;
  triggerAreaDims: Vector3;
  triggerPos: Vector3;
};
//TODO remove _scene and just loop up host to find
export function prepareHostForTrigger(
  _scene: IEntity,
  host: Entity,
  entireScene: boolean,
  relative: boolean,
  sceneDimensions?: string,
  fixedArea?: string,
  fixedOrigin?: string
): PrepareHostForTriggerResult {
  let areaDimSource = host.getComponent(Transform).scale.clone();

  if (
    fixedArea !== null &&
    fixedArea !== undefined &&
    fixedArea.split(",").length == 3
  ) {
    let fixedAreaArr = fixedArea.split(",");
    areaDimSource = new Vector3(
      +fixedAreaArr[0],
      +fixedAreaArr[1],
      +fixedAreaArr[2]
    );
  }

  if (entireScene) {
    //TODO figure out how to get scene size
    //areaDimSource = new Vector3( 16,16,16 )
    if (
      sceneDimensions !== null &&
      sceneDimensions !== undefined &&
      sceneDimensions.split(",").length == 3
    ) {
      let fixedAreaArr = sceneDimensions.split(",");
      areaDimSource = new Vector3(
        +fixedAreaArr[0],
        +fixedAreaArr[1],
        +fixedAreaArr[2]
      );

      log("XXXareaDimSource" + areaDimSource);

      //move to center so can take up entire area
      host.getComponent(Transform).position.x = areaDimSource.x / 2;
      host.getComponent(Transform).position.y = 0;
      host.getComponent(Transform).position.z = areaDimSource.z / 2;

      host.getComponent(Transform).scale = Vector3.One();
    } else {
      //idk?
      log("sceneDimensions is required for entireScene setting");
    }
  }

  const triggerAreaDims = new Vector3().copyFrom(areaDimSource);
  const hostPos = new Vector3().copyFrom(host.getComponent(Transform).position);

  let triggerPos = new Vector3(0, triggerAreaDims.y / 2, 0);

  if (
    fixedOrigin !== null &&
    fixedOrigin !== undefined &&
    fixedOrigin.split(",").length == 3
  ) {
    let fixedOriginArr = fixedOrigin.split(",");
    if (relative !== null && relative !== undefined && relative) {
      triggerPos.add(
        new Vector3(+fixedOriginArr[0], +fixedOriginArr[1], +fixedOriginArr[2])
      );
    } else {
      //absolute
      triggerPos = new Vector3(
        +fixedOriginArr[0],
        +fixedOriginArr[1],
        +fixedOriginArr[2]
      );
    }
  }

  log(
    "avatarswap " +
      host.name +
      " dimension " +
      areaDimSource +
      " " +
      triggerAreaDims +
      " " +
      triggerPos +
      " "
  );

  const hostTransform = host.getComponent(Transform);
  const hostYRotationEuler = hostTransform.rotation.eulerAngles;
  const hostYRotation =
    hostYRotationEuler.y >= 0
      ? hostYRotationEuler.y
      : hostYRotationEuler.y + 360;

  log(
    "HOST " +
      host.name +
      " " +
      host.getComponent(Transform).rotation.eulerAngles +
      " " +
      hostYRotation
  );

  let sceneRotEuler = Vector3.Zero();
  let sceneRot = null;
  let scenePos = null;
  if (_scene && _scene !== undefined) {
    sceneRot = _scene.getComponent(Transform).rotation;
    scenePos = _scene.getComponent(Transform).position;
    sceneRotEuler = sceneRot.eulerAngles;
  }
  const sceneparRotAbsY =
    sceneRotEuler.y >= 0 ? sceneRotEuler.y : sceneRotEuler.y + 360;

  log(
    "scene rotation info.4 " +
      scenePos +
      " " +
      sceneRot +
      " " +
      sceneRotEuler +
      " " +
      sceneparRotAbsY
  );

  const absTriggerAreaDims = new Vector3().copyFrom(triggerAreaDims);
  if (
    (hostYRotation > 81 && hostYRotation < 99) ||
    (hostYRotation > 261 && hostYRotation < 289)
  ) {
    if (
      (sceneparRotAbsY > 81 && sceneparRotAbsY < 99) ||
      (sceneparRotAbsY > 261 && sceneparRotAbsY < 279)
    ) {
      //if rotated, leave rotation
    } else {
      triggerAreaDims.rotate(Quaternion.Euler(0, 90, 0));
      log("triggerAreaDims.postRotate " + triggerAreaDims);
    }
  } else {
    //for host zero need to counter it
    if (
      (sceneparRotAbsY > 81 && sceneparRotAbsY < 99) ||
      (sceneparRotAbsY > 261 && sceneparRotAbsY < 279)
    ) {
      triggerAreaDims.rotate(Quaternion.Euler(0, 90, 0));
      log("triggerAreaDims.postRotate " + triggerAreaDims);
    } else {
      //scene 0 = host = 0 leave
    }
  }

  triggerAreaDims.x = Math.abs(triggerAreaDims.x);
  triggerAreaDims.y = Math.abs(triggerAreaDims.y);
  triggerAreaDims.z = Math.abs(triggerAreaDims.z);

  const result: PrepareHostForTriggerResult = {
    triggerAreaDims: triggerAreaDims,
    triggerPos: triggerPos,
    absTriggerAreaDims: absTriggerAreaDims,
    areaDimSource: areaDimSource,
  };
  return result;
}

export type SingletonData = {
  prepareHostForTriggerResult?: PrepareHostForTriggerResult;
  trigger?: utils.TriggerBoxShape;
  avatarModifierAreaComp?: AvatarModifierArea;
  triggerComponent?: utils.TriggerComponentCE;
};
let position = 0;
let maxPositions = 0;

export default class AvatarSwap implements IScript<Props> {
  _scene: IEntity = getEntityByName("_scene");
  // Check if player is moving

  // Check if player is moving
  currentPosition = new Vector3();
  arissa: Arissa | undefined;
  followAreaModifier: Entity | undefined;
  avatarAttachable: boolean | undefined;

  singleton: SingletonData = {};
  init() {
    this._scene = getEntityByName("_scene");

    //checking for sdk +6.4 (builder runs 6.6.3)
    const runningSdk664OrHigher = typeof onSceneReadyObservable !== "undefined";
    //checking if in builder. builder has no scene object and no avatar to attach to TODO find more definitive way to tell
    const inBuider = this._scene === null || this._scene === undefined;
    const avatarAttachable = !inBuider;
    this.avatarAttachable = avatarAttachable;
    log("avatarswap avatarAttachable " + avatarAttachable);

    log("avatarswap onSceneReadyObservable ");
    log(
      "avatarswap onSceneReadyObservable: local check " +
        runningSdk664OrHigher +
        " vs " +
        config.CONSTANTS.SDK_664_OR_HIGHER
    );

    log("avatarswap avatarAttachable " + avatarAttachable);
    //DO NOT SHARE transforms
    //TODO create GLTF cache/ init arisa in spawn because need the instance params
    // Arissa

    this.arissa = new Arissa(
      [new GLTFShape(CONFIG.AVATAR_SWAP_NO_NFT_BASE_MODEL)],
      new Transform({
        position: new Vector3().copyFrom(OFFSET),
        scale: new Vector3(0, 0, 0),
      }),
      true
    );

    const avatarModifierAreaComp = new AvatarModifierArea({
      area: { box: new Vector3(0.5, 1, 0.5) },
      modifiers: [AvatarModifiers.HIDE_AVATARS],
    });

    const areaModifierWrapper = new Entity(
      "following-area-modifier" + "-avatar-modifier"
    );
    this.followAreaModifier = areaModifierWrapper;
    areaModifierWrapper.addComponent(avatarModifierAreaComp);
    areaModifierWrapper.addComponent(
      new Transform({
        position: new Vector3(0, 0, 0),
      })
    );
    engine.addEntity(areaModifierWrapper);
    this.singleton.avatarModifierAreaComp = avatarModifierAreaComp;

    if (avatarAttachable) {
      this.arissa.setParent(Attachable.AVATAR);
      areaModifierWrapper.setParent(Attachable.AVATAR);
    }

    const currentPosition = this.currentPosition;
    global_arissa = this.arissa;
    const followAreaModifier = this.followAreaModifier;

    //async reload to get models from api
    this.reloadArissa();

    const host = this;

    class CheckPlayerIsMovingSystem implements ISystem {
      counter: number = 0;
      avatarCounter: number = 0;
      update(dt: number) {
        if (!GAME_STATE.avatarSwapEnabled) {
          //log("CheckPlayerIsMovingSystem.GAME_STATE.avatarSwapEnabled",GAME_STATE.avatarSwapEnabled)
          return;
        }
        //log(dt)
        this.counter += dt;
        this.avatarCounter += dt;
        //check every .11 or more seconds
        if (this.counter >= config.CONSTANTS.PLAYER_MOVING_CHECK_INTERVAL) {
          this.counter = 0; // reset counter
          const playerIdle = currentPosition.equals(Camera.instance.position);
          if (!playerIdle) {
            currentPosition.copyFrom(Camera.instance.position);
          }

          if (playerIdle) {
            global_arissa?.playIdle();
          } else {
            if (!avatarAttachable) {
              //manually update position
              global_arissa?.updatePosition(currentPosition);
            }
            global_arissa?.playRunning();
          }

          if (!playerIdle) {
            if (!avatarAttachable && followAreaModifier) {
              //manually update position
              //followAreaModifier.updatePosition(currentPosition)
              const followAreaTransform =
                followAreaModifier.getComponent(Transform);
              followAreaTransform.position.x = currentPosition.x; // + OFFSET[this.instanceType].x
              followAreaTransform.position.y = currentPosition.y; // + OFFSET[this.instanceType].y
              followAreaTransform.position.z = currentPosition.z; //+ OFFSET[this.instanceType].z
            }
          }
        } else if (
          config.CONSTANTS.PLAYER_FORCE_AVATAR_INTERVAL > -1 &&
          this.avatarCounter >= config.CONSTANTS.PLAYER_FORCE_AVATAR_INTERVAL
        ) {
          log("forcing swap enabled");
          this.avatarCounter = 0;

          host.setHideEntityEnabled(true);
        }
      }
    }
    engine.addSystem(new CheckPlayerIsMovingSystem());
  }

  setMetaDogeSwapEnabled(val: boolean) {
    log("METADOGE test");
  }
  setHideEntityEnabled(val: boolean) {
    log("setHideEntityEnabled called: " + val);

    if (val) {
      this.followAreaModifier?.setParent(Attachable.AVATAR);

      if (!this.followAreaModifier?.alive)
        if (this.followAreaModifier) engine.addEntity(this.followAreaModifier);
    } else {
      if (this.followAreaModifier?.getParent() !== null) {
        log("removing followArea Parent");
        this.followAreaModifier?.setParent(null);
      } else {
        log("already removed followArea Parent");
      }
      //this.followAreaModifier.getComponent(Transform).scale.setAll(0)
      if (this.followAreaModifier?.alive) {
        log("removing followArea from engine");
        engine.removeEntity(this.followAreaModifier);
      } else {
        log("already removed followArea from engine");
      }
    }
  }
  setAvatarSwapEntitiesEnabled(val: boolean) {
    log("setHideEntityEnabled called: " + val);
    const arissa = global_arissa;

    if (val) {
      if (GAME_STATE.metadogeSwapEnabled === true) {
        GAME_STATE.metadogeSwapEnabled = false;
        this.reloadArissa();
      }
      if (GAME_STATE.avatarSwapEnabled === false) {
        log("game state says false, ignoreing change to " + val);
        return;
      }
      arissa?.enable();

      this.setHideEntityEnabled(val);

      arissa.setParent(Attachable.AVATAR);
    } else {
      global_arissa?.disable();

      //this.followAreaModifier = null
      global_arissa?.setParent(null);

      this.setHideEntityEnabled(val);
    }
  }

  reloadArissa() {
    log("Reload ARISSA");
    global_arissa.destroy();
    global_arissa.disable();
    this.arissa = global_arissa.reload();
    const inBuider = this._scene === null || this._scene === undefined;
    const avatarAttachable = !inBuider;
    if (avatarAttachable) {
      this.arissa.setParent(Attachable.AVATAR);
      this.followAreaModifier?.setParent(Attachable.AVATAR);
    }
    this.arissa.enable();
    this.arissa.stopAll(this.arissa.run);
    this.arissa.stopAll(this.arissa.iddle);
    this.arissa.playAll(this.arissa.iddle);
    global_arissa = this.arissa;

    global_arissa?.playIdle();
  }

  setDogeSwapTriggerEnabled(host: Entity, val: boolean) {
    this.setAvatarSwapTriggerEnabled(host, true);
  }
  //CALL ME TO DISABLE/ENABLE SWAPPING
  setAvatarSwapTriggerEnabled(host: Entity, val: boolean) {
    const currentPosition = this.currentPosition;
    //TODO pick by avatar type
    const arissa = this.arissa;
    const followAreaModifier = this.followAreaModifier;
    const avatarAttachable = this.avatarAttachable;

    if (
      this.singleton.triggerComponent === null ||
      this.singleton.triggerComponent === undefined
    ) {
      this.singleton.triggerComponent = new utils.TriggerComponentCE(
        this.singleton.trigger!,
        {
          onCameraEnter: () => {
            log("avatarswap trigger enter");

            this.setAvatarSwapEntitiesEnabled(true);
            /*arissa.enable()
            arissaIdle.enable()
            if(avatarAttachable && followAreaModifier){
              followAreaModifier.setParent(Attachable.AVATAR);
            }*/
          },
          onCameraExit: () => {
            /*
            arissa.disable()
            arissaIdle.disable()
            if(avatarAttachable && followAreaModifier){
              followAreaModifier.setParent(null)
            }*/

            this.setAvatarSwapEntitiesEnabled(false);
          },
          enableDebug: config.CONSTANTS.DEBUG_ENABLED,
        }
      );
    }
    if (val) {
      log("enable avatar swap");
      this.singleton.triggerComponent.enabled = true;
      host.addComponentOrReplace(this.singleton.triggerComponent);
      this.setAvatarSwapEntitiesEnabled(true);

      global_arissa.stopAll(global_arissa.run);
      global_arissa.playAll(global_arissa.iddle);
    } else {
      log("disable avatar swap");
      if (host.hasComponent(utils.TriggerComponentCE)) {
        log("host removing utils.TriggerComponentCE");
        host.removeComponent(utils.TriggerComponentCE);
        this.singleton.triggerComponent.enabled = false;
      } else {
        log("host already removed utils.TriggerComponentCE");
      }
      this.setAvatarSwapEntitiesEnabled(false);
    }
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const entireScene =
      props.entireScene !== null &&
      props.entireScene !== undefined &&
      props.entireScene;

    const whenActiveHideAllPlayers =
      props.whenActiveHideWho !== null &&
      props.whenActiveHideWho !== undefined &&
      props.whenActiveHideWho == "all";
    const whenActiveHideCurrentPlayer =
      props.whenActiveHideWho !== null &&
      props.whenActiveHideWho !== undefined &&
      props.whenActiveHideWho == "current";

    const prepareHostForTriggerResult = prepareHostForTrigger(
      this._scene,
      host,
      entireScene,
      !props.relative,
      props.sceneDimensions,
      props.fixedArea,
      props.fixedOrigin
    );

    const triggerAreaDims = prepareHostForTriggerResult.triggerAreaDims;
    const areaDimSource = prepareHostForTriggerResult.areaDimSource;
    const absTriggerAreaDims = prepareHostForTriggerResult.absTriggerAreaDims;
    const triggerPos = prepareHostForTriggerResult.triggerPos;

    const trigger = new utils.TriggerBoxShape(
      triggerAreaDims.clone(),
      //new Vector3(hostPos.x-triggerAreaDims.x, triggerAreaDims.y/2, hostPos.z-triggerAreaDims.z)
      triggerPos
    );

    //singleton
    this.singleton.prepareHostForTriggerResult = prepareHostForTriggerResult;
    this.singleton.trigger = trigger;

    log("XXXabsTriggerAreaDims " + absTriggerAreaDims);
    log("XXXtriggerAreaDims " + triggerAreaDims);
    //trigger.enabled = props.enabled

    config.CONSTANTS.DEBUG_ENABLED =
      props.debugTriggers !== null &&
      props.debugTriggers !== undefined &&
      props.debugTriggers;
    config.CONSTANTS.PLAYER_MOVING_CHECK_INTERVAL =
      props.playerMovingCheckInterval !== null &&
      props.playerMovingCheckInterval !== undefined
        ? props.playerMovingCheckInterval
        : config.CONSTANTS.PLAYER_MOVING_CHECK_INTERVAL;

    const enabled =
      props.enabled !== null && props.enabled !== undefined && props.enabled;
    // Hide avatars
    //const hideAvatarsEntity = new Entity()
    log(
      "XXXwhenActiveHideAllPlayers " +
        whenActiveHideAllPlayers +
        " " +
        props.whenActiveHideWho
    );
    log("XXXwhenActiveHideCurrentPlayer " + whenActiveHideCurrentPlayer);
    if (enabled && whenActiveHideAllPlayers) {
      log("XXXadding hide avatar modifier");
      const modifierArea = absTriggerAreaDims.clone();
      modifierArea.y -= 1.6 / 2;
      let avatarModifierAreaComp = new AvatarModifierArea({
        area: { box: modifierArea },
        modifiers: [AvatarModifiers.HIDE_AVATARS],
      });

      //centers itself in the host. if host is at 0, half of it is underground
      //for now going to move it up by half
      let avatarModifierPosition = new Vector3(0, 0, 0);
      avatarModifierPosition.y = absTriggerAreaDims.y / 2 - 1.6;

      log("XXXavatarModifierPosition " + avatarModifierPosition);

      const areaModifierWrapper = new Entity(host.name + "-avatar-modifier");
      //engine.addEntity(areaModifierWrapper)
      areaModifierWrapper.setParent(host);
      areaModifierWrapper.addComponent(avatarModifierAreaComp);
      areaModifierWrapper.addComponent(
        new Transform({
          position: avatarModifierPosition,
        })
      );

      this.singleton.avatarModifierAreaComp = avatarModifierAreaComp;

      //host.addComponent(avatarModifierAreaComp)
    }
    if (!enabled || !whenActiveHideCurrentPlayer) {
      log("XXXdisable hide entity following");
      this.setAvatarSwapEntitiesEnabled(false);
    }

    // Create to show Arissa avatar
    if (enabled) {
      this.setAvatarSwapTriggerEnabled(host, true);
    } else {
      log("avatarswap disabled");
    }
  }
}
