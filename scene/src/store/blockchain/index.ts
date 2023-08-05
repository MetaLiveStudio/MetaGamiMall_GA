//import * as dclTx from "decentraland-transactions";
import * as utils from "@dcl/ecs-scene-utils";
import * as eth from "eth-connect";
//import { getProvider, Provider } from "@decentraland/web3-provider";
//import { getUserAccount } from "@decentraland/EthereumController";
//import { createMANAComponent } from "./components/mana";
//import { createStoreComponent } from "./components/store";
import * as UI from "@dcl/ui-scene-utils";
import * as ECS from "@dcl/ecs-scene-utils";
import { WearableMenuItem } from "../ui/menuItemWearable";
import { GAME_STATE } from "src/state";
import { CONFIG, initConfig } from "src/config";
import { CustomOkPrompt, CustomOptionsPrompt } from "src/ui/modals";
import { REGISTRY } from "src/registry";
import { NFTUIData } from "../types";
import { convertDateToYMDHMS } from "src/utils";

initConfig()

export async function createComponents() {}

const somethingWentWrongWithBuyPrompt = new CustomOkPrompt(
  "Purchased failed",
  "Purchased failed.\nPlease try again.",
  "OK",
  () => {}
); //new UI.OkPrompt("Sorry, you do not have enough MetaCash", undefined, undefined, true);//new UI.OkPrompt("Purchased failed.\nPlease try again.", undefined, undefined, true);
somethingWentWrongWithBuyPrompt.hide();

const CLAIM_CURRENCY = CONFIG.GAME_COIN_TYPE_GC//GAME_STATE.playerState.playFabUserInfo?.UserVirtualCurrency?.GC
let CLAIM_CURRENCY_LABEL = ""
switch(CLAIM_CURRENCY){
  case CONFIG.GAME_COIN_TYPE_GC:
  case CONFIG.GAME_COIN_TYPE_BZ:
    CLAIM_CURRENCY_LABEL = "Coins"
  default: 
  ""
}

const notInClaimableWindowPrompt = new CustomOkPrompt(
  "Claim Not Active",
  "Sorry, this cannot be claimed at this time",
  "OK",
  () => {}
); //new UI.OkPrompt("Sorry, you do not have enough MetaCash", undefined, undefined, true);
notInClaimableWindowPrompt.hide();


const notEnoughVcPrompt = new CustomOkPrompt(
  "Lack of Funds",
  "Sorry, you do not have enough " + CLAIM_CURRENCY_LABEL,
  "OK",
  () => {}
); //new UI.OkPrompt("Sorry, you do not have enough MetaCash", undefined, undefined, true);
notEnoughVcPrompt.hide();

export const BUTTON_POS_Y = -120; //-180

class BuyCallbackStore {
  confirmPurchaseOKBTN?: () => void;
  purchaseSuccessSeeItBTN?: () => void;
  name?: string;
}

const buttonCallBackMap = new BuyCallbackStore();
buttonCallBackMap.name = "bob";

const startOptions = {
  width: 440,
  modalWidth: -200,
};
const purchaseSuccess = new CustomOptionsPrompt(
  "Purchased Succeeded!",
  `You will need to refresh the page \nto see the wearable in your backpack.`,
  "OK",
  "",
  "PolygonScan",
  "",
  () => {
    log("purchaseSuccess ok");
  },
  () => {
    log("purchaseSuccess open polyscan");
    if (buttonCallBackMap.purchaseSuccessSeeItBTN)
      buttonCallBackMap.purchaseSuccessSeeItBTN();
  },
  startOptions
); //UI.CustomPrompt(UI.PromptStyles.DARKLARGE, 450, undefined);

//purchaseSuccess.show()

const confirmPurchase = new CustomOptionsPrompt(
  "Confirm Purchase",
  `Please claim at the announced time with\n 00 MetaCash`,
  "OK",
  "",
  "Cancel",
  "",
  () => {
    log(
      "click dconfirmPurchaseOKBTNCallBack",
      buttonCallBackMap,
      buttonCallBackMap.confirmPurchaseOKBTN,
      buttonCallBackMap.confirmPurchaseOKBTN
    );
    if (buttonCallBackMap.confirmPurchaseOKBTN)
      buttonCallBackMap.confirmPurchaseOKBTN();
  },
  undefined,
  startOptions
); 

const customWaitPrompt = new CustomOkPrompt(
  "Please Wait",
  "The transaction is being processed",
  "OK",
  () => {},
  {
    textPositionY: -30
  }
);
customWaitPrompt.onShowcallback = () => {
  customWaitPrompt.button.image.visible = false;
  customWaitPrompt.button.label.visible = false;
  customWaitPrompt.prompt.closeIcon.visible = false;
};

//for testing just make them visible on scene load
//customWaitPrompt.show()
//confirmPurchase.show()
//purchaseSuccess.show()

//UI.CustomPrompt(UI.PromptStyles.DARKLARGE, 450, undefined);

/*  const confirmPurchaseAmountText = confirmPurchase.addText(`You are about to buy an item for\n 00 MetaCash`, 0, 50, undefined, 24);
const confirmPurchaseOKBTN = confirmPurchase.addButton(
  'OK',
  -100,
  BUTTON_POS_Y,
  () => { 
    log("click dconfirmPurchaseOKBTNCallBack",buttonCallBackMap,buttonCallBackMap.confirmPurchaseOKBTN,buttonCallBackMap.confirmPurchaseOKBTN)
    if(buttonCallBackMap.confirmPurchaseOKBTN) buttonCallBackMap.confirmPurchaseOKBTN()
  },
  UI.ButtonStyles.E
)
const confirmPurchaseCancelBTN = confirmPurchase.addButton(
  'Cancel',
  100,
  BUTTON_POS_Y,
  () => { 
    confirmPurchase.hide()
  },
  UI.ButtonStyles.F
)
confirmPurchase.hide()*/

export async function buyVC(
  collectionId: string,
  blockchainId: string,
  price: string,
  currency?: string,
  item?: WearableMenuItem,
  nftUIData?: NFTUIData
) {
  if (!GAME_STATE.playerState.dclUserData?.hasConnectedWeb3) {
    REGISTRY.ui.web3ProviderRequiredPrompt.show()
    return
  }

  if(nftUIData.claimWindowEnabled !== undefined && nftUIData.claimWindowEnabled === true){
    const args = nftUIData
    const now = Date.now()
    const expired = args.claimEndMS >= 0 && args.claimEndMS < now
    if( args.claimStartMS >= 0 && args.claimStartMS > now && !expired){
      //this.claimWindow.text.value = claimWindowDateToYMDHMS( new Date(nftUIData.claimStartMS) )
      //notInClaimableWindowPrompt.title.text.value = "Claim Not Active"
      notInClaimableWindowPrompt.text.text.value = "Sorry, this cannot be claimed until after " + convertDateToYMDHMS( new Date(nftUIData.claimStartMS) )
      notInClaimableWindowPrompt.show()
      return;
    }else if( expired ){
      notInClaimableWindowPrompt.text.text.value = "Sorry, this claim has expired \n" + convertDateToYMDHMS( new Date(nftUIData.claimStartMS) )
      notInClaimableWindowPrompt.show()
      return;
    }
  }

  //  if (!+price) return;
  log(collectionId, blockchainId, price);
  //const { mana, store } = await createComponents();
  //const storeContract = dclTx.getContract(dclTx.ContractName.CollectionStore, 137);
  log("balance",CLAIM_CURRENCY,GAME_STATE.playerState.playFabUserInfo?.UserVirtualCurrency[CLAIM_CURRENCY],GAME_STATE.playerState.playFabUserInfo?.UserVirtualCurrency);
  const balance = eth
    .toWei(
      GAME_STATE.playerState.playFabUserInfo?.UserVirtualCurrency[CLAIM_CURRENCY] + "",
      "ether"
    )
    .valueOf(); //await mana.balance();
  log("allowance");
  const allowance = 9; //await mana.isApproved(storeContract.address);
  log("buyVC", balance, allowance, price);
  //disable this check for now
  if (CONFIG.CLAIM_VERIFY_PRICES_CLIENT_SIDE_ENABLED && +price > +balance) {
    notEnoughVcPrompt.show();
    return;
  }
  if(!CONFIG.CLAIM_VERIFY_PRICES_CLIENT_SIDE_ENABLED ){
    log("buyVC", "not checking client side per STORE_VERIFY_PRICES_CLIENT_SIDE_ENABLED",collectionId, blockchainId, price);
  }

  buttonCallBackMap.confirmPurchaseOKBTN = async () => {
    somethingWentWrongWithBuyPrompt.hide();
    confirmPurchase.hide();

    log("confirmPurchaseOKBTN called!!");
    
    //show immediatly
    customWaitPrompt.show(0);

    //const loading = new UI.LoadingIcon(undefined, 0, -120);

    //MAKE CALL TO SERVER THAT WILL
    let claimRespObj;

    //const res = true//"tx-id"//await store.buy(collectionId, blockchainId, price);
    let success = false;

    try {
      const dclClaimUrl = CONFIG.AUTOCLAIM_ENDPOINT;
      const claimReq = await fetch(`${dclClaimUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: GAME_STATE.playerState.dclUserData?.publicKey,
          playFabId: GAME_STATE.playerState.playFabLoginResult?.PlayFabId,
          contractAddress: collectionId,
          //,itemId: item
        }),
      });
      claimRespObj = await claimReq.json();
      log("claimResp", claimRespObj);
      //claimRespObj = JSON.parse(claimResp)

      if (claimRespObj && !claimRespObj.error) {
        success = true;
      } else {
        log("failed claim error message", claimRespObj.error);
      }
    } catch (e) {
      log("failed claim error", e);
    }
    //add seperate call asking does user have any coupons to redeem (yes no only)

    //await BUY THEM A NFT ITEM (subtracting amount)
    //make call to get a coupon from server OR asking it to write it itself (store in player title private data linked to item they bought)
    //return to user success of coupon, time to redeem
    //TODO open up wallet with coupon to use

    customWaitPrompt.hide();
    //loading.hide();

    if (success == true) {
      const txId = claimRespObj.hash;
      buttonCallBackMap.purchaseSuccessSeeItBTN = () => {
        purchaseSuccess.hide();

        log(`https://polygonscan.com/tx/${txId}`);
        openExternalURL(`https://polygonscan.com/tx/${txId}`);

        item?.boughtOne();
      };
      purchaseSuccess.show();
    } else {
      log("calling show somethingWentWrongWithBuyPrompt", claimRespObj);
      somethingWentWrongWithBuyPrompt.title.text.value = "Purchased Failed";
      somethingWentWrongWithBuyPrompt.text.text.value =
        claimRespObj.error + "\n\nPlease try again.";
      somethingWentWrongWithBuyPrompt.show();
      //log("somethingWentWrongWithBuyPrompt.background",somethingWentWrongWithBuyPrompt.text.visible)
      //somethingWentWrongWithBuyPrompt.background.visible = true
      //somethingWentWrongWithBuyPrompt.text.visible = true
    }
  };
  const currencies = currency;
  confirmPurchase.text.text.value = "Do you want to claim this item?"
  if(CONFIG.STORE_WEARABLES_CONFIRM_CLAIM_PURCHASE_DELAY_OK_BTN > 0){
    //disable the button for a second
    confirmPurchase.buttonConfirmBtn.label.value = "."
    confirmPurchase.buttonConfirmBtn.image.opacity = .5
    confirmPurchase.buttonConfirmBtn.image.isPointerBlocker = false
    let counter = 0
    const INTERVAL = 300
    const fnConcnat = ()=>{ 
      if(counter < (CONFIG.STORE_WEARABLES_CONFIRM_CLAIM_PURCHASE_DELAY_OK_BTN/INTERVAL)){ //500*6 = 3 seconds
        utils.setTimeout(INTERVAL,()=>{
          confirmPurchase.buttonConfirmBtn.label.value += "."
          fnConcnat()
        })
      }else{
        confirmPurchase.buttonConfirmBtn.label.value = "OK"
        confirmPurchase.buttonConfirmBtn.image.opacity = 1
        confirmPurchase.buttonConfirmBtn.image.isPointerBlocker = true
      }
      counter++
    }
    fnConcnat()
  }else{
    confirmPurchase.buttonConfirmBtn.label.value = "OK"
    confirmPurchase.buttonConfirmBtn.image.opacity = 1
    confirmPurchase.buttonConfirmBtn.image.isPointerBlocker = true
  }
  /*`You are about to buy an item for \n ${eth.fromWei(
      price,
      "ether"
    )} ${currencies}`;*/

  //TODO add check scene side of values would help learn if needed
  //TODO add callback promise so that can know if save completed before executing
  //TODO make a custom save so that it knows the callback, maybe an arg to the save that is the callback?
  //execute a save,hope its done by time they confirm
  //this is to ensure they have enough VC on backend
  if(CONFIG.STORE_WEARABLES_ON_CONFIRM_CLAIM_PURCHASE_PROMPT_DO_SAVE){
    GAME_STATE.gameRoom.send("save-game",{})
  }
    
  confirmPurchase.show();

  log("assigned!!!", buttonCallBackMap);

  return {
    balance: eth.fromWei(balance, "ether"),
    allowance: eth.fromWei(allowance, "ether"),
  };
}

export async function buy(
  collectionId: string,
  blockchainId: string,
  price: string,
  item?: WearableMenuItem
) {}

export type Providers = {
  /*provider: Provider;
  requestManager: eth.RequestManager;
  metaProvider: Provider;
  metaRequestManager: eth.RequestManager;*/
  fromAddress: string;
};

export function delay(ms: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const ent = new Entity();
    engine.addEntity(ent);
    ent.addComponent(
      new ECS.Delay(ms, () => {
        resolve();
        if (ent.isAddedToEngine()) engine.removeEntity(ent);
      })
    );
  });
}
