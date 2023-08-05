import { GlobalCanvas } from "../dclconnect/gui/canvas";

export const MATERIAL_CACHE: Record<string, ObservableComponent> = {};
export const FONT_CACHE: Record<string, Font> = {};

const serviceBaseDomain = "todo";

const SDK_664_OR_HIGHER = typeof onSceneReadyObservable !== "undefined";
const IN_BUILDER = SDK_664_OR_HIGHER == false;

export const GLOBAL_CANVAS = GlobalCanvas; //from DCL connect

export const setInBuilderSetting = (val: boolean) => {
  RESOURCES.IN_BUILDER = val;
  RESOURCES.ENABLE_REMOVE_ENTITY = !RESOURCES.IN_BUILDER;
};

type ItemServiceConfig = {
  customBaseUrl: string;
  fetchLimit: number;
  netType: string; //when blank service should fallback to PROD
  contractAddress: string; //testnet monstercat final 150 tokens
  contractId: string;
  version: string;
  profile: string;
};
type ItemModelConfig = {};

type ItemResourceUris = {
  sprite_sheet: string;
  use_external_sprite_sheet: boolean;
};

type ItemStringConfig = {};
type ItemBootupConfig = {
  check_intervals_ms: number;
  max_wait_time_ms: number; //5 seconds
};
export type ItemConfig = {
  service: ItemServiceConfig;
  strings: ItemStringConfig;
  bootup: ItemBootupConfig;
  model: ItemModelConfig;
  resourceUris: ItemResourceUris;
};

export type ItemConfigResponse = {
  errorMsg?: string;
  config?: ItemConfig;
};

export type GameLevelData = {
  id: string;
  loadingHint: string;
};
/*
let spriteSheetTexture = new Texture("images/sprites.png") 
let spriteSheetMaterial = new BasicMaterial()//new Material()//new BasicMaterial();//

//resolveSpriteSheetMaterial().albedoTexture = resolveSpriteSheetTexture()
//    resolveSpriteSheetMaterial().metallic = .5
//resolveSpriteSheetMaterial().transparencyMode = 1
//resolveSpriteSheetMaterial().alphaTest=1
spriteSheetMaterial.texture = spriteSheetTexture*/

const TutorialBackgroundTexture = new Texture(
  "images/game/TutorialBackground.png"
);

const darkThemeSemiTransparent = "images/ui/dialog-dark-atlas-v3-semi-tran.png";

//TODO REFACTOR SO can call it type ItemConfig to help enforce var name formatting correctly
export const RESOURCES = {
  SDK_664_OR_HIGHER: SDK_664_OR_HIGHER, // TODO add move detective ways.?  Avatar.alive?
  IN_BUILDER: IN_BUILDER,
  ENABLE_REMOVE_ENTITY: !IN_BUILDER, //builder does not handle remove entity well
  TEST_MODE_ENABLED: true, //long term must publish with this false
  ENABLE_EXTERNAL_CONFIG: true,
  TEST_MODE_ENABLED_MANUAL_DATA: true,
  testOverrides: {
    //local developer test values goes here
    ownerAddress: "0xECbb8C195Cc4AFD2966cB86C191F050d28AEdcdD",
    service: {
      fetchLimit: 999, //999
      //customBaseUrl: null, //test domain?
      netType: "test", //when blank service should fallback to PROD
      contractAddress: "", //testnet monstercat final 150 tokens
      //contractId: "",
      //version: "1",
      //profile: ""
      //maxRows: 1 //999
    },
    resourceUris: {
      //use_external_sprite_sheet: true,
      sprite_sheet:
        "https://images.unsplash.com/photo-1604537466608-109fa2f16c3b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2338&q=80",
    },
  },
  service: {
    fetchLimit: 999, //999
    customBaseUrl: serviceBaseDomain,
    netType: "", //when blank service should fallback to PROD
    contractAddress: "", //
    contractId: "todo",
    version: "1",
    profile: "dcl-gamimall",

    //maxRows: 1 //999
  },
  model: {},
  resourceUris: {
    use_external_sprite_sheet: false
    //,sprite_sheet: null,
  },
  textures: {
    //sprite_sheet: spriteSheetTexture,
    transparent: new Texture("images/transparent-texture.png"),
    gameTutorialBg: TutorialBackgroundTexture,
    loadingBg: TutorialBackgroundTexture,
    gameEndBg: TutorialBackgroundTexture,
    superDogerioBanner: new Texture("images/game/SuperDogerioBanner.png"),
    //voxBanner: new Texture("images/game/Vox_skate-craftBanner.png"),
    darkThemeSemiTransparent: new Texture(darkThemeSemiTransparent),
  },
  materials: {
    //sprite_sheet: spriteSheetMaterial
  },
  strings: {},
};

export function createFont(textFont: string): Font {
  let font = FONT_CACHE[textFont];
  if (!font) {
    switch (textFont) {
      case "SF":
      case "SanFrancisco":
        font = new Font(Fonts.SanFrancisco);
        break;
      case "SF_Heavy":
      case "SanFrancisco_Heavy":
        font = new Font(Fonts.SanFrancisco_Heavy);
        break;
      case "LibSans":
      case "LiberationSans":
        font = new Font(Fonts.LiberationSans);
        break;
    }
    FONT_CACHE[textFont] = font;
  }
  return font;
}

export function createMaterial(
  type: Color3 | string,
  transparent: boolean
): ObservableComponent {
  const isColor = type instanceof Color3;
  const isURL = !isColor;

  const color: Color3 | undefined = isColor ? (type as Color3) : undefined;
  const url: string | undefined = isURL ? (type as string) : undefined;

  let cacheName = "";
  if (isColor) {
    cacheName = color!.toHexString(); // + "-" + colorOn.toHexString() + "-" + emissiveIntensity
    if (transparent) {
      cacheName = "transparent";
    }
  } else {
    cacheName = url!;
  }

  let materialComp: ObservableComponent = MATERIAL_CACHE[cacheName];
  if (!materialComp) {
    log("cache miss", cacheName);
    if (isURL) {
      let QRTexture = new Texture(url!);
      const QRMaterial = new Material();
      QRMaterial.metallic = 0;
      QRMaterial.roughness = 1;
      QRMaterial.specularIntensity = 0;
      QRMaterial.albedoTexture = QRTexture;

      MATERIAL_CACHE[cacheName] = QRMaterial;

      materialComp = QRMaterial;
    } else if (!transparent) {
      const material = new Material();
      material.albedoColor = color;
      //barItemMaterial.specularIntensity = 1
      material.roughness = 1;
      material.metallic = 0.0;
      MATERIAL_CACHE[cacheName] = material;

      materialComp = material;
    } else {
      //do stuff to make transparent
      let material = new BasicMaterial();
      material.texture = RESOURCES.textures.transparent;
      material.alphaTest = 1;
      MATERIAL_CACHE[cacheName] = material;

      materialComp = material;
    }
  } else {
    log("cache hit", cacheName);
    if (transparent) {
      log("hit transparent cache");
    }
  }
  return materialComp;
}

export function getColorFromString(strColor: string, theDefault: Color3) {
  let color: Color3 = theDefault;
  if (strColor !== null && strColor !== undefined) {
    if (strColor?.indexOf("#") == 0) {
      color = Color3.FromHexString(strColor);
    } else {
      switch (strColor?.toLowerCase()) {
        case "white":
          color = Color3.White();
          break;
        case "black":
          color = Color3.Black();
          break;
        case "blue":
          color = Color3.Blue();
          break;
        case "green":
          color = Color3.Green();
          break;
        case "red":
          color = Color3.Red();
          break;
        case "yellow":
          color = Color3.Yellow();
          break;
        case "purple":
          color = Color3.Purple();
          break;
        case "magenta":
          color = Color3.Magenta();
          break;
        case "gray":
          color = Color3.Gray();
          break;
        case "teal":
          color = Color3.Teal();
          break;
      }
    }
  }
  //log("getColorFromString " + strColor + ";->" + color)
  return color;
}
