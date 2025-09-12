import { createAction, props } from '@ngrx/store';
import { Exam } from '../../shared/interfaces/exam.interface';

//^ Load Exams Actions
export const loadExams = createAction('[Exams] Load Exams');

export const loadExamsSuccess = createAction(
  '[Exams] Load Exams Success',
  props<{ exams: Exam[] }>()
);

export const loadExamsFailure = createAction(
  '[Exams] Load Exams Failure',
  props<{ error: string }>()
);

//^ Load Single Exam Actions
export const loadExamById = createAction(
  '[Exams] Load Exam By ID',
  props<{ id: string }>()
);

export const loadExamByIdSuccess = createAction(
  '[Exams] Load Exam By ID Success',
  props<{ exam: Exam }>()
);

export const loadExamByIdFailure = createAction(
  '[Exams] Load Exam By ID Failure',
  props<{ error: string }>()
);

//^^^^^^^^^^^^ Load Exams by Subject ID
export const loadExamsBySubject = createAction(
  '[Exams] Load Exams By Subject',
  props<{ subjectId: string }>()
);

export const loadExamsBySubjectSuccess = createAction(
  '[Exams] Load Exams By Subject Success',
  props<{ exams: Exam[] }>()
);

export const loadExamsBySubjectFailure = createAction(
  '[Exams] Load Exams By Subject Failure',
  props<{ error: string }>()
);
//^ For Admin Dashboard
//^ Add Exam Actions
export const addExam = createAction(
  '[Exams] Add Exam',
  props<{ exam: Omit<Exam, '_id'> }>()
);

export const addExamSuccess = createAction(
  '[Exams] Add Exam Success',
  props<{ exam: Exam }>()
);

export const addExamFailure = createAction(
  '[Exams] Add Exam Failure',
  props<{ error: string }>()
);

//^ Clear Actions
export const clearExams = createAction('[Exams] Clear Exams');
export const clearSelectedExam = createAction('[Exams] Clear Selected Exam');
