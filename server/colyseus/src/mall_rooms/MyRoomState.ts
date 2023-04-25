import { Schema, Context, ArraySchema, MapSchema, type } from "@colyseus/schema";

export interface IPlayer{
  id: string;
  name: string;
  score: number;
  coinsCollected: number;
  coinGcCount: number;
  coinMcCount: number;
  coinGuestCount: number;

  material1Count: number;
  material2Count: number;
  material3Count: number;

  container1Count: number;

  //not sharing right now (should i?) server side can manage its own way?
  rewards:RewardNotification[]
  coinsCollectedEpoch: number
  currentLevel:number
  
  
  pastSavePoints:IPlayer[]
  currentSavePoint:IPlayer//mirror of the client side player but can be reset for mid game save points
  saveInProgress:boolean 
}

export class PlayerSavePoint implements IPlayer{
  id: string;
  name: string;
  score: number;
  coinsCollected: number;
  coinGcCount: number;
  coinMcCount: number;
  coinGuestCount: number;

  material1Count: number;
  material2Count: number;
  material3Count: number;

  container1Count: number;

  //not sharing right now (should i?) server side can manage its own way?
  rewards:RewardNotification[]
  coinsCollectedEpoch: number
  currentLevel:number

  pastSavePoints:IPlayer[] = []
  currentSavePoint:IPlayer//mirror of the client side player but can be reset for mid game save points
  saveInProgress:boolean = false
}

export class Player extends Schema implements IPlayer{
  @type("string") id: string;
  @type("string") name: string;
  @type("number") score: number;
  @type("number") coinsCollected: number;
  @type("number") coinGcCount: number;
  @type("number") coinMcCount: number;
  @type("number") coinGuestCount: number;

  @type("number") material1Count: number;
  @type("number") material2Count: number;
  @type("number") material3Count: number;

  @type("number") container1Count: number;

  //not sharing right now (should i?) server side can manage its own way?
  rewards:RewardNotification[]
  coinsCollectedEpoch: number
  currentLevel:number
  pastSavePoints:IPlayer[] = []
  currentSavePoint:IPlayer//mirror of the client side player but can be reset for mid game save points
  saveInProgress:boolean = false
}


export type BlockDefType = {
  symbol:string,
  name: string,
  itemId?: string
}



export type RewardData = {
  amount: number,
  type: NFTUIDataPriceType
  id: string
};
  type NFTUIDataPriceType='VirtualCurrency'|'Material'

export type RewardNotification={
  rewardType:string
  newLevel:number,
  rewards:RewardData[]
}

export type BlockMaterialDefType = BlockDefType & {
  itemId?: string
}

//not sure can pass enums with colysis so using basic strings
export const BlockTypeTypeConst = {
  GC: {symbol:`GC`,name:'LilCoins'} as BlockDefType,
  MC: {symbol:`MC`,name:'MetaCash'} as BlockDefType,

  //https://community.playfab.com/questions/49666/craft-systemcrafting-system.html
  M1: {symbol:`M1`,name:'Material1',itemId:'Material.1'} as BlockMaterialDefType,
  M2: {symbol:`M2`,name:'Material2',itemId:'Material.2'} as BlockMaterialDefType,
  M3: {symbol:`M3`,name:'Material3',itemId:'Material.3'} as BlockMaterialDefType,

  C1: {symbol:`C1`,name:'Container1',itemId:'Container.1'} as BlockMaterialDefType,

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

export class MyRoomState extends Schema {
  @type("number") countdown: number;
  @type("number") totalCoins: number; //NOT USED???
  //@type([Block]) blocks = new ArraySchema<Block>();
  //const map = new MapSchema<string>();
  @type({ map: Block }) blocks = new MapSchema<Block>();
  @type({ map: Player }) players = new MapSchema<Player>();
}
