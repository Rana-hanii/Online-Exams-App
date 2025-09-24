import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthTokenService {
    private readonly TOKEN_KEY = 'access_token';

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    //* Save the token
    setToken(token: string): void {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.TOKEN_KEY, token);
      }
    }
  
    //* Get the token
    getToken(): string | null {
      if (isPlatformBrowser(this.platformId)) {
        return localStorage.getItem(this.TOKEN_KEY);
      }
      return null;
    }
  
    //* Clear the token
    clearToken(): void {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem(this.TOKEN_KEY);
      }
    }
  
    //* Check if there is a token
    hasToken(): boolean {
      return !!this.getToken();
    }
}


