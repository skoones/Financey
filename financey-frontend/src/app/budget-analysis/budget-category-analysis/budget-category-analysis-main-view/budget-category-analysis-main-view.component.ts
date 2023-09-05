import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {findEndOfDay} from "../../../utils/date-utils";
import {BudgetAnalysisService} from "../../../../generated";
import {ActivatedRoute} from "@angular/router";
import {ExpenseSumPieChartComponent} from "../../../charts/expense-sum-pie-chart/expense-sum-pie-chart.component";

@Component({
  selector: 'app-budget-category-analysis-main-view',
  templateUrl: './budget-category-analysis-main-view.component.html',
  styleUrls: ['./budget-category-analysis-main-view.component.scss']
})
export class BudgetCategoryAnalysisMainViewComponent implements OnInit {

  // todo handle case when category has no children
  @ViewChild(ExpenseSumPieChartComponent, {static: false})
  private expensePieChart?: ExpenseSumPieChartComponent

  @Input() categoryId: string

  constructor(private budgetAnalysisService: BudgetAnalysisService, private route: ActivatedRoute) {
    this.categoryId = this.route.snapshot.queryParams["categoryId"];
  }

  ngOnInit(): void {
  }

  chooseDatesToAnalyze(dates: [Date, Date]) {
    this.expensePieChart?.changeExpenseDates([dates[0], findEndOfDay(dates[1])])
  }

}
