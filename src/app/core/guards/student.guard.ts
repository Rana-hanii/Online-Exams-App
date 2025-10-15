import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthTokenService } from '../services/auth-token.service';

@Injectable({ providedIn: 'root' })
export class StudentGuard implements CanActivate {
  private auth = inject(AuthTokenService);
  private router = inject(Router);

  canActivate(): boolean {
    if (!this.auth.hasToken()) {
      //! not authenticated -> redirect to sign-in
      this.router.navigate(['/auth/sign-in']);
      return false;
    }
    return true;
  } 
  
}
