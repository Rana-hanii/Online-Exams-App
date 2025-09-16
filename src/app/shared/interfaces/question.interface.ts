import { Exam } from './exam.interface';
import { Subject } from './subject.interface';

export interface ExamQuestions {
  message: string;
  questions: Question[];
}

export interface Question {
  answers: Answer[];
  type: string;
  _id: string;
  question: string;
  correct: string;
  subject: Subject | null;
  exam: Exam;
  createdAt: string;
}

export interface Answer {
  answer: string;
  key: string;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  answeredAt?: string;
}

export interface QuestionState {
  questions: Question[];
  userAnswers: UserAnswer[];
  loading: boolean;
  error: string | null;
  currentQuestionIndex: number;
  examScore: number;
  showResults: boolean;
  history?: QuestionHistoryResponse;

  questionModalOpen: boolean;
  selectedExamId: string | null;
  historyModalOpen: boolean;
}

export interface Metadata {
  total: number;
  page: number;
  limit: number;
}

// * check questions
// ^ check questions API request
export interface CheckQuestionsRequest {
  answers: CheckQuestionRequest[];
  time: number;
}

export interface CheckQuestionRequest {
  questionId: string;
  correct: string;
}

export interface CheckQuestionsResponse {
  message: string;
  correct: number;
  wrong: number;
  total: string;
  WrongQuestions: WrongQuestion[];
  correctQuestions: CorrectQuestion[];
}

interface CorrectQuestion {
  QID: string;
  Question: string;
  correctAnswer: string;
  answers: Answer[];
}

interface WrongQuestion {
  QID: string;
  Question: string;
  inCorrectAnswer: string;
  correctAnswer: string;
  answers: Answer[];
}

// * Question History (get questions history API response)
export interface QuestionHistoryResponse {
  message: string;
  history: History;
}

export interface History {
  _id: string;
  checkAnswer: string;
  QID: QID;
  user: string;
  chosenAnswer: string;
  avgAnswerTime: string;
  createdAt: string;
}

export interface QID {
  answers: Answer[];
  type: string;
  _id: string;
  question: string;
  correct: string;
  subject: string;
  exam: string;
  createdAt: string;
}
