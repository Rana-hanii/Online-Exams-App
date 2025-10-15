import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AdaptedResetPasswordRes, AuthApiService } from 'auth-api';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { AuthTokenService } from '../../../../core/services/auth-token.service';
import { DividerAndIconsComponent } from '../../components/divider-and-icons/divider-and-icons.component';
import { PasswordResetService } from '../../services/password-reset.service';
import { AosDirective } from '../../../../shared/directives/aos.directive';

@Component({
  selector: 'app-set-password',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    MessageModule,
    PasswordModule,
    DividerAndIconsComponent,
    AosDirective
  ],
  templateUrl: './set-password.component.html',
  styleUrl: './set-password.component.css',
})
export class SetPasswordComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  messageService = inject(MessageService);
  _AuthApiService = inject(AuthApiService);
  private authTokenService = inject(AuthTokenService);
  private router = inject(Router);
  passwordResetService = inject(PasswordResetService);
  setPasswordForm: FormGroup;
  formSubmitted = false;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.setPasswordForm = this.fb.group({
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
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
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

  ngOnInit(): void {
    // Check if email is available from the password reset flow
    const email = this.passwordResetService.getResetEmail();
    if (!email) {
      // Redirect to forget password if no email is found
      this.router.navigate(['/auth/forget-password']);
    }
  }



  onSubmit() {
    this.formSubmitted = true;
    if (this.setPasswordForm.invalid) {
      return;
    }
    this.isSubmitting = true;
    //^ Map the form data to match the API interface
    const resetPasswordData = {
      email: this.passwordResetService.getResetEmail(),
      newPassword: this.setPasswordForm.value.password
    };
    console.log('Sending reset password data:', resetPasswordData);
    this._AuthApiService.ResetPassword(resetPasswordData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: AdaptedResetPasswordRes) => {
          // Success response
          this.authTokenService.setToken(res.token);
          console.log('Reset password success:', res);
          // Clear the stored email after successful reset
          this.passwordResetService.clearResetEmail();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Password set successfully',
            life: 8000,
          });
          setTimeout(() => {
            this.router.navigate(['/student/dashboard']);
          }, 9000);
        },
        error: (error) => {
          // Error response
          console.error('Reset password error:', error);
          const errorMessage = error.error?.message || error.message || 'An error occurred during reset password';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 8000,
          });
          this.isSubmitting = false;
          this.formSubmitted = false;
          this.setPasswordForm.reset();
        }
      });
  }

  isInvalid(controlName: string) {
    const control = this.setPasswordForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  passwordsMatch(): boolean {
    const password = this.setPasswordForm.get('password')?.value;
    const confirmPassword = this.setPasswordForm.get('confirmPassword')?.value;
    return password && confirmPassword && password === confirmPassword;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
