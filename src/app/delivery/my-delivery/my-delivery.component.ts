import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { DeliveryService } from '../services/delivery.service';
import { ThrowStmt } from '@angular/compiler';
import { Deliverer } from 'src/app/_models/deliverer';
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-my-delivery',
  templateUrl: './my-delivery.component.html',
  styleUrls: ['./my-delivery.component.scss']
})

export class MyDeliveryComponent implements OnInit, AfterViewInit {
  uploadResponse = { status: '', message: '', filePath: '' };
  schedulePrepartionTimes: any[] = [];
  deliverer: Deliverer;
  error: string;
  headers: any;

  constructor(private http: HttpClient, private authenticate: AuthenticationService, private deliveryService: DeliveryService, private router: Router) {
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

  ngOnInit(): void {
    this.deliverer = new Deliverer();
    this.deliveryService.getInfosDeliverer().subscribe((delivererInfo) => {
      this.deliverer = delivererInfo;
      console.warn("livraisons effectues", this.deliverer);
      if (this.deliverer) {
        if (this.deliverer.orders) {
          // ajouter param dans le back end pour filtrer les commandes livré
          this.deliverer.orders = this.deliverer.orders.filter( order => order.date_delivered != null );
          this.deliverer.orders = this.deliverer.orders.sort( function(a, b) {
            return b.id - a.id;
          }) ;
        }
      }
    });
  }

  ngAfterViewInit() {

  }



}
