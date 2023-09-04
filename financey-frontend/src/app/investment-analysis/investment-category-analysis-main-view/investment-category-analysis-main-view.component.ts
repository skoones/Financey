import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {findEndOfDay} from "../../utils/date-utils";
import {ExpenseSumPieChartComponent} from "../../charts/expense-sum-pie-chart/expense-sum-pie-chart.component";

@Component({
  selector: 'app-investment-category-analysis-main-view',
  templateUrl: './investment-category-analysis-main-view.component.html',
  styleUrls: ['./investment-category-analysis-main-view.component.scss']
})
export class InvestmentCategoryAnalysisMainViewComponent implements OnInit {

  @ViewChild(ExpenseSumPieChartComponent, {static: false})
  private expensePieChart?: ExpenseSumPieChartComponent

  @Input() categoryId: string

  constructor(private route: ActivatedRoute) {
    this.categoryId = this.route.snapshot.queryParams["categoryId"];
  }

  ngOnInit(): void {
  }

  chooseDatesToAnalyze(dates: [Date, Date]) {
    this.expensePieChart?.changeExpenseDates([dates[0], findEndOfDay(dates[1])])
  }

}
