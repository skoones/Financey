import {Component, EventEmitter, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {SINGLE_BUDGET_PATH} from "../../constants/path-constants";
import {BudgetAnalysisService, BudgetDTO} from "../../../generated";
import {AddEntryComponent} from "../../entry/add-entry/add-entry.component";
import {MatDialog} from "@angular/material/dialog";
import {EntryListComponent} from "../../entry/entry-list/entry-list.component";
import {RecentlyViewedBudgetsService} from "../recently-viewed-budgets.service";
import {getFirstDayOfMonth} from "../../utils/date-utils";

@Component({
  selector: 'app-single-budget-view',
  templateUrl: './single-budget-view.component.html',
  styleUrls: ['./single-budget-view.component.scss']
})
export class SingleBudgetViewComponent {

  budget?: BudgetDTO;

  @ViewChild(EntryListComponent, { static: false })
  private entryListComponent?: EntryListComponent;
  monthlyExpenses?: number;

  constructor(private recentlyViewedService: RecentlyViewedBudgetsService, private budgetAnalysisService: BudgetAnalysisService,
              private route: ActivatedRoute, private location: Location, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.location.replaceState(SINGLE_BUDGET_PATH);
    this.initBudget();
    this.initializeMonthlyExpenses();
  }

  ngAfterViewInit() {
    if (this.entryListComponent) {
      this.entryListComponent.entryListChangeEmitter.subscribe((value: boolean) => {
        this.initializeMonthlyExpenses()
      });
    }
  }

  initBudget() {
    const budgetParam = this.route.snapshot.queryParams['budget'];
    if (budgetParam) {
      this.budget = JSON.parse(budgetParam);
      if (this.budget) {
        this.recentlyViewedService.addRecentlyViewed(this.budget);
      }
    }
  }

  openAddEntryPopup() {
    const dialogRef = this.dialog.open(AddEntryComponent, {
      data: { budget: this.budget }
    });


    dialogRef.componentInstance.addEntryEventEmitter.subscribe((anyAdded) => {
      if (anyAdded) {
        this.initializeMonthlyExpenses()
        this.entryListComponent?.initializeEntryList();
      }
    });
  }

  async getMonthlyExpenses(): Promise<number | undefined> {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().substring(0, 10);
    const startOfMonth = getFirstDayOfMonth(currentDate).toISOString().substring(0, 10);
    return this.budgetAnalysisService.getExpenseBalanceByPeriodAndId(startOfMonth, currentDateString, this.budget?.id || "").toPromise();
  }

  private initializeMonthlyExpenses() {
    this.getMonthlyExpenses().then(sum => this.monthlyExpenses = sum || 0)
  }

}
