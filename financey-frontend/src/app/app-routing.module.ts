import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllBudgetsViewComponent} from "./budget/all-budgets-view/all-budgets-view.component";
import {HomeComponent} from "./home/home.component";
import {SingleBudgetMainViewComponent} from "./budget/single-budget-main-view/single-budget-main-view.component";
import {SingleBudgetViewComponent} from "./budget/single-budget-view/single-budget-view.component";
import {BUDGETS_PATH, HOME_PATH, SINGLE_BUDGET_PATH, SINGLE_BUDGET_ID_PATH} from "./constants/path-constants";

const routes: Routes = [
  { path: BUDGETS_PATH, component: AllBudgetsViewComponent },
  { path: HOME_PATH, component: HomeComponent },
  { path: SINGLE_BUDGET_PATH, component: SingleBudgetMainViewComponent },
  { path: SINGLE_BUDGET_ID_PATH, component: SingleBudgetViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
