import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthTokenService {
    private readonly TOKEN_KEY = 'access_token';

    //* Save the token
    setToken(token: string): void {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  
    //* Get the token
    getToken(): string | null {
      return localStorage.getItem(this.TOKEN_KEY);
    }
  
    //* Clear the token
    clearToken(): void {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  
    //* Check if there is a token
    hasToken(): boolean {
      return !!this.getToken();
    }
}


