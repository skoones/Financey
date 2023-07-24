import {Component, Input} from '@angular/core';
import {BudgetAnalysisService, BudgetDTO} from "../../generated";
import {forkJoin, tap} from "rxjs";
import {ActivatedRoute} from "@angular/router";

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
        return this.dateToString(new Date(new Date().setMonth(index)));
      }
    )
  }

  private initializeExpenseBalanceHistory(sampleDates: string[]) {
    const requests = sampleDates.map(date =>
      // todo does this consider this start date? check on backend
      this.budgetAnalysisService.getMonthlyExpenseBalanceByDateAndId(date, this.budgetId)
    );

    return forkJoin(requests)
      .pipe(tap((balances: number[]) => {
        const balanceHistory: BalanceHistoryEntry[] = []
        balances.forEach((balance: number, index: number) => {
          balanceHistory.push({
            name: this.findMonthAndYearFromDate(sampleDates[index]),
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

    console.log(dateString)
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ].slice(0, currentMonth + 1);

    return `${monthNames[monthIndex]} ${year}`
  }

  private dateToString(date: Date) {
    // Specify the options for formatting the date and time
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };

// Get the formatted date and time in the local time zone
    const localDateTimeString = date.toLocaleString(undefined, options);
    console.log(localDateTimeString)
    return date.toLocaleString().substring(0, 10);
  }

  private addMonths(date: Date, months: number): Date {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + months);
    return newDate;
  }

  private getFirstDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private generateDatesForEveryMonth(start: Date, end: Date): string[] {
    // todo validation - start date must be before end date
    const numberOfMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) - 1;
    const monthsInBetween = Array.from({ length: numberOfMonths },
      (_, index) => this.getFirstDayOfMonth(this.addMonths(start, index + 1)));
    console.log(monthsInBetween)

    const temp = [start, ...monthsInBetween, end].map(date => this.dateToString(date));
    console.log(temp)
    return temp;
  }

}
