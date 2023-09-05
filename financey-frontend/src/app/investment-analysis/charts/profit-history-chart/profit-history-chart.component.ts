import {Component, Input, OnInit} from '@angular/core';

type ProfitHistoryEntry = {
  name: string,
  value: number
}

@Component({
  selector: 'app-profit-history-chart',
  templateUrl: './profit-history-chart.component.html',
  styleUrls: ['./profit-history-chart.component.scss']
})
export class ProfitHistoryChartComponent implements OnInit {

  @Input() profitHistory?: ProfitHistoryEntry[];
  constructor() { }

  ngOnInit(): void {
  }

}
