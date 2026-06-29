import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';
import { LoginRequest } from '../../../shared/models/login-request.model';
import { map, Observable } from 'rxjs';
import { User } from '../../../shared/models/user.model';
import { environment } from '../../../../environment/environment';
import { API_ENDPOINTS } from '../../constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.API_URL}${API_ENDPOINTS.USERS}`;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {}

  login(request: LoginRequest): Observable<boolean | null> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${request.email}`).pipe(
      map((users) => {
        console.log(users,'users');
        
        
        if (users.length > 0 && users[0].password === request.password) {
          this.storageService.saveToken(users[0].token);
          this.storageService.saveUser(users[0]);
          return true;
        } else if (users.length === 0) {
          return false;
        }
        return false;
      }),
    );
  }

  logout() {
    this.storageService.clear();
  }

  isLoggedIn(): boolean {
    return !!this.storageService.getToken();
  }

  getCurrentUser(): User | null {
    return this.storageService.getUser();
  }
}
