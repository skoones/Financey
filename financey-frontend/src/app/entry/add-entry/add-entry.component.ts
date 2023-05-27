import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from '@angular/material/snack-bar';
import {map, Observable, startWith} from "rxjs";
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
  filteredBudgets: Observable<BudgetDTO[]>;
  budgets: BudgetDTO[] = []
  currencyEnum = EntryCurrency;
  isInvestment: Boolean = false;
  isSellControl: FormControl;
  isBuyControl: FormControl;
  entryType: EntryType = EntryType.EXPENSE;

  userId: string = "demo"; // todo placeholder userId

  constructor(private formBuilder: FormBuilder, private budgetService: BudgetService, private entryService: EntryService,
              private formSnackBar: MatSnackBar) {
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
    this.filteredBudgets = new Observable<BudgetDTO[]>()
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
        await this.entryService.addInvestmentEntry(investmentEntryDto);
        return AddEntryResult.Success;
      } else {
        this.formSnackBar.open('Investment entry cannot be added to a non-investment budget.', 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
        return AddEntryResult.Fail;
      }
    } else {
      await this.entryService.addEntry(entryDto);
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
            console.log(this.entryFormGroup.get(controlName)?.errors)
            if (this.entryFormGroup.get(controlName)?.errors?.['invalidAmount']) {
              this.openErrorSnackbar('Amount should be a valid number.');
            } else if (this.entryFormGroup.get(controlName)?.errors?.['negativeAmount']) {
              this.openErrorSnackbar(`Amount should not be negative.`);
            }
          })
      }
    }
  }

  private openErrorSnackbar(message: string) {
    this.formSnackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: 'error-snackbar'
    });
  }

  async findBudgetIdFromName(budgetName: string): Promise<string> {
    return new Promise<string>((resolve) => {
      this.budgetService.getByName(budgetName)
        .subscribe((budget: BudgetDTO) => {
          resolve(<string>budget.id);
        })
    })
  }

}
