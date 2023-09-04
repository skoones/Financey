import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../auth/auth-service";
import {LoginRequestDTO, LoginService} from "../../../generated";

@Component({
  selector: 'app-login-main',
  templateUrl: './login-main.component.html',
  styleUrls: ['./login-main.component.scss']
})
export class LoginMainComponent {
  username?: string;
  password?: string;

  constructor(private loginService: LoginService) {}

  onSubmit() {
    const loginRequest = {
      username: this.username,
      password: this.password
    } as LoginRequestDTO;

    this.loginService.login(loginRequest).subscribe((response) => {
      localStorage.setItem('jwtToken', response.token || "");
    })
  }
}
