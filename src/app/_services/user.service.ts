import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  headers: any;
  urlApi: string = environment.apiUrl;
  constructor(private http: HttpClient,  private authenticate: AuthenticationService) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
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

  savePhoneNumber(phone: string): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/user/phone/save`,{ phoneUser: phone}, this.headers);
  }

  getUserAddresses(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/user/address`, this.headers);
  }

  getDevisByUserInfo(numDevis: string, username: string): Observable<any> {
    // return this.http.post<any>(`${this.urlApi}/user/devis`, {devis: numDevis, info: username},this.headers);
    return new Observable<void>();
  }
}
