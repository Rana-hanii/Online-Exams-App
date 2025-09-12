import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { subjectsReducer } from './subjects/subjects.reducer';

export const appReducers: ActionReducerMap<AppState> = {
  subjects: subjectsReducer
};
