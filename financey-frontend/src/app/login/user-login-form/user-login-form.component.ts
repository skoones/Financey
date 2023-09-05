import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {

  userLoginGroup: FormGroup;
  showPassword = false;

  constructor(private formBuilder: FormBuilder) {
    this.userLoginGroup = this.formBuilder.group({
        username: [],
        password: []
      }
    )
  }

  ngOnInit(): void {
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


}
