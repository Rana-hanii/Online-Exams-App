import { createReducer, on } from '@ngrx/store';
import { ExamState } from '../../shared/interfaces/exam.interface';
import * as ExamsActions from './exams.actions';

export const examsFeatureKey = 'exams';

export const initialState: ExamState = {
  exams: [],
  examHistory: [],
  loading: false,
  error: null,
  selectedExam: null,
  selectedHistoryExam: null,
  historyModalOpen: false,
};

export const examsReducer = createReducer(
  initialState,

  //* Load All Exams
  on(ExamsActions.loadExams, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ExamsActions.loadExamsSuccess, (state, { exams }) => ({
    ...state,
    exams,
    loading: false,
    error: null,
  })),

  on(ExamsActions.loadExamsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  //* Load Exam By ID
  on(ExamsActions.loadExamById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ExamsActions.loadExamByIdSuccess, (state, { exam }) => ({
    ...state,
    selectedExam: exam,
    loading: false,
    error: null,
  })),

  on(ExamsActions.loadExamByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  //******** Load Exams By Subject ID
  on(ExamsActions.loadExamsBySubject, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ExamsActions.loadExamsBySubjectSuccess, (state, { exams }) => ({
    ...state,
    exams,
    loading: false,
    error: null,
  })),

  on(ExamsActions.loadExamsBySubjectFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  //^ For Admin Dashboard
  //* Add Exam
  on(ExamsActions.addExam, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ExamsActions.addExamSuccess, (state, { exam }) => ({
    ...state,
    exams: [...state.exams, exam],
    loading: false,
    error: null,
  })),

  on(ExamsActions.addExamFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

 

  //* Clear Actions
  on(ExamsActions.clearExams, (state) => ({
    ...state,
    exams: [],
    error: null,
  })),

  on(ExamsActions.clearSelectedExam, (state) => ({
    ...state,
    selectedExam: null,
  })),

  //* Load Exam History
  on(ExamsActions.loadExamHistory, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ExamsActions.loadExamHistorySuccess, (state, { history }) => ({
    ...state,
    examHistory: history,
    loading: false,
    error: null,
  })),

  on(ExamsActions.loadExamHistoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  //* Save Exam Result
  on(ExamsActions.saveExamResult, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ExamsActions.saveExamResultSuccess, (state, { examResult }) => ({
    ...state,
    examHistory: [examResult, ...state.examHistory],
    loading: false,
    error: null,
  })),

  //* History Modal
  on(ExamsActions.openHistoryModal, (state, { examHistory }) => ({
    ...state,
    selectedHistoryExam: examHistory,
    historyModalOpen: true,
  })),

  on(ExamsActions.closeHistoryModal, (state) => ({
    ...state,
    selectedHistoryExam: null,
    historyModalOpen: false,
  }))
);
