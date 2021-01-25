﻿import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {AuthenticationService} from './../_services/authentication.service';
import {HttpHeaderResponse} from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { UserService } from '../_services/user.service';
import { BusinessEstimateService } from '../estimate/services/business-estimate.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  hide = true;
  returnUrl: string;
  error = '';
  showPassword: boolean;
  showPass: boolean;
  showConfirmPassword: boolean;
  showRegisterPassword: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private businessEstimateService: BusinessEstimateService,
  ) {
    this.showPass = false;
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      // this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registerForm = this.formBuilder.group({
      // registerEmail: ['', Validators.required],
      registerDevis: ['', Validators.required],
      registerEmail: [''],
      registerPhone: ['']
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  toggle() {
    this.showPass = !this.showPass;
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }
  get register() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authenticationService.login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          if (this.returnUrl === '/') {
              this.router.navigate(['/home']);
          } else {
            this.router.navigate([this.returnUrl]);
          }
        },
        error => {
          if (/Invalid/.test(error)) {
            error = 'Email et/ou mot de passe incorrect';
          }
          this.error = error;
          this.loading = false;
        });
  }

  onPayClick() {
    if (this.registerForm.invalid) {
      console.error("formulaire invalid");
      return;
    }
    const numEstimate = this.register.registerDevis.value;
    const registerMail = this.register.registerEmail.value;
    const registerPhone = this.register.registerPhone.value;
    const infoUser = {
      mail: registerMail,
      phone: registerPhone,
    }
    
    this.businessEstimateService.getEstimateByUserInfo(numEstimate, infoUser)
    .subscribe(
      data => {
        console.log(" data info " + data);
          this.router.navigate(['/customer'], { 
            queryParams: { 
              devis: numEstimate, 
              mail: registerMail,
              phone: registerPhone
            } 
        });
      },        
      error => {
        console.error(error);
        if (/Invalid/.test(error)) {
          error = 'Numero de devis ou coordonnées incorrects';
        }
        this.error = error;
        this.loading = false;
      });
  }

  onShowPassword(type: string): void {
    switch (type) {
      case 'confirmPassword':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
      case 'registerPassword':
        this.showRegisterPassword = !this.showRegisterPassword;
        break;
      case 'showPassword':
        this.showPassword = !this.showPassword;
        break;
    }
  }
}
