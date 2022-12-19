export const INVISIBLE_MATERIAL = new BasicMaterial();
const INVISIBLE_MATERIAL_texture = new Texture(
  "7669807e-1ae3-4d31-a2fa-dbd7a1d66fcc/models/transparent-texture.png"
);
INVISIBLE_MATERIAL.texture = INVISIBLE_MATERIAL_texture;
INVISIBLE_MATERIAL.alphaTest = 1;

export class CommonResources {
  static RESOURCES = {
    models: {
      names: {},
    },
    textures: {
      //sprite_sheet: spriteSheetTexture,
      transparent: INVISIBLE_MATERIAL_texture,
      transparent4card: new Texture("store-assets/images/transparent.png"), //why must it be different?
    },
    materials: {
      //sprite_sheet: spriteSheetMaterial
      transparent: INVISIBLE_MATERIAL,
    },
    strings: {},
    images: {
      portrait: {},
    },
  };
}
