import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {getStartOfYear} from "../../utils/date-utils";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-budget-history-date-picker',
  templateUrl: './budget-history-date-picker.component.html',
  styleUrls: ['./budget-history-date-picker.component.scss']
})
export class BudgetHistoryDatePickerComponent {
  budgetHistoryFormGroup: FormGroup;

  @Output() chooseDatesEvent = new EventEmitter<[Date, Date]>()

  constructor(private formBuilder: FormBuilder, private formSnackBar: MatSnackBar) {
    this.budgetHistoryFormGroup = this.formBuilder.group({
        startDate: [getStartOfYear(new Date())],
        endDate: [new Date()]
      }
    )
  }

  chooseDates() {
    const formGroupData = this.budgetHistoryFormGroup.value
    const startDate = formGroupData.startDate;
    const endDate = formGroupData.endDate;

    if (startDate > endDate) {
      this.openErrorSnackbar("Start date should be earlier than the end date.")
    } else {
      this.chooseDatesEvent.emit([startDate, endDate])
    }
  }

  private openErrorSnackbar(message: string) {
    this.formSnackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: 'error-snackbar'
    });
  }

}
