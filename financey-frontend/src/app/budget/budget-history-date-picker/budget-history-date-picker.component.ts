import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-budget-history-date-picker',
  templateUrl: './budget-history-date-picker.component.html',
  styleUrls: ['./budget-history-date-picker.component.scss']
})
export class BudgetHistoryDatePickerComponent {
  budgetHistoryFormGroup: FormGroup;

  @Output() chooseDatesEvent = new EventEmitter<[Date, Date]>()

  constructor(private formBuilder: FormBuilder) {
    this.budgetHistoryFormGroup = this.formBuilder.group({
        startDate: [this.findStartOfYear()],
        endDate: [this.findEndOfYear()]
      }
    )
  }

  chooseDates() {
    const formGroupData = this.budgetHistoryFormGroup.value
    this.chooseDatesEvent.emit([formGroupData.startDate, formGroupData.endDate])
  }

  private findStartOfYear() {
    const currentYear = new Date().getFullYear();
    return new Date(currentYear, 0, 1);
  }

  private findEndOfYear() {
    const currentYear = new Date().getFullYear();
    return new Date(currentYear, 11, 31);
  }

}
