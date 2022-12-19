import { coins } from "./coins"

const EPOCH_HOURS = 24 ;// 10/60 //1 minute

export class Config{
  DATE_FORMAT_PATTERN = 'YYYY-MM-DDTHH:mm:ss [GMT]Z'

  //no longer rolling GC into MC
  GC_TO_MC_CONVESION = Number.MAX_VALUE //just use this as conversion instead of gutting the code // 100//
  MAX_COINS_PER_EPOCH = 100//4
  EPOCH_HOURS = EPOCH_HOURS
  EPOCH_MINUTES = EPOCH_HOURS * 60 //convert to minutes
  
  //time to wait to give SDK a chance to catchup
  START_GAME_WAIT_TIME = 6000 //milliseconds

  RECONNECT_WAIT_TIME = 20
  RECONNECT_WAIT_ENABLED = true

  //0 means skip non
  //1 would be skip 0%
  //2 would be skip 50%
  //3 would be skip 33%
  COIN_SKIP_EVERY_N = 5
  COIN_SKIP_TYPE = 'random'//or every-nth

  COIN_JUMP_EVERY_N = 5
  COIN_JUMP_TYPE = 'random'//or every-nth

  COIN_HEIGHT_ADJUSTED = -0.44
  
  //5%  add multiplier
  //pad riding  180 seconds collected 240 (it turned around at 43 seconds, i think i could have go them all if it did not do that)
  //free running 180 seconds collected 213
  ROUND_DURATION = process.env.ROUND_DURATION !== undefined ? parseInt(process.env.ROUND_DURATION) : 60 * 3; //in seconds
  // const ROUND_DURATION = 30;
  
  // const MAX_BLOCK_HEIGHT = 5;
  MAX_BLOCK_HEIGHT = coins.length; //how many to collect to end (overriden maxBlocksCollectable)
  
  //its 5x6 but lets focus on 5x5 for easier
  PARCEL_SIZE = 5  

  CONTRACT_3D_API_CALL = "https://www.metadoge.art/api/wallet?contractAddress=0x1acF970cf09a6C9dC5c5d7F2ffad9b1F05e4f7a8"
  CONTRACT_OWNER_FIELD = "&ownerAddress="

  PLAYFAB_ENABLED = process.env.PLAYFAB_ENABLED === undefined || (process.env.PLAYFAB_ENABLED !== undefined && process.env.PLAYFAB_ENABLED === 'true')
  PLAYFAB_TITLEID = process.env.PLAYFAB_TITLEID
  PLAYFAB_DEVELOPER_SECRET = process.env.PLAYFAB_DEVELOPER_SECRET

  COIN_MULTIPLIER_LILDOGE = 1.05
  COIN_MULTIPLIER_DOGE_BRO = 1.07
  COIN_MULTIPLIER_MOON_DOGE = 1.10
  COIN_MULTIPLIER_MARS_DOGE = 1.12
  COIN_MULTIPLIER_DOGE_GOD = 1.15

  //max number of tries to swap out VC with base GC
  MAX_SPAWN_SEARCH_TRIES = 200

  //write to these stats for any coins collected
  STATS_LEVEL_ANY_COIN_COLLECTED_NAMES = [
    "coinsCollectedEpoch",
    "coinsCollectedHourly",
    "coinsCollectedDaily",
    "coinsCollectedWeekly",
    "coinsCollectedMonthly",
    "coinsCollectedAllTime"
  ]
  //write to these stats for any coins collected
  STATS_LEVEL_ANY_MATERIAL_COLLECTED_NAMES = [
    "materialCollectedEpoch",
    "materialCollectedHourly",
    "materialCollectedDaily",
    "materialCollectedWeekly",
    "materialCollectedMonthly",
    "materialCollectedAllTime"
  ]
}

export const CONFIG = new Config()