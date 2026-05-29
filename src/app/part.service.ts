import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartService {
  
  private baseUrl : string= 'http://localhost:8010/api/v1/part'; 

  constructor( private http:HttpClient ) { }

  createPart(part:any,type:any):Observable<any>{
      if(type=='Add'){
        return this.http.post(this.baseUrl,part);
      }else{
        return this.http.put(this.baseUrl+"/"+part.id,part);
    }
        
  }
  
  GetPartById(ID:any):Observable<any>{
    return this.http.get(this.baseUrl+"/"+ID);
  }
  
  GetAllParts():Observable<any>{
      return this.http.get(this.baseUrl);
  }
  
  DeletePartById(ID:any):Observable<any>{
    return this.http.delete(this.baseUrl+"/"+ID)
  }
  }
  

