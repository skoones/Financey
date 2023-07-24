import {Component, Input} from '@angular/core';
import {BudgetAnalysisService, BudgetDTO} from "../../generated";
import {forkJoin, tap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {getFirstDayOfMonth, groupIntoStartEndDates} from "../utils/date-utils";

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
    // todo choosing dates by user
    console.log(this.route.snapshot.queryParamMap)
    this.budgetId = this.route.snapshot.queryParamMap.get('budgetId') || ""
    this.initializeExpenseBalanceHistory(this.findDatesForAnalysis()).subscribe(() => {
    });
  }

  chooseDatesToAnalyze(dates: [Date, Date]) {
   const startDate = dates[0];
   const endDate = dates[1];
    this.initializeExpenseBalanceHistory(this.generateDatesForEveryMonth(startDate, endDate))
      .subscribe((dates) => {
        console.log(dates)
    });
  }

  private findDatesForAnalysis() {
    return Array.from(
      { length: new Date().getMonth() + 1 },
      (_, index) => {
        return new Date(new Date().setMonth(index));
      }
    )
  }

  private initializeExpenseBalanceHistory(dates: Date[]) {
    console.log("original dates: ")
    console.log(dates)
    const startEndDatePairs = groupIntoStartEndDates(dates)
    console.log("paired dates: ") // todo remove
    console.log(startEndDatePairs)
    const requests = startEndDatePairs.map(startEndDates =>
      // todo does this consider this start date? check on backend
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
    const currentMonth = new Date().getMonth();

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ].slice(0, currentMonth + 1);

    return `${monthNames[monthIndex]} ${year}`
  }

  private dateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }

  private addMonths(date: Date, months: number): Date {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + months);
    return newDate;
  }



  private generateDatesForEveryMonth(start: Date, end: Date): Date[] {
    // todo validation - start date must be before end date
    const numberOfMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) - 1;
    const monthsInBetween = Array.from({ length: numberOfMonths },
      (_, index) => getFirstDayOfMonth(this.addMonths(start, index + 1)));

    const temp = [start, ...monthsInBetween, end]; // todo remove
    console.log(temp)
    return temp;
  }

  // todo utils?


}
