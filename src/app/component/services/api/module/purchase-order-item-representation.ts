import { PartRepresentation } from "./part-representation";
import { PurchaseOrderRepresentation } from "./purchaseOrder-representation";
import { StatusRepresentation } from "./status-representation";

export interface PurchaseOrderItemRepresentation{
      id?:string,
      purchaseOrderId?:PurchaseOrderRepresentation,
      partId?:PartRepresentation,
      quantityOrdered?:string,
      unitCost?:BigInt,
      createdBy?:string,
      createdDate?:Date,
      modifyBy?:string,
      modifyDate?:Date,
      status?:StatusRepresentation,
}