import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from "@angular/material/table";
import { BudgetListComponent } from './budget/budget-list/budget-list.component';
import {HttpClientModule} from "@angular/common/http";
import { AddEntryComponent } from './entry/add-entry/add-entry.component';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatIconModule} from "@angular/material/icon";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSelectModule} from "@angular/material/select";
import { IncomeCheckboxComponent } from './entry/add-entry/income-checkbox/income-checkbox.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import { AllBudgetsViewComponent } from './budget/all-budgets-view/all-budgets-view.component';
import { HomeComponent } from './home/home.component';
import { SingleBudgetMainViewComponent } from './budget/single-budget-main-view/single-budget-main-view.component';
import { SingleBudgetViewComponent } from './budget/single-budget-view/single-budget-view.component';
import { EntryListComponent } from './entry/entry-list/entry-list.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { EntryDetailsComponent } from './entry/entry-details/entry-details.component';
import { InvestmentBudgetInfoComponent } from './budget/investment-budget-info/investment-budget-info.component';
import { InvestmentEntryDetailsComponent } from './entry/investment-entry-details/investment-entry-details.component';
import {BudgetCategoryListComponent} from "./budget/budget-category-list/budget-category-list.component";
import {AddBudgetCategoryComponent} from "./budget/add-budget-category/add-budget-category.component";
import {AddBudgetComponent} from "./budget/add-budget/add-budget.component";
import {BudgetDetailsComponent} from "./budget/budget-details/budget-details.component";
import { BudgetCategoryDetailsComponent } from './budget/budget-category-details/budget-category-details.component';
import { SingleBudgetAnalysisMainViewComponent } from './budget-analysis/single-budget-analysis/single-budget-analysis-main-view/single-budget-analysis-main-view.component';
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {ExpenseCheckboxComponent} from "./entry/add-entry/expense-checkbox/expense-checkbox.component";
import { SingleBudgetAnalysisPicker } from './budget-analysis/single-budget-analysis/single-budget-analysis-picker/single-budget-analysis-picker.component';
import { BudgetHistoryDatePickerComponent } from './budget-analysis/analysis-history/budget-history-date-picker/budget-history-date-picker.component';
import { ExpenseHistoryChartComponent } from './charts/expense-history-chart/expense-history-chart.component';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import { HistoryPeriodShortcutRowComponent } from './budget-analysis/analysis-history/history-period-shortcut-row/history-period-shortcut-row.component';
import { ExpenseSumPieChartComponent } from './charts/expense-sum-pie-chart/expense-sum-pie-chart.component';
import { BudgetCategoryAnalysisToggleComponent } from './budget-analysis/budget-category-analysis-toggle/budget-category-analysis-toggle.component';
import { AnalysisMainViewComponent } from './budget-analysis/analysis-main-view/analysis-main-view.component';
import {
  BudgetCategoryAnalysisPicker
} from "./budget-analysis/budget-category-analysis/budget-category-analysis-picker/budget-category-analysis-picker.component";
import { BudgetCategoryAnalysisMainViewComponent } from './budget-analysis/budget-category-analysis/budget-category-analysis-main-view/budget-category-analysis-main-view.component';
import { InvestmentAnalysisMainViewComponent } from './investment-analysis/investment-analysis-main-view/investment-analysis-main-view.component';
import { InvestmentBudgetAnalysisMainViewComponent } from './investment-analysis/investment-budget-analysis-main-view/investment-budget-analysis-main-view.component';
import { InvestmentCategoryAnalysisMainViewComponent } from './investment-analysis/investment-category-analysis-main-view/investment-category-analysis-main-view.component';

@NgModule({
  declarations: [
    AppComponent,
    BudgetListComponent,
    AddEntryComponent,
    IncomeCheckboxComponent,
    ExpenseCheckboxComponent,
    AllBudgetsViewComponent,
    HomeComponent,
    SingleBudgetMainViewComponent,
    SingleBudgetViewComponent,
    EntryListComponent,
    EntryDetailsComponent,
    InvestmentBudgetInfoComponent,
    InvestmentEntryDetailsComponent,
    BudgetCategoryListComponent,
    AddBudgetCategoryComponent,
    AllBudgetsViewComponent,
    AddBudgetComponent,
    BudgetDetailsComponent,
    BudgetCategoryDetailsComponent,
    SingleBudgetAnalysisMainViewComponent,
    SingleBudgetAnalysisPicker,
    BudgetHistoryDatePickerComponent,
    ExpenseHistoryChartComponent,
    HistoryPeriodShortcutRowComponent,
    ExpenseSumPieChartComponent,
    BudgetCategoryAnalysisToggleComponent,
    AnalysisMainViewComponent,
    BudgetCategoryAnalysisPicker,
    BudgetCategoryAnalysisMainViewComponent,
    InvestmentAnalysisMainViewComponent,
    InvestmentBudgetAnalysisMainViewComponent,
    InvestmentCategoryAnalysisMainViewComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgxChartsModule,
        BrowserAnimationsModule,
        MatTableModule,
        HttpClientModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatGridListModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        MatCheckboxModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatToolbarModule,
        FormsModule,
        MatSelectModule,
        MatSidenavModule,
        MatListModule,
        MatDialogModule,
        MatButtonToggleModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
