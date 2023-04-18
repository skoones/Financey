import { Component } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {BudgetService} from "../../../generated/api/budget.service";
import {BudgetDTO, EntryCurrency, EntryType} from "../../../generated";

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.scss']
})
export class AddEntryComponent {
  EntryType = EntryType;
  budgetListControl = new FormControl('');
  filteredBudgets: Observable<BudgetDTO[]> | undefined; // todo how to initialize this?
  budgets: BudgetDTO[] = []
  selectedCurrency: EntryCurrency = EntryCurrency.PLN;
  currencyEnum = EntryCurrency;
  isInvestment: Boolean = false;
  isSell: Boolean = false;
  isBuy: Boolean = true;


  form: FormGroup | undefined;
  entryTypeControl: FormControl | undefined;

  entryType: EntryType;
  isChecked = false;

  constructor(private budgetService: BudgetService) {
    this.entryType = EntryType.EXPENSE
  }

  ngOnInit(): void {

    this.filteredBudgets = this.budgetListControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.budgetService.getUncategorizedBudgets("demo").subscribe(data => { // todo placeholder userId
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

}
