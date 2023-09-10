import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {BudgetDTO, BudgetService} from "../../../../generated";
import {map, Observable, startWith} from "rxjs";
import {Router} from "@angular/router";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-single-budget-analysis-picker',
  templateUrl: './single-budget-analysis-picker.component.html',
  styleUrls: ['./single-budget-analysis-picker.component.scss']
})
export class SingleBudgetAnalysisPicker implements OnInit {

  @Input() mainCardTitle = "Pick budget for analysis"
  @Input() budgetRoute = "";
  @Input() budgetsToChoose: BudgetDTO[] = []

  @Input() budget?: BudgetDTO

  budgetListControl = new FormControl();
  budgetForControl?: BudgetDTO;
  filteredBudgets: Observable<BudgetDTO[]> = new Observable<BudgetDTO[]>();
  userId = localStorage.getItem('userId') || "";
  @Input() budgetIdInPath= false;
  constructor(private budgetService: BudgetService, private router: Router) {
  }

  ngOnInit(): void {
    this.filteredBudgets = this.budgetListControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  public async routeToAnalysisMainView() {
    const budgetName = this.budgetListControl.value;
    const budgetId = await this.findBudgetIdFromName(budgetName);

    if (this.budgetIdInPath) {
      const route = this.budgetRoute.replace(":id", budgetId)
      const budget = await this.findBudgetFromName(budgetName)

      await this.router.navigate([route], { queryParams: { budget: JSON.stringify(budget) } })
    } else {
      await this.router.navigate([this.budgetRoute], { queryParams: { budgetId: budgetId } })
    }

  }

  private _filter(value: string): BudgetDTO[] {
    const filterValue = value.toLowerCase();

    return this.budgetsToChoose.filter(budget => budget.name.toLowerCase().includes(filterValue));
  }

  // todo mixin/utils
  async findBudgetIdFromName(budgetName: string): Promise<string> {
      const name: string = budgetName || this.budget?.name || "";

    return new Promise<string>((resolve) => {
      this.budgetService.getByName(name, this.userId)
        .subscribe((budget: BudgetDTO) => {
          resolve(<string>budget.id);
        })
    })
  }

  async findBudgetFromName(budgetName: string): Promise<BudgetDTO> {
    const name: string = budgetName || this.budget?.name || "";

    return new Promise<BudgetDTO>((resolve) => {
      this.budgetService.getByName(name, this.userId)
        .subscribe((budget: BudgetDTO) => {
          resolve(<BudgetDTO>budget);
        })
    })
  }

}
