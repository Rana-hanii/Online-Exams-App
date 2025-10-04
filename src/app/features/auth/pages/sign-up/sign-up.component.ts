import { Component, OnDestroy, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdaptedSignUpRes, AuthApiService } from 'auth-api';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
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
export class SignUpComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  
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
      this._AuthApiService.SignUp(this.signUpForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: AdaptedSignUpRes) => {
            // Success response
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
            }, 5000);
          },
          error: (error) => {
            // Error response
            console.error('Signup error:', error);
            
            // Check if this is a free trial limit exceeded error
            if (this.isFreeTrialLimitError(error)) {
              // Error interceptor will handle this automatically
              console.warn('Free trial limit exceeded during sign up');
            } else {
              let errorMessage = 'Failed to create account';

              //^ Handle error cases
              if (error.status === 500) {
                errorMessage =
                  'Server error occurred. Please try again later or contact support.';
              } else if (error.status === 409) {
                // Handle conflict errors (duplicate username/email)
                if (error.error?.message) {
                  if (error.error.message.includes('username already exists')) {
                    errorMessage =
                      'This username is already taken. Please choose a different username.';
                    // Clear only the username field
                    this.signUpForm.get('username')?.setValue('');
                  } else if (error.error.message.includes('email already exists')) {
                    errorMessage =
                      'This email is already registered. Please use a different email or try signing in.';
                    // Clear only the email field
                    this.signUpForm.get('email')?.setValue('');
                  } else {
                    errorMessage = error.error.message;
                  }
                } else {
                  errorMessage =
                    'This account already exists. Please try signing in instead.';
                }
              } else if (error.error?.message) {
                if (error.error.message.includes('duplicate key error')) {
                  if (error.error.message.includes('email')) {
                    errorMessage =
                      'This email is already registered. Please use a different email or try signing in.';
                    // Clear only the email field
                    this.signUpForm.get('email')?.setValue('');
                  } else if (error.error.message.includes('username')) {
                    errorMessage =
                      'This username is already taken. Please choose a different username.';
                    // Clear only the username field
                    this.signUpForm.get('username')?.setValue('');
                  } else {
                    errorMessage =
                      'This account already exists. Please try signing in instead.';
                  }
                } else {
                  errorMessage = error.error.message;
                }
              }

              this.messageService.add({
                severity: 'error',
                summary: 'Registration Failed',
                detail: errorMessage,
                life: 8000,
              });
            }

            //^ Reset form submission state on error (but keep form data)
            this.formSubmitted = false;
            this.isSubmitting = false;
          }
        });
    }
  }

  isInvalid(controlName: string) {
    const control = this.signUpForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  private isFreeTrialLimitError(error: any): boolean {
    // Check for ERROR_CUSTOM_MESSAGE with free trial details
    if (error.error?.error === 'ERROR_CUSTOM_MESSAGE') {
      const details = error.error.details;
      return details?.title?.toLowerCase().includes('free trial') || 
             details?.detail?.toLowerCase().includes('free trial');
    }
    
    // Check for ConnectError with resource_exhausted
    if (error.message?.includes('ConnectError') && error.message?.includes('resource_exhausted')) {
      return true;
    }
    
    return false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
