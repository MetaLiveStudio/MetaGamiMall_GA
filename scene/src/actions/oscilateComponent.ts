/**
 * Component to rotate entity indefinitely until stop is called
 * @public
 */

import {
  Interpolate,
  InterpolationType,
  ITransformComponent,
  TransformSystem,
} from "@dcl/ecs-scene-utils";

export enum OscilateCycleType {
  MIRROR,
  REVERSE,
}

@Component("oscilateComponent")
export class OscilateComponent implements ITransformComponent {
  private start: ReadOnlyVector3;
  private end: ReadOnlyVector3;
  private oscilationDuration: number;
  private onReturn: boolean = false;
  private finished: boolean;
  private paused: boolean = false;
  private interpolationType: InterpolationType;
  private lerpTime: number;
  private cycleType: OscilateCycleType;

  onFinishCallback?: () => void;
  onPointReachedCallback?: (
    currentPoint: ReadOnlyVector3,
    nextPoint: ReadOnlyVector3
  ) => void;

  private timePast: number = 0;
  private lerpPos: ReadOnlyVector3;

  /**
   * @param start
   * @param end
   * @param oscilationDuration - how fast to do one oscilation (up then down) in seconds
   * @param onFinishCallback
   * @param interpolationType
   */
  constructor(
    start: ReadOnlyVector3,
    end: ReadOnlyVector3,
    oscilationDuration: number,
    onFinishCallback?: () => void,
    onPointReachedCallback?: (
      currentPoint: ReadOnlyVector3,
      nextPoint: ReadOnlyVector3
    ) => void,
    interpolationType: InterpolationType = InterpolationType.LINEAR,
    cycleType: OscilateCycleType = OscilateCycleType.MIRROR
  ) {
    this.oscilationDuration = oscilationDuration;

    this.onFinishCallback = onFinishCallback;
    this.onPointReachedCallback = onPointReachedCallback;

    this.start = start;
    this.end = end;

    this.finished = false;
    this.lerpTime = 0;

    this.interpolationType = interpolationType;
    this.cycleType = cycleType;

    let instance = TransformSystem.createAndAddToEngine();
    instance.addComponentType(OscilateComponent);

    this.lerpPos = Vector3.Lerp(this.start, this.end, this.lerpTime);
  }

  update(dt: number): void {
    if (this.paused) return;

    this.timePast += dt;

    let pingPongTimeNormalized;

    if (this.cycleType == OscilateCycleType.MIRROR) {
      //when reaches half oscilationDuration time, flip direction
      if (this.timePast > this.oscilationDuration / 2) {
        this.onReturn = !this.onReturn;
        if (this.onPointReachedCallback)
          this.onPointReachedCallback(this.end, this.start);

        this.timePast -= this.oscilationDuration / 2;

        const tmp = this.start;
        this.start = this.end;
        this.end = tmp;
      }

      //bounce between 0 and 0
      pingPongTimeNormalized = Scalar.Normalize(
        this.timePast,
        0,
        this.oscilationDuration / 2
      );
    } else {
      //REVERSE
      let notifyChange = false;
      //when reaches half oscilationDuration time, flip direction
      if (this.timePast > this.oscilationDuration) {
        //this captures a full cycle up then down before of ping pong
        this.timePast -= this.oscilationDuration;

        notifyChange = true;

        //halfway
      } else if (
        this.timePast > this.oscilationDuration / 2 &&
        !this.onReturn
      ) {
        notifyChange = true;
      }

      if (notifyChange) {
        //need to track the halfway point
        this.onReturn = !this.onReturn;
        if (this.onPointReachedCallback) {
          if (this.onReturn) {
            this.onPointReachedCallback(this.end, this.start);
          } else {
            this.onPointReachedCallback(this.start, this.end);
          }
        }
      }

      //bounce between 0 and duration
      const pingPongTime = Scalar.PingPong(
        this.timePast,
        this.oscilationDuration / 2
      );

      //0-1
      pingPongTimeNormalized = pingPongTime / (this.oscilationDuration / 2);
    }

    //0-1 for lerp interpolated
    this.lerpTime = Interpolate(this.interpolationType, pingPongTimeNormalized);

    this.lerpPos = Vector3.Lerp(this.start, this.end, this.lerpTime);
  }

  hasFinished(): boolean {
    return this.finished;
  }

  assignValueToTransform(transform: Transform): void {
    if (this.paused) return;
    transform.position.copyFrom(this.lerpPos);
  }

  stop() {
    this.finished = true;
  }
  pause() {
    this.paused = true;
  }
  toggle(val?: boolean) {
    this.paused = val !== undefined ? val : !this.paused;
  }
}
