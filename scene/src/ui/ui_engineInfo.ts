import { PBUiCanvasInformation, UiCanvasInformation, engine } from "@dcl/sdk/ecs"


import { Observable } from '@dcl/sdk/internal/Observable'

let initAlready = false

//https://sentry.io/answers/remove-specific-item-from-array/
function removeValue(value:any, index:any, arr:any) {
  // If the value at the current array index matches the specified value (2)
  if (value === 2) {
  // Removes the value from the original array
      arr.splice(index, 1);
      return true;
  }
  return false;
}



let lastKnownCanvasInfo: PBUiCanvasInformation
export const onCanvasInfoChangedObservable = new Observable<PBUiCanvasInformation>((observer) => {
  onCanvasInfoChangedObservable.notifyObserver(observer, lastKnownCanvasInfo)
})

export let canvasInfo: PBUiCanvasInformation = {
  width: 0,
  height: 0,
  devicePixelRatio: 1,
  interactableArea: undefined
}  

let devicePixelRatioScale: number = 1

export function updateUIScalingWithCanvasInfo(canvasInfo: PBUiCanvasInformation) {
  //higher res go bigger
  //threshhold???
  ///(1920/1080)/1.35 = 1.3
  ///(1920/1080)/1.1 = 1.6
  devicePixelRatioScale = 1920 / 1080 / canvasInfo.devicePixelRatio

  console.log('updateUIScalingWithCanvasInfo', canvasInfo, 'devicePixelRatioScale', devicePixelRatioScale)

  const PIXEL_RATIO_THREADHOLD = 1.2
  //at least for this side of the screen window checking dimensions seems better than ratio
  //const threshHoldHit = canvasInfo.width > 2300 && canvasInfo.height > 1300
  //const threshHoldHit = devicePixelRatioScale>PIXEL_RATIO_THREADHOLD

  //bigger and taller
  if (canvasInfo.width > 1920 && canvasInfo.height > 1080) {
    /*tieredModalScale = 2
    tieredFontScale = 2
    tieredModalTextWrapScale = 1.08*/
    /*}else if(canvasInfo.width < 2300 && canvasInfo.height > 1200){
    //gave up on this for now
    //very tall and skinny shift down
    tieredModalScale = 1.2
    tieredFontScale = 1.4
    tieredModalTextWrapScale = .8*/
  } else {
    //default is 1
    //tieredModalScale = 1.1
    //tieredFontScale = 1.1
    //tieredModalTextWrapScale = 0.9
  }
  
  const scale = canvasInfo.height / 1080

  console.log(
    'updateUIScalingWithCanvasInfo',
    canvasInfo,"scale",scale
  )
  //inScale: number, inFontSize: number, inTextWrapScale: number

  //setupCustomNPCUiScaling(scale, scale, scale)
  //setupBeamUiScaling(scale, scale, scale)
  //setupNPCUiScaling(scale, scale, scale)
  //setupBasketballUiScaling(scale, scale, scale)
  //setupEventDetailsUIScaling(scale, scale, scale)
}


let setupUiInfoEngineAlready = false
export function setupUiInfoEngine() {
  const METHOD_NAME = "setupUiInfoEngine"
  if (setupUiInfoEngineAlready) return

  setupUiInfoEngineAlready = true

  let maxWarningCount = 20
  let warningCount = 0
  engine.addSystem((deltaTime) => {
    //bug or on purpose, returns null until screen is resized???
    //but retina vs non retina is seems ok up to this point?? 
    const uiCanvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (!uiCanvasInfo) {
      warningCount++
      if (warningCount < maxWarningCount) {
        console.log(METHOD_NAME, 'WARNING ', warningCount, 'screen data missing: ', uiCanvasInfo)
      } 
      return
    } else if (maxWarningCount > 0) {
      
      maxWarningCount = 0
      console.log(METHOD_NAME, 'FIXED ' + 'screen data resolved: ', uiCanvasInfo)
    }
    
    //if didn't change
    if (canvasInfo.width === uiCanvasInfo.width && canvasInfo.height === uiCanvasInfo.height){
      //console.log(METHOD_NAME, 'no change ', canvasInfo,"vs",uiCanvasInfo)
      return
    }  

    
    console.log(METHOD_NAME, 'Updated', 'Width', canvasInfo.width, 'Height:', canvasInfo.height)
    canvasInfo.width = uiCanvasInfo.width
    canvasInfo.height = uiCanvasInfo.height
    canvasInfo.devicePixelRatio = uiCanvasInfo.devicePixelRatio
    canvasInfo.interactableArea = uiCanvasInfo.interactableArea

    lastKnownCanvasInfo = canvasInfo

    
    onCanvasInfoChangedObservable.notifyObservers(canvasInfo)


    updateUIScalingWithCanvasInfo(canvasInfo)

    /*console.log("setupUiInfoEngine",'--------------' ,
     '\nscreen width: ' + uiCanvasInfo.width ,
       '\nscreen height: ' + uiCanvasInfo.height ,
       '\nscreen pixel ratio: ' + uiCanvasInfo.devicePixelRatio ,
       '\n--------------')*/
  })
}