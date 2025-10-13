  import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/constant/api-endpoints';
import { ApiService } from '../../../core/services/api.service';
import { Subject } from '../../../shared/interfaces/subject.interface';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private apiService = inject(ApiService);


  //* Get all subjects
  getAllSubjects(): Observable<Subject[]> {
    return this.apiService.get<Subject[]>(API_ENDPOINTS.subjects.base);
  }
  //* Get subject by ID
  getSubjectById(id: string): Observable<Subject> {
    return this.apiService.get<Subject>(API_ENDPOINTS.subjects.byId(id));
  }

  //* Add new subject
  addSubject(subject: Omit<Subject, 'id'>): Observable<Subject> {
    return this.apiService.post<Subject>(API_ENDPOINTS.subjects.add, subject);
  }

  //* Update subject
  updateSubject(id: string, subject: Partial<Subject>): Observable<Subject> {
    return this.apiService.put<Subject>(API_ENDPOINTS.subjects.update(id), subject);
  }

  //* Delete subject
  deleteSubject(id: string): Observable<void> {
    return this.apiService.delete<void>(API_ENDPOINTS.subjects.delete(id));
  }
}


