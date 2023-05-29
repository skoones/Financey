import {Component, EventEmitter, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {SINGLE_BUDGET_PATH} from "../../constants/path-constants";
import {BudgetDTO} from "../../../generated";
import {AddEntryComponent} from "../../entry/add-entry/add-entry.component";
import {MatDialog} from "@angular/material/dialog";
import {EntryListComponent} from "../../entry/entry-list/entry-list.component";

@Component({
  selector: 'app-single-budget-view',
  templateUrl: './single-budget-view.component.html',
  styleUrls: ['./single-budget-view.component.scss']
})
export class SingleBudgetViewComponent {

  budget?: BudgetDTO;

  @ViewChild(EntryListComponent, { static: false })
  private entryListComponent?: EntryListComponent;

  constructor(private route: ActivatedRoute, private location: Location,  private dialog: MatDialog) {
  }

  ngOnInit() {
    this.location.replaceState(SINGLE_BUDGET_PATH);
    this.initBudget();
  }

  initBudget() {
    const budgetParam = this.route.snapshot.queryParams['budget'];
    if (budgetParam) {
      this.budget = JSON.parse(budgetParam);
    }
  }

  openAddEntryPopup() {
    const dialogRef = this.dialog.open(AddEntryComponent, {
      data: { budget: this.budget }
    });


    dialogRef.componentInstance.addEntryEventEmitter.subscribe((anyAdded) => {
      if (anyAdded) {
        this.entryListComponent?.initializeEntryList();
      }
    });
  }

}
