import { movePlayerTo } from "@decentraland/RestrictedActions";
import * as utils from "@dcl/ecs-scene-utils";
import { POISelectorType, SpawnPoint } from "./types";
import { NPC } from "src/npcutils/index";
//import { nftCollection, Painting } from './nfts'

/*
per nico
  adding/removing to engine can be slower
    "after running some tests measuring hiccups in different scenarios, turns out that making entities invisible rather than removing them from the engine is a lot more efficient"
  
    it causes less hiccups and also the entities show a lot faster like this
    and I suppose we’d also avoid the issue that you reported with entities not appearing (I wasn’t able to reproduce that w my tests, though)
      it implies slightly more loading at the very beginning, but not too significant


    trade off are SHAPE_SHOW_HIDE still has active colliders
  
*/
export enum VisibilityStrategyEnum {
  ENGINE_ADD_REMOVE,
  SHAPE_SHOW_HIDE,
}

const VAULT = new Transform({
  position: new Vector3(24, 3, 24), //where no one can walk
  scale: new Vector3(0, 0, 0), // not visible
});

export type EntityWrapperArgs = {
  //matches?(action: string,showActionMgr:ShowActionManager):boolean,

  //onShow?(scene:SubScene):void,
  //onHide?(scene:SubScene):void,
  //hide?():void,
  onChangeEntityVisibility?(
    entity: BaseEntityWrapper,
    type: VisibleChangeType
  ): void;

  visibilityStrategy?: VisibilityStrategyEnum;

  onInit?(entity: BaseEntityWrapper): void;
};
export type SceneEntityArgs = EntityWrapperArgs & {
  onInit?(entity: SceneEntity, scene: SubScene): void;
};

export type EntityActionListener = (entityWrap: BaseEntityWrapper) => void;

export class BaseEntityWrapper {
  sceneName: string;
  name: string;
  visible: boolean = true;
  visibilityStrategy: VisibilityStrategyEnum =
    VisibilityStrategyEnum.ENGINE_ADD_REMOVE;
  visibleTransformInfo?: Transform; //if vault hide/showing
  initAlready: boolean = false;

  onInitListener: EntityActionListener[] = []; //(scene:SubScene)=>void = []
  onShowListener: EntityActionListener[] = [];
  onHideListener: EntityActionListener[] = [];

  constructor(sceneName: string, name: string, args?: EntityWrapperArgs) {
    this.name = name;
    this.sceneName = sceneName;

    if (args && args.visibilityStrategy)
      this.visibilityStrategy = args.visibilityStrategy;
    if (args && args.onInit) this.addOnInitListener(args.onInit);
  }

  init() {
    if (this.initAlready) return false;

    this.initAlready = true;

    //log("ent.checking onInit!!!",this.name)

    if (this.onInit !== undefined) {
      log("calling onInit!!!", this.name);
      this.onInit(this);
    }

    return true;
  }

  //onInit(entity:EntityWrapper) {}

  onChangeEntityVisibility(entity: BaseEntityWrapper, type: VisibleChangeType) {
    switch (type) {
      case "hide":
        this.onHide(this);
        break;
      case "show":
        log("onChangeEntityVisibility calling onShow");
        this.onShow(this);
        break;
    }
  }

  isVisible() {
    return this.visible;
  }

  onHide(baseEntWrapper: BaseEntityWrapper) {
    this.processListener(baseEntWrapper, this.onHideListener);
  }
  onShow(baseEntWrapper: BaseEntityWrapper) {
    log("baseclass.onShow", this.onShowListener);
    this.processListener(baseEntWrapper, this.onShowListener);
  }
  onInit(baseEntWrapper: BaseEntityWrapper) {
    log("baseclass.onInit", this.onInitListener);
    this.processListener(baseEntWrapper, this.onInitListener);
  }
  processListener(
    sceneEnt: BaseEntityWrapper,
    listeners: ((sceneEnt: BaseEntityWrapper) => void)[]
  ) {
    if (!listeners) return;
    for (const p in listeners) {
      listeners[p](sceneEnt);
    }
  }

  show() {
    if (!this.initAlready) this.init();
    this.visible = true;
    this.onChangeEntityVisibility(this, "show");
  }

  hide() {
    this.visible = false;
    this.onChangeEntityVisibility(this, "hide");
  }

  addOnInitListener(listener: EntityActionListener) {
    this.onInitListener.push(listener);
  }

  addOnShowListener(listener: EntityActionListener) {
    this.onShowListener.push(listener);
  }

  addOnHideListener(listener: EntityActionListener) {
    this.onHideListener.push(listener);
  }
}

export class EntityWrapper extends BaseEntityWrapper {
  entity: Entity;
  entities: Entity[];

  constructor(
    name: string,
    entity?: Entity | Entity[],
    args?: EntityWrapperArgs
  ) {
    super(name, name, args);

    if (Array.isArray(entity)) {
      //const ent:Entity = entity as Entity
      this.entity = entity[0];
      this.entities = entity;
    } else if (entity !== undefined) {
      this.entity = entity;
      this.entities = [];
      this.entities.push(entity);
    } else {
      this.entity = new Entity("232");
      this.entities = [];
    }

    if (args && args.visibilityStrategy)
      this.visibilityStrategy = args.visibilityStrategy;
    if (args && args.onInit) this.onInit = args.onInit;
  }

  onShow() {
    log("called onShow on", this.name, this.entities.length);
    const entity = this.entity;

    //if(this.name == 'closestTrack.debugUI') debugger

    this.showEntity(entity);

    if (this.entities) {
      for (const p in this.entities) {
        this.showEntity(this.entities[p]);
      }
    }

    super.onShow(this);
  }

  onHide() {
    log("called onHide", this.name, this.entities.length);
    const entity = this.entity;

    this.hideEntity(entity);

    if (this.entities) {
      for (const p in this.entities) {
        this.hideEntity(this.entities[p]);
      }
    }

    super.onHide(this);
  }

  private showEntity(entity: Entity) {
    if (!entity) return;

    if (this.visibilityStrategy == VisibilityStrategyEnum.SHAPE_SHOW_HIDE) {
      if (entity.hasComponent("engine.shape")) {
        entity.getComponent("engine.shape").visible = true;
        entity.getComponent("engine.shape").withCollisions = true;
      }
      const transform = this.visibleTransformInfo;
      if (transform !== undefined) {
        entity.addComponentOrReplace(transform);
      }
    } else {
      if (entity && !entity.alive) {
        engine.addEntity(entity);
      }
    }
  }
  private hideEntity(entity: Entity) {
    if (!entity) return;

    if (this.visibilityStrategy == VisibilityStrategyEnum.SHAPE_SHOW_HIDE) {
      if (entity.hasComponent("engine.shape")) {
        log("hide.visible ", entity.name);
        entity.getComponent("engine.shape").visible = false;
        entity.getComponent("engine.shape").withCollisions = false;
      }
      if (entity.hasComponent(Transform)) {
        const tf = entity.getComponent(Transform);
        if (tf !== VAULT) {
          //FIXME this is a work around, if need to preserve position over time (moveUtils etc) this wont work
          this.visibleTransformInfo = entity.getComponent(Transform);
          entity.addComponentOrReplace(VAULT);
        }
      }
    } else {
      if (entity && entity.alive) {
        log("hide.removing ", entity.name);
        engine.removeEntity(entity);
      }
    }
  }
}

export class SceneEntity extends EntityWrapper {
  constructor(name: string, entity: Entity | Entity[], args?: SceneEntityArgs) {
    super(name, entity, args);
  }
}

export type VisibleChangeType = "show" | "hide";

//FIXME do not extend Entity
export class SubScene extends BaseEntityWrapper {
  public rootEntity?: Entity; //if hierarchical
  public triggerEntity: Entity;
  public initAlready: boolean = false;
  public entities: SceneEntity[]; // CONSIDER turn to record for instant lookup by name?
  public isActive: boolean;
  public id: number;
  public spawnPoints: SpawnPoint[] = [];

  constructor(
    id: number,
    name: string,
    entities: SceneEntity[],
    triggerPosition?: Vector3,
    triggerSize?: Vector3
  ) {
    super(name, name + "-" + id, undefined);

    log("constructor", id, name, entities);

    this.id = id;
    this.entities = entities;
    this.isActive = false;

    this.triggerEntity = new Entity("231");
    engine.addEntity(this.triggerEntity);

    if (triggerPosition !== undefined) {
      let triggerBox = new utils.TriggerBoxShape(triggerSize, triggerPosition);
      this.triggerEntity.addComponent(
        new utils.TriggerComponent(triggerBox, {
          onCameraEnter: () => {
            if (this.isActive) {
              this.show();
            }
          },
          onCameraExit: () => {
            if (this.isActive) {
              this.hide();
            }
          },
          // uncomment the line below to see the areas covered by the trigger areas
          enableDebug: true,
        })
      );
    }
    this.addOnShowListener((baseEntWrapper) => {
      log(this.id + " show called");
    });
    this.addOnHideListener((baseEntWrapper) => {
      log(this.id + " hide called");
    });
    this.addOnInitListener((baseEntWrapper) => {
      log(this.id + " onInit called");
    });
  }

  addEntity(sceneEnt: SceneEntity | Entity): SceneEntity {
    let retSceneEnt;
    if (sceneEnt instanceof SceneEntity) {
      retSceneEnt = sceneEnt;
      this.entities.push(sceneEnt);
    } else {
      retSceneEnt = new SceneEntity(
        sceneEnt.name !== undefined ? sceneEnt.name : "undefined-scene-",
        sceneEnt
      );
      this.entities.push(retSceneEnt);
    }
    log("subscene.addEntity", this.entities, this.id);
    return retSceneEnt;
  }

  onInit(sceneEnt: SubScene) {
    super.onInit(sceneEnt);

    this.entities.forEach((entity) => {
      entity.init();
    });
  }

  onHide(scene: SubScene) {
    log("subscene.onHide", this.id);

    super.onHide(scene);

    this.entities.forEach((entity) => {
      const handled = false;
      //if(this.overrideHide !== undefined){

      //}
      if (!handled) {
        entity.hide();
      }
    });
  }
  onShow(scene: SubScene) {
    log("subscene.onShow", this.entities, this.id);
    super.onShow(scene);

    this.entities.forEach((entity) => {
      entity.show();
    });
  }
}
