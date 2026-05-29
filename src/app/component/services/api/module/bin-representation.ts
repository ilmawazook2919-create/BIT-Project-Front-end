import { StatusRepresentation } from "./status-representation";

export interface BinRepresentation {
    id?: string,
    binCode?: string,
    binDescription?: string,
    binCreatedBy?: string,
    binCreatedDate?: Date,
    binModifyBy?:string,
    binModifyDate?:Date,
    status?:StatusRepresentation,
}