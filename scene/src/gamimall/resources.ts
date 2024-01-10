
//export const MATERIAL_CACHE: Record<string, ObservableComponent> = {};
//export const FONT_CACHE: Record<string, Font> = {};

//TODO move to a "types" file
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
/*
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
*/