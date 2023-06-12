import { Component, EventEmitter, Output } from '@angular/core';
import {RecentlyViewedBudgetsService} from "../budget/recently-viewed-budgets.service";
import {BudgetDTO} from "../../generated";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  favoriteBudgetsTitle: string = FAVORITE_BUDGETS_TITLE;
  recentBudgetsTitle: string = RECENT_BUDGETS_TITLE;
  @Output() sidenavToggleEvent = new EventEmitter<boolean>();
  recentBudgets: BudgetDTO[];

  constructor(private recentlyViewedBudgetsService: RecentlyViewedBudgetsService) {
    this.recentBudgets = recentlyViewedBudgetsService.getRecentlyViewed();
  }

}

// TODO extract to constants file
const FAVORITE_BUDGETS_TITLE: string = "Favorite budgets";
const RECENT_BUDGETS_TITLE: string = "Recent budgets";
