import { Component } from '@angular/core';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  favoriteBudgetsTitle: string = FAVORITE_BUDGETS_TITLE
}

const FAVORITE_BUDGETS_TITLE: string = "Favorite budgets"
