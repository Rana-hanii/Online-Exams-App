import { environment } from '../../environments/environments';

const BASE_URL = environment.apiBaseUrl;

export const API_ENDPOINTS = {

  subjects: {
    base: `${BASE_URL}/subjects`, //* get all subjects
    byId: (id: string) => `${BASE_URL}/subjects/${id}`, //* get subject by id
    delete: (id: string) => `${BASE_URL}/subjects/${id}`, //* delete subject by id
    update: (id: string) => `${BASE_URL}/subjects/${id}`, //* update subject by id
    add: `${BASE_URL}/subjects`, //* add new subject
  },

  exams: {
    base: `${BASE_URL}/exams`, //* get all exams
    byId: (id: string) => `${BASE_URL}/exams/${id}`, //* get exam by id
    onSubject: (subjectId: string) => `${BASE_URL}/exams?subject=${subjectId}`, //* get all exams on subject by sub ID
    add:`${BASE_URL}/exams`,  //* add new exam
  },

  questions: {
    base: `${BASE_URL}/questions`, //* get all questions
    byId: (id: string) => `${BASE_URL}/questions/${id}`, //* get question by id , get single question
    onExam: (examId: string) => `${BASE_URL}/questions?exam=${examId}`, //* get questions by exam id
    history:`${BASE_URL}/questions/history`, //* get questions history by user id
    check: `${BASE_URL}/questions/check`, //* check questions 
    add:`${BASE_URL}/questions`, //* add new question
  },
};
