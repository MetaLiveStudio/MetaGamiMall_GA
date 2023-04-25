import { scene } from "src/meta-decentrally/modules/scene";
import { CommonResources } from "src/resources/common";

export type Props = {
  onClick?: Actions;
  onActivate?: Actions;
  onDeactivate?: Actions;
  station?: string;
  customStation?: string;
  onClickText: string;
  startOn: boolean;
  volume: number;
  image?: string;
};

let defaultStation = "https://theuniverse.club/live/genesisplaza/index.m3u8";

const supportMultiScreen = true
export default class Button implements IScript<Props> {
  channel = "";
  channelFun: IChannel | undefined;
  props: Props | undefined;
  video: Record<string, VideoTexture> = {};
  materials: Record<string, Material> = {};
  active: Record<string, boolean> = {};
  volume: Record<string, number> = {};
  sign: Record<string, Entity> = {};
  entity: Record<string, Entity> = {};
  activeScreen?: Entity;
  init() {}

  clickVideo() {
    //this.channelFun?.sendActions(this.props?.onClick);

  }

  toggleByName(name: string, value: boolean) {
    const ent = this.entity[name]
    log("video.toggleByName.all screens: ", this.video, " setting: ", name, ent, " to ", value);
    if(ent !== undefined){
      this.toggle(ent,value)
    }else{
      log("video.toggleByName.all screens: ERROR unable to find by name ", " setting: ", name, ent, " to ", value);
    }
  }
  toggle(entity: Entity, value: boolean) {
    log("video.toggle.all screens: ", this.video, " setting: ", entity.name, " to ", value);
    
    if (value) {
      //only 1 screen at a time now
      try{
        if(supportMultiScreen){
          if (this.activeScreen && this.activeScreen == entity) {
            return;
          }else if (this.activeScreen) {
            this.toggle(this.activeScreen, false);
          }
        }
  
        this.activeScreen = entity;
        this.active[entity.name!] = true;
        this.video[entity.name!].volume = this.volume[entity.name!];
        this.video[entity.name!].playing = true;
        engine.removeEntity(this.sign[entity.name!]);
      }catch(e){
        log("video.toggle.all screens:  ERROR ", this.video, " setting: ", entity.name, " to ", value,e);
      }
      //this.sign[entity.name].getComponent(PlaneShape).visible = false
    } else {
      //only 1 screen at a time now
      
      if (!this.activeScreen || this.activeScreen != entity) {
        return;
      }
      
      if(supportMultiScreen){
        this.activeScreen = undefined;//we only have 1 screen so keep track of this at all times
      }
      this.active[entity.name!] = false;
      this.video[entity.name!].playing = false;
    
      //this.sign[entity.name].getComponent(PlaneShape).visible = true
    }
    return;
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const screen = new Entity(host.name + "-screen");
    screen.setParent(host);
    this.channelFun = channel;
    let scaleMult = 1.55;
    this.props = props;
    screen.addComponent(new PlaneShape());
    screen.addComponent(
      new Transform({
        scale: new Vector3(1.92 * scaleMult, 1.08 * scaleMult, 10 * scaleMult),
        position: new Vector3(0, 0.548 * scaleMult, 0),
      })
    );

    if (props.customStation) {
      this.channel = props.customStation;
    } else if (props.station) {
      this.channel = props.station;
    } else {
      this.channel = defaultStation;
    }

    // //test
    // let test = new Entity()
    // test.setParent(host)
    // test.addComponentOrReplace(new GLTFShape('src/smartItems/stream-preview/models/stream_preview.glb'))

    // video material
    
    this.video[screen.name!] = new VideoTexture(new VideoClip(this.channel));
    this.entity[screen.name!] = screen
    this.materials[screen.name!] = new Material();
    this.materials[screen.name!].albedoTexture = this.video[screen.name!];
    this.materials[screen.name!].specularIntensity = 0;
    this.materials[screen.name!].roughness = 1;
    this.materials[screen.name!].metallic = 0;
    this.materials[screen.name!].emissiveTexture = this.video[screen.name!];
    this.materials[screen.name!].emissiveIntensity = 0.8;
    this.materials[screen.name!].emissiveColor = new Color3(1, 1, 1);

    screen.addComponent(this.materials[screen.name!]);

    // icon for streaming
    this.sign[screen.name!] = new Entity(host.name + "-sign");
    this.sign[screen.name!].setParent(screen);

    this.sign[screen.name!].addComponent(new PlaneShape());
    this.sign[screen.name!].addComponent(
      new Transform({
        position: new Vector3(0, 0, 0.002),
        rotation: Quaternion.Euler(180, 0, 0),
      })
    );

    this.volume[screen.name!] = props.volume;

    let placeholderMaterial = new BasicMaterial();
    placeholderMaterial.texture = new Texture(
      props.image
        ? props.image
        : "src/smartItems/stream-preview/images/stream.png"
    );
    placeholderMaterial = CommonResources.RESOURCES.materials.transparent;

    this.sign[screen.name!].addComponent(placeholderMaterial);

    if (props.onClick) {
      this.sign[screen.name!].addComponent(
        new OnPointerDown(
          () => {
            channel.sendActions(props.onClick);
          },
          {
            button: ActionButton.POINTER,
            hoverText: props.onClickText,
            distance: 6,
          }
        )
      );

      screen.addComponent(
        new OnPointerDown(
          () => {
            log("clicked");
            channel.sendActions(props.onClick);
          },
          {
            button: ActionButton.POINTER,
            hoverText: props.onClickText,
            distance: 6,
          }
        )
      );
    }

    if (props.startOn) {
      this.toggle(screen, true);
    } else {
      this.toggle(screen, false);
    }
    /*
    // handle actions
    channel.handleAction("activate", ({ sender }) => {
      this.toggle(screen, true);

      if (sender === channel.id) {
        channel.sendActions(props.onActivate);
      }
    });
    channel.handleAction("deactivate", ({ sender }) => {
      this.toggle(screen, false);
      if (sender === channel.id) {
        channel.sendActions(props.onDeactivate);
      }
    });
    channel.handleAction("toggle", ({ sender }) => {
      let value = !this.active[screen.name!];

      this.toggle(screen, value);
      if (sender === channel.id) {
        if (value) {
          channel.sendActions(props.onActivate);
        } else {
          channel.sendActions(props.onDeactivate);
        }
      }
    });
    
    // sync initial values
    channel.request<boolean>("isActive", (isActive) =>
      this.toggle(screen, isActive)
    );
    channel.reply<boolean>("isActive", () => this.active[screen.name!]);*/
    return this;
  }
}
