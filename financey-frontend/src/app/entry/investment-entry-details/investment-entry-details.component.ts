import {Component, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-investment-entry-details',
  templateUrl: './investment-entry-details.component.html',
  styleUrls: ['./investment-entry-details.component.scss']
})
export class InvestmentEntryDetailsComponent {
  updateEventEmitter = new EventEmitter<boolean>();

}