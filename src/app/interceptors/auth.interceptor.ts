import { HttpInterceptorFn } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  
  // Exclude auth endpoint from getting the token if needed
  if (req.url.includes('/api/auth/login')) {
    return next(req);
  }

  let token = null;
  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem('jwt_token');
  }

  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(clonedReq);
  }

  return next(req);
};
