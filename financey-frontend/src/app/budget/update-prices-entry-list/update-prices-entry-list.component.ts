import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {BudgetDTO, InvestmentEntryDTO} from "../../../generated";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {UpdateMarketPricesForEntryComponent} from "../update-market-prices/update-market-prices-for-entry.component";

@Component({
  selector: 'app-update-prices-entry-list',
  templateUrl: './update-prices-entry-list.component.html',
  styleUrls: ['./update-prices-entry-list.component.scss']
})
export class UpdatePricesEntryListComponent implements OnInit {

  @Output() updatePricesEventEmitter = new EventEmitter<boolean>();
  @Output() closePopup = new EventEmitter<void>();
  @Input() entries: InvestmentEntryDTO[] = []
  @Input() budget: BudgetDTO
  displayedColumns = ['name'];
  updatedInvestments = new Set();

  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private dialog: MatDialog) {
    this.entries = data.entries;
    this.budget = data.budget;
  }

  ngOnInit(): void {
  }

  openUpdatePricesPopup(investmentEntry: InvestmentEntryDTO) {
    const dialogRef = this.dialog.open(UpdateMarketPricesForEntryComponent, {
      data: { budget: this.budget, investmentEntry: investmentEntry }
    });


    dialogRef.componentInstance.updatePricesEventEmitter.subscribe((anyUpdated) => {
      if (anyUpdated) {
       this.updatePricesEventEmitter.emit(anyUpdated);
       this.updatedInvestments.add(investmentEntry);
      }
    });
    dialogRef.componentInstance.closePopup.subscribe(() => {
      dialogRef.close();
    });
  }

  closeListPopup() {
    this.closePopup.emit();
  }

}
