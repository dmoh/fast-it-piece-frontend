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
    console.log(this.headers);
    console.log("auth",this.authenticate);
    if (this.authenticate.tokenUserCurrent) {
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
    // return this.http.post<any>(`${this.urlApi}/user/devis`, {devis: numDevis, info: username},this.headers);
    return of("success");
  }

  saveEstimateByBusiness(numDevis: string, username: string): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/estimate/save`, {devis: numDevis, info: username},this.headers);
    return of("success");
  }

  saveEstimate(request: any[]){
    return this.http.post<any>(`${this.urlApi}/estimate/save`, request, this.headers);
  }

}
