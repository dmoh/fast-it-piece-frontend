import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeliveryService } from '../services/delivery.service';
import { ActivatedRoute, Router, RouterState } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Order } from 'src/app/_models/order';
import { PickupOrderModalComponent } from 'src/app/pickup-order-modal/pickup-order-modal.component';

@Component({
  selector: 'app-detail-delivery',
  templateUrl: './detail-delivery.component.html',
  styleUrls: ['./detail-delivery.component.scss']
})
export class DetailDeliveryComponent implements OnInit {

  hasDeliveryCode: boolean = true;
  delivererForm: FormGroup;
  isValid: boolean;
  orderId: string;
  order: any;
  isDelivering: boolean;

  constructor(private fb: FormBuilder,
    private deliveryService: DeliveryService,
    private router: Router,
    private pickupOrderModal: NgbModal,
    private route: ActivatedRoute) {
      this.isDelivering = null;
    }

  ngOnInit(): void {
    this.isValid = true;
    this.orderId = this.route.snapshot.paramMap.get('id');

    this.deliveryService.getDeliverer().subscribe( deliverer => {
      console.log("deliverer", deliverer);
      this.deliveryService.getOrderById(+this.orderId).subscribe( orderById => {
        console.log("order", orderById);

        console.log(orderById.deliverer?.id);
        console.log(deliverer.id);
        if (orderById.deliverer?.id !== deliverer.id) {
          this.router.navigate(['/delivery/awaiting-delivery']);
        }
        let order: Order = new Order();
        this.order = orderById;
        this.isDelivering = this.order.status >= 3 && this.order.date_delivered == null ;

        this.hasDeliveryCode = this.order.deliverCode != null;
        
        this.delivererForm = this.fb.group({
          code: ["", Validators.required],
          notCode: false
        });
      });  
    });  
  }

  onValidateDelivery(): void {
    if (this.isDelivering) {
      if (this.hasDeliveryCode && !this.delivererForm.value.notCode) {
        this.isValid = this.delivererForm.value.code === this.order.deliverCode;
      }
  
      if (this.delivererForm.value.notCode || this.isValid) {
        this.finalizeDelivery();
      }
      else {
        return;
      }
    }
  }

  onValidateWithoutCode() {
    this.delivererForm.value.notCode = true;
  }

  onTakenDelivery() {
    if (this.order && !this.isDelivering){

      const modalRef = this.pickupOrderModal.open(PickupOrderModalComponent, {
        backdrop: 'static',
        keyboard: true,
        size: 'lg',
      });

      modalRef.componentInstance.order = this.order;
      modalRef.result.then((result) => {
        if (result.response) {
          console.log(result);
          this.saveOrderDeliverer(this.order.id, this.order.deliverer.id, Date.now(), true);
        }
      });
    }
  }

  private finalizeDelivery() {
    let order: any;
    let dateDelivered = '@' + Math.round(Date.now()/1000) ;

    order = {
      order : {
        order_id: this.orderId,
        date_delivered: dateDelivered,
        status: 4,
      }
    };
    this.deliveryService.saveOrderFinal(order).subscribe( res => {
      this.router.navigate(['/delivery/awaiting-delivery']);
    });
  }

  private saveOrderDeliverer(orderId, delivererId, dateDelivery, refresh) {
    let dateTakenDeliverer = dateDelivery;

    let dateDelivered = '@' + Math.round(dateDelivery/1000) ;

    let orderSave: any;
    orderSave = {
      order : {
        order_id: orderId,
        deliverer_id: delivererId,
        date_taken_deliverer: dateTakenDeliverer,
        status: 3,
      }
    };
    console.log(orderSave);
    this.deliveryService.saveOrderDeliverer(orderSave).subscribe(
      next => {
        if (refresh) {
          console.warn("success", next);
          window.location.reload();
        }
      },
      error => {
        console.error("error", error);
      }
    );
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
