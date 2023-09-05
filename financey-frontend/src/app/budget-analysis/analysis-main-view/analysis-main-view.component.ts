import { Component, OnInit } from '@angular/core';
import {AnalysisOption} from "../analysis-option";
import {BUDGET_CATEGORY_ANALYSIS_MAIN_VIEW, SINGLE_BUDGET_ANALYSIS_MAIN_VIEW} from "../../constants/path-constants";
import {BudgetCategoryDTO, BudgetDTO, BudgetService, FetchType} from "../../../generated";

@Component({
  selector: 'app-analysis-main-view',
  templateUrl: './analysis-main-view.component.html',
  styleUrls: ['./analysis-main-view.component.scss']
})
export class AnalysisMainViewComponent implements OnInit {

  SINGLE_BUDGET_TITLE = "Pick a budget for analysis";

  BUDGET_CATEGORY_TITLE = "Pick a budget category for analysis"
  budgetsToChoose: BudgetDTO[] = []
  categoriesToChoose: BudgetCategoryDTO[] = []

  singleBudgetRoute = SINGLE_BUDGET_ANALYSIS_MAIN_VIEW

  categoryRoute = BUDGET_CATEGORY_ANALYSIS_MAIN_VIEW

  analysisOption = AnalysisOption.SINGLE_BUDGET

  AnalysisOption = AnalysisOption

  private userId: string = "demo" // todo placeholder user id

  constructor(private budgetService: BudgetService) {
    this.budgetService.getBudgets(this.userId, FetchType.NON_INVESTMENT_ONLY).subscribe(result => {
      this.budgetsToChoose = result;
    })

    this.budgetService.getCategories(this.userId, FetchType.NON_INVESTMENT_ONLY).subscribe(result => {
      this.categoriesToChoose = result;
    });
  }

  ngOnInit(): void {
  }

  changeAnalysisOption(option: AnalysisOption) {
    this.analysisOption = option
  }

}
