import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {SINGLE_BUDGET_PATH} from "../../constants/path-constants";
import {BudgetDTO} from "../../../generated";

@Component({
  selector: 'app-single-budget-view',
  templateUrl: './single-budget-view.component.html',
  styleUrls: ['./single-budget-view.component.scss']
})
export class SingleBudgetViewComponent {

  budget?: BudgetDTO;

  constructor(private route: ActivatedRoute, private location: Location) {
  }

  ngOnInit() {
    this.location.replaceState(SINGLE_BUDGET_PATH);
    this.initBudget();
  }

  initBudget() {
    const budgetParam = this.route.snapshot.queryParams['budget'];
    if (budgetParam) {
      this.budget = JSON.parse(budgetParam);
    }
  }

}
