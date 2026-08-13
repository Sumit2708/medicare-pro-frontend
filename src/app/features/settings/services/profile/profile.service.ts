import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environment/environment';
import { API_ENDPOINTS } from '../../../../core/constants/api-endpoints';
import { User } from '../../../../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly apiUrl = `${environment.API_URL}${API_ENDPOINTS.USERS}`;

  constructor(private http: HttpClient) {}

  getProfile(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  updateProfile(userId: number, data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}`, data);
  }
}
