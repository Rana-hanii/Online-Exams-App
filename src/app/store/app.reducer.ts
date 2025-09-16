import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { examsReducer } from './exams/exams.reducer';
import { questionsReducer } from './questions/questions.reducer';
import { subjectsReducer } from './subjects/subjects.reducer';

export const appReducers: ActionReducerMap<AppState> = {
  subjects: subjectsReducer,
  exams: examsReducer,
  questions: questionsReducer
};
