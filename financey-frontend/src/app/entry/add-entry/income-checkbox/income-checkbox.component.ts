import {Component, EventEmitter, Output} from '@angular/core';
import {EntryType} from "../../../../generated";

@Component({
  selector: 'income-checkbox',
  templateUrl: './income-checkbox.component.html',
  styleUrls: ['./income-checkbox.component.scss']
})
export class IncomeCheckboxComponent {
  isChecked = false;

  @Output() valueChangeEvent = new EventEmitter<EntryType>();

  changeEntryType() {
    this.valueChangeEvent.emit(this.isChecked ? EntryType.INCOME : EntryType.EXPENSE)
  }

}
