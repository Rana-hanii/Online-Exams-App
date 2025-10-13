import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AvatarModule } from 'primeng/avatar';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Observable, map } from 'rxjs';
import { Exam } from '../../../../shared/interfaces/exam.interface';
import { AppState } from '../../../../store/app.state';
import { loadExams } from '../../../../store/exams/exams.actions';
import { selectAllExams } from '../../../../store/exams/exams.selectors';

@Component({
  selector: 'app-header',
  imports: [CommonModule, InputIcon, IconField, InputTextModule, FormsModule, AvatarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  store = inject(Store<AppState>);
  router = inject(Router);

  // Search model
  searchText = '';

  // all exams from store
  allExams$: Observable<Exam[]> = this.store.select(selectAllExams);

  // computed matches (first 10)
  matches$: Observable<Exam[]> = this.allExams$.pipe(
    map((exams) =>
      exams.filter((e) =>
        e.title?.toLowerCase().includes(this.searchText.toLowerCase())
      )
    ),
    map((arr) => arr.slice(0, 10))
  );

  // currently selected exam id (set by clicking a suggestion or by first match)
  selectedExamId: string | null = null;

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  ngOnInit(): void {
    // make sure all exams are loaded so search works site-wide
    this.store.dispatch(loadExams());
  }

  pickExam(exam: Exam) {
    this.searchText = exam.title || '';
    this.selectedExamId = exam._id || null;
  }

  startQuiz(): void {
    const id = this.selectedExamId;
    if (!id) {
      // try to pick first match if none explicitly selected
      this.allExams$.pipe(map(exams => exams.find(e => e.title?.toLowerCase().includes(this.searchText.toLowerCase())))).subscribe(found => {
        const fid = found?._id;
        if (fid) this.router.navigate(['/student/exam-modal', fid]);
      });
      return;
    }
    this.router.navigate(['/student/exam-modal', id]);
  }
}
