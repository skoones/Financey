import { Component, OnInit } from '@angular/core';
import {
  dateToString,
  findEndOfDay,
  findMonthAndYearFromDate,
  generateDatesForEveryMonth,
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


  constructor(private investmentAnalysisService: InvestmentAnalysisService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.budgetId = this.route.snapshot.queryParamMap.get('budgetId') || ""
  }

  chooseDatesToAnalyze(dates: [Date, Date]) {
    const startDate = dates[0];
    const endDate = findEndOfDay(dates[1]);
    this.initializeProfitHistoryChart(generateDatesForEveryMonth(startDate, endDate)).subscribe();
  }

  private initializeProfitHistoryChart(dates: Date[]) {
    const startEndDatePairs = groupIntoStartEndDates(dates)

    const requests = startEndDatePairs.map(startEndDates =>
      this.investmentAnalysisService.getProfitByPeriodAndId(dateToString(startEndDates[0]),
        dateToString(startEndDates[1]), this.budgetId) // todo excluding from date
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
          console.log(this.profitHistory)
        })
      )
  }

}
