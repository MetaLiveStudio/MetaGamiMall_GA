export type Props = {
  active: boolean;
  target: string;
  targetAltName: string;
  hoverText?: string;
};

export default class Arrow implements IScript<Props> {
  active: Record<string, boolean> = {};

  init() {}

  toggle(entity: Entity, value: boolean) {
    if (this.active[entity.name!] === value) return;

    const animator = entity.getComponent(Animator);
    const clip = animator.getClip("ArmatureAction");
    clip.looping = true;
    if (value) {
      entity.getComponent(GLTFShape).visible = true;
      clip.playing = true;
    } else {
      entity.getComponent(GLTFShape).visible = false;
      clip.playing = false;
    }

    this.active[entity.name!] = value;
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const siren = new Entity(host.name + "-button");
    siren.setParent(host);

    if (!props.active) {
      //siren.getComponent(GLTFShape).visible = false
    } else {
      //just dont add stuff if not active. its for placement no need to optimize

      const animator = new Animator();
      const clip = new AnimationState("ArmatureAction", { looping: true });
      animator.addClip(clip);

      siren.addComponent(animator);

      siren.addComponentOrReplace(
        new OnPointerDown(
          () => {
            //click action
          },
          {
            //button: props.clickButton ? props.clickButton : ActionButton.POINTER,
            hoverText:
              props.hoverText !== null && props.hoverText !== undefined
                ? props.hoverText
                : "Waypoint-" + props.target + "-" + props.targetAltName,
            distance: 14,
            showFeedback: true,
          }
        )
      );

      siren.addComponent(
        new GLTFShape("src/smartItems/arrow2/models/Arrow.glb")
      );
      clip.play();
    }

    this.active[siren.name!] = props.active;

    // handle actions
    channel.handleAction("activate", ({ sender }) => {
      this.toggle(siren, true);
    });
    channel.handleAction("deactivate", ({ sender }) => {
      this.toggle(siren, false);
    });

    // sync initial values
    channel.request<boolean>("isActive", (isActive) =>
      this.toggle(siren, isActive)
    );
    channel.reply<boolean>("isActive", () => this.active[siren.name!]);
  }
}
