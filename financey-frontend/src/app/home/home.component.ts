import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  favoriteBudgetsTitle: string = FAVORITE_BUDGETS_TITLE;
  recentBudgetsTitle: string = RECENT_BUDGETS_TITLE;
  sidenavToggle: boolean = false;

  @Output() sidenavToggleEvent = new EventEmitter<boolean>();
}

// TODO extract to constants file
const FAVORITE_BUDGETS_TITLE: string = "Favorite budgets";
const RECENT_BUDGETS_TITLE: string = "Recent budgets";
