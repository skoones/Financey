import {Component, EventEmitter, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {SINGLE_BUDGET_PATH} from "../../constants/path-constants";
import {BudgetAnalysisService, BudgetDTO, BudgetService, InvestmentAnalysisService} from "../../../generated";
import {AddEntryComponent} from "../../entry/add-entry/add-entry.component";
import {MatDialog} from "@angular/material/dialog";
import {EntryListComponent} from "../../entry/entry-list/entry-list.component";
import {RecentlyViewedBudgetsService} from "../recently-viewed-budgets.service";
import {dateToString, getFirstDayOfMonth} from "../../utils/date-utils";
import {UpdateMarketPricesForEntryComponent} from "../update-market-prices/update-market-prices-for-entry.component";
import {UpdatePricesEntryListComponent} from "../update-prices-entry-list/update-prices-entry-list.component";
import {MatSnackBar} from "@angular/material/snack-bar";

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
  monthlyBalance?: number;

  userId = localStorage.getItem('userId') || "";
  totalProfit = 0;

  constructor(private recentlyViewedService: RecentlyViewedBudgetsService, private budgetAnalysisService: BudgetAnalysisService,
              private investmentAnalysisService: InvestmentAnalysisService,
              private route: ActivatedRoute, private location: Location, private dialog: MatDialog,
              private budgetService: BudgetService,  private formSnackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.location.replaceState(SINGLE_BUDGET_PATH);
    this.initBudget();
    if (this.budget?.investment) {
      this.initializeTotalProfit();
    } else {
      this.initializeMonthlyExpenses();
      this.initializeMonthlyBalance();
    }
  }

  ngAfterViewInit() {
    if (this.entryListComponent) {
      this.entryListComponent.entryListChangeEmitter.subscribe((value: boolean) => {
        this.initializeMonthlyExpenses()
        this.initializeMonthlyBalance();
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
        this.initializeMonthlyBalance();
        this.entryListComponent?.initializeEntryList();
      }
    });
  }

  private async getMonthlyExpenses(): Promise<number | undefined> {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().substring(0, 10);
    const startOfMonth = getFirstDayOfMonth(currentDate).toISOString().substring(0, 10);
    return this.budgetAnalysisService.getExpenseSumByPeriodAndId(startOfMonth, currentDateString, this.budget?.id || "").toPromise();
  }

  private async getMonthlyBalance(): Promise<number | undefined> {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().substring(0, 10);
    const startOfMonth = getFirstDayOfMonth(currentDate).toISOString().substring(0, 10);
    return this.budgetAnalysisService.getExpenseBalanceByPeriodAndId(startOfMonth, currentDateString, this.budget?.id || "").toPromise();
  }

  private initializeMonthlyExpenses() {
    this.getMonthlyExpenses().then(sum => this.monthlyExpenses = sum || 0)
  }

  private initializeMonthlyBalance() {
    this.getMonthlyBalance().then(balance => this.monthlyBalance = balance || 0)
  }

  openUpdateMarketPricesPopup() {
    const dialogRef = this.dialog.open(UpdatePricesEntryListComponent, {
      data: { budget: this.budget, entries: this.entryListComponent?.investmentEntries }
    });


    dialogRef.componentInstance.updatePricesEventEmitter.subscribe((anyUpdated) => {
      if (anyUpdated) {
        this.entryListComponent?.initializeEntryList();
      }
    });
    dialogRef.componentInstance.closePopup.subscribe(() => {
      this.dialog.closeAll();
    });
  }

  addToFavorites() {
    this.budgetService.addToFavorites(this.userId, this.budget?.id || "").subscribe(() => {
      this.formSnackBar.open('Budget added to favorites.', 'Close', {
        duration: 5000,
      });
    });
    // todo
    if (this.budget) {
      this.budget.favorite = true;
    }
  }

  removeFromFavorites() {
    this.budgetService.deleteFromFavoritesById(this.userId, this.budget?.id || "").subscribe(() => {
      this.formSnackBar.open('Budget removed from favorites.', 'Close', {
        duration: 5000,
      });
    });
    // todo
    if (this.budget) {
      this.budget.favorite = false;
    }
  }

  private initializeTotalProfit() {
    this.investmentAnalysisService.getProfitByDateAndId(dateToString(new Date()), this.budget?.id || "").subscribe((profit) => {
      this.totalProfit = profit;
    })
  }
}
