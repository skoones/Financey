import {Component, Input, OnInit} from '@angular/core';
import {BudgetAnalysisService, SubcategoryExpenseSumDTO} from "../../../generated";
import {dateToString, getFirstDayOfMonth} from "../../utils/date-utils";

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

  @Input() expenseDates: [Date, Date] = [getFirstDayOfMonth(new Date()), new Date()]

  @Input() categoryId?: string

  constructor(private budgetAnalysisService: BudgetAnalysisService) {}

  ngOnInit() {
    this.initializeChart(this.expenseDates)
  }

  changeExpenseDates(dates: [Date, Date]) {
    this.expenseDates = dates
    this.initializeChart(this.expenseDates)
  }

  calculateChartData() {
    const expenseSumData = this.subcategoryData || [];
    const totalSum = expenseSumData.reduce((sum, subcategory) => sum + subcategory.expenseSum, 0);
    this.pieChartData = expenseSumData.map((subcategory) => ({
      name: subcategory.subcategoryName,
      value: Math.round((subcategory.expenseSum / totalSum) * 100)
    }));
  }

  tooltipText(pieChartData: {data: { name: string, value: number, label: string}}) {
    return `${pieChartData.data.name}
    ${pieChartData.data.value}%`;
  }

  private async getSubcategoryData(dates: [Date, Date]) {
    return await this.budgetAnalysisService.getTotalExpensesForSubcategoriesAndPeriodByCategoryId(dateToString(dates[0]),
      dateToString(dates[1]), this.categoryId || "").toPromise();
  }

  private initializeChart(dates: [Date, Date]) {
    this.getSubcategoryData(dates).then(result => {
      this.subcategoryData = result
      this.calculateChartData();
    })
  }

}
