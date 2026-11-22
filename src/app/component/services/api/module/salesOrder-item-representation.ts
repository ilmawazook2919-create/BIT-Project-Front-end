import { PartRepresentation } from "./part-representation";
import { SalesOrderRepresentation } from "./salesOrder-representation";
import { StatusRepresentation } from "./status-representation";


export interface SalesOrderItemRepresentation {
    id?:string ;
    salesOrderId?:SalesOrderRepresentation;
    partId?:PartRepresentation;
    quantityOrdered?: string;
    unitCost?:string;
    createdBy?:string;
    createdDate?:Date;
    modifyBy?:string;
    modifyDate?:Date;
    status?:StatusRepresentation;
}