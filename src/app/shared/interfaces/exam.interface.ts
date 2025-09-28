export interface Exams  {
  message: string;
  metadata: Metadata;
  exams: Exam[];
}
export interface Exam {
  _id: string;
  title: string;
  duration: number;
  subject: string;
  numberOfQuestions: number;
  active: boolean;
  createdAt: string;
}

// * Exam History Interfaces
export interface ExamHistoryResponse {
  message: string;
  history: ExamHistoryItem[];
}

export interface ExamHistoryItem {
  _id: string;
  exam: ExamHistoryExam;
  user: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  completedAt: string;
  questions?: ExamHistoryQuestion[];
}

export interface ExamHistoryExam {
  _id: string;
  title: string;
  duration: number;
  subject: string;
  numberOfQuestions: number;
}

export interface ExamHistoryQuestion {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  answers: Array<{ key: string; answer: string; }>;
}

export interface ExamState {
  exams: Exam[];
  examHistory: ExamHistoryItem[];
  loading: boolean;
  error: string | null;
  selectedExam: Exam | null;
  selectedHistoryExam: ExamHistoryItem | null;
  historyModalOpen: boolean;
}

interface Metadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
}

// Exam History interfaces
export interface ExamHistoryItem {
  _id: string;
  examId: string;
  examTitle: string;
  subjectName: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
  timeSpent: number; // in seconds
  completedAt: string;
  questions: ExamHistoryQuestion[];
}

export interface ExamHistoryQuestion {
  questionId: string;
  question: string;
  answers: ExamHistoryAnswer[];
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
}

export interface ExamHistoryAnswer {
  key: string;
  answer: string;
}

export interface ExamHistory {
  exams: ExamHistoryItem[];
}
