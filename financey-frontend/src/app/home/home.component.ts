import { Component, EventEmitter, Output } from '@angular/core';
import {RecentlyViewedBudgetsService} from "../budget/recently-viewed-budgets.service";
import {BudgetDTO} from "../../generated";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private readonly FAVORITE_BUDGETS_TITLE = "Favorite budgets";
  private readonly RECENT_BUDGETS_TITLE = "Recent budgets";

  favoriteBudgetsTitle: string = this.FAVORITE_BUDGETS_TITLE;
  recentBudgetsTitle: string = this.RECENT_BUDGETS_TITLE;
  @Output() sidenavToggleEvent = new EventEmitter<boolean>();
  recentBudgets: BudgetDTO[];

  constructor(private recentlyViewedBudgetsService: RecentlyViewedBudgetsService) {
    this.recentBudgets = recentlyViewedBudgetsService.getRecentlyViewed();
  }

}
