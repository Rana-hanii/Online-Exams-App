import { FormGroup, ValidationErrors } from '@angular/forms';


// ! JSDoc-style comments for the functions

/**
 * Validates that password and confirm password fields match
 * @param form - The form group containing password and confirmPassword controls
 * @returns ValidationErrors object if passwords don't match, null if they match
 */


export function passwordMatchValidator(form: FormGroup): ValidationErrors | null {
  const password = form.get('password');
  const confirmPassword = form.get('confirmPassword');
  
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
  
  if (confirmPassword?.errors?.['passwordMismatch']) {
    delete confirmPassword.errors['passwordMismatch'];
    if (Object.keys(confirmPassword.errors).length === 0) {
      confirmPassword.setErrors(null);
    }
  }
  
  return null;
}
