//import * as utils from '@dcl/ecs-scene-utils';
import { Entity, GltfContainer, Transform, engine, pointerEventsSystem,InputAction  } from '@dcl/sdk/ecs';
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math';
import { movePlayerTo,openExternalUrl } from '~system/RestrictedActions'
import { makeLeaderboard } from '../gamimall/leaderboard';
import { PlayerLeaderboardEntryType, getLeaderboardRegistry } from '../gamimall/leaderboard-utils';
import { CONFIG, SCENE_TYPE_GAMIMALL } from '../config';
import { log } from '../back-ports/backPorts';
import { REGISTRY } from '../registry';

const CLASSNAME = "leaderBoards3d.ts"

export function initLeaderboards3D(_scene:Entity){
  const METHOD_NAME = "initLeaderboards3D"
  if(CONFIG.SCENE_TYPE !== SCENE_TYPE_GAMIMALL){
    log(CLASSNAME,METHOD_NAME,"DISABLED FOR SCENE TYPE",CONFIG.SCENE_TYPE)
    return
  }
   //START MAKING LEADERBOARD ENTITIES
    //75 for hourly
    //
    const boardPlacement = 44.95//if top_center use -> 43.5;
    const boardPlacementZ = 14.40;
    const boardPlacementY = 5.8; //.8
  // const VoxboardPlacement = 48;
    //const VoxBoardXSpacing = 2;
    const boardXSpacing = 3.6;
    const boardTypeHourly = 0;
    const boardTypeDaily = 1;
    const boardTypeWeekly = 2;

    const leaderboardBigWeekly = engine.addEntity()//new Entity("XleaderboardBigWeekly");
    //engine.addEntity(leaderboardBigWeekly);
    //leaderboardBigWeekly.setParent(_scene);
    //XsignpostTreeSkyMaze.setParent(_scene)
    Transform.create(leaderboardBigWeekly,{
        position: Vector3.create(
          boardPlacementZ ,
          boardPlacementY,
          boardPlacement- boardXSpacing * boardTypeWeekly
        ),
        rotation: Quaternion.fromEulerDegrees(-30, 90, 0),
        scale: Vector3.create(2.5, 2.5, 1),
        parent: _scene
      }
    );
    const leaderboardBigDaily = engine.addEntity()//new Entity("XleaderboardBigDaily");
    //engine.addEntity(leaderboardBigDaily);
    //leaderboardBigDaily.setParent(_scene);
    //XsignpostTreeSkyMaze.setParent(_scene)
    Transform.create(leaderboardBigDaily,{
        position: Vector3.create(
          boardPlacementZ ,
          boardPlacementY,
          boardPlacement- boardXSpacing * boardTypeDaily
        ),
        rotation: Quaternion.fromEulerDegrees(-30, 90, 0),
        scale: Vector3.create(2.5, 2.5, 1),
        parent: _scene
      }
    );

    const leaderboardBigHourly = engine.addEntity()//new Entity("XleaderboardBigHourly");
    //engine.addEntity(leaderboardBigHourly);
    //leaderboardBigHourly.setParent(_scene);
    //XsignpostTreeSkyMaze.setParent(_scene)
    Transform.create(leaderboardBigHourly,{
        position: Vector3.create(
          boardPlacementZ,
          boardPlacementY,
          boardPlacement - boardXSpacing * boardTypeHourly
        ),
        rotation: Quaternion.fromEulerDegrees(-30, 90, 0),
        scale: Vector3.create(2.5, 2.5, 1),
        parent: _scene
      }
    );

  const LEADERBOARD_REG = getLeaderboardRegistry()
  
  //START MAKING SCENE LEADERBOARD
  let playerArr: PlayerLeaderboardEntryType[] = [];
  let leaderBoardPlaceHolderText = "\nSign in to see leaderboard";
  playerArr.push({
    DisplayName: "Sign in to see leaderboard",
    Position: 0,
    StatValue: 0,
  });
  /*for(let x=0;x<CONFIG.GAME_LEADEBOARD_MAX_RESULTS;x++){
    playerArr.push({DisplayName:"p"+x,Position:x,StatValue:100+x})
  }*/

  //leaderBoardPlaceHolderText+="\n\n"+"You"+99+"......"+"2344"

  //script15.spawn(leaderboardBigDaily, {"text":leaderBoardPlaceHolderText,"fontSize":15,"clickable":false}, createChannel(channelId, leaderboardBigDaily, channelBus))

  const LEADERBOARD_TITLE_TRANSFORM = {
    position: Vector3.create(0, 1.4, -0.02),
  };
  const LEADERBOARD_TITLE2_TRANSFORM = {
    position: Vector3.create(0, 1.57, -0.02),
  };
  const LEADERBOARD_SUPER_DOGIO_TEXT_SCALE = Vector3.create(0.7, 0.7, 0.7);
  const LEADERBOARD_SUPER_DOGIO_FONT_COLOR = Color4.White();
  const LEADER_BOARD_SUPER_DOGIO_TITLE: string|undefined = undefined; //"Super Dogerio"
 
  //debugger 

  LEADERBOARD_REG.hourly.push(makeLeaderboard(
    leaderboardBigHourly,
    "plane" /*script18.model*/,
    undefined /*"Leaderboard (Hourly)"*/,
    LEADER_BOARD_SUPER_DOGIO_TITLE,
    leaderBoardPlaceHolderText,// + "HOUR",
    1,
    undefined,
    LEADERBOARD_TITLE_TRANSFORM,
    LEADERBOARD_TITLE2_TRANSFORM,
    {
      position: Vector3.create(0, 1.28, -0.02),
      scale: LEADERBOARD_SUPER_DOGIO_TEXT_SCALE,
    },
    LEADERBOARD_SUPER_DOGIO_FONT_COLOR,
    { //onclick
      fn: ()=>{ REGISTRY.ui.openLeaderboardHourly() },
      hoverText : "Hourly Results Details",
      maxDistance: 12
    }
  ));

  LEADERBOARD_REG.daily.push(makeLeaderboard(
    leaderboardBigDaily,
    "plane" /*script18.model*/,
    undefined /*"Leaderboard (Daily)"*/,
    LEADER_BOARD_SUPER_DOGIO_TITLE,
    leaderBoardPlaceHolderText,// + "DAILY",
    1,
    undefined,
    LEADERBOARD_TITLE_TRANSFORM,
    LEADERBOARD_TITLE2_TRANSFORM,
    {
      position: Vector3.create(0, 1.28, -0.02),
      scale: LEADERBOARD_SUPER_DOGIO_TEXT_SCALE,
    },
    LEADERBOARD_SUPER_DOGIO_FONT_COLOR,
    { //onclick
      fn: ()=>{ REGISTRY.ui.openLeaderboardDaily() },
      hoverText : "Daily Results Details",
      maxDistance: 12
    }
  ));

  LEADERBOARD_REG.weekly.push(makeLeaderboard(
    leaderboardBigWeekly,
    "plane" /*script18.model*/,
    undefined /*"Leaderboard (Weekly)"*/,
    LEADER_BOARD_SUPER_DOGIO_TITLE,
    leaderBoardPlaceHolderText,// + "WEEK",
    1,
    undefined,
    LEADERBOARD_TITLE_TRANSFORM,
    LEADERBOARD_TITLE2_TRANSFORM,
    {
      position: Vector3.create(0, 1.28, -0.02),
      scale: LEADERBOARD_SUPER_DOGIO_TEXT_SCALE,
    },
    LEADERBOARD_SUPER_DOGIO_FONT_COLOR,
    { //onclick
      fn: ()=>{ REGISTRY.ui.openLeaderboardWeekly() },
      hoverText : "Weekly Results Details",
      maxDistance: 12
    }
  ));

}