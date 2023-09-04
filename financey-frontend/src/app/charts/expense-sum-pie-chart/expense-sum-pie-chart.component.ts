import {Component, Input, OnInit} from '@angular/core';
import {
  BudgetAnalysisService,
  InvestmentAnalysisService,
  SubcategoryExpenseSumDTO,
  SubcategoryMarketValueDTO
} from "../../../generated";
import {dateToString, getFirstDayOfMonth} from "../../utils/date-utils";


@Component({
  selector: 'app-expense-sum-pie-chart',
  templateUrl: './expense-sum-pie-chart.component.html',
  styleUrls: ['./expense-sum-pie-chart.component.scss']
})
export class ExpenseSumPieChartComponent implements OnInit {
  subcategoryData?: SubcategoryExpenseSumDTO[] | SubcategoryMarketValueDTO[];
  pieChartData?: any[];
  view: [number, number]= [700, 400];
  showLegend = true;
  explodeSlices = false;
  doughnut = false;

  @Input() expenseDates: [Date, Date] = [getFirstDayOfMonth(new Date()), new Date()];

  @Input() categoryId?: string;
  @Input() investment = false;

  constructor(private budgetAnalysisService: BudgetAnalysisService,
              private investmentAnalysisService: InvestmentAnalysisService) {}

  ngOnInit() {
    this.initializeChart(this.expenseDates)
  }

  changeExpenseDates(dates: [Date, Date]) {
    this.expenseDates = dates
    this.initializeChart(this.expenseDates)
  }

  calculateChartData() {
    const expenseSumData = this.subcategoryData || [];
    const totalSum = this.getTotalSum(expenseSumData);

    this.pieChartData = expenseSumData.map((subcategory) => this.findPieChartData(subcategory, totalSum));
  }

  private findPieChartData(subcategory: SubcategoryExpenseSumDTO | SubcategoryMarketValueDTO, totalSum: number) {
    const partialSum = this.findPartialSum(subcategory);
    return {
      name: subcategory.subcategoryName,
      value: Math.round((partialSum / totalSum) * 100)
    };
  }

  private findPartialSum(subcategory: SubcategoryExpenseSumDTO | SubcategoryMarketValueDTO) {
    if ('expenseSum' in subcategory) {
      return subcategory.expenseSum;
    } else {
      return subcategory.marketValue;
    }
  }

  tooltipText(pieChartData: {data: { name: string, value: number, label: string}}) {
    return `${pieChartData.data.name}
    ${pieChartData.data.value}%`;
  }

  private getTotalSum(data: SubcategoryExpenseSumDTO[] | SubcategoryMarketValueDTO[]): number {
    const handleExpenseSum = (data: SubcategoryExpenseSumDTO[]): number =>
      data.reduce((sum, subcategory) => sum + subcategory.expenseSum, 0);

    const handleMarketValue = (data: SubcategoryMarketValueDTO[]): number =>
      data.reduce((sum, subcategory) => sum + subcategory.marketValue, 0);

      if (data.length === 0) return 0;
      if ('expenseSum' in data[0]) return handleExpenseSum(data as SubcategoryExpenseSumDTO[]);
      if ('marketValue' in data[0]) return handleMarketValue(data as SubcategoryMarketValueDTO[]);
      return 0;
  }

  private async getSubcategoryData(dates: [Date, Date]) {
    if (this.investment) {
      // todo maybe only use end date here, not a closed period?
      return await this.investmentAnalysisService.getTotalMarketValueForSubcategoriesAndPeriodByCategoryId(dateToString(dates[0]),
        dateToString(dates[1]), this.categoryId || "").toPromise();
    }
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
