import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BinService {
  private baseUrl : string= 'http://localhost:8010/api/v1/bin';

  constructor(private http:HttpClient) { }
   createBin(bin:any,type:any):Observable<any>{
        if(type=='Add'){
          return this.http.post(this.baseUrl,bin);
        }else{
          return this.http.put(this.baseUrl+"/"+bin.id,bin);
      }
          
    }
    
    GetBinById(ID:any):Observable<any>{
      return this.http.get(this.baseUrl+"/"+ID);
    }
    
    GetAllBins():Observable<any>{
        return this.http.get(this.baseUrl);
    }
    
    DeleteBinById(ID:any):Observable<any>{
      return this.http.delete(this.baseUrl+"/"+ID)
    }
    }
    
  
  

