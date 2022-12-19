import { isNull, loadOnSceneStartThenRemove } from "../../../src/utils";
import * as utils from "@dcl/ecs-scene-utils";

export type Props = {
  id: string;
  contract: string;
  style: string;
  color: string;
  ui: boolean;
  uiText: string;
  externalUrl?: string;
};

const NFTSHAPECACHE: Record<string, Shape> = {};

const frameTriggerShape = new utils.TriggerBoxShape(
  new Vector3(30, 30, 30), // custom trigger shape
  new Vector3(0, 0, 0) // custom trigger shape
  //for default 2x2 trigger shape
  //new Vector3(.6, 1, .6), // size 1.8 is a little bigger than standing 1.6
  //new Vector3(0, 1.6, 0) // position place so walking the camera hits it and jumping camera hits its (feet on avatar)
);

export default class SignPost implements IScript<Props> {
  init() {
    //preload frame so is not purple
    const shape = new GLTFShape("models/nftframe.glb");
    loadOnSceneStartThenRemove(shape, shape.src);
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const frame = new Entity("224");
    //OOTB shape loads on demand and then does visible true/false
    //if false it will add/remove from engine as trigger fires (was told this has some overhead to it vs visible=false)
    const KEEP_IN_ENGINE = false;
    if (KEEP_IN_ENGINE) frame.setParent(host);

    frame.addComponent(
      new Transform({
        position: new Vector3(0, 0.25, 0),
        rotation: Quaternion.Euler(0, 180, 0),
      })
    );

    let nft = "ethereum://" + props.contract + "/" + props.id;

    const key = nft;

    //need unique instances so can show/hide it
    let shape: Shape | undefined = KEEP_IN_ENGINE
      ? undefined
      : NFTSHAPECACHE[nft];

    if (isNull(shape)) {
      shape = new GLTFShape("models/nftframe.glb");

      NFTSHAPECACHE[key] = shape;
    }
    if (shape) {
      if (KEEP_IN_ENGINE) shape.visible = false;

      frame.addComponent(shape);
    }

    host.addComponent(
      new utils.TriggerComponent(frameTriggerShape, {
        onCameraEnter: () => {
          //log("enter trigger",host.name)

          if (!KEEP_IN_ENGINE) {
            frame.setParent(host);
            if (!frame.alive) engine.addEntity(frame);
          } else {
            if (shape) shape.visible = true;
          }
        },
        onCameraExit: () => {
          //log("leave trigger",host.name)

          if (!KEEP_IN_ENGINE) {
            frame.setParent(null);
            if (frame.alive) engine.removeEntity(frame);
          } else {
            if (shape) shape.visible = false;
          }
        },
        enableDebug: false,
      })
    );

    if (props.ui) {
      frame.addComponent(
        new OnPointerDown(
          () => {
            log("i am " + host.name);
            //openNFTDialog(nft, props.uiText ? props.uiText : null)
            if (props && props.externalUrl) openExternalURL(props.externalUrl);
          },
          { hoverText: props.uiText ? props.uiText : "Visit" }
        )
      );
    }

    // let test = new Entity()
    // test.setParent(host)
    // test.addComponent(new GLTFShape('80d9cb1c-2fcf-4585-8e19-e2d5621fd54d/models/CustomFrame.glb'))
  }
}
