import {Component} from '@angular/core';
import {LoginRequestDTO, LoginService} from "../../../generated";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../auth/auth-service";

@Component({
  selector: 'app-login-main',
  templateUrl: './login-main.component.html',
  styleUrls: ['./login-main.component.scss']
})
export class LoginMainComponent {
  username?: string;
  password?: string;

  userLoginGroup: FormGroup;
  showPassword = false;

  constructor(private loginService: LoginService, private authService: AuthService,
              private formBuilder: FormBuilder, private router: Router) {
    this.userLoginGroup = this.formBuilder.group({
        username: [],
        password: []
      }
    )
  }

  login() {
    const formGroupData = this.userLoginGroup.value
    const loginRequest = {
      username: formGroupData.username,
      password: formGroupData.password
    } as LoginRequestDTO;

    this.loginService.login(loginRequest).subscribe((response) => {
      localStorage.setItem('jwtToken', response.token || "");
      localStorage.setItem('userId', this.authService.getUserId(response.token))
      console.log(localStorage.getItem('userId'))
      this.router.navigate(['/home']);
    })
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
