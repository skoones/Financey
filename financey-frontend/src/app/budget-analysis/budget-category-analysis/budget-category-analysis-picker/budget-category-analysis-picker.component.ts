import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {BudgetCategoryDTO, BudgetDTO, BudgetService} from "../../../../generated";
import {map, Observable, startWith} from "rxjs";
import {Router} from "@angular/router";
import {BUDGET_CATEGORY_ANALYSIS_MAIN_VIEW, SINGLE_BUDGET_ANALYSIS_MAIN_VIEW} from "../../../constants/path-constants";

@Component({
  selector: 'app-budget-category-analysis-picker',
  templateUrl: './budget-category-analysis-picker.component.html',
  styleUrls: ['./budget-category-analysis-picker.component.scss']
})
export class BudgetCategoryAnalysisPicker implements OnInit {

  categoryListControl = new FormControl();
  category?: BudgetCategoryDTO;
  categoriesToChoose: BudgetCategoryDTO[] = []
  filteredCategories = new Observable<BudgetCategoryDTO[]>();
  userId = "demo" // todo
  constructor(private budgetService: BudgetService, private router: Router) {}

  ngOnInit(): void {
    this.budgetService.getCategories(this.userId).subscribe(data => {
      this.categoriesToChoose = data;
    });

    this.filteredCategories = this.categoryListControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  public async routeToAnalysisMainView() {
    const categoryId = await this.findCategoryIdFromName(this.categoryListControl.value);
    console.log(categoryId)

    await this.router.navigate([BUDGET_CATEGORY_ANALYSIS_MAIN_VIEW], { queryParams: { categoryId: categoryId } })
  }

  private _filter(value: string): BudgetCategoryDTO[] {
    const filterValue = value.toLowerCase();

    return this.categoriesToChoose.filter(category => category.name.toLowerCase().includes(filterValue));
  }

  // todo mixin/utils
  async findCategoryIdFromName(categoryName: string): Promise<string> {
      const name: string = categoryName || this.category?.name || "";

    return new Promise<string>((resolve) => {
      // todo placeholder userId
      this.budgetService.getCategoryByName(name, "demo")
        .subscribe((category: BudgetCategoryDTO) => {
          resolve(<string>category.id);
        })
    })
  }

}
