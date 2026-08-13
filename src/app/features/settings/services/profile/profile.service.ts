import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../../model/user-profile.model';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private readonly apiUrl =
    'http://localhost:3000/users';

  constructor(
    private http: HttpClient
  ) {}

  getUserProfile(
    userId: number
  ): Observable<UserProfile> {

    return this.http.get<UserProfile>(
      `${this.apiUrl}/${userId}`
    );

  }

  updateUserProfile(
    userId: number,
    profile: Partial<UserProfile>
  ): Observable<UserProfile> {

    return this.http.patch<UserProfile>(
      `${this.apiUrl}/${userId}`,
      profile
    );

  }

}