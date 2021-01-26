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
  error = '';
  showPassword: boolean;
  showPass: boolean;
  showConfirmPassword: boolean;
  showRegisterPassword: boolean;
  selectedAddress: any;
  options: {} = {};

  
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private estimateService: EstimateService,
              private authenticationService: AuthenticationService,
              ) { }
              
  ngOnInit(): void {
      
    this.options = {
          types: [],
          componentRestrictions: { country: 'FR' }
    };
    this.proForm = this.formBuilder.group({
      proDevis: ['', Validators.required],
      proName: ['', Validators.required],
      proAmountDevis: ['', Validators.required],
      proAddress: ['', Validators.required],
      proCity: ['', Validators.required],
      proZipCode: ['', Validators.required],
      proMail: ['', Validators.pattern('[a-zA-Z0-9\-_.]{2,}(@)+[a-zA-Z0-9\-_.]{2,}.+[a-zA-Z0-9\-_.]{2,}')],
      proPhone: [''],
    });

    this.customerForm = this.formBuilder.group({
      customerDevis: ['', Validators.required],
      customerLastName: ['', Validators.required],
      customerFirstName: ['', Validators.required],
      customerAmountDevis: ['', Validators.required],
      customerAddress: ['', Validators.required],
      customerCity: ['', Validators.required],
      customerZipCode: ['', Validators.required],
      customerMail: ['', Validators.pattern('[a-zA-Z0-9\-_.]{2,}(@)+[a-zA-Z0-9\-_.]{2,}.+[a-zA-Z0-9\-_.]{2,}')],
      customerPhone: ['', Validators.required],
    });
  }

  sendEstimate(typeCustomer: string) {

    switch (typeCustomer) {
      case 'professional': {
        if ( this.proForm.value.customerDevis != "") this.saveEstimateProfessional();
      }
      break;
      case 'customer': {
        if ( this.customerForm.value.customerDevis != "" && 
        (this.customerForm.value.customerMail != "" || this.customerForm.value.customerPhone != "")) 
        {
          this.saveEstimateCustomer();
        } 
      }
      break;
      default : console.log(this.customerForm.value.customerDevis);
      break;
    }
  }

  private saveEstimateCustomer() {
    // console.info("customer form", this.customerForm);

    let estimateSave: any;
    estimateSave = {
      estimate : {
        estimateNumber: this.customerForm.value.customerDevis,
        amount: this.customerForm.value.customerAmountDevis,
        firstName: this.customerForm.value.customerFirstName,
        lastName: this.customerForm.value.customerLastName,
        street: this.customerForm.value.customerAddress,
        city: this.customerForm.value.customerCity,
        zipCode: this.customerForm.value.customerZipCode,
        mail: this.customerForm.value.customerMail,
        phone: this.customerForm.value.customerPhone,
        distanceInfos: null,
        business: this.authenticationService?.currentUserValue?.id,
        serviceCharge: "",
        isPayed: false,
      }
    };
    // console.log("STOP", estimateSave);
    this.estimateService.saveEstimateByBusiness(estimateSave).subscribe( orderSaved => {
      this.router.navigate(['estimate/my-estimate']);
      // this.router.navigate([`/estimate/detail-estimate/${estimateSave.estimateNumber}`]);
    });
  }

  private saveEstimateProfessional() {
    let estimateSave: any;
    estimateSave = {
      estimate : {
        estimateNumber: this.proForm.value.proDevis,
        userName: this.proForm.value.proName,
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

    this.estimateService.saveEstimateByBusiness(estimateSave).subscribe( orderSaved => {
      this.router.navigate(['estimate/my-estimate']);
      // this.router.navigate([`/estimate/${estimateSave.estimateNumber}`]);
    }, error => {
      console.error(error);
    }
    );
  }

  toggle() {
    this.showPass = !this.showPass;
  }

  handleAddressChange(event) {
    if (!!event.formatted_address) {
      this.selectedAddress = event;
    }
  }

  // convenience getter for easy access to form fields
  get proCtrl() { return this.proForm.controls; }
  get customerCtrl() { return this.customerForm.controls; }

}
