import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Deliverer } from 'src/app/_models/deliverer';
import { DeliveryService } from '../services/delivery.service';

@Component({
  selector: 'app-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.scss']
})
export class ParameterComponent implements OnInit {
  delivererForm: FormGroup;
  deliverer: Deliverer;
  constructor(private fb: FormBuilder, private deliveryService: DeliveryService) { }

  userName: string;
  lastName: string;
  phone: string;
  siret: string;
  isKbis: boolean;
  isSave: boolean;


  ngOnInit(): void {
    this.isKbis = true;
    this.isSave = false;
    this.deliverer = new Deliverer();

    this.deliveryService.getInfosDeliverer()
      .subscribe((delivererCurrent) => {
        this.deliverer = delivererCurrent;
        console.log("delivererCurrent",delivererCurrent);       
        let city;
        let street;
        let zipcode;
        
        if (Array.isArray(this.deliverer.addresses) && this.deliverer.addresses.length > 0) {
          const addresses: any[any] = this.deliverer.addresses;
          city = addresses[0].city;
          street = addresses[0].street;        
          zipcode = addresses[0].zipCode;
        }

        this.delivererForm = this.fb.group({
          userName: [this.deliverer.username],
          firstName: [this.deliverer.firstname, Validators.required],
          lastName: [this.deliverer.lastname, Validators.required],
          phone: [this.deliverer.phone, Validators.required],
          email: [this.deliverer.email],
          city: [city, Validators.required],
          street: [street, Validators.required],
          zipcode: [zipcode, Validators.required],
          workingTime: [this.deliverer.workingTime],
          workingTimeTwo: [this.deliverer.workingTimeTwo],
          siret: [this.deliverer.siret, Validators.required],
        });
      });

  }

  onSaveDelivererInfo() {
    // // https://entreprise.data.gouv.fr/api/sirene/v1/siret/
    
    // todo kbis a sauvegarder
    this.deliveryService.getKbis(this.delivererForm.value.siret).subscribe(
      (res) => {
        console.warn('response', res);

        
        // save informations deliverer
        const delivererInfo: any = {};
        delivererInfo.userName = this.delivererForm.value.userName != "" ? this.delivererForm.value.userName : null;
        delivererInfo.siret = this.delivererForm.value.siret;
        delivererInfo.firstName = this.delivererForm.value.firstName;
        delivererInfo.lastName = this.delivererForm.value.lastName;
        delivererInfo.phone = this.delivererForm.value.phone;
        delivererInfo.city = this.delivererForm.value.city;
        delivererInfo.street = this.delivererForm.value.street;
        delivererInfo.zipcode = this.delivererForm.value.zipcode;

        console.log('Before api fast', delivererInfo);

        this.deliveryService.saveInfosDeliverer(delivererInfo).subscribe(
          success => { 
            this.isKbis = (res.etablissement.siret === this.delivererForm.value.siret.toString());
            this.isSave = (true && this.isKbis);
            return console.log("deliverer info success", success)
          },
          err => console.error("deliverer info err", err)
        );
      },
      (err) => {
        console.trace('error Kbis', err);
        this.isKbis = false;
        this.isSave = (true && this.isKbis);
      }
    );
  }

}
