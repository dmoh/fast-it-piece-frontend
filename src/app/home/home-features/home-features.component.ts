import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { first, map } from 'rxjs/operators';
import { EstimateService } from 'src/app/_services/estimate.service';
import { User } from 'src/app/_models/user';
import { AddressMatrix } from 'src/app/_models/address-matrix';
import { SimpleChanges } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { Address } from 'cluster';

@Component({
  selector: 'app-home-features',
  templateUrl: './home-features.component.html',
  styleUrls: ['./home-features.component.scss']
})
export class HomeFeaturesComponent implements OnInit {
  customerForm: FormGroup;
  proForm: FormGroup;
  submitted = false;
  loading = false;
  hide = true;
  error = '';
  success = '';
  options: {} = {};

  selectedAddress: any;

  distanceInfoCustomer: any = null;
  distanceInfoPro: any = null;

  amountCustomer: number = 0;
  amountPro: number = 0;
  
  totalAmountCustomer: number = 0;
  totalAmountPro: number = 0;

  userAdress: AddressMatrix;
  user: User;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private estimateService: EstimateService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
  ) { }
    
  ngOnInit(): void {
      
    this.options = {
          types: [],
          componentRestrictions: { country: 'FR' }
    };

    this.proForm = this.formBuilder.group({
      proDevis: ['', Validators.required],
      proName: ['', Validators.required],
      proAmount: ['', Validators.required],
      proTotalAmount: [''],
      proDeliveryCost: [''],
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
      customerAmount: ['', Validators.required],
      customerTotalAmount: [''],
      customerDeliveryCost: [''],
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

    this.estimateService.getUserAdress().subscribe( x => {
      const userAddress = x.userAdress
      this.user = new User();
      this.user.phone = userAddress.phone;
      this.user.email = userAddress.email;
      
      this.user.email = userAddress.email;

      this.userAdress = new AddressMatrix()
                        .setStreet(userAddress.street)
                        .setCity(userAddress.city)
                        .setZipCode(userAddress.zipcode);
    });

    this.onCalculChanges();
  }

  sendEstimate(typeCustomer: string) {

    switch (typeCustomer) {
      case 'professional': {
        if ( this.proForm.value.customerDevis != "") {
          this.saveEstimate(this.proForm.value);
        }
      }
      break;
      case 'customer': {
        if ( this.customerForm.value.customerDevis != "" && 
        (this.customerForm.value.customerMail != "" || this.customerForm.value.customerPhone != "")) 
        {
          this.saveEstimate(this.customerForm.value, true);
        } 
      }
      break;
      default : console.log(this.customerForm.value.customerDevis);
      break;
    }
  }

  private saveEstimate(formValues: any, isCustomer: boolean = false) {
    let estimateSave: any;
    estimateSave = {
      estimate : {
        estimateNumber: (isCustomer) ? formValues.customerDevis : formValues.proDevis,
        amount: (isCustomer) ? formValues.customerAmount : formValues.proAmount,
        totalAmount: (isCustomer) ? formValues.customerTotalAmount : formValues.proTotalAmount,
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
        distanceInfos: (isCustomer) ? this.distanceInfoCustomer : this.distanceInfoPro, // * 100
        deliveryCost: (isCustomer) ? formValues.customerDeliveryCost : formValues.proDeliveryCost, // * 100
        business: this.authenticationService?.currentUserValue?.id,
        serviceCharge: "",
        isPayed: false,
      }
    };
    estimateSave.amount = Math.round(estimateSave.amount * 100);
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
      // console.log("adr_maps", event?.address_components);
      this.selectedAddress = event;
    }
  }

  onCalculChanges() {
    this.customerForm.get('customerAmount').valueChanges.subscribe(val => {
      this.setDistance(this.customerForm.value, true);
    });

    this.proForm.get('proAmount').valueChanges.subscribe(val => {
      this.setDistance(this.proForm.value);
    });
  }

  private setDistance(formValues: any, isCustomer: boolean=false) {    
    const address = {
      addressName: (isCustomer) ? formValues.customerAddressName : formValues.proAddressName,
      street: (isCustomer) ? formValues.customerAddress : formValues.proAddress,
      city: (isCustomer) ? formValues.customerCity : formValues.proCity,
      zipCode: (isCustomer) ? formValues.customerZipCode : formValues.proZipCode,
    };
    
    const adrDest = new AddressMatrix()
    .setStreet(address.street)
    .setCity(address.city)
    .setZipCode(address.zipCode);

    const addressOriginFormat= `${this.userAdress.street}, ${this.userAdress.city}, ${this.userAdress.zipCode}`;
    const addressDestFormat = `${adrDest.street}, ${adrDest.city}, ${adrDest.zipCode}`;
    //     // send result google for calculate backend side
    const directionsService = new google.maps.DistanceMatrixService();
    directionsService.getDistanceMatrix({
      origins: [addressOriginFormat],
      destinations: [addressDestFormat],
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (response, status) => {
      console.info("getDistanceMatrix",response);
      if (response.rows === null) {
      }
      if (response.rows[0].elements[0].status === 'OK') {
        const responseDistance = response.rows[0].elements[0];
        
        const observableList = new Array<Observable<any>> ();
        observableList.push(this.estimateService.getCostDelivery(responseDistance));
        observableList.push(this.estimateService.getMarginService());
        
        const exec = forkJoin( observableList).pipe(
          map( ([deliveryCost, marginService]) => {
            console.log("DLVCST", deliveryCost, "MRG", marginService);
            return {deliveryCost, marginService}
          })
        );

        this.estimateService.getCostDelivery(responseDistance).subscribe();
        this.estimateService.getMarginService().subscribe();
        
        exec.subscribe( resp => {
         console.log("RSPPPPPP", resp);
          // const pro = new Promise(() => {
          //   //getMargin
          //   // this.generateAllPrices(isCustomer, resp.deliveryInfos);
          //   // this.hasAddressSelected = true;
          // });
          // pro.then((respPro) => {
          //   // this.generateAllPrices(isCustomer, resp.deliveryInfos);
          // });
        });
      }
       else {
        console.log("ERROR")
      }
    });
  }

  public generateAllPrices(isCustomer: boolean, distanceInfo: any): void {

    if (isCustomer) {
      this.customerCtrl['customerDeliveryCost'].setValue("");
      this.customerForm.controls['customerTotalAmount'].setValue("");
      this.distanceInfoCustomer = distanceInfo;
    } else {
      this.proCtrl['proDeliveryCost'].setValue("");
      this.proForm.controls['proTotalAmount'].setValue("");
      this.distanceInfoPro = distanceInfo;
    }
      // total = cout livraison + frais de service
  }

  // convenience getter for easy access to form fields
  get proCtrl() { return this.proForm.controls; }
  get customerCtrl() { return this.customerForm.controls; }

}
