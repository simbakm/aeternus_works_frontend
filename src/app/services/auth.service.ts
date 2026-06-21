import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { API_URL } from '../config/api.config';

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private apiUrl = `${API_URL}/auth`;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = !!localStorage.getItem('jwt_token');
    }
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      map(response => {
        if (response && response.token) {
          this.isLoggedIn = true;
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('jwt_token', response.token);
            localStorage.setItem('admin_logged_in', 'true');
          }
          return true;
        }
        return false;
      }),
      catchError(err => {
        console.error('Login failed', err);
        return of(false);
      })
    );
  }

  logout(): void {
    this.isLoggedIn = false;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('admin_logged_in');
    }
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
