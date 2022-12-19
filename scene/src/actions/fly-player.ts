import * as utils from "@dcl/ecs-scene-utils";
import { CommonResources } from "src/resources/common";
const milisecs_delay = 500;

export function FlyPlayerAction() {
  let entity = new Entity("223");
  entity.addComponent(new BoxShape());
  entity.addComponent(CommonResources.RESOURCES.materials.transparent);
  entity.addComponent(
    new Transform({
      position: new Vector3(40, -1, 48),
      scale: new Vector3(3, 1, 3),
    })
  );
  engine.addEntity(entity);

  let triggerBox = new utils.TriggerBoxShape(
    new Vector3(3, 13, 3),
    Vector3.Zero()
  );

  let isOnCamera = false;
  entity.addComponentOrReplace(
    new utils.TriggerComponent(triggerBox, {
      onCameraEnter: () => {
        log("enter camera");
        isOnCamera = true;
        let StartPos = new Vector3(
          entity.getComponent(Transform).position.x,
          0,
          entity.getComponent(Transform).position.z
        );
        let EndPos = new Vector3(
          entity.getComponent(Transform).position.x,
          20,
          entity.getComponent(Transform).position.z
        );

        utils.setTimeout(milisecs_delay, () => {
          if (isOnCamera) {
            entity.addComponentOrReplace(
              new utils.MoveTransformComponent(StartPos, EndPos, 5)
            );
          }
        });
      },
      onCameraExit: () => {
        log("exit camera");
        isOnCamera = false;
        let StartPos = entity.getComponent(Transform).position;
        let EndPos = new Vector3(
          entity.getComponent(Transform).position.x,
          0,
          entity.getComponent(Transform).position.z
        );

        entity.addComponentOrReplace(
          new utils.MoveTransformComponent(StartPos, EndPos, 1)
        );
      },
      enableDebug: false,
    })
  );
}

//move the execution to better place, maybe due the initial config could be active or inactive?
FlyPlayerAction();
