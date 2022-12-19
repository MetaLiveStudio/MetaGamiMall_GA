export type AnimType = "play" | "stop" | "pause" | "reset";

export type Animation = {
  target: string;
  name: string;
  speed: number;
};

@Component("org.decentraland.AnimationData")
export class AnimatedData {
  clips: Record<string, Animated>;

  constructor(args: { clips?: Record<string, Animated> }) {
    if (args.clips != null) {
      this.clips = args.clips;
    } else {
      this.clips = {};
    }
  }
}

@Component("org.decentraland.Animation")
export class Animated {
  //TODO create as list of animations
  type: AnimType;
  name: string;
  speed: number;
  loop: boolean;
  channel: IChannel;
  sender: string = "initial";
  timestamp?: number;
  layer: number;

  constructor(args: {
    type: AnimType;
    name: string;
    speed: number;
    loop: boolean;
    channel: IChannel;
    layer?: number;
    sender?: string;
    timestamp?: number;
  }) {
    this.type = args.type;
    this.name = args.name;
    this.speed = args.speed;
    this.channel = args.channel;
    this.layer =
      args.layer !== null && args.layer !== undefined ? args.layer : 0;
    if (args.sender) this.sender = args.sender;
    this.loop = args.loop;
    if (args.timestamp) this.timestamp = args.timestamp;
  }
}
