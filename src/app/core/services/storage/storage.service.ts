import { Injectable } from '@angular/core';
import { STORAGE_KEYS } from '../../constants/storage-keys';
import { User } from '../../../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  saveToken(token: string, rememberMe = true) {
    this.setItem(STORAGE_KEYS.TOKEN, token, rememberMe);
  }

  getToken(): string | null {
    return (
      localStorage.getItem(STORAGE_KEYS.TOKEN) ??
      sessionStorage.getItem(STORAGE_KEYS.TOKEN)
    );
  }

  saveUser(user: User, rememberMe = true): void {
    this.setItem(STORAGE_KEYS.USER, JSON.stringify(user), rememberMe);
  }

  getUser<T>(): T | null {
    const user =
      localStorage.getItem(STORAGE_KEYS.USER) ??
      sessionStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  }

  clear() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER);
  }

  saveRememberedEmail(email: string): void {
    localStorage.setItem(STORAGE_KEYS.REMEMBERED_EMAIL, email);
  }

  getRememberedEmail(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REMEMBERED_EMAIL);
  }

  clearRememberedEmail(): void {
    localStorage.removeItem(STORAGE_KEYS.REMEMBERED_EMAIL);
  }

  private setItem(key: string, value: string, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem(key, value);
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, value);
      localStorage.removeItem(key);
    }
  }
}
