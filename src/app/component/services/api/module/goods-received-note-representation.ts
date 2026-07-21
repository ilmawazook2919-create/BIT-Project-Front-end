import { PurchaseOrderRepresentation } from "./purchaseOrder-representation";
import { StatusRepresentation } from "./status-representation";

export interface GoodsReceivedNoteRepresentation{
      id?:string,
      purchaseOrderId?:PurchaseOrderRepresentation,
      receiptDate?:Date,
      receivedBy?:string,
      createdBy?:string,
      createdDate?:Date,
      modifyBy?:string,
      modifyDate?:Date,
      status?:StatusRepresentation,
}