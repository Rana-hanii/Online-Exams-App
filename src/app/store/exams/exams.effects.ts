import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ExamService } from '../../features/student/services/exam.service';
import * as ExamsActions from './exams.actions';

@Injectable()
export class ExamsEffects {

  private actions$ = inject(Actions);
  private examService = inject(ExamService);

  //^ Load All Exams
  loadExams$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ExamsActions.loadExams),
        switchMap(() =>
          this.examService.getAllExams().pipe(
            tap((res) => console.log('exams res', res)),
            map((res: any) =>
              ExamsActions.loadExamsSuccess({ exams: res?.exams ?? res ?? [] })
            ),
            catchError((error) =>
              of(
                ExamsActions.loadExamsFailure({
                  error: error.message || 'Failed to load exams',
                })
              )
            )
          )
        )
      )
  );

  //^ Load Exam By ID
  loadExamById$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ExamsActions.loadExamById),
        switchMap(({ id }) =>
          this.examService.getExamById(id).pipe(
            tap((exam) => console.log('exam', exam)),
            map((exam) => ExamsActions.loadExamByIdSuccess({ exam })),
            catchError((error) =>
              of(
                ExamsActions.loadExamByIdFailure({
                  error: error.message || 'Failed to load exam',
                })
              )
            )
          )
        )
      )
  );

  //^^^^^^ Load Exams By Subject ID
  loadExamsBySubject$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ExamsActions.loadExamsBySubject),
        switchMap(({ subjectId }) =>
          this.examService.getExamsBySubject(subjectId).pipe(
            tap((exams) => console.log('exams by subject', exams)),
            map((res: any) =>
              ExamsActions.loadExamsBySubjectSuccess({
                exams: res?.exams ?? res ?? [],
              })
            ),
            catchError((error) =>
              of(
                ExamsActions.loadExamsBySubjectFailure({
                  error: error.message || 'Failed to load exams by subject',
                })
              )
            )
          )
        )
      )
  );

  //^ For Admin Dashboard
  //^ Add Exam
  addExam$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ExamsActions.addExam),
        switchMap(({ exam }) =>
          this.examService.addExam(exam).pipe(
            tap((newExam) => console.log('newExam', newExam)),
            map((newExam) => ExamsActions.addExamSuccess({ exam: newExam })),
            catchError((error) =>
              of(
                ExamsActions.addExamFailure({
                  error: error.message || 'Failed to add exam',
                })
              )
            )
          )
        )
      )
  );
}
