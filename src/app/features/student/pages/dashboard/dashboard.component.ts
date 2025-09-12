import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../../store/app.state';
import { loadSubjects } from '../../../../store/subjects/subjects.actions';
import {
  selectAllSubjects,
  selectSubjectsError,
  selectSubjectsLoading,
} from '../../../../store/subjects/subjects.selectors';
import { Subject } from '../../../../shared/interfaces/subject.interface';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  store = inject(Store<AppState>);

  subjects$: Observable<Subject[]> = this.store.select(selectAllSubjects);
  loading$: Observable<boolean> = this.store.select(selectSubjectsLoading);
  error$: Observable<string | null> = this.store.select(selectSubjectsError);

  // ! loadSubjects action
  loadSubjects = loadSubjects;

  ngOnInit(): void {
    this.store.dispatch(loadSubjects());
  }
}
