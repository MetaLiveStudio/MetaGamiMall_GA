import * as utils from "@dcl/ecs-scene-utils";

export function setLobbyCameraTriggerShape(){
  utils.TriggerSystem.instance.setCameraTriggerShape(
    //this should be the rough shape of an avatar, not considering wierd wearables
    new utils.TriggerBoxShape(
      new Vector3(0.8, 2.2, 0.8), //new Vector3(0.5, 1.8, 0.5),
      new Vector3(0, -0.7, 0)
    )
  );
}
