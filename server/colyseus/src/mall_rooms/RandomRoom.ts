import { Client } from "colyseus";
import { BaseCoinRoom } from "./BaseCoinRoom";
import { CONFIG } from "./config";
import { BlockType } from "./MyRoomState";
import { GameEndType, PlayerData } from "./types";



//var PlayFab: PlayFab ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFab");
//var PlayFabClient: PlayFabClientModule.IPlayFabClient ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFabClient");

//let playerLoginResult:LoginResult;

const maxFloorHeight = 6
const defaultPlayerHeight = 1.724029541015625

export class RandomPlacementRoom extends BaseCoinRoom {
  
  onCreate (options: any) {
    super.onCreate(options)
  }

  gameEndedNotify(data:GameEndType){
    super.gameEndedNotify(data)
  }



  setUp() {
    super.setUp()
  }

  //clock loop update, 1 second
  clockIntervalUpdate(elapsedTime:number,dt:number){
    super.clockIntervalUpdate(elapsedTime,dt);

    //if want to random re-replace them
    /*
    const nowMs = new Date().getTime()
    this.state.blocks.forEach((block) => {
      if( block.expireTime !== null && block.expireTime !== undefined && block.expireTime < nowMs  ){
        //console.log("expired-block " + block.id,"block size",this.state.blocks.size)
        this.removeBlockAndGenNew(block.id)
      }
    });
    */
  }

  
  setupCoins() {
    
    this.initCoinsPool()

    let skippedCoin = 0
    let jumpCoin = 0
    let counter = 0
    const skipEveryXCoin = 0;//CONFIG.COIN_SKIP_EVERY_N
    const jumpEveryXCoin = CONFIG.COIN_JUMP_EVERY_N
    //randomly shifts pick spot
    let skipCounterStartPos = Math.floor(Math.random() * skipEveryXCoin)
    let jumpCounterStartPos = Math.floor(Math.random() * jumpEveryXCoin)
    const skipType = CONFIG.COIN_SKIP_TYPE
    const jumpType = CONFIG.COIN_JUMP_TYPE

    for(const p in this.blockList){
      const block = this.blockList[p]
      switch(skipType){
        case 'random':
          //randomly pick
          skipCounterStartPos = Math.floor(Math.random() * skipEveryXCoin)
        break;
        default:  
      }
      switch(jumpType){
        case 'random':
          //randomly pick
          jumpCounterStartPos = Math.floor(Math.random() * jumpEveryXCoin)
        break;
        default:  
      }
      skipCounterStartPos = Math.floor(Math.random() * skipEveryXCoin)

      block.y = defaultPlayerHeight + CONFIG.COIN_HEIGHT_ADJUSTED

      //even skip
      if(skipEveryXCoin == 0 || skipCounterStartPos % skipEveryXCoin != 0){
        if(jumpEveryXCoin != 0 && jumpCounterStartPos % jumpEveryXCoin == 0){
          this.adjustBlockForJumpHeight(block)
          jumpCoin++;
        }
        
      }else{
        //skip it
        skippedCoin++;
      }
      counter++;
    }


    //spawn the first X
    counter = 0
    for(const p in this.blockList){
      const block = this.blockList[p]

      
      if(counter >= 100){
        //this.blockPoolList.push(block)
        break;
      }else{
        this.state.blocks.set(block.id,block)
        counter++;
      }
    }

    //setting to state block size for now but nothing says it cannot grow or not match state block size (hidden coins for example)
    this.maxBlocksCollectable = counter//this.state.blocks.size

    this.state.totalCoins = counter //should this be something else?
    
    console.log("setupCoins(). spawn total:",counter,' poolSize',this.blockPoolList.length,' this.maxBlocksCollectable',this.maxBlocksCollectable," skipped",skippedCoin,'everyXCoin',skipEveryXCoin,'skipType',skipType,'jumpCoin',jumpCoin)
    //randomly change block type
    
  }

  start(){

    super.start();
    
  } 

  collectBlock(client: Client,playerData:PlayerData,id: string) {
    super.collectBlock(client,playerData,id)
  }

  removeBlock(id: string) {
    this.removeBlockAndGenNew(id)  
  }

  removeBlockAndGenNew(id: string) {
    const blockToCollect = this.state.blocks.get( id );

    this.returnBlockToPool(blockToCollect)

    const delFromState=this.state.blocks.delete(id)
    
    //const atIndex = blockToCollect.
    //this.blockList.fi
    const atIndex = this.blockList.indexOf(blockToCollect)
    //console.log("collectBlock atIndex:" + atIndex,"deletedFromState:",delFromState," blockSize",this.state.blocks.size)
    const previousBlock2 = atIndex > -1 && this.blockList.length >= 2 && this.blockList[atIndex - 2] != null ? this.blockList[atIndex - 2] : {x:0,y:0,z:0};
    const previousBlock = atIndex > -1 && this.blockList.length >= 1  && this.blockList[atIndex - 1] != null ? this.blockList[atIndex - 1]: {x:0,y:0,z:0};
    const maxDistance = 32;

    const block = this.getBlockFromPool()

    const nowMs = new Date().getTime()
    block.createTime = nowMs
    block.expireTime = nowMs + (10*1000)
    
    //
    // let's set next block position!

    // y is 1 block higher.
    if(block.y > maxFloorHeight){
      console.log("move block to floor height")
      block.y = defaultPlayerHeight + CONFIG.COIN_HEIGHT_ADJUSTED;
    }

    do {
      // ensure next block's X is not too close to previous block.
      block.x = this._applyBoundaries(previousBlock.x - maxDistance + (Math.random() * (maxDistance * 2)));
    } while (
      Math.abs(block.x - previousBlock.x) < 1 ||
      (previousBlock2 && Math.abs(block.x - previousBlock2.x) < 1)
    );

    do {
      // ensure next block's Z is not too close to previous block.
      block.z = this._applyBoundaries(previousBlock.z - maxDistance + (Math.random() * (maxDistance * 2)));
    } while (
      Math.abs(block.z - previousBlock.z) < 1 ||
      (previousBlock2 && Math.abs(block.z - previousBlock2.z) < 1)
    );

    
    this.state.blocks.set(block.id,block)
  }

  _applyBoundaries(coord: number) {
    // ensure value is between 1 and 15.
    return Math.max(2, Math.min((CONFIG.PARCEL_SIZE * 16) - 2, coord));
  }


  factoryNewBlock(args?:BlockType) {
    return super.factoryNewBlock(args);
  }

  onAuth(client:Client, options:any):Promise<any> { 
    return super.onAuth(client,options)
  }

  onJoin (client: Client, options: any) {
    super.onJoin(client,options)
  }
 
  async onLeave (client: Client, consented: boolean) {
    super.onLeave(client,consented)
  }

  onDispose() {
    super.onDispose()
  }

}


