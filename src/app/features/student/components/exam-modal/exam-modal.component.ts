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
import { AosDirective } from '../../../../shared/directives/aos.directive';

@Component({
  selector: 'app-exam-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    RadioButtonModule,
    AosDirective
  ],
  templateUrl: './exam-modal.component.html',
  styleUrl: './exam-modal.component.css',
})
export class ExamModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  store = inject(Store<AppState>);
  route = inject(ActivatedRoute);
  router = inject(Router);

  examId = '';
  //*  Store
  questionModalOpen$: Observable<boolean> = this.store.select(
    selectQuestionModalOpen
  );
  questions$: Observable<Question[]> = this.store.select(selectAllQuestions);
  loading$: Observable<boolean> = this.store.select(selectQuestionsLoading);
  showResults$: Observable<boolean> = this.store.select(selectCheckResult);
  scorePercent$: Observable<number> = this.store.select(selectScorePercent);
  correctCount$: Observable<number> = this.store.select(selectCorrectCount);
  incorrectCount$: Observable<number> = this.store.select(selectIncorrectCount);

  //* review mode: after submit and clicking Show Results
  reviewMode = false;
  // if true, timer shouldn't start (used when viewing saved history snapshot or in review)
  disableTimer = false;
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
    }

    this.questions$.pipe(takeUntil(this.destroy$)).subscribe((qs) => {
      this.questions = qs ?? [];
      if (this.currentIndex >= this.questions.length) {
        this.currentIndex = Math.max(0, this.questions.length - 1);
      }
    });

    // Start timer only when there are questions. If no questions, ensure timer is stopped.
    this.questions$.pipe(takeUntil(this.destroy$)).subscribe((qs) => {
      const qlist = qs ?? [];
      if (qlist.length > 0) {
        // if timer not running and not disabled, start it
        if (!this.disableTimer && (!this.tickSub || this.tickSub.closed)) {
          this.startTimer();
        }
      } else {
        // no questions -> stop timer and reset secondsLeft so it doesn't count down
        this.tickSub?.unsubscribe();
        this.secondsLeft = this.durationMinutes * 60;
      }
    });

    // Save result to local history when it appears in the store
    // If a history entry id is provided in the query params, load snapshot instead of fresh load
    const historyId = this.route.snapshot.queryParamMap.get('historyId');
    if (historyId) {
      try {
        const key = 'local_quiz_history';
        const json = localStorage.getItem(key) || '[]';
        const arr = JSON.parse(json);
        const entry = arr.find((e: any) => e.id === historyId);
        if (entry && entry.snapshot) {
          // apply snapshot to component state
          const snap = entry.snapshot;
          this.questions = snap.questions || [];
          this.selections = snap.selections || {};
          this.correctAnswerByQuestionId = snap.correctAnswerByQuestionId || {};
          this.chosenAnswerByQuestionId = snap.chosenAnswerByQuestionId || {};
          this.reviewMode = true;
          this.currentIndex = 0;
          // when viewing a snapshot we must stop the timer and prevent it from restarting
          this.disableTimer = true;
          this.tickSub?.unsubscribe();
          // ensure display shows a stable time (reset to configured duration)
          this.secondsLeft = this.durationMinutes * 60;
        }
      } catch (e) {
        console.error('Failed to load history snapshot', e);
      }
    }
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
    // save a snapshot of the review to local history so it can be viewed later
    this.saveReviewSnapshot();
  }
  //* Result >> Score Circle
  //^ Computed metrics for the ring segmentation
  readonly circumference = 251.2;
  metrics$: Observable<{
    blueDash: string;
    redDash: string;
    redOffset: number;
  }> = combineLatest([this.correctCount$, this.incorrectCount$]).pipe(
    map(([correct, wrong]) => {
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

  // Save a review snapshot (questions + selections + lookup maps) when user views results
  private saveReviewSnapshot() {
    try {
      const examId =
        this.examId || this.route.snapshot.paramMap.get('examId') || '';
      const now = new Date().toISOString();
      const correct = Object.keys(this.correctAnswerByQuestionId || {}).filter(
        (qid) => this.selections[qid] === this.correctAnswerByQuestionId[qid]
      ).length;
      const wrong = Object.keys(this.selections || {}).length - correct;
      const total = Math.max(1, correct + wrong);
      const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

      const snapshot = {
        questions: this.questions.map((q) => ({
          _id: q._id,
          question: q.question,
          answers: q.answers,
          correct: q.correct,
        })),
        selections: this.selections,
        correctAnswerByQuestionId: this.correctAnswerByQuestionId,
        chosenAnswerByQuestionId: this.chosenAnswerByQuestionId,
      };

      const entry = {
        id: `${examId}_${Date.now()}`,
        examId,
        date: now,
        correct,
        wrong,
        total,
        percent,
        raw: null,
        snapshot,
      };

      const key = 'local_quiz_history';
      const existingJson = localStorage.getItem(key);
      const arr = existingJson ? JSON.parse(existingJson) : [];
      arr.unshift(entry);
      const truncated = arr.slice(0, 100);
      localStorage.setItem(key, JSON.stringify(truncated));
    } catch (e) {
      console.error('Failed to save review snapshot', e);
    }
  }
}
