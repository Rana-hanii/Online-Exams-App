import { Routes } from '@angular/router';
import { StudentLayoutComponent } from '../../layouts/student-layout/student-layout.component';
import { ModalGuard } from '../guards/modal.guard';
import { StudentGuard } from '../guards/student.guard';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    component: StudentLayoutComponent,
    canActivate: [StudentGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            '../../features/student/pages/dashboard/dashboard.component'
          ).then((m) => m.DashboardComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import(
            '../../features/auth/components/edit-profile/edit-profile.component'
          ).then((m) => m.EditProfileComponent),
      },
      {
        path: 'exam-modal/:examId',
        loadComponent: () =>
          import(
            '../../features/student/components/exam-modal/exam-modal.component'
          ).then((m) => m.ExamModalComponent),
        canDeactivate: [ModalGuard],
      },
      {
        path: 'exams/:subjectId',
        loadComponent: () =>
          import('../../features/student/pages/exams/exams.component').then(
            (m) => m.SelectExamsComponent
          ),
      },
      {
        path: 'quiz-history',
        loadComponent: () =>
          import(
            '../../features/student/pages/quiz-history/quiz-history.component'
          ).then((m) => m.QuizHistoryComponent),
      },
      {
        path: 'subjects',
        loadComponent: () =>
          import('../../features/student/pages/subject/subject.component').then(
            (m) => m.SubjectsComponent
          ),
      },
    ],
  },
  
];
