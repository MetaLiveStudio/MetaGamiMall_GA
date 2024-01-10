import { LevelingFormulaConfig } from "../utils/leveling/levelingTypes";

const EPOCH_HOURS = 24 ;// 10/60 //1 minute

export class Config{
  DATE_FORMAT_PATTERN = 'YYYY-MM-DDTHH:mm:ss [GMT]Z'

 
  RECONNECT_WAIT_TIME = 1
  RECONNECT_WAIT_ENABLED = true

  //this is temporary hardcodes
  RACE_MAX_LAPS_DEFAULT = parseInt(process.env.RACE_MAX_LAPS_DEFAULT)

  MAX_WAIT_TO_START_TIME_MILLIS=parseInt(process.env.MAX_WAIT_TO_START_TIME_MILLIS)
  STARTING_COUNTDOWN_TIME_MILLIS = 3000 
  MAX_GAME_TIME_MILLIS = parseInt(process.env.MAX_RACE_TIME_MILLIS) //60 * 1000 * 6 //6 min max?
  MAX_POSSIBLE_RACE_TIME = 9999 * 1000 //9999 seconds

  LEVEL_RACING_SAVE_STATS_MID_GAME = (process.env.LEVEL_RACING_SAVE_STATS_MID_GAME !== undefined && process.env.LEVEL_RACING_SAVE_STATS_MID_GAME === 'true')

  PLAYFAB_ENABLED = process.env.RACING_PLAYFAB_ENABLED === undefined || (process.env.RACING_PLAYFAB_ENABLED !== undefined && process.env.RACING_PLAYFAB_ENABLED === 'true')
  PLAYFAB_TITLEID = process.env.PLAYFAB_TITLEID
  PLAYFAB_DEVELOPER_SECRET = process.env.PLAYFAB_DEVELOPER_SECRET

  //if true will let use hardcode test track features, else not
  DEBUG_HARCODED_TRACK_FEATURE_TESTING_ENABLED =
    process.env.DEBUG_HARCODED_TRACK_FEATURE_TESTING_ENABLED !== undefined &&
    process.env.DEBUG_HARCODED_TRACK_FEATURE_TESTING_ENABLED !== undefined &&
    process.env.DEBUG_HARCODED_TRACK_FEATURE_TESTING_ENABLED === "true";


  //TODO somehow sync/share these coin type ids accross config.ts for race vs coin levels
  GAME_COIN_TYPE_GC = "GC";
  GAME_COIN_TYPE_MC = "MC";
  GAME_COIN_TYPE_VB = "VB";
  GAME_COIN_TYPE_MATERIAL_1="M1"
  GAME_COIN_TYPE_MATERIAL_2="M2"
  GAME_COIN_TYPE_MATERIAL_3="M3"

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

  //if ever a material
  GAME_COIN_TYPE_MATERIAL_1_ID="Material.1"
  GAME_COIN_TYPE_MATERIAL_2_ID="Material.2"
  GAME_COIN_TYPE_MATERIAL_3_ID="Material.3"

  TRACK_FEATURE_TYPE_COUNT = (process.env.TRACK_FEATURE_TYPE_COUNT !== undefined ) ? parseInt( process.env.TRACK_FEATURE_TYPE_COUNT ) : 2
  //default is true
  ON_JOIN_REQUIRE_PLAYFAB_DATA_OPTIONS = process.env.ON_JOIN_REQUIRE_PLAYFAB_DATA_OPTIONS === undefined || (process.env.ON_JOIN_REQUIRE_PLAYFAB_DATA_OPTIONS !== undefined && process.env.ON_JOIN_REQUIRE_PLAYFAB_DATA_OPTIONS === 'true')
}

export const CONFIG = new Config()

//console.log("CONFIG",CONFIG)