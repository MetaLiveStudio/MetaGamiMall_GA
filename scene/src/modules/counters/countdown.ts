import { ColliderLayer, Entity, GltfContainer, TextShape, Transform, TransformTypeWithOptionals, engine } from "@dcl/sdk/ecs"
import { log } from "../../back-ports/backPorts"
import { Color3, Color4, Quaternion, Vector3 } from "@dcl/sdk/math"

//TODO WIP


const CLASSNAME = "countdown.ts"

//40, 6, 8
const baseX = 40
const baseY = 9
const baseZ = 8
//const textX = -.6
const textY = -.6

export class CountdownBanner{
    host:Entity
    frame:Entity
    titleEnt:Entity
    hourEnt:Entity
    //hourText:TextShape
    eventName:string
    eventStartTime:number

    constructor(eventName:string,eventStartTime:number,baseTransform:TransformTypeWithOptionals){
        this.eventName = eventName
        this.eventStartTime = eventStartTime
        
        const host = this.host = engine.addEntity()//new Entity()
        Transform.createOrReplace(host,baseTransform)
        //host.addComponent(baseTransform)

        const frame = this.frame = engine.addEntity()//new Entity()
        GltfContainer.create(frame,{
            src: "models/countdown_frame.glb",
            invisibleMeshesCollisionMask: ColliderLayer.CL_NONE,
            visibleMeshesCollisionMask: ColliderLayer.CL_NONE
        })
        //frame.addComponent(new GLTFShape("models/countdown_frame.glb"))
        Transform.createOrReplace(frame,{
            position: Vector3.create(0, 0, 0),
            scale: Vector3.create(1, 1, 1),
            parent: host
        })
        //frame.setParent(host)
        
        const titleEnt = this.titleEnt = engine.addEntity()//new Entity()
        TextShape.create(titleEnt,{
            text:this.eventName + " starts in",
            fontSize: 10,
            textColor: Color4.create(123 / 400, 84 / 400, 183 / 400)
        })
        //const titleText = new TextShape(this.eventName + " starts in")
        //titleText.fontSize = 10
        //titleText.color = Color3.create(123 / 400, 84 / 400, 183 / 400)
        Transform.createOrReplace(titleEnt,{
            position: Vector3.create(0, .875, 0),
            parent: frame
        })
        //titleEnt.addComponent(titleText)
        //titleEnt.setParent(frame)

        const hourEnt = this.hourEnt = engine.addEntity()
        TextShape.create(hourEnt,{
            text: "--",
            fontSize: 20,
            textColor: Color4.create(123 / 600, 84 / 600, 183 / 600)
        })
        //const hourText = new TextShape("--")
        //hourText.fontSize = 20
        //hourText.color = Color3.create(123 / 600, 84 / 600, 183 / 600)

        Transform.createOrReplace(hourEnt,{
            position: Vector3.create(0, textY, 0),
            parent: frame
        })
        //hourEnt.addComponent(hourText)
        //hourEnt.setParent(frame)
    }

    updateText(text:string){
        if(this.hourEnt){
            const textShape = TextShape.getMutableOrNull(this.hourEnt)
            if (textShape) {
                textShape.text = text;
            }
        }
        //this.hourText.value = text
    }


    updateCounterTransform(baseTransform:TransformTypeWithOptionals){
        Vector3.copyFrom(baseTransform.position!,Transform.getMutable(this.host).position);
        //this.host.getComponent(Transform).position.copyFrom( baseTransform.position );
    }

    removeText() {
        /*
        if(this.host.alive) engine.removeEntity(this.host)
        if(this.titleEnt.alive) engine.removeEntity(this.titleEnt)
        if(this.hourEnt.alive) engine.removeEntity(this.hourEnt)
        if(this.frame.alive) engine.removeEntity(this.frame)
        */

        //assuming can call removeEntity mulitpile times on the same entity?
        engine.removeEntity(this.host)
        engine.removeEntity(this.titleEnt)
        engine.removeEntity(this.hourEnt)
        engine.removeEntity(this.frame)
    }

    addToEngine(){
        //init of counter will do add to engine
        //engine.addEntity(this.host)
        //engine.addEntity(this.frame)
        //engine.addEntity(this.hourEnt)
        //engine.addEntity(this.titleEnt)
    }
    getSecondsTillEvent(){
        let now = Math.floor(Date.now())
        let totalSecond = this.eventStartTime - now

        return totalSecond/1000;
    }
}


export class CountdownTimerSystem {
    refreshRate: number = 0.5
    count: number = 0
    rotate: boolean = false
    countdownBanners:CountdownBanner[] = []

    systemFnCache!:(dt:number)=>void

    constructor() {
        this.createUpdateFn()
    }
    addCounter(countdownBanner:CountdownBanner){
        this.countdownBanners.push(countdownBanner)

        let totalSecond = countdownBanner.getSecondsTillEvent()

        if (totalSecond > 0) {
            log(CLASSNAME,"countdown will count down from :)",totalSecond)
            engine.addSystem(this.systemFnCache)

            countdownBanner.addToEngine()
        }else{
            log(CLASSNAME,"countdown has passed, do nothing :)",totalSecond)
        }
    }
    createUpdateFn(){
        if(this.systemFnCache === undefined){
          log(CLASSNAME,"createUpdateFn",this)
          this.systemFnCache = (dt:number)=>{
            //log("createUpdateFn called",this)
            this.update(dt)
          }
        }
        return this.systemFnCache
      }
    update(dt: number) {
        
        this.count += dt
 
        if (this.count > this.refreshRate) {
            log(CLASSNAME,"counter sytem ticked")
            let activeCounter = 0
            for(const p in this.countdownBanners){
                const countDownInst = this.countdownBanners[p]
                this.count = 0

                //let now = Math.floor(Date.now() )
                let totalSecond = countDownInst.getSecondsTillEvent()

                //log("countdown.update will count down from :)",totalSecond)

                if (totalSecond < 0) {
                    countDownInst.removeText()   
                }else{
                    activeCounter++
                }

                const INCLUDE_DAYS_ENABLED = false
                let days = 0
                let hours = Math.floor(totalSecond / 3600)
                //if doing days
                if(INCLUDE_DAYS_ENABLED && hours >= 24){
                    days = Math.floor(hours / 24)
                    hours = Math.floor(hours % 24)
                }
                let second_remain = totalSecond % 3600
                let mins = Math.floor(second_remain / 60)
                let secs = Math.floor(second_remain % 60)

                if(INCLUDE_DAYS_ENABLED && days > 0){
                    countDownInst.updateText(  digitFormat2Digit(days) + ":" + digitFormat2Digit(hours) + ":" + digitFormat2Digit(mins) + ":" + digitFormat2Digit(secs) )
                }else{
                    countDownInst.updateText(  digitFormat2Digit(hours) + ":" + digitFormat2Digit(mins) + ":" + digitFormat2Digit(secs) )
                }

                //log(totalSecond, now, eventTime)
                //log("DIFF: ", digitFormat2Digit(hours), digitFormat2Digit(mins), digitFormat2Digit(secs))

            }
            if(activeCounter <= 0){
                log("countdown.no more counters, removing system")
                engine.removeSystem(this.systemFnCache)
            }
        }
    }
}

export function initCountdownWidgits(){ 
    //month is 0 based; 0 = January
    //format is year,month,date,hours,minutes,seconds,ms - UTC ALWAYS
    let eventTime0 = Date.UTC(2023, 1, 19, 23, 21, 30) //(Date.now() ) + (1) //Saturday, June 11, 2022 21:00:00 UTC 
    log(CLASSNAME,"counter",new Date(eventTime0),new Date(eventTime0).toLocaleString(),eventTime0-(Date.now()))
    let eventTime1 = Date.UTC(2023, 8, 15, 15, 0, 0)
    log(CLASSNAME,"counter",new Date(eventTime1),eventTime1-(Date.now()))
    let eventTime2 = Date.UTC(2023, 8, 15, 14, 30, 0)
    log(CLASSNAME,"counter",new Date(eventTime2),eventTime2-(Date.now()))
    let eventTime3 = Date.UTC(2023, 8, 15, 14, 0, 0)
    log(CLASSNAME,"counter",new Date(eventTime3),eventTime3-(Date.now()))

    const countdownSystem = new CountdownTimerSystem()
    countdownSystem.addCounter(
        new CountdownBanner(
            "MetaMineS4",
            eventTime0
            , {
                position: Vector3.create(baseX, baseY-2.5, baseZ),
                rotation: Quaternion.fromEulerDegrees(0,0,0),
                scale: Vector3.create(0.7,0.7,0.7)}
        )
    )

    countdownSystem.addCounter(
        new CountdownBanner(
            "Premium Claim",
            eventTime1
            , {
                position: Vector3.create(baseX, baseY-5.5, baseZ+12),
                rotation: Quaternion.fromEulerDegrees(0,0,0),
                scale: Vector3.create(0.5,0.5,0.5)
            }
        )
    )

    countdownSystem.addCounter(
        new CountdownBanner(
            "Gold Claim",
            eventTime2
            , {
                position: Vector3.create(baseX, baseY-5.5, baseZ+28.5),
                rotation: Quaternion.fromEulerDegrees(0,0,0),
                scale: Vector3.create(0.5,0.5,0.5)
            }
        )
    )

    countdownSystem.addCounter(
        new CountdownBanner(
            "Silver Claim",
            eventTime3
            , {
                position: Vector3.create(baseX, baseY-2.5, baseZ+55),
                rotation: Quaternion.fromEulerDegrees(0,0,0),
                scale: Vector3.create(0.5,0.5,0.5)
            }
        )
    )



    log("countdown added")
    engine.addSystem(
        countdownSystem.systemFnCache
    )
}

function digitFormat2Digit(val: number) {
    if (val > 9) {
        return val.toString()
    }
    else {
        return "0" + val.toString()
    }
}