import { ExamState } from '../shared/interfaces/exam.interface';
import { SubjectState } from '../shared/interfaces/subject.interface';

export interface AppState {
  // * subjects state
  subjects: SubjectState;
  // * exams state
  exams: ExamState;
}

export const appState: AppState = {
  subjects: {
    subjects: [],
    loading: false,
    error: null,
    selectedSubject: null
  },
  exams: {
    exams: [],
    loading: false,
    error: null,
    selectedExam: null
  }
};
