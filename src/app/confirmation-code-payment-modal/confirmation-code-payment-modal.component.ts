import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-confirmation-code-payment-modal',
  templateUrl: './confirmation-code-payment-modal.component.html',
  styleUrls: ['./confirmation-code-payment-modal.component.scss']
})
export class ConfirmationCodePaymentModalComponent implements OnInit {

  @Input() infos: any;
  constructor(private modal: NgbActiveModal) { }

  ngOnInit(): void {
  }


  onCheckResponseCustomer(response: string): void {
    // todo send to server with id customer
    let responseCustomerModal = true;
    if (response === 'no') {
      responseCustomerModal = false;
    }
    this.modal.close({
      infos: this.infos,
      customerResponse: responseCustomerModal,
    });
  }

}
