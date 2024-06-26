import *  as  ui from 'dcl-ui-toolkit'
//import { REGISTRY } from 'src/registry'
import { CONFIG } from '../config'
import { REGISTRY } from '../registry'
import { PromptButton } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Button'
import { Transform, engine } from '@dcl/sdk/ecs'
import { log } from '../back-ports/backPorts'
import { getAndSetUserDataIfNull } from '../userData'
import { doLoginFlow, fetchLeaderboardInfo, logout, refreshUserData, resetLoginState } from '../gamimall/login-flow'
import { GAME_STATE } from '../state'
import { colyseusReConnect } from '../gameplay'
import { PromptExt } from './ext/PromptExt'
import { PromptWrapper } from './extDclUiToolkit'
import { DEFAULT_SCREEN_TYPE, SCREEN_RETINA, SCREEN_STANDARD } from './modals'


const CLASSNAME = "ui-hud-debugger.ts"

const buttonPosSTART = -300
let buttonPosCounter = buttonPosSTART
const buttonPosYSTART = 300
let buttonPosY = buttonPosYSTART
const buttonWidth = 121
const changeButtonWidth = 120
const changeButtonHeight = 16
const buttons:PromptButton[] = []

function updateDebugButtonUI(testButton: PromptButton) {
    if (changeButtonWidth > 0) testButton.imageElement.uiTransform!.width = changeButtonWidth
    if (changeButtonHeight > 0) testButton.imageElement.uiTransform!.height = changeButtonHeight
    testButton.labelElement.fontSize! = 12
}
function boolShortNameOnOff(val: boolean) {
    if (val) return "On"
    return "Off"
}
let testButton: PromptButton | null = null

let alreadyInit = false
export async function createDebugUIButtons() {
    if (!CONFIG.TEST_CONTROLS_ENABLE) {
        console.log(CLASSNAME,"debug buttons DISABLED")
        return
    }
    let userData = await getAndSetUserDataIfNull();
    let wallet = userData ? userData.publicKey : undefined
    if (wallet) wallet = wallet.toLowerCase();
    let allowed = false;
    for (const p in CONFIG.ADMINS) {
        if (CONFIG.ADMINS[p] == "any") {
            allowed = true;
            break;
        }
        if (wallet == CONFIG.ADMINS[p]?.toLowerCase()) {
            allowed = true;
            break;
        }
    }

    log(CLASSNAME,"debug.allowed ", allowed, wallet);
    if (!allowed) return;
    if(alreadyInit) {
        log("createDebugUIButtons","alreadyInit!!!")
        debugger
        return
    }
    alreadyInit = true
    
    console.log(CLASSNAME,"debug buttons")

    

    const testControlsToggle = ui.createComponent(ui.CustomPrompt, { style: ui.PromptStyles.DARKLARGE, width: 1, height: 1, startHidden: false })
    
    // testControlsToggle.background.positionY = 350

    //testControls.background.visible = false
    testControlsToggle.closeIcon.hide()
    //testControls.addText('Who should get a gift?', 0, 280, Color4.Red(), 30)
    //const pickBoxText:ui.CustomPromptText = testControls.addText("_It's an important decision_", 0, 260)  
    const enableDisableToggle = testButton = testControlsToggle.addButton(
        {
            style: ui.ButtonStyles.RED,
            text: 'show:false',
            xPosition: buttonPosCounter,
            yPosition: buttonPosY,
            onMouseDown: () => {
                console.log(CLASSNAME,"enableDisableToggle " + testControls.isVisible())
                if (testControls.isVisible()) {
                    testControls.hide()
                    //testControls.isVisible() ? testControls.closeIcon.show() : testControls.closeIcon.hide()
                } else {
                    testControls.show()
                    //testControls.isVisible() ? testControls.closeIcon.show() : testControls.closeIcon.hide()
                }
                testControls.closeIcon.hide()
                enableDisableToggle.text = 'show:' + !testControls.isVisible()
            },
        }
    )

    if (changeButtonWidth > 0) testButton.imageElement.uiTransform!.width = changeButtonWidth
    if (changeButtonHeight > 0) testButton.imageElement.uiTransform!.height = changeButtonHeight

    buttonPosCounter += buttonWidth

    const testControls = ui.createComponent(ui.CustomPrompt, { style: ui.PromptStyles.DARKLARGE, width: 1, height: 1, startHidden: false })

    // try to move it relative, did not do anything
    // const promptExtWrap = new PromptWrapper( testControls ) 
    // const promptExt = ((promptExtWrap._prompt as unknown) as PromptExt)
    // promptExt._vAlignment = "top"
    // promptExt._posTop = "99%"


    //testControls.hide()

    // testControls.background.positionY = 350

    //testControls.background.visible = false
    testControls.closeIcon.hide()
    //testControls.addText('Who should get a gift?', 0, 280, Color4.Red(), 30)
    //const pickBoxText:ui.CustomPromptText = testControls.addText("_It's an important decision_", 0, 260)  

    //type TourState = 'not-init'|'tour-not-ready'|'tour-npc-waiting'|'find-to-ask'|'ask-tour'|'touring'|'tour-completed'|'tour-declined'

    const testControlBtns = [
        {
            style: ui.ButtonStyles.RED,
            text: "ReloginFlow",
            onMouseDown: () => {
                resetLoginState();
                GAME_STATE.playerState.requestDoLoginFlow();
            }, 
        },
        {
            style: ui.ButtonStyles.RED,
            text: "Logout",
            onMouseDown: () => {
                logout();
            },
        },
        {
            style: ui.ButtonStyles.RED,
            text: "ReLoginPlafab",
            onMouseDown: () => {
                GAME_STATE.setLoginSuccess(false);
                GAME_STATE.playerState.loginFlowState = "wallet-success";
                doLoginFlow();
            }, 
        },
        {
            style: ui.ButtonStyles.RED,
            text: "RefreshUsrData",
            onMouseDown: () => {
                refreshUserData('ui-hud-debugger.ReLoginPlafab');
            },
        },
        {
            style: ui.ButtonStyles.RED,
            text: "NoConsent",
            onMouseDown: () => { 
                if (GAME_STATE.gameRoom) GAME_STATE.gameRoom.leave(false);
            }, 
        },
        {
            style: ui.ButtonStyles.RED,
            text: "ReConnect",
            onMouseDown: () => {
                colyseusReConnect();
            }, 
        },
        {
            style: ui.ButtonStyles.RED,
            text: "ReShuffle-TODO",
            onMouseDown: () => {
                //reshuffleBlocks();
            },
        },
        {
            style: ui.ButtonStyles.RED,
            text: "RefreshLeaderBrd",
            onMouseDown: () => {
                fetchLeaderboardInfo();
            },
        },
        {
            style: ui.ButtonStyles.RED,
            text: "ShoWaltLoginErr",
            onMouseDown: () => {
                REGISTRY.ui.web3ProviderRequiredPrompt.show(); //FIXME loginErrorPrompt.show() show wallet login error show metamask cancel error
            },
        }
    ]
    
    for (let i = 0; i < testControlBtns.length; i++) {
        if (i % 6 == 0) {
            // new row
            buttonPosY -= changeButtonHeight + 2
            buttonPosCounter = buttonPosSTART
        }
        const btn = testControls.addButton({
            ...testControlBtns[i],
            xPosition: buttonPosCounter,
            yPosition: buttonPosY,
        })
        updateDebugButtonUI( btn )
        buttons.push(btn)
        buttonPosCounter += buttonWidth //next column
    }
    applyUIScaling(SCREEN_STANDARD)
}
let SCREEN_TYPE = DEFAULT_SCREEN_TYPE//DEFAULT_SCREEN_TYPE
export function applyUIScaling(type:number){
    SCREEN_TYPE = type
    buttonPosY = buttonPosYSTART * ( SCREEN_TYPE == SCREEN_STANDARD ? 1 : 1.6)

    if(testButton) testButton.yPosition = buttonPosY

    let i = 0
    for(const p of buttons){
        if (i % 6 == 0) {
            // new row
            buttonPosY -= changeButtonHeight + 2
            buttonPosCounter = buttonPosSTART
        }
        p.yPosition = buttonPosY
        i++
    }
}