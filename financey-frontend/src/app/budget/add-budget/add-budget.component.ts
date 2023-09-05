import {HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from '@angular/material/snack-bar';
import {firstValueFrom, map, Observable, startWith} from "rxjs";
import {BudgetCategoryDTO, BudgetDTO, BudgetService, FetchType} from "../../../generated";

enum AddBudgetResult {
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
    this.budgetService.getCategories(this.userId, FetchType.ALL).subscribe(data => {
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

  async addBudget(): Promise<[AddBudgetResult, string]> {
    const formGroupData = this.budgetFormGroup.value;
    const budgetDto: BudgetDTO = {
      name: formGroupData.name,
      userId: this.userId,
      categoryId: await this.findCategoryIdFromName(this.categoryListControl.value),
      investment: this.isInvestment
    }

    if (!budgetDto.investment || this.budgetCategoryIsInvestment(budgetDto.categoryId)) {
      try {
        await firstValueFrom(this.budgetService.addBudget(budgetDto, 'response'));
        this.anyAdded = true;
        return [AddBudgetResult.Success, "Budget saved."];
      } catch (error) {
        if (error instanceof HttpErrorResponse && error.status === HttpStatusCode.BadRequest) {
          return [AddBudgetResult.Fail, error.error];
        } else {
          return [AddBudgetResult.Fail, "Failed to save budget."];
        }
      }
    } else {
      return [AddBudgetResult.Fail, "Investment budget cannot be added to a non-investment category."]
    }

  }

  submitBudgetForm() {
    if (this.budgetFormGroup.valid) {
      this.addBudget().then((result) => {
        if (result[0] == AddBudgetResult.Success) {
          this.formSnackBar.open(result[1], 'Close', {
            duration: 5000,
          });
        } else {
          this.formSnackBar.open(result[1], 'Close', {
            duration: 5000,
            panelClass: 'error-snackbar'
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

  // todo mixin?
  async findCategoryIdFromName(categoryName: string): Promise<Promise<string> | undefined> {
    const name: string = categoryName;

    return categoryName ? new Promise<string>((resolve) => {
      // todo placeholder userId
      this.budgetService.getCategoryByName(name, "demo")
        .subscribe((category: BudgetCategoryDTO) => {
          resolve(<string>category.id);
        })
    }) : undefined;
  }

  private budgetCategoryIsInvestment(categoryId: string | undefined) {
    return (categoryId === undefined) || this.categories.filter(category =>
      category.id == categoryId).every(category => category.investment);
  }

}
