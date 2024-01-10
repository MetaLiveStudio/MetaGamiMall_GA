
//import { GAME_STATE } from 'src/state'

import { EnvironmentRealm, getCurrentRealm } from "~system/EnvironmentApi"
import { UserData } from "~system/Players"
import { RealmInfo, getRealm } from "~system/Runtime"
import { GetUserDataResponse, getUserData } from "~system/UserIdentity"
import { GAME_STATE } from "./state"
import { log } from "./back-ports/backPorts"

//TODO MOVE TO GAME STATE
let userData: UserData
let playerRealm: RealmInfo//EnvironmentRealm

export function initUserData(){
  
}
export async function getAndSetUserDataIfNull(){
  if (!getUserDataFromLocal()) {
    await getAndSetUserData(); //not calling await, hoping its fast
  }
  return  GAME_STATE.playerState.dclUserData
}
export async function getAndSetRealmDataIfNull() {
  if (!getRealmDataFromLocal()) {
    await setRealm(); //not calling await, hoping its fast
  }
  return GAME_STATE.playerState.dclUserRealm
}
export function getAndSetUserDataIfNullNoWait(){
  if(!getUserDataFromLocal()){
      getAndSetUserData() //not calling await, hoping its fast
  }
  return getUserDataFromLocal()
}

export function getUserDataFromLocal():UserData|null {
  return userData
}
export function getRealmDataFromLocal():RealmInfo|null {
  return playerRealm
}


export async function getAndSetUserData() {
  
  const data = await getUserData({})
  
  if (data && data.data) {
    log("getAndSetUserDataIfNullNoWait.yyy",data,data)
    
    userData = data.data
    GAME_STATE.playerState.setDclUserData( userData )
  }
  return userData
}

export function getAndSetUserDataSync() {
  const data = getUserData({})

  data.then((userData:GetUserDataResponse)=>{
    if (userData && userData.data) {
      log(userData.data.publicKey);
      GAME_STATE.playerState.setDclUserData(userData.data);
    }
  })
  
  return data
}

// fetch the player's realm
export async function setRealm() {
  //TODO FIXME USE getRealm instead, getCurrentRealm is deprecated
  let realm = await getRealm({})//getCurrentRealm({})
  //getRealm()
  if (realm && realm.realmInfo) {

//old
//You are in the realm: {"domain":"https://127.0.0.1","layer":"","room":"","serverName":"LocalPreview","displayName":"LocalPreview","protocol":"v3"}
//new
//domain => baseUrl
//room => realmName
//You are in the realm: {"baseUrl":"https://127.0.0.1","realmName":"LocalPreview","networkId":0,"commsAdapter":"ws-room:ws://127.0.0.1:8001/mini-comms/room-1","isPreview":true}
    console.log(`You are in the realm: ${JSON.stringify(realm.realmInfo)}`)
    
    playerRealm = realm.realmInfo
    GAME_STATE.playerState.setDclUserRealm( playerRealm )
  }
}
/*
onRealmChangedObservable.add(async (realmData) => {
  if (realmData && realmData.room) {
    log('PLAYER CHANGED ISLAND TO ', realmData.room)
    //myConnectSystem.connected = true
    //log('CONNECTING TO WS SERVER')
    GAME_STATE.playerState.setDclUserRealm( {...realmData,layer:''} )
  }
})*/