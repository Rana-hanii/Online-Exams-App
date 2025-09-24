import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { SubjectService } from '../../features/student/services/subject.service';
import { Subject, Subjects } from '../../shared/interfaces/subject.interface';
import * as SubjectsActions from './subjects.actions';

@Injectable()
export class SubjectsEffects {

  //^ Load All Subjects
  loadSubjects$ = createEffect((
    actions$ = inject(Actions),
    subjectService = inject(SubjectService)
  ) =>
    actions$.pipe(
      ofType(SubjectsActions.loadSubjects),
      switchMap(() =>
        subjectService.getAllSubjects().pipe(
          tap(res => console.log('subjects res', res)),
          map((res: Subject[] | Subjects) => {
            const subjects = Array.isArray(res) ? res : res?.subjects ?? [];
            return SubjectsActions.loadSubjectsSuccess({ subjects });
          }),
          catchError(error => of(SubjectsActions.loadSubjectsFailure({
            error: error.message || 'Failed to load subjects'
          })))
        )
      )
    )
  );

  //^ Load Subject By ID
  loadSubjectById$ = createEffect((
    actions$ = inject(Actions),
    subjectService = inject(SubjectService)
  ) =>
    actions$.pipe(
      ofType(SubjectsActions.loadSubjectById),
      switchMap(({ id }) =>
        subjectService.getSubjectById(id).pipe(
          tap(subject => console.log('subject', subject)),
          map(subject => SubjectsActions.loadSubjectByIdSuccess({ subject })),
          catchError(error => of(SubjectsActions.loadSubjectByIdFailure({
            error: error.message || 'Failed to load subject'
          })))
        )
      )
    )
  );

  //^ For Admin Dashboard
  //^ Add Subject
  addSubject$ = createEffect((
    actions$ = inject(Actions),
    subjectService = inject(SubjectService)
  ) =>
    actions$.pipe(
      ofType(SubjectsActions.addSubject),
      switchMap(({ subject }) =>
        subjectService.addSubject(subject).pipe(
          tap(newSubject => console.log('newSubject', newSubject)),
          map(newSubject => SubjectsActions.addSubjectSuccess({ subject: newSubject })),
          catchError(error => of(SubjectsActions.addSubjectFailure({
            error: error.message || 'Failed to add subject'
          })))
        )
      )
    )
  );

  //^ Update Subject
  updateSubject$ = createEffect((
    actions$ = inject(Actions),
    subjectService = inject(SubjectService)
  ) =>
    actions$.pipe(
      ofType(SubjectsActions.updateSubject),
      switchMap(({ id, subject }) =>
        subjectService.updateSubject(id, subject).pipe(
          tap(updatedSubject => console.log('updatedSubject', updatedSubject)),
          map(updatedSubject => SubjectsActions.updateSubjectSuccess({ subject: updatedSubject })),
          catchError(error => of(SubjectsActions.updateSubjectFailure({
            error: error.message || 'Failed to update subject'
          })))
        )
      )
    )
  );

  //^ Delete Subject
  deleteSubject$ = createEffect((
    actions$ = inject(Actions),
    subjectService = inject(SubjectService)
  ) =>
    actions$.pipe(
      ofType(SubjectsActions.deleteSubject),
      switchMap(({ id }) =>
        subjectService.deleteSubject(id).pipe(
          tap(() => console.log('deletedSubject', id)),
          map(() => SubjectsActions.deleteSubjectSuccess({ id })),
          catchError(error => of(SubjectsActions.deleteSubjectFailure({
            error: error.message || 'Failed to delete subject'
          })))
        )
      )
    )
  );
}
