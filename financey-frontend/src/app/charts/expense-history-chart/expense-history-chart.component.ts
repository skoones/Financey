import {Component, Input, OnInit} from '@angular/core';

type BalanceHistoryEntry = {
  name: string,
  value: any
}

@Component({
  selector: 'app-expense-history-chart',
  templateUrl: './expense-history-chart.component.html',
  styleUrls: ['./expense-history-chart.component.scss']
})
export class ExpenseHistoryChartComponent implements OnInit {

  @Input() expenseBalanceHistory?: BalanceHistoryEntry[];

  constructor() { }

  ngOnInit(): void {
  }


}
