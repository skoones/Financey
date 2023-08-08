import { Component, OnInit } from '@angular/core';
import {AnalysisOption} from "../analysis-option";

@Component({
  selector: 'app-analysis-main-view',
  templateUrl: './analysis-main-view.component.html',
  styleUrls: ['./analysis-main-view.component.scss']
})
export class AnalysisMainViewComponent implements OnInit {

  analysisOption = AnalysisOption.SINGLE_BUDGET

  AnalysisOption = AnalysisOption

  constructor() { }

  ngOnInit(): void {
  }

  changeAnalysisOption(option: AnalysisOption) {
    this.analysisOption = option
  }

}
