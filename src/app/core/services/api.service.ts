import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  // مثال على استخدام الـ environment
  getApiInfo() {
    return {
      baseUrl: this.baseUrl,
      appName: environment.appName,
      version: environment.version,
      isProduction: environment.production
    };
  }

  get(endpoint: string) {
    return this.http.get(`${this.baseUrl}${endpoint}`);
  }

  post(endpoint: string, data: any) {
    return this.http.post(`${this.baseUrl}${endpoint}`, data);
  }

  put(endpoint: string, data: any) {
    return this.http.put(`${this.baseUrl}${endpoint}`, data);
  }

  delete(endpoint: string) {
    return this.http.delete(`${this.baseUrl}${endpoint}`);
  }
}
