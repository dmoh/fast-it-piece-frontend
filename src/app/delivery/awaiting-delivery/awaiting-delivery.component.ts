import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveryService } from '../services/delivery.service';
// import * as fasteatconst from "src/app/_util/fasteat-constants";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Test } from 'tslint';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Deliverer } from 'src/app/_models/deliverer';
import { InfoModalComponent } from 'src/app/info-modal/info-modal.component';
import { Order } from 'src/app/_models/order';

@Component({
  selector: 'app-awaiting-delivery',
  templateUrl: './awaiting-delivery.component.html',
  styleUrls: ['./awaiting-delivery.component.scss']
})
export class AwaitingDeliveryComponent implements OnInit {

  uploadResponse = { status: '', message: '', filePath: '' };
  schedulePrepartionTimes: any[] = [];
  deliverer: Deliverer;
  orders: any[];
  order: Order;
  orderId: string;
  error: string;
  headers: any;
  
  status = {
    WAITING_RESPONSE_BUSINESS: 1,
    WAITING_TAKING_BY_DELIVER: 2,
    ORDER_ROUTING: 3,
    ORDER_CLOSED_WITH_SUCCESS: 4,
    ORDER_REFUSED: 0,
};

  userNameNoLimit = "fasteat74@gmail.com"; 
  nbDeliveryMax = 2;

  constructor(private http: HttpClient,
     private authenticate: AuthenticationService,
     private deliveryService: DeliveryService,
     private orderModal: NgbModal,
     private activatedRoute: ActivatedRoute,
     private router: Router) {

  }

  ngOnInit(): void {

    this.deliverer = new Deliverer();
    this.deliverer.orders = new Array();

    this.deliveryService.getCurrentOrders().subscribe((delivererCurrent) => {
      if (this.activatedRoute.snapshot.paramMap.get('id') != null ) {
        // console.log("Orders count", delivererCurrent?.orders?.find(order => order?.date_taken_deliverer != null) );
        // TODO: 10.01.2021 Ajouter 2 constantes ( Mail livreur admin && Nb de courses possible )
        // delivererCurrent?.orders?.find(order => order?.date_taken_deliverer != null).length < 3;
        // const canAffectDeliverer = delivererCurrent?.email === this.userNameNoLimit || 
        // delivererCurrent?.orders?.length < this.nbDeliveryMax;
        
        const canAffectDeliverer = true;

        this.orderId = this.activatedRoute.snapshot.paramMap.get('id');
        if (canAffectDeliverer) {
          // add method affecter livreur
          this.doAffectDeliverer(+this.orderId);
        } else {
          this.showModalInfo('Information', `${this.nbDeliveryMax} Livraisons maximum !`);
        }
      } else {
        // get Orders awaiting delivery
          // console.log("delivererCurrentOrder", delivererCurrent);
          this.deliverer = delivererCurrent;
          this.orders = (this.deliverer.orders != null) ? this.deliverer.orders : new Array();
        }
    });
  }


  private showModalInfo(title: string, message: string) {
    const modalRef = this.orderModal.open(InfoModalComponent, {
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.result.then((close) => {
      this.router.navigate(['/delivery/awaiting-delivery']);
    });
  }

  // Affecter un livreur  à une commande
  private doAffectDeliverer(orderId: number) {
    this.deliveryService.getOrderById(orderId).subscribe( currentOrder => {
      this.order = currentOrder;
      // console.log("currentOrder", currentOrder);
        this.deliveryService.getDeliverer().subscribe( (deliverer) => {
          // console.log("deliverer", deliverer);

          if ( currentOrder.deliverer == null && deliverer.id ) {
            let dateTakenDeliverer = Date.now();
            this.saveOrderDeliverer(currentOrder.id, deliverer.id , dateTakenDeliverer, 3);
            // this.router.navigate(['/delivery/awaiting-delivery']);
          }
          else {
            let delivererEmail = '.';
            if (typeof this.deliverer !== 'undefined' && typeof this.deliverer.email !== 'undefined') {
              delivererEmail = ' par ' + this.deliverer.email;
            }
            delivererEmail = 'Cette livraison a été récupérée' + delivererEmail;
            this.showModalInfo('Information', delivererEmail);
          }
        });
    });
  }


  private saveOrderDeliverer(orderId, delivererId, dateDelivery, status) {
    let dateTakenDeliverer = dateDelivery;

    let dateDelivered = '@' + Math.round(dateDelivery/1000) ;

    let orderSave: any;
    orderSave = {
      order : {
        order_id: orderId,
        deliverer_id: delivererId,
        date_taken_deliverer: null,
        // status: 3,
      }
    };
    this.deliveryService.saveOrderDeliverer(orderSave).subscribe( orderSaved => {
      this.router.navigate([`/delivery/detail-delivery/${orderId}`]);
    });
  }

  getLibelleStatus(status: string) {
    let libelleStatus = "";
    switch (status) {
      case '2':
        libelleStatus = "En attente de récuperation"
        break;
      case '3':
        libelleStatus = "En cours de livraison"
        break;
      default:
        libelleStatus;
    }
    return libelleStatus;
  }

  getLibelleTimeSlot(status: string) {
    let libelleStatus = "Matin";
    switch (status) {
      case 'AM':
        libelleStatus = "Matin"
        break;
      case 'PM':
        libelleStatus = "Apres-Midi"
        break;
      default:
        libelleStatus;
    }
    return libelleStatus;
  }
}
