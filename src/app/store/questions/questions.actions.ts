import { createAction, props } from '@ngrx/store';
import {
  Question,
  CheckQuestionsRequest,
  CheckQuestionsResponse,
  QuestionHistoryResponse,
} from '../../shared/interfaces/question.interface';

// * Modal status
export const openQuestionModal = createAction(
  '[Questions] Open Question Modal',
  props<{ examId: string }>()
);

export const closeQuestionModal = createAction(
  '[Questions] Close Question Modal'
);

// *  history modal actions
export const openHistoryModal = createAction(
  '[Questions] Open History Modal',
  props<{ examId: string }>()
);

export const closeHistoryModal = createAction(
  '[Questions] Close History Modal'
);

// * Load all questions
export const loadQuestions = createAction('[Questions] Load All');
export const loadQuestionsSuccess = createAction(
  '[Questions] Load All Success',
  props<{ questions: Question[] }>()
);
export const loadQuestionsFailure = createAction(
  '[Questions] Load All Failure',
  props<{ error: string }>()
);

// * Load questions by exam
export const loadQuestionsByExam = createAction(
  '[Questions] Load By Exam',
  props<{ examId: string }>()
);
export const loadQuestionsByExamSuccess = createAction(
  '[Questions] Load By Exam Success',
  props<{ questions: Question[] }>()
);
export const loadQuestionsByExamFailure = createAction(
  '[Questions] Load By Exam Failure',
  props<{ error: string }>()
);

// * Load question by ID
export const loadQuestionById = createAction(
  '[Questions] Load By Id',
  props<{ questionId: string }>()
);
export const loadQuestionByIdSuccess = createAction(
  '[Questions] Load By Id Success',
  props<{ question: Question }>()
);
export const loadQuestionByIdFailure = createAction(
  '[Questions] Load By Id Failure',
  props<{ error: string }>()
);

// * Check questions
export const checkQuestions = createAction(
  '[Questions] Check',
  props<{ userAnswers: CheckQuestionsRequest }>()
);
export const checkQuestionsSuccess = createAction(
  '[Questions] Check Success',
  props<{ result: CheckQuestionsResponse }>()
);
export const checkQuestionsFailure = createAction(
  '[Questions] Check Failure',
  props<{ error: string }>()
);

// * Get history
export const loadQuestionsHistory = createAction('[Questions] Load History');
export const loadQuestionsHistorySuccess = createAction(
  '[Questions] Load History Success',
  props<{ questions: QuestionHistoryResponse }>()
);
export const loadQuestionsHistoryFailure = createAction(
  '[Questions] Load History Failure',
  props<{ error: string }>()
);

// * Add question
export const addQuestion = createAction(
  '[Questions] Add',
  props<{ question: Partial<Question> }>()
);
export const addQuestionSuccess = createAction(
  '[Questions] Add Success',
  props<{ question: Question }>()
);
export const addQuestionFailure = createAction(
  '[Questions] Add Failure',
  props<{ error: string }>()
);
