import { createFeatureSelector, createSelector } from '@ngrx/store';
import { QuestionState } from '../../shared/interfaces/question.interface';

export const selectQuestionsState =
  createFeatureSelector<QuestionState>('questions');
//^ Modal
export const selectQuestionModalOpen = createSelector(
  selectQuestionsState,
  (state) => state.questionModalOpen
);

export const selectSelectedExamId = createSelector(
  selectQuestionsState,
  (state) => state.selectedExamId
);

export const selectHistoryModalOpen = createSelector(
  selectQuestionsState,
  (state) => state.historyModalOpen
);

//^ Questions
export const selectAllQuestions = createSelector(
  selectQuestionsState,
  (state) => state.questions
);

export const selectSelectedQuestion = createSelector(
  selectQuestionsState,
  (state) => state.currentQuestionIndex
);

export const selectQuestionsLoading = createSelector(
  selectQuestionsState,
  (state) => state.loading
);

export const selectQuestionsError = createSelector(
  selectQuestionsState,
  (state) => state.error
);

export const selectCheckResult = createSelector(
  selectQuestionsState,
  (state) => state.showResults
);
export const selectQuestionsHistory = createSelector(
  selectQuestionsState,
  (state) => state.history
);

export const selectScorePercent = createSelector(
  selectQuestionsState,
  (state) => {
    const result = state.result;
    if (!result) return 0;
    const correct = Number(result.correct || 0);
    const wrong = Number(result.wrong || 0);
    const total = correct + wrong;
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  }
);

export const selectCorrectCount = createSelector(
  selectQuestionsState,
  (state) => {
    const result = state.result;
    return Number(result?.correct || 0);
  }
);

export const selectIncorrectCount = createSelector(
  selectQuestionsState,
  (state) => {
    const result = state.result;
    return Number(result?.wrong || 0);
  }
);
