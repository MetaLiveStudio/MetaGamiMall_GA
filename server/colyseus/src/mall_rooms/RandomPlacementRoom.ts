import { Client } from "colyseus";
import { BaseCoinRoom } from "./BaseCoinRoom";
import { CONFIG } from "./config";
import { Block, BlockType } from "./MyRoomState";
import { GameEndType, PlayerData } from "./types";



//var PlayFab: PlayFab ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFab");
//var PlayFabClient: PlayFabClientModule.IPlayFabClient ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFabClient");

//let playerLoginResult:LoginResult;

const maxFloorHeight = 6
const defaultPlayerHeight = 1.724029541015625
const maxDistanceRndPosition = (CONFIG.PARCEL_SIZE/2) * 16;

export class RandomPlacementRoom extends BaseCoinRoom {
  protected numCoinsToPlace = 100
  protected reshuffleCount = 1
  
  
  onCreate (options: any) {
    super.onCreate(options)

    this.onMessage("reshuffle-block", (client: Client, id: string) => {
      console.log("reshuffle ",this.state.blocks.size,this.state.countdown)
      if(this.reshuffleCount > 0 
          && 
          (this.state.blocks.size > (this.numCoinsToPlace*.5) || this.state.countdown > 150)){
        client.send("inGameMsg","You must find a few coins or at least search a bit first") 
      }else if(this.reshuffleCount > 0 ){
        this.reshuffleCount --

        console.log("reshuffle ",this.state.blocks)
        
        this.state.blocks.forEach((value: Block, key: string)=>{
          const block = value
          console.log("xxxx ",block)
          //this.removeBlockAndGenNew(block.id)
        })

        const keys = Array.from(this.state.blocks.keys())
        /*for(const p in keys){
          const block = this.state.blocks.get(keys[p])
          console.log("reshuffle.remove ",p,keys[p],block)
          super.removeBlock(block.id)
          //this.randomlyPlaceBlock(block)
        }*/
        //must reshuffle them
      
        for(const p in keys){
          const block = this.state.blocks.get(keys[p])
          //const block = this.getBlockFromPool()
          console.log("reshuffle.add ",p,keys[p],block)
          
          //this.randomlyPlaceBlock(block)
          this.removeBlockAndGenNew(block.id)

          //console.log("adding to state block ",block.id,block.x)
          //this.state.blocks.set(block.id,block)
          //this.randomlyPlaceBlock(block)
        }

        client.send("inGameMsg","Coins reshuffled") 
      
        
      }else{
        //"All reshuffles used"
       // client.send
       client.send("inGameMsg","All reshuffles used") 
      }
    })
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
    //if want to random re-replace them
    if(this.enableOnExpireRespawn){
      const nowMs = new Date().getTime()
      this.state.blocks.forEach((block) => {
        if( block.expireTime !== null && block.expireTime !== undefined && block.expireTime < nowMs  ){
          console.log("expired-block " + block.id,"block size",this.state.blocks.size)
          this.removeBlockAndGenNew(block.id)
        }
      });
    }
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

      //if do nothing else it will just flatten the level
      //calling adjust to get random placement
      block.x = this._applyBoundaries((Math.random() * (maxDistanceRndPosition * 2)));
      block.z = this._applyBoundaries( (Math.random() * (maxDistanceRndPosition * 2)));

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

      
      if(counter >= this.numCoinsToPlace){
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
  
  postCollectBlockAction(playerData:PlayerData,id: string,block:Block) {
    super.postCollectBlockAction(playerData,id,block)

    if(this.enableOnCollectRespawn){
      //if easy spawn new
      this.assignRandomBlockPosition(block)

      //will schedule it to be added to state when time comes
      this.addToSpawnMgr(block,"postCollectBlockAction.randomlyPlaceBlock",false)
    }
  }

  removeBlock(id: string) {
    super.removeBlock(id)
  }

  removeBlockAndGenNew(id: string) {
    const blockToCollect = this.state.blocks.get( id );

    this.returnBlockToPool(blockToCollect)

    const delFromState=this.state.blocks.delete(id)
    

    const block = this.getBlockFromPool()

    this.assignRandomBlockPosition(block)

    //will schedule it to be added to state when time comes
    this.addToSpawnMgr(block,"removeBlockAndGenNew",false)
  }

  assignRandomBlockPosition(block:Block){

    //const atIndex = blockToCollect.
    //this.blockList.fi
    const atIndex = this.blockList.indexOf(block)
    console.log("collectBlock atIndex:" + atIndex," blockSize",this.state.blocks.size)
    const previousBlock2 = atIndex > -1 && this.blockList.length >= 2 && this.blockList[atIndex - 2] != null ? this.blockList[atIndex - 2] : {x:0,y:0,z:0};
    const previousBlock = atIndex > -1 && this.blockList.length >= 1  && this.blockList[atIndex - 1] != null ? this.blockList[atIndex - 1]: {x:0,y:0,z:0};
    

    if(this.expireTimeInSeconds >= 0){
      const nowMs = new Date().getTime()
      block.createTime = nowMs
      block.expireTime = nowMs + (this.expireTimeInSeconds)
    }else{
      block.expireTime = -1
    }
    
    //
    // let's set next block position!

    // y is 1 block higher.
    if(block.y > maxFloorHeight){
      console.log("move block to floor height")
      block.y = defaultPlayerHeight + CONFIG.COIN_HEIGHT_ADJUSTED;
    }

    do {
      // ensure next block's X is not too close to previous block.
      block.x = this._applyBoundaries(previousBlock.x - maxDistanceRndPosition + (Math.random() * (maxDistanceRndPosition * 2)));
    } while (
      Math.abs(block.x - previousBlock.x) < 1 ||
      (previousBlock2 && Math.abs(block.x - previousBlock2.x) < 1)
    );

    do {
      // ensure next block's Z is not too close to previous block.
      block.z = this._applyBoundaries(previousBlock.z - maxDistanceRndPosition + (Math.random() * (maxDistanceRndPosition * 2)));
    } while (
      Math.abs(block.z - previousBlock.z) < 1 ||
      (previousBlock2 && Math.abs(block.z - previousBlock2.z) < 1)
    );

    this.makeAllFieldsDirty( block )
    //force touch all
    //block.
    //const origId = block.id
    //block.y ++; block.y --
    //block.id = block.id + "x"
    //block.id = origId

    //block.x = 2.2
    //block.z = 2.2
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


