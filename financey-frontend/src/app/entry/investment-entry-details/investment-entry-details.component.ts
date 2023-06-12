import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {
  BudgetDTO,
  BudgetService,
  EntryCurrency,
  EntryService,
  EntryType,
  InvestmentEntryDTO
} from "../../../generated";
import {MatSnackBar} from "@angular/material/snack-bar";
import {amountValidator} from "../../validators/number-validators";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {firstValueFrom, tap} from "rxjs";
import {mapEntryTypeToIsBuy, mapIsBuyToEntryType} from "../../utils/entry-utils";

enum UpdateEntryResult {
  Success,
  Fail
}

@Component({
  selector: 'app-investment-entry-details',
  templateUrl: './investment-entry-details.component.html',
  styleUrls: ['./investment-entry-details.component.scss']
})
export class InvestmentEntryDetailsComponent {

  entryFormGroup?: FormGroup;
  budgets: BudgetDTO[] = []
  currencyEnum = EntryCurrency;
  @Input() investmentEntry?: InvestmentEntryDTO;
  @Input() budget?: BudgetDTO;
  userId: string = "demo"; // todo placeholder userId
  hasUpdates: boolean = false;
  @Output() updateEventEmitter = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder, private budgetService: BudgetService, private entryService: EntryService,
              private formSnackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.investmentEntry = data.entry;
    this.budget = data.budget
  }

  ngOnInit(): void {
    const isBuyValue = mapEntryTypeToIsBuy(this.investmentEntry?.entry.entryType);

    this.entryFormGroup = this.formBuilder.group({
      name: [this.investmentEntry?.entry.name, Validators.required],
      amount: [this.investmentEntry?.entry.value, Validators.required, amountValidator()],
      entryDate: [this.investmentEntry?.entry.date, new Date(), Validators.required],
      currency: [this.investmentEntry?.entry.currency, Validators.required],
      budgetForEntry: [this.budget],
      entryType: [this.investmentEntry?.entry.entryType],
      volume: [this.investmentEntry?.volume, Validators.required],
      marketPriceAtOperation: [this.investmentEntry?.marketPriceAtOperation, Validators.required],
      isBuy: [isBuyValue],
      isSell: [{value: !isBuyValue, disabled: isBuyValue || true}]
    })
  }

  ngOnDestroy() {
    this.updateEventEmitter.emit(this.hasUpdates)
  }

  changeEntryType(value: EntryType) {
    if (this.investmentEntry != undefined) {
      this.investmentEntry.entry.entryType = value;
    }
  }

  async updateEntry() {
    const formGroupData = this.entryFormGroup?.value;
    // todo validation like in add entry component, maybe mixin?
    const investmentEntryDTO: InvestmentEntryDTO = {
      id: this.investmentEntry?.id,
      entry: {
        value: formGroupData.amount,
        currency: formGroupData.currency,
        name: formGroupData.name,
        entryType: mapIsBuyToEntryType(formGroupData.isBuy),
        userId: this.userId,
        budgetId: this.budget?.id,
        date: formGroupData.entryDate
      },
      volume: formGroupData.volume,
      marketPriceAtOperation: formGroupData.marketPriceAtOperation
    };

    // todo maybe check is market price/volume/value are make sense?
    let result: string = "";
    await new Promise<void>((resolve) => this.entryService.updateInvestmentEntry(investmentEntryDTO).pipe(
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

    return result == `Updated entry with id ${this.investmentEntry?.id}.` ? UpdateEntryResult.Success : UpdateEntryResult.Fail;
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

  // todo delete investment
  async deleteEntry() {
    if (this.investmentEntry?.id != undefined) {
      await firstValueFrom(this.entryService.deleteEntriesByIds([this.investmentEntry.id]))
      this.hasUpdates = true;
      this.formSnackBar.open('Entry deleted.', 'Close', {
        duration: 5000,
      });
    }
  }

  getIsBuyDisabled(): boolean {
    return this.entryFormGroup?.get('isSell')?.value || false;
  }

  getIsSellDisabled(): boolean {
    return this.entryFormGroup?.get('isBuy')?.value || false;
  }

}
