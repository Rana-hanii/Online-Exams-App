import { Routes } from '@angular/router';
import { StudentLayoutComponent } from '../../layouts/student-layout/student-layout.component'; // عدلي المسار إذا لزم الأمر

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    component: StudentLayoutComponent,
    children: [
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
        path: 'exams',
        loadComponent: () =>
          import('../../features/student/pages/exams/exams.component').then((m) => m.SelectExamsComponent),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
