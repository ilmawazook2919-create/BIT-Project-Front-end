import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryLevelService {

  private baseUrl : string= 'http://localhost:8010/api/v1/inventoryLevel';

  constructor( private http:HttpClient) { }

    createInventoryLevel(inventoryLevel:any,type:any):Observable<any>{
        if(type=='Add'){
          return this.http.post(this.baseUrl,inventoryLevel);
        }else{
          return this.http.put(this.baseUrl+"/"+inventoryLevel.id,inventoryLevel);
      }
          
    }
    
    GetInventoryLevelById(ID:any):Observable<any>{
      return this.http.get(this.baseUrl+"/"+ID);
    }
    
    GetAllInventoryLevels():Observable<any>{
        return this.http.get(this.baseUrl);
    }
    
    DeleteInventoryLevelById(ID:any):Observable<any>{
      return this.http.delete(this.baseUrl+"/"+ID)
    }
    }
    
  
  

