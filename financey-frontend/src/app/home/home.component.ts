import { Component, EventEmitter, Output } from '@angular/core';
import {RecentlyViewedBudgetsService} from "../budget/recently-viewed-budgets.service";
import {BudgetDTO, BudgetService} from "../../generated";

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
  favoriteBudgets: BudgetDTO[] = [];

  userId = localStorage.getItem('userId') || "";

  constructor(private recentlyViewedBudgetsService: RecentlyViewedBudgetsService, private budgetService: BudgetService) {
    this.recentBudgets = recentlyViewedBudgetsService.getRecentlyViewed();
    budgetService.getBudgetFavorites(this.userId).subscribe((budgets) => {
      this.favoriteBudgets = budgets;
    })
  }

}
