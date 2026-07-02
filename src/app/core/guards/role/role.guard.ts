import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state,
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();

  const allowedRoles = route.data['roles'];

  if (!user) {
    return router.createUrlTree(['/login']);
  }

  if (allowedRoles.includes(user.role)) {
    console.log('access-granted');

    return true;
  }
  console.log('access-denied');

  return router.createUrlTree(['/access-denied']);
};
