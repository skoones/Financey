import {Component, ViewChild} from '@angular/core';
import {LoginRequestDTO, LoginService} from "../../../generated";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../auth/auth-service";
import {MatDialog} from "@angular/material/dialog";
import {UserLoginFormComponent} from "../user-login-form/user-login-form.component";
import {SignInPopupComponent} from "../sign-in-popup/sign-in-popup.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login-main',
  templateUrl: './login-main.component.html',
  styleUrls: ['./login-main.component.scss']
})
export class LoginMainComponent {

  @ViewChild(UserLoginFormComponent, {static: false})
  userLoginFormComponent?: UserLoginFormComponent;

  username?: string;
  password?: string;

  constructor(private loginService: LoginService, private authService: AuthService,
              private formBuilder: FormBuilder, private router: Router, private dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  login() {
    const formGroupData = this.userLoginFormComponent?.userLoginGroup.value
    const loginRequest = {
      username: formGroupData.username,
      password: formGroupData.password
    } as LoginRequestDTO;

    this.loginService.login(loginRequest).subscribe((response) => {
        localStorage.setItem('jwtToken', response.token || "");
        localStorage.setItem('userId', this.authService.getUserId(response.token))
        console.log(localStorage.getItem('userId'))
        this.router.navigate(['/home']);
      },
      (error) => {
        if (error.status === 401) {
          this.snackBar.open('Username or password is incorrect.', 'Close', {
            duration: 5000,
          });
        }
      });
  }

  openSignInPopup() {
    const dialogRef = this.dialog.open(SignInPopupComponent, {});

    dialogRef.componentInstance.closePopup.subscribe(() => {
      this.dialog.closeAll();
    })
  }

}
