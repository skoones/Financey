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
  anyChanged: boolean = false;
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
    this.addCategoryEventEmitter.emit(this.anyChanged)
  }

  private _filter(value: string): BudgetCategoryDTO[] {
    const filterValue = value.toLowerCase();

    return this.parentCategories.filter(category => category.name.toLowerCase().includes(filterValue));
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
    // this.budgetService.deleteCategoryById(this.)
    this.anyChanged = true;
  }

  async updateCategory() {
    if (this.categoryFormGroup.valid) {
      const formGroupData = this.categoryFormGroup.value;
      const categoryName = this.categoryListControl.value;
      let categoryId = "";
      await this.findCategoryIdFromName(categoryName).then((id) => {
        categoryId = id
      })

      const categoryDto: BudgetCategoryDTO = {
        id: categoryId,
        name: formGroupData.name,
        userId: this.userId,
        parentCategoryId: categoryName ? categoryId : undefined,
        investment: this.isInvestment
      }

      console.log(categoryDto)
      this.budgetService.updateBudgetCategory(categoryDto);
      this.anyChanged = true;
    }

  }

}
