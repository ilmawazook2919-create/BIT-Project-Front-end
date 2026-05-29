import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl : string= 'http://localhost:8010/api/v1/category';

  constructor(private http:HttpClient) { }
   createCategory(category:any,type:any):Observable<any>{
        if(type=='Add'){
          return this.http.post(this.baseUrl,category);
        }else{
          return this.http.put(this.baseUrl+"/"+category.id,category);
      }
          
    }
    
    GetCategoryById(ID:any):Observable<any>{
      return this.http.get(this.baseUrl+"/"+ID);
    }
    
    GetAllCategories():Observable<any>{
        return this.http.get(this.baseUrl);
    }
    
    DeleteCategoryById(ID:any):Observable<any>{
      return this.http.delete(this.baseUrl+"/"+ID)
    }
    }
    
  
  

