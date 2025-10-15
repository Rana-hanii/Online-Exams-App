import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthTokenService } from '../services/auth-token.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private auth = inject(AuthTokenService);
  private router = inject(Router);

  canActivate(): boolean {
    //! If user already authenticated, redirect to student dashboard
    if (this.auth.hasToken()) {
      this.router.navigate(['/student/dashboard']);
      return false;
    }
    return true;
  }
}
