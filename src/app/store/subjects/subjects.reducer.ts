import { createReducer, on } from '@ngrx/store';
import { SubjectState } from '../../shared/interfaces/subject.interface';
import * as SubjectsActions from './subjects.actions';

export const subjectsFeatureKey = 'subjects';

export const initialState: SubjectState = {
  subjects: [],
  loading: false,
  error: null,
  selectedSubject: null,
};

export const subjectsReducer = createReducer(
  initialState,

  //* Load All Subjects
  on(SubjectsActions.loadSubjects, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(SubjectsActions.loadSubjectsSuccess, (state, { subjects }) => ({
    ...state,
    subjects,
    loading: false,
    error: null,
  })),

  on(SubjectsActions.loadSubjectsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  //* Load Subject By ID
  on(SubjectsActions.loadSubjectById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(SubjectsActions.loadSubjectByIdSuccess, (state, { subject }) => ({
    ...state,
    selectedSubject: subject,
    loading: false,
    error: null,
  })),

  on(SubjectsActions.loadSubjectByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  //^ For Admin Dashboard
  //* Add Subject
  on(SubjectsActions.addSubject, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(SubjectsActions.addSubjectSuccess, (state, { subject }) => ({
    ...state,
    subjects: [...state.subjects, subject],
    loading: false,
    error: null,
  })),

  on(SubjectsActions.addSubjectFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  //* Update Subject
  on(SubjectsActions.updateSubject, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(SubjectsActions.updateSubjectSuccess, (state, { subject }) => ({
    ...state,
    subjects: state.subjects.map((s) => (s._id === subject._id ? subject : s)),
    selectedSubject:
      state.selectedSubject?._id === subject._id
        ? subject
        : state.selectedSubject,
    loading: false,
    error: null,
  })),

  on(SubjectsActions.updateSubjectFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  //* Delete Subject
  on(SubjectsActions.deleteSubject, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(SubjectsActions.deleteSubjectSuccess, (state, { id }) => ({
    ...state,
    subjects: state.subjects.filter((s) => s._id !== id),
    selectedSubject:
      state.selectedSubject?._id === id ? null : state.selectedSubject,
    loading: false,
    error: null,
  })),

  on(SubjectsActions.deleteSubjectFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  //* Clear Actions
  on(SubjectsActions.clearSubjects, (state) => ({
    ...state,
    subjects: [],
    error: null,
  })),

  on(SubjectsActions.clearSelectedSubject, (state) => ({
    ...state,
    selectedSubject: null,
  }))
);
