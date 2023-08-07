import { Component, OnInit } from '@angular/core';
import {BudgetAnalysisService, SubcategoryExpenseSumDTO} from "../../../generated";

@Component({
  selector: 'app-expense-sum-pie-chart',
  templateUrl: './expense-sum-pie-chart.component.html',
  styleUrls: ['./expense-sum-pie-chart.component.scss']
})
export class ExpenseSumPieChartComponent implements OnInit {
  subcategoryData?: SubcategoryExpenseSumDTO[]; // Replace this with your actual data
  pieChartData?: any[];
  view: [number, number]= [700, 400];
  showLegend = true;
  explodeSlices = false;
  doughnut = false;

  constructor(private budgetAnalysisService: BudgetAnalysisService) {}

  ngOnInit() {
    this.initializeSubcategoryData().then(result => {
      this.subcategoryData = result
      this.calculateChartData();
    })
  }

  private async initializeSubcategoryData() {
    return await this.budgetAnalysisService.getTotalExpensesForSubcategoriesAndPeriodByCategoryId("2023-07-10", "2023-08-07", "64ce34655727d45b23d5ea49").toPromise(); // todo placeholder
  }

  calculateChartData() {
    const expenseSumData = this.subcategoryData || [];
    const totalSum = expenseSumData.reduce((sum, subcategory) => sum + subcategory.expenseSum, 0);
    this.pieChartData = expenseSumData.map((subcategory) => ({
      name: subcategory.subcategoryName,
      value: (subcategory.expenseSum / totalSum) * 100,
    }));
  }

  tooltipText(pieChartData: {data: { name: string, value: number, label: string}}) {
    return `${pieChartData.data.name}
    ${pieChartData.data.value}%`;
  }

}
