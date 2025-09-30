import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { Subject } from '../../../../shared/interfaces/subject.interface';
import { AppState } from '../../../../store/app.state';
import { loadSubjects } from '../../../../store/subjects/subjects.actions';
import {
    selectAllSubjects,
    selectSubjectsError,
    selectSubjectsLoading,
} from '../../../../store/subjects/subjects.selectors';

@Component({
  selector: 'app-subjects',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.css',
})
export class SubjectsComponent implements OnInit {
  store = inject(Store<AppState>);

  subjects$: Observable<Subject[]> = this.store.select(selectAllSubjects);
  loading$: Observable<boolean> = this.store.select(selectSubjectsLoading);
  error$: Observable<string | null> = this.store.select(selectSubjectsError);
  
  searchTerm = '';
  filteredSubjects$: Observable<Subject[]> = this.subjects$;
  subjectsCount$: Observable<number> = this.subjects$.pipe(map(subjects => subjects.length));

  ngOnInit(): void {
    this.store.dispatch(loadSubjects());
    
    // Create filtered subjects observable
    this.filteredSubjects$ = this.subjects$.pipe(
      map(subjects => {
        if (!this.searchTerm.trim()) {
          return subjects;
        }
        return subjects.filter(subject => 
          subject.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      })
    );

    // Create subjects count observable
    this.subjectsCount$ = this.subjects$.pipe(
      map(subjects => subjects.length)
    );
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    
    // Update filtered subjects
    this.filteredSubjects$ = this.subjects$.pipe(
      map(subjects => {
        if (!this.searchTerm.trim()) {
          return subjects;
        }
        return subjects.filter(subject => 
          subject.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      })
    );
  }
}
