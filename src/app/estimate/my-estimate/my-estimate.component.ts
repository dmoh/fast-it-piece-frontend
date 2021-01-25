import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import * as fasteatconst from "src/app/_util/fasteat-constants";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { InfoModalComponent } from 'src/app/info-modal/info-modal.component';
import { BusinessEstimateService } from '../services/business-estimate.service';

@Component({
  selector: 'app-my-estimate',
  templateUrl: './my-estimate.component.html',
  styleUrls: ['./my-estimate.component.scss']
})
export class MyEstimateComponent implements OnInit {

  estimates: any[];
  // fastEatConst = fasteatconst;

  constructor(private http: HttpClient,
    private authenticate: AuthenticationService,
    private orderModal: NgbModal,
    private activatedRoute: ActivatedRoute,
     private estimateService: BusinessEstimateService,
     ) {
  }

  ngOnInit(): void {
    this.estimateService.getEstimates().subscribe( estimates => {
      // get Orders awaiting delivery
      console.log("estimates", estimates);
      this.estimates = estimates;
    });
  }

  // getLibelleStatus(status: string) {
  //   let libelleStatus = "";
  //   switch (status) {
  //     case '2':
  //       libelleStatus = "En attente de récuperation"
  //       break;
  //     case '3':
  //       libelleStatus = "En cours de livraison"
  //       break;
  //     default:
  //       libelleStatus;
  //   }
  //   return libelleStatus;
  // }
}
