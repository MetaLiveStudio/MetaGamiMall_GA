import * as serverStateSpec from "src/gamimall/state/MyRoomStateSpec";
import { notNull } from "src/utils";


export function getCostById(cost: serverStateSpec.CostData[],id: string){
    if(cost !== undefined){
        for(const p in cost){
            const c = cost[p]
            if(c.id === id){
                return c
            }
        }
    }
}

export function costToMapById(cost: serverStateSpec.CostData[]):Map<string,serverStateSpec.CostData>{
    const map:Map<string,serverStateSpec.CostData> = new Map()
    if(cost !== undefined){
        for(const p in cost){
            const c = cost[p]
            map.set(c.id,c)
        }
    }
    return map
}
export function costToRecordById(cost: serverStateSpec.CostData[]):Record<string,serverStateSpec.CostData>{
    const rec:Record<string,serverStateSpec.CostData> = {}
    if(cost !== undefined){
        for(const p in cost){
            const c = cost[p]
            rec[c.id] = c
        }
    }
    return rec
}

export function get2dUICostFormat(cost: serverStateSpec.CostData[], id: string,prefix:string,theDefault:string): string {
  if(cost !== undefined){
    const c = getCostById(cost,id)
      
    if(notNull(c)){
        return prefix + c.amount
    }
  }
  return theDefault
}

