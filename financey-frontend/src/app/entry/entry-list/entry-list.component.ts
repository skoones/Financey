import {Component, EventEmitter, Input, Output, Type} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {BudgetDTO, BudgetService, EntryDTO, EntryService, InvestmentEntryDTO} from "../../../generated";
import {EntryDetailsComponent} from "../entry-details/entry-details.component";
import {InvestmentEntryDetailsComponent} from "../investment-entry-details/investment-entry-details.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormBuilder} from "@angular/forms";
import {ComponentType} from "@angular/cdk/overlay";

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
  @Output() entryListChangeEmitter = new EventEmitter<boolean>();

  constructor(private entryService: EntryService, private budgetService: BudgetService, private dialog: MatDialog,
              private formSnackBar: MatSnackBar, private formBuilder: FormBuilder) {
  }

  entries: EntryDTO[] = []

  investmentEntries: InvestmentEntryDTO[] = []

  allEntries: GeneralEntry[] = []

  ngOnInit(): void {
    this.initializeEntryList().then(() => {
    });
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
    const dialogRef = this.isInvestmentEntry(entry) ? this.openEntryComponentFromDialog(entry, InvestmentEntryDetailsComponent) :
      this.openEntryComponentFromDialog(entry, EntryDetailsComponent);

    dialogRef.componentInstance.updateEventEmitter.subscribe((hasUpdates) => {
      if (hasUpdates) {
        this.entryListChangeEmitter.emit(true)
        this.initializeEntryList().then(() => {});
      }
    });
  }

  private openEntryComponentFromDialog<T>(entry: GeneralEntry, componentType: Type<T>) {
    const budget = this.budget;

    return this.dialog.open(componentType, {
      data: { entry: entry, budget: budget }
    });
  }

  isInvestmentEntry(entry: GeneralEntry): entry is InvestmentEntryDTO {
    return (entry as InvestmentEntryDTO).volume !== undefined;
  }

  getGeneralEntryName(entry: GeneralEntry): string {
    return this.isInvestmentEntry(entry) ? entry.entry.name : entry.name;
  }

}
