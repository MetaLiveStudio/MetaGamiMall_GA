import { notNull } from "./utils"

export interface RandomResultTableListingExt {
  // Catalog version this table is associated with
  CatalogVersion?: string;
  // Child nodes that indicate what kind of drop table item this actually is.
  Nodes: ResultTableNodeExt[];
  // Unique name for this drop table
  TableId: string;
}

export interface ResultTableNodeExt {
  // Either an ItemId, or the TableId of another random result table
  ResultItem: string;
  // Whether this entry in the table is an item or a link to another table
  ResultItemType: string;
  // How likely this is to be rolled - larger numbers add more weight
  Weight: number;
  //
  _catalogItem?:PlayFabServerModels.CatalogItem
  //dropTable?:PlayFabServerModels.CatalogItem
}


export class PlayFabDataUtils{
  catalogItems:PlayFabServerModels.GetCatalogItemsResult
  dropTables:PlayFabServerModels.GetRandomResultTablesResult

  catalogItemMapById:Map<string,PlayFabServerModels.CatalogItem>=new Map()
  dropTablesMapById:Map<string,RandomResultTableListingExt>=new Map()

  hasAleadyInit:boolean =false
  init(){
    if(this.hasAleadyInit) return

    //create lookup tables
    if(notNull(this.catalogItems) && notNull(this.catalogItems.Catalog)){
      for(const p of this.catalogItems.Catalog){
        
        this.catalogItemMapById.set( p.ItemId, p )
        console.log("catalog item",p.ItemId,this.catalogItemMapById.get(p.ItemId))
      }
    }
    if(notNull(this.dropTables) && notNull(this.dropTables.Tables)){
      for(const p in this.dropTables.Tables){
        const itm = this.dropTables.Tables[p]
        this.dropTablesMapById.set( itm.TableId, itm )
        for(const node of itm.Nodes){
          const extNode = (node as ResultTableNodeExt)
          if(node.ResultItemType === 'ItemId'){
            
            extNode._catalogItem = this.catalogItemMapById.get( node.ResultItem )
            //console.log("ext ",node)
          }
        }
      }
    }

    this.hasAleadyInit = true
  }
}
