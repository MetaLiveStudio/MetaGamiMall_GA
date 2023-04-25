
export type MinableAnimationNameDef = {
  name:string
  duration:number
  autoStart?:boolean
}
export type MinableAnimationNameType = {
  IDLE?: MinableAnimationNameDef
  WALK?: MinableAnimationNameDef
  ACTIVATE?: MinableAnimationNameDef
}
