import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import * as QuestionsActions from './questions.actions';
import { QuestionService } from '../../features/student/services/question.service';

@Injectable()
export class QuestionsEffects {
  private actions$ = inject(Actions);
  private questionService = inject(QuestionService);

  loadAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestionsActions.loadQuestions),
      mergeMap(() =>
        this.questionService.getAllQuestions().pipe(
          tap((questions) => console.log('questions', questions)),
          map(questions => QuestionsActions.loadQuestionsSuccess({ questions })),
          catchError(error => of(QuestionsActions.loadQuestionsFailure({ error })))
        )
      )
    )
  );

  loadByExam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestionsActions.loadQuestionsByExam),
      mergeMap(({ examId }) =>
        this.questionService.getQuestionsByExam(examId).pipe(
          tap((questions) => console.log('questions', questions)),
          map(questions => QuestionsActions.loadQuestionsByExamSuccess({ questions })),
          catchError(error => of(QuestionsActions.loadQuestionsByExamFailure({ error })))
        )
      )
    )
  );

  loadById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestionsActions.loadQuestionById),
      mergeMap(({ questionId }) =>
        this.questionService.getQuestionById(questionId).pipe(
          tap((questions) => console.log('questions', questions)),
          map(question => QuestionsActions.loadQuestionByIdSuccess({ question })),
          catchError(error => of(QuestionsActions.loadQuestionByIdFailure({ error })))
        )
      )
    )
  );

  check$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestionsActions.checkQuestions),
      mergeMap(({ userAnswers }) =>
        this.questionService.checkQuestions(userAnswers).pipe(
          tap((questions) => console.log('questions', questions)),
          map(result => QuestionsActions.checkQuestionsSuccess({ result })),
          catchError(error => of(QuestionsActions.checkQuestionsFailure({ error })))
        )
      )
    )
  );

  loadHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestionsActions.loadQuestionsHistory),
      mergeMap(() =>
        this.questionService.getQuestionsHistory().pipe(
          tap((questions) => console.log('questions', questions)),
          map(questions => QuestionsActions.loadQuestionsHistorySuccess({ questions })),
          catchError(error => of(QuestionsActions.loadQuestionsHistoryFailure({ error })))
        )
      )
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuestionsActions.addQuestion),
      mergeMap(({ question }) =>
        this.questionService.addQuestion(question).pipe(
          tap((questions) => console.log('questions', questions)),
          map(q => QuestionsActions.addQuestionSuccess({ question: q })),
          catchError(error => of(QuestionsActions.addQuestionFailure({ error })))
        )
      )
    )
  );
}
