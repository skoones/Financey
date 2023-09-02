import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-entry-exclude-toggle',
  templateUrl: './entry-exclude-toggle.component.html',
  styleUrls: ['./entry-exclude-toggle.component.scss']
})
export class EntryExcludeToggleComponent implements OnInit {

  @Output() excludeFromDateEvent = new EventEmitter<boolean>();
  @Output() dateChange = new EventEmitter<Date>();

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
    this.excludeFromDateEvent.emit(this.excludeFromDate);

    if (!this.excludeFromDate) {
      this.dateFormGroup.reset();
    }
  }

  emitDate() {
    this.dateChange.emit(this.dateFormGroup.get('date')?.value);
  }

}
