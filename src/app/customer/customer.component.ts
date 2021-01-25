import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  public devis: string;
  public email: string;
  public phone: string;

  constructor(route: ActivatedRoute, ) {
    console.info(route.queryParams);
    
    route.queryParams.subscribe(function (params) {
      console.log(params.devis, params.mail, params.phone);
      this.devis = params.devis;
      this.email = params.mail;
      this.phone = params.phone;
    });
    // const url: Observable<string> = route.url.pipe(map(segments => segments.join('')));
  }

  ngOnInit(): void {
    // console.info(this.route);
  }

}
