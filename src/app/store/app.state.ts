import { ExamState } from '../shared/interfaces/exam.interface';
import { QuestionState } from '../shared/interfaces/question.interface';
import { SubjectState } from '../shared/interfaces/subject.interface';

export interface AppState {
  // * subjects state
  subjects: SubjectState;
  // * exams state
  exams: ExamState;
  // * questions state
  questions: QuestionState;
}

// export const appState: AppState = {
//   subjects: {
//     subjects: [],
//     loading: false,
//     error: null,
//     selectedSubject: null
//   },
//   exams: {
//     exams: [],
//     loading: false,
//     error: null,
//     selectedExam: null
//   },
//   questions: {
//     questions: [],
//     userAnswers: [],
//     loading: false,
//     error: null,
//     currentQuestionIndex: 0,
//     examScore: 0,
//     showResults: false
//   }
// };
