import { StatusRepresentation } from "./status-representation";

export interface SupplierRepresentation{
    id?:String,
    supplierName?:String,
    supplierContact?:String,
    supplierEmail?:String,
    supplierAddress?:String,
    supplierContactPerson?:String,
    supplierCreatedBy?:Date,
    supplierCreatedDate?:Date,
    supplierModifyBy?:String,
    supplierModifyDate?:Date,
    status?:StatusRepresentation
}