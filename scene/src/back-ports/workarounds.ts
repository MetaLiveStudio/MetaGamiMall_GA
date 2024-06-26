import * as utils from '@dcl-sdk/utils'
import { OnFinishCallback } from "@dcl-sdk/utils/dist/tween";
import { Vector3 } from "@dcl/ecs-math"
import { EasingFunction, Entity, Transform, TransformTypeWithOptionals, Tween } from "@dcl/sdk/ecs"
import { openExternalUrl, teleportTo } from "~system/RestrictedActions"
import { log } from './backPorts';


/**
 * to 100% say our scene is not the cause wrapping it here.  
 */
export function createTransform(entity:Entity,args?:TransformTypeWithOptionals,context?:string){
  if(Transform.has(entity)){
    log("workarounds.ts","createTransform","WARNING!!! entity already has transform!!!!!!",entity,context)
  }
  log("workarounds.ts","safe.createTransform","for entity",entity,context)
  //not using create as could bomb scene, will use createOrReplace
  Transform.createOrReplace(entity,args)
}

export const TransformSafeWrapper = {
  create:  createTransform
}