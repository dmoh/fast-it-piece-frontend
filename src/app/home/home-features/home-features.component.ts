import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { first } from 'rxjs/operators';

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

  getDevis(typeCustomer: string) {
    switch (typeCustomer) {
      case 'professional':
        this.router.navigate(['/professional']);
        break;
      case 'customer':
        if ( this.customerForm.value.customerDevis != "" && 
              (this.customerForm.value.customerMail != "" || this.customerForm.value.customerPhone != "")) 
              {
          this.router.navigate(['/customer']);
        } 
        else alert(this.customerForm.value.customerDevis);
        break;
    }
  }

  toggle() {
    this.showPass = !this.showPass;
  }

  // convenience getter for easy access to form fields
  get proCtrl() { return this.proForm.controls; }
  get customerCtrl() { return this.customerForm.controls; }

}
