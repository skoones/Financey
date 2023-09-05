import {Component, EventEmitter, Inject, Input, OnInit, Output, OnChanges, SimpleChanges} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {BudgetDTO, EntryService, InvestmentEntryDTO} from "../../../generated";
import {FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors} from "@angular/forms";
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
    const sortedDates = Object.keys(datesToPrices).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return sortedDates.map(date => {
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
      price: [price, Validators.required, amountValidator()]
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
      this.closeListPopup();
    } else {
      const datesToPrices = (this.pricesFormGroup.get('datesToPrices') as FormArray);
      const allErrors = datesToPrices.controls.map((group: AbstractControl) => {
        const typedGroup = group as FormGroup;
        return Object.keys(typedGroup.controls).map(controlName => {
          const control = typedGroup.get(controlName);
          return control?.errors;
        });
      }).reduce((prev, curr) => [...prev, ...curr], [])
        .filter(error => error !== null);
      const hasMissingFields = allErrors.some(errors => !!errors && 'required' in errors);
      if (hasMissingFields) {
        this.openErrorSnackbar('Please fill out all required fields.');
      } else {
        Object.keys(this.pricesFormGroup.controls)
          .forEach((_) => {
            this.handleEntryFormErrors(allErrors);
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
      const date = dateToString(new Date(control.get('date')?.value));
      const price = control.get('price')?.value as number;
      simpleObject[date] = price;
    });

    return simpleObject;
  }

  private handleEntryFormErrors(allErrors: (ValidationErrors | null | undefined)[]) {
    const hasInvalidNumberError = allErrors.some(errors => errors?.['amountErrors']?.invalidNumber);
    const hasLessEqualZeroError = allErrors.some(errors => errors?.['amountErrors']?.lessEqualZero);

    if (hasInvalidNumberError) {
      this.openErrorSnackbar('Price should be a valid number.');
    } else if (hasLessEqualZeroError) {
      this.openErrorSnackbar(`Price should be greater than 0.`);
    }
  }

}
