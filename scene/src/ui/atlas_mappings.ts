const flagSourceLeft = 3680
const flagSourceTop = 2280
let flagSourceCounter = 0
const FLAG_SPACER = 107

const atlasHeight = 4080  
const atlasWidth = 4080

const inventoryAtlasHeight = 1325  
const inventoryAtlasWidth = 1932

//Avatarswap-04.png
const avatarswapAtlasHeight = 1258  
const avatarswapAtlasWidth = 2051

export default {
  atlasData:{
    customAtlas:{
      atlasHeight: atlasHeight,
      atlasWidth:  atlasWidth
    },
    inventory:{
      atlasHeight: inventoryAtlasHeight,
      atlasWidth:  inventoryAtlasWidth
    }
  },
  icons: {
    website: {
      sourceWidth: 124,
      sourceHeight: 116,
      sourceLeft: 3192,
      sourceTop: 3328,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    discord: {
      sourceWidth: 124,
      sourceHeight: 116,
      sourceLeft: 3068,
      sourceTop: 3328,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    twitter: {
      sourceWidth: 124,
      sourceHeight: 116,
      sourceLeft: 2944,
      sourceTop: 3328,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    coin: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310,
      sourceTop: 432+6,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    dimond: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310,
      sourceTop: 432 - 130 - 6,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    rock1: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310,
      sourceTop: 432 + 190,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    rock2: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310,
      sourceTop: 432 + 190 * 2,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    rock3: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310 + 6,
      sourceTop: 432 + 190 * 3 - 20, 
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    vc_vb: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310 + 1,
      sourceTop: 432 + 190 * 8 - 28,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth 
    },
    vc_ac: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310,
      sourceTop: 432 + 190 * 2,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    vc_zc: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310 + 6,
      sourceTop: 432 + 190 * 3 - 20, 
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    vc_rc: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310 + 6,
      sourceTop: 432 + 190 * 3 - 20, 
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },


    petro: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310 + 16,
      sourceTop: 432 + 190 * 4 - 20,  
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    nitro: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310 + 16,
      sourceTop: 432 + 190 * 5 - 20, 
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    bronze: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310 + 8,
      sourceTop: 432 + 190 * 6 - 20, 
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    bronzeShoe: {
      sourceWidth: 255-20,
      sourceHeight: 255,
      sourceLeft: 1716 - 12,
      sourceTop: 3063, 
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    coinBagRaffleRedeem: {
      sourceWidth: 255,
      sourceHeight: 255,
      sourceLeft: 1940,
      sourceTop: 3063, 
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    coinBagRaffleStat: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310 + 8,
      sourceTop: 432 + 190 * 7 - 20,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth 
    },
    
    material1: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310,
      sourceTop: 432 + 190,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    material2: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310,
      sourceTop: 432 + 190 * 2,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    material3: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310 + 6,
      sourceTop: 432 + 190 * 3 - 20,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    //todo need actual icon for this
    emptyInventorySlot: {
      sourceWidth: 10,
      sourceHeight: 10,
      sourceLeft: 0,
      sourceTop: 0,
      atlasHeight: inventoryAtlasHeight, atlasWidth: inventoryAtlasWidth
    },
    inventoryItemSlot: {
      sourceWidth: 115,
      sourceHeight: 115,
      sourceLeft: 40,
      sourceTop: 780,
      atlasHeight: inventoryAtlasHeight, atlasWidth: inventoryAtlasWidth
    },
    
    transparent: {
      sourceWidth: 1,
      sourceHeight: 1,
      sourceLeft: 1,
      sourceTop: 1,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    

    gametools: {
      sourceWidth: 134,
      sourceHeight: 110,
      sourceLeft: 3656,
      sourceTop: 316,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    avatarswap: {
      sourceWidth: 134,
      sourceHeight: 124,
      sourceLeft: 3656,
      sourceTop: 420,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    avatarswap_off: {
      sourceWidth: 134,
      sourceHeight: 124,
      sourceLeft: 3656 - 144,
      sourceTop: 420,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    startgame: {
      sourceWidth: 134,
      sourceHeight: 124,
      sourceLeft: 3656,
      sourceTop: 575,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    startgame_off: {
      sourceWidth: 134,
      sourceHeight: 124,
      sourceLeft: 3656 - 144,
      sourceTop: 575,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    summonpet: {
      sourceWidth: 134,
      sourceHeight: 138,
      sourceLeft: 3656,
      sourceTop: 710,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    summonpet_off: {
      sourceWidth: 134,
      sourceHeight: 138,
      sourceLeft: 3656 - 144,
      sourceTop: 710,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    locationicon: {
      sourceWidth: 134,
      sourceHeight: 135,
      sourceLeft: 3656,
      sourceTop: 845,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    locationicon_off: {
      sourceWidth: 134,
      sourceHeight: 135,
      sourceLeft: 3656 - 144,
      sourceTop: 845,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    raffleicon: {
      sourceWidth: 134,
      sourceHeight: 135,
      sourceLeft: 3656,
      sourceTop: 1215,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    raffleicon_off: {
      sourceWidth: 134,
      sourceHeight: 135,
      sourceLeft: 3656 - 144,
      sourceTop: 1345,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    inventoryicon_on: {
      sourceWidth: 134,
      sourceHeight: 120,
      sourceLeft: 3656,
      sourceTop: 1345,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    inventoryicon_off: {
      sourceWidth: 134,
      sourceHeight: 120,
      sourceLeft: 3656 - 144,
      sourceTop: 1215,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    GameGuideicon_on: {
      sourceWidth: 120,
      sourceHeight: 120,
      sourceLeft: 3656,
      sourceTop: 1345+115,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    GameGuideicon_off: {
      sourceWidth: 120,
      sourceHeight: 120,
      sourceLeft: 3656 - 144,
      sourceTop: 1215+115,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    Refreshicon_on: {
      sourceWidth: 120,
      sourceHeight: 120,
      sourceLeft: 3656,
      sourceTop: 1345+115+115,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    Refreshicon_off: {
      sourceWidth: 120,
      sourceHeight: 120,
      sourceLeft: 3656 - 144,
      sourceTop: 1215+115+115,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    LeaderBoardicon_on: {
      sourceWidth: 120,
      sourceHeight: 120,
      sourceLeft: 3656,
      sourceTop: 1345+115+115+115+115,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    LeaderBoardicon_off: {
      sourceWidth: 120,
      sourceHeight: 120,
      sourceLeft: 3656 - 144,
      sourceTop: 1215+115+115+115+115,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    language_on: {
      sourceWidth: 120,
      sourceHeight: 120,
      sourceLeft: 3656,
      sourceTop: 1345+115+115+115+115+115,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    language_off: {
      sourceWidth: 120,
      sourceHeight: 120,
      sourceLeft: 3656 - 144,
      sourceTop: 1215+115+115+115+115+115,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    /*portugal
    brazil
    saudi arabia
    turkey
    spain?
    japan
    korea
    iran
    german
    china*/
    
    language_english: {
      sourceWidth: FLAG_SPACER,
      sourceHeight: FLAG_SPACER,
      sourceLeft: flagSourceLeft,
      sourceTop: flagSourceTop + (FLAG_SPACER*flagSourceCounter++),
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    language_idk: {
      sourceWidth: FLAG_SPACER,
      sourceHeight: FLAG_SPACER,
      sourceLeft: flagSourceLeft,
      sourceTop: flagSourceTop + (FLAG_SPACER*flagSourceCounter++),
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    language_brazil: {
      sourceWidth: FLAG_SPACER,
      sourceHeight: FLAG_SPACER,
      sourceLeft: flagSourceLeft,
      sourceTop: flagSourceTop + (FLAG_SPACER*flagSourceCounter++),
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    language_saudi: {
      sourceWidth: FLAG_SPACER,
      sourceHeight: FLAG_SPACER,
      sourceLeft: flagSourceLeft,
      sourceTop: flagSourceTop + (FLAG_SPACER*flagSourceCounter++),
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    language_turkey: {
      sourceWidth: FLAG_SPACER,
      sourceHeight: FLAG_SPACER,
      sourceLeft: flagSourceLeft,
      sourceTop: flagSourceTop + (FLAG_SPACER*flagSourceCounter++),
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    language_spain: {
      sourceWidth: FLAG_SPACER,
      sourceHeight: FLAG_SPACER,
      sourceLeft: flagSourceLeft,
      sourceTop: flagSourceTop + (FLAG_SPACER*flagSourceCounter++),
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },    
    language_japan: {
      sourceWidth: FLAG_SPACER,
      sourceHeight: FLAG_SPACER,
      sourceLeft: flagSourceLeft,
      sourceTop: flagSourceTop + (FLAG_SPACER*flagSourceCounter++),
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    language_korea: {
      sourceWidth: FLAG_SPACER,
      sourceHeight: FLAG_SPACER,
      sourceLeft: flagSourceLeft,
      sourceTop: flagSourceTop + (FLAG_SPACER*flagSourceCounter++),
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    language_iran: {
      sourceWidth: FLAG_SPACER,
      sourceHeight: FLAG_SPACER,
      sourceLeft: flagSourceLeft,
      sourceTop: flagSourceTop + (FLAG_SPACER*flagSourceCounter++),
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    language_german: {
      sourceWidth: FLAG_SPACER,
      sourceHeight: FLAG_SPACER,
      sourceLeft: flagSourceLeft,
      sourceTop: flagSourceTop + (FLAG_SPACER*flagSourceCounter++),
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    language_china: {
      sourceWidth: FLAG_SPACER,
      sourceHeight: FLAG_SPACER,
      sourceLeft: flagSourceLeft,
      sourceTop: flagSourceTop + (FLAG_SPACER*flagSourceCounter++),
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    Reloginicon_on: {
      sourceWidth: 120,
      sourceHeight: 120,
      sourceLeft: 3656,
      sourceTop: 1345+115+115+115,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    Reloginicon_off: {
      sourceWidth: 120,
      sourceHeight: 120,
      sourceLeft: 3656 - 144,
      sourceTop: 1345+115+115+115,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },

    costRefresh: {
      sourceWidth: 134,
      sourceHeight: 130,
      sourceLeft: 3656 - 144,
      sourceTop: 1092,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    costInfo: {
      sourceWidth: 134,
      sourceHeight: 130,
      sourceLeft: 3656,
      sourceTop: 1092,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    }
  },
  backgrounds: {
    staminaPanel:{
      sourceLeft : 0,
      sourceTop : 3586,
      sourceWidth : 1271,
      sourceHeight : 330,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    expandPanel: {
      sourceWidth: 504,
      sourceHeight: 176,
      sourceLeft: 2368,
      sourceTop: 3316,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    rewardsPanel: {
      sourceWidth: 1210,
      sourceHeight: 1271,
      sourceLeft: 2002,
      sourceTop: 0,//is this right?????
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    
    levelUp: { //in Avatarswap-04.png
      sourceWidth: 380,
      sourceHeight: 480,
      sourceLeft: 1300,
      sourceTop: 60,
      atlasHeight: avatarswapAtlasHeight, atlasWidth: avatarswapAtlasWidth
    },
    emptyPanel:{
      sourceWidth: 2024,
      sourceHeight: 1400,
      sourceLeft: 0,
      sourceTop: 0,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    claimPanel:{
      sourceWidth: 1986,
      sourceHeight: 1271,
      sourceLeft: 0,
      sourceTop: 1601,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    transparent:{
      sourceWidth: 1,
      sourceHeight: 1,
      sourceLeft: 0,
      sourceTop: 0,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    }
  },
  buttons:{
    togglePanel:{
      sourceWidth: 508,
      sourceHeight: 140,
      sourceLeft: 2364,
      sourceTop: 3496,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    primaryRound:{
      sourceLeft : 2035,
      sourceWidth : 660,
      sourceTop : 2585 + 30,
      sourceHeight : 140,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    grayRound:{
      sourceLeft : 2824,
      sourceWidth :360,
      sourceTop : 2414,
      sourceHeight : 140,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    },
    monthlyLeaderboardBtn:{
      sourceWidth: 837,
      sourceHeight: 232,
      sourceLeft: 3052,
      sourceTop: 3713,
      atlasHeight: atlasHeight, atlasWidth: atlasWidth
    }
  }
};
