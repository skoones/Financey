import {Component} from '@angular/core';
import {BudgetAnalysisService} from "../../generated";
import {forkJoin, tap} from "rxjs";

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
  expenseBalanceHistory?: BalanceHistoryEntry[]

  constructor(private budgetAnalysisService: BudgetAnalysisService) {}

  ngOnInit() {
    // todo choosing dates by user
    this.initializeExpenseBalanceHistory(this.findDatesForAnalysis()).subscribe(() => {
      console.log(this.expenseBalanceHistory);
    });
  }

  private findDatesForAnalysis() {
    return Array.from(
      { length: new Date().getMonth() + 1 },
      (_, index) => {
        return new Date(new Date().setMonth(index)).toISOString().substring(0, 10);
      }
    )
  }

  private initializeExpenseBalanceHistory(sampleDates: string[]) {
    const requests = sampleDates.map(date =>
      this.budgetAnalysisService.getMonthlyExpenseBalanceByDateAndId(date, "648970cdd8695652f3922328") // todo pass in the id from parent
    );

    return forkJoin(requests)
      .pipe(tap((balances: number[]) => {
        const balanceHistory: BalanceHistoryEntry[] = []
        balances.forEach((balance: number, index: number) => {
          console.log("balance with index 0: " + index + " " + balance)
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

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ].slice(0, currentMonth + 1);

    return `${monthNames[monthIndex]} ${year}`
  }

}
