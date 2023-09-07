import {Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {UserLoginFormComponent} from "../user-login-form/user-login-form.component";
import {UserDTO, UserService} from "../../../generated";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpStatusCode} from "@angular/common/http";

@Component({
  selector: 'app-sign-up-popup',
  templateUrl: './sign-up-popup.component.html',
  styleUrls: ['./sign-up-popup.component.scss']
})
export class SignUpPopupComponent implements OnInit {

  @ViewChild(UserLoginFormComponent, {static: false})
  userLoginFormComponent?: UserLoginFormComponent;

  closePopup = new EventEmitter<void>();

  constructor(private userService: UserService, private formSnackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  async submit() {
    const formGroupData = this.userLoginFormComponent?.userLoginGroup.value
    const userDTO = {
      username: formGroupData.username,
      password: formGroupData.password
    } as UserDTO;

    this.userService.addUser(userDTO).subscribe((_) => {
        this.formSnackBar.open('User added.', 'Close', {
          duration: 5000,
        });
      },
      (error) => {
        if (error.status === HttpStatusCode.BadRequest) {
          this.formSnackBar.open(error.error, 'Close', {
            duration: 5000,
          });
        }
      });
  }

  close() {
    this.closePopup.emit();
  }
}
