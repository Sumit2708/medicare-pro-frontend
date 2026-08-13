import { Injectable } from '@angular/core';
import { STORAGE_KEYS } from '../../constants/storage-keys';
import { User } from '../../../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  saveToken(token: string) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  saveUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  getUser<T>(): T | null {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  }

  clear() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
}
