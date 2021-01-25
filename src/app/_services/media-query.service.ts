import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})

export class MediaQueryService {

  private mobile: boolean;

  constructor() {
  }

  getMobile(): boolean {
    // console.log(window.screen);
    // console.log(window.innerWidth);
    // console.log(window);
    return this.mobile;
  }

  setMobile(isMobile: boolean){
    this.mobile = isMobile;
    return this;
  }

}
