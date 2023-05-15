import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  sidenavToggle: boolean = false;

  toggleSidenav() {
    console.log("toggling sidenav in app-component")
    this.sidenavToggle = !this.sidenavToggle
    console.log(`sidenavToggle after toggling: ${this.sidenavToggle}`)
  }

}
