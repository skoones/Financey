import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {BudgetDTO, BudgetService} from "../../../../generated";
import {map, Observable, startWith} from "rxjs";
import {Router} from "@angular/router";
import {SINGLE_BUDGET_ANALYSIS_MAIN_VIEW} from "../../../constants/path-constants";

@Component({
  selector: 'app-single-budget-analysis-picker',
  templateUrl: './single-budget-analysis-picker.component.html',
  styleUrls: ['./single-budget-analysis-picker.component.scss']
})
export class SingleBudgetAnalysisPicker implements OnInit {

  @Input() mainCardTitle = "Pick budget for analysis"
  @Input() budgetRoute = "";
  @Input() budgetsToChoose: BudgetDTO[] = []

  budgetListControl = new FormControl();
  budget?: BudgetDTO;
  filteredBudgets: Observable<BudgetDTO[]> = new Observable<BudgetDTO[]>();
  userId = "demo" // todo
  constructor(private budgetService: BudgetService, private router: Router) {}

  ngOnInit(): void {
    this.filteredBudgets = this.budgetListControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  public async routeToAnalysisMainView() {
    const budgetId = await this.findBudgetIdFromName(this.budgetListControl.value);

    await this.router.navigate([this.budgetRoute], { queryParams: { budgetId: budgetId } })
  }

  private _filter(value: string): BudgetDTO[] {
    const filterValue = value.toLowerCase();

    return this.budgetsToChoose.filter(budget => budget.name.toLowerCase().includes(filterValue));
  }

  // todo mixin/utils
  async findBudgetIdFromName(budgetName: string): Promise<string> {
      const name: string = budgetName || this.budget?.name || "";

    return new Promise<string>((resolve) => {
      // todo placeholder userId
      this.budgetService.getByName(name, "demo")
        .subscribe((budget: BudgetDTO) => {
          resolve(<string>budget.id);
        })
    })
  }

}
