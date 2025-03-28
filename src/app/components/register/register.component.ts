import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  handleRegister(event: Event): void {
    event.preventDefault();

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'The passwords do not match';
      return;
    }

    this.authService.register(this.username, this.password).subscribe({
      next: () => {
        alert('Registration successful! Please log in');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        if (error.status === 409) {
          this.errorMessage = 'Username already exists';
        } else {
          this.errorMessage = 'Registration failed, please try again later';
        }
      }
    });
  }
}
