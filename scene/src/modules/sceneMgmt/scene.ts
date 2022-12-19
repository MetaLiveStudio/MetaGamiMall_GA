import { SubScene } from "src/modules/sceneMgmt/subScene";

export class Scene extends SubScene {
  firstFloor: SubScene; //just an example of sub scenes
  lazyLoadScenes: SubScene[] | undefined;
  isActive: boolean;
  rootEntity: Entity;
  //lazyLoadManager: LazyLoadManager
  constructor(name: string, firstFloor: SubScene, lazyLoadScenes?: SubScene[]) {
    super(0, name, firstFloor.entities);
    this.isActive = false;
    this.firstFloor = firstFloor;
    this.rootEntity = firstFloor.rootEntity ?? new Entity("23");
    this.firstFloor.entities.forEach((entity) => {
      engine.removeEntity(entity.entity);
    });
    this.lazyLoadScenes = lazyLoadScenes;
  }

  onShow(scene: SubScene) {
    super.onShow(scene);
    this.isActive = true;
    this.firstFloor.show();
    engine.addEntity(this.rootEntity);
    this.firstFloor.entities.forEach((entity) => {
      engine.addEntity(entity.entity);
    });
    this.lazyLoadScenes?.forEach((subScene) => {
      subScene.isActive = true;
    });
  }

  onHide(scene: SubScene): void {
    super.onHide(scene);
    this.isActive = false;
    this.firstFloor.hide();
    engine.removeEntity(this.rootEntity);
    this.firstFloor.entities.forEach((entity) => {
      engine.removeEntity(entity.entity);
    });
    this.lazyLoadScenes?.forEach((subScene) => {
      subScene.isActive = false;
    });
  }
}
