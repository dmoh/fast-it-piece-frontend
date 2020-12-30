import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
// import {CartService} from "@app/cart/service/cart.service";
import jwt_decode from "jwt-decode";
import { User } from '../_models/user';



@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  private currentRolesSubject: BehaviorSubject<string[]>;
  public currentUser: Observable<User>;
  public currentRoles: Observable<string[]>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentRolesSubject = new BehaviorSubject<string[]>(JSON.parse(localStorage.getItem('roles')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.currentRoles = this.currentRolesSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }


  public get currentRolesValue(): string[] {
    return this.currentRolesSubject.value;
  }
  public get tokenUserCurrent(): string {
    return; // this.currentUserSubject.value.token;
  }
  login(email: string, password: string) {
    const optionRequete = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any>(`${environment.apiUrl}/authentication_token`, { email, password }, optionRequete)
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        const jwtDecode = jwt_decode(user.token);
        // @ts-ignore
        if (jwtDecode.roles) {
          // @ts-ignore
          const roles = jwtDecode.roles;
          if (
            roles.indexOf('ROLE_ADMIN') !== -1
            || roles.indexOf('ROLE_SUPER_ADMIN') !== -1
            || roles.indexOf('ROLE_DELIVERER') !== -1
            || roles.indexOf('ROLE_MANAGER') !== -1
          ) {
            // add icon and restaurant
            localStorage.setItem('roles', JSON.stringify(roles));
            this.currentRolesSubject.next(roles);
          }
          return user;
        }
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('roles');
    this.currentUserSubject.next(null);
    this.currentRolesSubject.next(null);
    this.router.navigate(['home']);
  }

  public checkIsAdmin() {
    const optionRequete = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return this.http.post<any>(`${environment.apiUrl}/is-admin`, {tokenUser: user.token },
      optionRequete
      );
  }
}
