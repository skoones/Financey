import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {firstValueFrom, map, Observable, startWith} from "rxjs";
import {BudgetCategoryDTO, BudgetDTO, BudgetService} from "../../../generated";

enum AddCategoryResult {
  Success,
  Fail
}

@Component({
  selector: 'app-budget-details',
  templateUrl: './budget-details.component.html',
  styleUrls: ['./budget-details.component.scss']
})
export class BudgetDetailsComponent {
  budgetFormGroup: FormGroup = new FormGroup({});
  @Input() budget?: BudgetDTO
  @Input() categoryId?: string
  @Output() updateBudgetEventEmitter = new EventEmitter<boolean>();

  hasUpdates: boolean = false;
  userId: string = "demo"; // todo placeholder userId
  isInvestment = false;

  constructor(private formBuilder: FormBuilder, private budgetService: BudgetService, private formSnackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.budget = data.budget
    this.categoryId = data.categoryId

    this.budgetFormGroup = this.formBuilder.group(({
      name: [this.budget?.name, Validators.required],
    }));
    this.isInvestment = this.budget?.investment || false;
  }


  ngOnInit(): void {
    const categoryId = this.budget?.categoryId || "";
    this.initializeBudgetForm(categoryId);
  }

  ngOnDestroy() {
    this.updateBudgetEventEmitter.emit(this.hasUpdates)
  }

  async updateBudget(): Promise<AddCategoryResult> {
    const formGroupData = this.budgetFormGroup.value;
    const budgetDto: BudgetDTO = {
      id: this.budget?.id,
      name: formGroupData.name,
      userId: this.userId,
      categoryId: this.categoryId,
      investment: this.isInvestment
    }

    await firstValueFrom(this.budgetService.updateBudget(budgetDto));
    this.hasUpdates = true;
    return AddCategoryResult.Success;
  }

  submitBudgetForm() {
    if (this.budgetFormGroup.valid) {
      this.updateBudget().then((result) => {
        if (result == AddCategoryResult.Success) {
          this.formSnackBar.open('Budget updated.', 'Close', {
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

  private initializeBudgetForm(categoryId: string) {
    this.budgetFormGroup.setValue({
      name: [this.budget?.name],
    });
  }

  private openErrorSnackbar(message: string) {
    this.formSnackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: 'error-snackbar'
    });
  }

  async deleteBudget() {
    if (this.budget?.id != undefined) {
      await firstValueFrom(this.budgetService.deleteBudgetsByIds(([this.budget.id])))
      this.hasUpdates = true;
      this.formSnackBar.open('Budget deleted.', 'Close', {
        duration: 5000,
      });
    }
  }
}
