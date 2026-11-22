import { StatusRepresentation } from "./status-representation";

export interface PartRepresentation {
    partId?: string,
    partName?: string,
    partDescription?: string,
    partNumber?: string,
    unitOfMeasure?:string,
    unitCost?: string,
    sellingPrice?: string,
    weight?: Float32Array,
    quantity?:string,
    priorityLevel?:string,
    dimensions?: BigInteger,
    isActive?: boolean,
    createdBy?: string,
    createdDate?: Date,
    modifyBy?:string,
    modifyDate?:Date,
    status?:StatusRepresentation,
   
}