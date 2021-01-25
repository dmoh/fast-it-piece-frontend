import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { first } from 'rxjs/operators';
import { EstimateService } from 'src/app/_services/estimate.service';

@Component({
  selector: 'app-home-features',
  templateUrl: './home-features.component.html',
  styleUrls: ['./home-features.component.scss']
})
export class HomeFeaturesComponent implements OnInit {
  proForm: FormGroup;
  customerForm: FormGroup;
  loading = false;
  submitted = false;
  hide = true;
  returnUrl: string;
  error = '';
  showPassword: boolean;
  showPass: boolean;
  showConfirmPassword: boolean;
  showRegisterPassword: boolean;
  
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private estimateService: EstimateService,
              private authenticationService: AuthenticationService,
              ) { }

  ngOnInit(): void {
    this.proForm = this.formBuilder.group({
      proDevis: ['', Validators.required],
      proAmountDevis: ['', Validators.required],
      proAddress: ['', Validators.required],
      proCity: ['', Validators.required],
      proZipCode: ['', Validators.required],
      proMail: ['', Validators.pattern('[a-zA-Z0-9\-_.]{2,}(@)+[a-zA-Z0-9\-_.]{2,}.+[a-zA-Z0-9\-_.]{2,}')],
      proPhone: [''],
    });

    this.customerForm = this.formBuilder.group({
      customerDevis: ['', Validators.required],
      customerAmountDevis: ['', Validators.required],
      customerAddress: ['', Validators.required],
      customerCity: ['', Validators.required],
      customerZipCode: ['', Validators.required],
      customerMail: ['', Validators.pattern('[a-zA-Z0-9\-_.]{2,}(@)+[a-zA-Z0-9\-_.]{2,}.+[a-zA-Z0-9\-_.]{2,}')],
      customerPhone: ['', Validators.required],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  sendEstimate(typeCustomer: string) {
    switch (typeCustomer) {
      case 'professional': {
        this.saveEstimateCustomer();
        // this.router.navigate(['/professional']);
      }
      break;
      case 'customer': {
        if ( this.customerForm.value.customerDevis != "" && 
          (this.customerForm.value.customerMail != "" || this.customerForm.value.customerPhone != "")) 
        {
          this.saveEstimateProfessional();
          // this.router.navigate(['/customer']);
        } 
      }
      break;
      default : alert(this.customerForm.value.customerDevis);
      break;
    }
  }

  private saveEstimateCustomer() {
    console.log(this.authenticationService);
    let estimateSave: any;
    estimateSave = {
      estimate : {
        estimateNumber: this.proForm.value.proDevis,
        amount: this.proForm.value.proAmountDevis,
        street: this.proForm.value.proAddress,
        city: this.proForm.value.proCity,
        ZipCode: this.proForm.value.proZipCode,
        mail: this.proForm.value.proMail,
        phone: this.proForm.value.proPhone,
        distanceInfos: null,
        business: this.authenticationService?.currentUserValue?.id,
        serviceCharge: "",
        isPayed: false,
        // status: 3,
      }
    };
    this.estimateService.saveEstimate(estimateSave).subscribe( orderSaved => {
      // this.router.navigate([`/estimate/${estimateSave.estimateNumber}`]);
    });
  }

  private saveEstimateProfessional() {
    let estimateSave: any;
    estimateSave = {
      estimate : {
        estimateNumber: this.proForm.value.proDevis,
        amount: this.proForm.value.proAmountDevis,
        street: this.proForm.value.proAddress,
        city: this.proForm.value.proCity,
        ZipCode: this.proForm.value.proZipCode,
        mail: this.proForm.value.proMail,
        phone: this.proForm.value.proPhone,
        distanceInfos: null,
        business: null,
        serviceCharge: "",
        isPayed: false,
      }
    };

    this.estimateService.saveEstimate(estimateSave).subscribe( orderSaved => {
      // this.router.navigate([`/estimate/${estimateSave.estimateNumber}`]);
    }, error => {
      console.error(error);
    }
    );
  }

  toggle() {
    this.showPass = !this.showPass;
  }

  // convenience getter for easy access to form fields
  get proCtrl() { return this.proForm.controls; }
  get customerCtrl() { return this.customerForm.controls; }

}
