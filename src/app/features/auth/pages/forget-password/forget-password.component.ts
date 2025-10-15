import { Component, OnDestroy, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdaptedForgetPasswordRes, AuthApiService } from 'auth-api';
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
  selector: 'app-forget-password',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    InputTextModule,
    ButtonModule,
    ToastModule,
    MessageModule,
    DividerAndIconsComponent,
    AosDirective
  ],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
})
export class ForgetPasswordComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  
  messageService = inject(MessageService);
  _AuthApiService = inject(AuthApiService);
  private router = inject(Router);
  private passwordResetService = inject(PasswordResetService);
  forgetPasswordForm: FormGroup;
  formSubmitted = false;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.forgetPasswordForm.invalid) {
      return;
    }
    this.isSubmitting = true;
    this._AuthApiService
      .ForgetPassword(this.forgetPasswordForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: AdaptedForgetPasswordRes) => {
          // Success response
          console.log('Forget password success:', res);
          // Store the email for use in subsequent steps
          this.passwordResetService.setResetEmail(this.forgetPasswordForm.value.email);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Otp sent successfully ',
            life: 8000,
          });
          setTimeout(() => {
            this.router.navigate(['/auth/verify-code']);
          }, 3000);
        },
        error: (error) => {
          // Error response
          console.error('Forget password error:', error);
          const errorMessage = error.error?.message || error.message || 'An error occurred during forget password';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 8000,
          });
          this.isSubmitting = false;
          this.formSubmitted = false;
          this.forgetPasswordForm.reset();
        }
      });
  }

  isInvalid(controlName: string) {
    const control = this.forgetPasswordForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
