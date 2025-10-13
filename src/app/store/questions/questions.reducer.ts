import { createReducer, on } from '@ngrx/store';
import { QuestionState } from '../../shared/interfaces/question.interface';
import * as QuestionsActions from './questions.actions';




export const questionsFeatureKey = 'questions';

export const initialState: QuestionState = {
  questions: [],
  userAnswers: [],
  loading: false,
  error: null,
  currentQuestionIndex: 0,
  examScore: 0,
  showResults: false,
  questionModalOpen: false,
  selectedExamId: null,
  historyModalOpen: false
};





export const questionsReducer = createReducer(
  initialState,

  //^ Modal
  //* question modal
  on(QuestionsActions.openQuestionModal, (state, { examId }) => ({
    ...state,
    questionModalOpen: true,
    selectedExamId: examId,
  // reset previous exam progress/results when opening a new exam
  result: undefined,
    showResults: false,
    currentQuestionIndex: 0,
    userAnswers: [],
    examScore: 0,
  })),
  on(QuestionsActions.closeQuestionModal, state => ({
    ...state,
    questionModalOpen: false,
    selectedExamId: null,
  // clear transient exam state on close
  result: undefined,
    showResults: false,
    currentQuestionIndex: 0,
    userAnswers: [],
    examScore: 0,
  })),

  //* history modal
  on(QuestionsActions.openHistoryModal, (state, { examId }) => ({
    ...state,
    historyModalOpen: true,
    selectedExamId: examId
  })),
  on(QuestionsActions.closeHistoryModal, state => ({
    ...state,
    historyModalOpen: false,
    selectedExamId: null
  })),

  //^ Load all
  on(QuestionsActions.loadQuestions, (state) => ({ ...state, loading: true })),
  on(QuestionsActions.loadQuestionsSuccess, (state, { questions }) => ({
    ...state,
    loading: false,
    questions,
  })),
  on(QuestionsActions.loadQuestionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  //^ Load by exam
  on(QuestionsActions.loadQuestionsByExam, (state) => ({
    ...state,
    loading: true,
  })),
  on(QuestionsActions.loadQuestionsByExamSuccess, (state, { questions }) => ({
    ...state,
    loading: false,
    questions,
  // reset progress/results when questions for a new exam arrive
  result: undefined,
    showResults: false,
    currentQuestionIndex: 0,
    userAnswers: [],
    examScore: 0,
  })),
  on(QuestionsActions.loadQuestionsByExamFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  //^ Load by ID
  on(QuestionsActions.loadQuestionById, (state) => ({
    ...state,
    loading: true,
  })),
  on(QuestionsActions.loadQuestionByIdSuccess, (state, { question }) => ({
    ...state,
    loading: false,
    selectedQuestion: question,
  })),
  on(QuestionsActions.loadQuestionByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  //^ Check answers
  on(QuestionsActions.checkQuestions, (state) => ({ ...state, loading: true })),
  on(QuestionsActions.checkQuestionsSuccess, (state, { result }) => ({
    ...state,
    loading: false,
    result,
    showResults: true
  })),
  on(QuestionsActions.checkQuestionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  //^ Load history
  on(QuestionsActions.loadQuestionsHistory, (state) => ({
    ...state,
    loading: true,
  })),
  on(QuestionsActions.loadQuestionsHistorySuccess, (state, { questions }) => ({
    ...state,
    loading: false,
    history: questions,
  })),
  on(QuestionsActions.loadQuestionsHistoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  //^ Add
  on(QuestionsActions.addQuestion, (state) => ({ ...state, loading: true })),
  on(QuestionsActions.addQuestionSuccess, (state, { question }) => ({
    ...state,
    loading: false,
    questions: [...state.questions, question],
  })),
  on(QuestionsActions.addQuestionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
