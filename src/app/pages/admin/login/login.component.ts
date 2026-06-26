import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {
  username = '';
  password = '';
  
  // Reset password fields
  otp = '';
  newPassword = '';
  confirmPassword = '';
  
  error = '';
  success = '';
  isLoading = false;

  viewState: 'login' | 'forgot' | 'reset' = 'login';
  
  resendCountdown = 0;
  private timerInterval: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnDestroy() {
    this.clearTimer();
  }

  login(): void {
    this.isLoading = true;
    this.error = '';
    
    this.authService.login(this.username, this.password).subscribe(result => {
      this.isLoading = false;
      if (result === true) {
        this.router.navigate(['/admin']);
      } else if (typeof result === 'string') {
        this.error = result;
      } else {
        this.error = 'Invalid username or password';
      }
    });
  }

  showForgotPassword() {
    this.viewState = 'forgot';
    this.error = '';
    this.success = '';
  }

  showLogin() {
    this.viewState = 'login';
    this.error = '';
    this.success = '';
  }

  requestOtp(): void {
    if (!this.username) {
      this.error = 'Please enter your username or email.';
      return;
    }
    this.isLoading = true;
    this.error = '';
    this.success = '';
    
    this.authService.forgotPassword(this.username).subscribe(res => {
      this.isLoading = false;
      if (res && typeof res !== 'string') {
        this.success = 'OTP has been sent to your email. It will expire in 5 minutes.';
        this.viewState = 'reset';
        this.startResendTimer();
      } else if (typeof res === 'string') {
        this.error = res;
      } else {
        this.error = 'Failed to request OTP. Please try again.';
      }
    });
  }

  resetPassword(): void {
    if (!this.otp || !this.newPassword || !this.confirmPassword) {
      this.error = 'Please fill all fields.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }
    
    this.isLoading = true;
    this.error = '';
    this.success = '';
    
    this.authService.resetPassword(this.username, this.otp, this.newPassword).subscribe(res => {
      this.isLoading = false;
      if (res) {
        this.success = 'Password reset successfully! You can now log in.';
        this.viewState = 'login';
        this.clearTimer();
      } else {
        this.error = 'Invalid or expired OTP.';
      }
    });
  }

  startResendTimer() {
    this.clearTimer();
    this.resendCountdown = 120; // 2 minutes
    this.timerInterval = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        this.clearTimer();
      }
    }, 1000);
  }

  clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.resendCountdown = 0;
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }
}
