import * as utils from "@dcl/ecs-scene-utils";
import { getUserData, UserData } from "@decentraland/Identity";
import { CONFIG, VIP_NFT_AREA } from "src/config";
import { CommonResources } from "src/resources/common";
import { getAndSetUserDataIfNull } from "src/userData";
const milisecs_delay = 500;

async function isPlayerEligibleForVipArea(user: UserData | null) {
  let matches = false;

  if (user !== null && user !== undefined && user.publicKey !== null) {
    const api_url =
      "https://peer.decentraland.org/lambdas/collections/wearables-by-owner/" +
      user.publicKey;
    log("url: " + api_url);
    try {
      let response = await fetch(api_url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status == 200) {
        let json: [{ urn: string; amount: number }] = await response.json();
        VIP_NFT_AREA.forEach((element) => {
          json.forEach((item) => {
            if (item.urn === element) {
              matches = true;
            }
          });
        });
        log("isPlayerEligible " + user?.userId + " " + matches);
        return matches;
      } else {
        log(
          " error reponse to reach URL status:" +
            response.status +
            " text:" +
            response.statusText
        );
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  return false;
}

async function hasMetadogeAssets(contract: string) {
  let userData = await getAndSetUserDataIfNull();
  let wallet = userData !== undefined ? userData.publicKey : "";
  if (wallet === "") return false;
  else {
    const api_url = contract + CONFIG.CONTRACT_OWNER_FIELD + wallet;
    log("url: " + api_url);
    try {
      let response = await fetch(api_url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status == 200) {
        let json = await response.json();
        if (parseInt(json["count"]) > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        log(
          " error reponse to reach URL status:" +
            response.status +
            " text:" +
            response.statusText
        );
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}

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

  getUserData().then(async (value) => {
    let elegible = await isPlayerEligibleForVipArea(value);
    if (!elegible) {
      elegible = await hasMetadogeAssets(CONFIG.CONTRACT_API_CALL);
      log("isPlayerEligible 2d " + elegible);
      if (!elegible) {
        elegible = await hasMetadogeAssets(CONFIG.CONTRACT_3D_API_CALL);
        log("isPlayerEligible 3d " + elegible);
      }
    }
    if (elegible) {
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
              15,
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
  });
}

//move the execution to better place, maybe due the initial config could be active or inactive?
FlyPlayerAction();
