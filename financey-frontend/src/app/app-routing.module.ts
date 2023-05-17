import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllBudgetsViewComponent} from "./budget/all-budgets-view/all-budgets-view.component";
import {HomeComponent} from "./home/home.component";
import {SingleBudgetMainViewComponent} from "./budget/single-budget-main-view/single-budget-main-view.component";
import {SingleBudgetViewComponent} from "./budget/single-budget-view/single-budget-view.component";

const routes: Routes = [
  { path: 'budgets', component: AllBudgetsViewComponent },
  { path: 'home', component: HomeComponent   },
  { path: 'budgets/single/main', component: SingleBudgetMainViewComponent},
  { path: 'budgets/single/:id', component: SingleBudgetViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
