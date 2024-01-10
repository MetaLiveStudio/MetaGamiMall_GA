//import { UserData } from "@decentraland/Players";
//import { CONFIG } from "src/config";
//import { GAME_STATE } from "src/state";
//import { getAndSetUserData, getAndSetUserDataIfNull, getUserDataFromLocal } from "src/userData";
//import { isNull } from "src/utils";
import resourcesDropin from "./resources-dropin";

import { executeTask } from "@dcl/sdk/ecs";
import { log } from "../back-ports/backPorts";
import { getAndSetUserDataIfNull } from "../userData";
import { GAME_STATE } from "../state";
import { CONFIG, SCENE_TYPE_GAMIMALL } from "../config";
import { UserData } from "~system/Players"
import { RealmInfo } from "~system/Runtime";

const CLASSNAME = "fetch-utils.ts"

  export type NftBalanceResponse = {
    balance?: number;
    owner?: string;
    queryTime?: number;
  };
  export type CheckMultiplierResultType={
    ok:boolean,
    msg:string,
    multiplier?:number
    debug:any
  }
  
  function isInvalidPublicKey(publicKey:string){
    return (publicKey === undefined || publicKey === null || publicKey == '' || publicKey == 'null')
  }
  export async function fetchMultiplier(realm?:RealmInfo|null){
    const METHOD_NAME = "fetchMultiplier";
    log(METHOD_NAME,"ENTRY")

    //const result = executeTask(async () => {
      let userData = await getAndSetUserDataIfNull();
      let bronzeShoeQty = 0
      if(GAME_STATE && GAME_STATE.playerState && GAME_STATE.playerState.playFabUserInfoHelper){
        const inv = GAME_STATE.playerState.playFabUserInfoHelper.inventory
        bronzeShoeQty = (inv ? inv.bronzeShoe : 0 ) + GAME_STATE.gameItemBronzeShoeValue + GAME_STATE.gameItemRewardBronzeShoeValue
      }
      let pairedDownCopy:UserData|undefined
      if(userData && userData !== null){
        //copy only what we need
        pairedDownCopy = {
          userId: userData.userId,
          publicKey: userData.publicKey,
          displayName: userData.displayName,
          hasConnectedWeb3: userData.hasConnectedWeb3,
          version: userData.version,
          avatar:{
            wearables: userData.avatar ? userData.avatar.wearables: [],
            bodyShape:"",
            eyeColor:"",
            hairColor:"",
            skinColor:"",
            snapshots:undefined
          }
        }//JSON.parse(JSON.stringify(userData))
      }
      
      //TODO send userData with it for end point to compute mulitplier by wearables on
      let wallet = userData !== null ? userData.publicKey : ""
      let response = null;
      //docs https://github.com/MetaLiveStudio/metadoge#apiwallet
      const callUrl =
        CONFIG.CHECK_MULTIPLIER_URL 
        + CONFIG.CHECK_MULTIPLIER_URL_OWNER_FIELD + wallet 
        + CONFIG.CHECK_MULTIPLIER_URL_BRONZE_SHOE_FIELD + bronzeShoeQty 
        + CONFIG.CHECK_MULTIPLIER_API_CALL_REALM_BASE_URL_FIELD + ((realm && realm.baseUrl) ? encodeURIComponent( realm.baseUrl ) : "")
        + CONFIG.CHECK_MULTIPLIER_URL_USERDATA_FIELD + encodeURIComponent(JSON.stringify( pairedDownCopy ) )
 
      try {
        log(METHOD_NAME," fetch.calling " , callUrl);
        response = await fetch(callUrl, {
          //headers: { "Content-Type": "application/json" },
          method: "GET",
          //body: JSON.stringify(myBody),
        });
        if (response.status == 200) {
          let json:CheckMultiplierResultType = await response.json() as CheckMultiplierResultType;

          //log(json)
          log(METHOD_NAME, " reponse ", json);
          return json;
        } else {
          let json = await response.json();
          //log("NFTRepository reponse " + response.status + " " + response.statusText)
          log(
            METHOD_NAME ,
              " error reponse to reach URL status:" +
              response.status +
              " text:" +
              response.statusText +
              " json:" +
              JSON.stringify(json)
          ); 
          //throw new Error(response.status + " " + response.statusText)
          const res:CheckMultiplierResultType={
            ok:false,msg:response.status + " " + response.statusText + " " + json,
            debug:undefined,multiplier:undefined
          }
          return res;
        }
      } catch (e) {
        log(METHOD_NAME, ".failed to reach URL " + e + " " + response);
        throw e;
      }
    //});

    //log(METHOD_NAME,"RETURN",result)

    //return result
}
  //if pass contractId it fetches actual price but can only do at a time
  export async function fetchNFTData(contractId?:string){
      const METHOD_NAME = "fetchNFTData";
      log(METHOD_NAME,"ENTRY",contractId)
      //const result = await executeTask(async () => {
        let response = null;
        //docs https://github.com/MetaLiveStudio/metadoge#apiwallet
        const callUrl =
          "https://www.metadoge.art/api/wallet?ownerAddress="+CONFIG.REWARD_SERVER_WAREHOUSE_WALLET+"&chain=137&withMetadata=false"
          + (contractId !== undefined && contractId !== '' ? "&contractAddress="+contractId : "")
          "&_unique=" +
          new Date().getTime();
   
        try {
          log(METHOD_NAME," fetch.calling " , callUrl);
          response = await fetch(callUrl, {
            //headers: { "Content-Type": "application/json" },
            method: "GET",
            //body: JSON.stringify(myBody),
          });
          if (response.status == 200) {
            let json = await response.json();
  
            //log(json)
            log(METHOD_NAME, " reponse ", json);
            return json;
          } else {
            let json = await response.json();
            //log("NFTRepository reponse " + response.status + " " + response.statusText)
            log(
              METHOD_NAME ,
                " error reponse to reach URL status:" +
                response.status +
                " text:" +
                response.statusText +
                " json:" +
                JSON.stringify(json)
            ); 
            //throw new Error(response.status + " " + response.statusText)
            return {
              errorMsg: response.status + " " + response.statusText + " " + json,
            };
          }
        } catch (e) {
          log(METHOD_NAME, ".failed to reach URL " + e + " " + response);
          throw e;
        }
      //});
  
      //log(METHOD_NAME,"RETURN",result)

      //return result
  }

  export function isOrderMarketResultValid(result:any){
    const valid = result && result.data //&& (result.success =="ok"||result.success ==true) && result.assets && result.assets.supplyNfts
    return valid;
  }

  //if pass contractId it fetches actual price but can only do at a time
  export async function fetchOrderMarketData(args:{contractId:string,itemId?:string,sortBy?:string,first?:number}){
    const METHOD_NAME = "fetchOrderMarketData";
    log(METHOD_NAME,"ENTRY",args)
    //const result = await executeTask(async () => {
      let response = null;
      const callUrl =
        "https://nft-api.decentraland.org/v1/orders?first=5&contractAddress=" + args.contractId + "&status=open&" +
          "itemId=" + (args.itemId ? args.itemId : 0) + "&sortBy=cheapest" +
          "&_unique=" + new Date().getTime();
 
      try {
        log(METHOD_NAME," fetch.calling " , callUrl);
        response = await fetch(callUrl, {
          //headers: { "Content-Type": "application/json" },
          method: "GET",
          //body: JSON.stringify(myBody),
        });
        if (response.status == 200) {
          let json = await response.json();

          //log(json)
          log(METHOD_NAME,callUrl, " reponse ", json);
          return json;
        } else {
          let json = await response.json();
          //log("NFTRepository reponse " + response.status + " " + response.statusText)
          log(
            METHOD_NAME ,
              " error reponse to reach URL status:" +
              response.status +
              " text:" +
              response.statusText +
              " json:" +
              JSON.stringify(json)
          ); 
          //throw new Error(response.status + " " + response.statusText)
          return {
            errorMsg: response.status + " " + response.statusText + " " + json,
          };
        }
      } catch (e) {
        log(METHOD_NAME, ".failed to reach URL " , callUrl , e ,response);
        throw e;
      }
    //});

    //log(METHOD_NAME,"RETURN",result)

    //return result
}
  export async function fetchColyseusInfo(){
    const METHOD_NAME = "fetchColyseusInfo";
    log(METHOD_NAME,"ENTRY")
    //const result = await executeTask(async () => {
      let response = null;
      
      //docs https://github.com/MetaLiveStudio/metadoge#apiwallet
      const callUrl =
        CONFIG.COLYSEUS_ENDPOINT_NON_LOCAL_HTTP + "/info"
          "&_unique=" +
          new Date().getTime();
 
      try {
        log(METHOD_NAME," fetch.calling " , callUrl);
        response = await fetch(callUrl, {
          //headers: { "Content-Type": "application/json" },
          method: "GET",
          //body: JSON.stringify(myBody),
        });
        if (response.status == 200) {
          let json = await response.json();

          //log(json)
          log(METHOD_NAME, " reponse ", json);
          return json;
        } else {
          try{
            let json = await response.json();
            //log("NFTRepository reponse " + response.status + " " + response.statusText)
            log(
              METHOD_NAME ,
                " error reponse to reach URL status:" +
                response.status +
                " text:" +
                response.statusText +
                " json:" +
                JSON.stringify(json)
            ); 
            //throw new Error(response.status + " " + response.statusText)
            return {
              ok: false,
              errorMsg: response.status + " " + response.statusText + " " + json,
            };
          }catch(e){
            log(METHOD_NAME, ".failed to parse response " + e);
            
            return {
              ok: false,
              errorMsg: "Failed to parse json response",
              error: e
            };
          }
        }
      } catch (e) {
        log(METHOD_NAME, ".failed to reach URL " + e + " " + response);
        throw e;
      }
    //});

}
  export function isNFTResultValid(result:any){
    const valid = result && result.success && (result.success =="ok"||result.success ==true) && result.assets && result.assets.supplyNfts
    return valid;
  }
  
  export async function updateStoreNFTCounts(){
    const METHOD_NAME = "updateStoreNFTCounts()"
    log(CLASSNAME,METHOD_NAME,"ENTRY");
    if(CONFIG.SCENE_TYPE !== SCENE_TYPE_GAMIMALL){
      log(CLASSNAME,METHOD_NAME,"DISABLED FOR SCENE TYPE",CONFIG.SCENE_TYPE)
      return
    }
    const result = await fetchNFTData()

    //https://www.metadoge.art/api/wallet?ownerAddress=0x00512814cC77feb2855f842484E0f54F890AA554&contractAddress=0x879051feb8c2e0169ffae9e66b022e7136870574&chain=137
    //update the qty
    if( isNFTResultValid( result )){ 
      for(const r in result.assets.supplyNfts){
        const newValItm = result.assets.supplyNfts[r]
        const newValAddress = newValItm.contract ? (newValItm.contract+"").toLowerCase() : undefined
        const newValAmount = newValItm.count
        //const newCosts = newValItm.costs

        let found = false
        

        if(newValAddress){
          for(const p in resourcesDropin.wearables){
            const itm = resourcesDropin.wearables[p]
            if(newValAddress == itm.contract.toLowerCase()){
              found = true
              if(itm.options.nftUIData){
                log(METHOD_NAME,"FOUND",itm.contract,"updating amount from",itm.options.nftUIData.qtyCurrent,"newValAmount",newValAmount)  
                itm.options.nftUIData.qtyCurrent = newValAmount
              }else{
                log(METHOD_NAME,"FOUND",itm.contract," ERROR, has no nftUIData",itm.options.nftUIData,"newValAmount",newValAmount)  
              }
              break;
            }
          }
          if(!found){
            log(METHOD_NAME,"WARNING. FAILED TO FIND",newValAddress," not updating count")  
          }
        }
      }
    }else{
      log(METHOD_NAME,"unable to update counts",result)
    }
    
  }

/*
  //https://us-central1-sandbox-query-blockchain.cloudfunctions.net/blockChainQueryApp/hello-world
  const customBaseUrl =
    "https://us-central1-sandbox-query-blockchain.cloudfunctions.net";
  export async function getHelmetBalance(
    profile: string,
    version: string,
    ownerAddress?: string | null
  ): Promise<NftBalanceResponse> {
    const METHOD_NAME = "getHelmetBalance";
    const resultPromise = executeTask(async () => {
      let response = null;
      //https://us-central1-sandbox-query-blockchain.cloudfunctions.net/blockChainQueryApp/get-account-nft-balance?network=
      //https://us-central1-sandbox-query-blockchain.cloudfunctions.net/blockChainQueryApp/get-account-nft-balance?network=matic&ownerAddress=0xbd5b79D53D75497673e699A571AFA85492a2cc74&limit=9&logLevel=debug&storage=cacheX&multiCall=true&contractId=dcl-mtdgpnks
      const callUrl =
        customBaseUrl +
        "/blockChainQueryApp/get-account-nft-balance?" +
        //const callUrl= customBaseUrl + '/blockChainQueryApp/hello-world?'
        "&network=" +
        "matic" +
        "&limit=" +
        10 +
        "&contractId=" +
        "dcl-mtdgpnks" +
        "&profile=" +
        profile +
        "&version=" +
        version +
        "&ownerAddress=" +
        ownerAddress +
        "&_unique=" +
        new Date().getTime();

      try {
        log(METHOD_NAME + " fetch.calling " + callUrl);
        response = await fetch(callUrl, {
          //headers: { "Content-Type": "application/json" },
          method: "GET",
          //body: JSON.stringify(myBody),
        });
        if (response.status == 200) {
          let json = await response.json();

          //log(json)
          log(METHOD_NAME + " reponse ", json);
          return json;
        } else {
          let json = await response.json();
          //log("NFTRepository reponse " + response.status + " " + response.statusText)
          log(
            METHOD_NAME +
              " error reponse to reach URL status:" +
              response.status +
              " text:" +
              response.statusText +
              " json:" +
              JSON.stringify(json)
          );
          //throw new Error(response.status + " " + response.statusText)
          return {
            errorMsg: response.status + " " + response.statusText + " " + json,
          };
        }
      } catch (e) {
        log(METHOD_NAME + ".failed to reach URL " + e + " " + response);
        throw e;
      }
    });

    return resultPromise;
  }*/

  /*
  const subMethodPublicKeyPromise = "XXpublicKeyPromise: ";

  let publicKey: string | null = null;
  
  const publicKeyRequest = executeTask(async () => {
    await getAndSetUserData();

    const userData = getUserDataFromLocal();
    let publicKey = null;
    if (userData !== null) {
      publicKey = userData.publicKey;
    }
    log(
      subMethodPublicKeyPromise + " publicKeyRequest response " + publicKey,
      userData
    );

    return publicKey;
  })
    .catch(function (error) {
      log(subMethodPublicKeyPromise + " failed getting public key " + error);
      publicKey = "error";
      return null;
    })
    .then(function (value: string | null) {
      if (value !== null) {
        publicKey = value;
      } else {
        publicKey = "";
      }
      log(
        subMethodPublicKeyPromise + "got and setting public key " + publicKey,
        null
      );
      const retValBlank = isNull(publicKey) || publicKey == "";
      if (retValBlank) {
        log(
          subMethodPublicKeyPromise +
            "MISSING public key " +
            publicKey +
            " exiting",
          null
        );
      }
      //START GET HELMET COUNT

    });*/