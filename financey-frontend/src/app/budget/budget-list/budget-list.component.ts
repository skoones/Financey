import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {BudgetDTO} from "../../../generated";
import {BudgetService} from "../../../generated";
import {Budget} from "@angular-devkit/build-angular";
import {MainTitleService} from "../../main-title-service";


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
  @Input() isFavoriteBudgetList = false;

  constructor(private budgetService: BudgetService, private router: Router, private mainTitleService: MainTitleService) {}

  ngOnInit(): void {
  }

  chooseBudget(budget: BudgetDTO) {
    this.mainTitleService.emitTitle("Single budget")
    this.router.navigate([`/budgets/single/${budget.id}`],  { queryParams: { budget: JSON.stringify(budget) } });
  }

  isFavoriteBudget(budget: BudgetDTO) {
    return budget.favorite;
  }

}
