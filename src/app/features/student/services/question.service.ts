import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { API_ENDPOINTS } from '../../../core/constant/api-endpoints';
import { ApiService } from '../../../core/services/api.service';
import {
  CheckQuestionsRequest,
  CheckQuestionsResponse,
  Question,
  QuestionHistoryResponse
} from '../../../shared/interfaces/question.interface';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private apiService = inject(ApiService);

  //* Get all questions
  getAllQuestions(): Observable<Question[]> {
    return this.apiService.get<Question[]>(API_ENDPOINTS.questions.base);
  }

  //* Get questions by exam
  getQuestionsByExam(examId: string): Observable<Question[]> {
    return this.apiService
      .get<{ message: string; questions: Question[] }>(
        API_ENDPOINTS.questions.byExam(examId)
      )
      .pipe(
        map(res => res.questions ?? [])
      );
  }

  //* Get question by ID
  getQuestionById(questionId: string): Observable<Question> {
    return this.apiService.get<Question>(
      API_ENDPOINTS.questions.byId(questionId)
    );
  }

  //* Check questions
  checkQuestions(userAnswers: CheckQuestionsRequest): Observable<CheckQuestionsResponse> {
    return this.apiService.post<CheckQuestionsResponse>(
      API_ENDPOINTS.questions.check,
      userAnswers
    );
  }

  //* Get questions history
  getQuestionsHistory(): Observable<QuestionHistoryResponse> {
    return this.apiService.get<QuestionHistoryResponse>(
      API_ENDPOINTS.questions.history
    );
  }

  //* Add new question
  addQuestion(question: Partial<Question>): Observable<Question> {
    return this.apiService.post<Question>(
      API_ENDPOINTS.questions.add,
      question
    );
  }


}
