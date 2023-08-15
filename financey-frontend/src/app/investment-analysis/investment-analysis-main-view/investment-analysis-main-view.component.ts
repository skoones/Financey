import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ExpenseSumPieChartComponent} from "../../charts/expense-sum-pie-chart/expense-sum-pie-chart.component";
import {AnalysisOption} from "../../budget-analysis/analysis-option";
import {
  BUDGET_CATEGORY_ANALYSIS_MAIN_VIEW,
  INVESTMENT_CATEGORY_MAIN_VIEW, INVESTMENT_SINGLE_BUDGET_MAIN_VIEW,
  SINGLE_BUDGET_ANALYSIS_MAIN_VIEW
} from "../../constants/path-constants";

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

  constructor() { }

  ngOnInit(): void {
  }

  changeAnalysisOption(option: AnalysisOption) {
    this.analysisOption = option
  }

}
