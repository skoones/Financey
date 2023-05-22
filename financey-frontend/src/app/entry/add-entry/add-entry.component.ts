import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {BudgetService} from "../../../generated/api/budget.service";
import {BudgetDTO, EntryCurrency, EntryDTO, EntryService, EntryType} from "../../../generated";

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.scss']
})
export class AddEntryComponent {
  // todo FormGroup as in chatgpt answer
  entryFormGroup: FormGroup;
  budgetListControl = new FormControl('');
  filteredBudgets: Observable<BudgetDTO[]>;
  budgets: BudgetDTO[] = []
  currencyEnum = EntryCurrency;
  isInvestment: Boolean = false;
  isSellControl: FormControl;
  isBuyControl: FormControl;
  entryType: EntryType = EntryType.EXPENSE
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
      budget: ['']
    }))
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

  addEntry() {
      const formGroupData = this.entryFormGroup.value;
      const entryDto: EntryDTO = {
        value: formGroupData.amount,
        currency: formGroupData.currency,
        name: formGroupData.name,
        entryType: this.entryType,
        userId: "demo", // todo placeholder userId,
        budgetId: "6461f9306e1cef0556956f10", // todo real value xd
        // budgetId: this.budgetService.getByName(formGroupData.budget), // todo
        date: formGroupData.entryDate
      }
      console.log(entryDto)
      this.entryService.addEntry(entryDto).subscribe()
  }

  submitEntryForm() {
    if (this.entryFormGroup.valid) {
      this.addEntry();
    }
    // todo some snackbar about invalid form?
  }

}
