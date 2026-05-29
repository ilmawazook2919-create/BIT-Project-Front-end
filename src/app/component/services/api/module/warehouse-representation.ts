import { StatusRepresentation } from "./status-representation";

export interface WarehouseRepresentation{
      id?:string,
      locationName?:string,
      address?:string,
      isActive?:string,
      warehouseCreatedBy?:string,
      warehouseCreatedDate?:Date,
      warehouseModifyBy?:string,
      warehouseModifyDate?:Date,
      status?:StatusRepresentation,
}