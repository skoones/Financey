import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {BudgetCategoryDTO, BudgetDTO} from "../../../generated";
import {BudgetService} from "../../../generated";

type TopLevelBudget = BudgetDTO | BudgetCategoryDTO;

@Component({
  selector: 'app-budget-category-list',
  templateUrl: './budget-category-list.component.html',
  styleUrls: ['./budget-category-list.component.scss']
})
export class BudgetCategoryListComponent implements OnInit {

  @Input() title = "Budgets"
  displayedColumns = ['name'];

  constructor(private budgetService: BudgetService, private router: Router) {}

  topLevelBudgets: TopLevelBudget[] = []

  ngOnInit(): void {
    this.initializeTopLevelBudgetList().then(() => {});
  }


  chooseBudget(budget: BudgetDTO) {
    this.router.navigate([`/budgets/single/${budget.id}`],  { queryParams: { budget: JSON.stringify(budget) } });
  }

  chooseTopLevelBudget(topLevelBudget: TopLevelBudget) {
  }

  async initializeTopLevelBudgetList() {
    // todo placeholder userId
    const categories = await firstValueFrom(this.budgetService.getCategories("demo"));
    const budgets = await firstValueFrom(this.budgetService.getUncategorizedBudgets("demo"));

    this.topLevelBudgets = (categories as TopLevelBudget[]).concat(budgets as TopLevelBudget[]);
  }

  private isBudgetDto(topLevelBudget: TopLevelBudget) {
    return (topLevelBudget as BudgetDTO).budgetEntries !== undefined;
  }


}
