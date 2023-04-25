import { ImageSection } from '@dcl/npc-scene-utils'

export type WearableBoothInitArgs = {
  sceneId?: string;
  parent: Entity;
  featureEntity: Entity;
  name?: string;
  contract: string;
  itemId: string;
  options: WearableOptionsType;
};

export type WearableBoothArgs = {
  sceneId?: string;
  name?: string;
  contract: string;
  itemId: string;
  transform?: TransformConstructorArgs;
  options: WearableOptionsType;
};

export type ButtonDataType = {
  text: string;
  hoverTextBuyable: string;
};

export type MotionDataType = {
  rotationVelocity?: Quaternion;
  moveVelocity: Vector3; //right now only vector.y is used
  moveInterval: number; //default is 1 second
};

export type NFTUIDataPriceType='VirtualCurrency'|'Material'

export type NFTUIDataCost = {
  price: number,
  type: NFTUIDataPriceType
  id: string,
  label: string
};
export type NFTUIData = {
  style: string;
  type: string;
  title: string;
  detailsTitle?: string
  image: string;
  imageSection?: ImageSection
  imageHeight?:number
  imageWidth?:number
  cost?: NFTUIDataCost[];
  detailsInfo: string;
  detailsFontSize: number;
  directLink: string;
  directLinkFontSize: number;
  showStockQty?:boolean //defaults to true
  qtyCurrent?:number;
  qtyTotal?:number;
  claimWindowEnabled?:boolean,//defaults to false
  claimStartMS?: number,
  claimEndMS?: number,
};
export type FeaturedEntityData = {
  shapeName: string;
  entityName?: string;
  motionData?: MotionDataType;
  hoverText: string;
  transform?: TransformConstructorArgs;
  parent?: Entity;
};
export type CardData = {
  buttonData: ButtonDataType;
  cardOffset?: Vector3;
  currencyText?: string;
  url?: string;
  autoSelected?: boolean;
  startSelected?: boolean;
};

export type WearableOptionsType = {
  type: string;
  featuredEntityData?: FeaturedEntityData;
  nftUIData?: NFTUIData;
  cardData?: CardData;
};
