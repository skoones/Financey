import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {Location} from '@angular/common';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {AddBudgetCategoryComponent} from "../add-budget-category/add-budget-category.component";
import {BudgetCategoryListComponent} from "../budget-category-list/budget-category-list.component";
import {AddBudgetComponent} from "../add-budget/add-budget.component";
import {BudgetCategoryDetailsComponent} from "../budget-category-details/budget-category-details.component";

@Component({
  selector: 'app-all-budgets-view',
  templateUrl: './all-budgets-view.component.html',
  styleUrls: ['./all-budgets-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AllBudgetsViewComponent {

  @ViewChild(BudgetCategoryListComponent, {static: false})
  budgetCategoryListComponent?: BudgetCategoryListComponent;

  constructor(private route: ActivatedRoute, private location: Location, private dialog: MatDialog) {
  }


  openAddCategoryPopup() {
    const dialogRef = this.dialog.open(AddBudgetCategoryComponent, {
      data: { parentCategoryName: this.budgetCategoryListComponent?.currentCategoryName },
      panelClass: "add-category-dialog"
    });

    dialogRef.componentInstance.addCategoryEventEmitter.subscribe((anyAdded) => {
      if (anyAdded) {
        this.budgetCategoryListComponent?.initializeTopLevelBudgetList();
      }
    });
  }

  openAddBudgetPopup() {
    const dialogRef = this.dialog.open(AddBudgetComponent, {
      panelClass: "add-budget-dialog"
    });

    dialogRef.componentInstance.addCategoryEventEmitter.subscribe((anyAdded) => {
      if (anyAdded) {
        this.budgetCategoryListComponent?.initializeTopLevelBudgetList();
      }
    });
  }

  openCategoryDetailsPopup() {
    const dialogRef = this.dialog.open(BudgetCategoryDetailsComponent, {
      data: {
        categoryName: this.budgetCategoryListComponent?.currentCategoryName,
        parentCategoryName: this.budgetCategoryListComponent?.getParentCategoryName()
      }
    });

    dialogRef.componentInstance.addCategoryEventEmitter.subscribe((anyAdded) => {
      if (anyAdded) {
        this.budgetCategoryListComponent?.initializeTopLevelBudgetList();
      }
    });
  }
}
