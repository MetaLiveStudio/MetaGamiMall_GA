import { isNull } from "../../src/utils";

export type Props = {
  text?: string;
  fontSize?: number;
};

type ChangeTextType = { newText: string };

const TEXTSHAPECACHE: Record<string, TextShape> = {};

export default class SignPost implements IScript<Props> {
  model: GLTFShape = new GLTFShape(
    "a5c32dfc-27c5-416b-bfbb-f66f871c8ea7/models/signpost/Sign_Square_Vertical.glb"
  );
  init() {
    this.model = new GLTFShape(
      "a5c32dfc-27c5-416b-bfbb-f66f871c8ea7/models/signpost/Sign_Square_Vertical.glb"
    );
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const sign = new Entity("16");
    sign.setParent(host);

    sign.addComponent(this.model);

    let signText = new Entity("17");
    signText.setParent(host);

    const key = props.text + "_" + props.fontSize;

    let text = TEXTSHAPECACHE[key];
    if (isNull(text)) {
      text = new TextShape(props.text);
      text.fontSize = props.fontSize!;
      text.color = Color3.FromHexString("#ffd1f6");
      text.outlineWidth = 0.4;
      text.outlineColor = Color3.FromHexString("#ffd1f6");

      text.width = 20;
      text.height = 10;
      text.hTextAlign = "center";

      TEXTSHAPECACHE[key] = text;
    } else {
      log("cache HIT! " + key);
    }

    signText.addComponent(text);

    signText.addComponent(
      new Transform({
        position: new Vector3(0, 0.85, 0.035),
        rotation: Quaternion.Euler(0, 180, 0),
        scale: new Vector3(0.05, 0.05, 0.05),
      })
    );

    channel.handleAction<ChangeTextType>("changeText", (action) => {
      text.value = action.values.newText;
    });

    channel.request<string>("getText", (signText) => (text.value = signText));
    channel.reply<string>("getText", () => text.value);
  }
}
