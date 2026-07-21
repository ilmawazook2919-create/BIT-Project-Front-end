import { BinRepresentation } from "./bin-representation"
import { GoodsReceivedNoteRepresentation } from "./goods-received-note-representation"
import { PartRepresentation } from "./part-representation"
import { StatusRepresentation } from "./status-representation"

  export interface GrnItemRepresentation{
     id?:String,
     goodsReceivedNoteId?:GoodsReceivedNoteRepresentation,
     partId?:PartRepresentation,
     binId?:BinRepresentation,
    quantity?:string,
    createdBy?:string,
     createdDate?:Date,
    modifyBy?:string
     modifyDate?:Date,
     status?:StatusRepresentation
     }