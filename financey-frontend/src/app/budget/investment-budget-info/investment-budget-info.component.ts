import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-investment-budget-info',
  templateUrl: './investment-budget-info.component.html',
  styleUrls: ['./investment-budget-info.component.scss']
})
export class InvestmentBudgetInfoComponent {
  @Input() message: string | undefined;
  @Input() icon: string | undefined;

}
