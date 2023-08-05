



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
    hourText:TextShape
    eventName:string
    eventStartTime:number

    constructor(eventName:string,eventStartTime:number,baseTransform:Transform){
        this.eventName = eventName
        this.eventStartTime = eventStartTime
        
        const host = this.host = new Entity()
        host.addComponent(//new Transform({
            //position: new Vector3(baseX, baseY, baseZ),
            //scale: new Vector3(1, 1, 1)
        //}))
        baseTransform)

        const frame = this.frame = new Entity()
        frame.addComponent(new GLTFShape("models/countdown_frame.glb"))
        frame.addComponent(new Transform({
            position: new Vector3(0, 0, 0),
            scale: new Vector3(1, 1, 1)
        }))
        frame.setParent(host)
        
        const titleEnt = this.titleEnt = new Entity()
        const titleText = new TextShape(this.eventName + " starts in")
        titleText.fontSize = 10
        titleText.color = new Color3(123 / 400, 84 / 400, 183 / 400)
        titleEnt.addComponent(new Transform({
            position: new Vector3(0, .875, 0)
        }))
        titleEnt.addComponent(titleText)
        titleEnt.setParent(frame)

        const hourEnt = this.hourEnt = new Entity()
        const hourText = this.hourText = new TextShape("--")
        hourText.fontSize = 20
        hourText.color = new Color3(123 / 600, 84 / 600, 183 / 600)

        hourEnt.addComponent(new Transform({
            position: new Vector3(0, textY, 0)
        }))
        hourEnt.addComponent(hourText)
        hourEnt.setParent(frame)
    }

    updateText(text:string){
        this.hourText.value = text
    }


    updateCounterTransform(baseTransform:Transform){
        this.host.getComponent(Transform).position.copyFrom( baseTransform.position );
    }

    removeText() {
        if(this.host.alive) engine.removeEntity(this.host)
        if(this.titleEnt.alive) engine.removeEntity(this.titleEnt)
        if(this.hourEnt.alive) engine.removeEntity(this.hourEnt)
        if(this.frame.alive) engine.removeEntity(this.frame)
    }

    addToEngine(){
        engine.addEntity(this.host)
        engine.addEntity(this.frame)
        engine.addEntity(this.hourEnt)
        engine.addEntity(this.titleEnt)
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

    constructor() {
        
        
    }
    addCounter(countdownBanner:CountdownBanner){
        this.countdownBanners.push(countdownBanner)

        let totalSecond = countdownBanner.getSecondsTillEvent()

        if (totalSecond > 0) {
            log("countdown will count down from :)",totalSecond)
            engine.addSystem(this)

            countdownBanner.addToEngine()
        }else{
            log("countdown has passed, do nothing :)",totalSecond)
        }
    }
    update(dt: number) {
        
        this.count += dt
 
        if (this.count > this.refreshRate) {
            
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

                let hours = Math.floor(totalSecond / 3600) 
                let second_remain = totalSecond % 3600
                let mins = Math.floor(second_remain / 60)
                let secs = Math.floor(second_remain % 60)

                countDownInst.updateText(  digitFormat2Digit(hours) + ":" + digitFormat2Digit(mins) + ":" + digitFormat2Digit(secs) )

                //log(totalSecond, now, eventTime)
                //log("DIFF: ", digitFormat2Digit(hours), digitFormat2Digit(mins), digitFormat2Digit(secs))

            }
            if(activeCounter <= 0){
                log("countdown.no more counters, removing system")
                engine.removeSystem(this)
            }
        }
    }
}
//month is 0 based; 0 = January
//format is year,month,date,hours,minutes,seconds,ms - UTC ALWAYS
let eventTime0 = Date.UTC(2023, 3, 7, 12, 0, 0) //(Date.now() ) + (1) //Saturday, June 11, 2022 21:00:00 UTC 
log("counter",new Date(eventTime0),eventTime0-(Date.now()))
let eventTime1 = Date.UTC(2023, 3, 7, 14, 0, 0)
log("counter",new Date(eventTime1),eventTime1-(Date.now()))
let eventTime2 = Date.UTC(2023, 3, 7, 13, 0, 0)
log("counter",new Date(eventTime2),eventTime2-(Date.now()))
let eventTime3 = Date.UTC(2023, 3, 7, 12, 0, 0)
log("counter",new Date(eventTime3),eventTime3-(Date.now()))

const countdownSystem = new CountdownTimerSystem()
countdownSystem.addCounter(
    new CountdownBanner(
        "MetaMineS2",
        eventTime0
        , new Transform({
            position: new Vector3(baseX, baseY-3.5, baseZ),
            rotation: Quaternion.Euler(0,0,0),
            scale: new Vector3(0.7,0.7,0.7)})
    )
)

countdownSystem.addCounter(
    new CountdownBanner(
        "Premium Claim",
        eventTime1
        , new Transform({
            position: new Vector3(baseX, baseY-6.5, baseZ+12),
            rotation: Quaternion.Euler(0,0,0),
            scale: new Vector3(0.5,0.5,0.5)
        })
    )
)

countdownSystem.addCounter(
    new CountdownBanner(
        "Gold Claim",
        eventTime2
        , new Transform({
            position: new Vector3(baseX, baseY-6.5, baseZ+28.5),
            rotation: Quaternion.Euler(0,0,0),
            scale: new Vector3(0.5,0.5,0.5)
        })
    )
)

countdownSystem.addCounter(
    new CountdownBanner(
        "Silver Claim",
        eventTime3
        , new Transform({
            position: new Vector3(baseX, baseY-6.5, baseZ+55),
            rotation: Quaternion.Euler(0,0,0),
            scale: new Vector3(0.5,0.5,0.5)
        })
    )
)



log("countdown added")
engine.addSystem(
    countdownSystem
)

function digitFormat2Digit(val: number) {
    if (val > 9) {
        return val.toString()
    }
    else {
        return "0" + val.toString()
    }
}

/*
Input.instance.subscribe('BUTTON_DOWN', ActionButton.PRIMARY, false, (e) => {
    log(Camera.instance.position)
})
*/ 
