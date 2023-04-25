////////////////////////////////////////////
// MetaViuAds
// v1.02
////////////////////////////////////////////
import { Spawner } from 'node_modules/decentraland-builder-scripts/spawner'
import MetaViuBillboard, {MetaViuBillboardEvent} from "./MetaViuBillboard"

@EventConstructor()
export class MetaViuEvent {
    constructor(public type:string, public data:any) {}
}


export class MetaViuAd{
    listeners:EventManager[]=[]
    eventManager?:EventManager

    constructor(
        type:string,
        id:number,
        parent:Entity|null,
        x:number,
        y:number,
        z:number,
        rX:number,
        rY:number,
        rZ:number,
        sX:number,
        sY:number,
        sZ:number,
        listener:EventManager=null
    ) {
        if (listener) {
            this.listeners.push(listener)
            this.eventManager = new EventManager()
            this.eventManager.addListener(MetaViuBillboardEvent,null,({type,data})=>{
                log("\n*** MetaViuAds.fireEvents")
                this.fireEvents(type,data)
            })
        }
        let metaViuAd = new MetaViuBillboard(type, id, this.eventManager)
        let spawner = new Spawner(metaViuAd)
        spawner.spawn(
            'metaViuAd',
            new Transform({
                position: new Vector3(x,y,z),
                rotation: Quaternion.Euler(rX,rY,rZ),
                scale: new Vector3(sX,sY,sZ),
            })
        )
    }
    fireEvents(type:string, data:any) { // CF added
        for (let listener of this.listeners) {
            listener.fireEvent(new MetaViuEvent(type, data))
        }
    }
}

  