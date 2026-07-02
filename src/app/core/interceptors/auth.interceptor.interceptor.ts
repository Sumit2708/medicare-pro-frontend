import { HttpInterceptorFn } from '@angular/common/http';
import { StorageService } from '../services/storage/storage.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

const storageService = inject(StorageService);
const token = storageService.getToken();

if (!token) {
  return next(req);
}

const clonedRequest = req.clone({
  setHeaders: {
    Authorization: `Bearer ${token}`,
  },
});

  return next(clonedRequest);
};
