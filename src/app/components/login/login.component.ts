import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  handleLogin(event: Event): void {
    event.preventDefault();
    
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (error) => {
        if (error.status === 401) {
          this.errorMessage = 'Incorrect username or password';
        } else {
          this.errorMessage = 'Login failed, please try again later';
        }
      }
    });
  }
}
