import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import { of } from 'rxjs';

import {environment} from "../../environments/environment";
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class EstimateService {
  headers: any;
  urlApi: string = environment.apiUrl;
  constructor(private http: HttpClient,  private authenticate: AuthenticationService) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
    if (this.authenticate.tokenUserCurrent) {
      // console.info(this.authenticate.tokenUserCurrent);
      this.headers.append(`Authorization: Bearer ${this.authenticate.tokenUserCurrent}`) ;
    }
  }

  registerUser(userNew: string): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/add/user`,{user: userNew}, this.headers);
  }

  passwordForgot(userNew: string): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/user/password`,{ user: userNew}, this.headers);
  }

  getEstimateByBusiness(numDevis: string, username: string): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/estimate/business/`, {devis: numDevis, info: username},this.headers);
  }

  saveEstimateByBusiness(request: any[]){
    return this.http.post<any>(`${this.urlApi}/estimate/save`, request, this.headers);
  }

  getCostDelivery(dataDistance: any): Observable<any> {
    return this.http.post<any>(`${ this.urlApi}/delivery/cost`,
      JSON.stringify(dataDistance), this.headers);
  }

  getMarginService(request: any): Observable<any> {
    return this.http.post<any>(`${ this.urlApi }/const/marginservice`, request, this.headers);
  }

  getUserAdress(): Observable<any> {
    return this.http.get<any>(`${ this.urlApi }/user/address`);
  }

}
