import { HttpInterceptorFn } from '@angular/common/http';
import { StorageService } from '../services/storage/storage.service';
import { inject } from '@angular/core';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { LoadingService } from '../services/loading/loading.service';
import { finalize } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

const storageService = inject(StorageService);
const token = storageService.getToken();
const lodingService = inject(LoadingService);

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



  return next(authRequest).pipe(
    finalize(() => lodingService.hide())
  );
};
