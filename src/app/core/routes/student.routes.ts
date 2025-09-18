import { Routes } from '@angular/router';
import { StudentLayoutComponent } from '../../layouts/student-layout/student-layout.component';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    component: StudentLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../../features/student/pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'exam-modal/:examId',
        loadComponent: () =>
          import('../../features/student/components/exam-modal/exam-modal.component').then((m) => m.ExamModalComponent),
      },
      {
        path: 'exams/:subjectId',
        loadComponent: () =>
          import('../../features/student/pages/exams/exams.component').then((m) => m.SelectExamsComponent),
      },
      {
        path: 'quiz-history',
        loadComponent: () =>
          import('../../features/student/pages/quiz-history/quiz-history.component').then((m) => m.QuizHistoryComponent),
      },
    ],
  },
];
