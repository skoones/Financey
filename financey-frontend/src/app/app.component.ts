import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  sidenavToggle: boolean = false;
  viewTitle = "Home";

  toggleSidenav() {
    this.sidenavToggle = !this.sidenavToggle
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('jwtToken') != null
  }

  updateViewTitle(title: string) {
    this.viewTitle = title;
  }

  resetViewTitle() {
    this.viewTitle = "Home";
  }
}
