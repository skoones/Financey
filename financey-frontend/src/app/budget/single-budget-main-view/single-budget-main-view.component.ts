import { Component } from '@angular/core';
import {BudgetCategoryDTO, BudgetDTO, BudgetService, FetchType} from "../../../generated";
import {
  SINGLE_BUDGET_ANALYSIS_MAIN_VIEW,
  SINGLE_BUDGET_ID_PATH
} from "../../constants/path-constants";

@Component({
  selector: 'app-single-budget-view',
  templateUrl: './single-budget-main-view.component.html',
  styleUrls: ['./single-budget-main-view.component.scss']
})
export class SingleBudgetMainViewComponent {

  SINGLE_BUDGET_TITLE = "Pick a single budget to manage";
  budgetsToChoose: BudgetDTO[] = []
  singleBudgetRoute = SINGLE_BUDGET_ID_PATH

  private userId= localStorage.getItem('userId') || "";

  constructor(private budgetService: BudgetService) {
    this.budgetService.getBudgets(this.userId, FetchType.ALL).subscribe(result => {
      this.budgetsToChoose = result;
    })
  }


}
