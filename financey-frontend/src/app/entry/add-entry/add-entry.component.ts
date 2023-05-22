import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {BudgetService} from "../../../generated/api/budget.service";
import {BudgetDTO, EntryCurrency, EntryDTO, EntryService, EntryType} from "../../../generated";
import {BUDGETS_PATH} from "../../constants/path-constants";

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
        entryType: this.entryType,
        userId: this.userId,
        budgetId: await this.findBudgetIdFromName(this.budgetListControl.value),
        date: formGroupData.entryDate
      }
      console.log(entryDto)
      this.entryService.addEntry(entryDto).subscribe()
  }

  submitEntryForm() {
    if (this.entryFormGroup.valid) {
      this.addEntry().then(() => {});
    }
    // todo some snackbar about invalid form?
  }

  async findBudgetIdFromName(budgetName: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.budgetService.getByName(budgetName)
        .subscribe((budget: BudgetDTO) => {
          resolve(<string>budget.id);
        })
    })
  }

}
