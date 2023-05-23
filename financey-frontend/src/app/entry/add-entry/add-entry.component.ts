import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {BudgetService} from "../../../generated";
import {BudgetDTO, EntryCurrency, EntryDTO, EntryService, EntryType, InvestmentEntryDTO} from "../../../generated";

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

  constructor(private formBuilder: FormBuilder, private budgetService: BudgetService, private entryService: EntryService) {
    this.isBuyControl = new FormControl(true)
    this.isSellControl = new FormControl({value: false, disabled: true})

    this.entryFormGroup = this.formBuilder.group(({
      name: ['', Validators.required],
      amount: ['', Validators.required], // todo async validator for value validation
      entryDate: [new Date(), Validators.required],
      currency: [EntryCurrency.PLN, Validators.required],
      budgetForEntry: [''],
      volume: [1, Validators.required],
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

  async addEntry() {
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

        this.entryService.addInvestmentEntry(investmentEntryDto).subscribe()
      } else {
        this.entryService.addEntry(entryDto).subscribe()
      }

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
      this.addEntry().then(() => {});
    }
    // todo some snackbar about invalid form?
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
