import { StatusRepresentation } from "./status-representation";

export interface CategoryRepresentation {
   id?:String,
   categoryName?:String,
   categoryDescription?:String,
   categoryCreatedBy?:String,
   categoryCreatedDate?:Date,
   categoryModifiedBy?:String,
   categoryModifiedDate?:Date, 
   status?:StatusRepresentation
}