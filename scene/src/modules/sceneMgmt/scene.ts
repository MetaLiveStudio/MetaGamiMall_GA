import { SubScene } from "src/modules/sceneMgmt/subScene";

export class Scene extends SubScene {
  firstFloor: SubScene; //just an example of sub scenes
  lazyLoadScenes: SubScene[] | undefined;
  isActive: boolean;
  rootEntity: Entity;
  systems:ISystem[] = []
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

  addSystem(system:ISystem){
    this.systems.push(system)
  }

  enableSystems(){
    setSystemEnabled(this.systems,true)
  }
  disableSystems(){
    setSystemEnabled(this.systems,false)
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


function setSystemEnabled(systems:ISystem|ISystem[],val:boolean){
  if(Array.isArray(systems)){
    for(const p in systems){
      if(val){
        if(!systems[p].active) engine.addSystem(systems[p])
      }else{
        if(systems[p].active) engine.removeSystem(systems[p])
      }
    }
  }else{
    if(val){
      if(!systems.active) engine.addSystem(systems)
    }else{
      if(systems.active) engine.removeSystem(systems)
    }
  }
}

