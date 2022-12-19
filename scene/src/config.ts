import { isPreviewMode } from "@decentraland/EnvironmentAPI";
import { GameLevelData } from "./gamimall/resources";
import { Logger } from "./logging";
import { getEntityByName, isNull, notNull } from "./utils";

export enum WearableEnum {
  DOGE_HEAD = "urn:decentraland:matic:collections-v2:0x47f8b9b9ec0f676b45513c21db7777ad7bfedb35:0", //'urn:decentraland:matic:collections-v2:0x7e553ede9b6ad437262d28d4fe9ab77e63089b8a:1' //text: "Festival Glasses" //doge head
  WEABLE_TEST_NFT = "urn:decentraland:matic:collections-v2:0x7e553ede9b6ad437262d28d4fe9ab77e63089b8a:1",
}

export const AVATAR_SWAP_WEARABLES = [WearableEnum.DOGE_HEAD];

//MOVED TO GAME_STATE
//PLAYER_AVATAR_SWAP_ENABLED = false //starts off disabled, only changes when has wearable on
//PLAYER_NFT_DOGE_HELMET_BALANCE = 0;//starts off 0

//DEV
//METADOGE_ART_DOMAIN = 'https://dev.metadoge.art'
//PROD
const METADOGE_ART_DOMAIN = "https://www.metadoge.art";

export class Config {
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
  //summary of how this works here https://youtu.be/zD5BQTKJgqc
  AVATAR_SWAP_NO_NFT_BASE_MODEL = "models/avatarModels/APE3DMODEL.glb";

  SHOW_CONNECTION_DEBUG_INFO = false;
  SHOW_PLAYER_DEBUG_INFO = false;
  SHOW_GAME_DEBUG_INFO = false; 
 
  COLYSEUS_ENDPOINT_LOCAL = "ws://127.0.0.1:2567"
  //COLYSEUS_ENDPOINT_NON_LOCAL = "wss://TODO"; // dev environment
  COLYSEUS_ENDPOINT_NON_LOCAL = "wss://TODO"; // prod environment
  //COLYSEUS_ENDPOINT = "wss://TODO"; // production environment

  //DEV
  //METADOGE_ART_DOMAIN = 'https://dev.metadoge.art'
  //PROD
  METADOGE_ART_DOMAIN = METADOGE_ART_DOMAIN;

  LOGIN_ENDPOINT = METADOGE_ART_DOMAIN + "/api/dcl/auth";
  AUTOCLAIM_ENDPOINT = METADOGE_ART_DOMAIN + "/api/dcl/claim/nft";

  //DEV
  //PLAYFAB_TITLEID = "TODO"
  //PROD
  PLAYFAB_TITLEID = "TODO";

  //playFabId=EE9252E2A0459D92
  //RAFFLE_URL = "https://us-central1-gamimall-games.cloudfunctions.net/studio/play-raffle"
  RAFFLE_URL =
    "https://us-central1-gamimall-games.cloudfunctions.net/studio/play-raffle";

  //in milliseconds
  DELAY_LOAD_UI_BARS = -1;
  DELAY_LOAD_NPCS = 5000;
  DELAY_LOAD_FIREWORKS = 20000;
  DELAY_LOAD_FLOOR_PIANOS = 10000;
  DELAY_LOAD_IMAGE_FROM_URLS = 2000;
  DELAY_LOAD_AUDIO_AND_VIDEO_BARS = 2000;
  DELAY_LOAD_NON_PRIMARY_SCENE = 1000;
  DELAY_LOAD_NFT_FRAMES = 10000; //removed as of july21 2022

  UI_REPLACE_TEXTURE_WITH_SINGLETON = true;

  URL_METADOGE_NFT_2D = "https://www.metadoge.art/#2D";
  URL_METADOGE_3D_MINT_URL = "https://www.metadoge.art/#mint";
  URL_METADOGE_HELMET_URL =
    "https://market.decentraland.org/contracts/0x47f8b9b9ec0f676b45513c21db7777ad7bfedb35/items/0";
  URL_MUSCLEDOGE_SKIN_URL =
    "https://market.decentraland.org/contracts/0x55e59c43f0b2eea14d5126fc8d531476fbd69529/items/0";

  GAME_COIN_VAULT_POSITION = new Vector3(
    40.1077880859375,
    2.2049999237060547,
    43.80853271484375
  );

  GAME_COIN_TYPE_GC = "GC";
  GAME_COIN_TYPE_MC = "MC";
  GAME_COIN_TYPE_VB = "VB";
  GAME_COIN_TYPE_MATERIAL_1="M1"
  GAME_COIN_TYPE_MATERIAL_2="M2"
  GAME_COIN_TYPE_MATERIAL_3="M3"

  GAME_COIN_TYPE_MATERIAL_1_ID="Material.1"
  GAME_COIN_TYPE_MATERIAL_2_ID="Material.2"
  GAME_COIN_TYPE_MATERIAL_3_ID="Material.3"

  GAME_COIN_MC_MAX_PER_DAY = 100;
  GAME_EPOCH_SIZE_MILLIS = 24 * 60 * 60 * 1000;
  GAME_LEADEBOARD_BILLBOARD_MAX_RESULTS = 14; //current leaderboard max
  GAME_LEADEBOARD_MAX_RESULTS = 16;
  GAME_LEADEBOARD_UI_MAX_RESULTS = 6;
  GAME_ROOM_DATA: GameLevelData[] = [
    { id: "level_pad_surfer", loadingHint: "Collect coins along the road" },
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
  ];

  enableSkyMazeInEngine = false;
  skyBridgeCasingVisible = false;
  skyMazeEnabledClickSound = false;
  skyMazeMultiplayer = false; //only a local effect
  skyMazeDisappearDelay = 5 * 1000; //ms
  skyMazeDisappearCheatDelay = 4 * 1000; //ms 5 seconds?

  CONTRACT_API_CALL =
    "https://www.metadoge.art/api/wallet?contractAddress=0x29B062EEa5700591aa4fF763a1cade4877e8987C";
  CONTRACT_3D_API_CALL =
    "https://www.metadoge.art/api/wallet?contractAddress=0x1acF970cf09a6C9dC5c5d7F2ffad9b1F05e4f7a8";
  CONTRACT_OWNER_FIELD = "&ownerAddress=";
}

export let CONFIG: Config; // = new Config()//FIXME HACK DOUBLE INITTING

export async function initConfig() {
  if (CONFIG === undefined) {
    CONFIG = new Config();

    //set in preview mode from env, local == preview
    await isPreviewMode().then(function (val: boolean) {
      setInPreview(val);
    });
  }
}

export function setInPreview(val: boolean) {
  log("setInPreview " + val);
  CONFIG.IN_PREVIEW = val;

  //var console: any

  if (val) {
    Input.instance.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, true, (e) => {
      if (e.hit) {
        //ROLL UP CHAIN FOR FULLY QUALIFIED NAME
        let hitName = "";
        let hitTransform = null;

        if (notNull(engine.entities[e.hit.entityId])) {
          hitName = (engine.entities[e.hit.entityId] as Entity).name!;

          if (engine.entities[e.hit.entityId].hasComponent(Transform)) {
            hitTransform =
              engine.entities[e.hit.entityId].getComponent(Transform);
          }
        }
        log(
          `{ position: new Vector3(`,
          Camera.instance.position.x,
          ",",
          Camera.instance.position.y,
          ",",
          Camera.instance.position.z,
          `) },` + "HIT ENTITY: ",
          hitName +
            "(" +
            e.hit.entityId +
            "," +
            e.hit.meshName +
            ")" +
            " POS: ",
          hitTransform
        );
      } else {
        log(
          `{ position: new Vector3(`,
          Camera.instance.position.x,
          ",",
          Camera.instance.position.y,
          ",",
          Camera.instance.position.z,
          `) },`
        );
      }
    });
  }
}
