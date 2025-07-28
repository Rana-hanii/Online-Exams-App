import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./core/routes/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./core/routes/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'student',
    loadChildren: () =>
      import('./core/routes/student.routes').then((m) => m.STUDENT_ROUTES),
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
