import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from '../../../shared/models/user.model';
import { environment } from '../../../../environment/environment';
import { API_ENDPOINTS } from '../../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.API_URL}${API_ENDPOINTS.USERS}`;

  constructor(private http: HttpClient) {}

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`).pipe(
      map((users) => users.length > 0)
    );
  }

  getUserByEmail(email: string): Observable<User | null> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`).pipe(
      map((users) => users[0] ?? null)
    );
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: string | number, user: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, user);
  }
}