import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {BudgetCategoryDTO, BudgetService} from "../../../../generated";
import {map, Observable, startWith} from "rxjs";
import {Router} from "@angular/router";
import {BUDGET_CATEGORY_ANALYSIS_MAIN_VIEW} from "../../../constants/path-constants";

@Component({
  selector: 'app-budget-category-analysis-picker',
  templateUrl: './budget-category-analysis-picker.component.html',
  styleUrls: ['./budget-category-analysis-picker.component.scss']
})
export class BudgetCategoryAnalysisPicker implements OnInit {

  @Input() mainCardTitle = "Pick budget category for analysis"
  @Input() categoryRoute = ""
  @Input() categoriesToChoose: BudgetCategoryDTO[] = []

  categoryListControl = new FormControl();
  category?: BudgetCategoryDTO;
  filteredCategories = new Observable<BudgetCategoryDTO[]>();
  userId = "demo" // todo
  constructor(private budgetService: BudgetService, private router: Router) {
  }

  ngOnInit(): void {
    this.filteredCategories = this.categoryListControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  public async routeToAnalysisMainView() {
    const categoryId = await this.findCategoryIdFromName(this.categoryListControl.value);

    await this.router.navigate([this.categoryRoute], {queryParams: {categoryId: categoryId}})
  }

  private _filter(value: string): BudgetCategoryDTO[] {
    const filterValue = value.toLowerCase();
    const categories = this.categoriesToChoose || []

    return categories.filter(category => category.name.toLowerCase().includes(filterValue));
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
