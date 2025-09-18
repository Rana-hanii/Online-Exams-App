import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthTokenService } from '../services/auth-token.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const authTokenService = inject(AuthTokenService);
  const token = authTokenService.getToken();
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        token: token
      },
    });
    return next(cloned);
  }

  return next(req); 
};
