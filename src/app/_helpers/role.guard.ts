import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    const currentRoles = this.authenticationService.currentRolesValue;
    console.log(route.params.id);
    if (currentUser) {
        if (currentRoles === null) {
          this.router.navigate(['/home']);
          return false;
        }
        if (currentRoles.indexOf('ROLE_SUPER_ADMIN') > -1) {
          return true;
        }
        if (currentRoles.indexOf('ROLE_ADMIN') > -1 ) {
          return true;
        } else {
          this.router.navigate(['/home']);
          return false;
        }
    } else {
      this.router.navigate(['/home'] );
      return false;
    }
  }
}
