import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {BudgetDTO} from "../../../generated";
import {BudgetService} from "../../../generated";


@Component({
  selector: 'app-budget-list',
  templateUrl: './budget-list.component.html',
  styleUrls: ['./budget-list.component.scss']
})
export class BudgetListComponent implements OnInit {

  @Input() title = "Budgets"
  @Input() budgets: BudgetDTO[] = [];
  displayedColumns = ['name'];
  userId = localStorage.getItem('userId') || "";

  constructor(private budgetService: BudgetService, private router: Router) {}

  ngOnInit(): void {
    if (this.budgets?.length == 0) {
      this.budgetService.getUncategorizedBudgets(this.userId).subscribe(data => {
        this.budgets = data;
      });
    }
  }

  chooseBudget(budget: BudgetDTO) {
    this.router.navigate([`/budgets/single/${budget.id}`],  { queryParams: { budget: JSON.stringify(budget) } });
  }

}
