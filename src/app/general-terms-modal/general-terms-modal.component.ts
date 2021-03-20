import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-general-terms-modal',
  templateUrl: './general-terms-modal.component.html',
  styleUrls: ['./general-terms-modal.component.scss']
})
export class GeneralTermsModalComponent implements OnInit {

  constructor(public modalActive: NgbActiveModal) { }

  ngOnInit(): void {
  }


}
