import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-entry-exclude-toggle',
  templateUrl: './entry-exclude-toggle.component.html',
  styleUrls: ['./entry-exclude-toggle.component.scss']
})
export class EntryExcludeToggleComponent implements OnInit {

  @Output() excludeFromDateEvent = new EventEmitter<Date>();

  excludeFromDate = false;
  dateFormGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    this.dateFormGroup = this.fb.group({
      date: [null]
    });
  }

  ngOnInit(): void {
  }

  toggleExclude() {
    this.excludeFromDate = !this.excludeFromDate;

    if (!this.excludeFromDate) {
      this.dateFormGroup.reset();
      this.clearDate();
    }
  }

  emitDate() {
    this.excludeFromDateEvent.emit(this.dateFormGroup.get('date')?.value);
  }

  clearDate() {
    this.excludeFromDateEvent.emit(undefined)
  }
}
