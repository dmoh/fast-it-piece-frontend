﻿import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {AuthenticationService} from './../_services/authentication.service';
import {HttpHeaderResponse} from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { UserService } from '../_services/user.service';
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
    private userService: UserService,
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
      registerEmail: ['', Validators.pattern('[a-zA-Z0-9\-_.]{2,}(@)+[a-zA-Z0-9\-_.]{2,}.+[a-zA-Z0-9\-_.]{2,}')],
      registerDevis: ['', Validators.required],
      registerPhone: ['', Validators.required]
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
    let registerDevis = this.register.registerDevis.value;
    let registerMail = this.register.registerEmail.value;
    let registerPhone = this.register.registerPhone.value;
    
    this.userService.getDevisByUserInfo(registerDevis, registerMail)
    .subscribe(
      data => {
        console.log(" " + data);
        // if (this.returnUrl !== '/') {
        //   this.router.navigate([this.returnUrl]);
        // } else {
          const urlRedirect = `/customer?devis=${registerDevis}&mail=${registerMail}&phone=${registerPhone}`;
          this.router.navigate([urlRedirect]);
          // this.router.navigate([`/customer/devis=${registerDevis}/mail=${registerMail}/phone=${registerPhone}`]);
        // }
      },        
      error => {
        if (/Invalid/.test(error)) {
          error = 'Numero de devis ou coordonnées incorrects';
        }
        alert(error);
        console.error(error);

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
