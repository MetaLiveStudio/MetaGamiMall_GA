//import { data } from "./data"
import * as UI from "@dcl/ui-scene-utils";

import resourcesDropin from "../resources-dropin";
import { NFTUIData, NFTUIDataCost } from "../types";

const baseDIR = resourcesDropin.baseDir;

class CustomNftCallbackStore {
  customNFTPanelBuy?: () => void;
  customNFTPanelCancel?: () => void;
  name?: string;
}

export const BUTTON_POS_Y = -120; //-180

const buttonCallBackMap = new CustomNftCallbackStore();
buttonCallBackMap.name = "bob";

const image_scale = -16; //16 is a little bigger bit fits tight
const customNFTPanel = new UI.CustomPrompt("dark", 600, 400);

const priceLabel = customNFTPanel.addText(
  "PRICE",
  30 + image_scale,
  130,
  undefined,
  15
);
const price = customNFTPanel.addText(
  "100 MetaCash",
  140 + image_scale,
  130,
  undefined,
  15
);

let nftImage = customNFTPanel.addIcon(
  baseDIR + "images/makersPlaceAliceInWater-256.png",
  -130 + image_scale,
  45,
  256 + image_scale,
  256 + image_scale,
  { sourceHeight: 256, sourceWidth: 256 }
);

const customNFTPanelTitle = customNFTPanel.addText(
  "NFT TITLE",
  140 + image_scale,
  170,
  undefined,
  25
);
const customNFTPanelDescLabel = customNFTPanel.addText(
  `Description`,
  50 + image_scale,
  60,
  undefined,
  15
);
const customNFTPanelDesc = customNFTPanel.addText(
  `Description asdfdsf sdfs sdkfjas kfjasldfj asldf jaslfj asdlfjsdalfkj asdlf jsdfl kjd sfsaf adsfj adslfjdsalf jdsalf jdslf j asfs adf dsf sdasd d`,
  150 + image_scale,
  -180,
  undefined,
  14
);
customNFTPanelDesc.text.width = 300 + image_scale;
customNFTPanelDesc.text.height = 256; //+image_scale - 50
customNFTPanelDesc.text.textWrapping = true;
customNFTPanelDesc.text.vAlign = "top";
customNFTPanelDesc.text.hAlign = "center";
//pushes to top and to left
//gameImageSubTitle.text.hTextAlign = 'left'
//gameImageSubTitle.text.vTextAlign = 'top'
//centers it completely
customNFTPanelDesc.text.hTextAlign = "left";
customNFTPanelDesc.text.vTextAlign = "top";

const customNFTPanelCancel = customNFTPanel.addButton(
  "Cancel",
  -100,
  BUTTON_POS_Y,
  () => {
    customNFTPanel.hide();
    if (buttonCallBackMap.customNFTPanelCancel)
      buttonCallBackMap.customNFTPanelCancel();
  },
  UI.ButtonStyles.E
);
const customNFTPanelBuy = customNFTPanel.addButton(
  "Buy",
  100,
  BUTTON_POS_Y,
  () => {
    if (buttonCallBackMap.customNFTPanelBuy)
      buttonCallBackMap.customNFTPanelBuy();
  },
  UI.ButtonStyles.F
);
customNFTPanel.hide();

export class CustomNFTDialog {
  constructor(canvas: UICanvas) {}
  setBuyCallback(cb: () => void) {
    buttonCallBackMap.customNFTPanelBuy = cb;
  }
  public openInfoPanel(data: NFTUIData): void {
    // for (let i = 0; i < data.length; i++) {
    //   if (id == data[i].id) {
    //     log(data[i].images)
    //     this.nftType.value = data[i].type
    ///     this.nftTitle.value = data[i].title
    //     this.nftImage.source = new Texture(data[i].images)
    //     this.nftDetails.value = data[i].details.info
    //    this.nftDetails.fontSize = data[i].details.fontSize
    //    this.nftDirectLink.value = data[i].directLink.link
    //    this.nftDirectLink.fontSize = data[i].directLink.fontSize
    // }
    //}
    //this.nftType.value = data.type
    let singleCost:NFTUIDataCost|undefined
    
    //FIXME need to account for multi cost 
    if(data.cost !== undefined && data.cost.length > 0){
      singleCost = data.cost[0]
    }

    customNFTPanelTitle.text.value = data.title;
    nftImage.image.source = new Texture(data.image);
    customNFTPanelDesc.text.value = data.detailsInfo;
    if(singleCost !== undefined){
      price.text.value = singleCost.price + " " + singleCost.label;
    }else{
      price.text.value = "????"
    }
    //customNFTPanelDesc.text.fontSize = data.detailsFontSize ? data.detailsFontSize : 8
    //this.nftDirectLink.value = data.directLink
    //this.nftDirectLink.fontSize = data.directLinkFontSize ? data.directLinkFontSize : 8

    customNFTPanel.show();
  }
  hide() {
    customNFTPanel.hide();
  }
}
export class InfoPanel {
  private container: UIContainerRect;
  private dropShadow: UIImage;
  private mainPanel: UIImage;
  private nftImage: UIImage;
  private nftType: UIText;
  private nftTitle: UIText;
  private nftDetails: UIText;
  private nftDirectLink: UIText;
  private sound: Entity = new Entity();

  constructor(canvas: UICanvas) {
    // Container
    this.container = new UIContainerRect(canvas);
    this.container.width = "100%";
    this.container.height = "100%";
    this.container.positionY = 25;
    this.container.visible = false;

    // Drop Shadow
    this.dropShadow = new UIImage(
      this.container,
      new Texture(baseDIR + "images/shadow.png")
    );
    this.dropShadow.sourceWidth = 960;
    this.dropShadow.sourceHeight = 1200;
    this.dropShadow.width = 485;
    this.dropShadow.height = 606;
    this.dropShadow.opacity = 0.2;

    // Main Panel
    this.mainPanel = new UIImage(
      this.container,
      new Texture(baseDIR + "images/mainPanel.png")
    );
    this.mainPanel.sourceWidth = 960;
    this.mainPanel.sourceHeight = 1200;
    this.mainPanel.width = 480;
    this.mainPanel.height = 600;

    // NFT Type
    this.nftType = new UIText(this.container);
    this.nftType.hAlign = "center";
    this.nftType.vAlign = "center";
    this.nftType.positionX = -143;
    this.nftType.positionY = 265;
    this.nftType.fontSize = 16;
    //this.nftType.fontWeight = "normal"
    this.nftType.color = new Color4(1, 0.1, 0.4);
    this.nftType.value = "Not Found";
    this.nftType.visible = false;

    // NFT Title
    this.nftTitle = new UIText(this.container);
    this.nftTitle.hAlign = "center";
    this.nftTitle.vAlign = "center";
    this.nftTitle.positionX = -143;
    this.nftTitle.positionY = 233;
    this.nftTitle.fontSize = 25;
    //this.nftTitle.fontWeight = "bold"
    this.nftTitle.color = Color4.Black();
    this.nftTitle.value = "Not Found";
    this.nftTitle.visible = false;

    // Image
    this.nftImage = new UIImage(
      this.container,
      new Texture(baseDIR + "images/mainPanel.png") // Default image if nothing is found ...
    );
    this.nftImage.sourceWidth = 1024;
    this.nftImage.sourceHeight = 1024;
    this.nftImage.width = 384;
    this.nftImage.height = 384;
    this.nftImage.visible = false;

    // Close button to the top right
    const closeButton = new UIImage(
      this.container,
      new Texture(baseDIR + "images/closeButton.png")
    );
    closeButton.sourceWidth = 50;
    closeButton.sourceHeight = 50;
    closeButton.width = 37.5;
    closeButton.height = 37.5;
    closeButton.positionX = 206;
    closeButton.positionY = 265;
    closeButton.isPointerBlocker = true;
    closeButton.onClick = new OnClick((): void => {
      this.closeInfoPanel();
    });

    // NFT Details
    this.nftDetails = new UIText(this.container);
    this.nftDetails.adaptWidth = true;
    this.nftDetails.hAlign = "center";
    this.nftDetails.vAlign = "center";
    this.nftDetails.positionY = -208;
    this.nftDetails.fontSize = 18;
    //this.nftDetails.fontWeight = "bold"
    this.nftDetails.color = Color4.Black();
    this.nftDetails.value = "Not Found";
    this.nftDetails.visible = false;

    // NFT Direct Link
    this.nftDirectLink = new UIText(this.container);
    this.nftDirectLink.adaptWidth = true;
    this.nftDirectLink.hAlign = "center";
    this.nftDirectLink.vAlign = "center";
    this.nftDirectLink.positionY = -233;
    this.nftDirectLink.fontSize = 10;
    //this.nftDirectLink.fontWeight = "normal"
    this.nftDirectLink.color = Color4.Black();
    this.nftDirectLink.value = "Not Found";
    this.nftDirectLink.visible = false;

    // Sound
    this.sound.addComponent(
      new Transform({
        position: new Vector3(8, 0, 8),
      })
    );
    this.sound.addComponent(
      new AudioSource(
        new AudioClip(
          baseDIR + "sounds/navigation_backward-selection-minimal.mp3"
        )
      )
    );
    engine.addEntity(this.sound);
  }

  public openInfoPanel(data: NFTUIData): void {
    // for (let i = 0; i < data.length; i++) {
    //   if (id == data[i].id) {
    //     log(data[i].images)
    //     this.nftType.value = data[i].type
    ///     this.nftTitle.value = data[i].title
    //     this.nftImage.source = new Texture(data[i].images)
    //     this.nftDetails.value = data[i].details.info
    //    this.nftDetails.fontSize = data[i].details.fontSize
    //    this.nftDirectLink.value = data[i].directLink.link
    //    this.nftDirectLink.fontSize = data[i].directLink.fontSize
    // }
    //}
    this.nftType.value = data.type;
    this.nftTitle.value = data.title;
    this.nftImage.source = new Texture(data.image);
    this.nftDetails.value = data.detailsInfo;
    this.nftDetails.fontSize = data.detailsFontSize ? data.detailsFontSize : 8;
    this.nftDirectLink.value = data.directLink;
    this.nftDirectLink.fontSize = data.directLinkFontSize
      ? data.directLinkFontSize
      : 8;

    this.container.visible = true;
    this.nftType.visible = true;
    this.nftTitle.visible = true;
    this.nftImage.visible = true;
    this.nftDetails.visible = true;
    this.nftDirectLink.visible = true;
  }

  private closeInfoPanel(): void {
    this.container.visible = false;
    this.nftType.visible = false;
    this.nftTitle.visible = false;
    this.nftImage.visible = false;
    this.nftDetails.visible = false;
    this.nftDirectLink.visible = false;
    this.sound.getComponent(AudioSource).playOnce();
  }
}
