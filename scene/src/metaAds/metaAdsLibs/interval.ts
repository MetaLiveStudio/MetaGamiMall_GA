export interface ITimerComponent {
  elapsedTime: number
  targetTime: number
  onTargetTimeReached: (ownerEntity: IEntity) => void
}

export class TimerSystem implements ISystem {
  private static _instance: TimerSystem | null = null

  private readonly _components: ComponentConstructor<ITimerComponent>[] = []

  static createAndAddToEngine (): TimerSystem {
    if (this._instance == null) {
      this._instance = new TimerSystem()
      engine.addSystem(this._instance)
    }
    return this._instance
  }

  static registerCustomComponent <T extends ITimerComponent> (
    component: ComponentConstructor<T>
  ): void {
    this.createAndAddToEngine()._components.push(component)
  }

  public addComponentType (component: ComponentConstructor<ITimerComponent>): void {
    for (const comp of this._components) {
      if (component === comp) {
        return
      }
    }
    this._components.push(component)
  }

  private constructor () {
    TimerSystem._instance = this
  }

  update (dt: number): void {
    this._components.forEach(component => {
      this.updateComponent(dt, component)
    })
  }

  private updateComponent <T extends ITimerComponent>(
    dt: number,
    component: ComponentConstructor<T>
  ): void {
    const record = engine.getEntitiesWithComponent(component)

    for (const key in record) {
      if (record.hasOwnProperty(key)) {
        const entity = record[key]
        const timerComponent = entity.getComponent(component)

        timerComponent.elapsedTime += dt
        if (timerComponent.elapsedTime >= timerComponent.targetTime) {
          timerComponent.onTargetTimeReached(entity)
        }
      }
    }
  }
}

@Component('timerInterval')
export class Interval implements ITimerComponent {
  elapsedTime: number
  targetTime: number
  onTargetTimeReached: (ownerEntity: IEntity) => void

  private onTimeReachedCallback?: () => void

  constructor (millisecs: number, onTimeReachedCallback?: () => void) {
    const instance = TimerSystem.createAndAddToEngine()
    instance.addComponentType(Interval)

    this.elapsedTime = 0
    this.targetTime = millisecs / 1000
    this.onTimeReachedCallback = onTimeReachedCallback
    this.onTargetTimeReached = () => {
      this.elapsedTime = 0
      if (this.onTimeReachedCallback) this.onTimeReachedCallback()
    }
  }

  setCallback (onTimeReachedCallback: () => void): any {
    this.onTimeReachedCallback = onTimeReachedCallback
  }
}
