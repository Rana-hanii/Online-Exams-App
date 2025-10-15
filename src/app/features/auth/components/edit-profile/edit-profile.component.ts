import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { User } from '../../../../shared/interfaces/user.interface';
import { EditProfileService } from '../../services/edit-profile.service';
// import { passwordMatchValidator } from '../../../../shared/utils/validators';
import { PasswordModule } from 'primeng/password';
import { Router } from '@angular/router';
import { AosDirective } from '../../../../shared/directives/aos.directive';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    AosDirective
  ],
  providers: [MessageService],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(EditProfileService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  formSubmitted = false;

  profileForm = this.fb.group({
    username: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
    ],
    firstName: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
    ],
    lastName: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
    ],
    email: ['', [Validators.required, Validators.email]],
    phone: [
      '',
      [Validators.required, Validators.pattern(/^(\+2)?01[0125][0-9]{8}$/)],
    ],
  });

  passwordForm = this.fb.group(
    {
      oldPassword: ['', Validators.required],
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

  loading = false;

  ngOnInit(): void {
    this.loadProfile();
  }

  private showToast(
    severity: 'success' | 'error' | 'warn' | 'info',
    summary: string,
    detail?: string
  ) {
    this.messageService.add({ severity, summary, detail });
  }

  loadProfile() {
    this.loading = true;
    this.service.getAllUserProfileData().subscribe({
      next: (res: any) => {
        const user: User = res?.user || {};
        this.profileForm.patchValue({
          username: user.username || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
        });
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.showToast('error', 'Failed to load profile', err?.message || '');
      },
    });
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      this.showToast('warn', 'Please fix errors', 'Check required fields');
      return;
    }
    this.loading = true;
    this.service.updateUserProfile(this.profileForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.showToast(
          'success',
          'Profile updated',
          'Your profile was updated successfully'
        );
      },
      error: (err) => {
        this.loading = false;
        this.showToast('error', 'Update failed', err?.message || '');
      },
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) {
      this.showToast(
        'warn',
        'Please fill password fields',
        'All password fields are required'
      );
      return;
    }
    const v = this.passwordForm.value;
    if (v.password !== v.rePassword) {
      this.showToast(
        'warn',
        'Passwords mismatch',
        'New password and confirm password must match'
      );
      return;
    }
    this.loading = true;
    this.service
      .changeUserPassword({
        oldPassword: v.oldPassword,
        password: v.password,
        rePassword: v.rePassword,
      })
      .subscribe({
        next: () => {
          this.showToast(
            'success',
            'Password changed',
            'Your password was updated successfully, please login again'
          );
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/auth/sign-in']);
          }, 4000);

          this.passwordForm.reset();
        },
        error: (err) => {
          this.loading = false;
          this.showToast('error', 'Password change failed', err?.message || '');
        },
      });
  }
  isInvalid(controlName: string) {
    const control = this.passwordForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }
}
