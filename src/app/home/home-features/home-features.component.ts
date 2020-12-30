import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home-features',
  templateUrl: './home-features.component.html',
  styleUrls: ['./home-features.component.scss']
})
export class HomeFeaturesComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }


  goTo(restaurant: string) {
    switch (restaurant) {
      case 'pizza-bella':
        this.router.navigate(['/restaurant/21']);
        break;
      case 'pizza-delices':
        this.router.navigate(['/restaurant/24']);
        break;
      case 'mister-food':
        this.router.navigate(['/restaurant/22']);
        break;
      case 'pizza-des-lacs':
        this.router.navigate(['/restaurant/23']);
        break;
      case 'o-gout-braise':
        this.router.navigate(['/restaurant/30']);
        break;
      case 'marnaz-pizza':
        this.router.navigate(['/restaurant/31']);
        break;
      case 'le-soixante-14':
        this.router.navigate(['/restaurant/34']);
        break;
      case 'on-nem':
        this.router.navigate(['/restaurant/32']);
        break;
      case 'wactoob':
        this.router.navigate(['/restaurant/29']);
        break;
      case 'pizzeria-de-la-gare':
        this.router.navigate(['/restaurant/33']);
        break;
    }
  }


}
