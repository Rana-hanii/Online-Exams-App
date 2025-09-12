import { SubjectState } from '../shared/interfaces/subject.interface';

export interface AppState {
    // * subjects state
  subjects: SubjectState;
}

export const appState: AppState = {
  subjects: {
    subjects: [],
    loading: false,
    error: null,
    selectedSubject: null
  }
};
