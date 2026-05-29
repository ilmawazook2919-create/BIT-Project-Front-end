import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  
 private baseUrl : string= 'http://localhost:8010/api/v1/supplier';

  constructor(private http:HttpClient) { }

   createSupplier(supplier:any,type:any):Observable<any>{
        if(type=='Add'){
          return this.http.post(this.baseUrl,supplier);
        }else{
          return this.http.put(this.baseUrl+"/"+supplier.id,supplier);
      }
          
    }
    
    GetSupplierById(ID:any):Observable<any>{
      return this.http.get(this.baseUrl+"/"+ID);
    }
    
    GetAllSuppliers():Observable<any>{
        return this.http.get(this.baseUrl);
    }
    
    DeleteSupplierById(ID:any):Observable<any>{
      return this.http.delete(this.baseUrl+"/"+ID)
    }
    }
    
  
  

