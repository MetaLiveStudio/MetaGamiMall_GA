import { log } from "../../back-ports/backPorts"

export type IntervalUtilType = 'delta'|'abs-time'

export class IntervalUtil {
    type:IntervalUtilType = 'delta'
    elapsedTime: number
    targetTime: number
    lastUpdateTime:number
    onTargetTimeReached: () => void

    onTimeReachedCallback?: () => void

    /**
     * @param millisecs - amount of time in milliseconds
     * @param onTimeReachedCallback - callback for when time is reached
     */
    constructor( millisecs: number,type?:IntervalUtilType, onTimeReachedCallback?: () => void) {
        if(type) this.type = type
        this.elapsedTime = 0
        if(this.type == 'delta'){
            this.targetTime = millisecs / 1000
        }else{
            this.lastUpdateTime = Date.now()
            this.targetTime = millisecs
        }
        this.onTimeReachedCallback = onTimeReachedCallback
        this.onTargetTimeReached = () => {
            if (this.onTimeReachedCallback) this.onTimeReachedCallback()
            //debugger 
            this.elapsedTime = 0
            //this.elapsedTime -= this.targetTime //push back
        }
    }

    reset(){
        log("IntervalUtil.reset called","this.elapsedTime",this.elapsedTime,"this.lastUpdateTime",this.lastUpdateTime)
        //reset the values
        this.elapsedTime = 0
        if(this.type == 'delta'){
            this.lastUpdateTime = 0
        }else{
            this.lastUpdateTime = Date.now()
        }
    }
    setCallback(onTimeReachedCallback: () => void) {
        this.onTimeReachedCallback = onTimeReachedCallback
    }
    /**
     * 
     * @param dt 
     * @returns false if not hit interval, true if hit interval
     */
    update(dt?:number): boolean{
        const now = Date.now()
        if(this.type == 'delta'){
            this.elapsedTime += (dt ? dt : 0)
            //log("this.elapsedTime",this.elapsedTime.toFixed(3))
        }else{
            
            //real time
            this.elapsedTime += now - this.lastUpdateTime

            //log("this.elapsedTime",this.elapsedTime.toFixed(3))
        }

        this.lastUpdateTime = now

        if(this.elapsedTime > this.targetTime){
            this.onTargetTimeReached()
            //log("padLogic returning true",this.elapsedTime)
            return true
            //this.elapsedTime -= this.targetTime //push back
        }

        return false;
    }
    
}