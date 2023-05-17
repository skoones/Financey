import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-single-budget-view',
  templateUrl: './single-budget-view.component.html',
  styleUrls: ['./single-budget-view.component.scss']
})
export class SingleBudgetViewComponent {

  budgetId?: string | null;

  constructor(private route: ActivatedRoute) { }
  ngOnInit() {
    this.budgetId = this.route.snapshot.paramMap.get('id');
  }

}
