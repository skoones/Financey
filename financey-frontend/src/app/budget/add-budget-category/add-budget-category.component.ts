import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from '@angular/material/snack-bar';
import {firstValueFrom} from "rxjs";
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
  @Output() addCategoryEventEmitter = new EventEmitter<boolean>();
  anyAdded: boolean = false;
  userId: string = "demo"; // todo placeholder userId

  constructor(private formBuilder: FormBuilder, private budgetService: BudgetService, private formSnackBar: MatSnackBar) {
    this.categoryFormGroup = this.formBuilder.group(({
      name: ['', Validators.required],
    }))
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.addCategoryEventEmitter.emit(this.anyAdded)
  }

  async addCategory(): Promise<AddCategoryResult> {
    const formGroupData = this.categoryFormGroup.value;
    const categoryDto: BudgetCategoryDTO = {
      name: formGroupData.name,
      userId: this.userId,
    }

    await firstValueFrom(this.budgetService.addCategory(categoryDto));
    this.anyAdded = true;
    return AddCategoryResult.Success;
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

}
