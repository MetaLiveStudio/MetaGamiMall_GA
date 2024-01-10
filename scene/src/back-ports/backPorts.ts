import * as utils from '@dcl-sdk/utils'
import { OnFinishCallback } from "@dcl-sdk/utils/dist/tween";
import { Vector3 } from "@dcl/ecs-math"
import { EasingFunction, Entity, TransformTypeWithOptionals, Tween } from "@dcl/sdk/ecs"
import { openExternalUrl, teleportTo } from "~system/RestrictedActions"

/**
 * back port logging
 * @param msg 
 */
export function log(...msg: any[]) {
  console.log(...msg)
}

export type ObservableComponentSubscription = (key: string, newVal: any, oldVal: any) => void;

export type TranformConstructorArgs = TransformTypeWithOptionals & {}

//export type GLTFShape = PBGltfContainer & {}

/**
 * place holder as does not exist in current SDK version
 * 
 * not working
 * https://github.com/decentraland/sdk/issues/665
 */
export async function _openExternalURL(url: string) {
  openExternalUrl({ url: url })
}

//TODO TAG:PORT-REIMPLEMENT-ME
export function _teleportTo(parcelX: number, parcelZ: number) {
  //sdk needs to prompt but this works
  //const split 
  log("_teleportTo - Coordinates:", parcelX, parcelZ)
  teleportTo({
    worldCoordinates: { x: parcelX, y: parcelZ }
  })
}

//adding callback ability 
const TWEEN_SCALE_CALLBACK_MAP = new Map<Entity, utils.TimerId>()
/**
 * 
 * @param entity 
 * @param start 
 * @param end 
 * @param duration - milliseconds
 * @param interpolationType - default linear
 * @param onFinish - default nothing
 */
export function engineTweenStartScaling(
  entity: Entity, start: Vector3.ReadonlyVector3, end: Vector3.ReadonlyVector3, duration: number, interpolationType?: EasingFunction, onFinish?: OnFinishCallback
){
  /*
  Tween.createOrReplace(entity, {
    mode: Tween.Mode.Scale({
      start: start,
      end: end,
    }),
    duration: duration,
    easingFunction: interpolationType ? interpolationType : EasingFunction.EF_LINEAR,
  })

  //clear out any previous timer
  let timerId = TWEEN_SCALE_CALLBACK_MAP.get(entity)
  if(timerId !== undefined) utils.timers.clearTimeout(timerId)

  //if has new callback register it
  if(onFinish){
    timerId = utils.timers.setTimeout(()=>{
      //console.log("engineTweenStartScaling","finished")
      //clear out timer
      TWEEN_SCALE_CALLBACK_MAP.delete(entity);

      onFinish()

    },duration/1000)
    TWEEN_SCALE_CALLBACK_MAP.set(entity,timerId) 
  }*/
  
   //WORKAROUND FALLBACK, Tween.Mode.Scale buggy as of sdk 7.3.30
   //the position is getting altered, size not matching up :(
   utils.tweens.startScaling(entity,start,end,duration/1000,undefined,onFinish)
  

  //on timer end, enforce state incase engine does not match up? or trust engine and just fire?

}