import { CustomerRepresentation } from "./customer-representation";
import { StatusRepresentation } from "./status-representation";
import { WarehouseRepresentation } from "./warehouse-representation";

export interface SalesOrderRepresentation{
      id?:string,
      orderNumber?:string,
      customerId?:CustomerRepresentation,
      warehouseId?:WarehouseRepresentation,
      orderDate?:Date,
      requiredDate?:Date,
      totalAmount?:BigInt,
      createdBy?:string,
      createdDate?:Date,
      modifyBy?:string,
      modifyDate?:Date,
      status?:StatusRepresentation,
}
