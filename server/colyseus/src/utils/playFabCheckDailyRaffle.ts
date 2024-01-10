import * as PlayFabHelper from "../mall_rooms/PlayFabWrapper";

//export const PLAYER_DATA_CACHE: Record<string,UserData|null> = {}
import { PlayFab,PlayFabAdmin,PlayFabAuthentication, PlayFabServer } from "playfab-sdk";

import { CONFIG } from "../mall_rooms/config";
import { preventConcurrentExecution } from "./utils";
import { IntervalUtil } from "./interval-util";

//holds a cache of playFabUserInfo values
//to reduce need to parse if/when unclear populated
export type StatVersionCheckResult={
  fetchTime:number,
  result:PlayFabServerModels.GetPlayerStatisticVersionsResult,
  usedCache:boolean
}

const checkInterval = new IntervalUtil(30000,'abs-time')
let lastResult:StatVersionCheckResult|undefined = undefined

const CLASSNAME ='playFabCheckDailyRaffle'

export function isTimeToCheckStatVersion(){
  if(!checkInterval.update()){
    //not ready t
    console.log(CLASSNAME,"_getLatestStatVersionsAsync","not ready to check yet. skipping")
    return false;
  }
  return true
}

const _getLatestStatVersionsAsync = preventConcurrentExecution("_getLatestStatVersionsAsync", async () => {
  
  if(!isTimeToCheckStatVersion()){
    if(lastResult){
      lastResult.usedCache = true
    }
    return lastResult;
  }

  const result:PlayFabServerModels.GetPlayerStatisticVersionsResult = await PlayFabHelper.GetPlayerStatisticVersions({StatisticName:'raffle_coin_bag'})

  const retVal:StatVersionCheckResult = {
    fetchTime: Date.now(),
    result: result,
    usedCache: false
  }

  console.log(CLASSNAME,"getLatestStatVersionsAsync fetched latest ", retVal);

  lastResult = retVal

  return retVal;
});

export function getLatestStatVersionsAsyncRaffle(callback?:{onSuccess:()=>void,onFailure:(e:any)=>void}): Promise<StatVersionCheckResult> {
  const promise: Promise<StatVersionCheckResult> = new Promise(async (resolve, reject) => {
    let loginRes: StatVersionCheckResult;
    try {
      loginRes = await _getLatestStatVersionsAsync();
      resolve(loginRes);
    } catch (e) {
      console.log(CLASSNAME,"getLatestStatVersionsAsyncRaffle failed ", e);
      //if (CONFIG.ENABLE_DEBUGGER_BREAK_POINTS) debugger;
      reject(e);
    }
  });
  //if doLoginFlowAsync is preventConcurrentExecution wrapped
  //confirmed that if it returns the same promise or a new one
  //promise.then just adds more to the callback so all callers
  //will get their callbacks ran
  promise.then(() => {
    if (callback && callback.onSuccess) {
      console.log(CLASSNAME,"getLatestStatVersionsAsyncRaffle calling callback. onSuccess");
      callback.onSuccess();
    } else {
      console.log(CLASSNAME,"getLatestStatVersionsAsyncRaffle success,no callback. onSuccess");
    }
    //not clear why catch here works but not when post returning the promise????
  }).catch((e) => {
    if (callback && callback.onFailure) {
      callback.onFailure(e)
    }
    console.log(CLASSNAME,"getLatestStatVersionsAsyncRaffle REJECTED :(",e);
  });;
  return promise;
}