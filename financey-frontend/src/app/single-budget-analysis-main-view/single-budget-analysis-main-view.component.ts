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

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ].slice(0, currentMonth + 1);

    return `${monthNames[monthIndex]} ${year}`
  }

}
