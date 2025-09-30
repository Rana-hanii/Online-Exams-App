import { Component, OnDestroy, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdaptedSignInRes, AuthApiService } from 'auth-api';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { AuthTokenService } from '../../../../core/services/auth-token.service';
import { DividerAndIconsComponent } from '../../components/divider-and-icons/divider-and-icons.component';

@Component({
  selector: 'app-sign-in',
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
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  
  messageService = inject(MessageService);
  _AuthApiService = inject(AuthApiService);
  private router = inject(Router);
  private authTokenService = inject(AuthTokenService);
  signInForm: FormGroup;
  formSubmitted = false;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.signInForm = this.fb.group({
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
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.signInForm.invalid) {
      return;
    }
    this.isSubmitting = true;
    this._AuthApiService.SignIn(this.signInForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: AdaptedSignInRes) => {
          // Success response
          this.authTokenService.setToken(res.token);
          console.log('Sign in success:', res);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Sign in successful',
            life: 8000,
          });
          setTimeout(() => {
            this.router.navigate(['/student/dashboard']);
          }, 5000);
        },
        error: (error) => {
          // Error response
          console.error('Sign in error:', error);
          const errorMessage = error.error?.message || error.message || 'An error occurred during sign in';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 8000,
          });
          this.isSubmitting = false;
          this.formSubmitted = false;
          this.signInForm.reset();
        }
      });
  }

  isInvalid(controlName: string) {
    const control = this.signInForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
