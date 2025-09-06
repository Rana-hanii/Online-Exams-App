import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '../../layouts/admin-layout/admin-layout.component';
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../../features/admin/pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'add-quiz',
        loadComponent: () =>
          import('../../features/admin/pages/add-quiz/add-quiz.component').then((m) => m.AddQuizComponent),
      },
      {
        path: 'add-question',
        loadComponent: () =>
          import('../../features/admin/pages/add-question/add-question.component').then((m) => m.AddQuestionComponent),
      },
    ]
  }
];
