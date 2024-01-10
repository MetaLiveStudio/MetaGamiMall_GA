import fetch from 'decentraland-crypto-fetch'
import { CONFIG } from "../mall_rooms/config"
import { Player } from '../mall_rooms/MyRoomState';
import { PlayerState, UserData, UserDataList, WearablesByOwnerData } from '../racing_room/state/server-state'
import { NFTOwnership } from './nftOwnership'


function logEntry(
  classname: string,
  roomId: string,
  method: string,
  params?: any
) {
  console.log(classname, roomId, method, " ENTRY", params);
}
function log(
  classname: string,
  roomId: string,
  method: string,
  msg?: string,
  ...args: any[]
) {
  console.log(classname, roomId, method, msg, ...args);
}

const CLASSNAME = "nftCheck.ts";


//TODO https://dmitripavlutin.com/timeout-fetch-request/ add timeout call


export function giveOutRewards(raffleName:string,version:number){
    console.log('giveOutRewards SYNC RESPONSE: ', raffleName,version)

    //FIXME need to prevent ALL rooms from subscribing, need 1 subscribe for this?
    //stub left over, been moved to event based listener, no need to call this anymore

    if(true){
      return new Promise((mainResolve, reject) => {
        const failure = {success:false
          ,"msg":"stubbed response. giveOutRewards is now event based from "+
          "playfab.events.webhooks calling firebase directly, no need to call this anymore by colyseus"}
        mainResolve(failure)
      })
    }

    const nftCheckPromise = new Promise((mainResolve, reject) => {
      //console.log("nftMetaDogeCheckCall entered promise")
      (async () => {
        
        const nftURL = CONFIG.RAFFLE_SYNC_DATA_API_CALL+"?raffleName="+raffleName
        const pickWinnerURL = CONFIG.RAFFLE_PICK_WINNER_API_CALL+"?raffleName="+raffleName+"&version="+version
        let urlCalledLast = nftURL
        let lastResponse = ""
        try {
          console.log("giveOutRewards calling",nftURL)
          let nftResponse = await fetch(nftURL, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            //body: body,
            //   identity: myIdentity,
          })
      
          //let rewardsResponseData: RewardData = await rewardsResponse.json()
          let nftResponseData = await nftResponse.text()
          lastResponse = nftResponseData

          console.log('giveOutRewards SYNC RESPONSE: ', nftResponseData)
      
          console.log("giveOutRewards calling",pickWinnerURL)

          urlCalledLast = pickWinnerURL

          let pickWinnerResp = await fetch(pickWinnerURL, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            //body: body,
            //   identity: myIdentity,
          })
      
          let pickWinnerDataStr = await pickWinnerResp.text()
          lastResponse = pickWinnerDataStr
          //let rewardsResponseData: RewardData = await rewardsResponse.json()
          let pickWinnerData = JSON.stringify(pickWinnerDataStr)
      
          console.log('giveOutRewards PICK WINNER RESPONSE: ', pickWinnerData)
      
          
          mainResolve(pickWinnerData)
          return pickWinnerData
        } catch (error) {
          //env miss match possibly
          console.log('ERROR FETCHING FROM . FIXME IF LOCAL IS CALLING PROD THIS WAS WHY. NEED TO FIX:','url:', urlCalledLast, "lastResponse",lastResponse,"error", error)
          console.log('ERROR FETCHING FROM .', nftURL, error)
          //reject(error)
          //still return, just wont add multiplier
          const failure = {success:false}
          mainResolve(failure)
          return failure
        }
      })()
    })
    return nftCheckPromise
}