import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/constant/api-endpoints';
import { ApiService } from '../../../core/services/api.service';
import { Exam } from '../../../shared/interfaces/exam.interface';

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



}
