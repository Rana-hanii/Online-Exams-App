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


export interface ExamHistory {
  examId: string;
  title: string;
  subject: string;
  scorePercent: number;
  correctCount: number;
  incorrectCount: number;
  total: number;
  date: string;
  answers: any[];
}