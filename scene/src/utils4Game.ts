import * as utils from '@dcl-sdk/utils'
import { Entity, Transform, engine } from '@dcl/sdk/ecs';
import { Color3, Quaternion, Vector3 } from '@dcl/sdk/math';
import { ReadOnlyVector3 } from '~system/EngineApi';

export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
//from https://docs.decentraland.org/creator/development-guide/sdk7/entity-positioning/#face-a-set-of-coordinates
export function lookAt(entity:Entity, target: ReadOnlyVector3){
	const transform = Transform.getMutable(entity)
	const difference = Vector3.subtract( target, transform.position)
	const normalizedDifference = Vector3.normalize(difference)
	transform.rotation = Quaternion.lookRotation(normalizedDifference)
}
/**
 * Add a trigger that will be triggered each time
 */
export function addRepeatTrigger(
  size: Vector3,
  position: Vector3,
  onPlayerEnter: (entity:Entity) => void ,
  parent: Entity|undefined,
  show: boolean = false,
  onExit: () => void 
) {
  

  const trigger = engine.addEntity()
  Transform.create(trigger,
    {
      position:position,
      parent:parent
    })

  utils.triggers.addTrigger(
    trigger
    , utils.NO_LAYERS, utils.LAYER_1
    ,[{position:Vector3.Zero(),scale:size,type:'box'}]
    ,onPlayerEnter
    ,onExit,  Color3.Yellow()
  ) 
}
