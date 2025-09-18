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
import { ToastModule } from 'primeng/toast';
import { DividerAndIconsComponent } from '../../components/divider-and-icons/divider-and-icons.component';

@Component({
  selector: 'app-verify-code',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    InputTextModule,
    ButtonModule,
    ToastModule,
    MessageModule,
    DividerAndIconsComponent,
  ],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.css',
})
export class VerifyCodeComponent {
  messageService = inject(MessageService);
  _AuthApiService = inject(AuthApiService);
  private router = inject(Router);
  verifyCodeForm: FormGroup;
  formSubmitted = false;
  isSubmitting = false;

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
    this._AuthApiService.VerifyCode(verifyCodeData).subscribe({
      next: (res: any) => {
        if (res && res.status && res.status >= 400) {
          console.error('Verify code error:', res);
          const errorMessage =
            res.error?.message ||
            res.message ||
            'An error occurred during verify code';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 8000,
          });
          this.isSubmitting = false;
          this.formSubmitted = false;
          this.verifyCodeForm.reset();
        } else {
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
        }
      },
    });
  }

  isInvalid(controlName: string) {
    const control = this.verifyCodeForm.get(controlName);
    return control?.invalid && control.touched && this.formSubmitted;
  }
}
