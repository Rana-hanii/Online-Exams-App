import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AdaptedVerifyCodeRes, AuthApiService } from 'auth-api';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { DividerAndIconsComponent } from '../../components/divider-and-icons/divider-and-icons.component';
import { PasswordResetService } from '../../services/password-reset.service';
import { AosDirective } from '../../../../shared/directives/aos.directive';

@Component({
  selector: 'app-verify-code',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    MessageModule,
    DividerAndIconsComponent,
    AosDirective
  ],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.css',
})
export class VerifyCodeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  messageService = inject(MessageService);
  _AuthApiService = inject(AuthApiService);
  private router = inject(Router);
  passwordResetService = inject(PasswordResetService);
  verifyCodeForm: FormGroup;
  formSubmitted = false;
  isSubmitting = false;
  isResending = false;
  resendCooldown = 0;
  private resendTimer?: number;

  constructor(private fb: FormBuilder) {
    this.verifyCodeForm = this.fb.group({
      code: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern(/^\d{6}$/),
        ],
      ],
    });
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
    if (this.verifyCodeForm.invalid) {
      return;
    }
    this.isSubmitting = true;
    //^ Map the form data to match the API interface
    const verifyCodeData = {
      resetCode: this.verifyCodeForm.value.code,
    };
    console.log('Sending verify code data:', verifyCodeData);
    this._AuthApiService.VerifyCode(verifyCodeData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: AdaptedVerifyCodeRes) => {
          // Success response
          console.log('Verify code success:', res);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Otp verified successfully ',
            life: 8000,
          });
          setTimeout(() => {
            this.router.navigate(['/auth/set-password']);
          }, 9000);
        },
        error: (error) => {
          // Error response
          console.error('Verify code error:', error);
          const errorMessage = error.error?.message || error.message || 'An error occurred during verify code';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 8000,
          });
          this.isSubmitting = false;
          this.formSubmitted = false;
          this.verifyCodeForm.reset();
        }
      });
  }

  isInvalid(controlName: string) {
    const control = this.verifyCodeForm.get(controlName);
    return control?.invalid && control.touched && this.formSubmitted;
  }

  resendCode() {
    if (this.isResending || this.resendCooldown > 0) {
      return; // Prevent multiple clicks during cooldown
    }

    const email = this.passwordResetService.getResetEmail();
    if (!email) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No email found. Please start the password reset process again.',
        life: 8000,
      });
      this.router.navigate(['/auth/forget-password']);
      return;
    }

    this.isResending = true;
    this._AuthApiService.ForgetPassword({ email })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('Resend code success:', res);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'New OTP code sent successfully',
            life: 8000,
          });
          this.isResending = false;
          this.startResendCooldown();
        },
        error: (error) => {
          console.error('Resend code error:', error);
          const errorMessage = error.error?.message || error.message || 'Failed to resend code';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 8000,
          });
          this.isResending = false;
          this.clearResendTimer();
        }
      });
  }

  startResendCooldown() {
    this.resendCooldown = 60; // 60 seconds cooldown
    this.resendTimer = window.setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) {
        this.clearResendTimer();
      }
    }, 1000);
  }

  clearResendTimer() {
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
      this.resendTimer = undefined;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearResendTimer();
  }
}
