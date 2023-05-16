import { Component } from '@angular/core';
import {FormControl} from "@angular/forms";
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
  filteredBudgets: Observable<BudgetDTO[]>;
  budgets: BudgetDTO[] = []
  selectedCurrency: EntryCurrency = EntryCurrency.PLN;
  currencyEnum = EntryCurrency;
  isInvestment: Boolean = false;
  isSell: Boolean = false;
  isBuy: Boolean = true;
  entryType: EntryType = EntryType.EXPENSE

  constructor(private budgetService: BudgetService) {
    this.filteredBudgets = new Observable<BudgetDTO[]>()
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
