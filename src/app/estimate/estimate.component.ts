import { AfterViewInit, Component, EventEmitter, HostListener, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { BusinessEstimateService } from './services/business-estimate.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthenticationService } from '../_services/authentication.service';
import { MediaQueryService } from '../_services/media-query.service';
import { SidenavService } from '../sidenav-responsive/sidenav.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-estimate',
  templateUrl: './estimate.component.html',
  styleUrls: ['./estimate.component.scss']
})
export class EstimateComponent implements OnInit, AfterViewInit {

  orders: any;
  deliverer: User;
  authorizedRoles: string[] = ["ROLE_SUPER_ADMIN","ROLE_DELIVERER"];
  isMedia: boolean;

  @ViewChild('sidebarLeft')
  public sidenav: MatSidenav;
  @Output() sidenavChange = new EventEmitter<MatSidenav>();

  constructor(private estimateService: BusinessEstimateService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authenticate: AuthenticationService,
    private mediaQueryService: MediaQueryService,
    private sidenavService: SidenavService,
    private bottomSheet: MatBottomSheet) {
      // this.rolesBloqued();
    }

  // @Output() sidenavChange = new EventEmitter<MatSidenav>();

  ngOnInit(): void {
    // recuperer la geoloc
    if (navigator.geolocation) {
      // L'API est disponible
    } else {
      // Pas de support, proposer une alternative ?
    }
    this.isMedia = this.mediaQueryService.getMobile();
  }



  rolesBloqued() {
    let currentUser: any = jwtDecode(this.authenticate.currentUserValue.token);

    if (typeof currentUser != undefined && currentUser.roles && currentUser.roles.length > 0) {
      let isAuthorized: boolean = false;
      this.authorizedRoles.forEach( role => {
        isAuthorized = currentUser.roles.includes(role.trim()) || isAuthorized;
      });

      if (!isAuthorized) {
        console.log("Vous n'avez pas acces à cette page vous n'êtes pas un livreur.");
        this.router.navigate(['home']);
      }
    } else {
      this.router.navigate(['home']);
    }
  }

  ngAfterViewInit() {
    this.sidenavService.sideNavToggleSubject.subscribe(() => {
       return this.sidenav.toggle();
     });
    if (this.isMedia) {
      this.sidenav.close();
    }
  }


  @HostListener('window:resize', [])
  onResize() {
    this.isMedia = this.mediaQueryService.getMobile();
    if (!this.isMedia) {
      this.sidenav.open();
    }
  }
}
