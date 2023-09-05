import {Component, Input, OnInit} from '@angular/core';

type BalanceHistoryEntry = {
  name: string,
  value: any
}

@Component({
  selector: 'app-balance-history-chart',
  templateUrl: './balance-history-chart.component.html',
  styleUrls: ['./balance-history-chart.component.scss']
})
export class BalanceHistoryChartComponent implements OnInit {

  @Input() expenseBalanceHistory?: BalanceHistoryEntry[];

  constructor() { }

  ngOnInit(): void {
  }


}
