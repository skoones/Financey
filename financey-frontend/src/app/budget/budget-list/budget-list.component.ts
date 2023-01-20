import {Component, Input, OnInit} from '@angular/core';
import {BudgetDTO} from "../../../generated";
import {BudgetService} from "../../../generated/api/budget.service";

@Component({
  selector: 'app-budget-list',
  templateUrl: './budget-list.component.html',
  styleUrls: ['./budget-list.component.scss']
})
export class BudgetListComponent implements OnInit {

  @Input() title = "Budgets"
  displayedColumns = ['name'];

  constructor(private budgetService: BudgetService) {}

  budgets: BudgetDTO[] = []

  ngOnInit(): void {
    // todo placeholder userId
    this.budgetService.getUncategorizedBudgets("demo").subscribe(data => {
      this.budgets = data;
    });
  }

}
