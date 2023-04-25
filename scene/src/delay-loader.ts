import { isPreviewMode } from "@decentraland/EnvironmentAPI";
import { Logger } from "./logging";
import { getEntityByName, isNull, notNull } from "./utils";

import * as utils from "@dcl/ecs-scene-utils";

//handle delayed loading
export function handleDelayLoad(
  delayTime: number,
  name: string,
  fn: () => void
) {
  
  if (delayTime && delayTime > 0) {
    log("handleDelayLoad.queued",name,"fn",fn)
    utils.setTimeout(delayTime, ()=>{
      log("handleDelayLoad.fired",name,fn)
      fn();
    });
  } else {
    //doing now
    log("handleDelayLoad.fired",name)
    fn();
  }
}
