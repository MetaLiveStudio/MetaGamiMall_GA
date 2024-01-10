import { Vector3 } from '@dcl/sdk/math';
import { isPreviewMode } from '~system/EnvironmentApi'
import { GameLevelData } from "./gamimall/resources";
import { Logger } from "./logging";
import { LevelingFormulaConfig } from "./modules/leveling/levelingTypes";
import { notNull } from "./utils";
import { getRealm } from '~system/Runtime';
  
export const SCENE_TYPE_GAMIMALL = "gamimall"
export const SCENE_TYPE_UNIFIED_SCENE = "unified-scene"

type SceneType = 'gamimall'|'unified-scene'|'px'
let SCENE_TYPE:SceneType = SCENE_TYPE_GAMIMALL//SCENE_TYPE_UNIFIED_SCENE//SCENE_TYPE_GAMIMALL

export enum WearableEnum {
  DOGE_HEAD = "urn:decentraland:matic:collections-v2:0x47f8b9b9ec0f676b45513c21db7777ad7bfedb35:0", //'urn:decentraland:matic:collections-v2:0x7e553ede9b6ad437262d28d4fe9ab77e63089b8a:1' //text: "Festival Glasses" //doge head
  CYBER_TEE = "urn:decentraland:matic:collections-v2:0xcf4525ccbaa3469ef26b0db8777a8294cf844f44:0",
  CYBER_WINGS = "urn:decentraland:matic:collections-v2:0xac852e781cc7f4fc759ebb384638ad99075420b0:31",
  CYBER_TROUSER = "urn:decentraland:matic:collections-v2:0x199c20d3cd178abd23e3e62c91cfce5aeb1ff52f:57",
  CYBER_MASK = "urn:decentraland:matic:collections-v2:0xd3359070df7037c56ce49f0987464153b8f4968d:74",
  CYBER_HELMET = "urn:decentraland:matic:collections-v2:0xcc891948b089bca4179ae6c284e9658695f8e054:0",
  COCACOLA_JUMPER = "urn:decentraland:matic:collections-v2:0x1d0f011d0ab221c87b3047140395a0c2510e8067:0",
  WEABLE_TEST_NFT = "urn:decentraland:matic:collections-v2:0x7e553ede9b6ad437262d28d4fe9ab77e63089b8a:1",
}

export const AVATAR_SWAP_WEARABLES = [WearableEnum.DOGE_HEAD];
export const VIP_NFT_AREA = [WearableEnum.DOGE_HEAD, WearableEnum.CYBER_TEE, WearableEnum.CYBER_WINGS, WearableEnum.CYBER_TROUSER, WearableEnum.CYBER_MASK, WearableEnum.CYBER_HELMET, WearableEnum.COCACOLA_JUMPER]

//MOVED TO GAME_STATE
//PLAYER_AVATAR_SWAP_ENABLED = false //starts off disabled, only changes when has wearable on
//PLAYER_NFT_DOGE_HELMET_BALANCE = 0;//starts off 0

//DEV
//METADOGE_ART_DOMAIN = 'https://dev.metadoge.art'
//PROD
const METADOGE_ART_DOMAIN = "https://www.metadoge.art";


export const DEFAULT_ENV = "local" 

//version 2 means compute based on worn werables
//version 1 means compute on owned wearables
const CHECK_MULTIPLIE_URL_VERSION = 2


export const PLAYFAB_ENABLED = true
export const PLAYFAB_TITLE_ID: Record<string, string> = {
  local: "TODO",
  dev: "TODO",
  stg: "TODO",
  prd: "TODO",
};

export const COLYSEUS_ENDPOINT_URL: Record<string, string> = {
  local: "ws://127.0.0.1:2567",
  dev: "wss://DEV-END-POINT-HERE",
  stg: "wss://STAGE-END-POINT-HERE",
  prd: "wss://PROD-END-POINT-HERE",
}

export const GAME_MINABLES_ENABLED_VALS: Record<string, boolean> = {
  local: true,
  dev: false,
  stg: true,
  prd: true 
};
export const GAME_BUYABLES_ENABLED_VALS: Record<string, boolean> = {
  local: true,
  dev: false,
  stg: true,
  prd: true
};
export const GAME_RACING_BP_NI_VC_ENABLED_VALS: Record<string, boolean> = {
  local: true,
  dev: true,
  stg: true,
  prd: true
};
   
export const GAME_LEVELING_FORMULA_CONST_VALS: Record<string, LevelingFormulaConfig> = {
  local: {x:.05, y:2, min:0,max:100,levelOffset:0},//{x:.05, y:2, min:0,max:100},
  dev: {x:.05, y:2, min:0,max:100,levelOffset:0},//{x:.05, y:2, min:0,max:100}, //TESTING ONLY using much much lower level up rules
  stg: {x:.05, y:2, min:0,max:100,levelOffset:0},
  prd: {x:.05, y:2, min:0,max:100,levelOffset:0}
};



/*const AUTH_URL: Record<string, string> = {
  local: "http://localhost:5001",//only used if PLAYFAB_ENABLED
  localColyseus: "TODO",//TODO get io
  dev: "TODO",//TODO get io
  stg: "TODO",
  prd: "TODO",
};*/
 
export class Config {
  SCENE_TYPE:SceneType = SCENE_TYPE
  IN_PREVIEW = false; // can be used for more debugging of things, not meant to be enabled in prod
  ENABLE_PIANO_KEYS = true;
  ENABLE_CLICKABLE_PIANO_KEYS = false;
  ENABLE_PIANO_ABOVE_Y = 1; //max height piano will be allowed to be enabled
  AVATAR_SWAP_ENABLED = true; //kill switch for avatar swap completely
  AVATAR_SWAP_WEARBLE_DETECT_ENABLED = false; //if true will detect if user is wearing right stuff to swap, local can set to false so it just enables
  PERSONAL_ASSISTANT_ENABLED_DEFAULT_STATE = false; //if personal assistant is enabled by default or not
  ENABLE_NPCS = true; //turn off for performance local dev
  CHECK_INTERVAL_CHECK_PLAYER_CHANGED = 10; //make large number for performance local dev
  ENABLE_NFT_FRAMES = true; //turn off for performance local dev

  ADMINS = [
    "WALLET-HERE", //
    "WALLET-HERE", //
    "WALLET-HERE", //
    ,
    "Xany", //if set to any will allow anyone to see
  ];
  TEST_CONTROLS_ENABLE = true;

  //path to model that should be the base model players switch to if dont own any NFT to get a custom model
  AVATAR_SWAP_NO_NFT_BASE_MODEL = "models/avatarModels/00LilDoge.glb";

  SHOW_CONNECTION_DEBUG_INFO = false;
  SHOW_PLAYER_DEBUG_INFO = false;
  SHOW_GAME_DEBUG_INFO = false; 
  DEBUG_ENABLE_TRIGGER_VISIBLE = true
  // const ENDPOINT = "wss://hept-j.colyseus.dev";
  //d-awgl.us-east-vin.colyseus.net/  
  //new dev: wss://wnc9pc.colyseus.dev
  //new prod: wss://z34-ff.colyseus.dev
  COLYSEUS_ENDPOINT_LOCAL = "see #initForEnv"//"wss://bnvdlg.us-east-vin.colyseus.net"; //"ws://127.0.0.1:2567"; // local environment
  //COLYSEUS_ENDPOINT_NON_LOCAL = "wss://d-awgl.us-east-vin.colyseus.net"; // dev environment
  COLYSEUS_ENDPOINT_NON_LOCAL_HTTP = "see #initForEnv"
  COLYSEUS_ENDPOINT_NON_LOCAL = "see #initForEnv"; // prod environment
  //COLYSEUS_ENDPOINT = "wss://TODO"; // production environment
  
  //2 was minables
  //3 is buyables + changeProfile listeners
  //4 coin collect cap capable
  CLIENT_VERSION = 4; //version of client so server knows what features it can enabled
   
  //DEV
  //METADOGE_ART_DOMAIN = 'https://dev.metadoge.art'
  //PROD
  METADOGE_ART_DOMAIN = METADOGE_ART_DOMAIN;

  LOGIN_ENDPOINT = METADOGE_ART_DOMAIN + "/api/dcl/auth";
  AUTOCLAIM_ENDPOINT = METADOGE_ART_DOMAIN + "/api/dcl/claim/nft";
  //signedTypeV4 // dclSignedFetch
  AUTO_LOGIN_ENABLED = true
  LOGIN_FLOW_TYPE = "dclSignedFetch"

  CLAIM_VERIFY_PRICES_CLIENT_SIDE_ENABLED=false //for now to reduce work not checking client side enforcing server side
  CLAIM_CHECK_FOR_LATEST_PRICES=true//if true will check prices on remote server

  PLAYFAB_TITLEID = "see #initForEnv";

  //playFabId=EE9252E2A0459D92
  //RAFFLE_URL = "https://us-central1-gamimall-games.cloudfunctions.net/studio/play-raffle"
  RAFFLE_URL =
    "https://us-central1-gamimall-games.cloudfunctions.net/studio/play-raffle";
  CHECK_MULTIPLIE_URL_VERSION = CHECK_MULTIPLIE_URL_VERSION
  CHECK_MULTIPLIER_URL =
    "https://us-central1-gamimall-games.cloudfunctions.net/studio/check-multiplier?version="+CHECK_MULTIPLIE_URL_VERSION+"&";
  CHECK_MULTIPLIER_URL_OWNER_FIELD = "&address=";
  CHECK_MULTIPLIER_URL_USERDATA_FIELD = "&userData=";
  CHECK_MULTIPLIER_URL_BRONZE_SHOE_FIELD = "&bronzeShoeQty=";
  CHECK_MULTIPLIER_API_CALL_REALM_BASE_URL_FIELD = "&realmBaseUrl="

  //in milliseconds
  DELAY_LOAD_UI_BARS = -1;
  DELAY_LOAD_NPCS = 2000;
  DELAY_LOAD_FIREWORKS = 20000;
  DELAY_LOAD_FLOOR_PIANOS = 1000000;
  DELAY_LOAD_IMAGE_FROM_URLS = 2000;
  DELAY_LOAD_AUDIO_AND_VIDEO_BARS = 7000;
  DELAY_LOAD_NON_PRIMARY_SCENE = 1000;
  DELAY_LOAD_NFT_FRAMES = 10000; //removed as of july21 2022
  DELAY_LOAD_PLANT = 10000;
  DELAY_LOAD_SQUARES = 9000;
  DELAY_LOAD_WEARABLES = 3000;

  UI_REPLACE_TEXTURE_WITH_SINGLETON = true;

  URL_METADOGE_NFT_2D = "https://www.metadoge.art/#2D";
  URL_METADOGE_3D_MINT_URL = "https://www.metadoge.art/#mint";
  URL_METADOGE_HELMET_URL =
    "https://market.decentraland.org/contracts/0x47f8b9b9ec0f676b45513c21db7777ad7bfedb35/items/0";
  URL_MUSCLEDOGE_SKIN_URL =
    "https://market.decentraland.org/contracts/0x55e59c43f0b2eea14d5126fc8d531476fbd69529/items/0";

  //wallet that holds the NFT to send out
  REWARD_SERVER_WAREHOUSE_WALLET = "WALLET-HERE"

  //perform a save when prompt opens, so server has latest values
  STORE_WEARABLES_ON_OPEN_CLAIM_PROMPT_DO_SAVE = true
  //perform a save when prompt to confirm shows, so server has latest values
  //if STORE_WEARABLES_ON_OPEN_CLAIM_PROMPT_DO_SAVE is true no need to also do it here
  STORE_WEARABLES_ON_CONFIRM_CLAIM_PURCHASE_PROMPT_DO_SAVE = false
  //how long till OK button becomes clickable, helps with debounce, gives more time to save/ -1 for dont do this
  STORE_WEARABLES_CONFIRM_CLAIM_PURCHASE_DELAY_OK_BTN = 2000

  GAME_UI_LOADING_SCREEN_ENABLED = false//when coins being placed pops a loading modal
  GAME_UI_RACE_PANEL_ENABLED = false // top center gives stats of current coin collecting in lobby ui_background.ts RacePanel
  
  GAME_COIN_AUTO_START = true//if true will auto connect to coin collecting
  GAME_COIN_VAULT_POSITION = Vector3.create(
    40.1077880859375,
    2.2049999237060547,
    43.80853271484375
  );

  //max auto connect retries, prevent error always visible
  GAME_CONNECT_RETRY_MAX=3
  //after this time period restart the retry again
  GAME_CONNECT_RESTART_RETRY_INTERVAL=30*60*1000//30 min

  SEND_RACE_DATA_FREQ_MILLIS = 1000 / 10 // doing 13 times a second or 76ms (100 or less is considered acceptable for gaming). best i could get locally was ~60ms

  GAME_COIN_TYPE_GC = "GC";
  GAME_COIN_TYPE_MC = "MC";
  GAME_COIN_TYPE_VB = "VB";
  //place holders incase we want to add more
  GAME_COIN_TYPE_AC = "AC";
  GAME_COIN_TYPE_ZC = "ZC";
  GAME_COIN_TYPE_RC = "RC";//reward coin?

  GAME_COIN_TYPE_R1 = "R1";
  GAME_COIN_TYPE_R2 = "R2";
  GAME_COIN_TYPE_R3 = "R3";
  GAME_COIN_TYPE_BZ = "BZ";
  GAME_COIN_TYPE_NI = "NI";
  GAME_COIN_TYPE_BP = "BP";

  GAME_COIN_TYPE_MATERIAL_1="M1"
  GAME_COIN_TYPE_MATERIAL_2="M2"
  GAME_COIN_TYPE_MATERIAL_3="M3"

  GAME_COIN_TYPE_BRONZE_SHOE_1="Bronze Shoe"
  GAME_COIN_TYPE_BRONZE_SHOE_1_ID="item.bronze.shoe"

  GAME_COIN_TYPE_MATERIAL_1_ID="Material.1" 
  GAME_COIN_TYPE_MATERIAL_2_ID="Material.2"
  GAME_COIN_TYPE_MATERIAL_3_ID="Material.3"
  
  GAME_COIN_TYPE_STAT_RAFFLE_COIN_BAG_3_ID="item.stat.raffle_coin_bag"
  GAME_COIN_TYPE_TICKET_RAFFLE_COIN_BAG_ID="item.ticket.raffle_coin_bag"
  GAME_COIN_TYPE_REDEEM_RAFFLE_COIN_BAG_ID="item.redeem.raffle_coin_bag"
 
  //https://blog.jakelee.co.uk/converting-levels-into-xp-vice-versa/
  //https://docs.google.com/spreadsheets/d/1IKFq_K0OkTRt7RL0l_MyzyJdgcT8Zs5gw505lRpcEVQ/edit#gid=0
  GAME_LEVELING_FORMULA_CONST:LevelingFormulaConfig = GAME_LEVELING_FORMULA_CONST_VALS[DEFAULT_ENV]
  GAME_DAILY_COIN_MAX_FORMULA_CONST:LevelingFormulaConfig = {
    x:7000, y:9, min:7000,max:19000,levelOffset:9 //will be overwritten by colyesys "update.config" message in gameplay.ts
    //x:3500, y:5, min:3500,max:10000,levelOffset:5
  }
  GAME_CAN_COLLECT_WHEN_IDLE_ENABLED = true
  GAME_COIN_MC_MAX_PER_DAY = 100;//DEPRECATED, REMOVE??? sync with server???
  GAME_EPOCH_SIZE_MILLIS = 24 * 60 * 60 * 1000;
  GAME_LEADEBOARD_BILLBOARD_MAX_RESULTS = 14; //current leaderboard max
  GAME_LEADEBOARD_2DUI_MAX_RESULTS = 14;
  GAME_LEADEBOARD_MAX_RESULTS = 16;
  GAME_LEADEBOARD_LVL_MAX_RESULTS = 100;
  GAME_LEADEBOARD_RAFFLE_MAX_RESULTS = 20;
  GAME_ROOM_DATA: GameLevelData[] = [
    //see #initForEnv() below
  ];

  GAME_OTHER_ROOM_DISCONNECT_TIMER_WAIT_TIME = 5000//in milliseconds. how long to wait for other room disconnect to finalize
  GAME_LOBBY_ROOM_NAME="custom_lobby"
  GAME_RACE_ROOM_NAME="racing_room"

  //flag to enable/disable minables
  GAME_MINABLES_ENABLED=false //see GAME_MINABLES_ENABLED_VALS above for per env value
  GAME_BUYABLES_ENABLED=false //see GAME_BUYABLES_ENABLED_VALS above for per env value
  GAME_RACING_BP_NI_VC_ENABLED=false
  //if we fetch from playfab inventory
  GAME_PLAFAB_INVENTORY_ENABLED = true
  //if can see pad in inventory
  GAME_SHOW_BRONZE_PAD_IN_INVENTORY_ENABLED = true
     
  SIDE_BAR_LANGUAGE_PICKER_ENABLED = true

  enableSkyMazeInEngine = false;
  skyBridgeCasingVisible = false;
  skyMazeEnabledClickSound = false;
  skyMazeMultiplayer = false; //only a local effect
  skyMazeDisappearDelay = 5 * 1000; //ms
  skyMazeDisappearCheatDelay = 4 * 1000; //ms 5 seconds?
  
  //make sure it matches backend server
  //setting here so front end can match back end logic
  GAME_COIN_CAP_ENABLED = false //REMOTE SERVER will override this //room.onMessage("update.config"
  speedCapOverageReduction = .1
 
  CONTRACT_API_CALL =
    "https://www.metadoge.art/api/wallet?contractAddress=0x29B062EEa5700591aa4fF763a1cade4877e8987C";
  CONTRACT_3D_API_CALL =
    "https://www.metadoge.art/api/wallet?contractAddress=0x1acF970cf09a6C9dC5c5d7F2ffad9b1F05e4f7a8";
  CONTRACT_OWNER_FIELD = "&ownerAddress=";

  sizeX!:number
  sizeY!:number
  sizeZ!:number

  BUIDING_HEIGHT = 16
  BOOLEAN_HEIGHT = 4
  BUIDING_WIDTH = 16

  center!:Vector3
  centerGround!:Vector3
  size!:Vector3

  initForEnv(){
    const env = DEFAULT_ENV
    
    this.COLYSEUS_ENDPOINT_LOCAL = COLYSEUS_ENDPOINT_URL[env]
    this.COLYSEUS_ENDPOINT_NON_LOCAL = COLYSEUS_ENDPOINT_URL[env]; 
    this.COLYSEUS_ENDPOINT_NON_LOCAL_HTTP = COLYSEUS_ENDPOINT_URL[env].replace("wss://","https://").replace("ws://","http://")
    this.GAME_MINABLES_ENABLED = GAME_MINABLES_ENABLED_VALS[env]; 
    this.GAME_BUYABLES_ENABLED = GAME_BUYABLES_ENABLED_VALS[env]; 
    
    this.GAME_RACING_BP_NI_VC_ENABLED = GAME_RACING_BP_NI_VC_ENABLED_VALS[env];
    //this.PLAYFAB_ENABLED = PLAYFAB_ENABLED
    this.PLAYFAB_TITLEID = PLAYFAB_TITLE_ID[env]
    //this.LOGIN_ENDPOINT = AUTH_URL[env] + '/player/auth'

    switch(SCENE_TYPE){
      //case "px":
        //this.GAME_ROOM_DATA.push( { id: "unified_scene", loadingHint: "Collect coins. No time limit" } )
        //break;
      case "unified-scene":
        this.GAME_ROOM_DATA.push( { id: "unified_scene", loadingHint: "Collect coins. No time limit" } )
        break;
      default:
        //{ id: "level_pad_surfer", loadingHint: "Collect coins along the road" },
        //{ id: "level_pad_surfer_infin", loadingHint: "Collect coins along the road. No time limit" },
        //{ id: "px_random_spawn", loadingHint: "Collect coins. No time limit" },  
        /*
        {
          id: "level_random_ground_float",
          loadingHint: "Coins are scattered on the ground floor",
        },
        {
          id: "level_random_ground_float_few",
          loadingHint:
            "There are a limited number of coins scattered on the ground floor.  Can you find them?",
        },*/
        this.GAME_ROOM_DATA.push({ id: "level_pad_surfer_infin", loadingHint: "Collect coins along the road. No time limit" })
    }
    

    const ParcelCountX:number = this.SCENE_TYPE === SCENE_TYPE_GAMIMALL ? 4 : 1
    const ParcelCountZ:number = this.SCENE_TYPE === SCENE_TYPE_GAMIMALL ? 5 : 1

    
    this.sizeX = ParcelCountX*16
    this.sizeZ = ParcelCountZ*16 
    this.sizeY = (Math.log((ParcelCountX*ParcelCountZ) + 1) * Math.LOG2E) * 20// log2(n+1) x 20 //Math.log2( ParcelScale + 1 ) * 20
    this.size = Vector3.create(this.sizeX,this.sizeY,this.sizeZ)
    this.center = Vector3.create(this.sizeX/2,this.sizeY/2,this.sizeZ/2)
    this.centerGround = Vector3.create(this.sizeX/2,0,this.sizeZ/2)
  }

}
     
export let CONFIG: Config; // = new Config()//FIXME HACK DOUBLE INITTING

export async function initConfig() {
  if (CONFIG === undefined) {
    CONFIG = new Config();
    CONFIG.initForEnv()
    
    //set in preview mode from env, local == preview
    //isPreviewMode is deprecated
    //or is this the more correct way?
    await getRealm({}).then((val: any) => {
      setInPreview(val.realmInfo?.isPreview)
    })
  }
}

export function setInPreview(val: boolean) {
  console.log("setInPreview " + val);
  CONFIG.IN_PREVIEW = val;

  //var console: any

}
