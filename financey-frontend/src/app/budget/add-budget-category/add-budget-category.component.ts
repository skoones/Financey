import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from '@angular/material/snack-bar';
import {firstValueFrom, map, Observable, startWith} from "rxjs";
import {BudgetCategoryDTO, BudgetService} from "../../../generated";

enum AddCategoryResult {
  Success,
  Fail
}

@Component({
  selector: 'app-add-budget-category',
  templateUrl: './add-budget-category.component.html',
  styleUrls: ['./add-budget-category.component.scss']
})
export class AddBudgetCategoryComponent {
  categoryFormGroup: FormGroup;

  categoryListControl = new FormControl();
  @Output() addCategoryEventEmitter = new EventEmitter<boolean>();
  anyAdded: boolean = false;
  userId: string = "demo"; // todo placeholder userId

  filteredParentCategories = new Observable<BudgetCategoryDTO[]>();
  parentCategories: BudgetCategoryDTO[] = []

  constructor(private formBuilder: FormBuilder, private budgetService: BudgetService, private formSnackBar: MatSnackBar) {
    this.categoryFormGroup = this.formBuilder.group(({
      name: ['', Validators.required],
      parentCategory: ['']
    }))
  }

  ngOnInit(): void {
    this.filteredParentCategories = this.categoryListControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.budgetService.getCategories(this.userId).subscribe(data => {
      this.parentCategories = data;
    });
  }

  ngOnDestroy() {
    this.addCategoryEventEmitter.emit(this.anyAdded)
  }

  async addCategory(): Promise<AddCategoryResult> {
    const formGroupData = this.categoryFormGroup.value;
    const categoryName = this.categoryListControl.value;

    const categoryDto: BudgetCategoryDTO = {
      name: formGroupData.name,
      userId: this.userId,
      parentCategoryId: categoryName ? await this.findCategoryIdFromName(this.categoryListControl.value) : undefined
    }

    await firstValueFrom(this.budgetService.addCategory(categoryDto));
    this.anyAdded = true;
    return AddCategoryResult.Success;
  }

  private _filter(value: string): BudgetCategoryDTO[] {
    const filterValue = value.toLowerCase();

    return this.parentCategories.filter(category => category.name.toLowerCase().includes(filterValue));
  }

  submitCategoryForm() {
    if (this.categoryFormGroup.valid) {
      this.addCategory().then((result) => {
        if (result == AddCategoryResult.Success) {
          this.formSnackBar.open('Budget category saved.', 'Close', {
            duration: 5000,
          });
        }
      });
    } else {
      const hasMissingFields = Object.keys(this.categoryFormGroup.controls)
        .some((controlName) => {
          return !!this.categoryFormGroup.get(controlName)?.errors?.['required'];
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

  // todo mixin? (duplicate from add-budget)
  private async findCategoryIdFromName(categoryName: string): Promise<string> {
    const name = categoryName;

    return new Promise<string>((resolve) => {
      // todo placeholder userId
      this.budgetService.getCategoryByName(name, "demo")
        .subscribe((category: BudgetCategoryDTO) => {
          resolve(<string>category.id);
        })
    })
  }

}
