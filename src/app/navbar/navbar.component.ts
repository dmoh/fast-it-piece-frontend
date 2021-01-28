import { Component, OnDestroy, OnInit, EventEmitter, Output, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SidenavService } from '../sidenav-responsive/sidenav.service';
import { User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';
import { MediaQueryService } from '../_services/media-query.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user: any;;
  isMedia: boolean;

  isAdmin: boolean;
  isDeliverer: boolean;
  isSuper: boolean;
  showMenu: boolean;
  modeSide: string;
  constructor(
    private mediaQueryService: MediaQueryService,
    private authentication: AuthenticationService,
    private sidenavService: SidenavService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.modeSide = 'side';
    this.authentication.currentUser.subscribe((res) => {
      this.user = !res ? new User() : res;
    });
    this.authentication.currentRoles
      .subscribe((res) => {
        if (res !== null) {
          if (res.indexOf('ROLE_ADMIN') > -1) {
            this.isAdmin = true;
          }
          if (res.indexOf('ROLE_SUPER_ADMIN') > -1) {
            this.isSuper = true;
          }
          if (res.indexOf('ROLE_DELIVERER') > -1) {
            this.isDeliverer = true;
          }
        }
      });

    this.router.events.subscribe((res) => {
      const url =  /(estimate|admin|delivery|customer)/i;
      // @ts-ignore
      if (typeof res.url !== 'undefined') {
        // @ts-ignore
        if (res.url.match(url)) {
          this.showMenu = true;
          this.isMedia = this.mediaQueryService.getMobile();
        } else {
          this.showMenu = false;
          this.isMedia = false;
        }
      }
    });
  }


  onToggleSideNav() {
    // lesten subscribe into sideNavToggleSubject
    this.sidenavService.toggle();
  }



  onLogout(){
    this.authentication.logout();
  }

  @HostListener('window:resize', [])
  onResize() {
    if (this.showMenu === true) {
      this.isMedia = this.mediaQueryService.getMobile();
      this.modeSide = 'over';
    }
    if (!this.isMedia){
      this.modeSide = 'side';
      this.sidenavService.close();
    }
  }
}
