import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {firstValueFrom, map, Observable, startWith} from "rxjs";
import {BudgetCategoryDTO, BudgetService, FetchType} from "../../../generated";
import {BudgetCategoryListComponent} from "../budget-category-list/budget-category-list.component";

enum AddCategoryResult {
  Success,
  Fail
}

@Component({
  selector: 'app-budget-category-details',
  templateUrl: './budget-category-details.component.html',
  styleUrls: ['./budget-category-details.component.scss']
})
export class BudgetCategoryDetailsComponent {
  categoryFormGroup: FormGroup;
  categoryListControl: FormControl;

  @Input() categoryName = "";
  @Output() addCategoryEventEmitter = new EventEmitter<boolean>();
  anyAdded: boolean = false;
  userId = localStorage.getItem('userId') || "";

  filteredParentCategories = new Observable<BudgetCategoryDTO[]>();
  parentCategories: BudgetCategoryDTO[] = []
  isInvestment = false;

  constructor(private formBuilder: FormBuilder, private budgetService: BudgetService, private formSnackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.categoryName = data.categoryName;
    this.categoryListControl = new FormControl(data.parentCategoryName);

    this.categoryFormGroup = this.formBuilder.group(({
      name: [this.categoryName, Validators.required],
    }))
  }

  ngOnInit(): void {
    this.filteredParentCategories = this.categoryListControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.budgetService.getCategories(this.userId, FetchType.ALL).subscribe(data => {
      this.parentCategories = data;
    });
  }

  ngOnDestroy() {
    this.addCategoryEventEmitter.emit(this.anyAdded)
  }

  async addCategory(): Promise<AddCategoryResult> {
    // todo update/delete instead
    const formGroupData = this.categoryFormGroup.value;
    const categoryName = this.categoryListControl.value;

    const categoryDto: BudgetCategoryDTO = {
      name: formGroupData.name,
      userId: this.userId,
      parentCategoryId: categoryName ? await this.findCategoryIdFromName(this.categoryListControl.value) : undefined,
      investment: this.isInvestment // todo fix
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
      this.budgetService.getCategoryByName(name, this.userId)
        .subscribe((category: BudgetCategoryDTO) => {
          resolve(<string>category.id);
        })
    })
  }

  deleteCategory() {
    // todo implement
  }
}
