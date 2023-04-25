import { isNull } from "src/utils";

export type Props = {
  text?: string;
  fontSize?: number;
  clickable?: boolean;
  onClickFn?: () => void;
  hoverText?: string;
};

type ChangeTextType = { newText: string };

const TEXTSHAPECACHE: Record<string, TextShape> = {};

export default class SignPost implements IScript<Props> {
  model?: GLTFShape;
  init() {
    this.model = new GLTFShape(
      "7e78cd70-5414-4ec4-be5f-198ec9879a5e/models/signpost/Sign_Square.glb"
    );
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const sign = new Entity(host.name + "-sign");
    sign.setParent(host);
    if (this.model) sign.addComponent(this.model);

    if (
      props.clickable !== null &&
      props.clickable !== undefined &&
      props.clickable
    ) {
      if (props.onClickFn)
        sign.addComponent(
          new OnPointerDown(props.onClickFn, {
            button: ActionButton.POINTER,
            hoverText:
              props.hoverText !== null && props.hoverText !== undefined
                ? props.hoverText
                : "Click",
          })
        );
    }

    let signText = new Entity(host.name + "-sign-text");
    signText.setParent(host);

    const key = props.text + "_" + props.fontSize;

    let text = TEXTSHAPECACHE[key];
    if (isNull(text)) {
      text = new TextShape(props.text);
      if (props.fontSize) text.fontSize = props.fontSize;
      text.color = Color3.FromHexString("#8cfdff");
      text.outlineWidth = 0.4;
      text.outlineColor = Color3.FromHexString("#8cfdff");

      text.width = 20;
      text.height = 10;
      text.hTextAlign = "center";

      TEXTSHAPECACHE[key] = text;
    }

    signText.addComponent(text);

    //log("signText " + signText.name + " "  + signText.hasComponent(TextShape) )

    signText.addComponent(
      new Transform({
        position: new Vector3(0, 0.55, 0.04),
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
