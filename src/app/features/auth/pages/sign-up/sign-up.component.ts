import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthApiService } from 'auth-api';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { passwordMatchValidator } from '../../../../shared/utils/validators';
import { DividerAndIconsComponent } from '../../components/divider-and-icons/divider-and-icons.component';


@Component({
  selector: 'app-sign-up',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    InputTextModule,
    ButtonModule,
    ToastModule,
    MessageModule,
    PasswordModule,
    DividerAndIconsComponent,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  messageService = inject(MessageService);
  _AuthApiService = inject(AuthApiService);
  private router = inject(Router);
  signUpForm: FormGroup;
  formSubmitted = false;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.signUpForm = this.fb.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        phone: [
          '',
          [Validators.required, Validators.pattern(/^(\+2)?01[0125][0-9]{8}$/)],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
            ),
          ],
        ],
        rePassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const rePassword = form.get('rePassword');

    if (password && rePassword && password.value !== rePassword.value) {
      rePassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (rePassword?.errors?.['passwordMismatch']) {
      delete rePassword.errors['passwordMismatch'];
      if (Object.keys(rePassword.errors).length === 0) {
        rePassword.setErrors(null);
      }
    }

    return null;
  }
  onSubmit() {
    this.formSubmitted = true;
    if (this.signUpForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      //^ loading message
      this.messageService.add({
        severity: 'info',
        summary: 'Creating Account',
        detail: 'Please wait while we create your account...',
        life: 8000,
      });

      console.log(this.signUpForm.value);
      this._AuthApiService.SignUp(this.signUpForm.value).subscribe({
        next: (res: any) => {
          // Check if the response is an error (from catchError of(err))
          if (res && res.status && res.status >= 400) {
            // This is an error response
            console.error('Signup error:', res);
            let errorMessage = 'Failed to create account';

            //^ Handle error cases
            if (res.status === 500) {
              errorMessage =
                'Server error occurred. Please try again later or contact support.';
            } else if (res.status === 409) {
              // Handle conflict errors (duplicate username/email)
              if (res.error?.message) {
                if (res.error.message.includes('username already exists')) {
                  errorMessage =
                    'This username is already taken. Please choose a different username.';
                } else if (res.error.message.includes('email already exists')) {
                  errorMessage =
                    'This email is already registered. Please use a different email or try signing in.';
                } else {
                  errorMessage = res.error.message;
                }
              } else {
                errorMessage =
                  'This account already exists. Please try signing in instead.';
              }
            } else if (res.error?.message) {
              if (res.error.message.includes('duplicate key error')) {
                if (res.error.message.includes('email')) {
                  errorMessage =
                    'This email is already registered. Please use a different email or try signing in.';
                } else if (res.error.message.includes('username')) {
                  errorMessage =
                    'This username is already taken. Please choose a different username.';
                } else {
                  errorMessage =
                    'This account already exists. Please try signing in instead.';
                }
              } else {
                errorMessage = res.error.message;
              }
            }

            this.messageService.add({
              severity: 'error',
              summary: 'Registration Failed',
              detail: errorMessage,
              life: 8000,
            });

            //^ Reset form submission state on error (but keep form data)
            this.formSubmitted = false;
            this.isSubmitting = false;
          } else {
            // This is a success response
            console.log('Signup success:', res);
            this.isSubmitting = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Account Created Successfully! Redirecting to sign in...',
              life: 8000,
            });
            //^ Reset form on success
            this.signUpForm.reset();
            this.formSubmitted = false;

            //^ Redirect to sign in page
            setTimeout(() => {
              this.router.navigate(['/auth/sign-in']);
            }, 9000);
          }
        },
     
      });
    }
  }

  isInvalid(controlName: string) {
    const control = this.signUpForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }
}
