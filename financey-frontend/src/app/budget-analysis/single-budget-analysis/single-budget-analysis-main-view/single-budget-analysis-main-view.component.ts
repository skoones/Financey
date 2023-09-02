import {Component} from '@angular/core';
import {BudgetAnalysisService, BudgetService} from "../../../../generated";
import {forkJoin, tap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {
  dateToString,
  findEndOfDay,
  findInitialDatesForAnalysis,
  findMonthAndYearFromDate,
  generateDatesForEveryMonth,
  groupIntoStartEndDates
} from "../../../utils/date-utils";

type BalanceHistoryEntry = {
  name: string,
  value: any
}

@Component({
  selector: 'app-single-budget-analysis-main-view',
  templateUrl: './single-budget-analysis-main-view.component.html',
  styleUrls: ['./single-budget-analysis-main-view.component.scss']
})
export class SingleBudgetAnalysisMainViewComponent {
  expenseBalanceHistory?: BalanceHistoryEntry[];

  budgetId = "";

  constructor(private budgetService: BudgetService, private budgetAnalysisService: BudgetAnalysisService,
              private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.budgetId = this.route.snapshot.queryParamMap.get('budgetId') || ""
    this.initializeExpenseBalanceHistory(findInitialDatesForAnalysis()).subscribe(() => {
    });
  }

  chooseDatesToAnalyze(dates: [Date, Date]) {
    const startDate = dates[0];
    const endDate = findEndOfDay(dates[1]);
    this.initializeExpenseBalanceHistory(generateDatesForEveryMonth(startDate, endDate)).subscribe();
  }

  private initializeExpenseBalanceHistory(dates: Date[]) {
    const startEndDatePairs = groupIntoStartEndDates(dates)

    const requests = startEndDatePairs.map(startEndDates =>
      this.budgetAnalysisService.getExpenseBalanceByPeriodAndId(dateToString(startEndDates[0]),
        dateToString(startEndDates[1]), this.budgetId)
    );

    return forkJoin(requests)
      .pipe(tap((balances: number[]) => {
          const balanceHistory: BalanceHistoryEntry[] = []
          balances.forEach((balance: number, index: number) => {
            balanceHistory.push({
              name: findMonthAndYearFromDate(dateToString(startEndDatePairs[index][0])),
              value: balance
            });
          });
          this.expenseBalanceHistory = balanceHistory;
        })
      );
  }

  openFullBudgetView() {
    console.log("budgetId: " + this.budgetId)
    this.budgetService.getById(this.budgetId).subscribe(budget => {
      this.router.navigate([`/budgets/single/${this.budgetId}`],  { queryParams: { budget: JSON.stringify(budget) } });
    })

  }

}
