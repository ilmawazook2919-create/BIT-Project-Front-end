import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderItemService {
private baseUrl : string= 'http://localhost:8010/api/v1/purchaseOrderItem';

  constructor(private http:HttpClient) { }
   createPurchaseOrderItem(purchaseOrderItem:any,type:any):Observable<any>{
        if(type=='Add'){
          return this.http.post(this.baseUrl,purchaseOrderItem);
        }else{
          return this.http.put(this.baseUrl+"/"+purchaseOrderItem.id,purchaseOrderItem);
      }
          
    }
    
    GetPurchaseOrderItemById(ID:any):Observable<any>{
      return this.http.get(this.baseUrl+"/"+ID);
    }
    
    GetAllpurchaseOrderItems():Observable<any>{
        return this.http.get(this.baseUrl);
    }
    
    DeletePurchaseOrderItemById(ID:any):Observable<any>{
      return this.http.delete(this.baseUrl+"/"+ID)
    }
    }
    
  
  



