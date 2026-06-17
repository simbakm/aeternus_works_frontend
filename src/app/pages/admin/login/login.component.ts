import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (this.username === 'admin' && this.authService.login(this.password)) {
      this.router.navigate(['/admin']);
    } else {
      this.error = 'Invalid username or password';
    }
  }

  resetPassword(): void {
    alert('Password reset link sent to admin email (mock).');
  }
}
