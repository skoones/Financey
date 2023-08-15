import { Component, OnInit } from '@angular/core';
import {AnalysisOption} from "../analysis-option";
import {BUDGET_CATEGORY_ANALYSIS_MAIN_VIEW, SINGLE_BUDGET_ANALYSIS_MAIN_VIEW} from "../../constants/path-constants";

@Component({
  selector: 'app-analysis-main-view',
  templateUrl: './analysis-main-view.component.html',
  styleUrls: ['./analysis-main-view.component.scss']
})
export class AnalysisMainViewComponent implements OnInit {

  singleBudgetRoute = SINGLE_BUDGET_ANALYSIS_MAIN_VIEW

  categoryRoute = BUDGET_CATEGORY_ANALYSIS_MAIN_VIEW

  analysisOption = AnalysisOption.SINGLE_BUDGET

  AnalysisOption = AnalysisOption

  constructor() { }

  ngOnInit(): void {
  }

  changeAnalysisOption(option: AnalysisOption) {
    this.analysisOption = option
  }

}
