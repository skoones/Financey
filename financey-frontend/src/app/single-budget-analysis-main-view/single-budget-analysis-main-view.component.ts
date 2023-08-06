import {Component} from '@angular/core';
import {BudgetAnalysisService, SubcategoryExpenseSumDTO} from "../../generated";
import {firstValueFrom, forkJoin, tap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {addMonths, findEndOfDay, getFirstDayOfMonth, getStartOfYear, groupIntoStartEndDates} from "../utils/date-utils";

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

  constructor(private budgetAnalysisService: BudgetAnalysisService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.budgetId = this.route.snapshot.queryParamMap.get('budgetId') || ""
    this.initializeExpenseBalanceHistory(this.findDatesForAnalysis()).subscribe(() => {
    });
  }

  chooseDatesToAnalyze(dates: [Date, Date]) {
   const startDate = dates[0];
   const endDate = findEndOfDay(dates[1]);
   this.initializeExpenseBalanceHistory(this.generateDatesForEveryMonth(startDate, endDate)).subscribe();
   firstValueFrom(this.budgetAnalysisService.getTotalExpensesForSubcategoriesByCategoryId("64ce34655727d45b23d5ea49")).then(expenses =>
    console.log(expenses))
    // todo remove
  }

  private findDatesForAnalysis() {
    const datesSuffix = this.generateMonthBeginningsFromDate(new Date().getMonth(), getStartOfYear(new Date()));
    const currentDate = new Date()

    return [...datesSuffix, currentDate];
  }

  private initializeExpenseBalanceHistory(dates: Date[]) {
    const startEndDatePairs = groupIntoStartEndDates(dates)

    const requests = startEndDatePairs.map(startEndDates =>
      this.budgetAnalysisService.getExpenseBalanceByPeriodAndId(this.dateToString(startEndDates[0]),
        this.dateToString(startEndDates[1]), this.budgetId)
    );

    return forkJoin(requests)
      .pipe(tap((balances: number[]) => {
        const balanceHistory: BalanceHistoryEntry[] = []
        balances.forEach((balance: number, index: number) => {
          balanceHistory.push({
            name: this.findMonthAndYearFromDate(this.dateToString(startEndDatePairs[index][0])),
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

  private dateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
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

}
