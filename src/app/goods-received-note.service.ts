import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoodsReceivedNoteService {
private baseUrl : string= 'http://localhost:8010/api/v1/goodsReceivedNote';

  constructor(private http:HttpClient) { }

   createGoodsReceivedNotee(goodsReceivedNote:any,type:any):Observable<any>{
        if(type=='Add'){
          return this.http.post(this.baseUrl,goodsReceivedNote);
        }else{
          return this.http.put(this.baseUrl+"/"+goodsReceivedNote.id,goodsReceivedNote);
      }
          
    }
    
    GetGoodsReceivedNoteById(ID:any):Observable<any>{
      return this.http.get(this.baseUrl+"/"+ID);
    }
    
    GetAllGoodsReceivedNotes():Observable<any>{
        return this.http.get(this.baseUrl);
    }
    
    DeleteGoodsReceivedNoteById(ID:any):Observable<any>{
      return this.http.delete(this.baseUrl+"/"+ID)
    }
    }
    
  
  

