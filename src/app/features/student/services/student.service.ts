import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  _httpClient=inject(HttpClient)

  // *get all subject (diplomas)
  
  // *get all exams on subject by sub ID

  // *get all questions on exam by exam ID


}
