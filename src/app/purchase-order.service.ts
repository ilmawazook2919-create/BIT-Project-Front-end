import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
 private baseUrl : string= 'http://localhost:8010/api/v1/purchaseOrder';

  constructor(private http:HttpClient) { }
   createPurchaseOrder(purchaseOrder:any,type:any):Observable<any>{
        if(type=='Add'){
          return this.http.post(this.baseUrl,purchaseOrder);
        }else{
          return this.http.put(this.baseUrl+"/"+purchaseOrder.id,purchaseOrder);
      }
          
    }
    
    GetPurchaseOrderById(ID:any):Observable<any>{
      return this.http.get(this.baseUrl+"/"+ID);
    }
    
    GetAllPurchaseOrders():Observable<any>{
        return this.http.get(this.baseUrl);
    }
    
    DeletepurchaseOrderById(ID:any):Observable<any>{
      return this.http.delete(this.baseUrl+"/"+ID)
    }
    }
    
  
  


