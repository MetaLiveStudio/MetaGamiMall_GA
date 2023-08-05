import { REGISTRY } from "src/registry";
import { CommonResources } from "src/resources/common";
import * as utils from '@dcl/ecs-scene-utils'
import { isPreviewMode } from '@decentraland/EnvironmentAPI'
import { triggerEmote, PredefinedEmote } from '@decentraland/RestrictedActions'

export function initSecondAltScene(){
    const _secondAlternativeScene = new Entity("1229");
    engine.addEntity(_secondAlternativeScene);
    REGISTRY.entities.secondaryAlternativeScene = _secondAlternativeScene
      
    /*
    // Add planet stage related entities 

    const Stagecollider = new Entity("Stagecollider");
    Stagecollider.setParent(_secondAlternativeScene);
    Stagecollider.addComponent(new GLTFShape("models/Stagescene/Stagecollider.glb"));
    Stagecollider.addComponent(new Transform({ position: new Vector3(28, 0+10, 35) }));
    engine.addEntity(Stagecollider);
    */
   //WAS MGM Stage but since been moved to a world
   //https://github.com/MetaLiveStudio/MetaGamiMall/tree/MGMPlanetStage
   //leaving this stub in case we want to use it again
}

