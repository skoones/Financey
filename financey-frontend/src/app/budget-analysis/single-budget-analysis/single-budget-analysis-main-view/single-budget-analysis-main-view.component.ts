import {Component} from '@angular/core';
import {BudgetAnalysisService, BudgetService} from "../../../../generated";
import {forkJoin, tap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {
  addMonths,
  dateToString,
  findEndOfDay,
  getFirstDayOfMonth,
  getStartOfYear,
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
    this.initializeExpenseBalanceHistory(this.findDatesForAnalysis()).subscribe(() => {
    });
  }

  chooseDatesToAnalyze(dates: [Date, Date]) {
    const startDate = dates[0];
    const endDate = findEndOfDay(dates[1]);
    this.initializeExpenseBalanceHistory(this.generateDatesForEveryMonth(startDate, endDate)).subscribe();
  }

  private findDatesForAnalysis() {
    const datesSuffix = this.generateMonthBeginningsFromDate(new Date().getMonth(), getStartOfYear(new Date()));
    const currentDate = new Date()

    return [...datesSuffix, currentDate];
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
              name: this.findMonthAndYearFromDate(dateToString(startEndDatePairs[index][0])),
              value: balance
            });
          });
          this.expenseBalanceHistory = balanceHistory;
        })
      );
  }

  private findMonthAndYearFromDate(dateString: string) {
    const date = new Date(dateString);
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

    return `${monthNames[monthIndex]} ${year}`
  }

  private generateDatesForEveryMonth(start: Date, end: Date): Date[] {
    const numberOfMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) - 1;
    const monthsInBetween = this.generateMonthBeginningsFromDate(numberOfMonths, getFirstDayOfMonth(addMonths(start, 1)));

    return [start, ...monthsInBetween, end];
  }

  private generateMonthBeginningsFromDate(numberOfMonths: number, start: Date): Date[] {
    return Array.from({length: numberOfMonths},
      (_, index) => getFirstDayOfMonth(addMonths(start, index)));
  }

  openFullBudgetView() {
    console.log("budgetId: " + this.budgetId)
    this.budgetService.getById(this.budgetId).subscribe(budget => {
      this.router.navigate([`/budgets/single/${this.budgetId}`],  { queryParams: { budget: JSON.stringify(budget) } });
    })

  }

}
