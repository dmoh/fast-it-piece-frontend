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
  disabledButton = true;
  hide = true;
  error = '';
  success = '';
  options: {} = {};

  selectedAddress: any;

  distanceInfoCustomer: any = null;
  distanceInfoPro: any = null;

  amountCustomer: number = 0;
  amountPro: number = 0;

  loading: boolean = false;
  
  totalAmountCustomer: number = 0;
  totalAmountPro: number = 0;
  
  deliveryCostCustomer: number = 0;
  deliveryCostPro: number = 0;

  serviceCharge: number = 0.80;

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
    estimateSave.amount = Math.round(estimateSave.estimate.amount * 100);
    this.estimateService.saveEstimateByBusiness(estimateSave).subscribe( estimated => {
    this.success = `Devis n° ${estimateSave.estimate.estimateNumber} cree`;
    this.error = '';
    setTimeout(() => {
      this.router.navigate(['estimate/my-estimate']);
    }, 500);
    // this.router.navigate([`/estimate/detail-estimate/${estimateSave.estimateNumber}`]);
    }
      , error => {
        this.error = error?.toString().toLowerCase().includes("integrity constraint violation") ? "Numero de devis (déja existant/mal renseigné)" : error;
        this.success = null;
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
      this.onAmountChanges(this.customerForm.value, val, true);
    });

    this.proForm.get('proAmount').valueChanges.subscribe(val => {
      this.onAmountChanges(this.proForm.value, val);
    });
  }

  private onAmountChanges(formValues: any, amount: any ,  isCustomer: boolean=false) {    
    this.disabledButton = true;    
    this.loading = true;  
    
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
      if (response.rows === null) {
      }
      if (response.rows[0].elements[0].status === 'OK') {
        const responseDistance = response.rows[0].elements[0];
        const request = {
          price : isCustomer ? amount : null,
        }
        const observableList = new Array<Observable<any>> ();
        observableList.push(this.estimateService.getCostDelivery(responseDistance));
        observableList.push(this.estimateService.getMarginService(request));
        
        const exec = forkJoin( observableList)
        .pipe(
          map( ([deliveryCost, marginService]) => {
            return {deliveryCost, marginService}
          })
        )
        ;
        
        exec.subscribe( responseMarginService => {
          console.log("exec", responseMarginService);
          this.generateAllPrices(isCustomer, responseMarginService, amount);
          this.loading = false;
          this.disabledButton = false;
        });
      }
       else {
        console.log("Error distance")
      }
    });
  }

  public generateAllPrices(isCustomer: boolean, response: any, amount: number): void {
    console.log(<number> amount );
    console.log(<number> response.marginService.marginFastIt);
    console.log(<number> response.marginService.marginFastIt * amount);

    const marginCost = (<number> amount * <number> response.marginService.marginFastIt);
    console.log("margin", marginCost);
    const totalAmount = marginCost + amount + <number> response.marginService.serviceCharge 
    + <number> response.deliveryCost.deliveryInfos; 
    console.log("total", totalAmount);

    const distance = response?.deliveryCost?.distanceText?.replace("km","").trim() ?? null;
    const deliveryCost = response.deliveryCost.deliveryInfos ?? 0;

    if (isCustomer) {
      this.customerCtrl['customerDeliveryCost'].setValue(deliveryCost);
      this.customerForm.controls['customerTotalAmount'].setValue(totalAmount);
      this.distanceInfoCustomer = distance;
      this.amountCustomer = amount;
      this.totalAmountCustomer = totalAmount;
      this.deliveryCostCustomer = deliveryCost;
    } else {
      this.proCtrl['proDeliveryCost'].setValue(deliveryCost);
      this.proForm.controls['proTotalAmount'].setValue(totalAmount);
      this.distanceInfoPro = distance;
      this.amountPro = amount;
      this.totalAmountPro = totalAmount;
      this.deliveryCostPro = deliveryCost;
    }
    console.log(this.amountPro);

      // total = cout livraison + frais de service
  }

  // convenience getter for easy access to form fields
  get proCtrl() { return this.proForm.controls; }
  get customerCtrl() { return this.customerForm.controls; }

}
