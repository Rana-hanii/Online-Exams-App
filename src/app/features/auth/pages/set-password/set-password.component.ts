import { Component, inject } from '@angular/core';
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
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { DividerAndIconsComponent } from '../../components/divider-and-icons/divider-and-icons.component';

@Component({
  selector: 'app-set-password',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    MessageModule,
    PasswordModule,
    DividerAndIconsComponent,
  ],
  templateUrl: './set-password.component.html',
  styleUrl: './set-password.component.css',
})
export class SetPasswordComponent {
  messageService = inject(MessageService);
  _AuthApiService = inject(AuthApiService);
  private router = inject(Router);
  setPasswordForm: FormGroup;
  formSubmitted = false;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.setPasswordForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
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
      },
     
    );
  }



  onSubmit() {
    this.formSubmitted = true;
    if (this.setPasswordForm.invalid) {
      return;
    }
    this.isSubmitting = true;
    //^ Map the form data to match the API interface
    const resetPasswordData = {
      email: this.setPasswordForm.value.email,
      newPassword: this.setPasswordForm.value.password
    };
    console.log('Sending reset password data:', resetPasswordData);
    this._AuthApiService.ResetPassword(resetPasswordData).subscribe({
      next: (res: AdaptedResetPasswordRes) => {
        // Success response
        localStorage.setItem('token', res.token);
        console.log('Reset password success:', res);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Reset password successful',
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
}
