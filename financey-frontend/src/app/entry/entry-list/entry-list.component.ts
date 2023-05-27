import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {BudgetDTO, EntryDTO, EntryService, InvestmentEntryDTO} from "../../../generated";
import {EntryDetailsComponent} from "../entry-details/entry-details.component";
import {InvestmentEntryDetailsComponent} from "../investment-entry-details/investment-entry-details.component";

type GeneralEntry = EntryDTO | InvestmentEntryDTO;

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent {

  @Input() title = "Entries"
  displayedColumns = ['name'];
  @Input() budget?: BudgetDTO;

  constructor(private entryService: EntryService, private dialog: MatDialog) {}

  entries: EntryDTO[] = []

  investmentEntries: InvestmentEntryDTO[] = []

  allEntries: GeneralEntry[] = []

  ngOnInit(): void {
    this.initializeEntryList().then(() => {});
  }

  async initializeEntryList() {
    this.entries = await this.getEntries();
    if (this.budget?.investment) {
      this.investmentEntries = await this.getInvestmentEntries();
    }
    this.allEntries = (this.entries as GeneralEntry[]).concat(this.investmentEntries as GeneralEntry[])
  }

  private async getInvestmentEntries(): Promise<InvestmentEntryDTO[]> {
    return new Promise<InvestmentEntryDTO[]>((resolve) => {
      this.entryService.getInvestmentEntriesByBudgetId(this.budget?.id ? this.budget.id : "").subscribe(data => {
        resolve(<InvestmentEntryDTO[]>(data));
      });
    })
  }

  private async getEntries(): Promise<EntryDTO[]> {
    return new Promise<EntryDTO[]>((resolve) => {
      this.entryService.getEntriesByBudgetId(this.budget?.id ? this.budget.id : "").subscribe(data => {
        resolve(<EntryDTO[]>(data));
      });
    })
  }

  chooseEntry(entry: GeneralEntry) {
    console.log(this.isInvestmentEntry(entry))
    const dialogRef = this.isInvestmentEntry(entry) ? this.openComponentFromDialog(entry, InvestmentEntryDetailsComponent) :
      this.openComponentFromDialog(entry, EntryDetailsComponent);

    dialogRef.afterClosed().subscribe();
  }

  private openComponentFromDialog<T>(entry: GeneralEntry, component: new () => T) {
    return this.dialog.open(component, {
      data: entry
    });
  }

  isInvestmentEntry(entry: GeneralEntry): entry is InvestmentEntryDTO{
    return (entry as InvestmentEntryDTO).volume !== undefined;
  }

  getGeneralEntryName(entry: GeneralEntry): string {
    return this.isInvestmentEntry(entry) ? entry.entry.name : entry.name;
  }

}
