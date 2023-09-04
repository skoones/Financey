import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllBudgetsViewComponent} from "./budget/all-budgets-view/all-budgets-view.component";
import {HomeComponent} from "./home/home.component";
import {SingleBudgetMainViewComponent} from "./budget/single-budget-main-view/single-budget-main-view.component";
import {SingleBudgetViewComponent} from "./budget/single-budget-view/single-budget-view.component";
import {
  BUDGETS_PATH,
  HOME_PATH,
  SINGLE_BUDGET_PATH,
  SINGLE_BUDGET_ID_PATH,
  BUDGET_ANALYSIS_MAIN,
  SINGLE_BUDGET_ANALYSIS_MAIN_VIEW,
  BUDGET_CATEGORY_ANALYSIS_MAIN_VIEW,
  INVESTMENT_SINGLE_BUDGET_MAIN_VIEW,
  INVESTMENT_CATEGORY_MAIN_VIEW, INVESTMENT_ANALYSIS_MAIN
} from "./constants/path-constants";
import {
  SingleBudgetAnalysisMainViewComponent
} from "./budget-analysis/single-budget-analysis/single-budget-analysis-main-view/single-budget-analysis-main-view.component";
import {AnalysisMainViewComponent} from "./budget-analysis/analysis-main-view/analysis-main-view.component";
import {
  BudgetCategoryAnalysisMainViewComponent
} from "./budget-analysis/budget-category-analysis/budget-category-analysis-main-view/budget-category-analysis-main-view.component";
import {
  InvestmentBudgetAnalysisMainViewComponent
} from "./investment-analysis/investment-budget-analysis-main-view/investment-budget-analysis-main-view.component";
import {
  InvestmentCategoryAnalysisMainViewComponent
} from "./investment-analysis/investment-category-analysis-main-view/investment-category-analysis-main-view.component";
import {
  InvestmentAnalysisMainViewComponent
} from "./investment-analysis/investment-analysis-main-view/investment-analysis-main-view.component";
import {LoginMainComponent} from "./login/login-main/login-main.component";
import {AuthGuard} from "./login/auth/auth.guard";

const routes: Routes = [
  { path: 'login', component: LoginMainComponent },
  { path: BUDGETS_PATH, component: AllBudgetsViewComponent, canActivate: [AuthGuard]  },
  { path: HOME_PATH, component: HomeComponent, canActivate: [AuthGuard] },
  { path: SINGLE_BUDGET_PATH, component: SingleBudgetMainViewComponent, canActivate: [AuthGuard]  },
  { path: SINGLE_BUDGET_ID_PATH, component: SingleBudgetViewComponent, canActivate: [AuthGuard]  },
  { path: BUDGET_ANALYSIS_MAIN, component: AnalysisMainViewComponent, canActivate: [AuthGuard]  },
  { path: SINGLE_BUDGET_ANALYSIS_MAIN_VIEW, component: SingleBudgetAnalysisMainViewComponent, canActivate: [AuthGuard]  },
  { path: BUDGET_CATEGORY_ANALYSIS_MAIN_VIEW, component: BudgetCategoryAnalysisMainViewComponent, canActivate: [AuthGuard]  },
  { path: INVESTMENT_ANALYSIS_MAIN, component: InvestmentAnalysisMainViewComponent, canActivate: [AuthGuard]  },
  { path: INVESTMENT_SINGLE_BUDGET_MAIN_VIEW, component: InvestmentBudgetAnalysisMainViewComponent, canActivate: [AuthGuard]  },
  { path: INVESTMENT_CATEGORY_MAIN_VIEW, component: InvestmentCategoryAnalysisMainViewComponent, canActivate: [AuthGuard]  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
