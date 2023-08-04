const flagSourceLeft = 3680
const flagSourceTop = 2280
let flagSourceCounter = 0
const FLAG_SPACER = 107

export default {
  icons: {
    coin: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310,
      sourceTop: 432+6,
    },
    dimond: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310,
      sourceTop: 432 - 130 - 6,
    },

    rock1: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310,
      sourceTop: 432 + 190,
    },
    rock2: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310,
      sourceTop: 432 + 190 * 2,
    },
    rock3: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310 + 6,
      sourceTop: 432 + 190 * 3 - 20, 
    },


    petro: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310 + 16,
      sourceTop: 432 + 190 * 4 - 20,  
    },

    nitro: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310 + 16,
      sourceTop: 432 + 190 * 5 - 20, 
    },

    bronze: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310 + 8,
      sourceTop: 432 + 190 * 6 - 20, 
    },

    bronzeShoe: {
      sourceWidth: 255,
      sourceHeight: 255,
      sourceLeft: 1716,
      sourceTop: 3063, 
    },

    material1: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310,
      sourceTop: 432 + 190,
    },

    material2: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310,
      sourceTop: 432 + 190 * 2,
    },

    material3: {
      sourceWidth: 155,
      sourceHeight: 155,
      sourceLeft: 3310 + 6,
      sourceTop: 432 + 190 * 3 - 20,
    },

    //todo need actual icon for this
    emptyInventorySlot: {
      sourceWidth: 10,
      sourceHeight: 10,
      sourceLeft: 0,
      sourceTop: 0,
    },
    inventoryItemSlot: {
      sourceWidth: 115,
      sourceHeight: 115,
      sourceLeft: 40,
      sourceTop: 780,
    },
    

    gametools: {
      sourceWidth: 134,
      sourceHeight: 110,
      sourceLeft: 3656,
      sourceTop: 316,
    },

    avatarswap: {
      sourceWidth: 134,
      sourceHeight: 124,
      sourceLeft: 3656,
      sourceTop: 420,
    },
    avatarswap_off: {
      sourceWidth: 134,
      sourceHeight: 124,
      sourceLeft: 3656 - 144,
      sourceTop: 420,
    },

    startgame: {
      sourceWidth: 134,
      sourceHeight: 124,
      sourceLeft: 3656,
      sourceTop: 575,
    },

    startgame_off: {
      sourceWidth: 134,
      sourceHeight: 124,
      sourceLeft: 3656 - 144,
      sourceTop: 575,
    },

    summonpet: {
      sourceWidth: 134,
      sourceHeight: 138,
      sourceLeft: 3656,
      sourceTop: 710,
    },

    summonpet_off: {
      sourceWidth: 134,
      sourceHeight: 138,
      sourceLeft: 3656 - 144,
      sourceTop: 710,
    },
    locationicon: {
      sourceWidth: 134,
      sourceHeight: 135,
      sourceLeft: 3656,
      sourceTop: 845,
    },

    locationicon_off: {
      sourceWidth: 134,
      sourceHeight: 135,
      sourceLeft: 3656 - 144,
      sourceTop: 845,
    },
    raffleicon: {
      sourceWidth: 134,
      sourceHeight: 135,
      sourceLeft: 3656,
      sourceTop: 1215,
    },

    raffleicon_off: {
      sourceWidth: 134,
      sourceHeight: 135,
      sourceLeft: 3656 - 144,
      sourceTop: 1345,
    },

    inventoryicon_on: {
      sourceWidth: 134,
      sourceHeight: 120,
      sourceLeft: 3656,
      sourceTop: 1345,
    },

    inventoryicon_off: {
      sourceWidth: 134,
      sourceHeight: 120,
      sourceLeft: 3656 - 144,
      sourceTop: 1215,
    },

    GameGuideicon_on: {
      sourceWidth: 120,
      sourceHeight: 120,
      sourceLeft: 3656,
      sourceTop: 1345+115,
    },

    GameGuideicon_off: {
      sourceWidth: 120,
      sourceHeight: 120,
      sourceLeft: 3656 - 144,
      sourceTop: 1215+115,
    },

    Refreshicon_on: {
      sourceWidth: 120,
      sourceHeight: 120,
      sourceLeft: 3656,
      sourceTop: 1345+115+115,
    },

    Refreshicon_off: {
      sourceWidth: 120,
      sourceHeight: 120,
      sourceLeft: 3656 - 144,
      sourceTop: 1215+115+115,
    },

    LeaderBoardicon_on: {
      sourceWidth: 120,
      sourceHeight: 120,
      sourceLeft: 3656,
      sourceTop: 1345+115+115+115+115,
    },

    LeaderBoardicon_off: {
      sourceWidth: 120,
      sourceHeight: 120,
      sourceLeft: 3656 - 144,
      sourceTop: 1215+115+115+115+115,
    },

    language_on: {
      sourceWidth: 120,
      sourceHeight: 120,
      sourceLeft: 3656,
      sourceTop: 1345+115+115+115+115+115,
    },

    language_off: {
      sourceWidth: 120,
      sourceHeight: 120,
      sourceLeft: 3656 - 144,
      sourceTop: 1215+115+115+115+115+115,
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
    },
    language_idk: {
      sourceWidth: FLAG_SPACER,
      sourceHeight: FLAG_SPACER,
      sourceLeft: flagSourceLeft,
      sourceTop: flagSourceTop + (FLAG_SPACER*flagSourceCounter++),
    },
    language_brazil: {
      sourceWidth: FLAG_SPACER,
      sourceHeight: FLAG_SPACER,
      sourceLeft: flagSourceLeft,
      sourceTop: flagSourceTop + (FLAG_SPACER*flagSourceCounter++),
    },
    language_saudi: {
      sourceWidth: FLAG_SPACER,
      sourceHeight: FLAG_SPACER,
      sourceLeft: flagSourceLeft,
      sourceTop: flagSourceTop + (FLAG_SPACER*flagSourceCounter++),
    },
    language_turkey: {
      sourceWidth: FLAG_SPACER,
      sourceHeight: FLAG_SPACER,
      sourceLeft: flagSourceLeft,
      sourceTop: flagSourceTop + (FLAG_SPACER*flagSourceCounter++),
    },
    language_spain: {
      sourceWidth: FLAG_SPACER,
      sourceHeight: FLAG_SPACER,
      sourceLeft: flagSourceLeft,
      sourceTop: flagSourceTop + (FLAG_SPACER*flagSourceCounter++),
    },    
    language_japan: {
      sourceWidth: FLAG_SPACER,
      sourceHeight: FLAG_SPACER,
      sourceLeft: flagSourceLeft,
      sourceTop: flagSourceTop + (FLAG_SPACER*flagSourceCounter++),
    },
    language_korea: {
      sourceWidth: FLAG_SPACER,
      sourceHeight: FLAG_SPACER,
      sourceLeft: flagSourceLeft,
      sourceTop: flagSourceTop + (FLAG_SPACER*flagSourceCounter++),
    },
    language_iran: {
      sourceWidth: FLAG_SPACER,
      sourceHeight: FLAG_SPACER,
      sourceLeft: flagSourceLeft,
      sourceTop: flagSourceTop + (FLAG_SPACER*flagSourceCounter++),
    },
    language_german: {
      sourceWidth: FLAG_SPACER,
      sourceHeight: FLAG_SPACER,
      sourceLeft: flagSourceLeft,
      sourceTop: flagSourceTop + (FLAG_SPACER*flagSourceCounter++),
    },
    language_china: {
      sourceWidth: FLAG_SPACER,
      sourceHeight: FLAG_SPACER,
      sourceLeft: flagSourceLeft,
      sourceTop: flagSourceTop + (FLAG_SPACER*flagSourceCounter++),
    },
    Reloginicon_on: {
      sourceWidth: 120,
      sourceHeight: 120,
      sourceLeft: 3656,
      sourceTop: 1345+115+115+115,
    },

    Reloginicon_off: {
      sourceWidth: 120,
      sourceHeight: 120,
      sourceLeft: 3656 - 144,
      sourceTop: 1345+115+115+115,
    },

    costRefresh: {
      sourceWidth: 134,
      sourceHeight: 130,
      sourceLeft: 3656 - 144,
      sourceTop: 1092,
    },
    costInfo: {
      sourceWidth: 134,
      sourceHeight: 130,
      sourceLeft: 3656,
      sourceTop: 1092,
    }
  },
  backgrounds: {
    expandPanel: {
      sourceWidth: 504,
      sourceHeight: 176,
      sourceLeft: 2368,
      sourceTop: 3316,
    },
    levelUp: { //in Avatarswap-04.png
      sourceWidth: 380,
      sourceHeight: 480,
      sourceLeft: 1300,
      sourceTop: 60,
    },
    emptyPanel:{
      sourceWidth: 2024,
      sourceHeight: 1400,
      sourceLeft: 0,
      sourceTop: 0,
    }
  },
};
