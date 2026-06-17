import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
    }
  }

  login(password: string): boolean {
    // Mock login logic. In a real app, this would be an API call.
    if (password === 'admin123') {
      this.isLoggedIn = true;
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('admin_logged_in', 'true');
      }
      return true;
    }
    return false;
  }

  logout(): void {
    this.isLoggedIn = false;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('admin_logged_in');
    }
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
