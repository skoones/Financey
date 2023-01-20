import {Component, Input} from '@angular/core';
import {BudgetDTO} from "../../../generated/model/budgetDTO";

@Component({
  selector: 'app-budget-list',
  templateUrl: './budget-list.component.html',
  styleUrls: ['./budget-list.component.scss']
})
export class BudgetListComponent {
  @Input() title = "Budgets"
  displayedColumns = ['name'];

  budgets: BudgetDTO[] = tempBudgets

}

const tempBudgets: BudgetDTO[] = [
  {name: 'Travel', investment: false, userId: 'demo'}
]
