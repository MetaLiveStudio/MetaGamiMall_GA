import { LevelingFormulaConfig } from "src/modules/leveling/levelingTypes";

export type ICostDataState = {
  amount: number,
  type: NFTUIDataPriceType
  id: string
};
export type CostData = ICostDataState&{
};
export type RewardData = {
  amount: number,
  type: NFTUIDataPriceType
  id: string
  maxAllowed?: number
  currentAmount?: number
  redeemable?: boolean //if can redeem or not, client side will read, save will read
  /*
  distribution:"fixed"|"range"
  max?: number
  min?: number*/
};
export type NFTUIDataPriceType='VirtualCurrency'|'Material'|'DropTable'|'CatalogItem'

export type RewardNotification={
  rewardType:string
  newLevel:number,
  rewards:RewardData[]
  sourceObjectId?:string //id it is linked to that gave out the reward
}



export interface Vector3State{
  x:number
  y:number
  z:number
}
export interface Quaternion3State{
  x:number
  y:number
  z:number
  w:number
}




export type AnimationDefType={
  name:string
  duration:number
  sound?:string
} 


export interface HealthDataState {
  current:number
  max:number
}


export interface CoinRoomDataOptions{
  levelId:string
  name?:string
  customRoomId?:string
  featuresDefinition?:TrackFeatureDef
}



export type SpawnZoneDef={
  //type:string //point/range
  
  position:Vector3State
  scale?:Vector3State
  //scaleRange?:Vector3State[]
  rotation?:Quaternion3State
}


export type TrackFeatureType = "minable.rock1" | 'minable.rock2' |  "minable.MysteryBlock" | "buyable.item.bronze.shoe"| "buyable.rock2"| "buyable.rock3"| "buyable.BP"|"buyable.NI"|"buyable.ADS"|"buyable.MC"|"buyable.rock1";
export type TrackFeatureStatus = "not-init"|"active"|"inactive"|"cooling-down"|"scheduled";



export interface ITrackFeaturePosition extends SpawnZoneDef{
  //position?:Vector3State//optional, if set its the exact spot
  //rotation?:Quaternion3State//optional, if set its the exact rotation
  
  //entity:Entity

}

export type MinableAnimationNameDef = {//NEEDED FOR SCENE SIDE, server does not use this...yet
  name:string
  duration:number
  autoStart?:boolean
}
export type ImageInfo={ //NEEDED FOR SCENE SIDE, server does not use this...yet
  src:string
  width:number
  height:number
}
export type MinableUIConfig={ //NEEDED FOR SCENE SIDE, server does not use this...yet
  description?:string//2d ui popup description of item
  descriptionTitle?:string//2d ui popup description of item title
  minableModel?:string//model used for minable
  tool?:{
    enabled:boolean
    //toolType?:string//TODO
    model?:string//TODO
    transformScale?:Vector3
    distanceOffCenterTarget?:number //how far off center from target
    onHideDelayMS?:number//delay before hiding tool, default to 0
  }
  //toolOffset?:Vector3
  portrait?:ImageInfo //2d ui image of item
  hoverText?:string //hover text
  clickDistance?:number //distance for click/hovertext to show
  modalClaimButtonLabel?:string //text the popup modal button uses, default "Mine"
  animations?:{
    enabled:boolean
    IDLE?: MinableAnimationNameDef
    //WALK?: MinableAnimationNameDef
    ACTIVATE?: MinableAnimationNameDef
    //HIDE?: MinableAnimationNameDef
  }
}

export type SpawnTypeDef={
  //locations:number //5
  concurrentMax:number //3, 999 uses all
  //concurrentMin:number //2 -1 no min
  respawnTime:number[]//when to respawn after found if within max/min; -1 immediate
  expireTime:number[]//when to remove; -1 is never
  coolDownTime?:number //cooldown time between spawns

  zones: SpawnZoneDef[]
  _zonesUsed?: SpawnZoneDef[]
  _zonesFree?: SpawnZoneDef[]
}
export type MinableTypeDef={
  id: string;
  name: string
  enabled?: boolean
  type?: TrackFeatureType;//tree/rock
  rewards?:RewardData[]
  cost?:CostData[]
  purchaseDelay?:number //time mining to take

  //triggerSize?: Vector3State
  //health:HealthDataState
  //activateDistance?:number //distance to activate

  spawnDef:SpawnTypeDef

  //scene specific
  ui:MinableUIConfig
}
export type TrackFeatureInstDef = MinableTypeDef&{

}
//looks very simliar to a coin/block, can we reuse? convert x,y,z to Vector3State and yes??
export type MinableInstType={
  id: string;
  
  definition:MinableTypeDef

  visible: boolean;
  collectedBy?: string;
  health:HealthDataState

  //createTime?: number;//when created/ audit value only?
  activateTime?: number //when goes active
  expireTime?: number;//when to remove?


  position:Vector3State
  scale:Vector3State
  rotation:Quaternion3State
}



//broadcast object instead of linking to state the level details
export interface LevelDataState{
  id:string
  name:string
  //status:RaceStatus

  //theme:Theme
  //FIXME cannot declare this
  trackFeatures:Map<any,ITrackFeatureState>//Map<any,TrackFeatureConstructorArgs>
  localTrackFeatures?:TrackFeatureConstructorArgs[] //for loading only, not for state sharing

  //other track info?
}


export type TrackFeatureDef = {
  minables: TrackFeatureInstDef[];
  buyables: TrackFeatureInstDef[];
};
/*
export type TrackFeatureZoneDef = {
  xOffsetRange?: number[]; //default +-2, max offset from center. random between 0-maxXOffset
  segmentRange?: number[][];
};
export type TrackFeatureInstDef = {
  type: TrackFeatureType;
  enabled?: boolean; //defaults true
  spawnAmount?: number; //default 2, when decided to spawn, will spawn between 1-spawnAmount (randomly picked)
  spawnPercentage?: number; //default .5. when decided to spawn (see featureDensity) it is the (0-1 probability to spawn it
  maxXCloseness?: number; //default .3 when spawning more than 1, how close together can they get
  zones?: TrackFeatureZoneDef[];
};
*/
export function getTrackFeatureType(str:string){
  return str as TrackFeatureType
}

export interface TrackFeatureConstructorArgs{
    id:string
    name:string
    position:ITrackFeaturePosition
    //triggerSize?:Vector3
    //shape:TrackFeatureShape
    type:TrackFeatureType
    activateTime?:number
    destructable?:boolean
    cost?:CostData[]
    featureDefId?:string
    _featureDef?:TrackFeatureInstDef
}
export interface TrackFeatureUpdate extends TrackFeatureConstructorArgs{
  
}

//can we get rid of and replace with 'TrackFeatureConstructorArgs'?

export interface ITrackFeatureState{
  id:string
  name:string
  position:ITrackFeaturePosition
  //triggerSize?:Vector3
  //shape:TrackFeatureShape
  type:TrackFeatureType //ONLY DIFF???
  status?:TrackFeatureStatus
  activateTime?:number
  lastTouchTime?:number
  lastActivateTime?:number
  expireTime?:number
  cost?:CostData[]
  //rewards:RewardNotification[]
  featureDefId?:string
  _featureDef?: TrackFeatureInstDef
  _zone?: SpawnZoneDef
}

export interface TrackFeatureStateConstructorArgs extends ITrackFeatureState{
}

export type TrackFeaturePositionConstructorArgs={
  position?:Vector3State//optional, if set its the exact spot
  scale?:Vector3State
  rotation?:Quaternion3State//optional, if set its the exact rotation
  
}
/*
export function createTrackFeaturePositionConstructorArgs(position:ITrackFeaturePosition){
  return { 
      startSegment: position.startSegment ,
      endSegment: position.endSegment ,
      offset: position.offset ,
      centerOffset: position.centerOffset
  } 
}*/

export class TrackFeaturePosition implements ITrackFeaturePosition{
  position:Vector3State//optional, if set its the exact spot
  scale?:Vector3State//optional, if set its the exact scale
  rotation?:Quaternion3State//optional, if set its the exact rotation

  //entity:Entity

  constructor(args:TrackFeaturePositionConstructorArgs){
   
    this.position = args.position
    this.scale = args.scale
    this.rotation = args.rotation
    
  }
}










export interface AlterHealthDataState {
  playerIdTo:string
  playerIdFrom:string
  time:number
  desc:string
  amount:number
  position?:Vector3State
  respawnTime?:number
}

















export interface IPlayer{
  id: string;
  name: string;
  score: number;
  coinsCollected: number;
  coinGcCount: number;
  coinMcCount: number;
  coinGuestCount: number;

  rock1Collected: number,
  rock2Collected: number,
  rock3Collected: number,
  petroCollected: number,
  nitroCollected: number,
  bronzeCollected: number,
  
  bronzeShoeCollected: number,
  material1Count: number;
  material2Count: number;
  material3Count: number;

  container1Count: number;

  //not sharing right now (should i?) server side can manage its own way?
  rewards:RewardNotification[]
  coinsCollectedEpoch: number
  coinsCollectedDaily: number
  currentLevel:number
  
  
  pastSavePoints:IPlayer[]
  currentSavePoint:IPlayer//mirror of the client side player but can be reset for mid game save points
  saveInProgress:boolean 
  //playfabBalance:IPlayer//hold what playfab things the balance is 
}

///////


/*
export interface PlayerState{
  id:string
  sessionId:string

  connStatus:PlayerConnectionStatus
  //type:"combatant"|"spectator"

  userData:PlayerUserDataState
  //battleData:PlayerBattleDataState
  //healthData:PlayerHealthDataState
  buttons: PlayerButtonState
  //statsData: PlayerStatsDataState
}*/


export interface ClockState{
  serverTime:number
}
//export type PlayerConnectionStatus="unknown"|"connected"|"reconnecting"|"disconnected"|"lost connection"


/*
export interface PlayerUserDataState{
  name:string
  userId:string
  ///snapshotFace128:string snapshots deprecated use AvatarTexture
}*/
/*
export interface EnrollmentState extends ClockState{
  open:boolean
  startTime:number
  endTime:number
  maxPlayers:number
}*/


export interface CoinRoomState{
  players:Map<any,IPlayer>
  //raceData:RaceState
  //enrollment:EnrollmentState
  levelData:LevelDataState
}


//MOVE TO SHARABLE FILE START
export type CoinSpawnDef={
  min:number
  max:number
  percent?:number//when want a percentage amount
  amount?:number//when want a specific amount
}
export type RemoteCoinSpawnDef={
  type:string
  id:string
  spawnDef:CoinSpawnDef
}

export type RemoteBaseCoinRoomConfig={
  items:{
    notes:string
    defaultSpawnFrequency:number
    spawnFrequency:RemoteCoinSpawnDef[]
  },
  saveInterval:{
    notes:string
    value:number
  },
  coinCap:{
    notes:string
    enabled:boolean
    overageReduction:number
    formula:LevelingFormulaConfig
  }
}
//MOVE TO SHARABLE FILE END