import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Injectable({
  providedIn: 'root'
})

export class BusinessEstimateService {
  headers: any;
  urlApi: string = environment.apiUrl;

  constructor(private http: HttpClient, private authenticate: AuthenticationService, private router: Router) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
    if (localStorage.getItem('cart_fast_eat')) {
    }
    if (this.authenticate.tokenUserCurrent == null) {
      // this.router.navigate(['/login']);
    } 
    if (this.authenticate.tokenUserCurrent) {
      // this.headers.append(`Authorization: Bearer ${this.authenticate.tokenUserCurrent}`) ;
    }
  }

  getOrderById(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/order/${orderId}`,
      this.headers);
  }
  
  getCurrentOrders(): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/deliverer/current_orders`, null,
      this.headers);
  }
  
  getDeliverer(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/deliverer/info`,
      this.headers);
  }

  getKbis(noKbis: string): Observable<any> {
    return this.http.get<any>(`https://entreprise.data.gouv.fr/api/sirene/v1/siret/` + noKbis);
  }

  saveOrderFinal(request: any[]){
    return this.http.post<any>(`${this.urlApi}/order/save/final`, request, this.headers);
  }

  saveOrderDeliverer(request: any[]){
    return this.http.post<any>(`${this.urlApi}/order/save_deliverer`, request, this.headers);
  }

  getEstimateByUserInfo(numDevis: string, info: any): Observable<any> {
    const request: any = { info };
    return this.http.post<any>(`${this.urlApi}/estimate/${numDevis}`, request, this.headers);
  }

  getEstimateById(numDevis: string): Observable<any> {
    // return this.http.get<any>(`${this.urlApi}/estimate/${numDevis}`);
    return this.http.get<any>(`${this.urlApi}/estimate/all`);
  }

  getEstimates(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/estimate/all`);
  }

}
