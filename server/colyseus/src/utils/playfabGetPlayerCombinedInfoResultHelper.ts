
//export const PLAYER_DATA_CACHE: Record<string,UserData|null> = {}
import { PlayFab,PlayFabAdmin,PlayFabAuthentication, PlayFabServer,PlayFabClient } from "playfab-sdk";

import { CONFIG } from "../mall_rooms/config";

//holds a cache of playFabUserInfo values
//to reduce need to parse if/when unclear populated

function firstNotNull(v1:number,v2:number){
  if(v1 !== undefined && v1 !== null){
    return v1;
  }
  return v2
}

type StatsCache={
  allTimeCoins:number
  dailyCoins:number
  raffleCoinBag:number
}
type VirtualCurrencyCache={
  gc:number
  mc:number

  vb:number
  ac:number
  zc:number
  rc:number

  m1:number
  m2:number
  m3:number
  bp:number
  ni:number
  bz:number
  r1:number
  r2:number
  r3:number
}

type CatalogItemCache={
  bronzeShoe:number
  ticketRaffleCoinBag:number
  coinBagRaffleRedeem:number
}


export class GetPlayerCombinedInfoResultHelper{
  virtualCurrency: VirtualCurrencyCache
  inventory: CatalogItemCache
  stats: StatsCache
  constructor(){
    this.reset()
  }
  reset(){
    this.virtualCurrency = {
      gc:0,
      mc:0,
      vb:0,
      ac:0,
      zc:0,
      rc:0,
      m1:0,
      m2:0,
      m3:0,
      bp:0,
      ni:0,
      bz:0,
      r1:0,
      r2:0,
      r3:0
    }
    this.inventory = {
      bronzeShoe:0,
      ticketRaffleCoinBag:0,
      coinBagRaffleRedeem:0
    }
    this.stats = {
      allTimeCoins:0,
      dailyCoins:0,
      raffleCoinBag:0
    }
  }
  update(playFabUserInfo: PlayFabClientModels.GetPlayerCombinedInfoResultPayload | undefined | null){
    
    let mc = -1;
    let gc = -1;
    let vb = -1;

    //let vb=-1
    let ac=-1
    let zc=-1
    let rc=-1

    let r1 = -1
    let r2 = -1
    let r3 = -1

    let bp = -1
    let ni = -1
    let bz = -1

    let m1 = -1
    let m2 = -1
    let m3 = -1

    let bronzeShoe = 0//need to be 0 as inventory is not garenteed to have it
    let coinBagRaffleRedeem = 0
    
    if (
      playFabUserInfo?.UserVirtualCurrency !==
      undefined
    ) {
      mc = firstNotNull(playFabUserInfo?.UserVirtualCurrency.MC,mc);
      gc = firstNotNull(playFabUserInfo?.UserVirtualCurrency.GC,gc);
      vb = firstNotNull(playFabUserInfo?.UserVirtualCurrency.VB,vb);

      ac = firstNotNull(playFabUserInfo?.UserVirtualCurrency.VB,ac);
      zc = firstNotNull(playFabUserInfo?.UserVirtualCurrency.VB,zc);
      rc = firstNotNull(playFabUserInfo?.UserVirtualCurrency.VB,rc);

      r1 = firstNotNull(playFabUserInfo?.UserVirtualCurrency.R1,r1);
      r2 = firstNotNull(playFabUserInfo?.UserVirtualCurrency.R2,r2);
      r3 = firstNotNull(playFabUserInfo?.UserVirtualCurrency.R3,r3);

      bp = firstNotNull(playFabUserInfo?.UserVirtualCurrency.BP,bp);
      ni = firstNotNull(playFabUserInfo?.UserVirtualCurrency.NI,ni);
      bz = firstNotNull(playFabUserInfo?.UserVirtualCurrency.BZ,bz);
      
    }
    if (
      playFabUserInfo?.UserInventory !==
      undefined
    ) {
      for(let p in playFabUserInfo?.UserInventory){
        const itm = playFabUserInfo?.UserInventory[p]
        //log("playFabUserInfo.playerInventory",p,itm)
        switch(itm.ItemId){
          case CONFIG.GAME_COIN_TYPE_MATERIAL_1_ID:
            m1 = itm.RemainingUses ? itm.RemainingUses : -1
            break;
          case CONFIG.GAME_COIN_TYPE_MATERIAL_2_ID:
            m2 = itm.RemainingUses ? itm.RemainingUses : -1
            break;
          case CONFIG.GAME_COIN_TYPE_MATERIAL_3_ID:
            m3 = itm.RemainingUses ? itm.RemainingUses : -1
            break;
          case CONFIG.GAME_COIN_TYPE_BRONZE_SHOE_1_ID:
            bronzeShoe = itm.RemainingUses ? itm.RemainingUses : -1
            break;
          case CONFIG.GAME_COIN_TYPE_REDEEM_RAFFLE_COIN_BAG_ID:
            coinBagRaffleRedeem = itm.RemainingUses ? itm.RemainingUses : -1
            break;
        }
      }
    }

    //coinLobbyGCCounter.set(gc);
    //coinLobbyMCCounter.set(mc);
    //subCoinGCCounter.set(vb);

    let playerStatics = playFabUserInfo?.PlayerStatistics;
    let coinCollectingEpochStat:PlayFabClientModels.StatisticValue|undefined
    let coinCollectingDailyStat:PlayFabClientModels.StatisticValue|undefined
    let raffleCoinBagDailyStat:PlayFabClientModels.StatisticValue|undefined
    
    if (playerStatics) {
      for (const p in playerStatics) {
        const stat: PlayFabClientModels.StatisticValue = playerStatics[p];
        //log("stat ", stat);
        if (
          stat.StatisticName == "coinsCollectedEpoch"
        ) {
          coinCollectingEpochStat = stat;
        }
        if (
          stat.StatisticName == "coinsCollectedDaily"
        ) {
          coinCollectingDailyStat = stat;
        }
        if (
          stat.StatisticName == "raffle_coin_bag"
        ) {
          raffleCoinBagDailyStat = stat;
        }
      }
      
    }
    //playFabUserInfo.PlayerStatistics
    this.stats.allTimeCoins = coinCollectingEpochStat!==undefined ? coinCollectingEpochStat.Value : 0
    this.stats.dailyCoins = coinCollectingDailyStat!==undefined ? coinCollectingDailyStat.Value : 0
    this.stats.raffleCoinBag = raffleCoinBagDailyStat!==undefined ? raffleCoinBagDailyStat.Value : 0
    
    this.virtualCurrency.gc = gc
    this.virtualCurrency.mc = mc

    this.virtualCurrency.vb = vb
    this.virtualCurrency.ac = ac
    this.virtualCurrency.zc = zc
    this.virtualCurrency.rc = rc

    this.virtualCurrency.bp = bp
    this.virtualCurrency.ni = ni
    this.virtualCurrency.bz = bz
    this.virtualCurrency.r1 = r1
    this.virtualCurrency.r2 = r2
    this.virtualCurrency.r3 = r3

    this.virtualCurrency.m1 = m1
    this.virtualCurrency.m2 = m2
    this.virtualCurrency.m3 = m3

    this.inventory.bronzeShoe = bronzeShoe
    this.inventory.coinBagRaffleRedeem = coinBagRaffleRedeem

    
  }
}