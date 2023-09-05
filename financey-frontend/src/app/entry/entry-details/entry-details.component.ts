import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BudgetDTO, BudgetService, EntryCurrency, EntryDTO, EntryService, EntryType} from "../../../generated";
import {MatSnackBar} from "@angular/material/snack-bar";
import {amountValidator} from "../../validators/number-validators";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {firstValueFrom, tap} from "rxjs";

enum UpdateEntryResult {
  Success,
  Fail
}

@Component({
  selector: 'app-entry-details',
  templateUrl: './entry-details.component.html',
  styleUrls: ['./entry-details.component.scss'],
})
export class EntryDetailsComponent {
  entryFormGroup?: FormGroup;
  budgets: BudgetDTO[] = []
  currencyEnum = EntryCurrency;
  @Input() entry?: EntryDTO;
  @Input() budget?: BudgetDTO;
  userId = localStorage.getItem('userId') || "";
  hasUpdates: boolean = false;
  @Output() updateEventEmitter = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder, private budgetService: BudgetService, private entryService: EntryService,
              private formSnackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.entry = data.entry;
    this.budget = data.budget;
  }

  ngOnInit(): void {
    this.entryFormGroup = this.formBuilder.group({
      name: [this.entry?.name, Validators.required],
      amount: [this.entry?.value, Validators.required, amountValidator()],
      entryDate: [this.entry?.date, new Date(), Validators.required],
      currency: [this.entry?.currency, Validators.required],
      budgetForEntry: [this.budget],
      entryType: [this.entry?.entryType]
    })
  }

  ngOnDestroy() {
    this.updateEventEmitter.emit(this.hasUpdates)
  }

  changeEntryType(value: EntryType) {
    if (this.entry != undefined) {
      this.entry.entryType = value;
    }
  }

  async updateEntry() {
    const formGroupData = this.entryFormGroup?.value;
    // todo validation like in add entry component, maybe mixin?
    const entryDto: EntryDTO = {
      id: this.entry?.id,
      value: formGroupData.amount,
      currency: formGroupData.currency,
      name: formGroupData.name,
      entryType: this.entry?.entryType,
      userId: this.userId,
      budgetId: this.budget?.id,
      date: formGroupData.entryDate,
    }

    let result: string = "";
    await new Promise<void>((resolve) => this.entryService.updateEntry(entryDto).pipe(
      tap((value: string) => {
        result = value;
      })
    ).subscribe(
      {
        complete: () => {
          resolve();
        }
      }
    ));

    return result == `Updated entry with id ${this.entry?.id}.` ? UpdateEntryResult.Success : UpdateEntryResult.Fail;
  }

  submitEntryForm() {
    if (this.entryFormGroup?.valid) {
      this.updateEntry().then((result) => {
        if (result == UpdateEntryResult.Success) {
          this.formSnackBar.open('Entry updated.', 'Close', {
            duration: 5000,
          });
          this.hasUpdates = true;
        }
      });
    } else {
      this.formSnackBar.open('Please fill out all required fields.', 'Close', {
        duration: 5000,
        panelClass: 'error-snackbar'
      });
    }
  }

  getIncomeCheckboxIsChecked(): boolean {
    return this.entry?.entryType == EntryType.INCOME;
  }

  async deleteEntry() {
    if (this.entry?.id != undefined) {
      await firstValueFrom(this.entryService.deleteEntriesByIds([this.entry.id]))
      this.hasUpdates = true;
      this.formSnackBar.open('Entry deleted.', 'Close', {
        duration: 5000,
      });
    }
  }

}
