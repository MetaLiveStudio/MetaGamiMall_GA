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


function isInvalidPublicKey(publicKey:string){
  return (publicKey === undefined || publicKey === null || publicKey == '' || publicKey == 'null')
}

/*
Cyber series: upper, lower, mask and wings:
https://market.decentraland.org/contracts/0xcf4525ccbaa3469ef26b0db8777a8294cf844f44/items/0
https://market.decentraland.org/contracts/0xd3359070df7037c56ce49f0987464153b8f4968d/items/0
https://market.decentraland.org/contracts/0x199c20d3cd178abd23e3e62c91cfce5aeb1ff52f/tokens/57
https://market.decentraland.org/contracts/0xac852e781cc7f4fc759ebb384638ad99075420b0/tokens/90 
*/
export function nftMetaDogeCheckCall(publicKey:string){
    const nftCheckPromise = new Promise((mainResolve, reject) => {
      //console.log("nftMetaDogeCheckCall entered promise")
      (async () => {
        if( isInvalidPublicKey(publicKey) ){
          const retData = {
            error: 'Missing or invalid params',
            assets: ([] as any[]),
            count: 0,
            params: {
              ownerAddress: 'null',
              //contractAddress: '0x1acF970cf09a6C9dC5c5d7F2ffad9b1F05e4f7a8'
            }
          }
          console.log("nftMetaDogeCheckCall.ERROR publicKey was empty. returning now",retData)

          mainResolve(retData)
          return retData
        }
        const nftURL = CONFIG.CONTRACT_3D_API_CALL + CONFIG.CONTRACT_OWNER_FIELD + publicKey
        try {
          console.log("nftMetaDogeCheckCall calling",nftURL)
          let nftResponse = await fetch(nftURL, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            //body: body,
            //   identity: myIdentity,
          })
      
          //let rewardsResponseData: RewardData = await rewardsResponse.json()
          let nftResponseData = await nftResponse.json()
      
          console.log('NFT RESPONSE: ', nftResponseData)
      
  
          mainResolve(nftResponseData)
          return nftResponseData
        } catch (error) {
          console.log('ERROR FETCHING FROM ', nftURL, error)
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
//https://us-central1-sandbox-query-blockchain.cloudfunctions.net/blockChainQueryApp/get-account-nft-balance?network=matic&ownerAddress=0xbd5b79D53D75497673e699A571AFA85492a2cc74&limit=1&logLevel=debug&storage=cacheX&multiCall=true&contractId=dcl-mtdgpnks
export function nftDogeHeadCheckCall(publicKey:string){
  const nftCheckPromise = new Promise((mainResolve, reject) => {
    //console.log("nftCheck entered promise")
    (async () => {
      if( isInvalidPublicKey(publicKey) ){
        const retData = {
          "balance": "0",
          "owner": publicKey,
          "contract": {
          "address": "0x47f8b9b9ec0f676b45513c21db7777ad7bfedb35",
          "id": "dcl-mtdgpnks"
          },
          "queryTime": -1
          }
        console.log("nftDogeHeadCheckCall.ERROR publicKey was empty. returning now",retData)

        mainResolve(retData)
        return retData
      }
      const nftURL = CONFIG.CONTRACT_DOGE_HEAD_API_CALL + CONFIG.CONTRACT_OWNER_FIELD + publicKey
      try {
        console.log("nftDogeHeadCheckCall calling",nftURL)
        let nftResponse = await fetch(nftURL, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          //body: body,
          //   identity: myIdentity,
        })
    
        //let rewardsResponseData: RewardData = await rewardsResponse.json()
        let nftResponseData = await nftResponse.json()
    
        console.log('NFT RESPONSE: ', nftResponseData)
    

        mainResolve(nftResponseData)
        return nftResponseData
      } catch (error) {
        console.log('ERROR FETCHING FROM ', nftURL, error)
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

export function nftCheckMultiplier(nftResponseData:any){
  
    const nftTypes:string[] = []
    if(nftResponseData && nftResponseData.assets){
      for(const p in nftResponseData.assets){
        const nft = nftResponseData.assets[p]
        if(!nft.attributes) continue
        for(const q in nft.attributes){
          const attrs = nft.attributes[q]
          if( attrs.trait_type && attrs.trait_type =='Type' ){
              nftTypes.push( attrs.value )
              break
          }
        }
      }
    }
    let multiplier = 1
    for(const p in nftTypes){
      const lowerVal = nftTypes[p].toLowerCase()
      //i dont know exact values so guessing
      if(lowerVal.indexOf("lil") >=0){
        multiplier = Math.max(multiplier,CONFIG.COIN_MULTIPLIER_LILDOGE)
      }else if(lowerVal.indexOf("bro") >=0){
        multiplier = Math.max(multiplier,CONFIG.COIN_MULTIPLIER_DOGE_BRO)
      }else if(lowerVal.indexOf("moon") >=0){
        multiplier = Math.max(multiplier,CONFIG.COIN_MULTIPLIER_MOON_DOGE)
      }else if(lowerVal.indexOf("mars") >=0){
        multiplier = Math.max(multiplier,CONFIG.COIN_MULTIPLIER_MARS_DOGE)
      }else if(lowerVal.indexOf("god") >=0){
        multiplier = Math.max(multiplier,CONFIG.COIN_MULTIPLIER_DOGE_GOD)
      }
    }
  
    console.log("nftTypes",nftTypes)
  
    //retData.nftData = nftResponseData
    return multiplier
}


export function nftCheckDogeHeadMultiplier(nftResponseData:any){
  
  let balance = 0
  if(nftResponseData && nftResponseData.balance && nftResponseData.balance !== undefined){
    balance = nftResponseData.balance
  }
  let multiplier = 1
  
  console.log("nftCheckDogeHeadMultiplier.balance",balance)

  if(balance > 0){
    multiplier = Math.max(multiplier,CONFIG.COIN_MULTIPLIER_DOGE_HEAD)
  }

  //retData.nftData = nftResponseData
  return multiplier
}

export function wearablesByOwnerToStringUrlArray(roomId:string,wearables:WearablesByOwnerData):string[]{
  const result:string[] = []

  for(const p in wearables){
    result.push( wearables[p].urn )
  }

  return result;
}

export function fetchProfile(roomId:string,publicKey:string):Promise<UserData>{
  const METHOD_NAME = "fetchProfile"
  //publicKey = "0x56469159D91eb810dCE34dd13eC4eD8194bCA7be"
  logEntry(CLASSNAME,roomId,METHOD_NAME, [roomId,publicKey]);
    const nftCheckPromise = new Promise<UserData>((mainResolve, reject) => {
      //console.log("nftMetaDogeCheckCall entered promise")
      (async () => {
        if( isInvalidPublicKey(publicKey) ){
          const retData:UserData = {
            publicKey:publicKey,
            avatar:{wearables:[]}
          }
          
          log(CLASSNAME,roomId,METHOD_NAME," ERROR","publicKey was empty. returning empty array",retData)

          mainResolve(retData)
          return retData
        }
        const nftURL = 
          //CONFIG.LAMBDA_WEARABLES_BY_OWNER_ENDPOINT 
          //"https://peer.decentraland.org/lambdas/collections/wearables-by-owner/"+ publicKey
          "https://peer.decentraland.org/lambdas/profiles/" + publicKey
        try {
          log(CLASSNAME,roomId,METHOD_NAME," calling",nftURL)
          let nftResponse = await fetch(nftURL, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            //body: body,
            //   identity: myIdentity,
          })
      
          //let rewardsResponseData: RewardData = await rewardsResponse.json()
          let nftResponseData:UserDataList = await nftResponse.json() as UserDataList
      
          log(CLASSNAME,roomId,METHOD_NAME,'nft response: ', nftResponseData)
          //log(CLASSNAME,roomId,METHOD_NAME,'nft response.avatar: ', nftResponseData.avatars[0].avatar.wearables)
      
          mainResolve(nftResponseData.avatars[0])
          return nftResponseData
        } catch (error) {
          const retData:UserData = {
            publicKey:publicKey,
            avatar:{wearables:[]}
          }
          log(CLASSNAME,roomId,METHOD_NAME," ERROR FETCHING FROM",nftURL,error,"publicKey was empty. returning empty array",retData)
          mainResolve(retData)
          return retData
        }
      })()
    })
    return nftCheckPromise
}


//{"ok":true,"msg":"success","multiplier":1.1,"debug":{"nftCheckMultiplier":1,"nftCheckDogeHeadMultiplier":1.02,"nftCheckWearablesMultiplier":1.1}}
export type CheckMultiplierResultType={
  ok:boolean,
  msg:string,
  multiplier:number
  debug:any
}
export function checkMultiplier(roomId:string,publicKey:string):Promise<CheckMultiplierResultType>{
  const METHOD_NAME = "checkMultiplier"
  //publicKey = "0xbd5b79D53D75497673e699A571AFA85492a2cc74"
  logEntry(CLASSNAME,roomId,METHOD_NAME, [roomId,publicKey]);
    const nftCheckPromise = new Promise<CheckMultiplierResultType>((mainResolve, reject) => {
      //console.log("nftMetaDogeCheckCall entered promise")
      (async () => {
        if( isInvalidPublicKey(publicKey) ){
          const retData:any = {"ok":false,"msg":"invalid key"}
          
          log(CLASSNAME,roomId,METHOD_NAME," ERROR","publicKey was empty. returning empty array",retData)

          mainResolve(retData)
          return retData
        }
        const nftURL = 
          CONFIG.CHECK_MULTIPLIER_API_CALL + CONFIG.CHECK_MULTIPLIER_API_CALL_OWNER_FIELD + publicKey
        try {
          log(CLASSNAME,roomId,METHOD_NAME," calling",nftURL)
          let nftResponse = await fetch(nftURL, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            //body: body,
            //   identity: myIdentity,
          })
      
          //let rewardsResponseData: RewardData = await rewardsResponse.json()
          let nftResponseData = await nftResponse.json()// as WearablesByOwnerData
      
          log(CLASSNAME,roomId,METHOD_NAME,'nft response: ', nftResponseData)
      
          mainResolve(nftResponseData)
          return nftResponseData
        } catch (error) {
          const retData:any = {"ok":false,"msg":error}
          log(CLASSNAME,roomId,METHOD_NAME," ERROR FETCHING FROM",nftURL,error,"publicKey was empty. returning empty array",retData)
          mainResolve(retData)
          return retData
        }
      })()
    })
    return nftCheckPromise
}
export function fetchWearablesByOwner(roomId:string,publicKey:string):Promise<WearablesByOwnerData>{
  const METHOD_NAME = "fetchWearablesByOwner"
  //publicKey = "0xbd5b79D53D75497673e699A571AFA85492a2cc74"
  logEntry(CLASSNAME,roomId,METHOD_NAME, [roomId,publicKey]);
    const nftCheckPromise = new Promise<WearablesByOwnerData>((mainResolve, reject) => {
      //console.log("nftMetaDogeCheckCall entered promise")
      (async () => {
        if( isInvalidPublicKey(publicKey) ){
          const retData:WearablesByOwnerData = []
          
          log(CLASSNAME,roomId,METHOD_NAME," ERROR","publicKey was empty. returning empty array",retData)

          mainResolve(retData)
          return retData
        }
        const nftURL = 
          //CONFIG.LAMBDA_WEARABLES_BY_OWNER_ENDPOINT 
          "https://peer.decentraland.org/lambdas/collections/wearables-by-owner/"+ publicKey
        try {
          log(CLASSNAME,roomId,METHOD_NAME," calling",nftURL)
          let nftResponse = await fetch(nftURL, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            //body: body,
            //   identity: myIdentity,
          })
      
          //let rewardsResponseData: RewardData = await rewardsResponse.json()
          let nftResponseData = await nftResponse.json() as WearablesByOwnerData
      
          log(CLASSNAME,roomId,METHOD_NAME,'nft response: ', nftResponseData)
      
          mainResolve(nftResponseData)
          return nftResponseData
        } catch (error) {
          const retData:WearablesByOwnerData = []
          log(CLASSNAME,roomId,METHOD_NAME," ERROR FETCHING FROM",nftURL,error,"publicKey was empty. returning empty array",retData)
          mainResolve(retData)
          return retData
        }
      })()
    })
    return nftCheckPromise
}
export function initPlayerStateNftOwnership(player:PlayerState){
  player.userPrivateData.nftOwnership = new NFTOwnership()
  player.userPrivateData.nftOwnership.setUserData({
      avatar:{
          wearables: []
      }
  })
}
export function fetchWearableData(roomId:string,userId:string){
  const METHOD_NAME = "fetchWearableData()"
  //logEntry(CLASSNAME,this.roomId,METHOD_NAME, [userId]);

  const nftCheckPromise = new Promise<WearablesByOwnerData>((mainResolve, reject) => {
      (async () => {
          await fetchWearablesByOwner(roomId,userId).then((val:WearablesByOwnerData)=>{
              //player.userPrivateData.wearables = val
              //player.userPrivateData.nftOwnership.userData.avatar.wearables = wearablesByOwnerToStringUrlArray(roomId,val) 


              mainResolve(val)
          })
      })()
  })

  return nftCheckPromise
}
