import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {BudgetCategoryDTO, BudgetDTO} from "../../../generated";
import {BudgetService} from "../../../generated";

type TopLevelBudget = BudgetDTO | BudgetCategoryDTO;

@Component({
  selector: 'app-budget-category-list',
  templateUrl: './budget-category-list.component.html',
  styleUrls: ['./budget-category-list.component.scss'],
})
export class BudgetCategoryListComponent implements OnInit {

  @Input() title = "Budgets"
  displayedColumns = ['name'];

  constructor(private budgetService: BudgetService, private router: Router) {}

  topLevelBudgets: TopLevelBudget[] = []

  previousTopLevelBudgetList: TopLevelBudget[] = []

  ngOnInit(): void {
    this.initializeTopLevelBudgetList().then(() => {});
  }


  chooseBudget(budget: BudgetDTO) {
    this.router.navigate([`/budgets/single/${budget.id}`],  { queryParams: { budget: JSON.stringify(budget) } });
  }

  async chooseTopLevelBudget(topLevelBudget: TopLevelBudget) {
    if (this.isExpandableCategory(topLevelBudget)) {
      const category = topLevelBudget as BudgetCategoryDTO;
      this.previousTopLevelBudgetList = this.topLevelBudgets;
      const fullSubcategories = await this.findFullCategories(category.subcategories);
      this.topLevelBudgets = (fullSubcategories as TopLevelBudget[]) || (await category.budgets as TopLevelBudget[]);
    } else {
      // todo
    }
  }

  async initializeTopLevelBudgetList() {
    // todo placeholder userId
    const categories = await firstValueFrom(this.budgetService.getCategories("demo")).then(async categories => {
      return this.findFullCategories(categories.filter(category => category.parentCategoryId == undefined));
    });

    const budgets = await firstValueFrom(this.budgetService.getUncategorizedBudgets("demo"));
    this.topLevelBudgets = (categories as TopLevelBudget[]).concat(budgets as TopLevelBudget[]);
  }


  isExpandableCategory(topLevelBudget: TopLevelBudget): boolean {
    if (this.isBudgetDto(topLevelBudget)) {
      return false;
    } else {
      const category = topLevelBudget as BudgetCategoryDTO;
      return this.hasElements(category.subcategories) || this.hasElements(category.budgets);
    }
  }

  hasElements<T>(array: T[] | undefined): boolean {
    return array != undefined && array.length > 0;
  }
  loadPreviousTopLevelBudgets() {
    this.topLevelBudgets = this.previousTopLevelBudgetList
    this.previousTopLevelBudgetList = []
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

  private isBudgetDto(topLevelBudget: TopLevelBudget) {
    return (topLevelBudget as BudgetDTO).budgetEntries !== undefined;
  }

}
