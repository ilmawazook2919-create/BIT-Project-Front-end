import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderItemService {
private baseUrl : string= 'http://localhost:8010/api/v1/salesOrderItem';

  constructor(private http:HttpClient) { }

   createSalesOrderItem(salesOrderItem:any,type:any):Observable<any>{
        if(type=='Add'){
          return this.http.post(this.baseUrl,salesOrderItem);
        }else{
          return this.http.put(this.baseUrl+"/"+salesOrderItem.id,salesOrderItem);
      }
          
    }
    
    GetSalesOrderItemById(ID:any):Observable<any>{
      return this.http.get(this.baseUrl+"/"+ID);
    }
    
    GetAllSalesOrderItems():Observable<any>{
        return this.http.get(this.baseUrl);
    }
    
    DeleteSalesOrderItemById(ID:any):Observable<any>{
      return this.http.delete(this.baseUrl+"/"+ID)
    }
    }
    
  
  


