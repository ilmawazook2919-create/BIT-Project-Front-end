import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
 private baseUrl : string= 'http://localhost:8010/api/v1/warehouse';

  constructor(private http:HttpClient) { }

   createWarehouse(warehouse:any,type:any):Observable<any>{
        if(type=='Add'){
          return this.http.post(this.baseUrl,warehouse);
        }else{
          return this.http.put(this.baseUrl+"/"+warehouse.id,warehouse);
      }
          
    }
    
    GetWarehouseById(ID:any):Observable<any>{
      return this.http.get(this.baseUrl+"/"+ID);
    }
    
    GetAllWarehouses():Observable<any>{
        return this.http.get(this.baseUrl);
    }
    
    DeleteWarehouseById(ID:any):Observable<any>{
      return this.http.delete(this.baseUrl+"/"+ID)
    }
    }
    
  
  

