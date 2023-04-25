import * as utils from "@dcl/ecs-scene-utils";
import * as ui from "@dcl/ui-scene-utils";
import { connect, CONNECTION_EVENT_REGISTRY, disconnect, reconnect } from "./connection";
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

import { GAME_STATE } from "src/state";
import { refreshUserData } from "./login-flow";
import { Config, CONFIG } from "src/config";
import { Coin, COIN_MANAGER, CoinType as CoinDataType, RewardNotification } from "./coin";
import { Room } from "colyseus.js";
import { REGISTRY } from "src/registry";
import { setLobbyCameraTriggerShape } from "src/configTriggers";

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

  GAME_STATE.setGameRoom(room);

  GAME_STATE.setGameCoinRewardGCValue(0)
  GAME_STATE.setGameCoinRewardMCValue(0)
  GAME_STATE.setGameCoinGCValue(0)
  GAME_STATE.setGameCoinMCValue(0)

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
    player.listen("coinsCollectedEpoch", (num: number) => {
      log("player.listen.coinsCollectedEpoch", num);
      GAME_STATE.setGameCoinsCollectedEpochValue(num);
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

  
  room.onMessage("game-saved", () => {
    log("room.msg.game-saved");
    refreshUserData("game-saved")
    ui.displayAnnouncement(`Save Complete`, 3, Color4.White(), 60);
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
      //GAME_STATE.notifyInGameMsg(message);
      //ui.displayAnnouncement("PLUG IN LEVEL UP:"+result.newLevel, 8, Color4.White(), 60);
      if(result.rewards!==undefined){
        let gc=0
        let mc=0
        for(const p in result.rewards){
          switch(result.rewards[p].id){
            case CONFIG.GAME_COIN_TYPE_GC:
              gc=result.rewards[p].amount
            break;
            case CONFIG.GAME_COIN_TYPE_MC:
              mc=result.rewards[p].amount
            break;
            default:
              log("unhandled reward type",result.rewards[p].id,result.rewards[p])
          }
        }
        GAME_STATE.setGameCoinRewardGCValue(GAME_STATE.gameCoinRewardGCValue + gc)
        GAME_STATE.setGameCoinRewardMCValue(GAME_STATE.gameCoinRewardMCValue + mc)

        GAME_STATE.setGameCoinGCValue(  GAME_STATE.gameCoinGCValue )      
        GAME_STATE.setGameCoinMCValue(  GAME_STATE.gameCoinMCValue )      
      }
      REGISTRY.ui.levelUpPrompt.update(result)
      REGISTRY.ui.levelUpPrompt.show()
    }

    //ui.displayAnnouncement(`${highestPlayer.name} wins!`, 8, Color4.White(), 60);
    //ui.displayAnnouncement(message, 8, Color4.White(), 60);
    //GAME_STATE.setGameEndResultMsg()
  });

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
    //debugger 
    refreshUserData("onLeave'");
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
  connect(roomName, {})
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
