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
      this.headers.append(`Authorization: Bearer ${this.authenticate.tokenUserCurrent}`) ;
    }
  }

  getOrdersDatas(restaurantId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/business/orders/${restaurantId}`,
      this.headers);
  }

  getOrderById(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/order/${orderId}`,
      this.headers);
  }

  getCurrentOrders(): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/deliverer/current_orders`, null,
      this.headers);
  }

  getInfosDeliverer(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/deliverer/show`,
      this.headers);
  }
  
  getDeliverer(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/deliverer/info`,
      this.headers);
  }

  getKbis(noKbis: string): Observable<any> {
    return this.http.get<any>(`https://entreprise.data.gouv.fr/api/sirene/v1/siret/` + noKbis);
  }

  getNotificationsDelivery(): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/notification/list`,
      this.headers);
  }

  getOrderAnalize(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/deliverer/${id}/analyze`,
      this.headers);
  }

  sendNotificationsRead(notifications: any[], entity): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/notification/read`, { notif: JSON.stringify(notifications), entity: entity },
      this.headers);
  }

  sendNotificationsDeliverer(): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/deliverer/notif`, this.headers);
  }

  saveOrderFinal(request: any[]){
    return this.http.post<any>(`${this.urlApi}/order/save/final`, request, this.headers);
  }

  saveOrderDeliverer(request: any[]){
    return this.http.post<any>(`${this.urlApi}/order/save_deliverer`, request, this.headers);
  }

  saveInfosDeliverer(request: any[]){
    return this.http.post<any>(`${this.urlApi}/user/save_deliverer`, request, this.headers);
  }

}
