import { createAction, props } from '@ngrx/store';
import { Subject } from '../../shared/interfaces/subject.interface';

//^ Load Subjects Actions
export const loadSubjects = createAction('[Subjects] Load Subjects');

export const loadSubjectsSuccess = createAction(
  '[Subjects] Load Subjects Success',
  props<{ subjects: Subject[] }>()
);

export const loadSubjectsFailure = createAction(
  '[Subjects] Load Subjects Failure',
  props<{ error: string }>()
);

//^ Load Single Subject Actions
export const loadSubjectById = createAction(
  '[Subjects] Load Subject By ID',
  props<{ id: string }>()
);

export const loadSubjectByIdSuccess = createAction(
  '[Subjects] Load Subject By ID Success',
  props<{ subject: Subject }>()
);

export const loadSubjectByIdFailure = createAction(
  '[Subjects] Load Subject By ID Failure',
  props<{ error: string }>()
);

//^ Add Subject Actions
export const addSubject = createAction(
  '[Subjects] Add Subject',
  props<{ subject: Omit<Subject, 'id'> }>()
);

export const addSubjectSuccess = createAction(
  '[Subjects] Add Subject Success',
  props<{ subject: Subject }>()
);

export const addSubjectFailure = createAction(
  '[Subjects] Add Subject Failure',
  props<{ error: string }>()
);

//^ Update Subject Actions
export const updateSubject = createAction(
  '[Subjects] Update Subject',
  props<{ id: string; subject: Partial<Subject> }>()
);

export const updateSubjectSuccess = createAction(
  '[Subjects] Update Subject Success',
  props<{ subject: Subject }>()
);

export const updateSubjectFailure = createAction(
  '[Subjects] Update Subject Failure',
  props<{ error: string }>()
);

//^ Delete Subject Actions
export const deleteSubject = createAction(
  '[Subjects] Delete Subject',
  props<{ id: string }>()
);

export const deleteSubjectSuccess = createAction(
  '[Subjects] Delete Subject Success',
  props<{ id: string }>()
);

export const deleteSubjectFailure = createAction(
  '[Subjects] Delete Subject Failure',
  props<{ error: string }>()
);

//^ Clear Actions
export const clearSubjects = createAction('[Subjects] Clear Subjects');
export const clearSelectedSubject = createAction('[Subjects] Clear Selected Subject');
