import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.state';
import { openQuestionModal } from '../../../../store/questions/questions.actions';
import { ExamHistory } from '../../../../shared/interfaces/exam.interface';

@Component({
  selector: 'app-quiz-history',
  imports: [],
  templateUrl: './quiz-history.component.html',
  styleUrl: './quiz-history.component.css',
})
export class QuizHistoryComponent {
  historyExams: ExamHistory[] = [];
  router = inject(Router);

  // constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.historyExams = JSON.parse(localStorage.getItem('examHistory') || '[]');
  }

  showResult(examId: string): void {
    console.log('Show result for exam:', examId);
    this.router.navigate(['/student/exam-modal', examId]);
  }
}
