import { StatusRepresentation } from "./status-representation";
import { SupplierRepresentation } from "./supplier-representation";

export interface PurchaseOrderRepresentation{
      id?:string,
      purchaseNumber?:String,
      supplierId?:SupplierRepresentation,
      orderDate?:Date,
      expectedDeliveryDate?:Date,
      totalAmount?:BigInt,
      createdBy?:string,
      createdDate?:Date,
      modifyBy?:string,
      modifyDate?:Date,
      status?:StatusRepresentation,
}