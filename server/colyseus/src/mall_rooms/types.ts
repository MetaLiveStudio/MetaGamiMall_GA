import { UserData } from "../racing_room/state/server-state";
import { Player } from "./MyRoomState";
import * as PlayFabHelper from "./PlayFabWrapper";
import * as serverStateSpec from "./MyRoomStateSpec";

//data we do not want visible client side
export type PlayerServerSideData={
  playFabData:{
    id:string
    sessionTicket:string
  }
  dclUserData:UserData
  playFabCombinedInfoResult:PlayFabServerModels.GetPlayerCombinedInfoResult
  sessionId:string
  endGameResult?: PlayFabHelper.GameEndResultType
  coinMultiplier:number
  playerTransform: serverStateSpec.PlayerTransformState
  realmInfo: serverStateSpec.RealmInfo
}

export type PlayerData={
  serverSide:PlayerServerSideData,
  clientSide:Player
}

export type GameEndType = {
  timedOut:boolean
}
