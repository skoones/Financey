import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {getFirstDayOfMonth} from "../../utils/date-utils";
import {HistoryPeriod} from "../analysis-history/history-period-shortcut-row/history-period";
import {AnalysisOption} from "../analysis-option";

@Component({
  selector: 'app-budget-category-analysis-toggle',
  templateUrl: './budget-category-analysis-toggle.component.html',
  styleUrls: ['./budget-category-analysis-toggle.component.scss']
})
export class BudgetCategoryAnalysisToggleComponent implements OnInit {

  AnalysisOption = AnalysisOption;

  @Output() analysisOptionChange = new EventEmitter<AnalysisOption>();

  constructor() { }

  ngOnInit(): void {
  }

  emitNewOption(option: AnalysisOption) {
    this.analysisOptionChange.emit(option)
  }

}
