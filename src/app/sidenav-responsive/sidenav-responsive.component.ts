import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MediaQueryService } from '../_services/media-query.service';
import { SidenavService } from './sidenav.service';

@Component({
  selector: 'app-sidenav-responsive',
  templateUrl: './sidenav-responsive.component.html',
  styleUrls: ['./sidenav-responsive.component.scss']
})
export class SidenavResponsiveComponent implements AfterViewInit {
  @ViewChild('snav') public sidenav: MatSidenav;
  isMedia: boolean;

  constructor(private sidenavService: SidenavService, private mediaService: MediaQueryService) {
    this.isMedia = this.mediaService.getMobile();
  }

  ngAfterViewInit() { 
   this.sidenavService.sideNavToggleSubject.subscribe(()=> {
      return this.sidenav.toggle();
    });
  } 
  
  fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);

  fillerContent = Array.from({length: 50}, () =>
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
       labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
       laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
       voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
       cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`);
}