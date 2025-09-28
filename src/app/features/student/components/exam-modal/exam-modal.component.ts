import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  Observable,
  Subject,
  Subscription,
  combineLatest,
  interval,
  map,
  takeUntil,
} from 'rxjs';

import { Question } from '../../../../shared/interfaces/question.interface';
import { AppState } from '../../../../store/app.state';
import { ExamService } from '../../services/exam.service';
import { ExamHistoryItem, ExamHistoryQuestion } from '../../../../shared/interfaces/exam.interface';
import {
  checkQuestions,
  closeQuestionModal,
  loadQuestionsByExam,
  openQuestionModal,
} from '../../../../store/questions/questions.actions';
import {
  selectAllQuestions,
  selectCheckResult,
  selectCorrectCount,
  selectIncorrectCount,
  selectQuestionModalOpen,
  selectQuestionsLoading,
  selectScorePercent,
} from '../../../../store/questions/questions.selectors';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-exam-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    RadioButtonModule,
  ],
  templateUrl: './exam-modal.component.html',
  styleUrl: './exam-modal.component.css',
})
export class ExamModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  store = inject(Store<AppState>);
  route = inject(ActivatedRoute);
  router = inject(Router);
  examService = inject(ExamService);

  examId = '';
  examTitle = '';
  subjectName = '';
  //*  Store
  questionModalOpen$: Observable<boolean> = this.store.select(selectQuestionModalOpen);
  questions$: Observable<Question[]> = this.store.select(selectAllQuestions);
  loading$: Observable<boolean> = this.store.select(selectQuestionsLoading);
  showResults$: Observable<boolean> = this.store.select(selectCheckResult);
  scorePercent$: Observable<number> = this.store.select(selectScorePercent);
  correctCount$: Observable<number> = this.store.select(selectCorrectCount);
  incorrectCount$: Observable<number> = this.store.select(selectIncorrectCount);

  //* review mode: after submit and clicking Show Results
  reviewMode = false;
  //* maps for quick lookup of correct answer key and chosen wrong answer per question
  correctAnswerByQuestionId: Record<string, string> = {};
  chosenAnswerByQuestionId: Record<string, string> = {};
  questions: Question[] = [];
  currentIndex = 0;
  //* questionId -> selected key
  selections: Record<string, string> = {};
  //* Timer (seconds)
  durationMinutes = 15;
  secondsLeft = this.durationMinutes * 60;
  //* Subscription for timer
  private tickSub?: Subscription;

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('examId') || '';
    if (this.examId) {
      this.store.dispatch(openQuestionModal({ examId: this.examId }));
      this.store.dispatch(loadQuestionsByExam({ examId: this.examId }));
      
      // Get exam details for history
      this.examService.getExamById(this.examId).subscribe((exam: any) => {
        this.examTitle = exam.title;
        this.subjectName = exam.subject;
      });
    }

    this.questions$.pipe(takeUntil(this.destroy$)).subscribe((qs: Question[]) => {
      this.questions = qs ?? [];
      if (this.currentIndex >= this.questions.length) {
        this.currentIndex = Math.max(0, this.questions.length - 1);
      }
    });

    // Listen to check results to save to local storage
    combineLatest([
      this.showResults$,
      this.scorePercent$,
      this.correctCount$,
      this.incorrectCount$
    ]).pipe(takeUntil(this.destroy$)).subscribe(([showResults, scorePercent, correctCount, incorrectCount]: [boolean, number, number, number]) => {
      if (showResults && scorePercent !== undefined) {
        this.saveExamResultToLocalStorage(scorePercent, correctCount, incorrectCount);
      }
    });

    this.startTimer();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.tickSub?.unsubscribe();
  }

  //* Exam Questions >> Timer
  private startTimer(): void {
    this.tickSub?.unsubscribe();
    this.secondsLeft = this.durationMinutes * 60;
    this.tickSub = interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.secondsLeft > 0) {
          this.secondsLeft--;
        } else {
          this.submit();
        }
      });
  }
  //^ get mmss(Minutes:Seconds) format
  get mmss(): string {
    const m = Math.floor(this.secondsLeft / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(this.secondsLeft % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  }

  //* Exam Questions >> Answers
  //^ select answer
  selectAnswer(questionId: string, key: string): void {
    if (this.reviewMode) return; //& prevent changing in review
    this.selections[questionId] = key;
  }

  //^ check if answer is selected
  isSelected(questionId: string, key: string): boolean {
    return this.selections[questionId] === key;
  }

  //^ check if answer is correct
  isCorrectOption(questionId: string, key: string): boolean {
    return this.correctAnswerByQuestionId[questionId] === key;
  }

  //^ check if answer is wrong
  isWrongChosen(questionId: string, key: string): boolean {
    return (
      this.chosenAnswerByQuestionId[questionId] === key &&
      !this.isCorrectOption(questionId, key)
    );
  }

  //^ check if can go next
  get canGoNext(): boolean {
    if (this.reviewMode) return this.currentIndex < this.questions.length - 1;
    const q = this.questions[this.currentIndex];
    if (!q) return false;
    return (
      !!this.selections[q._id] && this.currentIndex < this.questions.length - 1
    );
  }

  //^ check if can submit
  get canSubmit(): boolean {
    if (this.reviewMode) return false;
    if (!this.questions.length) return false;
    const allAnswered = this.questions.every((q) => !!this.selections[q._id]);
    return (
      allAnswered ||
      (this.currentIndex === this.questions.length - 1 &&
        !!this.selections[this.questions[this.currentIndex]._id])
    );
  }
  //*  Btn Actions
  next(): void {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
    }
  }

  back(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  submit(): void {
    //& Stop timer
    this.tickSub?.unsubscribe();
    //& check answers
    const answers = this.questions.map((q) => ({
      questionId: q._id,
      correct: this.selections[q._id] || '',
    }));
    this.store.dispatch(
      checkQuestions({
        userAnswers: {
          answers,
          time: this.durationMinutes * 60 - this.secondsLeft,
        },
      })
    );
    //& keep dialog open to show results or next actions
  }

  close(): void {
    this.store.dispatch(closeQuestionModal());
    this.router.navigate(['/student/dashboard']);
  }

  //* Progress dots
  progressClass(i: number): string {
    const q = this.questions[i];
    if (!q) return '';
    if (i === this.currentIndex) return 'bg-blue-600';
    if (this.reviewMode) {
      if (this.selections[q._id] === this.correctAnswerByQuestionId[q._id])
        return 'bg-green-500';
      if (this.selections[q._id]) return 'bg-red-500';
    }
    return this.selections[q._id] ? 'bg-blue-400' : 'bg-gray-300';
  }

  //* Result
  showDetailedResults(): void {
    //& Build lookup maps from questions and current selections
    this.correctAnswerByQuestionId = {};
    this.chosenAnswerByQuestionId = {};
    for (const q of this.questions) {
      this.correctAnswerByQuestionId[q._id] = q.correct;
      if (this.selections[q._id])
        this.chosenAnswerByQuestionId[q._id] = this.selections[q._id];
    }
    this.reviewMode = true;
    //& jump to first question for review
    this.currentIndex = 0;
  }
  //* Result >> Score Circle
  //^ Computed metrics for the ring segmentation
  readonly circumference = 251.2;
  metrics$: Observable<{
    blueDash: string;
    redDash: string;
    redOffset: number;
  }> = combineLatest([this.correctCount$, this.incorrectCount$]).pipe(
    map(([correct, wrong]: [number, number]) => {
      const total = Math.max(1, Number(correct || 0) + Number(wrong || 0));
      const correctLen = this.circumference * (Number(correct || 0) / total);
      const wrongLen = this.circumference * (Number(wrong || 0) / total);
      return {
        blueDash: `${correctLen} ${this.circumference - correctLen}`,
        redDash: `${wrongLen} ${this.circumference - wrongLen}`,
        redOffset: -correctLen,
      };
    })
  );

  //* Save exam result to local storage
  private saveExamResultToLocalStorage(scorePercent: number, correctCount: number, incorrectCount: number): void {
    if (!this.examId || !this.examTitle || this.questions.length === 0) return;

    const examHistoryItem: ExamHistoryItem = {
      _id: this.generateUniqueId(),
      examId: this.examId,
      examTitle: this.examTitle,
      subjectName: this.subjectName || 'Unknown Subject',
      totalQuestions: this.questions.length,
      correctAnswers: correctCount,
      wrongAnswers: incorrectCount,
      score: Math.round(scorePercent),
      timeSpent: this.durationMinutes * 60 - this.secondsLeft,
      completedAt: new Date().toISOString(),
      questions: this.mapQuestionsToHistory()
    };

    this.examService.saveExamResultToLocalStorage(examHistoryItem);
  }

  //* Map current questions to history format
  private mapQuestionsToHistory(): ExamHistoryQuestion[] {
    return this.questions.map(question => ({
      questionId: question._id,
      question: question.question,
      answers: question.answers.map(answer => ({
        key: answer.key,
        answer: answer.answer
      })),
      correctAnswer: question.correct,
      userAnswer: this.selections[question._id] || '',
      isCorrect: this.selections[question._id] === question.correct
    }));
  }

  //* Generate unique ID for exam result
  private generateUniqueId(): string {
    return `exam_result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
