export default {
  sounds: {
    robots: {
      alice: new AudioClip("sounds/npc/alice.mp3"),
      //bob: new AudioClip('sounds/npc/bob.mp3'),
      //charlie: new AudioClip('sounds/npc/charlie.mp3'),
    },
  },
  models: {
    robots: {
      alice: "models/robots/alice.glb",
      metaDogePet: "models/robots/MetaDoge-Robot.glb",
      //bob: 'models/robots/bob.glb',
      //charlie: 'models/robots/charlie.glb',
      //rings: new GLTFShape('models/robots/rings.glb'),
    },
  },
  textures: {
    blank: new Texture("images/ui/blank.png"),
    buttonE: new Texture("images/ui/buttonE.png"),
    buttonF: new Texture("images/ui/buttonF.png"),
    leftClickIcon: new Texture("images/ui/leftClickIcon.png"),
    textPanel: new Texture("images/ui/textPanel.png"),
  },
};
