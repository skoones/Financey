import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {
  dateToString,
  findEndOfDay,
  findInitialDatesForAnalysis,
  findMonthAndYearFromDate, generateDatesForEveryMonth, getStartOfYear,
  groupIntoStartEndDates
} from "../../utils/date-utils";
import {ExpenseSumPieChartComponent} from "../../charts/expense-sum-pie-chart/expense-sum-pie-chart.component";
import {forkJoin, tap} from "rxjs";
import {InvestmentAnalysisService} from "../../../generated";


type ProfitHistoryEntry = {
  name: string,
  value: number
}

@Component({
  selector: 'app-investment-category-analysis-main-view',
  templateUrl: './investment-category-analysis-main-view.component.html',
  styleUrls: ['./investment-category-analysis-main-view.component.scss']
})
export class InvestmentCategoryAnalysisMainViewComponent implements OnInit {

  profitHistory?: ProfitHistoryEntry[];

  startDate: Date = getStartOfYear(new Date());
  endDate: Date = new Date();

  @ViewChild(ExpenseSumPieChartComponent, {static: false})
  private expensePieChart?: ExpenseSumPieChartComponent

  @Input() categoryId: string

  constructor(private investmentAnalysisService: InvestmentAnalysisService, private route: ActivatedRoute) {
    this.categoryId = this.route.snapshot.queryParams["categoryId"];
  }

  ngOnInit(): void {
    this.initializeProfitHistoryChart(findInitialDatesForAnalysis(), undefined).subscribe();
  }

  chooseDatesToAnalyze(dates: [Date, Date]) {
    this.startDate = dates[0];
    this.endDate = findEndOfDay(dates[1]);
    this.expensePieChart?.changeExpenseDates([this.startDate, this.endDate])
  }

  excludeFromDate(date: Date) {
    this.initializeProfitHistoryChart(generateDatesForEveryMonth(this.startDate, this.endDate), date).subscribe();
  }

  private initializeProfitHistoryChart(dates: Date[], excludeFromDate: Date | undefined) {
    const startEndDatePairs = groupIntoStartEndDates(dates)
    const excludeDateString = this.getDateStringToExclude(excludeFromDate);

    const requests = startEndDatePairs.map(startEndDates => {
      return this.investmentAnalysisService.getProfitByDateAndCategoryId(dateToString(startEndDates[1]), this.categoryId, excludeDateString)
    });

    return forkJoin(requests)
      .pipe(tap((profits: number[]) => {
          const profitHistory: ProfitHistoryEntry[] = [];
          profits.forEach((profit: number, index: number) => {
            return profitHistory.push({
              name: findMonthAndYearFromDate(dateToString(startEndDatePairs[index][0])),
              value: profit
            });
          });
          this.profitHistory = profitHistory;
        })
      )
  }

  private getDateStringToExclude(excludeFromDate: Date | undefined): string | undefined {
    if (excludeFromDate == undefined) {
      return undefined;
    }
    return dateToString(excludeFromDate);
  }

}

