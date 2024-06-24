import { FormGroup } from '@angular/forms';

export const confirmPasswordValidator = (
  controlName: string,
  controlNameToMatch: string,
) => {
  return (fg: FormGroup) => {
    let control = fg.controls[controlName];
    let controlToMatch = fg.controls[controlNameToMatch];

    if (
      controlToMatch.errors &&
      !controlToMatch.errors['confirmPasswordValidator']
    ) {
      return;
    }

    if (control.value !== controlToMatch.value) {
      controlToMatch.setErrors({ confirmPasswordValidator: true });
    } else {
      controlToMatch.setErrors(null);
    }
  };
};
