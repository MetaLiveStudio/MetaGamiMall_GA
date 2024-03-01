import { log } from "../back-ports/backPorts";
import { namespaces } from "./i18n.constants";


//ENGLISH IS OUR CORE SOURCE LANGUAGE
export const en = {
  [namespaces.common]: {
    button: {
      ok: "OK",
      cancel: "Cancel", //T,
      claim: "Claim", //T,
      tradeFloorPrice: "Trade (Floor price: {{floorPrice}} MANA)",
      tradeFloorPriceGoToMarketPlace: "Click Here to View in DCL Marketplace",
      raffleCoinBagHowItWorks: "How does it work?", //T,
      raffleViewEntries: "View Entries", //T,
    },
    title:{
      cost:"Cost",
      costToUpper:"COST"
    }
  },
  [namespaces.ui.languages]: {
    "english":"English",
    "chinese":"Chinese",
    "german":"German",
    "japenese":"Japenese",
    "korean":"Korean",
    "spanish":"Spanish",

    "turkey":"Turkey",
    "saudi":"Saudi",
    "portuguese":"Portuguese",
    "iran":"Iran",
  },
  [namespaces.pages.hello]: {
    welcome: "Welcome",
    deep:{
      look:"Deep Look"
    },
    closePoster: "Close"
    //"key": "{{what}} is {{how}}"
  },
  [namespaces.pages.npc]: {
    m2dmsg1 :  "Hello.  I am your personal teleporter and guide to Meta GamiMall.",
    m2dWelcome: "Hey, Welcome to MetaGamiMall!!!", //T,
    m2dHelp: "How may I help? ",
  },
  [namespaces.ui.staminaPanel]: { 
    bonusDisplay: "Bonus: {{value}}%",
    deep:{
      look:"Deep Look stamina Panel!"
    },
    dailyCap:{ 
      test:"test daily",
      notMet:"Daily Cap {{currentValue}}/{{maxValue}} ({{remainingValue}} till max) {{currentPercent}}%",
      hit: "Daily Cap {{maxValue}} HIT!  Collect Ability Reduced to {{collectionRate}}%" //+ ";"+val
    },
    levelDisplay: "Level {{currentValue}} ({{remainingValue}} till next) {{currentPercent}}%" //+ "
  },
  [namespaces.ui.sideButton]: {
    visitGamiMall: "Visit MetaGamiMall", //T,
    avatarSwap: "Avatar Swap", //T,
    summonPet: "Summon Pet", //T,
    locationButton: "Location", //T,
    raffleButton: "Raffle", //T,
    inventoryButton: "Inventory", //T,
    gameGuide: "Game Guide", //T,
    reloginButton: "Relogin", //T,
    refreshSave: "Refresh&Save", //T,
    gameTool: "Game Tools", //T,
    showLvlLeaderBoard: "Levelboard", //T,
    showMonthLeaderBoard: "Monthly Coins\nLeaderboard", //T,
    language: "Language", //T,
  },
  [namespaces.ui.locationButton]: {
    zone: "Zone 1",
    tpPoint: "Entrance",
    muscleSquare: "Muscle Square", //T,
    moonSquare: "Moon Square", //T,
    marsSquare: "Mars Square", //T,
    heavenSquare: "Heaven Square", //T, 
    rewardCenter: "Reward Center", //T,
  },
  [namespaces.ui.prompts]: { 
    checkingLatestPrices: "Checking Latest Prices...",
    checkingLatestMarketPriceUI: "Checking Latest Market Prices...",
    stockNotAvailable: "(Stock Not Available)", //T
    attemptRelogin: "Attempting Re-Login", //T
    pickLanuage: "Pick Lanuage", //T
    closeAutomaticallyCountdown: "Will close automatically in {{timeLeftSeconds}} seconds",
    howToBuyCoinNMaterialsWithMana: "How to buy coins & materials with cheap MANA?", 
  },
  [namespaces.ui.hovers]: { 
    hoverSensorium: "Go to Sensorium Stage Party", //T,
    hoverVisitMGMPlanetStage:"Visit MetaGamiMall Planet Stage", //T,
    hoverPoster: "Read Game Guide", //T,
    hoverMuscle: "Go to Muscle Square", //T,
    hoverMineField: "Go to Farm Rocks", //T,
    hoverMoon: "Go to Moon Square", //T,
    hoverMars: "Go to Mars Square", //T,
    hoverHeaven: "Go to Heaven Square", //T,
    hoverEntrance: "Go to Entrance Teleport Point", //T,
    hoverReward: "Teleport and check brand rewards at the Rewards Center", //T,
    hoverBrand: "Teleport to brand's shop", //T,
    hoverTwitter: "Check Brand's Twitter", //T,
    hoverWeb: "Check Brand's Website", //T,
    hoverDiscord: "Check Brand's Discord", //T,
    hoverMGMWeb: "Check more information on website about MetaDoge", //T
  },
  [namespaces.ui.raffle]: { 
    raffleTitle: "Play Raffle", //T,
    raffleText: "Are you feeling lucky!?\n"+
    "It costs 100 LilCoins To Play.\n"
    +"Increase your bet with the multiplier.\n "
    +"\nPlay for a chance to win up to double your bet.", //T,

    rafflePlay: "Play", //T,
    raffleCancel: "Cancel", //T,
    raffleResult: "RESULTS", //T,
    raffleLoading: "Loading...", //T,
    raffleOK: "OK", //T,
    raffleNoMoney: "You do not have enough to play :(", //T,
    raffleLost: "You lost", //T,
    raffleEven: "You broke even :)", //T,
    raffleWon: "You Won", //T
  },
};


log("language.en",en)


//START OUR TRANSLATIONS
//START OUR TRANSLATIONS
//START OUR TRANSLATIONS

export const de = {
  "common": {
    "button": {
      "ok": "OK",
      "cancel": "Stornieren",
      "claim": "Beanspruchen"
    },
    "title": {
      "cost": "Kosten",
      "costToUpper": "KOSTEN"
    }
  },
  "ui.languages": {
    "english": "Englisch",
    "chinese": "Chinesisch",
    "german": "Deutsch",
    "japenese": "Japanisch",
    "korean": "Koreanisch",
    "spanish": "Spanisch",
    "turkey": "Truthahn",
    "saudi": "Saudi-Arabien",
    "portuguese": "Portugiesisch",
    "iran": "Iran"
  },
  "translation": {
    "welcome": "Willkommen",
    "deep": {
      "look": "Tiefer Blick"
    },
    "closePoster": "Kleiderschrank"
  },
  "npc": {
    "m2dmsg1": "Hallo. ",
    "m2dWelcome": "Hey, Willkommen bei MetaGamiMall!!!",
    "m2dHelp": "Wie kann ich helfen? "
  },
  "ui.staminaPanel": {
    "bonusDisplay": "Bonus: {{value}}%",
    "deep": {
      "look": "Schauen Sie sich das Ausdauer-Panel genau an!"
    },
    "dailyCap": {
      "test": "täglich testen",
      "notMet": "Tägliche Obergrenze {{currentValue}}/{{maxValue}} ({{remainingValue}} bis max) {{currentPercent}}%",
      "hit": "Tägliche Obergrenze {{maxValue}} SCHLAG!  {{collectionRate}}%"
    },
    "levelDisplay": "Eben {{currentValue}} ({{remainingValue}} bis zum nächsten) {{currentPercent}}%"
  },
  "ui.sideButton": {
    "avatarSwap": "Avatar-Tausch",
    "summonPet": "Haustier beschwören",
    "locationButton": "Standort",
    "raffleButton": "Verlosen",
    "inventoryButton": "Inventar",
    "gameGuide": "Spielanleitung",
    "reloginButton": "Erneut anmelden",
    "refreshSave": "Aktualisierung",
    "gameTool": "Spieltools",
    "showLvlLeaderBoard": "Level-Rangliste",
    "language": "Sprache"
  },
  "ui.locationButton": {
    "zone": "Zone 1",
    "tpPoint": "Eingang",
    "muscleSquare": "Muskelquadrat",
    "moonSquare": "Mondquadrat",
    "marsSquare": "Marsplatz",
    "heavenSquare": "Himmelsplatz",
    "rewardCenter": "Belohnungszentrum"
  },
  "ui.prompts": {
    "checkingLatestPrices": "Aktuelle Preise prüfen...",
    "stockNotAvailable": "(Lagerbestand nicht verfügbar)",
    "attemptRelogin": "Es wird versucht, sich erneut anzumelden",
    "pickLanuage": "Wählen Sie Sprache"
  },
  "ui.hovers": {
    "hoverSensorium": "Gehen Sie zur Sensorium Stage Party",
    "hoverVisitMGMPlanetStage": "Besuchen Sie die MetaGamiMall Planet Stage",
    "hoverPoster": "Erweitern Sie das Poster",
    "hoverMuscle": "Gehen Sie zum Muscle Square",
    "hoverMoon": "Gehen Sie zum Mondplatz",
    "hoverMars": "Gehen Sie zum Marsplatz",
    "hoverHeaven": "Gehen Sie zum Himmelsplatz",
    "hoverEntrance": "Gehen Sie zum Eingangsteleportpunkt",
    "hoverReward": "Teleportieren Sie sich und überprüfen Sie Markenprämien im Rewards Center",
    "hoverBrand": "Teleportiere dich zum Shop der Marke",
    "hoverTwitter": "Schauen Sie sich Brands Twitter an",
    "hoverWeb": "Überprüfen Sie die Website der Marke",
    "hoverDiscord": "Überprüfen Sie Brands Discord",
    "hoverMGMWeb": "Weitere Informationen finden Sie auf der Website zu MetaDoge"
  },
  "ui.raffle": {
    "raffleTitle": "Spielen Sie Tombola",
    "raffleText": "Fühlst du dich glücklich!?\n",
    "rafflePlay": "Spielen",
    "raffleCancel": "Stornieren",
    "raffleResult": "ERGEBNISSE",
    "raffleLoading": "Wird geladen...",
    "raffleOK": "OK",
    "raffleNoMoney": "Du hast nicht genug zum Spielen :(",
    "raffleLost": "Du hast verloren",
    "raffleEven": "Du hast die Gewinnschwelle erreicht :)",
    "raffleWon": "Du hast gewonnen"
  }
}

export const tr = {
  "common": {
    "button": {
      "ok": "TAMAM",
      "cancel": "İptal etmek",
      "claim": "İddia"
    },
    "title": {
      "cost": "Maliyet",
      "costToUpper": "MALİYET"
    }
  },
  "ui.languages": {
    "english": "İngilizce",
    "chinese": "Çince",
    "german": "Almanca",
    "japenese": "Japon",
    "korean": "Koreli",
    "spanish": "İspanyol",
    "turkey": "Türkiye",
    "saudi": "Suudi",
    "portuguese": "Portekizce",
    "iran": "İran"
  },
  "translation": {
    "welcome": "Hoş geldin",
    "deep": {
      "look": "Derin Bakış"
    },
    "closePoster": "Kapat"
  },
  "npc": {
    "m2dmsg1": "Merhaba. ",
    "m2dWelcome": "Hey, MetaGamiMall'a Hoş Geldiniz!!!",
    "m2dHelp": "Nasıl yardımcı olabilirim? "
  },
  "ui.staminaPanel": {
    "bonusDisplay": "Bonus: {{value}}%",
    "deep": {
      "look": "Derin Bakış dayanıklılık Paneli!"
    },
    "dailyCap": {
      "test": "günlük test",
      "notMet": "Günlük Sınır {{currentValue}}/{{maxValue}} ({{remainingValue}} maksimuma kadar) {{currentPercent}}%",
      "hit": "Günlük Sınır {{maxValue}} VURMAK!  {{collectionRate}}%"
    },
    "levelDisplay": "Seviye {{currentValue}} ({{remainingValue}} bir sonrakine kadar) {{currentPercent}}%"
  },
  "ui.sideButton": {
    "avatarSwap": "Avatar Değiştirme",
    "summonPet": "Evcil Hayvanı Çağır",
    "locationButton": "Konum",
    "raffleButton": "Çekiliş",
    "inventoryButton": "Envanter",
    "gameGuide": "Oyun Kılavuzu",
    "reloginButton": "Tekrar-giriş",
    "refreshSave": "Yenile",
    "gameTool": "Oyun Araçları",
    "showLvlLeaderBoard": "Seviye Skor Tahtası",
    "language": "Dil"
  },
  "ui.locationButton": {
    "zone": "1. Bölge",
    "tpPoint": "giriş",
    "muscleSquare": "Kas Meydanı",
    "moonSquare": "Ay Meydanı",
    "marsSquare": "Mars Meydanı",
    "heavenSquare": "Cennet Meydanı",
    "rewardCenter": "Ödül Merkezi"
  },
  "ui.prompts": {
    "checkingLatestPrices": "Son Fiyatlar Kontrol Ediliyor...",
    "stockNotAvailable": "(Stok Mevcut Değil)",
    "attemptRelogin": "Yeniden Oturum Açmayı Denemek",
    "pickLanuage": "Dil Seç"
  },
  "ui.hovers": {
    "hoverSensorium": "Sensorium Sahne Partisine Git",
    "hoverVisitMGMPlanetStage": "MetaGamiMall Planet Stage'i ziyaret edin",
    "hoverPoster": "Posteri genişlet",
    "hoverMuscle": "Kas Meydanı'na git",
    "hoverMoon": "Ay Meydanı'na git",
    "hoverMars": "Mars Meydanı'na git",
    "hoverHeaven": "Cennet Meydanı'na git",
    "hoverEntrance": "Giriş Işınlanma Noktasına Git",
    "hoverReward": "Ödül Merkezinde marka ödüllerini ışınlayın ve kontrol edin",
    "hoverBrand": "Markanın mağazasına ışınlan",
    "hoverTwitter": "Markanın Twitter'ını Kontrol Edin",
    "hoverWeb": "Markanın Web Sitesini Kontrol Edin",
    "hoverDiscord": "Marka Anlaşmazlığını Kontrol Edin",
    "hoverMGMWeb": "MetaDoge hakkında web sitesinde daha fazla bilgi kontrol edin"
  },
  "ui.raffle": {
    "raffleTitle": "Çekiliş Oyna",
    "raffleText": "Kendinizi şanslı hissediyor musunuz?\n",
    "rafflePlay": "Oynamak",
    "raffleCancel": "İptal etmek",
    "raffleResult": "SONUÇLAR",
    "raffleLoading": "Yükleniyor...",
    "raffleOK": "TAMAM",
    "raffleNoMoney": "oynamaya doymuyorsun :(",
    "raffleLost": "Kaybettin",
    "raffleEven": "kırdın bile :)",
    "raffleWon": "Kazandın"
  }
}

export const it = {
  "common": {
    "button": {
      "ok": "OK",
      "cancel": "Annulla",
      "claim": "Reclamo"
    },
    "title": {
      "cost": "Costo",
      "costToUpper": "COSTO"
    }
  },
  "ui.languages": {
    "english": "Inglese",
    "chinese": "Cinese",
    "german": "Tedesco",
    "japenese": "giapponese",
    "korean": "coreano",
    "spanish": "spagnolo",
    "turkey": "Tacchino",
    "saudi": "saudita",
    "portuguese": "portoghese",
    "iran": "Iran"
  },
  "translation": {
    "welcome": "Benvenuto",
    "deep": {
      "look": "Sguardo Profondo"
    },
    "closePoster": "Guardaroba"
  },
  "npc": {
    "m2dmsg1": "Ciao. ",
    "m2dWelcome": "Ehi, benvenuto su MetaGamiMall!!!",
    "m2dHelp": "Come posso aiutare? "
  },
  "ui.staminaPanel": {
    "bonusDisplay": "Bonus: {{value}}%",
    "deep": {
      "look": "Pannello di resistenza Deep Look!"
    },
    "dailyCap": {
      "test": "prova giornalmente",
      "notMet": "Tappo giornaliero {{currentValue}}/{{maxValue}} ({{remainingValue}} fino al massimo) {{currentPercent}}%",
      "hit": "Tappo giornaliero {{maxValue}} COLPO!  {{collectionRate}}%"
    },
    "levelDisplay": "Livello {{currentValue}} ({{remainingValue}} fino al prossimo) {{currentPercent}}%"
  },
  "ui.sideButton": {
    "avatarSwap": "Scambio avatar",
    "summonPet": "Evoca animale domestico",
    "locationButton": "Posizione",
    "raffleButton": "Lotteria",
    "inventoryButton": "Inventario",
    "gameGuide": "Guida al gioco",
    "reloginButton": "Accedi nuovamente",
    "refreshSave": "ricaricare",
    "gameTool": "Strumenti di gioco",
    "showLvlLeaderBoard": "Classifica di livello",
    "language": "Lingua"
  },
  "ui.locationButton": {
    "zone": "Zona 1",
    "tpPoint": "Entrata",
    "muscleSquare": "Quadrato muscolare",
    "moonSquare": "Piazza Luna",
    "marsSquare": "Piazza Marte",
    "heavenSquare": "Piazza del Cielo",
    "rewardCenter": "Centro premi"
  },
  "ui.prompts": {
    "checkingLatestPrices": "Controllo degli ultimi prezzi...",
    "stockNotAvailable": "(Stock non disponibile)",
    "attemptRelogin": "Tentativo di nuovo accesso",
    "pickLanuage": "Scegli Lingua"
  },
  "ui.hovers": {
    "hoverSensorium": "Vai al Sensorium Stage Party",
    "hoverVisitMGMPlanetStage": "Visita MetaGamiMall Planet Stage",
    "hoverPoster": "Espandi il poster",
    "hoverMuscle": "Vai a Muscle Square",
    "hoverMoon": "Vai a Moon Square",
    "hoverMars": "Vai a Piazza Marte",
    "hoverHeaven": "Vai a Heaven Square",
    "hoverEntrance": "Vai al punto di teletrasporto d'ingresso",
    "hoverReward": "Teletrasporta e controlla le ricompense del marchio nel Centro premi",
    "hoverBrand": "Teletrasportati al negozio del marchio",
    "hoverTwitter": "Controlla il Twitter di Brand",
    "hoverWeb": "Controlla il sito Web del marchio",
    "hoverDiscord": "Controlla la discordia del marchio",
    "hoverMGMWeb": "Controlla maggiori informazioni sul sito web su MetaDoge"
  },
  "ui.raffle": {
    "raffleTitle": "Gioca a lotteria",
    "raffleText": "Ti senti fortunato!?\n",
    "rafflePlay": "Giocare",
    "raffleCancel": "Annulla",
    "raffleResult": "RISULTATI",
    "raffleLoading": "Caricamento...",
    "raffleOK": "OK",
    "raffleNoMoney": "Non hai abbastanza per giocare :(",
    "raffleLost": "Hai perso",
    "raffleEven": "Sei andato in pareggio :)",
    "raffleWon": "Hai vinto"
  }
}

export const es = {
  "common": {
    "button": {
      "ok": "DE ACUERDO",
      "cancel": "Cancelar",
      "claim": "Afirmar"
    },
    "title": {
      "cost": "Costo",
      "costToUpper": "COSTO"
    }
  },
  "ui.languages": {
    "english": "Inglés",
    "chinese": "Chino",
    "german": "Alemán",
    "japenese": "japonés",
    "korean": "coreano",
    "spanish": "Español",
    "turkey": "Pavo",
    "saudi": "Arabia Saudita",
    "portuguese": "portugués",
    "iran": "Irán"
  },
  "translation": {
    "welcome": "Bienvenido",
    "deep": {
      "look": "mirada profunda"
    },
    "closePoster": "Armario"
  },
  "npc": {
    "m2dmsg1": "Hola. ",
    "m2dWelcome": "¡Hola, bienvenido a MetaGamiMall!",
    "m2dHelp": "¿Cómo puedo ayudar? "
  },
  "ui.staminaPanel": {
    "bonusDisplay": "Prima: {{value}}%",
    "deep": {
      "look": "¡Panel de resistencia Deep Look!"
    },
    "dailyCap": {
      "test": "prueba diaria",
      "notMet": "Límite diario {{currentValue}}/{{maxValue}} ({{remainingValue}} hasta el máximo) {{currentPercent}}%",
      "hit": "Límite diario {{maxValue}} ¡GOLPEAR!  {{collectionRate}}%"
    },
    "levelDisplay": "Nivel {{currentValue}} ({{remainingValue}} hasta la próxima) {{currentPercent}}%"
  },
  "ui.sideButton": {
    "avatarSwap": "Intercambio de avatares",
    "summonPet": "Invocar mascota",
    "locationButton": "Ubicación",
    "raffleButton": "Rifa",
    "inventoryButton": "Inventario",
    "gameGuide": "Guía de juego",
    "reloginButton": "Volver a iniciar sesión",
    "refreshSave": "Actualizar",
    "gameTool": "Herramientas de juego",
    "showLvlLeaderBoard": "Tabla de clasificación de nivel",
    "language": "Idioma"
  },
  "ui.locationButton": {
    "zone": "Zona 1",
    "tpPoint": "Entrada",
    "muscleSquare": "Plaza del músculo",
    "moonSquare": "Plaza de la luna",
    "marsSquare": "Plaza de Marte",
    "heavenSquare": "plaza del cielo",
    "rewardCenter": "Centro de recompensas"
  },
  "ui.prompts": {
    "checkingLatestPrices": "Comprobando los últimos precios...",
    "stockNotAvailable": "(Stock no disponible)",
    "attemptRelogin": "Intentar volver a iniciar sesión",
    "pickLanuage": "Elegir idioma"
  },
  "ui.hovers": {
    "hoverSensorium": "Ir a la fiesta del escenario Sensorium",
    "hoverVisitMGMPlanetStage": "Visite el escenario del planeta MetaGamiMall",
    "hoverPoster": "Ampliar el cartel",
    "hoverMuscle": "Ir a la Plaza del Músculo",
    "hoverMoon": "Ir a la Plaza de la Luna",
    "hoverMars": "Ir a la Plaza de Marte",
    "hoverHeaven": "Ir a la Plaza del Cielo",
    "hoverEntrance": "Ir al punto de teletransporte de entrada",
    "hoverReward": "Teletranspórtate y comprueba las recompensas de la marca en el Centro de recompensas",
    "hoverBrand": "Teletransportarse a la tienda de la marca.",
    "hoverTwitter": "Consulta el Twitter de la marca",
    "hoverWeb": "Consulte el sitio web de la marca",
    "hoverDiscord": "Compruebe la discordia de la marca",
    "hoverMGMWeb": "Consulte más información en el sitio web sobre MetaDoge"
  },
  "ui.raffle": {
    "raffleTitle": "jugar sorteo",
    "raffleText": "¿¡Te sientes afortunado!?\n",
    "rafflePlay": "Jugar",
    "raffleCancel": "Cancelar",
    "raffleResult": "RESULTADOS",
    "raffleLoading": "Cargando...",
    "raffleOK": "DE ACUERDO",
    "raffleNoMoney": "No tienes suficiente para jugar :(",
    "raffleLost": "Perdiste",
    "raffleEven": "Rompiste incluso :)",
    "raffleWon": "Ganaste"
  }
}

export const sa = {
  "common": {
    "button": {
      "ok": "अस्तु",
      "cancel": "निरसयतु",
      "claim": "अभ्यर्थना"
    },
    "title": {
      "cost": "मूल्यम्‌",
      "costToUpper": "मूल्यम्‌"
    }
  },
  "ui.languages": {
    "english": "आंग्ल",
    "chinese": "चीनी",
    "german": "जर्मन",
    "japenese": "जपेनीज",
    "korean": "कोरियाई",
    "spanish": "स्पेनी भाषा",
    "turkey": "तुर्की",
    "saudi": "सऊदी",
    "portuguese": "पुर्तगाली",
    "iran": "इरान्"
  },
  "translation": {
    "welcome": "स्वागतम्‌",
    "deep": {
      "look": "गहनं पश्यन्तु"
    },
    "closePoster": "पायुक्षालनभूमि"
  },
  "npc": {
    "m2dmsg1": "नमस्ते। ",
    "m2dWelcome": "हे, मेटागामीमॉल इत्यत्र भवतः स्वागतम् !!!",
    "m2dHelp": "अहं कथं साहाय्यं कर्तुं शक्नोमि ? "
  },
  "ui.staminaPanel": {
    "bonusDisplay": "बोनसः : १. {{value}}%",
    "deep": {
      "look": "डीप लुक स्टेमिना पैनल!"
    },
    "dailyCap": {
      "test": "प्रतिदिनं परीक्षणं कुर्वन्तु",
      "notMet": "दैनिक कैप {{currentValue}}/ .{{maxValue}} ({{remainingValue}} अधिकतमं यावत्) {{currentPercent}}% .",
      "hit": "दैनिक कैप {{maxValue}} ताडनम्‌!  {{collectionRate}}% ."
    },
    "levelDisplay": "स्तर {{currentValue}} ({{remainingValue}} अग्रिमपर्यन्तं) {{currentPercent}}% ."
  },
  "ui.sideButton": {
    "avatarSwap": "अवतार स्वैप",
    "summonPet": "आहूत पालतू",
    "locationButton": "स्थानीय",
    "raffleButton": "रैफल्स",
    "inventoryButton": "वस्तुपरिसङ्ख्या",
    "gameGuide": "गेम गाइड",
    "reloginButton": "पुनः प्रवेशः",
    "refreshSave": "ताजगी",
    "gameTool": "गेम टूल्स",
    "showLvlLeaderBoard": "स्तर लीडरबोर्ड",
    "language": "भाषा"
  },
  "ui.locationButton": {
    "zone": "क्षेत्रम् १",
    "tpPoint": "प्रवेश",
    "muscleSquare": "मांसपेशी वर्ग",
    "moonSquare": "चन्द्रचतुष्कोण",
    "marsSquare": "मंगलचतुष्कोण",
    "heavenSquare": "स्वर्गचतुष्कोण",
    "rewardCenter": "पुरस्कार केन्द्र"
  },
  "ui.prompts": {
    "checkingLatestPrices": "नवीनतममूल्यानि जाँच...",
    "stockNotAvailable": "(स्टॉकः उपलब्धः नास्ति)",
    "attemptRelogin": "पुनः प्रवेशस्य प्रयासः",
    "pickLanuage": "भाषां चिनुत"
  },
  "ui.hovers": {
    "hoverSensorium": "Sensorium Stage Party इत्यत्र गच्छन्तु",
    "hoverVisitMGMPlanetStage": "मेटागामीमॉल ग्रह मंच पर जाएँ",
    "hoverPoster": "पोस्टरस्य विस्तारं कुर्वन्तु",
    "hoverMuscle": "मांसपेशीचतुष्कं गच्छन्तु",
    "hoverMoon": "चन्द्रचतुष्कं गच्छन्तु",
    "hoverMars": "मंगलचतुष्कं गच्छन्तु",
    "hoverHeaven": "स्वर्गचतुष्कं गच्छतु",
    "hoverEntrance": "प्रवेशद्विवाहनबिन्दुं गच्छन्तु",
    "hoverReward": "पुरस्कारकेन्द्रे दूरवाणीं कृत्वा ब्राण्ड् पुरस्कारं पश्यन्तु",
    "hoverBrand": "ब्राण्डस्य दुकानं प्रति दूरवाणीं कुर्वन्तु",
    "hoverTwitter": "ब्राण्ड् इत्यस्य ट्विट्टर् पश्यन्तु",
    "hoverWeb": "ब्राण्ड् इत्यस्य वेबसाइट् पश्यन्तु",
    "hoverDiscord": "ब्राण्डस्य विवादं पश्यन्तु",
    "hoverMGMWeb": "MetaDoge इत्यस्य विषये अधिकाधिकं सूचनां वेबसाइट् मध्ये पश्यन्तु"
  },
  "ui.raffle": {
    "raffleTitle": "रैफल् क्रीडन्तु",
    "raffleText": "किं भवन्तः भाग्यवन्तः इति अनुभवन्ति!?\n",
    "rafflePlay": "क्रीडतु",
    "raffleCancel": "निरसयतु",
    "raffleResult": "परिणामाः",
    "raffleLoading": "लोडिंग...",
    "raffleOK": "अस्तु",
    "raffleNoMoney": "भवतः क्रीडनार्थं पर्याप्तं नास्ति :(",
    "raffleLost": "त्वं हारितवान्",
    "raffleEven": "त्वं समं भग्नवान् :)",
    "raffleWon": "त्वं जितवान्"
  }
}

export const zh = {
  "common": {
    "button": {
      "ok": "好的",
      "cancel": "取消",
      "claim": "领取"
    },
    "title": {
      "cost": "花费",
      "costToUpper": "花费"
    }
  },
  "ui.languages": {
    "english": "英语",
    "chinese": "中文",
    "german": "德语",
    "japenese": "日语",
    "korean": "韩语",
    "spanish": "西班牙语",
    "turkey": "土耳其语",
    "saudi": "沙特阿拉伯",
    "portuguese": "葡萄牙语",
    "iran": "伊朗语"
  },
  "translation": {
    "welcome": "欢迎",
    "deep": {
      "look": "深看"
    },
    "closePoster": "关闭"
  },
  "npc": {
    "m2dmsg1": "你好。 ",
    "m2dWelcome": "您好，欢迎来到 MetaGamiMall！！！",
    "m2dHelp": "我能提供什么帮助？ "
  },
  "ui.staminaPanel": {
    "bonusDisplay": "金币加成： {{value}}%",
    "deep": {
      "look": "深入查看面板！"
    },
    "dailyCap": {
      "test": "每天测试",
      "notMet": "每日全额金币上限 {{currentValue}}/{{maxValue}} (还有{{remainingValue}} 到达上限） {{currentPercent}}%",
      "hit": "每日上限 {{maxValue}} 已达到！  {{collectionRate}}%"
    },
    "levelDisplay": "当前等级 {{currentValue}} (还要{{remainingValue}} 到下一级） {{currentPercent}}%"
  },
  "ui.sideButton": {
    "avatarSwap": "变身",
    "summonPet": "召唤宠物",
    "locationButton": "地图",
    "raffleButton": "金币抽奖",
    "inventoryButton": "背包",
    "gameGuide": "游戏说明",
    "reloginButton": "重新登录",
    "refreshSave": "更新/保存",
    "gameTool": "游戏工具",
    "showLvlLeaderBoard": "等级排行",
    "language": "语言"
  },
  "ui.locationButton": {
    "zone": "1区",
    "tpPoint": "入口",
    "muscleSquare": "肌肉广场",
    "moonSquare": "月亮广场",
    "marsSquare": "火星广场",
    "heavenSquare": "天空广场",
    "rewardCenter": "奖励中心"
  },
  "ui.prompts": {
    "checkingLatestPrices": "查看当前价格...",
    "stockNotAvailable": "（暂无库存）",
    "attemptRelogin": "正在尝试重新登录",
    "pickLanuage": "选择语言"
  },
  "ui.hovers": {
    "hoverSensorium": "去感官舞台派对",
    "hoverVisitMGMPlanetStage": "访问 MetaGamiMall 星球舞台",
    "hoverPoster": "查看游戏指南",
    "hoverMuscle": "去肌肉广场",
    "hoverMineField": "去挖矿",
    "hoverMoon": "前往月亮广场",
    "hoverMars": "前往火星广场",
    "hoverHeaven": "前往天堂广场",
    "hoverEntrance": "前往入口传送点",
    "hoverReward": "在奖励中心传送并查看品牌奖励",
    "hoverBrand": "传送到品牌商铺",
    "hoverTwitter": "查看品牌的推特",
    "hoverWeb": "检查品牌的网站",
    "hoverDiscord": "检查品牌不和谐",
    "hoverMGMWeb": "访问 MetaDoge 网站了解更多信息"
  },
  "ui.raffle": {
    "raffleTitle": "玩抽奖",
    "raffleText": "你觉得开心吗！？\n",
    "rafflePlay": "玩",
    "raffleCancel": "取消",
    "raffleResult": "结果",
    "raffleLoading": "加载中...",
    "raffleOK": "好的",
    "raffleNoMoney": "你玩的不够:(",
    "raffleLost": "你输了",
    "raffleEven": "你已经收支平衡了:)",
    "raffleWon": "你赢了"
  }
}

export const ko = {
  "common": {
    "button": {
      "ok": "확인",
      "cancel": "취소",
      "claim": "청구"
    },
    "title": {
      "cost": "비용",
      "costToUpper": "비용"
    }
  },
  "ui.languages": {
    "English": "영어",
    "english": "중국어",
    "german": "독일어",
    "japenese": "日本人",
    "Korean": "韓國人",
    "spanish": "스페인어",
    "turkey": "火鸡",
    "saudi": "사우디 아라비아",
    "portuguese": "포르투갈어",
    "iran": "이란"
  },
  "translation": {
    "welcome": "歡迎",
    "deep": {
      "look": "깊은 표정"
    },
    "closePoster": "옷장"
  },
  "npc": {
    "m2dmsg1": "안녕하세요. ",
    "m2dWelcome": "안녕하세요, 메타가미몰에 오신 것을 환영합니다!!!" ,
    "m2dHelp": "무엇을 도와드릴까요? "
  },
  "ui.staminaPanel": {
    "bonusDisplay": "보너스: {{value}}%",
    "deep": {
      "look": "딥 룩스터미너 패널!"
    },
    "dailyCap": {
      "test": "매일 테스트",
      "notMet": "일일 한도 {{currentValue}}/{{maxValue}} ({{remainingValue}} 최대) {{currentPercent}}%",
      "hit": "일일 한도 {{maxValue}} 돌파!  {collectionRate}}%"
    },
    "levelDisplay": "심지어 {{currentValue}} (다음 시간까지 {{remainingValue}}) {{currentPercent}}%"
  },
  "ui.sideButton": {
    "avatarSwap": "아바타 교환",
    "summonPet": "애완동물 소환",
    "locationButton": "위치",
    "raffleButton": "선물",
    "inventoryButton": "인벤토리",
    "gameGuide": "게임 안내",
    "reloginButton": "재로그인",
    "refreshSave": "업데이트",
    "gameTool": "게임 도구",
    "showLvlLeaderBoard": "레벨 랭킹",
    "language": "언어"
  },
  "ui.locationButton": {
    "zone": "구역 1",
    "tpPoint": "입구",
    "muscleSquare": "근육 사각형",
    "moonSquare": "문스퀘어",
    "marsSquare": "화성 제곱",
    "heavenSquare": "천국제곱",
    "rewardCenter": "보상센터"
  },
  "ui.prompts": {
    "checkingLatestPrices": "현재 가격 확인 중..." ,
    "stockNotAvailable": "(재고 없음)",
    "attemptRelogin": "재로그인 시도 중",
    "pickLanuage": "언어 선택"
  },
  "ui.hovers": {
    "hoverSensorium": "감각 스테이지 파티로 이동",
    "hoverVisitMGMPlanetStage": "메타가미몰 행성 스테이지 방문",
    "hoverPoster": "포스터 펼치기",
    "hoverMuscle": "머슬스퀘어로 이동",
    "hoverMoon": "문스퀘어로 이동",
    "hoverMars": "화성 광장으로 이동",
    "hoverHeaven": "파라다이스 광장으로 이동",
    "hoverEntrance": "입구 포털로 이동",
    "hoverReward": "보상 센터로 순간이동하여 브랜드 보상 보기",
    "hoverBrand": "브랜드 샵으로 텔레포트",
    "hoverTwitter": "브랜드 트윗 보기",
    "hoverWeb": "브랜드 웹사이트 확인",
    "hoverDiscord": "브랜드 불화 확인",
    "hoverMGMWeb": "자세한 내용은 메타도그 웹사이트 방문"
  },
  "ui.raffle": {
    "raffleTitle": "추첨을 플레이하세요",
    "raffleText": "행복하세요! \n",
    "rafflePlay": "플레이",
    "raffleCancel": "취소",
    "raffleResult": "결과",
    "raffleLoading": "로딩 중..." ,
    "raffleOK": "OK",
    "raffleNoMoney": "당신은 충분히 플레이하지 않았습니다:(",
    "raffleLost": "당신이 졌습니다",
    "raffleEven": "당신은 심지어 깨졌습니다 :)",
    "raffleWon": "당첨되었습니다"
  }
}

export const jp = {
  "common": {
    "button": {
      "ok": "わかりました",
      "cancel": "キャンセル",
      "claim": "主張"
    },
    "title": {
      "cost": "費用",
      "costToUpper": "費用"
    }
  },
  "ui.languages": {
    "english": "英語",
    "chinese": "中国語",
    "german": "ドイツ語",
    "japenese": "日本語",
    "korean": "韓国語",
    "spanish": "スペイン語",
    "turkey": "トルコ",
    "saudi": "サウジアラビア",
    "portuguese": "ポルトガル語",
    "iran": "イラン"
  },
    "translation": {
      "welcome": "ようこそ",
      "deep": {
        "look": "深い外観"
      },
      "closePoster": "ワードローブ"
    },
  "npc": {
    "m2dmsg1": "こんにちは。",
    "m2dWelcome": "こんにちは、メタガミモールへようこそ!!!",
    "m2dHelp": "ご用件は何ですか。"
  },
    "ui.staminaPanel": {
      "bonusDisplay": "ボーナス: {{value}}%",
      "deep": {
        "look": "深いルックスタミナパネル!"
      },
      "dailyCap": {
        "test": "毎日お試しください",
        "notMet": "日次上限 {{currentValue}}/{{maxValue}} ({{remainingValue}} to max) {{currentPercent}}%",
        "hit": "デイリーキャップ {{最大値}} ブロー! {{回収率}}%"
      },
      "levelDisplay": "ちょうど {{currentValue}} ({{remainingValue}} to the next) {{currentPercent}}%"
    },
      "ui.sideButton": {
        "avatarSwap": "アバタースワップ",
        "summonPet": "ペット召喚",
        "locationButton": "場所",
        "raffleButton": "抽選",
        "inventoryButton": "在庫",
        "gameGuide": "指示",
        "reloginButton": "もう一度サインインする",
        "refreshSave": "更新",
        "gameTool": "シュピールツール",
        "showLvlLeaderBoard": "レベルリーダーボード",
        "language": "言語"
      },
        "ui.locationButton": {
          "zone": "ゾーン1",
          "tpPoint": "入り口",
          "muscleSquare": "マスケルクアドラット",
          "moonSquare": "モンドクワドラット",
          "marsSquare": "マルスプラッツ",
          "heavenSquare": "ヒンメルスプラッツ",
          "rewardCenter": "ベローヌングスツェントルム"
        },
    "ui.prompts": {
      "checkingLatestPrices": "現在の価格を確認してください...",
      "stockNotAvailable": "(在庫あり)",
      "attemptRelogin": "再度ログインしようとしました",
      "pickLanuage": "言語の選択"
    },
      "ui.hovers": {
        "hoverSensorium": "センソリウムステージパーティーに行く",
        "hoverVisitMGMPlanetStage": "メタガミモールプラネットステージをご覧ください",
        "hoverPoster": "ポスターを拡大する",
        "hoverMuscle": "マッスルスクエアに移動",
        "hoverMoon": "ムーンスクエアへ",
        "hoverMars": "火星広場に行く",
        "hoverHeaven": "天国の広場に行く",
        "hoverEntrance": "エントランステレポートポイントへ",
        "hoverReward": "リワードセンターでブランド報酬をテレポートして確認する",
        "hoverBrand": "ブランドの店舗にテレポート",
        "hoverTwitter": "ブランドツイッターをチェックしてください",
        "hoverWeb": "ブランドのウェブサイトを確認する",
        "hoverDiscord": "ブランドの不和をチェック",
        "hoverMGMWeb": "詳細については、MetaDogeのウェブサイトをご覧ください。"
      },
      "ui.raffle": {
        "raffleTitle": "ラッフルをプレイ",
        "raffleText": "幸せを感じますか!?\n",
        "rafflePlay": "遊ぶ",
        "raffleCancel": "キャンセル",
        "raffleResult": "業績",
        "raffleLoading": "積載。。。",
        "raffleOK": "わかりました",
        "raffleNoMoney": "あなたは:(プレイするのに十分ではありません",
        "raffleLost": "あなたは負けました",
        "raffleEven": "あなたは:)さえ壊れました",
        "raffleWon": "あなたは勝ちました"
      }
    }

export const br = {
  "common": {
    "button": {
      "ok": "OK",
      "cancel": "Cancelar",
      "claim": "alegar"
    },
    "title": {
      "cost": "custos",
      "costToUpper": "CUSTOS"
    }
  },
  "ui.languages": {
    "english": "Inglês",
    "chinese": "chinês",
    "german": "Alemão",
    "japenese": "japonês",
    "korean": "coreano",
    "spanish": "Espanhol",
    "turkey": "Peru",
    "saudi": "Arábia Saudita",
    "portuguese": "Português",
    "iran": "Irã"
  },
  "translation": {
    "welcome": "Bem-vindo",
    "deep": {
      "look": "olhar profundo"
    },
    "closePoster": "Guarda-roupa"
  },
  "npc": {
    "m2dmsg1": "Olá. ",
    "m2dWelcome": "Ei, bem-vindo ao MetaGamiMall!!!",
    "m2dHelp": "Como posso ajudar? "
  },
  "ui.staminaPanel": {
    "bonusDisplay": "Bônus: {{value}}%",
    "deep": {
      "look": "Dê uma olhada no painel de resistência!"
    },
    "dailyCap": {
      "test": "teste diariamente",
      "notMet": "Limite diário {{currentValue}}/{{maxValue}} ({{remainingValue}} até o máximo) {{currentPercent}}%",
      "hit": "Limite diário {{maxValue}} SOPRAR!  {{collectionRate}}%"
    },
    "levelDisplay": "Até {{currentValue}} ({{remainingValue}} Até a próxima vez) {{currentPercent}}%"
  },
  "ui.sideButton": {
    "avatarSwap": "troca de avatar",
    "summonPet": "Invocar mascote",
    "locationButton": "Localização",
    "raffleButton": "Abrindo mão",
    "inventoryButton": "inventário",
    "gameGuide": "instruções do jogo",
    "reloginButton": "Entrar novamente",
    "refreshSave": "Atualizar",
    "gameTool": "ferramentas de jogo",
    "showLvlLeaderBoard": "Classificação de nível",
    "language": "Linguagem"
  },
  "ui.locationButton": {
    "zone": "Zona 1",
    "tpPoint": "Entrada",
    "muscleSquare": "músculo quadrado",
    "moonSquare": "quadrado da lua",
    "marsSquare": "quadrado de marte",
    "heavenSquare": "lugar do céu",
    "rewardCenter": "centro de recompensa"
  },
  "ui.prompts": {
    "checkingLatestPrices": "Confira os preços atuais...",
    "stockNotAvailable": "(estoque não disponível)",
    "attemptRelogin": "Tentando logar novamente",
    "pickLanuage": "Escolha o seu idioma"
  },
  "ui.hovers": {
    "hoverSensorium": "Ir para a festa do Palco Sensorium",
    "hoverVisitMGMPlanetStage": "Visite o Palco Planeta MetaGamiMall",
    "hoverPoster": "Expandir o cartaz",
    "hoverMuscle": "Vá para a Praça do Músculo",
    "hoverMoon": "Ir para a Praça da Lua",
    "hoverMars": "Ir para a Praça de Marte",
    "hoverHeaven": "Ir para a Praça do Céu",
    "hoverEntrance": "Vá para o ponto de teletransporte de entrada",
    "hoverReward": "Teletransporte e confira as recompensas da marca no Centro de Recompensas",
    "hoverBrand": "Teleporte para a loja da marca",
    "hoverTwitter": "Confira o Twitter da marca",
    "hoverWeb": "Confira no site da marca",
    "hoverDiscord": "Verificar Discórdia de Marcas",
    "hoverMGMWeb": "Visite o site do MetaDoge para mais informações"
  },
  "ui.raffle": {
    "raffleTitle": "Jogar rifa",
    "raffleText": "Você se sente feliz!?\n",
    "rafflePlay": "Jogar",
    "raffleCancel": "Cancelar",
    "raffleResult": "RESULTADOS",
    "raffleLoading": "Carregando...",
    "raffleOK": "OK",
    "raffleNoMoney": "Você não tem o suficiente para jogar :(",
    "raffleLost": "Você perdeu",
    "raffleEven": "Você empatou :)",
    "raffleWon": "Você ganhou"
  }
}

export const ir =  {
  "common": {
    "button": {
      "ok": "خوب",
      "cancel": "لغو کنید",
      "claim": "مطالبه"
    },
    "title": {
      "cost": "هزینه ها",
      "costToUpper": "هزینه ها"
    }
  },
  "ui.languages": {
    "english": "انگلیسی",
    "chinese": "چینی ها",
    "german": "آلمانی",
    "japenese": "ژاپنی",
    "korean": "کره ای",
    "spanish": "اسپانیایی",
    "turkey": "بوقلمون",
    "saudi": "عربستان سعودی",
    "portuguese": "پرتغالی",
    "iran": "ایران"
  },
  "translation": {
    "welcome": "خوش آمدی",
    "deep": {
      "look": "نگاه عمیق"
    },
    "closePoster": "جا رختی"
  },
  "npc": {
    "m2dmsg1": "سلام. ",
    "m2dWelcome": "سلام به MetaGamiMall خوش آمدید!!!",
    "m2dHelp": "چطور می تونم کمک کنم؟ "
  },
  "ui.staminaPanel": {
    "bonusDisplay": "جایزه: {{value}}%",
    "deep": {
      "look": "به پنل استقامت نگاهی دقیق بیندازید!"
    },
    "dailyCap": {
      "test": "تست روزانه",
      "notMet": "سرپوش روزانه {{currentValue}}/{{maxValue}} ({{remainingValue}} حداکثر) {{currentPercent}}%",
      "hit": "سرپوش روزانه {{maxValue}} فوت کردن، دمیدن!  {{collectionRate}}%"
    },
    "levelDisplay": "زوج {{currentValue}} ({{remainingValue}} تا دفعه بعد) {{currentPercent}}%"
  },
  "ui.sideButton": {
    "avatarSwap": "تعویض آواتار",
    "summonPet": "احضار حیوان خانگی",
    "locationButton": "محل",
    "raffleButton": "بخشیدن",
    "inventoryButton": "فهرست",
    "gameGuide": "راهنمای بازی",
    "reloginButton": "دوباره وارد شوید",
    "refreshSave": "به روز رسانی",
    "gameTool": "ابزار بازی",
    "showLvlLeaderBoard": "رتبه بندی سطح",
    "language": "زبان"
  },
  "ui.locationButton": {
    "zone": "منطقه 1",
    "tpPoint": "ورود",
    "muscleSquare": "مربع عضله",
    "moonSquare": "مربع ماه",
    "marsSquare": "میدان مریخ",
    "heavenSquare": "مکان آسمان",
    "rewardCenter": "مرکز پاداش"
  },
  "ui.prompts": {
    "checkingLatestPrices": "بررسی قیمت های فعلی ...",
    "stockNotAvailable": "( موجودی موجود نیست )",
    "attemptRelogin": "تلاش برای ورود مجدد",
    "pickLanuage": "زبان را انتخاب کنید"
  },
  "ui.hovers": {
    "hoverSensorium": "به مهمانی سنسوریوم استیج بروید",
    "hoverVisitMGMPlanetStage": "از MetaGamiMall Planet Stage دیدن کنید",
    "hoverPoster": "پوستر را گسترش دهید",
    "hoverMuscle": "به میدان عضله بروید",
    "hoverMoon": "به میدان ماه بروید",
    "hoverMars": "به میدان مریخ بروید",
    "hoverHeaven": "به میدان بهشت ​​بروید",
    "hoverEntrance": "به نقطه ورودی تله پورت بروید",
    "hoverReward": "جوایز برند را در مرکز جوایز از راه دور ارسال و بررسی کنید",
    "hoverBrand": "Teleport به فروشگاه برند",
    "hoverTwitter": "توییتر برند را بررسی کنید",
    "hoverWeb": "وب سایت برند را بررسی کنید",
    "hoverDiscord": "برندهای Discord را بررسی کنید",
    "hoverMGMWeb": "برای اطلاعات بیشتر به وب سایت MetaDoge مراجعه کنید"
  },
  "ui.raffle": {
    "raffleTitle": "قرعه کشی بازی کن",
    "raffleText": "آیا احساس خوشبختی می کنید!؟\n",
    "rafflePlay": "بازی",
    "raffleCancel": "لغو کنید",
    "raffleResult": "نتایج",
    "raffleLoading": "بارگذاری...",
    "raffleOK": "خوب",
    "raffleNoMoney": "به اندازه کافی برای بازی کردن ندارید :(",
    "raffleLost": "باختی",
    "raffleEven": "حتی شکست خوردی :)",
    "raffleWon": "تو بردی"
  }
}