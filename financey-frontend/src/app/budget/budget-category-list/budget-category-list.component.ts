import {Component, Input, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {BudgetCategoryDTO, BudgetDTO, FetchType} from "../../../generated";
import {BudgetService} from "../../../generated";
import {BudgetDetailsComponent} from "../budget-details/budget-details.component";

type TopLevelBudget = BudgetDTO | BudgetCategoryDTO;

@Component({
  selector: 'app-budget-category-list',
  templateUrl: './budget-category-list.component.html',
  styleUrls: ['./budget-category-list.component.scss'],
})
export class BudgetCategoryListComponent implements OnInit {

  @Input() title = "Budgets"
  displayedColumns = ['name'];
  constructor(private budgetService: BudgetService, private router: Router, private dialog: MatDialog) {}
  topLevelBudgets: TopLevelBudget[] = []
  levelToBudgetList = new Map<number, TopLevelBudget[]>()
  levelToCategoryName = new Map<number, string>([[0, ""]])
  currentLevel = 0
  currentCategoryName = ""

  userId = localStorage.getItem('userId') || "";

  ngOnInit(): void {
    this.initializeTopLevelBudgetList().then(() => {});
  }

  async chooseTopLevelBudget(topLevelBudget: TopLevelBudget) {
    if (!this.isBudgetDto(topLevelBudget)) {
      const category = topLevelBudget as BudgetCategoryDTO;
      const fullSubcategories = await this.findFullCategories(category.subcategories);

      this.topLevelBudgets = (fullSubcategories as TopLevelBudget[]).concat(category.budgets as TopLevelBudget[]);

      const newLevel = this.currentLevel + 1
      this.levelToBudgetList.set(newLevel, this.topLevelBudgets)
      this.levelToCategoryName.set(newLevel, category.name)

      this.currentLevel = newLevel
      this.currentCategoryName = category.name
    } else {
      const dialogRef = this.dialog.open(BudgetDetailsComponent, {
        data: { budget: topLevelBudget, categoryId: (topLevelBudget as BudgetDTO).categoryId }
      });

      dialogRef.componentInstance.updateBudgetEventEmitter.subscribe((anyUpdated) => {
        if (anyUpdated) {
          this.initializeTopLevelBudgetList();
        }
      });
      dialogRef.componentInstance.closePopup.subscribe(() => {
        this.dialog.closeAll()
      });
    }
  }

  async initializeTopLevelBudgetList() {
    const categories = await firstValueFrom(this.budgetService.getCategories(this.userId, FetchType.ALL)).then(async categories => {
      return this.findFullCategories(categories.filter(category => category.parentCategoryId == undefined));
    });

    const budgets = await firstValueFrom(this.budgetService.getUncategorizedBudgets(this.userId));
    this.topLevelBudgets = (categories as TopLevelBudget[]).concat(budgets as TopLevelBudget[]);
    this.levelToBudgetList.set(this.currentLevel, this.topLevelBudgets);
  }

  loadPreviousTopLevelBudgets() {
    this.topLevelBudgets = this.levelToBudgetList.get(this.currentLevel - 1) || [];
    this.currentCategoryName = this.levelToCategoryName.get(this.currentLevel - 1) || ""
    this.currentLevel = this.currentLevel - 1;
  }

  isBudgetDto(topLevelBudget: TopLevelBudget) {
    return (topLevelBudget as BudgetDTO).budgetEntries !== undefined;
  }

  getParentCategoryName(): string {
    return this.levelToCategoryName.get(this.currentLevel - 1) || "";
  }

  private findFullCategories(categories: BudgetCategoryDTO[] | undefined): Promise<BudgetCategoryDTO[]> | undefined {
    if (categories == undefined) {
      return categories;
    }

    const categoryPromises = categories.map(async category => {
      const categoryId = category?.id || "";
      const subcategories = await this.budgetService.getCategoriesByParentId(categoryId).toPromise();
      const budgets = await this.budgetService.getAllByCategoryId(categoryId).toPromise();

      return {...category, subcategories, budgets};
    });

    return Promise.all(categoryPromises);
  }

}
