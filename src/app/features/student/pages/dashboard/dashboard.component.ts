import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subject } from '../../../../shared/interfaces/subject.interface';
import { AppState } from '../../../../store/app.state';
import { loadSubjects } from '../../../../store/subjects/subjects.actions';
import {
  selectAllSubjects,
  selectSubjectsError,
  selectSubjectsLoading,
} from '../../../../store/subjects/subjects.selectors';
import { AosDirective } from '../../../../shared/directives/aos.directive';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CommonModule, AosDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  store = inject(Store<AppState>);

  loading$: Observable<boolean> = this.store.select(selectSubjectsLoading);
  error$: Observable<string | null> = this.store.select(selectSubjectsError);

  // ! loadSubjects action
  loadSubjects = loadSubjects;

 
  subjectLimit = 6;

  // override subjects$ to only expose the first `subjectLimit` items
  subjects$: Observable<Subject[]> = this.store
    .select(selectAllSubjects)
    .pipe(map((subjects) => subjects.slice(0, this.subjectLimit)));

  ngOnInit(): void {
    this.store.dispatch(loadSubjects());
  }
}
