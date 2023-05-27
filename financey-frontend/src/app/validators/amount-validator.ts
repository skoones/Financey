import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function amountValidator(): ValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> => {
    const value = control.value;

    if (!value) {
      return Promise.resolve(null);
    }

    const isValid = Number.isFinite(+value) && value > 0;
    return isValid ? Promise.resolve(null) : Promise.resolve({ integer: { value } });
  };
}

export function volumeValidator(): ValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> => {
    const value = control.value;

    if (!value) {
      return Promise.resolve(null);
    }

    const isValid = Number.isFinite(+value) && Number.isInteger(+value) && value > 0;
    return isValid ? Promise.resolve(null) : Promise.resolve({ integer: { value } });
  };

}
