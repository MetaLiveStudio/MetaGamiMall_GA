import { isNull } from "../../src/utils";

export type Props = {
  id: string;
  contract: string;
  style: string;
  color: string;
  ui: boolean;
  uiText: string;
  externalUrl?: string;
};

const NFTSHAPECACHE: Record<string, NFTShape> = {};

export default class SignPost implements IScript<Props> {
  init() {}

  spawn(host: Entity, props: Props, channel: IChannel) {
    const frame = new Entity("121");
    frame.setParent(host);

    frame.addComponent(
      new Transform({
        position: new Vector3(0, 0.25, 0),
        rotation: Quaternion.Euler(0, 180, 0),
      })
    );

    let nft = "ethereum://" + props.contract + "/" + props.id;

    const key = nft;

    //let letColorString = "Red";
    const typedColorString = props.style as keyof typeof PictureFrameStyle;
    const picFrameStyle:PictureFrameStyle = PictureFrameStyle[typedColorString]
    
    let nftShape: NFTShape = NFTSHAPECACHE[nft];
    if (isNull(nftShape)) {
      nftShape = new NFTShape(nft, {
        color: Color3.FromHexString(props.color),
        style: picFrameStyle,
      });

      NFTSHAPECACHE[key] = nftShape;
    }

    frame.addComponent(nftShape);

    if (props.ui) {
      frame.addComponent(
        new OnPointerDown(
          () => {
            log("i am " + host.name);
            openNFTDialog(nft, props.uiText ? props.uiText : null);
          },
          { hoverText: "Open UI" }
        )
      );
    }

    // let test = new Entity()
    // test.setParent(host)
    // test.addComponent(new GLTFShape('80d9cb1c-2fcf-4585-8e19-e2d5621fd54d/models/CustomFrame.glb'))
  }
}
