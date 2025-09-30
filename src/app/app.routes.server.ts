import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'student/exam-modal/:examId',
    renderMode: RenderMode.Server   
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];

