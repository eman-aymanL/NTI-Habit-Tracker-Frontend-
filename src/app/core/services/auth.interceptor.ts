import { HttpEvent, HttpHandlerFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth';

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  const auth = inject(AuthService);
  const token = auth.getToken();
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && auth.isLoggedIn()) {
        // Only logout if user has an active session and the request is not an auth endpoint
        const isAuthEndpoint = /\/(login|register|verify-email|forgot-password|reset-password|resend-verification)/.test(req.url);
        if (!isAuthEndpoint) {
          auth.logout();
        }
      }
      return throwError(() => error);
    })
  );
}
