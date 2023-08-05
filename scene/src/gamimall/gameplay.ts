import * as utils from "@dcl/ecs-scene-utils";
import * as ui from "@dcl/ui-scene-utils";
import { connect, CONNECTION_EVENT_REGISTRY, disconnect, reconnect, showConnectingEnded } from "./connection";
import { uiCanvas, updateLeaderboard } from "./leaderboard";
import {
  ambienceSound,
  clickSound,
  finishSound1,
  newLeaderSound,
  countdownRestartSound,
  playLoop,
  playOnce,
  playOnceRandom,
} from "./sound";
import { createTextShape, getEntityByName, isNull, notNull } from "../utils";

import PlayFab from "./playfab_sdk/PlayFabClientApi";

import { GAME_STATE, resetAllGameStateGameCoin, resetAllGameStateGameCoinRewards } from "src/state";
import { refreshUserData } from "./login-flow";
import { Config, CONFIG } from "src/config";
import { Coin, COIN_MANAGER, CoinType as CoinDataType, RewardNotification } from "./coin";
import { DataChange, Room } from "colyseus.js";
import { REGISTRY } from "src/registry";
import { setLobbyCameraTriggerShape } from "src/configTriggers";
import * as clientState from "src/gamimall/state/client-state-spec";
import * as serverStateSpec from "src/gamimall/state/MyRoomStateSpec";
import { minableController } from "./mining/minables";
import { COIN_GAME_FEATURE_DEF } from "./mining/setupMinables";
import { getCoinCap, getLevelFromXp } from "src/modules/leveling/levelingUtils";
/*
executeTask(async () => {
    const message = 'msg: this is a top secret message'
    log(`signing MESSAGE: `, message)
    const messageSigned = await crypto.ethereum.signMessage(message)
    log(`signed MESSAGE: `, messageSigned)
  })
*/

PlayFab.settings.titleId = CONFIG.PLAYFAB_TITLEID;

// play ambient music
//playLoop(ambienceSound, 0.4);

updateLeaderboard(["- Nobody -"]);

// getEntityByName("testCoinPlacementBlock").addComponent(
//     new OnPointerDown(
//         () => {
//             testCoinPlacement()
//         },
//         { hoverText: "Place Coins At Pianos" }
//     )
// )
/*
function testCoinPlacement(){
    coins.forEach((coin, key)=> {
        spawnCoin(`coin-${key}-placement`, coin[0], coin[1]-0.44, coin[2],5,(id)=>{ 
            log("touche test coin") 
        })
    })
}
*/

function getFeatureDefById(id:string):serverStateSpec.TrackFeatureInstDef|null{
  for(const p in COIN_GAME_FEATURE_DEF.minables){
    if(COIN_GAME_FEATURE_DEF.minables[p].id === id){
      return COIN_GAME_FEATURE_DEF.minables[p]
    }
  }
  for(const p in COIN_GAME_FEATURE_DEF.buyables){
    if(COIN_GAME_FEATURE_DEF.buyables[p].id === id){
      return COIN_GAME_FEATURE_DEF.buyables[p]
    }
  }
  return null
}
function handleRewardData(result:RewardNotification){
  //const result = (message as RewardNotification)
    //GAME_STATE.notifyInGameMsg(message);
    //ui.displayAnnouncement("PLUG IN LEVEL UP:"+result.newLevel, 8, Color4.White(), 60);
    if(result.rewards!==undefined){
      let gc=0
      let mc=0

      let bp=0
      let ni=0

      let bz=0

      let r1=0
      let r2=0
      let r3=0

      let bronzeShoe=0
      for(const p in result.rewards){
        switch(result.rewards[p].id){
          case CONFIG.GAME_COIN_TYPE_GC:
            gc=result.rewards[p].amount
            break; 
          case CONFIG.GAME_COIN_TYPE_MC:
            mc=result.rewards[p].amount
            break; 
          case CONFIG.GAME_COIN_TYPE_BP:
            bp=result.rewards[p].amount
            break; 
          case CONFIG.GAME_COIN_TYPE_BZ:
            bz=result.rewards[p].amount
            break; 
          case CONFIG.GAME_COIN_TYPE_NI:
            ni=result.rewards[p].amount
            break; 
          case CONFIG.GAME_COIN_TYPE_R1:
            r1=result.rewards[p].amount
            break;
          case CONFIG.GAME_COIN_TYPE_R2:
            r2=result.rewards[p].amount
            break;
          case CONFIG.GAME_COIN_TYPE_R3:
            r3=result.rewards[p].amount
            break; 
          case CONFIG.GAME_COIN_TYPE_BRONZE_SHOE_1_ID:
            bronzeShoe=result.rewards[p].amount
            break; 
          default:
            log("unhandled reward type",result.rewards[p].id,result.rewards[p])
        }
      } 
       
      const addToWallet = 
           result.rewardType !== 'mining-lack-of-funds'  
        && result.rewardType !== 'buying-lack-of-funds' 
        && result.rewardType !== 'mining-maxed-out-inventory'
        && result.rewardType !== 'buying-maxed-out-inventory'

      if(addToWallet){
        GAME_STATE.setGameItemRewardBronzeShoeValue(GAME_STATE.gameItemRewardBronzeShoeValue + bronzeShoe)

        GAME_STATE.setGameCoinRewardGCValue(GAME_STATE.gameCoinRewardGCValue + gc)
        GAME_STATE.setGameCoinRewardMCValue(GAME_STATE.gameCoinRewardMCValue + mc)

        GAME_STATE.setGameCoinRewardBPValue(GAME_STATE.gameCoinRewardBPValue + bp)
        GAME_STATE.setGameCoinRewardNIValue(GAME_STATE.gameCoinRewardNIValue + ni)
        GAME_STATE.setGameCoinRewardBZValue(GAME_STATE.gameCoinRewardBZValue + bz)

        GAME_STATE.setGameCoinRewardR1Value(GAME_STATE.gameCoinRewardR1Value + r1)
        GAME_STATE.setGameCoinRewardR2Value(GAME_STATE.gameCoinRewardR2Value + r2)
        GAME_STATE.setGameCoinRewardR3Value(GAME_STATE.gameCoinRewardR3Value + r3)

        //forces a refresh of stanima bar
        GAME_STATE.setGameCoinGCValue(  GAME_STATE.gameCoinGCValue )
        GAME_STATE.setGameCoinMCValue(  GAME_STATE.gameCoinMCValue )
        
        GAME_STATE.setGameCoinBPValue(  GAME_STATE.gameCoinBPValue )
        GAME_STATE.setGameCoinNIValue(  GAME_STATE.gameCoinNIValue )
        GAME_STATE.setGameCoinBZValue(  GAME_STATE.gameCoinBZValue )

        GAME_STATE.setGameCoinR1Value(  GAME_STATE.gameCoinR1Value )
        GAME_STATE.setGameCoinR2Value(  GAME_STATE.gameCoinR2Value )
        GAME_STATE.setGameCoinR3Value(  GAME_STATE.gameCoinR3Value )

        GAME_STATE.setGameItemBronzeShoeValue(GAME_STATE.gameItemBronzeShoeValue)

        REGISTRY.ui.inventoryPrompt.updateGrid()
      }

      switch(result.rewardType){
        case 'level-up' :
          REGISTRY.ui.levelUpPrompt.update(result)
          REGISTRY.ui.levelUpPrompt.show()
          break;
        case 'buying-reward' :
        case 'mining-reward' :
          
          minableController.showUIReward( true, result )
          break;
        case 'buying-maxed-out-inventory' :
        case 'mining-maxed-out-inventory' :          
        minableController.showUIMaxedOutInventory( true, result )
          break;
        case 'buying-lack-of-funds' :
        case 'mining-lack-of-funds' :          
          minableController.showUINotEnoughFunds( true, result )
          break;
        case 'buying-paid' : 
        case 'mining-paid' :  
           
          minableController.showUIPaidFunds( true, result )
          break;
      }

    }
} 
function addRemoveTrackFeature(trackFeat: clientState.ITrackFeatureState,type:|'add'|'remove') {
  const METHOD_NAME = "addRemoveTrackFeature" 
  log("addRemoveTrackFeature","ENTRY",trackFeat,type);
  
  const featureDef = getFeatureDefById(trackFeat.featureDefId)
  trackFeat._featureDef=featureDef

  if(trackFeat.type.indexOf("minable")>-1 || trackFeat.type.indexOf("buyable")>-1){
      if(type=='add'){
        const minable = minableController.createMinableFromState(trackFeat)
        
      }else{
        //remove
      }
  }
}
function updateTrackFeature(trackFeat: clientState.ITrackFeatureState) {
  const METHOD_NAME = "updateTrackFeature"
  if(trackFeat.type.indexOf("minable")>-1|| trackFeat.type.indexOf("buyable")>-1){
      const minable = minableController.getMinableById(trackFeat.id)
      if(minable !== undefined){
        //tile.health = 
        
        minable.updateFromServer(trackFeat)
        //minable.updateHealth(0)
      }else{
        log(METHOD_NAME,"WARNING","could not find feature to update",trackFeat.type,trackFeat.id)
      }
  }
}

export function startGame(gameType?: string) {
  if (isNull(GAME_STATE.playerState.playFabLoginResult)) {
    log("player not logged in yet");
    ui.displayAnnouncement("Player not logged in yet");
    REGISTRY.ui.openloginGamePrompt();
  } else {
    log("starting game");
    setLobbyCameraTriggerShape();
    GAME_STATE.setScreenBlockLoading(true);
    colyseusConnect(gameType);
  }
}

export function endGame() {
  if (isNull(GAME_STATE.playerState.playFabLoginResult)) {
    log("player not logged in yet");
    ui.displayAnnouncement("Player not logged in yet");
  } else if (GAME_STATE.gameConnected !== "connected") {
    ui.displayAnnouncement("Player not connected to game room");
  } else {
    log("ending game");
    log("LEAVING ROOM1!!!!!!!!!");
    log("LEAVING ROOM2!!!!!!!!!");
    log("LEAVING ROOM3!!!!!!!!!");

    log("endGame.sending quit-game!!!!!!!!");
    //TODO notify of exit, to cause nicer exit
    GAME_STATE.gameRoom.send("quit-game",{});
    //ADD TIMER IF takes longer than X do this anyways
    //popup a quitting screen.
    GAME_STATE.setGameConnected('disconnecting',"endGame")
    GAME_STATE.setGameHudActive(false);
    GAME_STATE.setGameStarted(false);
    //waiting 3.5 seconds is kind of long bit need time for stats to be collected
    utils.setTimeout(CONFIG.GAME_OTHER_ROOM_DISCONNECT_TIMER_WAIT_TIME,()=>{
      log("endGame.timer.force.disconnected","GAME_STATE.gameConnected",GAME_STATE.gameConnected)
      if(GAME_STATE.gameConnected === 'disconnecting' && GAME_STATE.gameRoom !== null && GAME_STATE.gameRoom !== undefined){
        disconnect(true)
        GAME_STATE.setGameStarted(false);
        GAME_STATE.setGameHudActive(false);
      }else{
        log("endGame.timer.already disconnected","GAME_STATE.gameConnected",GAME_STATE.gameConnected)
      }
    })
      
  }
}

export const onJoinActions = (CONNECTION_EVENT_REGISTRY.onJoinActions = (
  room: Room,
  eventName: string
) => {
  log("onJoinActions entered", eventName);
  
  GAME_STATE.connectRetryCount=0//reset counter
  showConnectingEnded(true)
  
  GAME_STATE.setGameRoom(room);

  resetAllGameStateGameCoin()
  resetAllGameStateGameCoinRewards()

  let lastBlockTouched: string = "";
  function onTouchBlock(id: string) {
    if( CONFIG.GAME_CAN_COLLECT_WHEN_IDLE_ENABLED || (!CONFIG.GAME_CAN_COLLECT_WHEN_IDLE_ENABLED && !GAME_STATE.isIdle) ){
      optimisticCollectCoin(id);

      room.send("touch-block", id);
    }else{
      log("onTouchBlock","not collecting player is GAME_STATE.isIdle",GAME_STATE.isIdle,id,"CONFIG.GAME_CAN_COLLECT_WHEN_IDLE_ENABLED",CONFIG.GAME_CAN_COLLECT_WHEN_IDLE_ENABLED)
    }
  }

  //will remove the coin ahead of actual server confirmed collection 
  function optimisticCollectCoin(id: string) {
    //TODO
    //move to 'coin vault' with timer to put back in 1 second should server not confirm collection
    //???

    //very optmistic,  if they cheat then they just dont get it
    const coin = COIN_MANAGER.getCoinById(id);

    //add sparkle

    //collect-sparkle.glb
    //TODO use sparkle object pool
    //coin.showSparkle
 
    coin.collect();
    //TODO up score? is it safe to do that then check server periodically?
  }    
    
  function collectCoin(id: string) {
    //remove from coinsSpawned
    //add to coinsPool

    //const id = block.id
    // send block index and player position to Colyseus server
    lastBlockTouched = id; //track collection for "combos"

    const coin = COIN_MANAGER.getCoinById(id); //FIXME need faster lookup
    log("onTouchBlock remove entity " + id + " " + coin);

    GAME_STATE.coinCollected(id);

    coin.collect();

    //if being "collected", no need to remove till animation is over
    //removeFromEngine(coin,3000)
  }

  function refreshLeaderboard() {
    // get all players names sorted by their ranking
    const allPlayers = Array.from(room.state.players.values())
      .sort((a: any, b: any) => {
        return b.score - a.score;
      })
      .map(
        (player: any, i: number) => `${i + 1}. ${player.name} - ${player.score}`
      );

    updateLeaderboard(allPlayers);
  }

  // The "floor" object was originally named "entity" from the Decentraland Builder.
  // I exported it from the "./scene" file to be able to attach custom behaviour.
  /*const floorcoinTriggerShape = new utils.TriggerCoinShape(new Vector3(16, 2, 16), new Vector3(0, 3, 0));
    floor.addComponent(
        new utils.TriggerComponent(floorcoinTriggerShape, {
            onCameraEnter: () => {
                if (lastBlockTouched > 2 && lastBlockTouched < 20) {
                    room.send("fall", Camera.instance.pss
            },
        })
    )*/

  //
  // -- Colyseus / Schema callbacks --
  // https://docs.colyseus.io/state/schema/
  //
  //let allCoins: Entity[] = []; using coinsSpawned
  let lastCoin: Entity;

  room.state.blocks.onAdd = (block: CoinDataType, key: string) => {
    log("room.state.blocks.onAdd " + block.id, block);
    lastCoin = COIN_MANAGER.spawnCoin(
      {
        id: block.id,
        x: block.x,
        y: block.y,
        z: block.z,
        coinType: block.type,
        value: block.value,
      },
      onTouchBlock
    );
    //allCoins.push(lastCoin);
  };
  room.state.blocks.onRemove = (block: CoinDataType, key: string) => {
    log("room.state.blocks.onRemove", block, key);

    //removeFromEngine( getEntityByName(key) )
    collectCoin(key); //TODO who collected
    //lastCoin = spawnCoin(block.id,block.x, block.y, block.z, block.value );
    //allCoins.push(lastCoin);
  };

  let highestRanking = 0;
  let highestPlayer: any = undefined;
  room.state.players.onAdd = (player: any, sessionId: string) => {
    log("room.state.players.onAdd");
    player.listen("score", (newRanking: number) => {
      log("player.listen.score", newRanking);
      if (newRanking > highestRanking) {
        if (player !== highestPlayer) {
          highestPlayer = player;

          playOnce(newLeaderSound);
        }
        highestRanking = newRanking;
      }

      refreshLeaderboard();
    });
    player.listen("coinGcCount", (num: number) => {
      log("player.listen.coinGcCount", num);
      GAME_STATE.setGameCoinGCValue(num);
    });
 
    const coinListeners=[
      {name:"bronzeCollected",fn:(val:number)=>{GAME_STATE.setGameCoinBZValue(val)}},
      //activate if needed
      /*
      {name:"rock1Collected",fn:(val:number)=>{GAME_STATE.setGameCoinR1Value(val)}},
      {name:"rock2Collected",fn:(val:number)=>{GAME_STATE.setGameCoinR2Value(val)}},
      {name:"rock3Collected",fn:(val:number)=>{GAME_STATE.setGameCoinR3Value(val)}},
      {name:"petroCollected",fn:(val:number)=>{GAME_STATE.setGameCoinBPValue(val)}},
      {name:"nitroCollected",fn:(val:number)=>{GAME_STATE.setGameCoinNIValue(val)}},
      */
    ]
    for( const p of coinListeners){
      player.listen(p.name, (num: number) => {
        log("player.listen."+p.name, num);
        p.fn(num);
      });
    }

    player.listen("coinsCollectedEpoch", (num: number) => {
      log("player.listen.coinsCollectedEpoch", num);
      GAME_STATE.setGameCoinsCollectedEpochValue(num);
    });

    player.listen("coinsCollectedDaily", (num: number) => {
      log("player.listen.setGameCoinsCollectedDailyValue", num);
      GAME_STATE.setGameCoinsCollectedDailyValue(num);
    });
    

    player.listen("material1Count", (num: number) => {
      log("player.listen.material1Count", num);
      GAME_STATE.setGameMaterial1Value(num);
    });
    player.listen("material2Count", (num: number) => {
      log("player.listen.material2Count", num);
      GAME_STATE.setGameMaterial2Value(num);
    });
    player.listen("material3Count", (num: number) => {
      log("player.listen.material3Count", num);
      GAME_STATE.setGameMaterial3Value(num);
    });

    player.listen("coinMcCount", (num: number) => {
      log("player.listen.coinMcCount", num);
      GAME_STATE.setGameCoinMCValue(num);
    });
    player.listen("coinGuestCount", (num: number) => {
      log("player.listen.coinGuestCount", num);
      GAME_STATE.setGameCoinGuestValue(num);
    });

    player.listen("coinsCollected", (num: number) => {
      log("player.listen.coinsCollected", num);
      GAME_STATE.setGameCoinsCollectedValue(num);
    });
  };

  // when a player leaves, remove it from the leaderboard.
  room.state.players.onRemove = () => {
    log("room.state.player.onRemove");
    refreshLeaderboard();
  };

  room.state.listen("countdown", (num: number) => {
    //log("room.listen.countdown",num)
    GAME_STATE.setCountDownTimerValue(num);
  });

  room.state.listen("totalCoins", (num: number) => {
    log("room.listen.totalCoins", num);
    GAME_STATE.setGameCoinsTotalValue(num);
  });

  room.onMessage("start", () => {
    log("room.msg.start");
    // remove all previous coines
    //allCoins.forEach((coin) => engine.removeEntity(coin));
    //allCoins = [];

    GAME_STATE.setGameStarted(true);
    GAME_STATE.setScreenBlockLoading(false);
    GAME_STATE.setGameHudActive(true);

    lastBlockTouched = "";
    highestRanking = 0;
    highestPlayer = undefined;

    //GAME_STATE.setCountDownTimerActive(true)
  });

  room.onMessage("fall", (atPosition) => {
    log("room.msg.fall");
    //playOnce(fallSound, 1, new Vector3(atPosition.x, atPosition.y, atPosition.z));
  });

  room.onMessage("update.config", (config:serverStateSpec.RemoteBaseCoinRoomConfig) => {
    log("room.msg.update.config",config);
    CONFIG.GAME_COIN_CAP_ENABLED = config?.coinCap.enabled
    if(config?.coinCap.enabled){
      if(REGISTRY.ui.staminaPanel.staminaPanel.visible) REGISTRY.ui.staminaPanel.show()
      CONFIG.speedCapOverageReduction = config?.coinCap.overageReduction

      if(config?.coinCap.formula){
        log("room.msg.update.config","using remote formula","local",CONFIG.GAME_DAILY_COIN_MAX_FORMULA_CONST,"vs",config.coinCap.formula);
        CONFIG.GAME_DAILY_COIN_MAX_FORMULA_CONST = config?.coinCap.formula
 
        testXPandCoinCap("remoteConfig")
      }
      //no change, but make ui update
      REGISTRY.ui.staminaPanel.updateDailyCoins(REGISTRY.ui.staminaPanel.dailyCoins)
    }else{
      if(REGISTRY.ui.staminaPanel.staminaPanel.visible) REGISTRY.ui.staminaPanel.show()
    }
  })
  
  room.onMessage("game-saved", () => {
    log("room.msg.game-saved");
    //clear reward value, need a way to clear it out when server saves too OR just read server rewardData and colyseus will sync it for us
  
    resetAllGameStateGameCoin()
    resetAllGameStateGameCoinRewards() 

    refreshUserData("game-saved")
    ui.displayAnnouncement(`Save Complete`, 3, Color4.White(), 60);
    //refreshUserData("onMessage(finished")
  });
  room.onMessage("game-auto-saved-daily-reset", () => {
    log("room.msg.game-auto-saved-daily-reset");

    resetAllGameStateGameCoin()
    resetAllGameStateGameCoinRewards() 

    refreshUserData("game-auto-saved-daily-reset")
    ui.displayAnnouncement(`Daily Reset Complete`, 3, Color4.White(), 60);
  })
  room.onMessage("game-auto-saved", () => {
    log("room.msg.game-auto-saved");
    //do we need to clear this?  should auto save send latest stats instead of client having to do it?
    //without refreshing playfab data, not sure we need to / want to clear this out?
    //clear reward value, need a way to clear it out when server saves too OR just read server rewardData and colyseus will sync it for us
    //GAME_STATE.setGameCoinRewardGCValue(0)//zero this out

    //should i refresh on an autosave?
    //refreshUserData("game-auto-saved")
    //ui.displayAnnouncement(`Save Complete`, 3, Color4.White(), 60);
    //refreshUserData("onMessage(finished")
  });
  
  room.onMessage("finished", () => {
    log("room.msg.finished");
    //ui.displayAnnouncement(`${highestPlayer.name} wins!`, 8, Color4.White(), 60);
    if(GAME_STATE.gameRoomTarget !== 'racing'){
      ui.displayAnnouncement(`Level Ended`, 8, Color4.White(), 60);
      playOnceRandom([finishSound1], 0.2);
    }
    GAME_STATE.setGameStarted(false);
    GAME_STATE.setGameHudActive(false);

    if(GAME_STATE.gameRoomTarget !== 'racing'){
      REGISTRY.ui.openEndGamePrompt();
    }

    log("LEAVING ROOM!!!!!!!!!");
    log("LEAVING ROOM!!!!!!!!!");
    log("LEAVING ROOM!!!!!!!!!");

    disconnect() 
    log("room.onMessage.finished","refreshUserData not called, letting disconnect do it")
    //refreshUserData("onMessage(finished")
  });

  //get end game results instead of tracking as session data
  //good/bad instead of as session data?
  room.onMessage("endGameResultsMsg", (message) => {
    log("room.msg.endGameResultsMsg", message);
    if (message !== undefined) GAME_STATE.setGameEndResult(message);
    //ui.displayAnnouncement(`${highestPlayer.name} wins!`, 8, Color4.White(), 60);
    //ui.displayAnnouncement(message, 8, Color4.White(), 60);
    //GAME_STATE.setGameEndResultMsg()
  });

  room.onMessage("inGameMsg", (data) => {
    log("room.msg.inGameMsg", data);
    if (data !== undefined && data.msg === undefined) {
      GAME_STATE.notifyInGameMsg(data);
      ui.displayAnnouncement(data, 8, Color4.White(), 60);
    }else{
      //if (message !== undefined && message.msg === undefined) {
        GAME_STATE.notifyInGameMsg(data.msg);
        ui.displayAnnouncement(data.msg, data.duration !== undefined ? data.duration : 8, Color4.White(), 60);
      //}
    }

    //ui.displayAnnouncement(`${highestPlayer.name} wins!`, 8, Color4.White(), 60);
    //ui.displayAnnouncement(message, 8, Color4.White(), 60);
    //GAME_STATE.setGameEndResultMsg()
  });

  
  room.onMessage("notify.levelUp", (message) => {
    log("room.msg.notify.levelUp", message);
    if (message !== undefined) {
      const result = (message as RewardNotification)
      
      handleRewardData(result)
    }
  })
    
  //miningLackOfFunds
  //miningReward
  //miningPaid
  //buyingLackOfFunds
  //buyingReward   
  //buyingPaid
  for( const interactionType of ['mining','buying']){ 
    //log("creating room.onMessage for interactionType",interactionType)
      //TODO make buying message
      room.onMessage("notify."+interactionType+"LackOfFunds", (message) => {
        log("room.msg.notify."+interactionType+"LackOfFunds", message);
        if (message !== undefined) {
          const result = (message as RewardNotification)
          
          handleRewardData(result)
        }
      })

      room.onMessage("notify."+interactionType+"MaxedOutInventory", (message) => {
        log("room.msg.notify."+interactionType+"MaxedOutInventory", message);
        if (message !== undefined) {
          const result = (message as RewardNotification)
          
          handleRewardData(result)
        }
      })
    
      room.onMessage("notify."+interactionType+"Paid", (message) => {
        log("room.msg.notify."+interactionType+"Paid", message);
        if (message !== undefined) {
          const result = (message as RewardNotification)
          
          handleRewardData(result)
        }
      })

      room.onMessage("notify."+interactionType+"Reward", (message) => {
        log("room.msg.notify."+interactionType+"Reward", message);
        if (message !== undefined) {
          const result = (message as RewardNotification)
          
          handleRewardData(result)
        }

      //ui.displayAnnouncement(`${highestPlayer.name} wins!`, 8, Color4.White(), 60);
      //ui.displayAnnouncement(message, 8, Color4.White(), 60);
      //GAME_STATE.setGameEndResultMsg()
    });
  }

  room.onMessage("onLeave", (message) => {
    log("room.msg.onLeave", message);
    //debugger
    //if(message !== undefined) GAME_STATE.setGameEndResult(message)
    //ui.displayAnnouncement(`${highestPlayer.name} wins!`, 8, Color4.White(), 60);
    //ui.displayAnnouncement(message, 8, Color4.White(), 60);
    //GAME_STATE.setGameEndResultMsg()
  });

  room.onMessage("announce", (message) => {
    log("room.msg.announce");
    //ui.displayAnnouncement(`${highestPlayer.name} wins!`, 8, Color4.White(), 60);
    ui.displayAnnouncement(message, 8, Color4.White(), 60);
  });

  room.onMessage("restart", () => {
    log("room.msg.restart");
    playOnce(countdownRestartSound);
  }); 

  room.onLeave((code) => {
    log("room.on.leave");
    log("onLeave, code =>", code);
    //GAME_STATE.setGameConnected('disconnected')
    //debugger 
    refreshUserData("onLeave'");
  });
  
  
  room.state.listen("playFabTime", (playFabTime: number) => {
    //log("room.state.playFabTime.listen", playFabTime);
    GAME_STATE.playFabTime = playFabTime

    //const now = Date.now()
    //log("room.state.playFabTime.listen.diffs", (GAME_STATE.serverTime-GAME_STATE.playFabTime), (GAME_STATE.serverTime-now), (GAME_STATE.playFabTime-now));
    
  })
  room.state.listen("serverTime", (serverTime: number) => {
    //log("room.state.serverTime.listen", serverTime);
    GAME_STATE.serverTime = serverTime
  })

  room.state.listen("levelData", (levelData: clientState.LevelDataState) => {
    log("room.state.levelData.listen", levelData);
    //updateLevelData(room.state.levelData); 
 
    //if (!levelData.trackFeatures.onAdd) {
      //for some reason null at the beginning
      levelData.trackFeatures.onAdd = (trackFeat: clientState.ITrackFeatureState, sessionId: string) => {
        log("room.state.levelData.trackFeatures.onAdd", trackFeat.id, trackFeat);
        
        addRemoveTrackFeature(trackFeat,'add') 
        trackFeat.onChange = (changes: DataChange<any>[]) => {
          log("room.state.levelData.trackFeatures.trackFeat.onChange", trackFeat.id, trackFeat);
          updateTrackFeature(trackFeat)
        };
        /*
        trackFeat.listen("health", (levelData: clientState.LevelDataState) => {
          //log("room.state.levelData.trackFeatures.trackFeat.listen.health", trackFeat.name, trackFeat);
          updateTrackFeature(trackFeat)
        }) 
        trackFeat.health.onChange = (changes: DataChange<any>[]) => {
          //log("room.state.levelData.trackFeatures.trackFeat.health.onChange", trackFeat.name, trackFeat);
          updateTrackFeature(trackFeat)
        }*/
      };
      levelData.trackFeatures.onRemove = (trackFeat: clientState.ITrackFeatureState, sessionId: string) => {
        log("room.state.levelData.trackFeatures.onRemove", trackFeat.id, trackFeat);
        addRemoveTrackFeature(trackFeat,'remove')
      }
    //}
  });

  log("onJoinActions exit", eventName);
});

//START colyseusConnect//START colyseusConnect//START colyseusConnect
export const colyseusReConnect = () => {
  const oldRoom = GAME_STATE.gameRoom;
  if (oldRoom == undefined) {
    log("warning oldroom value undefined");
  } else {
    reconnect(oldRoom!.id, oldRoom!.sessionId, {})
      .then((room) => {
        log("ReConnected!");
        //GAME_STATE.setGameConnected('connected')

        onJoinActions(room, "reconnect");
      })
      .catch((err) => {
        error(err);
      });
  }
}; //end colyseusConnect

//START colyseusConnect//START colyseusConnect//START colyseusConnect
const colyseusConnect = (gameType?: string) => {
  const levels = CONFIG.GAME_ROOM_DATA;

  let levelToLoad = levels[Math.floor(Math.random() * levels.length)];

  if (gameType && gameType == "VB") {
    //if(GAME_STATE.inVox8Park){
    levelToLoad = {
      id: "vox_board_park",
      loadingHint: "Collect coins found in Vox Board Park",
    };
  }
  GAME_STATE.setGameRoomData(levelToLoad);
  log("colyseusConnect loading", levelToLoad.id);

  const roomName = levelToLoad.id; //"level_random_ground_float_few"// "level_random_ground_float_chase" //my_room,level_pad_surfer


  const coinDataOptions:serverStateSpec.CoinRoomDataOptions = {
    levelId:GAME_STATE.raceData.id,
    featuresDefinition: CONFIG.GAME_MINABLES_ENABLED ? COIN_GAME_FEATURE_DEF: { minables:[],buyables:[] }
    /*,name:GAME_STATE.raceData.name
    ,maxLaps:GAME_STATE.raceData.maxLaps
    ,maxPlayers:GAME_STATE.raceData.maxPlayers*/}



    //FIXME
    //does not support nested objects so going to pass it twice for now
    //as the "flattened value. using dot notation so there is parity"
    
    const connectOptions = {
      clientVersion: CONFIG.CLIENT_VERSION, 
      coinDataOptions: coinDataOptions
    }
    

  connect(roomName, connectOptions)
    .then((room) => {
      log("Connected to ", roomName, "!");
      GAME_STATE.setGameConnected("connected");

      onJoinActions(room, "connect");
    })
    .catch((err) => {
      error(err);
    });
}; //end colyseusConnect

export const reshuffleBlocks = () => {
  GAME_STATE.gameRoom?.send("reshuffle-block", "all");
};

export const pullBlocksFixed = () => {
  const playerPos = Camera.instance.position;
  GAME_STATE.gameRoom?.send("pullBlocksFixed", {
    position: { x: playerPos.x, y: playerPos.y, z: playerPos.z },
  });
};

export const pullBlocks = () => {
  const playerPos = Camera.instance.position;
  GAME_STATE.gameRoom?.send("pullBlocksStart", {
    position: { x: playerPos.x, y: playerPos.y, z: playerPos.z },
  });
};




function testXPandCoinCap(context:string){
  let totalCoins = 0

  log("testXPandCoinCap",context)
  log("==================",context)
  
  for(let x=0;x<150;x++){
    totalCoins += x*500
    const level = getLevelFromXp(totalCoins,CONFIG.GAME_LEVELING_FORMULA_CONST)
    const maxCoinsPerLevel = getCoinCap( Math.floor(level),CONFIG.GAME_DAILY_COIN_MAX_FORMULA_CONST)

    log("testXPandCoinCap,",context,"coins:\t",totalCoins,"\tlevel:\t",Math.floor(level),"\tmaxCoins:\t",maxCoinsPerLevel)

  }
  
}
 
testXPandCoinCap("init") 
