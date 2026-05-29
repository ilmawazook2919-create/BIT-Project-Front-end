import { StatusRepresentation } from "./status-representation";

export interface CustomerRepresentation{
    
    id?:String,
    customerFName?:String,
    customerLName?:String,
    customerContact?:String,
    customerEmail?:String,
    customerAddress?:String,
    customerCreatedBy?:String,
    customerCreatedDate?:Date,
    customerModifyBy?:String,
    customerModifyDate?:Date,
    status?:StatusRepresentation
}