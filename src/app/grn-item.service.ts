import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrnItemService {
private baseUrl : string= 'http://localhost:8010/api/v1/grnItem';

  constructor(private http:HttpClient) { }

   createGrnItem(grnItem:any,type:any):Observable<any>{
        if(type=='Add'){
          return this.http.post(this.baseUrl,grnItem);
        }else{
          return this.http.put(this.baseUrl+"/"+grnItem.id,grnItem);
      }
          
    }
    
    GetGrnItemById(ID:any):Observable<any>{
      return this.http.get(this.baseUrl+"/"+ID);
    }
    
    GetAllGrnItems():Observable<any>{
        return this.http.get(this.baseUrl);
    }
    
    DeleteGrnItemById(ID:any):Observable<any>{
      return this.http.delete(this.baseUrl+"/"+ID)
    }
    }
    
  
  

