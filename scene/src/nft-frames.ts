import { createChannel } from "../node_modules/decentraland-builder-scripts/channel";
import { createInventory } from "../node_modules/decentraland-builder-scripts/inventory";

import { Logger } from "./logging";
import { getEntityByName, isNull, notNull } from "./utils";
//import Script11 from "../80d9cb1c-2fcf-4585-8e19-e2d5621fd54d/src/item"

import * as utils from "@dcl/ecs-scene-utils";

//import OOTBNTFScript from "/80d9cb1c-2fcf-4585-8e19-e2d5621fd54d/src/item"; //no longer used , was out of the box NFTShape smart item
import CustomNFTScript from "src/custom-nft-frame/src/item";
import { CONFIG } from "./config";
import { handleDelayLoad } from "./delay-loader";

export const _scene2 = new Entity("_scene2");

export const loadNftFrames = () => {
  if (CONFIG.ENABLE_NFT_FRAMES) {
    engine.addEntity(_scene2);
    const transform = new Transform({
      position: new Vector3(5 * 16, 0, 0), //-6*16
      //rotation: new Quaternion(0, 0, 0, 1),
      rotation: Quaternion.Euler(0, -90, 0),
      scale: new Vector3(1, 1, 1),
    });
    _scene2.addComponentOrReplace(transform);

    /*
const nftPictureFrame3 = new Entity('nftPictureFrame3')
engine.addEntity(nftPictureFrame3)
nftPictureFrame3.setParent(_scene2)
const transform32 = new Transform({
  position: new Vector3(24, 5.051368713378906, 25.5599308013916),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1,1,1)
})
nftPictureFrame3.addComponentOrReplace(transform32)

const nftPictureFrame7 = new Entity('nftPictureFrame7')
engine.addEntity(nftPictureFrame7)
nftPictureFrame7.setParent(_scene2)
const transform33 = new Transform({
  position: new Vector3(24, 5.051368713378906, 22.1019287109375),
  rotation: new Quaternion(2.686802696492507e-15, -1, 1.1920926823449918e-7, -2.086162567138672e-7),
  scale: new Vector3(1,1,1)
})
nftPictureFrame7.addComponentOrReplace(transform33)

const nftPictureFrame16 = new Entity('nftPictureFrame16')
engine.addEntity(nftPictureFrame16)
nftPictureFrame16.setParent(_scene2)
const transform34 = new Transform({
  position: new Vector3(48.960052490234375, 5.718936920166016, 24.76793670654297),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1,1,1)
})
nftPictureFrame16.addComponentOrReplace(transform34)

const nftPictureFrame17 = new Entity('nftPictureFrame17')
engine.addEntity(nftPictureFrame17)
nftPictureFrame17.setParent(_scene2)
const transform35 = new Transform({
  position: new Vector3(48.960052490234375, 5.718936920166016, 22.72610092163086),
  rotation: new Quaternion(2.686802696492507e-15, -1, 1.1920926823449918e-7, -2.086162567138672e-7),
  scale: new Vector3(1,1,1)
})
nftPictureFrame17.addComponentOrReplace(transform35)

const nftPictureFrame18 = new Entity('nftPictureFrame18')
engine.addEntity(nftPictureFrame18)
nftPictureFrame18.setParent(_scene2)
const transform36 = new Transform({
  position: new Vector3(44.960052490234375, 5.718936920166016, 24.76793670654297),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1,1,1)
})
nftPictureFrame18.addComponentOrReplace(transform36)

const nftPictureFrame19 = new Entity('nftPictureFrame19')
engine.addEntity(nftPictureFrame19)
nftPictureFrame19.setParent(_scene2)
const transform37 = new Transform({
  position: new Vector3(44.960052490234375, 5.718936920166016, 22.72610092163086),
  rotation: new Quaternion(2.686802696492507e-15, -1, 1.1920926823449918e-7, -2.086162567138672e-7),
  scale: new Vector3(1,1,1)
})
nftPictureFrame19.addComponentOrReplace(transform37)

const nftPictureFrame20 = new Entity('nftPictureFrame20')
engine.addEntity(nftPictureFrame20)
nftPictureFrame20.setParent(_scene2)
const transform38 = new Transform({
  position: new Vector3(40.960052490234375, 5.718936920166016, 24.76793670654297),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1,1,1)
})
nftPictureFrame20.addComponentOrReplace(transform38)

const nftPictureFrame21 = new Entity('nftPictureFrame21')
engine.addEntity(nftPictureFrame21)
nftPictureFrame21.setParent(_scene2)
const transform39 = new Transform({
  position: new Vector3(40.960052490234375, 5.718936920166016, 22.72610092163086),
  rotation: new Quaternion(2.686802696492507e-15, -1, 1.1920926823449918e-7, -2.086162567138672e-7),
  scale: new Vector3(1,1,1)
})
nftPictureFrame21.addComponentOrReplace(transform39)

const nftPictureFrame22 = new Entity('nftPictureFrame22')
engine.addEntity(nftPictureFrame22)
nftPictureFrame22.setParent(_scene2)
const transform40 = new Transform({
  position: new Vector3(66.90193176269531, 5.718936920166016, 22.72610092163086),
  rotation: new Quaternion(2.686802696492507e-15, -1, 1.1920926823449918e-7, -2.086162567138672e-7),
  scale: new Vector3(1,1,1)
})
nftPictureFrame22.addComponentOrReplace(transform40)

const nftPictureFrame23 = new Entity('nftPictureFrame23')
engine.addEntity(nftPictureFrame23)
nftPictureFrame23.setParent(_scene2)
const transform41 = new Transform({
  position: new Vector3(66.90193176269531, 5.718936920166016, 24.76793670654297),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1,1,1)
})
nftPictureFrame23.addComponentOrReplace(transform41)

const nftPictureFrame25 = new Entity('nftPictureFrame25')
engine.addEntity(nftPictureFrame25)
nftPictureFrame25.setParent(_scene2)
const transform42 = new Transform({
  position: new Vector3(62.90193176269531, 5.718936920166016, 22.72610092163086),
  rotation: new Quaternion(2.686802696492507e-15, -1, 1.1920926823449918e-7, -2.086162567138672e-7),
  scale: new Vector3(1,1,1)
})
nftPictureFrame25.addComponentOrReplace(transform42)

const nftPictureFrame32 = new Entity('nftPictureFrame32')
engine.addEntity(nftPictureFrame32)
nftPictureFrame32.setParent(_scene2)
const transform43 = new Transform({
  position: new Vector3(62.90193176269531, 5.718936920166016, 24.76793670654297),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1,1,1)
})
nftPictureFrame32.addComponentOrReplace(transform43)

const nftPictureFrame40 = new Entity('nftPictureFrame40')
engine.addEntity(nftPictureFrame40)
nftPictureFrame40.setParent(_scene2)
const transform44 = new Transform({
  position: new Vector3(78.90193176269531, 5.718936920166016, 24.76793670654297),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1,1,1)
})
nftPictureFrame40.addComponentOrReplace(transform44)

const nftPictureFrame41 = new Entity('nftPictureFrame41')
engine.addEntity(nftPictureFrame41)
nftPictureFrame41.setParent(_scene2)
const transform45 = new Transform({
  position: new Vector3(78.90193176269531, 5.718936920166016, 22.72610092163086),
  rotation: new Quaternion(2.686802696492507e-15, -1, 1.1920926823449918e-7, -2.086162567138672e-7),
  scale: new Vector3(1,1,1)
})
nftPictureFrame41.addComponentOrReplace(transform45)

const nftPictureFrame42 = new Entity('nftPictureFrame42')
engine.addEntity(nftPictureFrame42)
nftPictureFrame42.setParent(_scene2)
const transform46 = new Transform({
  position: new Vector3(74.90193176269531, 5.718936920166016, 24.76793670654297),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1,1,1)
})
nftPictureFrame42.addComponentOrReplace(transform46)

const nftPictureFrame44 = new Entity('nftPictureFrame44')
engine.addEntity(nftPictureFrame44)
nftPictureFrame44.setParent(_scene2)
const transform47 = new Transform({
  position: new Vector3(70.90193176269531, 5.718936920166016, 24.76793670654297),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1,1,1)
})
nftPictureFrame44.addComponentOrReplace(transform47)

const nftPictureFrame45 = new Entity('nftPictureFrame45')
engine.addEntity(nftPictureFrame45)
nftPictureFrame45.setParent(_scene2)
const transform48 = new Transform({
  position: new Vector3(74.90193176269531, 5.718936920166016, 22.72610092163086),
  rotation: new Quaternion(2.686802696492507e-15, -1, 1.1920926823449918e-7, -2.086162567138672e-7),
  scale: new Vector3(1,1,1)
})
nftPictureFrame45.addComponentOrReplace(transform48)

const nftPictureFrame46 = new Entity('nftPictureFrame46')
engine.addEntity(nftPictureFrame46)
nftPictureFrame46.setParent(_scene2)
const transform49 = new Transform({
  position: new Vector3(70.90193176269531, 5.718936920166016, 22.72610092163086),
  rotation: new Quaternion(2.686802696492507e-15, -1, 1.1920926823449918e-7, -2.086162567138672e-7),
  scale: new Vector3(1,1,1)
})
nftPictureFrame46.addComponentOrReplace(transform49)

*/

    const nftPictureFrame47 = new Entity("nftPictureFrame47");
    engine.addEntity(nftPictureFrame47);
    nftPictureFrame47.setParent(_scene2);
    const transform50 = new Transform({
      position: new Vector3(
        88.07001495361328,
        5.68280029296875,
        22.1019287109375
      ),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame47.addComponentOrReplace(transform50);

    const nftPictureFrame48 = new Entity("nftPictureFrame48");
    engine.addEntity(nftPictureFrame48);
    nftPictureFrame48.setParent(_scene2);
    const transform51 = new Transform({
      position: new Vector3(
        88.07001495361328,
        5.68280029296875,
        25.5599308013916
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame48.addComponentOrReplace(transform51);

    const nftPictureFrame24 = new Entity("nftPictureFrame24");
    engine.addEntity(nftPictureFrame24);
    nftPictureFrame24.setParent(_scene2);
    const transform52 = new Transform({
      position: new Vector3(
        21.936981201171875,
        5.051368713378906,
        24.138277053833008
      ),
      rotation: new Quaternion(
        -5.205570149875759e-15,
        -0.7071069478988647,
        8.429370268459024e-8,
        0.7071067094802856
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame24.addComponentOrReplace(transform52);

    const nftPictureFrame26 = new Entity("nftPictureFrame26");
    engine.addEntity(nftPictureFrame26);
    nftPictureFrame26.setParent(_scene2);
    const transform53 = new Transform({
      position: new Vector3(90.5, 5.68280029296875, 23.430604934692383),
      rotation: new Quaternion(
        9.005284141809771e-15,
        -0.7071067094802856,
        8.429367426288081e-8,
        -0.7071069478988647
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame26.addComponentOrReplace(transform53);

    const nftPictureFrame = new Entity("nftPictureFrame");
    engine.addEntity(nftPictureFrame);
    nftPictureFrame.setParent(_scene2);
    const transform54 = new Transform({
      position: new Vector3(24, 8.551368713378906, 25.99968719482422),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame.addComponentOrReplace(transform54);

    const nftPictureFrame2 = new Entity("nftPictureFrame2");
    engine.addEntity(nftPictureFrame2);
    nftPictureFrame2.setParent(_scene2);
    const transform55 = new Transform({
      position: new Vector3(
        21.936981201171875,
        8.551368713378906,
        24.138277053833008
      ),
      rotation: new Quaternion(
        -5.205570149875759e-15,
        -0.7071069478988647,
        8.429370268459024e-8,
        0.7071067094802856
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame2.addComponentOrReplace(transform55);

    const nftPictureFrame4 = new Entity("nftPictureFrame4");
    engine.addEntity(nftPictureFrame4);
    nftPictureFrame4.setParent(_scene2);
    const transform56 = new Transform({
      position: new Vector3(24, 8.551368713378906, 21.836986541748047),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame4.addComponentOrReplace(transform56);

    const nftPictureFrame5 = new Entity("nftPictureFrame5");
    engine.addEntity(nftPictureFrame5);
    nftPictureFrame5.setParent(_scene2);
    const transform57 = new Transform({
      position: new Vector3(
        26.34636878967285,
        8.551368713378906,
        23.79807472229004
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame5.addComponentOrReplace(transform57);

    const nftPictureFrame6 = new Entity("nftPictureFrame6");
    engine.addEntity(nftPictureFrame6);
    nftPictureFrame6.setParent(_scene2);
    const transform58 = new Transform({
      position: new Vector3(
        26.34636878967285,
        12.051368713378906,
        23.79807472229004
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame6.addComponentOrReplace(transform58);

    const nftPictureFrame29 = new Entity("nftPictureFrame29");
    engine.addEntity(nftPictureFrame29);
    nftPictureFrame29.setParent(_scene2);
    const transform59 = new Transform({
      position: new Vector3(
        21.936981201171875,
        12.051368713378906,
        24.138277053833008
      ),
      rotation: new Quaternion(
        -5.205570149875759e-15,
        -0.7071069478988647,
        8.429370268459024e-8,
        0.7071067094802856
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame29.addComponentOrReplace(transform59);

    const nftPictureFrame30 = new Entity("nftPictureFrame30");
    engine.addEntity(nftPictureFrame30);
    nftPictureFrame30.setParent(_scene2);
    const transform60 = new Transform({
      position: new Vector3(24, 12.051368713378906, 21.836986541748047),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame30.addComponentOrReplace(transform60);

    const nftPictureFrame31 = new Entity("nftPictureFrame31");
    engine.addEntity(nftPictureFrame31);
    nftPictureFrame31.setParent(_scene2);
    const transform61 = new Transform({
      position: new Vector3(24, 12.051368713378906, 25.99968719482422),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame31.addComponentOrReplace(transform61);

    const nftPictureFrame33 = new Entity("nftPictureFrame33");
    engine.addEntity(nftPictureFrame33);
    nftPictureFrame33.setParent(_scene2);
    const transform62 = new Transform({
      position: new Vector3(
        26.529312133789062,
        13.051368713378906,
        55.973388671875
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame33.addComponentOrReplace(transform62);

    const nftPictureFrame36 = new Entity("nftPictureFrame36");
    engine.addEntity(nftPictureFrame36);
    nftPictureFrame36.setParent(_scene2);
    const transform63 = new Transform({
      position: new Vector3(
        21.529312133789062,
        13.051368713378906,
        56.31359100341797
      ),
      rotation: new Quaternion(
        -5.205570149875759e-15,
        -0.7071069478988647,
        8.429370268459024e-8,
        0.7071067094802856
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame36.addComponentOrReplace(transform63);

    const nftPictureFrame49 = new Entity("nftPictureFrame49");
    engine.addEntity(nftPictureFrame49);
    nftPictureFrame49.setParent(_scene2);
    const transform64 = new Transform({
      position: new Vector3(
        23.943113327026367,
        13.051368713378906,
        53.175315856933594
      ),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame49.addComponentOrReplace(transform64);

    const nftPictureFrame50 = new Entity("nftPictureFrame50");
    engine.addEntity(nftPictureFrame50);
    nftPictureFrame50.setParent(_scene2);
    const transform65 = new Transform({
      position: new Vector3(
        23.943113327026367,
        13.051368713378906,
        58.675315856933594
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame50.addComponentOrReplace(transform65);

    const nftPictureFrame51 = new Entity("nftPictureFrame51");
    engine.addEntity(nftPictureFrame51);
    nftPictureFrame51.setParent(_scene2);
    const transform66 = new Transform({
      position: new Vector3(
        23.943113327026367,
        17.051368713378906,
        53.175315856933594
      ),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame51.addComponentOrReplace(transform66);

    const nftPictureFrame52 = new Entity("nftPictureFrame52");
    engine.addEntity(nftPictureFrame52);
    nftPictureFrame52.setParent(_scene2);
    const transform67 = new Transform({
      position: new Vector3(
        23.943113327026367,
        17.051368713378906,
        58.675315856933594
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame52.addComponentOrReplace(transform67);

    const nftPictureFrame53 = new Entity("nftPictureFrame53");
    engine.addEntity(nftPictureFrame53);
    nftPictureFrame53.setParent(_scene2);
    const transform68 = new Transform({
      position: new Vector3(
        26.529312133789062,
        17.051368713378906,
        55.973388671875
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame53.addComponentOrReplace(transform68);

    const nftPictureFrame54 = new Entity("nftPictureFrame54");
    engine.addEntity(nftPictureFrame54);
    nftPictureFrame54.setParent(_scene2);
    const transform69 = new Transform({
      position: new Vector3(
        21.529312133789062,
        17.051368713378906,
        56.31359100341797
      ),
      rotation: new Quaternion(
        -5.205570149875759e-15,
        -0.7071069478988647,
        8.429370268459024e-8,
        0.7071067094802856
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame54.addComponentOrReplace(transform69);

    const nftPictureFrame55 = new Entity("nftPictureFrame55");
    engine.addEntity(nftPictureFrame55);
    nftPictureFrame55.setParent(_scene2);
    const transform70 = new Transform({
      position: new Vector3(
        23.943113327026367,
        21.08881950378418,
        53.175315856933594
      ),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame55.addComponentOrReplace(transform70);

    const nftPictureFrame56 = new Entity("nftPictureFrame56");
    engine.addEntity(nftPictureFrame56);
    nftPictureFrame56.setParent(_scene2);
    const transform71 = new Transform({
      position: new Vector3(
        23.943113327026367,
        21.051368713378906,
        58.675315856933594
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame56.addComponentOrReplace(transform71);

    const nftPictureFrame57 = new Entity("nftPictureFrame57");
    engine.addEntity(nftPictureFrame57);
    nftPictureFrame57.setParent(_scene2);
    const transform72 = new Transform({
      position: new Vector3(
        26.529312133789062,
        21.051368713378906,
        55.973388671875
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame57.addComponentOrReplace(transform72);

    const nftPictureFrame58 = new Entity("nftPictureFrame58");
    engine.addEntity(nftPictureFrame58);
    nftPictureFrame58.setParent(_scene2);
    const transform73 = new Transform({
      position: new Vector3(
        21.529312133789062,
        21.051368713378906,
        56.31359100341797
      ),
      rotation: new Quaternion(
        -5.205570149875759e-15,
        -0.7071069478988647,
        8.429370268459024e-8,
        0.7071067094802856
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame58.addComponentOrReplace(transform73);
/*
    const nftPictureFrame68 = new Entity("nftPictureFrame68");
    engine.addEntity(nftPictureFrame68);
    nftPictureFrame68.setParent(_scene2);
    const transform74 = new Transform({
      position: new Vector3(
        53.943115234375,
        24.686054229736328,
        54.97135925292969
      ),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame68.addComponentOrReplace(transform74);

    const nftPictureFrame69 = new Entity("nftPictureFrame69");
    engine.addEntity(nftPictureFrame69);
    nftPictureFrame69.setParent(_scene2);
    const transform75 = new Transform({
      position: new Vector3(
        53.943115234375,
        24.686054229736328,
        57.295589447021484
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame69.addComponentOrReplace(transform75);

    const nftPictureFrame70 = new Entity("nftPictureFrame70");
    engine.addEntity(nftPictureFrame70);
    nftPictureFrame70.setParent(_scene2);
    const transform76 = new Transform({
      position: new Vector3(
        49.943115234375,
        24.686054229736328,
        57.295589447021484
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame70.addComponentOrReplace(transform76);

    const nftPictureFrame71 = new Entity("nftPictureFrame71");
    engine.addEntity(nftPictureFrame71);
    nftPictureFrame71.setParent(_scene2);
    const transform77 = new Transform({
      position: new Vector3(
        49.943115234375,
        24.686054229736328,
        54.97135925292969
      ),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame71.addComponentOrReplace(transform77);

    const nftPictureFrame72 = new Entity("nftPictureFrame72");
    engine.addEntity(nftPictureFrame72);
    nftPictureFrame72.setParent(_scene2);
    const transform78 = new Transform({
      position: new Vector3(
        45.443115234375,
        24.686054229736328,
        54.97135925292969
      ),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame72.addComponentOrReplace(transform78);

    const nftPictureFrame73 = new Entity("nftPictureFrame73");
    engine.addEntity(nftPictureFrame73);
    nftPictureFrame73.setParent(_scene2);
    const transform79 = new Transform({
      position: new Vector3(
        45.443115234375,
        24.686054229736328,
        57.295589447021484
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame73.addComponentOrReplace(transform79);

    const nftPictureFrame78 = new Entity("nftPictureFrame78");
    engine.addEntity(nftPictureFrame78);
    nftPictureFrame78.setParent(_scene2);
    const transform80 = new Transform({
      position: new Vector3(
        67.443115234375,
        24.686054229736328,
        57.295589447021484
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame78.addComponentOrReplace(transform80);

    const nftPictureFrame79 = new Entity("nftPictureFrame79");
    engine.addEntity(nftPictureFrame79);
    nftPictureFrame79.setParent(_scene2);
    const transform81 = new Transform({
      position: new Vector3(
        67.443115234375,
        24.686054229736328,
        54.97135925292969
      ),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame79.addComponentOrReplace(transform81);

    const nftPictureFrame80 = new Entity("nftPictureFrame80");
    engine.addEntity(nftPictureFrame80);
    nftPictureFrame80.setParent(_scene2);
    const transform82 = new Transform({
      position: new Vector3(
        62.943115234375,
        24.686054229736328,
        54.97135925292969
      ),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame80.addComponentOrReplace(transform82);

    const nftPictureFrame81 = new Entity("nftPictureFrame81");
    engine.addEntity(nftPictureFrame81);
    nftPictureFrame81.setParent(_scene2);
    const transform83 = new Transform({
      position: new Vector3(
        62.943115234375,
        24.686054229736328,
        57.295589447021484
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame81.addComponentOrReplace(transform83);

    const nftPictureFrame82 = new Entity("nftPictureFrame82");
    engine.addEntity(nftPictureFrame82);
    nftPictureFrame82.setParent(_scene2);
    const transform84 = new Transform({
      position: new Vector3(
        58.943115234375,
        24.686054229736328,
        57.295589447021484
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame82.addComponentOrReplace(transform84);

    const nftPictureFrame83 = new Entity("nftPictureFrame83");
    engine.addEntity(nftPictureFrame83);
    nftPictureFrame83.setParent(_scene2);
    const transform85 = new Transform({
      position: new Vector3(
        58.943115234375,
        24.686054229736328,
        54.97135925292969
      ),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame83.addComponentOrReplace(transform85);

    const nftPictureFrame60 = new Entity("nftPictureFrame60");
    engine.addEntity(nftPictureFrame60);
    nftPictureFrame60.setParent(_scene2);
    const transform86 = new Transform({
      position: new Vector3(
        71.943115234375,
        28.062854766845703,
        53.675315856933594
      ),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame60.addComponentOrReplace(transform86);

    const nftPictureFrame62 = new Entity("nftPictureFrame62");
    engine.addEntity(nftPictureFrame62);
    nftPictureFrame62.setParent(_scene2);
    const transform87 = new Transform({
      position: new Vector3(
        71.943115234375,
        28.062854766845703,
        58.175315856933594
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame62.addComponentOrReplace(transform87);

    const nftPictureFrame84 = new Entity("nftPictureFrame84");
    engine.addEntity(nftPictureFrame84);
    nftPictureFrame84.setParent(_scene2);
    const transform88 = new Transform({
      position: new Vector3(
        74.02931213378906,
        28.062854766845703,
        55.973388671875
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame84.addComponentOrReplace(transform88);

    const nftPictureFrame85 = new Entity("nftPictureFrame85");
    engine.addEntity(nftPictureFrame85);
    nftPictureFrame85.setParent(_scene2);
    const transform89 = new Transform({
      position: new Vector3(
        70.02931213378906,
        28.062854766845703,
        55.973388671875
      ),
      rotation: new Quaternion(
        1.4101295238639396e-14,
        0.6816625595092773,
        -8.126049522161338e-8,
        -0.7316668033599854
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame85.addComponentOrReplace(transform89);
    /*
    const nftPictureFrame86 = new Entity("nftPictureFrame86");
    engine.addEntity(nftPictureFrame86);
    nftPictureFrame86.setParent(_scene2);
    const transform90 = new Transform({
      position: new Vector3(
        71.943115234375,
        32.0628547668457,
        53.675315856933594
      ),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame86.addComponentOrReplace(transform90);

    const nftPictureFrame87 = new Entity("nftPictureFrame87");
    engine.addEntity(nftPictureFrame87);
    nftPictureFrame87.setParent(_scene2);
    const transform91 = new Transform({
      position: new Vector3(
        74.02931213378906,
        32.0628547668457,
        55.973388671875
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame87.addComponentOrReplace(transform91);

    const nftPictureFrame88 = new Entity("nftPictureFrame88");
    engine.addEntity(nftPictureFrame88);
    nftPictureFrame88.setParent(_scene2);
    const transform92 = new Transform({
      position: new Vector3(
        71.943115234375,
        32.0628547668457,
        58.175315856933594
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame88.addComponentOrReplace(transform92);

    const nftPictureFrame89 = new Entity("nftPictureFrame89");
    engine.addEntity(nftPictureFrame89);
    nftPictureFrame89.setParent(_scene2);
    const transform93 = new Transform({
      position: new Vector3(
        70.02931213378906,
        32.0628547668457,
        55.973388671875
      ),
      rotation: new Quaternion(
        1.4101295238639396e-14,
        0.6816625595092773,
        -8.126049522161338e-8,
        -0.7316668033599854
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame89.addComponentOrReplace(transform93);
*/
    const nftPictureFrame90 = new Entity("nftPictureFrame90");
    engine.addEntity(nftPictureFrame90);
    nftPictureFrame90.setParent(_scene2);
    const transform94 = new Transform({
      position: new Vector3(
        71.943115234375,
        36.0628547668457,
        53.675315856933594
      ),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame90.addComponentOrReplace(transform94);

    const nftPictureFrame91 = new Entity("nftPictureFrame91");
    engine.addEntity(nftPictureFrame91);
    nftPictureFrame91.setParent(_scene2);
    const transform95 = new Transform({
      position: new Vector3(
        74.02931213378906,
        36.0628547668457,
        55.973388671875
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame91.addComponentOrReplace(transform95);

    const nftPictureFrame92 = new Entity("nftPictureFrame92");
    engine.addEntity(nftPictureFrame92);
    nftPictureFrame92.setParent(_scene2);
    const transform96 = new Transform({
      position: new Vector3(
        71.943115234375,
        36.0628547668457,
        58.175315856933594
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame92.addComponentOrReplace(transform96);

    const nftPictureFrame93 = new Entity("nftPictureFrame93");
    engine.addEntity(nftPictureFrame93);
    nftPictureFrame93.setParent(_scene2);
    const transform97 = new Transform({
      position: new Vector3(
        70.02931213378906,
        36.0628547668457,
        55.973388671875
      ),
      rotation: new Quaternion(
        1.4101295238639396e-14,
        0.6816625595092773,
        -8.126049522161338e-8,
        -0.7316668033599854
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame93.addComponentOrReplace(transform97);

    const nftPictureFrame94 = new Entity("nftPictureFrame94");
    engine.addEntity(nftPictureFrame94);
    nftPictureFrame94.setParent(_scene2);
    const transform98 = new Transform({
      position: new Vector3(
        71.943115234375,
        40.0628547668457,
        53.675315856933594
      ),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame94.addComponentOrReplace(transform98);

    const nftPictureFrame95 = new Entity("nftPictureFrame95");
    engine.addEntity(nftPictureFrame95);
    nftPictureFrame95.setParent(_scene2);
    const transform99 = new Transform({
      position: new Vector3(
        74.02931213378906,
        40.0628547668457,
        55.973388671875
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame95.addComponentOrReplace(transform99);

    const nftPictureFrame96 = new Entity("nftPictureFrame96");
    engine.addEntity(nftPictureFrame96);
    nftPictureFrame96.setParent(_scene2);
    const transform100 = new Transform({
      position: new Vector3(
        71.943115234375,
        40.0628547668457,
        58.175315856933594
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame96.addComponentOrReplace(transform100);

    const nftPictureFrame97 = new Entity("nftPictureFrame97");
    engine.addEntity(nftPictureFrame97);
    nftPictureFrame97.setParent(_scene2);
    const transform101 = new Transform({
      position: new Vector3(
        70.02931213378906,
        40.0628547668457,
        55.973388671875
      ),
      rotation: new Quaternion(
        1.4101295238639396e-14,
        0.6816625595092773,
        -8.126049522161338e-8,
        -0.7316668033599854
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame97.addComponentOrReplace(transform101);

    const nftPictureFrame98 = new Entity("nftPictureFrame98");
    engine.addEntity(nftPictureFrame98);
    nftPictureFrame98.setParent(_scene2);
    const transform102 = new Transform({
      position: new Vector3(
        71.943115234375,
        44.0628547668457,
        53.675315856933594
      ),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame98.addComponentOrReplace(transform102);

    const nftPictureFrame99 = new Entity("nftPictureFrame99");
    engine.addEntity(nftPictureFrame99);
    nftPictureFrame99.setParent(_scene2);
    const transform103 = new Transform({
      position: new Vector3(
        74.02931213378906,
        44.0628547668457,
        55.973388671875
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame99.addComponentOrReplace(transform103);

    const nftPictureFrame100 = new Entity("nftPictureFrame100");
    engine.addEntity(nftPictureFrame100);
    nftPictureFrame100.setParent(_scene2);
    const transform104 = new Transform({
      position: new Vector3(
        71.943115234375,
        44.0628547668457,
        58.175315856933594
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame100.addComponentOrReplace(transform104);

    const nftPictureFrame101 = new Entity("nftPictureFrame101");
    engine.addEntity(nftPictureFrame101);
    nftPictureFrame101.setParent(_scene2);
    const transform105 = new Transform({
      position: new Vector3(
        70.02931213378906,
        44.0628547668457,
        55.973388671875
      ),
      rotation: new Quaternion(
        1.4101295238639396e-14,
        0.6816625595092773,
        -8.126049522161338e-8,
        -0.7316668033599854
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame101.addComponentOrReplace(transform105);
    /*
const nftPictureFrame102 = new Entity('nftPictureFrame102')
engine.addEntity(nftPictureFrame102)
nftPictureFrame102.setParent(_scene2)
const transform106 = new Transform({
  position: new Vector3(71.943115234375, 48.0628547668457, 53.675315856933594),
  rotation: new Quaternion(2.686802696492507e-15, -1, 1.1920926823449918e-7, -2.086162567138672e-7),
  scale: new Vector3(1,1,1)
})
nftPictureFrame102.addComponentOrReplace(transform106)

const nftPictureFrame103 = new Entity('nftPictureFrame103')
engine.addEntity(nftPictureFrame103)
nftPictureFrame103.setParent(_scene2)
const transform107 = new Transform({
  position: new Vector3(74.02931213378906, 48.0628547668457, 55.973388671875),
  rotation: new Quaternion(2.418946314615227e-15, -0.7316668033599854, 8.722145139472559e-8, -0.6816625595092773),
  scale: new Vector3(2.2500126361846924, 2.25, 2.2500126361846924)
})
nftPictureFrame103.addComponentOrReplace(transform107)

const nftPictureFrame104 = new Entity('nftPictureFrame104')
engine.addEntity(nftPictureFrame104)
nftPictureFrame104.setParent(_scene2)
const transform108 = new Transform({
  position: new Vector3(71.943115234375, 48.0628547668457, 58.175315856933594),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1,1,1)
})
nftPictureFrame104.addComponentOrReplace(transform108)

const nftPictureFrame105 = new Entity('nftPictureFrame105')
engine.addEntity(nftPictureFrame105)
nftPictureFrame105.setParent(_scene2)
const transform109 = new Transform({
  position: new Vector3(70.02931213378906, 48.0628547668457, 55.973388671875),
  rotation: new Quaternion(1.4101295238639396e-14, 0.6816625595092773, -8.126049522161338e-8, -0.7316668033599854),
  scale: new Vector3(2.250013589859009, 2.25, 2.250013589859009)
})
nftPictureFrame105.addComponentOrReplace(transform109)

const nftPictureFrame115 = new Entity('nftPictureFrame115')
engine.addEntity(nftPictureFrame115)
nftPictureFrame115.setParent(_scene2)
const transform110 = new Transform({
  position: new Vector3(51.355289459228516, 51.31483459472656, 55.04255294799805),
  rotation: new Quaternion(2.686802696492507e-15, -1, 1.1920926823449918e-7, -2.086162567138672e-7),
  scale: new Vector3(1,1,1)
})
nftPictureFrame115.addComponentOrReplace(transform110)

const nftPictureFrame116 = new Entity('nftPictureFrame116')
engine.addEntity(nftPictureFrame116)
nftPictureFrame116.setParent(_scene2)
const transform111 = new Transform({
  position: new Vector3(51.548404693603516, 51.31483459472656, 57.03889465332031),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1,1,1)
})
nftPictureFrame116.addComponentOrReplace(transform111)

const nftPictureFrame123 = new Entity('nftPictureFrame123')
engine.addEntity(nftPictureFrame123)
nftPictureFrame123.setParent(_scene2)
const transform112 = new Transform({
  position: new Vector3(44.548404693603516, 51.31483459472656, 57.03889465332031),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1,1,1)
})
nftPictureFrame123.addComponentOrReplace(transform112)

const nftPictureFrame124 = new Entity('nftPictureFrame124')
engine.addEntity(nftPictureFrame124)
nftPictureFrame124.setParent(_scene2)
const transform113 = new Transform({
  position: new Vector3(44.355289459228516, 51.31483459472656, 55.04255294799805),
  rotation: new Quaternion(2.686802696492507e-15, -1, 1.1920926823449918e-7, -2.086162567138672e-7),
  scale: new Vector3(1,1,1)
})
nftPictureFrame124.addComponentOrReplace(transform113)

const nftPictureFrame125 = new Entity('nftPictureFrame125')
engine.addEntity(nftPictureFrame125)
nftPictureFrame125.setParent(_scene2)
const transform114 = new Transform({
  position: new Vector3(48.048404693603516, 51.31483459472656, 57.03889465332031),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1,1,1)
})
nftPictureFrame125.addComponentOrReplace(transform114)

const nftPictureFrame126 = new Entity('nftPictureFrame126')
engine.addEntity(nftPictureFrame126)
nftPictureFrame126.setParent(_scene2)
const transform115 = new Transform({
  position: new Vector3(47.855289459228516, 51.31483459472656, 55.04255294799805),
  rotation: new Quaternion(2.686802696492507e-15, -1, 1.1920926823449918e-7, -2.086162567138672e-7),
  scale: new Vector3(1,1,1)
})
nftPictureFrame126.addComponentOrReplace(transform115)

*/

    const nftPictureFrame128 = new Entity("nftPictureFrame128");
    engine.addEntity(nftPictureFrame128);
    nftPictureFrame128.setParent(_scene2);
    const transform116 = new Transform({
      position: new Vector3(
        38.02931213378906,
        44.0628547668457,
        55.973388671875
      ),
      rotation: new Quaternion(
        1.4101295238639396e-14,
        0.6816625595092773,
        -8.126049522161338e-8,
        -0.7316668033599854
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame128.addComponentOrReplace(transform116);

    const nftPictureFrame129 = new Entity("nftPictureFrame129");
    engine.addEntity(nftPictureFrame129);
    nftPictureFrame129.setParent(_scene2);
    const transform117 = new Transform({
      position: new Vector3(
        39.943115234375,
        44.0628547668457,
        53.675315856933594
      ),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame129.addComponentOrReplace(transform117);

    const nftPictureFrame130 = new Entity("nftPictureFrame130");
    engine.addEntity(nftPictureFrame130);
    nftPictureFrame130.setParent(_scene2);
    const transform118 = new Transform({
      position: new Vector3(
        42.02931213378906,
        44.0628547668457,
        55.973388671875
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame130.addComponentOrReplace(transform118);

    const nftPictureFrame131 = new Entity("nftPictureFrame131");
    engine.addEntity(nftPictureFrame131);
    nftPictureFrame131.setParent(_scene2);
    const transform119 = new Transform({
      position: new Vector3(
        39.943115234375,
        44.0628547668457,
        58.175315856933594
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame131.addComponentOrReplace(transform119);

    const nftPictureFrame132 = new Entity("nftPictureFrame132");
    engine.addEntity(nftPictureFrame132);
    nftPictureFrame132.setParent(_scene2);
    const transform120 = new Transform({
      position: new Vector3(
        38.02931213378906,
        40.0628547668457,
        55.973388671875
      ),
      rotation: new Quaternion(
        1.4101295238639396e-14,
        0.6816625595092773,
        -8.126049522161338e-8,
        -0.7316668033599854
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame132.addComponentOrReplace(transform120);

    const nftPictureFrame133 = new Entity("nftPictureFrame133");
    engine.addEntity(nftPictureFrame133);
    nftPictureFrame133.setParent(_scene2);
    const transform121 = new Transform({
      position: new Vector3(
        39.943115234375,
        40.0628547668457,
        53.675315856933594
      ),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame133.addComponentOrReplace(transform121);

    const nftPictureFrame134 = new Entity("nftPictureFrame134");
    engine.addEntity(nftPictureFrame134);
    nftPictureFrame134.setParent(_scene2);
    const transform122 = new Transform({
      position: new Vector3(
        42.02931213378906,
        40.0628547668457,
        55.973388671875
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame134.addComponentOrReplace(transform122);

    const nftPictureFrame135 = new Entity("nftPictureFrame135");
    engine.addEntity(nftPictureFrame135);
    nftPictureFrame135.setParent(_scene2);
    const transform123 = new Transform({
      position: new Vector3(
        39.943115234375,
        40.0628547668457,
        58.175315856933594
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame135.addComponentOrReplace(transform123);

    const nftPictureFrame136 = new Entity("nftPictureFrame136");
    engine.addEntity(nftPictureFrame136);
    nftPictureFrame136.setParent(_scene2);
    const transform124 = new Transform({
      position: new Vector3(
        38.02931213378906,
        36.0628547668457,
        55.973388671875
      ),
      rotation: new Quaternion(
        1.4101295238639396e-14,
        0.6816625595092773,
        -8.126049522161338e-8,
        -0.7316668033599854
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame136.addComponentOrReplace(transform124);

    const nftPictureFrame137 = new Entity("nftPictureFrame137");
    engine.addEntity(nftPictureFrame137);
    nftPictureFrame137.setParent(_scene2);
    const transform125 = new Transform({
      position: new Vector3(
        39.943115234375,
        36.0628547668457,
        53.675315856933594
      ),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame137.addComponentOrReplace(transform125);

    const nftPictureFrame138 = new Entity("nftPictureFrame138");
    engine.addEntity(nftPictureFrame138);
    nftPictureFrame138.setParent(_scene2);
    const transform126 = new Transform({
      position: new Vector3(
        42.02931213378906,
        36.0628547668457,
        55.973388671875
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame138.addComponentOrReplace(transform126);

    const nftPictureFrame139 = new Entity("nftPictureFrame139");
    engine.addEntity(nftPictureFrame139);
    nftPictureFrame139.setParent(_scene2);
    const transform127 = new Transform({
      position: new Vector3(
        39.943115234375,
        36.0628547668457,
        58.175315856933594
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame139.addComponentOrReplace(transform127);

    const nftPictureFrame140 = new Entity("nftPictureFrame140");
    engine.addEntity(nftPictureFrame140);
    nftPictureFrame140.setParent(_scene2);
    const transform128 = new Transform({
      position: new Vector3(
        38.02931213378906,
        32.0628547668457,
        55.973388671875
      ),
      rotation: new Quaternion(
        1.4101295238639396e-14,
        0.6816625595092773,
        -8.126049522161338e-8,
        -0.7316668033599854
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame140.addComponentOrReplace(transform128);

    const nftPictureFrame141 = new Entity("nftPictureFrame141");
    engine.addEntity(nftPictureFrame141);
    nftPictureFrame141.setParent(_scene2);
    const transform129 = new Transform({
      position: new Vector3(
        39.943115234375,
        32.0628547668457,
        53.675315856933594
      ),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame141.addComponentOrReplace(transform129);

    const nftPictureFrame142 = new Entity("nftPictureFrame142");
    engine.addEntity(nftPictureFrame142);
    nftPictureFrame142.setParent(_scene2);
    const transform130 = new Transform({
      position: new Vector3(
        42.02931213378906,
        32.0628547668457,
        55.973388671875
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame142.addComponentOrReplace(transform130);

    const nftPictureFrame143 = new Entity("nftPictureFrame143");
    engine.addEntity(nftPictureFrame143);
    nftPictureFrame143.setParent(_scene2);
    const transform131 = new Transform({
      position: new Vector3(
        39.943115234375,
        32.0628547668457,
        58.175315856933594
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame143.addComponentOrReplace(transform131);
    /*
    const nftPictureFrame149 = new Entity("nftPictureFrame149");
    engine.addEntity(nftPictureFrame149);
    nftPictureFrame149.setParent(_scene2);
    const transform132 = new Transform({
      position: new Vector3(
        56.55563735961914,
        31.851543426513672,
        45.473388671875
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame149.addComponentOrReplace(transform132);

    const nftPictureFrame150 = new Entity("nftPictureFrame150");
    engine.addEntity(nftPictureFrame150);
    nftPictureFrame150.setParent(_scene2);
    const transform133 = new Transform({
      position: new Vector3(
        54.781044006347656,
        31.851543426513672,
        45.473388671875
      ),
      rotation: new Quaternion(
        1.4101295238639396e-14,
        0.6816625595092773,
        -8.126049522161338e-8,
        -0.7316668033599854
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame150.addComponentOrReplace(transform133);

    const nftPictureFrame151 = new Entity("nftPictureFrame151");
    engine.addEntity(nftPictureFrame151);
    nftPictureFrame151.setParent(_scene2);
    const transform134 = new Transform({
      position: new Vector3(
        54.781044006347656,
        31.851543426513672,
        48.973388671875
      ),
      rotation: new Quaternion(
        1.4101295238639396e-14,
        0.6816625595092773,
        -8.126049522161338e-8,
        -0.7316668033599854
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame151.addComponentOrReplace(transform134);

    const nftPictureFrame152 = new Entity("nftPictureFrame152");
    engine.addEntity(nftPictureFrame152);
    nftPictureFrame152.setParent(_scene2);
    const transform135 = new Transform({
      position: new Vector3(
        56.55563735961914,
        31.851543426513672,
        48.973388671875
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame152.addComponentOrReplace(transform135);

    const nftPictureFrame153 = new Entity("nftPictureFrame153");
    engine.addEntity(nftPictureFrame153);
    nftPictureFrame153.setParent(_scene2);
    const transform136 = new Transform({
      position: new Vector3(
        56.55563735961914,
        31.851543426513672,
        38.473388671875
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame153.addComponentOrReplace(transform136);

    const nftPictureFrame154 = new Entity("nftPictureFrame154");
    engine.addEntity(nftPictureFrame154);
    nftPictureFrame154.setParent(_scene2);
    const transform137 = new Transform({
      position: new Vector3(
        54.781044006347656,
        31.851543426513672,
        38.473388671875
      ),
      rotation: new Quaternion(
        1.4101295238639396e-14,
        0.6816625595092773,
        -8.126049522161338e-8,
        -0.7316668033599854
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame154.addComponentOrReplace(transform137);

    const nftPictureFrame155 = new Entity("nftPictureFrame155");
    engine.addEntity(nftPictureFrame155);
    nftPictureFrame155.setParent(_scene2);
    const transform138 = new Transform({
      position: new Vector3(
        54.781044006347656,
        31.851543426513672,
        41.973388671875
      ),
      rotation: new Quaternion(
        1.4101295238639396e-14,
        0.6816625595092773,
        -8.126049522161338e-8,
        -0.7316668033599854
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame155.addComponentOrReplace(transform138);

    const nftPictureFrame156 = new Entity("nftPictureFrame156");
    engine.addEntity(nftPictureFrame156);
    nftPictureFrame156.setParent(_scene2);
    const transform139 = new Transform({
      position: new Vector3(
        56.55563735961914,
        31.851543426513672,
        41.973388671875
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame156.addComponentOrReplace(transform139);

    const nftPictureFrame163 = new Entity("nftPictureFrame163");
    engine.addEntity(nftPictureFrame163);
    nftPictureFrame163.setParent(_scene2);
    const transform140 = new Transform({
      position: new Vector3(
        56.55563735961914,
        31.851543426513672,
        31.473388671875
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame163.addComponentOrReplace(transform140);

    const nftPictureFrame164 = new Entity("nftPictureFrame164");
    engine.addEntity(nftPictureFrame164);
    nftPictureFrame164.setParent(_scene2);
    const transform141 = new Transform({
      position: new Vector3(
        56.55563735961914,
        31.851543426513672,
        34.973388671875
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame164.addComponentOrReplace(transform141);

    const nftPictureFrame165 = new Entity("nftPictureFrame165");
    engine.addEntity(nftPictureFrame165);
    nftPictureFrame165.setParent(_scene2);
    const transform142 = new Transform({
      position: new Vector3(
        54.781044006347656,
        31.851543426513672,
        34.973388671875
      ),
      rotation: new Quaternion(
        1.4101295238639396e-14,
        0.6816625595092773,
        -8.126049522161338e-8,
        -0.7316668033599854
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame165.addComponentOrReplace(transform142);

    const nftPictureFrame166 = new Entity("nftPictureFrame166");
    engine.addEntity(nftPictureFrame166);
    nftPictureFrame166.setParent(_scene2);
    const transform143 = new Transform({
      position: new Vector3(
        54.766387939453125,
        31.851543426513672,
        30.9866943359375
      ),
      rotation: new Quaternion(
        1.4101295238639396e-14,
        0.6816625595092773,
        -8.126049522161338e-8,
        -0.7316668033599854
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame166.addComponentOrReplace(transform143);*/

    const nftPictureFrame168 = new Entity("nftPictureFrame168");
    engine.addEntity(nftPictureFrame168);
    nftPictureFrame168.setParent(_scene2);
    const transform144 = new Transform({
      position: new Vector3(55.91380310058594, 25.551368713378906, 5.75),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame168.addComponentOrReplace(transform144);

    const nftPictureFrame177 = new Entity("nftPictureFrame177");
    engine.addEntity(nftPictureFrame177);
    nftPictureFrame177.setParent(_scene2);
    const transform145 = new Transform({
      position: new Vector3(58, 25.551368713378906, 8.048072814941406),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame177.addComponentOrReplace(transform145);

    const nftPictureFrame178 = new Entity("nftPictureFrame178");
    engine.addEntity(nftPictureFrame178);
    nftPictureFrame178.setParent(_scene2);
    const transform146 = new Transform({
      position: new Vector3(55.91380310058594, 25.551368713378906, 10.25),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame178.addComponentOrReplace(transform146);

    const nftPictureFrame179 = new Entity("nftPictureFrame179");
    engine.addEntity(nftPictureFrame179);
    nftPictureFrame179.setParent(_scene2);
    const transform147 = new Transform({
      position: new Vector3(54, 25.551368713378906, 8.048072814941406),
      rotation: new Quaternion(
        1.4101295238639396e-14,
        0.6816625595092773,
        -8.126049522161338e-8,
        -0.7316668033599854
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame179.addComponentOrReplace(transform147);

    const nftPictureFrame180 = new Entity("nftPictureFrame180");
    engine.addEntity(nftPictureFrame180);
    nftPictureFrame180.setParent(_scene2);
    const transform148 = new Transform({
      position: new Vector3(55.91380310058594, 21.551368713378906, 5.75),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame180.addComponentOrReplace(transform148);

    const nftPictureFrame181 = new Entity("nftPictureFrame181");
    engine.addEntity(nftPictureFrame181);
    nftPictureFrame181.setParent(_scene2);
    const transform149 = new Transform({
      position: new Vector3(58, 21.551368713378906, 8.048072814941406),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame181.addComponentOrReplace(transform149);

    const nftPictureFrame182 = new Entity("nftPictureFrame182");
    engine.addEntity(nftPictureFrame182);
    nftPictureFrame182.setParent(_scene2);
    const transform150 = new Transform({
      position: new Vector3(55.91380310058594, 21.551368713378906, 10.25),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame182.addComponentOrReplace(transform150);

    const nftPictureFrame183 = new Entity("nftPictureFrame183");
    engine.addEntity(nftPictureFrame183);
    nftPictureFrame183.setParent(_scene2);
    const transform151 = new Transform({
      position: new Vector3(54, 21.551368713378906, 8.048072814941406),
      rotation: new Quaternion(
        1.4101295238639396e-14,
        0.6816625595092773,
        -8.126049522161338e-8,
        -0.7316668033599854
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame183.addComponentOrReplace(transform151);

    const nftPictureFrame184 = new Entity("nftPictureFrame184");
    engine.addEntity(nftPictureFrame184);
    nftPictureFrame184.setParent(_scene2);
    const transform152 = new Transform({
      position: new Vector3(55.91380310058594, 17.551368713378906, 5.75),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame184.addComponentOrReplace(transform152);

    const nftPictureFrame185 = new Entity("nftPictureFrame185");
    engine.addEntity(nftPictureFrame185);
    nftPictureFrame185.setParent(_scene2);
    const transform153 = new Transform({
      position: new Vector3(58, 17.551368713378906, 8.048072814941406),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame185.addComponentOrReplace(transform153);

    const nftPictureFrame186 = new Entity("nftPictureFrame186");
    engine.addEntity(nftPictureFrame186);
    nftPictureFrame186.setParent(_scene2);
    const transform154 = new Transform({
      position: new Vector3(55.91380310058594, 17.551368713378906, 10.25),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame186.addComponentOrReplace(transform154);

    const nftPictureFrame187 = new Entity("nftPictureFrame187");
    engine.addEntity(nftPictureFrame187);
    nftPictureFrame187.setParent(_scene2);
    const transform155 = new Transform({
      position: new Vector3(54, 17.551368713378906, 8.048072814941406),
      rotation: new Quaternion(
        1.4101295238639396e-14,
        0.6816625595092773,
        -8.126049522161338e-8,
        -0.7316668033599854
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame187.addComponentOrReplace(transform155);

    const nftPictureFrame190 = new Entity("nftPictureFrame190");
    engine.addEntity(nftPictureFrame190);
    nftPictureFrame190.setParent(_scene2);
    const transform156 = new Transform({
      position: new Vector3(
        54.54389572143555,
        13.851454734802246,
        12.580453872680664
      ),
      rotation: new Quaternion(
        1.4101295238639396e-14,
        0.6816625595092773,
        -8.126049522161338e-8,
        -0.7316668033599854
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame190.addComponentOrReplace(transform156);

    const nftPictureFrame192 = new Entity("nftPictureFrame192");
    engine.addEntity(nftPictureFrame192);
    nftPictureFrame192.setParent(_scene2);
    const transform157 = new Transform({
      position: new Vector3(
        57.019798278808594,
        13.851454734802246,
        12.580453872680664
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame192.addComponentOrReplace(transform157);

    const nftPictureFrame193 = new Entity("nftPictureFrame193");
    engine.addEntity(nftPictureFrame193);
    nftPictureFrame193.setParent(_scene2);
    const transform158 = new Transform({
      position: new Vector3(
        54.54389572143555,
        13.851454734802246,
        19.580453872680664
      ),
      rotation: new Quaternion(
        1.4101295238639396e-14,
        0.6816625595092773,
        -8.126049522161338e-8,
        -0.7316668033599854
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame193.addComponentOrReplace(transform158);

    const nftPictureFrame194 = new Entity("nftPictureFrame194");
    engine.addEntity(nftPictureFrame194);
    nftPictureFrame194.setParent(_scene2);
    const transform159 = new Transform({
      position: new Vector3(
        57.019798278808594,
        13.851454734802246,
        19.580453872680664
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame194.addComponentOrReplace(transform159);

    const nftPictureFrame195 = new Entity("nftPictureFrame195");
    engine.addEntity(nftPictureFrame195);
    nftPictureFrame195.setParent(_scene2);
    const transform160 = new Transform({
      position: new Vector3(
        54.54389572143555,
        13.851454734802246,
        16.080453872680664
      ),
      rotation: new Quaternion(
        1.4101295238639396e-14,
        0.6816625595092773,
        -8.126049522161338e-8,
        -0.7316668033599854
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame195.addComponentOrReplace(transform160);

    const nftPictureFrame196 = new Entity("nftPictureFrame196");
    engine.addEntity(nftPictureFrame196);
    nftPictureFrame196.setParent(_scene2);
    const transform161 = new Transform({
      position: new Vector3(
        57.019798278808594,
        13.851454734802246,
        16.080453872680664
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame196.addComponentOrReplace(transform161);

    const nftPictureFrame201 = new Entity("nftPictureFrame201");
    engine.addEntity(nftPictureFrame201);
    nftPictureFrame201.setParent(_scene2);
    const transform162 = new Transform({
      position: new Vector3(
        32.89854431152344,
        14.148784637451172,
        28.16604232788086
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame201.addComponentOrReplace(transform162);

    const nftPictureFrame202 = new Entity("nftPictureFrame202");
    engine.addEntity(nftPictureFrame202);
    nftPictureFrame202.setParent(_scene2);
    const transform163 = new Transform({
      position: new Vector3(
        36.89854431152344,
        14.148784637451172,
        28.16604232788086
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame202.addComponentOrReplace(transform163);

    const nftPictureFrame203 = new Entity("nftPictureFrame203");
    engine.addEntity(nftPictureFrame203);
    nftPictureFrame203.setParent(_scene2);
    const transform164 = new Transform({
      position: new Vector3(
        40.89854431152344,
        14.148784637451172,
        28.16604232788086
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame203.addComponentOrReplace(transform164);

    const nftPictureFrame204 = new Entity("nftPictureFrame204");
    engine.addEntity(nftPictureFrame204);
    nftPictureFrame204.setParent(_scene2);
    const transform165 = new Transform({
      position: new Vector3(
        44.89854431152344,
        14.148784637451172,
        28.16604232788086
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame204.addComponentOrReplace(transform165);

    const nftPictureFrame205 = new Entity("nftPictureFrame205");
    engine.addEntity(nftPictureFrame205);
    nftPictureFrame205.setParent(_scene2);
    const transform166 = new Transform({
      position: new Vector3(
        75.89854431152344,
        14.148784637451172,
        28.16604232788086
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame205.addComponentOrReplace(transform166);

    const nftPictureFrame206 = new Entity("nftPictureFrame206");
    engine.addEntity(nftPictureFrame206);
    nftPictureFrame206.setParent(_scene2);
    const transform167 = new Transform({
      position: new Vector3(
        71.89854431152344,
        14.148784637451172,
        28.16604232788086
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame206.addComponentOrReplace(transform167);

    const nftPictureFrame207 = new Entity("nftPictureFrame207");
    engine.addEntity(nftPictureFrame207);
    nftPictureFrame207.setParent(_scene2);
    const transform168 = new Transform({
      position: new Vector3(
        67.89854431152344,
        14.148784637451172,
        28.16604232788086
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame207.addComponentOrReplace(transform168);

    const nftPictureFrame208 = new Entity("nftPictureFrame208");
    engine.addEntity(nftPictureFrame208);
    nftPictureFrame208.setParent(_scene2);
    const transform169 = new Transform({
      position: new Vector3(
        63.89854431152344,
        14.148784637451172,
        28.16604232788086
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame208.addComponentOrReplace(transform169);

    const nftPictureFrame209 = new Entity("nftPictureFrame209");
    engine.addEntity(nftPictureFrame209);
    nftPictureFrame209.setParent(_scene2);
    const transform170 = new Transform({
      position: new Vector3(47, 10.36505126953125, 52.109947204589844),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame209.addComponentOrReplace(transform170);

    const nftPictureFrame210 = new Entity("nftPictureFrame210");
    engine.addEntity(nftPictureFrame210);
    nftPictureFrame210.setParent(_scene2);
    const transform171 = new Transform({
      position: new Vector3(51, 10.36505126953125, 52.109947204589844),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame210.addComponentOrReplace(transform171);

    const nftPictureFrame211 = new Entity("nftPictureFrame211");
    engine.addEntity(nftPictureFrame211);
    nftPictureFrame211.setParent(_scene2);
    const transform172 = new Transform({
      position: new Vector3(55, 10.36505126953125, 52.109947204589844),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame211.addComponentOrReplace(transform172);

    const nftPictureFrame212 = new Entity("nftPictureFrame212");
    engine.addEntity(nftPictureFrame212);
    nftPictureFrame212.setParent(_scene2);
    const transform173 = new Transform({
      position: new Vector3(59, 10.36505126953125, 52.109947204589844),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame212.addComponentOrReplace(transform173);

    const nftPictureFrame213 = new Entity("nftPictureFrame213");
    engine.addEntity(nftPictureFrame213);
    nftPictureFrame213.setParent(_scene2);
    const transform174 = new Transform({
      position: new Vector3(63, 10.36505126953125, 52.109947204589844),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame213.addComponentOrReplace(transform174);

    const nftPictureFrame215 = new Entity("nftPictureFrame215");
    engine.addEntity(nftPictureFrame215);
    nftPictureFrame215.setParent(_scene2);
    const transform175 = new Transform({
      position: new Vector3(31.5, 10.36505126953125, 52.109947204589844),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame215.addComponentOrReplace(transform175);

    const nftPictureFrame216 = new Entity("nftPictureFrame216");
    engine.addEntity(nftPictureFrame216);
    nftPictureFrame216.setParent(_scene2);
    const transform176 = new Transform({
      position: new Vector3(35.5, 10.36505126953125, 52.109947204589844),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame216.addComponentOrReplace(transform176);

    const nftPictureFrame217 = new Entity("nftPictureFrame217");
    engine.addEntity(nftPictureFrame217);
    nftPictureFrame217.setParent(_scene2);
    const transform177 = new Transform({
      position: new Vector3(39.5, 10.36505126953125, 52.109947204589844),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame217.addComponentOrReplace(transform177);

    const nftPictureFrame218 = new Entity("nftPictureFrame218");
    engine.addEntity(nftPictureFrame218);
    nftPictureFrame218.setParent(_scene2);
    const transform178 = new Transform({
      position: new Vector3(43.5, 10.36505126953125, 52.109947204589844),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame218.addComponentOrReplace(transform178);

    const nftPictureFrame214 = new Entity("nftPictureFrame214");
    engine.addEntity(nftPictureFrame214);
    nftPictureFrame214.setParent(_scene2);
    const transform179 = new Transform({
      position: new Vector3(66.5, 10.242311477661133, 52.109947204589844),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame214.addComponentOrReplace(transform179);

    const nftPictureFrame219 = new Entity("nftPictureFrame219");
    engine.addEntity(nftPictureFrame219);
    nftPictureFrame219.setParent(_scene2);
    const transform180 = new Transform({
      position: new Vector3(
        69.27059936523438,
        10.021958351135254,
        53.153282165527344
      ),
      rotation: new Quaternion(
        2.635176673632068e-15,
        -0.9807852506637573,
        1.1691869161722934e-7,
        -0.19509054720401764
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame219.addComponentOrReplace(transform180);

    const nftPictureFrame220 = new Entity("nftPictureFrame220");
    engine.addEntity(nftPictureFrame220);
    nftPictureFrame220.setParent(_scene2);
    const transform181 = new Transform({
      position: new Vector3(
        72.2667007446289,
        9.339667320251465,
        54.84352111816406
      ),
      rotation: new Quaternion(
        2.5804420398552056e-15,
        -0.9611890912055969,
        1.1458264737029822e-7,
        -0.275890588760376
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame220.addComponentOrReplace(transform181);

    const nftPictureFrame221 = new Entity("nftPictureFrame221");
    engine.addEntity(nftPictureFrame221);
    nftPictureFrame221.setParent(_scene2);
    const transform182 = new Transform({
      position: new Vector3(
        74.57971954345703,
        8.586901664733887,
        57.501956939697266
      ),
      rotation: new Quaternion(
        -1.2330502135153186e-16,
        -0.903952956199646,
        1.0775957548503357e-7,
        -0.42763209342956543
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame221.addComponentOrReplace(transform182);

    const nftPictureFrame222 = new Entity("nftPictureFrame222");
    engine.addEntity(nftPictureFrame222);
    nftPictureFrame222.setParent(_scene2);
    const transform183 = new Transform({
      position: new Vector3(
        76.03146362304688,
        8.310230255126953,
        61.11068344116211
      ),
      rotation: new Quaternion(
        1.6579330571655083e-15,
        -0.835817813873291,
        9.963723357486742e-8,
        -0.5490068793296814
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame222.addComponentOrReplace(transform183);

    const nftPictureFrame223 = new Entity("nftPictureFrame223");
    engine.addEntity(nftPictureFrame223);
    nftPictureFrame223.setParent(_scene2);
    const transform184 = new Transform({
      position: new Vector3(
        76.29701232910156,
        7.767448425292969,
        64.75826263427734
      ),
      rotation: new Quaternion(
        -5.232174607716069e-15,
        0.670486569404602,
        -7.992821338120848e-8,
        0.7419217228889465
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame223.addComponentOrReplace(transform184);

    const nftPictureFrame224 = new Entity("nftPictureFrame224");
    engine.addEntity(nftPictureFrame224);
    nftPictureFrame224.setParent(_scene2);
    const transform185 = new Transform({
      position: new Vector3(
        75.18539428710938,
        7.336235046386719,
        68.58426666259766
      ),
      rotation: new Quaternion(
        6.885678635479503e-15,
        -0.5463260412216187,
        6.512712502626528e-8,
        -0.8375725746154785
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame224.addComponentOrReplace(transform185);

    const nftPictureFrame225 = new Entity("nftPictureFrame225");
    engine.addEntity(nftPictureFrame225);
    nftPictureFrame225.setParent(_scene2);
    const transform186 = new Transform({
      position: new Vector3(
        73.30918884277344,
        6.939530372619629,
        71.9454345703125
      ),
      rotation: new Quaternion(
        -5.629927727219533e-15,
        0.45004040002822876,
        -5.364898925108719e-8,
        0.8930082321166992
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame225.addComponentOrReplace(transform186);

    const nftPictureFrame226 = new Entity("nftPictureFrame226");
    engine.addEntity(nftPictureFrame226);
    nftPictureFrame226.setParent(_scene2);
    const transform187 = new Transform({
      position: new Vector3(
        70.32048034667969,
        6.2608489990234375,
        74.72615051269531
      ),
      rotation: new Quaternion(
        -6.5257658658616786e-15,
        0.26156288385391235,
        -3.1180718451651046e-8,
        0.9651864171028137
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame226.addComponentOrReplace(transform187);

    const nftPictureFrame227 = new Entity("nftPictureFrame227");
    engine.addEntity(nftPictureFrame227);
    nftPictureFrame227.setParent(_scene2);
    const transform188 = new Transform({
      position: new Vector3(
        66.4468765258789,
        5.245816707611084,
        76.0682144165039
      ),
      rotation: new Quaternion(
        -6.0374852530874646e-15,
        0.12241274118423462,
        -1.459273235582259e-8,
        0.9924792647361755
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame227.addComponentOrReplace(transform188);

    const nftPictureFrame229 = new Entity("nftPictureFrame229");
    engine.addEntity(nftPictureFrame229);
    nftPictureFrame229.setParent(_scene2);
    const transform189 = new Transform({
      position: new Vector3(
        62.24941635131836,
        4.504326820373535,
        76.31610107421875
      ),
      rotation: new Quaternion(
        -6.582617023215493e-15,
        -0.03873109072446823,
        4.61710847332597e-9,
        0.9992496967315674
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame229.addComponentOrReplace(transform189);

    const nftPictureFrame228 = new Entity("nftPictureFrame228");
    engine.addEntity(nftPictureFrame228);
    nftPictureFrame228.setParent(_scene2);
    const transform190 = new Transform({
      position: new Vector3(
        58.09239959716797,
        3.622420310974121,
        74.82886505126953
      ),
      rotation: new Quaternion(
        -7.122268066658312e-15,
        -0.23293085396289825,
        2.776751983901704e-8,
        0.9724933505058289
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame228.addComponentOrReplace(transform190);

    const nftPictureFrame230 = new Entity("nftPictureFrame230");
    engine.addEntity(nftPictureFrame230);
    nftPictureFrame230.setParent(_scene2);
    const transform191 = new Transform({
      position: new Vector3(
        55.37312698364258,
        3.0463414192199707,
        72.48802947998047
      ),
      rotation: new Quaternion(
        -7.200772774275735e-15,
        -0.37272459268569946,
        4.443222678673919e-8,
        0.9279420375823975
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame230.addComponentOrReplace(transform191);

    const nftPictureFrame231 = new Entity("nftPictureFrame231");
    engine.addEntity(nftPictureFrame231);
    nftPictureFrame231.setParent(_scene2);
    const transform192 = new Transform({
      position: new Vector3(
        53.63063049316406,
        2.211118221282959,
        69.5001220703125
      ),
      rotation: new Quaternion(
        -7.175140710258873e-15,
        -0.5763437747955322,
        6.870551771953615e-8,
        0.8172073364257812
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame231.addComponentOrReplace(transform192);

    const nftPictureFrame232 = new Entity("nftPictureFrame232");
    engine.addEntity(nftPictureFrame232);
    nftPictureFrame232.setParent(_scene2);
    const transform193 = new Transform({
      position: new Vector3(
        52.49354934692383,
        1.8912529945373535,
        66.14340209960938
      ),
      rotation: new Quaternion(
        -6.280698058397328e-15,
        -0.6363410949707031,
        7.585775563256902e-8,
        0.7714078426361084
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame232.addComponentOrReplace(transform193);

    const nftPictureFrame233 = new Entity("nftPictureFrame233");
    engine.addEntity(nftPictureFrame233);
    nftPictureFrame233.setParent(_scene2);
    const transform194 = new Transform({
      position: new Vector3(51.8000373840332, 1.6781425476074219, 62.5),
      rotation: new Quaternion(
        -6.2167322478030515e-15,
        -0.6947357654571533,
        8.281892860395601e-8,
        0.7192651033401489
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame233.addComponentOrReplace(transform194);

    const nftPictureFrame234 = new Entity("nftPictureFrame234");
    engine.addEntity(nftPictureFrame234);
    nftPictureFrame234.setParent(_scene2);
    const transform195 = new Transform({
      position: new Vector3(
        51.8000373840332,
        1.6781425476074219,
        59.139495849609375
      ),
      rotation: new Quaternion(
        -6.2167322478030515e-15,
        -0.6947357654571533,
        8.281892860395601e-8,
        0.7192651033401489
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame234.addComponentOrReplace(transform195);

    const nftPictureFrame235 = new Entity("nftPictureFrame235");
    engine.addEntity(nftPictureFrame235);
    nftPictureFrame235.setParent(_scene2);
    const transform196 = new Transform({
      position: new Vector3(51.8000373840332, 1.6781425476074219, 56),
      rotation: new Quaternion(
        -6.2167322478030515e-15,
        -0.6947357654571533,
        8.281892860395601e-8,
        0.7192651033401489
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame235.addComponentOrReplace(transform196);
    /*
//NFT Asian square 6 nft frames start

const nftPictureFrame240 = new Entity('nftPictureFrame240')
engine.addEntity(nftPictureFrame240)
nftPictureFrame240.setParent(_scene2)
const transform197 = new Transform({
  position: new Vector3(23.152666091918945, 9.5713529586792, 60.31359100341797),
  rotation: new Quaternion(-5.205570149875759e-15, -0.7071069478988647, 8.429370268459024e-8, 0.7071067094802856),
  scale: new Vector3(2.2500085830688477, 2.25, 2.2500085830688477)
})
nftPictureFrame240.addComponentOrReplace(transform197)

const nftPictureFrame242 = new Entity('nftPictureFrame242')
engine.addEntity(nftPictureFrame242)
nftPictureFrame242.setParent(_scene2)
const transform198 = new Transform({
  position: new Vector3(23.152666091918945, 9.5713529586792, 64.3135986328125),
  rotation: new Quaternion(-5.205570149875759e-15, -0.7071069478988647, 8.429370268459024e-8, 0.7071067094802856),
  scale: new Vector3(2.250009059906006, 2.25, 2.250009059906006)
})
nftPictureFrame242.addComponentOrReplace(transform198)

const nftPictureFrame244 = new Entity('nftPictureFrame244')
engine.addEntity(nftPictureFrame244)
nftPictureFrame244.setParent(_scene2)
const transform199 = new Transform({
  position: new Vector3(23.152666091918945, 9.5713529586792, 68.8135986328125),
  rotation: new Quaternion(-5.205570149875759e-15, -0.7071069478988647, 8.429370268459024e-8, 0.7071067094802856),
  scale: new Vector3(2.250009536743164, 2.25, 2.250009536743164)
})
nftPictureFrame244.addComponentOrReplace(transform199)

const nftPictureFrame239 = new Entity('nftPictureFrame239')
engine.addEntity(nftPictureFrame239)
nftPictureFrame239.setParent(_scene2)
const transform200 = new Transform({
  position: new Vector3(24.854183197021484, 9.5713529586792, 59.97429275512695),
  rotation: new Quaternion(3.088880977982888e-15, -0.7114699482917786, 8.481379865088456e-8, -0.702716588973999),
  scale: new Vector3(2.2500123977661133, 2.25, 2.2500123977661133)
})
nftPictureFrame239.addComponentOrReplace(transform200)

const nftPictureFrame241 = new Entity('nftPictureFrame241')
engine.addEntity(nftPictureFrame241)
nftPictureFrame241.setParent(_scene2)
const transform201 = new Transform({
  position: new Vector3(24.854183197021484, 9.5713529586792, 63.97429275512695),
  rotation: new Quaternion(3.088880977982888e-15, -0.7114699482917786, 8.481379865088456e-8, -0.702716588973999),
  scale: new Vector3(2.2500128746032715, 2.25, 2.2500128746032715)
})
nftPictureFrame241.addComponentOrReplace(transform201)

const nftPictureFrame243 = new Entity('nftPictureFrame243')
engine.addEntity(nftPictureFrame243)
nftPictureFrame243.setParent(_scene2)
const transform202 = new Transform({
  position: new Vector3(24.854183197021484, 9.5713529586792, 68.47428894042969),
  rotation: new Quaternion(3.088880977982888e-15, -0.7114699482917786, 8.481379865088456e-8, -0.702716588973999),
  scale: new Vector3(2.2500133514404297, 2.25, 2.2500133514404297)
})
nftPictureFrame243.addComponentOrReplace(transform202)
//NFT Asian square 6 nft frames end
*/

    const nftPictureFrame251 = new Entity("nftPictureFrame251");
    engine.addEntity(nftPictureFrame251);
    nftPictureFrame251.setParent(_scene2);
    const transform203 = new Transform({
      position: new Vector3(
        10.598011016845703,
        4.8558197021484375,
        71.9921646118164
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame251.addComponentOrReplace(transform203);

    const nftPictureFrame252 = new Entity("nftPictureFrame252");
    engine.addEntity(nftPictureFrame252);
    nftPictureFrame252.setParent(_scene2);
    const transform204 = new Transform({
      position: new Vector3(
        8.01181411743164,
        4.8558197021484375,
        69.194091796875
      ),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame252.addComponentOrReplace(transform204);

    const nftPictureFrame253 = new Entity("nftPictureFrame253");
    engine.addEntity(nftPictureFrame253);
    nftPictureFrame253.setParent(_scene2);
    const transform205 = new Transform({
      position: new Vector3(
        8.01181411743164,
        4.8558197021484375,
        74.694091796875
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame253.addComponentOrReplace(transform205);

    const nftPictureFrame254 = new Entity("nftPictureFrame254");
    engine.addEntity(nftPictureFrame254);
    nftPictureFrame254.setParent(_scene2);
    const transform206 = new Transform({
      position: new Vector3(
        5.598011016845703,
        4.8558197021484375,
        72.33236694335938
      ),
      rotation: new Quaternion(
        -5.205570149875759e-15,
        -0.7071069478988647,
        8.429370268459024e-8,
        0.7071067094802856
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame254.addComponentOrReplace(transform206);

    const nftPictureFrame43 = new Entity("nftPictureFrame43");
    engine.addEntity(nftPictureFrame43);
    nftPictureFrame43.setParent(_scene2);
    const transform207 = new Transform({
      position: new Vector3(
        8.01181411743164,
        9.355819702148438,
        74.694091796875
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame43.addComponentOrReplace(transform207);

    const nftPictureFrame248 = new Entity("nftPictureFrame248");
    engine.addEntity(nftPictureFrame248);
    nftPictureFrame248.setParent(_scene2);
    const transform208 = new Transform({
      position: new Vector3(
        10.598011016845703,
        9.355819702148438,
        71.9921646118164
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame248.addComponentOrReplace(transform208);

    const nftPictureFrame249 = new Entity("nftPictureFrame249");
    engine.addEntity(nftPictureFrame249);
    nftPictureFrame249.setParent(_scene2);
    const transform209 = new Transform({
      position: new Vector3(
        5.598011016845703,
        9.355819702148438,
        72.33236694335938
      ),
      rotation: new Quaternion(
        -5.205570149875759e-15,
        -0.7071069478988647,
        8.429370268459024e-8,
        0.7071067094802856
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame249.addComponentOrReplace(transform209);

    const nftPictureFrame250 = new Entity("nftPictureFrame250");
    engine.addEntity(nftPictureFrame250);
    nftPictureFrame250.setParent(_scene2);
    const transform210 = new Transform({
      position: new Vector3(
        8.01181411743164,
        9.355819702148438,
        69.194091796875
      ),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame250.addComponentOrReplace(transform210);

    const nftPictureFrame167 = new Entity("nftPictureFrame167");
    engine.addEntity(nftPictureFrame167);
    nftPictureFrame167.setParent(_scene2);
    const transform211 = new Transform({
      position: new Vector3(
        89.95588684082031,
        13.692998886108398,
        23.985862731933594
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame167.addComponentOrReplace(transform211);

    const nftPictureFrame169 = new Entity("nftPictureFrame169");
    engine.addEntity(nftPictureFrame169);
    nftPictureFrame169.setParent(_scene2);
    const transform212 = new Transform({
      position: new Vector3(
        87.86968994140625,
        13.692998886108398,
        26.187789916992188
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame169.addComponentOrReplace(transform212);

    const nftPictureFrame170 = new Entity("nftPictureFrame170");
    engine.addEntity(nftPictureFrame170);
    nftPictureFrame170.setParent(_scene2);
    const transform213 = new Transform({
      position: new Vector3(
        85.95588684082031,
        13.692998886108398,
        23.985862731933594
      ),
      rotation: new Quaternion(
        1.4101295238639396e-14,
        0.6816625595092773,
        -8.126049522161338e-8,
        -0.7316668033599854
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame170.addComponentOrReplace(transform213);

    const nftPictureFrame171 = new Entity("nftPictureFrame171");
    engine.addEntity(nftPictureFrame171);
    nftPictureFrame171.setParent(_scene2);
    const transform214 = new Transform({
      position: new Vector3(
        87.86968994140625,
        13.692998886108398,
        21.687789916992188
      ),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame171.addComponentOrReplace(transform214);

    const nftPictureFrame172 = new Entity("nftPictureFrame172");
    engine.addEntity(nftPictureFrame172);
    nftPictureFrame172.setParent(_scene2);
    const transform215 = new Transform({
      position: new Vector3(
        89.95588684082031,
        9.383590698242188,
        23.985862731933594
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame172.addComponentOrReplace(transform215);

    const nftPictureFrame173 = new Entity("nftPictureFrame173");
    engine.addEntity(nftPictureFrame173);
    nftPictureFrame173.setParent(_scene2);
    const transform216 = new Transform({
      position: new Vector3(
        87.86968994140625,
        9.383590698242188,
        26.187789916992188
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame173.addComponentOrReplace(transform216);

    const nftPictureFrame174 = new Entity("nftPictureFrame174");
    engine.addEntity(nftPictureFrame174);
    nftPictureFrame174.setParent(_scene2);
    const transform217 = new Transform({
      position: new Vector3(
        85.95588684082031,
        9.383590698242188,
        23.985862731933594
      ),
      rotation: new Quaternion(
        1.4101295238639396e-14,
        0.6816625595092773,
        -8.126049522161338e-8,
        -0.7316668033599854
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame174.addComponentOrReplace(transform217);

    const nftPictureFrame175 = new Entity("nftPictureFrame175");
    engine.addEntity(nftPictureFrame175);
    nftPictureFrame175.setParent(_scene2);
    const transform218 = new Transform({
      position: new Vector3(
        87.86968994140625,
        9.383590698242188,
        21.687789916992188
      ),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame175.addComponentOrReplace(transform218);

    const nftPictureFrame8 = new Entity("nftPictureFrame8");
    engine.addEntity(nftPictureFrame8);
    nftPictureFrame8.setParent(_scene2);
    const transform219 = new Transform({
      position: new Vector3(
        70.02931213378906,
        51.76089859008789,
        55.973388671875
      ),
      rotation: new Quaternion(
        1.4101295238639396e-14,
        0.6816625595092773,
        -8.126049522161338e-8,
        -0.7316668033599854
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame8.addComponentOrReplace(transform219);

    const nftPictureFrame9 = new Entity("nftPictureFrame9");
    engine.addEntity(nftPictureFrame9);
    nftPictureFrame9.setParent(_scene2);
    const transform220 = new Transform({
      position: new Vector3(
        71.943115234375,
        51.76089859008789,
        53.675315856933594
      ),
      rotation: new Quaternion(
        2.686802696492507e-15,
        -1,
        1.1920926823449918e-7,
        -2.086162567138672e-7
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame9.addComponentOrReplace(transform220);

    const nftPictureFrame10 = new Entity("nftPictureFrame10");
    engine.addEntity(nftPictureFrame10);
    nftPictureFrame10.setParent(_scene2);
    const transform221 = new Transform({
      position: new Vector3(
        74.02931213378906,
        51.76089859008789,
        55.973388671875
      ),
      rotation: new Quaternion(
        2.418946314615227e-15,
        -0.7316668033599854,
        8.722145139472559e-8,
        -0.6816625595092773
      ),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame10.addComponentOrReplace(transform221);

    const nftPictureFrame11 = new Entity("nftPictureFrame11");
    engine.addEntity(nftPictureFrame11);
    nftPictureFrame11.setParent(_scene2);
    const transform222 = new Transform({
      position: new Vector3(
        71.943115234375,
        51.76089859008789,
        58.175315856933594
      ),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1),
    });
    nftPictureFrame11.addComponentOrReplace(transform222);

    const channelId = Math.random().toString(16).slice(2);
    const channelBus = new MessageBus();
    const inventory = createInventory(UICanvas, UIContainerStack, UIImage);
    const options = { inventory };

    //2272273421035365284426525578186006263842671319911985459048501207155582435329 metadoge (black)
    //2272273421035365284426525578186006263842671319911985459048501208255094063105 wafu

    const externalURL = CONFIG.URL_METADOGE_3D_MINT_URL;
    const uiText = "Mint Here";

    //const script1 = new OOTBNTFScript()
    const script1 = new CustomNFTScript();
    //script1.init(options);
    script1.init();
    /*
script1.spawn(nftPictureFrame3, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame3, channelBus))
script1.spawn(nftPictureFrame7, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame7, channelBus))
script1.spawn(nftPictureFrame16, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame16, channelBus))
script1.spawn(nftPictureFrame17, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame17, channelBus))
script1.spawn(nftPictureFrame18, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame18, channelBus))
script1.spawn(nftPictureFrame19, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame19, channelBus))
script1.spawn(nftPictureFrame20, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame20, channelBus))
script1.spawn(nftPictureFrame21, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame21, channelBus))
script1.spawn(nftPictureFrame22, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame22, channelBus))
script1.spawn(nftPictureFrame23, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame23, channelBus))
script1.spawn(nftPictureFrame25, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame25, channelBus))
script1.spawn(nftPictureFrame32, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame32, channelBus))
script1.spawn(nftPictureFrame40, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame40, channelBus))
script1.spawn(nftPictureFrame41, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame41, channelBus))
script1.spawn(nftPictureFrame42, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame42, channelBus))
script1.spawn(nftPictureFrame44, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame44, channelBus))
script1.spawn(nftPictureFrame45, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame45, channelBus))
script1.spawn(nftPictureFrame46, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame46, channelBus))
*/
    script1.spawn(
      nftPictureFrame47,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame47, channelBus)
    );
    script1.spawn(
      nftPictureFrame48,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame48, channelBus)
    );
    script1.spawn(
      nftPictureFrame24,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame24, channelBus)
    );
    script1.spawn(
      nftPictureFrame26,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame26, channelBus)
    );
    script1.spawn(
      nftPictureFrame,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame, channelBus)
    );
    script1.spawn(
      nftPictureFrame2,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame2, channelBus)
    );
    script1.spawn(
      nftPictureFrame4,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame4, channelBus)
    );
    script1.spawn(
      nftPictureFrame5,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame5, channelBus)
    );
    script1.spawn(
      nftPictureFrame6,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame6, channelBus)
    );
    script1.spawn(
      nftPictureFrame29,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame29, channelBus)
    );
    script1.spawn(
      nftPictureFrame30,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame30, channelBus)
    );
    script1.spawn(
      nftPictureFrame31,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame31, channelBus)
    );
    script1.spawn(
      nftPictureFrame33,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame33, channelBus)
    );
    script1.spawn(
      nftPictureFrame36,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame36, channelBus)
    );
    script1.spawn(
      nftPictureFrame49,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame49, channelBus)
    );
    script1.spawn(
      nftPictureFrame50,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame50, channelBus)
    );
    script1.spawn(
      nftPictureFrame51,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame51, channelBus)
    );
    script1.spawn(
      nftPictureFrame52,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame52, channelBus)
    );
    script1.spawn(
      nftPictureFrame53,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame53, channelBus)
    );
    script1.spawn(
      nftPictureFrame54,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame54, channelBus)
    );
    script1.spawn(
      nftPictureFrame55,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame55, channelBus)
    );
    script1.spawn(
      nftPictureFrame56,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame56, channelBus)
    );
    script1.spawn(
      nftPictureFrame57,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame57, channelBus)
    );
    script1.spawn(
      nftPictureFrame58,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame58, channelBus)
    );
    /*script1.spawn(
      nftPictureFrame68,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame68, channelBus)
    );
    script1.spawn(
      nftPictureFrame69,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame69, channelBus)
    );
    script1.spawn(
      nftPictureFrame70,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame70, channelBus)
    );
    script1.spawn(
      nftPictureFrame71,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame71, channelBus)
    );
    script1.spawn(
      nftPictureFrame72,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame72, channelBus)
    );
    script1.spawn(
      nftPictureFrame73,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame73, channelBus)
    );
    script1.spawn(
      nftPictureFrame78,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame78, channelBus)
    );
    script1.spawn(
      nftPictureFrame79,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame79, channelBus)
    );
    script1.spawn(
      nftPictureFrame80,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame80, channelBus)
    );
    script1.spawn(
      nftPictureFrame81,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame81, channelBus)
    );
    script1.spawn(
      nftPictureFrame82,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame82, channelBus)
    );
    script1.spawn(
      nftPictureFrame83,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame83, channelBus)
    );
    script1.spawn(
      nftPictureFrame60,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame60, channelBus)
    );
    script1.spawn(
      nftPictureFrame62,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame62, channelBus)
    );
    script1.spawn(
      nftPictureFrame84,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame84, channelBus)
    );
    script1.spawn(
      nftPictureFrame85,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame85, channelBus)
    );
    script1.spawn(
      nftPictureFrame86,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame86, channelBus)
    );
    script1.spawn(
      nftPictureFrame87,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame87, channelBus)
    );
    script1.spawn(
      nftPictureFrame88,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame88, channelBus)
    );
    script1.spawn(
      nftPictureFrame89,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame89, channelBus)
    );
    script1.spawn(
      nftPictureFrame90,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame90, channelBus)
    );
    script1.spawn(
      nftPictureFrame91,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame91, channelBus)
    );
    script1.spawn(
      nftPictureFrame92,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame92, channelBus)
    );
    script1.spawn(
      nftPictureFrame93,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame93, channelBus)
    );*/
    script1.spawn(
      nftPictureFrame94,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame94, channelBus)
    );
    script1.spawn(
      nftPictureFrame95,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame95, channelBus)
    );
    script1.spawn(
      nftPictureFrame96,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame96, channelBus)
    );
    script1.spawn(
      nftPictureFrame97,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame97, channelBus)
    );
    script1.spawn(
      nftPictureFrame98,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame98, channelBus)
    );
    script1.spawn(
      nftPictureFrame99,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame99, channelBus)
    );
    script1.spawn(
      nftPictureFrame100,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame100, channelBus)
    );
    script1.spawn(
      nftPictureFrame101,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame101, channelBus)
    );
    //script1.spawn(nftPictureFrame102, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame102, channelBus))
    //script1.spawn(nftPictureFrame103, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame103, channelBus))
    //script1.spawn(nftPictureFrame104, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame104, channelBus))
    //script1.spawn(nftPictureFrame105, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame105, channelBus))
    //script1.spawn(nftPictureFrame115, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame115, channelBus))
    //script1.spawn(nftPictureFrame116, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame116, channelBus))
    //script1.spawn(nftPictureFrame123, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame123, channelBus))
    //script1.spawn(nftPictureFrame124, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame124, channelBus))
    //script1.spawn(nftPictureFrame125, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame125, channelBus))
    //script1.spawn(nftPictureFrame126, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame126, channelBus))
    script1.spawn(
      nftPictureFrame128,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame128, channelBus)
    );
    script1.spawn(
      nftPictureFrame129,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame129, channelBus)
    );
    script1.spawn(
      nftPictureFrame130,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame130, channelBus)
    );
    script1.spawn(
      nftPictureFrame131,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame131, channelBus)
    );
    script1.spawn(
      nftPictureFrame132,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame132, channelBus)
    );
    script1.spawn(
      nftPictureFrame133,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame133, channelBus)
    );
    script1.spawn(
      nftPictureFrame134,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame134, channelBus)
    );
    script1.spawn(
      nftPictureFrame135,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame135, channelBus)
    );
    script1.spawn(
      nftPictureFrame136,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame136, channelBus)
    );
    script1.spawn(
      nftPictureFrame137,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame137, channelBus)
    );
    script1.spawn(
      nftPictureFrame138,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame138, channelBus)
    );
    script1.spawn(
      nftPictureFrame139,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame139, channelBus)
    );
    script1.spawn(
      nftPictureFrame140,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame140, channelBus)
    );
    script1.spawn(
      nftPictureFrame141,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame141, channelBus)
    );
    script1.spawn(
      nftPictureFrame142,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame142, channelBus)
    );
    script1.spawn(
      nftPictureFrame143,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame143, channelBus)
    );
    /*script1.spawn(
      nftPictureFrame149,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame149, channelBus)
    );
    script1.spawn(
      nftPictureFrame150,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame150, channelBus)
    );
    script1.spawn(
      nftPictureFrame151,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame151, channelBus)
    );
    script1.spawn(
      nftPictureFrame152,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame152, channelBus)
    );
    script1.spawn(
      nftPictureFrame153,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame153, channelBus)
    );
    script1.spawn(
      nftPictureFrame154,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame154, channelBus)
    );
    script1.spawn(
      nftPictureFrame155,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame155, channelBus)
    );
    script1.spawn(
      nftPictureFrame156,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame156, channelBus)
    );
    script1.spawn(
      nftPictureFrame163,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame163, channelBus)
    );
    script1.spawn(
      nftPictureFrame164,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame164, channelBus)
    );
    script1.spawn(
      nftPictureFrame165,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame165, channelBus)
    );
    script1.spawn(
      nftPictureFrame166,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame166, channelBus)
    );*/
    script1.spawn(
      nftPictureFrame168,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame168, channelBus)
    );
    script1.spawn(
      nftPictureFrame177,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame177, channelBus)
    );
    script1.spawn(
      nftPictureFrame178,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame178, channelBus)
    );
    script1.spawn(
      nftPictureFrame179,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame179, channelBus)
    );
    script1.spawn(
      nftPictureFrame180,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame180, channelBus)
    );
    script1.spawn(
      nftPictureFrame181,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame181, channelBus)
    );
    script1.spawn(
      nftPictureFrame182,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame182, channelBus)
    );
    script1.spawn(
      nftPictureFrame183,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame183, channelBus)
    );
    script1.spawn(
      nftPictureFrame184,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame184, channelBus)
    );
    script1.spawn(
      nftPictureFrame185,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame185, channelBus)
    );
    script1.spawn(
      nftPictureFrame186,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame186, channelBus)
    );
    script1.spawn(
      nftPictureFrame187,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame187, channelBus)
    );
    script1.spawn(
      nftPictureFrame190,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame190, channelBus)
    );
    script1.spawn(
      nftPictureFrame192,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame192, channelBus)
    );
    script1.spawn(
      nftPictureFrame193,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame193, channelBus)
    );
    script1.spawn(
      nftPictureFrame194,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame194, channelBus)
    );
    script1.spawn(
      nftPictureFrame195,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame195, channelBus)
    );
    script1.spawn(
      nftPictureFrame196,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame196, channelBus)
    );
    script1.spawn(
      nftPictureFrame201,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame201, channelBus)
    );
    script1.spawn(
      nftPictureFrame202,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame202, channelBus)
    );
    script1.spawn(
      nftPictureFrame203,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame203, channelBus)
    );
    script1.spawn(
      nftPictureFrame204,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame204, channelBus)
    );
    script1.spawn(
      nftPictureFrame205,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame205, channelBus)
    );
    script1.spawn(
      nftPictureFrame206,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame206, channelBus)
    );
    script1.spawn(
      nftPictureFrame207,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame207, channelBus)
    );
    script1.spawn(
      nftPictureFrame208,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame208, channelBus)
    );
    script1.spawn(
      nftPictureFrame209,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame209, channelBus)
    );
    script1.spawn(
      nftPictureFrame210,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame210, channelBus)
    );
    script1.spawn(
      nftPictureFrame211,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame211, channelBus)
    );
    script1.spawn(
      nftPictureFrame212,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame212, channelBus)
    );
    script1.spawn(
      nftPictureFrame213,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame213, channelBus)
    );
    script1.spawn(
      nftPictureFrame215,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame215, channelBus)
    );
    script1.spawn(
      nftPictureFrame216,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame216, channelBus)
    );
    script1.spawn(
      nftPictureFrame217,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame217, channelBus)
    );
    script1.spawn(
      nftPictureFrame218,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame218, channelBus)
    );
    script1.spawn(
      nftPictureFrame214,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame214, channelBus)
    );
    script1.spawn(
      nftPictureFrame219,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame219, channelBus)
    );
    script1.spawn(
      nftPictureFrame220,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame220, channelBus)
    );
    script1.spawn(
      nftPictureFrame221,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame221, channelBus)
    );
    script1.spawn(
      nftPictureFrame222,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame222, channelBus)
    );
    script1.spawn(
      nftPictureFrame223,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame223, channelBus)
    );
    script1.spawn(
      nftPictureFrame224,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame224, channelBus)
    );
    script1.spawn(
      nftPictureFrame225,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame225, channelBus)
    );
    script1.spawn(
      nftPictureFrame226,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame226, channelBus)
    );
    script1.spawn(
      nftPictureFrame227,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame227, channelBus)
    );
    script1.spawn(
      nftPictureFrame229,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame229, channelBus)
    );
    script1.spawn(
      nftPictureFrame228,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame228, channelBus)
    );
    script1.spawn(
      nftPictureFrame230,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame230, channelBus)
    );
    script1.spawn(
      nftPictureFrame231,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame231, channelBus)
    );
    script1.spawn(
      nftPictureFrame232,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame232, channelBus)
    );
    script1.spawn(
      nftPictureFrame233,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame233, channelBus)
    );
    script1.spawn(
      nftPictureFrame234,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame234, channelBus)
    );
    script1.spawn(
      nftPictureFrame235,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame235, channelBus)
    );
    /*
script1.spawn(nftPictureFrame240, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame240, channelBus))
script1.spawn(nftPictureFrame242, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame242, channelBus))
script1.spawn(nftPictureFrame244, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame244, channelBus))
script1.spawn(nftPictureFrame239, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame239, channelBus))
script1.spawn(nftPictureFrame241, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame241, channelBus))
script1.spawn(nftPictureFrame243, {"id":"2272273421035365284426525578186006263842671319911985459048501208255094063105","contract":"0x495f947276749ce646f68ac8c248420045cb7b5e","style":"Gold_Rounded","color":"#FFFFFF","ui":true,"uiText":uiText,"externalUrl":externalURL}, createChannel(channelId, nftPictureFrame243, channelBus))
*/
    script1.spawn(
      nftPictureFrame251,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame251, channelBus)
    );
    script1.spawn(
      nftPictureFrame252,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame252, channelBus)
    );
    script1.spawn(
      nftPictureFrame253,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame253, channelBus)
    );
    script1.spawn(
      nftPictureFrame254,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame254, channelBus)
    );
    script1.spawn(
      nftPictureFrame43,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame43, channelBus)
    );
    script1.spawn(
      nftPictureFrame248,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame248, channelBus)
    );
    script1.spawn(
      nftPictureFrame249,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame249, channelBus)
    );
    script1.spawn(
      nftPictureFrame250,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame250, channelBus)
    );
    script1.spawn(
      nftPictureFrame167,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame167, channelBus)
    );
    script1.spawn(
      nftPictureFrame169,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame169, channelBus)
    );
    script1.spawn(
      nftPictureFrame170,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame170, channelBus)
    );
    script1.spawn(
      nftPictureFrame171,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame171, channelBus)
    );
    script1.spawn(
      nftPictureFrame172,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame172, channelBus)
    );
    script1.spawn(
      nftPictureFrame173,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame173, channelBus)
    );
    script1.spawn(
      nftPictureFrame174,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame174, channelBus)
    );
    script1.spawn(
      nftPictureFrame175,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame175, channelBus)
    );
    script1.spawn(
      nftPictureFrame8,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame8, channelBus)
    );
    script1.spawn(
      nftPictureFrame9,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame9, channelBus)
    );
    script1.spawn(
      nftPictureFrame10,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame10, channelBus)
    );
    script1.spawn(
      nftPictureFrame11,
      {
        id: "2272273421035365284426525578186006263842671319911985459048501208255094063105",
        contract: "0x495f947276749ce646f68ac8c248420045cb7b5e",
        style: "Gold_Rounded",
        color: "#FFFFFF",
        ui: true,
        uiText: uiText,
        externalUrl: externalURL,
      },
      createChannel(channelId, nftPictureFrame11, channelBus)
    );
  }
};
