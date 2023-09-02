import { Component, OnInit } from '@angular/core';
import {
  dateToString,
  findEndOfDay, findInitialDatesForAnalysis,
  findMonthAndYearFromDate,
  generateDatesForEveryMonth, getStartOfYear,
  groupIntoStartEndDates
} from "../../utils/date-utils";
import {forkJoin, tap} from "rxjs";
import {InvestmentAnalysisService} from "../../../generated";
import {ActivatedRoute} from "@angular/router";

type ProfitHistoryEntry = {
  name: string,
  value: number
}

@Component({
  selector: 'app-investment-budget-analysis-main-view',
  templateUrl: './investment-budget-analysis-main-view.component.html',
  styleUrls: ['./investment-budget-analysis-main-view.component.scss']
})
export class InvestmentBudgetAnalysisMainViewComponent implements OnInit {

  profitHistory?: ProfitHistoryEntry[];
  budgetId = "";
  startDate: Date = getStartOfYear(new Date());
  endDate: Date = new Date();


  constructor(private investmentAnalysisService: InvestmentAnalysisService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.budgetId = this.route.snapshot.queryParamMap.get('budgetId') || ""
    this.initializeProfitHistoryChart(findInitialDatesForAnalysis(), undefined).subscribe();
  }

  chooseDatesToAnalyze(dates: [Date, Date]) {
    this.startDate = dates[0];
    this.endDate = findEndOfDay(dates[1]);
    this.initializeProfitHistoryChart(generateDatesForEveryMonth(this.startDate, this.endDate), undefined).subscribe();
  }

  excludeFromDate(date: Date) {
    this.initializeProfitHistoryChart(generateDatesForEveryMonth(this.startDate, this.endDate), date).subscribe();
  }

  private initializeProfitHistoryChart(dates: Date[], excludeFromDate: Date | undefined) {
    const startEndDatePairs = groupIntoStartEndDates(dates)
    const excludeDateString = this.getDateStringToExclude(excludeFromDate);

    const requests = startEndDatePairs.map(startEndDates =>
      this.investmentAnalysisService.getProfitByPeriodAndId(dateToString(startEndDates[0]),
        dateToString(startEndDates[1]), this.budgetId, excludeDateString)
    );

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
