import {Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {UserLoginFormComponent} from "../user-login-form/user-login-form.component";
import {LoginRequestDTO, UserDTO, UserService} from "../../../generated";
import {MatSnackBar} from "@angular/material/snack-bar";
import {firstValueFrom} from "rxjs";
import {HttpErrorResponse, HttpStatusCode} from "@angular/common/http";

@Component({
  selector: 'app-sign-in-popup',
  templateUrl: './sign-in-popup.component.html',
  styleUrls: ['./sign-in-popup.component.scss']
})
export class SignInPopupComponent implements OnInit {

  @ViewChild(UserLoginFormComponent, {static: false})
  userLoginFormComponent?: UserLoginFormComponent;

  closePopup = new EventEmitter<void>();

  constructor(private userService: UserService, private formSnackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  async submit() {
    const formGroupData = this.userLoginFormComponent?.userLoginGroup.value
    const userDTO = {
      username: formGroupData.username,
      password: formGroupData.password
    } as UserDTO;
    try {
      await firstValueFrom(this.userService.addUser(userDTO));
      this.formSnackBar.open('User added.', 'Close', {
        duration: 5000,
      });
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === HttpStatusCode.BadRequest) {
        this.formSnackBar.open(error.error, 'Close', {
          duration: 5000,
        });
      }
    }
  }

  close() {
    this.closePopup.emit();
  }
}
