import {Component, EventEmitter, Inject, Input, OnInit, Output, OnChanges, SimpleChanges} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {BudgetDTO, EntryService, InvestmentEntryDTO} from "../../../generated";
import {FormBuilder, FormGroup, FormArray, Validators, AbstractControl} from "@angular/forms";
import {amountValidator} from "../../validators/number-validators";
import {dateToString} from "../../utils/date-utils";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-update-market-prices-for-entry',
  templateUrl: './update-market-prices-for-entry.component.html',
  styleUrls: ['./update-market-prices-for-entry.component.scss']
})
export class UpdateMarketPricesForEntryComponent implements OnInit, OnChanges {

  @Output() updatePricesEventEmitter = new EventEmitter<boolean>();
  @Output() closePopup = new EventEmitter<void>();
  @Input() investmentEntry: InvestmentEntryDTO;
  @Input() budget: BudgetDTO
  pricesFormGroup: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private formBuilder: FormBuilder,
              private formSnackBar: MatSnackBar, private entryService: EntryService) {
    this.investmentEntry = data.investmentEntry;
    this.budget = data.budget;
    this.pricesFormGroup = this.formBuilder.group({
      datesToPrices: this.formBuilder.array(this.createPriceControls())
    });
  }

  createPriceControls(): FormGroup[] {
    const datesToPrices = this.investmentEntry.datesToMarketPrices || { "": 0 };
    return Object.keys(datesToPrices).map(date => {
      const price = datesToPrices[date] || 0;
      return this.formBuilder.group({
        date: [date, Validators.required],
        price: [price, Validators.required, amountValidator()]
      });
    });
  }

  get datesToPrices(): FormArray {
    return this.pricesFormGroup.get('datesToPrices') as FormArray;
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['investmentEntries'] && changes['investmentEntries'].currentValue) {
      this.initializeForm(changes['investmentEntries'].currentValue);
    }
  }

  initializeForm(entries: any[]) {
    entries.forEach(entry => {
      if (entry.datesToMarketPrices) {
        for (const date in entry.datesToMarketPrices) {
          this.addPrice(date, entry.datesToMarketPrices[date]);
        }
      }
    });
  }

  addPrice(date: string | undefined, price: number | undefined) {
    const dateAsString = date || dateToString(new Date());

    const priceGroup = this.formBuilder.group({
      date: [date || dateAsString, Validators.required],
      price: [price || 0, Validators.required, amountValidator()]
    });
    (this.pricesFormGroup.get('datesToPrices') as FormArray)?.push(priceGroup);
  }

  onSubmit() {
    if (this.pricesFormGroup.valid) {
      const updatedPrices = this.convertToSimpleType(this.pricesFormGroup.get('datesToPrices') as FormArray);
      this.entryService.updateInvestmentEntry({
        ...this.investmentEntry,
        datesToMarketPrices: updatedPrices,
      }).subscribe((_) => {
        this.updatePricesEventEmitter.emit(true);
        this.formSnackBar.open('Prices updated.', 'Close', {
          duration: 5000,
        });
      });
    } else {
      const hasMissingFields = Object.keys(this.pricesFormGroup.controls)
        .some((controlName) => {
          return !!this.pricesFormGroup.get(controlName)?.errors?.['required'];
        })
      if (hasMissingFields) {
        this.openErrorSnackbar('Please fill out all required fields.');
      } else {
        Object.keys(this.pricesFormGroup.controls)
          .forEach((controlName) => {
            this.handleEntryFormErrors(controlName);
          })
      }
    }
  }

  closeListPopup() {
    this.closePopup.emit();
  }

  deletePrice(priceControl: AbstractControl) {
    const datesToPricesArray = this.pricesFormGroup.get('datesToPrices') as FormArray;
    const index = datesToPricesArray.controls.indexOf(priceControl);
    if (index > -1) {
      datesToPricesArray.removeAt(index);
    }
  }

  private openErrorSnackbar(message: string) {
    this.formSnackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: 'error-snackbar'
    });
  }

  private convertToSimpleType(formArray: FormArray): { [key: string]: number } {
    const simpleObject: { [key: string]: number } = {};

    formArray.controls.forEach(control => {
      const date = control.get('date')?.value;
      const price = control.get('price')?.value as number;
      simpleObject[date] = price;
    });

    return simpleObject;
  }

  private handleEntryFormErrors(controlName: string) {
    if (this.pricesFormGroup.get(controlName)?.errors?.['amountErrors']?.invalidNumber) {
      this.openErrorSnackbar('Price should be a valid number.');
    } else if (this.pricesFormGroup.get(controlName)?.errors?.['amountErrors']?.lessEqualZero) {
      this.openErrorSnackbar(`Price should be greater than 0.`);
    }
  }

}
