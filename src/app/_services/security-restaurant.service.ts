import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
// import {Restaurant} from '@app/_models/restaurant';

@Injectable({
  providedIn: 'root'
})
export class SecurityRestaurantService {
  private restaurantSubject = new BehaviorSubject<any>({});
  restaurantCurrent: any;
  constructor(
  ) {
  }


  setRestaurant(restaurant: any) {
    this.restaurantCurrent = restaurant;
    this.restaurantSubject.next(restaurant);
    localStorage.setItem('restaurant', JSON.stringify(this.restaurantCurrent));
  }

  getRestaurant(): Observable<any> {
    return this.restaurantSubject.asObservable();
  }

}
