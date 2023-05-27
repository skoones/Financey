import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';


export function amountValidator(): ValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> => {
    const value = control.value;

    if (!value) {
      return Promise.resolve(null);
    }

    const isValid = Number.isFinite(+value) && value > 0;
    return isValid
      ? Promise.resolve(null)
      : Promise.resolve({ amountErrors: getPositiveNumberErrors(value) });
  };
}

export function volumeValidator(): ValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> => {
    const value = control.value;

    if (!value) {
      return Promise.resolve(null);
    }

    const isValid = Number.isFinite(+value) && Number.isInteger(+value) && value > 0;

    return isValid
      ? Promise.resolve(null)
      : Promise.resolve({ volumeErrors: getPositiveIntegerErrors(value) });
  };

}

function getPositiveNumberErrors(value: any) {
  const errors: any = {};

  if (!Number.isFinite(+value)) {
    errors.invalidNumber = true;
  }

  if (!(value > 0)) {
    errors.lessEqualZero = {value};
  }

  return errors;
}

function getPositiveIntegerErrors(value: any) {
  const errors: any = {};

  if (!Number.isFinite(+value)) {
    errors.invalidNumber = true;
  }

  if (!Number.isInteger(+value)) {
    errors.notAnInteger = {value};
  }

  if (!(value > 0)) {
    errors.lessEqualZero = {value};
  }

  return errors;
}
