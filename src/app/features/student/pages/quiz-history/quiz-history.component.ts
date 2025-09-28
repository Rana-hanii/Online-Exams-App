import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ExamHistoryItem } from '../../../../shared/interfaces/exam.interface';
import { ExamResultHandlerService } from '../../../../shared/utils/exam-result-handler.service';
import * as ExamsActions from '../../../../store/exams/exams.actions';
import { 
  selectExamHistory, 
  selectExamsLoading, 
  selectExamsError,
  selectHistoryModalOpen,
  selectSelectedHistoryExam
} from '../../../../store/exams/exams.selectors';

@Component({
  selector: 'app-quiz-history',
  imports: [CommonModule],
  templateUrl: './quiz-history.component.html',
  styleUrl: './quiz-history.component.css'
})
export class QuizHistoryComponent implements OnInit {
  private store = inject(Store);
  private examResultHandler = inject(ExamResultHandlerService);

  examHistory$: Observable<ExamHistoryItem[]> = this.store.select(selectExamHistory);
  loading$: Observable<boolean> = this.store.select(selectExamsLoading);
  error$: Observable<string | null> = this.store.select(selectExamsError);
  historyModalOpen$: Observable<boolean> = this.store.select(selectHistoryModalOpen);
  selectedHistoryExam$: Observable<ExamHistoryItem | null> = this.store.select(selectSelectedHistoryExam);

  ngOnInit(): void {
    // Load exam history from local storage on component init
    this.store.dispatch(ExamsActions.loadExamHistory());
    
    // إضافة بيانات وهمية للتجربة (يمكن حذف هذا السطر لاحقاً)
    this.addSampleDataIfEmpty();
  }

  //* إضافة بيانات وهمية للتجربة إذا كان التاريخ فارغ
  private addSampleDataIfEmpty(): void {
    this.examHistory$.subscribe(history => {
      if (history.length === 0) {
        console.log('إضافة بيانات وهمية للتجربة...');
        this.examResultHandler.createSampleExamHistory();
      }
    }).unsubscribe(); // unsubscribe فوراً لأننا نريد فقط فحص واحد
  }

  //* Open modal to view exam details
  viewExamDetails(examResult: ExamHistoryItem): void {
    this.store.dispatch(ExamsActions.openHistoryModal({ examHistory: examResult }));
  }

  //* Close history modal
  onCloseModal(): void {
    this.store.dispatch(ExamsActions.closeHistoryModal());
  }

  //* Format time spent in minutes and seconds
  formatTimeSpent(timeInSeconds: number): string {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}m ${seconds}s`;
  }

  //* Format completion date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  //* Get score color based on percentage
  getScoreColor(score: number): string {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  //* Get score percentage
  getScorePercentage(score: number, totalQuestions: number): number {
    return Math.round((score / totalQuestions) * 100);
  }

  //* Format duration in minutes
  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} دقيقة`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} ساعة ${remainingMinutes > 0 ? `${remainingMinutes} دقيقة` : ''}`;
  }

  //* Track by function for ngFor
  trackByExamId(index: number, exam: ExamHistoryItem): string {
    return exam._id;
  }
}
