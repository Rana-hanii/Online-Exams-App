import { Routes } from '@angular/router';

export const STUDENT_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('../../features/student/pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'quiz-start',
    loadComponent: () =>
      import('../../features/student/pages/quiz-start/quiz-start.component').then((m) => m.QuizStartComponent),
  },
  {
    path: 'quiz-answer',
    loadComponent: () =>
      import('../../features/student/pages/quiz-answer/quiz-answer.component').then((m) => m.QuizAnswerComponent),
  },
  {
    path: 'quiz-history',
    loadComponent: () =>
      import('../../features/student/pages/quiz-history/quiz-history.component').then((m) => m.QuizHistoryComponent),
  },
  {
    path: 'select-diploma',
    loadComponent: () =>
      import('../../features/student/pages/select-diploma/select-diploma.component').then((m) => m.SelectDiplomaComponent),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];

