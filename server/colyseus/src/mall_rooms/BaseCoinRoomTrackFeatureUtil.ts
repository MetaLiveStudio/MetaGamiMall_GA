
import { Room, Client, ServerError, Clock } from "colyseus";
import { Block, BlockDefType, BlockMaterialDefType, BlockType,  BlockTypeTypeConst, MyRoomState, Player, PlayerSavePoint, TrackFeaturePositionState, TrackFeatureState, Vector3State } from "./MyRoomState";
import { RewardData, RewardNotification } from "./MyRoomStateSpec";

//import PlayFab from "../playfab_sdk/PlayFabClientApi";
//import * as PlayFabSDK from  '../playfab_sdk/index'
//import { EntityTokenResponse, GetPlayerCombinedInfoResultPayload, LoginResult, TreatmentAssignment, UserSettings } from '../playfab_sdk/playfab.types'; 
import { PlayFab,PlayFabAuthentication, PlayFabServer } from "playfab-sdk";
import * as PlayFabHelper from "./PlayFabWrapper";

import { CONFIG } from "./config";
import { GameEndType, PlayerData, PlayerServerSideData } from "./types";
import { nftMetaDogeCheckCall, nftCheckMultiplier, nftDogeHeadCheckCall, nftCheckDogeHeadMultiplier, initPlayerStateNftOwnership, fetchWearableData, checkMultiplier, CheckMultiplierResultType } from "../utils/nftCheck";
import { addMaterialToUser, createAddUserVirtualCurrency, evalDropTable, evalRewards } from "../utils/playFabUtils";
import { getLevelFromXp, getLevelPercentFromXp, getXPDiffBetweenLevels, getXPFromLevel } from "../utils/leveling/levelingUtils";
import * as serverStateSpec from "./MyRoomStateSpec";
import { PlayFabDataUtils } from "../utils/playFabDataUtils";
import { isNull, notNull } from "../utils/utils";

//var PlayFab: PlayFab ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFab");
//var PlayFabClient: PlayFabClientModule.IPlayFabClient ;//= require("PlayFab-sdk/Scripts/PlayFab/PlayFabClient");

//let playerLoginResult:LoginResult;

export const FEATURE_INSTANCE_UNUSED_POOL:undefined = undefined


//TURN these up for debugging
function logEntry(classname:string,roomId:string,method:string,params?:any){
  //console.log(classname,roomId,method," ENTRY",params)
}
function logTrace(classname:string,roomId:string,method:string,msg?:string,...args:any[]){
  //if(this.loggingEnabled) 
  //console.log(classname,roomId,method,msg,...args)
}
function log(classname:string,roomId:string,method:string,msg?:string,...args:any[]){
  //if(this.loggingEnabled) 
  console.log(classname,roomId,method,msg,...args)
}
function logInfo(classname:string,roomId:string,method:string,msg?:string,...args:any[]){
  //if(this.loggingEnabled) 
  console.log(classname,roomId,method,msg,...args)
}
function logWarn(classname:string,roomId:string,method:string,msg?:string,...args:any[]){
  //if(this.loggingEnabled) 
  console.log(classname,roomId,method,msg,...args)
}

const CLASSNAME = "BaseCoinRoomTrackFeatureUtil"
const ENTRY = " ENTRY"

type FeaturesGroupedByStatus={
  inactive:TrackFeatureState[],
  active:TrackFeatureState[],
  scheduled:TrackFeatureState[],
  coolingdown:TrackFeatureState[],
  lowestCooldown:number
}

export class BaseCoinRoomTrackFeatureUtil  {
 
  state:MyRoomState
  roomId:string
  clock:Clock
  playFabDataUtils:PlayFabDataUtils
  clientCanDefineCostAndRewardsEnabled:boolean = false

  constructor(roomId:string,state:MyRoomState,clock:Clock,playfabDataUtils:PlayFabDataUtils){
    this.roomId = roomId;
    this.state = state;
    this.clock = clock
    this.playFabDataUtils = playfabDataUtils
  }

  isRangeValid(range:number[],minLen:number){
    return range !== undefined && range.length >= minLen
  }
  randomValueInRange(range: number[]) {
    const METHOD_NAME = "randomValueInRange";

    let retVal = 0;

    const max = Math.max(range[0], range[1]);
    const min = Math.min(range[0], range[1]);
    //Math.floor(Math.random() * (max - min + 1) + min)
    const delta = range[1] - range[0];
    retVal = Math.random() * (max - min) + min;

    return retVal;
  }

  getCurrentTime(){
    return this.clock.currentTime
  }

  groupByStatus(featuresByType:TrackFeatureState[]):FeaturesGroupedByStatus{
    const METHOD_NAME = "groupByStatus()"
    logEntry(CLASSNAME,this.roomId,METHOD_NAME,{"featuresByType.length":featuresByType.length})

    const featureDef = featuresByType[0]._featureDef

    const grouped:FeaturesGroupedByStatus = {
      inactive: [],
      active: [],
      scheduled: [],
      coolingdown: [],
      lowestCooldown: 99999999999
    }

    const now = this.getCurrentTime()
      
    const inactive = grouped.inactive
    const active = grouped.active
    const scheduled = grouped.scheduled
    const coolingdown = grouped.coolingdown
    
    const coolDownThreshhold = featureDef.spawnDef.coolDownTime !== undefined && featureDef.spawnDef.coolDownTime >= 0 ? featureDef.spawnDef.coolDownTime : 2000

    const loopId = featureDef.id+"."+featureDef.type
    
    //count how many active right now
    //for(let x=featureDef.spawnDef._zonesUsed.length; x < maxToUse ; x++){
    for(const q in featuresByType){
      const feature:TrackFeatureState = featuresByType[q]

      //1673289841132 expireTime 1673289851132 this.getCurrentTime() 1673289841132

      
      //START FINDING COOLDOWN TIME
      let coolDownTimeToUse = 0
      let cooldownTimeName = "none"
      if(feature.lastActivateTime !== undefined && feature.lastActivateTime > coolDownTimeToUse){
        coolDownTimeToUse = feature.lastActivateTime
        cooldownTimeName = "lastActivateTime"
      }
      if(feature.lastTouchTime !== undefined && feature.lastTouchTime > coolDownTimeToUse){
        coolDownTimeToUse = feature.lastTouchTime
        cooldownTimeName = "lastTouchTime"
      }
      if(feature.expireTime !== undefined && feature.expireTime < now && feature.expireTime > coolDownTimeToUse){
        coolDownTimeToUse = feature.expireTime
        cooldownTimeName = "expireTime"
      }
      
      let cooldownDelta = 0
      if(coolDownTimeToUse !== undefined ){
        cooldownDelta = (now-coolDownTimeToUse)
      } 
      //END FINDING COOLDOWN TIME

      //START SORTING TO STATUS
      if((feature.activateTime !== undefined && feature.activateTime <= now) && (feature.expireTime === undefined || feature.expireTime > now)){
        logTrace(CLASSNAME,this.roomId,METHOD_NAME,loopId,"featureType",featureDef.type,"IS ACTIVE",feature.id,feature.type,"activateTime",feature.activateTime,"expireTime",feature.expireTime,"this.getCurrentTime()",this.getCurrentTime(),"expires in",(feature.expireTime-this.getCurrentTime()))//,"featureDef",JSON.stringify( featureDef ))
        active.push(feature)

        feature.status = 'active'
      }else if(feature.activateTime !== undefined && (feature.activateTime !== undefined && feature.activateTime > now)){
        logTrace(CLASSNAME,this.roomId,METHOD_NAME,loopId,"featureType",featureDef.type,"IS SCHEULED",feature.id,feature.type,"activateTime",feature.activateTime,"expireTime",feature.expireTime,"this.getCurrentTime()",this.getCurrentTime(),"go live in",(feature.activateTime-this.getCurrentTime()))//,"featureDef",JSON.stringify( featureDef ))
        //scheduled, but maybe not active yet
        scheduled.push(feature)

        feature.status = 'scheduled'
      }else if(coolDownTimeToUse !== undefined && (cooldownDelta)<coolDownThreshhold){
        const cooldownOverIn = (coolDownThreshhold-(this.getCurrentTime()-coolDownTimeToUse))
        logTrace(CLASSNAME,this.roomId,METHOD_NAME,loopId,"featureType",featureDef.type,"IS COOLING DOWN",feature.id,feature.type,"activateTime",feature.activateTime,"expireTime",feature.expireTime,"this.getCurrentTime()",this.getCurrentTime(),"cooldown over in",cooldownOverIn,"coolDownThreshhold",coolDownThreshhold,"cooldownTimeName",cooldownTimeName)//,"featureDef",JSON.stringify( featureDef ))
        //coolingdown, but maybe not active yet
        coolingdown.push(feature)
        feature.status = 'cooling-down'
        if(grouped.lowestCooldown > cooldownOverIn){
          grouped.lowestCooldown = cooldownOverIn
        }
      }else{
        logTrace(CLASSNAME,this.roomId,METHOD_NAME,loopId,"featureType",featureDef.type,"NOT ACTIVE",feature.id,feature.type,"activateTime",feature.activateTime,"expireTime",feature.expireTime,"this.getCurrentTime()",this.getCurrentTime(),"cooldown",(cooldownDelta),"coolDownThreshhold",coolDownThreshhold,"cooldownTimeName",cooldownTimeName)//,"featureDef",JSON.stringify( featureDef ))
        inactive.push(feature)

        feature.status = 'inactive'
      }
    }
    //END SORTING TO STATUS

    return grouped;
  }
  distributeTrackFeatures(type?:string){
    const METHOD_NAME = "distributeTrackFeatures()"
    logEntry(CLASSNAME,this.roomId,METHOD_NAME,{"type":type})

    const featuresByType:Record<string,TrackFeatureState[]>={}

    //TODO consider caching this scan in levelData._trackFeaturesByType
    this.state.levelData.trackFeatures.forEach(
      (trackFeature:serverStateSpec.ITrackFeatureState)=>{
        //group them
        //then scan them for spawn rules
        let arr = featuresByType[trackFeature.type]
        if(arr === undefined){
          arr = []
          featuresByType[trackFeature.type] = arr
        }
        arr.push( trackFeature as TrackFeatureState )
      }
    )
    
    log(CLASSNAME,this.roomId,METHOD_NAME,"this.state.levelData.trackFeatures.size",this.state.levelData.trackFeatures.size)

    for(const p in featuresByType){
      const featureDef = featuresByType[p][0]._featureDef

      //determine how many
      
      const zones:serverStateSpec.SpawnZoneDef[] = featureDef.spawnDef.zones
      const zonesFree:serverStateSpec.SpawnZoneDef[] = featureDef.spawnDef._zonesFree
      const zonesUsed:serverStateSpec.SpawnZoneDef[] = featureDef.spawnDef._zonesUsed

      const loopId = featureDef.id+"."+featureDef.type

      /*//copy into list so can splice them to assume spread out distribution
      for(const p in featureDef.spawnDef._zonesFree){
        zonesFree.push( featureDef.spawnDef._zonesFree[p] )
      }*/
      
      let maxToUse = featureDef.spawnDef.concurrentMax
      if(maxToUse > zones.length){
        logWarn(CLASSNAME,this.roomId,METHOD_NAME,loopId," WARNING concurrentMax greater than aviable zones ","concurrentMax",featureDef.spawnDef.concurrentMax,"zones.length",zones.length);
        maxToUse = zones.length
      }
      
      logTrace(CLASSNAME,this.roomId,METHOD_NAME,loopId,"STARTING","featureType",featureDef.type,"featuresByType.length",featuresByType[p].length,"maxToUse",maxToUse,"zonesFree",zonesFree.length,"featureDef.spawnDef._zonesUsed",featureDef.spawnDef._zonesUsed.length,"featureDef",JSON.stringify( featureDef ))
      

      const groupedByStatus = this.groupByStatus(  featuresByType[p] )
      const inactive = groupedByStatus.inactive
      const active= groupedByStatus.active
      const scheduled= groupedByStatus.scheduled
      const coolingdown= groupedByStatus.coolingdown

      const lowestCooldown = groupedByStatus.lowestCooldown
      
      let updated = 0
      const moreToActivate = maxToUse - active.length
      log(CLASSNAME,this.roomId,METHOD_NAME,loopId,"featureType",featureDef.type,"maxToUse",maxToUse,"active",active.length,"scheduled",scheduled.length,"inactive",inactive.length,"moreToActivate",moreToActivate,"zonesFree",zonesFree.length,"featureDef.spawnDef._zonesUsed",featureDef.spawnDef._zonesUsed.length,"active",active.length,"inactive",inactive.length)
      if(moreToActivate > 0 && moreToActivate <= inactive.length){
        for(let x=0; x < moreToActivate ; x++){
            const feature:TrackFeatureState = inactive[x]
            //look at its definition
            
            const zoneIdx = Math.floor(Math.random()*zonesFree.length)
            //remove item and use at same time
            const zoneToUse = zonesFree.splice(zoneIdx,1)[0]

            logTrace(CLASSNAME,this.roomId,METHOD_NAME,loopId,x,"/",maxToUse,"zoneToUse",zoneToUse,"zonesFree left:",zonesFree.length)
            if( zoneToUse === undefined ){
              logWarn(CLASSNAME,this.roomId,METHOD_NAME,loopId,x,"/",maxToUse,"ZONE UNDEFINED !?!?! zoneToUse",zoneToUse,"zonesFree left:",zonesFree.length)
              continue;
            }

            feature.position = new TrackFeaturePositionState()
            feature._zone = zoneToUse
            const pos = new Vector3State(0,0,0)
            pos.copyFrom(zoneToUse.position)
            feature.position.position = pos

            if(zoneToUse.scale){
              const scale = new Vector3State(1,1,1)
              scale.copyFrom(zoneToUse.scale)
              feature.position.scale = scale
            }

            feature.lastActivateTime = feature.activateTime
            
            //console.log("XXXXXXX trackFeat.id",feature.id,"trackFeat.name",feature.name)

            if(this.isRangeValid(featureDef.spawnDef.respawnTime,2)){
              feature.activateTime = this.getCurrentTime() + this.randomValueInRange(featureDef.spawnDef.respawnTime)//(5000 * (x+1))
            }else{
              feature.activateTime = this.getCurrentTime() //+ (2000 * (x+1))
            }
            if(this.isRangeValid(featureDef.spawnDef.expireTime,2)){
              feature.expireTime = feature.activateTime + this.randomValueInRange(featureDef.spawnDef.expireTime)//(5000 * (x+1))
            } 


            //log("SCHEDULED TIMEOUT!!!!")
            this.clock.setTimeout(()=>{
              logTrace(CLASSNAME,this.roomId,METHOD_NAME,loopId,"featureType",featureDef.type,"WENT ACTIVE",feature.id,feature.type,"activateTime",feature.activateTime,"expireTime",feature.expireTime,"this.getCurrentTime()",this.getCurrentTime())//,"featureDef",JSON.stringify( featureDef ))
              //put it back
              feature.status = 'active'
              feature.updateServerTime(this.getCurrentTime())
            },feature.activateTime - this.getCurrentTime() )
          

            logTrace(CLASSNAME,this.roomId,METHOD_NAME,loopId,"featureType",featureDef.type,"EXPIRED ACTIVE",feature.id,feature.type,"activateTime",feature.activateTime,"expireTime",feature.expireTime,"this.getCurrentTime()",this.getCurrentTime())//,"featureDef",JSON.stringify( featureDef ))
            const checkTime = (feature.expireTime - this.getCurrentTime() )

            if(feature.expireTime !== undefined){
              //  
              feature.updateServerTime(this.getCurrentTime())
              this.clock.setTimeout(()=>{
                logTrace(CLASSNAME,this.roomId,METHOD_NAME,loopId,"featureType",featureDef.type,"EXPIRED ACTIVE",feature.id,feature.type,"activateTime",feature.activateTime,"expireTime",feature.expireTime,"this.getCurrentTime()",this.getCurrentTime())//,"featureDef",JSON.stringify( featureDef ))
                //put it back
                this.putFeatureZoneBackInPool(feature,"feature.expireTime")
                this.distributeTrackFeatures(feature.type)
              },checkTime)
            }
            featureDef.spawnDef._zonesUsed.push(zoneToUse)

            updated ++
            logTrace(CLASSNAME,this.roomId,METHOD_NAME,loopId,x,"/",maxToUse,"featureType",featureDef.type,"UPDATED",feature.id,feature.type,"activateTime",feature.activateTime,"expireTime",feature.expireTime,"checkTime",checkTime,"goes live in ",(feature.activateTime-this.getCurrentTime()),"expires in  ",(feature.expireTime-this.getCurrentTime()))//,"featureDef",JSON.stringify( featureDef ))
        }
      }else{
        logTrace(CLASSNAME,this.roomId,METHOD_NAME,loopId,"ALL SPAWNED","/",maxToUse,"featureType",featureDef.type,"maxToUse",maxToUse,"zonesFree",zonesFree.length,"moreToActivate",moreToActivate,"zonesFree",zonesFree.length,"featureDef.spawnDef._zonesUsed",featureDef.spawnDef._zonesUsed.length,"active",active.length,"scheduled",scheduled.length,"inactive",inactive.length,"ALL SPAWNED")
      }
      

      if(coolingdown.length > 0 && updated < maxToUse){
        //scheduling a recheck for cooldowns
        logTrace(CLASSNAME,this.roomId,METHOD_NAME,loopId,"COOLDOWN CHECK IN","featureType",featureDef.type,"updated",updated,"lowestCooldown",lowestCooldown)  
        this.clock.setTimeout(()=>{
          this.distributeTrackFeatures(featureDef.type)
        },lowestCooldown)
      }
      logTrace(CLASSNAME,this.roomId,METHOD_NAME,loopId,"ENDING","featureType",featureDef.type,"updated",updated,"lowestCooldown",lowestCooldown,"featuresByType.length",featuresByType[p].length,"maxToUse",maxToUse,"zonesFree",zonesFree.length,"featureDef.spawnDef._zonesUsed",featureDef.spawnDef._zonesUsed.length,"featureDef",JSON.stringify( featureDef ))
    }
  }
  putFeatureZoneBackInPool(feature:TrackFeatureState,_caller:string) {
    const METHOD_NAME = "putFeatureZoneBackInPool()"
    logEntry(CLASSNAME,this.roomId,METHOD_NAME,{"feature.id":feature?.id,"_caller":_caller})
    logInfo(CLASSNAME,this.roomId,METHOD_NAME,"called",{"feature":feature,"_caller":_caller})
    if(!feature){
      logWarn(CLASSNAME,this.roomId,METHOD_NAME,"feature not defined, skipping!!!",{"_caller":_caller})
      return
    }
    this.putZoneBackInPool(feature._featureDef,feature._zone,_caller + "."+feature?.id)
  }
  putZoneBackInPool(featureDef:serverStateSpec.TrackFeatureInstDef,_zone: serverStateSpec.SpawnZoneDef,_caller?:string) {
    const METHOD_NAME = "putZoneBackInPool()"
    logEntry(CLASSNAME,this.roomId,METHOD_NAME,{"_caller":_caller})
    
    if(!featureDef || !featureDef.spawnDef){
      logWarn(CLASSNAME,this.roomId,METHOD_NAME,"featureDef not defined, skipping!!!",{"_caller":_caller})
      return
    }
    //const zones:serverStateSpec.SpawnZoneDef[] = featureDef.spawnDef.zones
    const zonesFree:serverStateSpec.SpawnZoneDef[] = featureDef.spawnDef._zonesFree
    const zonesUsed:serverStateSpec.SpawnZoneDef[] = featureDef.spawnDef._zonesUsed

    const zonesFreePre = zonesFree.length
    const zonesUsedPre = zonesUsed.length

    zonesFree.push( _zone )
    const idx = zonesUsed.indexOf(_zone)
    if(idx >= 0){
      zonesUsed.splice(idx,1)
    }

    const zonesFreePost = zonesFree.length
    const zonesUsedPost = zonesUsed.length

    logInfo(CLASSNAME,this.roomId,METHOD_NAME,"called",{"_caller":_caller
      ,"zonesFreePre":zonesFreePre,"zonesUsedPre":zonesUsedPre
      ,"zonesFreePost":zonesFreePost,"zonesUsedPost":zonesUsedPost
      }
    )
  }
  
  setupRaceTrackFeatures(){
    const METHOD_NAME = "setupRaceTrackFeatures()"

    const featureDef = this.state.levelData._featureDef

    logEntry(CLASSNAME,this.roomId,METHOD_NAME,[featureDef])
    
    //TODO FIXME pull data from track ID
    

    let featureDefEnabledCount = 0
    const featuresEnabled:Record<string,serverStateSpec.TrackFeatureInstDef>={}
    const featuresEnabledList:serverStateSpec.TrackFeatureInstDef[]=[]
    //add featureDef - buyables?
    //add featureDef - craftables?
    for(const p in featureDef.minables){
        const itm = featureDef.minables[p]
        log(CLASSNAME,this.roomId,METHOD_NAME,"featuresEnabled.itm",itm)
        if(itm.enabled !== undefined && itm.enabled){
            featuresEnabled[itm.type] = itm
            featuresEnabledList.push(itm)
            featureDefEnabledCount++
        }
    }
    if(featureDef.buyables){
      for(const p in featureDef.buyables){
        const itm = featureDef.buyables[p]
        log(CLASSNAME,this.roomId,METHOD_NAME,"featuresEnabled.itm",itm)
        if(itm.enabled !== undefined && itm.enabled){
            featuresEnabled[itm.type] = itm
            featuresEnabledList.push(itm)
            featureDefEnabledCount++
        }
      }
    }

    //need to fetch/sanitize?

    this.updateCostAndRewards(featuresEnabledList)
    
    //by not passing triggersize and shape, it allows current theme to define them
    
    log(CLASSNAME,this.roomId,METHOD_NAME,"featureDefEnabledCount",featureDefEnabledCount,"featureDef",JSON.stringify( featureDef ))


    let totalSpawned = 0
    let attemptedSpawned = 0


    //let lastSpawnedOffset = 99
    //let lastCenterOffset = 99


    const trackFeatures:serverStateSpec.TrackFeatureConstructorArgs[] = []

    for(const p in featuresEnabled){
      const featureDef = featuresEnabled[p]
      //if(feature.enabled)

      featureDef.spawnDef._zonesFree = []
      featureDef.spawnDef._zonesUsed = []

      const loopId = featureDef.id+"."+featureDef.type

      log(CLASSNAME,this.roomId,METHOD_NAME,loopId,"featureDef ", featureDef.id,featureDef.type,featureDef.cost,featureDef.spawnDef)//JSON.stringify( featureDef ));
      
      const zones:serverStateSpec.SpawnZoneDef[] = []

      
      //copy into list so can splice them to assume spread out distribution
      for(const p in featureDef.spawnDef.zones){
        const zone = featureDef.spawnDef.zones[p]
        zones.push( zone )
        featureDef.spawnDef._zonesFree.push( zone )
      }
      

      let maxToUse = featureDef.spawnDef.concurrentMax
      if(maxToUse > zones.length){
        log(CLASSNAME,this.roomId,METHOD_NAME," WARNING concurrentMax greater than aviable zones ","concurrentMax",featureDef.spawnDef.concurrentMax,"zones.length",zones.length);
        maxToUse = zones.length
      }

      log(CLASSNAME,this.roomId,METHOD_NAME,loopId,"maxToUse",maxToUse);

      //push all of them but only enable X amount to start, random
      for(let cnt = 0 ; cnt< maxToUse ;cnt++){
        //TODO check zone in bounds!

        const zoneIdx = Math.floor(Math.random()*zones.length)
        //remove item and use at same time
        const zoneToUse = zones.splice(zoneIdx)[0]

        const featureInst:serverStateSpec.TrackFeatureConstructorArgs = {
          id: featureDef.type + "." + cnt,
          name: featureDef.name,
          position: zoneToUse,
          type: featureDef.type,
          activateTime: FEATURE_INSTANCE_UNUSED_POOL,//far future this.getCurrentTime() //now,
          featureDefId: featureDef.id,
          cost:featureDef.cost,
          _featureDef: featureDef
        }

        trackFeatures.push(featureInst)
        
      }
    }
    //for quick testing could spawn some at very beginning
    /*if(CONFIG.DEBUG_HARCODED_TRACK_FEATURE_TESTING_ENABLED){
        trackFeatures.push( {name:"test.1",type:"boost", position:new serverStateSpec.TrackFeaturePosition({startSegment:2,endSegment:1, centerOffset:1}) } )
        trackFeatures.push( {name:"test.2a",type:"slow-down", position:new serverStateSpec.TrackFeaturePosition({startSegment:2,endSegment:1, centerOffset:-1}) } )
        trackFeatures.push( {name:"test.2.5",type:"slow-down-wall", position:new serverStateSpec.TrackFeaturePosition({startSegment:2.5,endSegment:1, centerOffset:-1}) } )
        trackFeatures.push( {name:"test.3",type:"coin-1", position:new serverStateSpec.TrackFeaturePosition({startSegment:3,endSegment:1, centerOffset:-1}) } )


        trackFeatures.push( {name:"test.-1",type:"boost", position:new serverStateSpec.TrackFeaturePosition({startSegment:175,endSegment:1, centerOffset:1}) } )
        trackFeatures.push( {name:"test.-2",type:"slow-down", position:new serverStateSpec.TrackFeaturePosition({startSegment:175,endSegment:1, centerOffset:-1}) } )
    }*/

    // const tf:serverStateSpec.TrackFeatureConstructorArgs = {name:type+"-"+spawnCnt+"."+xOffset.toFixed(1),type:type, position:new serverStateSpec.TrackFeaturePosition({startSegment:xOffset,endSegment:xOffset, centerOffset:centerOffset}) }

    //if(debugTrackFeat) log(CLASSNAME,this.roomId,METHOD_NAME,"adding addTrackFeature ","segment",x,"trackFeatDef",trackFeatDef,"created:",tf)

    //trackFeatures.push( tf )

    log(CLASSNAME,this.roomId,METHOD_NAME," RESULTS ",totalSpawned.toFixed(0),attemptedSpawned.toFixed(0))

    return trackFeatures
  }
  //map playfab defined costs to the feature costs
  updateCostAndRewards(featuresEnabledList:serverStateSpec.TrackFeatureInstDef[]) {
    const METHOD_NAME = "updateCostAndRewards()"
    logEntry(CLASSNAME,this.roomId,METHOD_NAME,{"featuresEnabledList":featuresEnabledList.length})
    
    const catalogs:string[]=[]
      
    /*if(this.clientCanDefineCostAndRewardsEnabled){
      const dropTables:string[]=[]
      for(const x in featuresEnabledList){
        const p = featuresEnabledList[x]
        //log(CLASSNAME,this.roomId,METHOD_NAME," loop ",p)
        if(p.cost){
          for(const c of p.cost){
            //'DropTable'|'CatalogItem'
            if(c.type === 'CatalogItem'){
              catalogs.push(c.id)
            }else{
              //remove it
              logWarn(CLASSNAME,this.roomId,METHOD_NAME," removed invalid cost type ",c)
            }
          }
        }
        if(p.rewards){
          for(const r of p.rewards){
            //'DropTable'|'CatalogItem'
            if(r.type === 'DropTable'){
              dropTables.push( r.id)
            }else{
              //remove it
              logWarn(CLASSNAME,this.roomId,METHOD_NAME," removed invalid reward type ",r)
            }
          }
        }
      }
      logInfo(CLASSNAME,this.roomId,METHOD_NAME,"catalogs",catalogs,"rewards",dropTables)
    }else{*/
    //remove all defined rewards
    for(const x in featuresEnabledList){
      const p = featuresEnabledList[x]
      //log(CLASSNAME,this.roomId,METHOD_NAME," loop ",p)
      if(p.rewards || p.cost){
        logWarn(CLASSNAME,this.roomId,METHOD_NAME,"WARNING client passed rewards or costs this.clientCanDefineCostAndRewardsEnabled",this.clientCanDefineCostAndRewardsEnabled + " clearing contents",p.cost,p.rewards)
      }
      
      p.cost=[]
      p.rewards=[]

      //map playfab defined costs to the feature costs
      let serverDefinedReward = this.playFabDataUtils.catalogItemMapById.get(p.type)
      if(isNull(serverDefinedReward)){
        serverDefinedReward = this.playFabDataUtils.catalogItemMapById.get(p.type+".container")
      }
      if(isNull(serverDefinedReward)){
        serverDefinedReward = this.playFabDataUtils.catalogItemMapById.get(p.type+".bundle")
      }
      if(notNull(serverDefinedReward)){
        if(notNull(serverDefinedReward.VirtualCurrencyPrices)){
          //defines costs and reward through drop table
          for(const vc in serverDefinedReward.VirtualCurrencyPrices){
            const amount = serverDefinedReward.VirtualCurrencyPrices[vc]
            
            p.cost.push(
              {
                amount: amount,
                type: "VirtualCurrency",
                id: vc
              }
            )
          }
        }

        //define reward
        if(notNull(serverDefinedReward.Container.VirtualCurrencyContents)){
          for(const containerVc in serverDefinedReward.Container.VirtualCurrencyContents){
            const amount = serverDefinedReward.Container.VirtualCurrencyContents[containerVc]
            
            p.rewards.push(
              {
                amount: amount,
                type: "VirtualCurrency",
                id: containerVc
              }
            )
          }
        }
        //TODO refactor with droptable so uses same code
        if(notNull(serverDefinedReward.Container.ItemContents)){
          const invMapCnt = new Map<string,number>()
          for(const containerItm in serverDefinedReward.Container.ItemContents){
            const itemId = serverDefinedReward.Container.ItemContents[containerItm]
            //need to group as key will list multiple times if get item more than X times
            
            if(invMapCnt.has(itemId)){
              invMapCnt.set(itemId,invMapCnt.get(itemId)+1)
            }else{
              invMapCnt.set(itemId,1)
            }
          }
          invMapCnt.forEach((amount:number,containerItm:string)=>{
            //need to check object for "CustomData": "{\"inventoryMax\":\"1\"}",
            //need to check existing inventory if already have it?? or is that on claim side?

            //tack limits onto this here now??
            //can do a precheck if even qualify
            //can mark the limits
            //then on redeem check again?

            let rewardItem = this.playFabDataUtils.catalogItemMapById.get(containerItm)
            let maxInventoryRule = -1
            let currentAmount = -1

            //logWarn(CLASSNAME,this.roomId,METHOD_NAME,"PARSING rewardItem.CustomData for", containerItm ,"rewardItem.CustomData",rewardItem.CustomData) 

            if(rewardItem){
              maxInventoryRule = PlayFabHelper.getMaxInventoryProp( rewardItem )
            }
            //TODO consider converting to "Statistic"
            p.rewards.push(
              {
                amount: amount,
                type: "CatalogItem",
                id: containerItm,
                maxAllowed: maxInventoryRule,
                currentAmount: currentAmount
              }
            )
          })
          
        }

        if(notNull(serverDefinedReward.Container.ResultTableContents)){
          for(const idx in serverDefinedReward.Container.ResultTableContents){
            const dropTableId = serverDefinedReward.Container.ResultTableContents[idx]
            //logWarn(CLASSNAME,this.roomId,METHOD_NAME,"looking up  dropTableId",dropTableId)
            const dropTable = this.playFabDataUtils.dropTablesMapById.get(dropTableId)
            
            if(dropTable !== undefined){
              p.rewards.push(
                {
                  amount: 1,
                  type: "DropTable",
                  id: dropTableId
                }
              )
              logInfo(CLASSNAME,this.roomId,METHOD_NAME,"reward will be provided by drop table:",dropTableId,dropTable)
              logInfo(CLASSNAME,this.roomId,METHOD_NAME,"reward evalDropTable",dropTableId,"dropTable",dropTable,"evalDropTable",evalDropTable(dropTable,this.playFabDataUtils))
            }else{
              logWarn(CLASSNAME,this.roomId,METHOD_NAME,"could not find by playFabDataUtils.dropTablesMapById",p.type,p.id) 
            }
          }
        }

        logInfo(CLASSNAME,this.roomId,METHOD_NAME,"reward evalRewards",p.rewards,"evalRewards",evalRewards(p.rewards,this.playFabDataUtils))

        logInfo(CLASSNAME,this.roomId,METHOD_NAME," new reward data ",p.type,"cost",p.cost,"rewards",p.rewards)
      }else{
        logWarn(CLASSNAME,this.roomId,METHOD_NAME," missing serverDefinedReward ",p.type,serverDefinedReward)
      }
    }
    
    
  }

}

