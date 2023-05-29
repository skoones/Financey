import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from '@angular/material/snack-bar';
import {firstValueFrom, map, Observable, startWith} from "rxjs";
import {BudgetCategoryDTO, BudgetDTO, BudgetService} from "../../../generated";

enum AddCategoryResult {
  Success,
  Fail
}

@Component({
  selector: 'app-add-budget',
  templateUrl: './add-budget.component.html',
  styleUrls: ['./add-budget.component.scss']
})
export class AddBudgetComponent {
  budgetFormGroup: FormGroup;
  categoryListControl = new FormControl();
  @Output() addCategoryEventEmitter = new EventEmitter<boolean>();

  anyAdded: boolean = false;
  userId: string = "demo"; // todo placeholder userId
  isInvestment = false;

  filteredCategories: Observable<BudgetCategoryDTO[]> = new Observable<BudgetCategoryDTO[]>();
  categories: BudgetCategoryDTO[] = []

  constructor(private formBuilder: FormBuilder, private budgetService: BudgetService, private formSnackBar: MatSnackBar) {
    this.budgetFormGroup = this.formBuilder.group(({
      name: ['', Validators.required],
      categoryForBudget: ['']
    }))
  }

  ngOnInit(): void {
    this.filteredCategories = this.categoryListControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.budgetService.getCategories(this.userId).subscribe(data => {
      this.categories = data;
    });
  }

  ngOnDestroy() {
    this.addCategoryEventEmitter.emit(this.anyAdded)
  }

  // todo mixin?
  private _filter(value: string): BudgetCategoryDTO[] {
    const filterValue = value.toLowerCase();

    return this.categories.filter(category => category.name.toLowerCase().includes(filterValue));
  }

  async addBudget(): Promise<AddCategoryResult> {
    const formGroupData = this.budgetFormGroup.value;
    console.log(formGroupData.categoryForBudget)
    const budgetDto: BudgetDTO = {
      name: formGroupData.name,
      userId: this.userId,
      categoryId: await this.findCategoryIdFromName(this.categoryListControl.value),
      investment: this.isInvestment
    }

    console.log("got csateoru: " + budgetDto.categoryId)
    await firstValueFrom(this.budgetService.addBudget(budgetDto));
    this.anyAdded = true;
    return AddCategoryResult.Success;
  }

  submitBudgetForm() {
    if (this.budgetFormGroup.valid) {
      this.addBudget().then((result) => {
        if (result == AddCategoryResult.Success) {
          this.formSnackBar.open('Budget saved.', 'Close', {
            duration: 5000,
          });
        }
      });
    } else {
      const hasMissingFields = Object.keys(this.budgetFormGroup.controls)
        .some((controlName) => {
          return !!this.budgetFormGroup.get(controlName)?.errors?.['required'];
        })

      if (hasMissingFields) {
        this.openErrorSnackbar('Please fill out all required fields.');
      }
    }
  }

  private openErrorSnackbar(message: string) {
    this.formSnackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: 'error-snackbar'
    });
  }

  async findCategoryIdFromName(categoryName: string): Promise<string> {
    const name: string = categoryName;

    return new Promise<string>((resolve) => {
      this.budgetService.getCategoryByName(name)
        .subscribe((category: BudgetCategoryDTO) => {
          resolve(<string>category.id);
        })
    })
  }

}
