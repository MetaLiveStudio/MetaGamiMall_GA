import { Schema, Context, ArraySchema, MapSchema, type } from "@colyseus/schema";
import * as serverStateSpec from "./MyRoomStateSpec";



export class PlayerSavePoint implements serverStateSpec.IPlayer{
  id: string;
  name: string;
  score: number;
  coinsCollected: number;
  coinGcCount: number;
  coinMcCount: number;
  coinGuestCount: number;

  coinVbCount: number;
  coinAcCount: number;
  coinZcCount: number;
  coinRcCount: number;

  rock1Collected: number;
  rock2Collected: number;
  rock3Collected: number;
  petroCollected: number;
  nitroCollected: number;
  bronzeCollected: number;

  material1Count: number;
  material2Count: number;
  material3Count: number;

  bronzeShoeCollected:number
  
  container1Count: number;

  //not sharing right now (should i?) server side can manage its own way?
  rewards:serverStateSpec.RewardNotification[]
  coinsCollectedEpoch: number
  coinsCollectedDaily: number
  currentLevel:number

  pastSavePoints:serverStateSpec.IPlayer[] = []
  currentSavePoint:serverStateSpec.IPlayer//mirror of the client side player but can be reset for mid game save points
  saveInProgress:boolean = false
  playfabBalance:serverStateSpec.IPlayer//hold what playfab things the balance is
}

export class Player extends Schema implements serverStateSpec.IPlayer{
  @type("string") id: string;
  @type("string") name: string;
  @type("number") score: number;
  @type("number") coinsCollected: number;
  @type("number") coinGcCount: number;
  @type("number") coinMcCount: number;

  @type("number") coinVbCount: number;
  @type("number") coinAcCount: number;
  @type("number") coinZcCount: number;
  @type("number") coinRcCount: number;

  @type("number") coinGuestCount: number;

  @type("number") rock1Collected: number;
  @type("number") rock2Collected: number;
  @type("number") rock3Collected: number;
  @type("number") petroCollected: number;
  @type("number") nitroCollected: number;
  @type("number") bronzeCollected: number;

  @type("number") bronzeShoeCollected: number;
  

  
  @type("number") material1Count: number;
  @type("number") material2Count: number;
  @type("number") material3Count: number;

  @type("number") container1Count: number;

  //@type("number") coinCollectDailyCapPercent: number = -1; //-1 means disabled

  

  //not sharing right now (should i?) server side can manage its own way?
  playerFabId:string
  playFabAuthenticated:boolean = false //if playfab authed successfully
  rewards:serverStateSpec.RewardNotification[]
  coinsCollectedEpoch: number //move this to state so can sync back?
  coinsCollectedDaily: number //move this to state so can sync back?
  currentLevel:number
  pastSavePoints:serverStateSpec.IPlayer[] = []
  currentSavePoint:serverStateSpec.IPlayer//mirror of the client side player but can be reset for mid game save points
  saveInProgress:boolean = false
  playfabBalance:serverStateSpec.IPlayer//hold what playfab things the balance is
}


export type BlockDefType = {
  symbol:string,
  name: string,
  itemId?: string
}



export type BlockMaterialDefType = BlockDefType & {
  itemId?: string
}

//not sure can pass enums with colysis so using basic strings
export const BlockTypeTypeConst = {
  GC: {symbol:`GC`,name:'LilCoins'} as BlockDefType,
  MC: {symbol:`MC`,name:'MetaCash'} as BlockDefType,

  //VB: {symbol:`VB`,name:'VB'} as BlockDefType,
  AC: {symbol:`AC`,name:'AC'} as BlockDefType,
  ZC: {symbol:`ZC`,name:'ZC'} as BlockDefType,
  RC: {symbol:`RC`,name:'RC'} as BlockDefType,

  R1: {symbol:`R1`,name:'R1',itemId:'Rock.1'} as BlockMaterialDefType,
  R2: {symbol:`R2`,name:'R2',itemId:'Rock.2'} as BlockMaterialDefType,
  R3: {symbol:`R3`,name:'R3',itemId:'Rock.3'} as BlockMaterialDefType,
  BZ: {symbol:`BZ`,name:'Bronze',itemId:'Bronze.1'} as BlockMaterialDefType,
  NI: {symbol:`NI`,name:'Nitro',itemId:'Nitro.1'} as BlockMaterialDefType,
  BP: {symbol:`BP`,name:'Petro',itemId:'Petro.1'} as BlockMaterialDefType,
  

  //https://community.playfab.com/questions/49666/craft-systemcrafting-system.html
  M1: {symbol:`M1`,name:'Material1',itemId:'Material.1'} as BlockMaterialDefType,
  M2: {symbol:`M2`,name:'Material2',itemId:'Material.2'} as BlockMaterialDefType,
  M3: {symbol:`M3`,name:'Material3',itemId:'Material.3'} as BlockMaterialDefType,
  BRONZE_SHOE1: {symbol:`item.bronze.shoe`,name:'Bronze.Shoe',itemId:'item.bronze.shoe'} as BlockMaterialDefType,

  C1: {symbol:`C1`,name:'Container1',itemId:'Container.1'} as BlockMaterialDefType,

  STAT_RAFFLE_COIN_BAG: {symbol:`raffle_coin_bag`,name:'raffle_coin_bag',itemId:'item.stat.raffle_coin_bag'} as BlockMaterialDefType,
  TICKET_RAFFLE_COIN_BAG: {symbol:`item.ticket.raffle_coin_bag`,name:'raffle_coin_bag ticket',itemId:'item.ticket.raffle_coin_bag'} as BlockMaterialDefType,
  
  VB: {symbol:`VB`,name:'VoxBuck'} as BlockDefType
}


export type BlockType={
  id: string;
  x: number;
  y: number;
  z: number;
  createTime?: number;
  expireTime?: number;
  value?: number;
  type?: string;
  visible: boolean;
  collectedBy?: string;
}

export class Block extends Schema {
  @type("string") id: string;
  @type("number") x: number;
  @type("number") y: number;
  @type("number") z: number;
  @type("number") createTime: number;
  @type("number") expireTime: number;
  @type("number") value: number;
  @type("string") type: string;
  @type("boolean") visible: boolean;
  @type("string") collectedBy: string;
}





export class Quaternion3State extends Schema implements serverStateSpec.Quaternion3State {

  @type("number")
  x: number;
  @type("number")
  y: number;
  @type("number")
  z: number;
  @type("number")
  w: number;

  constructor(x: number, y: number, z: number, w: number) {
    super()
    this.x = x
    this.y = y
    this.z = z
    this.w = w
  }
  //this wont update entire object state but just the individual properties
  copyFrom(q: serverStateSpec.Quaternion3State) {
    this.x = q.x
    this.y = q.y
    this.z = q.z
    this.w = q.w
  }
}
export class Vector3State extends Schema implements serverStateSpec.Vector3State {

  @type("number")
  x: number;
  @type("number")
  y: number;
  @type("number")
  z: number;

  constructor(x: number, y: number, z: number) {
    super()
    this.x = x
    this.y = y
    this.z = z
  }
  //this wont update entire object state but just the individual properties
  copyFrom(vec3: serverStateSpec.Vector3State) {
    this.x = vec3.x
    this.y = vec3.y
    this.z = vec3.z
  }
}
export class TrackFeaturePositionState extends Schema implements serverStateSpec.ITrackFeaturePosition {
  @type(Vector3State)
  position:Vector3State//optional, if set its the exact spot
  @type(Vector3State)
  scale:Vector3State//optional, if set its the exact spot
  //rotation?:Quaternion3State//optional, if set its the exact rotation
  

  constructor(){//(args: serverStateSpec.TrackFeaturePositionConstructorArgs) {
    super()

    //this.copyFrom(args)    
  }
  copyFrom(args: serverStateSpec.TrackFeaturePositionConstructorArgs) {
    if(!args) return
   
    if (args.position) this.position = new Vector3State(args.position.x, args.position.y, args.position.z)
    if (args.scale){
       this.scale = new Vector3State(args.scale.x, args.scale.y, args.scale.z)
    }
    
    
  }
}
export class CostDataState extends Schema implements serverStateSpec.ICostDataState {
  
  @type("string")
  type: serverStateSpec.NFTUIDataPriceType
  @type("string")
  id: string
  @type("number")
  amount: number

  constructor(args?: serverStateSpec.ICostDataState) {
    super()

    if(args !== undefined){
      this.type = args.type
      this.id = args.id
      this.amount = args.amount
    }
  }
}
export class TrackFeatureState extends Schema implements serverStateSpec.ITrackFeatureState {
  @type("string")
  id: string
  
  @type("string")
  name: string

  @type(TrackFeaturePositionState)
  position: TrackFeaturePositionState = new TrackFeaturePositionState()
  //triggerSize?:Vector3
  //shape:TrackFeatureShape

  @type("string")
  type: string

  @type("number")
  activateTime?: number

  @type("number")
  expireTime?: number

  @type("number")
  lastActivateTime?:number

  @type("number")
  lastTouchTime?:number

  @type("number")
  serverTime: number = -1

  @type("string")
  status: serverStateSpec.TrackFeatureStatus = 'not-init'

  @type("string")
  featureDefId: string

  //TODO add this here
  @type([ CostDataState ])
  cost?:serverStateSpec.ICostDataState[] = new ArraySchema<serverStateSpec.ICostDataState>()

  //rewards:serverStateSpec.RewardNotification[]

  _featureDef?: serverStateSpec.TrackFeatureInstDef
  _zone?: serverStateSpec.SpawnZoneDef


  //FIXME need colyseus state version of this!
  constructor(args: serverStateSpec.TrackFeatureStateConstructorArgs) {
    super()

    this.id = args.id
    this.name = args.name
    //this.position = args.position
    this.type = args.type
    this.activateTime = args.activateTime
    this.position.copyFrom(args.position)
    this.featureDefId = args.featureDefId
    this._featureDef = args._featureDef
    if(args.cost!==undefined){
      for(const p of args.cost){
        this.cost.push( new CostDataState(p) )
      }
    }
    //this.position.copyFrom(args.position)
    //if(args.offset) this.offset = args.offset
  }

  updateServerTime(now:number) {
    this.serverTime = now
  }

  isActive(now:number){
    return this.activateTime < now && (this.expireTime === undefined || this.expireTime > now)
  }
}

export class ServerInfo extends Schema implements serverStateSpec.ServerInfo {
  @type("string") instanceId:string
  @type("string") appId:string
  @type("string") provider:string
  @type("string") region:string
}
export class LevelDataState extends Schema implements serverStateSpec.LevelDataState {

  @type("string")
  id: string
  @type("string")
  name: string
  //status:RaceStatus

  @type("number") coinsCollectedDailyVersion: number = -1;//-1 not set//keep track when state version rolls over


  //theme:Theme
  //@type([ TrackFeatureState ])
  //trackFeatures = new ArraySchema<TrackFeatureState>();
  @type({ map: TrackFeatureState })
  trackFeatures = new MapSchema<serverStateSpec.ITrackFeatureState>();

  _featureDef:serverStateSpec.TrackFeatureDef

  copyFrom(retval: serverStateSpec.LevelDataState,now:number) {
    this.id = retval.id
    this.name = retval.name
    
    this.trackFeatures.clear()

    if(retval.trackFeatures){
      retval.trackFeatures.forEach( (value:serverStateSpec.ITrackFeatureState)=>{
        const trackFeat = value//retval.localtrackFeatures[p]
        const stateTrackFeat = new TrackFeatureState( trackFeat )
        stateTrackFeat.updateServerTime(now)

        console.log("stateTrackFeat.type",stateTrackFeat.type)
        
        stateTrackFeat.position.copyFrom( trackFeat.position )
        this.trackFeatures.set(stateTrackFeat.id,stateTrackFeat)
        //this.trackFeatures[stateTrackFeat.name] = stateTrackFeat
      } )
    }
    if(retval.localTrackFeatures){
      for(const p in retval.localTrackFeatures){
        const trackFeat = retval.localTrackFeatures[p]
        //trackFeat.heatlh
        //console.log("trackFeat.id",trackFeat.id,"trackFeat.name",trackFeat.name)
        const args: serverStateSpec.TrackFeatureStateConstructorArgs = {
          id:trackFeat.id,
          name:trackFeat.name,
          position:trackFeat.position,
          type: trackFeat.type,
          activateTime: trackFeat.activateTime,
          cost: trackFeat.cost
          //health:trackFeat.health,
          //serverTime: now
        }
        const stateTrackFeat = new TrackFeatureState( args )
        stateTrackFeat.updateServerTime(now)
        //assign feature def to it
        stateTrackFeat._featureDef = trackFeat._featureDef
        stateTrackFeat.featureDefId = trackFeat.featureDefId
        //console.log("stateTrackFeat.type",stateTrackFeat.type)
        
        stateTrackFeat.position.copyFrom( trackFeat.position )
        this.trackFeatures.set( stateTrackFeat.id, stateTrackFeat )
      } 
    }

  }

  copyTo(retval: serverStateSpec.LevelDataState) {
    retval.id = this.id
    retval.name = this.name
    //retval.trackFeatures = this.trackFeatures
  }
}




export class MyRoomState extends Schema implements serverStateSpec.CoinRoomState{
  @type("number") serverTime: number = -1//-1 not set;
  @type("number") playFabTime: number = -1//-1 not set;

  @type("number") countdown: number;
  @type("number") totalCoins: number; //NOT USED???
  //@type([Block]) blocks = new ArraySchema<Block>();
  //const map = new MapSchema<string>();
  @type({ map: Block }) blocks = new MapSchema<Block>();
  @type({ map: Player }) players = new MapSchema<Player>();
  @type(LevelDataState)
  levelData = new LevelDataState()

}