import {
  ENTITY_CACHE_BY_NAME_MAP,
  computeFaceAngle,
  computeMoveVector,
} from "./utils";
import {
  Logger,
  jsonStringifyActions,
  jsonStringifyActionsFull,
} from "./logging";

export type TweenType =
  | "move"
  | "rotate"
  | "rotate-q"
  | "scale"
  | "follow-path";
export type SceneChangeAddRmType = "add" | "remove" | "show" | "hide";
export type RepeatActionType = "none" | "absolute" | "relative" | "reverse";
export type TrackingActionType = "none" | "current" | "meet" | "follow";
export type TargetOfInterestType = "entity" | "player";

export type Tween = {
  // transition: number
  target: string;
  targets: string;
  multiplayer: boolean;
  targetOfInterestType: TargetOfInterestType;
  targetOfInterest: string; //transient conveted to x,y,z ; now needed for active tracking
  pathItem1: string; //transient conveted to curvePoints
  pathItem2: string; //transient conveted to curvePoints
  pathItem3: string; //transient conveted to curvePoints
  pathItem4: string; //transient conveted to curvePoints
  pathItem5: string; //transient conveted to curvePoints
  percentOfDistanceToTravel: number; //conveted to x,y,z - need for 'follow'
  moveNoCloserThan: number; //conveted to x,y,z - need for 'follow'
  playerPosition: Vector3; //????transient conveted to x,y,z?????
  sceneAddRemove: SceneChangeAddRmType; //add to pass for syncable
  attachToOrigin: boolean; //transient???
  lockMode: string;
  lockX: boolean;
  lockY: boolean;
  lockZ: boolean;
  lockW: boolean; //can we get rid of this since we convert between euler and back?
  x: number;
  y: number;
  z: number;
  w: number;
  //destPosition: Vector3 //get rid of this param!!!
  curve: CurveType;
  curvePoints: Vector3[];
  curveNBPoints: number;
  curveCloseLoop: boolean;
  returnToFirst: boolean; //follow path? transient?
  numberOfSegments: number; //for PathData and RotationData
  turnToFaceNext: boolean; //REMOVE ME?!? not needed if lock all axis? gate to enable locking??? for PathData and RotationData
  trackingType: TrackingActionType;
  trackingCounter: number;
  trackingInterval: number;
  controlMode: string;
  tweenControlMove: boolean;
  tweenControlRotate: boolean;
  tweenControlScale: boolean;
  repeatAction: RepeatActionType;
  speed: number;
  relative: boolean;
  onComplete: Actions;
};

// Custom component to store current speed
@Component("pathSpeed")
export class PathSpeed {
  speed: number = 0.5;
}

@Component("org.decentraland.AttachDetachMetaData")
export class AttachDetachMetaData {
  originalParent?: IEntity;
  previousParent?: IEntity;
}

export class TweeningMetaDataVO {
  //one per transition
  target?: string;
  targetOfInterest?: string;
  targetEntity?: IEntity;
  targetOfInterestEntity?: IEntity;
}
@Component("org.decentraland.TweenableMoveMetaData")
export class TweenableMoveMetaData extends TweeningMetaDataVO {}
@Component("org.decentraland.TweenableRotateMetaData")
export class TweenableRotateMetaData extends TweeningMetaDataVO {}
@Component("org.decentraland.TweenableScaleMetaData")
export class TweenableScaleMetaData extends TweeningMetaDataVO {}

//TODO return correct type base on tweentype
function factoryCreateTweeningMetaData<
  T extends TweenableVO,
  R extends TweeningMetaDataVO
>(
  tweenable: Tweenable,
  component: ComponentConstructor<T>,
  objectToPopulate: R
) {
  //TODO consider moving trackingX into a metho method lookup?
  let trackingEntity = undefined;
  //embed in object?
  //let trackingTransform:Transform = null;
  //let trackingTweenable = null;

  if (tweenable.trackingType && tweenable.targetOfInterest) {
    //TODO cache this so not looked up each time? into a component??
    //make a record lookup cache? cleaned out when done?
    trackingEntity = ENTITY_CACHE_BY_NAME_MAP.get(tweenable.targetOfInterest);
  }

  objectToPopulate.targetOfInterestEntity = trackingEntity;
  objectToPopulate.targetOfInterest = tweenable.targetOfInterest;
  //objectToPopulate.targetOfInterestTweenable = trackingTweenable
}

@Component("pathData")
export class PathData {
  start: number = 0;
  origin: number = 0;
  target: number = 1;
  points: Vector3[];
  curvePoints: number = 25;
  closeLoop: boolean = true;
  path: Vector3[];
  fraction: number = 0;
  constructor(
    points: Vector3[],
    curvePoints: number,
    closeLoop: boolean,
    originVector: Vector3
  ) {
    this.points = points;
    this.curvePoints = curvePoints;
    this.closeLoop = closeLoop;
    //this.originVector = originVector
    // Create a Catmull-Rom Spline curve. This curve passes through all 4 points. The total number of points in the path is set by  `curvePoints`
    this.path = Curve3.CreateCatmullRomSpline(
      this.points,
      this.curvePoints,
      this.closeLoop
    ).getPoints();

    this.setStartPosition(originVector);
  }
  setStartPosition(originVector: Vector3) {
    //for some reason does not always give me curve where pt1 == path[0]
    //so must find it and resort path so it is first
    let trueOrgIdx = -1;
    for (let x = 0; x < this.path.length; x++) {
      let sqDistOrigins = Vector3.Distance(originVector, this.path[x]);
      let vectEq = sqDistOrigins < 0.0001;
      //log("x " + vectEq + " " + this.originVector + " " + this.path[x])
      if (vectEq && trueOrgIdx < 0) {
        trueOrgIdx = x;
      }
    }
    log(
      "trueOrgIdx " +
        trueOrgIdx +
        " " +
        originVector +
        " " +
        this.path[trueOrgIdx]
    );
    if (trueOrgIdx > 0) {
      //adjust start and end points
      //this.path = tmpPath;
      this.origin = trueOrgIdx;
      this.target = this.origin + 1;
      this.start = this.origin;
    }
  }
  setPathPosition(originIdx: number) {
    log("setPathPosition " + originIdx);
    this.origin = originIdx;
    this.target = this.origin + 1;
  }
}

// Custom component to store rotational lerp data
@Component("rotateData")
export class RotateData {
  startingRot: Quaternion;
  originRot?: Quaternion;
  targetRot?: Quaternion;
  fraction: number = 0;
  lockX: boolean;
  lockY: boolean;
  lockZ: boolean;
  lockW: boolean;
  constructor(
    startingRot: Quaternion,
    lockX: boolean,
    lockY: boolean,
    lockZ: boolean,
    lockW: boolean
  ) {
    this.startingRot = startingRot;
    this.lockX = lockX;
    this.lockY = lockY;
    this.lockZ = lockZ;
    this.lockW = lockW;
  }
}

@Component("org.decentraland.Syncable")
export class Syncable {}

//@Component('org.decentraland.Tweenable')
export class TweenableVO {
  transition: number = 0;
  type: TweenType;
  curve: CurveType = CurveType.LINEAR;
  x: number;
  y: number;
  z: number;
  w: number;
  //destPosition: Vector3// get rid of?
  //playerPosition:Vector3, tansient captured as x,y,z - no need to save add so syncEntity matchess up?
  speed: number;
  relative: boolean;
  onComplete: Actions;
  channel: IChannel;
  origin: Vector3;
  originQ?: Quaternion; //rename originRotation
  //curvePath: Curve3 //save so synEntities works?!?! really need to save antirre path + rotation data
  curvePoints: Vector3[];
  curveNBPoints: number;
  curveCloseLoop: boolean;
  numberOfSegments: number;
  turnToFaceNext: boolean;
  trackingType: TrackingActionType;
  trackingCounter: number = 0;
  trackingInterval: number = 0; //TODO CAN WE MAKE THIS BIGGER THAN 0. need to sync transition LERP with counter somehow
  targetOfInterest: string;
  targetOfInterestType: TargetOfInterestType;
  percentOfDistanceToTravel: number; //need for 'follow'
  moveNoCloserThan: number; //need for 'follow'
  repeatAction: RepeatActionType;
  sceneAddRemove: SceneChangeAddRmType; //add to pass for syncable????
  sender: string = "initial";
  timestamp: number;
  enabled: boolean;
  //TODO figure out how to remove these lock param
  lockMode?: string; //is this needed or is it handled before creation of the tweenVO?
  lockX: boolean; //for PathData and RotationData
  lockY: boolean; //for PathData and RotationData
  lockZ: boolean; //for PathData and RotationData
  lockW?: boolean; //for PathData and RotationData
  pathOriginIndex?: number; //need to persit - for PathData and RotationData

  constructor(args: {
    transition?: number;
    type: TweenType;
    x: number;
    y: number;
    z: number;
    w: number;
    //destPosition?: Vector3
    speed: number;
    relative: boolean;
    onComplete: Actions;
    channel: IChannel;
    origin: Vector3;
    originQ?: Quaternion; //rename originRotation
    curve?: CurveType;
    //curvePath?: Curve3
    curvePoints?: Vector3[];
    curveNBPoints?: number;
    curveCloseLoop?: boolean;
    numberOfSegments?: number;
    turnToFaceNext?: boolean;
    trackingType?: TrackingActionType;
    targetOfInterest?: string;
    trackingCounter?: number;
    trackingInterval?: number;
    targetOfInterestType?: TargetOfInterestType;
    percentOfDistanceToTravel?: number;
    moveNoCloserThan?: number;
    repeatAction?: RepeatActionType;
    lockX?: boolean;
    lockY?: boolean;
    lockZ?: boolean;
    sender?: string;
    timestamp?: number;
    enabled?: boolean;
    sceneAddRemove?: SceneChangeAddRmType; //is this needed!?!!?
  }) {
    if (args.transition && args.transition !== undefined)
      this.transition = args.transition;
    this.type = args.type;
    this.x = args.x;
    this.y = args.y;
    this.z = args.z;
    this.w = args.w;
    this.percentOfDistanceToTravel = args.percentOfDistanceToTravel!;
    this.moveNoCloserThan = args.moveNoCloserThan!;
    //this.destPosition = args.destPosition
    this.speed = args.speed;
    this.relative = args.relative;
    this.onComplete = args.onComplete;
    this.channel = args.channel;
    this.origin = args.origin;
    this.originQ = args.originQ;
    this.curve = args.curve!;
    //putting curve stuff here just cuz its easier than
    //having to manage multiple object
    //can be my god object
    this.curvePoints = args.curvePoints!;
    this.curveNBPoints = args.curveNBPoints!;
    this.curveCloseLoop = args.curveCloseLoop!;
    this.numberOfSegments = args.numberOfSegments!;
    this.turnToFaceNext = args.turnToFaceNext!;
    this.trackingType = args.trackingType!;
    if (args.trackingCounter && args.trackingCounter !== undefined)
      this.trackingCounter = args.trackingCounter;
    if (args.trackingInterval && args.trackingInterval !== undefined)
      this.trackingInterval = args.trackingInterval;
    this.targetOfInterest = args.targetOfInterest!;
    this.targetOfInterestType = args.targetOfInterestType!;
    this.repeatAction = args.repeatAction!;
    this.lockX = args.lockX!;
    this.lockY = args.lockY!;
    this.lockZ = args.lockZ!;
    this.sender = args.sender!;
    this.timestamp = args.timestamp!;
    this.enabled = args.enabled! && args.enabled == true;
    this.sceneAddRemove = args.sceneAddRemove!;
  }
}

@Component("org.decentraland.Tweenable")
export class Tweenable extends TweenableVO {}

@Component("org.decentraland.TweenableMove")
export class TweenableMove extends TweenableVO {}
@Component("org.decentraland.TweenableRotate")
export class TweenableRotate extends TweenableVO {}
@Component("org.decentraland.TweenableScale")
export class TweenableScale extends TweenableVO {}
const offsetFactory =
  (tweenable: Tweenable, relative: Vector3) => (axis: "x" | "y" | "z") => {
    const value = tweenable[axis];
    const offset = relative[axis];

    return tweenable.relative ? value + offset : value;
  };

//leave player out here as static.  If I init it inside the method for some resaon the player position reports 0s first usage????
const player = Camera.instance;

export class TweenSystem<T extends TweenableVO> {
  syncableGroup = engine.getComponentGroup(Syncable);
  component: ComponentConstructor<T>;
  //let xxx:typeof Tweenable = Tweenable
  //TODO pass to constructor the group type TweenableRotate vs TweenableMove vs TweenableScale
  tweenableGroup: ComponentGroup; //engine.getComponentGroup(Tweenable)
  logger: Logger;

  constructor(component: ComponentConstructor<T>) {
    this.logger = new Logger(this.getClassName(), {});
    if (this.logger.isTraceEnabled())
      this.logger.trace("constructor", "ENTRY", [component]);
    this.component = component;
    this.setComponent(component);
    this.setTweenableGroup(engine.getComponentGroup(this.component));
    this.tweenableGroup = engine.getComponentGroup(this.component);
  }
  setTweenableGroup(group: ComponentGroup) {
    this.tweenableGroup = group;
  }
  getComponent(): ComponentConstructor<T> {
    log(this.getClassName() + ".getComponent() called");
    return this.component;
  }
  setComponent(component: ComponentConstructor<T>) {
    log(this.getClassName() + ".setComponent() called");
    this.component = component;
  }
  getClassName(): string {
    //if minified not sure can trust this?!?!
    return "TweenSystem"; //this.constructor.name
  }
  removeComponent(entity: IEntity) {
    if (this.logger.isTraceEnabled())
      this.logger.trace("removeComponent", "called", null);
    entity.removeComponent(this.component);
  }
  update(dt: number) {
    const METHOD_NAME = "update";
    if (this.tweenableGroup.entities.length > 0) {
      //log(this.getClassName() + " " + this.tweenableGroup.entities.length)
    }
    for (const entity of this.tweenableGroup.entities) {
      const tweenable = entity.getComponent(this.component);
      const transform: Transform = entity.getComponent(Transform);

      //TODO consider moving trackingX into a metho method lookup?
      let trackingEntity = null;
      let trackingTransform: Transform;
      let trackingTweenable = null;

      if (tweenable.enabled == false) {
        //log(entity['name'] + " disabled")
        continue;
      }

      if (tweenable.trackingType && tweenable.targetOfInterest) {
        //using cache so not slow looked up each time? into a component??
        trackingEntity = ENTITY_CACHE_BY_NAME_MAP.get(
          tweenable.targetOfInterest
        );

        if (trackingEntity) {
          trackingTransform = trackingEntity.getComponent(Transform);
          if (trackingEntity.hasComponent(this.component)) {
            trackingTweenable = trackingEntity.getComponent(this.component);
          }
        } else {
          //log not found but expected!?!?!
        }
      }

      //for now 1.x will not change speed function
      const speed = tweenable.speed / 10;

      this.updateApply(
        dt,
        entity,
        tweenable,
        transform,
        speed,
        trackingEntity,
        trackingTransform!,
        trackingTweenable
      );

      //if done evict from cache
      //TODO dont evict if in infinite loop
      //TODO must handle when a tween is replaced by a new tween cleanup stuff
      if (trackingEntity && tweenable.transition >= 1) {
        ENTITY_CACHE_BY_NAME_MAP.delete(tweenable.targetOfInterest);
      }
    }
  }
  // this method exists so that each system can implement their own logic
  // having everything in the base class method in a switch statement was not great coding practices
  updateApply(
    dt: number,
    entity: IEntity,
    tweenable: any,
    transform: Transform,
    speed: number,
    trackingEntity: any,
    trackingTransform: Transform,
    trackingTweenable: any
  ) {
    throw new Error("Method not implemented."); //expects to be overridden
  }
}

//concreatly instantiating each system incase i want to overload methods
export class TweenSystemMove extends TweenSystem<TweenableMove> {
  constructor() {
    super(TweenableMove);
    log("TweenSystemMove.contructor() called");
  }
  getClassName(): string {
    //if minified not sure can trust this?!?!
    return "TweenSystemMove"; //this.constructor.name
  }
  removeComponent(entity: IEntity) {
    super.removeComponent(entity);
    if (entity.hasComponent(PathData)) entity.removeComponent(PathData);
    if (entity.hasComponent(RotateData)) entity.removeComponent(RotateData);
    if (entity.hasComponent(TweenableMoveMetaData))
      entity.removeComponent(TweenableMoveMetaData);
  }
  //START MOVE SYSTEM
  updateApply(
    dt: number,
    entity: IEntity,
    tweenable: any,
    transform: Transform,
    speed: number,
    trackingEntity: any,
    trackingTransform: Transform,
    trackingTweenable: any
  ) {
    const METHOD_NAME = "updateApply";

    switch (tweenable.type) {
      case "move": {
        const start = tweenable.origin;
        //TODO switch to using computeMoveVector however must convert x,y,z to vector objects
        if (tweenable.trackingType && tweenable.trackingType != "current") {
          if (trackingTweenable && tweenable.trackingType == "meet") {
            //TODO move 'meet' to invoker???
            const end = new Vector3(
              trackingTweenable.x,
              trackingTweenable.y,
              trackingTweenable.z
            );
            const endDest = computeMoveVector(
              start,
              end,
              tweenable.lockX,
              tweenable.lockY,
              tweenable.lockZ,
              tweenable.percentOfDistanceToTravel,
              tweenable.moveNoCloserThan
            );

            tweenable.x = endDest.x;
            tweenable.y = endDest.y;
            tweenable.z = endDest.z;
          } else if (tweenable.trackingType == "follow") {
            tweenable.trackingCounter += dt;

            if (
              trackingTransform ||
              (tweenable.targetOfInterestType == "player" &&
                tweenable.trackingCounter >= tweenable.trackingInterval)
            ) {
              tweenable.trackingCounter = 0; // reset counter

              let end = undefined;
              if (trackingTransform) {
                end = new Vector3().copyFrom(trackingTransform.position); //is copy required? flyweight for vector storage?
              } else if (tweenable.targetOfInterestType == "player") {
                if (tweenable.targetOfInterest == tweenable.channel.id) {
                  //TODO add if tracking player update camera position
                  end = new Vector3().copyFrom(player.position); //is copy required? flyweight for vector storage?
                } else {
                  //not me must hope for a sync
                }
              }

              const endDest = computeMoveVector(
                start,
                end!,
                tweenable.lockX,
                tweenable.lockY,
                tweenable.lockZ,
                tweenable.percentOfDistanceToTravel,
                tweenable.moveNoCloserThan
              );

              tweenable.x = endDest.x;
              tweenable.y = endDest.y;
              tweenable.z = endDest.z;

              //keep updating origin for smooth follow?
              //TODO why does move require setting this but not rotateq?
              if (tweenable.repeatAction == "relative") {
                if (
                  !tweenable.origin ||
                  tweenable.origin === undefined ||
                  !(tweenable.origin instanceof Vector3)
                ) {
                  //check not needed cuz known use case is caused by sync and sync handles? leave to be safe?
                  tweenable.origin = new Vector3().copyFrom(transform.position);
                } else {
                  tweenable.origin.copyFrom(transform.position);
                }
              }
            }
          }
        }

        const offset = offsetFactory(tweenable, start);
        const end = new Vector3(offset("x"), offset("y"), offset("z"));

        if (tweenable.transition >= 0 && tweenable.transition < 1) {
          tweenable.transition += dt * speed;

          let easingIndex = 0;
          if (
            tweenable.repeatAction == "relative" &&
            tweenable.trackingType &&
            tweenable.trackingType == "follow"
          ) {
            //when doing follow should not be on a curve
            easingIndex = dt * speed; //because origin is copied in each frame, we only need to lerp the delta
          } else {
            easingIndex = easingConverter(
              tweenable.transition,
              tweenable.curve
            );
          }

          transform.position.copyFrom(Vector3.Lerp(start, end, easingIndex));
        } else if (tweenable.transition >= 1) {
          if (this.logger.isDebugEnabled())
            this.logger.debug(
              METHOD_NAME,
              tweenable.type +
                " " +
                entity.uuid +
                " ended; repeatAction:" +
                tweenable.repeatAction +
                " relative" +
                tweenable.relative,
              null
            );

          if (!tweenable.repeatAction || tweenable.repeatAction == "none") {
            tweenable.transition = -1;
            transform.position.copyFrom(end);
            this.removeComponent(entity);

            // send actions
            tweenable.channel.sendActions(tweenable.onComplete);
          } else {
            //tweenable.trackingCounter = 0

            if (tweenable.targetOfInterestType == "player") {
              if (tweenable.targetOfInterest == tweenable.channel.id) {
                //TODO add if tracking player update camera position
                //send sync action for new position
              } else {
                //not me must hope for a sync
              }
            }

            if (tweenable.repeatAction == "relative") {
              //log("move relative loop starting again")
              const origPos: Vector3 = tweenable.origin;

              //mutate end and start
              tweenable.origin = transform.position.clone();

              //should scale relative to the diff between last orig and now

              if (!tweenable.relative && tweenable.trackingType != "follow") {
                tweenable.x += tweenable.x - origPos.x;
                tweenable.y += tweenable.y - origPos.y;
                tweenable.z += tweenable.z - origPos.z;
              } //else relative and no need to modify values

              //go back to 0 and if over shot etc. adjusts so its smooth
              tweenable.transition = tweenable.transition - 1;
            } else if (tweenable.repeatAction == "reverse") {
              //go back to 0 and if over shot etc. adjusts so its smooth and keeps in sync
              tweenable.transition = tweenable.transition - 1;
              transform.position.copyFrom(end);

              //mutate end and start
              let origPos: Vector3 = tweenable.origin;
              tweenable.origin = end.clone();

              if (!tweenable.relative) {
                tweenable.x = origPos.x;
                tweenable.y = origPos.y;
                tweenable.z = origPos.z;
              } else {
                //is relative so just invert values
                tweenable.x *= -1;
                tweenable.y *= -1;
                tweenable.z *= -1;
              }
            } else {
              //repeat abs
              //go back to 0 and if over shot etc. adjusts so its smooth and keeps in sync
              tweenable.transition = tweenable.transition - 1;
            }
          }
        }
        break;
      }
      case "follow-path": {
        //const start = tweenable.originQ
        //const end = new Quaternion(tweenable.x, tweenable.y, tweenable.z,tweenable.w)

        //TODO adjust speed to match norms.  so divide speed additionally by segment count
        //that way speed is normalized for all actions

        if (tweenable.transition >= 0 && tweenable.transition < 1) {
          //tweenable.transition += dt * speed //DT MUST PLAY ROLE OR WE GET OUT OF SYNC
          //segments / time to complete??? does dt play into this? should it?
          //need to decide where in the path count i am + subfraction
          let easingIndex = easingConverter(
            tweenable.transition,
            tweenable.curve
          );
          //TODO figure out how to use easing curve as part of path fraction
          let path: PathData | undefined = undefined; //entity.getComponent(PathData)

          if (entity.hasComponent(PathData)) {
            path = entity.getComponent(PathData);

            //log("follow-path " + tweenable.transition + " " +  path.target  + "/"  + path.path.length + " " + tweenable.transition + " dt " + dt + " speed:" + speed + " path.fraction" + path.fraction )

            let pathSpeed: number = speed; //TODO use class PathSpeed
            //speed = shark.getComponent(SwimSpeed)
            //log("followItemPath move lerping")
            if (true) {
              //if (path.fraction < 1) {
              transform.position = Vector3.Lerp(
                path.path[path.origin],
                path.path[path.target],
                path.fraction
              );
              path.fraction += pathSpeed / 10; //times DT?
            }
            if (path.fraction > 1) {
              //let sqDistOrigins = Vector3.Distance(path.originVector, path.path[path.origin])

              //log("follow-path next segment origin " + path.originVector + " sqDist" + sqDistOrigins + " "  + tweenable.transition + " " +  path.target  + "/"  + path.path.length + "; " + path.path[path.origin] + ">" + path.path[path.target])
              path.origin = path.target;
              path.target += 1;
              if (path.target >= path.path.length - 1) {
                //go back to first target
                path.target = 0;
              }
              if (path.target == path.start) {
                //if repeat enabled? do that?
                if (
                  !tweenable.repeatAction ||
                  tweenable.repeatAction == "none"
                ) {
                  tweenable.transition = 1;
                  // send actions
                  tweenable.channel.sendActions(tweenable.onComplete);
                } else {
                  let verifyTargetInBounced = false;
                  if (tweenable.repeatAction == "relative") {
                    //will not be a thing since it has explicit points
                  } else if (tweenable.repeatAction == "reverse") {
                    log(
                      "reverse old values " +
                        path.path.length +
                        " " +
                        path.start +
                        " target" +
                        path.target
                    );
                    //TODO reverse curve points and reset counter
                    //reset counter
                    path.path = path.path.reverse();
                    //path.start = (path.path.length - 1) - path.start

                    path.origin = path.start;
                    path.target = path.origin + 1;

                    verifyTargetInBounced = true;
                    log("new start " + path.start + " target" + path.target);
                  } else {
                    //repeat abs
                    //reset counter
                    path.origin = path.start;
                    path.target = path.origin + 1;

                    verifyTargetInBounced = true;

                    transform.position = path.path[path.origin].clone();
                  }

                  if (
                    verifyTargetInBounced &&
                    path.target >= path.path.length - 1
                  ) {
                    //go back to first target
                    path.target = 0;
                  }
                }
              }
              path.fraction = path.fraction - 1; //smooth transition dont loose parts of the fraction
            }

            // Rotate gradually with a spherical lerp
            let rotate = null;
            if (entity.hasComponent(RotateData)) {
              rotate = entity.getComponent(RotateData);
              rotate.fraction += pathSpeed / 10; //times DT?

              if (rotate.fraction > 1) {
                rotate.fraction = rotate.fraction - 1; //smooth transition dont loose parts of the fraction
                rotate.originRot = transform.rotation;

                //log("followItemPath rot lerping  " + " " + path.path[path.target] + " " + path.path[path.origin])

                let direction = path.path[path.target]
                  .subtract(path.path[path.origin])
                  .normalize();
                rotate.targetRot = Quaternion.LookRotation(direction);

                if (rotate.lockX) rotate.targetRot.x = rotate.startingRot.x;
                if (rotate.lockY) rotate.targetRot.y = rotate.startingRot.y;
                if (rotate.lockZ) rotate.targetRot.z = rotate.startingRot.z;
                if (rotate.lockW) rotate.targetRot.w = rotate.startingRot.w; //if using euler dont set W use urler rotation
              }
              //log("followItemPath rot slerping  " + " " + rotate.originRot + " " + rotate.targetRot)
              if (rotate.originRot && rotate.targetRot) {
                transform.rotation = Quaternion.Slerp(
                  rotate.originRot,
                  rotate.targetRot,
                  rotate.fraction
                );
              } else {
                //should it be blank off the bat?
                //blank before moving first segment normal?
              }
            }

            //}
          } else {
            log("followItemPath not path yet");
          }
        } else if (tweenable.transition >= 1) {
          if (this.logger.isDebugEnabled())
            this.logger.debug(
              METHOD_NAME,
              tweenable.type +
                " " +
                entity.uuid +
                " ended; repeatAction:" +
                tweenable.repeatAction,
              null
            );

          if (!tweenable.repeatAction || tweenable.repeatAction == "none") {
            tweenable.transition = -1;
            //transform.rotation.copyFrom(end)
            this.removeComponent(entity);

            // send actions
            tweenable.channel.sendActions(tweenable.onComplete);
          } else {
            //go back to 0 and if over shot etc. adjusts so its smooth and keeps in sync
            tweenable.transition = tweenable.transition - 1;
          }
        }
        break;
      }
    }
  } //END MOVE SYSTEM
}
export class TweenSystemRotate extends TweenSystem<TweenableRotate> {
  constructor() {
    super(TweenableRotate);
    log("TweenSystemRotate.contructor() called");
  }
  getClassName(): string {
    //if minified not sure can trust this?!?!
    return "TweenSystemRotate"; //this.constructor.name
  }
  removeComponent(entity: IEntity) {
    super.removeComponent(entity);
    if (entity.hasComponent(TweenableRotateMetaData))
      entity.removeComponent(TweenableRotateMetaData);
  }
  //START ROTATE SYSTEM
  updateApply(
    dt: number,
    entity: IEntity,
    tweenable: any,
    transform: Transform,
    speed: number,
    trackingEntity: any,
    trackingTransform: Transform,
    trackingTweenable: any
  ) {
    const METHOD_NAME = "updateApply";
    switch (tweenable.type) {
      case "rotate": {
        if (tweenable.trackingType && tweenable.trackingType != "current") {
          if (trackingTweenable && tweenable.trackingType == "meet") {
            if (!tweenable.lockX) tweenable.x = trackingTweenable.x;
            if (!tweenable.lockY) tweenable.y = trackingTweenable.y;
            if (!tweenable.lockZ) tweenable.z = trackingTweenable.z;
          } else if (trackingTransform && tweenable.trackingType == "follow") {
            const eulerAngles = trackingTransform.rotation.eulerAngles;
            if (!tweenable.lockX) tweenable.x = eulerAngles.x;
            if (!tweenable.lockY) tweenable.y = eulerAngles.y;
            if (!tweenable.lockZ) tweenable.z = eulerAngles.z;

            //keep updating origin for smooth follow?!?!
          }
        }
        const start = Quaternion.Euler(
          tweenable.origin.x,
          tweenable.origin.y,
          tweenable.origin.z
        );
        const end = start.multiply(
          Quaternion.Euler(tweenable.x, tweenable.y, tweenable.z)
        );

        if (tweenable.transition >= 0 && tweenable.transition < 1) {
          tweenable.transition += dt * speed;
          let easingIndex = easingConverter(
            tweenable.transition,
            tweenable.curve
          );
          transform.rotation.copyFrom(
            Quaternion.Slerp(start, end, easingIndex)
          );
        } else if (tweenable.transition >= 1) {
          if (this.logger.isDebugEnabled())
            this.logger.debug(
              METHOD_NAME,
              tweenable.type +
                " " +
                entity.uuid +
                " ended; repeatAction:" +
                tweenable.repeatAction,
              null
            );

          if (!tweenable.repeatAction || tweenable.repeatAction == "none") {
            tweenable.transition = -1;
            transform.rotation.copyFrom(end);
            this.removeComponent(entity);

            // send actions
            tweenable.channel.sendActions(tweenable.onComplete);
          } else {
            if (tweenable.repeatAction == "relative") {
              //mutate end and start
              let rotEuler: Vector3 = transform.rotation.clone().eulerAngles;
              tweenable.origin = rotEuler;
              //go back to 0 and if over shot etc. adjusts so its smooth
              tweenable.transition = tweenable.transition - 1;
            } else if (tweenable.repeatAction == "reverse") {
              //go back to 0 and if over shot etc. adjusts so its smooth and keeps in sync
              tweenable.transition = tweenable.transition - 1;
              transform.rotation.copyFrom(end);

              //log("rotate repeat before" + tweenable.origin.x + " " + tweenable.origin.y + " " + tweenable.origin.z
              //  + " vs " + tweenable.x + " " + tweenable.y + " " + tweenable.z)

              //mutate end and start
              tweenable.origin = end.clone().eulerAngles;

              //euler rotation is relative so just negate it
              tweenable.x = tweenable.x * -1;
              tweenable.y = tweenable.y * -1;
              tweenable.z = tweenable.z * -1;

              //log("rotate repeat after" + tweenable.origin.x + " " + tweenable.origin.y + " " + tweenable.origin.z
              //  + " vs " + tweenable.x + " " + tweenable.y + " " + tweenable.z)
            } else {
              //repeat abs
              //go back to 0 and if over shot etc. adjusts so its smooth and keeps in sync
              tweenable.transition = tweenable.transition - 1;
            }
          }
        }
        break;
      }
      case "rotate-q": {
        if (tweenable.trackingType && tweenable.trackingType != "current") {
          if (trackingTweenable && tweenable.trackingType == "meet") {
            let lookAtTarget = new Vector3(
              trackingTweenable.x,
              trackingTweenable.y,
              trackingTweenable.z
            ); //flyweight to avoid new object each time?
            let endRotation: Quaternion = computeFaceAngle(
              lookAtTarget,
              transform,
              tweenable.lockMode,
              tweenable.lockX,
              tweenable.lockY,
              tweenable.lockZ
            );
            tweenable.x = endRotation.x;
            tweenable.y = endRotation.y;
            tweenable.z = endRotation.z;
            tweenable.w = endRotation.w;
          } else if (tweenable.trackingType == "follow") {
            tweenable.trackingCounter += dt;

            if (
              trackingTransform ||
              (tweenable.targetOfInterestType == "player" &&
                tweenable.trackingCounter >= tweenable.trackingInterval)
            ) {
              tweenable.trackingCounter = 0; // reset counter
              let lookAtTarget = undefined; //new Vector3().copyFrom(trackingTransform.position)

              if (trackingTransform) {
                lookAtTarget = new Vector3().copyFrom(
                  trackingTransform.position
                ); //is copy required? flyweight for vector storage?
              } else if (tweenable.targetOfInterestType == "player") {
                if (tweenable.targetOfInterest == tweenable.channel.id) {
                  //TODO add if tracking player update camera position
                  lookAtTarget = new Vector3().copyFrom(player.position); //is copy required? flyweight for vector storage?
                } else {
                  //not me must hope for a sync
                }
              }

              let endRotation: Quaternion = computeFaceAngle(
                lookAtTarget!,
                transform,
                tweenable.lockMode,
                tweenable.lockX,
                tweenable.lockY,
                tweenable.lockZ
              );
              tweenable.x = endRotation.x;
              tweenable.y = endRotation.y;
              tweenable.z = endRotation.z;
              tweenable.w = endRotation.w;

              //keep syncing origin for smooth follow???
              //TODO why does move require setting this but not rotateq?
              //its cuz computeFaceAngle takes object itself instead of a copied var of position/rotate
              //if(tweenable.repeatAction == 'relative'){
              //tweenable.originQ = transform.rotation
              //}
            }
          }
        }
        //log("rotate-q " + tweenable.transition +  " "  + tweenable.destPosition +  " " + tweenable.x +  " " + tweenable.y +  " " + tweenable.z +  " " + tweenable.w)
        const start = tweenable.originQ; //
        const end = new Quaternion(
          tweenable.x,
          tweenable.y,
          tweenable.z,
          tweenable.w
        );

        if (tweenable.transition >= 0 && tweenable.transition < 1) {
          tweenable.transition += dt * speed;

          let easingIndex = 0;
          if (
            tweenable.repeatAction == "relative" &&
            tweenable.trackingType &&
            tweenable.trackingType == "follow" &&
            tweenable.targetOfInterestType != "player"
          ) {
            //when doing follow should not be on a curve
            easingIndex = dt * speed;
          } else {
            easingIndex = easingConverter(
              tweenable.transition,
              tweenable.curve
            );
          }

          transform.rotation.copyFrom(
            Quaternion.Slerp(start, end, easingIndex)
          );
        } else if (tweenable.transition >= 1) {
          if (this.logger.isDebugEnabled())
            this.logger.debug(
              METHOD_NAME,
              tweenable.type +
                " " +
                entity.uuid +
                " ended; repeatAction:" +
                tweenable.repeatAction,
              null
            );

          if (!tweenable.repeatAction || tweenable.repeatAction == "none") {
            tweenable.transition = -1;
            transform.rotation.copyFrom(end);
            this.removeComponent(entity);

            // send actions
            tweenable.channel.sendActions(tweenable.onComplete);
          } else {
            if (tweenable.targetOfInterestType == "player") {
              if (tweenable.targetOfInterest == tweenable.channel.id) {
                //TODO add if tracking player update camera position
                //send sync action for new position
              } else {
                //not me must hope for a sync
              }
            }
            if (tweenable.repeatAction == "relative") {
              //log("move relative loop starting again")
              //mutate end and start
              tweenable.originQ = transform.rotation.clone(); //clone not needed? but does it hurt?
              //go back to 0 and if over shot etc. adjusts so its smooth
              tweenable.transition = tweenable.transition - 1;
            } else {
              //repeat abs
              //go back to 0 and if over shot etc. adjusts so its smooth and keeps in sync
              tweenable.transition = tweenable.transition - 1;
            }
          }
        }
        break;
      }
    }
  } //END ROTATE SYSTEM
}
export class TweenSystemScale extends TweenSystem<TweenableScale> {
  constructor() {
    super(TweenableScale);
    log("TweenSystemScale.contructor() called");
  }
  getClassName(): string {
    //if minified not sure can trust this?!?!
    return "TweenSystemScale"; //this.constructor.name
  }
  removeComponent(entity: IEntity) {
    super.removeComponent(entity);
    if (entity.hasComponent(TweenableScaleMetaData))
      entity.removeComponent(TweenableScaleMetaData);
  }
  //START SCALE SYSTEM
  updateApply(
    dt: number,
    entity: IEntity,
    tweenable: any,
    transform: Transform,
    speed: number,
    trackingEntity: any,
    trackingTransform: Transform,
    trackingTweenable: any
  ) {
    const METHOD_NAME = "updateApply";

    if (tweenable.trackingType && tweenable.trackingType != "current") {
      if (tweenable.trackingType == "meet" && trackingTweenable) {
        tweenable.x = trackingTweenable.x;
        tweenable.y = trackingTweenable.y;
        tweenable.z = trackingTweenable.z;
      } else if (tweenable.trackingType == "follow" && trackingTransform) {
        tweenable.x = trackingTransform.scale.x;
        tweenable.y = trackingTransform.scale.y;
        tweenable.z = trackingTransform.scale.z;
      }
    }
    const start = tweenable.origin;
    const offset = offsetFactory(tweenable, start);
    const end = new Vector3(offset("x"), offset("y"), offset("z"));

    if (tweenable.transition >= 0 && tweenable.transition < 1) {
      tweenable.transition += dt * speed;
      let easingIndex = easingConverter(tweenable.transition, tweenable.curve);
      transform.scale.copyFrom(Vector3.Lerp(start, end, easingIndex));
    } else if (tweenable.transition >= 1) {
      if (this.logger.isDebugEnabled())
        this.logger.debug(
          METHOD_NAME,
          tweenable.type +
            " " +
            entity.uuid +
            " ended; repeatAction:" +
            tweenable.repeatAction,
          null
        );

      if (!tweenable.repeatAction || tweenable.repeatAction == "none") {
        tweenable.transition = -1;
        transform.scale.copyFrom(end);
        this.removeComponent(entity);

        // send actions
        tweenable.channel.sendActions(tweenable.onComplete);
      } else {
        if (tweenable.repeatAction == "relative") {
          let origScale: Vector3 = tweenable.origin;

          //mutate end and start
          //RISK never stopping getting too big
          tweenable.origin = transform.scale.clone();

          //should scale relative to the diff between last orig and now
          tweenable.x += tweenable.x - origScale.x;
          tweenable.y += tweenable.y - origScale.y;
          tweenable.z += tweenable.z - origScale.z;

          //go back to 0 and if over shot etc. adjusts so its smooth
          tweenable.transition = tweenable.transition - 1;
        } else if (tweenable.repeatAction == "reverse") {
          //go back to 0 and if over shot etc. adjusts so its smooth and keeps in sync
          tweenable.transition = tweenable.transition - 1;
          transform.scale.copyFrom(end);

          //log("scale reverse before" + tweenable.origin.x + " " + tweenable.origin.y + " " + tweenable.origin.z
          //  + " vs " + tweenable.x + " " + tweenable.y + " " + tweenable.z)

          //mutate end and start
          let origScale: Vector3 = tweenable.origin;
          tweenable.origin = end.clone();

          tweenable.x = origScale.x;
          tweenable.y = origScale.y;
          tweenable.z = origScale.z;

          //log("scale reverse after" + tweenable.origin.x + " " + tweenable.origin.y + " " + tweenable.origin.z
          //  + " vs " + tweenable.x + " " + tweenable.y + " " + tweenable.z)
        } else {
          //repeat abs
          //go back to 0 and if over shot etc. adjusts so its smooth and keeps in sync
          tweenable.transition = tweenable.transition - 1;
        }
      }
    }
  } //END SCALE SYSTEM
}

//"out" means towards beginning
//"in" means towards end
//https://easings.net/
export enum CurveType {
  LINEAR = "linear",

  INSTANTANEOUS_OUT = "instantaneous-out", //is upfront
  INSTANTANEOUS_IN = "instantaneous-in", //is at end

  EASEINSINE = "easeinsine",
  EASEOUTSINE = "easeoutsine",
  EASEINOUTSINE = "easeinoutsine",

  EASEINQUADRATIC = "easeinquadratic",
  EASEOUTQUADRATIC = "easeoutquadratic",
  EASEINOUTQUADRATIC = "easeinoutquadratic",

  EASEINCUBIC = "easeincubic",
  EASEOUTCUBIC = "easeoutcubic",
  EASEINOUTCUBIC = "easeinoutcubic",

  EASEINEXPO = "easeinexpo",
  EASEOUTEXPO = "easeoutexpo",
  EASEINOUTEXPO = "easeinoutexpo",

  EASEINELASTIC = "easeinelastic",
  EASEOUTELASTIC = "easeoutelastic",
  EASEINOUTELASTIC = "easeinoutelastic",

  EASEINBOUNCE = "easeinbounce",
  EASEOUTEBOUNCE = "easeoutbounce",
  EASEINOUTBOUNCE = "easeinoutbounce",
}

export function easingConverter(x: number, curveType: CurveType) {
  switch (curveType) {
    case CurveType.LINEAR:
      return x;
      break;
    case CurveType.INSTANTANEOUS_IN:
      return 1;
      break;
    case CurveType.INSTANTANEOUS_OUT:
      if (x >= 1) {
        return 1;
      } else {
        return 0;
      }
      break;
    case CurveType.EASEINSINE:
      return 1 - Math.cos((x * Math.PI) / 2);
      break;
    case CurveType.EASEOUTSINE:
      return Math.sin((x * Math.PI) / 2);
      break;
    case CurveType.EASEINOUTSINE:
      return -(Math.cos(Math.PI * x) - 1) / 2;
      break;
    case CurveType.EASEINQUADRATIC:
      return x * x;
      break;
    case CurveType.EASEOUTQUADRATIC:
      return 1 - (1 - x) * (1 - x);
      break;
    case CurveType.EASEINOUTQUADRATIC:
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
      break;

    case CurveType.EASEINCUBIC:
      return x * x * x;
      break;
    case CurveType.EASEOUTCUBIC:
      return 1 - Math.pow(1 - x, 3);
      break;
    case CurveType.EASEINOUTCUBIC:
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
      break;
    case CurveType.EASEINEXPO:
      return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
      break;
    case CurveType.EASEOUTEXPO:
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
      break;
    case CurveType.EASEINOUTEXPO:
      return x === 0
        ? 0
        : x === 1
        ? 1
        : x < 0.5
        ? Math.pow(2, 20 * x - 10) / 2
        : (2 - Math.pow(2, -20 * x + 10)) / 2;
      break;

    case CurveType.EASEINELASTIC:
      const c4 = (2 * Math.PI) / 3;

      return x === 0
        ? 0
        : x === 1
        ? 1
        : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
      break;
    case CurveType.EASEOUTELASTIC:
      const c5 = (2 * Math.PI) / 3;

      return x === 0
        ? 0
        : x === 1
        ? 1
        : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c5) + 1;
      break;

    case CurveType.EASEINOUTELASTIC:
      const c6 = (2 * Math.PI) / 4.5;

      return x === 0
        ? 0
        : x === 1
        ? 1
        : x < 0.5
        ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c6)) / 2
        : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c6)) / 2 +
          1;
      break;

    case CurveType.EASEINBOUNCE:
      return 1 - bounce(1 - x);
      break;
    case CurveType.EASEOUTEBOUNCE:
      return bounce(x);
      break;
    case CurveType.EASEINOUTBOUNCE:
      return x < 0.5
        ? (1 - bounce(1 - 2 * x)) / 2
        : (1 + bounce(2 * x - 1)) / 2;
      break;
  }
}

function bounce(x: number) {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
}
