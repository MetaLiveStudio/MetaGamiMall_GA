/**
 * Component to rotate entity indefinitely until stop is called
 * @public
 */

import { ITransformComponent, TransformSystem } from "@dcl/ecs-scene-utils";

@Component("keepFloatingComponent")
export class KeepFloatingComponent implements ITransformComponent {
  onFinishCallback?: () => void;

  //private rotationVelocity: Quaternion
  //private rotation: Quaternion
  private finished: boolean;

  private elapsed: number = 0;
  private speed: number = 1;
  private amplitude: number = 5;
  private defaultY: number = 1;

  /**
   *
   * @param _amplitude
   * @param _speed - how fast to do one full float (up then down) per second
   * @param _defaultY - where to start
   * @param onFinishCallback
   */
  constructor(
    _amplitude: number,
    _speed: number,
    _defaultY?: number,
    onFinishCallback?: () => void
  ) {
    this.amplitude = _amplitude;
    this.defaultY = _defaultY ? _defaultY : 0;
    this.speed = _speed;

    this.onFinishCallback = onFinishCallback;

    this.finished = false;

    let instance = TransformSystem.createAndAddToEngine();
    instance.addComponentType(KeepFloatingComponent);
  }

  update(dt: number): void {
    //const transform = obj.getComponent(Transform)
    //const floatInfo = obj.getComponent(KeepFloatingComponent)

    this.elapsed += dt * ((1 / this.speed) * Math.PI) * 2;
    /*
     this.rotation = Quaternion.Slerp(
       Quaternion.Identity,
       this.rotationVelocity,
       dt
     )*/
  }

  hasFinished(): boolean {
    return this.finished;
  }

  assignValueToTransform(transform: Transform): void {
    transform.position.y =
      this.defaultY + Math.sin(this.elapsed) * this.amplitude;
  }

  stop() {
    this.finished = true;
  }
}
