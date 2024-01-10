

// Import the custom gameplay code.
import * as ui from 'dcl-ui-toolkit'
import { CONFIG, initConfig } from "./config";
import { initGamePlay } from "./gameplay";
import { doLoginFlow, registerLoginFlowListener } from "./gamimall/login-flow";
import * as utils from '@dcl-sdk/utils'

import "./polyfill/delcares";
import { initRegistry } from "./registry";
import { initStatic } from "./scene";
import { GAME_STATE, initGameState } from "./state";
import { setupUi } from './ui';
import { initConnectionSystem } from './gamimall/connectionSystem';
import { initPxState } from './ui/ui_px';
import { initUIGameHud } from './gamimall/ui-game-hud';
import { initPlayerTransformSystem } from './gamimall/playerPositionSystem';
import { initI18Next } from './i18n/i18next/i18next';
import { initI18nInst } from './i18n/i18n';
import { registerOnProfileChangedListener } from './gamimall/onProfileChanged';
import { getAndSetRealmDataIfNull, getAndSetUserDataIfNull } from './userData';
import { initPad } from './gamimall/padLogic';
import { initResourceDropIns } from './store/resources-dropin';
import { initWearableStore } from './store/wearables';
import { updateStoreNFTCounts } from './store/fetch-utils';
import { executeTask } from '@dcl/sdk/ecs';
import { initMinables } from './gamimall/mining/setupMinables';
import { createLeaderBoardUI } from './gamimall/leaderboard';
import { initLeaderboardRegistry } from './gamimall/leaderboard-utils';
import { initLeaderboards3D } from './modules/leaderBoards3d';
import { initIdleStateChangedObservable } from './back-ports/onIdleStateChangedObservable';
import { initOnCameraModeChangedObservable } from './back-ports/onCameraModeChangedObservable';
import { createBasicDanceArea } from './AutoDance'
import { Vector3 } from '@dcl/sdk/math'
import { initAvatarSwap } from './modules/avatar-swap/arissa';

// export all the functions required to make the scene work
export * from '@dcl/sdk'


export function main(){ 
    console.log("main ENTRY")
    initI18Next()
    initI18nInst()

    initIdleStateChangedObservable()
    //initOnCameraModeChangedObservable

    //new stuff
    initConfig().then((config)=>{

        const _scene = initStatic() 
        
        utils.triggers.enableDebugDraw(CONFIG.DEBUG_ENABLE_TRIGGER_VISIBLE)

        initRegistry();
        initGameState();
        
        getAndSetRealmDataIfNull()
        getAndSetUserDataIfNull()
        registerOnProfileChangedListener();

        initAvatarSwap()

        setupUi();

        //must be setup before we connect to server
        initMinables()

        registerLoginFlowListener()
        //loadPrimaryScene();
        //initGamiMallScene();
        //loadAltScene();
        //loadSecondAltScene();
        //initGameSceneMgr();
        initResourceDropIns(_scene)

        
        executeTask(async () => {
            //must be excuted after initResourceDropIns
            updateStoreNFTCounts()
        })

        //initMinableUI()
        initWearableStore();

        //want later so can be ontop of minable and claim UI
        initLeaderboardRegistry()
        initLeaderboards3D(_scene)
        createLeaderBoardUI()
        
        initUIGameHud();
        /*
        initUIStartGame();
        */
        //trying to remove ui end game file
        //initUIEndGame();
        /*
        initUIStartGame();
        initUILoginGame();
        initUIRaffle();
        startDecentrally();
        addAutoPlayerLoginTrigger();*/

        doLoginFlow(
            { 
            onSuccess:()=>{
                //fetch leaderboards
                //initGamePlay() 
            }
            }
        )

        //TODO add connection system here
        initPxState()
        initConnectionSystem()
        initPlayerTransformSystem()  
         
        try{
          initPad(_scene)
        }catch(e){
          debugger
        }

        /*if(!GAME_STATE.playerState.loginSuccess){
            //TODO add 'doLoginFlow' to REGISTRY
            
            //GAME_STATE.playerState.requestDoLoginFlow()
        }else{ 
            console.log("onEnterSceneObservable.player already logged in: ", GAME_STATE.playerState.loginSuccess,GAME_STATE.playerState.loginFlowState)
        }*/
        // 

    });

    createBasicDanceArea(Vector3.create(15, 1, 63.5), Vector3.create(22, 1, 22))
    
} 
    