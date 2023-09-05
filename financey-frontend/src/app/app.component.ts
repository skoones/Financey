import {Component} from '@angular/core';
import {local} from "d3-selection";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  sidenavToggle: boolean = false;

  toggleSidenav() {
    this.sidenavToggle = !this.sidenavToggle
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('jwtToken') != null
  }

}
