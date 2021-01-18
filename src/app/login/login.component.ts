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

  onSubmit(isRegisterForm?: string) {
    this.submitted = true;
    if (isRegisterForm) {
      let registerPass = this.register.registerPassword.value;

      if (this.register.confirmPassword.value !== this.register.registerPassword.value) {
        this.error = 'Les mots de passe ne sont pas identiques';
        return;
      }

      if (registerPass.length < 8) {
        this.error = '8 caractères minimum';
        return;
      }
      registerPass = registerPass.trim();
      const rPaswd = /^[a-zA-Z0-9\-_.!@#$&*]{8,15}$/;
      if (registerPass.match(rPaswd) === null) {
        this.error = 'Le mot de passe contient un ou des caractère(s) non autorisé(s)';
        return;
      }
      // this.userService.registerUser(JSON.stringify(this.registerForm.value))
      //   .subscribe((res) => {
      //     if (res.ok === 'success') {
      //         alert('Bienvenu.e :)');
      //         this.authenticationService.login(this.register.registerEmail.value, this.register.registerPassword.value)
      //            .subscribe(() => {
      //              this.router.navigate([this.returnUrl]);
      //          });

      //     } else if (res.error) {
      //       this.error = res.error;
      //     }
      //   });
      return;
    }
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
