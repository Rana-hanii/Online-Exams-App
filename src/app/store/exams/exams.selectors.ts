import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ExamState } from '../../shared/interfaces/exam.interface';
import { examsFeatureKey } from './exams.reducer';

//* Feature Selector
export const selectExamsState = createFeatureSelector<ExamState>(examsFeatureKey);

//* Basic Selectors
export const selectAllExams = createSelector(
  selectExamsState,
  (state: ExamState) => state.exams
);

export const selectExamsLoading = createSelector(
  selectExamsState,
  (state: ExamState) => state.loading
);

export const selectExamsError = createSelector(
  selectExamsState,
  (state: ExamState) => state.error
);

export const selectSelectedExam = createSelector(
  selectExamsState,
  (state: ExamState) => state.selectedExam
);

//* Computed Selectors
export const selectExamsCount = createSelector(
  selectAllExams,
  (exams) => exams.length
);

export const selectExamById = (id: string) => createSelector(
  selectAllExams,
  (exams) => exams.find(exam => exam._id === id)
);

export const selectExamsBySubject = (subjectId: string) => createSelector(
  selectAllExams,
  (exams) => exams.filter(exam => exam.subject === subjectId)
);

export const selectActiveExams = createSelector(
  selectAllExams,
  (exams) => exams.filter(exam => exam.active)
);

export const selectExamsByTitle = (title: string) => createSelector(
  selectAllExams,
  (exams) => exams.filter(exam => 
    exam.title.toLowerCase().includes(title.toLowerCase())
  )
);

//* Loading States
export const selectIsLoadingExams = createSelector(
  selectExamsLoading,
  (loading) => loading
);

export const selectHasExamsError = createSelector(
  selectExamsError,
  (error) => !!error
);

//* Exam History Selectors
export const selectExamHistory = createSelector(
  selectExamsState,
  (state: ExamState) => state.examHistory
);

export const selectSelectedHistoryExam = createSelector(
  selectExamsState,
  (state: ExamState) => state.selectedHistoryExam
);

export const selectHistoryModalOpen = createSelector(
  selectExamsState,
  (state: ExamState) => state.historyModalOpen
);

export const selectExamHistoryCount = createSelector(
  selectExamHistory,
  (history) => history.length
);

export const selectHistoryExamById = (id: string) => createSelector(
  selectExamHistory,
  (history) => history.find(exam => exam._id === id)
);

export const selectRecentExamHistory = (limit: number = 10) => createSelector(
  selectExamHistory,
  (history) => history.slice(0, limit)
);


