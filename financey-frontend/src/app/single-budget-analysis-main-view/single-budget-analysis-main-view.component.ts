import { Component } from '@angular/core';
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
  expenseBalanceHistory: BalanceHistoryEntry[] = []

  constructor(private budgetAnalysisService: BudgetAnalysisService) {}

  ngOnInit() {
    this.expenseBalanceHistory = [{name: "Jan", value: 10}, {name: "Feb", value: 100}, {name: "Mar", value: 2000}]
    const sampleDates = [new Date(new Date().setMonth(6)).toISOString().substring(0, 10),
      new Date(new Date().setMonth(5)).toISOString().substring(0, 10),
      new Date(new Date().setMonth(4)).toISOString().substring(0, 10)]

    this.initializeExpenseBalanceHistory(sampleDates).subscribe(() => {
      console.log(this.expenseBalanceHistory);
    });
  }

  private initializeExpenseBalanceHistory(sampleDates: string[]) {
    const requests = sampleDates.map(date =>
      this.budgetAnalysisService.getMonthlyExpenseBalanceByDateAndId(date, "648957e2d360a34a57cc95c6")
    );

    return forkJoin(requests).pipe(
      tap((balances: number[]) => {
        balances.forEach((balance: number, index: number) => {
          this.expenseBalanceHistory.push({
            name: sampleDates[index],
            value: balance
          });
          console.log(this.expenseBalanceHistory)
        });
      })
    );
  }

}
