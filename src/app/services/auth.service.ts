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

  login(username: string, password: string): Observable<boolean | string> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      map(response => {
        if (response && response.token) {
          this.isLoggedIn = true;
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('jwt_token', response.token);
            localStorage.setItem('admin_logged_in', 'true');
            localStorage.setItem('admin_username', response.username);
            localStorage.setItem('admin_role', response.role);
          }
          return true;
        }
        return false;
      }),
      catchError(err => {
        console.error('Login failed', err);
        if (err.error && err.error.error) {
          return of(err.error.error);
        }
        return of(false);
      })
    );
  }

  logout(): void {
    this.isLoggedIn = false;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('admin_logged_in');
      localStorage.removeItem('admin_username');
      localStorage.removeItem('admin_role');
    }
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  getUsername(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('admin_username') || 'Admin';
    }
    return 'Admin';
  }

  getRole(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('admin_role') || '';
    }
    return '';
  }

  isSuperAdmin(): boolean {
    return this.getRole() === 'SUPER_ADMIN';
  }

  forgotPassword(username: string): Observable<{message: string} | string | null> {
    return this.http.post<{message: string}>(`${this.apiUrl}/forgot-password`, { username }).pipe(
      catchError(err => {
        console.error('Forgot password request failed', err);
        if (err.error && err.error.error) {
          return of(err.error.error);
        }
        return of(null);
      })
    );
  }

  resetPassword(username: string, otp: string, newPassword: string): Observable<{message: string} | null> {
    return this.http.post<{message: string}>(`${this.apiUrl}/reset-password`, { username, otp, newPassword }).pipe(
      catchError(err => {
        console.error('Reset password request failed', err);
        return of(null);
      })
    );
  }
}
