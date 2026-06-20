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

  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.isLoading = true;
    this.error = '';
    
    this.authService.login(this.username, this.password).subscribe(success => {
      this.isLoading = false;
      // Note: catchError in service returns false on error, or tap doesn't map to boolean properly
      // Actually wait, let's just check if it's truthy
      if (success) {
        this.router.navigate(['/admin']);
      } else {
        this.error = 'Invalid username or password';
      }
    });
  }

  resetPassword(): void {
    alert('Password reset link sent to admin email (mock).');
  }
}
