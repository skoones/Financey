import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {SINGLE_BUDGET_PATH} from "../../constants/path-constants";

@Component({
  selector: 'app-single-budget-view',
  templateUrl: './single-budget-view.component.html',
  styleUrls: ['./single-budget-view.component.scss']
})
export class SingleBudgetViewComponent {

  budgetId?: string | null;

  constructor(private route: ActivatedRoute, private location: Location) { }
  ngOnInit() {
    this.location.replaceState(SINGLE_BUDGET_PATH);
    this.budgetId = this.route.snapshot.paramMap.get('id');
  }

}
