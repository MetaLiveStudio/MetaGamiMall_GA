import { createMaterial } from "src/gamimall/resources";

export type Props = {
  image: string;
  clickable?: boolean;
  externalLink?: string;
  hoverText?: string;
};

type ChangeTextType = { newText: string };

export default class SignPost implements IScript<Props> {
  init() {}

  spawn(host: Entity, props: Props, channel: IChannel) {
    let url = props.image;

    //let QRTexture = new Texture(url)
    let QRMaterial = createMaterial(url, false);

    let QRPlane = new Entity(host.name + "-img");
    QRPlane.setParent(host);
    QRPlane.addComponent(new PlaneShape());
    QRPlane.addComponent(QRMaterial);
    QRPlane.addComponent(
      new Transform({
        position: new Vector3(0, 0.5, 0),
        rotation: Quaternion.Euler(180, 0, 0),
        scale: new Vector3(1, 1, 1),
      })
    );

    const makeClickable = props.clickable !== undefined && props.clickable;

    //log(host.name , " make clickable ",makeClickable)

    if (makeClickable) {
      QRPlane.addComponentOrReplace(
        new OnPointerDown(
          () => {
            //openNFTDialog(wearableNTF, null)
            log("openExternalURL ", props.externalLink);
            if (props.externalLink !== undefined) {
              openExternalURL(props.externalLink);
            } else {
              log(host.name + " has no url " + props.externalLink);
            }
          },
          {
            button: ActionButton.PRIMARY,
            hoverText:
              props.hoverText !== undefined ? props.hoverText : "Click",
          }
        )
      );
    }
  }
}
