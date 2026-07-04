import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { StorageService } from '../services/storage/storage.service';
import { inject } from '@angular/core';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { LoadingService } from '../services/loading/loading.service';
import { catchError, finalize, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification/notification.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const token = storageService.getToken();
  const lodingService = inject(LoadingService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  const isLoginRequest = req.url.includes(API_ENDPOINTS.AUTH.LOGIN);

  lodingService.show();

  let authRequest = req;

  if (token || !isLoginRequest) {
    authRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // return next(authRequest).pipe(
  //   finalize(() => lodingService.hide())
  // );

  return next(authRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          storageService.clear();
          notificationService.error('Session expired. Please login again.');
          router.navigate(['/auth/login']);
          break;

        case 403:
          notificationService.error(
            'You are not authorized to access this page.',
          );
          router.navigate(['/access-denied']);
          break;

        case 404:
          notificationService.error('Page not found');
          // router.navigate(['/not-found']);
          break;

        case 500:
          notificationService.error('Something went wrong. Please try again.');
          // router.navigate(['/server-error']);
          break;

        case 0:
          notificationService.error('Network error. Please try again.');
          break;

        default:
          notificationService.error('Something went wrong. Please try again.');
      }

      return throwError(() => error);
    }),

    finalize(() => lodingService.hide()),
  );
};
