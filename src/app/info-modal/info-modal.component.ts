import {Component, Input, OnInit, Optional} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss']
})
export class InfoModalComponent implements OnInit {
  @Input() title: string;
  @Input() message: string;
  @Optional() isCartError: boolean;
  constructor(
    public modalActive: NgbActiveModal,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onValidate() {
    if (typeof this.isCartError !== 'undefined' && this.isCartError === true) {
      this.router.navigate(['cart-detail']);
      this.modalActive.close();
    } else {
      this.modalActive.close();
    }
  }

}
