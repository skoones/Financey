import { Component, Input } from '@angular/core';
import {BudgetDTO, EntryDTO, EntryService} from "../../../generated";

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent {

  @Input() title = "Entries"
  displayedColumns = ['name'];
  @Input() budget: BudgetDTO | undefined;

  constructor(private entryService: EntryService) {}

  entries: EntryDTO[] = []

  ngOnInit(): void {
    // todo maybe make this cleaner
      this.entryService.getEntriesByBudgetId('6461f9306e1cef0556956f10').subscribe(data => {
        this.entries = data;
      }); // todo real value xd
    // this.entryService.getEntriesByBudgetId(this.budget ? (this.budget.id ? this.budget.id : "") : "").subscribe(data => {
    //   this.entries = data;
    // });
  }

  chooseEntry(entry: EntryDTO) {
    // todo
    console.log(`entry ${entry.name} clicked`)
  }

}
