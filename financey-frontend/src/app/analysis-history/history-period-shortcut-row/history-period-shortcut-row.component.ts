import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HistoryPeriod} from "./history-period";
import {getFirstDayOfMonth} from "../../utils/date-utils";

@Component({
  selector: 'app-history-period-shortcut-row',
  templateUrl: './history-period-shortcut-row.component.html',
  styleUrls: ['./history-period-shortcut-row.component.scss']
})
export class HistoryPeriodShortcutRowComponent implements OnInit {

  HistoryPeriod = HistoryPeriod;

  @Output() periodChange = new EventEmitter<[Date, Date]>();

  constructor() { }

  ngOnInit(): void {
  }


  emitNewPeriod(period: HistoryPeriod) {
    switch(period) {
      case HistoryPeriod.MONTH:
        this.periodChange.emit([getFirstDayOfMonth(new Date()), new Date()]);
        break;
      case HistoryPeriod.THREE_MONTHS:
        this.periodChange.emit([getFirstDayOfMonth(this.getDateMinusMonths(new Date(), 3)), new Date()]);
        break;
      case HistoryPeriod.SIX_MONTHS:
        this.periodChange.emit([getFirstDayOfMonth(this.getDateMinusMonths(new Date(), 6)), new Date()]);
        break;
      case HistoryPeriod.YEAR:
        this.periodChange.emit([getFirstDayOfMonth(this.getDateMinusMonths(new Date(), 12)), new Date()]);
        break;
      default:
        break;
    }


  }

  private getDateMinusMonths(date: Date, numberOfMonths: number) {
    const currentDate = new Date(date);

    const lastThreeMonthsIndices = Array.from({ length: numberOfMonths }, (_, index) => index);
    const lastThreeMonthsFirstDays = lastThreeMonthsIndices.map((i) => {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);
      return getFirstDayOfMonth(date);
    });

    return lastThreeMonthsFirstDays[numberOfMonths - 1];
  }

}
