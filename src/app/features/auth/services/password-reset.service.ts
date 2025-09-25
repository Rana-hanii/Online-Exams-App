import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  private resetEmail: string = '';

  setResetEmail(email: string): void {
    this.resetEmail = email;
  }

  getResetEmail(): string {
    return this.resetEmail;
  }

  clearResetEmail(): void {
    this.resetEmail = '';
  }
}
