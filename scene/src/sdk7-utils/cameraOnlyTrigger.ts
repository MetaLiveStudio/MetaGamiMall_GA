import { getWorldPosition, getWorldRotation } from '@dcl-sdk/utils'
import { areAABBIntersecting, areAABBSphereIntersecting, areSpheresIntersecting } from '@dcl-sdk/utils/dist/math'
import { engine, Entity, IEngine, MeshRenderer, Schemas, Transform, Material, DeepReadonly, EntityState } from '@dcl/sdk/ecs'
import { Vector3, Color4, Color3 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'

//CUSTOMIZED FROM https://github.com/decentraland/sdk7-utils/blob/main/src/trigger.ts
//only checks the camera to other entities. 
//it should reduce complexity from n^2 to n
//also gave system higher priority

//DONE can we reduce object waste? like creating empty sets that do nothing?
//TODO look at https://github.com/decentraland/decentraland-ecs-utils/blob/master/src/triggers/triggerSystem.ts#L116C1-L116C1
//    and see how it was optimized to know if need to check camera vs not camera, can we do that?
//TODO can this be merged into the main with a "camera only trigger" flag

const EMPTY_SET: Set<Entity> = new Set()

EMPTY_SET.add = (entity:Entity) => { debugger; throw new Error("EMPTY_SET is read only") }
EMPTY_SET.delete = (entity:Entity) => { throw new Error("EMPTY_SET is read only") }
EMPTY_SET.has = (entity:Entity) => {return false}

//import { priority } from './priority'

export const LAYER_1 = 1
export const LAYER_2 = 2
export const LAYER_3 = 4
export const LAYER_4 = 8
export const LAYER_5 = 16
export const LAYER_6 = 32
export const LAYER_7 = 64
export const LAYER_8 = 128
export const ALL_LAYERS = 255
export const NO_LAYERS = 0

export type TriggerBoxAreaSpec = {
  type: 'box',
  position?: Vector3,
  scale?: Vector3
}
export type TriggerSphereAreaSpec = {
  type: 'sphere',
  position?: Vector3,
  radius?: number
}
export type TriggerAreaSpec = TriggerBoxAreaSpec | TriggerSphereAreaSpec

export type TriggerBoxArea = {
  position: Vector3,
  scale: Vector3
}
export type TriggerSphereArea = {
  position: Vector3,
  radius: number
}
export type TriggerArea = {$case: 'box', value: TriggerBoxArea} | {$case: 'sphere', value: TriggerSphereArea}

type OnTriggerEnterCallback = (entity: Entity) => void
type OnTriggerExitCallback = (entity: Entity) => void

export type Triggers = ReturnType<typeof createTriggers>

function createTriggers(targetEngine: IEngine) {
  const Trigger = engine.defineComponent('mgm.dcl.utils.Trigger', {
    active: Schemas.Boolean,
    layerMask: Schemas.Int,
    triggeredByMask: Schemas.Int,
    areas: Schemas.Array(Schemas.OneOf({
      box: Schemas.Map({
        position: Schemas.Vector3,
        scale: Schemas.Vector3
      }),
      sphere: Schemas.Map({
        position: Schemas.Vector3,
        radius: Schemas.Number
      })
    })),
    debugColor: Schemas.Color3
  })

  type TriggerType = {
    active: boolean,
    layerMask: number,
    triggeredByMask: number,
    areas: Array<TriggerArea>,
    debugColor: Color3
  }

  const triggerEnterCbs: Map<Entity, OnTriggerEnterCallback | undefined> = new Map()
  const triggerExitCbs: Map<Entity, OnTriggerExitCallback | undefined> = new Map()

  let debugDraw = false
  const activeCollisions: Map<Entity, Set<Entity>> = new Map()
  const debugEntities: Map<Entity, Array<Entity>> = new Map()

  function updateDebugDraw(enabled: boolean) {
    if (!enabled)
      return

    for (const [entity, trigger] of targetEngine.getEntitiesWith(Trigger, Transform)) {
      let shapes = debugEntities.get(entity)!

      const areaCount = trigger.areas.length
      while (shapes.length > areaCount) {
        targetEngine.removeEntity(shapes.pop()!)
      }
      while(shapes.length < areaCount) {
        shapes.push(targetEngine.addEntity())
      }

      const worldPosition = getWorldPosition(entity)
      const worldRotation = getWorldRotation(entity)

      for (let i = 0; i < areaCount; ++i) {
        const shapeSpec = trigger.areas[i]
        const shape = shapes[i]

        let scale
        if (shapeSpec.$case == 'box') {
          scale = shapeSpec.value.scale
          MeshRenderer.setBox(shape)
        } else {
          const radius = shapeSpec.value.radius
          scale = {x: radius, y: radius, z: radius}
          MeshRenderer.setSphere(shape)
        }

        Transform.createOrReplace(shape, {
          position: Vector3.add(worldPosition, Vector3.rotate(shapeSpec.value.position, worldRotation)),
          scale: scale
        })

        const color = trigger.active ? trigger.debugColor : Color3.Black()
        Material.setPbrMaterial(shape, {albedoColor: Color4.fromInts(255 * color.r, 255 * color.g, 255 *color.b, 75)})
      }
    }
  }

  function areTriggersIntersecting(
    shapeWorldPos0: Array<Vector3>,
    t0: DeepReadonly<TriggerType>,
    shapeWorldPos1: Array<Vector3>,
    t1: DeepReadonly<TriggerType>
  ): boolean {
    for (let i = 0; i < t0.areas.length; ++i) {
      const t0World = shapeWorldPos0[i]
      const t0Area = t0.areas[i]

      if (t0Area.$case == 'box') {
        const t0Box = t0Area.value
        const t0Min = Vector3.subtract(t0World, Vector3.scale(t0Box.scale, 0.5))
        const t0Max = Vector3.add(t0Min, t0Box.scale)

        for (let j = 0; j < t1.areas.length; ++j) {
          const t1World = shapeWorldPos1[j]
          const t1Area = t1.areas[j]

          if (t1Area.$case == 'box') {
            const t1Box = t1Area.value
            const t1Min = Vector3.subtract(t1World, Vector3.scale(t1Box.scale, 0.5))
            const t1Max = Vector3.add(t1Min, t1Box.scale)

            if (areAABBIntersecting(t0Min, t0Max, t1Min, t1Max))
              return true
          } else {
            if (areAABBSphereIntersecting(t0Min, t0Max, t1World, t1Area.value.radius))
              return true
          }
        }
      } else {
        const t0Radius = t0Area.value.radius

        for (let j = 0; j < t1.areas.length; ++j) {
          const t1World = shapeWorldPos1[j]
          const t1Area = t1.areas[j]

          if (t1Area.$case == 'box') {
            const t1Box = t1Area.value
            const t1Min = Vector3.subtract(t1World, Vector3.scale(t1Box.scale, 0.5))
            const t1Max = Vector3.add(t1Min, t1Box.scale)

            if (areAABBSphereIntersecting(t1Min, t1Max, t0World, t0Radius))
              return true
          } else {
            if (areSpheresIntersecting(t0World, t0Radius, t1World, t1Area.value.radius))
              return true
          }
        }
      }
    }

    return false
  }

  //was the original checking - it checks all trigger against all other triggers
  //O(n^2) complexity
  function computeCollisions(entity: Entity, shapeWorldPos: Map<Entity, Array<Vector3>>) {
    let collisions: Set<Entity> = EMPTY_SET
    const trigger = Trigger.get(entity)

    if (!trigger.active)
      return collisions
    
    for (const [otherEntity, otherTrigger] of targetEngine.getEntitiesWith(Trigger, Transform)) {
      if (otherEntity == entity)
        continue
      
      if (!otherTrigger.active)
        continue
      
      if (!(trigger.triggeredByMask & otherTrigger.layerMask))
        continue
      
      const intersecting = areTriggersIntersecting(shapeWorldPos.get(entity)!, trigger, shapeWorldPos.get(otherEntity)!, otherTrigger)
      if (intersecting){
        if(collisions === EMPTY_SET) collisions = new Set()
        collisions.add(otherEntity) 
      }
    }

    return collisions
  }

  //customized from #computeCollisions
  //only checks all trigger against the player much less checking
  //O(n) complexity
  function computePlayerCollisions(entity: Entity, shapeWorldPos: Map<Entity, Array<Vector3>>) {
    //READ ONLY SO COULD RETURN AN EMPTY CONSTANT SET WHEN EMPTY
    let collisions: Set<Entity> = EMPTY_SET
    const trigger = Trigger.get(entity)

    if (!trigger.active)
      return collisions
    
    //TRY compute only the camera?
    //for (const [otherEntity, otherTrigger] of targetEngine.getEntitiesWith(Trigger, Transform)) {
      const otherEntity = targetEngine.PlayerEntity
      const otherTrigger = Trigger.get(targetEngine.PlayerEntity)
      if (otherEntity == entity)
      return collisions
      
      if (!otherTrigger.active)
        return collisions
      
      if (!(trigger.triggeredByMask & otherTrigger.layerMask))
        return collisions
      
      const intersecting = areTriggersIntersecting(shapeWorldPos.get(entity)!, trigger, shapeWorldPos.get(otherEntity)!, otherTrigger)
      if (intersecting){
        if(collisions === EMPTY_SET) collisions = new Set() 
        collisions.add(otherEntity)
      }
    //}

    return collisions
  }

  function updateCollisions() {
    const collisionsStarted = []
    const collisionsEnded = []
    const shapeWorldPositions: Map<Entity, Array<Vector3>> = new Map()

    for (const entity of activeCollisions.keys()) {
      if (targetEngine.getEntityState(entity) == EntityState.Removed || !Trigger.has(entity)) {
        for (const debugEntity of debugEntities.get(entity)!)
          targetEngine.removeEntity(debugEntity)

        for (const collisions of activeCollisions.values()) {
          if (collisions.has(entity))
            collisions.delete(entity)
        }

        debugEntities.delete(entity)
        activeCollisions.delete(entity)
        triggerEnterCbs.delete(entity)
        triggerExitCbs.delete(entity)
        continue
      }

      const positions = []
      //TRY: have no parent, can we remove/ignore it?
      const entityWorldPosition = getWorldPosition(entity)
      const entityWorldRotation = getWorldRotation(entity)
      const trigger = Trigger.get(entity)

      for (const shape of trigger.areas) {
        positions.push(Vector3.add(entityWorldPosition, Vector3.rotate(shape.value.position, entityWorldRotation)))
      }
      shapeWorldPositions.set(entity, positions)
    }

    for (const entity of activeCollisions.keys()) {
      //was computeCollisions but now only checking player
      const newCollisions = computePlayerCollisions(entity, shapeWorldPositions) 
      const oldCollisions = activeCollisions.get(entity)!
      
      for (const oldCollision of oldCollisions) {
        if (!newCollisions.has(oldCollision))
          collisionsEnded.push([entity, oldCollision])
      }

      for (const newCollision of newCollisions) {
        if (!oldCollisions.has(newCollision))
          collisionsStarted.push([entity, newCollision])
      }
      
      activeCollisions.set(entity, newCollisions)
    }

    for (const [entity, collision] of collisionsStarted) {
      const callback = triggerEnterCbs.get(entity)
      if (callback)
        callback(collision)
    }

    for (const [entity, collision] of collisionsEnded) {
      const callback = triggerExitCbs.get(entity)
      if (callback)
        callback(collision)
    }
  }

  function system(dt: number) {
    updateCollisions()
    updateDebugDraw(debugDraw)
  }

  //CUSTOMIZATION - give it a higher priority
  targetEngine.addSystem(system, 0)

  function triggerAreasFromSpec(areas?: Array<TriggerAreaSpec>) {
    if (!areas)
      areas = [{type: 'box'}]

    const triggerAreas: Array<TriggerArea> = []

    for (const area of areas) {
      if (area.type == 'box') {
        triggerAreas.push({
          $case: 'box',
          value: {
            position: area.position ? area.position : Vector3.Zero(),
            scale: area.scale ? area.scale : Vector3.One()
          }
        })
      } else {
        triggerAreas.push({
          $case: 'sphere',
          value: {
            position: area.position ? area.position : Vector3.Zero(),
            radius: area.radius ? area.radius : 1
          }
        })
      }
    }
    return triggerAreas
  }

  const triggersInterface = {
    addTrigger(
      entity: Entity,
      layerMask: number = NO_LAYERS,
      triggeredByMask: number = NO_LAYERS,
      areas?: Array<TriggerAreaSpec>,
      onEnterCallback?: OnTriggerEnterCallback,
      onExitCallback?: OnTriggerExitCallback,
      debugColor?: Color3
    ) {
      if (layerMask < 0 || layerMask > ALL_LAYERS || !Number.isInteger(layerMask))
        throw new Error(`Bad layerMask: ${layerMask}. Expected a non-negative integer no greater than ${ALL_LAYERS}`)

      if (triggeredByMask < 0 || triggeredByMask > ALL_LAYERS || !Number.isInteger(triggeredByMask))
        throw new Error(`Bad triggeredByMask: ${triggeredByMask}. Expected a non-negative integer no greater than ${ALL_LAYERS}`)

      debugEntities.set(entity, [])
      activeCollisions.set(entity, new Set())
      triggerEnterCbs.set(entity, onEnterCallback)
      triggerExitCbs.set(entity, onExitCallback)

      Trigger.createOrReplace(entity, {
        active: true,
        layerMask: layerMask,
        triggeredByMask: triggeredByMask,
        areas: triggerAreasFromSpec(areas),
        debugColor: debugColor ? debugColor : Color3.Red()
      })
    },
    removeTrigger(entity: Entity) {
      const collisions = activeCollisions.get(entity)!
      const callback = triggerExitCbs.get(entity)
      
      for (const debugEntity of debugEntities.get(entity)!)
        targetEngine.removeEntity(debugEntity)

      debugEntities.delete(entity)
      activeCollisions.delete(entity)
      triggerEnterCbs.delete(entity)
      triggerExitCbs.delete(entity)
      Trigger.deleteFrom(entity)

      const collidingEntities = []
      for (const [otherEntity, otherEntityCollisions] of activeCollisions) {
        if (otherEntityCollisions.has(entity)) {
          otherEntityCollisions.delete(entity)
          collidingEntities.push(otherEntity)
        }
      }

      if (callback) {
        for (const collision of collisions)
          callback(collision)
      }

      for (const otherEntity of collidingEntities) {
        const callback = triggerExitCbs.get(otherEntity)
        if (callback)
          callback(entity)
      }
    },
    oneTimeTrigger(
      entity: Entity,
      layerMask: number = NO_LAYERS,
      triggeredByMask: number = NO_LAYERS,
      areas?: Array<TriggerAreaSpec>,
      onEnterCallback?: OnTriggerEnterCallback,
      debugColor?: Color3
    ) {
      this.addTrigger(entity, layerMask, triggeredByMask, areas, function(e) {
        cameraOnlyTrigger.removeTrigger(entity)
        if (onEnterCallback)
          onEnterCallback(e)
      }, undefined, debugColor)
    },
    enableTrigger(entity: Entity, enabled: boolean) {
      Trigger.getMutable(entity).active = enabled
    },
    isTriggerEnabled(entity: Entity) {
      return Trigger.get(entity).active
    },
    getLayerMask(entity: Entity) {
      return Trigger.get(entity).layerMask
    },
    setLayerMask(entity: Entity, mask: number) {
      if (mask < 0 || mask > ALL_LAYERS || !Number.isInteger(mask))
        throw new Error(`Bad layerMask: ${mask}. Expected a non-negative integer no greater than ${ALL_LAYERS}`)
      Trigger.getMutable(entity).layerMask = mask
    },
    getTriggeredByMask(entity: Entity) {
      return Trigger.get(entity).triggeredByMask
    },
    setTriggeredByMask(entity: Entity, mask: number) {
      if (mask < 0 || mask > ALL_LAYERS || !Number.isInteger(mask))
        throw new Error(`Bad layerMask: ${mask}. Expected a non-negative integer no greater than ${ALL_LAYERS}`)
      Trigger.getMutable(entity).triggeredByMask = mask
    },
    getAreas(entity: Entity) {
      return Trigger.get(entity).areas
    },
    setAreas(entity: Entity, areas: Array<TriggerAreaSpec>) {
      Trigger.getMutable(entity).areas = triggerAreasFromSpec(areas)
    },
    setOnEnterCallback(entity: Entity, callback: OnTriggerEnterCallback) {
      triggerEnterCbs.set(entity, callback)
    },
    setOnExitCallback(entity: Entity, callback: OnTriggerExitCallback) {
      triggerExitCbs.set(entity, callback)
    },
    enableDebugDraw(enabled: boolean) {
      debugDraw = enabled
      if (!enabled) {
        for (const shapes of debugEntities.values()) {
          for (const shape of shapes)
            targetEngine.removeEntity(shape)
            shapes.length = 0
        }
      }
    },
    isDebugDrawEnabled() {
      return debugDraw
    }
  }

  triggersInterface.addTrigger(
    targetEngine.PlayerEntity, LAYER_1, NO_LAYERS,
    //(1.92/2) accounts that the player position is now at the feet, not the head
    [{
			type: 'box',
			scale: { x: 0.65, y: 1.92, z: 0.65 },
			position: { x: 0, y: (1.92/2), z: 0 }
    }],
    undefined, undefined, Color3.Green()
  )

  return triggersInterface
}

//export const cameraOnlyTrigger = createTriggers(engine)
//switching back to the sdk7-utils version for now, keep this reference
//like this in case we need to switch back
export const cameraOnlyTrigger = utils.triggers