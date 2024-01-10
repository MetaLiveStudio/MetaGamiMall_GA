import { ColyseusCallbacksCollection,ColyseusCallbacksArray, ColyseusCallbacksMap, ColyseusCallbacksReferences } from "./client-colyseus-ext"
import * as serverStateSpec from "./MyRoomStateSpec"


export type PlayerMapState=ColyseusCallbacksMap<any,serverStateSpec.IPlayer> & Map<any,serverStateSpec.IPlayer> &{
}


export type Vector3State= ColyseusCallbacksReferences<serverStateSpec.Vector3State> & serverStateSpec.Vector3State & {
}
export type ITrackFeatureState = ColyseusCallbacksReferences<serverStateSpec.ITrackFeatureState> & serverStateSpec.ITrackFeatureState & {   
    //health:HealthDataState
}
export type ICostDataState = ColyseusCallbacksReferences<serverStateSpec.ICostDataState> & serverStateSpec.ICostDataState & {   
    //health:HealthDataState
}

export type LevelDataState = ColyseusCallbacksReferences<serverStateSpec.LevelDataState> & serverStateSpec.LevelDataState & {   
    trackFeatures?:ColyseusCallbacksMap<any,serverStateSpec.ITrackFeatureState> & Map<any,serverStateSpec.ITrackFeatureState>
}

export type CoinRoomState=ColyseusCallbacksReferences<serverStateSpec.CoinRoomState> & serverStateSpec.CoinRoomState & {
    players:PlayerMapState
    //battleData:BattleState
    //enrollment:EnrollmentState
    levelData:LevelDataState
}
type Vector3Type = serverStateSpec.Vector3State&{
    
}
export class Vector3StateSupport implements serverStateSpec.Vector3State{
    x:number
    y:number
    z:number
    
    constructor(x:number,y:number,z:number){
        this.x = x;
        this.y = y
        this.z = z
    }
    copyFrom(vec:Vector3Type){
        this.x = vec.x
        this.y = vec.y
        this.z = vec.z
    }
}
