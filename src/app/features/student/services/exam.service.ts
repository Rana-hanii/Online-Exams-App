import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/constant/api-endpoints';
import { ApiService } from '../../../core/services/api.service';
import { Exam, ExamHistoryResponse, ExamHistoryItem } from '../../../shared/interfaces/exam.interface';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiService = inject(ApiService);

  //* Get all exams
  getAllExams(): Observable<Exam[]> {
    return this.apiService.get<Exam[]>(API_ENDPOINTS.exams.base);
  }

  //* Get exam by ID
  getExamById(id: string): Observable<Exam> {
    return this.apiService.get<Exam>(API_ENDPOINTS.exams.byId(id));
  }

  //* Get exams by subject
  getExamsBySubject(subjectId: string): Observable<Exam[]> {
    return this.apiService.get<Exam[]>(API_ENDPOINTS.exams.onSubject(subjectId));
  }

  //* Add new exam
  addExam(exam: Omit<Exam, '_id'>): Observable<Exam> {
    return this.apiService.post<Exam>(API_ENDPOINTS.exams.add, exam);
  }

  //* Get exam history from API
  getExamHistory(): Observable<ExamHistoryResponse> {
    return this.apiService.get<ExamHistoryResponse>(API_ENDPOINTS.exams.history);
  }

  //* Save exam result to local storage
  saveExamResultToLocalStorage(examResult: ExamHistoryItem): void {
    try {
      const existingHistory = this.getExamHistoryFromLocalStorage();
      const updatedHistory = [examResult, ...existingHistory];
      localStorage.setItem('examHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving exam result to local storage:', error);
    }
  }

  //* Get exam history from local storage
  getExamHistoryFromLocalStorage(): ExamHistoryItem[] {
    try {
      const historyJson = localStorage.getItem('examHistory');
      if (historyJson) {
        return JSON.parse(historyJson);
      }
      return [];
    } catch (error) {
      console.error('Error getting exam history from local storage:', error);
      return [];
    }
  }

  //* Get exam history as observable (from local storage)
  getExamHistoryObservable(): Observable<ExamHistoryItem[]> {
    return of(this.getExamHistoryFromLocalStorage());
  }

  //* Clear exam history from local storage
  clearExamHistory(): void {
    try {
      localStorage.removeItem('examHistory');
    } catch (error) {
      console.error('Error clearing exam history:', error);
    }
  }

  //* Get specific exam result by ID from local storage
  getExamResultById(examResultId: string): ExamHistoryItem | null {
    try {
      const history = this.getExamHistoryFromLocalStorage();
      return history.find(exam => exam._id === examResultId) || null;
    } catch (error) {
      console.error('Error getting exam result by ID:', error);
      return null;
    }
  }
}
