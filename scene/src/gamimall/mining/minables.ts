import * as ui from "@dcl/ui-scene-utils";
import * as utils from '@dcl/ecs-scene-utils'
//import { scene } from "./sceneData";
import { movePlayerTo } from '@decentraland/RestrictedActions'
import { GAME_STATE } from "src/state";
import * as serverStateSpec from "src/gamimall/state/MyRoomStateSpec";
import { REGISTRY } from "src/registry";
//import { isNull } from "src/utils/utilities";
import { CONFIG } from 'src/config';
import { SOUND_POOL_MGR } from 'src/meta-decentrally/modules/resources/sounds';
import { isNull } from 'src/utils';
import { CustomClaimPrompt, CustomOkPrompt, CustomRewardPrompt } from 'src/ui/modals';
import { get2dUICostFormat } from '../vcUtils';
import { RESOURCES } from '../resources';
import { RewardNotification } from '../coin';
import { PickAxe, PICK_AXE_MANAGER } from "./pickAxeMgr";
import { getOrCreateGLTFShape } from "src/meta-decentrally/resources/common";
import { IntervalUtil } from "src/meta-decentrally/modules/interval-util";
//import * as clientState from "src/gamimall/state/client-state-spec";

/*const respawner = new Entity()
respawner.addComponent(new BoxShape())
respawner.addComponent(new Transform({ position: new Vector3(28, 2, 28) }))
respawner.addComponent(
  new OnPointerDown(
    (e) => {
      movePlayerTo({ x: 40, y: 12, z: 28 }, { x: 96, y: 12, z: 64 })
    },
    { hoverText: "Teleport Up" }
  )
)

engine.addEntity(respawner)*/

const tileShape = new GLTFShape("models/MineGame/MineRock.glb")
const tileShape2 = tileShape

const MODULE = "minables"

const SCALE_HIDDEN = new Vector3(0,0,0)

let rewardOpts = { 
    height: 550,
    costShowIcons: false
 };
const confirmMinePrompt20 = new CustomClaimPrompt({
    imagePath:
      "https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x47f8b9b9ec0f676b45513c21db7777ad7bfedb35:0/thumbnail",
    imageWidth: 1024,
    imageHeight: 1024,
    itemName: "Mine Item",
    subtitleItemName: "Class: Rock",
    subtitle:
      "This a Rock, just mine it.",
    title: "INTRODUCTION",
    coins: "x 3000",
    dollars: "x 1000",
    //itemQtyCurrent: 23,
    //itemQtyTotal:100,
    options: rewardOpts,
  });
  confirmMinePrompt20.claimButton.label.value = "Mine"
  
const notEnoughClaimPromptGrid = new CustomRewardPrompt(
    "Mine",
    "It will cost",
    "x111",
    "x111",
    "Confirm",
    "This is enough for me..",
    "Join Raffle",
    "Under Development...",
    () => {},
    () => {},
    {
      height: 430,
    }
  );


const notEnoughClaimPromptBasic = new CustomOkPrompt(
    "Notice",
    "Sorry. You do not have enough funds.",
    "OK",
    () => {}
  );
  //endGamePrompt20.show()
  //REGISTRY.ui.endGameConfirmPrompt = endGameConfirmPrompt20;

const maxInventoryPromptBasic = new CustomOkPrompt(
    "Notice",
    "Sorry. You already have maxed out this item",
    "OK",
    () => {}
  );
  //endGamePrompt20.show()
  //REGISTRY.ui.endGameConfirmPrompt = endGameConfirmPrompt20;


const DEFAULT_DEBOUNCE_TIME = 7500
class Block {
    
    blockShape:GLTFShape =  tileShape
    
    entity:Entity    
    health:number
    maxHealth:number = 1
    id:string
    debounceInterval:IntervalUtil = new IntervalUtil(DEFAULT_DEBOUNCE_TIME,'abs-time')

    transformArgs:TransformConstructorArgs
   
    //trackFeat: serverStateSpec.ITrackFeatureState

    visible:boolean = false
    activateTime:number=Number.MAX_VALUE
    respownTime:number = 1000//CONFIG.TILE_RESPAWN_TIME
    destoryTime:number = 0

    tool?:PickAxe
    lastHitPoint:ReadOnlyVector3

    serverState:serverStateSpec.ITrackFeatureState

    constructor(_id:string,type:string){
        this.id = _id
        this.transformArgs = {position:Vector3.One(),scale:Vector3.One()}
        
        this.entity = new Entity(this.id)
        this.entity.addComponent(this.blockShape)      
        //this.entity.addComponent(SOUNDS.woodExplodeSource)
        this.entity.addComponent(new Transform( 
            
        ))

        

       
        engine.addEntity(this.entity)
        
        this.reset() 

    }
    startMining() {
        log("startMining","ENTRY")
        //compute object center then offset it
        const objectPos = this.transformArgs.position
        const playerPos = Camera.instance.feetPosition

        //get direction from player and center of object
        //then move it towards the player by a bit
        const dir = objectPos.subtract(playerPos).normalize().scale(
            this.serverState?._featureDef?.ui?.tool?.distanceOffCenterTarget ? this.serverState?._featureDef?.ui?.tool?.distanceOffCenterTarget : -1.80
        )
             
        if(this.serverState?._featureDef?.ui?.tool?.enabled && this.serverState?._featureDef?.ui?.tool?.model){
            //this.entity.getComponent(OnPointerDown).distance = this.serverState._featureDef.ui.clickDistance
            const modelToUse = this.serverState?._featureDef?.ui?.tool?.model
            const toolScale = this.serverState?._featureDef?.ui?.tool?.transformScale

            this.tool = PICK_AXE_MANAGER.spawnAxe(modelToUse,new Transform({
                position: this.transformArgs.position.add(dir),
                scale: toolScale
            }),true)

            const tf=  this.tool.getComponent(Transform)
            //rotate so looks like axe handle is facing player
            tf.lookAt( playerPos )
            //rotate 180
            tf.rotate(new Vector3(0,1,0),-90)
        }else{
            //not enabled
        }

        
        //const eurlers = 
        //this.tool.getComponent(Transform).rotation = 
    }
    endMining() {
        if(this.tool !== undefined){
            const toolHideDelay = this.serverState?._featureDef?.ui?.tool?.onHideDelayMS
            
            const hideAction = ()=>{
                this.tool.hide()
                this.tool = undefined    
            }
            if(toolHideDelay){
                utils.setTimeout(toolHideDelay,()=>{
                    hideAction()
                })
            }else{
                hideAction()
            }
            
        }else{ 
            log("endMining","has no tool to hide")
        }
    }
    updateFromServer(trackFeat: serverStateSpec.ITrackFeatureState){
        const METHOD_NAME = "updateFromServer"
         
        log(MODULE,METHOD_NAME,"ENTRY",this.id,trackFeat);
        
        this.serverState = trackFeat
        
        
        this.blockShape = this.getMinableShape()

        if(this.entity.hasComponent(GLTFShape) && this.entity.getComponent(GLTFShape).src !== this.blockShape.src){
            log(MODULE,METHOD_NAME,"changing shape",this.id,this.entity.getComponent(GLTFShape).src,"to",this.blockShape.src);
            this.entity.addComponentOrReplace(this.blockShape)  
        }else{
            log(MODULE,METHOD_NAME,"no shape change",this.id,this.blockShape.src);
        }
        
        if(this.entity.hasComponent(OnPointerDown)){
            if(this.serverState?._featureDef?.ui){ 
                this.entity.getComponent(OnPointerDown).hoverText = this.serverState._featureDef.ui.hoverText
            }
            if(this.serverState?._featureDef?.ui?.clickDistance){
                this.entity.getComponent(OnPointerDown).distance = this.serverState._featureDef.ui.clickDistance
            }
        }else{
            log(MODULE,METHOD_NAME,"no onpointer to update",this.id);
        }

        const val = 0
        if(this.visible && val <= 0 ){
            log(MODULE,METHOD_NAME,this.id,"set destroy time",trackFeat.status)
            this.destoryTime = trackFeat.lastTouchTime
            this.activateTime = trackFeat.activateTime
        }  
        if(trackFeat.position !== undefined){
            log(MODULE,METHOD_NAME,this.id,"update position",trackFeat.status)
            const tf = this.entity.getComponent(Transform)
            if(trackFeat.status !== 'active'){
                
            }
            this.updateStateUI()
        }
        //this.updateHealth(val)
        //debugger
        switch(trackFeat.status){
            case 'active':
                this.show()
                break;
            default: 

                this.endMining()//not part of hide as may want hide to be affect of mining
      
                this.hide()
        }
           
    }
    
    updateHealth(val:number){
        const METHOD_NAME = "updateHealth"
        //log("updateHealth",this.id,"new",val,"current:",this.health)  
        
        const oldHealth = this.health
        this.health = val

        

        if(oldHealth>0 && this.health <= 0){
            this.destoryTime = this.getGameTime()
            this.scheduleShow()
        }

        //maybe need a timer for this
        //log(MODULE,METHOD_NAME,this.id,"ENTRY",this.health)
        if(oldHealth >= 1 && this.health < 1){
            //here so hide does not have a sound side affect
            SOUND_POOL_MGR.miningReward.playOnce(this.entity)
            log("dioBreakSound")
        }
        this.checkHealth()
    }
    checkHealth(){
        const METHOD_NAME = "checkHealth"
        //log(MODULE,METHOD_NAME,this.id,"ENTRY",this.health)
        if(this.health < 1){
            this.hide()
        }else{
            /*SOUND_POOL_MGR.destructibleHitSound.playOnce(this.entity)
            log("dioHitSound")*/
            this.show()
        }
    }
    
    getMinableShape():GLTFShape{
        log("getMinableShape","ENTRY")
        if(this.serverState?._featureDef?.ui.minableModel){
            log("getMinableShape","this.serverState.type using config value ",this.serverState.type,this.serverState?._featureDef?.ui.minableModel)
            return getOrCreateGLTFShape( this.serverState?._featureDef?.ui.minableModel )
        }else{
            log("getMinableShape","this.serverState.type assign here",this.serverState.type)
            switch(this.serverState.type){
                case 'minable.rock1':
                    return tileShape
                case 'minable.rock2':
                    return this.blockShape = tileShape2
            }
        }
    }
    getPortaitImage():{src:string,width:number,height:number}{
        log("getPortaitImage","ENTRY")
        if(!this.serverState?._featureDef?.ui?.portrait){
            log("getPortaitImage","this.serverState.type assign here",this.serverState.type)
            switch(this.serverState.type){
                case 'minable.rock1':
                return {src:"images/ui/portraits/minable-rock-1.png",width:500,height:500}
                case 'minable.rock2':
                return {src:"images/ui/portraits/minable-rock-2.png",width:500,height:500}
            }
        }else if(this.serverState?._featureDef?.ui?.portrait){
            log("getPortaitImage","this.serverState.type using config value ",this.serverState.type,this.serverState?._featureDef?.ui.portrait)
            return this.serverState?._featureDef?.ui.portrait
        }
        log("getPortaitImage","unknown type")
        //unknown type
        return {src:"https://peer-lb.decentraland.org/lambdas/collections/contents/urn:decentraland:matic:collections-v2:0x47f8b9b9ec0f676b45513c21db7777ad7bfedb35:0/thumbnail"
                ,width:1024,height:1024}
    }
    confirmHit(){
        log(MODULE,"block confirmHit",this.id,"this.health",this.health) 

        const doIt = ()=>{
            const damage:serverStateSpec.AlterHealthDataState = {
                amount: 1,
                playerIdFrom: GAME_STATE.gameRoom.sessionId,
                desc:"hit by player",
                playerIdTo: this.id,
                time: Date.now()//REGISTRY.getGameTime()
              }
            this.hit( damage )
        }
 
        //confirmClaimPrompt.primaryCallback = doIt
        //confirmClaimPrompt.show()

        const cost:serverStateSpec.ICostDataState[] = []//this.serverState._featureDef.cost
        this.serverState.cost.forEach((c:serverStateSpec.ICostDataState)=>{
            cost.push(c)
        })
        log(MODULE,"block confirmHit",this.id,"cost",cost,"this.serverState",this.serverState) 
        const imgInfo = this.getPortaitImage()

        confirmMinePrompt20.updateData({
            imagePath: imgInfo.src,
            imageWidth: imgInfo.width,
            imageHeight: imgInfo.height,
            itemName: this.serverState.name,
            subtitleItemName: "",
            subtitle:
                (this.serverState?._featureDef?.ui?.description) ? this.serverState?._featureDef?.ui?.description : "Mine this rock to gain materials",
            title: 
            (this.serverState?._featureDef?.ui?.descriptionTitle) ? this.serverState?._featureDef?.ui?.descriptionTitle : "INTRODUCTION",
            coins: get2dUICostFormat(cost,CONFIG.GAME_COIN_TYPE_GC,"x ",""),
            dollars: get2dUICostFormat(cost,CONFIG.GAME_COIN_TYPE_MC,"x ",""),
            rock1: get2dUICostFormat(cost,CONFIG.GAME_COIN_TYPE_R1,"x ",""),
            rock2: get2dUICostFormat(cost,CONFIG.GAME_COIN_TYPE_R2,"x ",""),
            rock3: get2dUICostFormat(cost,CONFIG.GAME_COIN_TYPE_R3,"x ",""),
            bronze: get2dUICostFormat(cost,CONFIG.GAME_COIN_TYPE_BZ,"x ",""),
            bronzeShoe: "",//TODO need to map for cost, though it will never cost this!
            nitro: get2dUICostFormat(cost,CONFIG.GAME_COIN_TYPE_NI,"x ",""),
            petro: get2dUICostFormat(cost,CONFIG.GAME_COIN_TYPE_BP,"x ",""),
            showStockQty: false
          });
          confirmMinePrompt20.claimButton.label.value = (this.serverState?._featureDef?.ui?.modalClaimButtonLabel) ? this.serverState?._featureDef?.ui?.modalClaimButtonLabel : "Mine"

        confirmMinePrompt20.claimCallback = doIt
        confirmMinePrompt20.show()
    }
    hit(damage:serverStateSpec.AlterHealthDataState){
        log(MODULE,"block hit",this.id,"damage",damage,"this.health",this.health) 

        //TODO debounce clicking too many times?
        if(!this.debounceInterval.update()){
            log(MODULE,"block hit",this.id,"debounced click!!") 
            return;
        }

        this.makeClickable(false)
        //store clicked and prevent calling again till reset?
        
        /*SOUND_POOL_MGR.destructibleHitSound.playOnce(this.entity)
        log("dioHitSound")*/
        SOUND_POOL_MGR.miningStart.playOnce(this.entity)
 
        damage.respawnTime = this.respownTime
        damage.playerIdTo = this.id
        //if fired by me
        if(!isNull(GAME_STATE.gameRoom) && damage.playerIdFrom === GAME_STATE.gameRoom.sessionId){
            //send it to others
            GAME_STATE.gameRoom.send("levelData.trackFeature.adjustHealth",damage)
        }
       
        //server has to do funds check
        //this.updateHealth( this.health - damage.amount )
    }
    hide(){
        const METHOD_NAME= "hide"
        log(MODULE,METHOD_NAME,this.id,"ENTRY")
        if(!this.visible) {
            //log(this.id,"already hidden skipping")
            return;
        }
   
        const tf = this.entity.getComponent(Transform)
        this.entity.addComponentOrReplace(new utils.ScaleTransformComponent(tf.scale,SCALE_HIDDEN,1,()=>{
            //this.hidden = true
            const hidePos = -20
            //const tf = this.entity.getComponent(Transform)
            if(tf.position.y != hidePos){
                tf.position.y = hidePos
            }
        }))
        
        this.visible = false
        //this.scheduleShow()
    }

    getGameTime(){
        //REGISTRY.getGameTime()
        return Date.now()
    }
    scheduleShow(){
        const METHOD_NAME = "scheduleShow"
        //log(METHOD_NAME,this.id,"ENTRY")
        /*if(!CONFIG.TILE_ENABLE_RESPAWN){
            log(METHOD_NAME,this.id,"respawn disabled CONFIG.TILE_ENABLE_RESPAWN",CONFIG.TILE_ENABLE_RESPAWN)
            return;
        }*/
        this.activateTime = this.destoryTime + this.respownTime
  
        //just let server do it??? 
        //removing timer as wont help as consition to be visible is health. need server to restore health
        if(GAME_STATE.gameConnected !== 'connected'){
            log(METHOD_NAME,this.id,"not connected scheduling restore locally")
            //onlly when not connnected will we restore it client side
            this.entity.addComponentOrReplace(new utils.Delay( this.activateTime - this.getGameTime() , () => 
            {
                this.health = this.maxHealth
                //hack would be to set health here
                this.show()
            }))
        }

    }
    /*updateState(serverState:serverStateSpec.ITrackFeatureState){
        this.serverState = serverState
        this.updateStateUI()
    }*/
    updateStateUI(){
        const METHOD_NAME = "updateStateUI"
        log(MODULE,METHOD_NAME,this.id,"ENTRY")

        const tf = this.entity.getComponent(Transform)
        if(this.serverState.position &&this.serverState.position.position){
            this.transformArgs.position.x = this.serverState.position.position.x
            this.transformArgs.position.y = this.serverState.position.position.y
            this.transformArgs.position.z = this.serverState.position.position.z
        }else{
            log(MODULE,METHOD_NAME,this.id,"has no position, not setting")
            //debugger
        }

        tf.position.copyFrom(this.transformArgs.position)

        if(this.serverState.position.scale){ 
            this.transformArgs.scale.x = this.serverState.position.scale.x
            this.transformArgs.scale.y = this.serverState.position.scale.y
            this.transformArgs.scale.z = this.serverState.position.scale.z
            //tf.scale.copyFrom(this.transformArgs.scale) //let show hide handle this
        }else{
            log(MODULE,METHOD_NAME,this.id,"has no scale, not setting")
        }


    }
    makeClickable(val:boolean){
        log(MODULE,"makeClickable",this.id,"debounced makeClickable!!") 
        if(val){
            let hoverText = this.id

            if(this.serverState?._featureDef?.ui){ 
                hoverText = this.serverState._featureDef.ui.hoverText
            }

            this.entity.addComponentOrReplace(new OnPointerDown((event:IEvents['pointerDown'])=>{
                log(MODULE,"OnPointerDown.entity","ENTRY",this.id,event);
                this.lastHitPoint = event.hit.hitPoint
                //this.startMining()//for testing
                this.confirmHit( )
            } ,{
                hoverText: hoverText
            }))
        }else{
            if(this.entity.hasComponent(OnPointerDown)){
                this.entity.removeComponent(OnPointerDown)
            }
        }
    }
    show(){
        const METHOD_NAME = "show"
        log(MODULE,METHOD_NAME,this.id,"ENTRY")
        //log(METHOD_NAME,this.id,"ENTRY")
        if(this.visible) {
            log(MODULE,METHOD_NAME,this.id,"already visible skipping")
            return;
        }
        this.visible = true    
        
        this.makeClickable(true)

        const _targetTime = this.serverState?._featureDef?.spawnDef?.coolDownTime 
            ? this.serverState?._featureDef?.spawnDef?.coolDownTime : DEFAULT_DEBOUNCE_TIME
           
        log(MODULE,METHOD_NAME,this.id,"this.debounceInterval.targetTime",_targetTime)
        this.debounceInterval.targetTime = _targetTime
         
        
        const tf = this.entity.getComponent(Transform)


        //const tf = this.entity.getComponent(Transform)
        this.entity.addComponentOrReplace(new utils.ScaleTransformComponent(SCALE_HIDDEN,this.transformArgs.scale,1,()=>{
            /*if(tf.position.y != this.centerPos.y){
                tf.position.y = this.centerPos.y
            }*/    
        }))
        

        
    }
    reset(){  
        const METHOD_NAME = "reset"
        //log(METHOD_NAME,this.id,"ENTRY")

        if(this.entity.hasComponent(utils.Delay)) this.entity.removeComponent( utils.Delay )
        this.health = this.maxHealth//
        this.show()

    }
}


class MinableController {
    blocks:Block[] = []
    blocksMap:Record<string,Block> = {} //for easy lookup

    constructor(){
       
    
        //this.center=  new Vector3(scene.center.x , this.groundLevel, scene.center.z - 4.5)

        this.initBlocks()
    }

    initBlocks(){
        
    }
    
    showUIMaxedOutInventory(val:boolean,result?:RewardNotification){
        if(val){
            //ui.displayAnnouncement("not enough funds to mine:"+result.sourceObjectId)
            maxInventoryPromptBasic.show()
            
        }else{
            maxInventoryPromptBasic.hide()
        }
        
        
        this.updateClickable(val,result)
    }

    updateClickable(val:boolean,result?:RewardNotification){
        if(val && result.sourceObjectId){
            const minable = this.getMinableById(result.sourceObjectId)
            if(minable){
                minable.makeClickable(true)
            }
        }
    }

    showUINotEnoughFunds(val:boolean,result?:RewardNotification){
        if(val){
            //ui.displayAnnouncement("not enough funds to mine:"+result.sourceObjectId)
            notEnoughClaimPromptBasic.show()
            
            /*let gc=0  
            let mc=0  
            for(const p in result.rewards){
                switch(result.rewards[p].id){
                case CONFIG.GAME_COIN_TYPE_GC:
                    gc=result.rewards[p].amount
                break;
                case CONFIG.GAME_COIN_TYPE_MC:
                    mc=result.rewards[p].amount
                break; 
                default:
                    log("unhandled reward type",result.rewards[p].id,result.rewards[p])
                }
            }

            //notEnoughClaimPromptGrid.primaryCallback = doIt
            notEnoughClaimPromptGrid.updateDollar(mc.toFixed(0))
            notEnoughClaimPromptGrid.updateCoins(gc.toFixed(0))
            notEnoughClaimPromptGrid.show()*/
        }else{
            notEnoughClaimPromptBasic.hide()
        }
        
        
        this.updateClickable(val,result)
    }
    showUIPaidFunds(val:boolean,result?:RewardNotification){
        const METHOD_NAME = "showUIPaidFunds"
        log(METHOD_NAME,"ENTRY","val",val,"result",result)
        if(val){
            //ui.displayAnnouncement("paid to mine:"+result)
            //notEnoughClaimPromptBasic.show()
            const itm = this.blocksMap[result.sourceObjectId]
            if(itm !== undefined){
                itm.startMining()
            }else{
                log(METHOD_NAME,"not item to show ui for","itm",itm,"result",result)
            }
        }else{
            notEnoughClaimPromptBasic.hide()
        }
    }

    showUIReward(val:boolean,result?:RewardNotification){
        log("showUIReward","ENTRY","val",val,"result",result)
        if(val){
            let gc=0  
            let mc=0  
            
            let rock1=0  
            let rock2=0  
            let rock3=0  
            let petro=0  
            let nitro=0   
            let bronze=0 
            let bronzeShoeCollected=0
            for(const p in result.rewards){
                switch(result.rewards[p].id){
                case CONFIG.GAME_COIN_TYPE_GC:
                    gc=result.rewards[p].amount
                    break;
                case CONFIG.GAME_COIN_TYPE_MC:
                    mc=result.rewards[p].amount
                    break; 
                case CONFIG.GAME_COIN_TYPE_R1:
                    rock1=result.rewards[p].amount
                    break; 
                case CONFIG.GAME_COIN_TYPE_R2:
                    rock2=result.rewards[p].amount
                    break; 
                case CONFIG.GAME_COIN_TYPE_R3:
                    rock3=result.rewards[p].amount
                    break; 
                case CONFIG.GAME_COIN_TYPE_BP:
                    petro=result.rewards[p].amount
                    break; 
                case CONFIG.GAME_COIN_TYPE_NI:
                    nitro=result.rewards[p].amount
                    break; 
                case CONFIG.GAME_COIN_TYPE_BZ:
                    bronze=result.rewards[p].amount
                    break; 
                case CONFIG.GAME_COIN_TYPE_BRONZE_SHOE_1_ID:
                    bronzeShoeCollected=result.rewards[p].amount
                    break; 
                default:
                    log("unhandled reward type",result.rewards[p].id,result.rewards[p])
                }
            }
            //TODO  use correct prompt
            GAME_STATE.setGameEndResult({
                gcStarted: -1,
                gcCollected: gc,
                gcTotal: 0,
                gcEnded: 0,
                gcCollectedToMC: -1,
                gameTimeTaken: -1,
                mcCollected: mc,
                mcAdjustAmount: -1,
                mcCollectedAdjusted: -1,
                mcTotalEarnedToday: -1,
                walletTotal: -1,
                guestCoinCollected: -1,
                guestCoinName: "test",
                coinMultiplier: -1,
                gcBonusEarned: -1,
        
                rock1Collected: rock1,
                rock2Collected: rock2,
                rock3Collected: rock3,
                petroCollected: petro,
                nitroCollected: nitro,
                bronzeCollected: bronze,
                bronzeShoeCollected: bronzeShoeCollected,

                material1Collected: -1,
                material2Collected: -1,
                material3Collected: -1,
        
                autoCloseEnabled: true,
                autoCloseTimeoutMS: 5000,

                //todo check default values
                raffleResult: {
                    cost: 0,
                    multiplier: 0,
                    amountWon: 0,            
                    hasEnoughToPlay: false,  
                },
            });
            REGISTRY.ui.openEndGamePrompt()
        }else{
            notEnoughClaimPromptBasic.hide()
        }
    }
    
    createMinableFromState(trackFeat:serverStateSpec.ITrackFeatureState){
        const METHOD_NAME = "addRemoveTrackFeature" 
        log(MODULE,METHOD_NAME,"ENTRY",trackFeat);

        const block = new Block(trackFeat.id,trackFeat.type)
        
        block.updateFromServer(trackFeat)

        this.blocksMap[block.id] = block
        this.blocks.push(block)
  
        return block
    

    }
    
    getMinableById(id:string):Block{
        return this.blocksMap[id]
    }

    hideAllBlocks(){
        for(let i=0; i< this.blocks.length; i++){
            this.blocks[i].hide()
        }
        //SOUNDS.woodExplodeSource.playOnce()
    }

    resetAllBlocks(){
        for(let i=0; i< this.blocks.length; i++){
            this.blocks[i].reset()        
        }   
    }

}

export let minableController = new MinableController()
 

