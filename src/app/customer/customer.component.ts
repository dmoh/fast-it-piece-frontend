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
  public devis: Observable<string>;
  public email: Observable<string>;
  public phone: Observable<string>;
  constructor(route: ActivatedRoute) {
    this.devis = route.params.pipe(map(p => p.devis));
    this.email = route.params.pipe(map(p => p.mail));
    this.phone = route.params.pipe(map(p => p.phone));
    // const url: Observable<string> = route.url.pipe(map(segments => segments.join('')));
  }

  ngOnInit(): void {
    console.info(this.devis, this.email ,this.phone);
  }

}
