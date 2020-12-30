import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  loginForm: FormGroup;
  error: string;
  submitted: boolean;
  info: string;
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.submitted = false;
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
    });
  }

  get f() { return this.loginForm.controls; }
  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.userService.passwordForgot(JSON.stringify(this.loginForm.value))
      .subscribe((res) => {
        if (res.ok) {
          this.info = 'Votre mot de passe a bien été modifié';
        } else if (res.error) {
          this.error = res.error;
        }
      });
  }
}
