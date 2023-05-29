import {Component, EventEmitter, Inject, Input, Optional, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from '@angular/material/snack-bar';
import {firstValueFrom, map, Observable, startWith} from "rxjs";
import {
  BudgetDTO,
  BudgetService,
  EntryCurrency,
  EntryDTO,
  EntryService,
  EntryType,
  InvestmentEntryDTO
} from "../../../generated";
import {amountValidator, volumeValidator} from "../../validators/number-validators";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

enum AddEntryResult {
  Success,
  Fail
}

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.scss']
})
export class AddEntryComponent {
  entryFormGroup: FormGroup;
  budgetListControl = new FormControl();
  @Input() budget?: BudgetDTO;
  @Output() addEntryEventEmitter = new EventEmitter<boolean>();
  filteredBudgets: Observable<BudgetDTO[]> = new Observable<BudgetDTO[]>();
  budgets: BudgetDTO[] = []
  currencyEnum = EntryCurrency;
  isInvestment: Boolean = false;
  isSellControl: FormControl;
  isBuyControl: FormControl;
  entryType: EntryType = EntryType.EXPENSE;
  anyAdded: boolean = false;

  userId: string = "demo"; // todo placeholder userId


  constructor(private formBuilder: FormBuilder, private budgetService: BudgetService, private entryService: EntryService,
              private formSnackBar: MatSnackBar, @Optional() @Inject(MAT_DIALOG_DATA) private data: any) {
    this.isBuyControl = new FormControl(true)
    this.isSellControl = new FormControl({value: false, disabled: true})

    this.entryFormGroup = this.formBuilder.group(({
      name: ['', Validators.required],
      amount: ['', Validators.required, amountValidator()],
      entryDate: [new Date(), Validators.required],
      currency: [EntryCurrency.PLN, Validators.required],
      budgetForEntry: [''],
      volume: [1, Validators.required, volumeValidator()],
      isBuy: this.isBuyControl,
      isSell: this.isSellControl,
    }))
    this.budget = data?.budget;
  }

  ngOnInit(): void {
    this.filteredBudgets = this.budgetListControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.budgetService.getUncategorizedBudgets(this.userId).subscribe(data => {
      this.budgets = data;
    });
  }

  ngOnDestroy() {
    this.addEntryEventEmitter.emit(this.anyAdded)
  }

  private _filter(value: string): BudgetDTO[] {
    const filterValue = value.toLowerCase();

    return this.budgets.filter(budget => budget.name.toLowerCase().includes(filterValue));
  }

  changeEntryType(value: EntryType) {
    this.entryType = value
  }

  async addEntry(): Promise<AddEntryResult> {
    const formGroupData = this.entryFormGroup.value;
    const entryDto: EntryDTO = {
      value: formGroupData.amount,
      currency: formGroupData.currency,
      name: formGroupData.name,
      entryType: this.isInvestment ? this.mapIsBuyToEntryType(this.isBuyControl.value) : this.entryType,
      userId: this.userId,
      budgetId: await this.findBudgetIdFromName(this.budgetListControl.value),
      date: formGroupData.entryDate
    }

    if (this.isInvestment) {
      const investmentEntryDto: InvestmentEntryDTO = {
        entry: entryDto,
        volume: formGroupData.volume,
        marketPriceAtOperation: this.getMarketPriceAtOperation(formGroupData.amount, formGroupData.volume)
      }

      if (this.entryBudgetIsInvestment(investmentEntryDto)) {
        await firstValueFrom(this.entryService.addInvestmentEntry(investmentEntryDto));
        this.anyAdded = true;
        return AddEntryResult.Success;
      } else {
        this.formSnackBar.open('Investment entry cannot be added to a non-investment budget.', 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
        return AddEntryResult.Fail;
      }
    } else {
      await firstValueFrom(this.entryService.addEntry(entryDto));
      this.anyAdded = true;
      return AddEntryResult.Success;
    }

  }

  private entryBudgetIsInvestment(investmentEntryDto: InvestmentEntryDTO): boolean {
    return this.budgets.filter(b => b.id == investmentEntryDto.entry.budgetId).every(b => b.investment);
  }

  private mapIsBuyToEntryType(isBuy: boolean): EntryType {
    if (isBuy) {
      return EntryType.EXPENSE;
    } else {
      return EntryType.INCOME;
    }
  }

  private getMarketPriceAtOperation(amount: number, volume: number): number {
    return amount / volume;
  }

  submitEntryForm() {
    if (this.entryFormGroup.valid) {
      this.addEntry().then((result) => {
        if (result == AddEntryResult.Success) {
          this.formSnackBar.open('Entry saved.', 'Close', {
            duration: 5000,
          });
        }
      });
    } else {
      const hasMissingFields = Object.keys(this.entryFormGroup.controls)
        .some((controlName) => {
          return !!this.entryFormGroup.get(controlName)?.errors?.['required'];
        })

      if (hasMissingFields) {
        this.openErrorSnackbar('Please fill out all required fields.');
      } else {
        Object.keys(this.entryFormGroup.controls)
          .forEach((controlName) => {
            this.handleEntryFormErrors(controlName);
          })
      }
    }
  }

  private handleEntryFormErrors(controlName: string) {
    if (this.entryFormGroup.get(controlName)?.errors?.['amountErrors']?.invalidNumber) {
      this.openErrorSnackbar('Amount should be a valid number.');
    } else if (this.entryFormGroup.get(controlName)?.errors?.['amountErrors']?.lessEqualZero) {
      this.openErrorSnackbar(`Amount should be greater than 0.`);
    } else if (this.entryFormGroup.get(controlName)?.errors?.['volumeErrors']?.invalidNumber) {
      this.openErrorSnackbar(`Volume should be a valid integer.`);
    } else if (this.entryFormGroup.get(controlName)?.errors?.['volumeErrors']?.lessEqualZero) {
      this.openErrorSnackbar(`Volume should be greater than 0.`);
    }
  }

  private openErrorSnackbar(message: string) {
    this.formSnackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: 'error-snackbar'
    });
  }

  async findBudgetIdFromName(budgetName: string): Promise<string> {
    const name: string = budgetName || this.budget?.name || "";

    return new Promise<string>((resolve) => {
      this.budgetService.getByName(name)
        .subscribe((budget: BudgetDTO) => {
          resolve(<string>budget.id);
        })
    })
  }

  isInvestmentOrHasNoBudget() {
    return this.budget == undefined || this.budget.investment;
  }

}
