import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pickup-order-modal',
  templateUrl: './pickup-order-modal.component.html',
  styleUrls: ['./pickup-order-modal.component.scss']
})
export class PickupOrderModalComponent implements OnInit {

  public confirmationMessage = "Souhaitez vous récuperer la commande ? ";

  constructor(private modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  onResponseDeliverer(response: boolean): void {
    this.modal.close({
      response,
    });
  }

}
