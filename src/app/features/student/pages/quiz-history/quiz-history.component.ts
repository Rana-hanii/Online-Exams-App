import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

interface LocalHistoryEntry {
  id: string;
  examId: string;
  date: string;
  correct: number;
  wrong: number;
  total: number;
  percent: number;
  raw?: any;
  snapshot?: {
    questions: Array<{
      _id: string;
      question: string;
      answers?: any;
      correct?: string;
    }>;
    selections: Record<string, string>;
    correctAnswerByQuestionId?: Record<string, string>;
    chosenAnswerByQuestionId?: Record<string, string>;
  };
}

@Component({
  selector: 'app-quiz-history',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule],
  templateUrl: './quiz-history.component.html',
  styleUrl: './quiz-history.component.css',
})
export class QuizHistoryComponent implements OnInit {
  history: LocalHistoryEntry[] = [];
  selectedEntry: LocalHistoryEntry | null = null;
  showDialog = false;
  showRaw = false;
  private router = inject(Router);

  // metrics similar to exam modal
  readonly circumference = 251.2;

  ngOnInit(): void {
    this.loadLocalHistory();
  }

  private loadLocalHistory() {
    try {
      const key = 'local_quiz_history';
      const json = localStorage.getItem(key);
      this.history = json ? JSON.parse(json) : [];
    } catch (e) {
      console.error('Failed to load local history', e);
      this.history = [];
    }
  }

  viewEntry(entry: LocalHistoryEntry) {
    // Navigate to the canonical exam modal route and let the modal load the snapshot by historyId
    this.router.navigate(['/student/exam-modal', entry.examId], {
      queryParams: { historyId: entry.id },
    });
  }
}
