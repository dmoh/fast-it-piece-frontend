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
  success = '';
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
      proCountry: [''],
      proAddressName: [''],
      proDateEstimated: ['', Validators.required],
      proTimeSlot: ['', Validators.required],
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
      customerCountry: [''],
      customerAddressName: [''],
      customerDateEstimated: ['', Validators.required],
      customerTimeSlot: ['', Validators.required],
      customerMail: ['', Validators.pattern('[a-zA-Z0-9\-_.]{2,}(@)+[a-zA-Z0-9\-_.]{2,}.+[a-zA-Z0-9\-_.]{2,}')],
      customerPhone: ['', Validators.required],
    });
  }

  sendEstimate(typeCustomer: string) {

    switch (typeCustomer) {
      case 'professional': {
        if ( this.proForm.value.customerDevis != "") {
          // this.saveEstimateProfessional();
          this.saveEstimate(this.proForm.value);
        }
      }
      break;
      case 'customer': {
        if ( this.customerForm.value.customerDevis != "" &&
        (this.customerForm.value.customerMail != "" || this.customerForm.value.customerPhone != ""))
        {
          //if typeCustomer == "customer" => saveEstimate(...,true)
          this.saveEstimate(this.customerForm.value, true);
        }
      }
      break;
      default : console.log(this.customerForm.value.customerDevis);
      break;
    }
  }

  private saveEstimate(formValues: any, isCustomer: boolean = false) {
    // console.info("customer form", this.customerForm);

    let estimateSave: any;
    estimateSave = {
      estimate : {
        estimateNumber: (isCustomer) ? formValues.customerDevis : formValues.proDevis,
        amount: (isCustomer) ? formValues.customerAmountDevis : formValues.proAmountDevis,
        firstName: (isCustomer) ? formValues.customerFirstName : null,
        lastName: (isCustomer) ? formValues.customerLastName : null,
        userName: (isCustomer) ? null : formValues.proName,
        addressName: (isCustomer) ? formValues.customerAddressName : formValues.proAddressName,
        street: (isCustomer) ? formValues.customerAddress : formValues.proAddress,
        city: (isCustomer) ? formValues.customerCity : formValues.proCity,
        zipCode: (isCustomer) ? formValues.customerZipCode : formValues.proZipCode,
        mail: (isCustomer) ? formValues.customerMail : formValues.proMail,
        phone: (isCustomer) ? formValues.customerPhone : formValues.proPhone,
        dateEstimated: (isCustomer) ? formValues.customerDateEstimated : formValues.proDateEstimated,
        timeSlot: (isCustomer) ? formValues.customerTimeSlot : formValues.proTimeSlot,
        distanceInfos: (isCustomer) ? null : null, // * 100
        deliveryCost: (isCustomer) ? null : null, // * 100
        business: this.authenticationService?.currentUserValue?.id,
        serviceCharge: "",
        isPayed: false,
      }
    };
    estimateSave.amount = Math.round(estimateSave * 100);
    this.estimateService.saveEstimateByBusiness(estimateSave).subscribe( orderSaved => {
    this.success = `Devis n° ${estimateSave.estimate.estimateNumber} cree`;
    this.error = '';
    // this.router.navigate(['estimate/my-estimate']);
    // this.router.navigate([`/estimate/detail-estimate/${estimateSave.estimateNumber}`]);
    }
      , error => {
        this.error = error?.toString().toLowerCase().includes("integrity constraint violation") ? "Numero de devis (déja existant/mal renseigné)" : error;
        this.success = '';
      });
  }

  handleAddressChange(event, isCustomer:boolean = false) {
    if (!!event.formatted_address) {
      console.log("event", event);

      const streetNumber = event?.address_components?.find(x => x.types.includes("street_number"));
      const street = event?.address_components?.find(x => x.types.includes("route"));

      const address = (streetNumber && street ) ? streetNumber?.short_name + " " + street?.long_name : null;

      const city = event?.address_components?.find(x => x.types.includes("locality"));
      const zipCode = event?.address_components?.find(x => x.types.includes("postal_code"));

      if (isCustomer) {
        this.customerForm.controls['customerAddress'].setValue(address ?? event?.name);
        this.customerForm.controls['customerCity'].setValue(city?.long_name ?? event?.vicinity);
        this.customerForm.controls['customerZipCode'].setValue(zipCode?.short_name ?? "");
        this.customerForm.controls['customerAddressName'].setValue(event?.name);
      } else {
        this.proForm.controls['proAddress'].setValue(address ?? event?.name);
        this.proForm.controls['proCity'].setValue(city?.long_name ?? event?.vicinity);
        this.proForm.controls['proZipCode'].setValue(zipCode?.short_name ?? "");
        this.proForm.controls['proAddressName'].setValue(event?.name);
      }
      console.log("adr_maps", event?.address_components);
      this.selectedAddress = event;
    }
  }

  // private setFormControlValue(addressFormValues: any, event: any, isCustomer:boolean) {
  //   .setValue(event?.name);
  // }

  // convenience getter for easy access to form fields
  get proCtrl() { return this.proForm.controls; }
  get customerCtrl() { return this.customerForm.controls; }

}
