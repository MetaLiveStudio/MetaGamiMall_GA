import * as utils from '@dcl/ecs-scene-utils';
import { UserData } from '@decentraland/Identity';
import { CONFIG } from "./config";
import { RaceData } from './modules/race';
import { Constants } from './modules/resources/globals';
import { player, scene } from './modules/scene';
import { initLobbyScene } from "./modules/scene/lobby";
import { initRacingScene } from "./modules/scene/race";
import { initSceneMgr } from './modules/scene/raceSceneManager';
//import { Constants.SCENE_MGR } from "./modules/scene/raceSceneManager";
import { GAME_STATE } from 'src/state';
import { TrackData } from './modules/trackPlacement';
import { createDebugUIButtons } from "./modules/ui/ui-hud-debugger";
import { getAndSetUserData, getUserDataFromLocal } from './modules/userData';
import { levelManager } from './tracks/levelManager';
//MOVED TO src/meta-decentrally/modules/scene/race.ts

//const Constants.SCENE_MGR = Constants.Constants.SCENE_MGR


export async function startDecentrally(){

    //DO THIS FIRST so have it going forward
    //load user data
    if(!getUserDataFromLocal()){
        //should we wait? or let the rest process
        getAndSetUserData()
    } 

    initSceneMgr()
    
    //TODO trackPath which is current just a curved path
    //do we create a parallel 2d array where index 0 ID == segement id and index 1 array is stuff that may be on there?
    //but need to be able to have overlapping datapoints
    //maybe just array type, start, end point, offset from center? - assumed parralell to track
    GAME_STATE.trackData = new TrackData()
    //GAME_STATE.trackData.setTrackPath( levelManager.getCurrentLevel().trackPath)
    //TODO level manager should populate these too
    //GAME_STATE.trackData.setCheckPoints()
    //GAME_STATE.trackData.setTrackFeatures() OR GAME_STATE.trackData.addTrackFeature()
    GAME_STATE.trackData.init( levelManager.getCurrentLevel() )

    GAME_STATE.raceData = new RaceData()
  
    //moved to autologin.ts
    //addAutoPlayerLoginTrigger() 
        

    initLobbyScene()
    initRacingScene()
    
    //if to opt
    if(CONFIG.LOAD_MODELS_DURING_SCENE_LOAD_ENABLED){
        

        Constants.SCENE_MGR.racingScene.init()  
        //FIXME some of the hiding only happens during reset
        Constants.SCENE_MGR.racingScene.resetRace() 
        //official hide
        Constants.SCENE_MGR.racingScene.hide(true)

        Constants.SCENE_MGR.lobbyScene.init()  
        Constants.SCENE_MGR.lobbyScene.show() 
         
    } 
    log("racing scene init")
    if(CONFIG.TEST_CONTROLS_ENABLE){
        //load once scene is up
        utils.setTimeout( 400, () => { 
        try{
            createDebugUIButtons()
        }catch(e){
        log("failed to init debug buttons",e)
        } 
        } )
    }//END OF SHOW TEST BUTTONS   

    onSceneReadyObservable.add(() => {
        log("SCENE LOADED")
    })
}

//start()