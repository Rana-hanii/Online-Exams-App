import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/constant/api-endpoints';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class EditProfileService {
  private apiService = inject(ApiService);

  //* Get all user profile data
  getAllUserProfileData(): Observable<any> {
    return this.apiService.get<any>(API_ENDPOINTS.user.profileData);
  }

  //* Update user profile
  updateUserProfile(data: any): Observable<any> {
    return this.apiService.put<any>(API_ENDPOINTS.user.updateProfile, data);
  }
  //* Change user password
  changeUserPassword(data: any): Observable<any> {
    return this.apiService.patch<any>(API_ENDPOINTS.user.changePassword, data);
  }
}
