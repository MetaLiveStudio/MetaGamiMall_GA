import { CONFIG } from "src/config";
import { GAME_STATE } from "src/state";
import { getAndSetUserDataIfNull, getUserDataFromLocal } from "src/userData";
import { NPC } from '@dcl/npc-scene-utils'
const DEFAULT_PET_IMAGE = "images/portraits/metadoge2d.png";

export class Pet {
  images?: string[];
  position?: number;
  maxPositions?: number;
  alice: NPC;
  facePlateHost: Entity;
  droneShape: Entity;
  facePlateMaterial: Material;
  constructor(alice: NPC) {
    this.alice = alice;
    executeTask(async () => {
      let images = await this.getMetadogeAssets();
      this.images = images;
      this.position = 0;
      this.maxPositions = images.length;
      if (this.maxPositions > 1) {
        this.createArrows();
      }
      this.switchImage(true);
    });

    this.facePlateHost = new Entity("facePlate");
    engine.addEntity(this.facePlateHost);
    this.facePlateHost.setParent(alice);
    this.facePlateHost.addComponent(
      new Transform({
        position: new Vector3(0, -0.02, 0.19),
        scale: new Vector3(0.42, 0.42, 0.42),
        //rotation: Quaternion.Euler(0, 20, 0)
      })
    );

    this.droneShape = new Entity("facePlate-shape");
    this.droneShape.setParent(this.facePlateHost);
    this.droneShape.addComponent(
      new Transform({
        position: new Vector3(0, -0.02, 0.1),
        scale: new Vector3(1.2, 1.2, 1.2),
      })
    );

    //let facePlateTexture = new Texture(DEFAULT_PET_IMAGE)
    this.facePlateMaterial = new Material();
    this.facePlateMaterial.metallic = 0;
    this.facePlateMaterial.roughness = 1;
    this.facePlateMaterial.specularIntensity = 0;
    //this.facePlateMaterial.albedoTexture = facePlateTexture

    this.droneShape.addComponent(new PlaneShape());
    this.droneShape.addComponent(this.facePlateMaterial);
    this.droneShape.getComponent(Transform).rotate(new Vector3(1.2, 0, 0), 180);
    this.droneShape.addComponent(alice.getComponent(OnPointerDown));
  }

  createArrows() {
    const arrow = new GLTFShape("models/robots/arrow.glb");
    let leftArrow = new Entity("241");
    let rightArrow = new Entity("242");
    rightArrow.addComponent(arrow);
    leftArrow.addComponent(arrow);
    rightArrow.addComponent(
      new OnPointerDown(
        () => {
          this.switchImage(true);
        },
        {
          button: ActionButton.ANY,
          distance: 4,
          hoverText: "Change Pet",
        }
      )
    );

    leftArrow.addComponent(
      new OnPointerDown(
        () => {
          this.switchImage(false);
        },
        {
          button: ActionButton.ANY,
          distance: 4,
          hoverText: "Change Pet",
        }
      )
    );
    rightArrow.addComponent(
      new Transform({
        position: new Vector3(-0.85, -0.05, 0.55),
        scale: new Vector3(2.2, 2.2, 2.2),
      })
    );

    leftArrow.addComponent(
      new Transform({
        position: new Vector3(0.85, -0.05, 0.55),
        scale: new Vector3(2.2, 2.2, 2.2),
      })
    );
    leftArrow.getComponent(Transform).rotate(new Vector3(0, 0, 1), 180);
    rightArrow.setParent(this.droneShape!);
    leftArrow.setParent(this.droneShape!);

    leftArrow.addComponent(
      new OnPointerHoverEnter(
        (e) => {
          leftArrow.getComponent(Transform).scale = new Vector3(3, 3, 3);
        },
        {
          distance: 8,
        }
      )
    );

    leftArrow.addComponent(
      new OnPointerHoverExit((e) => {
        leftArrow.getComponent(Transform).scale = new Vector3(2.2, 2.2, 2.2);
      })
    );
    rightArrow.addComponent(
      new OnPointerHoverEnter(
        (e) => {
          rightArrow.getComponent(Transform).scale = new Vector3(3, 3, 3);
        },
        {
          distance: 8,
        }
      )
    );

    rightArrow.addComponent(
      new OnPointerHoverExit((e) => {
        rightArrow.getComponent(Transform).scale = new Vector3(2.2, 2.2, 2.2);
      })
    );

    engine.addEntity(rightArrow);
    engine.addEntity(leftArrow);
  }

  switchImage(moveForward: boolean) {
    if (moveForward) {
      this.position = this.position! + 1;
      if (this.position >= this.maxPositions!) {
        this.position = 0;
      }
    } else {
      this.position = this.position! - 1;
      if (this.position < 0) {
        this.position = this.maxPositions! - 1;
      }
    }
    let facePlateTexture = new Texture(this.images![this.position]);
    this.facePlateMaterial!.albedoTexture = facePlateTexture;
    this.droneShape!.addComponentOrReplace(this.facePlateMaterial!);
  }

  async getMetadogeAssets() {
    let userData = await getAndSetUserDataIfNull();
    let wallet = userData !== undefined ? userData.publicKey : ""
    const api_url =
      CONFIG.CONTRACT_API_CALL + CONFIG.CONTRACT_OWNER_FIELD + wallet;
    log("url: " + api_url);
    let images: string[] = [];
    try {
      let response = await fetch(api_url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status == 200) {
        let json = await response.json();
        if (parseInt(json["count"]) > 0) {
          json["assets"].forEach(function (item: any) {
            images.push(item["image"]);
          });
        } else {
          images.push(DEFAULT_PET_IMAGE);
        }
      } else {
        log(
          " error reponse to reach URL status:" +
            response.status +
            " text:" +
            response.statusText
        );
        images.push(DEFAULT_PET_IMAGE);
      }
    } catch (e) {
      images.push(DEFAULT_PET_IMAGE);
      log(e);
    } finally {
      return images;
    }
  }
}
