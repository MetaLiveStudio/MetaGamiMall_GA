import * as ui from "@dcl/ui-scene-utils";
import { CONFIG } from "src/config";
//import { CustomPrompt } from "src/dcl-scene-ui-workaround/CustomPrompt";
import resources, { setSection } from "src/dcl-scene-ui-workaround/resources";
import { REGISTRY } from "src/registry";
import { GameEndResultType, GAME_STATE } from "src/state";
import { CustomOkPrompt, CustomOptionsPrompt, custUiAtlas, uiDimToNumber } from "src/ui/modals";
import { isNull } from "src/utils";
//import { refreshUserData } from "./login-flow";
import { RESOURCES } from "./resources";
import atlas_mappings from "src/ui/atlas_mappings";
import { i18n, i18nOnLanguageChangedAdd } from "src/i18n/i18n";
import { namespaces } from "src/i18n/i18n.constants";

/*
const entity = new Entity()
entity.addComponent(new GLTFShape('models/Lildoge_NLA.gltf'))
entity.addComponent(new Transform({position:new Vector3(1,1,1)}))

if(!entity.hasComponent(Animator)) entity.addComponentOrReplace(new Animator())
entity.getComponent(Animator).addClip(new AnimationState("Run", { looping: true })))
entity.getComponent(Animator).addClip(new AnimationState("Idle", { looping: true }))
 
entity.getComponent(Animator).getClip("Run").play()

engine.addEntity(entity)
*/
/*
export const raffleGamePrompt = new CustomPrompt(ui.PromptStyles.DARKLARGE,400,400)

//raffleGamePrompt.hide()

raffleGamePrompt.addText("Play Super Dogerio",0,180,Color4.White(),20)

raffleGamePrompt.addIcon("images/play-carousel-1.png",0,0,80,80)
raffleGamePrompt.addIcon("images/play-carousel-2.png",0,0,80,80)

raffleGamePrompt.addText("Play",0,180,Color4.White(),20)

*/


const SHIFTY = -30;
const SHIFTY_TEXT = -10;

export const PROMPT_PICKER_WIDTH = 530;
export const PROMPT_PICKER_HEIGHT = 500; //550
export const PROMPT_OFFSET_X = 0; //80//move it away from communications box as cant click thru it
export const PROMPT_OFFSET_Y = 40;
export const MAIN_CONTENT_START_Y = 180;
export const PROMPT_TITLE_HEIGHT = 230 + SHIFTY; //250 + SHIFTY
export const PROMPT_TITLE_COLOR = Color4.White();
export const BUTTON_HEIGHT = 60;

export const PROMPT_OVERLAY_TEXT_COLOR = Color4.White();

export const PROMPT_PICKER_OVERLAY_WIDTH = PROMPT_PICKER_WIDTH;
export const PROMPT_PICKER_OVERLAY_HEIGHT = 320;
export const PROMPT_OVERLAY_OFFSET_X = 0;
export const PROMPT_OVERLAY_OFFSET_Y = 60;

export const BUTTON_POS_Y = -180; //-180

const BANNER_SOURCE_WIDTH = 1093; //1038
const BANNER_SOURCE_HEIGHT = 128;
const BANNER_IMAGE_SCALE = 0.3;

const startX = -370;
const startY = MAIN_CONTENT_START_Y;
const rowHeight = 30;
const rowPaddY = 10;
const colWidth = 200;
const buttonHeight = BUTTON_HEIGHT;

let yCounter = startX;

const gameTutorialImg = RESOURCES.textures.gameTutorialBg.src;
const gameTutorialImgTexture = RESOURCES.textures.gameTutorialBg;
const gameTutorialImgDesc =
  "(1/2) Raffle Game.\nIt costs 100 LilCoins To Play.\n Are you feeling lucky!";

  
const gameImageList: Texture[] = [
  gameTutorialImgTexture,
  gameTutorialImgTexture,
  //,gameTutorialImgTexture
  //,gameTutorialImgTexture
  //,gameTutorialImgTexture
  //,gameTutorialImgTexture
];
 
const gameImageDescList: string[] = [
  gameTutorialImgDesc,
  //,"(2/6) There are two \n kinds of tokens in \n Beta Version. \n LilCoins and MetaCash, \n 100 LilCoins = 1 MetaCash"
  //,"(3/6) One player can collect\n 100 MetaCash per day, \nbased on UTC Time, \nyou can check UTC in \nthe bottom right corner."
  //,"(4/6) You can check\n your position in the \ndaily/weekly leaderboard,\n which is the right of your\n screen."
  //,"(5/6) We will hold rewards\n contests in the future,\n so get some practice and\n be ready for the rewards!!!"
  //,"(6/6) Lastly, have fun!!!\n We will keep improving \nthe experience and keep\n thinking about how to\n benefit you!!!"
  "(2/2) Play for a chance to win up to double your bet.",
  //"(3/3) There are two kinds of tokens in beta version: LilCoins and MetaCash. 100x LilCoins = 1x MetaCash.",
  //,"(3/6) A player can collect 100x MetaCash per day, based on UTC Time. You can check the time in the bottom right corner clock."
  //,"(4/6) You can check your ranking in the daily & weekly leaderboard, located on the right side panel."
  //,"(5/6) We will hold reward contests in the future, so start practicing and get ready for those prizes!!!"
  //,"(6/6) Lastly, have fun!!! We will keep working to improve the experience and we're constantly thinking of ways to reward our players!"
];

let buttonPosY = BUTTON_POS_Y;

let raffleGamePrompt:CustomOptionsPrompt//ui.CustomPrompt
let playResultsPrompt:CustomOkPrompt//ui.CustomPrompt
let playResults:ui.CustomPromptText
let multiplierInputBox:ui.CustomPromptTextBox
let multEquationValueText:ui.CustomPromptText

function isNumeric(str:string) {
  if (typeof str != "string") return false // we only process strings! 

  return !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    //!isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         
}

let betMultiplier = 1

function onChangeUpdateMultiplier(){
  let val = 1
  let valStr = "0"
  
  const multi = multiplierInputBox.fillInBox.value
  
  const minNum = 1
  const maxNum = 10

  if(isNumeric(multi) ){
    if(
      parseInt(multi)>=minNum
      && parseInt(multi)<=maxNum){
      betMultiplier = parseInt(multi)
      val = betMultiplier * 100
      valStr = val +""
      multEquationValueText.text.color = Color4.White()
    }else{
      valStr = "Must be between \n" + minNum + "-"+ maxNum
      multEquationValueText.text.color = Color4.Red()  
    }
  }else{
    valStr = "Invalid Value"
    multEquationValueText.text.color = Color4.Red()
  }1
  multEquationValueText.text.value = valStr
}
export function initUIRaffle() {

  const Y_OFFSET = 50
  try{

    const endOptions = {
      width: PROMPT_PICKER_WIDTH,
      height: PROMPT_PICKER_HEIGHT + Y_OFFSET,
      modalWidth: 0,
    };
    
    //export const agePrompt = new CustomPrompt(CUSTOM_TEXTURE,400,300)
    raffleGamePrompt = new CustomOptionsPrompt(
      i18n.t("raffleTitle",{ns:namespaces.ui.raffle}),
      i18n.t("raffleText",{ns:namespaces.ui.raffle}),
      i18n.t("rafflePlay",{ns:namespaces.ui.raffle}),
      "",
      i18n.t("raffleCancel",{ns:namespaces.ui.raffle}),
      "",
      () => {
        if (isNull(GAME_STATE.playerState.playFabLoginResult)) {
          log("player not logged in yet");
          ui.displayAnnouncement("Player not logged in yet");
          hideRaffleGamePrompt();
          REGISTRY.ui.openloginGamePrompt();
        } else {
          showPlayResultsUI(true);
        }
      },
      ()=>{
        hideRaffleGamePrompt();
      },
      endOptions
    );
    
    raffleGamePrompt.title.text.positionY = uiDimToNumber(raffleGamePrompt.title.text.positionY) + 20;
    
    raffleGamePrompt.buttonConfirmBtn.image.height = BUTTON_HEIGHT
    raffleGamePrompt.buttonSecondaryBtn.image.height = BUTTON_HEIGHT

    raffleGamePrompt.buttonConfirmBtn.image.positionY = BUTTON_POS_Y//uiDimToNumber(raffleGamePrompt.buttonConfirmBtn.image.positionY) - Y_OFFSET/2;
    raffleGamePrompt.buttonSecondaryBtn.image.positionY = BUTTON_POS_Y//uiDimToNumber(raffleGamePrompt.buttonSecondaryBtn.image.positionY) - Y_OFFSET/2;
    
    raffleGamePrompt.text.text.vAlign = "center";
    raffleGamePrompt.text.text.hTextAlign = "left";
    raffleGamePrompt.text.text.adaptHeight = true;
    
    const multiplierPosY = -120
    raffleGamePrompt.prompt.addText("Multiplier",-140,multiplierPosY + 10,Color4.White(),20)
    const multEquationText= raffleGamePrompt.prompt.addText("x 100 = ",30,multiplierPosY + 10,Color4.White(),20)
    multEquationValueText= raffleGamePrompt.prompt.addText("100",150,multiplierPosY + 10,Color4.White(),20)
    multEquationValueText.text.textWrapping = true
    multEquationValueText.text.width = 130
    multiplierInputBox = raffleGamePrompt.prompt.addTextBox(-50,multiplierPosY,betMultiplier+"",
      ()=>{
        onChangeUpdateMultiplier()
      })
    

    multiplierInputBox.fillInBox.width = 50

    raffleGamePrompt.hide();
 
    raffleGamePrompt.prompt.background.positionX = PROMPT_OFFSET_X;
    raffleGamePrompt.prompt.background.positionY = PROMPT_OFFSET_Y;

    playResultsPrompt =  new CustomOkPrompt(
      i18n.t("raffleResult",{ns:namespaces.ui.raffle}),
      i18n.t("raffleLoading",{ns:namespaces.ui.raffle}),
      i18n.t("raffleOK",{ns:namespaces.ui.raffle}),
      () => {
        //log('play')
        showPlayResultsUI(false);
        openRaffleGamePrompt()
        //start game.
        //hideRaffleGamePrompt()
      }
    );
    /*playResultsPrompt.onShowcallback = () => {
      playResultsPrompt.button.image.visible = false;
      playResultsPrompt.button.label.visible = false;
      playResultsPrompt.prompt.closeIcon.visible = false;
    };*/
  
    /*playResultsPrompt.text.text.value = "Hint: Find the coins";
    playResultsPrompt.text.text.positionY = -35
    playResultsPrompt.text.text.height = 50
    playResultsPrompt.text.text.vTextAlign = "center"
    playResultsPrompt.text.text.fontSize = 17*/
  
    //export const startGamePrompt = new CustomPrompt(RESOURCES.textures.darkThemeSemiTransparent.src,PROMPT_PICKER_WIDTH,PROMPT_PICKER_HEIGHT)
    
    playResultsPrompt.hide();

    

    playResults = playResultsPrompt.text
    /*playResultsPrompt.addText("....", 0, 0, Color4.White(), 18);
    //let gameImageSubTitleAddress = startGamePrompt.addText("No Player Selected", 0, BUTTON_POS_Y + BUTTON_HEIGHT*1.2)
    playResults.text.width = 256 + image_scale - 30;
    playResults.text.height = 256 + image_scale - 50;
    playResults.text.textWrapping = true;
    playResults.text.vAlign = "center";
    playResults.text.hAlign = "center";
    //pushes to top and to left
    //gameImageSubTitle.text.hTextAlign = 'left'
    //gameImageSubTitle.text.vTextAlign = 'top'
    //centers it completely
    playResults.text.hTextAlign = "center";
    playResults.text.vTextAlign = "center";*/


    //export const loadingIcon = new ui.LoadingIcon(DEFAULT_LOAD_ICON_DURATION)
    //loadingIcon.hide()

  }catch(e){
    
    log("initUIRaffle","ERROR loading ",e) 
  }

  
  REGISTRY.ui.openRaffleGamePrompt = openRaffleGamePrompt
  REGISTRY.ui.hideRaffleGamePrompt = hideRaffleGamePrompt
  
}//end initUIRaffle



function openRaffleGamePrompt() {
  raffleGamePrompt.show();
  multiplierInputBox.fillInBox.placeholder = betMultiplier + ""
  multiplierInputBox.fillInBox.value = betMultiplier + ""
  onChangeUpdateMultiplier()
}


function hideRaffleGamePrompt() {
  raffleGamePrompt.hide();
}


function showPlayResultsUI(val: boolean, duration?: number) {
  log("showLoadingUI START ", val, duration);

  //log("showLoadingUI  " + loadingIcon.image.visible)

  const betText = "Bet: " + 100 * betMultiplier +"\n"

  playResults.text.value = betText + "...";

  if (val) {
    playResultsPrompt.show();

    //TODO consider moving this to the colyseus server???, keep the reward notify
    playRaffle().then((result: GameEndResultType) => {
      if (!result.raffleResult) {
        playResults.text.value = "Unexpected response";
        return;
      }


      if (!result.raffleResult.hasEnoughToPlay) {
        playResults.text.value = betText+ i18n.t("raffleNoMoney",{ns:namespaces.ui.raffle});
        return;
      }
      let refreshData = false;
      if (result.raffleResult.amountWon < 0) {
        playResults.text.value =
        betText+ i18n.t("raffleLost",{ns:namespaces.ui.raffle}) + result.raffleResult.amountWon + " :(";
        refreshData = true;
      } else if (result.raffleResult.amountWon == 0) {
        playResults.text.value = betText+ i18n.t("raffleEven",{ns:namespaces.ui.raffle});
      } else {
        playResults.text.value =
          betText+ i18n.t("raffleWon",{ns:namespaces.ui.raffle}) + result.raffleResult.amountWon + " :)";
        refreshData = true;
      }

      if (refreshData) {
        //need to update rewards
        //refreshing user data with our lobby coin game will screw things up
        GAME_STATE.setGameCoinRewardGCValue( GAME_STATE.gameCoinRewardGCValue + result.raffleResult.amountWon) 
        //forces a refresh of stanima bar
        GAME_STATE.setGameCoinGCValue(  GAME_STATE.gameCoinGCValue )      
        //refreshUserData('raffle');
      }
    });
  } else {
    playResultsPrompt.hide();
  }

  //new ui.LoadingIcon(DEFAULT_LOAD_ICON_DURATION,50,50)

  /*if(val && duration && duration !== undefined ){
    utils.setTimeout(
        duration ? duration : DEFAULT_LOAD_ICON_DURATION, () => {
          log("showLoadingUI hide timer fired")
          playResultsPrompt.hide()
        }
    )
  }*/
}


export async function playRaffle(): Promise<GameEndResultType> {
  const METHOD_NAME = "playRaffle";
  const customBaseUrl = CONFIG.RAFFLE_URL;
  const resultPromise = executeTask(async () => {
    let response = null;
    //https://us-central1-sandbox-query-blockchain.cloudfunctions.net/blockChainQueryApp/get-account-nft-balance?network=
    //https://us-central1-sandbox-query-blockchain.cloudfunctions.net/blockChainQueryApp/get-account-nft-balance?network=matic&ownerAddress=0xbd5b79D53D75497673e699A571AFA85492a2cc74&limit=9&logLevel=debug&storage=cacheX&multiCall=true&contractId=dcl-mtdgpnks
    const callUrl =
      customBaseUrl +
      "?" +
      //const callUrl= customBaseUrl + '/blockChainQueryApp/hello-world?'
      "&playFabId=" +
      encodeURIComponent(GAME_STATE.playerState.playFabLoginResult?.PlayFabId) + //GAME_STATE.playerState.playerPlayFabId
      "&session=" +
      encodeURIComponent(GAME_STATE.playerState.playFabLoginResult?.SessionTicket) +
      "&betMultiplier=" + betMultiplier
      "&titleId=" +
      CONFIG.PLAYFAB_TITLEID +
      //+'&publicKey=' + GAME_STATE.playerState.dclUserData?.publicKey
      "&_unique=" +
      new Date().getTime();

    try {
      log(METHOD_NAME + " calling " + callUrl);
      response = await fetch(callUrl, {
        //headers: { "Content-Type": "application/json" },
        method: "GET",
        //body: JSON.stringify(myBody),
      });
      if (response.status == 200) {
        let json = await response.json();

        //log(json)
        log(METHOD_NAME + " reponse ", json);
        const retVal = json[0].endGameResult;
        log(METHOD_NAME + " reponse ", retVal);
        return retVal;
      } else {
        let json = await response.json();
        //log("NFTRepository reponse " + response.status + " " + response.statusText)
        log(
          METHOD_NAME +
            " error reponse to reach URL status:" +
            response.status +
            " text:" +
            response.statusText +
            " json:" +
            JSON.stringify(json)
        );
        //throw new Error(response.status + " " + response.statusText)
        return {
          errorMsg: response.status + " " + response.statusText + " " + json,
        };
      }
    } catch (e) {
      log(METHOD_NAME + ".failed to reach URL " + e + " " + response);
      throw e;
    }
  });

  return resultPromise;
}
