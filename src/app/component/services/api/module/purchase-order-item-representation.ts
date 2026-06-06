import { StatusRepresentation } from "./status-representation";

export interface PurchaseOrderItemRepresentation{
      Id?:string,
      PurchaseOrderId?:PurchaseOrderRepresentation,
      partId?:string,
      quantityOrdered?:string,
      createdBy?:string,
      createdDate?:Date,
      modifyBy?:string,
      modifyDate?:Date,
      status?:StatusRepresentation,
}