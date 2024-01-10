import { LevelingFormulaConfig } from "../utils/leveling/levelingTypes";
import { coins } from "../coin_config/coins"

//was the thing that limited MC per 24 hours
const EPOCH_HOURS = 24 ;// 10/60 //1 minute

export class Config{
  DATE_FORMAT_PATTERN = 'YYYY-MM-DDTHH:mm:ss [GMT]Z'
 
  //no longer rolling GC into MC
  GC_TO_MC_CONVESION = Number.MAX_VALUE //just use this as conversion instead of gutting the code // 100//
  MAX_COINS_PER_EPOCH = 99999 //100//4 - making large effectivly disabling it
  EPOCH_HOURS = EPOCH_HOURS
  EPOCH_MINUTES = EPOCH_HOURS * 60 //convert to minutes
   
  //time to wait to give SDK a chance to catchup
  START_GAME_WAIT_TIME = 6000 //milliseconds 

  RECONNECT_WAIT_TIME =  process.env.RECONNECT_WAIT_TIME !== undefined ? parseInt(process.env.RECONNECT_WAIT_TIME) : 3; //in seconds
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

  SAVE_DATA_INTERVAL = process.env.SAVE_DATA_INTERVAL !== undefined ? parseInt(process.env.SAVE_DATA_INTERVAL) : 10 * 1 * 1000; //in MS
  // const ROUND_DURATION = 30;
  
  // const MAX_BLOCK_HEIGHT = 5;
  MAX_BLOCK_HEIGHT = coins.length; //how many to collect to end (overriden maxBlocksCollectable)
  
  //its 5x6 but lets focus on 5x5 for easier
  PARCEL_SIZE = 5  

  CONTRACT_3D_API_CALL = "https://www.metadoge.art/api/wallet?contractAddress=0x1acF970cf09a6C9dC5c5d7F2ffad9b1F05e4f7a8"
  CONTRACT_OWNER_FIELD = "&ownerAddress="

  CONTRACT_DOGE_HEAD_API_CALL = "https://us-central1-sandbox-query-blockchain.cloudfunctions.net/blockChainQueryApp/get-account-nft-balance?network=matic&limit=1&logLevel=debug&storage=cacheX&multiCall=true&contractId=dcl-mtdgpnks"
  CONTRACT_DOGE_HEAD_OWNER_FIELD = "&ownerAddress="

  CHECK_REMOTE_CONFIG_API_CALL = "https://us-central1-gamimall-games.cloudfunctions.net/studio/config/colyseus/room?"
  CHECK_REMOTE_CONFIG_API_CALL_ROOM_ID = "&roomId="

  RAFFLE_SYNC_DATA_API_CALL = "https://us-central1-gamimall-games.cloudfunctions.net/studio/raffle/admin/sync"
  RAFFLE_PICK_WINNER_API_CALL = "https://us-central1-gamimall-games.cloudfunctions.net/studio/raffle/admin/pick-winners"

  CHECK_MULTIPLIER_API_CALL = "https://us-central1-gamimall-games.cloudfunctions.net/studio/check-multiplier?"
  CHECK_MULTIPLIER_API_CALL_VERSION_FIELD = "&version="
  CHECK_MULTIPLIER_API_CALL_OWNER_FIELD = "&address="
  CHECK_MULTIPLIER_API_CALL_REALM_BASE_URL_FIELD = "&realmBaseUrl="
  CHECK_MULTIPLIER_API_CALL_USERDATA_FIELD = "&userData="
  CHECK_MULTIPLIER_API_CALL_BRONZE_SHOE_FIELD = "&bronzeShoeQty="

  LEVEL_COINS_SAVE_STATS_MID_GAME = (process.env.LEVEL_COINS_SAVE_STATS_MID_GAME !== undefined && process.env.LEVEL_COINS_SAVE_STATS_MID_GAME === 'true')

  PLAYFAB_ENABLED = process.env.PLAYFAB_ENABLED === undefined || (process.env.PLAYFAB_ENABLED !== undefined && process.env.PLAYFAB_ENABLED === 'true')
  PLAYFAB_TITLEID = process.env.PLAYFAB_TITLEID
  PLAYFAB_DEVELOPER_SECRET = process.env.PLAYFAB_DEVELOPER_SECRET

  //MAKE SURE THESE MATCH CLIENT + SERVER SIDE scene/src/config.ts value + server/colyseus/arena.env
  GAME_LEVELING_FORMULA_CONST:LevelingFormulaConfig = {
      x: process.env.GAME_LEVELING_FORMULA_X !== undefined ? parseFloat(process.env.GAME_LEVELING_FORMULA_X) : .05
    , y: process.env.GAME_LEVELING_FORMULA_Y !== undefined ? parseFloat(process.env.GAME_LEVELING_FORMULA_Y) : 2
    , min:0
    ,max:process.env.GAME_LEVELING_FORMULA_MAX_LVL !== undefined ? parseInt(process.env.GAME_LEVELING_FORMULA_MAX_LVL) : 30
    ,levelOffset:process.env.GAME_LEVELING_FORMULA_LVL_OFFSET !== undefined ? parseInt(process.env.GAME_LEVELING_FORMULA_LVL_OFFSET) : 0
  }
  GAME_DAILY_COIN_MAX_FORMULA_CONST:LevelingFormulaConfig = {
      x: process.env.GAME_DAILY_COIN_MAX_FORMULA_CONST_X !== undefined ? parseFloat(process.env.GAME_DAILY_COIN_MAX_FORMULA_CONST_X) : 7000
    , y: process.env.GAME_DAILY_COIN_MAX_FORMULA_CONST_Y !== undefined ? parseFloat(process.env.GAME_DAILY_COIN_MAX_FORMULA_CONST_Y) : 9
    , min:process.env.GAME_DAILY_COIN_MAX_FORMULA_MIN_LVL !== undefined ? parseInt(process.env.GAME_DAILY_COIN_MAX_FORMULA_MIN_LVL) : 7000
    ,max:process.env.GAME_DAILY_COIN_MAX_FORMULA_MAX_LVL !== undefined ? parseInt(process.env.GAME_DAILY_COIN_MAX_FORMULA_MAX_LVL) : 19000
    ,levelOffset:process.env.GAME_DAILY_COIN_MAX_FORMULA_LVL_OFFSET !== undefined ? parseInt(process.env.GAME_DAILY_COIN_MAX_FORMULA_LVL_OFFSET) : 9
  }

  LEVEL_UP_REWARD_PERCENT_GC = .1
  LEVEL_UP_REWARD_PERCENT_MC = .01
  
  COIN_MULTIPLIER_DOGE_HEAD = 1.02
  COIN_MULTIPLIER_LILDOGE = 1.05
  COIN_MULTIPLIER_DOGE_BRO = 1.07
  COIN_MULTIPLIER_MOON_DOGE = 1.10
  COIN_MULTIPLIER_MARS_DOGE = 1.12
  COIN_MULTIPLIER_DOGE_GOD = 1.15

  //TODO somehow sync/share these coin type ids accross config.ts for race vs coin levels
  GAME_COIN_TYPE_GC = "GC";
  GAME_COIN_TYPE_MC = "MC";
  GAME_COIN_TYPE_VB = "VB";
  //place holders incase we want to add more
  GAME_COIN_TYPE_AC = "AC";
  GAME_COIN_TYPE_ZC = "ZC";
  GAME_COIN_TYPE_RC = "RC";//reward coin?
  GAME_COIN_TYPE_BZ = "BZ";
  GAME_COIN_TYPE_MATERIAL_1="M1"
  GAME_COIN_TYPE_MATERIAL_2="M2"
  GAME_COIN_TYPE_MATERIAL_3="M3"

  //if ever a material
  GAME_COIN_TYPE_MATERIAL_1_ID="Material.1"
  GAME_COIN_TYPE_MATERIAL_2_ID="Material.2"
  GAME_COIN_TYPE_MATERIAL_3_ID="Material.3"
  GAME_COIN_TYPE_BRONZE_SHOE_1_ID="item.bronze.shoe"
  
  GAME_COIN_TYPE_STAT_RAFFLE_COIN_BAG_3_ID="item.stat.raffle_coin_bag"
  GAME_COIN_TYPE_TICKET_RAFFLE_COIN_BAG_ID="item.ticket.raffle_coin_bag"
  GAME_COIN_TYPE_REDEEM_RAFFLE_COIN_BAG_ID="item.redeem.raffle_coin_bag"

  //max number of tries to swap out VC with base GC
  MAX_SPAWN_SEARCH_TRIES = 1000 

  SPAWN_MATERIAL_ITEMS_ENABLED =  process.env.SPAWN_MATERIAL_ITEMS_ENABLED === undefined || (process.env.SPAWN_MATERIAL_ITEMS_ENABLED !== undefined && process.env.SPAWN_MATERIAL_ITEMS_ENABLED === 'true')

  //default is true
  ON_JOIN_REQUIRE_PLAYFAB_DATA_OPTIONS = process.env.ON_JOIN_REQUIRE_PLAYFAB_DATA_OPTIONS === undefined || (process.env.ON_JOIN_REQUIRE_PLAYFAB_DATA_OPTIONS !== undefined && process.env.ON_JOIN_REQUIRE_PLAYFAB_DATA_OPTIONS === 'true')

  //if true, will catch and log them but not bomb the game out
  SILENCE_UNHANDLED_ERRORS = process.env.SILENCE_UNHANDLED_ERRORS === undefined || (process.env.SILENCE_UNHANDLED_ERRORS !== undefined && process.env.SILENCE_UNHANDLED_ERRORS === 'true')

  //when collect hit will reshuffle coins, defaults to total spawn amount
  //make huge if want never shuffle
  GAME_MAX_COINS_COLLECTABLE_THRESHOLD =  process.env.GAME_MAX_COINS_COLLECTABLE_THRESHOLD !== undefined ? parseInt(process.env.GAME_MAX_COINS_COLLECTABLE_THRESHOLD) : -1; //in seconds
  //#in seconds, how often to reshuffle all coin placement 
  //#make huge if want no resuffle
  GAME_ININITE_MODE_RESHUFFLE_DURATION =  process.env.GAME_ININITE_MODE_RESHUFFLE_DURATION !== undefined ? parseInt(process.env.GAME_ININITE_MODE_RESHUFFLE_DURATION) : 60 * 3; //in seconds
  //if we allow coin to respawn after collecting
  GAME_ININITE_MODE_ON_COLLECT_RESPAWN_ENABLED =  (process.env.GAME_ININITE_MODE_ON_COLLECT_RESPAWN_ENABLED !== undefined && process.env.GAME_ININITE_MODE_ON_COLLECT_RESPAWN_ENABLED === 'true')
  //in seconds, after collected how long till respawn in same spot
  GAME_ININITE_MODE_ON_COLLECT_RESPAWN_DELAY =  process.env.GAME_ININITE_MODE_ON_COLLECT_RESPAWN_DELAY !== undefined ? parseInt(process.env.GAME_ININITE_MODE_ON_COLLECT_RESPAWN_DELAY) : 60 * 3; //in seconds

  CATALOG_VERSION_MINABLES = "Minables.v1"

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