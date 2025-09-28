import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { ExamHistoryItem, ExamHistoryQuestion } from '../../../../shared/interfaces/exam.interface';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-exam-result-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './exam-result-modal.component.html',
  styleUrls: ['./exam-result-modal.component.css']
})
export class ExamResultModalComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private examService = inject(ExamService);

  examResult: ExamHistoryItem | null = null;
  currentQuestionIndex = 0;
  showModal = true;

  ngOnInit(): void {
    const examResultId = this.route.snapshot.paramMap.get('id');
    if (examResultId) {
      this.examResult = this.examService.getExamResultById(examResultId);
      if (!this.examResult) {
        this.router.navigate(['/student/quiz-history']);
      }
    } else {
      this.router.navigate(['/student/quiz-history']);
    }
  }

  get currentQuestion(): ExamHistoryQuestion | null {
    if (!this.examResult || !this.examResult.questions) return null;
    return this.examResult.questions[this.currentQuestionIndex] || null;
  }

  get canGoNext(): boolean {
    if (!this.examResult) return false;
    return this.currentQuestionIndex < this.examResult.questions.length - 1;
  }

  get canGoPrevious(): boolean {
    return this.currentQuestionIndex > 0;
  }

  nextQuestion(): void {
    if (this.canGoNext) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.canGoPrevious) {
      this.currentQuestionIndex--;
    }
  }

  goToQuestion(index: number): void {
    if (this.examResult && index >= 0 && index < this.examResult.questions.length) {
      this.currentQuestionIndex = index;
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.router.navigate(['/student/quiz-history']);
  }

  //* Format time spent
  formatTimeSpent(timeInSeconds: number): string {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}m ${seconds}s`;
  }

  //* Get answer class for styling
  getAnswerClass(answer: any, question: ExamHistoryQuestion): string {
    const isCorrect = answer.key === question.correctAnswer;
    const isUserChoice = answer.key === question.userAnswer;
    
    if (isCorrect && isUserChoice) {
      return 'bg-green-100 border-green-500 text-green-800'; // Correct and chosen
    } else if (isCorrect) {
      return 'bg-green-50 border-green-300 text-green-700'; // Correct but not chosen
    } else if (isUserChoice) {
      return 'bg-red-100 border-red-500 text-red-800'; // Wrong and chosen
    }
    return 'bg-gray-50 border-gray-300 text-gray-700'; // Not chosen
  }

  //* Get question progress class
  getQuestionProgressClass(index: number, question: ExamHistoryQuestion): string {
    if (index === this.currentQuestionIndex) {
      return 'bg-blue-600 text-white';
    }
    return question.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
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
}