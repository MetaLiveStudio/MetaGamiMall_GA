import { Player } from "./MyRoomState";
import * as PlayFabHelper from "./PlayFabWrapper";


//data we do not want visible client side
export type PlayerServerSideData={
  playFabData:{
    id:string
    sessionTicket:string
  }
  sessionId:string
  endGameResult?: PlayFabHelper.GameEndResultType
  coinMultiplier:number
}

export type PlayerData={
  serverSide:PlayerServerSideData,
  clientSide:Player
}

export type GameEndType = {
  timedOut:boolean
}
