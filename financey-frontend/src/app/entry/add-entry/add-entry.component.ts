import { Component } from '@angular/core';
import {FormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {BudgetService} from "../../../generated/api/budget.service";
import {BudgetDTO, EntryCurrency} from "../../../generated";

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.scss']
})
export class AddEntryComponent {
  budgetListControl = new FormControl('');
  filteredBudgets: Observable<BudgetDTO[]> | undefined; // todo how to initialize this?
  budgets: BudgetDTO[] = []
  selectedCurrency: EntryCurrency = EntryCurrency.PLN;
  currencyEnum = EntryCurrency; // todo what is this type?
  isInvestment: Boolean = false;
  isSell: Boolean = false;
  isBuy: Boolean = true;

  constructor(private budgetService: BudgetService) {}

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


}
