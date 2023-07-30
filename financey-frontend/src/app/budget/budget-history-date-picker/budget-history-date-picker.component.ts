import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {getStartOfYear} from "../../utils/date-utils";

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
        startDate: [getStartOfYear(new Date())],
        endDate: [new Date()]
      }
    )
  }

  chooseDates() {
    const formGroupData = this.budgetHistoryFormGroup.value
    this.chooseDatesEvent.emit([formGroupData.startDate, formGroupData.endDate])
  }

}
