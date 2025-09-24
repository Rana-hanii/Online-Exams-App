import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SubjectState } from '../../shared/interfaces/subject.interface';
import { subjectsFeatureKey } from './subjects.reducer';

//* Feature Selector
export const selectSubjectsState = createFeatureSelector<SubjectState>(subjectsFeatureKey);

//* Basic Selectors
export const selectAllSubjects = createSelector(
  selectSubjectsState,
  (state: SubjectState) => state.subjects
);

export const selectSubjectsLoading = createSelector(
  selectSubjectsState,
  (state: SubjectState) => state.loading
);

export const selectSubjectsError = createSelector(
  selectSubjectsState,
  (state: SubjectState) => state.error
);

export const selectSelectedSubject = createSelector(
  selectSubjectsState,
  (state: SubjectState) => state.selectedSubject
);

//* Computed Selectors
export const selectSubjectsCount = createSelector(
  selectAllSubjects,
  (subjects) => subjects.length
);

export const selectSubjectById = (id: string) => createSelector(
  selectAllSubjects,
  (subjects) => subjects.find(subject => subject._id === id)
);

//* for search
export const selectSubjectsByName = (name: string) => createSelector(
  selectAllSubjects,
  (subjects) => subjects.filter(subject => 
    subject.name.toLowerCase().includes(name.toLowerCase())
  )
);

//* Loading States
export const selectIsLoadingSubjects = createSelector(
  selectSubjectsLoading,
  (loading) => loading
);

export const selectHasSubjectsError = createSelector(
  selectSubjectsError,
  (error) => !!error
);

