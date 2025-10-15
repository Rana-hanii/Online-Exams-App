import { Routes } from '@angular/router';
import { AuthLayoutComponent } from '../../layouts/auth-layout/auth-layout.component';
import { AuthGuard } from '../guards/auth.guard';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'full',
      },
      {
        path: 'sign-in',
        loadComponent: () =>
          import('../../features/auth/pages/sign-in/sign-in.component').then((m) => m.SignInComponent),
      },
   
      {
        path: 'sign-up',
        loadComponent: () =>
          import('../../features/auth/pages/sign-up/sign-up.component').then((m) => m.SignUpComponent),
      },
      {
        path: 'verify-code',
        loadComponent: () =>
          import('../../features/auth/pages/verify-code/verify-code.component').then((m) => m.VerifyCodeComponent),
      },
      {
        path: 'forget-password',
        loadComponent: () =>
          import('../../features/auth/pages/forget-password/forget-password.component').then((m) => m.ForgetPasswordComponent),
      },
      {
        path: 'set-password',
        loadComponent: () =>
          import('../../features/auth/pages/set-password/set-password.component').then((m) => m.SetPasswordComponent),
      },
    ]
  } 
  
];
