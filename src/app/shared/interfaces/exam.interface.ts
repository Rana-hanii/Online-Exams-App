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

export interface ExamState {
  exams: Exam[];
  loading: boolean;
  error: string | null;
  selectedExam: Exam | null;
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
