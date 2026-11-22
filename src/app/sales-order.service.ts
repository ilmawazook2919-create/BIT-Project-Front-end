import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {
private baseUrl : string= 'http://localhost:8010/api/v1/salesOrder';

  constructor(private http:HttpClient) { }

   createSalesOrder(salesOrder:any,type:any):Observable<any>{
        if(type=='Add'){
          return this.http.post(this.baseUrl,salesOrder);
        }else{
          return this.http.put(this.baseUrl+"/"+salesOrder.id,salesOrder);
      }
          
    }
    
    GetSalesOrderById(ID:any):Observable<any>{
      return this.http.get(this.baseUrl+"/"+ID);
    }
    
    GetAllSalesOrders():Observable<any>{
        return this.http.get(this.baseUrl);
    }
    
    DeleteSalesOrderById(ID:any):Observable<any>{
      return this.http.delete(this.baseUrl+"/"+ID)
    }
    }
    
  
  

