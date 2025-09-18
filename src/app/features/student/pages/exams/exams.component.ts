import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Exam } from '../../../../shared/interfaces/exam.interface';
import { AppState } from '../../../../store/app.state';
import { loadExamsBySubject } from '../../../../store/exams/exams.actions';
import {
  selectAllExams,
  selectExamsError,
  selectExamsLoading
} from '../../../../store/exams/exams.selectors';

@Component({
  selector: 'app-exams',
  imports: [CommonModule],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.css'
})
export class SelectExamsComponent implements OnInit {
  store = inject(Store<AppState>);
  route = inject(ActivatedRoute);
  router = inject(Router);

  exams$: Observable<Exam[]> = this.store.select(selectAllExams);
  loading$: Observable<boolean> = this.store.select(selectExamsLoading);
  error$: Observable<string | null> = this.store.select(selectExamsError);

  // ! loadExamsBySubject action
  loadExamsBySubject = loadExamsBySubject;

  ngOnInit(): void {
    //*  Get subjectId from route params
    const subjectId = this.route.snapshot.paramMap.get('subjectId');
    console.log('Subject ID from route:', subjectId);
    
    if (subjectId) {
      this.store.dispatch(loadExamsBySubject({ subjectId }));
    }
  }

  startExam(examId: string): void {
    // Navigate to exam modal using absolute path
    this.router.navigate(['/student/exam-modal', examId]);
  }
}
