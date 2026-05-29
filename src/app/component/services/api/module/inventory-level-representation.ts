import { StatusRepresentation } from "./status-representation";

export interface InventoryLevelRepresentation{
      inventoryLevelId?:string,
      partId?:string,
      binId?:string,
      quantityOnHand?:string,
      minimumStockLevel?:string,
      maximumStockLevel?:string,
      createdBy?:string,
      createdDate?:Date,
      modifyBy?:string,
      modifyDate?:Date,
      status?:StatusRepresentation,
}