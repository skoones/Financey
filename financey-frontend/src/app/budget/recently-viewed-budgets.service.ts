import { Injectable } from '@angular/core';
import {BudgetDTO} from "../../generated";

@Injectable({
  providedIn: 'root'
})
export class RecentlyViewedBudgetsService {
  private recentlyViewed: BudgetDTO[] = [];
  private readonly MAX_RECENTLY_VIEWED = 5;

  addRecentlyViewed(budget: BudgetDTO) {
    this.recentlyViewed = this.recentlyViewed.filter(t => t.id !== budget.id);
    this.recentlyViewed.unshift(budget);

    if (this.recentlyViewed.length > this.MAX_RECENTLY_VIEWED) {
      this.recentlyViewed.pop();
    }
  }

  getRecentlyViewed() {
    return this.recentlyViewed;
  }

}
