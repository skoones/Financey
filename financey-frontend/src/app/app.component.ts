import { Component } from '@angular/core';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  favoriteBudgetsTitle: string = FAVORITE_BUDGETS_TITLE;
  recentBudgetsTitle: string = RECENT_BUDGETS_TITLE;
}

// TODO extract to constants file
const FAVORITE_BUDGETS_TITLE: string = "Favorite budgets";
const RECENT_BUDGETS_TITLE: string = "Recent budgets";
