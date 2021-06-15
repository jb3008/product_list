import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { HttpClient, HttpHeaders } from '@angular/common/http';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';
import { APIEndpoint } from '../config/base-url';


@Injectable()
export class ProductService {
  
    private BASE_URL: string;
    _headers:any;
     _headers1:any;
    constructor(
        private http: HttpClient, 
        private _router: Router,
      
    ) {
    
        this.BASE_URL = APIEndpoint.BaseUrl;

        this._headers = new HttpHeaders({
           'authentication_token':'product-demo'
             // 'enctype':'multipart/form-data',
             // 'Content-Type':'multipart/form-data'
        })

         this._headers1 = new HttpHeaders({
           'authentication_token':'product-demo',
             'enctype':'multipart/form-data'
            
        })
    }   

    getProduct(param):Observable<any> {
        const url = this.BASE_URL + 'api/GetAllProductWithDynamicPaging';
        return this.http.post(url,param ,{ headers:this._headers })
             .map(res => {
               return res;
            })
            .catch((e:any)=>{
                return Observable.throw(e);
            });
    }

   
    
}
