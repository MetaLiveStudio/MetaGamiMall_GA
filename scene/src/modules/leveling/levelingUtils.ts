import { LevelingFormulaConfig } from "./levelingTypes"

/*
//worth a read
https://gist.github.com/Jikoo/30ec040443a4701b8980
http://howtomakeanrpg.com/a/how-to-make-an-rpg-levels.html
https://onlyagame.typepad.com/only_a_game/2006/08/mathematics_of_.html
*/

export function getLevelFromXp(xp:number,levelingConfig:LevelingFormulaConfig):number{
  
  let level = Math.pow(xp, 1/levelingConfig.y)* levelingConfig.x
  if(level > levelingConfig.max ){
    level = levelingConfig.max
  }
  if(level < levelingConfig.min ){
    level = levelingConfig.min
  }
  return level
}
export function getXPFromLevel(level:number,levelingConfig:LevelingFormulaConfig):number{
  //TODO
  //xp = (level/x)^y
  const xp = Math.pow(level/levelingConfig.x,levelingConfig.y)
  return xp
}
export function getXPDiffBetweenLevels(level1:number,level2:number,levelingConfig:LevelingFormulaConfig):number{
  const xp1 = getXPFromLevel(level1,levelingConfig)
  const xp2 = getXPFromLevel(level2,levelingConfig)

  const diff = xp2 - xp1

  log("getXPDiffBetweenLevels",levelingConfig,"level1",level1,"level2",level2,"xp1",xp1,"xp2",xp2,"diff",diff)

  return diff
}
export function getLevelPercentFromXp(xp:number,levelingConfig:LevelingFormulaConfig):number{
  const level = getLevelFromXp(xp,levelingConfig)
  const thisLevelBaseXp = getXPFromLevel(Math.floor(level),levelingConfig)
  const nextLevelXP = getXPFromLevel(Math.floor(level + 1),levelingConfig)
  const valDiff = xp-thisLevelBaseXp
  const levelDiff = nextLevelXP-thisLevelBaseXp
  const percent = levelDiff > 0 ? (( valDiff/(levelDiff) )*100) : 0
  log("getLevelPercentFromXp",levelingConfig,"xp",xp,"level",level,"thisLevelBaseXp",thisLevelBaseXp,"nextLevelXP",nextLevelXP,valDiff,levelDiff,"percent",percent)

  return percent
}