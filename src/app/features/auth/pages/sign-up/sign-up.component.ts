import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { passwordMatchValidator } from '../../../../shared/utils/validators';
import { DividerAndIconsComponent } from "../../components/divider-and-icons/divider-and-icons.component";

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
    DividerAndIconsComponent
],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  messageService = inject(MessageService);
  signUpForm: FormGroup;
  formSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: passwordMatchValidator });
  }


  onSubmit() {
    this.formSubmitted = true;
    if (this.signUpForm.valid) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Form Submitted',
        life: 3000,
      });
      this.signUpForm.reset();
      this.formSubmitted = false;
    }
  }

  isInvalid(controlName: string) {
    const control = this.signUpForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }
}
