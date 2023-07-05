import {Component, EventEmitter, Input, Output} from '@angular/core';
import {EntryType} from "../../../../generated";

@Component({
  selector: 'expense-checkbox',
  templateUrl: './expense-checkbox.component.html',
  styleUrls: ['./expense-checkbox.component.scss'],
})
export class ExpenseCheckboxComponent {

  @Input() isChecked: boolean = true;
  @Output() valueChangeEvent = new EventEmitter<EntryType>();

  changeEntryType() {
    this.valueChangeEvent.emit(this.isChecked ? EntryType.EXPENSE : EntryType.INCOME)
  }

}
