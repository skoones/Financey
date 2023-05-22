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

@NgModule({
  declarations: [
    AppComponent,
    BudgetListComponent,
    AddEntryComponent,
    IncomeCheckboxComponent,
    AllBudgetsViewComponent,
    HomeComponent,
    SingleBudgetMainViewComponent,
    SingleBudgetViewComponent,
    EntryListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatToolbarModule,
    FormsModule,
    MatSelectModule,
    MatSidenavModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
