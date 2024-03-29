import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessEstimateService } from '../services/business-estimate.service';
import { ActivatedRoute, Router, RouterState } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Estimate } from 'src/app/_models/estimate';

@Component({
  selector: 'app-detail-estimate',
  templateUrl: './detail-estimate.component.html',
  styleUrls: ['./detail-estimate.component.scss']
})
export class DetailEstimateComponent implements OnInit {
  estimateId: string;
  estimate: any;
  isDelivering: boolean;
  marginCost: number = 0;

  constructor(private fb: FormBuilder,
    private estimateService: BusinessEstimateService,
    private router: Router,
    private pickupOrderModal: NgbModal,
    private route: ActivatedRoute) {
      this.isDelivering = null;
    }

  ngOnInit(): void {
    this.estimateId = this.route.snapshot.paramMap.get('id');
    this.estimateService.getEstimateById(this.estimateId).pipe( ).subscribe( estimateById => {
      // console.log("estimateById", estimateById);
      // let order: Estimate = new Order();
      this.estimate = estimateById.estimates.find( x => x.estimateNumber == this.estimateId );

      this.estimate.customer.addresses = (this.estimate.customer.addresses as Array<any>).filter( adr => adr.date?.date == this.estimate.date?.date )
                                          ?? (this.estimate.customer.addresses as Array<any>).filter( adr => adr.date?.date >= this.estimate.date?.date )
                                          ?? (this.estimate.customer.addresses as Array<any>).filter( adr => adr.date?.date != this.estimate.date?.date )
                                          ?? this.estimate.customer.addresses;

      this.estimate.customer.addresses = this.estimate.customer.addresses.sort((adrA, adrB) => adrB.id - adrA.id);
      console.info("this.estimate.customer.addresses", this.estimate.customer.addresses);
      this.marginCost = +this.estimate.totalAmount - this.estimate.amount - +this.estimate.delivery_cost;
      this.marginCost = this.estimate.isExpress ? this.marginCost - 10: this.marginCost;
    });
  }

  public linkToAddresses(address: string) {
    const direction = encodeURI(address);
    if /* if we're on iOS, open in Apple Maps */
    ((navigator.platform.indexOf('iPhone') !== -1) ||
      (navigator.platform.indexOf('iPod') !== -1) ||
      (navigator.platform.indexOf('iPad') !== -1)) {
      window.open('maps://maps.google.com/maps?daddr=' + direction);
    }
    else {
      window.open('https://maps.google.com/maps?daddr=' + direction);
    } /* else use Google */
  }

}
