import {HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import {inject} from '@angular/core';
import {Observable, throwError, catchError, switchMap} from 'rxjs';
import {AuthService} from '../services/auth';
import {Router} from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const token: string | null = authService.getAccessToken();

  const authReq = token ? req.clone({
    setHeaders: {Authorization: `Bearer ${token}`}
  }) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si 401 → tente un refresh avant de déconnecter
      if (error.status === 401) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Refresh réussi → relance la requête avec le nouveau token
            const newToken = authService.getAccessToken();
            const retryReq = req.clone({
              setHeaders: {Authorization: `Bearer ${newToken}`}
            });
            return next(retryReq);
          }),
          catchError(() => {
            // Refresh échoué → déconnexion
            authService.logout();
            void router.navigate(['/login']);
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
