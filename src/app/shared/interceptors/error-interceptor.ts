import {HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import {inject} from '@angular/core';
import {Observable, throwError, catchError} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (
 req: HttpRequest<unknown>,
 next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {

  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
   catchError((error: HttpErrorResponse) => {

     // le authinterceptor s'occupe de la 401
     if (error.status === 401) {
       return throwError(() => error);
     }

     const message = getErrorMessage(error);

     snackBar.open(message, 'Fermer', {
       duration: 5000,
       panelClass: ['snackbar-error'],
       horizontalPosition: 'end',
       verticalPosition: 'bottom'
     });

     return throwError(() => error);
   })
  );
};

function getErrorMessage(error: HttpErrorResponse): string {
  switch (error.status) {
    case 400:
      return error.error?.message ?? 'Requête invalide.';
    case 403:
      return 'Accès refusé.';
    case 404:
      return error.error?.message ?? 'Ressource introuvable.';
    case 429:
      return 'Trop de tentatives. Réessayez dans quelques minutes.';
    case 500:
      return 'Erreur serveur. Veuillez réessayer plus tard.';
    default:
      return 'Une erreur inattendue est survenue.';
  }
}