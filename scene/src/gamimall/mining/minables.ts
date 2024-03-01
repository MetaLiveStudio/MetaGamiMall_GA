import * as utils from '@dcl-sdk/utils'
//import { scene } from "./sceneData";
//import { movePlayerTo } from '@decentraland/RestrictedActions'
import { GAME_STATE } from "../../state";
import * as serverStateSpec from "../../gamimall/state/MyRoomStateSpec";
import { REGISTRY } from "../../registry";
//import { isNull } from "src/utils/utilities";
import { CONFIG } from '../../config';
//import { SOUND_POOL_MGR } from '../meta-decentrally/modules/resources/sounds';
import { isNull } from '../../utils';
import {  CustomOkPrompt, } from '../../ui/modals';
import { get2dUICostFormat } from '../vcUtils';
//import { RESOURCES } from '../resources';
import { RewardNotification } from '../coin';
import { PickAxe, PICK_AXE_MANAGER } from "./pickAxeMgr";
//import { getOrCreateGLTFShape } from "../../meta-decentrally/resources/common";
import { IntervalUtil } from "../../meta-decentrally/modules/interval-util";
import * as PlayFabSDK from "../playfab_sdk/index";
import { GetLeaderboardResult } from "../playfab_sdk/playfab.types";
import { setLeaderboardLoading, updateLeaderBoard } from "../leaderboard";
import { getLeaderboardRegistry, leaderBoardsConfigs, leaderBoardsConfigsType } from "../leaderboard-utils";
import { CustomClaimPrompt } from "../../ui/claimModals";
import { engineTweenStartScaling, log } from "../../back-ports/backPorts";
import { Quaternion, Vector3 } from '@dcl/sdk/math';
import { ColliderLayer, Entity, GltfContainer, InputAction, PBGltfContainer, PointerEvents, Transform, TransformTypeWithOptionals, engine, pointerEventsSystem } from '@dcl/sdk/ecs';
import { i18n, i18nOnLanguageChangedAddReplace } from '../../i18n/i18n';
import { namespaces } from '../../i18n/i18n.constants';
import { lookAt } from '../../utils4Game';
import { ReadOnlyVector3 } from '~system/EngineApi';
//import * as clientState from "src/gamimall/state/client-state-spec";

/*const respawner = new Entity()
respawner.addComponent(new BoxShape())
respawner.addComponent(new Transform({ position: Vector3.create(28, 2, 28) }))
respawner.addComponent(
  new OnPointerDown(
    (e) => {
      movePlayerTo({ x: 40, y: 12, z: 28 }, { x: 96, y: 12, z: 64 })
    },
    { hoverText: "Teleport Up" }
  )
)

engine.addEntity(respawner)*/

const tileShape:PBGltfContainer = {src:"models/MineGame/MineRock.glb"
                    ,visibleMeshesCollisionMask:ColliderLayer.CL_NONE
                    ,invisibleMeshesCollisionMask:ColliderLayer.CL_POINTER|ColliderLayer.CL_PHYSICS }
const tileShape2 = tileShape

const MODULE = "minables"

const SCALE_HIDDEN = Vector3.create(0,0,0)

let rewardOpts = { 
    height: 550,
    costShowIcons: false
 };
let confirmMinePrompt20:CustomClaimPrompt

export let minableController:MinableController

export function initMinableUI(){
    if(confirmMinePrompt20) return //already initialized
    
    confirmMinePrompt20 = new CustomClaimPrompt({
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
  //TODO use translation value???
  confirmMinePrompt20.claimButton.text = i18n.t("button.mine", {ns:namespaces.common})

  i18nOnLanguageChangedAddReplace(confirmMinePrompt20.uuid+".claimButton",(lng) => {
    confirmMinePrompt20.claimButton.text = i18n.t("button.mine", {ns:namespaces.common})
  })

  minableController = new MinableController()
}

//TODO add translation!!!
const notEnoughClaimPromptBasic = new CustomOkPrompt(
    "Notice",
    "Sorry. You do not have enough funds.",
    "OK",
    () => {}
  );
  //endGamePrompt20.show()
  ////REGISTRY.ui.endGameConfirmPrompt = endGameConfirmPrompt20;

//TODO add translation!!!
const maxInventoryPromptBasic = new CustomOkPrompt(
    "Notice",
    "Sorry. You already have maxed out this item",
    "OK",
    () => {}
  );
  //endGamePrompt20.show()
  ////REGISTRY.ui.endGameConfirmPrompt = endGameConfirmPrompt20;


const DEFAULT_DEBOUNCE_TIME = 7500
class Block {
    
    blockShape:PBGltfContainer =  tileShape
    
    entity:Entity    
    health:number
    maxHealth:number = 1
    id:string
    debounceInterval:IntervalUtil = new IntervalUtil(DEFAULT_DEBOUNCE_TIME,'abs-time')

    transformArgs:TransformTypeWithOptionals
   
    //trackFeat: serverStateSpec.ITrackFeatureState

    visible:boolean = false
    activateTime?:number=Number.MAX_VALUE
    respownTime?:number = 1000//CONFIG.TILE_RESPAWN_TIME
    destoryTime?:number = 0

    timerId?:utils.TimerId

    tool?:PickAxe
    lastHitPoint?:ReadOnlyVector3

    serverState:serverStateSpec.ITrackFeatureState

    clickable:boolean = false

    constructor(_id:string,type:string){
        this.id = _id
        this.transformArgs = {position:Vector3.One(),scale:Vector3.One()}
        
        this.entity = engine.addEntity()//new Entity(this.id)
        GltfContainer.create(this.entity,this.blockShape)
        //this.entity.addComponent(this.blockShape)      
        ////this.entity.addComponent(SOUNDS.woodExplodeSource)
        Transform.create(this.entity)//,this.transformArgs)

        //this.entity.addComponent(new Transform(  
        //))

        this.reset() 

    }
    startMining() {
        log("startMining","ENTRY")
        //compute object center then offset it
        const objectPos = this.transformArgs.position ? this.transformArgs.position : Vector3.Zero()
        //TODO do we need feet pos???
        const playerPos = Transform.get(engine.PlayerEntity).position//Camera.instance.feetPosition

        //get direction from player and center of object
        //then move it towards the player by a bit
        const dir = Vector3.scale(
            Vector3.normalize(Vector3.subtract(objectPos,playerPos))
            , this.serverState?._featureDef?.ui?.tool?.distanceOffCenterTarget ? this.serverState?._featureDef?.ui?.tool?.distanceOffCenterTarget : -1.80
            )
        //const dir = objectPos.subtract(playerPos).normalize().scale(
        //    this.serverState?._featureDef?.ui?.tool?.distanceOffCenterTarget ? this.serverState?._featureDef?.ui?.tool?.distanceOffCenterTarget : -1.80
        //)
             
        if(this.serverState?._featureDef?.ui?.tool?.enabled && this.serverState?._featureDef?.ui?.tool?.model){
            //this.entity.getComponent(OnPointerDown).distance = this.serverState._featureDef.ui.clickDistance
            const modelToUse = this.serverState?._featureDef?.ui?.tool?.model
            const toolScale = this.serverState?._featureDef?.ui?.tool?.transformScale

            this.tool = PICK_AXE_MANAGER.spawnAxe(modelToUse,{
                position: Vector3.add(
                    //TODO grab entity position instead from transform???
                    this.transformArgs.position ? this.transformArgs.position : Vector3.Zero(),
                    dir),
                scale: toolScale ? toolScale : Vector3.One()
            },true)

             //this.tool.getComponent(Transform)
            
            //rotate so looks like axe handle is facing player
            lookAt( this.tool.entity, playerPos )
            const tf=  Transform.getMutable(this.tool.entity)
            //TODO TEST THIS ONCE WORKING not sure will do what we want
            //Quaternion.slerp()
            tf.rotation = Quaternion.slerp(tf.rotation,Quaternion.multiply(tf.rotation,Quaternion.fromEulerDegrees(0,-90,0)),1)
            //rotate 180
            //tf.rotate(Vector3.create(0,1,0),-90)
        }else{
            //not enabled
        }

    }
    endMining() {
        if(this.tool !== undefined){
            const toolHideDelay = this.serverState?._featureDef?.ui?.tool?.onHideDelayMS
            
            const hideAction = ()=>{
                if(this.tool) this.tool.hide()
                this.tool = undefined    
            }
            if(toolHideDelay){
                utils.timers.setTimeout(()=>{
                    hideAction()
                },toolHideDelay ? toolHideDelay : 0)
                //utils.setTimeout(toolHideDelay,)
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

        const shape = GltfContainer.getOrNull(this.entity)

        if(shape && shape.src !== this.blockShape.src){
            log(MODULE,METHOD_NAME,"changing shape",this.id,shape.src,"to",this.blockShape.src);
            GltfContainer.createOrReplace(this.entity,this.blockShape)
            //this.entity.addComponentOrReplace(this.blockShape)  
        }else{
            log(MODULE,METHOD_NAME,"no shape change",this.id,this.blockShape.src);
        }
        
        //how can i know it has one
        //TODO FIX THIS

        if(this.clickable){
            //side affect is update pointer down system
            this.makeClickable(true)
        }
        //if(this.entity.hasComponent(OnPointerDown)){
        //if(this.visible) this.makeClickable(true)
        //TODO is not not needed as show will handle it?????
        /*if(PointerEvents.has(this.entity)){
            const pe = PointerEvents.get(this.entity)
            pe.pointerEvents
            if(this.serverState?._featureDef?.ui){ 
                this.entity.getComponent(OnPointerDown).hoverText = this.serverState._featureDef.ui.hoverText
            }
            if(this.serverState?._featureDef?.ui?.clickDistance){
                this.entity.getComponent(OnPointerDown).distance = this.serverState._featureDef.ui.clickDistance
            }
        }else{
            log(MODULE,METHOD_NAME,"no onpointer to update",this.id);
        }*/

        const val = 0
        if(this.visible && val <= 0 ){
            log(MODULE,METHOD_NAME,this.id,"set destroy time",trackFeat.status)
            this.destoryTime = trackFeat.lastTouchTime
            this.activateTime = trackFeat.activateTime
        }  
        if(trackFeat.position !== undefined){
            log(MODULE,METHOD_NAME,this.id,"update position",trackFeat.status)
            //const tf = this.entity.getComponent(Transform)
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
            //TODO ADD SOUND BACK!!!!
            //SOUND_POOL_MGR.miningReward.playOnce(this.entity)
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
            ///*SOUND_POOL_MGR.destructibleHitSound.playOnce(this.entity)
            //log("dioHitSound")*/
            this.show()
        }
    }
    
    getMinableShape():PBGltfContainer{
        const METHOD_NAME = "getMinableShape"
        log(MODULE,METHOD_NAME,"ENTRY")
        if(this.serverState && this.serverState._featureDef && this.serverState._featureDef.ui.minableModel){
            const model = this.serverState._featureDef.ui.minableModel
            log(MODULE,METHOD_NAME,"this.serverState.type using config value ",model)
            //allow customizing of mode. TODO long term add minableModel
            return model
        }else{
            log(MODULE,METHOD_NAME,"this.serverState.type assign here",this.serverState.type)
            switch(this.serverState.type){
                case 'minable.rock1':
                    return tileShape
                case 'minable.rock2':
                    return this.blockShape = tileShape2
            }
        }
        log(MODULE,METHOD_NAME,"WARNING, DID NOT KNOW WHAT MODEL TO USE, using default",tileShape)
        return tileShape
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
                playerIdFrom: GAME_STATE.gameRoom ? GAME_STATE.gameRoom.sessionId : "not connected to room????",
                desc:"hit by player",
                playerIdTo: this.id,
                time: Date.now()//REGISTRY.getGameTime()
              }
            this.hit( damage )
        }
 
        ////confirmClaimPrompt.primaryCallback = doIt
        ////confirmClaimPrompt.show()

        const cost:serverStateSpec.ICostDataState[] = []//this.serverState._featureDef.cost
        if(this.serverState.cost){
            this.serverState.cost.forEach((c:serverStateSpec.ICostDataState)=>{
                cost.push(c)
            })
        }else{
            log(MODULE,"WARNING this.serverState.cost IS missing",this.serverState.cost)
        }
        log(MODULE,"block confirmHit",this.id,"cost",cost,"this.serverState",this.serverState) 
        const imgInfo = this.getPortaitImage()
        const serverStateUI = this.serverState?._featureDef?.ui
        
        confirmMinePrompt20.updateData({
            imagePath: imgInfo.src,
            imageWidth: imgInfo.width,
            imageHeight: imgInfo.height,
            itemName: this.serverState.name,
            subtitleItemName: "",
            subtitle:
                (serverStateUI?.description) ? serverStateUI?.description : "Mine this rock to gain materials",
            title: 
            (serverStateUI?.descriptionTitle) ? serverStateUI?.descriptionTitle : "INTRODUCTION",
            coins: get2dUICostFormat(cost,CONFIG.GAME_COIN_TYPE_GC,"x ",""),
            dollars: get2dUICostFormat(cost,CONFIG.GAME_COIN_TYPE_MC,"x ",""),
            rock1: get2dUICostFormat(cost,CONFIG.GAME_COIN_TYPE_R1,"x ",""),
            rock2: get2dUICostFormat(cost,CONFIG.GAME_COIN_TYPE_R2,"x ",""),
            rock3: get2dUICostFormat(cost,CONFIG.GAME_COIN_TYPE_R3,"x ",""),
            bronze: get2dUICostFormat(cost,CONFIG.GAME_COIN_TYPE_BZ,"x ",""),
            bronzeShoe: "",//TODO need to map for cost, though it will never cost this!
            nitro: get2dUICostFormat(cost,CONFIG.GAME_COIN_TYPE_NI,"x ",""),
            petro: get2dUICostFormat(cost,CONFIG.GAME_COIN_TYPE_BP,"x ",""),

            vc_vb: get2dUICostFormat(cost,CONFIG.GAME_COIN_TYPE_VB,"x ",""),
            vc_ac: get2dUICostFormat(cost,CONFIG.GAME_COIN_TYPE_AC,"x ",""),
            vc_zc: get2dUICostFormat(cost,CONFIG.GAME_COIN_TYPE_ZC,"x ",""),
            vc_rc: get2dUICostFormat(cost,CONFIG.GAME_COIN_TYPE_RC,"x ",""),

            showStockQty: false,
            uiScale: (serverStateUI?.uiScale) ? serverStateUI?.uiScale : 1,
            contract: (serverStateUI?.nftContract) ? serverStateUI?.nftContract : undefined,
            checkRemoteCostPrices: (serverStateUI?.checkRemoteCostPrices !== undefined) ? serverStateUI?.checkRemoteCostPrices : true,
            checkLatestMarketPrices: (serverStateUI?.checkLatestMarketPrices !== undefined) ? serverStateUI?.checkLatestMarketPrices : false,
            uiDisplayType: (serverStateUI?.uiDisplayType !== undefined) ? serverStateUI?.uiDisplayType : undefined,
          });
          confirmMinePrompt20.claimButton.text = (serverStateUI?.modalClaimButtonLabel) ? serverStateUI?.modalClaimButtonLabel : "Mine"

        confirmMinePrompt20.claimCallback = doIt
        confirmMinePrompt20.belowButtonText.value = "Raffle Will Be Drawn Every Day at Midnight UTC"
        confirmMinePrompt20.secondaryButtonCallback = ()=>{

            const prefix = ""
            var getLeaderboardLevelEpoch: PlayFabClientModels.GetLeaderboardRequest = {
                StatisticName: prefix + "raffle_coin_bag", //coins collected is level when formula applied
                StartPosition: 0,
                MaxResultsCount: CONFIG.GAME_LEADEBOARD_RAFFLE_MAX_RESULTS,
            };

            leaderBoardsConfigs.filter((p)=>{ return p.prefix === prefix }).forEach((p)=>{  
                setLeaderboardLoading(p.raffleCoinBag(),true)
            })
            
            PlayFabSDK.GetLeaderboard(getLeaderboardLevelEpoch).then(
                (result: GetLeaderboardResult) => {
                    //hande manager it here
                    leaderBoardsConfigs.filter((p)=>{ return p.prefix === prefix }).forEach((p)=>{  
                            updateLeaderBoard(getLeaderboardLevelEpoch.StatisticName
                                ,p.raffleCoinBag()
                                ,result.Leaderboard ? result.Leaderboard : []
                                ,CONFIG.GAME_LEADEBOARD_RAFFLE_MAX_RESULTS)
                        })
                }
            );
            
            REGISTRY.ui.openRaffleCoinBagEntries()
        }
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
        
        ///*SOUND_POOL_MGR.destructibleHitSound.playOnce(this.entity)
        ////log("dioHitSound")*/
        //TODO ADD SOUND BACK
        //SOUND_POOL_MGR.miningStart.playOnce(this.entity)
 
        damage.respawnTime = this.respownTime
        damage.playerIdTo = this.id
        //if fired by me
        if(GAME_STATE.gameRoom && damage.playerIdFrom === GAME_STATE.gameRoom.sessionId){
            //send it to others
            GAME_STATE.gameRoom.send("levelData.trackFeature.adjustHealth",damage)
        }
       
        ////server has to do funds check
        ////this.updateHealth( this.health - damage.amount )
    }
    hide(){
        const METHOD_NAME= "hide"
        log(MODULE,METHOD_NAME,this.id,"ENTRY")
        if(!this.visible) {
            //log(this.id,"already hidden skipping")
            return;
        }
   
        const _tf = Transform.get(this.entity)//this.entity.getComponent(Transform)
        
        engineTweenStartScaling(this.entity, _tf.scale,SCALE_HIDDEN
        //utils.tweens.startScaling(this.entity, _tf.scale,SCALE_HIDDEN
            , 1 * 1000, undefined, ()=>{
                ////this.hidden = true
                const hidePos = -20
                
                const tf = Transform.getMutable(this.entity)
                if(tf.position.y != hidePos){
                    tf.position.y = hidePos
                }
            })
        /*this.entity.addComponentOrReplace(new utils.ScaleTransformComponent(_tf.scale,SCALE_HIDDEN,1,()=>{
            
        }))*/
        
        this.visible = false
        ////this.scheduleShow()
    }

    getGameTime(){
        ////REGISTRY.getGameTime()
        return Date.now()
    }
    scheduleShow(){
        const METHOD_NAME = "scheduleShow"
        //log(MODULE,METHOD_NAME,this.id,"ENTRY")
        ///*if(!CONFIG.TILE_ENABLE_RESPAWN){
        //    log(MODULE,METHOD_NAME,this.id,"respawn disabled CONFIG.TILE_ENABLE_RESPAWN",CONFIG.TILE_ENABLE_RESPAWN)
        //    return;
        //}*/
        this.activateTime = (this.destoryTime ? this.destoryTime : Date.now()) + (this.respownTime ? this.respownTime : 1000)
  
        //just let server do it??? 
        //removing timer as wont help as consition to be visible is health. need server to restore health
        if(GAME_STATE.gameConnected !== 'connected'){
            log(MODULE,METHOD_NAME,this.id,"not connected scheduling restore locally")
            //onlly when not connnected will we restore it client side
            if(this.timerId){
                utils.timers.clearTimeout(this.timerId)
                this.timerId = undefined
            }
            this.timerId = utils.timers.setTimeout(()=>{
                this.health = this.maxHealth
                //hack would be to set health here
                this.show()
            },this.activateTime - this.getGameTime())
            /*
            this.entity.addComponentOrReplace(new utils.Delay( this.activateTime - this.getGameTime() , () => 
            {
                this.health = this.maxHealth
                //hack would be to set health here
                this.show()
            }))*/
        }

    }
    ///*updateState(serverState:serverStateSpec.ITrackFeatureState){
    //    this.serverState = serverState
    //    this.updateStateUI()
    //}*/
    updateStateUI(){
        const METHOD_NAME = "updateStateUI"
        log(MODULE,METHOD_NAME,this.id,"ENTRY")

        const tf = Transform.getMutable(this.entity)//this.entity.getComponent(Transform)
        if(this.serverState.position &&this.serverState.position.position){
            if(!this.transformArgs.position) this.transformArgs.position = {x:0,y:0,z:0}
            Vector3.copyFrom(this.serverState.position.position,this.transformArgs.position)
            //this.transformArgs.position.x = this.serverState.position.position.x
            //this.transformArgs.position.y = this.serverState.position.position.y
            //this.transformArgs.position.z = this.serverState.position.position.z
        }else{
            log(MODULE,METHOD_NAME,this.id,"has no position, not setting")
            //debugger
        }
        //if(!tf.position) tf.position = {x:0,y:0,z:0}

        if(this.transformArgs.position) Vector3.copyFrom(this.transformArgs.position,tf.position)

        //tf.position.x = this.transformArgs.position?.x
        //tf.position.copyFrom(this.transformArgs.position)

        if(this.serverState.position.scale){ 
            if(!this.transformArgs.scale) this.transformArgs.scale = {x:0,y:0,z:0}
            Vector3.copyFrom(this.serverState.position.scale,this.transformArgs.scale)
            //this.transformArgs.scale.x = this.serverState.position.scale.x
            //this.transformArgs.scale.y = this.serverState.position.scale.y
            //this.transformArgs.scale.z = this.serverState.position.scale.z
            ////tf.scale.copyFrom(this.transformArgs.scale) //let show hide handle this
        }else{
            log(MODULE,METHOD_NAME,this.id,"has no scale, not setting")
        }


    }
    makeClickable(val:boolean){
        log(MODULE,"makeClickable",this.id,this.entity,val,"debounced makeClickable!!") 
        if(val){
            this.clickable = true
            let hoverText = this.id
            let clickDistance:number = 6//default is 6

            if(this.serverState?._featureDef?.ui && this.serverState._featureDef.ui.hoverText){ 
                hoverText = this.serverState._featureDef.ui.hoverText
            }
            if(this.serverState?._featureDef?.ui?.clickDistance){
                clickDistance = clickDistance
            }
            
            
            //remove and add new
            pointerEventsSystem.removeOnPointerDown(this.entity)

            pointerEventsSystem.onPointerDown(
                {
                  entity: this.entity,
                  opts: {
                      button: InputAction.IA_POINTER,
                      hoverText: hoverText,
                      maxDistance: clickDistance
                  }
                },
                (event)=>{
                    log(MODULE,"OnPointerDown.entity","ENTRY",this.id,event);
                    this.lastHitPoint = event.hit?.position//event.hit.hitPoint
                    ////this.startMining()//for testing
                    this.confirmHit( )
                }
              )
            /*this.entity.addComponentOrReplace(new OnPointerDown((event:IEvents['pointerDown'])=>{
                log(MODULE,"OnPointerDown.entity","ENTRY",this.id,event);
                this.lastHitPoint = event.hit.hitPoint
                //this.startMining()//for testing
                this.confirmHit( )
            } ,{
                hoverText: hoverText
            }))*/
        }else{
            this.clickable = false
            pointerEventsSystem.removeOnPointerDown(this.entity)
            /*if(this.entity.hasComponent(OnPointerDown)){
                this.entity.removeComponent(OnPointerDown)
            }*/
        }
    }
    show(){
        const METHOD_NAME = "show"
        log(MODULE,METHOD_NAME,this.id,"ENTRY")
        //log(MODULE,METHOD_NAME,this.id,"ENTRY")
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
         
        
        //const tf = Transform.get(this.entity)//this.entity.getComponent(Transform)


        //const tf = this.entity.getComponent(Transform)
        engineTweenStartScaling(this.entity, SCALE_HIDDEN
        //utils.tweens.startScaling(this.entity, SCALE_HIDDEN
            ,this.transformArgs.scale ? this.transformArgs.scale : Vector3.One()
            , 1 * 1000)
        //this.entity.addComponentOrReplace(new utils.ScaleTransformComponent(SCALE_HIDDEN,this.transformArgs.scale,1,()=>{
            /////*if(tf.position.y != this.centerPos.y){
            ////    tf.position.y = this.centerPos.y
            ////}*/    
        //}))
        

        
    }
    reset(){  
        const METHOD_NAME = "reset"
        //log(MODULE,METHOD_NAME,this.id,"ENTRY")

        if(this.timerId){
            utils.timers.clearTimeout(this.timerId)
            this.timerId = undefined
        }
        this.health = this.maxHealth//
        this.show()

    }
}


class MinableController {
    blocks:Block[] = []
    blocksMap:Record<string,Block> = {} //for easy lookup

    constructor(){
       
    
        ////this.center=  Vector3.create(scene.center.x , this.groundLevel, scene.center.z - 4.5)

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
        if(val && result && result.sourceObjectId){
            const minable = this.getMinableById(result.sourceObjectId)
            if(minable){
                minable.makeClickable(true)
            }
        }
    }

    showUINotEnoughFunds(val:boolean,result?:RewardNotification){
        if(val){
            ////ui.displayAnnouncement("not enough funds to mine:"+result.sourceObjectId)
            notEnoughClaimPromptBasic.show()
            
            
        }else{
            notEnoughClaimPromptBasic.hide()
        }
        
        
        this.updateClickable(val,result)
    }
    showUIPaidFunds(val:boolean,result?:RewardNotification){
        const METHOD_NAME = "showUIPaidFunds"
        log(MODULE,METHOD_NAME,"ENTRY","val",val,"result",result)
        if(val){
            ////ui.displayAnnouncement("paid to mine:"+result)
            ////notEnoughClaimPromptBasic.show()
            const blockKey = result && result.sourceObjectId ? result.sourceObjectId : "unknown"
            const itm = this.blocksMap[blockKey]
            if(itm !== undefined){
                itm.startMining()
            }else{
                log(MODULE,METHOD_NAME,"not item to show ui for","itm",itm,"blockKey",blockKey,"result",result)
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


            let vc_vb=0  
            let vc_ac=0  
            let vc_zc=0   
            let vc_rc=0 

            let bronzeShoeCollected=0
            let statRaffleCoinBag=0
            let ticketRaffleCoinBag=0
            let redeemRaffleCoinBag=0
            if(result){
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

                    case CONFIG.GAME_COIN_TYPE_VB:
                        vc_vb=result.rewards[p].amount
                        break; 
                    case CONFIG.GAME_COIN_TYPE_AC:
                        vc_ac=result.rewards[p].amount
                        break; 
                    case CONFIG.GAME_COIN_TYPE_ZC:
                        vc_zc=result.rewards[p].amount
                        break; 
                    case CONFIG.GAME_COIN_TYPE_RC:
                        vc_rc=result.rewards[p].amount
                        break; 

                    case CONFIG.GAME_COIN_TYPE_BZ:
                        bronze=result.rewards[p].amount
                        break; 
                    case CONFIG.GAME_COIN_TYPE_BRONZE_SHOE_1_ID:
                        bronzeShoeCollected=result.rewards[p].amount
                        break; 
                    case CONFIG.GAME_COIN_TYPE_STAT_RAFFLE_COIN_BAG_3_ID:
                        statRaffleCoinBag=result.rewards[p].amount
                        break; 
                    case CONFIG.GAME_COIN_TYPE_TICKET_RAFFLE_COIN_BAG_ID:
                        ticketRaffleCoinBag=result.rewards[p].amount
                        break;
                    case CONFIG.GAME_COIN_TYPE_REDEEM_RAFFLE_COIN_BAG_ID:
                        redeemRaffleCoinBag=result.rewards[p].amount
                        break;
                    default:
                        log("unhandled reward type",result.rewards[p].id,result.rewards[p])
                    }
                }
            }else{
                log("unhandled reward type",result)
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
        
                statRaffleCoinBag: statRaffleCoinBag,
                ticketRaffleCoinBag: ticketRaffleCoinBag,
                redeemRaffleCoinBag: redeemRaffleCoinBag,

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
        ////SOUNDS.woodExplodeSource.playOnce()
    }

    resetAllBlocks(){
        for(let i=0; i< this.blocks.length; i++){
            this.blocks[i].reset()        
        }   
    }

}


 

