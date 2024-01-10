import { Vector3 } from "@dcl/sdk/math";

export class MenuItem /*extends Entity*/ {
  selected: boolean = false;
  defaultItemScale: Vector3;
  highlightItemScale: Vector3;

  constructor(name: string) {
    //super(name);
    this.defaultItemScale = Vector3.create(1, 1, 1);
    this.highlightItemScale = Vector3.create(1, 1, 1);
  }
  updateItemInfo(_info: any, _secondaryInfo?: any) {}

  select() {}
  deselect(_silent?: boolean) {
    // this.selected = false
  }
  show() {}
  hide() {}
}
