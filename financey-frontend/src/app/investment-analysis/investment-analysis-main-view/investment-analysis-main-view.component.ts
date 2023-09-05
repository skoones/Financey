import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AnalysisOption} from "../../budget-analysis/analysis-option";
import {
  INVESTMENT_CATEGORY_MAIN_VIEW, INVESTMENT_SINGLE_BUDGET_MAIN_VIEW
} from "../../constants/path-constants";
import {BudgetCategoryDTO, BudgetDTO, BudgetService, FetchType} from "../../../generated";

@Component({
  selector: 'app-investment-analysis-main-view',
  templateUrl: './investment-analysis-main-view.component.html',
  styleUrls: ['./investment-analysis-main-view.component.scss']
})
export class InvestmentAnalysisMainViewComponent implements OnInit {

  singleBudgetRoute = INVESTMENT_SINGLE_BUDGET_MAIN_VIEW

  categoryRoute = INVESTMENT_CATEGORY_MAIN_VIEW

  analysisOption = AnalysisOption.SINGLE_BUDGET

  AnalysisOption = AnalysisOption
  investmentBudgetsToChoose: BudgetDTO[] = [];
  investmentCategoriesToChoose: BudgetCategoryDTO[] = [];

  private userId = localStorage.getItem('userId') || "";

  constructor(private budgetService: BudgetService) {
    this.budgetService.getBudgets(this.userId, FetchType.INVESTMENT_ONLY).subscribe(result => {
      this.investmentBudgetsToChoose = result;
    });

    this.budgetService.getCategories(this.userId, FetchType.INVESTMENT_ONLY).subscribe(result => {
      this.investmentCategoriesToChoose = result;
    })
  }

  ngOnInit(): void {
  }

  changeAnalysisOption(option: AnalysisOption) {
    this.analysisOption = option
  }

}
