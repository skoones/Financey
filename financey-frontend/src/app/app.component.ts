import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MainTitleService} from "./main-title-service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  sidenavToggle: boolean = false;
  viewTitle = "Home";

  constructor(private mainTitleService: MainTitleService) {
    this.mainTitleService.data$.subscribe(title => {
     this.updateViewTitle(title)
    });
  }

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
